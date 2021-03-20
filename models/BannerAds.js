const mongoose = require("mongoose");


const BannerSchema = new mongoose.Schema({
    name: String,
    image: String,
    gameId: String
});



const BannerAd = mongoose.model("BannerAd", BannerSchema, "DashbordAds");

module.exports = BannerAd;
