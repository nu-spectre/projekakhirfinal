const express = require('express');
const router = express.Router();
const db = require('../db'); // Mengimpor pool yang Anda buat

// 1. GET ALL REVIEWS (atau per produk)
// Endpoint: GET /api/reviews?product_id=...
router.get('/', async (req, res) => {
  const { product_id } = req.query;
  try {
    let sql = "SELECT * FROM reviews";
    let params = [];

    if (product_id) {
      sql += " WHERE product_id = ?";
      params.push(product_id);
    }
    
    sql += " ORDER BY created_at DESC";
    
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD REVIEW
// Endpoint: POST /api/reviews
router.post('/', async (req, res) => {
  const { product_id, rating, comment } = req.body;
  
  if (!product_id || !rating) {
    return res.status(400).json({ message: "Product ID dan Rating wajib diisi" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO reviews (product_id, rating, comment) VALUES (?, ?, ?)",
      [product_id, rating, comment]
    );
    res.status(201).json({ id: result.insertId, message: "Review berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE REVIEW
// Endpoint: DELETE /api/reviews/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }
    
    res.json({ message: "Review berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;