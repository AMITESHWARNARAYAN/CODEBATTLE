import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import Category from './models/Category.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Signature generator helper
function makeSignatures(slug, args, retType) {
  const camelName = slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  const cppArgs = args.map(a => `${a.cpp} ${a.name}`).join(', ');
  const cpp = `class Solution {\npublic:\n    ${retType.cpp} ${camelName}(${cppArgs}) {\n        \n    }\n};`;
  
  const javaArgs = args.map(a => `${a.java} ${a.name}`).join(', ');
  const java = `class Solution {\n    public ${retType.java} ${camelName}(${javaArgs}) {\n        \n    }\n}`;
  
  const pyArgs = args.map(a => a.py).join(', ');
  const python = `class Solution:\n    def ${camelName}(self, ${pyArgs}) -> ${retType.py}:\n        `;
  
  const jsArgs = args.map(a => a.js).join(', ');
  const javascript = `var ${camelName} = function(${jsArgs}) {\n    \n};`;
  
  return { cpp, java, python, javascript };
}

// Category matching helper
const getCategoryNameForProblem = (title, tags) => {
  const tList = (tags || []).map(t => t.toLowerCase());
  const tLower = title.toLowerCase();

  const TWO_POINTERS_SLUGS = ['two-sum-ii', 'valid-palindrome', 'valid-palindrome-ii', 'container-with-most-water', 'sort-colors', 'move-element-to-end'];
  const SLIDING_WINDOW_SLUGS = ['length-of-longest-substring', 'permutation-in-string'];
  const STACK_SLUGS = ['baseball-game', 'crawler-log-folder', 'make-the-string-great', 'remove-outermost-parentheses', 'validate-stack-sequences'];
  const BINARY_SEARCH_SLUGS = ['binary-search', 'search-insert-position', 'first-bad-version', 'guess-number-higher-or-lower', 'search-in-rotated-sorted-array'];
  const BIT_MANIPULATION_SLUGS = ['number-of-1-bits', 'hamming-distance', 'power-of-two'];
  const DYNAMIC_PROGRAMMING_SLUGS = ['climbing-stairs', 'min-cost-climbing-stairs', 'maximum-subarray', 'house-robber'];
  const STRINGS_SLUGS = ['reverse-string', 'ransom-note', 'is-subsequence', 'isomorphic-strings'];

  const slug = tLower.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (TWO_POINTERS_SLUGS.includes(slug)) return 'Two Pointers';
  if (SLIDING_WINDOW_SLUGS.includes(slug)) return 'Sliding Window';
  if (STACK_SLUGS.includes(slug)) return 'Stack';
  if (BINARY_SEARCH_SLUGS.includes(slug)) return 'Binary Search';
  if (BIT_MANIPULATION_SLUGS.includes(slug)) return 'Bit Manipulation';
  if (DYNAMIC_PROGRAMMING_SLUGS.includes(slug)) return 'Dynamic Programming';
  if (STRINGS_SLUGS.includes(slug)) return 'Strings';

  if (tList.some(t => t.includes('tree'))) return 'Trees';
  if (tList.some(t => t.includes('graph'))) return 'Graphs';
  if (tList.some(t => t.includes('list') || t.includes('link'))) return 'Linked List';

  return 'Arrays & Hashing';
};

const run = async () => {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error('❌ Please specify a JSON problem spec file. Example: node addProblem.js new-problem.json');
    process.exit(1);
  }

  try {
    const rawData = await fs.readFile(specPath, 'utf8');
    const spec = JSON.parse(rawData);

    // Validate essential fields
    const required = ['title', 'difficulty', 'description', 'args', 'retType', 'jsSolution', 'inputGenerator'];
    for (const field of required) {
      if (spec[field] === undefined) {
        throw new Error(`Missing required field: "${field}"`);
      }
    }

    const slug = spec.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const signatures = makeSignatures(slug, spec.args, spec.retType);

    // Compile references and generators
    const refFn = new Function(`return (${spec.jsSolution})`)();
    const generatorFn = new Function(`return (${spec.inputGenerator})`)();

    console.log(`🚀 Starting premium testcase generation for "${spec.title}"...`);

    const testCases = [];

    // 1. Generate edge cases (if explicitly provided in spec)
    if (Array.isArray(spec.edgeInputs)) {
      spec.edgeInputs.forEach((inp, idx) => {
        const expected = refFn(...inp);
        testCases.push({
          input: JSON.stringify(inp),
          expectedOutput: typeof expected === 'object' ? JSON.stringify(expected) : String(expected),
          isHidden: false
        });
      });
      console.log(`✓ Generated ${spec.edgeInputs.length} edge test cases.`);
    }

    // 2. Generate remaining randomized boundary cases
    const totalToGen = 50 - testCases.length;
    for (let i = 0; i < totalToGen; i++) {
      const inp = generatorFn();
      const expected = refFn(...inp);
      testCases.push({
        input: JSON.stringify(inp),
        expectedOutput: typeof expected === 'object' ? JSON.stringify(expected) : String(expected),
        isHidden: i >= 5 // Keep first 5 public, remainder hidden
      });
    }
    console.log(`✓ Generated ${testCases.length} total test cases.`);

    // 3. Write testcases.json file to local git repository
    const repoPath = 'C:\\Users\\amitu\\OneDrive\\Desktop\\Codebattle\\codebattle-testcases';
    const probDir = path.join(repoPath, 'problems', slug);
    await fs.mkdir(probDir, { recursive: true });
    await fs.writeFile(path.join(probDir, 'testcases.json'), JSON.stringify(testCases, null, 2), 'utf8');
    console.log(`✓ Wrote testcases.json to ${probDir}`);

    // 4. Save to MongoDB Atlas
    await connectDB();

    // Match or create category
    const catName = getCategoryNameForProblem(spec.title, spec.tags);
    let category = await Category.findOne({ name: catName });
    if (!category) {
      category = await Category.create({
        name: catName,
        description: `Problems related to ${catName}`,
        icon: '📚',
        color: 'indigo'
      });
    }

    // Delete existing problem if exists to prevent duplicates
    await Problem.deleteMany({ title: spec.title });

    const problemDoc = await Problem.create({
      title: spec.title,
      description: spec.description,
      difficulty: spec.difficulty,
      tags: Array.from(new Set([...(spec.tags || []), catName])),
      companyTags: spec.companyTags || [],
      lists: spec.lists || [],
      constraints: spec.constraints || '',
      examples: spec.examples || [],
      testCases: testCases.slice(0, 5), // Seed first few into MongoDB
      useGitHubTestCases: true,
      testCasesUrl: `https://raw.githubusercontent.com/AMITESHWARNARAYAN/codebattle-testcases/main/problems/${slug}/testcases.json`,
      hints: spec.hints || [],
      functionSignature: signatures,
      category: category._id
    });

    console.log(`✅ Successfully seeded "${spec.title}" into MongoDB Atlas!`);
    console.log(`🔗 Testcase URL: ${problemDoc.testCasesUrl}`);

    // Add problem to Category doc and update stats
    if (!category.problems.includes(problemDoc._id)) {
      category.problems.push(problemDoc._id);
      category.problemCount = category.problems.length;
      if (spec.difficulty === 'Easy') category.difficulty.easy++;
      else if (spec.difficulty === 'Medium') category.difficulty.medium++;
      else if (spec.difficulty === 'Hard') category.difficulty.hard++;
      await category.save();
    }

    console.log('🎉 Extensibility run finished successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to add problem:', error);
    process.exit(1);
  }
};

run();
