const productService = require('../services/productService');

exports.getAll = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

exports.getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not Found' });
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { images } = req.body;

    if (images && Array.isArray(images)) {
      const invalid = images.find(img => !/^data:image\/(png|jpeg|jpg);base64,/.test(img));
      if (invalid) {
        return res.status(400).json({ error: 'One or more images are not valid base64 strings with proper data URI prefix.' });
      }
    }

    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.delete = async (req, res) => {
  const deleted = await productService.deleteProductById(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not Found' });
  res.json(deleted);
};

exports.updateProduct = async (req, res) => {
  try {
    const { images } = req.body;
    if (images && Array.isArray(images)) {
      const invalid = images.find(img => !/^data:image\/(png|jpeg|jpg);base64,/.test(img));
      if (invalid) {
        return res.status(400).json({ error: 'One or more images are not valid base64 strings with proper data URI prefix.' });
      }
    }

    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateStock = async (req, res) => {
  const { stock } = req.body;
  const updated = await productService.updateStock(req.params.id, stock);
  if (!updated) return res.status(404).json({ message: 'Not Found' });
  res.json(updated);
};