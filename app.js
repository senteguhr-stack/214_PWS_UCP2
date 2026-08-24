require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const dataRoutes = require('./routes/dataRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IklimAPI aktif. Lihat dokumentasi di /api/health atau README.',
    endpoints: {
      auth: '/api/auth (register, login, me)',
      apiKeys: '/api/keys (kelola API key, butuh JWT)',
      data: '/api/v1 (cities, weather, weather/stats — butuh x-api-key)',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/v1', dataRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
