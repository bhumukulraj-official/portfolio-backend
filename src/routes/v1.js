/**
 * API v1 Routes
 * Combines all feature routes under the /api/v1 prefix
 */
const express = require('express');
const coreRoutes = require('../features/core/routes');

const router = express.Router();

// Mount feature routes
router.use('/', coreRoutes);

module.exports = router; 