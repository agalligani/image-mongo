const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/images");

router.route('/')
    .post(imagesController.postImages)

module.exports = router;