const Order = require('../models/orderModel');

class OrderRepository {
  async create(orderData) {
    return Order.create(orderData);
  }

  async getAll() {
    return Order.find();
  }

  async getById(id) {
    return Order.findById(id);
  }
}

module.exports = new OrderRepository();