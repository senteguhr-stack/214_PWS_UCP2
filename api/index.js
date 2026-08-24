const app = require('../app');

// Saat dijalankan lokal (node api/index.js), buka port biasa.
// Saat di Vercel, module.exports = app akan otomatis dibungkus sebagai serverless function.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`IklimAPI berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
