const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isAuthenticated } = require('../middleware/auth');

// Render login page
router.get('/login', (req, res) => {
    res.render('login/login', { layout: false });
});

// Render signup page
router.get('/signup', (req, res) => {
    res.render('login/signup', { layout: false });
});

// Handle login form submission
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            req.session.user = { id: user._id, role: user.role };
            switch (user.role) {
                case 'superadmin':
                    return res.redirect('/superadmin/dashboard');
                case 'admin':
                    return res.redirect('/admin/dashboard');
                case 'manager':
                    return res.redirect('/manager/dashboard');
                case 'branch':
                    return res.redirect('/branch/dashboard');
                default:
                    return res.status(403).send('Access Denied');
            }
        }
        res.render('login/login', { error: 'Invalid username or password', layout: false });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Handle signup form submission
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = new User({ username, password, role });
        await user.save();
        req.session.user = { id: user._id, role: user.role };
        switch (user.role) {
            case 'superadmin':
                return res.redirect('/superadmin/dashboard');
            case 'admin':
                return res.redirect('/admin/dashboard');
            case 'manager':
                return res.redirect('/manager/dashboard');
            case 'branch':
                return res.redirect('/branch/dashboard');
            default:
                return res.status(403).send('Access Denied');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Handle logout
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;
