const express = require('express');
const router = express.Router();

const superadminRoutes = require('./superadmin');
const adminRoutes = require('./admin');
const managerRoutes = require('./manager');
const branchRoutes = require('./branch');

// Use the routes
router.use('/superadmin', superadminRoutes);
router.use('/admin', adminRoutes);
router.use('/manager', managerRoutes);
router.use('/branch', branchRoutes);

module.exports = router;
