const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Fetch all dishes with category info
router.get('/dishes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.name AS category_name
       FROM dishes d
       JOIN categories c ON d.category_id = c.id`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error });
  }
});

// Add a new dish
router.post('/dishes', async (req, res) => {
  try {
    const { name, price, type, category_id } = req.body;

    // Ensure all required fields are provided
    if (!name || !price || !type || !category_id) {
      return res.status(400).json({ message: "All fields (name, price, type, category_id) are required!" });
    }

    // Validate type field
    if (!['Veg', 'Non-Veg', 'Egg'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'Veg', 'Non-Veg', or 'Egg'." });
    }

    // Check if the category exists
    const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (catCheck.rows.length === 0) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const result = await pool.query(
      `INSERT INTO dishes (name, price, type, category_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, price, type, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding dish', error });
  }
});

// Fetch dishes by category
router.get('/dishes/category/:category_id', async (req, res) => {
  const { category_id } = req.params;

  try {
    let result;

    if (category_id === 'all') {
      // Fetch all dishes
      result = await pool.query('SELECT * FROM dishes ORDER BY name');
    } else {
      const catId = parseInt(category_id);
      if (isNaN(catId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      result = await pool.query(
        'SELECT * FROM dishes WHERE category_id = $1 ORDER BY name',
        [catId]
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ message: 'Error fetching dishes for category', error });
  }
});

module.exports = router;
