const express = require("express");
const passport = require("passport");
const router = express.Router();
const { index, destroyPost } = require("../../../controllers/api/v1/posts_api");
router.get("/", index);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  destroyPost
);

module.exports = router;
