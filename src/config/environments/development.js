/**
 * Development environment configuration
 */
module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/lancer_nest',
    provider: process.env.DB_PROVIDER || 'postgres', // 'postgres', 'mysql', etc.
    ssl: process.env.DB_SSL === 'true',
    rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED !== 'false',
    pool: {
      max: parseInt(process.env.DB_MAX_POOL || '10', 10),
      min: parseInt(process.env.DB_MIN_POOL || '2', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10)
    },
    retry: {
      maxRetries: parseInt(process.env.DB_MAX_RETRIES || '5', 10),
      retryInterval: parseInt(process.env.DB_RETRY_INTERVAL || '1000', 10)
    }
  },
  
  // Auth configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development_jwt_secret_key',
    jwtExpiry: process.env.JWT_EXPIRY || '15m',
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
  },
  
  // CSRF configuration
  csrf: {
    secret: process.env.CSRF_SECRET || 'development_csrf_secret_key',
    cookieName: process.env.CSRF_COOKIE_NAME || 'x-csrf-token'
  },
  
  // Storage configuration
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    path: process.env.STORAGE_PATH || './uploads'
  }
}; 