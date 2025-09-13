const Book = require('../models/Book');

// Create a new book
const createBook = async (req,res) => {
  const { title, author, price, condition, description, images, faculty, course } = req.body;
  const book = await Book.create({
    title, author, price, condition, description, images, faculty, course, seller:req.user._id
  });
  res.status(201).json(book);
};

// Get all books
const getBooks = async (req,res) => {
  const books = await Book.find().populate('seller','fullName email verified');
  res.json(books);
};

// Update book
const updateBook = async (req,res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message:'Book not found' });
  if (book.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message:'Not authorized' });

  Object.assign(book, req.body);
  await book.save();
  res.json(book);
};

// Delete book
const deleteBook = async (req,res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message:'Book not found' });
  if (book.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message:'Not authorized' });

  await book.remove();
  res.json({ message:'Book removed' });
};

module.exports = { createBook, getBooks, updateBook, deleteBook };
