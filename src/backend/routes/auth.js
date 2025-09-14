const express = require('express');
const router = express.Router();
const { enableMfa, registerUser, loginUserStep1, loginUserStep2 } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration endpoints for all users
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already registered
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login-step1:
 *   post:
 *     summary: Login step 1 - email + password → sends OTP if MFA enabled and returns temporary token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email if MFA enabled, returns temporary token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tempToken:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 *       403:
 *         description: Account not verified or locked
 */
router.post('/login-step1', loginUserStep1);

/**
 * @swagger
 * /api/auth/login-step2:
 *   post:
 *     summary: Login step 2 - verify OTP with temporary token → return real JWT
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []   # Bearer <tempToken> in Authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully, returns JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid OTP or user not found
 *       401:
 *         description: Temp token missing, expired, or invalid
 */
router.post('/login-step2', loginUserStep2);

/**
 * @swagger
 * /api/auth/enable-mfa:
 *   post:
 *     summary: Enable MFA for logged-in user and earn reward points
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA enabled and points awarded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 points:
 *                   type: number
 *       400:
 *         description: MFA already enabled
 *       404:
 *         description: User not found
 */
router.post('/enable-mfa', protect, enableMfa);

module.exports = router;
