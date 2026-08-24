const { WeatherRecord, City, sequelize } = require('../models');
const { Op } = require('sequelize');

async function listWeather(req, res, next) {
  try {
    const { city_id, date_from, date_to, condition } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (city_id) where.cityId = city_id;
    if (condition) where.condition = condition;
    if (date_from || date_to) {
      where.recordDate = {};
      if (date_from) where.recordDate[Op.gte] = date_from;
      if (date_to) where.recordDate[Op.lte] = date_to;
    }

    const { rows, count } = await WeatherRecord.findAndCountAll({
      where,
      limit,
      offset,
      order: [['recordDate', 'DESC']],
      include: [{ model: City, as: 'city', attributes: ['id', 'name', 'province'] }],
    });

    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
}

async function getWeather(req, res, next) {
  try {
    const record = await WeatherRecord.findByPk(req.params.id, {
      include: [{ model: City, as: 'city', attributes: ['id', 'name', 'province'] }],
    });
    if (!record) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

async function getCityStats(req, res, next) {
  try {
    const cityId = req.params.cityId;
    const city = await City.findByPk(cityId);
    if (!city) return res.status(404).json({ success: false, message: 'Kota tidak ditemukan.' });

    const stats = await WeatherRecord.findOne({
      where: { cityId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRecords'],
        [sequelize.fn('AVG', sequelize.col('temp_min_c')), 'avgTempMin'],
        [sequelize.fn('AVG', sequelize.col('temp_max_c')), 'avgTempMax'],
        [sequelize.fn('MAX', sequelize.col('temp_max_c')), 'highestTemp'],
        [sequelize.fn('MIN', sequelize.col('temp_min_c')), 'lowestTemp'],
        [sequelize.fn('AVG', sequelize.col('humidity_percent')), 'avgHumidity'],
        [sequelize.fn('SUM', sequelize.col('rainfall_mm')), 'totalRainfallMm'],
        [sequelize.fn('AVG', sequelize.col('wind_speed_kph')), 'avgWindSpeed'],
      ],
      raw: true,
    });

    const conditionBreakdown = await WeatherRecord.findAll({
      where: { cityId },
      attributes: ['condition', [sequelize.fn('COUNT', sequelize.col('condition')), 'count']],
      group: ['condition'],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        city: { id: city.id, name: city.name, province: city.province },
        stats,
        conditionBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listWeather, getWeather, getCityStats };
