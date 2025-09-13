const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  edition: {
    type: String,
    default: '',
  },
  isbn: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    required: true,
  },
  images: [{
    type: String, // URLs to images
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the seller
    required: true,
  },
  faculty: {
    type: String, // optional filter by faculty
  },
  course: {
    type: String, // optional filter by course
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Removed'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);
