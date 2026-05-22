// Sliding Window — Batch 3 (4 problems to complete Sliding Window to exactly 50)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'contains-duplicate-ii',
  title: 'Contains Duplicate II',
  description: 'Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['Array', 'Hash Table', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9, 0 <= k <= 10^5',
  examples: [{ input: '[1,2,3,1], 3', output: 'true', explanation: 'nums[0] == nums[3] == 1 and abs(0 - 3) <= 3.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Sliding Window Set', content: 'Maintain a sliding window set of size k. As we slide to index i, if nums[i] is already in the set, return true. Otherwise add nums[i] and remove nums[i-k].' }],
  jsSolution: (nums, k) => {
    const set = new Set();
    for (let i = 0; i < nums.length; i++) {
      if (set.has(nums[i])) return true;
      set.add(nums[i]);
      if (set.size > k) {
        set.delete(nums[i - k]);
      }
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 1], 3]);
    cases.push([[1, 0, 1, 1], 1]);
    cases.push([[1, 2, 3, 1, 2, 3], 2]);
    const gen = (n) => {
      const k = randInt(1, Math.max(1, Math.floor(n / 2)));
      // Generate some duplicate elements close to each other
      const arr = randArr(n, 1, 30);
      if (Math.random() < 0.6) {
        const idx1 = randInt(0, n - 2);
        const idx2 = Math.min(n - 1, idx1 + randInt(1, k));
        arr[idx2] = arr[idx1];
      }
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 60)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(60, 200)));
    return cases;
  }
},

// 2
{
  slug: 'get-equal-substrings-within-budget',
  title: 'Get Equal Substrings Within Budget',
  description: 'You are given two strings s and t of the same length and an integer maxCost. You want to change s to t. Changing the ith character of s to the ith character of t costs abs(s[i] - t[i]). Return the maximum length of a substring of s that can be changed to t with a cost <= maxCost.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Binary Search', 'Sliding Window', 'Prefix Sum'],
  constraints: '1 <= s.length == t.length <= 10^5, 0 <= maxCost <= 10^6, s and t consist of lowercase English letters.',
  examples: [{ input: '"abcd", "bcdf", 3', output: '3', explanation: 's="abcd", t="bcdf". Cost to change: [1, 1, 1, 2]. Substring "abc" changed to "bcd" costs 3, length 3.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' },
    { name: 'maxCost', cpp: 'int', java: 'int', py: 'maxCost: int', js: 'maxCost' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Variable Sliding Window', content: 'Use two pointers to represent the window. Expand right and add cost. If cost exceeds maxCost, shrink left until cost <= maxCost.' }],
  jsSolution: (s, t, maxCost) => {
    let lo = 0, cost = 0, maxLen = 0;
    for (let hi = 0; hi < s.length; hi++) {
      cost += Math.abs(s.charCodeAt(hi) - t.charCodeAt(hi));
      while (cost > maxCost) {
        cost -= Math.abs(s.charCodeAt(lo) - t.charCodeAt(lo));
        lo++;
      }
      maxLen = Math.max(maxLen, hi - lo + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abcd", "bcdf", 3]);
    cases.push(["abcd", "cdef", 3]);
    cases.push(["abcd", "acde", 0]);
    const gen = (n) => {
      const s = randStr(n);
      const t = randStr(n);
      const maxCost = randInt(0, n * 5);
      return [s, t, maxCost];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 60)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(60, 200)));
    return cases;
  }
},

// 3
{
  slug: 'maximum-number-of-robots-within-budget',
  title: 'Maximum Number of Robots Within Budget',
  description: 'Given arrays chargeTimes and runningCosts of length n, and budget. Return maximum number of consecutive robots you can run such that total cost = max(chargeTimes[i..j]) + k * sum(runningCosts[i..j]) <= budget where k is the number of robots.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', 'Prefix Sum', 'Monotonic Queue'],
  constraints: 'chargeTimes.length == runningCosts.length == n, 1 <= n <= 5 * 10^4, 1 <= chargeTimes[i], runningCosts[i] <= 10^6, 1 <= budget <= 10^15',
  examples: [{ input: '[3,6,1,3,4], [2,1,3,4,5], 25', output: '3', explanation: 'Choose robots [3, 6, 1]. Max charge = 6. Sum running = 6. Total cost = 6 + 3*6 = 24 <= 25. Run 3 robots.' }],
  args: [
    { name: 'chargeTimes', cpp: 'vector<int>', java: 'int[]', py: 'chargeTimes: List[int]', js: 'chargeTimes' },
    { name: 'runningCosts', cpp: 'vector<int>', java: 'int[]', py: 'runningCosts: List[int]', js: 'runningCosts' },
    { name: 'budget', cpp: 'long long', java: 'long', py: 'budget: int', js: 'budget' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window + Monotonic Queue', content: 'Use a sliding window. Use a double-ended monotonic queue to track the maximum chargeTimes in the current window. Keep shrinking the left pointer while cost > budget.' }],
  jsSolution: (chargeTimes, runningCosts, budget) => {
    let lo = 0, sum = 0, maxLen = 0;
    const q = [];
    for (let hi = 0; hi < chargeTimes.length; hi++) {
      sum += runningCosts[hi];
      while (q.length && chargeTimes[q[q.length - 1]] <= chargeTimes[hi]) {
        q.pop();
      }
      q.push(hi);
      while (lo <= hi && (chargeTimes[q[0]] + (hi - lo + 1) * sum) > budget) {
        sum -= runningCosts[lo];
        if (q[0] === lo) {
          q.shift();
        }
        lo++;
      }
      maxLen = Math.max(maxLen, hi - lo + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 6, 1, 3, 4], [2, 1, 3, 4, 5], 25]);
    cases.push([[11, 12, 19], [10, 8, 7], 19]);
    cases.push([[5], [5], 10]);
    const gen = (n) => {
      const chargeTimes = randArr(n, 1, 50);
      const runningCosts = randArr(n, 1, 10);
      const budget = randInt(10, 150) * n;
      return [chargeTimes, runningCosts, budget];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 4
{
  slug: 'sliding-subarray-beauty',
  title: 'Sliding Subarray Beauty',
  description: 'Given an integer array nums and integers k and x. Find the beauty of each subarray of size k. The beauty of a subarray is the xth smallest integer if it is negative, otherwise 0. Return the array of beauty values.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Hash Table', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, -50 <= nums[i] <= 50, 1 <= k <= nums.length, 1 <= x <= k',
  examples: [{ input: '[1,-1,-3,-2,3], 3, 2', output: '[-1,-2,-2]', explanation: 'Subarrays: [1,-1,-3] 2nd smallest is -1. [-1,-3,-2] 2nd smallest is -2. [-3,-2,3] 2nd smallest is -2.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' },
    { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Sliding Window Bucket Sort', content: 'Since nums[i] is between -50 and 50, maintain a sliding window frequency array of size 101. To find the xth smallest, scan the frequency array up to 50.' }],
  jsSolution: (nums, k, x) => {
    const freq = Array(101).fill(0);
    const getBeauty = () => {
      let count = 0;
      for (let i = 0; i < 50; i++) {
        count += freq[i];
        if (count >= x) return i - 50;
      }
      return 0;
    };
    const ans = [];
    for (let i = 0; i < nums.length; i++) {
      freq[nums[i] + 50]++;
      if (i >= k - 1) {
        ans.push(getBeauty());
        freq[nums[i - k + 1] + 50]--;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, -1, -3, -2, 3], 3, 2]);
    cases.push([[-1, -2, -3, -4, -5], 2, 2]);
    cases.push([[-50], 1, 1]);
    const gen = (n) => {
      const nums = randArr(n, -50, 50);
      const k = randInt(1, n);
      const x = randInt(1, k);
      return [nums, k, x];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
}
];
