console.log("hello");
// const profilePage = document.getElementById("profilePage");
const homePagesHm = document.getElementById("homePage");

if (window.location.href.includes("http://localhost:8000/users/profile/")) {
  homePagesHm.remove();
} else {
  //   profilePage.remove();
}
