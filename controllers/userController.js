const User = require("../models/User");
const bcrypt = require("bcrypt");
const Session = require("../models/Session");
const awsService = require("../services/aws/aws_instance")



exports.getUserbyId = async (req, res) => {

}

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({
            message: "Failed",
            error: "Incomplete Information"
        })
    }

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
        const result = await newUser.save(function (err, data) {
            if (err) {
                return res.status(500).send({
                    message: "Server Error",
                    data: err.message
                })
            }
            if (data) {
                return res.status(200).redirect("/sign-in")
            }
        })
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

            return res.status(400).send({
                message: "Failed",
                data: "User does not exist"
            })
        }
        console.log("Found user");
        console.log(userExists)
        console.log("Compareing password");
        if (await bcrypt.compare(user.password, userExists.password)) {
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
        await awsService.terminateInstances(session.instanceId);
        res.status(200).send({
            message: "Success",
            data: session
        })
    } else {
        return res.send(404).send({
            message: "Failed",
            data: "Session not found"
        })
    }

}



