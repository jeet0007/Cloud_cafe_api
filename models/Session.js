const mongoose = require("mongoose");


const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: Date,
        default: () => Date.now().toLocaleDateString("th")
    },
    endTime: {
        type: Date,
        default: () => Date.now().toLocaleDateString("th") + 3 * 60 * 60 * 1000 // 3 hours from now
    },
    instanceId: String,
    url: String,
    active: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        default: 0
    }

});


const Session = mongoose.model("Session", SessionSchema, "Sessions");

module.exports = Session;
