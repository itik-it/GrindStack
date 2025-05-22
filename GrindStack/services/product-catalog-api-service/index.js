const express = require('express');
const cors = require("cors");
require("dotenv").config();

const app = express();

const connectDB = require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const productRoutes = require('./routes/productRoutes');

const listenToOrderPlaced = require('./handlers/orderHandler');

const eventBus = require('./events/eventsBus');

const errorHandler = require("./middleware/errorHandler"); 


app.use(cors());
app.use(express.json());

connectDB();

app.use('/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// eventBus.publish('OrderPlaced', { productId: 'abc123', quantity: 1 });

listenToOrderPlaced();
app.use(errorHandler); 
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

