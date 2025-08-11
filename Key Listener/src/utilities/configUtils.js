const fs = require('fs');
const path = require('path');

/**
 * Load and parse a JSON configuration file
 * @param {string} configPath - Path to the config file
 * @param {boolean} validate - Whether to validate the config structure
 * @returns {Object} Parsed configuration object
 */
const loadConfig = (configPath = './src/config.json', validate = true) => {
  try {
    const data = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(data);
    
    if (validate) {
      const validation = validateConfig(config);
      if (!validation.isValid) {
        console.error(`Config validation errors in ${configPath}:`);
        validation.errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
      }
    }
    
    console.log(`Config loaded successfully from ${configPath}`);
    return config;
  } catch (err) {
    console.error(`Error loading ${configPath}:`, err.message);
    process.exit(1);
  }
};

/**
 * Validate configuration object structure
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
const validateConfig = (config) => {
  const errors = [];
  
  if (!config) {
    errors.push('Configuration is required');
    return { isValid: false, errors };
  }
  
  // Validate server URL
  if (!config.serverUrl || typeof config.serverUrl !== 'string') {
    errors.push('serverUrl is required and must be a string');
  }
  
  // Validate tokens
  if (!config.tokens || typeof config.tokens !== 'object') {
    errors.push('tokens object is required');
  } else {
    if (!config.tokens.gameToken || typeof config.tokens.gameToken !== 'string') {
      errors.push('tokens.gameToken is required and must be a string');
    }
    if (!config.tokens.authToken || typeof config.tokens.authToken !== 'string') {
      errors.push('tokens.authToken is required and must be a string');
    }
  }
  
  // Validate key bindings
  if (!config.keyBindings || !Array.isArray(config.keyBindings)) {
    errors.push('keyBindings is required and must be an array');
  } else if (config.keyBindings.length === 0) {
    errors.push('keyBindings array cannot be empty');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Watch a config file for changes and reload it
 * @param {string} configPath - Path to the config file
 * @param {Function} callback - Callback function to call when config changes
 * @param {boolean} validate - Whether to validate the config on reload
 * @returns {fs.FSWatcher} File watcher instance
 */
const watchConfig = (configPath, callback, validate = true) => {
  let isReloading = false;
  
  const watcher = fs.watchFile(configPath, (curr, prev) => {
    if (isReloading) return;
    
    isReloading = true;
    console.log(`🔄 Config file changed, reloading ${configPath}...`);
    
    try {
      const newConfig = loadConfig(configPath, validate);
      callback(newConfig);
      console.log(`Config reloaded successfully`);
    } catch (error) {
      console.error(`Error reloading config:`, error.message);
    } finally {
      isReloading = false;
    }
  });
  
  return watcher;
};

/**
 * Save configuration to a file
 * @param {Object} config - Configuration object to save
 * @param {string} configPath - Path where to save the config file
 * @param {boolean} validate - Whether to validate before saving
 * @returns {boolean} Success status
 */
const saveConfig = (config, configPath, validate = true) => {
  try {
    if (validate) {
      const validation = validateConfig(config);
      if (!validation.isValid) {
        console.error(`Cannot save invalid config:`);
        validation.errors.forEach(error => console.error(`  - ${error}`));
        return false;
      }
    }
    
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`Config saved to ${configPath}`);
    return true;
  } catch (error) {
    console.error(`Error saving config to ${configPath}:`, error.message);
    return false;
  }
};

module.exports = {
  loadConfig,
  validateConfig,
  watchConfig,
  saveConfig
};
