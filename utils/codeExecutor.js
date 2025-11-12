import axios from 'axios';

// Judge0 API configuration
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

/**
 * Wrap user code with test case execution logic (LeetCode-style)
 * @param {string} code - User's function code
 * @param {Array} inputArgs - Array of arguments to pass to function
 * @param {string} language - Programming language
 * @returns {string} Complete executable code
 */
const wrapCodeWithTestCase = (code, inputArgs, language) => {
  if (language === 'cpp') {
    // Extract function name from C++ code
    const functionMatch = code.match(/(?:int|bool|void|vector<int>|string|double|float|long)\s+(\w+)\s*\(/);
    const functionName = functionMatch ? functionMatch[1] : 'solve';

    // Convert JavaScript values to C++ syntax
    const convertToCpp = (val) => {
      if (val === null) return 'NULL';
      if (val === true) return 'true';
      if (val === false) return 'false';
      if (Array.isArray(val)) {
        // Check if it's array of chars (for string problems)
        if (val.length > 0 && typeof val[0] === 'string' && val[0].length === 1) {
          return `{${val.map(v => `'${v}'`).join(', ')}}`;
        }
        // Regular array
        return `{${val.map(convertToCpp).join(', ')}}`;
      }
      if (typeof val === 'string') return `"${val}"`;
      return String(val);
    };

    // Extract parameter types from function signature
    const paramsMatch = code.match(/\(([^)]*)\)/);
    const paramsStr = paramsMatch ? paramsMatch[1] : '';
    const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);

    // Check if any parameter is a reference (contains &)
    const hasReferenceParams = params.some(p => p.includes('&'));

    // Build C++ arguments - create variables for reference parameters
    let variableDeclarations = '';
    let cppArgs = '';

    if (hasReferenceParams) {
      // Create variables for each argument
      inputArgs.forEach((arg, index) => {
        const param = params[index] || '';
        const isReference = param.includes('&');

        if (isReference) {
          // Extract type by removing parameter name and &
          // e.g., "vector<char>& s" -> "vector<char>"
          let varType = param.replace('&', '').trim();
          // Remove parameter name (last word after space)
          const lastSpaceIndex = varType.lastIndexOf(' ');
          if (lastSpaceIndex > 0) {
            varType = varType.substring(0, lastSpaceIndex).trim();
          }

          const varName = `arg${index}`;
          const varValue = convertToCpp(arg);

          variableDeclarations += `    ${varType} ${varName} = ${varValue};\n`;
          cppArgs += (index > 0 ? ', ' : '') + varName;
        } else {
          cppArgs += (index > 0 ? ', ' : '') + convertToCpp(arg);
        }
      });
    } else {
      cppArgs = inputArgs.map(convertToCpp).join(', ');
    }

    // Determine output format based on return type
    const returnTypeMatch = code.match(/(int|bool|void|vector<int>|vector<char>|string|double|float|long)\s+\w+\s*\(/);
    const returnType = returnTypeMatch ? returnTypeMatch[1] : 'int';

    let outputCode = '';
    if (returnType === 'bool') {
      outputCode = `cout << (result ? "true" : "false") << endl;`;
    } else if (returnType === 'vector<int>') {
      outputCode = `
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        if(i > 0) cout << ",";
        cout << result[i];
    }
    cout << "]" << endl;`;
    } else if (returnType === 'vector<char>') {
      outputCode = `
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        if(i > 0) cout << ",";
        cout << "'" << result[i] << "'";
    }
    cout << "]" << endl;`;
    } else if (returnType === 'void') {
      // For void functions with reference parameters, output the modified parameter
      if (hasReferenceParams) {
        const firstRefParam = params.findIndex(p => p.includes('&'));
        if (firstRefParam >= 0) {
          const varName = `arg${firstRefParam}`;
          const paramType = params[firstRefParam].replace('&', '').trim();

          if (paramType.includes('vector<char>')) {
            outputCode = `
    cout << "[";
    for(int i = 0; i < ${varName}.size(); i++) {
        if(i > 0) cout << ",";
        cout << "'" << ${varName}[i] << "'";
    }
    cout << "]" << endl;`;
          } else if (paramType.includes('vector<int>')) {
            outputCode = `
    cout << "[";
    for(int i = 0; i < ${varName}.size(); i++) {
        if(i > 0) cout << ",";
        cout << ${varName}[i];
    }
    cout << "]" << endl;`;
          } else {
            outputCode = `cout << ${varName} << endl;`;
          }
        }
      } else {
        outputCode = `// void function - no output`;
      }
    } else if (returnType === 'string') {
      outputCode = `cout << "\\"" << result << "\\"" << endl;`;
    } else {
      outputCode = `cout << result << endl;`;
    }

    return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

${code}

int main() {
${variableDeclarations}    ${returnType !== 'void' ? `auto result = ${functionName}(${cppArgs});` : `${functionName}(${cppArgs});`}
    ${outputCode}
    return 0;
}
`;
  }

  return code; // Fallback: return original code
};

/**
 * Execute code using Judge0 API with batch submissions
 * @param {string} code - User's code
 * @param {array} testCases - Array of test cases
 * @param {string} language - Programming language
 * @param {number} timeLimit - Time limit in seconds
 * @returns {object} Execution result
 */
export const executeCodeWithJudge0 = async (code, testCases, language = 'cpp', timeLimit = 2) => {
  const results = {
    status: 'Accepted',
    testCasesPassed: 0,
    totalTestCases: testCases.length,
    executionTime: 0,
    memoryUsed: 0,
    errors: [],
    outputs: []
  };

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
        const wrappedCode = wrapCodeWithTestCase(code, inputArgs, language);

        console.log(`\n=== Test Case ${i + 1} ===`);
        console.log('Input:', testCase.input);
        console.log('Parsed Args:', inputArgs);
        console.log('Expected Output:', testCase.expectedOutput);
        console.log('Wrapped Code:');
        console.log(wrappedCode);
        console.log('===================\n');

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

        const results = resultResponse.data.submissions || resultResponse.data;

        // Map results back to submission tokens
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
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

    // Step 4: Process results
    for (const submission of submissionTokens) {
      const i = submission.testCaseIndex;
      const result = submission.result;

      if (!result) {
        results.status = 'Error';
        results.errors.push(`Test case ${i + 1}: Timeout waiting for result`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          error: 'Timeout waiting for result',
          executionTime: 0
        });
        continue;
      }

      const executionTime = parseFloat(result.time || 0) * 1000; // Convert to ms
      const memoryUsed = parseInt(result.memory || 0) / 1024; // Convert to MB

      results.executionTime += executionTime;
      results.memoryUsed += memoryUsed;

      // Check status
      if (result.status.id === 3) { // Accepted
        results.testCasesPassed++;
        results.outputs.push({
          testCase: i + 1,
          passed: true,
          input: submission.input,
          expectedOutput: submission.expectedOutput,
          actualOutput: result.stdout?.trim() || '',
          executionTime: executionTime
        });
      } else if (result.status.id === 4) { // Wrong Answer
        if (results.status === 'Accepted') results.status = 'Wrong Answer';
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: submission.input,
          expectedOutput: submission.expectedOutput,
          actualOutput: result.stdout?.trim() || '',
          executionTime: executionTime
        });
      } else if (result.status.id === 5) { // Time Limit Exceeded
        results.status = 'Time Limit Exceeded';
        results.errors.push(`Test case ${i + 1}: Time Limit Exceeded`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          error: 'Time Limit Exceeded',
          executionTime: executionTime
        });
      } else if (result.status.id === 6) { // Compilation Error
        results.status = 'Compilation Error';
        results.errors.push(`Test case ${i + 1}: ${result.compile_output || 'Compilation failed'}`);
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          error: result.compile_output || 'Compilation failed',
          executionTime: 0
        });
      } else { // Runtime Error or other
        if (results.status === 'Accepted') results.status = 'Runtime Error';
        const errorMessage = result.stderr || result.status.description;
        results.errors.push(`Test case ${i + 1}: ${errorMessage}`);

        console.log(`\n=== Runtime Error - Test Case ${i + 1} ===`);
        console.log('Status ID:', result.status.id);
        console.log('Status:', result.status.description);
        console.log('Stderr:', result.stderr);
        console.log('Stdout:', result.stdout);
        console.log('Compile Output:', result.compile_output);
        console.log('=====================================\n');

        results.outputs.push({
          testCase: i + 1,
          passed: false,
          error: errorMessage,
          stderr: result.stderr,
          stdout: result.stdout,
          executionTime: executionTime
        });
      }
    }

    // Calculate averages
    if (testCases.length > 0) {
      results.executionTime = Math.round(results.executionTime / testCases.length);
      results.memoryUsed = Math.round(results.memoryUsed / testCases.length);
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
 * Analyze time and space complexity (simplified heuristic)
 * @param {string} code - User's code
 * @returns {object} Complexity analysis
 */
export const analyzeComplexity = (code) => {
  const analysis = {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  };

  // Simple heuristic analysis
  const nestedLoops = (code.match(/for\s*\(/g) || []).length;
  const recursiveCalls = (code.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]*\1/g) || []).length;
  const arrayCreations = (code.match(/new Array|\.map\(|\.filter\(|\.reduce\(/g) || []).length;

  // Time complexity estimation
  if (nestedLoops >= 3) {
    analysis.timeComplexity = 'O(n³)';
  } else if (nestedLoops === 2) {
    analysis.timeComplexity = 'O(n²)';
  } else if (recursiveCalls > 0) {
    analysis.timeComplexity = 'O(2ⁿ)';
  } else if (code.includes('.sort(')) {
    analysis.timeComplexity = 'O(n log n)';
  }

  // Space complexity estimation
  if (arrayCreations > 2) {
    analysis.spaceComplexity = 'O(n)';
  } else if (recursiveCalls > 0) {
    analysis.spaceComplexity = 'O(n)';
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

