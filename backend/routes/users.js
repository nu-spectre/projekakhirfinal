// src/routes/users.js – Manajemen User (superadmin)
const router = require('express').Router();
const db     = require('../db');
const bcrypt = require('bcryptjs');
const { requireAuth, requireRole } = require('../middleware/auth');

// ──────────────────────────────────────────────────────────────
// GET /api/users  – semua user (superadmin only)
// ──────────────────────────────────────────────────────────────
router.get('/', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: rows });
  } catch (err) {
    console.error('[GET /users]', err);
    res.status(500).json({ error: 'Gagal mengambil data user.' });
  }
});

// ──────────────────────────────────────────────────────────────
// PUT /api/users/profile  – update profil sendiri
// Body: { name, password (opsional) }
// ──────────────────────────────────────────────────────────────
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const updates = [];
    const args    = [];

    if (name) { updates.push('name = ?'); args.push(name.trim()); }
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password minimal 6 karakter.' });
      updates.push('password = ?');
      args.push(await bcrypt.hash(password, 10));
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Tidak ada yang diperbarui.' });

    args.push(req.user.id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, args);

    const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Profil berhasil diperbarui.', user: rows[0] });
  } catch (err) {
    console.error('[PUT /users/profile]', err);
    res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
});

// ──────────────────────────────────────────────────────────────
// DELETE /api/users/:id  – hapus user (superadmin only)
// ──────────────────────────────────────────────────────────────
router.delete('/:id', requireAuth, requireRole('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) return res.status(400).json({ error: 'Tidak bisa menghapus akunmu sendiri.' });

    const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan.' });

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User berhasil dihapus.' });
  } catch (err) {
    console.error('[DELETE /users/:id]', err);
    res.status(500).json({ error: 'Gagal menghapus user.' });
  }
});

module.exports = router;