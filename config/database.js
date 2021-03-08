var mongoose = require('mongoose');
require('dotenv/config');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.jpi9r.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const params = { useNewUrlParser: true, useUnifiedTopology: true }
const connectDb = async () => {
    const db = await mongoose.connect(uri, params, function (err) {
        if (err) {
            console.warn(err);
        } else {
            console.log("Database Connected!!");
        }
    });

}
module.exports = connectDb
