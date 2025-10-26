import { VM } from 'vm2';

/**
 * Execute JavaScript code with test cases
 * @param {string} code - User's code
 * @param {array} testCases - Array of test cases
 * @param {number} timeLimit - Time limit in milliseconds
 * @returns {object} Execution result
 */
export const executeCode = async (code, testCases, timeLimit = 2000) => {
  const results = {
    status: 'Accepted',
    testCasesPassed: 0,
    totalTestCases: testCases.length,
    executionTime: 0,
    memoryUsed: 0,
    errors: [],
    outputs: []
  };

  const startTime = Date.now();

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      const vm = new VM({
        timeout: timeLimit,
        sandbox: {}
      });

      // Parse input and expected output
      const input = JSON.parse(testCase.input);
      const expectedOutput = JSON.parse(testCase.expectedOutput);

      // Create a wrapper to execute the code
      const wrappedCode = `
        ${code}
        
        // Call the main function with test input
        const result = solve(${JSON.stringify(input)});
        result;
      `;

      const testStartTime = Date.now();
      const output = vm.run(wrappedCode);
      const testExecutionTime = Date.now() - testStartTime;

      results.executionTime += testExecutionTime;

      // Compare output
      if (JSON.stringify(output) === JSON.stringify(expectedOutput)) {
        results.testCasesPassed++;
        results.outputs.push({
          testCase: i + 1,
          passed: true,
          input: input,
          expectedOutput: expectedOutput,
          actualOutput: output,
          executionTime: testExecutionTime
        });
      } else {
        results.status = 'Wrong Answer';
        results.outputs.push({
          testCase: i + 1,
          passed: false,
          input: input,
          expectedOutput: expectedOutput,
          actualOutput: output,
          executionTime: testExecutionTime
        });
      }

    } catch (error) {
      const testExecutionTime = Date.now() - startTime;
      
      if (error.message.includes('Script execution timed out')) {
        results.status = 'Time Limit Exceeded';
        results.errors.push(`Test case ${i + 1}: Time Limit Exceeded`);
      } else {
        results.status = 'Runtime Error';
        results.errors.push(`Test case ${i + 1}: ${error.message}`);
      }

      results.outputs.push({
        testCase: i + 1,
        passed: false,
        error: error.message,
        executionTime: testExecutionTime
      });
      
      break; // Stop on first error
    }
  }

  // Calculate average execution time
  results.executionTime = Math.round(results.executionTime / testCases.length);
  
  // Estimate memory usage (simplified)
  results.memoryUsed = Math.round(Math.random() * 50 + 10); // Mock value between 10-60 MB

  return results;
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

