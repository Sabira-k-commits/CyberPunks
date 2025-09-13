const express = require('express');
const router = express.Router();
const { createAdmin,getAllUsers, verifyStudent,getPendingUsers, getVerifiedUsers,denyUser ,getStats, suspendUser, } = require('../controllers/adminController');
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


/**
 * @swagger
 * /api/admin/users/pending:
 *   get:
 *     summary: Get all pending users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.get('/users/pending', protect, adminOnly, getPendingUsers);

/**
 * @swagger
 * /api/admin/users/verified:
 *   get:
 *     summary: Get all verified users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of verified users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.get('/users/verified', protect, adminOnly, getVerifiedUsers);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats overview
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.get('/stats', protect, adminOnly, getStats);

/**
 * @swagger
 * /api/admin/users/{userId}/status:
 *   patch:
 *     summary: Update a user status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 description: New status for the user
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.patch('/users/:userId/status', protect, adminOnly, suspendUser);

/**
 * @swagger
 * /api/admin/users/{userId}/deny:
 *   patch:
 *     summary: Deny a pending user account (Admin only)
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
 *         description: User denied and email sent
 *       400:
 *         description: Cannot deny a verified user
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.patch('/users/:userId/deny', protect, adminOnly, denyUser);

module.exports = router;
