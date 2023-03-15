const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    userPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    avatar: {
      type: String,
    },
    Friendship: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friendship",
      },
    ],
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (request, file, cb) {
    const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// static Methods
userSchema.statics.uploadAvtar = multer({ storage: storage }).single("avatar");
userSchema.statics.uploadWall = multer({ storage: storage }).single("wall");
userSchema.statics.avatarPath = AVATAR_PATH;
// console.log(path.join(__dirname, "..", AVATAR_PATH));
const User = mongoose.model("User", userSchema);

module.exports = User;
