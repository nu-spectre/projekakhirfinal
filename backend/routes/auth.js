const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ ok: false, msg: 'Semua field harus diisi' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0)
      return res.status(409).json({ ok: false, msg: 'Email sudah terdaftar' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), hash, 'user']
    );

    const user = { id: result.insertId, name, email: email.toLowerCase(), role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ ok: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ ok: false, msg: 'Email dan password harus diisi' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (rows.length === 0)
      return res.status(401).json({ ok: false, msg: 'Email tidak terdaftar' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ ok: false, msg: 'Password salah' });

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ ok: true, user: payload, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword)
    return res.status(400).json({ ok: false, msg: 'Semua field harus diisi' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (rows.length === 0)
      return res.status(404).json({ ok: false, msg: 'User tidak ditemukan' });

    const user  = rows[0];
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(401).json({ ok: false, msg: 'Password lama salah' });

    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
    res.json({ ok: true, msg: 'Password berhasil diubah' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

module.exports = router;