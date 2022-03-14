const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");

const Presentations = db.define("presentations", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  date: {
      type: Sequelize.DATE
  }
});
Presentations.beforeCreate((presentations) => (presentations.id = uuidv4()));
module.exports = Presentations;
