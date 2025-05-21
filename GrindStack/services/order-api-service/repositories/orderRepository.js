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

  async getByUserId(userId) {
    return Order.find({ userId });
  }
}

module.exports = new OrderRepository();
