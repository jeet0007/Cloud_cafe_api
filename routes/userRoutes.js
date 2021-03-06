const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");

router.route("/:UserId").get(userControllers.getUserbyId);
router.route("/activeSessions/:UserId").get(userControllers.getActiveSessions);
router.route("/Enddedsessions/:UserId").get(userControllers.getEnddedSessions);
router.route("/sessions/:UserId").get(userControllers.getAllSessions);
router.route("/getSession/:SessionId").get(userControllers.getSessionById);
router.route("/register").post(userControllers.register);
router.route("/auth").post(userControllers.authenticate);
router.route("/endsession/:SessionId").get(userControllers.endSession);


module.exports = router;