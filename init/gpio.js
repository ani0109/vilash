const Gpio = require('onoff').Gpio;
const { startM, stopM, pause, counterF } = require('./oee');
const { runningLed, stoppedLed, pauseLed } = require('../helpers/status');
const config = require('../config');
const startbutton = new Gpio(config.startPin, 'in', 'rising');
const stopButton = new Gpio(config.stopPin, 'in', 'rising');
const pausebutton = new Gpio(config.pausebutton, 'in', 'rising');
const counterpin = new Gpio(config.counterpin, 'in', 'rising');


startbutton.watch((err) => {
    if (err) {
        console.log(err);
    }
    console.log('start Pressed');
    startM();
    runningLed();
});
stopButton.watch((err) => {
    if (err) {
        console.log(err);
    }
    console.log('stop Pressed');
    stopM();
    stoppedLed();
});
pausebutton.watch((err) => {
    if (err) {
        console.log(err);
    };
    console.log('pause Presssed');
    pause();
    pauseLed();
});
counterpin.watch((err, data) => {
    if (err) {
        console.log(err);
    };
    console.log('counter hit');
    counterF();
});