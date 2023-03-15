const User = require("../models/user");

const fetchUser = async (request, response) => {
  const user = await User.findById(request.params.id).select({
    userPosts: false,
    Friendship: false,
    createdAt: false,
    updatedAt: false,
  });
  try {
    response.status(200).json({
      user,
    });
  } catch (error) {
    console.log("err");
  }
};
module.exports = { fetchUser };
