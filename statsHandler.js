class StatisticsHandler {
    constructor() {
        console.log('Initializing StatisticsHandler');
        this.elements = {
            modal: document.getElementById('stats-modal'),
            todaySessions: document.getElementById('today-sessions'),
            totalFocusTime: document.getElementById('total-focus-time'),
            completionRate: document.getElementById('completion-rate'),
            currentStreak: document.getElementById('current-streak'),
            weeklyChart: document.getElementById('weekly-chart')
        };

        // Debug log to check if elements are found
        console.log('Stats elements:', this.elements);

        this.stats = this.loadStats();
        this.chart = null;
    }

    loadStats() {
        const savedStats = localStorage.getItem('pomodoroStats');
        return savedStats ? JSON.parse(savedStats) : {
            dailySessions: {},
            totalSessions: 0,
            totalFocusTime: 0,
            currentStreak: 0,
            lastSessionDate: null
        };
    }

    saveStats() {
        localStorage.setItem('pomodoroStats', JSON.stringify(this.stats));
    }

    recordSession(duration) {
        const today = new Date().toLocaleDateString();
        
        // Update daily sessions
        this.stats.dailySessions[today] = (this.stats.dailySessions[today] || 0) + 1;
        this.stats.totalSessions++;
        this.stats.totalFocusTime += duration;
        
        // Update streak
        if (this.stats.lastSessionDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString();
            
            if (this.stats.lastSessionDate === yesterdayStr) {
                this.stats.currentStreak++;
            } else if (this.stats.lastSessionDate !== today) {
                this.stats.currentStreak = 1;
            }
            this.stats.lastSessionDate = today;
        }

        this.saveStats();
        this.updateDisplay();
    }

    updateDisplay() {
        console.log('Updating stats display');
        const today = new Date().toLocaleDateString();
        
        // Update stats cards with proper formatting and checks
        this.elements.todaySessions.textContent = this.stats.dailySessions[today] || 0;
        this.elements.totalFocusTime.textContent = this.formatTime(this.stats.totalFocusTime);
        
        // Calculate completion rate with safeguard against division by zero
        const totalAttempts = this.stats.totalSessions + this.getIncompleteCount();
        const completionRate = totalAttempts > 0 ? 
            Math.round((this.stats.totalSessions / totalAttempts) * 100) : 0;
        this.elements.completionRate.textContent = `${completionRate}%`;
        
        this.elements.currentStreak.textContent = `${this.stats.currentStreak} days`;
        
        this.updateChart();
    }

    updateChart() {
        const ctx = this.elements.weeklyChart.getContext('2d');
        const labels = this.getLastSevenDays();
        const data = labels.map(date => this.stats.dailySessions[date] || 0);

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Completed Sessions',
                    data: data,
                    backgroundColor: 'rgba(255, 107, 107, 0.5)',
                    borderColor: 'rgba(255, 107, 107, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    // Helper methods
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        // Add leading zeros and proper formatting
        return `${hours}h ${mins.toString().padStart(2, '0')}m`;
    }

    getLastSevenDays() {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString());
        }
        return dates;
    }

    getIncompleteCount() {
        // Modify this to avoid NaN% in completion rate when starting
        return Math.max(0, Object.values(this.stats.dailySessions).reduce((a, b) => a + b, 0) - this.stats.totalSessions);
    }
} 