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
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products by category
 */
router.get('/category/:category', controller.getByCategory); // 🆕 This should go before the id route!

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 */
router.post('/', controller.create);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 */
router.delete('/:id', controller.delete);

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Update stock for a product
 */
router.patch('/:id/stock', controller.updateStock);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 */
router.put('/:id', controller.updateProduct);

module.exports = router;
