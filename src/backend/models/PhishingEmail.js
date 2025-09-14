// models/PhishingEmail.js
const mongoose = require('mongoose');

const phishingEmailSchema = new mongoose.Schema({
  question: {
    type: String,   
    required: true,
  },
  answer: {     
    type: Boolean, // true = phishing, false = safe
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to admin who created
    required: true,
  },
});

module.exports = mongoose.model('PhishingEmail', phishingEmailSchema);
