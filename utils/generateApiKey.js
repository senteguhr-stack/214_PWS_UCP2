const { v4: uuidv4 } = require('uuid');

/**
 * Menghasilkan API key dengan format mirip layanan SaaS pada umumnya,
 * contoh: iklim_live_3f9a1c2e4b7d4e6f8a9b0c1d2e3f4a5b
 */
function generateApiKey() {
  const raw = uuidv4().replace(/-/g, '');
  return `iklim_live_${raw}`;
}

module.exports = generateApiKey;
