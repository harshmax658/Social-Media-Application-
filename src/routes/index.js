const express = require("express");
const router = express.Router();

const { homePage } = require("../controllers/home_controller");

router.get("/", homePage);
router.use("/users", require("./users"));
// Routes for post
router.use("/post", require("./post"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));
router.use("/api", require("./api"));
router.use("/friendship", require("./friendship"));
router.use("/message", require("./message"));

module.exports = router;
