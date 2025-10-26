import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get top users by rating
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 100;

    // Validate limit to prevent abuse
    if (limit < 1 || limit > 1000) {
      limit = 100;
    }

    const users = await User.find()
      .select('username rating wins losses draws totalMatches highestRating')
      .sort({ rating: -1 })
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      rating: user.rating,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
      totalMatches: user.totalMatches,
      winRate: user.totalMatches > 0 ? ((user.wins / user.totalMatches) * 100).toFixed(1) : 0,
      highestRating: user.highestRating
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get current user's detailed stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'matchHistory',
        options: { limit: 10, sort: { createdAt: -1 } },
        populate: { path: 'problem players winner' }
      });

    res.json(user);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/search
// @desc    Search users by username
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    // Escape special regex characters to prevent ReDoS attacks
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const users = await User.find({
      username: { $regex: escapedQuery, $options: 'i' }
    })
      .select('username rating isOnline')
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:username
// @desc    Get user profile by username
// @access  Private
router.get('/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

