/**
 * ELO Rating System (similar to Chess.com)
 * K-factor determines how much ratings change per game
 */

const K_FACTOR = 32; // Standard K-factor for chess

/**
 * Calculate expected score for a player
 * @param {number} playerRating - Current rating of the player
 * @param {number} opponentRating - Current rating of the opponent
 * @returns {number} Expected score (0 to 1)
 */
export const calculateExpectedScore = (playerRating, opponentRating) => {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
};

/**
 * Calculate new rating after a match
 * @param {number} currentRating - Current rating of the player
 * @param {number} opponentRating - Rating of the opponent
 * @param {number} actualScore - Actual score (1 for win, 0.5 for draw, 0 for loss)
 * @returns {number} New rating
 */
export const calculateNewRating = (currentRating, opponentRating, actualScore) => {
  const expectedScore = calculateExpectedScore(currentRating, opponentRating);
  const ratingChange = K_FACTOR * (actualScore - expectedScore);
  return Math.round(currentRating + ratingChange);
};

/**
 * Calculate rating changes for both players in a match
 * @param {number} player1Rating - Rating of player 1
 * @param {number} player2Rating - Rating of player 2
 * @param {string} result - Result ('player1', 'player2', or 'draw')
 * @returns {object} Rating changes for both players
 */
export const calculateMatchRatings = (player1Rating, player2Rating, result) => {
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

  const newPlayer1Rating = calculateNewRating(player1Rating, player2Rating, player1Score);
  const newPlayer2Rating = calculateNewRating(player2Rating, player1Rating, player2Score);

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
 * Determine winner based on submission results
 * @param {object} submission1 - First player's submission
 * @param {object} submission2 - Second player's submission
 * @returns {string} 'player1', 'player2', or 'draw'
 */
export const determineWinner = (submission1, submission2) => {
  // Both failed
  if (submission1.status !== 'Accepted' && submission2.status !== 'Accepted') {
    // Compare test cases passed
    if (submission1.testCasesPassed > submission2.testCasesPassed) {
      return 'player1';
    } else if (submission2.testCasesPassed > submission1.testCasesPassed) {
      return 'player2';
    }
    return 'draw';
  }

  // Only one passed
  if (submission1.status === 'Accepted' && submission2.status !== 'Accepted') {
    return 'player1';
  }
  if (submission2.status === 'Accepted' && submission1.status !== 'Accepted') {
    return 'player2';
  }

  // Both passed - compare execution time
  if (submission1.executionTime < submission2.executionTime) {
    return 'player1';
  } else if (submission2.executionTime < submission1.executionTime) {
    return 'player2';
  }

  // Same execution time - compare memory
  if (submission1.memoryUsed < submission2.memoryUsed) {
    return 'player1';
  } else if (submission2.memoryUsed < submission1.memoryUsed) {
    return 'player2';
  }

  // Completely tied
  return 'draw';
};

