// controllers/gameController.js
const User = require("../models/User");
const PhishingEmail = require('../models/PhishingEmail');

// --- Helper functions ---
const generateRandomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

const evaluatePasswordStrength = (password) => {
  const lengthCheck = password.length >= 8;
  const upperCheck = /[A-Z]/.test(password);
  const numberCheck = /\d/.test(password);
  const specialCheck = /[!@#$%^&*()]/.test(password);
  return lengthCheck && upperCheck && numberCheck && specialCheck ? "strong" : "weak";
};

// --- Phishing Challenge ---
const phishingChallenge = async (req, res) => {
  const { correct } = req.body; // true if user spotted phishing
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (correct) {
    user.points += 20;
    user.badges.push("Phishing Pro");
  } else {
    user.points -= 10;
  }

  await user.save();
  res.json({ message: "Phishing Challenge completed", points: user.points, badges: user.badges });
};

// --- Password Strength Challenge ---
// GET: get random passwords
const getPasswordChallenge = async (req, res) => {
  const passwords = Array.from({ length: 5 }, () => {
    const pwd = generateRandomPassword();
    return { password: pwd, strength: evaluatePasswordStrength(pwd) };
  });

  // Send only passwords, not their strengths
  res.json({ passwords: passwords.map(p => p.password) });
};

// POST: submit user selections
const submitPasswordChallenge = async (req, res) => {
  const { selections } = req.body; // { password, choice: 'strong' | 'weak' }[]
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  let points = 0;
  selections.forEach(({ password, choice }) => {
    const actual = evaluatePasswordStrength(password);
    if (choice === actual) points += 30; // reward per correct
  });

  user.points += points;
  if (points > 0) user.badges.push("Password Master");
  await user.save();

  res.json({ message: `You earned ${points} points!`, points: user.points, badges: user.badges });
};

// --- Daily Security Quiz ---
const dailyQuiz = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const now = new Date();
  const lastQuiz = user.lastDailyQuiz || 0;
  const oneDay = 24 * 60 * 60 * 1000;

  if (now - lastQuiz < oneDay) {
    return res.status(400).json({ message: "Daily quiz already completed" });
  }

  user.points += 15; // reward
  user.lastDailyQuiz = now;
  await user.save();

  res.json({ message: "Daily Quiz completed! +15 points", points: user.points });
};


// GET random phishing email
const getRandomPhishingEmail = async (req, res) => {
  const emails = await PhishingEmail.find();
  if (!emails.length) return res.status(404).json({ message: "No phishing emails found" });

  const randomEmail = emails[Math.floor(Math.random() * emails.length)];
  res.json({ emailId: randomEmail._id, question: randomEmail.question });
};

// POST: submit user answer
const submitPhishingAnswer = async (req, res) => {
  const { emailId, answer } = req.body; // user selected true/false
  const user = await User.findById(req.user.id);
  const email = await PhishingEmail.findById(emailId);

  if (!user || !email) return res.status(404).json({ message: "User or email not found" });

  const correct = email.answer === answer;
  user.points += correct ? 20 : -10;
  if (correct) user.badges.push("Phishing Pro");

  // Optional: track attempts
  user.phishingAttempts = user.phishingAttempts || [];
  user.phishingAttempts.push({ emailId, userAnswer: answer, correct, date: new Date() });

  await user.save();
  res.json({ message: correct ? "✅ Correct!" : "❌ Wrong!", points: user.points, badges: user.badges });
};

module.exports = {
  phishingChallenge,
  getPasswordChallenge,
  submitPasswordChallenge,
  dailyQuiz,
  getRandomPhishingEmail,
  submitPhishingAnswer
};
