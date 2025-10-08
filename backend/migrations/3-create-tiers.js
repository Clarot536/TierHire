'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tiers', {
      tier_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      domain_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Domains', // This is the table name
          key: 'domain_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tier_level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tier_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      max_slots: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tiers');
  }
};