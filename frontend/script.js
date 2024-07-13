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
