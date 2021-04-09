const User = require("../models/User");
const bcrypt = require("bcrypt");
const Session = require("../models/Session");
const Game = require("../models/Game")
const awsService = require("../services/aws/aws_instance")



exports.getUserbyId = async (req, res) => {
    const userId = req.params.UserId
    if (!userId) {
        return res.status(200).send({
            message: "Failed",
            data: "Incomplete Information"
        })
    }

    try {
        const userExists = await User.findById(userId)
        if (userExists) {
            return res.status(200).send({
                message: "Success",
                data: {
                    name: userExists.username,
                    credits: userExists.credits
                }
            })
        } else {
            return res.status(200).send({
                message: "Failed",
                data: "User not found"
            })
        }
    } catch (Err) {
        console.log(Err)
        return res.status(500).send({
            message: "Failed",
            data: "Server Error"
        })
    }

}

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({
            message: "Failed",
            error: "Incomplete Information"
        })
    }
    console.log("authenticating")
    const query = User.where({ username: username })
    try {
        const result = await query.findOne(function (err, user) {
            if (err) {
                return res.status(500).send({
                    message: "Server Error",
                    data: err.message
                })
            }
        });
        if (result) {
            return res.status(200).send({
                message: "Failed",
                data: "Username taken"
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: "Server Error",
            data: err.message
        })
    }
    //Create new user
    try {
        const hashed = await bcrypt.hashSync(password, 10);
        const newUser = new User({
            username: username,
            password: hashed
        })
        const result = await newUser.save()
        if (result) {
            return res.status(200).send({
                message: "Success",
                data: newUser._id
            })
        } else {
            return res.status(500).send({
                message: "Server Error",
                data: err.message
            })
        }



    } catch (err) {
        return res.status(500).send({
            message: "Server Error",
            data: err.message
        })
    }
}


exports.authenticate = async (req, res) => {
    const user = { username: req.body.username, password: req.body.password };
    console.log(req.body);
    if (!user.username || !user.password) {
        return res.status(400).send({
            message: "Incomplete Information"
        })
    }
    try {
        console.log("Finding user");
        const userExists = await User.findOne({
            username: user.username
        })
        if (!userExists) {
            return res.status(200).send({
                message: "Failed",
                data: "User does not exist"
            })
        }
        console.log("Found user");
        console.log(userExists)
        console.log("Compareing password");
        const passwordMatch = await bcrypt.compare(user.password, userExists.password)
        if (passwordMatch) {
            console.log("Done Compareing");
            return res.status(200).send({
                message: "Success",
                data: userExists._id
            });
        } else {
            return res.status(401).send({
                message: "Failed",
                data: "User-Password Combination wrong"
            });
        }

    } catch (error) {
        return res.status(500).send({
            message: "Server Error",
            data: err.message
        })
    }
}

exports.getAllSessions = async (req, res) => {
    const UserId = (req.params.UserId);
    if (!UserId) {
        return res.status(200).send({
            message: "Failed",
            data: "Incomplete info"
        })
    }

    console.log("Getting all sessions :", UserId)
    const query = Session.where({
        UserId: UserId
    })
    //get info from session and get game info extract data

    query.find((err, sessions) => {
        if (err) {
            console.log("No sessions found")
            return res.status(200).send({
                message: "Failed",
                data: "no sessions found"
            })
        }
        if (sessions) {
            return res.status(200).send({
                message: "Success",
                data: sessions
            })
        }
    })
}
exports.getActiveSessions = async (req, res) => {
    const UserId = (req.params.UserId);
    console.log("Getting all sessions :", UserId)
    if (!UserId) {
        return res.status(200).send({
            message: "Failed",
            data: "Incomplete info"
        })
    }

    const query = Session.where({
        UserId: UserId,
        active: true
    })
    query.find((err, sessions) => {
        if (err) {
            console.log("No sessions found")
            return res.status(200).send({
                message: "Failed",
                data: "no sessions found"
            })
        }
        if (sessions) {
            console.log("Sessions found", sessions);
            return res.status(200).send({
                message: "Success",
                data: sessions
            })
        }
    })
}

exports.endSession = async (req, res) => {
    const sessionId = (req.params.SessionId);
    if (!sessionId) {
        return res.send(404).send({
            message: "Failed",
            data: "Incomplete information"
        })
    }

    const session = await Session.findById(sessionId);
    if (session) {
        const endSession = await awsService.terminateInstances(session.instanceId);
        if (endSession === "Success") {
            // session.active = false;
            session.endTime = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
            const duration = await getDiff(session.startTime, session.endTime);
            session.duration = duration;
            await session.save();
            const returnData = {
                sessionId: session._id,
                startTime: session.startTime,
                endTime: session.endTime,
                duration: duration,
                GameId: session.GameId
            }
            res.status(200).json({
                message: "Success",
                data: returnData,
            })
        } else {
            console.log(endSession)
        }
    } else {
        return res.send(404).send({
            message: "Failed",
            data: "Session not found"
        })
    }
}

async function getDiff(a, b) {
    let duration = ((new Date(b) - new Date(a)) / 1000) / 60 //Convert to minutes
    duration = Math.round((duration + Number.EPSILON) * 100) / 100
    console.log("Duration: ", duration)
    return duration
}
