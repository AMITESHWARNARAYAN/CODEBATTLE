import express from 'express';
import Contest from '../models/Contest.js';
import Problem from '../models/Problem.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, isAdmin);

// Create new contest
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      problems, // Array of { problemId, points, order }
      startTime,
      duration,
      rules,
      prizes,
      isRated,
      ratingFloor,
      ratingCeiling
    } = req.body;

    // Validate problems exist
    const problemIds = problems.map(p => p.problemId);
    const existingProblems = await Problem.find({ _id: { $in: problemIds } });

    if (existingProblems.length !== problemIds.length) {
      return res.status(400).json({ message: 'Some problems do not exist' });
    }

    // Calculate end time
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    const contest = new Contest({
      title,
      description,
      type,
      problems: problems.map(p => ({
        problem: p.problemId,
        points: p.points || 100,
        order: p.order
      })),
      startTime: start,
      endTime: end,
      duration,
      rules,
      prizes,
      isRated,
      ratingFloor,
      ratingCeiling,
      createdBy: req.user._id
    });

    await contest.save();

    const populatedContest = await Contest.findById(contest._id)
      .populate('problems.problem', 'title difficulty')
      .populate('createdBy', 'username');

    res.status(201).json({
      message: 'Contest created successfully',
      contest: populatedContest
    });
  } catch (error) {
    console.error('Create contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contests (admin view)
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;

    const contests = await Contest.find(filter)
      .populate('problems.problem', 'title difficulty')
      .populate('createdBy', 'username')
      .sort({ startTime: -1 });

    res.json(contests);
  } catch (error) {
    console.error('Get contests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single contest (admin view)
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('problems.problem')
      .populate('createdBy', 'username')
      .populate('participants.user', 'username email');

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json(contest);
  } catch (error) {
    console.error('Get contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contest
router.put('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Don't allow updates to running or finished contests
    if (contest.status === 'running' || contest.status === 'finished') {
      return res.status(400).json({ 
        message: 'Cannot update running or finished contests' 
      });
    }

    const {
      title,
      description,
      type,
      problems,
      startTime,
      duration,
      rules,
      prizes,
      isRated,
      ratingFloor,
      ratingCeiling,
      isVisible
    } = req.body;

    if (title) contest.title = title;
    if (description) contest.description = description;
    if (type) contest.type = type;
    if (rules) contest.rules = rules;
    if (prizes) contest.prizes = prizes;
    if (isRated !== undefined) contest.isRated = isRated;
    if (ratingFloor !== undefined) contest.ratingFloor = ratingFloor;
    if (ratingCeiling !== undefined) contest.ratingCeiling = ratingCeiling;
    if (isVisible !== undefined) contest.isVisible = isVisible;

    if (problems) {
      const problemIds = problems.map(p => p.problemId);
      const existingProblems = await Problem.find({ _id: { $in: problemIds } });

      if (existingProblems.length !== problemIds.length) {
        return res.status(400).json({ message: 'Some problems do not exist' });
      }

      contest.problems = problems.map(p => ({
        problem: p.problemId,
        points: p.points || 100,
        order: p.order
      }));
    }

    if (startTime || duration) {
      const start = startTime ? new Date(startTime) : contest.startTime;
      const dur = duration || contest.duration;
      contest.startTime = start;
      contest.duration = dur;
      contest.endTime = new Date(start.getTime() + dur * 60000);
    }

    await contest.save();

    const updatedContest = await Contest.findById(contest._id)
      .populate('problems.problem', 'title difficulty')
      .populate('createdBy', 'username');

    res.json({
      message: 'Contest updated successfully',
      contest: updatedContest
    });
  } catch (error) {
    console.error('Update contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contest
router.delete('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Don't allow deletion of running contests
    if (contest.status === 'running') {
      return res.status(400).json({ 
        message: 'Cannot delete running contests. Cancel it first.' 
      });
    }

    await Contest.findByIdAndDelete(req.params.id);

    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    console.error('Delete contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel contest
router.post('/:id/cancel', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    if (contest.status === 'finished') {
      return res.status(400).json({ 
        message: 'Cannot cancel finished contests' 
      });
    }

    contest.status = 'cancelled';
    await contest.save();

    res.json({ 
      message: 'Contest cancelled successfully',
      contest 
    });
  } catch (error) {
    console.error('Cancel contest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contest statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('participants.user', 'username email');

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const stats = {
      totalParticipants: contest.totalParticipants,
      totalSubmissions: contest.participants.reduce(
        (sum, p) => sum + p.submissions.length, 0
      ),
      averageScore: contest.participants.length > 0
        ? contest.participants.reduce((sum, p) => sum + p.totalScore, 0) / contest.participants.length
        : 0,
      problemStats: contest.problems.map(cp => {
        const problemSubmissions = contest.participants.flatMap(p =>
          p.submissions.filter(s => s.problem.toString() === cp.problem._id.toString())
        );
        const accepted = problemSubmissions.filter(s => s.status === 'accepted').length;
        
        return {
          problem: cp.problem,
          totalSubmissions: problemSubmissions.length,
          acceptedSubmissions: accepted,
          acceptanceRate: problemSubmissions.length > 0 
            ? (accepted / problemSubmissions.length * 100).toFixed(2) 
            : 0
        };
      }),
      topPerformers: contest.calculateLeaderboard().slice(0, 10)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get contest stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

