const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendOTP = require('../utils/sendOTP');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
const registerUser = async (req, res) => {
  const { fullName,email,password,studentNumber,faculty,course,yearOfStudy,phoneNumber } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ fullName,email,password,studentNumber,faculty,course,yearOfStudy,phoneNumber });
    res.status(201).json({ _id:user._id, fullName:user.fullName, email:user.email, verified:user.verified });
  } catch(e) { res.status(500).json({ message:e.message }); }
};

// Login Step1 (email+password → send OTP)
const loginUserStep1 = async (req,res) => {
  const { email,password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message:'Invalid email or password' });
  if (!user.verified) return res.status(403).json({ message:'Account not verified by admin' });
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message:'Invalid email or password' });

  // generate OTP
  const otp = crypto.randomInt(100000,999999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now()+2*60*1000); // 2 min
  await user.save();

  await sendOTP(user.email, otp);
  res.json({ message:'OTP sent to email' });
};

// Login Step2 (verify OTP → return JWT)
const loginUserStep2 = async (req,res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message:'User not found' });

  if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry)
    return res.status(400).json({ message:'OTP expired. Login again.' });

  if (user.otp !== otp) return res.status(400).json({ message:'Invalid OTP' });

  user.otp = null; user.otpExpiry = null;
  await user.save();

  const token = generateToken(user._id);
  res.json({ _id:user._id, fullName:user.fullName, email:user.email, token });
};

module.exports = { registerUser, loginUserStep1, loginUserStep2 };
