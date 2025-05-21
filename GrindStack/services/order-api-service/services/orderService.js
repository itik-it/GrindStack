const orderRepo = require('../repositories/orderRepository');
const eventBus = require('../events/eventBus');

class OrderService {
  async createOrder(data) {
    const order = await orderRepo.create(data);

      await eventBus.publish('Gridstack.OrderPlaced', {
      orderId: order._id,
      userId: order.userId,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      createdAt: order.createdAt
    });

    return order;
  }

  getAllOrders() {
    return orderRepo.getAll();
  }

  getOrderById(id) {
    return orderRepo.getById(id);
  }

  getOrdersByUserId(userId) {
    return orderRepo.getByUserId(userId);
  }
}

module.exports = new OrderService();
