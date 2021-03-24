const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone_number: String,
    credits: {
        type: Number,
        default: 0
    },
    email_address: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})



const User = mongoose.model("User", userSchema, "Users");
module.exports = User;

