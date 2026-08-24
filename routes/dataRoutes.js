const express = require('express');
const router = express.Router();
const { listCities, getCity } = require('../controllers/cityController');
const { listWeather, getWeather, getCityStats } = require('../controllers/weatherController');
const authApiKey = require('../middleware/authApiKey');

router.use(authApiKey); // semua endpoint data wajib pakai x-api-key

router.get('/cities', listCities);
router.get('/cities/:id', getCity);

router.get('/weather/stats/:cityId', getCityStats); // taruh sebelum /:id agar tidak bentrok
router.get('/weather', listWeather);
router.get('/weather/:id', getWeather);

module.exports = router;
