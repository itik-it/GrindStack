const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const result = await cartService.addToCart(userId, productId, quantity);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await cartService.getCart(userId);
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  const result = await cartService.removeFromCart(userId, productId);
  res.json(result);
};

exports.checkout = async (req, res) => {
  const { userId } = req.body;
  try {
    const order = await cartService.checkout(userId);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  const { userId } = req.params;
  try {
    await cartService.clearCart(userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
