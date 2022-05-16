const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");

const SelectedChoreUsers = db.define("selectedChoreUsers", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
      type: Sequelize.DATE
  }
});
SelectedChoreUsers.beforeCreate((selectedChoreUsers) => (selectedChoreUsers.id = uuidv4()));
module.exports = SelectedChoreUsers;
