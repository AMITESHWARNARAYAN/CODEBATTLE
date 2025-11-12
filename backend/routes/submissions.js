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

    // Update problem statistics
    const problem = await Problem.findById(problemId);
    if (problem) {
      problem.totalSubmissions += 1;
      if (status === 'Accepted') {
        problem.successfulSubmissions += 1;
        
        // Update user's solved problems if first time solving
        const user = await User.findById(req.user._id);
        const alreadySolved = user.solvedProblems.some(
          sp => sp.problem.toString() === problemId
        );

        if (!alreadySolved) {
          user.solvedProblems.push({
            problem: problemId,
            solvedAt: new Date()
          });
          user.totalSolved += 1;

          // Update difficulty-specific counts
          if (problem.difficulty === 'Easy') user.easySolved += 1;
          else if (problem.difficulty === 'Medium') user.mediumSolved += 1;
          else if (problem.difficulty === 'Hard') user.hardSolved += 1;

          await user.save();
        }
      }
      problem.acceptanceRate = problem.totalSubmissions > 0
        ? Math.round((problem.successfulSubmissions / problem.totalSubmissions) * 100)
        : 0;
      await problem.save();
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
    const totalSubmissions = await Submission.countDocuments({ user: req.user._id });
    
    const acceptedSubmissions = await Submission.countDocuments({
      user: req.user._id,
      status: 'Accepted'
    });

    const recentSubmissions = await Submission.find({ user: req.user._id })
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('problem', 'title difficulty');

    // Language distribution
    const languageStats = await Submission.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    // Status distribution
    const statusStats = await Submission.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get user's solved problems count
    const user = await User.findById(req.user._id).select('totalSolved easySolved mediumSolved hardSolved');

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
      }
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
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const submissions = await Submission.aggregate([
      {
        $match: {
          user: req.user._id,
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

// @route   GET /api/submissions/community/:problemId
// @desc    Get accepted solutions from other users for a problem (community solutions)
// @access  Private
router.get('/community/:problemId', protect, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const solutions = await Submission.find({
      problem: req.params.problemId,
      status: 'Accepted',
      user: { $ne: req.user._id } // Exclude user's own solutions
    })
      .populate('user', 'username')
      .select('-code -errorMessage') // Exclude code and errors
      .sort({ runtime: 1, memory: 1 }) // Sort by performance
      .limit(parseInt(limit));

    res.json(solutions);
  } catch (error) {
    console.error('Get community solutions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions/community/:problemId/code/:submissionId
// @desc    Get code from a specific community solution
// @access  Private
router.get('/community/:problemId/code/:submissionId', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('user', 'username')
      .select('code language runtime memory');

    if (!submission || submission.status !== 'Accepted') {
      return res.status(404).json({ message: 'Solution not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get solution code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

