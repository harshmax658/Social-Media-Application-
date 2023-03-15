const User = require("../models/user");
const Friendship = require("../models/friendship");

const checkFriends = async (senderuser, receiverUser) => {
  return (isFriend = await Friendship.findOne({
    userId: senderuser._id,
    friendId: receiverUser.id,
  }));
};

const toggleFriend = async (request, response) => {
  try {
    let mutual = false;
    const senderuser = await User.findById(request.user._id);
    const receiverUser = await User.findById(request.query.id);
    //
    console.log("aaraha hai");

    if (senderuser && receiverUser) {
      let checkRequest = await checkFriends(senderuser, receiverUser);

      if (checkRequest) {
        await senderuser.Friendship.pull(checkRequest._id);
        await receiverUser.Friendship.pull(checkRequest._id);
        await checkRequest.remove();
        await senderuser.save();
        await receiverUser.save();

        return response.status(200).json({
          message: "Friend Remove",
          data: {
            mutual,
          },
        });
      } else {
        checkRequest = await checkFriends(receiverUser, senderuser);
        if (checkRequest) {
          await senderuser.Friendship.pull(checkRequest._id);
          await receiverUser.Friendship.pull(checkRequest._id);
          await checkRequest.remove();
          await senderuser.save();
          await receiverUser.save();
          console.log("2");

          return response.status(200).json({
            message: "Friend Remove",
            data: {
              mutual,
            },
          });
        }
      }

      const createFriends = Friendship({
        userId: senderuser._id,
        friendId: receiverUser.id,
      });
      console.log();
      senderuser.Friendship.push(createFriends);
      receiverUser.Friendship.push(createFriends);

      await createFriends.save();
      await senderuser.save();
      await receiverUser.save();
      mutual = true;

      return response.status(200).json({
        message: "request sent to user",
        data: {
          mutual,
        },
      });
    }
  } catch (error) {
    return response.status(400).json({
      message: "Internel Server Error",
    });
  }
};
module.exports = { toggleFriend };
