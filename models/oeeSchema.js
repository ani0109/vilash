const mongoose = require('mongoose');
const config = require('../config');
let oeeSchema = mongoose.Schema({
    ictpu:{type:Number},
    tgId:{type:String,default:config.tgId},
    status:{type:String,enum:['running','stopped','pause','idle']}
});

module.exports = mongoose.model('oee',oeeSchema);