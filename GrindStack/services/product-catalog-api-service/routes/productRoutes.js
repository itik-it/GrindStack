const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productId
 *         - name
 *         - price
 *         - stock
 *         - description
 *         - category
 *       properties:
 *         productId:
 *           type: string
 *           example: "abc123"
 *         name:
 *           type: string
 *           example: "Chair"
 *         price:
 *           type: number
 *           example: 49.99
 *         stock:
 *           type: integer
 *           example: 10
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             description: Base64 encoded image string with data URI prefix
 *             example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *         description:
 *           type: string
 *           example: "A comfortable wooden chair."
 *         category:
 *           type: string
 *           example: "Furniture"
 *       example:
 *         productId: "abc123"
 *         name: "Chair"
 *         price: 49.99
 *         stock: 10
 *         images:
 *           - "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *         description: "A comfortable wooden chair."
 *         category: "Furniture"
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', controller.create);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', controller.delete);

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Update stock for a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.patch('/:id/stock', controller.updateStock);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', controller.updateProduct);

module.exports = router;
