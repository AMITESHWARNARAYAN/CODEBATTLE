import express from 'express';
import Match from '../models/Match.js';
import Contest from '../models/Contest.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/fairness/report
 * @desc    Report a fairness infraction (tab switch, paste, etc.)
 * @access  Private
 */
router.post('/report', protect, async (req, res) => {
  try {
    const { matchId, contestId, infractionType } = req.body;
    const userId = req.user._id.toString();

    // Determine suspicion score points based on infraction type
    let points = 0;
    switch (infractionType) {
      case 'tab_switch':
        points = 15;
        break;
      case 'large_paste':
        points = 40;
        break;
      case 'mouse_leave':
        points = 5;
        break;
      default:
        points = 10;
    }

    if (matchId) {
      const match = await Match.findById(matchId);
      if (!match) return res.status(404).json({ message: 'Match not found' });
      
      if (!match.suspicionScores) {
        match.suspicionScores = new Map();
      }

      const currentScore = match.suspicionScores.get(userId) || 0;
      match.suspicionScores.set(userId, currentScore + points);

      // If suspicious, we could flag it here. For Phase 1 we just track.
      await match.save();

      return res.json({ 
        message: 'Infraction logged', 
        suspicionScore: match.suspicionScores.get(userId) 
      });
    } 
    
    if (contestId) {
      const contest = await Contest.findById(contestId);
      if (!contest) return res.status(404).json({ message: 'Contest not found' });

      const participant = contest.participants.find(p => p.user.toString() === userId);
      if (!participant) return res.status(400).json({ message: 'Not participating in this contest' });

      participant.suspicionScore = (participant.suspicionScore || 0) + points;
      await contest.save();

      return res.json({ 
        message: 'Infraction logged', 
        suspicionScore: participant.suspicionScore 
      });
    }

    res.status(400).json({ message: 'Must provide matchId or contestId' });
  } catch (error) {
    console.error('Fairness report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
