const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/model');
const dotenv = require('dotenv');

dotenv.config();

// Secret key for JWT (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET;

class UserController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed.', error });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password.' });

      // Generate token
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Login successful.', token, user });
    } catch (error) {
      res.status(500).json({ message: 'Login failed.', error });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId).select('-password'); // Exclude password
      if (!user) return res.status(404).json({ message: 'User not found.' });

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user profile.', error });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, email, profileImage } = req.body;

      // Update user fields
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, profileImage },
        { new: true }
      ).select('-password');

      res.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update profile.', error });
    }
  }
}

module.exports = UserController;
