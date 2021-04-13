const mongoose = require("mongoose");
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')

function formatDateWithZone() {
    var s = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    var a = s.split(/\D/);
    return a[2] + '-' + a[1] + '-' + a[0] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
}


function getCurrentDate() {
    const date = new Date()
    const timeZone = 'Asia/Bangkok'
    const pattern = 'yyy-MM-dd*HH:mm:ss'
    const zonedDate = utcToZonedTime(date, timeZone)
    const output = format(zonedDate, pattern, { timeZone: timeZone }).replace("*", "T")
    console.log("formated date :", output);
    return output
}

const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: String,
        default: () => getCurrentDate()
    },
    endTime: {
        type: String
    },
    instanceId: String,
    url: String,
    active: {
        type: Boolean,
        default: true
    },
    state: String,
    duration: {
        type: Number,
        default: 0.0
    }
}, { timestamps: true });


const Session = mongoose.model("Session", SessionSchema, "Sessions");

module.exports = Session;
