/**
 * CSRF Protection Middleware
 * Implements Cross-Site Request Forgery protection
 */
const Tokens = require('csrf');
const config = require('../../config');

// Initialize CSRF tokens with the secret from config
const tokens = new Tokens();
const secret = config.csrf.secret;
const cookieName = config.csrf.cookieName;

/**
 * Generate a new CSRF token and set it in a cookie
 */
function generateToken(req, res, next) {
  // Generate a new CSRF token
  const token = tokens.create(secret);
  
  // Set the token in a cookie
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  
  // Store the token in the request for use in templates
  req.csrfToken = token;
  
  next();
}

/**
 * Validate CSRF token from request
 */
function validateToken(req, res, next) {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Get the token from the request headers or body
  const token = 
    req.headers['x-csrf-token'] || 
    req.headers['x-xsrf-token'] || 
    req.body._csrf;
  
  // Get the token from the cookie
  const cookieToken = req.cookies[cookieName];
  
  // If either token is missing, return an error
  if (!token || !cookieToken) {
    return res.status(403).json({
      status: 'error',
      message: 'CSRF token missing'
    });
  }
  
  // Verify that the tokens match
  if (!tokens.verify(secret, token)) {
    return res.status(403).json({
      status: 'error',
      message: 'CSRF token invalid'
    });
  }
  
  next();
}

module.exports = {
  generateToken,
  validateToken
}; 