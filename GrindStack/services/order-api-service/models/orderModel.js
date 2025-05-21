const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);