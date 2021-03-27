const awsService = require("../services/aws/aws_instance");
const dcvService = require("../services/dcv/dcvfilegenerator");
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
        console.log("Game Found", game);

        if (game.isFlash || game.ami === "") {
            return res.status(200).json({
                message: "Success",
                data: game,
            });
        }
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
                    data: session
                })
            }
        })
        if (exixtSession === false) {
            if (userHasEnoughCredit) {
                //create an instance
                const requestSpotInstance = await awsService.requestSpotInstances(game.ami)
                // { message: "Success", data: "sir-yvfg2ixq" };
                await sleep(60000);
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
                            user.credits -= 50
                            await user.save()
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
            } else {
                return res.status(200).send({
                    message: "Failed",
                    reason: "Not enough balance",
                    data: game
                })
            }
        }

    } else {
        return res.status(200).send({
            message: "Failed",
            data: "Game not found"
        })
    }
}

exports.generateDcvFile = async (req, res) => {
    const sessionId = req.params.SessionId;
    if (!sessionId) {
        return res.status(200).send({
            message: "Failed",
            data: "Incomplete information"
        })
    }
    const session = await Session.findById(sessionId);
    if (session) {
        const publicIp = ((session.url).replace("https://", "")).replace(":8443/", ""); //https://54.179.81.205:8443/
        const file = await dcvService.generateFile(publicIp);
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-disposition': 'attachment; filename=CloudCafe.dcv'
        });
        return res.end(file);

    } else {
        return res.status(200).send({
            message: "Failed",
            data: "Session not found"
        })
    }
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}