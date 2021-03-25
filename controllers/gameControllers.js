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
    let userHasEnoughCredit = false;
    if (user) {
        console.log("User Found", user.username);
        if (user.credits > 50) {
            userHasEnoughCredit = true
        }
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
            // TODO:Check prior sessions
            const query = Session.where({
                UserId: userId,
                GameId: gameId,
                active: true
            })
            let exixtSession = false;
            query.findOne((err, session) => {
                if (err) {
                    console.log("No sessions found")
                }
                if (session) {
                    console.log("Session found", session)
                    exixtSession = true;
                    return res.status(200).send({
                        message: "Success",
                        data: {
                            url: session.url,
                            name: game.name,
                            sessionId: session._id
                        }
                    })
                }
            })
            if (exixtSession === false) {
                //create an instance
                const requestSpotInstance = await awsService.requestSpotInstances()
                // { message: "Success", data: "sir-yvfg2ixq" };
                await sleep(6000);
                const { message, data } = requestSpotInstance
                if (message === "Success") {
                    // Will return id
                    const spotInstanceInfo = await awsService.describeSpotInstanceRequests(data);
                    if (spotInstanceInfo.message === "Success") {
                        const InstanceId = spotInstanceInfo.data
                        console.log("Instanceid : ", spotInstanceInfo)
                        // Get public ip
                        const instanceInfo = await awsService.describeInstances(InstanceId);
                        const instanceInfoData = instanceInfo.data;
                        console.log("ip:", instanceInfoData)
                        const { State } = instanceInfoData
                        if (State.Code === 16) {
                            console.log("Instance Running");
                            const { PublicIpAddress } = instanceInfoData;
                            // create a session 
                            const newSession = new Session({
                                UserId: userId,
                                GameId: gameId,
                                instanceId: InstanceId,
                                url: `https://${PublicIpAddress}:8443/`,
                                active: true
                            })
                            await newSession.save()
                            return res.status(200).send({
                                message: "Success",
                                data: {
                                    url: `https://${PublicIpAddress}:8443/`,
                                    name: game.name,
                                    sessionId: newSession._id
                                }
                            })
                        } else if (State.Code === 48) {
                            console.log("Instance terminated");
                        } else {
                            console.log("Instance was not running")
                        }
                        //return geme with url
                        return res.status(200).send({
                            message: "Success",
                            data: game
                        })
                    }
                }
            }
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


async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}