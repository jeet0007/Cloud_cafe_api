const mongoose = require("mongoose");


const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: Date,
        default: () => new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    },
    endTime: {
        type: Date,
        default: () => new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) + 3 * 60 * 60 * 1000 // 3 hours from now
    },
    instanceId: String,
    url: String,
    active: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        default: 0.0
    }
}, { timestamps: true });


const Session = mongoose.model("Session", SessionSchema, "Sessions");

module.exports = Session;
