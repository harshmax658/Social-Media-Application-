// delete comment from post
const deleteComment = async (event) => {
  event.preventDefault();

  const deleteRequest = await fetch(event.target.href, {
    method: "delete",
  });
  const receiveRequest = await deleteRequest.json();

  showNotification("Comment delete", "#FFB871");

  document.querySelector(`.comment-${receiveRequest.data._id}`).remove();
};

//Add comments methods
const addCommentOnPostWall = (data) => {
  return ` <li class="comment-${data._id}">
      <p>
      <a href="/users/profile/${data.user._id}">${data.user.name}</a> ⏬
        <span>
    
          <a class="delete-comment" href="/comments/delete-comment/${data._id}">delete</a>
         
        </span>
      </p>
      <p>${data.content}</p>
      <div class="reactBtn">
       
      </div>
      <div class="reactBtn">
        <a
          likes="0"
          class="like_btn"
          href="/likes/toggle/?id=${data._id}&type=Comment"
          >0 Likes</a
        >
       
      </div>
    </li>`;
};
const addCommentOnPost = document.getElementsByClassName("add-comment");

const addCommentOnPostWindow = async (event) => {
  event.preventDefault();
  const commentId = document.getElementById(event.target.id);

  const data = new FormData(commentId);
  const value = Object.fromEntries(data.entries());

  const addCommentOnDbRequest = await fetch(commentId.action, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(value),
  });

  const getCommentFromDb = await addCommentOnDbRequest.json();

  const mainComment = addCommentOnPostWall(getCommentFromDb.data.comment);

  const postComments = document.getElementById(
    getCommentFromDb.data.comment.post
  );

  postComments.insertAdjacentHTML("afterbegin", mainComment);
  showNotification("Comment add", "#BA60FF");

  // add click event on new added comment
  toogleHandler();

  commentId.reset();

  refreshEventListners();
};

function refreshEventListners() {
  addEventListenerOnClassButton("delete-comment", deleteComment);
  addEventListenerOnClassButton("delete-post-button", deletePost);
  addEventListenerOnClassButton(
    "add-comment",
    addCommentOnPostWindow,
    "submit"
  );
}
refreshEventListners();
