const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default : 0},
  images: [{
    type: String,
    validate: {
      validator: function(value) {
        // Accept both data URIs and regular base64 strings
        return value.startsWith('data:image/') || 
               /^[A-Za-z0-9+/=]+$/.test(value);
      },
      message: 'Image must be a valid base64 string or data URI'
    }
  }],
  description: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);