import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Problem from './models/Problem.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const CATEGORIES_SPEC = [
  { name: 'Arrays & Hashing', description: 'Problems related to arrays, hash tables, hash sets, and basic counting.', icon: '📦', color: 'blue' },
  { name: 'Two Pointers', description: 'Techniques involving traversing iterable data structures using two pointers.', icon: '👉', color: 'green' },
  { name: 'Sliding Window', description: 'Optimizing subarray/substring scans using a moving window.', icon: '🪟', color: 'cyan' },
  { name: 'Stack', description: 'LIFO structures, monotonic stacks, and parentheses matching problems.', icon: '🥞', color: 'yellow' },
  { name: 'Binary Search', description: 'Efficient logarithmic search algorithms on sorted spaces.', icon: '🔍', color: 'purple' },
  { name: 'Linked List', description: 'Singly and doubly linked lists, pointer manipulation, and cycles.', icon: '🔗', color: 'pink' },
  { name: 'Trees', description: 'Binary trees, binary search trees, traversals, and recursive properties.', icon: '🌳', color: 'orange' },
  { name: 'Graphs', description: 'DFS, BFS, matrix traversals, union-find, and topological sorting.', icon: '🗺️', color: 'indigo' },
  { name: 'Dynamic Programming', description: 'Memoization, tabulation, state transitions, and optimization problems.', icon: '📈', color: 'rose' },
  { name: 'Bit Manipulation', description: 'Low-level bitwise operations, masking, and XOR properties.', icon: '🔢', color: 'amber' },
  { name: 'Math & Geometry', description: 'Arithmetic formulas, prime numbers, geometry, and number theory.', icon: '📐', color: 'teal' },
  { name: 'Strings', description: 'String processing, matching, manipulations, and parsing.', icon: '📝', color: 'violet' }
];

// Slugs mapping definitions
const TWO_POINTERS_SLUGS = [
  'valid-palindrome', 'valid-palindrome-ii', 'merge-strings-alternately', 'backspace-string-compare',
  'container-with-most-water', 'sort-colors', 'move-element-to-end', 'backspace-string-compare-two-pointers',
  'sort-array-by-parity', 'squares-of-a-sorted-array'
];

const SLIDING_WINDOW_SLUGS = [
  'length-of-longest-substring', 'permutation-in-string'
];

const STACK_SLUGS = [
  'baseball-game', 'crawler-log-folder', 'make-the-string-great', 'remove-outermost-parentheses',
  'reverse-substrings-between-each-pair-of-parentheses', 'validate-stack-sequences', 'valid-parentheses-depth'
];

const BINARY_SEARCH_SLUGS = [
  'binary-search', 'search-insert-position', 'first-bad-version', 'guess-number-higher-or-lower',
  'search-in-rotated-sorted-array', 'peak-index-in-a-mountain-array', 'valid-perfect-square'
];

const BIT_MANIPULATION_SLUGS = [
  'number-of-1-bits', 'hamming-distance', 'complement-of-base-10-integer', 'power-of-two',
  'power-of-three', 'power-of-four', 'single-number'
];

const DYNAMIC_PROGRAMMING_SLUGS = [
  'climbing-stairs', 'min-cost-climbing-stairs', 'maximum-subarray', 'divisor-game',
  'tribonacci-number', 'pascals-triangle', 'pascals-triangle-ii', 'longest-increasing-subsequence',
  'unique-paths', 'coin-change', 'house-robber', 'longest-common-subsequence'
];

const STRINGS_SLUGS = [
  'reverse-string', 'reverse-vowels-of-a-string', 'first-unique-character-in-a-string', 'detect-capital',
  'longest-common-prefix', 'length-of-last-word', 'ransom-note', 'is-subsequence', 'reverse-words-in-a-string-iii',
  'robot-return-to-origin', 'goat-latin', 'unique-morse-code-words', 'reverse-string-ii', 'isomorphic-strings',
  'remove-all-adjacent-duplicates-in-string', 'decrypt-string-from-alphabet-to-integer-mapping',
  'check-if-two-string-arrays-are-equivalent', 'defanging-an-ip-address', 'jewels-and-stones', 'replace-spaces'
];

const MATH_SLUGS = [
  'palindrome-number', 'fibonacci-number', 'fizz-buzz', 'add-digits', 'ugly-number',
  'happy-number', 'excel-sheet-column-number', 'base-7', 'self-dividing-numbers', 'nim-game',
  'day-of-the-year', 'perfect-number', 'subtract-the-product-and-sum-of-digits-of-an-integer',
  'minimum-time-visiting-all-points', 'sqrtx', 'final-value-of-variable-after-performing-operations'
];

const getCategoryNameForProblem = (problem) => {
  const slug = problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (TWO_POINTERS_SLUGS.includes(slug)) return 'Two Pointers';
  if (SLIDING_WINDOW_SLUGS.includes(slug)) return 'Sliding Window';
  if (STACK_SLUGS.includes(slug)) return 'Stack';
  if (BINARY_SEARCH_SLUGS.includes(slug)) return 'Binary Search';
  if (BIT_MANIPULATION_SLUGS.includes(slug)) return 'Bit Manipulation';
  if (DYNAMIC_PROGRAMMING_SLUGS.includes(slug)) return 'Dynamic Programming';
  if (STRINGS_SLUGS.includes(slug)) return 'Strings';
  if (MATH_SLUGS.includes(slug)) return 'Math & Geometry';

  // Fallback to tags analysis
  const tags = (problem.tags || []).map(t => t.toLowerCase());
  if (tags.some(t => t.includes('tree'))) return 'Trees';
  if (tags.some(t => t.includes('graph'))) return 'Graphs';
  if (tags.some(t => t.includes('list') || t.includes('link'))) return 'Linked List';

  return 'Arrays & Hashing';
};

const seedCategoriesAndLink = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing categories...');
    await Category.deleteMany({});

    console.log('🌱 Inserting 12 core LeetCode categories...');
    const createdCategories = await Category.insertMany(CATEGORIES_SPEC);
    console.log(`✅ Created ${createdCategories.length} categories.`);

    const problems = await Problem.find({});
    console.log(`🔍 Linking ${problems.length} problems to correct categories...`);

    const categoryMap = {};
    for (const cat of createdCategories) {
      categoryMap[cat.name] = {
        doc: cat,
        problems: [],
        easy: 0,
        medium: 0,
        hard: 0
      };
    }

    for (const problem of problems) {
      const catName = getCategoryNameForProblem(problem);
      const catInfo = categoryMap[catName];

      problem.category = catInfo.doc._id;
      
      // Map category name to clean tags to prevent duplicate tags
      let tagsToPush = [];
      if (catName === 'Arrays & Hashing') {
        tagsToPush = ['Array', 'Hash Table'];
      } else if (catName === 'Strings') {
        tagsToPush = ['String'];
      } else if (catName === 'Stack') {
        tagsToPush = ['Stack'];
      } else if (catName === 'Dynamic Programming') {
        tagsToPush = ['Dynamic Programming'];
      } else if (catName === 'Math & Geometry') {
        tagsToPush = ['Math', 'Geometry'];
      } else {
        tagsToPush = [catName];
      }

      for (const t of tagsToPush) {
        if (!problem.tags.includes(t)) {
          problem.tags.push(t);
        }
      }
      await problem.save();

      catInfo.problems.push(problem._id);
      if (problem.difficulty === 'Easy') catInfo.easy++;
      else if (problem.difficulty === 'Medium') catInfo.medium++;
      else if (problem.difficulty === 'Hard') catInfo.hard++;
    }

    // Save updated categories
    for (const name of Object.keys(categoryMap)) {
      const catInfo = categoryMap[name];
      catInfo.doc.problems = catInfo.problems;
      catInfo.doc.problemCount = catInfo.problems.length;
      catInfo.doc.difficulty = {
        easy: catInfo.easy,
        medium: catInfo.medium,
        hard: catInfo.hard
      };
      await catInfo.doc.save();
      console.log(`✨ Category "${name}" updated: ${catInfo.problems.length} problems (E:${catInfo.easy}, M:${catInfo.medium}, H:${catInfo.hard})`);
    }

    console.log('\n🎉 Successfully seeded and linked all categories!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding and linking failed:', error);
    process.exit(1);
  }
};

seedCategoriesAndLink();
