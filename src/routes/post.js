const express = require("express");
const passport = require("passport");
const {
  createNewPost,
  destroyPost,
} = require("../controllers/posts_controller");
const router = new express.Router();

router.post("/create-post", createNewPost);
router.delete("/destroy/:id", passport.checkAuthentication, destroyPost);

module.exports = router;
