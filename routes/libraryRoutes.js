const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryControllers");


router.route("/{UserId}").get(libraryController.getUserLibrary);
router.route("/banner").get(libraryController.getBannerAds);

module.exports = router;
