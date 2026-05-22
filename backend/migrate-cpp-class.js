/**
 * Migration Script: Wrap existing C++ function signatures in `class Solution { public: ... };`
 * 
 * Run: node migrate-cpp-class.js
 * 
 * This converts bare function signatures like:
 *   bool isHappy(int n) {\n    \n}
 * Into LeetCode-style class signatures:
 *   class Solution {\npublic:\n    bool isHappy(int n) {\n        \n    }\n};
 * 
 * Problems that already have `class Solution` are skipped.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';

async function migrate() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected.\n');

  const problems = await Problem.find({ 'functionSignature.cpp': { $exists: true, $ne: '' } });
  console.log(`Found ${problems.length} problems with C++ signatures.\n`);

  let updated = 0, skipped = 0;

  for (const problem of problems) {
    const cpp = problem.functionSignature.cpp;

    // Already has class Solution — skip
    if (cpp.includes('class Solution')) {
      skipped++;
      continue;
    }

    // Extract the function signature (the entire bare function)
    // Pattern: "returnType functionName(params) {\n    \n}"
    // We need to wrap it inside class Solution { public: ... };
    
    // Re-indent: bare function has 4-space body indent → class method needs 8-space
    const reindented = cpp
      .split('\n')
      .map((line, i) => {
        if (i === 0) return `    ${line}`; // function declaration line
        return `    ${line}`; // body lines get extra 4 spaces
      })
      .join('\n');

    const wrapped = `class Solution {\npublic:\n${reindented}\n};`;

    problem.functionSignature.cpp = wrapped;
    await problem.save();
    updated++;

    console.log(`  ✅ ${problem.title}`);
  }

  console.log(`\n🎉 Migration complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (already had class): ${skipped}`);
  console.log(`   Total: ${problems.length}`);

  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB.');
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
