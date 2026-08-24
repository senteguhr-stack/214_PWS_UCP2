require('dotenv').config();
const { Sequelize } = require('sequelize');

// Koneksi ke PostgreSQL (Supabase). Menggunakan DATABASE_URL agar mudah
// dipasang di Vercel (Environment Variables) maupun lokal (.env).
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // wajib untuk Supabase
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
