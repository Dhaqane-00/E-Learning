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

    // Set token cookie
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });

    // Set user cookie
    res.cookie('user', JSON.stringify(user), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      path: '/'
    });

    // Include token in redirect URL as fallback
    const redirectUrl = new URL(process.env.FRONTEND_URL);
    redirectUrl.searchParams.append('token', token);

    res.redirect(redirectUrl.toString());
  }
);

module.exports = router; 