'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cities', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      province: { type: Sequelize.STRING, allowNull: false },
      latitude: { type: Sequelize.DECIMAL(9, 6), allowNull: false },
      longitude: { type: Sequelize.DECIMAL(9, 6), allowNull: false },
      elevation_m: { type: Sequelize.INTEGER, allowNull: false },
      population: { type: Sequelize.INTEGER, allowNull: false },
      timezone: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Asia/Jakarta' },
      createdAt: { type: Sequelize.DATE, allowNull: false, field: 'createdAt' },
      updatedAt: { type: Sequelize.DATE, allowNull: false, field: 'updatedAt' },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('cities');
  },
};
