const mongoose = require("mongoose");

const friendshipSchema = mongoose.Schema(
  {
    //   sender
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // receiver
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestapms: true,
  }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = Friendship;
