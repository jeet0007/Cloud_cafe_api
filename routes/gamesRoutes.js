const express = require("express");
const router = express.Router();
const gameControllers = require("../controllers/gameControllers");


router.route("/").get(gameControllers.getAllGames);
router.route("/:id").get(gameControllers.getGameById);
router.route("/play").post(gameControllers.playGame);

module.exports = router;
