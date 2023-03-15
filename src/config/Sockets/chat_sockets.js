module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);
  const users = [];
  io.on("connection", function (socket) {
    console.log("New Connection received", socket.id);

    socket.on("disconnect", function () {
      socket.emit("dis", () => {
        return {
          msg: "disconnect",
        };
      });
      console.log("sockect Connection disconnect");
    });

    socket.on("start_chat", function (data) {
      console.log("joining request receive .", data);

      socket.join(data.user_Id);
      if (!users.some((users) => users === data.user_Id)) {
        users.push(data.user_Id);
      }
    });
    //   detect the send_kmessage and brodcast to everyone in the room
    socket.on("send_message", function (data) {
      // console.log(data);
      io.to(data.receiver_id).emit("receive_message", {
        message: data.message,
        user_Id: data.sender_id,
      });
      // console.log("r");

      // socket.broadcast.emit("receive_message", data);
    });
  });
};

// module.exports.chatSockets = function (socketServer) {
//   let io = require("socket.io")(socketServer);
//   io.on("connection", function (socket) {
//     console.log("New Connection received", socket.id);

//     socket.on("disconnect", function () {
//       console.log("sockect Connection disconnect");
//     });
//     socket.on("join_room", function (data) {
//       console.log("joining request receive .", data);

//       socket.join(data.chatRoom);

//       io.in(data.chatRoom).emit("user_joined", data);
//     });
//     //   detect the send_message and brodcast to everyone in the room
//     socket.on("send_message", function (data) {
//       io.in(data.chatRoom).emit("receive_message", data);
//       // socket.broadcast.emit("receive_message", data);
//     });
//   });
// };
