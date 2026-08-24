const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherRecord = sequelize.define(
  'WeatherRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_id',
    },
    recordDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'record_date',
    },
    tempMinC: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      field: 'temp_min_c',
    },
    tempMaxC: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      field: 'temp_max_c',
    },
    humidityPercent: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      field: 'humidity_percent',
    },
    rainfallMm: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: false,
      field: 'rainfall_mm',
    },
    windSpeedKph: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: false,
      field: 'wind_speed_kph',
    },
    condition: {
      type: DataTypes.ENUM(
        'cerah',
        'berawan',
        'hujan_ringan',
        'hujan_lebat',
        'badai',
        'berkabut'
      ),
      allowNull: false,
    },
  },
  {
    tableName: 'weather_records',
    timestamps: true,
    indexes: [
      { fields: ['city_id', 'record_date'], unique: true },
    ],
  }
);

module.exports = WeatherRecord;
