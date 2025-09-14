// routes/game.js
const express = require('express');
const { protect, userOnly } = require('../middleware/authMiddleware');
const { 
  phishingChallenge, 
  getPasswordChallenge, 
  submitPasswordChallenge, 
  dailyQuiz,
  getRandomPhishingEmail,
  submitPhishingAnswer
} = require('../controllers/gameController');

const router = express.Router();

/**
 * @swagger
 * /api/games/phishing:
 *   post:
 *     summary: Complete Phishing Challenge
 *     security:
 *       - bearerAuth: []
 */
router.post('/phishing', protect, userOnly, phishingChallenge);

/**
 * @swagger
 * /api/games/password-challenge:
 *   get:
 *     summary: Get random passwords for the password strength challenge
 *     security:
 *       - bearerAuth: []
 */
router.get('/password-challenge', protect, userOnly, getPasswordChallenge);

/**
 * @swagger
 * /api/games/password-challenge:
 *   post:
 *     summary: Submit password strength challenge selections
 *     security:
 *       - bearerAuth: []
 */
router.post('/password-challenge', protect, userOnly, submitPasswordChallenge);

/**
 * @swagger
 * /api/games/daily-quiz:
 *   post:
 *     summary: Complete Daily Security Quiz
 *     security:
 *       - bearerAuth: []
 */
router.post('/daily-quiz', protect, userOnly, dailyQuiz);


// routes/game.js (add routes)
router.get('/phishing', protect, userOnly, getRandomPhishingEmail);
router.post('/phishing', protect, userOnly, submitPhishingAnswer);

module.exports = router;
