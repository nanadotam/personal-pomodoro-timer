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
    // change button
    document.getElementById('start').style.display = 'none';
    document.getElementById('reset').style.display = 'block';

    // change the time
    seconds = 59;

    let workMinutes = workTime - 1;
    let breakMinutes = breakTime - 1;

    let breakCount = 0;

    //countdown
    let timerFunction = () => {
        // change the display time
        document.getElementById('minutes').innerHTML = workMinutes < 10 ? '0' + workMinutes : workMinutes;
        document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;

        // change the time (start)
        seconds = seconds - 1;

        if (seconds == 0) {
            workMinutes = workMinutes - 1;
            seconds = 59;
        }

        if (workMinutes == -1) {
            if (breakCount % 2 == 0) {
                // START BREAK
                workMinutes = breakMinutes;
                breakCount++;

                // change the panel
                workTitle.classList.remove('active');
                breakTitle.classList.add('active');
            } else {
                // Continue work
                workMinutes = workTime;
                breakCount++;

                // change the panel
                breakTitle.classList.remove('active');
                workTitle.classList.add('active');
            }
        }
    }

    // start countdown
    setInterval(timerFunction, 1000); // 1000 =  1s;
}
