require('dotenv').config();
const { sequelize, City, WeatherRecord } = require('../models');
const citiesData = require('./citiesData');
const generateWeatherData = require('./generateWeather');

async function seed() {
  try {
    console.log('Menghubungkan ke database...');
    await sequelize.authenticate();

    console.log('Menghapus data lama (jika ada)...');
    await WeatherRecord.destroy({ where: {}, truncate: true, cascade: true });
    await City.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });

    console.log(`Menyisipkan ${citiesData.length} kota...`);
    await City.bulkCreate(citiesData);

    const weatherData = generateWeatherData(10); // 10 kota x 10 hari = 100 data
    console.log(`Menyisipkan ${weatherData.length} data cuaca...`);
    await WeatherRecord.bulkCreate(
      weatherData.map((r) => ({
        cityId: r.city_id,
        recordDate: r.record_date,
        tempMinC: r.temp_min_c,
        tempMaxC: r.temp_max_c,
        humidityPercent: r.humidity_percent,
        rainfallMm: r.rainfall_mm,
        windSpeedKph: r.wind_speed_kph,
        condition: r.condition,
      }))
    );

    console.log('Seeding selesai! Total data cuaca:', weatherData.length);
    process.exit(0);
  } catch (err) {
    console.error('Seeding gagal:', err);
    process.exit(1);
  }
}

seed();
