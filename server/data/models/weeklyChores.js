const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");

const WeeklyChores = db.define("weeklyChores", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  date: {
      type: Sequelize.DATE
  }
});
WeeklyChores.beforeCreate((weeklyChores) => (weeklyChores.id = uuidv4()));
module.exports = WeeklyChores;