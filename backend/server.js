const express = require('express');
const cors = require('cors'); // Import cors
const tableRoutes = require("./routes/table");
const app = express();

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Middleware
app.use(express.json());
app.use(cors());
 
const menuRoutes=require('./routes/menu');
const kotRoutes = require("./routes/kot");
const reservationsRouter = require('./routes/reservations'); 
const customersRoutes = require('./routes/customers');
const categoryRoutes = require('./routes/category');
const dishRoutes = require('./routes/dish');
const orderRoutes = require('./routes/order');
// Enable CORS for all routes

app.use('/api/reservations', reservationsRouter); 
app.use('/api/menu', menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/customers", customersRoutes); // ✅ Now it works!
app.use('/api', categoryRoutes);
app.use('/api', dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/kots", kotRoutes);
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5002; // Use environment variable or default to 5002
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));