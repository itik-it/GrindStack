const productRepo = require('../repositories/productRepository');

class ProductService {
  getAllProducts() {
    return productRepo.getAll();
  }

  getProductById(id) {
    return productRepo.getById(id);
  }

  createProduct(data) {
    return productRepo.create(data);
  }

  deleteProductById(id) {
    return productRepo.deleteById(id);
  }

  updateProduct(id, updateData) {
    return productRepo.updateById(id, updateData);
  }

  updateStock(id, newStock) {
    return productRepo.updateStock(id, newStock);
  }
}

module.exports = new ProductService();
