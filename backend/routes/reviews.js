const express = require('express');
const router  = express.Router();
const db      = require('../db');
const authMw  = require('../middleware/auth');

// GET /api/reviews?product_id=xxx  – ambil review produk (publik)
router.get('/', async (req, res) => {
  try {
    const { product_id } = req.query;
    let sql = 'SELECT * FROM v_reviews_with_user';
    const params = [];

    if (product_id) { sql += ' WHERE productId = ?'; params.push(product_id); }
    sql += ' ORDER BY date DESC';

    const [rows] = await db.query(sql, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// POST /api/reviews  – tambah review (user login)
router.post('/', authMw, async (req, res) => {
  const { product_id, rating, comment } = req.body;
  if (!product_id || !rating || !comment)
    return res.status(400).json({ ok: false, msg: 'product_id, rating, dan comment wajib diisi' });

  if (rating < 1 || rating > 5)
    return res.status(400).json({ ok: false, msg: 'Rating harus antara 1–5' });

  try {
    // Cek apakah user sudah review produk ini
    const [existing] = await db.query(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
      [product_id, req.user.id]
    );
    if (existing.length > 0)
      return res.status(409).json({ ok: false, msg: 'Kamu sudah memberikan review untuk produk ini' });

    const [result] = await db.query(
      'INSERT INTO reviews (product_id, user_id, user_name, user_email, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [product_id, req.user.id, req.user.name, req.user.email, rating, comment]
    );

    const [rows] = await db.query('SELECT * FROM v_reviews_with_user WHERE id = ?', [result.insertId]);
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// DELETE /api/reviews/:id  – hapus review (owner atau admin)
router.delete('/:id', authMw, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ ok: false, msg: 'Review tidak ditemukan' });

    const review = rows[0];
    const isOwner = review.user_id === req.user.id;
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isAdmin)
      return res.status(403).json({ ok: false, msg: 'Akses ditolak' });

    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ ok: true, msg: 'Review berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

module.exports = router;