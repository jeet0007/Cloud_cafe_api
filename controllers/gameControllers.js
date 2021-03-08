const Game = require("../models/Game");

exports.getAllGames = async (req, res) => {
    try {
        let query = Game.find();
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
