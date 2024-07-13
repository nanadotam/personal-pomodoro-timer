// Variables Initialization
let workTitle = document.getElementById('Work');
let breakTitle = document.getElementById('Break');

let workTime = 25;
let breakTime = 5;

let seconds = '00';
let timerInterval;
let isPaused = false;
let breakCount = 0;

// Display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime < 10 ? '0' + workTime : workTime;
    document.getElementById('seconds').innerHTML = seconds;

    workTitle.classList.add('active');
}

// Timer (start)
function start() {
    // Get user-defined work and break times
    workTime = parseInt(document.getElementById('work-time').value);
    breakTime = parseInt(document.getElementById('break-time').value);

    // Hide the input form
    document.querySelector('.time-settings').style.display = 'none';

    // Change button
    document.getElementById('start').style.display = 'none';
    document.getElementById('pause').style.display = 'block';
    document.getElementById('reset').style.display = 'block';

    // Change the time
    seconds = 59;

    let workMinutes = workTime - 1;
    let breakMinutes = breakTime - 1;

    // Countdown
    timerFunction = () => {
        if (!isPaused) {
            document.getElementById('minutes').innerHTML = workMinutes < 10 ? '0' + workMinutes : workMinutes;
            document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;

            seconds = seconds - 1;

            if (seconds < 0) {
                workMinutes = workMinutes - 1;
                seconds = 59;
            }

            if (workMinutes < 0) {
                if (breakCount % 2 === 0) {
                    workMinutes = breakMinutes;
                    breakCount++;

                    // After 4 rounds, increase the break time to 15 minutes
                    if (breakCount === 8) {
                        breakTime = 15;
                        breakMinutes = breakTime - 1;
                    }

                    // Change the panel
                    workTitle.classList.remove('active');
                    breakTitle.classList.add('active');
                    document.body.style.backgroundColor = 'var(--color-break)';
                    document.getElementById('beep').play();
                } else {
                    workMinutes = workTime;
                    breakCount++;

                    // Change the panel
                    breakTitle.classList.remove('active');
                    workTitle.classList.add('active');
                    document.body.style.backgroundColor = 'var(--color-primary)';
                    document.getElementById('beep').play();
                }
            }
        }
    }

    timerInterval = setInterval(timerFunction, 1000);
}

// Pause Timer
function pauseTimer() {
    isPaused = !isPaused;
    document.getElementById('pause').innerHTML = isPaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
}

// Reset Timer
function resetTimer() {
    clearInterval(timerInterval);
    isPaused = false;
    breakCount = 0; // Reset break count
    breakTime = 5; // Reset break time to default

    // Show the input form
    document.querySelector('.time-settings').style.display = 'flex'; // Use flex to retain layout

    document.getElementById('start').style.display = 'block';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('reset').style.display = 'none';
    document.getElementById('minutes').innerHTML = workTime < 10 ? '0' + workTime : workTime;
    document.getElementById('seconds').innerHTML = '00';

    // Reset the panel
    workTitle.classList.add('active');
    breakTitle.classList.remove('active');
    document.body.style.backgroundColor = 'var(--color-primary)';
}
