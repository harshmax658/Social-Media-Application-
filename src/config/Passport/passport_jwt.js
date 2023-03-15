const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; //helps us to extract jwt from the header part
const User = require("../../models/user");

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "H@rsh",
};

passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      console.log(jwtPayload);
      const user = await User.findById(jwtPayload._id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.log("Error");
      return;
    }
  })
);

module.exports = passport;
