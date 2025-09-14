require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // <-- import User model

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const settingsRoutes = require('./routes/settings');
const gameRoutes = require('./routes/game');

// Swagger setup
const setupSwagger = require('./config/swagger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/games', gameRoutes);

// Rate limiter for login
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { message: 'Too many login attempts. Try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login-step1', loginLimiter);

// Swagger
setupSwagger(app);

// Bootstrap super admin
const bootstrapAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const superAdmin = new User({
        fullName: 'System Admin',
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD,
       
        role: 'admin',
        status: 'active',
        verified: true,
        mfaEnabled: true,
        points: 0,
      
      });
      await superAdmin.save();
      console.log("✅ Super admin created successfully");
    } else {
      console.log("ℹ️ Super admin already exists");
    }
  } catch (err) {
    console.error("❌ Error bootstrapping super admin:", err.message);
  }
};

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await bootstrapAdmin(); // create super admin if not exists
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
