const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, hasRole('manager'), (req, res) => {
    const user = req.session.user;
    res.render('Manager/dashboard_manager', { layout: 'Manager/layout', user });
});

module.exports = router;
