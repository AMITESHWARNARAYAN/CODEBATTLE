import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Timeout wrapper for API calls
const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`API call timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Initialize Gemini AI with API key
let genAI = null;
let geminiValid = false;

// Initialize Groq AI with API key
let groqClient = null;
let groqValid = false;

try {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiValid = true;
    console.log('✅ Gemini AI initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Gemini AI:', error.message);
}

try {
  console.log('🔍 Checking GROQ_API_KEY...');
  console.log('GROQ_API_KEY value:', process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 10)}...` : 'NOT SET');

  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY not found in environment variables');
  } else {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    groqValid = true;
    console.log('✅ Groq AI initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Groq AI:', error.message);
}



export async function generateProblemExplanation(problem) {
  try {
    // Groq API is required
    if (!groqClient || !groqValid) {
      throw new Error('Groq API key not configured. Please set GROQ_API_KEY in environment variables.');
    }

    // Validate problem object
    if (!problem || !problem.title || !problem.description) {
      throw new Error('Invalid problem data: missing required fields');
    }

    const prompt = `You are an expert coding instructor. Generate a clear, concise explanation for the following coding problem.

Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}

Problem Description:
${problem.description}

Constraints:
${problem.constraints}

Please provide:
1. A brief overview of what the problem is asking
2. Key concepts needed to solve it
3. Step-by-step approach to solve it
4. Common pitfalls to avoid
5. Time and space complexity considerations

Format the response in a clear, educational manner suitable for learning.`;

    const message = await withTimeout(
      groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1024,
      }),
      30000
    );

    const explanation = message.choices[0]?.message?.content || '';

    return {
      success: true,
      explanation,
      generatedAt: new Date(),
      source: 'groq'
    };
  } catch (error) {
    console.error('Error generating explanation:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function generateSolutionApproach(problem, userCode) {
  try {
    // Groq API is required
    if (!groqClient || !groqValid) {
      throw new Error('Groq API key not configured. Please set GROQ_API_KEY in environment variables.');
    }

    // Validate inputs
    if (!problem || !problem.title || !problem.description) {
      throw new Error('Invalid problem data: missing required fields');
    }

    if (!userCode || typeof userCode !== 'string') {
      throw new Error('Invalid user code provided');
    }

    const prompt = `You are an expert coding instructor. A student is working on this problem and needs help understanding the solution approach.

Problem: ${problem.title}
Description: ${problem.description}

User's Current Code:
\`\`\`
${userCode}
\`\`\`

Please provide:
1. Analysis of their current approach
2. What they're doing right
3. What needs improvement
4. Hints to guide them to the solution (without giving away the complete answer)
5. Suggested next steps

Be encouraging and educational.`;

    const message = await withTimeout(
      groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1024,
      }),
      30000
    );

    const guidance = message.choices[0]?.message?.content || '';

    return {
      success: true,
      guidance,
      generatedAt: new Date(),
      source: 'groq'
    };
  } catch (error) {
    console.error('Error generating guidance:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function generateDetailedSolution(problem) {
  try {
    // Groq API is required
    if (!groqClient || !groqValid) {
      throw new Error('Groq API key not configured. Please set GROQ_API_KEY in environment variables.');
    }

    // Validate problem object
    if (!problem || !problem.title || !problem.description) {
      throw new Error('Invalid problem data: missing required fields');
    }

    const prompt = `You are an expert coding instructor. Generate a detailed solution explanation for this problem.

Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}

Problem Description:
${problem.description}

Constraints:
${problem.constraints}

Examples:
${problem.examples?.map(ex => `Input: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')}

Please provide:
1. Complete solution approach with algorithm explanation
2. Code solution in JavaScript (or the most suitable language)
3. Detailed walkthrough of the solution
4. Time and space complexity analysis
5. Alternative approaches if any

Format clearly with code blocks and explanations.`;

    const message = await withTimeout(
      groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 2048,
      }),
      30000
    );

    const solution = message.choices[0]?.message?.content || '';

    return {
      success: true,
      solution,
      generatedAt: new Date(),
      source: 'groq'
    };
  } catch (error) {
    console.error('Error generating solution:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

