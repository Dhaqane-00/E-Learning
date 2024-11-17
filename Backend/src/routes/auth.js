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
    console.log(req.user);
    const { token, user } = req.user;

    // Set cookies with token and user info
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.cookie('user', JSON.stringify(user), {

      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

module.exports = router; 