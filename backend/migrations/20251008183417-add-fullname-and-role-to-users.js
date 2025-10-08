'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the full_name column
    await queryInterface.addColumn('Users', 'full_name', {
      type: Sequelize.STRING,
      allowNull: true, // Or false if it's required
    });

    // Add the role column
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('CANDIDATE', 'RECRUITER'),
      allowNull: false,
      defaultValue: 'CANDIDATE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes
    await queryInterface.removeColumn('Users', 'full_name');
    await queryInterface.removeColumn('Users', 'role');
  }
};