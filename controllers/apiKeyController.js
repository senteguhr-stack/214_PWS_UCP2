const { ApiKey } = require('../models');
const generateApiKey = require('../utils/generateApiKey');

// GET /api/keys
async function listKeys(req, res, next) {
  try {
    const keys = await ApiKey.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: keys });
  } catch (err) {
    next(err);
  }
}

// POST /api/keys
async function createKey(req, res, next) {
  try {
    const { label } = req.body;
    const key = await ApiKey.create({
      userId: req.user.id,
      key: generateApiKey(),
      label: label || 'New Key',
    });
    res.status(201).json({ success: true, message: 'API key berhasil dibuat.', data: key });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/keys/:id/toggle
async function toggleKey(req, res, next) {
  try {
    const key = await ApiKey.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!key) return res.status(404).json({ success: false, message: 'API key tidak ditemukan.' });

    key.isActive = !key.isActive;
    await key.save();
    res.json({ success: true, message: `API key sekarang ${key.isActive ? 'aktif' : 'nonaktif'}.`, data: key });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/keys/:id
async function deleteKey(req, res, next) {
  try {
    const key = await ApiKey.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!key) return res.status(404).json({ success: false, message: 'API key tidak ditemukan.' });

    await key.destroy();
    res.json({ success: true, message: 'API key berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listKeys, createKey, toggleKey, deleteKey };
