const express = require('express');
const app = express();
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const productRoutes = require('./routes/productRoutes');
const listenToOrderPlaced = require('./handlers/orderHandler');
const eventBus = require('./events/eventsBus');
connectDB();

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// eventBus.publish('OrderPlaced', { productId: 'abc123', quantity: 1 });

listenToOrderPlaced();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});