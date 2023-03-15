const friendData = document.getElementById("friend_Request_Handler");
friendData.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    console.log(e.target.href);

    const fetchData = await fetch(e.target.href, {
      method: "POST",
    });

    const fetchJsondata = await fetchData.json();

    if (fetchJsondata.data.mutual) {
      friendData.innerHTML = "Friends ✔";
    } else {
      friendData.innerHTML = "Sent Request";
    }
    console.log(fetchJsondata);
  } catch (error) {
    console.log(error);
    console.log("error");
  }
});
