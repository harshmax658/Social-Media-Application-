const flashMessage = document.getElementById("flashMessage");
const showNotification = (message, color) => {
  flashMessage.innerText = message;
  flashMessage.style.display = "flex";
  flashMessage.style.backgroundColor = color;
  setTimeout(() => {
    flashMessage.style.display = "none";
  }, 2500);
};

const addEventListenerOnClassButton = (id, method, eventName = "click") => {
  // console.log(method);
  const event = document.getElementsByClassName(id);

  // Add eventListener on ever delete Button
  Array.from(event).forEach((button) => {
    button.addEventListener(eventName, method);
  });
};

// delete post from dom
const deletePost = async (event) => {
  event.preventDefault();
  console.log("aya");
  const deleteRequest = await fetch(event.target.href, {
    method: "delete",
  });
  const receiveRequest = await deleteRequest.json();
  showNotification("Post Delete", "#fa5077");

  document.querySelector(`.post-${receiveRequest.data.post._id}`).remove();
};

// grab a delete link by class name

const addPostInDom = (data) => {
  return `
  <div class="post_container post-${data._id} ">
  <div class="post">
  
  <p>
  <a href="/users/profile/${data.user._id}">${data.user.name}</a>
  <span>▶Post</span>
  
  <span>
  <a class="delete-post-button" href="/post/destroy/${data._id}"> Delete</a>
  </span>
  
  </p>
  <p>${data.content}</p>
  <div class="reactBtn">
  <a
  id="likesCounter"
    likes="0"
    class="like_btn"
    href="/likes/toggle/?id=${data._id}&type=Post"
    >0 Likes</a
  ></div>
  </div>
  
  <div class="comments" >

  <form class="add-comment" id="comment-${data._id} " action="/comments/add-comment" method="post">
      <input type="text" name="content" required placeholder="Add Comment....." />
      <input type="hidden" name="post" value="${data._id}" />
  
      <input type="submit" value="add comment" />
    </form>
  </div>

  <div class="post_comments_list">
  <ul class="post_comments" id=${data._id}>
   
  </ul>
</div>
       


  </div>`;
};

const addPost = document.getElementById("add_post");

addPost.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(addPost);
  const value = Object.fromEntries(data.entries());

  fetch("/post/create-post", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(value),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const newPost = addPostInDom(data.data.post);

      const postsContainer = document.querySelector("#posts");

      postsContainer.insertAdjacentHTML("afterbegin", newPost);
      showNotification("Post Added", "green");
      // add click event on new addes post
      toogleHandler();
      console.log("refresh Call");
      refreshEventListners();

      addPost.reset();
    })
    .catch(function (data) {
      console.log(data);
    });
});
