import Match from '../models/Match.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { getRandomProblem } from '../utils/randomProblem.js';
import { scheduleMatchTimeout, cancelMatchTimeout } from '../utils/matchTimeout.js';
import { calculateMatchRatings } from '../utils/eloRating.js';
import { createNotification } from '../routes/notifications.js';

// Matchmaking queue: { userId, socketId, rating, joinedAt }
const matchmakingQueue = [];

// Active forfeit timers: matchId-userId -> { intervalId, secondsLeft }
const forfeitTimers = new Map();

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
 * Try to match players in the queue.
 * Simple strategy: match any two available players immediately.
 * Rating is used for ELO calculation at match end, not for queue filtering.
 * This is ideal for a new app with a small player pool.
 */
const tryMatchAll = async (io) => {
  // Need at least 2 players to make a match
  while (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();

    try {
      const match = await createMatch(player1, player2);
      io.to(player1.socketId).emit('match-found', match);
      io.to(player2.socketId).emit('match-found', match);
      console.log(`Match created between ${player1.userId} and ${player2.userId}`);
    } catch (err) {
      console.error('Error creating match in tryMatchAll:', err);
      // Put them back if match creation failed
      matchmakingQueue.unshift(player2);
      matchmakingQueue.unshift(player1);
      break;
    }
  }
};

/**
 * Create a match between two players
 */
const createMatch = async (player1, player2) => {
  try {
    // Get a random problem (O(1) via $sample aggregation)
    const problem = await getRandomProblem();

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

    // Schedule 30-minute timeout for auto-resolution
    scheduleMatchTimeout(match._id);

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
 * Forfeits a match when a player runs out of reconnection time
 */
const forfeitMatch = async (matchId, loserId, io) => {
  try {
    // Atomically find the match and set status to completed
    const match = await Match.findOneAndUpdate(
      { _id: matchId, status: 'in-progress' },
      { $set: { status: 'completed', endTime: new Date() } },
      { new: true }
    ).populate('players');

    if (!match) return; // Already resolved or expired

    // Cancel the 30-minute auto-resolution timeout
    cancelMatchTimeout(matchId);

    const player1Id = match.players[0]._id.toString();
    const player2Id = match.players[1]._id.toString();
    const isPlayer1Loser = player1Id === loserId.toString();

    const winnerId = isPlayer1Loser ? player2Id : player1Id;
    const result = isPlayer1Loser ? 'player2' : 'player1';

    match.winner = winnerId;
    match.duration = Math.floor((match.endTime - match.startTime) / 1000);

    // Fetch players to calculate ELO rating changes
    const player1 = await User.findById(player1Id);
    const player2 = await User.findById(player2Id);

    const ratingChanges = calculateMatchRatings(
      player1.rating, player1.totalMatches,
      player2.rating, player2.totalMatches,
      result
    );

    // Update ratings and stats
    player1.updateRating(ratingChanges.player1.newRating);
    player1.totalMatches++;
    player2.updateRating(ratingChanges.player2.newRating);
    player2.totalMatches++;

    if (result === 'player1') {
      player1.wins++;
      player2.losses++;
    } else {
      player2.wins++;
      player1.losses++;
    }

    await player1.save();
    await player2.save();

    // Store rating changes in the match
    match.ratingChanges = [
      {
        userId: player1Id,
        oldRating: ratingChanges.player1.oldRating,
        newRating: ratingChanges.player1.newRating,
        change: ratingChanges.player1.change
      },
      {
        userId: player2Id,
        oldRating: ratingChanges.player2.oldRating,
        newRating: ratingChanges.player2.newRating,
        change: ratingChanges.player2.change
      }
    ];

    await match.save();

    // Broadcast match-forfeited event to match room
    if (io) {
      io.to(`match-${matchId}`).emit('match-forfeited', {
        matchId,
        loserId,
        winnerId,
        reason: 'Player disconnected and ran out of reconnection time.',
        ratingChanges: match.ratingChanges
      });
    }

    // Send notifications to both players
    const loserMsg = `❌ Match forfeited due to disconnection. Rating: ${isPlayer1Loser ? ratingChanges.player1.change : ratingChanges.player2.change}`;
    const winnerMsg = `🎉 Opponent disconnected. You won by forfeit! Rating: +${isPlayer1Loser ? ratingChanges.player2.change : ratingChanges.player1.change}`;

    await createNotification(loserId, 'match_result', 'Match Forfeited', loserMsg, `/results/${matchId}`);
    await createNotification(winnerId, 'match_result', 'Match Forfeited', winnerMsg, `/results/${matchId}`);

    console.log(`🔌 Match ${matchId} forfeited by ${loserId}. Winner: ${winnerId}.`);
  } catch (error) {
    console.error(`Error in forfeitMatch for match ${matchId}:`, error);
  }
};

/**
 * Setup matchmaking socket handlers
 */
export const setupMatchmaking = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join matchmaking queue
    socket.on('join-queue', async () => {
      try {
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) {
          return socket.emit('error', { message: 'Unauthorized socket session' });
        }

        // Fetch fresh user rating from database to prevent clients from spoofing ratings
        const user = await User.findById(authenticatedUserId);
        if (!user) {
          return socket.emit('error', { message: 'User not found' });
        }
        
        const rating = user.rating || 0;
        const userId = authenticatedUserId;

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

        const waitTime = (Date.now() - player.joinedAt) / 1000;
        const maxRatingDiff = Math.min(
          INITIAL_RATING_DIFF + (waitTime * RATING_DIFF_INCREASE_PER_SECOND),
          MAX_RATING_DIFF
        );

        socket.emit('queue-joined', {
          position: matchmakingQueue.length,
          message: 'Searching for opponent...',
          rating: player.rating,
          minRating: Math.max(0, player.rating - maxRatingDiff),
          maxRating: player.rating + maxRatingDiff,
          maxRatingDiff: maxRatingDiff
        });

        console.log(`User ${userId} joined queue. Queue size: ${matchmakingQueue.length}`);

        // Try to find a match
        tryMatchAll(io);
      } catch (error) {
        console.error('Join queue error:', error);
        socket.emit('error', { message: 'Failed to join queue' });
      }
    });

    // Leave matchmaking queue
    socket.on('leave-queue', () => {
      const authenticatedUserId = socket.user?._id?.toString();
      if (!authenticatedUserId) return;

      const index = matchmakingQueue.findIndex(p => p.userId === authenticatedUserId);
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
        socket.emit('queue-left', { message: 'Left matchmaking queue' });
        console.log(`User ${authenticatedUserId} left queue. Queue size: ${matchmakingQueue.length}`);
      }
    });

    // Match events
    socket.on('join-match', async (matchId) => {
      try {
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

        // Verify the user is actually a player in the match before allowing room entry
        const match = await Match.findById(matchId);
        if (match && match.players.some(p => p.toString() === authenticatedUserId)) {
          socket.join(`match-${matchId}`);
          console.log(`Socket ${socket.id} (User ${authenticatedUserId}) joined match room: match-${matchId}`);
          
          // Clear forfeit timer if it exists for this user and match
          const timerKey = `${matchId}-${authenticatedUserId}`;
          if (forfeitTimers.has(timerKey)) {
            const timerObj = forfeitTimers.get(timerKey);
            clearInterval(timerObj.intervalId);
            forfeitTimers.delete(timerKey);
            console.log(`🔌 User ${authenticatedUserId} reconnected. Forfeit timer cleared for match ${matchId}.`);
            
            // Broadcast opponent reconnected to the room
            io.to(`match-${matchId}`).emit('opponent-reconnected', {
              userId: authenticatedUserId,
              message: 'Opponent reconnected.'
            });
          }
        } else {
          console.warn(`Unauthorized match-room join attempt from socket ${socket.id} to match-${matchId}`);
        }
      } catch (err) {
        console.error('join-match socket error:', err);
      }
    });

    socket.on('leave-match', (matchId) => {
      socket.leave(`match-${matchId}`);
      console.log(`Socket ${socket.id} left match room: match-${matchId}`);
    });

    // Contest events
    socket.on('join-contest', (contestId) => {
      socket.join(`contest-${contestId}`);
      console.log(`Socket ${socket.id} joined contest room: contest-${contestId}`);
    });

    socket.on('leave-contest', (contestId) => {
      socket.leave(`contest-${contestId}`);
      console.log(`Socket ${socket.id} left contest room: contest-${contestId}`);
    });

    // Join arbitrary room (secured - only allow joining own userId room)
    socket.on('join', (room) => {
      const authenticatedUserId = socket.user?._id?.toString();
      if (authenticatedUserId && room === authenticatedUserId) {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      } else {
        console.warn(`Unauthorized room join attempt by socket ${socket.id} to room ${room}`);
      }
    });

    // Broadcast submission to match room
    socket.on('code-submitted', async (data) => {
      try {
        const { matchId } = data;
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

        const user = await User.findById(authenticatedUserId);
        if (!user) return;

        socket.to(`match-${matchId}`).emit('opponent-submitted', {
          userId: authenticatedUserId,
          username: user.username,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error('code-submitted socket error:', err);
      }
    });

    // Handle chat messages
    socket.on('send-chat-message', async (data) => {
      try {
        const { matchId, message } = data;
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

        const user = await User.findById(authenticatedUserId);
        if (!user) return;

        socket.to(`match-${matchId}`).emit('receive-chat-message', {
          type: 'chat',
          sender: user.username,
          message,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error('send-chat-message socket error:', err);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      const authenticatedUserId = socket.user?._id?.toString();
      if (authenticatedUserId) {
        // Remove from matchmaking queue
        const index = matchmakingQueue.findIndex(p => p.userId === authenticatedUserId);
        if (index !== -1) {
          matchmakingQueue.splice(index, 1);
          console.log(`User ${authenticatedUserId} removed from queue (disconnect). Queue size: ${matchmakingQueue.length}`);
        }
        // Remove from online users
        onlineUsers.delete(authenticatedUserId);

        // Find active in-progress match involving this user
        try {
          const activeMatch = await Match.findOne({
            players: authenticatedUserId,
            status: 'in-progress'
          });

          if (activeMatch) {
            const matchId = activeMatch._id.toString();
            const timerKey = `${matchId}-${authenticatedUserId}`;
            
            // If there's already a forfeit timer for some reason, clear it first
            if (forfeitTimers.has(timerKey)) {
              clearInterval(forfeitTimers.get(timerKey).intervalId);
            }

            // Emit to match room that user disconnected
            io.to(`match-${matchId}`).emit('opponent-disconnected', {
              userId: authenticatedUserId,
              secondsLeft: 30
            });

            console.log(`🔌 User ${authenticatedUserId} disconnected. Starting 30s forfeit countdown for match ${matchId}.`);

            let secondsLeft = 30;
            const intervalId = setInterval(async () => {
              secondsLeft--;

              if (secondsLeft <= 0) {
                clearInterval(intervalId);
                forfeitTimers.delete(timerKey);
                
                // Trigger forfeit
                await forfeitMatch(matchId, authenticatedUserId, io);
              } else {
                // Update countdown
                io.to(`match-${matchId}`).emit('reconnect-countdown', {
                  matchId,
                  userId: authenticatedUserId,
                  secondsLeft
                });
              }
            }, 1000);

            forfeitTimers.set(timerKey, { intervalId, secondsLeft });
          }
        } catch (err) {
          console.error('Error handling disconnect forfeit check:', err);
        }
      }
      console.log('Client disconnected:', socket.id);
    });

    // Update user online status
    socket.on('user-online', async () => {
      try {
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

        const user = await User.findById(authenticatedUserId);
        if (!user) return;

        // Store in online users map
        onlineUsers.set(authenticatedUserId, { socketId: socket.id, email: user.email });

        await User.findByIdAndUpdate(authenticatedUserId, {
          isOnline: true,
          lastSeen: new Date()
        });

        console.log(`User ${authenticatedUserId} (${user.email}) is online`);
      } catch (error) {
        console.error('Update online status error:', error);
      }
    });

    socket.on('user-offline', async () => {
      try {
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

        // Remove from online users map
        onlineUsers.delete(authenticatedUserId);

        await User.findByIdAndUpdate(authenticatedUserId, {
          isOnline: false,
          lastSeen: new Date()
        });

        console.log(`User ${authenticatedUserId} is offline`);
      } catch (error) {
        console.error('Update offline status error:', error);
      }
    });

    // Send friend challenge via email
    socket.on('send-challenge', async (data) => {
      try {
        const { matchId, challengedEmail, challengedUsername } = data;
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

        const challenger = await User.findById(authenticatedUserId);
        if (!challenger) return;

        const challengerUsername = challenger.username;
        const challengerEmail = challenger.email;

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
    socket.on('accept-challenge', async (data) => {
      try {
        const { matchId, challengerEmail } = data;
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

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
    socket.on('reject-challenge', async (data) => {
      try {
        const { matchId, challengerEmail } = data;
        const authenticatedUserId = socket.user?._id?.toString();
        if (!authenticatedUserId) return;

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

  // Periodic queue re-matching + status broadcast (every 2 seconds)
  setInterval(() => {
    if (matchmakingQueue.length > 0) {
      // Re-attempt matching (rating windows expand over time)
      tryMatchAll(io);

      // Broadcast queue status to remaining players
      matchmakingQueue.forEach((player, index) => {
        const waitTime = (Date.now() - player.joinedAt) / 1000;
        const maxRatingDiff = Math.min(
          INITIAL_RATING_DIFF + (waitTime * RATING_DIFF_INCREASE_PER_SECOND),
          MAX_RATING_DIFF
        );

        io.to(player.socketId).emit('queue-update', {
          position: index + 1,
          queueSize: matchmakingQueue.length,
          waitTime: Math.floor(waitTime),
          rating: player.rating,
          minRating: Math.max(0, player.rating - maxRatingDiff),
          maxRating: player.rating + maxRatingDiff,
          maxRatingDiff: maxRatingDiff
        });
      });
    }
  }, 2000);
};

export default setupMatchmaking;

