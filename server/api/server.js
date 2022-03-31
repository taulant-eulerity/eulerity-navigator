const express = require("express");

const cookieParser = require("cookie-parser");
const { db } = require("../data/models");
const authenticateToken = require("./auth");

const { reloadState, getLeftUsers, presentations, createUser, login, logout, admin, removeUser } = require("../controller/admin");
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
app.post("/api/navigator", authenticateToken, navigator);

app.get("/api/userList", authenticateToken, userList);

//ADMIN
app.get("/api/reload", authenticateToken, reloadState);

app.get("/api/getLeftUser", authenticateToken, getLeftUsers);

app.get("/api/presentations", authenticateToken, presentations);

app.post("/api/createUser", authenticateToken, createUser);

app.post("/api/login", login);

app.post("/api/removeUser", authenticateToken, removeUser);

app.get("/admin", authenticateToken, admin);

app.get("/api/logout", authenticateToken, logout);

app.get("/app", authenticateToken, (_, res) => {
  res.sendFile(path.join(__dirname, "../../", "/public/index.html"));
});

app.get("*", (req, res) => res.redirect("/app"));

//SERVER
db.sync().then((_) => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
