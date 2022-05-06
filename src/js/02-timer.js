import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
let deadline;
// const deadline = new Date();

const refs = {
    input: document.querySelector('#datetime-picker'),
startBtn: document.querySelector('button[data-start]'),
    timerShow: document.querySelector('.timer'),
    daysShow: document.querySelector('span[data-days]'),
    hoursShow: document.querySelector('span[data-hours]'),
    minutesShow: document.querySelector('span[data-minutes]'),
    secondsShow: document.querySelector('span[data-seconds]'),
}
refs.startBtn.addEventListener('click', () => {
   timer.start() 
} );

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        if (Date.now() > selectedDates[0].getTime()) {
       alert("Please choose a date in the future")
        refs.startBtn.disabled = true;
    } else {
            refs.startBtn.disabled = false;
            deadline = selectedDates[0];
    }
 
  },
};
const calendar = flatpickr("#datetime-picker", options);

class Timer {
    constructor({onTick}) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;
    }
    start() {
    if (this.isActive) {
        return;
    }
        const startTime = deadline.getTime();
        this.isActive = true;
        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            const countDown = startTime - currentTime;
            console.log(countDown)
            const time = convertMs(countDown);
            this.onTick(time) 
            if (countDown <= 0) {
                clearInterval(this.intervalId);
                this.isActive = false;
        }
            // console.log (`${days}:${hours}:${minutes}:${seconds}`)
        }, 1000)
}

}

const timer = new Timer({
    onTick: updateClock,
});

 function updateClock({days, hours, minutes, seconds}) {
    refs.daysShow.textContent = `${days}`;
    refs.hoursShow.textContent = `${hours}`;
    refs.minutesShow.textContent = `${minutes}`;
     refs.secondsShow.textContent = `${seconds}`;
 }


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function pad(value) {
    return String(value).padStart(2, '0');
}