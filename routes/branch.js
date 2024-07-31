const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, hasRole('branch'), (req, res) => {
    const user = req.session.user;
    res.render('Branch/dashboard_branch', { layout: 'Branch/layout', user });
});

module.exports = router;
