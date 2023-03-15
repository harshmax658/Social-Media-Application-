const Post = require("../models/post");
const User = require("../models/user");
const Comments = require("../models/comments");
const Like = require("../models/like");

const createNewPost = async (request, response) => {
  try {
    const post = new Post({ ...request.body, user: request.user._id });
    let result = await post.save();

    const user = await User.findById(request.user.id);
    user.userPosts.push(post);
    await user.save();

    result = await result.populate("user", "name");
    // console.log(result);
    const json = {
      data: {
        post: result,
      },
      message: "post Created",
    };

    return response
      .setHeader("Content-Type", "application/json")
      .status(200)
      .json(json);
  } catch (error) {
    console.log(error);
    return response.status(400).redirect("/");
  }
};

const destroyPost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post && post.user == request.user.id) {
      // console.log("delete");
      post.remove();
      await Like.deleteMany({ likable: post._id, onModel: "Post" });
      await Like.deleteMany({ id: { $in: post.comments } });

      await Comments.deleteMany({ post: post.id });

      return response.status(200).json({
        data: {
          post,
        },
        message: "Post Delete",
      });
      // return response.redirect("/");
    }
    console.log("Wrong User");
    return response.redirect("back");
  } catch (error) {
    console.log(error);
    return response.redirect("/");
  }
};

module.exports = { createNewPost, destroyPost };
