/**
 * Health Service
 * Handles system health checks including database connectivity
 */
const db = require('../../../database/connection');
const os = require('os');

class HealthService {
  /**
   * Check overall system health
   */
  async checkHealth() {
    const startTime = Date.now();
    
    try {
      // Check database connectivity
      const dbStatus = await this.checkDatabase();
      
      // Get system info
      const systemInfo = this.getSystemInfo();
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: dbStatus.status === 'error' ? 'degraded' : 'ok',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        version: process.env.npm_package_version || '1.0.0',
        database: dbStatus,
        system: systemInfo
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        message: error.message,
        database: { status: 'error', message: error.message }
      };
    }
  }

  /**
   * Check database connectivity
   */
  async checkDatabase() {
    // Use the new healthCheck method from the database connection
    return db.healthCheck();
  }

  /**
   * Get basic system information
   */
  getSystemInfo() {
    return {
      uptime: Math.floor(process.uptime()),
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024),
        free: Math.round(os.freemem() / 1024 / 1024),
        usage: Math.round((os.totalmem() - os.freemem()) / os.totalmem() * 100)
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        loadAvg: os.loadavg()
      },
      platform: {
        type: os.type(),
        release: os.release(),
        architecture: os.arch()
      }
    };
  }
}

module.exports = new HealthService(); 