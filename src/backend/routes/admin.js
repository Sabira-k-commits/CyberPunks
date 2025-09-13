const express = require('express');
const router = express.Router();
const { createAdmin,getAllUsers, verifyStudent } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized (no/invalid token)
 *       403:
 *         description: Admin only
 */
router.get('/users', protect, adminOnly, getAllUsers);

/**
 * @swagger
 * /api/admin/verify/{userId}:
 *   patch:
 *     summary: Verify a student account (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified and email sent
 *       400:
 *         description: User already verified
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.patch('/verify/:userId', protect, adminOnly, verifyStudent);

/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: Create a new admin (first admin bootstrap — no auth required)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully (awaiting approval)
 *       400:
 *         description: User already exists
 */
router.post('/create', createAdmin); // ⚠️ No protect/adminOnly


module.exports = router;
