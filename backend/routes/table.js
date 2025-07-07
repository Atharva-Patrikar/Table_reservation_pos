const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all tables along with the latest reservation info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id AS table_id, 
        t.name AS table_name, 
        t.status AS table_status, 
        t.table_number, 
        r.customer_name, 
        r.date_time, 
        r.status AS reservation_status
      FROM tables t
      LEFT JOIN (
        SELECT DISTINCT ON (table_id) *
        FROM reservations
        ORDER BY table_id, date_time DESC
      ) r ON t.id = r.table_id
      ORDER BY t.id;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tables with reservation info:', err.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;