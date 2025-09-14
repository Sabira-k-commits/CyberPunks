const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const Activity = require('../models/Activity');
const PhishingEmail = require('../models/PhishingEmail');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: false }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVerifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const verifyStudent = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.verified) return res.status(400).json({ message: 'User already verified' });

  user.verified = true;
  user.status = 'active';
  await user.save();

  await Activity.create({ user: user.fullName, action: 'Account verified' });
  await sendEmail(
    user.email,
    'Account Verified',
    `Hi ${user.fullName}, your account is verified! Please log in and enable MFA to earn points.`
  );

  res.json({ message: 'User verified. MFA activation encouraged on first login.' });
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
      role: 'admin', 
      status: 'active',  // admin role
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

const suspendUser = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // expect: 'active', 'inactive', 'suspended'

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let actionMessage = '';

    // Update status and verified accordingly
    if (status === 'active') {
      user.status = 'active';
      user.verified = true;
      actionMessage = 'Account activated';
    } else if (status === 'inactive') {
      user.status = 'inactive';
      user.verified = false;
      actionMessage = 'Account set to inactive';
    } else if (status === 'suspended') {
      user.status = 'suspended';
      user.verified = false;
      actionMessage = 'Account suspended';
    } else {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await user.save();

    // Log activity
    await Activity.create({ user: user.fullName, action: actionMessage });

    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingVerifications = await User.countDocuments({ verified: false });
    res.json({ totalUsers, pendingVerifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const denyUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verified) return res.status(400).json({ message: 'Cannot deny a verified user' });

    user.status = 'suspended';
    user.verified = false;
    await user.save();

    // Log activity
    await Activity.create({ user: user.fullName, action: 'Account denied' });

    // Send denial email
    await sendEmail(
      user.email,
      'Account Not Approved',
      `Hi ${user.fullName}, your account was not approved by the admin. You cannot log in at this time.`
    );

    res.json({ message: 'User has been denied and notified by email', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10); // last 10 actions
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addPhishingEmail = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || answer === undefined) {
    return res.status(400).json({ message: "Question and answer required" });
  }

  const email = await PhishingEmail.create({
    question,
    answer,
    createdBy: req.user.id,
  });

  res.status(201).json({ message: "Phishing email added", email });
};
module.exports = { getAllUsers, verifyStudent, createAdmin,getPendingUsers, getVerifiedUsers, getStats, suspendUser, denyUser, getRecentActivity, addPhishingEmail };
