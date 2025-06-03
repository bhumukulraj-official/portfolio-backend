/**
 * LancerNest API Main Application
 */
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const db = require('./database/connection');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
db.initialize().catch(err => {
  console.error('Failed to initialize database:', err);
  // Continue running the application even if database connection fails
  console.warn('Application running without database connection');
});

// Routes
app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`LancerNest API server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  db.close().finally(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  db.close().finally(() => {
    process.exit(0);
  });
});

module.exports = app; 