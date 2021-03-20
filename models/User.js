const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone_number: String,
    email_address: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})



const User = mongoose.model("User", userSchema, "Users");
module.exports = User;
