const express = require('express');
const router = express.Router();
const { registerUser, loginUserStep1, loginUserStep2 } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new student
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
 *               - studentNumber
 *               - faculty
 *               - course
 *               - yearOfStudy
 *               - phoneNumber
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               studentNumber:
 *                 type: string
 *               faculty:
 *                 type: string
 *               course:
 *                 type: string
 *               yearOfStudy:
 *                 type: string
 *               phoneNumber:
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
 *     summary: Login step 1 - email + password → sends OTP to email
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
 *         description: OTP sent to email
 *       400:
 *         description: Invalid email or password
 *       403:
 *         description: Account not verified by admin
 */
router.post('/login-step1', loginUserStep1);

/**
 * @swagger
 * /api/auth/login-step2:
 *   post:
 *     summary: Login step 2 - verify OTP → return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully, returns JWT
 *       400:
 *         description: Invalid OTP or user not found
 */
router.post('/login-step2', loginUserStep2);

module.exports = router;
