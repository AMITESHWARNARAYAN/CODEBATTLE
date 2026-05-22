// ═══════════════════════════════════════════════════
//  Socket.io Singleton
//  Replaces global.io — provides a safe, importable
//  reference to the Socket.io server instance.
// ═══════════════════════════════════════════════════

let _io = null;

/**
 * Store the Socket.io server instance.
 * Called once during server startup.
 * @param {import('socket.io').Server} io
 */
export function setIO(io) {
  _io = io;
}

/**
 * Get the Socket.io server instance.
 * Returns null if called before setIO().
 * @returns {import('socket.io').Server | null}
 */
export function getIO() {
  return _io;
}
