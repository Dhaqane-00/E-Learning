const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model/Model');
const dotenv = require('dotenv');
const upload = require('../middleware/upload');
const { uploadToSupabase } = require('../utils/supabase');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    let profileImageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; // default image

    // Handle file upload to Supabase Storage if file exists
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      profileImageUrl = await uploadToSupabase(
        req.file.buffer,
        fileName
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: profileImageUrl
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Registration failed.', error });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: 'Login successful.', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile.', error });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;
    let profileImageUrl = req.body.profileImage; // Keep existing image if no new upload

    // Handle file upload to Supabase Storage
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      profileImageUrl = await uploadToSupabase(
        req.file.buffer,
        fileName
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, profileImage: profileImageUrl },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile.', error });
  }
};
