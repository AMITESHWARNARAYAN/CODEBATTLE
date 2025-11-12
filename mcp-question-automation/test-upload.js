import dotenv from 'dotenv';
import { generateTestCases } from './services/aiService.js';
import { uploadProblem } from './services/backendService.js';

dotenv.config();

console.log('🧪 Testing MCP Question Upload System\n');

// Sample question for testing
const testQuestion = {
  title: 'Test Question - ' + new Date().toISOString(),
  description: `This is a test question to verify the MCP automation system.

Given an array of integers, return the sum of all elements.

Example:
Input: [1, 2, 3, 4, 5]
Output: 15

This question was automatically uploaded by the MCP server.`,
  difficulty: 'Easy',
  tags: ['Array', 'Math'],
  constraints: '1 <= arr.length <= 1000\n-1000 <= arr[i] <= 1000',
  examples: [
    {
      input: '[1, 2, 3, 4, 5]',
      output: '15',
      explanation: 'Sum of all elements: 1 + 2 + 3 + 4 + 5 = 15'
    },
    {
      input: '[-1, 0, 1]',
      output: '0',
      explanation: 'Sum: -1 + 0 + 1 = 0'
    }
  ],
  functionSignature: {
    javascript: 'function arraySum(arr) {\n    // Your code here\n}',
    python: 'def array_sum(arr: List[int]) -> int:\n    # Your code here\n    pass',
    java: 'class Solution {\n    public int arraySum(int[] arr) {\n        // Your code here\n    }\n}',
    cpp: 'class Solution {\npublic:\n    int arraySum(vector<int>& arr) {\n        // Your code here\n    }\n};'
  },
  timeLimit: 2000,
  memoryLimit: 256
};

async function test() {
  try {
    // Step 1: Generate test cases
    console.log('🤖 Step 1: Generating test cases with AI...');
    const testCases = await generateTestCases(testQuestion);
    
    if (!testCases || testCases.length === 0) {
      console.log('❌ Failed to generate test cases');
      return;
    }
    
    console.log(`✅ Generated ${testCases.length} test cases:`);
    testCases.forEach((tc, i) => {
      console.log(`   ${i + 1}. Input: ${tc.input.substring(0, 50)}${tc.input.length > 50 ? '...' : ''}`);
      console.log(`      Output: ${tc.expectedOutput.substring(0, 50)}${tc.expectedOutput.length > 50 ? '...' : ''}`);
      console.log(`      Hidden: ${tc.isHidden}`);
    });
    
    // Step 2: Upload to backend
    console.log('\n📤 Step 2: Uploading to backend...');
    testQuestion.testCases = testCases;
    
    const result = await uploadProblem(testQuestion);
    
    if (result.success) {
      console.log('✅ Upload successful!');
      console.log(`   Problem ID: ${result.problem._id}`);
      console.log(`   Title: ${result.problem.title}`);
      console.log(`   Difficulty: ${result.problem.difficulty}`);
      console.log(`   Test Cases: ${result.problem.testCases.length}`);
      console.log(`   Created: ${new Date(result.problem.createdAt).toLocaleString()}`);
      console.log('\n🎉 Test completed successfully!');
      console.log('Check your admin panel to see the uploaded question.');
    } else {
      console.log('❌ Upload failed:', result.error);
      if (result.details) {
        console.log('Details:', result.details);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

test();

