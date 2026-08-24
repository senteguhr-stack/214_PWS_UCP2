'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('weather_records', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cities', key: 'id' },
        onDelete: 'CASCADE',
      },
      record_date: { type: Sequelize.DATEONLY, allowNull: false },
      temp_min_c: { type: Sequelize.DECIMAL(4, 1), allowNull: false },
      temp_max_c: { type: Sequelize.DECIMAL(4, 1), allowNull: false },
      humidity_percent: { type: Sequelize.DECIMAL(4, 1), allowNull: false },
      rainfall_mm: { type: Sequelize.DECIMAL(6, 1), allowNull: false },
      wind_speed_kph: { type: Sequelize.DECIMAL(5, 1), allowNull: false },
      condition: {
        type: Sequelize.ENUM(
          'cerah',
          'berawan',
          'hujan_ringan',
          'hujan_lebat',
          'badai',
          'berkabut'
        ),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, field: 'createdAt' },
      updatedAt: { type: Sequelize.DATE, allowNull: false, field: 'updatedAt' },
    });
    await queryInterface.addIndex('weather_records', ['city_id', 'record_date'], {
      unique: true,
      name: 'weather_records_city_date_unique',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('weather_records');
  },
};
