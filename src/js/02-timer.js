import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const refs = {
    input: document.querySelector('#datetime-picker'),
startBtn: document.querySelector('button[data-start]'),
    daysShow: document.querySelector('span[data-days]'),
    hoursShow: document.querySelector('span[data-hours]'),
    minutesShow: document.querySelector('span[data-minutes]'),
    secondsShow: document.querySelector('span[data-seconds]'),
}
let deadline;
refs.startBtn.addEventListener('click', () => {
   timer.start() 
});
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        if (Date.now() > selectedDates[0].getTime()) {
       Notify.failure("Please choose a date in the future")
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
            const time = this.convertMs(countDown);
            
        if (countDown <= 0) {
            clearInterval(this.intervalId);
            this.isActive = false;
            return;
        }
            this.onTick(time) 
        }, 1000)
}
convertMs(ms) {
  // Number of milliseconds per unit of time
const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
const days = this.addLeadingZero(Math.floor(ms / day));
  // Remaining hours
const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
    };
    
addLeadingZero(value) {
    return String(value).padStart(2, '0');
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
