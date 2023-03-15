const express = require("express");
const router = express.Router();

const { toggleLike } = require("../controllers/likes_controller");

router.post("/toggle", toggleLike);

module.exports = router;
