const express = require('express');
const dotenv = require('dotenv');
const swaggerSetup = require('./swagger');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Swagger docs
swaggerSetup(app);

// Sample route
app.get('/', (req, res) => {
  res.send('Cart Service service running');
});

app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});
