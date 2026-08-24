'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('api_keys', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      key: { type: Sequelize.STRING, allowNull: false, unique: true },
      label: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Default Key' },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      request_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      last_used_at: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, field: 'createdAt' },
      updatedAt: { type: Sequelize.DATE, allowNull: false, field: 'updatedAt' },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('api_keys');
  },
};
