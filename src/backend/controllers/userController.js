const User = require('../models/User');

/**
 * Get logged-in user dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-password -otp -otpExpiry'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        fullName: user.fullName,
        email: user.email,
        points: user.points,
        mfaEnabled: user.mfaEnabled,
        status: user.status,
        badges: user.badges || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };
