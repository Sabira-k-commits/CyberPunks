const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  university: {
    type: String,
    default: 'University of Pretoria', // can be extended later
  },
  faculty: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: Number,
    required: true,
    min: 1,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false, 
  },
status: { 
    type: String, 
    enum: ['inactive', 'active', 'suspended'], 
    default: 'inactive' 
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  profilePicture: {
    type: String, // URL to profile image
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  otp: {
  type: String,
  default: null,
},
otpExpiry: {
  type: Date,
  default: null,
}
});


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



module.exports = mongoose.model('User', userSchema);
