const { ApiKey } = require('../models');

/**
 * Melindungi endpoint data (produk utama SaaS ini).
 * Membaca API key dari header: x-api-key
 * Setiap request yang berhasil akan menaikkan request_count (untuk usage tracking).
 */
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

    // Usage tracking sederhana
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
