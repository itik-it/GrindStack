const mongoose = require('mongoose');

// Schema for individual sale items within a transaction
const SaleItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: false // Changed from required: true to make it optional
    },
    barcode: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    subtotal: { 
        type: Number, 
        required: true, 
        min: 0 
    }
});

// Main sales transaction schema
const SaleSchema = new mongoose.Schema({
    transactionId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    items: [SaleItemSchema],
    totalAmount: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    amountReceived: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    change: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    cashierId: { 
        type: String,
        default: 'anonymous'
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'sales' // Explicitly sets the collection name
});

// Virtual property to get the number of items in a transaction
SaleSchema.virtual('itemCount').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Add a method to update product stock when a sale is completed
SaleSchema.methods.updateProductStock = async function() {
    const Product = mongoose.model('Product');
    for (const item of this.items) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
        );
    }
};

// Add index for faster retrieval of transactions by date
SaleSchema.index({ date: -1 });

module.exports = mongoose.model('Sale', SaleSchema); // FIXED: Changed from 'Sales' to singular form for consistency