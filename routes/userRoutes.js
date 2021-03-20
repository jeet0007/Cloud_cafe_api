const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");

router.route("/{UserId}").get(userControllers.getUserbyId);
router.route("/register").post(userControllers.register);
router.route("/auth").post(userControllers.authenticate);

module.exports = router;