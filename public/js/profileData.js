const avatar = document.getElementById("avatar");

avatar.addEventListener("change", (event) => {
  const filess = document.getElementById("avatar");
  console.log(filess.files);
  var file = document.getElementById("avatar").files;
  if (file.length > 0) {
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      document
        .getElementById("preview")
        .setAttribute("src", event.target.result);
    };
    fileReader.readAsDataURL(file[0]);
  }
});
// previewImage();
