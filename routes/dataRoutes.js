const express = require('express');
const router = express.Router();
const { listCities, getCity } = require('../controllers/cityController');
const { listWeather, getWeather, getCityStats } = require('../controllers/weatherController');
const authApiKey = require('../middleware/authApiKey');

router.use(authApiKey); 

router.get('/cities', listCities);
router.get('/cities/:id', getCity);

router.get('/weather/stats/:cityId', getCityStats); 
router.get('/weather', listWeather);
router.get('/weather/:id', getWeather);

module.exports = router;
