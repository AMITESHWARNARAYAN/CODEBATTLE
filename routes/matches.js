import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Match from '../models/Match.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { executeCodeWithJudge0, analyzeComplexity } from '../utils/codeExecutor.js';
import { calculateMatchRatings, determineWinner } from '../utils/eloRating.js';
import { createNotification } from './notifications.js';

const router = express.Router();

// @route   POST /api/matches/solo
// @desc    Start a solo match
// @access  Private
router.post('/solo', protect, async (req, res) => {
  try {
    let problem;
    const { problemId } = req.body;

    if (problemId) {
      // Use specific problem if provided
      problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }
    } else {
      // Get random problem
      const count = await Problem.countDocuments();
      const random = Math.floor(Math.random() * count);
      problem = await Problem.findOne().skip(random);

      if (!problem) {
        return res.status(404).json({ message: 'No problems available' });
      }
    }

    // Create solo match
    const match = await Match.create({
      matchType: 'solo',
      problem: problem._id,
      players: [req.user._id],
      status: 'in-progress',
      startTime: new Date()
    });

    await match.populate('problem');

    // Return problem without all test cases
    const matchData = match.toObject();
    matchData.problem.visibleTestCases = matchData.problem.testCases.filter(tc => !tc.isHidden);
    delete matchData.problem.testCases;

    res.json(matchData);
  } catch (error) {
    console.error('Solo match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/friend/create
// @desc    Create a friend challenge
// @access  Private
router.post('/friend/create', protect, async (req, res) => {
  try {
    // Get a random problem
    const count = await Problem.countDocuments();
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne().skip(random);

    if (!problem) {
      return res.status(404).json({ message: 'No problems available' });
    }

    // Generate unique invite code
    const inviteCode = uuidv4();

    // Create friend match
    const match = await Match.create({
      matchType: 'friend',
      problem: problem._id,
      players: [req.user._id],
      status: 'waiting',
      inviteCode: inviteCode
    });

    await match.populate('problem players');

    res.json({
      matchId: match._id,
      inviteCode: inviteCode,
      inviteLink: `${process.env.FRONTEND_URL}/match/join/${inviteCode}`,
      creator: req.user.username
    });
  } catch (error) {
    console.error('Create friend match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/friend/challenge-by-email
// @desc    Send a friend challenge via email
// @access  Private
router.post('/friend/challenge-by-email', protect, async (req, res) => {
  try {
    const { friendEmail } = req.body;

    if (!friendEmail) {
      return res.status(400).json({ message: 'Friend email is required' });
    }

    // Check if friend exists
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Check if challenging yourself
    if (friend._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot challenge yourself' });
    }

    // Get a random problem
    const count = await Problem.countDocuments();
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne().skip(random);

    if (!problem) {
      return res.status(404).json({ message: 'No problems available' });
    }

    // Create friend match with email challenge
    const match = await Match.create({
      matchType: 'friend',
      problem: problem._id,
      players: [req.user._id],
      status: 'waiting',
      challengerEmail: req.user.email,
      challengedEmail: friendEmail,
      challengeStatus: 'pending'
    });

    await match.populate('problem');

    res.json({
      matchId: match._id,
      message: `Challenge sent to ${friendEmail}`,
      challenger: req.user.username,
      challengedUser: friend.username,
      isOnline: friend.isOnline
    });
  } catch (error) {
    console.error('Challenge by email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/matches/friend/pending-challenges
// @desc    Get pending challenges for current user
// @access  Private
router.get('/friend/pending-challenges', protect, async (req, res) => {
  try {
    const challenges = await Match.find({
      challengedEmail: req.user.email,
      challengeStatus: 'pending',
      status: 'waiting'
    })
      .populate('problem')
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (error) {
    console.error('Get pending challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/friend/accept-challenge/:matchId
// @desc    Accept a friend challenge
// @access  Private
router.post('/friend/accept-challenge/:matchId', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate('problem');

    if (!match) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Verify user is the challenged player
    if (match.challengedEmail !== req.user.email) {
      return res.status(403).json({ message: 'This challenge is not for you' });
    }

    // Check if already accepted
    if (match.status !== 'waiting') {
      return res.status(400).json({ message: 'Challenge already accepted or expired' });
    }

    // Add player and start match
    match.players.push(req.user._id);
    match.status = 'in-progress';
    match.challengeStatus = 'accepted';
    match.startTime = new Date();
    await match.save();

    await match.populate('players');

    // Return match data without all test cases
    const matchData = match.toObject();

    if (!matchData.problem) {
      return res.status(500).json({ message: 'Problem data is corrupted' });
    }

    matchData.problem.visibleTestCases = matchData.problem.testCases.filter(tc => !tc.isHidden);
    delete matchData.problem.testCases;

    res.json(matchData);
  } catch (error) {
    console.error('Accept challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/friend/reject-challenge/:matchId
// @desc    Reject a friend challenge
// @access  Private
router.post('/friend/reject-challenge/:matchId', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Verify user is the challenged player
    if (match.challengedEmail !== req.user.email) {
      return res.status(403).json({ message: 'This challenge is not for you' });
    }

    // Update challenge status
    match.challengeStatus = 'rejected';
    match.status = 'cancelled';
    await match.save();

    res.json({ message: 'Challenge rejected' });
  } catch (error) {
    console.error('Reject challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/friend/join/:inviteCode
// @desc    Join a friend challenge
// @access  Private
router.post('/friend/join/:inviteCode', protect, async (req, res) => {
  try {
    const match = await Match.findOne({ 
      inviteCode: req.params.inviteCode,
      status: 'waiting'
    }).populate('problem players');

    if (!match) {
      return res.status(404).json({ message: 'Invalid or expired invite code' });
    }

    // Check if user is already in match
    if (match.players.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'You are already in this match' });
    }

    // Add player and start match
    match.players.push(req.user._id);
    match.status = 'in-progress';
    match.startTime = new Date();
    await match.save();

    await match.populate('players');

    // Return match data without all test cases
    const matchData = match.toObject();

    if (!matchData.problem) {
      return res.status(500).json({ message: 'Problem data is corrupted' });
    }

    matchData.problem.visibleTestCases = matchData.problem.testCases.filter(tc => !tc.isHidden);
    delete matchData.problem.testCases;

    res.json(matchData);
  } catch (error) {
    console.error('Join friend match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/:matchId/submit
// @desc    Submit code for a match
// @access  Private
router.post('/:matchId/submit', protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    // Validate code submission
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code cannot be empty' });
    }

    if (!language) {
      return res.status(400).json({ message: 'Language is required' });
    }

    const match = await Match.findById(req.params.matchId).populate('problem');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (!match.problem) {
      return res.status(500).json({ message: 'Problem data is corrupted' });
    }

    // Check if user is in this match
    if (!match.players.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not in this match' });
    }

    // Execute code with all test cases (including hidden ones)
    const executionResult = await executeCodeWithJudge0(
      code,
      match.problem.testCases,
      language,
      match.problem.timeLimit / 1000 // Convert ms to seconds
    );
    
    // Analyze complexity
    const complexity = analyzeComplexity(code);

    // Create submission
    const submission = {
      userId: req.user._id,
      code,
      language,
      submittedAt: new Date(),
      executionTime: executionResult.executionTime,
      memoryUsed: executionResult.memoryUsed,
      testCasesPassed: executionResult.testCasesPassed,
      totalTestCases: executionResult.totalTestCases,
      status: executionResult.status,
      timeComplexity: complexity.timeComplexity,
      spaceComplexity: complexity.spaceComplexity
    };

    match.submissions.push(submission);

    // Update problem stats
    match.problem.totalSubmissions++;
    if (executionResult.status === 'Accepted') {
      match.problem.successfulSubmissions++;
    }
    match.problem.acceptanceRate = (match.problem.successfulSubmissions / match.problem.totalSubmissions) * 100;
    await match.problem.save();

    // Check if match should end
    if (match.matchType === 'solo') {
      // Solo match ends immediately
      match.status = 'completed';
      match.endTime = new Date();
      match.duration = Math.floor((match.endTime - match.startTime) / 1000);
      
      // Update user stats for solo (no rating change)
      const user = await User.findById(req.user._id);
      user.totalMatches++;
      if (executionResult.status === 'Accepted') {
        user.wins++;
      }
      await user.save();
    } else if (match.matchType === 'friend' || match.matchType === 'matchmaking') {
      // Check if both players have submitted
      const uniqueSubmitters = new Set(match.submissions.map(s => s.userId.toString()));
      
      if (uniqueSubmitters.size === match.players.length) {
        // Both submitted - determine winner
        match.status = 'completed';
        match.endTime = new Date();
        match.duration = Math.floor((match.endTime - match.startTime) / 1000);

        // Get last submission from each player
        const player1Id = match.players[0].toString();
        const player2Id = match.players[1].toString();
        
        const player1Submission = [...match.submissions].reverse().find(s => s.userId.toString() === player1Id);
        const player2Submission = [...match.submissions].reverse().find(s => s.userId.toString() === player2Id);

        const result = determineWinner(player1Submission, player2Submission);

        // Get players
        const player1 = await User.findById(player1Id);
        const player2 = await User.findById(player2Id);

        // Calculate rating changes
        const ratingChanges = calculateMatchRatings(player1.rating, player2.rating, result);

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

        // Send notifications to both players
        const winnerName = result === 'player1' ? player1.username : result === 'player2' ? player2.username : null;

        await createNotification(
          player1Id,
          'match_result',
          'Match Completed',
          result === 'player1' ? `🎉 You won! Rating: ${ratingChanges.player1.change >= 0 ? '+' : ''}${ratingChanges.player1.change}` :
          result === 'draw' ? `Match ended in a draw. Rating: ${ratingChanges.player1.change >= 0 ? '+' : ''}${ratingChanges.player1.change}` :
          `You lost to ${player2.username}. Rating: ${ratingChanges.player1.change >= 0 ? '+' : ''}${ratingChanges.player1.change}`,
          `/results/${match._id}`
        );

        await createNotification(
          player2Id,
          'match_result',
          'Match Completed',
          result === 'player2' ? `🎉 You won! Rating: ${ratingChanges.player2.change >= 0 ? '+' : ''}${ratingChanges.player2.change}` :
          result === 'draw' ? `Match ended in a draw. Rating: ${ratingChanges.player2.change >= 0 ? '+' : ''}${ratingChanges.player2.change}` :
          `You lost to ${player1.username}. Rating: ${ratingChanges.player2.change >= 0 ? '+' : ''}${ratingChanges.player2.change}`,
          `/results/${match._id}`
        );
      }
    }

    await match.save();
    await match.populate('players winner');

    res.json({
      submission: submission,
      executionResult: executionResult,
      match: match
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ message: 'Server error during code execution' });
  }
});

// @route   GET /api/matches/:matchId
// @desc    Get match details
// @access  Private
router.get('/:matchId', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate('problem players winner');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/:matchId/giveup
// @desc    Give up in a match (declare opponent as winner)
// @access  Private
router.post('/:matchId/giveup', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate('players');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user is in this match
    if (!match.players.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not in this match' });
    }

    // Check if match is still in progress
    if (match.status !== 'in-progress') {
      return res.status(400).json({ message: 'Match is not in progress' });
    }

    // Check if match type is solo (can't give up in solo)
    if (match.matchType === 'solo') {
      return res.status(400).json({ message: 'Cannot give up in solo practice' });
    }

    // Mark match as completed
    match.status = 'completed';
    match.endTime = new Date();
    match.duration = Math.floor((match.endTime - match.startTime) / 1000);

    // Determine winner (the other player)
    const givingUpPlayerId = req.user._id.toString();
    const winnerId = match.players.find(p => p._id.toString() !== givingUpPlayerId)._id;
    const loserId = req.user._id;

    match.winner = winnerId;

    // Get both players
    const winner = await User.findById(winnerId);
    const loser = await User.findById(loserId);

    // Calculate rating changes
    const ratingChanges = calculateMatchRatings(winner.rating, loser.rating, 'player1');

    // Update ratings and stats
    winner.updateRating(ratingChanges.player1.newRating);
    winner.totalMatches++;
    winner.wins++;

    loser.updateRating(ratingChanges.player2.newRating);
    loser.totalMatches++;
    loser.losses++;

    await winner.save();
    await loser.save();

    // Store rating changes in match
    match.ratingChanges = [
      {
        userId: winnerId,
        oldRating: ratingChanges.player1.oldRating,
        newRating: ratingChanges.player1.newRating,
        change: ratingChanges.player1.change
      },
      {
        userId: loserId,
        oldRating: ratingChanges.player2.oldRating,
        newRating: ratingChanges.player2.newRating,
        change: ratingChanges.player2.change
      }
    ];

    await match.save();
    await match.populate('players winner');

    res.json({
      message: 'You gave up. Opponent wins!',
      match: match
    });
  } catch (error) {
    console.error('Give up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/matches/user/history
// @desc    Get user's match history
// @access  Private
router.get('/user/history', protect, async (req, res) => {
  try {
    const matches = await Match.find({
      players: req.user._id,
      status: 'completed'
    })
      .populate('problem players winner')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(matches);
  } catch (error) {
    console.error('Get match history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

