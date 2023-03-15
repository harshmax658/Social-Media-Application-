const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://harshmax658:harsh17@cluster0.thqbwen.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Server configuration set Succesfully.... "))
  .catch((e) => {
    console.log(e);
    console.log("Oops.. There is an error in db Congig");
  });
