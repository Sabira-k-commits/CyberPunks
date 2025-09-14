const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { toggleMFA } = require("../controllers/settingsController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings endpoints
 */

/**
 * @swagger
 * /api/settings/mfa:
 *   patch:
 *     summary: Toggle MFA for logged-in user
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "MFA enabled successfully"
 *                 mfaEnabled:
 *                   type: boolean
 *                   example: true
 *                 points:
 *                   type: integer
 *                   example: 50
 *       401:
 *         description: Unauthorized (no/invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch("/mfa", protect, toggleMFA);

module.exports = router;
