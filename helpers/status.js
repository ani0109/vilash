const Gpio = require('onoff').Gpio;
const config = require('../config');
const startLed = new Gpio(config.startLed, 'out');
const stopLed = new Gpio(config.stopLed, 'out');
const idleLed = new Gpio(config.idleLed, 'out');

function runningLed() {
    stopLed.writeSync(0);
    idleLed.writeSync(0);
    startLed.writeSync(1);
};
function stoppedLed() {
    idleLed.writeSync(0);
    startLed.writeSync(0);
    stopLed.writeSync(1);
};
function pauseLed() {
    stopLed.writeSync(1);
    startLed.writeSync(1);
    idleLed.writeSync(1);
};
function idleLedF() {
    idleLed.writeSync(1);
    startLed.writeSync(0);
    stopLed.writeSync(0);
};
function firstRunLed() {
    idleLed.writeSync(0);
    startLed.writeSync(0);
    stopLed.writeSync(0);
};

module.exports = {runningLed, stoppedLed, pauseLed, idleLedF, firstRunLed};