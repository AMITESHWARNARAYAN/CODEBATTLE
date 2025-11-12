import express from 'express';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/problems
// @desc    Get all problems
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { difficulty, tag } = req.query;
    
    let query = {};
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (tag) {
      query.tags = tag;
    }

    const problems = await Problem.find(query)
      .select('-testCases') // Don't send test cases in list
      .sort({ createdAt: -1 });

    res.json(problems);
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problems/random
// @desc    Get a random problem for match
// @access  Private
router.get('/random', protect, async (req, res) => {
  try {
    const { difficulty } = req.query;
    
    let query = {};
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const count = await Problem.countDocuments(query);
    const random = Math.floor(Math.random() * count);
    
    const problem = await Problem.findOne(query).skip(random);

    if (!problem) {
      return res.status(404).json({ message: 'No problems found' });
    }

    // Return problem without hidden test cases
    const problemData = problem.toObject();
    problemData.testCases = problemData.testCases.filter(tc => !tc.isHidden);

    res.json(problemData);
  } catch (error) {
    console.error('Get random problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problems/:id
// @desc    Get problem by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Return problem without hidden test cases for display
    const problemData = problem.toObject();
    problemData.visibleTestCases = problemData.testCases.filter(tc => !tc.isHidden);
    delete problemData.testCases; // Remove all test cases from response

    res.json(problemData);
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problems
// @desc    Create a new problem (admin only - simplified for now)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problems/online-users/:problemId
// @desc    Get number of online users viewing a problem
// @access  Public
router.get('/online-users/:problemId', async (req, res) => {
  try {
    // In a real implementation, this would track socket.io connections
    // For now, return a random number between 20-100
    const onlineCount = Math.floor(Math.random() * (100 - 20) + 20);
    
    res.json({ 
      onlineUsers: onlineCount,
      problemId: req.params.problemId
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ 
      message: 'Server error',
      onlineUsers: 39 // Default fallback
    });
  }
});

export default router;

