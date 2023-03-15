const express = require("express");
const passport = require("passport");
const {
  createComment,
  deleteComment,
} = require("../controllers/comments_controller");
const router = new express.Router();

router.post("/add-comment", passport.checkAuthentication, createComment);
router.delete(
  "/delete-comment/:id",
  passport.checkAuthentication,
  deleteComment
);
// router.post("/add-comment/:id", passport.checkAuthentication, addComment);

module.exports = router;
