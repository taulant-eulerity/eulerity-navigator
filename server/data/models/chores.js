const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");

const Chores = db.define("chores", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
Chores.beforeCreate((chores) => (chores.id = uuidv4()));
module.exports = Chores;