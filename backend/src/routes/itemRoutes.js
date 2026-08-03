const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItem, deleteItem, createItemSchema, updateItemSchema } = require('../controllers/itemController');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * @openapi
 * /api/items:
 *   get:
 *     summary: Retrieve items owned by the authenticated user
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Microservice Architecture Plan" }
 *               description: { type: string, example: "System design specs for scaling" }
 *     responses:
 *       201:
 *         description: Item created successfully
 */
router.get('/', getItems);
router.post('/', validate(createItemSchema), createItem);

/**
 * @openapi
 * /api/items/{id}:
 *   put:
 *     summary: Update an existing item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Item updated successfully
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
router.put('/:id', validate(updateItemSchema), updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
