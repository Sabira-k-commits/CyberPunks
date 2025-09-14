const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['inactive', 'active', 'suspended'], default: 'inactive' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profilePicture: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  mfaEnabled: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  lastMfaLogin: { type: Date, default: null },
  badges: [{ type: String }],
  lastDailyQuiz: { type: Date },

  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 min lock
    }
  }
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
