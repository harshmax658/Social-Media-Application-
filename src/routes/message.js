const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require("../controllers/message_controller");

router.post("/createMessage", createMessage);
router.post("/get-conversation", getMessages);

module.exports = router;
