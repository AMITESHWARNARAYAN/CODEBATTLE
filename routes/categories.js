import express from 'express';
import { protect } from '../middleware/auth.js';
import Category from '../models/Category.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

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

// @route   GET /api/categories
// @desc    Get all categories (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('problems', 'title difficulty')
      .sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/:categoryId
// @desc    Get category with problems
// @access  Public
router.get('/:categoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId)
      .populate('problems');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/:categoryId/problems
// @desc    Get problems for a category with optional difficulty filter
// @access  Public
router.get('/:categoryId/problems', async (req, res) => {
  try {
    const { difficulty } = req.query;
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    let query = { category: req.params.categoryId };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const problems = await Problem.find(query).sort({ difficulty: 1 });
    res.json(problems);
  } catch (error) {
    console.error('Get category problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories/admin
// @desc    Create a new category (admin only)
// @access  Private/Admin
router.post('/admin', protect, isAdmin, async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      icon: icon || '📚',
      color: color || 'indigo'
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/admin
// @desc    Get all categories (admin view)
// @access  Private/Admin
router.get('/admin', protect, isAdmin, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('problems', 'title difficulty')
      .sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/categories/admin/:categoryId
// @desc    Update a category (admin only)
// @access  Private/Admin
router.put('/admin/:categoryId', protect, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/categories/admin/:categoryId
// @desc    Delete a category (admin only)
// @access  Private/Admin
router.delete('/admin/:categoryId', protect, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Remove category reference from all problems
    await Problem.updateMany(
      { category: req.params.categoryId },
      { category: null }
    );

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories/admin/:categoryId/problems/:problemId
// @desc    Add problem to category (admin only)
// @access  Private/Admin
router.post('/admin/:categoryId/problems/:problemId', protect, isAdmin, async (req, res) => {
  try {
    const { categoryId, problemId } = req.params;

    const category = await Category.findById(categoryId);
    const problem = await Problem.findById(problemId);

    if (!category || !problem) {
      return res.status(404).json({ message: 'Category or Problem not found' });
    }

    // Add problem to category if not already added
    if (!category.problems.includes(problemId)) {
      category.problems.push(problemId);
      category.problemCount = category.problems.length;

      // Update difficulty counts
      if (problem.difficulty === 'Easy') category.difficulty.easy++;
      else if (problem.difficulty === 'Medium') category.difficulty.medium++;
      else if (problem.difficulty === 'Hard') category.difficulty.hard++;

      await category.save();
    }

    // Update problem with category
    problem.category = categoryId;
    await problem.save();

    res.json({
      message: 'Problem added to category successfully',
      category
    });
  } catch (error) {
    console.error('Add problem to category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/categories/admin/:categoryId/problems/:problemId
// @desc    Remove problem from category (admin only)
// @access  Private/Admin
router.delete('/admin/:categoryId/problems/:problemId', protect, isAdmin, async (req, res) => {
  try {
    const { categoryId, problemId } = req.params;

    const category = await Category.findById(categoryId);
    const problem = await Problem.findById(problemId);

    if (!category || !problem) {
      return res.status(404).json({ message: 'Category or Problem not found' });
    }

    // Remove problem from category
    category.problems = category.problems.filter(id => id.toString() !== problemId);
    category.problemCount = category.problems.length;

    // Update difficulty counts
    if (problem.difficulty === 'Easy') category.difficulty.easy = Math.max(0, category.difficulty.easy - 1);
    else if (problem.difficulty === 'Medium') category.difficulty.medium = Math.max(0, category.difficulty.medium - 1);
    else if (problem.difficulty === 'Hard') category.difficulty.hard = Math.max(0, category.difficulty.hard - 1);

    await category.save();

    // Remove category from problem
    problem.category = null;
    await problem.save();

    res.json({ message: 'Problem removed from category successfully' });
  } catch (error) {
    console.error('Remove problem from category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

