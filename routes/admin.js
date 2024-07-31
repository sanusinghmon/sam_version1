const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, hasRole('admin'), (req, res) => {
    const user = req.session.user;
    res.render('Admin/dashboard_admin', { layout: 'Admin/layout', user });
});

module.exports = router;
