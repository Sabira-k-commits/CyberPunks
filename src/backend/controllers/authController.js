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


// Login Step1 (email+password → return temporary token)
const loginUserStep1 = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message:'Invalid email or password' });
  if (!user.verified) return res.status(403).json({ message:'Account not verified by admin' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message:'Invalid email or password' });

  // generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 8*60*1000); // 8  min
  await user.save();

  await sendOTP(user.email, otp);

  // generate temporary token (valid for 8 minutes)
  const tempToken = jwt.sign({ id: user._id }, process.env.TEMP_JWT_SECRET, { expiresIn: '8m' });

  res.json({ message: 'OTP sent to email', tempToken });
};


// Login Step2 (verify OTP → return real JWT)
const loginUserStep2 = async (req, res) => {
  const { otp } = req.body;
  const tempToken = req.headers.authorization?.split(' ')[1]; // Bearer <tempToken>

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

  // clear OTP
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  // generate real auth token
  const token = generateToken(user._id);
  res.json({ _id: user._id, fullName: user.fullName, email: user.email, role:user.role,status: user.status, token });
};

module.exports = { registerUser, loginUserStep1, loginUserStep2 };
