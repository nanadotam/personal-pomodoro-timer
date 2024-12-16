class PomodoroTimer {
    constructor() {
        // Initialize DOM elements
        this.elements = {
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            workTitle: document.getElementById('Work'),
            breakTitle: document.getElementById('Break'),
            startBtn: document.getElementById('start'),
            pauseBtn: document.getElementById('pause'),
            resetBtn: document.getElementById('reset'),
            workTimeInput: document.getElementById('work-time'),
            breakTimeInput: document.getElementById('break-time'),
            timeSettings: document.querySelector('.time-settings'),
            beep: document.getElementById('beep'),
            sessionTransition: document.querySelector('.session-transition'),
            tomatoContainer: document.getElementById('tomato-container'),
            statsBtn: document.getElementById('stats-btn'),
            statsModal: document.getElementById('stats-modal'),
            closeModal: document.querySelector('.close-modal'),
            weeklyChart: document.getElementById('weekly-chart')
        };

        // Timer state
        this.state = {
            isRunning: false,
            isPaused: false,
            isBreak: false,
            currentSession: 1,
            startTime: null,
            endTime: null,
            remainingTime: 0,
            animationFrame: null
        };

        // Initialize StatsHandler first
        this.statsHandler = new StatisticsHandler();
        
        // Remove these lines as they're now handled by StatsHandler
        // this.stats = this.loadStats();
        // this.initializeStats();
        
        // Initialize other features
        this.settings = this.loadSettings();
        this.settings.autoSwitchSessions = true; // Force auto-switch to be enabled
        this.initializeDisplay();
        this.setupEventListeners();
        this.initializeSessionIndicators();
        this.setupAudio();
        this.setupStatsEventListeners();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            workDuration: 25,
            shortBreak: 5,
            longBreak: 15,
            sessionsBeforeLongBreak: 4,
            soundEnabled: true,
            autoSwitchSessions: true, // Default to true
            autoStartBreaks: true,    // Default to true
            autoStartPomodoros: true  // Default to true
        };
    }

    saveSettings() {
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
    }

    initializeDisplay() {
        this.elements.workTimeInput.value = this.settings.workDuration;
        this.elements.breakTimeInput.value = this.settings.shortBreak;
        this.updateTimeDisplay(this.settings.workDuration * 60 * 1000);
    }

    updateTimeDisplay(timeInMs) {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = Math.floor((timeInMs % 60000) / 1000);
        
        this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress circle
        const totalDuration = this.state.isBreak ? 
            (this.state.currentSession % 4 === 0 ? this.settings.longBreak : this.settings.shortBreak) * 60 * 1000 :
            this.settings.workDuration * 60 * 1000;
        
        const progress = ((totalDuration - timeInMs) / totalDuration) * 360;
        document.documentElement.style.setProperty('--progress', `${progress}deg`);
        
        // Update progress color based on mode
        document.documentElement.style.setProperty(
            '--progress-color', 
            this.state.isBreak ? 'var(--color-break-progress)' : 'var(--color-work-progress)'
        );
    }

    start() {
        console.log('Start called, isBreak:', this.state.isBreak);
        console.log('Timer state:', this.state);

        if (this.state.isRunning && !this.state.isPaused) return;

        if (!this.state.startTime) {
            // Get current settings from inputs only if it's the first start of a work session
            if (!this.state.isBreak && !this.state.isRunning) {
                this.settings.workDuration = parseInt(this.elements.workTimeInput.value);
                this.settings.shortBreak = parseInt(this.elements.breakTimeInput.value);
                this.saveSettings();
            }

            // Always hide settings during any session
            this.elements.timeSettings.style.display = 'none';
            
            // Calculate duration based on current session type
            const duration = this.state.isBreak ?
                (this.state.currentSession % 4 === 0 ? this.settings.longBreak : this.settings.shortBreak) * 60 * 1000 :
                this.settings.workDuration * 60 * 1000;
            
            console.log('Calculated duration:', duration / 1000, 'seconds');
            
            this.state.startTime = Date.now();
            this.state.endTime = this.state.startTime + duration;
        }

        this.state.isRunning = true;
        this.state.isPaused = false;
        this.updateButtons();
        this.tick();
    }

    pause() {
        this.state.isPaused = !this.state.isPaused;
        this.elements.pauseBtn.innerHTML = this.state.isPaused ? 
            '<i class="fa-solid fa-play"></i>' : 
            '<i class="fa-solid fa-pause"></i>';
        
        if (!this.state.isPaused) {
            this.start(); // Resume
        }
    }

    reset() {
        // Cancel animation frame if running
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }

        // Reset state
        this.state = {
            isRunning: false,
            isPaused: false,
            isBreak: false,
            currentSession: 1,
            startTime: null,
            endTime: null,
            remainingTime: 0,
            animationFrame: null
        };

        // Show settings only when resetting to work session
        this.elements.timeSettings.style.display = 'flex';
        this.initializeDisplay();
        this.updateButtons();
        this.updatePanelDisplay();
    }

    tick() {
        if (!this.state.isRunning || this.state.isPaused) {
            console.log('Tick stopped, isRunning:', this.state.isRunning, 'isPaused:', this.state.isPaused);
            return;
        }

        const now = Date.now();
        const remaining = this.state.endTime - now;

        if (remaining <= 0) {
            console.log('Session complete');
            this.handleSessionComplete();
        } else {
            this.updateTimeDisplay(remaining);
            this.state.animationFrame = requestAnimationFrame(() => this.tick());
        }
    }

    handleSessionComplete() {
        if (this.settings.soundEnabled) {
            this.playSound();
        }

        // Show transition animation
        this.showTransitionAnimation();

        // Update state after animation
        setTimeout(() => {
            if (!this.state.isBreak) {
                // Record completed work session immediately
                this.statsHandler.recordSession(this.settings.workDuration);
            }
            
            // Toggle break state
            this.state.isBreak = !this.state.isBreak;
            if (!this.state.isBreak) {
                this.state.currentSession++;
            }

            // Toggle break mode class on body
            document.body.classList.toggle('break-mode', this.state.isBreak);

            // Reset timer state
            this.state.startTime = null;
            this.state.endTime = null;
            this.state.isRunning = false; // Reset running state
            this.state.isPaused = false;  // Reset pause state
            
            this.updatePanelDisplay();

            // Calculate the next duration based on session type
            const nextDuration = this.state.isBreak ?
                (this.state.currentSession % 4 === 0 ? this.settings.longBreak : this.settings.shortBreak) :
                this.settings.workDuration;

            // Update the display with the new duration
            this.updateTimeDisplay(nextDuration * 60 * 1000);

            // Force start the next session after a short delay
            setTimeout(() => {
                console.log('Starting next session, isBreak:', this.state.isBreak);
                console.log('Duration:', nextDuration);
                this.start();
            }, 500);

        }, 1500);
    }

    updatePanelDisplay() {
        // Remove existing active classes
        this.elements.workTitle.classList.remove('active');
        this.elements.breakTitle.classList.remove('active');

        // Add active class with animation
        if (this.state.isBreak) {
            this.elements.breakTitle.classList.add('active');
        } else {
            this.elements.workTitle.classList.add('active');
        }

        // Update tomato indicators
        const tomatoes = this.elements.tomatoContainer.children;
        const completedSessions = Math.floor((this.state.currentSession - 1) / 2);
        
        for (let i = 0; i < tomatoes.length; i++) {
            tomatoes[i].classList.toggle('completed', i < completedSessions);
        }
    }

    updateButtons() {
        this.elements.startBtn.style.display = this.state.isRunning ? 'none' : 'block';
        this.elements.pauseBtn.style.display = this.state.isRunning ? 'block' : 'none';
        this.elements.resetBtn.style.display = this.state.isRunning ? 'block' : 'none';
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.start());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
    }

    initializeSessionIndicators() {
        // Create initial tomato indicators
        for (let i = 0; i < 4; i++) {
            const tomato = document.createElement('div');
            tomato.className = 'tomato-icon';
            this.elements.tomatoContainer.appendChild(tomato);
        }
    }

    showTransitionAnimation() {
        this.elements.sessionTransition.classList.add('show');
        setTimeout(() => {
            this.elements.sessionTransition.classList.remove('show');
        }, 1500);
    }

    setupAudio() {
        this.elements.beep.volume = 0.5; // Set default volume to 50%
        
        // Preload the audio
        this.elements.beep.load();
        
        // Handle audio loading errors
        this.elements.beep.onerror = () => {
            console.warn('Audio file failed to load. Check the file path.');
        };
    }

    playSound() {
        // Reset the audio to start
        this.elements.beep.currentTime = 0;
        
        // Create a promise to handle the sound playing
        const playPromise = this.elements.beep.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Sound played successfully
            }).catch(error => {
                console.warn('Sound playback failed:', error);
            });
        }
    }

    // Add a method to toggle sound
    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.saveSettings();
        
        // Provide visual feedback (you can add this to your UI)
        return this.settings.soundEnabled;
    }

    setupStatsEventListeners() {
        // Make sure these elements exist
        if (!this.elements.statsBtn || !this.elements.statsModal || !this.elements.closeModal) {
            console.error('Stats elements not found');
            return;
        }

        this.elements.statsBtn.addEventListener('click', () => {
            console.log('Opening stats modal');  // Debug log
            this.elements.statsModal.classList.add('show');
            this.statsHandler.updateDisplay();
        });

        this.elements.closeModal.addEventListener('click', () => {
            this.elements.statsModal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.elements.statsModal) {
                this.elements.statsModal.classList.remove('show');
            }
        });
    }
}

// Initialize the timer when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
});
