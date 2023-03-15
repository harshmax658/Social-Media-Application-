const express = require("express");
const passport = require("passport");
const { fetchUser } = require("../controllers/fetchUser_controller");

const router = new express.Router();
const {
  profile,
  signIn,
  signUP,
  createUser,
  createSession,
  destroysession,
  update,
} = require("../controllers/users_controller");

// console.log(usersController());
router.get("/profile/:id", profile);
router.post("/update/:id", passport.checkAuthentication, update);
router.get("/sign-in", signIn);
router.get("/sign-up", signUP);
router.post("/create", createUser);
// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  createSession
);
router.get("/sign-out", destroysession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  createSession
);
router.get("/fetch/:id", fetchUser);

module.exports = router;
