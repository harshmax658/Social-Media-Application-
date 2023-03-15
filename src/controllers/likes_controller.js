const Like = require("../models/like");
const Comment = require("../models/comments");
const Post = require("../models/post");

const toggleLike = async (request, response) => {
  try {
    //likes/toggle/?id=asas&type=Post
    let likeable;
    let isDelete = false;

    if (request.query.type === "Post") {
      likeable = await Post.findById(request.query.id);
    } else {
      likeable = await Comment.findById(request.query.id);
    }
    const isLikeExist = await Like.findOne({
      user: request.user._id,
      likeable: request.query.id,
      onModel: request.query.type,
    });

    if (isLikeExist) {
      likeable.likes.pull(isLikeExist._id);
      likeable.save();

      isLikeExist.remove();
      isDelete = true;
    } else {
      let newLike = await Like({
        user: request.user._id,
        likeable: request.query.id,
        onModel: request.query.type,
      });
      await newLike.save();
      likeable.likes.push(newLike._id);
      await likeable.save();
    }
    console.log("Like add");
    return response.status(200).json({
      message: "Request Succesfull",
      data: {
        deleted: isDelete,
      },
    });
  } catch (e) {
    console.log(e);
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
};
module.exports = { toggleLike };
