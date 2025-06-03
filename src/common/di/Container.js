/**
 * Dependency Injection Container
 * Manages service dependencies and lifecycles
 */
class Container {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Register a service in the container
   * @param {string} name - Service name
   * @param {Function|Object} definition - Service factory function or instance
   * @param {boolean} isSingleton - Whether the service should be a singleton
   */
  register(name, definition, isSingleton = false) {
    this.services.set(name, { definition, isSingleton });
    return this;
  }

  /**
   * Register a singleton service
   * @param {string} name - Service name
   * @param {Function|Object} definition - Service factory function or instance
   */
  singleton(name, definition) {
    return this.register(name, definition, true);
  }

  /**
   * Resolve a service from the container
   * @param {string} name - Service name
   * @param {Object} params - Parameters to pass to factory function
   */
  resolve(name, params = {}) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Service "${name}" not found in container`);
    }
    
    // If it's a singleton and we already have an instance, return it
    if (service.isSingleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }
    
    // Create the service instance
    let instance;
    if (typeof service.definition === 'function') {
      // If the definition is a function, call it with the container as context
      // and any provided parameters
      instance = service.definition(this, params);
    } else {
      // Otherwise, use the definition as the instance
      instance = service.definition;
    }
    
    // If it's a singleton, store the instance for future use
    if (service.isSingleton) {
      this.singletons.set(name, instance);
    }
    
    return instance;
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Remove a service from the container
   * @param {string} name - Service name
   */
  remove(name) {
    this.services.delete(name);
    this.singletons.delete(name);
    return this;
  }

  /**
   * Clear all services from the container
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
    return this;
  }
}

// Export a singleton instance
module.exports = new Container(); 