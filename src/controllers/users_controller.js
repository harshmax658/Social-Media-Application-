const User = require("../models/user");
const fs = require("fs");
const path = require("path");

const profile = async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate([
      {
        path: "userPosts",
        options: { sort: "-createdAt" },
        populate: [
          { path: "user" },
          { path: "likes" },
          {
            path: "comments",
            populate: [{ path: "user" }, { path: "likes" }],
            options: { sort: "-createdAt" },
          },
        ],
      },
      { path: "Friendship" },
    ]);

    // return response.json({
    //   title: "User Posts",
    //   profile: user,
    //   userPosts: user.userPosts,
    // });
    return response.render("profile_page", {
      title: "User Posts",
      profile: user,
      userPosts: user.userPosts,
    });
  } catch (error) {
    console.log(error);
    return response.redirect("back");
  }
};
const update = async (request, response) => {
  try {
    if (request.user.id == request.params.id) {
      const user = await User.findById(request.params.id);

      User.uploadAvtar(request, response, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        user.name = request.body.name;
        user.email = request.body.email;

        if (request.file) {
          if (user.avatar) {
            const profilePath = path.join(__dirname, "..", user.avatar);

            if (fs.existsSync(profilePath)) {
              fs.unlinkSync(profilePath);
            }
          }
          user.avatar = User.avatarPath + "/" + request.file.filename;
        }
        user.save();
      });
      return response.redirect("back");
    }
    // }
    return response.status(401).send("Unauthorized Person");
  } catch (error) {
    console.log(error);
    return response.redirect("back");
  }
};

const signIn = (request, response) => {
  if (request.isAuthenticated()) return response.redirect("/users/profile");

  return response.render("user_signin", {
    title: "facebook|sigin",
  });
};
const signUP = (request, response) => {
  if (request.isAuthenticated()) return response.redirect("/users/profile");

  return response.render("user_signup", {
    title: "facebook|sigup",
  });
};
// get the signup Data
const createUser = async (request, response) => {
  if (request.body.password !== request.body.confirm_password) {
    console.log("wrong password");
    return response.redirect("back");
  }
  try {
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      const newUser = new User(request.body);
      try {
        const result = await newUser.save();
        console.log("User Created");
        return response.redirect("/users/sign-in");
      } catch (error) {
        console.log("Error While creating new User");
      }
    } else {
      console.log("User is already present");
      return response.redirect("/users/sign-in");
    }
  } catch (error) {
    console.log("Error");
  }

  return response.redirect("back");
};
const createSession = async (request, response) => {
  return response.redirect("/");
};

const destroysession = (request, response) => {
  request.logout();

  return response.redirect("/");
};
module.exports = {
  profile,
  signIn,
  signUP,
  createUser,
  createSession,
  destroysession,
  update,
};
// const User = require("../models/user");

// const profile = async (request, response) => {
//   const user = await User.findById(request.cookies.user_id);
//   if (user) {
//     return response.render("profile_page", {
//       title: "Facebook | Profile Page",
//       data: user,
//     });
//   }
//   return response.redirect("/users/sign-in");
// };

// const signIn = (request, response) => {
//   if (request.cookies.user_id) response.redirect("/users/profile");
//   return response.render("user_signin", {
//     title: "facebook|sigin",
//   });
// };
// const signUP = (request, response) => {
//   if (request.cookies.user_id) response.redirect("/users/profile");

//   return response.render("user_signup", {
//     title: "facebook|sigup",
//   });
// };
// // get the signup Data
// const createUser = async (request, response) => {
//   if (request.body.password !== request.body.confirm_password) {
//     console.log("wrong password");
//     return response.redirect("back");
//   }
//   try {
//     const user = await User.findOne({ email: request.body.email });

//     if (!user) {
//       const newUser = new User(request.body);
//       try {
//         const result = await newUser.save();
//         console.log("User Created");
//         return response.redirect("/users/sign-in");
//       } catch (error) {
//         console.log("Error While creating new User");
//       }
//       console.log(result);
//     } else {
//       console.log("User is already present");
//       return response.redirect("/users/sign-in");
//     }
//   } catch (error) {
//     console.log("Error");
//   }

//   return response.redirect("back");
// };
// const createSession = async (request, response) => {
//   // steps Authenticate
//   try {
//     // find the user
//     const user = await User.findOne({ email: request.body.email });
//     if (user) {
//       // if user present then check password
//       // console.log(user);
//       if (user.password === request.body.password) {
//         //redirect to profile page
//         console.log("1 crore");
//         console.log(user.id);

//         response.cookie("user_id", user.id);
//         return response.redirect("/users/profile");
//       }
//       // redirect to back if password is not correct
//       console.log("Wrong Password");
//       return response.redirect("back");
//     }
//     // redirect to back if user is not found
//     console.log("User Not Found");

//     return response.redirect("back");
//   } catch (error) {
//     console.log("Error");

//     return response.redirect("back");
//   }
// };

// const signOut = (request, response) => {
//   console.log("object");
//   response.clearCookie("user_id");
//   return response.redirect("/");
// };
// module.exports = {
//   profile,
//   signIn,
//   signUP,
//   createUser,
//   createSession,
//   signOut,
// };
