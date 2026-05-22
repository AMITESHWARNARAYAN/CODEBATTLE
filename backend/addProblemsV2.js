import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import Category from './models/Category.js';

// ─── UTILITIES ───
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Helper to infer generic types for parameters
function inferGenericType(cppType, javaType) {
  if (!cppType) return 'integer';
  const clean = cppType.replace(/const\s+/, '').replace(/[&*]/g, '').trim();
  
  if (clean === 'int' || clean === 'long' || clean === 'long long') return 'integer';
  if (clean === 'vector<int>') return 'integer[]';
  if (clean === 'vector<vector<int>>') return 'integer[][]';
  if (clean === 'string' || clean === 'char') return 'string';
  if (clean === 'vector<string>' || clean === 'vector<char>') return 'string[]';
  if (clean === 'vector<vector<string>>') return 'string[][]';
  if (clean === 'bool') return 'boolean';
  if (clean === 'ListNode') return 'list';
  if (clean === 'TreeNode') return 'tree';
  if (clean === 'void') return 'void';
  
  // Fallback to javaType
  if (javaType) {
    const cleanJava = javaType.trim();
    if (cleanJava === 'int' || cleanJava === 'long') return 'integer';
    if (cleanJava === 'int[]') return 'integer[]';
    if (cleanJava === 'int[][]') return 'integer[][]';
    if (cleanJava === 'String' || cleanJava === 'char') return 'string';
    if (cleanJava === 'String[]' || cleanJava === 'char[]') return 'string[]';
    if (cleanJava === 'String[][]') return 'string[][]';
    if (cleanJava === 'boolean') return 'boolean';
    if (cleanJava === 'ListNode') return 'list';
    if (cleanJava === 'TreeNode') return 'tree';
  }
  
  return 'integer';
}

// Helper to infer generic return type
function inferGenericReturnType(cppType, javaType) {
  if (!cppType) return 'integer';
  const clean = cppType.replace(/const\s+/, '').replace(/[&*]/g, '').trim();
  
  if (clean === 'int' || clean === 'long' || clean === 'long long') return 'integer';
  if (clean === 'vector<int>') return 'integer[]';
  if (clean === 'vector<vector<int>>') return 'integer[][]';
  if (clean === 'string' || clean === 'char') return 'string';
  if (clean === 'vector<string>' || clean === 'vector<char>') return 'string[]';
  if (clean === 'vector<vector<string>>') return 'string[][]';
  if (clean === 'bool') return 'boolean';
  if (clean === 'ListNode') return 'list';
  if (clean === 'TreeNode') return 'tree';
  if (clean === 'void') return 'void';
  
  // Fallback to javaType
  if (javaType) {
    const cleanJava = javaType.trim();
    if (cleanJava === 'int' || cleanJava === 'long') return 'integer';
    if (cleanJava === 'int[]') return 'integer[]';
    if (cleanJava === 'int[][]') return 'integer[][]';
    if (cleanJava === 'String' || cleanJava === 'char') return 'string';
    if (cleanJava === 'String[]' || cleanJava === 'char[]') return 'string[]';
    if (cleanJava === 'String[][]') return 'string[][]';
    if (cleanJava === 'boolean') return 'boolean';
    if (cleanJava === 'ListNode') return 'list';
    if (cleanJava === 'TreeNode') return 'tree';
    if (cleanJava.startsWith('List<List<Integer>>') || cleanJava.startsWith('List<List<String>>')) return 'integer[][]'; // List of Lists
    if (cleanJava.startsWith('List<Integer>') || cleanJava.startsWith('List<String>')) return 'integer[]';
  }
  
  return 'integer';
}

function makeSigs(slug, args, ret) {
  const fn = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const cpp = `class Solution {\npublic:\n    ${ret.cpp} ${fn}(${args.map(a => `${a.cpp} ${a.name}`).join(', ')}) {\n        \n    }\n};`;
  const java = `class Solution {\n    public ${ret.java} ${fn}(${args.map(a => `${a.java} ${a.name}`).join(', ')}) {\n        \n    }\n}`;
  const python = `class Solution:\n    def ${fn}(self, ${args.map(a => a.py).join(', ')}) -> ${ret.py}:\n        `;
  const javascript = `var ${fn} = function(${args.map(a => a.js).join(', ')}) {\n    \n};`;
  return { cpp, java, python, javascript };
}

// ─── BATCH REGISTRY ───
// Each batch file exports an array of problem definitions
// This main script loads them and runs the pipeline

const GITHUB_BASE = 'https://raw.githubusercontent.com/AMITESHWARNARAYAN/codebattle-testcases/main/problems';

async function loadBatch(batchFile) {
  const mod = await import(batchFile);
  return mod.default || mod.problems;
}

async function run() {
  const batchFiles = process.argv.slice(2);
  if (batchFiles.length === 0) {
    console.log('Usage: node addProblemsV2.js <batch1.js> [batch2.js] ...');
    console.log('Example: node addProblemsV2.js ./batches/arrays-hashing.js');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), '..', 'codebattle-testcases');
  console.log(`\n=== 🚀 PROBLEM PIPELINE V2 ===`);
  console.log(`Target dir: ${targetDir}\n`);

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  // Load all categories
  const categories = await Category.find({}).lean();
  const catMap = {};
  for (const c of categories) catMap[c.name] = c._id;
  console.log(`📂 Loaded ${categories.length} categories\n`);

  // Get existing slugs to avoid duplicates
  const existing = await Problem.find({}, { title: 1 }).lean();
  const existingTitles = new Set(existing.map(p => p.title));
  console.log(`📊 ${existingTitles.size} existing problems in DB\n`);

  let totalAdded = 0;
  let totalSkipped = 0;

  for (const batchFile of batchFiles) {
    console.log(`\n─── Loading batch: ${batchFile} ───`);
    const problems = await loadBatch(batchFile);
    console.log(`  ${problems.length} problems in batch`);

    const toInsert = [];

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];

      if (existingTitles.has(p.title)) {
        console.log(`  ⏭ Skipping "${p.title}" (already exists)`);
        totalSkipped++;
        continue;
      }

      // Generate test cases using the JS solution
      const rawInputs = p.inputGenerator();
      const testCases = [];

      for (let t = 0; t < rawInputs.length; t++) {
        const inputArgs = rawInputs[t];
        let output;
        try {
          output = p.jsSolution(...inputArgs);
        } catch (e) {
          console.error(`  ❌ Solution error for "${p.title}" test ${t}:`, e.message);
          continue;
        }
        testCases.push({
          input: JSON.stringify(inputArgs),
          expectedOutput: JSON.stringify(output),
          isHidden: t >= 5
        });
      }

      // Write test cases to disk
      const dirPath = path.join(targetDir, 'problems', p.slug);
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(path.join(dirPath, 'testcases.json'), JSON.stringify(testCases, null, 2), 'utf8');

      // Build function signatures
      const sigs = makeSigs(p.slug, p.args, p.retType);

      // Determine category ObjectId
      const catId = catMap[p.category];
      if (!catId) {
        console.error(`  ❌ Category "${p.category}" not found! Skipping "${p.title}"`);
        totalSkipped++;
        continue;
      }

      // Build metadata
      const camelName = p.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const params = (p.args || []).map(arg => ({
        name: arg.name,
        type: inferGenericType(arg.cpp, arg.java)
      }));

      let cppRet = '';
      let javaRet = '';
      if (p.retType) {
        if (typeof p.retType === 'string') {
          cppRet = p.retType;
        } else {
          cppRet = p.retType.cpp || '';
          javaRet = p.retType.java || '';
        }
      }
      const returnType = inferGenericReturnType(cppRet, javaRet);

      const metaData = {
        name: camelName,
        params,
        return: { type: returnType }
      };

      toInsert.push({
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        tags: p.tags,
        constraints: p.constraints || 'None',
        examples: p.examples,
        useGitHubTestCases: true,
        testCasesUrl: `${GITHUB_BASE}/${p.slug}/testcases.json`,
        testCases: [],
        metaData,
        functionSignature: sigs,
        hints: p.hints || [{ title: 'Think Step by Step', content: 'Break the problem into smaller subproblems.' }],
        timeLimit: p.timeLimit || 2000,
        memoryLimit: 256,
        category: catId
      });

      existingTitles.add(p.title);

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Processed ${i + 1}/${problems.length}`);
      }
    }

    if (toInsert.length > 0) {
      const created = await Problem.insertMany(toInsert);
      console.log(`  🚀 Inserted ${created.length} problems from this batch`);

      // Update category counts
      const catCounts = {};
      for (const p of toInsert) {
        const catIdStr = p.category.toString();
        if (!catCounts[catIdStr]) catCounts[catIdStr] = { easy: 0, medium: 0, hard: 0, ids: [] };
        catCounts[catIdStr].ids.push(created.find(c => c.title === p.title)?._id);
        if (p.difficulty === 'Easy') catCounts[catIdStr].easy++;
        else if (p.difficulty === 'Medium') catCounts[catIdStr].medium++;
        else catCounts[catIdStr].hard++;
      }

      for (const [catId, data] of Object.entries(catCounts)) {
        await Category.findByIdAndUpdate(catId, {
          $push: { problems: { $each: data.ids.filter(Boolean) } },
          $inc: {
            problemCount: data.ids.length,
            'difficulty.easy': data.easy,
            'difficulty.medium': data.medium,
            'difficulty.hard': data.hard
          }
        });
      }

      totalAdded += toInsert.length;
    }
  }

  console.log(`\n=== ✅ PIPELINE COMPLETE ===`);
  console.log(`Added: ${totalAdded} | Skipped: ${totalSkipped}`);
  console.log(`Total in DB: ${existingTitles.size}`);

  await mongoose.disconnect();
}

run().catch(err => { console.error('Pipeline crashed:', err); process.exit(1); });
