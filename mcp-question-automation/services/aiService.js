import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';

// Initialize AI clients
const gemini = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * Generate test cases for a coding problem using AI
 * @param {Object} questionData - Parsed question data
 * @returns {Promise<Array>} Array of test cases
 */
export async function generateTestCases(questionData) {
  const prompt = createTestCasePrompt(questionData);
  
  try {
    let response;
    
    if (AI_PROVIDER === 'gemini' && gemini) {
      response = await generateWithGemini(prompt);
    } else if (AI_PROVIDER === 'groq' && groq) {
      response = await generateWithGroq(prompt);
    } else {
      throw new Error('No AI provider configured');
    }
    
    // Parse the AI response to extract test cases
    const testCases = parseTestCasesFromResponse(response);
    return testCases;
    
  } catch (error) {
    console.error('AI generation error:', error.message);
    // Return basic test cases as fallback
    return generateFallbackTestCases(questionData);
  }
}

/**
 * Create a detailed prompt for test case generation
 */
function createTestCasePrompt(questionData) {
  return `You are an expert at creating comprehensive test cases for coding problems.

Problem Title: ${questionData.title}
Difficulty: ${questionData.difficulty}
Description: ${questionData.description}

${questionData.constraints ? `Constraints: ${questionData.constraints}` : ''}

${questionData.examples && questionData.examples.length > 0 ? `
Examples:
${questionData.examples.map((ex, i) => `
Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}
${ex.explanation ? `Explanation: ${ex.explanation}` : ''}
`).join('\n')}
` : ''}

Generate 8-10 comprehensive test cases that cover:
1. Basic/simple cases (2-3 cases)
2. Edge cases (empty input, single element, etc.) (2-3 cases)
3. Complex/large inputs (2-3 cases)
4. Corner cases specific to this problem (1-2 cases)

For each test case, provide:
- input: The input value(s) as a string
- expectedOutput: The expected output as a string
- isHidden: true for complex test cases (last 3-4), false for basic ones

Return ONLY a valid JSON array in this exact format:
[
  {
    "input": "input value here",
    "expectedOutput": "expected output here",
    "isHidden": false
  }
]

Important:
- Return ONLY the JSON array, no other text
- Ensure all JSON is properly formatted
- Make inputs and outputs realistic and correct
- Cover all edge cases mentioned in constraints`;
}

/**
 * Generate test cases using Gemini
 */
async function generateWithGemini(prompt) {
  const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Generate test cases using Groq
 */
async function generateWithGroq(prompt) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an expert at creating comprehensive test cases for coding problems. Always return valid JSON arrays.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 2000
  });
  
  return completion.choices[0]?.message?.content || '';
}

/**
 * Parse test cases from AI response
 */
function parseTestCasesFromResponse(response) {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    cleaned = cleaned.replace(/```json\n?/g, '');
    cleaned = cleaned.replace(/```\n?/g, '');
    cleaned = cleaned.trim();
    
    // Parse JSON
    const testCases = JSON.parse(cleaned);
    
    // Validate structure
    if (!Array.isArray(testCases)) {
      throw new Error('Response is not an array');
    }
    
    // Validate each test case
    const validTestCases = testCases.filter(tc => 
      tc.input !== undefined && 
      tc.expectedOutput !== undefined
    ).map(tc => ({
      input: String(tc.input),
      expectedOutput: String(tc.expectedOutput),
      isHidden: tc.isHidden === true
    }));
    
    return validTestCases;
    
  } catch (error) {
    console.error('Failed to parse AI response:', error.message);
    console.log('Raw response:', response.substring(0, 200));
    return [];
  }
}

/**
 * Generate basic fallback test cases if AI fails
 */
function generateFallbackTestCases(questionData) {
  const fallbackCases = [];
  
  // Use examples as test cases if available
  if (questionData.examples && questionData.examples.length > 0) {
    questionData.examples.forEach((example, index) => {
      fallbackCases.push({
        input: example.input,
        expectedOutput: example.output,
        isHidden: false
      });
    });
  }
  
  // Add at least one basic test case if no examples
  if (fallbackCases.length === 0) {
    fallbackCases.push({
      input: '[]',
      expectedOutput: '[]',
      isHidden: false
    });
  }
  
  return fallbackCases;
}

