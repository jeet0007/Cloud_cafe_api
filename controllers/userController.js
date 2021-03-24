const User = require("../models/User");
const bcrypt = require("bcrypt");


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

