const express = require("express");
const router = express.Router();
const gameControllers = require("../controllers/gameControllers");

router.route("/").get(gameControllers.getAllGames);

module.exports = router;
