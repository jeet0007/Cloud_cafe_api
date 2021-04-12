const mongoose = require("mongoose");


const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: Date,
        default: () => new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
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
