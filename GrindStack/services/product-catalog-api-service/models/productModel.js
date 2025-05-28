const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // ✅ Import UUID generator

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  images: [{
    type: String,
    validate: {
      validator: function (value) {
        return value.startsWith('data:image/') ||
               /^[A-Za-z0-9+/=]+$/.test(value);
      },
      message: 'Image must be a valid base64 string with a proper data URI prefix.'
    }
  }],
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
