const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

const createMessage = async (request, response) => {
  try {
    const { receiver_id, sender_id, message } = request.body;

    const conversation = await Conversation.findOne({
      members: { $all: [sender_id, receiver_id] },
    });

    const msg = Message({
      messageOwner: sender_id,
      message,
    });
    await msg.save();
    if (conversation) {
      conversation.message.push(msg);
      await conversation.save();
      return response.status(200).json({
        message: "mesage send",
      });
    }
    if (!conversation) {
      const newConversation = Conversation({
        members: [receiver_id, sender_id],
      });
      newConversation.message.push(msg);
      await newConversation.save();
    }

    return response.status(200).json({
      message: "create",
    });
  } catch (error) {
    console.log("Error");
    console.log(error);
    return response.status(400).json({
      message: "Internal server Error",
    });
  }
};
const getMessages = async (request, response) => {
  try {
    const { receiver_id, sender_id } = request.body;

    const conversation = await Conversation.findOne({
      members: { $all: [receiver_id, sender_id] },
    }).populate([
      { path: "message", populate: { path: "messageOwner" } },
      { path: "members", select: ["name", "email"] },
    ]);

    // console.log(conversation);
    if (conversation) {
      return response.status(200).json({
        message: "data found",
        conversation,
      });
    }
    return response.status(400).json({
      message: "user dowes not exist",
    });
  } catch (error) {}
};

module.exports = { createMessage, getMessages };
//   // const conversation = Conversation.findOne({ members: { $all: [1, 2] } });

// const msg = Message({
//   messageOwner: request.body.id,
//   message: request.body.message,
// });
// await msg.save();
// if (conversation) {
//   conversation.message.push(msg);
//   await conversation.save();
//   return;
// }
// const conversation = Conversation({ members: {} });
