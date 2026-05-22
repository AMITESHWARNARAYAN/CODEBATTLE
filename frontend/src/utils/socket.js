import io from 'socket.io-client';

// Get base URL from environment variable and remove /api suffix for socket connection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

let socket = null;

export const initSocket = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('Socket disconnected and cleared because no token is present');
    }
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        token: token
      }
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  } else {
    // If socket already exists, update token if it has changed
    if (socket.auth?.token !== token) {
      socket.auth = { token: token };
      socket.disconnect().connect();
    } else if (!socket.connected) {
      socket.connect();
    }
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
  if (socket) socket.emit('join-queue', { userId, rating });
};

export const leaveMatchmakingQueue = (userId) => {
  const socket = getSocket();
  if (socket) socket.emit('leave-queue', { userId });
};

export const onQueueJoined = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('queue-joined', callback);
};

export const onQueueUpdate = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('queue-update', callback);
};

export const onMatchFound = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('match-found', callback);
};

export const onQueueLeft = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('queue-left', callback);
};

// Match events
export const joinMatch = (matchId) => {
  const socket = getSocket();
  if (socket) socket.emit('join-match', matchId);
};

export const leaveMatch = (matchId) => {
  const socket = getSocket();
  if (socket) socket.emit('leave-match', matchId);
};

export const submitCodeNotification = (matchId, userId, username) => {
  const socket = getSocket();
  if (socket) socket.emit('code-submitted', { matchId, userId, username });
};

export const onOpponentSubmitted = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('opponent-submitted', callback);
};

export const onOpponentGaveUp = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('opponent-gave-up', callback);
};

export const onMatchExpired = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('match-expired', callback);
};

export const onOpponentDisconnected = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('opponent-disconnected', callback);
};

export const onReconnectCountdown = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('reconnect-countdown', callback);
};

export const onOpponentReconnected = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('opponent-reconnected', callback);
};

export const onMatchForfeited = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('match-forfeited', callback);
};

// Contest events
export const joinContestRoom = (contestId) => {
  const socket = getSocket();
  if (socket) socket.emit('join-contest', contestId);
};

export const leaveContestRoom = (contestId) => {
  const socket = getSocket();
  if (socket) socket.emit('leave-contest', contestId);
};

export const onContestUpdate = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('contest-update', callback);
};

// Chat
export const sendChatMessage = (matchId, sender, message) => {
  const socket = getSocket();
  if (socket) socket.emit('send-chat-message', { matchId, sender, message });
};

export const onChatMessage = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('receive-chat-message', callback);
};

// User status
export const setUserOnline = (userId, email) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('user-online', { userId, email });
    // Also join notification room
    socket.emit('join', userId);
  }
};

export const setUserOffline = (userId) => {
  const socket = getSocket();
  if (socket) socket.emit('user-offline', userId);
};

// Challenge events
export const sendChallenge = (matchId, challengerEmail, challengerUsername, challengedEmail, challengedUsername) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('send-challenge', {
      matchId,
      challengerEmail,
      challengerUsername,
      challengedEmail,
      challengedUsername
    });
  }
};

export const onChallengeReceived = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('challenge-received', callback);
};

export const acceptChallenge = (matchId, challengerEmail) => {
  const socket = getSocket();
  if (socket) socket.emit('accept-challenge', { matchId, challengerEmail });
};

export const onChallengeAccepted = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('challenge-accepted', callback);
};

export const rejectChallenge = (matchId, challengerEmail) => {
  const socket = getSocket();
  if (socket) socket.emit('reject-challenge', { matchId, challengerEmail });
};

export const onChallengeRejected = (callback) => {
  const socket = getSocket();
  if (socket) socket.on('challenge-rejected', callback);
};

export const removeListener = (event, callback) => {
  const socket = getSocket();
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};

export const removeAllListeners = () => {
  const socket = getSocket();
  if (socket) socket.removeAllListeners();
};

