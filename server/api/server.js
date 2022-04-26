const express = require("express");

const cookieParser = require("cookie-parser");
const { db } = require("../data/models");
const authenticate = require("./auth");

const { reloadState, getLeftUsers, presentations, createUser, login, logout, admin, removeUser, createAJoke, getRandomJoke, getAllJokes } = require("../controller/admin");
const { navigator, userList } = require("../controller/app");

const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => res.redirect("/app"));
app.use(express.static(path.join(__dirname, "../../", "/public")));
app.use(express.static(path.join(__dirname, "../", "/admin")));

//CLIENT
//           Path          Middleware   Controller
app.post("/api/navigator", authenticate, navigator);

app.get("/api/userList", authenticate, userList);

//ADMIN
app.get("/api/reload", authenticate, reloadState);

app.get("/api/getLeftUser", authenticate, getLeftUsers);

app.get("/api/presentations", authenticate, presentations);

app.post("/api/createUser", authenticate, createUser);

app.post("/api/login", login);

app.post("/api/removeUser", authenticate, removeUser);

app.post("/api/createJoke", authenticate, createAJoke)

app.get("/api/getRandomJoke", authenticate, getRandomJoke)

app.get('/api/getAllJokes', authenticate, getAllJokes)

app.get("/api/logout", authenticate, logout);

app.get("/admin", authenticate, admin);

app.get("/app", authenticate, (_, res) => {
  res.sendFile(path.join(__dirname, "../../", "/public/index.html"));
});

app.get("/choreWheel", authenticate, (_, res) => {
  res.sendFile(path.join(__dirname, "../../", "/public/choreWheel.html"));
});

app.get("*", (_, res) => res.redirect("/admin"));

//SERVER
db.sync().then((_) => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
