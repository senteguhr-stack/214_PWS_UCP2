const sequelize = require('../config/database');
const User = require('./User');
const ApiKey = require('./ApiKey');
const City = require('./City');
const WeatherRecord = require('./WeatherRecord');

// User 1 -- N ApiKey
User.hasMany(ApiKey, { foreignKey: 'userId', as: 'apiKeys', onDelete: 'CASCADE' });
ApiKey.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// City 1 -- N WeatherRecord
City.hasMany(WeatherRecord, { foreignKey: 'cityId', as: 'weatherRecords', onDelete: 'CASCADE' });
WeatherRecord.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

module.exports = {
  sequelize,
  User,
  ApiKey,
  City,
  WeatherRecord,
};
