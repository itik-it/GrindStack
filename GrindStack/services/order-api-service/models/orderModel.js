const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String }, 
  price: { type: Number }, 
  quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: [itemSchema], required: true },
  status: { type: String, default: 'pending' } 
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
