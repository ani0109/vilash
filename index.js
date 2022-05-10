const mongoose = require('mongoose');
const express = require('express');
const { spawn } = require('child_process');
const config = require('./config');
let timeout = 40;
const app = express();
function connectMongodb() {
    mongoose.connect(config.mongodb, config.mongodbOptions);
}
const db = mongoose.connection;

//for successful connection

db.once('open', () => {
    console.log('connected to MongoDB successfully!!!');
});

//for error in connection
db.on('error', err => {
    console.log(err);
    setTimeout(() => {
        connectMongodb();
    }, timeout);
    timeout += 40;
});

spawn('raspivid',['-t','0','-p','300,400,480,240'])

connectMongodb();
require('./init/gpio');
require('./init/offlineData');

app.use(express.static(__dirname + '/public'));
app.post('/submitDefect', (req, res) => {
    console.log(req.body);
    res.end();
})
app.listen(8080, () => console.log('server is up at 8080'));
// const WebStreamerServer = require('./helpers/raspivid');
// new WebStreamerServer(app.listen(8080, () => console.log('server is up at 8080')));