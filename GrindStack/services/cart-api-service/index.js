require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { redisClient } = require("./config/redisClient");
const cartRoutes = require('./routes/cartRoutes');
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5004;

// Connect to MongoDB
connectDB();

// Connect to Redis
redisClient.connect()
  .then(() => console.log(' Redis connected'))
  .catch(err => console.error(' Redis connection failed:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/cart', cartRoutes);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cart Service running on http://localhost:${PORT}`);
});
