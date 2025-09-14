const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: String, required: true }, // e.g., "Alice Johnson"
  action: { type: String, required: true }, // e.g., "Account verified"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
