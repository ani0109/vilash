const { gclient } = require('../helpers/mqttHandler');
const sendData = require('../helpers/sendData');
const config = require('../config');
let checkTime = 30;
let status = false;




function init() {
    console.log('connection initialised');
    let checkOnlineInterval = setInterval(() => {
        if (gclient.connected && !status) {
            --checkTime;
            process.stdout.write('.');
            if (checkTime == 0) {
                status = true;
                clearInterval(checkOnlineInterval);
                sendit()
            }
        } else {
            checkTime = 30;
            status = false;
        }
    }, config.checkOnlineInterval);
}

function sendit() {
    console.log('connection finalised');
    let checkofflineInterval = setInterval(() => {
        process.stdout.write('.');
        if (!gclient.connected) {
            status = false;
            clearInterval(checkofflineInterval);
            init();
            checkTime = 30;
        } else {
            sendData();
        }
    }, config.checkOfflineInterval + 5000);
}

init();