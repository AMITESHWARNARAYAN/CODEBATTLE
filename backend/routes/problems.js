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

// @route   POST /api/problems/:id/like
// @desc    Like a problem
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if user already liked this problem
    const user = req.user;
    const likedIndex = user.likedProblems.findIndex(
      (item) => item.problem.toString() === id
    );
    const dislikedIndex = user.dislikedProblems.findIndex(
      (item) => item.problem.toString() === id
    );

    if (likedIndex !== -1) {
      // Already liked, so unlike it
      user.likedProblems.splice(likedIndex, 1);
      problem.likes -= 1;
    } else {
      // Like it
      user.likedProblems.push({ problem: id });
      problem.likes += 1;

      // Remove dislike if exists
      if (dislikedIndex !== -1) {
        user.dislikedProblems.splice(dislikedIndex, 1);
        problem.dislikes -= 1;
      }
    }

    await user.save();
    await problem.save();

    res.json({
      message: 'Success',
      liked: likedIndex === -1,
      likes: problem.likes,
      dislikes: problem.dislikes
    });
  } catch (error) {
    console.error('Like problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problems/:id/dislike
// @desc    Dislike a problem
// @access  Private
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const user = req.user;
    const dislikedIndex = user.dislikedProblems.findIndex(
      (item) => item.problem.toString() === id
    );
    const likedIndex = user.likedProblems.findIndex(
      (item) => item.problem.toString() === id
    );

    if (dislikedIndex !== -1) {
      // Already disliked, so remove dislike
      user.dislikedProblems.splice(dislikedIndex, 1);
      problem.dislikes -= 1;
    } else {
      // Dislike it
      user.dislikedProblems.push({ problem: id });
      problem.dislikes += 1;

      // Remove like if exists
      if (likedIndex !== -1) {
        user.likedProblems.splice(likedIndex, 1);
        problem.likes -= 1;
      }
    }

    await user.save();
    await problem.save();

    res.json({
      message: 'Success',
      disliked: dislikedIndex === -1,
      likes: problem.likes,
      dislikes: problem.dislikes
    });
  } catch (error) {
    console.error('Dislike problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problems/:id/bookmark
// @desc    Bookmark a problem
// @access  Private
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const user = req.user;
    const bookmarkIndex = user.bookmarkedProblems.findIndex(
      (item) => item.problem.toString() === id
    );

    if (bookmarkIndex !== -1) {
      // Already bookmarked, so remove bookmark
      user.bookmarkedProblems.splice(bookmarkIndex, 1);
    } else {
      // Bookmark it
      user.bookmarkedProblems.push({ problem: id });
    }

    await user.save();

    res.json({
      message: 'Success',
      bookmarked: bookmarkIndex === -1,
      totalBookmarks: user.bookmarkedProblems.length
    });
  } catch (error) {
    console.error('Bookmark problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problems/:id/status
// @desc    Get user's interaction status with a problem (liked, disliked, bookmarked)
// @access  Private
router.get('/:id/status', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const liked = user.likedProblems.some(
      (item) => item.problem.toString() === id
    );
    const disliked = user.dislikedProblems.some(
      (item) => item.problem.toString() === id
    );
    const bookmarked = user.bookmarkedProblems.some(
      (item) => item.problem.toString() === id
    );

    // Get problem stats
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({
      liked,
      disliked,
      bookmarked,
      likes: problem.likes,
      dislikes: problem.dislikes
    });
  } catch (error) {
    console.error('Get problem status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;export default router;

