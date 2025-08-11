const { io } = require('socket.io-client');

/**
 * Create and configure a Socket.IO connection
 * @param {string} serverUrl - Socket.IO server URL
 * @param {Object} options - Socket.IO connection options
 * @param {boolean} options.enableLogging - Enable connection logging (default: true)
 * @param {Function} options.onConnect - Custom connect handler
 * @param {Function} options.onDisconnect - Custom disconnect handler
 * @param {Function} options.onError - Custom error handler
 * @returns {Object} Socket.IO client instance
 */
const createSocket = (serverUrl, options = {}) => {
  const {
    enableLogging = true,
    onConnect,
    onDisconnect,
    onError,
    ...socketOptions
  } = options;

  const defaultOptions = {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 3000,
    reconnectionAttempts: 5,
    timeout: 20000,
    ...socketOptions
  };

  const socket = io(serverUrl, defaultOptions);

  // Set up event handlers
  socket.on('connect', () => {
    if (enableLogging) {
      console.log(`Connected to Socket.IO: ${serverUrl}`);
    }
    if (onConnect) onConnect(socket);
  });

  socket.on('connect_error', (err) => {
    if (enableLogging) {
      console.error("Socket.IO connection error:", err.message);
    }
    if (onError) onError(err);
  });

  socket.on('disconnect', (reason) => {
    if (enableLogging) {
      console.log(`⚠️  Socket.IO disconnected: ${reason}`);
    }
    if (onDisconnect) onDisconnect(reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    if (enableLogging) {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
    }
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    if (enableLogging) {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    }
  });

  return socket;
};

/**
 * Emit an event with error handling
 * @param {Object} socket - Socket.IO client instance
 * @param {string} eventName - Event name to emit
 * @param {Object} data - Data to send
 * @returns {Promise<boolean>} Success status
 */
const safeEmit = async (socket, eventName, data) => {
  try {
    if (!socket || !socket.connected) {
      console.warn(`⚠️  Cannot emit '${eventName}': Socket not connected`);
      return false;
    }
    
    socket.emit(eventName, data);
    return true;
  } catch (error) {
    console.error(`Error emitting '${eventName}':`, error.message);
    return false;
  }
};

module.exports = {
  createSocket,
  safeEmit
};
