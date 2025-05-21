const { redisClient } = require('../config/redisClient');
const axios = require('axios');

const PRODUCT_API_URL = 'http://localhost:5002/products'; 
const ORDER_API_URL = 'http://localhost:5003/orders'; // Assuming order service is on port 4000

class CartService {
  async addToCart(userId, productId, quantity) {
    const product = await this.fetchProduct(productId);
    if (!product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error('Not enough stock');

    const key = `cart:${userId}`;
    const existingQty = parseInt(await redisClient.hGet(key, productId)) || 0;
    const newQty = existingQty + parseInt(quantity);

    if (newQty > product.stock) {
      throw new Error('Adding this quantity exceeds available stock');
    }

    await redisClient.hSet(key, productId, newQty);
    return { productId, quantity: newQty };
  }

  async getCart(userId) {
    const key = `cart:${userId}`;
    return await redisClient.hGetAll(key);
  }

  async removeFromCart(userId, productId) {
    const key = `cart:${userId}`;
    await redisClient.hDel(key, productId);
    return { productId, removed: true };
  }

  async checkout(userId) {
    const key = `cart:${userId}`;
    const cart = await redisClient.hGetAll(key);
    if (!cart || Object.keys(cart).length === 0) {
      throw new Error('Cart is empty');
    }

    const orderData = {
      userId,
      items: Object.entries(cart).map(([productId, quantity]) => ({
        productId,
        quantity: parseInt(quantity)
      }))
    };

    try {
      const response = await axios.post(ORDER_API_URL, orderData);
      console.log(response);
      if (response.status === 201) {
        await redisClient.del(key);
        return { success: true, order: response.data };
      } else {
        throw new Error('Order service failed to create the order');
      }
    } catch (err) {
      throw new Error(`Checkout failed: ${err.message}`);
    }
  }

  async fetchProduct(productId) {
    try {
      const res = await axios.get(`${PRODUCT_API_URL}/${productId}`);
      return res.data;
    } catch {
      return null;
    }
  }
}

module.exports = new CartService();
