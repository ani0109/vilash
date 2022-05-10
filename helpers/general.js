const dataSchema = require('../models/dataSchema');
function saveData(tid,v) {
    dataSchema.findOneAndUpdate({ tid, s: (new Date()).setMilliseconds(0) }, { $set: { ['v.' + (new Date()).getMilliseconds()]: v } }, { new: true, upsert: true }).exec();
};

module.exports = { saveData };