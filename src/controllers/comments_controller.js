const Comment = require("../models/comments");
const Post = require("../models/post");
const Like = require("../models/like");

const createComment = async (request, response) => {
  try {
    const findPost = await Post.findById(request.body.post);

    if (findPost) {
      const commentData = { ...request.body, user: request.user._id };
      let comment = await Comment(commentData).save();

      findPost.comments.push(comment);
      findPost.save();
      comment = await comment.populate("user", "name");
      return response.status(200).json({
        data: { comment },
        message: "Comment Create",
      });
      // return response.redirect("/");
    }

    return response.redirect("/");
  } catch (error) {
    // console.log(error);
    console.log("error");
    return response.redirect("/");
  }
};

const deleteComment = async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id);
    if (comment && comment.user == request.user.id) {
      await Post.findByIdAndUpdate(comment.id, {
        $pull: { comments: request.params.id },
      });
      comment.remove();
      await Like.deleteMany({ likable: comment._id, onModel: "Comment" });

      return response
        .status(200)
        .json({ data: comment, message: "Comment remove" });
    }
    console.log("Wrong User");
    return response.redirect("back");
  } catch (error) {
    console.log(error);
    return response.redirect("/");
  }
};

module.exports = { createComment, deleteComment };
