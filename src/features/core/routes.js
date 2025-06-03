/**
 * Core Feature Routes
 */
const express = require('express');
const healthController = require('./controllers/HealthController');

const router = express.Router();

// Health check routes
router.get('/health', healthController.getHealth.bind(healthController));
router.get('/health/ping', healthController.ping.bind(healthController));

module.exports = router; 