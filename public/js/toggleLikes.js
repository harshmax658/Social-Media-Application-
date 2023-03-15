const toogleHandler = () => {
  const likeButton = document.getElementsByClassName("like_btn");

  Array.from(likeButton).forEach((likeButton) => {
    likeButton.addEventListener("click", async function (e) {
      e.preventDefault();

      let likesCount = parseInt(e.target.attributes.likes.nodeValue);

      // const url = `http://localhost:8000/likes/toggle/?id=${e.target.id}`;
      const fetchData = await fetch(e.target.href, {
        method: "POST",
      });
      const fetchResult = await fetchData.json();

      if (fetchResult.data.deleted) {
        if (likesCount > 0) {
          likesCount -= 1;
        } else {
          likesCount = 0;
        }
        this.setAttribute("class", "like_btn ");
      } else {
        likesCount += 1;
        this.setAttribute("class", "like_btn liked");
      }

      this.setAttribute("likes", likesCount);
      this.innerHTML = `${likesCount} Likes`;
    });
  });
};
toogleHandler();
