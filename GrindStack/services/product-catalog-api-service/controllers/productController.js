const productService = require('../services/productService');

exports.getAll = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not Found' });
  res.json(product);
};

exports.create = async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  res.status(201).json(newProduct);
};

exports.delete = async (req, res) => {
  const deleted = await productService.deleteProductById(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not Found' });
  res.json(deleted);
};

exports.updateStock = async (req, res) => {
  const { stock } = req.body;
  const updated = await productService.updateStock(req.params.id, stock);
  if (!updated) return res.status(404).json({ message: 'Not Found' });
  res.json(updated);
};