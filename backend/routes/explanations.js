import express from 'express';
import { generateProblemExplanation, generateSolutionApproach, generateDetailedSolution } from '../utils/geminiExplainer.js';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get saved explanation/editorial for a problem
router.get('/:problemId', protect, async (req, res) => {
  try {
    const { problemId } = req.params;

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // For now, return a basic editorial structure
    // In production, you might have a separate Editorial model or add these fields to Problem
    const editorial = {
      problemId,
      approach: 'The editorial for this problem is being prepared. Please check back later.',
      complexity: 'Time Complexity: To be added\nSpace Complexity: To be added',
      solution: '',
      available: false
    };

    res.json(editorial);
  } catch (error) {
    console.error('Error fetching editorial:', error);
    res.status(404).json({ 
      message: 'Editorial not available',
      error: error.message 
    });
  }
});

// Generate explanation for a problem
router.post('/problem/:problemId/explanation', protect, async (req, res) => {
  try {
    const { problemId } = req.params;

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Generate explanation using Gemini
    const result = await generateProblemExplanation(problem);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate explanation',
        error: result.error 
      });
    }

    res.json({
      success: true,
      problemId,
      explanation: result.explanation,
      generatedAt: result.generatedAt
    });
  } catch (error) {
    console.error('Error in explanation route:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Generate guidance for user's code
router.post('/problem/:problemId/guidance', protect, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { userCode } = req.body;

    if (!userCode) {
      return res.status(400).json({ message: 'User code is required' });
    }

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Generate guidance using Gemini
    const result = await generateSolutionApproach(problem, userCode);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate guidance',
        error: result.error 
      });
    }

    res.json({
      success: true,
      problemId,
      guidance: result.guidance,
      generatedAt: result.generatedAt
    });
  } catch (error) {
    console.error('Error in guidance route:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Generate detailed solution
router.post('/problem/:problemId/solution', protect, async (req, res) => {
  try {
    const { problemId } = req.params;

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Generate solution using Gemini
    const result = await generateDetailedSolution(problem);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate solution',
        error: result.error 
      });
    }

    res.json({
      success: true,
      problemId,
      solution: result.solution,
      generatedAt: result.generatedAt
    });
  } catch (error) {
    console.error('Error in solution route:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

