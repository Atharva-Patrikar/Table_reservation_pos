const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/menu → fetch all menu items from DB
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu ORDER BY id'); // Ensure the table name is 'menu'
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;