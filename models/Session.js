const mongoose = require("mongoose");


function formatDateWithZone() {
    var s = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    var a = s.split(/\D/);
    return a[2] + '-' + a[1] + '-' + a[0] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
}

const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: Date,
        default: () => formatDateWithZone()
    },
    endTime: {
        type: Date
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
