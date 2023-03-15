const Post = require("../../../models/post");
const Comments = require("../../../models/comments");
const index = async (request, response) => {
  const userPosts = await Post.find()
    .sort("-createdAt")
    .populate("user")
    .select("-password")
    .populate({
      path: "comments",
      populate: { path: "user" },
      options: { sort: "-createdAt" },
    });
  return response.status(200).json({
    message: "List of Posts",
    post: userPosts,
  });
};
const destroyPost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post.user == request.user.id) {
      post.remove();
      const deletePost = await Comments.deleteMany({ post: post.id });

      return response.status(200).json({
        message: "Post Delete and his all comments",
      });
    }
    return response.status(401).json({
      message: "You cannot delete post",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { index, destroyPost };
