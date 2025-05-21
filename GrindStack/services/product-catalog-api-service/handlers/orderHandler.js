const eventBus = require('../events/eventsBus');
const productService = require('../services/productService');

async function listenToOrderPlaced() {
  await eventBus.subscribe('OrderPlaced', async (event) => {
    console.log('OrderPlaced event received:', event);

    // Example event: { productId: "abc123", quantity: 2 }

    const product = await productService.getProductById(event.productId);
    if (product && product.stock >= event.quantity) {
      const newStock = product.stock - event.quantity;
      await productService.updateStock(event.productId, newStock);
      console.log(`Stock updated for product ${event.productId}: ${newStock}`);
    } else {
      console.warn(`Insufficient stock for product ${event.productId}`);
    }
  });
}

module.exports = listenToOrderPlaced;
