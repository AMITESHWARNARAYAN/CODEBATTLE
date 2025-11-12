import express from 'express';
import AdminChallenge from '../models/AdminChallenge.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

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

// @route   POST /api/admin/challenges
// @desc    Create a new admin challenge
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      problemId,
      challengeType,
      targetUsers,
      startDate,
      endDate,
      difficulty,
      rewards
    } = req.body;

    // Validate required fields
    if (!title || !description || !problemId || !startDate || !endDate || !difficulty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Determine status based on dates
    const now = new Date();
    let status = 'scheduled';
    if (start <= now && end > now) {
      status = 'active';
    } else if (end <= now) {
      status = 'completed';
    }

    // Create challenge
    const challenge = await AdminChallenge.create({
      title,
      description,
      problem: problemId,
      createdBy: req.user._id,
      challengeType: challengeType || 'global',
      targetUsers: challengeType === 'targeted' ? targetUsers : [],
      startDate: start,
      endDate: end,
      status,
      difficulty,
      rewards: rewards || { points: 0, badge: '' }
    });

    const populatedChallenge = await AdminChallenge.findById(challenge._id)
      .populate('problem', 'title difficulty')
      .populate('createdBy', 'username email')
      .populate('targetUsers', 'username email');

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: populatedChallenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/challenges
// @desc    Get all admin challenges
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { status, challengeType } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    if (challengeType) {
      query.challengeType = challengeType;
    }

    const challenges = await AdminChallenge.find(query)
      .populate('problem', 'title difficulty')
      .populate('createdBy', 'username email')
      .populate('targetUsers', 'username email')
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/challenges/:id
// @desc    Get single challenge with details
// @access  Private/Admin
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const challenge = await AdminChallenge.findById(req.params.id)
      .populate('problem')
      .populate('createdBy', 'username email')
      .populate('targetUsers', 'username email')
      .populate('participants.user', 'username email rating');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/challenges/:id
// @desc    Update a challenge
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const challenge = await AdminChallenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'startDate', 'endDate', 'status', 'isVisible', 'rewards'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        challenge[field] = req.body[field];
      }
    });

    await challenge.save();

    const updatedChallenge = await AdminChallenge.findById(challenge._id)
      .populate('problem', 'title difficulty')
      .populate('createdBy', 'username email')
      .populate('targetUsers', 'username email');

    res.json({
      message: 'Challenge updated successfully',
      challenge: updatedChallenge
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/challenges/:id
// @desc    Delete a challenge
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const challenge = await AdminChallenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Only allow deletion of scheduled challenges
    if (challenge.status === 'active') {
      return res.status(400).json({ message: 'Cannot delete active challenge. Cancel it first.' });
    }

    await AdminChallenge.findByIdAndDelete(req.params.id);

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/challenges/:id/stats
// @desc    Get challenge statistics
// @access  Private/Admin
router.get('/:id/stats', protect, isAdmin, async (req, res) => {
  try {
    const challenge = await AdminChallenge.findById(req.params.id)
      .populate('participants.user', 'username email rating');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const stats = {
      totalParticipants: challenge.participants.length,
      completed: challenge.participants.filter(p => p.status === 'completed').length,
      inProgress: challenge.participants.filter(p => p.status === 'in-progress').length,
      pending: challenge.participants.filter(p => p.status === 'pending').length,
      failed: challenge.participants.filter(p => p.status === 'failed').length,
      averageScore: challenge.participants.length > 0
        ? challenge.participants.reduce((sum, p) => sum + (p.score || 0), 0) / challenge.participants.length
        : 0,
      topPerformers: challenge.participants
        .filter(p => p.status === 'completed')
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10)
        .map(p => ({
          user: p.user,
          score: p.score,
          completedAt: p.completedAt,
          runtime: p.submission?.runtime
        }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Get challenge stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

