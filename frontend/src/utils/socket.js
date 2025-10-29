import io from 'socket.io-client';

// Get base URL from environment variable and remove /api suffix for socket connection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Matchmaking events
export const joinMatchmakingQueue = (userId, rating) => {
  const socket = getSocket();
  socket.emit('join-queue', { userId, rating });
};

export const leaveMatchmakingQueue = (userId) => {
  const socket = getSocket();
  socket.emit('leave-queue', { userId });
};

export const onQueueJoined = (callback) => {
  const socket = getSocket();
  socket.on('queue-joined', callback);
};

export const onQueueUpdate = (callback) => {
  const socket = getSocket();
  socket.on('queue-update', callback);
};

export const onMatchFound = (callback) => {
  const socket = getSocket();
  socket.on('match-found', callback);
};

export const onQueueLeft = (callback) => {
  const socket = getSocket();
  socket.on('queue-left', callback);
};

// Match events
export const joinMatch = (matchId) => {
  const socket = getSocket();
  socket.emit('join-match', matchId);
};

export const leaveMatch = (matchId) => {
  const socket = getSocket();
  socket.emit('leave-match', matchId);
};

export const submitCodeNotification = (matchId, userId, username) => {
  const socket = getSocket();
  socket.emit('code-submitted', { matchId, userId, username });
};

export const onOpponentSubmitted = (callback) => {
  const socket = getSocket();
  socket.on('opponent-submitted', callback);
};

// User status
export const setUserOnline = (userId, email) => {
  const socket = getSocket();
  socket.emit('user-online', { userId, email });
  // Also join notification room
  socket.emit('join', userId);
};

export const setUserOffline = (userId) => {
  const socket = getSocket();
  socket.emit('user-offline', userId);
};

// Challenge events
export const sendChallenge = (matchId, challengerEmail, challengerUsername, challengedEmail, challengedUsername) => {
  const socket = getSocket();
  socket.emit('send-challenge', {
    matchId,
    challengerEmail,
    challengerUsername,
    challengedEmail,
    challengedUsername
  });
};

export const onChallengeReceived = (callback) => {
  const socket = getSocket();
  socket.on('challenge-received', callback);
};

export const acceptChallenge = (matchId, challengerEmail) => {
  const socket = getSocket();
  socket.emit('accept-challenge', { matchId, challengerEmail });
};

export const onChallengeAccepted = (callback) => {
  const socket = getSocket();
  socket.on('challenge-accepted', callback);
};

export const rejectChallenge = (matchId, challengerEmail) => {
  const socket = getSocket();
  socket.emit('reject-challenge', { matchId, challengerEmail });
};

export const onChallengeRejected = (callback) => {
  const socket = getSocket();
  socket.on('challenge-rejected', callback);
};

export const removeListener = (event) => {
  const socket = getSocket();
  socket.off(event);
};

export const removeAllListeners = () => {
  const socket = getSocket();
  socket.removeAllListeners();
};

