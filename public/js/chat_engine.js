async function appendMessage(data, type = "other_message", a) {
  const userData = await getUser(data.user_Id);
  const { name } = userData.user;
  let newMessage = document.createElement("li");
  let msg_type = type;

  let span = document.createElement("span");
  let p = document.createElement("p");

  newMessage.setAttribute("class", msg_type);
  span.innerHTML = data.message;
  p.innerHTML = name;
  newMessage.appendChild(span);
  newMessage.appendChild(p);

  const chat_message_list = document.getElementById("chat_message_list");
  chat_message_list.append(newMessage);
  const scrollChat = document.getElementById("chat_message_list");

  scrollChat.scrollBy(0, scrollChat.scrollHeight);
}

// ===> function 2
const sendChat = async (socket, chatData, userId) => {
  const msg = document.getElementById("chat_message_input").value;
  const receiverId = chatData.attributes.value.value;

  if (msg != "") {
    const data = { message: msg, receiver_id: receiverId, sender_id: userId };

    const req = await fetch("/message/createMessage", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    await req.json();

    socket.emit("send_message", data);
  }

  const newDatas = {
    message: msg,
    receiver_id: receiverId,

    user_Id: userId,
  };

  appendMessage(newDatas, "self_message");
  connectionIsCreated = true;

  // console.log("openChat ", openChat);
  chatData.reset();
};

class ChatEngine {
  constructor(userId) {
    this.userId = userId;

    this.socket = io.connect("http://localhost:8000"); //-->  io.sockets.on('connection',function()) backend

    if (this.userId) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    const self = this;
    let c = true;

    this.socket.on("connect", function () {
      console.log("Connection Established using Sockets ....!");

      self.socket.emit("start_chat", {
        user_Id: self.userId,
      });

      self.socket.on("user_joined", function (data) {});
      self.socket.on("dis", function (data) {
        console.log("user left");
      });
    });

    const chatData = document.getElementById("chat_message_input_container");

    if (chatData)
      chatData.addEventListener("submit", (e) => {
        e.preventDefault();
        sendChat(self.socket, chatData, self.userId);
      });

    self.socket.on("receive_message", function (data) {
      const id = document.getElementById(openChat);

      if (
        (connectionIsCreated && id.attributes.id.value === data.user_Id) ||
        openChat === data.user_Id
      ) {
        appendMessage(data, "other_message");

        // console.log("1");
      } else {
        openChatBox(data.user_Id);

        openChat = data.user_Id;
        setTimeout(() => {
          // appendMessage(data, "other_message", "2nd");

          const newChat = document.getElementById(
            "chat_message_input_container"
          );
          newChat.addEventListener("submit", (e) => {
            e.preventDefault();
            sendChat(self.socket, chatData, self.userId);
            newChat.reset();
          });
        }, 300);
        // console.log("2");

        connectionIsCreated = true;
      }
    });
  }
}

/**
  (e) => {
        e.preventDefault();

        const msg = document.getElementById("chat_message_input").value;
        const receiverId = chatData.attributes.value.value;

        if (msg != "") {
          self.socket.emit("send_message", {
            message: msg,
            receiver_id: receiverId,
            sender_id: self.userId,
          });
        }
        const data = {
          message: msg,
          user_Id: self.userId,
        };
        // console.log(data);
        appendMessage(data, "self_message");

        console.log("openChat ", openChat);
        chatData.reset();
      }
 */
// class ChatEngine {
//   constructor(chatBoxId, userEmail) {
//     this.chatBox = `#${chatBoxId}`;
//     this.userEmail = userEmail;

//     this.socket = io.connect("http://localhost:8000", {
//       transports: ["websocket"],
//     }); //-->  io.sockets.on('connection',function()) backend

//     if (this.userEmail) {
//       this.connectionHandler();
//     }
//   }
//   connectionHandler() {
//     const self = this;
//     this.socket.on("connect", function () {
//       console.log("Connection Established using Sockets ....!");

//       self.socket.emit("join_room", {
//         user_email: self.userEmail,
//         chatRoom: "fbRoom",
//       });

//       self.socket.on("user_joined", function (data) {
//         // console.log("A user Joined <", data);
//       });
//     });

//     const chatData = document.getElementById("chat_message_input_container");
//     chatData.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const msg = document.getElementById("chat_message_input").value;

//       if (msg != "") {
//         // console.log("message Depart");

//         self.socket.emit("send_message", {
//           message: msg,
//           user_email: self.userEmail,
//           chatRoom: "fbRoom",
//         });
//       }
//       const c = document.getElementById("chatBox");

//       // s.scrollBy({ top: 900, left: 100, behavior: "smooth" });
//       // s.scrollTop = s.scrollHeight;
//       // for (let i = 0; i <= s.scrollHeight + 1000; ++i) {}
//       chatData.reset();
//     });
//     self.socket.on("receive_message", function (data) {
//       console.log("message received", data.message);
//       let newMessage = document.createElement("li");
//       let msg_type = "other_message";

//       if (data.user_email == self.userEmail) {
//         msg_type = "self_message";
//       }
//       let span = document.createElement("span");
//       let p = document.createElement("p");

//       newMessage.setAttribute("class", msg_type);
//       span.innerHTML = data.message;
//       p.innerHTML = data.user_email;
//       newMessage.appendChild(span);
//       newMessage.appendChild(p);

//       const chat_message_list = document.getElementById("chat_message_list");
//       chat_message_list.append(newMessage);
//       const scrollChat = document.getElementById("chat_message_list");

//       scrollChat.scrollBy(0, scrollChat.scrollHeight);
//     });
//   }
// }
