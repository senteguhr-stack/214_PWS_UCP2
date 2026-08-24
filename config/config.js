require('dotenv').config();

// File ini khusus dipakai oleh sequelize-cli (npx sequelize-cli db:migrate)
// Untuk koneksi runtime aplikasi, lihat config/database.js
const base = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
