const { v4: uuidv4 } = require("uuid");


const Sequelize = require("sequelize");
const db = require("../db");

const Users = db.define("user", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

Users.beforeCreate((user) => {
  user.id = uuidv4();
});
module.exports = Users;
