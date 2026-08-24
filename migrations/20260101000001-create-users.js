'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      plan: {
        type: Sequelize.ENUM('free', 'pro', 'business'),
        allowNull: false,
        defaultValue: 'free',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, field: 'createdAt' },
      updatedAt: { type: Sequelize.DATE, allowNull: false, field: 'updatedAt' },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
