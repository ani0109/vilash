const mqtt = require('mqtt');
const config = require('../config');
const gclient = mqtt.connect(config.mqtt_global, { keepalive: config.keepAliveInterval });
const lclient = mqtt.connect(config.mqtt_local, { keepalive: config.keepAliveInterval });
let timeDelay = 40;
function connect() {
  gclient.on('connect', () => {
    console.log('global connected');
  });
  lclient.on('connect', () => {
    console.log('local connected');
  });
};
connect();
gclient.on('error', (err) => {
  console.log(err);
  timeDelay += 40;
  setTimeout(connect(), timeDelay * 1000);
});
gclient.on('close', () => {
  console.log(`global mqtt client disconnected`);
});
lclient.on('error', (err) => {
  console.log(err);
  timeDelay += 40;
  setTimeout(connect(), timeDelay * 1000)
});
lclient.on('close', () => {
  console.log(`local mqtt client disconnected`);
});
module.exports = { gclient, lclient };