const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("./config/DB/config");
//used for session cookie
const session = require("express-session");
const passport = require("passport");
require("./config/Passport/passport_config");
require("./config/Passport/passport_jwt");
require("./config/Passport/passport_Google_oAuth2");

const expressLayouts = require("express-ejs-layouts");
const MongoStore = require("connect-mongo");

const app = express();
const staticPath = path.join(__dirname, "../public");
app.use("/uploads", express.static(__dirname + "/uploads"));

// setup the chat server to be used with socket.io
const server = require("http").createServer(app);

require("./config/Sockets/chat_sockets").chatSockets(server);
// server.listen(5000);

// const sassMiddleware = require("node-sass-middleware");

// app.use(
//   sassMiddleware({
//     /* Options */
//     src: `${staticPath}/scss`,
//     dest: `${staticPath}/css`,
//     debug: false,
//     outputStyle: "extended",
//     prefix: "/css", // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
//   })
// );

const port = 7000;
const viewPath = path.join(__dirname, "./templates/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(expressLayouts);

app.use(express.static(staticPath));

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setup a view engine
app.set("view engine", "ejs");
app.set("views", viewPath);

// mongo store is used to store the session cookie in db
app.use(
  session({
    name: "faceBook",
    //todo before deployement
    secret: "harsh",
    saveUninitialized: false,
    resave: false,
    // cookie: { maxAge: 1000 * 60 * 1 },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/socialmedia",
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// use express router
app.disable("etag");

app.use("/", require("./routes"));

server.listen(port, (error) => {
  if (error) {
    console.log("Error", error);
    return;
  }
  console.log(
    `Server start on port ${port} and running on this http://localhost:${port}/`
  );
});
