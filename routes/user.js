const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isAuthenticated } = require('../middleware/auth');

// Get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.user.id);
    res.render('Admin/profile', { user });
});

// Update user profile
router.post('/profile', isAuthenticated, async (req, res) => {
    const { username, email } = req.body;
    await User.findByIdAndUpdate(req.session.user.id, { username, email });
    res.redirect('/profile');
});

// Delete user account
router.post('/delete', isAuthenticated, async (req, res) => {
    await User.findByIdAndDelete(req.session.user.id);
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;
