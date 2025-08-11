const { loadConfig, validateConfig, watchConfig, saveConfig } = require('./configUtils');
const { createSocket, safeEmit } = require('./socketUtils');
const { modifiersMatch, keyBindingMatches, getKeyBindingString, validateKeyBinding, findMatchingBindings} = require('./keyboardUtils');

module.exports = {
  // Config utilities
  loadConfig,
  validateConfig,
  watchConfig,
  saveConfig,

  // Socket utilities
  createSocket,
  safeEmit,

  // Keyboard utilities
  modifiersMatch,
  keyBindingMatches,
  getKeyBindingString,
  validateKeyBinding,
  findMatchingBindings
};