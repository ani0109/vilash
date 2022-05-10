const reportSchema = require('../models/reportSchema');
const config = require('../config');
module.exports = (report) => {
    let plannedProductionTime = report.updatedAt - report.createdAt;
    let runTime = plannedProductionTime - report.downTime;
    let idleNumber = report.idleTime.length;
    let availability = runTime / plannedProductionTime;
    let performance = (report.ictpu * report.nC) / runTime;
    let quality = (report.nC - report.bC) / report.nC;
    let MTBF = idleNumber ? (plannedProductionTime - report.downTime) / idleNumber : 0;
    let MTTR = idleNumber ? report.downTime / idleNumber : 0;
    let UpTime = idleNumber ? MTBF / (MTBF + MTTR) : 0;

    reportSchema.findByIdAndUpdate(report._id, {
        $set: {
            oee: {
                availability, performance, quality,
                oeePercent: (availability * performance * quality)
            },
            MTBF, MTTR, UpTime
        }
    }, { upsert: false, new: true }).select('_id').exec().then(report => mqtt.publish(`oee/lid/${config.tgId}`, report._id))
        .catch(err => console.log(err));
}