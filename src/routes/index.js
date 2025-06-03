/**
 * API Routes Index
 * Sets up versioned API routes
 */
const express = require('express');
const v1Routes = require('./v1');

const router = express.Router();

// Mount versioned API routes
router.use('/api/v1', v1Routes);

// API documentation redirect
router.get('/api', (req, res) => {
  res.redirect('/api/v1/health');
});

// Root redirect
router.get('/', (req, res) => {
  res.redirect('/api/v1/health');
});

module.exports = router; 