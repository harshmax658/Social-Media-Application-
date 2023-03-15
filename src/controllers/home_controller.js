const Post = require("../models/post");
const User = require("../models/user");

const homePage = async (request, response) => {
  try {
    const userPosts = await Post.find()
      .sort("-createdAt")
      .populate([{ path: "user" }, { path: "likes" }])
      .populate({
        path: "comments",
        populate: [{ path: "user" }, { path: "likes" }],
        options: { sort: "-createdAt" },
      });
    let friends = [];
    // console.log(userPosts);
    const users = await User.find({});
    const currentUser = await User.findById(request.user).populate({
      path: "Friendship",
      populate: [{ path: "userId" }, { path: "friendId" }],
    });
    if (currentUser) {
      friends = currentUser.Friendship;
    }
    // console.log("Home");
    // console.log(request.user);
    // return response.json({
    //   currentUser,
    //   friends: friends,
    // });
    return response.render("home", {
      title: "Home Page",
      userPosts,
      user_list: users,
      friends: friends,
    });
  } catch (error) {
    console.log(error);
    return response.redirect("back");
  }
};

module.exports = { homePage };
