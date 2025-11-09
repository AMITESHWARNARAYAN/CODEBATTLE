import express from 'express';
import Contest from '../models/Contest.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { executeCodeWithJudge0 } from '../utils/codeExecutor.js';

const router = express.Router();

// Get all contests (with filters)
router.get('/', protect, async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = { isVisible: true };
    
    if (status) filter.status = status;
    if (type) filter.type = type;

    const contests = await Contest.find(filter)
      .populate('problems.problem', 'title difficulty')
      .populate('createdBy', 'username')
      .sort({ startTime: -1 })
      .lean();

    // Add user registration status
    const contestsWithUserData = contests.map(contest => ({
      ...contest,
      isRegistered: contest.participants.some(
        p => p.user.toString() === req.user._id.toString()
      ),
      userRank: contest.participants.find(
        p => p.user.toString() === req.user._id.toString()
      )?.rank
    }));

    res.json(contestsWithUserData);
  } catch (error) {
    console.error('Get contests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming contests
router.get('/upcoming', protect, async (req, res) => {
  try {
    const contests = await Contest.find({
      status: 'upcoming',
      isVisible: true
    })
      .populate('problems.problem', 'title difficulty')
      .sort({ startTime: 1 })
      .lean();

    // Add user registration status
    const contestsWithUserData = contests.map(contest => ({
      ...contest,
      isRegistered: contest.participants.some(
        p => p.user.toString() === req.user._id.toString()
      )
    }));

    res.json(contestsWithUserData);
  } catch (error) {
    console.error('Get upcoming contests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get running contests
router.get('/running', protect, async (req, res) => {
  try {
    const contests = await Contest.find({
      status: 'running',
      isVisible: true
    })
      .populate('problems.problem', 'title difficulty')
      .sort({ startTime: -1 })
      .lean();

    // Add user registration status
    const contestsWithUserData = contests.map(contest => ({
      ...contest,
      isRegistered: contest.participants.some(
        p => p.user.toString() === req.user._id.toString()
      )
    }));

    res.json(contestsWithUserData);
  } catch (error) {
    console.error('Get running contests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get past contests
router.get('/past', protect, async (req, res) => {
  try {
    const contests = await Contest.find({
      status: 'finished',
      isVisible: true
    })
      .populate('problems.problem', 'title difficulty')
      .sort({ startTime: -1 })
      .limit(20)
      .lean();

    // Add user registration status
    const contestsWithUserData = contests.map(contest => ({
      ...contest,
      isRegistered: contest.participants.some(
        p => p.user.toString() === req.user._id.toString()
      )
    }));

    res.json(contestsWithUserData);
  } catch (error) {
    console.error('Get past contests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single contest details
router.get('/:id', protect, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('problems.problem')
      .populate('createdBy', 'username')
      .populate('participants.user', 'username email');

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const userData = contest.getUserData(req.user._id);
    
    res.json({
      ...contest.toObject(),
      isRegistered: !!userData,
      userData
    });
  } catch (error) {
    console.error('Get contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for contest
router.post('/:id/register', protect, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    if (!contest.canRegister(req.user._id)) {
      return res.status(400).json({ 
        message: 'Cannot register for this contest' 
      });
    }

    contest.participants.push({
      user: req.user._id,
      username: req.user.username,
      registeredAt: new Date()
    });

    await contest.save();

    res.json({ 
      message: 'Successfully registered for contest',
      contest 
    });
  } catch (error) {
    console.error('Register contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start contest (for virtual contests or first submission)
router.post('/:id/start', protect, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const participant = contest.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({ 
        message: 'You must register first' 
      });
    }

    if (!participant.startedAt) {
      participant.startedAt = new Date();
      await contest.save();
    }

    res.json({ 
      message: 'Contest started',
      startedAt: participant.startedAt 
    });
  } catch (error) {
    console.error('Start contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit solution for contest problem
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    if (contest.status !== 'running') {
      return res.status(400).json({ message: 'Contest is not running' });
    }

    const participant = contest.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({ message: 'You must register first' });
    }

    if (!participant.startedAt) {
      participant.startedAt = new Date();
    }

    // Find problem in contest
    const contestProblem = contest.problems.find(
      p => p.problem.toString() === problemId
    );

    if (!contestProblem) {
      return res.status(400).json({ message: 'Problem not in this contest' });
    }

    // Get full problem details with test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Execute code with Judge0 API
    const executionResult = await executeCodeWithJudge0(
      code,
      problem.testCases,
      language,
      problem.timeLimit / 1000 // Convert ms to seconds
    );

    // Determine status
    let status = executionResult.status;
    if (executionResult.testCasesPassed === executionResult.totalTestCases) {
      status = 'accepted';
    } else {
      status = executionResult.status.toLowerCase();
    }

    // Calculate score and penalty
    const score = status === 'accepted' ? contestProblem.points : 0;
    const timeSinceStart = (new Date() - participant.startedAt) / (1000 * 60); // minutes
    const penalty = status === 'accepted' ? timeSinceStart : 20; // 20 min penalty for wrong answer

    // Check if already solved
    const alreadySolved = participant.submissions.some(
      s => s.problem.toString() === problemId && s.status === 'accepted'
    );

    // Add submission
    participant.submissions.push({
      problem: problemId,
      submittedAt: new Date(),
      code,
      language,
      status,
      runtime: executionResult.executionTime,
      memory: executionResult.memoryUsed,
      testCasesPassed: executionResult.testCasesPassed,
      totalTestCases: executionResult.totalTestCases,
      score,
      penalty: status === 'accepted' ? timeSinceStart : 0
    });

    // Update totals only if first accepted submission for this problem
    if (status === 'accepted' && !alreadySolved) {
      participant.totalScore += score;
      participant.totalPenalty += timeSinceStart;
      participant.problemsSolved += 1;
    }

    await contest.save();

    // Recalculate leaderboard
    const leaderboard = contest.calculateLeaderboard();

    res.json({
      message: 'Submission recorded',
      score,
      penalty,
      totalScore: participant.totalScore,
      rank: participant.rank,
      leaderboard: leaderboard.slice(0, 10) // Top 10
    });
  } catch (error) {
    console.error('Submit contest solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contest leaderboard
router.get('/:id/leaderboard', protect, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('participants.user', 'username email');

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const leaderboard = contest.calculateLeaderboard();

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

