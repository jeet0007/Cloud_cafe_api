const awsService = require("../services/aws/aws_instance")
const Game = require("../models/Game");
const Session = require("../models/Session");

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
    //create an instance

    const requestSpotInstance = await awsService.runInstance();  // Will return id
    const spotInstanceInfo = await awsService.describeSpotInstanceRequests(requestSpotInstance);

    // create a session 


    // Save session to db
    /**Return a game {
        userid : String
        gameid : String
        url : String
        statted at : Date Times
    }*/
    res.status(200).send({
        status: "fucked"
    })


}
