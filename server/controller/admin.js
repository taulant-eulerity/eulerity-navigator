const { Users, UsersLeft, Presentations, Jokes, ChoreUsers, Chores, WeeklyChores } = require("../data/models");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");

require('dotenv').config()

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
  res.sendStatus(200)
};
const login = async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
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


const createAJoke = async (req, res) => {
  const { name, joke } = req.body;
  try {
    await Jokes.create({ name, joke});
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
}
const getRandomJoke = async (req, res) => {
  const jokesArray = await Jokes.findAll();
  const randomJoke = jokesArray[Math.floor(Math.random() * jokesArray.length)]
  if(!randomJoke) return res.json({})
  const {name, joke} = randomJoke
  res.json({name, joke})
}
const getAllJokes = async(_,res) => {
  const jokesArray = await Jokes.findAll();
  if(!jokesArray.length) return res.json([]);
  const jokes = jokesArray.map(j => ({name: j.name, joke: j.joke, date: new Date(j.createdAt)}))
  res.json(jokes)
}
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
const admin = (_, res) => {
  res.sendFile(path.join(__dirname, "../", "/admin/index.html"));
};


//Chores
const createChoreUser = async (req, res) => {
  const { userName } = req.body;

  const user = await ChoreUsers.findOne({ where: { name: userName } });
  if (user) return res.status(422).json("User Exists");
  await ChoreUsers.create({ name: userName });
  res.sendStatus(200)
};

const removeChoreUser = async (req, res) => {
  const { userName } = req.body;
  const alluser = await ChoreUsers.findOne({ where: { name: userName } });

  if (alluser) {
    await alluser.destroy();
    res.status(200).json("user has been removed");
    return;
  }
  res.status(422).json("User doesn't exists");
};


const createChore = async (req, res) => {
  const { type} = req.body;

  const user = await Chores.findOne({ where: { type} });
  if (user) return res.status(422).json("User Exists");
  await Chores.create({ type});
  res.sendStatus(200)
};

const removeChore = async (req, res) => {
  const { type } = req.body;
  const choreType = await Chores.findOne({ where: { type } });

  if (choreType) {
    await choreType.destroy();
    res.status(200).json("chore has been removed");
    return;
  }
  res.status(422).json("chore doesn't exists");
};

const choreUserList = async (_,res) => {
  let users = await ChoreUsers.findAll({attributes: ['name']})
  users = users.map(user => user.name)
  res.json(users)
}

const choreList = async (_,res) => {
  let chores = await Chores.findAll({attributes: ['type']})
  chores = chores.map(user => user.type)
  res.json(chores)
}

const weeklyChores = async (req,res) => {
  const { weeklyChores } = req.body;
  await WeeklyChores.create({data: weeklyChores, date: new Date()})
  res.json()
}

const displayWeeklyChores = async (req,res) => {
  let list = await WeeklyChores.findAll()
  list = list.map(item => {
    return {list: item.data, date: item.date}
  })
  res.json(list)
}


module.exports = { reloadState, getLeftUsers, presentations, createUser,
   login, logout, admin, removeUser, createAJoke, getRandomJoke, getAllJokes,
   createChoreUser,removeChoreUser, createChore, removeChore, choreUserList, choreList, weeklyChores, displayWeeklyChores
  };
