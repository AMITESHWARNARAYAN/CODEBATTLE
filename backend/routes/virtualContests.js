import express from 'express';
import Contest from '../models/Contest.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/virtual-contests/:id/start
// @desc    Start a virtual contest
// @access  Private
router.post('/:id/start', protect, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Check if contest is finished (only finished contests can be taken virtually)
        if (contest.status !== 'finished') {
            return res.status(400).json({ message: 'Only finished contests can be taken virtually' });
        }

        // Check if user already participated
        const existingParticipant = contest.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );

        if (existingParticipant) {
            return res.status(400).json({ message: 'You have already participated in this contest' });
        }

        // Register user as virtual participant
        const participant = {
            user: req.user._id,
            username: req.user.username,
            startedAt: new Date(),
            submissions: [],
            totalScore: 0,
            totalPenalty: 0,
            problemsSolved: 0
        };

        contest.participants.push(participant);
        await contest.save();

        res.json({
            message: 'Virtual contest started',
            startTime: participant.startedAt,
            duration: contest.duration
        });

    } catch (error) {
        console.error('Start virtual contest error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/virtual-contests/:id/status
// @desc    Get virtual contest status for current user
// @access  Private
router.get('/:id/status', protect, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        const participant = contest.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );

        if (!participant) {
            return res.status(404).json({ message: 'Not registered for this contest' });
        }

        const now = new Date();
        const startTime = new Date(participant.startedAt);
        const endTime = new Date(startTime.getTime() + contest.duration * 60000);
        const remainingTime = Math.max(0, endTime - now);

        res.json({
            startedAt: startTime,
            endTime: endTime,
            remainingTime: remainingTime, // in milliseconds
            isFinished: remainingTime === 0
        });

    } catch (error) {
        console.error('Get virtual contest status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
