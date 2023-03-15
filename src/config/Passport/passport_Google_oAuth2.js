const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../../models/user");

//tell passport to use a new Strategy for google Login
console.log("G1");
passport.use(
  new googleStrategy(
    {
      clientID: `226339715898-sgdkpdnc5gibbe80hhkna52jegdqj23j.apps.googleusercontent.com`,
      clientSecret: "g5bMIWNDjRb42lBddbnc0Qcu",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("G2");
        //   find a user if found set this user as req.user
        const userProfile = await User.findOne({
          email: profile.emails[0].value,
        });
        console.log(profile);
        if (userProfile) {
          //   console.log(userProfile);
          return done(null, userProfile);
        }
        // if not found create the user set it as req.user
        const newProfile = User({
          email: profile.emails[0].value,
          name: profile.displayName,
          password: crypto.randomBytes(20).toString("hex"),
        });
        try {
          await newProfile.save();
          return done(null, newProfile);
        } catch (error) {
          console.log("Error While creating new User");
        }
        return done(null, false);
      } catch (error) {
        console.log("Error in google Starategy-passport");
        return;
      }
    }
  )
);

module.exports = passport;
