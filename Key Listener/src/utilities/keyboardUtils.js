/**
 * Check if the expected modifiers match the active modifiers in a keyboard event
 * @param {string[]} expected - Array of expected modifier names (e.g., ['Shift', 'Control'])
 * @param {Object} event - Keyboard event object with modifier properties
 * @returns {boolean} True if modifiers match exactly
 */
const modifiersMatch = (expected, event) => {
  const activeMods = [];
  if (event.shift) activeMods.push("Shift");
  if (event.ctrl) activeMods.push("Control");
  if (event.alt) activeMods.push("Alt");
  if (event.meta) activeMods.push("Meta");

  return expected.length === activeMods.length &&
         expected.every(mod => activeMods.includes(mod));
};

/**
 * Check if a key binding matches the current keyboard event
 * @param {Object} binding - Key binding configuration object
 * @param {Object} event - Keyboard event object
 * @returns {boolean} True if the binding matches the event
 */
const keyBindingMatches = (binding, event) => {
  return binding.key.toUpperCase() === event.name.toUpperCase() &&
         modifiersMatch(binding.modifiers, event);
};

/**
 * Get a human-readable string representation of a key binding
 * @param {Object} binding - Key binding configuration object
 * @returns {string} Human-readable key combination (e.g., "Ctrl+Shift+A")
 */
const getKeyBindingString = (binding) => {
  const parts = [...binding.modifiers];
  parts.push(binding.key.toUpperCase());
  return parts.join('+');
};

/**
 * Validate a key binding configuration object
 * @param {Object} binding - Key binding configuration object
 * @returns {Object} Validation result with isValid boolean and errors array
 */
const validateKeyBinding = (binding) => {
  const errors = [];
  
  if (!binding) {
    errors.push('Key binding is required');
    return { isValid: false, errors };
  }
  
  if (!binding.key || typeof binding.key !== 'string') {
    errors.push('Key binding must have a valid key string');
  }
  
  if (!Array.isArray(binding.modifiers)) {
    errors.push('Key binding modifiers must be an array');
  }
  
  if (!binding.eventName || typeof binding.eventName !== 'string') {
    errors.push('Key binding must have a valid eventName string');
  }
  
  const validModifiers = ['Shift', 'Control', 'Alt', 'Meta'];
  const invalidModifiers = binding.modifiers?.filter(mod => !validModifiers.includes(mod));
  if (invalidModifiers?.length > 0) {
    errors.push(`Invalid modifiers: ${invalidModifiers.join(', ')}. Valid modifiers are: ${validModifiers.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Find matching key bindings for a keyboard event
 * @param {Array} keyBindings - Array of key binding configuration objects
 * @param {Object} event - Keyboard event object
 * @returns {Array} Array of matching key bindings
 */
const findMatchingBindings = (keyBindings, event) => {
  return keyBindings.filter(binding => keyBindingMatches(binding, event));
};

module.exports = {
  modifiersMatch,
  keyBindingMatches,
  getKeyBindingString,
  validateKeyBinding,
  findMatchingBindings
};
