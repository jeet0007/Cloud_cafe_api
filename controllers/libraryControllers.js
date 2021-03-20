const Library = require("../models/Library");
const BannerAd = require("../models/BannerAds");



exports.getBannerAds = async (req, res) => {
    try {
        let query = BannerAd.find();
        const result = await query;

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Server Error",
        });
    }
};
exports.getUserLibrary = async (req, res) => {
    try {
        let userId = req.body()
        console.log(userId);
        let query = Library.find(x => x.userId == userId);
        const result = await query;

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Server Error",
        });
    }
};