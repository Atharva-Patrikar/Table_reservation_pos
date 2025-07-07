const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// 📱 GET /api/customers/by-phone?phone=9876543210
router.get("/by-phone", async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, phone, address FROM customers WHERE phone = $1 LIMIT 1",
      [phone]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // return matched customer
    } else {
      res.json({}); // return empty object if not found
    }
  } catch (err) {
    console.error("Customer phone search failed:", err);
    res.status(500).json({ message: "Failed to search customer by phone" });
  }
});

// 💾 POST /api/customers
router.post("/", async (req, res) => {
  const { name, phone, address } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers (name, phone, address)
       VALUES ($1, $2, $3)
       RETURNING id, name, phone, address`,
      [name, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add customer:", err);
    res.status(500).json({ message: "Failed to add customer" });
  }
});

module.exports = router;
