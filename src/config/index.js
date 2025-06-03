/**
 * Configuration module
 * Loads environment-specific configuration
 */
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Determine which environment to use
const environment = process.env.NODE_ENV || 'development';

// Load environment-specific config
let config;
try {
  config = require(`./environments/${environment}`);
} catch (error) {
  console.error(`Failed to load config for environment: ${environment}`);
  console.error('Falling back to development environment');
  config = require('./environments/development');
}

// Validate required configurations
function validateConfig(config) {
  const requiredFields = [
    'server.port',
    'database.url',
    'auth.jwtSecret',
    'csrf.secret'
  ];
  
  for (const field of requiredFields) {
    const keys = field.split('.');
    let current = config;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        throw new Error(`Missing required configuration: ${field}`);
      }
      current = current[key];
    }
  }
  
  return config;
}

// Export validated config
module.exports = validateConfig(config); 