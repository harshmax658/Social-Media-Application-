const express = require("express");
const router = express.Router();
const { profile } = require("../../../controllers/api/v2/profile_api");
router.get("/profile", profile);
module.exports = router;
