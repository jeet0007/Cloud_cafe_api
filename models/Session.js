const mongoose = require("mongoose");


const SessionSchema = new mongoose.Schema({
    GameId: String,
    UserId: String,
    startTime: {
        type: Date,
        default: Date.now
    }
});


const Session = mongoose.model("Session", SessionSchema, "Sessions");

module.exports = Session;
