const express = require('express');
const router = express.Router();
const { createBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Manage books in the student marketplace
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *               - condition
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Algorithms
 *               author:
 *                 type: string
 *                 example: Thomas H. Cormen
 *               price:
 *                 type: number
 *                 example: 350
 *               condition:
 *                 type: string
 *                 example: Good
 *     responses:
 *       201:
 *         description: Book added successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized (No or invalid token)
 */
router.post('/', protect, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               condition:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', protect, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', protect, deleteBook);

module.exports = router;
