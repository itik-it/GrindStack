const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default : 0},
  images: [{
  type: String,
  validate: {
    validator: (value) => /^data:image\/(png|jpeg|jpg);base64,/.test(value),
    message: 'Image must be a valid base64 string with a proper data URI prefix.'
  }
  }],
  description: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);