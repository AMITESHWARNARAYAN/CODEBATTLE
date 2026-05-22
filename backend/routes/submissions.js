import express from 'express';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/submissions
// @desc    Create a new submission
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { problemId, code, language, status, runtime, memory, testCasesPassed, totalTestCases, errorMessage, isDailyChallenge } = req.body;

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      code,
      language,
      status,
      runtime: runtime || 0,
      memory: memory || 0,
      testCasesPassed: testCasesPassed || 0,
      totalTestCases: totalTestCases || 0,
      errorMessage: errorMessage || '',
      isDailyChallenge: isDailyChallenge || false
    });

    // Update user's solved problems atomically on first Accepted — atomic to prevent race conditions
    const problem = await Problem.findById(problemId);
    if (status === 'Accepted' && problem) {
      try {
        const difficultyInc = {};
        if (problem.difficulty === 'Easy') difficultyInc.easySolved = 1;
        else if (problem.difficulty === 'Medium') difficultyInc.mediumSolved = 1;
        else if (problem.difficulty === 'Hard') difficultyInc.hardSolved = 1;

        await User.updateOne(
          {
            _id: req.user._id,
            'solvedProblems.problem': { $ne: problemId }
          },
          {
            $addToSet: { solvedProblems: { problem: problemId, solvedAt: new Date() } },
            $inc: { totalSolved: 1, ...difficultyInc }
          }
        );
      } catch (statsErr) {
        console.error('Failed to update user solved stats in submissions route:', statsErr);
      }
    }

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('problem', 'title difficulty');

    res.status(201).json(populatedSubmission);
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions
// @desc    Get user's submissions with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { problemId, status, language, limit = 20, page = 1 } = req.query;

    let query = { user: req.user._id };
    
    if (problemId) query.problem = problemId;
    if (status) query.status = status;
    if (language) query.language = language;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await Submission.find(query)
      .populate('problem', 'title difficulty')
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions/:id
// @desc    Get submission by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problem', 'title difficulty description examples');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user owns this submission
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions/problem/:problemId
// @desc    Get all user submissions for a specific problem
// @access  Private
router.get('/problem/:problemId', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      problem: req.params.problemId
    })
      .sort({ submittedAt: -1 })
      .select('-code'); // Don't send code in list view

    res.json(submissions);
  } catch (error) {
    console.error('Get problem submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions/stats/overview
// @desc    Get user's submission statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    let targetUserId = req.user._id;
    if (req.query.username) {
      const targetUser = await User.findOne({ username: req.query.username });
      if (!targetUser) return res.status(404).json({ message: 'User not found' });
      targetUserId = targetUser._id;
    }

    const totalSubmissions = await Submission.countDocuments({ user: targetUserId });
    
    const acceptedSubmissions = await Submission.countDocuments({
      user: targetUserId,
      status: 'Accepted'
    });

    const recentSubmissions = await Submission.find({ user: targetUserId })
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('problem', 'title difficulty');

    // Language distribution
    const languageStats = await Submission.aggregate([
      { $match: { user: targetUserId } },
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    // Status distribution
    const statusStats = await Submission.aggregate([
      { $match: { user: targetUserId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get user's solved problems count
    const user = await User.findById(targetUserId).select('totalSolved easySolved mediumSolved hardSolved');

    // Get system-wide problem totals
    const totalEasy = await Problem.countDocuments({ difficulty: 'Easy' });
    const totalMedium = await Problem.countDocuments({ difficulty: 'Medium' });
    const totalHard = await Problem.countDocuments({ difficulty: 'Hard' });
    const totalSystemProblems = totalEasy + totalMedium + totalHard;

    // Get total users for global rank
    const totalUsersCount = await User.countDocuments({});

    res.json({
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate: totalSubmissions > 0 
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
        : 0,
      recentSubmissions,
      languageStats,
      statusStats,
      solvedProblems: {
        total: user.totalSolved,
        easy: user.easySolved,
        medium: user.mediumSolved,
        hard: user.hardSolved
      },
      systemTotals: {
        total: totalSystemProblems,
        easy: totalEasy,
        medium: totalMedium,
        hard: totalHard
      },
      totalUsers: totalUsersCount
    });
  } catch (error) {
    console.error('Get submission stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions/calendar/heatmap
// @desc    Get submission calendar data (GitHub-style heatmap)
// @access  Private
router.get('/calendar/heatmap', protect, async (req, res) => {
  try {
    let targetUserId = req.user._id;
    if (req.query.username) {
      const targetUser = await User.findOne({ username: req.query.username });
      if (!targetUser) return res.status(404).json({ message: 'User not found' });
      targetUserId = targetUser._id;
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const submissions = await Submission.aggregate([
      {
        $match: {
          user: targetUserId,
          submittedAt: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' }
          },
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const heatmapData = submissions.map(s => ({
      date: s._id,
      count: s.count,
      accepted: s.accepted
    }));

    res.json(heatmapData);
  } catch (error) {
    console.error('Get heatmap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

