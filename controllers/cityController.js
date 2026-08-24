const { City } = require('../models');
const { Op } = require('sequelize');

async function listCities(req, res, next) {
  try {
    const { province, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (province) where.province = { [Op.iLike]: `%${province}%` };
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const { rows, count } = await City.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
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

async function getCity(req, res, next) {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: 'Kota tidak ditemukan.' });
    res.json({ success: true, data: city });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCities, getCity };
