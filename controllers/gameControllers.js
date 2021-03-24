const awsService = require("../services/aws/aws_instance")
const Game = require("../models/Game");
const Session = require("../models/Session");
const User = require("../models/User");

// setup instance params



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

exports.getGameById = async (req, res) => {
    console.log("get game by id")
    const id = (req.params.id)
    try {
        let query = Game.findById(id);
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
}

exports.playGame = async (req, res) => {
    const { userId, gameId } = req.body;
    console.log(req.body)
    if (!userId || !gameId) {
        return res.status(400).send({
            message: "Failed",
            data: "Incomplete information"
        })
    }
    //Check user credits
    const user = await User.findById(userId);
    const userHasEnoughCredit = false;
    if (user) {
        console.log("User Found", user.username);
    } else {
        return res.status(200).send({
            message: "Failed",
            data: "User not found"
        })
    }
    // get game info
    const game = await Game.findById(gameId);

    if (game) {
        console.log("Game Found", game.name);
        if (userHasEnoughCredit) {
            //create an instance
            const requestSpotInstance = await awsService.requestSpotInstances()
            // Will return id
            const spotInstanceInfo = await awsService.describeSpotInstanceRequests(requestSpotInstance);
            // create a session 

        } else {
            return res.status(200).send({
                message: "Failed",
                reason: "Not enough balance",
                data: game
            })
        }
    } else {
        return res.status(200).send({
            message: "Failed",
            data: "Game not found"
        })
    }
}
exports.endSession = async (req, res) => {

}