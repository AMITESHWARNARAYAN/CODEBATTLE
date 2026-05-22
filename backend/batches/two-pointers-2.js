// Two Pointers — Batch 2 (25 more problems, #26–50)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 26
{
  slug: 'minimum-difference-pair',
  title: 'Minimum Difference Between Pair',
  description: 'Given an array of distinct integers, find the pair with the smallest absolute difference and return that difference.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '2 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,5,3,19,18,25]', output: '1', explanation: '19 and 18 have diff 1.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort First', content: 'Sort and check adjacent differences.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    let minD = Infinity;
    for (let i = 1; i < nums.length; i++) minD = Math.min(minD, nums[i] - nums[i - 1]);
    return minD;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 5, 3, 19, 18, 25]]); cases.push([[1, 2]]); cases.push([[-1000000000, 1000000000]]);
    for (let i = 0; i < 47; i++) {
      const s = new Set(); const n = randInt(2, 50);
      while (s.size < n) s.add(randInt(-1000, 1000));
      cases.push([[...s]]);
    }
    for (let i = 0; i < 50; i++) {
      const s = new Set(); const n = randInt(50, 500);
      while (s.size < n) s.add(randInt(-100000, 100000));
      cases.push([[...s]]);
    }
    for (let i = 0; i < 50; i++) {
      const s = new Set(); const n = randInt(500, 5000);
      while (s.size < n) s.add(randInt(-1000000000, 1000000000));
      cases.push([[...s]]);
    }
    return cases;
  }
},

// 27
{
  slug: 'number-of-subsequences-target',
  title: 'Number of Subsequences That Satisfy Condition',
  description: 'Given an array nums and a target, return the number of non-empty subsequences where the sum of the min and max element is <= target. Return the count modulo 10^9 + 7.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting', 'Binary Search'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^6, 1 <= target <= 10^6',
  examples: [{ input: '[3,5,6,7], 9', output: '4', explanation: 'Valid subsequences: [3], [3,5], [3,5,6], [3,6].' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Two Pointers', content: 'Sort. For each left, find rightmost element where nums[l]+nums[r] <= target.' }],
  jsSolution: (nums, target) => {
    const MOD = 1e9 + 7;
    nums.sort((a, b) => a - b);
    const n = nums.length;
    const pow2 = [1];
    for (let i = 1; i < n; i++) pow2[i] = (pow2[i - 1] * 2) % MOD;
    let l = 0, r = n - 1, count = 0;
    while (l <= r) {
      if (nums[l] + nums[r] <= target) { count = (count + pow2[r - l]) % MOD; l++; }
      else r--;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 6, 7], 9]); cases.push([[3, 3, 6, 8], 10]); cases.push([[2, 3, 3, 4, 6, 7], 12]);
    cases.push([[1], 1]); cases.push([[1], 2]); cases.push([[5, 2, 4, 1, 7, 6, 8], 16]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 1, 100), randInt(2, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 10000), randInt(2, 20000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 1, 1000000), randInt(2, 1000000)]);
    return cases;
  }
},

// 28
{
  slug: 'squares-sorted-array-tp',
  title: 'Squares of a Sorted Array (Two Pointers)',
  description: 'Given an integer array sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 10^4, -10^4 <= nums[i] <= 10^4, nums is sorted',
  examples: [{ input: '[-4,-1,0,3,10]', output: '[0,1,9,16,100]', explanation: 'Squares sorted.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Pointers from Ends', content: 'Compare absolute values from both ends, fill result from the back.' }],
  jsSolution: (nums) => {
    const n = nums.length, res = Array(n);
    let l = 0, r = n - 1, pos = n - 1;
    while (l <= r) {
      if (Math.abs(nums[l]) > Math.abs(nums[r])) { res[pos--] = nums[l] * nums[l]; l++; }
      else { res[pos--] = nums[r] * nums[r]; r--; }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-4, -1, 0, 3, 10]]); cases.push([[-7, -3, 2, 3, 11]]); cases.push([[0]]); cases.push([[-5, -3, -1]]);
    cases.push([[1, 2, 3]]); cases.push([[-10000, 10000]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), -100, 100).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), -10000, 10000).sort((a, b) => a - b)]);
    return cases;
  }
},

// 29
{
  slug: 'longest-word-through-deleting',
  title: 'Longest Word Through Deleting',
  description: 'Given a string s and a list of strings dictionary, return the longest string in the dictionary that can be formed by deleting some characters from s. If there are multiple results, return the lexicographically smallest one.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers', 'Sorting'],
  constraints: '1 <= s.length <= 1000, 1 <= dictionary.length <= 1000',
  examples: [{ input: '"abpcplea", ["ale","apple","monkey","plea"]', output: '"apple"', explanation: 'apple is longest subsequence.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'dictionary', cpp: 'vector<string>', java: 'String[]', py: 'dictionary: List[str]', js: 'dictionary' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Check Subsequence', content: 'For each word, check if it is a subsequence of s using two pointers.' }],
  jsSolution: (s, dictionary) => {
    const isSub = (w, s) => {
      let j = 0;
      for (let i = 0; i < s.length && j < w.length; i++) if (s[i] === w[j]) j++;
      return j === w.length;
    };
    dictionary.sort((a, b) => b.length - a.length || a.localeCompare(b));
    for (const w of dictionary) if (isSub(w, s)) return w;
    return '';
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abpcplea', ['ale', 'apple', 'monkey', 'plea']]); cases.push(['abpcplea', ['a', 'b', 'c']]);
    cases.push(['a', ['a']]); cases.push(['xyz', ['abc']]);
    for (let i = 0; i < 46; i++) {
      const s = randStr(randInt(10, 100));
      const dict = Array.from({ length: randInt(1, 20) }, () => randStr(randInt(1, 15)));
      cases.push([s, dict]);
    }
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(100, 500));
      const dict = Array.from({ length: randInt(20, 100) }, () => randStr(randInt(1, 20)));
      cases.push([s, dict]);
    }
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(500, 1000));
      const dict = Array.from({ length: randInt(100, 500) }, () => randStr(randInt(1, 20)));
      cases.push([s, dict]);
    }
    return cases;
  }
},

// 30
{
  slug: 'sum-of-square-numbers',
  title: 'Sum of Square Numbers',
  description: 'Given a non-negative integer c, decide whether there are two integers a and b such that a^2 + b^2 = c.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Math', 'Two Pointers', 'Binary Search'],
  constraints: '0 <= c <= 2^31 - 1',
  examples: [{ input: '5', output: 'true', explanation: '1^2 + 2^2 = 5.' }],
  args: [{ name: 'c', cpp: 'int', java: 'int', py: 'c: int', js: 'c' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Two Pointers', content: 'Start with a=0 and b=floor(sqrt(c)), adjust.' }],
  jsSolution: (c) => {
    let a = 0, b = Math.floor(Math.sqrt(c));
    while (a <= b) {
      const sum = a * a + b * b;
      if (sum === c) return true;
      else if (sum < c) a++;
      else b--;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5]); cases.push([3]); cases.push([4]); cases.push([0]); cases.push([1]); cases.push([2]);
    cases.push([100]); cases.push([2147483647]);
    for (let i = 0; i < 42; i++) cases.push([randInt(0, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(0, 1000000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(0, 2147483647)]);
    return cases;
  }
},

// 31
{
  slug: 'compare-version-numbers',
  title: 'Compare Version Numbers',
  description: 'Given two version strings version1 and version2, compare them. Return -1 if version1 < version2, 1 if version1 > version2, 0 if equal. Versions are dot-separated integers.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers'],
  constraints: '1 <= version.length <= 500, version consists of digits and dots',
  examples: [{ input: '"1.01", "1.001"', output: '0', explanation: 'Leading zeros ignored.' }],
  args: [
    { name: 'version1', cpp: 'string', java: 'String', py: 'version1: str', js: 'version1' },
    { name: 'version2', cpp: 'string', java: 'String', py: 'version2: str', js: 'version2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Split and Compare', content: 'Split by dots, compare each revision number.' }],
  jsSolution: (version1, version2) => {
    const v1 = version1.split('.').map(Number), v2 = version2.split('.').map(Number);
    const len = Math.max(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
      const a = i < v1.length ? v1[i] : 0;
      const b = i < v2.length ? v2[i] : 0;
      if (a < b) return -1;
      if (a > b) return 1;
    }
    return 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['1.01', '1.001']); cases.push(['1.0', '1.0.0']); cases.push(['0.1', '1.1']);
    cases.push(['1.0.1', '1']); cases.push(['7.5.2.4', '7.5.3']);
    const genVersion = () => Array.from({ length: randInt(1, 5) }, () => randInt(0, 100)).join('.');
    for (let i = 0; i < 45; i++) cases.push([genVersion(), genVersion()]);
    for (let i = 0; i < 50; i++) cases.push([genVersion(), genVersion()]);
    for (let i = 0; i < 50; i++) cases.push([genVersion(), genVersion()]);
    return cases;
  }
},

// 32
{
  slug: 'rotate-string',
  title: 'Rotate String',
  description: 'Given two strings s and goal, return true if s can become goal after some number of rotations (shifts).',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers'],
  constraints: '1 <= s.length, goal.length <= 100',
  examples: [{ input: '"abcde", "cdeab"', output: 'true', explanation: 'Rotate 2 positions.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'goal', cpp: 'string', java: 'String', py: 'goal: str', js: 'goal' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Concatenate', content: 'Check if goal is substring of s+s.' }],
  jsSolution: (s, goal) => s.length === goal.length && (s + s).includes(goal),
  inputGenerator: () => {
    const cases = [];
    cases.push(['abcde', 'cdeab']); cases.push(['abcde', 'abced']); cases.push(['a', 'a']);
    cases.push(['aa', 'a']); cases.push(['ab', 'ba']);
    for (let i = 0; i < 45; i++) cases.push([randStr(randInt(1, 20)), randStr(randInt(1, 20))]);
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(5, 50));
      const rot = randInt(0, s.length - 1);
      cases.push([s, s.slice(rot) + s.slice(0, rot)]);
    }
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 100)), randStr(randInt(50, 100))]);
    return cases;
  }
},

// 33
{
  slug: 'di-string-match',
  title: 'DI String Match',
  description: 'Given a string s of length n containing only "I" (increase) and "D" (decrease), return a permutation perm of [0..n] such that for each i: if s[i] == "I" then perm[i] < perm[i+1], if s[i] == "D" then perm[i] > perm[i+1].',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Greedy', 'String'],
  constraints: '1 <= s.length <= 10^5, s[i] is "I" or "D"',
  examples: [{ input: '"IDID"', output: '[0,4,1,3,2]', explanation: 'I→0<4, D→4>1, I→1<3, D→3>2.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Greedy', content: 'For I assign the current min, for D assign the current max.' }],
  jsSolution: (s) => {
    let lo = 0, hi = s.length;
    const res = [];
    for (const c of s) {
      if (c === 'I') res.push(lo++);
      else res.push(hi--);
    }
    res.push(lo);
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['IDID']); cases.push(['III']); cases.push(['DDI']); cases.push(['I']); cases.push(['D']);
    for (let i = 0; i < 45; i++) {
      const len = randInt(1, 50);
      cases.push([Array.from({ length: len }, () => Math.random() < 0.5 ? 'I' : 'D').join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 500);
      cases.push([Array.from({ length: len }, () => Math.random() < 0.5 ? 'I' : 'D').join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(500, 10000);
      cases.push([Array.from({ length: len }, () => Math.random() < 0.5 ? 'I' : 'D').join('')]);
    }
    return cases;
  }
},

// 34
{
  slug: 'count-binary-substrings',
  title: 'Count Binary Substrings',
  description: 'Given a binary string s, count the number of non-empty substrings that have the same number of consecutive 0s and 1s, and all the 0s and all the 1s in these substrings are grouped consecutively.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers'],
  constraints: '1 <= s.length <= 10^5, s[i] is "0" or "1"',
  examples: [{ input: '"00110011"', output: '6', explanation: '6 substrings with equal 0s and 1s grouped.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Group Counting', content: 'Count consecutive groups, result += min(prev_group, curr_group).' }],
  jsSolution: (s) => {
    let prev = 0, curr = 1, count = 0;
    for (let i = 1; i < s.length; i++) {
      if (s[i] === s[i - 1]) curr++;
      else { count += Math.min(prev, curr); prev = curr; curr = 1; }
    }
    return count + Math.min(prev, curr);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['00110011']); cases.push(['10101']); cases.push(['0']); cases.push(['01']); cases.push(['10']);
    cases.push(['0000']); cases.push(['1111']); cases.push(['010101']);
    for (let i = 0; i < 42; i++) cases.push([Array.from({ length: randInt(1, 50) }, () => String(randInt(0, 1))).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(50, 500) }, () => String(randInt(0, 1))).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(500, 10000) }, () => String(randInt(0, 1))).join('')]);
    return cases;
  }
},

// 35
{
  slug: 'flipping-an-image',
  title: 'Flipping an Image',
  description: 'Given an n x n binary matrix image, flip it horizontally (reverse each row), then invert it (flip 0->1, 1->0). Return the resulting image.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Matrix', 'Bit Manipulation'],
  constraints: '1 <= n <= 20, image[i][j] is 0 or 1',
  examples: [{ input: '[[1,1,0],[1,0,1],[0,0,0]]', output: '[[1,0,0],[0,1,0],[1,1,1]]', explanation: 'Flip horizontally then invert.' }],
  args: [{ name: 'image', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'image: List[List[int]]', js: 'image' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Reverse + Invert', content: 'Reverse each row and XOR each element with 1.' }],
  jsSolution: (image) => image.map(row => row.reverse().map(v => v ^ 1)),
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1, 0], [1, 0, 1], [0, 0, 0]]]); cases.push([[[1, 1, 0, 0], [1, 0, 0, 1], [0, 1, 1, 1], [1, 0, 1, 0]]]);
    cases.push([[[0]]]); cases.push([[[1]]]);
    for (let i = 0; i < 46; i++) {
      const n = randInt(1, 10);
      cases.push([Array.from({ length: n }, () => randArr(n, 0, 1))]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(5, 15);
      cases.push([Array.from({ length: n }, () => randArr(n, 0, 1))]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(10, 20);
      cases.push([Array.from({ length: n }, () => randArr(n, 0, 1))]);
    }
    return cases;
  }
},

// 36
{
  slug: 'longest-harmonious-subseq',
  title: 'Longest Harmonious Subsequence',
  description: 'Given an integer array nums, find the longest harmonious subsequence where the difference between max and min is exactly 1. Return its length.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Hash Table', 'Sorting'],
  constraints: '1 <= nums.length <= 2 * 10^4, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,3,2,2,5,2,3,7]', output: '5', explanation: 'Subsequence [3,2,2,2,3], max-min=1.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Hash Map', content: 'Count frequencies, check pairs with difference 1.' }],
  jsSolution: (nums) => {
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;
    let longest = 0;
    for (const key of Object.keys(freq)) {
      const k = Number(key);
      if (freq[k + 1] !== undefined) longest = Math.max(longest, freq[k] + freq[k + 1]);
    }
    return longest;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 2, 2, 5, 2, 3, 7]]); cases.push([[1, 2, 3, 4]]); cases.push([[1, 1, 1, 1]]);
    cases.push([[1, 2]]); cases.push([[1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), -10, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 20000), -1000000000, 1000000000)]);
    return cases;
  }
},

// 37
{
  slug: 'backspace-string-compare-tp',
  title: 'Backspace String Compare',
  description: 'Given two strings s and t, return true if they are equal when both are typed into empty text editors. "#" means a backspace character.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers', 'Stack'],
  constraints: '1 <= s.length, t.length <= 200, s and t only contain lowercase letters and "#"',
  examples: [{ input: '"ab#c", "ad#c"', output: 'true', explanation: 'Both become "ac".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Build String', content: 'Use a stack to process backspaces, then compare.' }],
  jsSolution: (s, t) => {
    const build = (str) => {
      const stack = [];
      for (const c of str) { if (c === '#') stack.pop(); else stack.push(c); }
      return stack.join('');
    };
    return build(s) === build(t);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ab#c', 'ad#c']); cases.push(['ab##', 'c#d#']); cases.push(['a##c', '#a#c']);
    cases.push(['a', 'a']); cases.push(['#', '#']); cases.push(['a#', '']);
    const genBS = (len) => {
      const chars = 'abcdefghij#####';
      return Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('');
    };
    for (let i = 0; i < 44; i++) cases.push([genBS(randInt(1, 20)), genBS(randInt(1, 20))]);
    for (let i = 0; i < 50; i++) cases.push([genBS(randInt(20, 100)), genBS(randInt(20, 100))]);
    for (let i = 0; i < 50; i++) cases.push([genBS(randInt(100, 200)), genBS(randInt(100, 200))]);
    return cases;
  }
},

// 38
{
  slug: 'array-target-pairs',
  title: 'Count Pairs With Target Sum',
  description: 'Given a sorted array of integers and a target sum, count the number of pairs whose sum equals the target.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 10^5, -10^5 <= nums[i] <= 10^5',
  examples: [{ input: '[1,1,2,3,4,4,5], 6', output: '3', explanation: 'Pairs: (1,5), (2,4), (2,4).' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two Pointers', content: 'Use two pointers from both ends, count matching pairs.' }],
  jsSolution: (nums, target) => {
    let l = 0, r = nums.length - 1, count = 0;
    while (l < r) {
      const sum = nums[l] + nums[r];
      if (sum === target) {
        if (nums[l] === nums[r]) {
          const len = r - l + 1;
          count += len * (len - 1) / 2;
          break;
        }
        let lc = 1, rc = 1;
        while (l + lc < r && nums[l + lc] === nums[l]) lc++;
        while (r - rc > l && nums[r - rc] === nums[r]) rc++;
        count += lc * rc; l += lc; r -= rc;
      } else if (sum < target) l++;
      else r--;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 2, 3, 4, 4, 5], 6]); cases.push([[1, 2, 3], 10]); cases.push([[0, 0], 0]);
    cases.push([[1, 1, 1, 1], 2]); cases.push([[1, 5], 6]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), -50, 50).sort((a, b) => a - b), randInt(-100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000).sort((a, b) => a - b), randInt(-2000, 2000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), -100000, 100000).sort((a, b) => a - b), randInt(-200000, 200000)]);
    return cases;
  }
},

// 39
{
  slug: 'intersection-two-arrays-ii',
  title: 'Intersection of Two Arrays II',
  description: 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result should appear as many times as it shows in both arrays. Result can be in any order.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Hash Table', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 1000, 0 <= nums[i] <= 1000',
  examples: [{ input: '[1,2,2,1], [2,2]', output: '[2,2]', explanation: 'Intersection with frequencies.' }],
  args: [
    { name: 'nums1', cpp: 'vector<int>', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
    { name: 'nums2', cpp: 'vector<int>', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Sort + Two Pointers', content: 'Sort both and use two pointers.' }],
  jsSolution: (nums1, nums2) => {
    nums1.sort((a, b) => a - b); nums2.sort((a, b) => a - b);
    const res = [];
    let i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
      if (nums1[i] === nums2[j]) { res.push(nums1[i]); i++; j++; }
      else if (nums1[i] < nums2[j]) i++;
      else j++;
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 2, 1], [2, 2]]); cases.push([[4, 9, 5], [9, 4, 9, 8, 4]]); cases.push([[1], [1]]);
    cases.push([[1], [2]]); cases.push([[1, 1, 1], [1, 1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), 0, 20), randArr(randInt(1, 50), 0, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), 0, 100), randArr(randInt(50, 200), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(200, 1000), 0, 1000), randArr(randInt(200, 1000), 0, 1000)]);
    return cases;
  }
},

// 40
{
  slug: 'rearrange-array-alternating',
  title: 'Rearrange Array Elements by Sign',
  description: 'Given an array of positive and negative integers (equal count of each), rearrange elements so that every consecutive pair has different signs, starting with positive. Maintain relative order within positive and negative groups.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '2 <= nums.length <= 2 * 10^5, nums.length is even',
  examples: [{ input: '[3,1,-2,-5,2,-4]', output: '[3,-2,1,-5,2,-4]', explanation: 'Positive then negative alternating.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Separate and Merge', content: 'Separate positives and negatives, then interleave.' }],
  jsSolution: (nums) => {
    const pos = nums.filter(n => n > 0);
    const neg = nums.filter(n => n < 0);
    const res = [];
    for (let i = 0; i < pos.length; i++) { res.push(pos[i]); res.push(neg[i]); }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, -2, -5, 2, -4]]); cases.push([[-1, 1]]); cases.push([[1, -1, 2, -2]]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 25);
      const pos = Array.from({ length: n }, () => randInt(1, 100));
      const neg = Array.from({ length: n }, () => -randInt(1, 100));
      const arr = [...pos, ...neg];
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(25, 200);
      const pos = Array.from({ length: n }, () => randInt(1, 10000));
      const neg = Array.from({ length: n }, () => -randInt(1, 10000));
      const arr = [...pos, ...neg];
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(200, 5000);
      const pos = Array.from({ length: n }, () => randInt(1, 100000));
      const neg = Array.from({ length: n }, () => -randInt(1, 100000));
      const arr = [...pos, ...neg];
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr]);
    }
    return cases;
  }
},

// 41
{
  slug: 'is-palindrome-after-ops',
  title: 'Check if Array is Palindrome',
  description: 'Given an integer array nums, return true if the array reads the same forward and backward.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,2,3,2,1]', output: 'true', explanation: 'Array is a palindrome.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Two Pointers', content: 'Compare from both ends moving inward.' }],
  jsSolution: (nums) => {
    let l = 0, r = nums.length - 1;
    while (l < r) { if (nums[l] !== nums[r]) return false; l++; r--; }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 2, 1]]); cases.push([[1, 2, 3]]); cases.push([[1]]); cases.push([[1, 1]]);
    cases.push([[1, 2]]);
    // palindrome arrays
    for (let i = 0; i < 45; i++) {
      const half = randArr(randInt(0, 25), -100, 100);
      const mid = Math.random() < 0.5 ? [randInt(-100, 100)] : [];
      cases.push([[...half, ...mid, ...half.slice().reverse()]]);
    }
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1, 100), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 10000), -1000000000, 1000000000)]);
    return cases;
  }
},

// 42
{
  slug: 'max-product-three-numbers',
  title: 'Maximum Product of Three Numbers',
  description: 'Given an integer array nums, find three numbers whose product is maximum and return that product.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Sorting', 'Math'],
  constraints: '3 <= nums.length <= 10^4, -1000 <= nums[i] <= 1000',
  examples: [{ input: '[1,2,3]', output: '6', explanation: '1 * 2 * 3 = 6.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort', content: 'Max product is either last three or first two (negatives) × last one.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    return Math.max(nums[n - 1] * nums[n - 2] * nums[n - 3], nums[0] * nums[1] * nums[n - 1]);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]); cases.push([[1, 2, 3, 4]]); cases.push([[-1, -2, -3]]);
    cases.push([[-100, -98, 1, 2, 3, 4]]); cases.push([[0, 0, 0]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(3, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -500, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), -1000, 1000)]);
    return cases;
  }
},

// 43
{
  slug: 'product-less-than-k',
  title: 'Subarray Product Less Than K',
  description: 'Given an array of positive integers nums and an integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Sliding Window', 'Two Pointers'],
  constraints: '1 <= nums.length <= 3 * 10^4, 1 <= nums[i] <= 1000, 0 <= k <= 10^6',
  examples: [{ input: '[10,5,2,6], 100', output: '8', explanation: '8 subarrays with product < 100.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Expand right, shrink left when product >= k.' }],
  jsSolution: (nums, k) => {
    if (k <= 1) return 0;
    let prod = 1, count = 0, l = 0;
    for (let r = 0; r < nums.length; r++) {
      prod *= nums[r];
      while (prod >= k) prod /= nums[l++];
      count += r - l + 1;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[10, 5, 2, 6], 100]); cases.push([[1, 2, 3], 0]); cases.push([[1, 1, 1], 1]);
    cases.push([[1], 2]); cases.push([[100], 100]); cases.push([[1, 1, 1, 1], 5]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 1, 20), randInt(0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 100), randInt(0, 100000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 1, 1000), randInt(0, 1000000)]);
    return cases;
  }
},

// 44
{
  slug: 'sort-by-character-freq',
  title: 'Sort Characters By Frequency',
  description: 'Given a string s, sort it in decreasing order based on the frequency of the characters. If two characters have the same frequency, their relative order does not matter.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['String', 'Hash Table', 'Sorting', 'Bucket Sort'],
  constraints: '1 <= s.length <= 5 * 10^5, s consists of uppercase, lowercase letters and digits',
  examples: [{ input: '"tree"', output: '"eert"', explanation: 'e appears twice. t and r appear once.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Bucket Sort', content: 'Count frequency, sort by frequency, rebuild string.' }],
  jsSolution: (s) => {
    const freq = {};
    for (const c of s) freq[c] = (freq[c] || 0) + 1;
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([c, f]) => c.repeat(f)).join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['tree']); cases.push(['cccaaa']); cases.push(['Aabb']); cases.push(['a']); cases.push(['eeeee']);
    const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 45; i++) cases.push([Array.from({ length: randInt(1, 50) }, () => alpha[randInt(0, alpha.length - 1)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(50, 500) }, () => alpha[randInt(0, alpha.length - 1)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(500, 5000) }, () => alpha[randInt(0, alpha.length - 1)]).join('')]);
    return cases;
  }
},

// 45
{
  slug: 'remove-duplicates-sorted-ii',
  title: 'Remove Duplicates from Sorted Array II',
  description: 'Given a sorted array nums, remove duplicates in-place such that each unique element appears at most twice. Return the resulting array.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= nums.length <= 3 * 10^4, -10^4 <= nums[i] <= 10^4, nums is sorted',
  examples: [{ input: '[1,1,1,2,2,3]', output: '[1,1,2,2,3]', explanation: 'Keep at most 2 of each.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Write Pointer', content: 'Track position to write, only write if count <= 2.' }],
  jsSolution: (nums) => {
    const res = [];
    let count = 0, prev = undefined;
    for (const n of nums) {
      if (n !== prev) { count = 1; prev = n; res.push(n); }
      else { count++; if (count <= 2) res.push(n); }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 1, 2, 2, 3]]); cases.push([[0, 0, 1, 1, 1, 1, 2, 3, 3]]); cases.push([[1]]);
    cases.push([[1, 1]]); cases.push([[1, 1, 1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), -50, 50).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), -10000, 10000).sort((a, b) => a - b)]);
    return cases;
  }
},

// 46
{
  slug: 'zigzag-array',
  title: 'Wiggle Sort',
  description: 'Given an unsorted array nums, reorder it such that nums[0] <= nums[1] >= nums[2] <= nums[3].... Return the wiggle-sorted array.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Sorting', 'Greedy'],
  constraints: '1 <= nums.length <= 5000, 0 <= nums[i] <= 10^4',
  examples: [{ input: '[3,5,2,1,6,4]', output: '[1,3,2,5,4,6]', explanation: 'One valid wiggle arrangement.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Sort + Interleave', content: 'Sort, then swap adjacent pairs at odd indices.' }],
  jsSolution: (nums) => {
    const a = [...nums].sort((x, y) => x - y);
    for (let i = 1; i < a.length - 1; i += 2) [a[i], a[i + 1]] = [a[i + 1], a[i]];
    return a;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 2, 1, 6, 4]]); cases.push([[1]]); cases.push([[1, 2]]); cases.push([[2, 1]]);
    cases.push([[1, 1, 1]]); cases.push([[1, 2, 3, 4, 5]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 0, 10000)]);
    return cases;
  }
},

// 47
{
  slug: 'max-area-island-1d',
  title: 'Maximum Width Ramp',
  description: 'Given an integer array nums, a ramp is a pair (i, j) where i < j and nums[i] <= nums[j]. Return the maximum width j - i of a ramp. If no ramp exists, return 0.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '2 <= nums.length <= 5 * 10^4, 0 <= nums[i] <= 5 * 10^4',
  examples: [{ input: '[6,0,8,2,1,5]', output: '4', explanation: 'Max ramp: (1,5) where nums[1]=0 <= nums[5]=5, width=4.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Monotonic Stack', content: 'Build decreasing stack of indices, then scan from right.' }],
  jsSolution: (nums) => {
    const stack = [];
    for (let i = 0; i < nums.length; i++) {
      if (!stack.length || nums[stack[stack.length - 1]] > nums[i]) stack.push(i);
    }
    let maxW = 0;
    for (let j = nums.length - 1; j >= 0; j--) {
      while (stack.length && nums[stack[stack.length - 1]] <= nums[j]) {
        maxW = Math.max(maxW, j - stack.pop());
      }
    }
    return maxW;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[6, 0, 8, 2, 1, 5]]); cases.push([[9, 8, 1, 0, 1, 9, 4, 0, 4, 1]]);
    cases.push([[1, 0]]); cases.push([[0, 1]]); cases.push([[5, 5]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(2, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 50000), 0, 50000)]);
    return cases;
  }
},

// 48
{
  slug: 'bag-of-tokens',
  title: 'Bag of Tokens',
  description: 'Given tokens[i] and an initial power, you can play each token face up (lose tokens[i] power, gain 1 score) or face down (gain tokens[i] power, lose 1 score). Return the maximum score achievable.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting'],
  constraints: '0 <= tokens.length <= 1000, 0 <= tokens[i], power <= 10^4',
  examples: [{ input: '[100,200,300,400], 200', output: '2', explanation: 'Play 100 face up, 400 face down, 200 face up, 300 face up → score 2.' }],
  args: [
    { name: 'tokens', cpp: 'vector<int>', java: 'int[]', py: 'tokens: List[int]', js: 'tokens' },
    { name: 'power', cpp: 'int', java: 'int', py: 'power: int', js: 'power' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Greedy', content: 'Sort tokens. Play cheapest face up, most expensive face down.' }],
  jsSolution: (tokens, power) => {
    tokens.sort((a, b) => a - b);
    let l = 0, r = tokens.length - 1, score = 0, maxScore = 0;
    while (l <= r) {
      if (power >= tokens[l]) { power -= tokens[l++]; score++; maxScore = Math.max(maxScore, score); }
      else if (score > 0) { power += tokens[r--]; score--; }
      else break;
    }
    return maxScore;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[100, 200, 300, 400], 200]); cases.push([[100], 50]); cases.push([[], 85]);
    cases.push([[100], 100]); cases.push([[71, 55, 82], 54]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(0, 20), 0, 100), randInt(0, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 100), 0, 1000), randInt(0, 5000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), 0, 10000), randInt(0, 10000)]);
    return cases;
  }
},

// 49
{
  slug: 'shortest-unsorted-subarray-tp',
  title: 'Minimum Window Sort',
  description: 'Given an array of integers, find the length of the shortest subarray that, if sorted, would result in the whole array being sorted.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 10^4, -10^5 <= nums[i] <= 10^5',
  examples: [{ input: '[1,2,5,3,7,10,9,12]', output: '5', explanation: 'Sort subarray [5,3,7,10,9] at indices 2-6.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Find Boundaries', content: 'Find leftmost and rightmost positions where sorted order breaks.' }],
  jsSolution: (nums) => {
    const sorted = [...nums].sort((a, b) => a - b);
    let l = 0, r = nums.length - 1;
    while (l < nums.length && nums[l] === sorted[l]) l++;
    while (r > l && nums[r] === sorted[r]) r--;
    return r - l + (l === r && nums[l] === sorted[l] ? 0 : 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 5, 3, 7, 10, 9, 12]]); cases.push([[1, 2, 3]]); cases.push([[3, 2, 1]]);
    cases.push([[1]]); cases.push([[2, 1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), -100000, 100000)]);
    return cases;
  }
},

// 50
{
  slug: 'circular-array-loop',
  title: 'Circular Array Loop',
  description: 'Given a circular array nums, determine if there is a cycle. A cycle must have the same direction (all forward or all backward) and length > 1. nums[i] is the number of steps to move.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Hash Table'],
  constraints: '1 <= nums.length <= 5000, -1000 <= nums[i] <= 1000, nums[i] != 0',
  examples: [{ input: '[2,-1,1,2,2]', output: 'true', explanation: 'Cycle: 0→2→3→0.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Fast & Slow', content: 'For each starting point, use fast-slow pointers to detect a cycle.' }],
  jsSolution: (nums) => {
    const n = nums.length;
    const next = (i) => ((i + nums[i]) % n + n) % n;
    for (let i = 0; i < n; i++) {
      if (nums[i] === 0) continue;
      let slow = i, fast = i;
      const dir = nums[i] > 0;
      do {
        slow = next(slow);
        if ((nums[slow] > 0) !== dir) break;
        fast = next(fast);
        if ((nums[fast] > 0) !== dir) break;
        fast = next(fast);
        if ((nums[fast] > 0) !== dir) break;
      } while (slow !== fast);
      if (slow === fast && (nums[slow] > 0) === dir && next(slow) !== slow) return true;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, -1, 1, 2, 2]]); cases.push([[-1, 2]]); cases.push([[-2, 1, -1, -2, -2]]);
    cases.push([[1, -1]]); cases.push([[3, 1, 2]]); cases.push([[-1, -2, -3, -4, -5]]);
    const genNoZero = (n, lo, hi) => {
      const arr = [];
      for (let i = 0; i < n; i++) {
        let v = randInt(lo, hi);
        while (v === 0) v = randInt(lo, hi);
        arr.push(v);
      }
      return arr;
    };
    for (let i = 0; i < 44; i++) cases.push([genNoZero(randInt(1, 20), -10, 10)]);
    for (let i = 0; i < 50; i++) cases.push([genNoZero(randInt(20, 100), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([genNoZero(randInt(100, 5000), -1000, 1000)]);
    return cases;
  }
}

];

export default problems;
