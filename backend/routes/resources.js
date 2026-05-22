import express from 'express';
import Resource from '../models/Resource.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all published resources
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, category, difficulty } = req.query;
    
    const query = { isPublished: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const resources = await Resource.find(query)
      .sort({ order: 1, createdAt: -1 })
      .populate('problemIds', 'title difficulty tags');

    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('problemIds', 'title difficulty tags');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/resources/:id/like
// @desc    Like a resource
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.likes += 1;
    await resource.save();

    res.json({ likes: resource.likes });
  } catch (error) {
    console.error('Like resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ ADMIN ROUTES ============

// @route   GET /api/resources/admin/all
// @desc    Get all resources (including unpublished)
// @access  Private/Admin
router.get('/admin/all', protect, isAdmin, async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ order: 1, createdAt: -1 })
      .populate('problemIds', 'title difficulty tags');

    res.json(resources);
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/resources/admin/create
// @desc    Create new resource
// @access  Private/Admin
router.post('/admin/create', protect, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/resources/admin/:id
// @desc    Update resource
// @access  Private/Admin
router.put('/admin/:id', protect, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/resources/admin/:id
// @desc    Delete resource
// @access  Private/Admin
router.delete('/admin/:id', protect, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
