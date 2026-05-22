/**
 * Match Timeout Manager
 * 
 * Handles automatic resolution of matches when the timer expires.
 * Prevents matches from staying "in-progress" forever when a player
 * disconnects, goes AFK, or never submits.
 * 
 * Default timeout: 30 minutes (1800 seconds)
 */

import Match from '../models/Match.js';
import User from '../models/User.js';
import { calculateMatchRatings, getBestSubmission, determineWinner } from './eloRating.js';
import { createNotification } from '../routes/notifications.js';
import { getIO } from './socketSingleton.js';

// Active timeout handles: matchId → timeoutId
const activeTimeouts = new Map();

// Default match duration: 30 minutes
const DEFAULT_MATCH_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Schedule a timeout for a match. When it fires, auto-resolve the match
 * if it's still in-progress.
 * 
 * @param {string} matchId - The match ObjectId
 * @param {number} timeoutMs - Timeout in milliseconds (default: 30 minutes)
 */
export const scheduleMatchTimeout = (matchId, timeoutMs = DEFAULT_MATCH_TIMEOUT_MS) => {
  const id = matchId.toString();

  // Clear any existing timeout for this match
  if (activeTimeouts.has(id)) {
    clearTimeout(activeTimeouts.get(id));
  }

  const handle = setTimeout(async () => {
    activeTimeouts.delete(id);
    await resolveExpiredMatch(id);
  }, timeoutMs);

  activeTimeouts.set(id, handle);
  console.log(`⏱️  Match timeout scheduled: ${id} (${timeoutMs / 1000}s)`);
};

/**
 * Cancel a scheduled timeout (e.g., when the match resolves normally)
 * @param {string} matchId
 */
export const cancelMatchTimeout = (matchId) => {
  const id = matchId.toString();
  if (activeTimeouts.has(id)) {
    clearTimeout(activeTimeouts.get(id));
    activeTimeouts.delete(id);
    console.log(`⏱️  Match timeout cancelled: ${id}`);
  }
};

/**
 * Resolve an expired match:
 * - If both submitted → determine winner normally
 * - If one submitted → that player wins
 * - If neither submitted → cancel the match (no rating change)
 */
const resolveExpiredMatch = async (matchId) => {
  try {
    // Atomically grab the match if it's still in-progress
    const match = await Match.findOneAndUpdate(
      { _id: matchId, status: 'in-progress' },
      { $set: { status: 'completed', endTime: new Date() } },
      { new: true }
    ).populate('players');

    if (!match) {
      // Already resolved by normal submission flow
      return;
    }

    console.log(`⏱️  Match timeout fired: ${matchId} — auto-resolving`);

    match.duration = Math.floor((match.endTime - match.startTime) / 1000);

    // Solo matches: just mark as completed, no rating change
    if (match.matchType === 'solo') {
      await match.save();
      return;
    }

    const player1Id = match.players[0]._id.toString();
    const player2Id = match.players[1]._id.toString();

    // Get best submission from each player (null if they never submitted)
    const player1Submission = getBestSubmission(match.submissions, player1Id);
    const player2Submission = getBestSubmission(match.submissions, player2Id);

    // Determine result
    const result = determineWinner(
      player1Submission,
      player2Submission,
      match.startTime,
      match.submissions
    );

    // If both are AFK (neither submitted), cancel the match
    if (!player1Submission && !player2Submission) {
      match.status = 'cancelled';
      await match.save();

      // Notify both players
      const io = getIO();
      if (io) {
        io.to(`match-${matchId}`).emit('match-expired', {
          matchId,
          reason: 'Both players timed out. Match cancelled.',
          status: 'cancelled'
        });
      }

      await createNotification(player1Id, 'match_result', 'Match Expired',
        'Match cancelled — neither player submitted code.', `/results/${matchId}`);
      await createNotification(player2Id, 'match_result', 'Match Expired',
        'Match cancelled — neither player submitted code.', `/results/${matchId}`);

      console.log(`⏱️  Match ${matchId} cancelled — both AFK`);
      return;
    }

    // Fetch player documents for rating calculation
    const player1 = await User.findById(player1Id);
    const player2 = await User.findById(player2Id);

    // Calculate rating changes with dynamic K-factors
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
      match.winner = player1Id;
      player1.wins++;
      player2.losses++;
    } else if (result === 'player2') {
      match.winner = player2Id;
      player2.wins++;
      player1.losses++;
    } else {
      player1.draws++;
      player2.draws++;
    }

    await player1.save();
    await player2.save();

    // Store rating changes in match
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

    // Notify both players via socket
    const io = getIO();
    if (io) {
      io.to(`match-${matchId}`).emit('match-expired', {
        matchId,
        reason: 'Match time expired. Results determined automatically.',
        status: 'completed',
        winner: match.winner?.toString() || null,
        result
      });
    }

    // Send notifications
    const p1Msg = result === 'player1'
      ? `🎉 You won (timeout)! Rating: +${ratingChanges.player1.change}`
      : result === 'draw'
        ? `Match timed out — Draw. Rating: ${ratingChanges.player1.change >= 0 ? '+' : ''}${ratingChanges.player1.change}`
        : `Match timed out — You lost. Rating: ${ratingChanges.player1.change}`;

    const p2Msg = result === 'player2'
      ? `🎉 You won (timeout)! Rating: +${ratingChanges.player2.change}`
      : result === 'draw'
        ? `Match timed out — Draw. Rating: ${ratingChanges.player2.change >= 0 ? '+' : ''}${ratingChanges.player2.change}`
        : `Match timed out — You lost. Rating: ${ratingChanges.player2.change}`;

    await createNotification(player1Id, 'match_result', 'Match Timed Out', p1Msg, `/results/${matchId}`);
    await createNotification(player2Id, 'match_result', 'Match Timed Out', p2Msg, `/results/${matchId}`);

    console.log(`⏱️  Match ${matchId} auto-resolved: ${result} (timeout)`);
  } catch (error) {
    console.error(`⏱️  Error resolving expired match ${matchId}:`, error);
  }
};

/**
 * On server startup, re-schedule timeouts for any in-progress matches
 * that were created before the server restarted.
 */
export const restoreActiveTimeouts = async () => {
  try {
    const inProgressMatches = await Match.find({
      status: 'in-progress',
      matchType: { $in: ['matchmaking', 'friend'] },
      startTime: { $exists: true }
    }).select('_id startTime');

    let restored = 0;
    for (const match of inProgressMatches) {
      const elapsed = Date.now() - new Date(match.startTime).getTime();
      const remaining = DEFAULT_MATCH_TIMEOUT_MS - elapsed;

      if (remaining <= 0) {
        // Already expired while server was down — resolve immediately
        await resolveExpiredMatch(match._id.toString());
      } else {
        scheduleMatchTimeout(match._id, remaining);
        restored++;
      }
    }

    if (restored > 0 || inProgressMatches.length > 0) {
      console.log(`⏱️  Restored ${restored} match timeouts, resolved ${inProgressMatches.length - restored} expired matches`);
    }
  } catch (error) {
    console.error('⏱️  Error restoring match timeouts:', error);
  }
};
