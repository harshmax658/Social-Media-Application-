const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

const createSession = async (request, response) => {
  try {
    let user = await User.findOne({ email: request.body.email }).select(
      "password"
    );
    console.log(user);
    console.log(request.body.email);
    if (user) {
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++=");
      return response.status(200).json({
        message: "User Found",
        data: {
          token: jwt.sign(user.toJSON(), "H@rsh", { expiresIn: 100000000 }),
        },
      });
    }
    return response.status(422).json({
      message: "Invalid User",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { createSession };
