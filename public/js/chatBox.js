let profileuser = "";
let openChat = "";
let connectionIsCreated = false;
function currentUser(id) {
  if (id) profileuser = id;
}

const getUser = async (id) => {
  const user = await fetch(`http://localhost:7000/users/fetch/${id}`);
  // console.log(user);
  const a = await user.json();
  return a;
};
const chatBoxHtml = (id, liHtml) => {
  // console.log(liHtml);

  return `<div class="chatBox" id=${id.user._id}>
  <p id="chatName">${id.user.name}</p>

<ul id="chat_message_list">
${liHtml}
</ul>

<form id="chat_message_input_container" value=${id.user._id}>
  <input
    id="chat_message_input"
    name="message"
    required
    autocomplete="off"
    placeholder="Type message here"
  />
  <button type="click" id="send_message">Send</button>
</form>
</div>`;
};

const openChatBox = async (id) => {
  const data = {
    receiver_id: id,
    sender_id: profileuser,
  };
  const fetchConversation = await fetch("/message/get-conversation", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const fetchJson = await fetchConversation.json();
  let liHtml = "";
  for (msg of fetchJson.conversation.message) {
    liHtml += `<li class="${
      msg.messageOwner._id === id ? "other_message" : "self_message"
    }"><span>${msg.message}</span><p>${msg.messageOwner.name}</p></li>`;
  }

  const userResult = await getUser(id);

  const newChatBox = chatBoxHtml(userResult, liHtml);

  const chat = document.getElementById("chat");

  chat.innerHTML = newChatBox;
  const scrollChat = document.getElementById("chat_message_list");

  scrollChat.scrollBy(0, scrollChat.scrollHeight);

  if (!connectionIsCreated) {
    new ChatEngine(profileuser);
    connectionIsCreated = true;
  }
};

const mButtonHandler = () => {
  const message = document.getElementsByClassName("message");

  Array.from(message).forEach((msg) => {
    msg.addEventListener("click", async (newChat) => {
      openChat = newChat.target.attributes.id.value;
      const id = newChat.target.attributes.id.value;
      connectionIsCreated = false;
      openChatBox(id);
    });
  });
};
mButtonHandler();
