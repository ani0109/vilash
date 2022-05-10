const config = {
    port: process.env.PORT || 3000,
    mqtt_global: 'mqtt://119.81.0.44:1883',
    mqtt_local: 'mqtt://localhost:1883',
    mongodb: 'mongodb://localhost:27017/vilas',
    mongodbOptions: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    keepAliveInterval: 2,
    checkOnlineInterval: 1000,
    checkOfflineInterval: 1000,

    cordinate: {
        a: 100,
        b: 100,
        c: 500,
        d: 500
    },


    tgId: 'TG0017',
    rpmPort: '00',
    moisturePort: '01',
    sandMoisturePort: '02',
    gpsPort: '03',
    vfd1Port: '04',
    vfd2Port: '05',
    cameraPort: '06',


    limit: 180, //NOTE: NOT equal to Zero; set minimum time to limit the ictpu for exclude
    tolerance: -179000, // tolerance for idle cycle
    startPin: 17,
    stopPin: 27,
    pausebutton: 22,
    counterpin: 23,

    startLed: 20,
    stopLed: 21,
    idleLed: 16,

    qIo: 2, //Quantity in once

    oee_api: 'https://oee.thingsgosocial.com/api',
    sensor_api: 'https://sensor.thingsgosocial.com/api'
}
module.exports = config;
