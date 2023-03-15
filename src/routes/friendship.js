const express = require("express");
const router = express.Router();
const { toggleFriend } = require("../controllers/friendship_controller");
router.post("/toggle", toggleFriend);
module.exports = router;
