const mongoose = require('mongoose');

const Product = new mongoose.Schema(
    {
        barcode: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        stock: {type: Number, default: 0},
    },
    {collection: 'products'}
);

module.exports = mongoose.model('Product', Product);
 