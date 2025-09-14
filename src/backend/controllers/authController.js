const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendOTP = require('../utils/sendOTP');
const Activity = require('../models/Activity');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register (generic)
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ fullName, email, password });

    await Activity.create({ user: user.fullName, action: 'Registered an account' });
    res.status(201).json({ _id:user._id, fullName:user.fullName, email:user.email, verified:user.verified });
  } catch(e) { 
    res.status(500).json({ message:e.message }); 
  }
};

// Login Step1
const loginUserStep1 = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message:'Invalid email or password' });

  if (user.isLocked()) {
    await Activity.create({ user: email, action: 'Attempted login on locked account' });
    return res.status(403).json({ message: 'Account locked due to multiple failed login attempts. Try again later.' });
  }

  if (!user.verified) return res.status(403).json({ message:'Account not verified' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    await Activity.create({ user: email, action: 'Failed login attempt' });
    return res.status(400).json({ message:'Invalid email or password' });
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;

  if (user.mfaEnabled) {
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 8*60*1000);
    await user.save();

    await sendOTP(user.email, otp);
    await Activity.create({ user: email, action: 'Generated OTP for login' });

    const tempToken = jwt.sign({ id: user._id }, process.env.TEMP_JWT_SECRET, { expiresIn: '8m' });
    return res.json({ message: 'OTP sent to email', tempToken });
  } else {
    const token = generateToken(user._id);
    await user.save();
    await Activity.create({ user: email, action: 'Logged in without MFA' });

    return res.json({ 
      _id: user._id, 
      fullName: user.fullName, 
      email: user.email, 
      role: user.role, 
      status: user.status, 
      token 
    });
  }
};

// Enable MFA (generic)
const enableMfa = async (req, res) => {
  const userId = req.user.id; // from auth middleware
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.mfaEnabled) return res.status(400).json({ message: 'MFA already enabled' });

  user.mfaEnabled = true;
  user.points += 50; // reward points
  await user.save();

  await Activity.create({ user: user.fullName, action: 'Enabled MFA and earned 50 points' });

  res.json({ message: 'MFA enabled! You earned 50 points.', points: user.points });
};

// Login Step2
const loginUserStep2 = async (req, res) => {
  const { otp } = req.body;
  const tempToken = req.headers.authorization?.split(' ')[1];
  if (!tempToken) return res.status(401).json({ message: 'Temp token missing' });

  let decoded;
  try {
    decoded = jwt.verify(tempToken, process.env.TEMP_JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Temp token expired or invalid' });
  }

  const user = await User.findById(decoded.id);
  if (!user) return res.status(400).json({ message:'User not found' });

  if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry)
    return res.status(400).json({ message:'OTP expired. Login again.' });

  if (user.otp !== otp) return res.status(400).json({ message:'Invalid OTP' });

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  await Activity.create({ user: user.fullName, action: 'Logged in successfully' });

  const token = generateToken(user._id);
  res.json({ _id: user._id, fullName: user.fullName, email: user.email, role:user.role,status: user.status, token });
};

module.exports = { registerUser, loginUserStep1, loginUserStep2, enableMfa };
