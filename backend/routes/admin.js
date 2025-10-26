import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/admin/problems
// @desc    Create a new problem (admin only)
// @access  Private/Admin
router.post('/problems', protect, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      testCases,
      functionSignature,
      timeLimit,
      memoryLimit,
      solutionLink,
      category
    } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !testCases || !functionSignature) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate difficulty
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }

    // Create problem with random acceptance rate for demo
    const acceptanceRate = Math.floor(Math.random() * 40) + 30; // 30-70%
    const totalSubmissions = Math.floor(Math.random() * 5000) + 1000; // 1000-6000
    const successfulSubmissions = Math.floor(totalSubmissions * (acceptanceRate / 100));

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags: tags || [],
      constraints: constraints || '',
      examples: examples || [],
      testCases,
      functionSignature,
      timeLimit: timeLimit || 2000,
      memoryLimit: memoryLimit || 256,
      solutionLink: solutionLink || '',
      category: category || null,
      totalSubmissions,
      successfulSubmissions,
      acceptanceRate
    });

    // If category is provided, add problem to category
    if (category) {
      const Category = (await import('../models/Category.js')).default;
      const cat = await Category.findById(category);
      if (cat) {
        cat.problems.push(problem._id);
        cat.problemCount = cat.problems.length;

        // Update difficulty counts
        if (problem.difficulty === 'Easy') cat.difficulty.easy++;
        else if (problem.difficulty === 'Medium') cat.difficulty.medium++;
        else if (problem.difficulty === 'Hard') cat.difficulty.hard++;

        await cat.save();
      }
    }

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/problems
// @desc    Get all problems (admin only)
// @access  Private/Admin
router.get('/problems', protect, isAdmin, async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/problems/:id
// @desc    Update a problem (admin only)
// @access  Private/Admin
router.put('/problems/:id', protect, isAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({
      message: 'Problem updated successfully',
      problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/problems/:id
// @desc    Delete a problem (admin only)
// @access  Private/Admin
router.delete('/problems/:id', protect, isAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/make-admin/:userId
// @desc    Make a user admin (admin only)
// @access  Private/Admin
router.post('/make-admin/:userId', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User is now an admin',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/remove-admin/:userId
// @desc    Remove admin privileges from a user (admin only)
// @access  Private/Admin
router.post('/remove-admin/:userId', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Admin privileges removed',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Remove admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin statistics (admin only)
// @access  Private/Admin
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });

    res.json({
      totalUsers,
      totalProblems,
      totalAdmins
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;

