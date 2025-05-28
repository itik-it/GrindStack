const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

// Increase the payload size limit to handle larger images
// Set limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const mongoose = require('mongoose'); //once lang dapat gamitin

//PORT CONNECTION
const port=1337;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//MONGODB CONNECTION - PRODUCTS MODEL
const Products = require("./models/products.model");
mongoose.connect("mongodb://127.0.0.1:27017/Grindstack")
.then(() => console.log('Connected to MongoDB under GrindStack - Product Model'))
.catch(err => console.error('MongoDB connection error:', err));

//ROUTES FOR PRODUCTS

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = category === 'all' 
      ? await Products.find() 
      : await Products.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new product
app.post('/api/products', async (req, res) => {
  try {
    // Generate productId if not provided
    if (!req.body.productId) {
      const prefix = req.body.category ? req.body.category.substring(0, 4).toUpperCase() : 'PROD';
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      req.body.productId = `${prefix}${randomNum}`;
    }
    
    // Convert single imageUrl to images array if needed
    if (req.body.imageUrl && !req.body.images) {
      req.body.images = [req.body.imageUrl];
      delete req.body.imageUrl;
    }
    
    const newProduct = new Products(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT/UPDATE a product
app.put('/api/products/:id', async (req, res) => {
  try {
    // Don't allow changing the productId
    if (req.body.productId) {
      delete req.body.productId;
    }
    
    // Convert single imageUrl to images array if needed
    if (req.body.imageUrl && !req.body.images) {
      req.body.images = [req.body.imageUrl];
      delete req.body.imageUrl;
    }
    
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});