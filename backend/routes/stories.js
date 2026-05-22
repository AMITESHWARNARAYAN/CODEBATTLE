import express from 'express';
import { protect } from '../middleware/auth.js';
import Story from '../models/Story.js';

const router = express.Router();

// @route   GET /api/stories
// @desc    Get all stories (paginated, filterable)
router.get('/', async (req, res) => {
  try {
    const { category, company, tag, sort = 'newest', page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { views: -1 },
      'most-liked': { likesCount: -1 },
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Story.countDocuments(filter);

    let stories = await Story.find(filter)
      .populate('author', 'username rating')
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add likesCount for sorting and hide author if anonymous
    stories = stories.map(s => ({
      ...s,
      likesCount: s.likes?.length || 0,
      commentsCount: s.comments?.length || 0,
      author: s.isAnonymous ? { username: 'Anonymous', _id: null } : s.author,
    }));

    // Get distinct companies and categories for filter sidebar
    const allCompanies = await Story.distinct('company');
    const allTags = await Story.distinct('tags');

    res.json({
      stories,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      filters: {
        companies: allCompanies.filter(Boolean).sort(),
        tags: allTags.filter(Boolean).sort()
      }
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stories/:id
// @desc    Get single story (increments view count)
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username rating')
      .populate('comments.user', 'username');

    if (!story) return res.status(404).json({ message: 'Story not found' });

    const result = story.toObject();
    if (result.isAnonymous) {
      result.author = { username: 'Anonymous', _id: null };
    }

    res.json(result);
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stories
// @desc    Create a new story
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, company, role, outcome, tags, isAnonymous } = req.body;

    if (!title?.trim() || !content?.trim() || !category) {
      return res.status(400).json({ message: 'Title, content and category are required' });
    }

    const story = await Story.create({
      author: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category,
      company: company?.trim() || '',
      role: role?.trim() || '',
      outcome: outcome || 'N/A',
      tags: tags || [],
      isAnonymous: isAnonymous || false
    });

    const populated = await Story.findById(story._id).populate('author', 'username rating');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/stories/:id
// @desc    Edit own story
router.put('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, category, company, role, outcome, tags, isAnonymous } = req.body;
    if (title) story.title = title.trim();
    if (content) story.content = content.trim();
    if (category) story.category = category;
    if (company !== undefined) story.company = company.trim();
    if (role !== undefined) story.role = role.trim();
    if (outcome) story.outcome = outcome;
    if (tags) story.tags = tags;
    if (isAnonymous !== undefined) story.isAnonymous = isAnonymous;

    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete own story (or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stories/:id/like
// @desc    Toggle like on a story
router.post('/:id/like', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const idx = story.likes.indexOf(req.user._id);
    if (idx === -1) {
      story.likes.push(req.user._id);
    } else {
      story.likes.splice(idx, 1);
    }
    await story.save();
    res.json({ likesCount: story.likes.length, liked: idx === -1 });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stories/:id/comment
// @desc    Add a comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text is required' });

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    story.comments.push({ user: req.user._id, text: text.trim() });
    await story.save();

    const updated = await Story.findById(req.params.id)
      .populate('comments.user', 'username');

    res.json(updated.comments);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
