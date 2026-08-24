const bcrypt = require('bcryptjs');
const { User, ApiKey } = require('../models');
const { generateToken } = require('../utils/jwt');
const generateApiKey = require('../utils/generateApiKey');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email, dan password wajib diisi.',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter.',
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // Setiap user baru otomatis dapat 1 API key default
    const apiKey = await ApiKey.create({
      userId: user.id,
      key: generateApiKey(),
      label: 'Default Key',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data: {
        user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
        token,
        apiKey: apiKey.key,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email dan password wajib diisi.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me (JWT protected)
async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'plan', 'createdAt'],
    });
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
