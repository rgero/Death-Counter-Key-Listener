const fs = require('fs');
const { GlobalKeyboardListener } = require('node-global-key-listener');
const { loadConfig, watchConfig, createSocket, safeEmit, findMatchingBindings} = require('./utilities');

// Determine config path from ENV or default
const configPath = process.env.CONFIG_PATH || null;

// Load config
let config = loadConfig(configPath);
let socket;

// Connect to Socket.IO server using utility function
socket = createSocket(config.serverUrl);

const keyboard = new GlobalKeyboardListener();

// Listen for global key presses
keyboard.addListener(e => {
  if (e.state !== "DOWN") return; // only fire on key press

  const matchingBindings = findMatchingBindings(config.keyBindings, e);
  
  for (const binding of matchingBindings) {
    safeEmit(socket, binding.eventName, {
      gameToken: config.tokens.gameToken,
      authToken: config.tokens.authToken,
      timestamp: Date.now()
    });
  }
});

// Watch config for hot reload using the utility function
watchConfig(configPath, (newConfig) => {
  config = newConfig;
});
