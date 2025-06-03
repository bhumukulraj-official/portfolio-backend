/**
 * Health Controller
 * Handles health check endpoints
 */
const healthService = require('../services/HealthService');

class HealthController {
  /**
   * GET /api/v1/health
   * Returns the health status of the system
   */
  async getHealth(req, res, next) {
    try {
      const healthStatus = await healthService.checkHealth();
      
      // Set appropriate status code based on health check result
      const statusCode = healthStatus.status === 'ok' ? 200 : 503;
      
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/v1/health/ping
   * Simple ping endpoint for load balancers
   */
  ping(req, res) {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }
}

module.exports = new HealthController(); 