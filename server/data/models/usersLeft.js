const Sequelize = require("sequelize");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const UsersLeft = db.define("usersleft", {
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
UsersLeft.beforeCreate((usersleft) => (usersleft.id = uuidv4()));
module.exports = UsersLeft;
