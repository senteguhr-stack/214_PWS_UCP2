const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define(
  'City',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    elevationM: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'elevation_m',
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Asia/Jakarta',
    },
  },
  {
    tableName: 'cities',
    timestamps: true,
  }
);

module.exports = City;
