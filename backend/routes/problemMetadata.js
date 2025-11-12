import express from 'express';
import ProblemMetadata from '../models/ProblemMetadata.js';
import Problem from '../models/Problem.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/problem-metadata/:problemId
// @desc    Get metadata for a problem
// @access  Public
router.get('/:problemId', async (req, res) => {
  try {
    const metadata = await ProblemMetadata.findOne({ problem: req.params.problemId })
      .populate('similarProblems', 'title difficulty')
      .populate('interviewExperiences.addedBy', 'username');

    if (!metadata) {
      return res.json({
        problem: req.params.problemId,
        companies: [],
        lists: [],
        frequencyData: { sixMonths: 0, oneYear: 0, twoYears: 0, allTime: 0 },
        interviewExperiences: []
      });
    }

    res.json(metadata);
  } catch (error) {
    console.error('Get metadata error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problem-metadata/:problemId
// @desc    Create or update metadata for a problem (Admin)
// @access  Private/Admin
router.post('/:problemId', protect, isAdmin, async (req, res) => {
  try {
    const { companies, lists, frequencyData, hints, realWorldApplications, isPremium, similarProblems } = req.body;

    // Check if problem exists
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    let metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });

    if (metadata) {
      // Update existing metadata
      if (companies) metadata.companies = companies;
      if (lists) metadata.lists = lists;
      if (frequencyData) metadata.frequencyData = frequencyData;
      if (hints) metadata.hints = hints;
      if (realWorldApplications) metadata.realWorldApplications = realWorldApplications;
      if (isPremium !== undefined) metadata.isPremium = isPremium;
      if (similarProblems) metadata.similarProblems = similarProblems;
      
      metadata.updatedAt = Date.now();
      await metadata.save();
    } else {
      // Create new metadata
      metadata = await ProblemMetadata.create({
        problem: req.params.problemId,
        companies: companies || [],
        lists: lists || [],
        frequencyData: frequencyData || { sixMonths: 0, oneYear: 0, twoYears: 0, allTime: 0 },
        hints: hints || [],
        realWorldApplications: realWorldApplications || [],
        isPremium: isPremium || false,
        similarProblems: similarProblems || []
      });
    }

    res.json(metadata);
  } catch (error) {
    console.error('Update metadata error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problem-metadata/:problemId/company
// @desc    Add/Update company tag for a problem (Admin)
// @access  Private/Admin
router.post('/:problemId/company', protect, isAdmin, async (req, res) => {
  try {
    const { name, frequency, lastAsked, acceptanceRate } = req.body;

    let metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });
    
    if (!metadata) {
      metadata = await ProblemMetadata.create({
        problem: req.params.problemId,
        companies: []
      });
    }

    // Check if company already exists
    const existingCompanyIndex = metadata.companies.findIndex(c => c.name === name);
    
    if (existingCompanyIndex > -1) {
      // Update existing company
      metadata.companies[existingCompanyIndex] = {
        name,
        frequency: frequency || metadata.companies[existingCompanyIndex].frequency,
        lastAsked: lastAsked || metadata.companies[existingCompanyIndex].lastAsked,
        acceptanceRate: acceptanceRate || metadata.companies[existingCompanyIndex].acceptanceRate
      };
    } else {
      // Add new company
      metadata.companies.push({
        name,
        frequency: frequency || 0,
        lastAsked: lastAsked || new Date(),
        acceptanceRate: acceptanceRate || 0
      });
    }

    await metadata.save();
    res.json(metadata);
  } catch (error) {
    console.error('Add company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/problem-metadata/:problemId/company/:companyName
// @desc    Remove company tag from a problem (Admin)
// @access  Private/Admin
router.delete('/:problemId/company/:companyName', protect, isAdmin, async (req, res) => {
  try {
    const metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });
    
    if (!metadata) {
      return res.status(404).json({ message: 'Metadata not found' });
    }

    metadata.companies = metadata.companies.filter(c => c.name !== req.params.companyName);
    await metadata.save();

    res.json(metadata);
  } catch (error) {
    console.error('Remove company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problem-metadata/:problemId/list
// @desc    Add problem to a list (Admin)
// @access  Private/Admin
router.post('/:problemId/list', protect, isAdmin, async (req, res) => {
  try {
    const { listName } = req.body;

    let metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });
    
    if (!metadata) {
      metadata = await ProblemMetadata.create({
        problem: req.params.problemId,
        lists: [listName]
      });
    } else if (!metadata.lists.includes(listName)) {
      metadata.lists.push(listName);
      await metadata.save();
    }

    res.json(metadata);
  } catch (error) {
    console.error('Add to list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/problem-metadata/:problemId/list/:listName
// @desc    Remove problem from a list (Admin)
// @access  Private/Admin
router.delete('/:problemId/list/:listName', protect, isAdmin, async (req, res) => {
  try {
    const metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });
    
    if (!metadata) {
      return res.status(404).json({ message: 'Metadata not found' });
    }

    metadata.lists = metadata.lists.filter(l => l !== req.params.listName);
    await metadata.save();

    res.json(metadata);
  } catch (error) {
    console.error('Remove from list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problem-metadata/:problemId/interview-experience
// @desc    Add interview experience (Users can add, admin can verify)
// @access  Private
router.post('/:problemId/interview-experience', protect, async (req, res) => {
  try {
    const { company, position, date, difficulty, description, tips } = req.body;

    let metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });
    
    if (!metadata) {
      metadata = await ProblemMetadata.create({
        problem: req.params.problemId,
        interviewExperiences: []
      });
    }

    metadata.interviewExperiences.push({
      company,
      position,
      date: date || new Date(),
      difficulty,
      description,
      tips,
      addedBy: req.user._id,
      isVerified: req.user.isAdmin || false
    });

    await metadata.save();
    res.json(metadata);
  } catch (error) {
    console.error('Add interview experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/problem-metadata/:problemId/interview-experience/:experienceId/verify
// @desc    Verify interview experience (Admin)
// @access  Private/Admin
router.put('/:problemId/interview-experience/:experienceId/verify', protect, isAdmin, async (req, res) => {
  try {
    const metadata = await ProblemMetadata.findOne({ problem: req.params.problemId });
    
    if (!metadata) {
      return res.status(404).json({ message: 'Metadata not found' });
    }

    const experience = metadata.interviewExperiences.id(req.params.experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experience.isVerified = true;
    await metadata.save();

    res.json(metadata);
  } catch (error) {
    console.error('Verify experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problem-metadata/list/:listName
// @desc    Get all problems in a specific list
// @access  Public
router.get('/list/:listName', async (req, res) => {
  try {
    const metadata = await ProblemMetadata.find({ lists: req.params.listName })
      .populate('problem', 'title difficulty acceptanceRate tags');

    res.json(metadata);
  } catch (error) {
    console.error('Get list problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problem-metadata/company/:companyName
// @desc    Get all problems for a specific company
// @access  Public
router.get('/company/:companyName', async (req, res) => {
  try {
    const metadata = await ProblemMetadata.find({ 'companies.name': req.params.companyName })
      .populate('problem', 'title difficulty acceptanceRate tags')
      .sort({ 'companies.frequency': -1 });

    res.json(metadata);
  } catch (error) {
    console.error('Get company problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problem-metadata/:problemId/hints
// @desc    Get hints for a problem (user only gets unlocked hints)
// @access  Private
router.get('/:problemId/hints', protect, async (req, res) => {
  try {
    const metadata = await ProblemMetadata.findOne({ problem: req.params.problemId })
      .select('hints');

    if (!metadata || !metadata.hints) {
      return res.json({ hints: [], totalHints: 0 });
    }

    // Get user's unlocked hints for this problem
    const user = req.user;
    const unlockedData = user.unlockedHints.find(
      (h) => h.problem.toString() === req.params.problemId
    );

    const unlockedIndices = unlockedData?.hintIndices || [];

    // Return hints with locked status
    const hintsWithStatus = metadata.hints.map((hint, idx) => ({
      index: idx,
      hint: unlockedIndices.includes(idx) ? hint : `Hint ${idx + 1} (Locked)`,
      isLocked: !unlockedIndices.includes(idx)
    }));

    res.json({
      hints: hintsWithStatus,
      totalHints: metadata.hints.length,
      unlockedCount: unlockedIndices.length
    });
  } catch (error) {
    console.error('Get hints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problem-metadata/:problemId/hints/:hintIndex/unlock
// @desc    Unlock a hint for a problem (costs coins)
// @access  Private
router.post('/:problemId/hints/:hintIndex/unlock', protect, async (req, res) => {
  try {
    const { problemId } = req.params;
    const hintIndex = parseInt(req.params.hintIndex);
    const costPerHint = 1; // 1 coin per hint (can be configurable)

    // Verify problem exists
    const metadata = await ProblemMetadata.findOne({ problem: problemId });
    if (!metadata || !metadata.hints || hintIndex >= metadata.hints.length) {
      return res.status(404).json({ message: 'Hint not found' });
    }

    const user = req.user;
    
    // Check if hint already unlocked
    const unlockedData = user.unlockedHints.find(
      (h) => h.problem.toString() === problemId
    );

    if (unlockedData && unlockedData.hintIndices.includes(hintIndex)) {
      return res.json({
        message: 'Hint already unlocked',
        hint: metadata.hints[hintIndex]
      });
    }

    // For now, automatically unlock (can add coin cost later)
    // In future: check user.coins >= costPerHint
    
    if (unlockedData) {
      unlockedData.hintIndices.push(hintIndex);
      unlockedData.unlockedAt = new Date();
    } else {
      user.unlockedHints.push({
        problem: problemId,
        hintIndices: [hintIndex]
      });
    }

    await user.save();

    res.json({
      message: 'Hint unlocked',
      hint: metadata.hints[hintIndex],
      hintIndex: hintIndex,
      costPerHint: costPerHint
    });
  } catch (error) {
    console.error('Unlock hint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

