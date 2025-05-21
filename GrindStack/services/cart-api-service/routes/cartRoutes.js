
const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { userId: req.params.userId, items: [] });
});

router.post('/:userId/add', async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) {
    cart = new Cart({ userId: req.params.userId, items: [] });
  }
  const itemIndex = cart.items.findIndex(i => i.productId === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  res.json(cart);
});

router.post('/:userId/remove', async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(i => i.productId !== productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;
