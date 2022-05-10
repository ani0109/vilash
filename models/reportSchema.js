const mongoose = require('mongoose');
let reportSchema = mongoose.Schema({
    tgId: { type: String },
    gid: { type: mongoose.Types.ObjectId },
    nC: { type: Number, default: 0, required: true },
    bC: { type: Number, default: 0, required: true },
    ictpu: { type: Number, default: 0, required: true },
    cycleTime: { type: Number, default: 0, required: true },
    downTime: { type: Number, default: 0, required: true },
    idleTime: [{ type: Date }],
    unidleTime: [{ type: Date }],
    MTBF: { type: Number, default: 0 },
    MTTR: { type: Number, default: 0 },
    UpTime: { type: Number, default: 0 },
    cDetail: { type: mongoose.Schema.Types.Mixed },
    quantity: { type: Number, default: 0 },
    oee: {
        availability: { type: Number },
        quality: { type: Number },
        performance: { type: Number },
        oeePercent: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('report', reportSchema);