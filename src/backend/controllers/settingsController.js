// controllers/settingsController.js
const User = require("../models/User");

const toggleMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle MFA
    user.mfaEnabled = !user.mfaEnabled;

    // Update points immediately
    if (user.mfaEnabled) {
      user.points += 50; // 🎁 example: reward 50 points
    } else {
      user.points -= 50; // ❌ deduct if disabled
    }

    await user.save();

    res.status(200).json({
      message: `MFA ${user.mfaEnabled ? "enabled" : "disabled"} successfully`,
      mfaEnabled: user.mfaEnabled,
      points: user.points,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { toggleMFA };
