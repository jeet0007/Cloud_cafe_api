const mongoose = require("mongoose");


const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: Date,
        default: () => Date.now()
    },
    endTime: {
        type: Date,
        default: () => Date.now() + 3 * 60 * 60 * 1000 // 3 hours from now
    },
    instanceId: String,
    url: String,
    active: {
        type: Boolean,
        default: true
    }

});


const Session = mongoose.model("Session", SessionSchema, "Sessions");

module.exports = Session;
