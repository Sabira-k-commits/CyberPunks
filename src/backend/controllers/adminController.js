const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyStudent = async (req,res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message:'User not found' });
  if (user.verified) return res.status(400).json({ message:'User already verified' });

  user.verified = true;
  await user.save();

  // Send verification email
  await sendEmail(user.email, 'Account Verified', `Hi ${user.fullName}, your account is verified! You can now log in.`);

  res.json({ message:'User verified and email sent' });
};



const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new admin with dummy student info
    const adminUser = new User({
      fullName,
      email,
      password,
      phoneNumber,
      role: 'admin',        // admin role
      verified: true,       // must be manually approved
      studentNumber: '000000',
      faculty: 'N/A',
      course: 'N/A',
      yearOfStudy: 1
    });

    await adminUser.save();

    // Send email to notify approval needed
    await sendEmail(
      email,
      'Admin Account Created - Awaiting Approval',
      `Hi ${fullName}, your admin account has been created. 
      An existing super admin must approve your account before you can log in.`
    );

    res.status(201).json({
      message: 'Admin account created. Awaiting approval.',
      adminId: adminUser._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, verifyStudent, createAdmin };
