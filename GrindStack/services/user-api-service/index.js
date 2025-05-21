require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerSetup = require("./swagger");
const connectDB = require("./config/db.js"); 
const userRoutes = require('./routes/userRoutes'); 
const errorHandler = require("./middleware/errorHandler"); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API docs
swaggerSetup(app);

// Routes
app.use("/users", userRoutes); 

// Error handling
app.use(errorHandler); 

// Start server
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
