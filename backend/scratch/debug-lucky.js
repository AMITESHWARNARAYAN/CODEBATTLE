import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import { resolveTestCases } from '../utils/testCaseFetcher.js';
import { executeCode } from '../utils/codeExecutor.js';

const cppCode = `
class Solution {
public:
    string findTheKThLuckyNumber(int k) {
        string ans = "";
        k++;
        while(k > 1) {
            if(k % 2 == 0) ans = '4' + ans;
            else ans = '7' + ans;
            k /= 2;
        }
        return ans;
    }
};
`;

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const problem = await Problem.findOne({ title: /Lucky/i });
    if (!problem) {
      console.error('❌ Problem not found!');
      process.exit(1);
    }

    console.log('Problem found:', problem.title);
    
    // Manually correct the metadata for testing
    problem.metaData = {
      name: 'findTheKThLuckyNumber',
      params: [{ name: 'k', type: 'integer' }],
      return: { type: 'string' }
    };
    await problem.save();
    console.log('✅ Updated problem metadata for testing');
    console.log('Problem metaData:', JSON.stringify(problem.metaData, null, 2));

    const problemData = problem.toObject();
    await resolveTestCases(problemData);
    console.log(`Fetched ${problemData.testCases.length} test cases.`);

    // Run first 5 test cases for debugging
    const testCasesToRun = problemData.testCases.slice(0, 5);
    console.log('Running test cases with executeCode...');
    console.log('USE_DOCKER =', process.env.USE_DOCKER);

    const result = await executeCode(cppCode, testCasesToRun, 'cpp', 2, problemData.metaData);
    console.log('\n--- EXECUTION RESULT ---');
    console.log('Status:', result.status);
    console.log('Passed:', result.testCasesPassed, '/', result.totalTestCases);
    console.log('Errors:', result.errors);
    console.log('Outputs sample:');
    result.outputs.forEach((o, i) => {
      console.log(`\nTest Case ${i+1}:`);
      console.log(`Input:`, o.input);
      console.log(`Expected:`, o.expectedOutput);
      console.log(`Actual:`, o.actualOutput);
      console.log(`Passed:`, o.passed);
      if (o.error) console.log(`Error:`, o.error);
    });

  } catch (err) {
    console.error('Error running debug:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

debug();
