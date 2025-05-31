const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: "66259a8f05736e5d4d6ddf1a"
 *         quantity:
 *           type: integer
 *           example: 2
 *     CartResponse:
 *       type: object
 *       additionalProperties:
 *         type: string
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *     Order:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "user123"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add product to user's cart
 *     requestBody:
 *       description: User ID, product ID and quantity
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               productId:
 *                 type: string
 *                 example: "66259a8f05736e5d4d6ddf1a"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *       400:
 *         description: Error adding to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get user's cart items
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User identifier
 *     responses:
 *       200:
 *         description: User's cart contents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove product from user's cart
 *     requestBody:
 *       description: User ID and product ID to remove
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               productId:
 *                 type: string
 *                 example: "66259a8f05736e5d4d6ddf1a"
 *     responses:
 *       200:
 *         description: Product removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 removed:
 *                   type: boolean
 */

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout user's cart and create order
 *     requestBody:
 *       description: User ID for checkout
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error during checkout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post('/', controller.addToCart);
router.get('/:userId', controller.getCart);
router.delete('/', controller.removeFromCart);
router.post('/checkout', controller.checkout);
router.delete('/:userId', controller.clearCart);

module.exports = router;
