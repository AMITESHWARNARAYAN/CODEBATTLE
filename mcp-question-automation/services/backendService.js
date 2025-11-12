import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

/**
 * Upload a problem to the backend
 * @param {Object} problemData - Complete problem data with test cases
 * @returns {Promise<Object>} Upload result
 */
export async function uploadProblem(problemData) {
  try {
    if (!ADMIN_TOKEN) {
      throw new Error('ADMIN_TOKEN not configured in .env file');
    }

    // Format the problem data according to backend schema
    const payload = {
      title: problemData.title,
      description: problemData.description,
      difficulty: problemData.difficulty,
      tags: problemData.tags || [],
      constraints: problemData.constraints || '',
      examples: problemData.examples || [],
      testCases: problemData.testCases,
      functionSignature: problemData.functionSignature || {
        javascript: '',
        python: '',
        java: '',
        cpp: ''
      },
      timeLimit: problemData.timeLimit || 2000,
      memoryLimit: problemData.memoryLimit || 256,
      solutionLink: problemData.solutionLink || '',
      category: problemData.category || null
    };

    // Make API request to backend
    const response = await axios.post(
      `${BACKEND_URL}/api/admin/problems`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return {
      success: true,
      problem: response.data.problem,
      message: response.data.message
    };

  } catch (error) {
    console.error('Backend upload error:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    };
  }
}

/**
 * Test backend connection
 * @returns {Promise<boolean>} Connection status
 */
export async function testConnection() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/problems`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      timeout: 10000
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
}

