const Product = require('../models/productModel');

class ProductRepository {
  async getAll() {
    return Product.find();
  }

  async getById(id) {
    return Product.findById(id);
  }

  async create(productData) {
    return Product.create(productData);
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id);
  }

  async updateById(id, updateData) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateStock(id, newStock) {
    return Product.findByIdAndUpdate(id, { stock: newStock }, { new: true });
  }
}

module.exports = new ProductRepository();
