const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure the correct path to your User model
const Role = require('../models/Role'); // Ensure the correct path to your Role model
const { isAuthenticated, hasRole } = require('../middleware/auth');
const profileRouter = require('./profile');


// Use the profile router
router.use(profileRouter);


router.get('/dashboard', isAuthenticated, hasRole('superadmin'), (req, res) => {
    const user = req.session.user;
    res.render('Superadmin/dashboard_superadmin', { layout: 'Superadmin/layout', user });
});

router.get('/manage_roles', isAuthenticated, hasRole('superadmin'), async (req, res) => {
    try {
        const users = await User.find();
        res.render('Superadmin/manage_roles', { layout: 'Superadmin/layout', users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/manage_roles', isAuthenticated, hasRole('superadmin'), async (req, res) => {
    const { username, role } = req.body;
    try {
        await User.findOneAndUpdate({ username }, { role });
        res.redirect('/superadmin/manage_roles');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/manage_permissions', isAuthenticated, hasRole('superadmin'), async (req, res) => {
    try {
        const users = await User.find();
        const roles = await Role.find();
        res.render('Superadmin/manage_permissions', { layout: 'Superadmin/layout', users, roles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/manage_permissions', isAuthenticated, hasRole('superadmin'), async (req, res) => {
    const { username, permissions } = req.body;
    try {
        await User.findOneAndUpdate({ username }, { permissions: permissions.split(',').map(p => p.trim()) });
        res.redirect('/superadmin/manage_permissions');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
