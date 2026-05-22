/**
 * ELO Rating System (Chess.com-inspired)
 * 
 * Key design decisions:
 * - Starting rating: 0 (players climb up from zero)
 * - Rating floor: 0 (never goes negative)
 * - Dynamic K-factor: 40 (new) / 20 (standard) / 10 (high-rated)
 * - Winner tiebreaker: real-world submission speed, not CPU execution time
 * - Best submission is used, not the last one
 * - AFK/no-submission = automatic loss
 */

// ─── Dynamic K-Factor ─────────────────────────────────────────
// Chess.com uses tiered K-factors for rating stability:
//   - New players (< 15 matches): K=40  → fast convergence to true skill
//   - Standard players:           K=20  → balanced volatility
//   - High-rated (≥ 2000):        K=10  → stable leaderboard, small swings

const NEW_PLAYER_THRESHOLD = 15;
const HIGH_RATING_THRESHOLD = 2000;
const K_NEW = 40;
const K_STANDARD = 20;
const K_HIGH = 10;
const RATING_FLOOR = 0;

/**
 * Get dynamic K-factor based on player's experience and current rating
 * @param {number} rating - Player's current rating
 * @param {number} totalMatches - Total rated matches played
 * @returns {number} K-factor for this player
 */
export const getDynamicKFactor = (rating, totalMatches) => {
  if (totalMatches < NEW_PLAYER_THRESHOLD) {
    return K_NEW;
  }
  if (rating >= HIGH_RATING_THRESHOLD) {
    return K_HIGH;
  }
  return K_STANDARD;
};

/**
 * Calculate expected score for a player (probability of winning)
 * @param {number} playerRating - Current rating of the player
 * @param {number} opponentRating - Current rating of the opponent
 * @returns {number} Expected score (0 to 1)
 */
export const calculateExpectedScore = (playerRating, opponentRating) => {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
};

/**
 * Calculate new rating after a match (single player)
 * Uses individual K-factor and enforces rating floor at 0
 * @param {number} currentRating - Current rating of the player
 * @param {number} opponentRating - Rating of the opponent
 * @param {number} actualScore - Actual score (1 for win, 0.5 for draw, 0 for loss)
 * @param {number} kFactor - Dynamic K-factor for this player
 * @returns {number} New rating (floored at 0)
 */
export const calculateNewRating = (currentRating, opponentRating, actualScore, kFactor) => {
  const expectedScore = calculateExpectedScore(currentRating, opponentRating);
  const ratingChange = kFactor * (actualScore - expectedScore);
  return Math.max(RATING_FLOOR, Math.round(currentRating + ratingChange));
};

/**
 * Calculate rating changes for both players in a match
 * Each player uses their own dynamic K-factor
 * 
 * @param {number} player1Rating - Rating of player 1
 * @param {number} player1Matches - Total matches played by player 1
 * @param {number} player2Rating - Rating of player 2
 * @param {number} player2Matches - Total matches played by player 2
 * @param {string} result - Result: 'player1', 'player2', or 'draw'
 * @returns {object} Rating changes for both players
 */
export const calculateMatchRatings = (player1Rating, player1Matches, player2Rating, player2Matches, result) => {
  let player1Score, player2Score;

  if (result === 'player1') {
    player1Score = 1;
    player2Score = 0;
  } else if (result === 'player2') {
    player1Score = 0;
    player2Score = 1;
  } else {
    player1Score = 0.5;
    player2Score = 0.5;
  }

  const k1 = getDynamicKFactor(player1Rating, player1Matches);
  const k2 = getDynamicKFactor(player2Rating, player2Matches);

  const newPlayer1Rating = calculateNewRating(player1Rating, player2Rating, player1Score, k1);
  const newPlayer2Rating = calculateNewRating(player2Rating, player1Rating, player2Score, k2);

  return {
    player1: {
      oldRating: player1Rating,
      newRating: newPlayer1Rating,
      change: newPlayer1Rating - player1Rating
    },
    player2: {
      oldRating: player2Rating,
      newRating: newPlayer2Rating,
      change: newPlayer2Rating - player2Rating
    }
  };
};

/**
 * Select the best submission from an array of submissions for a given userId.
 * "Best" = highest testCasesPassed; ties broken by earliest submittedAt.
 * 
 * @param {Array} submissions - All submissions in the match
 * @param {string} userId - The user ID to filter for
 * @returns {object|null} The best submission, or null if none exist
 */
export const getBestSubmission = (submissions, userId) => {
  const userSubmissions = submissions.filter(
    s => s.userId.toString() === userId.toString()
  );

  if (userSubmissions.length === 0) return null;

  // Sort: most test cases passed first, then earliest submission time
  userSubmissions.sort((a, b) => {
    if (b.testCasesPassed !== a.testCasesPassed) {
      return b.testCasesPassed - a.testCasesPassed;
    }
    return new Date(a.submittedAt) - new Date(b.submittedAt);
  });

  return userSubmissions[0];
};

/**
 * Determine winner based on submission results and real-world coding speed
 * 
 * Priority order:
 * 1. AFK handling — a player who submitted beats one who didn't
 * 2. Accepted vs Failed — solver always beats non-solver
 * 3. Both Failed — more test cases passed wins; tie = penalize more submission attempts
 * 4. Both Accepted — real-world submission speed (submittedAt - matchStartTime) wins
 * 5. Micro-tiebreakers — execution time, then memory, then draw
 * 
 * @param {object|null} submission1 - Player 1's best submission (null = AFK/no submission)
 * @param {object|null} submission2 - Player 2's best submission (null = AFK/no submission)
 * @param {Date|string} matchStartTime - Match start time for elapsed-time calculation
 * @param {Array} allSubmissions - Full submissions array for counting attempts
 * @returns {string} 'player1', 'player2', or 'draw'
 */
export const determineWinner = (submission1, submission2, matchStartTime, allSubmissions = []) => {
  // ── Scenario 4/5: AFK / No Submission ──
  const has1 = submission1 != null;
  const has2 = submission2 != null;

  if (!has1 && !has2) return 'draw';      // Both AFK → draw (match should be cancelled)
  if (has1 && !has2) return 'player1';     // Player 2 was AFK
  if (!has1 && has2) return 'player2';     // Player 1 was AFK

  // ── Scenario 2: One Accepted, One Failed ──
  if (submission1.status === 'Accepted' && submission2.status !== 'Accepted') {
    return 'player1';
  }
  if (submission2.status === 'Accepted' && submission1.status !== 'Accepted') {
    return 'player2';
  }

  // ── Scenario 3: Both Failed ──
  if (submission1.status !== 'Accepted' && submission2.status !== 'Accepted') {
    // Compare test cases passed
    if (submission1.testCasesPassed > submission2.testCasesPassed) {
      return 'player1';
    } else if (submission2.testCasesPassed > submission1.testCasesPassed) {
      return 'player2';
    }

    // Same test cases passed: penalize more submission attempts (more tries = worse)
    if (allSubmissions.length > 0) {
      const p1Id = submission1.userId.toString();
      const p2Id = submission2.userId.toString();
      const p1Attempts = allSubmissions.filter(s => s.userId.toString() === p1Id).length;
      const p2Attempts = allSubmissions.filter(s => s.userId.toString() === p2Id).length;

      if (p1Attempts < p2Attempts) return 'player1';  // Fewer attempts = better
      if (p2Attempts < p1Attempts) return 'player2';
    }

    return 'draw';
  }

  // ── Scenario 1: Both Accepted — real-world coding speed wins ──
  if (matchStartTime) {
    const start = new Date(matchStartTime).getTime();
    const elapsed1 = new Date(submission1.submittedAt).getTime() - start;
    const elapsed2 = new Date(submission2.submittedAt).getTime() - start;

    if (elapsed1 < elapsed2) return 'player1';   // Player 1 solved it faster
    if (elapsed2 < elapsed1) return 'player2';   // Player 2 solved it faster
  }

  // ── Micro-tiebreakers (only if real-world speed is identical) ──
  // Compare execution time
  if (submission1.executionTime < submission2.executionTime) return 'player1';
  if (submission2.executionTime < submission1.executionTime) return 'player2';

  // Compare memory usage
  if (submission1.memoryUsed < submission2.memoryUsed) return 'player1';
  if (submission2.memoryUsed < submission1.memoryUsed) return 'player2';

  // Completely tied
  return 'draw';
};

