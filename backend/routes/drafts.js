import express from 'express';
import Draft from '../models/Draft.js';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/drafts
// @desc    Save or update a draft
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { problemId, code, language } = req.body;

        if (!problemId || !code || !language) {
            return res.status(400).json({ message: 'Please provide problemId, code, and language' });
        }

        // Upsert draft (update if exists, create if not)
        const draft = await Draft.findOneAndUpdate(
            { user: req.user._id, problem: problemId },
            {
                code,
                language,
                updatedAt: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(draft);
    } catch (error) {
        console.error('Save draft error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/drafts/:problemId
// @desc    Get draft for a specific problem
// @access  Private
router.get('/:problemId', protect, async (req, res) => {
    try {
        const draft = await Draft.findOne({
            user: req.user._id,
            problem: req.params.problemId
        });

        if (!draft) {
            // Return 404 if no draft found, frontend can handle this by showing default template
            return res.status(404).json({ message: 'No draft found' });
        }

        res.json(draft);
    } catch (error) {
        console.error('Get draft error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
