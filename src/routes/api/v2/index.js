const express = require("express");
const router = express.Router();

router.use("/user", require("./profile"));

module.exports = router;
