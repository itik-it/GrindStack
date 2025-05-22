const express = require('express');
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler"); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

// NOTE: eventBus is used in orderService.js to publish events — no need to use it directly here
// const eventBus = require('./events/eventsBus'); // You can remove this line if unused here

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to DB
connectDB();

// Routes
app.use('/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);
// Server listener
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(` Order API running at http://localhost:${PORT}`);
});
