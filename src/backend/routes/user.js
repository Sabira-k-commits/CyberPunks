const express = require('express');
const { getDashboard } = require('../controllers/userController');

const { protect, adminOnly,userOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     summary: Get dashboard for logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 points:
 *                   type: number
 *                 mfaEnabled:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized (no/invalid token)
 *       404:
 *         description: User not found
 */
router.get('/dashboard', protect, userOnly, getDashboard);

module.exports = router;
