const express   = require('express');
const router    = express.Router();
const db        = require('../db');
const authMw    = require('../middleware/auth');

// GET /api/products  – semua produk (publik)
router.get('/', async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    let sql    = 'SELECT * FROM v_products_full WHERE 1=1';
    const params = [];

    if (category) { sql += ' AND cat = ?';              params.push(category); }
    if (brand)    { sql += ' AND brand = ?';             params.push(brand); }
    if (search)   { sql += ' AND name LIKE ?';           params.push(`%${search}%`); }

    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);

    // Parse JSON fields
    const products = rows.map(formatProduct);
    res.json({ ok: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// GET /api/products/:id  – detail produk (publik)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_products_full WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ ok: false, msg: 'Produk tidak ditemukan' });
    res.json({ ok: true, data: formatProduct(rows[0]) });
  } catch (err) {
    console.error('PRODUCTS ERROR:', err.message, err.code);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// POST /api/products  – tambah produk (admin)
router.post('/', authMw, async (req, res) => {
  if (!['admin', 'superadmin'].includes(req.user.role))
    return res.status(403).json({ ok: false, msg: 'Akses ditolak' });

  const { name, price, brand, category, type, color, description, shop_url, img, images, specs } = req.body;
  if (!name || !price || !brand || !category || !img)
    return res.status(400).json({ ok: false, msg: 'Field wajib: name, price, brand, category, img' });

  try {
    const [result] = await db.query(
      `INSERT INTO products (name, price, brand, category, type, color, description, shop_url, img, images, specs, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, String(price), brand, category,
        type || null, color || null, description || null, shop_url || null,
        img,
        images ? JSON.stringify(images) : null,
        specs  ? JSON.stringify(specs)  : null,
        req.user.id,
      ]
    );
    const [rows] = await db.query('SELECT * FROM v_products_full WHERE id = ?', [result.insertId]);
    res.status(201).json({ ok: true, data: formatProduct(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// PUT /api/products/:id  – update produk (admin)
router.put('/:id', authMw, async (req, res) => {
  if (!['admin', 'superadmin'].includes(req.user.role))
    return res.status(403).json({ ok: false, msg: 'Akses ditolak' });

  const { name, price, brand, category, type, color, description, shop_url, img, images, specs } = req.body;

  try {
    const [check] = await db.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ ok: false, msg: 'Produk tidak ditemukan' });

    await db.query(
      `UPDATE products SET name=?, price=?, brand=?, category=?, type=?, color=?, description=?,
       shop_url=?, img=?, images=?, specs=? WHERE id=?`,
      [
        name, String(price), brand, category,
        type || null, color || null, description || null, shop_url || null,
        img,
        images ? JSON.stringify(images) : null,
        specs  ? JSON.stringify(specs)  : null,
        req.params.id,
      ]
    );
    const [rows] = await db.query('SELECT * FROM v_products_full WHERE id = ?', [req.params.id]);
    res.json({ ok: true, data: formatProduct(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// DELETE /api/products/:id  – hapus produk (admin)
router.delete('/:id', authMw, async (req, res) => {
  if (!['admin', 'superadmin'].includes(req.user.role))
    return res.status(403).json({ ok: false, msg: 'Akses ditolak' });

  try {
    const [check] = await db.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ ok: false, msg: 'Produk tidak ditemukan' });

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ ok: true, msg: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// Helper: parse JSON fields dari DB
function formatProduct(row) {
  return {
    ...row,
    images: tryParse(row.images, [row.img]),
    specs:  tryParse(row.specs, []),
  };
}

function tryParse(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; }
  catch { return fallback; }
}

module.exports = router;