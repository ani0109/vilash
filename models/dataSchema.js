const mongoose = require('mongoose');
let dataSchema = mongoose.Schema({
    tid: { type: String },
    s: { type: Date },            //made millisecond to zero
    v: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('data',dataSchema);