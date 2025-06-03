/**
 * Service Locator
 * Provides a way to access services globally while hiding DI container implementation
 */
const container = require('./Container');

class ServiceLocator {
  /**
   * Get a service from the container
   * @param {string} name - Service name
   */
  static get(name) {
    return container.resolve(name);
  }

  /**
   * Register a service in the container
   * @param {string} name - Service name
   * @param {Function|Object} definition - Service factory function or instance
   */
  static register(name, definition) {
    container.register(name, definition);
    return ServiceLocator;
  }

  /**
   * Register a singleton service
   * @param {string} name - Service name
   * @param {Function|Object} definition - Service factory function or instance
   */
  static singleton(name, definition) {
    container.singleton(name, definition);
    return ServiceLocator;
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   */
  static has(name) {
    return container.has(name);
  }
}

module.exports = ServiceLocator; 