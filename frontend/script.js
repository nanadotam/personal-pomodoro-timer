// let timer;
// let timeLeft = 25 * 60; // 25 minutes in seconds
// let isRunning = false;

// const timeDisplay = document.getElementById('time');
// const startButton = document.getElementById('start');
// const stopButton = document.getElementById('stop');
// const resetButton = document.getElementById('reset');

// function updateTimeDisplay() {
//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;
//     timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
// }

// function startTimer() {
//     if (!isRunning) {
//         isRunning = true;
//         timer = setInterval(() => {
//             if (timeLeft > 0) {
//                 timeLeft--;
//                 updateTimeDisplay();
//             } else {
//                 clearInterval(timer);
//                 isRunning = false;
//                 alert('Time\'s up!');
//             }
//         }, 1000);
//     }
// }

// function stopTimer() {
//     clearInterval(timer);
//     isRunning = false;
// }

// function resetTimer() {
//     clearInterval(timer);
//     isRunning = false;
//     timeLeft = 25 * 60;
//     updateTimeDisplay();
// }

// startButton.addEventListener('click', startTimer);
// stopButton.addEventListener('click', stopTimer);
// resetButton.addEventListener('click', resetTimer);

// updateTimeDisplay();


// Variables Initialization
let workTitle = document.getElementById('Work');
let breakTitle = document.getElementById('Break');

let workTime = 25;
let breakTime = 5;

let seconds = '00';

// display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;

    workTitle.classList.add('active');
}

// timer (start)
function start() {
    // change the time
    seconds = 59;

    let workMinutes = workTime - 1;
    let breakTime = breakTime - 1;

    breakCount = 0;

    //countdown
    let timerFunction = () => {
        // change the display time
        document.getElementById('minutes').innerHTML = workMinutes;
        document.getElementById('seconds').innerHTML = seconds;

        // change the time (start)
        seconds = seconds - 1;
    }

    // start countdown
    setInterval(timerFunction, 1000); // 1000 =  1s;

}
