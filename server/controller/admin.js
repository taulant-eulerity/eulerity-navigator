const { Users, UsersLeft, Presentations } = require("../data/models");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken")

const reloadState = async (_, res) => {
  let users = await await Users.findAll();
  await UsersLeft.destroy({ where: {}, truncate: true });
  await Presentations.destroy({ where: {}, truncate: true });
  users = users.map((user) => ({ name: user.name, id: uuidv4() }));
  await UsersLeft.bulkCreate(users);
  res.status(200).json("reload success");
};

const getLeftUsers = async (_, res) => {
  let leftusers = await UsersLeft.findAll({ attributes: ["name"] });
  leftusers = leftusers.map((user) => user.name);
  if (!leftusers.length) {
    let users = await Users.findAll();
    users = users.map((user) => ({ name: user.name, id: uuidv4() }));
    await UsersLeft.bulkCreate(users);
    users = users.map((user) => user.name);
    res.json(users);
    return;
  }
  res.json(leftusers);
};

const presentations = async (_, res) => {
  let presentations = await Presentations.findAll();
  presentations = presentations.map((user) => ({ name: user.name, date: user.date }));
  res.json(presentations);
};

const createUser = async (req, res) => {
  const { userName } = req.body;

  const user = await Users.findOne({ where: { name: userName } });
  if (user) return res.status(422).json("User Exists");
  await Users.create({ name: userName });
  await UsersLeft.create({ name: userName });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (username === "tali" && password === "123") {
    const user = { name: username};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
    return;
  }
  res.sendStatus(401);
};

const logout = async (_, res) => {
  res.clearCookie("accessToken");
  res.end();
};

const admin = (_, res) => {
    res.sendFile(path.join(__dirname, "../", "/admin/index.html"));
};

const removeUser = async (req, res) => {
  const { userName } = req.body;

  const userleft = await UsersLeft.findOne({ where: { name: userName } });
  const alluser = await Users.findOne({ where: { name: userName } });

  if (userleft) await userleft.destroy();
  if (alluser) {
    await alluser.destroy();
    res.status(200).json("user has been removed");
    return;
  }
  res.status(422).json("User doesn't exists");
};

module.exports = { reloadState, getLeftUsers, presentations, createUser, login, logout, admin, removeUser };
