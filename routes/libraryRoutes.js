const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryControllers");


router.route("/{UserId}").get(libraryController.getUserLibrary);

module.exports = router;
