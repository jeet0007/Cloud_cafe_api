const awsService = require("../services/aws/aws_instance");
const dcvService = require("../services/dcv/dcvfilegenerator");
const Game = require("../models/Game");
const Session = require("../models/Session");
const User = require("../models/User");
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')


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
        if (result) {
            const custom_res = {
                images: result.images,
                isFlash: result.isFlash,
                name: result.name,
                provider: result.provider,
                price: result.price,
                url: result.url,
                _id: result._id
            }
            res.status(200).json({
                status: "success",
                data: custom_res,
            });
        } else {
            res.status(404).json({
                status: "Failed",
                message: "Game not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Failed",
            message: "Server Error",
        });
    }
}

exports.playGame = async (req, res) => {
    const { userId, gameId } = req.body;
    if (!userId || !gameId) {
        return res.status(400).send({
            message: "Failed",
            data: "Incomplete information",
            code: 206
        })
    }
    //Check user exists
    const user = await User.findById(userId);
    if (user) {
        console.log("User Found", user.username);
    } else {
        return res.status(200).send({
            message: "Failed",
            data: "User not found",
            code: 404
        })
    }
    // get game info
    const game = await Game.findById(gameId);

    if (game) {
        console.log("Game Found", game.name);
        if (game.isFlash) {
            return res.status(200).json({
                message: "Success",
                data: game,
                code: 200
            });
        } else if (game.ami === "None") {
            console.log("Game ami not available");
            return res.status(200).json({
                message: "Failed",
                data: "Game has not been configured",
                code: 204
            });
        }
    } else {
        return res.status(200).send({
            message: "Failed",
            data: "Game not found",
            code: 404
        })
    }
    //Check prior sessions
    const query = Session.where({
        UserId: userId,
        GameId: gameId,
        active: true
    })

    const session = await query.findOne();

    if (session) {
        console.log("returned active session", session._id)
        return res.json({
            message: "Failed",
            data: session._id,
            code: 700
        })
    }
    // check user credits
    if (user.credits < 50) {
        return res.json({
            message: "Failed",
            data: "Incuffecient Credits",
            code: 406
        })
    }
    const newSession = new Session({
        UserId: userId,
        GameId: gameId,
        state: "Requesting"
    })
    await newSession.save()

    res.status(200).json({
        message: "Success",
        data: newSession._id,
        code: 200
    })
    const requestSpotInstance = await awsService.requestSpotInstances(game.ami)

    if (requestSpotInstance) {
        console.log("Request submited")
        // Request submitted got request id 
        console.log("Spot request id : ", requestSpotInstance)
        // Wait for request to be fullfiled
        const instanceId = await awsService.waitForRequestTofullfill(requestSpotInstance);
        console.log("recieved", instanceId)
        // wait for instance to finish initilizing 
        await Session.updateOne({ _id: newSession._id }, { state: "Innitiating" })

        const instanceLaunched = await awsService.waitForInstanceToInitialize(instanceId)
        console.log("Instance state", instanceLaunched)

        const { PublicIpAddress } = await awsService.describeInstances(instanceId)
        console.log(PublicIpAddress);
        await Session.updateOne({ _id: newSession._id }, { instanceId: instanceId, url: `https://${PublicIpAddress}:8443/`, state: "Launched", active: true })
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