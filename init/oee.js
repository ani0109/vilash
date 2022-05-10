const mongoose = require('mongoose');
const { spawn } = require('child_process');
const calculateOee = require('../helpers/calculateOee');
const oeeSchema = require('../models/oeeSchema');
const reportSchema = require('../models/reportSchema');
const sendMqtt = require('./mqtt');
const { gclient,lclient } = require('../helpers/mqttHandler');
const {runningLed, stoppedLed, pauseLed, idleLedF, firstRunLed} = require('../helpers/status');
const config = require('../config');


gclient.subscribe(`oee/start/${config.tgId}`, { qos: 0 });
gclient.subscribe(`oee/stop/${config.tgId}`, { qos: 0 });




let counter = 0;
let status;         //running pause idle stopped
let milli;


let ictpu;



function start() {
    milli = Date.now();
    status = 'running';
        reportSchema.deleteMany({ nC: 0 }).exec()
        .then(() => reportSchema.create({ tgId: config.tgId, ictpu }))
        .then(()=>lclient.publish(`oee/start/${config.tgId}`, 'start'))
        .catch(err => console.log(err));
};

function stop() {
    milli = Date.now();
    status = 'stopped';
        reportSchema.findOne({ tgId: config.tgId }).sort({ "updatedAt": -1 }).select('_id').exec().then(lR => {
            if (lR) {
                mongoose.connection.db.collection('reports').updateOne({ _id: mongoose.Types.ObjectId(lR._id) }, { $set: { status: 'stopped' } })
            }
        }).catch(err => console.log(err));
        stoppedLed();
        lclient.publish(`oee/stop/${config.tgId}`, 'stop');
};






gclient.on('message', (topic, message) => {
    if (topic.match(`oee/start/${config.tgId}`)) {
        console.log('start');
        ictpu = JSON.parse(message.toString()).ictpu;
        oeeSchema.findOneAndUpdate({ tgId: config.tgId }, { $set: { ictpu, status: 'running' } },{upsert:true}).exec();
        runningLed();
        start();
    };
    if (topic.match(`oee/stop/${config.tgId}`)) {
        console.log('stop');
        oeeSchema.findOneAndUpdate({ tgId: config.tgId }, { $set: { status: 'stopped' } },{upsert:true}).exec();
        stop();
    }
});





//-------------------------INIT--------------------------------------------------------------
oeeSchema.findOne({tgId:config.tgId}).exec().then(oee=>{
    if (oee) {
        status = oee.status;
        ictpu = oee.ictpu;
        milli = Date.now();
        switch (oee.status) {
            case 'running':
                runningLed();
                break;
            case 'pause':
                pauseLed();
                break;
            case 'idle':
                idleLedF();
                break;
            case 'stopped':
                stoppedLed();
                break;
            default:
                firstRunLed();
                break;
        }
    }else{
        firstRunLed();
    }
}).catch(err=>console.log(err));

//--------------------------------END INIT----------------------------------------------------




function startM() {
    start();
    sendMqtt(`oee/startM/${config.tgId}`, 'start');
};

function stopM() {
    stop();
    sendMqtt(`oee/stopM/${config.tgId}`, 'stop');
};


function counterF() {
    let screenShot = spawn('scrot_extended', [config.cordinate.a, config.cordinate.b, config.cordinate.c, config.cordinate.d]);
    screenShot.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      
      screenShot.stderr.on('data', (data) => {
        console.error(data.toString());
      });
    if ((Date.now() - milli) > (ictpu / config.limit)&&status != 'pause') {
        counter++;
        function updateCounter(nC,cycleTime) {
            reportSchema.findOneAndUpdate({tgId:config.tgId}, {
                nC,cycleTime,status:'started',['cDetail.'+counter] : Date.now()
            },{new:true}).sort({ "updatedAt": -1 }).select('-status -unidleTime -machineId -bCdetails -__v').exec().then(report => calculateOee(report));
        }
        updateCounter(counter * config.qIo, Date.now() - milli);
        sendMqtt(`oee/counter/${config.tgId}`, `${counter * config.qIo};${Date.now() - milli}`);
        milli = Date.now();
    if (status == 'idle') {
        unidle();
    };
 }
}




function unidle() {
    status = 'running';
    runningLed();
    oeeSchema.findOneAndUpdate({ tgId: config.tgId }, { status: 'running' }).exec();
    reportSchema.findOne({ tgId: config.tgId }).sort({ "updatedAt": -1 })
            .select('idleTime unidleTime').exec()
            .then(report => {
                let downTime = new Date().getTime() - report.idleTime.reverse()[0].getTime();
                reportSchema.findByIdAndUpdate(report._id, {
                    $push: { unidleTime: new Date() },
                    $inc: { downTime }, $set: { status: 'started' }
                }).exec()
            });
    sendMqtt(`oee/unidle/${config.tgId}`, 'unidle');
};
function pause() {
    if (status == 'pause') {
        status = 'running';
        oeeSchema.findOneAndUpdate({tgId:config.tgId},{status:'running'}).exec();
    }else if (status == 'running'){
        status = 'pause';
        oeeSchema.findOneAndUpdate({ tgId: config.tgId }, { status: 'pause' }).exec();
        sendMqtt(`oee/pause/${config.tgId}`, 'pause');
    };
}


//---------------------------------------------------------------------------------

function oee() {
    if ((Date.now() - milli ) >= (ictpu + config.tolerance) && status == 'running' ) {
        status = 'idle';
        idleLedF();
        sendMqtt(`oee/idle/${config.tgId}`, 'idle');
        oeeSchema.findOneAndUpdate({tgId:config.tgId},{status:'idle'}).exec();
        reportSchema.findOneAndUpdate({tgId:config.tgId},{$push:{idleTime:Date()}}).sort({ "updatedAt": -1 }).exec();
        setTimeout(() => {
            oee();
        }, 100);
    }else{
        setTimeout(() => {
            oee();
        }, 100);
    }
};
oee();

//---------------------------------------------------------------------------------

module.exports = { startM, stopM, pause, counterF};