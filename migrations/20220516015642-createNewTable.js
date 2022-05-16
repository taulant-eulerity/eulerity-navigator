'use strict';
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('selectedChoreUsers', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.dropTable('selectedChoreUsers');
  }
};
