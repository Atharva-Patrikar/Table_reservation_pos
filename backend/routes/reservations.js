const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/db');

// Create a reservation with validation
router.post('/', async (req, res) => {
    console.log("Received reservation request:", req.body); // Debugging log
    const { table_id, customer_name, customer_phone, date_time, status } = req.body;

    if (!table_id || !customer_name || !customer_phone || !date_time || !status) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reservations (table_id, customer_name, customer_phone, date_time, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [table_id, customer_name, customer_phone, date_time, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating reservation:", err.message);
        res.status(500).json({ error: "Failed to create reservation. Please try again." });
    }
});

// GET /api/reservations with Filtering, Sorting, and Pagination
router.get('/', async (req, res) => {
    try {
        const { 
            status, 
            date_from, 
            date_to, 
            table_id 
        } = req.query;

        let query = `SELECT * FROM reservations WHERE 1=1`;
        let values = [];

        // 🏷️ Add Status Filter
        if (status) {
            query += ` AND status ILIKE $${values.length + 1}`;
            values.push(`%${status}%`); // Parameter 1
        }

        // 🗓️ Add Date Range Filter
        if (date_from && date_to) {
            query += ` AND date_time BETWEEN $${values.length + 1} AND $${values.length + 2}`;
            values.push(date_from, date_to); // Parameter 2 & 3
        }

        // 🪑 Add Table ID Filter
        if (table_id) {
            query += ` AND table_id = $${values.length + 1}`;
            values.push(table_id); // Parameter 4
        }

        // 📑 Pagination
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const offset = (page - 1) * limit;

        query += ` ORDER BY id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset); // Parameter 5 & 6

        // 🔍 Log Final Query
        console.log("🧮 Final Query:", query);
        console.log("🗂️ Values:", values);

        // 🏗️ Execute Query
        const { rows } = await pool.query(query, values);

        // Separate values array for total count query
        let totalValues = [];
        let totalQuery = `SELECT COUNT(*) FROM reservations WHERE 1=1`;

// Add conditions for status or date filtering
        if (status) {
            totalQuery += ` AND status ILIKE $${totalValues.length + 1}`;
            totalValues.push(`%${status}%`);
        }

        if (date_from && date_to) {
            totalQuery += ` AND date_time BETWEEN $${totalValues.length + 1} AND $${totalValues.length + 2}`;
            totalValues.push(date_from, date_to);
        }

        console.log('🔍 Total Count Query:', totalQuery);
        console.log('🗂️ Total Values:', totalValues);

// Execute the total count query
        const totalResult = await pool.query(totalQuery, totalValues);
        const totalCount = parseInt(totalResult.rows[0].count);

        // Respond with paginated data and metadata
        res.json({
            total: totalCount,
            page: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            reservations: rows,
        });
    } catch (err) {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reservations/:id - Get Single Reservation
router.get('/:id', async (req, res) => {
    const reservationId = req.params.id;
    try {
        const result = await pool.query(
            'SELECT * FROM reservations WHERE id = $1',
            [reservationId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// UPDATE /api/reservations/:id - Update a Reservation
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE reservations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/reservations/:id - Delete a Reservation
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM reservations WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.json({ message: "Reservation deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;