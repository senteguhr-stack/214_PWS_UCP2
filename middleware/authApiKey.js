const { ApiKey } = require('../models');

async function authApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key tidak ditemukan. Sertakan header x-api-key.',
    });
  }

  try {
    const keyRecord = await ApiKey.findOne({ where: { key: apiKey } });

    if (!keyRecord) {
      return res.status(401).json({ success: false, message: 'API key tidak valid.' });
    }

    if (!keyRecord.isActive) {
      return res.status(403).json({ success: false, message: 'API key sudah dinonaktifkan.' });
    }

    keyRecord.requestCount += 1;
    keyRecord.lastUsedAt = new Date();
    await keyRecord.save();

    req.apiKey = keyRecord;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Gagal memverifikasi API key.' });
  }
}

module.exports = authApiKey;
