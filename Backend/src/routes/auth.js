const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

// Google Auth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { token, user } = req.user;

    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' ? 'https://e-dhaqane.vercel.app' : 'localhost'
    });

    res.cookie('user', JSON.stringify(user), {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' ? 'https://e-dhaqane.vercel.app' : 'localhost'
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

module.exports = router; 