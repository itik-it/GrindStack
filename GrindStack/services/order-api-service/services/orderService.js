const orderRepo = require('../repositories/orderRepository');
const eventBus = require('../events/eventBus');

class OrderService {
  async createOrder(data) {
    const order = await orderRepo.create(data);
    await eventBus.publish('OrderPlaced', {
      productId: order.productId,
      quantity: order.quantity
    });
    return order;
  }

  getAllOrders() {
    return orderRepo.getAll();
  }

  getOrderById(id) {
    return orderRepo.getById(id);
  }
}

module.exports = new OrderService();