const orderService = require('../services/orderService');

exports.create = async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
};

exports.getAll = async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.json(orders);
};

exports.getById = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not Found' });
  res.json(order);
};