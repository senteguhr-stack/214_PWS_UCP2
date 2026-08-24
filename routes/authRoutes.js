const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const authJwt = require('../middleware/authJwt');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authJwt, me);

module.exports = router;
