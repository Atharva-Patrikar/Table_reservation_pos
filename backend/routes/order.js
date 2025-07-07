const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// POST - Save new order
router.post("/", async (req, res) => {
  const {
    order_type, table_info, people_count, customer, payment_type,
    subtotal, tax, discount, grand_total, items
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the latest order number
    const result = await client.query(`SELECT MAX(CAST(order_number AS INTEGER)) AS max_order FROM orders`);
    const newOrderNumber = (result.rows[0].max_order || 0) + 1;

    let customerId = null;
    let customerPhone = null;

    if (customer?.phone) {
      customerPhone = customer.phone;
      const existing = await client.query(`SELECT id FROM customers WHERE phone = $1`, [customer.phone]);
      if (existing.rows.length > 0) {
        customerId = existing.rows[0].id;
      } else if (customer.name || customer.phone) {
        const insert = await client.query(
          `INSERT INTO customers (name, phone, address) VALUES ($1, $2, $3) RETURNING id`,
          [customer.name || "", customer.phone || "", customer.address || ""]
        );
        customerId = insert.rows[0].id;
      }
    }

    const orderInsert = await client.query(
      `INSERT INTO orders (
        order_number, order_type, table_info, people_count, customer_id, customer_name,
        customer_phone, payment_type, subtotal, tax, discount, grand_total, status, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Saved', NOW()
      ) RETURNING id`,
      [
        newOrderNumber.toString(),
        order_type,
        table_info || null,
        people_count || null,
        customerId,
        customer?.name || null,
        customerPhone,
        payment_type,
        subtotal,
        tax,
        discount,
        grand_total
      ]
    );

    const orderId = orderInsert.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, dish_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.qty, item.price]
      );
    }

    await client.query('COMMIT');
    return res.status(201).json({ success: true, order_id: orderId, order_number: newOrderNumber });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Order creation error:", err);
    return res.status(500).json({ success: false, message: "Failed to save order" });
  } finally {
    client.release();
  }
});

// GET - Fetch the next available order number
router.get("/new-order-number", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT MAX(CAST(order_number AS INTEGER)) AS max_order FROM orders`
    );
    const nextOrderNumber = (result.rows[0].max_order || 0) + 1;
    res.json({ success: true, new_order_number: nextOrderNumber });
  } catch (err) {
    console.error("Failed to fetch new order number:", err);
    res.status(500).json({ success: false, message: "Failed to fetch new order number" });
  }
});

// GET - Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await pool.query(
      `SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.table_info,
        o.people_count,
        COALESCE(o.customer_name, c.name) AS customer_name,
        COALESCE(o.customer_phone, c.phone, '') AS customer_phone,
        o.payment_type,
        o.subtotal,
        o.tax,
        o.discount,
        o.grand_total,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC`
    );
    res.json(orders.rows);
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET - Fetch single order with items (Original Route)
router.get("/order/:id", async (req, res) => {
  try {
    const orderId = Number.parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const orderDetails = await pool.query(
      `SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.table_info,
        o.people_count,
        COALESCE(o.customer_name, c.name) AS customer_name,
        COALESCE(o.customer_phone, c.phone, '') AS customer_phone,
        o.payment_type,
        o.subtotal,
        o.tax,
        o.discount,
        o.grand_total,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1`,
      [orderId]
    );

    const items = await pool.query(
      `SELECT 
        oi.dish_id,
        d.name AS dish_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS total_price
      FROM order_items oi
      JOIN dishes d ON oi.dish_id = d.id
      WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({ order: orderDetails.rows[0] || {}, items: items.rows });
  } catch (err) {
    console.error("Order detail fetch error:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

// GET - Additional route for frontend compatibility (plural "orders")
router.get("/:id", async (req, res) => {
  try {
    const orderId = Number.parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const orderDetails = await pool.query(
      `SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.table_info,
        o.people_count,
        COALESCE(o.customer_name, c.name) AS customer_name,
        COALESCE(o.customer_phone, c.phone, '') AS customer_phone,
        o.payment_type,
        o.subtotal,
        o.tax,
        o.discount,
        o.grand_total,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1`,
      [orderId]
    );

    const items = await pool.query(
      `SELECT 
        oi.dish_id,
        d.name AS dish_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS total_price
      FROM order_items oi
      JOIN dishes d ON oi.dish_id = d.id
      WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({ order: orderDetails.rows[0] || {}, items: items.rows });
  } catch (err) {
    console.error("Order detail fetch error:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

module.exports = router;
