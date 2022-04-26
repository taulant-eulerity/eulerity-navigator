const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");

const ChoreUsers = db.define("choreUsers", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
ChoreUsers.beforeCreate((choreUsers) => (choreUsers.id = uuidv4()));
module.exports = ChoreUsers;