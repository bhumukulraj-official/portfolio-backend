/**
 * Database Connection Factory
 * Implements connection pooling, retry mechanism, and provider abstraction
 */
const { Pool } = require('pg');
const config = require('../config');

/**
 * DatabaseConnection class provides a unified interface for database operations
 * with built-in connection pooling, retry logic, and provider abstraction
 */
class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.retryCount = 0;
    this.maxRetries = config.database.retry.maxRetries;
    this.retryInterval = config.database.retry.retryInterval;
    this.provider = config.database.provider || 'postgres';
  }

  /**
   * Initialize the database connection pool
   * @returns {Promise<Pool>} Database connection pool
   */
  async initialize() {
    if (this.pool) {
      return this.pool;
    }

    try {
      // Create connection based on provider
      switch (this.provider) {
        case 'postgres':
        default:
          this.pool = this._createPostgresPool();
          break;
        // Add more providers as needed (e.g., MySQL, SQLite, etc.)
        // case 'mysql':
        //   this.pool = this._createMySQLPool();
        //   break;
      }

      // Handle pool errors
      this.pool.on('error', (err, client) => {
        console.error(`Unexpected error on idle ${this.provider} client`, err);
      });

      return this.verifyConnection();
    } catch (error) {
      console.error(`Failed to initialize ${this.provider} connection:`, error.message);
      throw error;
    }
  }

  /**
   * Create PostgreSQL connection pool
   * @private
   * @returns {Pool} PostgreSQL connection pool
   */
  _createPostgresPool() {
    const connectionConfig = {
      connectionString: config.database.url,
      ssl: config.database.ssl ? {
        rejectUnauthorized: config.database.rejectUnauthorized !== false
      } : undefined
    };

    return new Pool({
      ...connectionConfig,
      max: config.database.pool.max,
      min: config.database.pool.min,
      idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
      connectionTimeoutMillis: config.database.pool.connectionTimeoutMillis
    });
  }

  /**
   * Verify database connection with retry mechanism
   * @returns {Promise<Pool>} Database connection pool
   */
  async verifyConnection() {
    try {
      const client = await this.pool.connect();
      console.log(`${this.provider.toUpperCase()} database connection successful`);
      client.release();
      this.retryCount = 0;
      return this.pool;
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.error(
          `Database connection failed (Attempt ${this.retryCount}/${this.maxRetries}): ${error.message}`
        );
        
        // Implement exponential backoff
        const delay = this.retryInterval * Math.pow(2, this.retryCount - 1);
        console.log(`Retrying in ${delay}ms...`);
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.verifyConnection());
          }, delay);
        });
      } else {
        console.error(`Database connection failed after ${this.maxRetries} attempts`);
        throw error;
      }
    }
  }

  /**
   * Get a client from the pool
   * @returns {Promise<PoolClient>} Database client
   */
  async getClient() {
    if (!this.pool) {
      await this.initialize();
    }
    return this.pool.connect();
  }

  /**
   * Execute a query using the pool
   * @param {string} text - SQL query text
   * @param {Array} params - Query parameters
   * @returns {Promise<QueryResult>} Query result
   */
  async query(text, params) {
    if (!this.pool) {
      await this.initialize();
    }
    return this.pool.query(text, params);
  }

  /**
   * Execute a query within a transaction
   * @param {Function} callback - Function that takes a client and executes queries
   * @returns {Promise<any>} Result of the transaction
   */
  async transaction(callback) {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Close the pool
   * @returns {Promise<void>}
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log(`${this.provider.toUpperCase()} database connection pool closed`);
    }
  }

  /**
   * Check health of database connection
   * @returns {Promise<Object>} Health status object
   */
  async healthCheck() {
    try {
      const startTime = Date.now();
      const client = await this.getClient();
      const result = await client.query('SELECT NOW() as now');
      client.release();
      const endTime = Date.now();
      
      return {
        status: 'ok',
        provider: this.provider,
        message: 'Database connection successful',
        responseTime: `${endTime - startTime}ms`,
        timestamp: result.rows[0].now
      };
    } catch (error) {
      return {
        status: 'error',
        provider: this.provider,
        message: `Database connection failed: ${error.message}`
      };
    }
  }
}

// Export a singleton instance
module.exports = new DatabaseConnection(); 