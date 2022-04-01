const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");

const Jokes = db.define("jokes", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  joke: {
    type: Sequelize.TEXT,
    unique: true,
    allowNull: false,
  },
});
Jokes.beforeCreate((joke) => (joke.id = uuidv4()));
module.exports = Jokes;
