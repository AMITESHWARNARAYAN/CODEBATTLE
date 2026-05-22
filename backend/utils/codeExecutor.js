import axios from 'axios';
import { executeCodeWithDocker, wrapAllTestCases } from './dockerExecutor.js';

// ═══ Execution Mode Switch ═══
// Set USE_DOCKER=true in .env to run code locally via Docker
// Otherwise falls back to Judge0 RapidAPI
const USE_DOCKER = process.env.USE_DOCKER === 'true';

// Judge0 API configuration (used when USE_DOCKER is false)
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';

// Language ID mapping for Judge0
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++ (GCC 9.2.0)
  c: 50,           // C (GCC 9.2.0)
  csharp: 51,      // C#
  go: 60,          // Go
  rust: 73,        // Rust
  ruby: 72,        // Ruby
  php: 68,         // PHP
  swift: 83,       // Swift
  kotlin: 78       // Kotlin
};

import { compareOutputs } from './outputComparator.js';

const TIME_PREFIX = '===TIME===';

const extractTiming = (outputStr, defaultTime) => {
  const timeMatch = outputStr.match(new RegExp(`${TIME_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)`));
  if (timeMatch) {
    const microseconds = parseInt(timeMatch[1], 10);
    const cleanOutput = outputStr.replace(new RegExp(`${TIME_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+\\s*`), '').trim();
    return { time: Math.round(microseconds / 1000), output: cleanOutput };
  }
  return { time: defaultTime, output: outputStr.trim() };
};

/**
 * Wrap user code with test case execution logic (LeetCode-style)
 * @param {string} code - User's function code
 * @param {Array} inputArgs - Array of arguments to pass to function
 * @param {string} language - Programming language
 * @returns {string} Complete executable code
 */
const wrapCodeWithTestCase = (code, inputArgs, language, metaData = null) => {
  return wrapAllTestCases(code, [{ input: JSON.stringify(inputArgs) }], language, metaData);
};

/**
 * Execute code using Judge0 API with batch submissions
 * @param {string} code - User's code
 * @param {array} testCases - Array of test cases
 * @param {string} language - Programming language
 * @param {number} timeLimit - Time limit in seconds
 * @returns {object} Execution result
 */
export const executeCodeWithJudge0 = async (code, testCases, language = 'cpp', timeLimit = 2, metaData = null, options = {}) => {
  const results = {
    status: 'Accepted',
    testCasesPassed: 0,
    totalTestCases: testCases.length,
    executionTime: 0,
    memoryUsed: 0,
    errors: [],
    outputs: []
  };

  const failFast = options.failFast !== false;

  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) {
    return {
      status: 'Error',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      executionTime: 0,
      memoryUsed: 0,
      errors: [`Unsupported language: ${language}`],
      outputs: []
    };
  }

  // Check if API key is configured
  if (!JUDGE0_API_KEY) {
    return {
      status: 'Error',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      executionTime: 0,
      memoryUsed: 0,
      errors: ['Judge0 API key is not configured. Please contact administrator.'],
      outputs: []
    };
  }

  try {
    // Step 1: Prepare batch submissions
    const submissions = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        // Parse input data - should be an array of arguments
        let inputArgs;
        try {
          inputArgs = JSON.parse(testCase.input);
          // Ensure it's an array
          if (!Array.isArray(inputArgs)) {
            inputArgs = [inputArgs];
          }
        } catch (e) {
          // If not valid JSON, treat as single argument
          inputArgs = [testCase.input];
        }

        // Wrap code with test case execution logic
        const wrappedCode = wrapCodeWithTestCase(code, inputArgs, language, metaData);

        // Only log full code in development — prevents massive log volume in production
        if (process.env.NODE_ENV !== 'production') {
          console.log(`\n=== Test Case ${i + 1} ===`);
          console.log('Input:', testCase.input);
          console.log('Parsed Args:', inputArgs);
          console.log('Expected Output:', testCase.expectedOutput);
          console.log('Wrapped Code Preview:', wrappedCode.substring(0, 200) + '...');
          console.log('===================\n');
        }

        // Add to batch submissions array (with base64 encoding)
        const base64Code = Buffer.from(wrappedCode).toString('base64');
        submissions.push({
          source_code: base64Code,
          language_id: languageId
        });

      } catch (error) {
        console.error(`Error preparing submission for test case ${i + 1}:`, error.message);
        results.errors.push(`Test case ${i + 1}: ${error.message}`);
      }
    }

    // Step 2: Submit batch to Judge0
    let submissionTokens = [];

    try {
      const batchResponse = await axios.post(
        `${JUDGE0_API_URL}/submissions/batch?base64_encoded=true`,
        {
          submissions: submissions
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      console.log('Batch submission response:', batchResponse.data);

      // Extract tokens from batch response
      submissionTokens = batchResponse.data.map((submission, index) => ({
        token: submission.token,
        testCaseIndex: index,
        input: testCases[index].input,
        expectedOutput: testCases[index].expectedOutput
      }));

    } catch (error) {
      console.error('Batch submission error:', error.message);
      console.error('Error details:', error.response?.data || error);
      return {
        status: 'Error',
        testCasesPassed: 0,
        totalTestCases: testCases.length,
        executionTime: 0,
        memoryUsed: 0,
        errors: [`Failed to submit code: ${error.message}`],
        outputs: []
      };
    }

    // Step 3: Poll for results using batch GET
    const maxPolls = 10;
    const pollInterval = 1000; // 1 second

    for (let poll = 0; poll < maxPolls; poll++) {
      // Wait before polling
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      let allCompleted = true;

      // Build tokens query string for batch GET
      const tokens = submissionTokens
        .filter(s => !s.result)
        .map(s => s.token)
        .join(',');

      if (!tokens) break; // All results fetched

      try {
        const resultResponse = await axios.get(
          `${JUDGE0_API_URL}/submissions/batch?tokens=${tokens}&base64_encoded=true&fields=*`,
          {
            headers: {
              'X-RapidAPI-Key': JUDGE0_API_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          }
        );

        const fetchedSubmissions = resultResponse.data.submissions || resultResponse.data;

        // Map results back to submission tokens
        for (let i = 0; i < fetchedSubmissions.length; i++) {
          const result = fetchedSubmissions[i];
          const submission = submissionTokens.find(s => s.token === result.token);

          if (!submission) continue;

          // Decode base64 output if present
          if (result.stdout) {
            result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8');
          }
          if (result.stderr) {
            result.stderr = Buffer.from(result.stderr, 'base64').toString('utf-8');
          }
          if (result.compile_output) {
            result.compile_output = Buffer.from(result.compile_output, 'base64').toString('utf-8');
          }

          // Check if processing is complete
          if (result.status.id <= 2) {
            // Still processing (In Queue = 1, Processing = 2)
            allCompleted = false;
          } else {
            // Store result
            submission.result = result;
          }
        }

      } catch (error) {
        console.error(`Error fetching batch results:`, error.message);
        console.error('Error details:', error.response?.data || error);
        // Mark all as error
        for (const submission of submissionTokens) {
          if (!submission.result) {
            submission.result = { status: { id: 13, description: 'Internal Error' }, stderr: error.message };
          }
        }
        break;
      }

      if (allCompleted) break;
    }

    // Step 4: Process results chronologically
    submissionTokens.sort((a, b) => a.testCaseIndex - b.testCaseIndex);
    let firstFailFastIndex = -1;
    let totalRealTime = 0;
    let totalMemoryUsed = 0;
    let processedCount = 0;

    for (const submission of submissionTokens) {
      const i = submission.testCaseIndex;
      const result = submission.result;
      const expectedOutput = (submission.expectedOutput || '').trim();

      // If we already failed fast on a previous test case, mark this one as skipped
      if (firstFailFastIndex !== -1) {
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: expectedOutput,
          actualOutput: '',
          error: 'Skipped due to previous failure',
          executionTime: 0
        });
        continue;
      }

      if (!result) {
        results.status = 'Error';
        results.errors.push(`Test case ${i + 1}: Timeout waiting for result`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: expectedOutput,
          actualOutput: '',
          error: 'Timeout waiting for result',
          executionTime: 0
        });
        if (failFast) {
          firstFailFastIndex = i;
        }
        continue;
      }

      const executionTime = parseFloat(result.time || 0) * 1000; // Convert to ms
      const memoryUsed = parseInt(result.memory || 0) / 1024; // Convert to MB

      // Extract actual output and strip timing prefix
      const rawOutput = result.stdout?.trim() || '';
      const { time: tcTime, output: actualOutput } = extractTiming(rawOutput, executionTime);

      totalRealTime += tcTime;
      totalMemoryUsed += memoryUsed;
      processedCount++;

      // Check status
      if (result.status.id === 3) { // Accepted (code ran without error)
        // Now check if actualOutput is "ERROR" or contains "RUNTIME_ERROR" (caught exception inside the wrapper)
        if (actualOutput === 'ERROR' || actualOutput.includes('RUNTIME_ERROR')) {
          if (results.status === 'Accepted') results.status = 'Runtime Error';
          const errMsg = actualOutput.replace('ERROR', '').trim() || result.stderr || 'Runtime Error';
          results.errors.push(`Test case ${i + 1}: ${errMsg}`);
          results.outputs.push({
            testCase: i + 1,
            passed: false,
            input: submission.input,
            expectedOutput: expectedOutput,
            actualOutput: '',
            error: errMsg,
            executionTime: tcTime
          });
          if (failFast) {
            firstFailFastIndex = i;
          }
        } else {
          // Verify the output matches expected output
          const outputMatches = compareOutputs(actualOutput, expectedOutput);
          
          if (outputMatches) {
            results.testCasesPassed++;
            results.outputs.push({
              testCase: i + 1,
              passed: true,
              input: submission.input,
              expectedOutput: expectedOutput,
              actualOutput: actualOutput,
              executionTime: tcTime
            });
          } else {
            // Output doesn't match - this is a Wrong Answer
            if (results.status === 'Accepted') results.status = 'Wrong Answer';
            results.outputs.push({
              testCase: i + 1,
              passed: false,
              input: submission.input,
              expectedOutput: expectedOutput,
              actualOutput: actualOutput,
              executionTime: tcTime
            });
            if (failFast) {
              firstFailFastIndex = i;
            }
          }
        }
      } else if (result.status.id === 4) { // Wrong Answer
        if (results.status === 'Accepted') results.status = 'Wrong Answer';
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: expectedOutput,
          actualOutput: actualOutput,
          executionTime: tcTime
        });
        if (failFast) {
          firstFailFastIndex = i;
        }
      } else if (result.status.id === 5) { // Time Limit Exceeded
        if (results.status === 'Accepted') results.status = 'Time Limit Exceeded';
        results.errors.push(`Test case ${i + 1}: Time Limit Exceeded`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: expectedOutput,
          actualOutput: '',
          error: 'Time Limit Exceeded',
          executionTime: tcTime
        });
        if (failFast) {
          firstFailFastIndex = i;
        }
      } else if (result.status.id === 6) { // Compilation Error
        results.status = 'Compilation Error';
        results.compile_output = result.compile_output || 'Compilation failed';
        results.errors.push(`Test case ${i + 1}: ${results.compile_output}`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: expectedOutput,
          actualOutput: '',
          error: results.compile_output,
          executionTime: 0
        });
        if (failFast) {
          firstFailFastIndex = i;
        }
      } else { // Runtime Error or other
        if (results.status === 'Accepted') results.status = 'Runtime Error';
        const errorMessage = result.stderr || result.status.description;
        results.errors.push(`Test case ${i + 1}: ${errorMessage}`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: expectedOutput,
          actualOutput: '',
          error: errorMessage,
          executionTime: tcTime
        });
        if (failFast) {
          firstFailFastIndex = i;
        }
      }
    }

    // Fallback status assignment if early crash happened without concrete output
    if (results.testCasesPassed < testCases.length && results.status === 'Accepted') {
      results.status = 'Wrong Answer';
    }

    // Calculate averages over actually processed test cases
    if (processedCount > 0) {
      results.executionTime = Math.round(totalRealTime / processedCount);
      results.memoryUsed = Math.round(totalMemoryUsed / processedCount * 100) / 100;
    }

    return results;

  } catch (error) {
    console.error('Judge0 API error:', error.message);
    console.error('Error details:', error.response?.data || error);

    return {
      status: 'Error',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      executionTime: 0,
      memoryUsed: 0,
      errors: [`Judge0 API error: ${error.response?.data?.message || error.message}`],
      outputs: []
    };
  }
};



/**
 * Analyze time and space complexity (improved multi-signal heuristic)
 * 
 * NOTE: Static analysis cannot determine true complexity — only runtime
 * profiling or a proper ML model can. This provides a "best guess" using
 * pattern matching. The `confidence` field communicates uncertainty.
 * 
 * @param {string} code - User's code
 * @returns {object} Complexity analysis with confidence indicator
 */
export const analyzeComplexity = (code) => {
  const analysis = {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    confidence: 'Estimated' // Always honest — this is a heuristic, not ground truth
  };

  // Strip comments and strings to avoid false positives
  let stripped = code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/#.*$/gm, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");

  // ── Detect nested loop depth via brace/indent tracking ──
  // Instead of just counting `for` keywords, we track actual nesting
  let maxLoopDepth = 0;
  let currentLoopDepth = 0;
  const lines = stripped.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Detect loop openings
    if (/^(for|while)\s*\(/.test(trimmed) || /^for\s+\w+/.test(trimmed)) {
      currentLoopDepth++;
      maxLoopDepth = Math.max(maxLoopDepth, currentLoopDepth);
    }
    // Detect loop closings (simplified: count closing braces at start of line)
    if (/^\}/.test(trimmed) && currentLoopDepth > 0) {
      currentLoopDepth--;
    }
  }

  // ── Detect specific patterns ──
  const hasSort = /\.sort\s*\(|sort\s*\(|Arrays\.sort|Collections\.sort/.test(stripped);
  const hasBinarySearch = /lo\s*<\s*hi|left\s*<\s*right|binarySearch|bisect|lower_bound|upper_bound/.test(stripped);
  const hasRecursion = (() => {
    // Check if any function calls itself
    const fnNames = stripped.match(/(?:def|function|var|let|const)\s+(\w+)/g) || [];
    for (const fn of fnNames) {
      const name = fn.split(/\s+/).pop();
      // Check if the name appears again (likely a recursive call)
      const callPattern = new RegExp(`\\b${name}\\s*\\(`, 'g');
      const matches = stripped.match(callPattern);
      if (matches && matches.length >= 2) return true;
    }
    return false;
  })();
  const hasMemoization = /memo|cache|dp\[|dp =|@lru_cache|@cache|functools/.test(stripped);
  const hasDPTable = /dp\s*=\s*\[|dp\s*=\s*new|dp\s*=\s*\{|int\s+dp\[|vector.*dp/.test(stripped);
  const hasHeap = /heapq|PriorityQueue|priority_queue|MinHeap|MaxHeap/.test(stripped);
  const hasHashMap = /HashMap|unordered_map|dict\(|Map\(|Set\(|unordered_set|defaultdict/.test(stripped);
  const hasNewArray = /new Array|new int\[|\[\s*0\s*\]\s*\*|vec!\[|vector\s*</.test(stripped);

  // ── Time complexity decision tree ──
  if (maxLoopDepth >= 3) {
    analysis.timeComplexity = 'O(n³)';
  } else if (maxLoopDepth === 2) {
    analysis.timeComplexity = 'O(n²)';
  } else if (hasRecursion && !hasMemoization) {
    analysis.timeComplexity = 'O(2ⁿ)';
  } else if (hasRecursion && hasMemoization) {
    analysis.timeComplexity = 'O(n)'; // Memoized recursion is typically linear
  } else if (hasSort || hasHeap) {
    analysis.timeComplexity = 'O(n log n)';
  } else if (hasBinarySearch && maxLoopDepth <= 1) {
    analysis.timeComplexity = 'O(log n)';
  } else if (hasDPTable && maxLoopDepth === 2) {
    analysis.timeComplexity = 'O(n²)';
  } else if (hasDPTable && maxLoopDepth <= 1) {
    analysis.timeComplexity = 'O(n)';
  } else if (maxLoopDepth === 1) {
    analysis.timeComplexity = 'O(n)';
  } else if (maxLoopDepth === 0 && !hasRecursion) {
    analysis.timeComplexity = 'O(1)';
  }

  // ── Space complexity ──
  if (hasDPTable && maxLoopDepth >= 2) {
    analysis.spaceComplexity = 'O(n²)';
  } else if (hasDPTable || hasNewArray || hasMemoization) {
    analysis.spaceComplexity = 'O(n)';
  } else if (hasHashMap) {
    analysis.spaceComplexity = 'O(n)';
  } else if (hasRecursion) {
    analysis.spaceComplexity = 'O(n)'; // Call stack
  }

  return analysis;
};

/**
 * Validate code syntax
 * @param {string} code - User's code
 * @param {string} language - Programming language
 * @returns {object} Validation result
 */
export const validateCode = (code, language = 'javascript') => {
  if (language !== 'javascript') {
    return {
      valid: false,
      error: 'Only JavaScript is currently supported'
    };
  }

  try {
    // Try to parse the code
    new Function(code);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

// ═══ Unified Executor ═══
// Routes call this — it picks Docker or Judge0 based on env
export const executeCode = USE_DOCKER ? executeCodeWithDocker : executeCodeWithJudge0;

console.log(`[CodeExecutor] Mode: ${USE_DOCKER ? '🐳 Docker (local)' : '☁️  Judge0 API'}`);
