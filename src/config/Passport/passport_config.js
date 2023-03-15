const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        //find a user and establish the identity
        const foundUser = await User.findOne({ email: email }).select(
          "+password"
        );

        if (foundUser && foundUser.password === password) {
          //user found and return user data

          return done(null, foundUser);
        } else {
          //there is an error in username and password

          console.log(foundUser.password);
          console.log(password);
          console.log(foundUser.password === password);
          console.log("Invalid Username/Password");
          return done(false, false);
        }
      } catch (error) {
        // Error in finding a user Data
        console.log("Error in finding User --> passport");
        return done(error);
      }
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
// deserializing the user from the key in the cookies
passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);

    if (foundUser) {
      return done(null, foundUser);
    } else {
      return done(null, false);
    }
  } catch (error) {
    console.log("Error in finding User --> passport");

    return done(null, error);
  }
});

passport.checkAuthentication = (request, response, next) => {
  // if the user is signed in then pass on the request to the next funtion(controller's action)

  if (request.isAuthenticated()) {
    return next();
  }
  return response.redirect("/users/sign-in");
};
passport.setAuthenticatedUser = (request, response, next) => {
  // request.user contains the current signed user from the session cookie and we are just sending this to the locals for the views

  if (request.isAuthenticated()) {
    response.locals.user = request.user;
  }
  next();
};
