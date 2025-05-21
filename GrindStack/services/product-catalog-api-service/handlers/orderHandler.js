const eventBus = require('../events/eventsBus');
const productService = require('../services/productService');

async function listenToOrderPlaced() {
  await eventBus.subscribe('Gridstack.OrderPlaced', async (event) => {
    console.log('Gridstack.OrderPlaced event received:', event);

    if (Array.isArray(event.items)) {
      for (const item of event.items) {
        const product = await productService.getProductById(item.productId);

        if (product && product.stock >= item.quantity) {
          const newStock = product.stock - item.quantity;
          await productService.updateStock(item.productId, newStock);
          console.log(`Stock updated for product ${item.productId}: ${newStock}`);
        } else {
          console.warn(`Insufficient stock for product ${item.productId}`);
        }
      }
    } else {
      console.error("❌ 'items' is missing or not an array:", event);
    }
  });
}

module.exports = listenToOrderPlaced;
