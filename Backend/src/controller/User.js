const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model/Model');
const dotenv = require('dotenv');
const bunnyStorage = require('../utils/bunnycdn');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let profileImageUrl = null;

    // Handle file upload to Bunny CDN
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      await bunnyStorage.upload(
        req.file.buffer,
        `/profiles/${fileName}`
      );
      profileImageUrl = `${process.env.BUNNY_CDN_URL}/profiles/${fileName}`;
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

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
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
    console.log( "Login successful.", token, user);
    
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    //populate enrolledCourses
    const user = await User.findById(userId).select('-password').populate('enrolledCourses');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: "User profile fetched successfully.", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user profile.', error });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;
    let updateFields = {};

    // Only add fields if they are provided
    if (name) updateFields.name = name;
    if (email) {
      // Check if email already exists for another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use.' 
        });
      }
      updateFields.email = email;
    }

    // Handle profile image upload
    if (req.file) {
      try {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        await bunnyStorage.upload(
          req.file.buffer,
          `/profiles/${fileName}`
        );
        updateFields.profileImage = `${process.env.BUNNY_CDN_URL}/profiles/${fileName}`;
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload profile image.'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { 
        new: true,        // Return updated document
        runValidators: true,  // Run schema validations
        select: '-password'   // Exclude password from result
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message
    });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Find user with password field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { runValidators: true }
    );

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password.', error: error.message });
  }
};
