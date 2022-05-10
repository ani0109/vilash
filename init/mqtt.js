const { gclient, lclient } = require('../helpers/mqttHandler');
const config = require('../config');
const { saveData } = require('../helpers/general');


lclient.subscribe(`sensor/${config.tgId}_${config.rpmPort}`, { qos: 0 });
lclient.subscribe(`sensor/${config.tgId}_${config.moisturePort}`, { qos: 0 });
lclient.subscribe(`sensor/${config.tgId}_${config.sandMoisturePort}`, { qos: 0 });
lclient.subscribe(`sensor/${config.tgId}_${config.vfd1Port}`, { qos: 0 });


lclient.on('message', (topic, message) => {
    if (topic.match(`sensor/${config.tgId}_${config.drumPort}`)) {
        saveData(`${config.tgId}_${config.drumPort}`, JSON.parse(message.toString()));
        if (gclient.connected) {
            gclient.publish(topic, message.toString());
        };
    };
    if (topic.match(`sensor/${config.tgId}_${config.rpmPort}`)) {
        saveData(`${config.tgId}_${config.rpmPort}`, JSON.parse(message.toString()));
        if (gclient.connected) {
            gclient.publish(topic, message.toString());
        };
    };
    if (topic.match(`sensor/${config.tgId}_${config.sand}`)) {
        saveData(`${config.tgId}_${config.sand}`, JSON.parse(message.toString()));
        if (gclient.connected) {
            gclient.publish(topic, message.toString());
        };
    };
    if (topic.match(`sensor/${config.tgId}_${config.vfd}`)) {
        saveData(`${config.tgId}_${config.vfd}`, JSON.parse(message.toString()));
        if (gclient.connected) {
            gclient.publish(topic, message.toString());
        };
    };
});

module.exports = (topic, message) => {
    if (gclient.connected) {
        gclient.publish(topic, message);
    };
    lclient.publish(topic, message);
};