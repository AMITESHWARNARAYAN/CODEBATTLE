import Match from '../models/Match.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

// Matchmaking queue: { userId, socketId, rating, joinedAt }
const matchmakingQueue = [];

// Online users map: { userId: { socketId, email } }
const onlineUsers = new Map();

// Export for use in routes
export const getOnlineUsers = () => onlineUsers;

// Rating difference threshold for matching (increases over time)
const INITIAL_RATING_DIFF = 100;
const MAX_RATING_DIFF = 500;
const RATING_DIFF_INCREASE_PER_SECOND = 20;

/**
 * Find a suitable opponent for a player
 */
const findOpponent = (player) => {
  const waitTime = (Date.now() - player.joinedAt) / 1000; // seconds
  const maxRatingDiff = Math.min(
    INITIAL_RATING_DIFF + (waitTime * RATING_DIFF_INCREASE_PER_SECOND),
    MAX_RATING_DIFF
  );

  // Find opponent with similar rating
  for (let i = 0; i < matchmakingQueue.length; i++) {
    const opponent = matchmakingQueue[i];
    
    if (opponent.userId === player.userId) continue;
    
    const ratingDiff = Math.abs(player.rating - opponent.rating);
    
    if (ratingDiff <= maxRatingDiff) {
      return { opponent, index: i };
    }
  }

  return null;
};

/**
 * Create a match between two players
 */
const createMatch = async (player1, player2) => {
  try {
    // Get a random problem
    const count = await Problem.countDocuments();
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne().skip(random);

    if (!problem) {
      throw new Error('No problems available');
    }

    // Create match
    const match = await Match.create({
      matchType: 'matchmaking',
      problem: problem._id,
      players: [player1.userId, player2.userId],
      status: 'in-progress',
      startTime: new Date()
    });

    await match.populate('problem players');

    // Prepare match data (without hidden test cases)
    const matchData = match.toObject();
    matchData.problem.visibleTestCases = matchData.problem.testCases.filter(tc => !tc.isHidden);
    delete matchData.problem.testCases;

    return matchData;
  } catch (error) {
    console.error('Create match error:', error);
    throw error;
  }
};

/**
 * Setup matchmaking socket handlers
 */
export const setupMatchmaking = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join matchmaking queue
    socket.on('join-queue', async (data) => {
      try {
        const { userId, rating } = data;

        // Check if user is already in queue
        const existingIndex = matchmakingQueue.findIndex(p => p.userId === userId);
        if (existingIndex !== -1) {
          matchmakingQueue.splice(existingIndex, 1);
        }

        // Add to queue
        const player = {
          userId,
          socketId: socket.id,
          rating,
          joinedAt: Date.now()
        };

        matchmakingQueue.push(player);

        socket.emit('queue-joined', {
          position: matchmakingQueue.length,
          message: 'Searching for opponent...'
        });

        console.log(`User ${userId} joined queue. Queue size: ${matchmakingQueue.length}`);

        // Try to find a match
        const result = findOpponent(player);

        if (result) {
          const { opponent, index } = result;

          // Remove both players from queue
          matchmakingQueue.splice(index, 1);
          const playerIndex = matchmakingQueue.findIndex(p => p.userId === userId);
          if (playerIndex !== -1) {
            matchmakingQueue.splice(playerIndex, 1);
          }

          // Create match
          const match = await createMatch(player, opponent);

          // Notify both players
          io.to(player.socketId).emit('match-found', match);
          io.to(opponent.socketId).emit('match-found', match);

          console.log(`Match created between ${userId} and ${opponent.userId}`);
        }
      } catch (error) {
        console.error('Join queue error:', error);
        socket.emit('error', { message: 'Failed to join queue' });
      }
    });

    // Leave matchmaking queue
    socket.on('leave-queue', (data) => {
      const { userId } = data;
      const index = matchmakingQueue.findIndex(p => p.userId === userId);
      
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
        socket.emit('queue-left', { message: 'Left matchmaking queue' });
        console.log(`User ${userId} left queue. Queue size: ${matchmakingQueue.length}`);
      }
    });

    // Match events
    socket.on('join-match', (matchId) => {
      socket.join(`match-${matchId}`);
      console.log(`Socket ${socket.id} joined match room: match-${matchId}`);
    });

    socket.on('leave-match', (matchId) => {
      socket.leave(`match-${matchId}`);
      console.log(`Socket ${socket.id} left match room: match-${matchId}`);
    });

    // Broadcast submission to match room
    socket.on('code-submitted', (data) => {
      const { matchId, userId, username } = data;
      socket.to(`match-${matchId}`).emit('opponent-submitted', {
        userId,
        username,
        timestamp: Date.now()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Remove from queue if present
      const index = matchmakingQueue.findIndex(p => p.socketId === socket.id);
      if (index !== -1) {
        const player = matchmakingQueue[index];
        matchmakingQueue.splice(index, 1);
        console.log(`User ${player.userId} removed from queue (disconnect). Queue size: ${matchmakingQueue.length}`);
      }
      
      console.log('Client disconnected:', socket.id);
    });

    // Update user online status
    socket.on('user-online', async (data) => {
      try {
        const { userId, email } = data;

        // Store in online users map
        onlineUsers.set(userId, { socketId: socket.id, email });

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date()
        });

        console.log(`User ${userId} (${email}) is online`);
      } catch (error) {
        console.error('Update online status error:', error);
      }
    });

    socket.on('user-offline', async (userId) => {
      try {
        // Remove from online users map
        onlineUsers.delete(userId);

        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date()
        });

        console.log(`User ${userId} is offline`);
      } catch (error) {
        console.error('Update offline status error:', error);
      }
    });

    // Send friend challenge via email
    socket.on('send-challenge', async (data) => {
      try {
        const { matchId, challengerEmail, challengerUsername, challengedEmail, challengedUsername } = data;

        // Find if challenged user is online
        let targetSocket = null;
        for (const [userId, userInfo] of onlineUsers.entries()) {
          if (userInfo.email === challengedEmail) {
            targetSocket = userInfo.socketId;
            break;
          }
        }

        if (targetSocket) {
          // User is online - send live notification
          io.to(targetSocket).emit('challenge-received', {
            matchId,
            challenger: challengerUsername,
            challengerEmail,
            message: `${challengerUsername} challenged you to a DSA battle!`,
            timestamp: Date.now()
          });

          console.log(`Live challenge sent to ${challengedEmail}`);
        } else {
          // User is offline - they will see it when they log in
          console.log(`Challenge queued for offline user ${challengedEmail}`);
        }
      } catch (error) {
        console.error('Send challenge error:', error);
      }
    });

    // Accept challenge
    socket.on('accept-challenge', (data) => {
      try {
        const { matchId, challengerEmail } = data;

        // Find challenger's socket
        let challengerSocket = null;
        for (const [userId, userInfo] of onlineUsers.entries()) {
          if (userInfo.email === challengerEmail) {
            challengerSocket = userInfo.socketId;
            break;
          }
        }

        if (challengerSocket) {
          // Notify challenger that challenge was accepted
          io.to(challengerSocket).emit('challenge-accepted', {
            matchId,
            message: 'Your challenge was accepted!',
            timestamp: Date.now()
          });
        }

        console.log(`Challenge ${matchId} accepted`);
      } catch (error) {
        console.error('Accept challenge error:', error);
      }
    });

    // Reject challenge
    socket.on('reject-challenge', (data) => {
      try {
        const { matchId, challengerEmail } = data;

        // Find challenger's socket
        let challengerSocket = null;
        for (const [userId, userInfo] of onlineUsers.entries()) {
          if (userInfo.email === challengerEmail) {
            challengerSocket = userInfo.socketId;
            break;
          }
        }

        if (challengerSocket) {
          // Notify challenger that challenge was rejected
          io.to(challengerSocket).emit('challenge-rejected', {
            matchId,
            message: 'Your challenge was rejected',
            timestamp: Date.now()
          });
        }

        console.log(`Challenge ${matchId} rejected`);
      } catch (error) {
        console.error('Reject challenge error:', error);
      }
    });
  });

  // Periodic queue status broadcast
  setInterval(() => {
    if (matchmakingQueue.length > 0) {
      matchmakingQueue.forEach((player, index) => {
        io.to(player.socketId).emit('queue-update', {
          position: index + 1,
          queueSize: matchmakingQueue.length,
          waitTime: Math.floor((Date.now() - player.joinedAt) / 1000)
        });
      });
    }
  }, 2000); // Update every 2 seconds
};

export default setupMatchmaking;

