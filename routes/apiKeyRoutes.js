const express = require('express');
const router = express.Router();
const { listKeys, createKey, toggleKey, deleteKey } = require('../controllers/apiKeyController');
const authJwt = require('../middleware/authJwt');

router.use(authJwt); // semua endpoint di sini wajib login JWT

router.get('/', listKeys);
router.post('/', createKey);
router.patch('/:id/toggle', toggleKey);
router.delete('/:id', deleteKey);

module.exports = router;
