const mongoose = require("mongoose");


const librarySchema = new mongoose.Schema({
    userId: {
        type: String,
        require: [true, "No user provided"]
    },
    games: {
        type: [String]
    }
})

