const mongoose = require("mongoose");
const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    provider: {
        type: String,
        required: [true, "Please provide an provider"],
    },
    images: {
        type: [String]
    },
    price: {
        type: Number
    },
    url: {
        type: String
    },
    platform: {
        type: [String]
    }

});

const Game = mongoose.model("Game", gameSchema, "Games");

module.exports = Game;
