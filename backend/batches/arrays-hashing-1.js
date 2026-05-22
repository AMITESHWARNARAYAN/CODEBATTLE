// Arrays & Hashing — Batch 1 (25 new problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

export const problems = [

// ─── 1. Running Sum of 1D Array ───
{
  slug: 'running-sum-of-array',
  title: 'Running Sum of 1D Array',
  description: 'Given an array nums, return the running sum. The running sum at index i is the sum of all elements from index 0 to i inclusive.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 1000, -10^6 <= nums[i] <= 10^6',
  examples: [
    { input: '[1,2,3,4]', output: '[1,3,6,10]', explanation: 'Running sum: [1, 1+2, 1+2+3, 1+2+3+4]' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Prefix Sum', content: 'Add each element to the previous running sum.' }],
  jsSolution: (nums) => {
    const res = [nums[0]];
    for (let i = 1; i < nums.length; i++) res.push(res[i - 1] + nums[i]);
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1]]); cases.push([[0]]); cases.push([[-5]]); cases.push([[1, 2, 3, 4]]); cases.push([[1, 1, 1, 1, 1]]);
    cases.push([[-1, -2, -3]]); cases.push([[1000000, -1000000]]); cases.push([[0, 0, 0, 0]]);
    for (let i = 0; i < 42; i++) cases.push([randArr(randInt(2, 100), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 500), -10000, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 1000), -1000000, 1000000)]);
    return cases;
  }
},

// ─── 2. Shuffle the Array ───
{
  slug: 'shuffle-the-array',
  title: 'Shuffle the Array',
  description: 'Given the array nums consisting of 2n elements in the form [x1,x2,...,xn,y1,y2,...,yn], return the array in the form [x1,y1,x2,y2,...,xn,yn].',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array'],
  constraints: '1 <= n <= 500, 1 <= nums[i] <= 10^3',
  examples: [
    { input: '[2,5,1,3,4,7], 3', output: '[2,3,5,4,1,7]', explanation: 'x = [2,5,1], y = [3,4,7], result = [2,3,5,4,1,7]' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Interleave', content: 'Pair elements from first half with second half.' }],
  jsSolution: (nums, n) => {
    const res = [];
    for (let i = 0; i < n; i++) { res.push(nums[i]); res.push(nums[n + i]); }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2], 1]); cases.push([[1, 2, 3, 4], 2]); cases.push([[2, 5, 1, 3, 4, 7], 3]);
    cases.push([[1, 1, 1, 1], 2]); cases.push([[1000, 1], 1]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 50); cases.push([randArr(2 * n, 1, 1000), n]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 200); cases.push([randArr(2 * n, 1, 1000), n]); }
    for (let i = 0; i < 50; i++) { const n = randInt(200, 500); cases.push([randArr(2 * n, 1, 1000), n]); }
    return cases;
  }
},

// ─── 3. Number of Good Pairs ───
{
  slug: 'number-of-good-pairs',
  title: 'Number of Good Pairs',
  description: 'Given an array of integers nums, return the number of good pairs. A pair (i, j) is called good if nums[i] == nums[j] and i < j.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table', 'Counting'],
  constraints: '1 <= nums.length <= 100, 1 <= nums[i] <= 100',
  examples: [
    { input: '[1,2,3,1,1,3]', output: '4', explanation: 'Good pairs: (0,3), (0,4), (3,4), (2,5)' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count Frequency', content: 'For each value with frequency f, pairs = f*(f-1)/2.' }],
  jsSolution: (nums) => {
    const freq = {};
    let count = 0;
    for (const n of nums) { if (freq[n]) count += freq[n]; freq[n] = (freq[n] || 0) + 1; }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1]]); cases.push([[1, 1]]); cases.push([[1, 2, 3]]); cases.push([[1, 1, 1, 1]]);
    cases.push([[1, 2, 3, 1, 1, 3]]); cases.push([Array(100).fill(1)]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(2, 30), 1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 1, 100)]);
    return cases;
  }
},

// ─── 4. Richest Customer Wealth ───
{
  slug: 'richest-customer-wealth',
  title: 'Richest Customer Wealth',
  description: 'Given an m x n integer grid accounts where accounts[i][j] is the money the ith customer has in the jth bank, return the wealth of the richest customer.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Matrix'],
  constraints: '1 <= m, n <= 50, 1 <= accounts[i][j] <= 100',
  examples: [
    { input: '[[1,2,3],[3,2,1]]', output: '6', explanation: 'Both customers have wealth 6.' }
  ],
  args: [{ name: 'accounts', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'accounts: List[List[int]]', js: 'accounts' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sum Rows', content: 'Sum each row and return the maximum.' }],
  jsSolution: (accounts) => Math.max(...accounts.map(row => row.reduce((a, b) => a + b, 0))),
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1]]]); cases.push([[[1, 2, 3], [3, 2, 1]]]); cases.push([[[100]]]);
    cases.push([[[1, 5], [7, 3], [3, 5]]]);
    for (let i = 0; i < 46; i++) {
      const m = randInt(1, 15), n = randInt(1, 15);
      cases.push([Array.from({ length: m }, () => randArr(n, 1, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(10, 30), n = randInt(10, 30);
      cases.push([Array.from({ length: m }, () => randArr(n, 1, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(30, 50), n = randInt(30, 50);
      cases.push([Array.from({ length: m }, () => randArr(n, 1, 100))]);
    }
    return cases;
  }
},

// ─── 5. Best Time to Buy and Sell Stock ───
{
  slug: 'best-time-buy-sell-stock',
  title: 'Best Time to Buy and Sell Stock',
  description: 'Given an array prices where prices[i] is the price of a given stock on the ith day, return the maximum profit you can achieve from buying one day and selling on a later day. If no profit is possible, return 0.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy'],
  constraints: '1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4',
  examples: [
    { input: '[7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 5.' }
  ],
  args: [{ name: 'prices', cpp: 'vector<int>', java: 'int[]', py: 'prices: List[int]', js: 'prices' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Minimum', content: 'Keep track of the minimum price seen so far and the maximum profit.' }],
  jsSolution: (prices) => {
    let minP = prices[0], maxProfit = 0;
    for (let i = 1; i < prices.length; i++) {
      maxProfit = Math.max(maxProfit, prices[i] - minP);
      minP = Math.min(minP, prices[i]);
    }
    return maxProfit;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[7, 1, 5, 3, 6, 4]]); cases.push([[7, 6, 4, 3, 1]]); cases.push([[1]]); cases.push([[1, 2]]);
    cases.push([[2, 1]]); cases.push([[1, 1, 1, 1]]); cases.push([[1, 10000]]); cases.push([[10000, 1]]);
    for (let i = 0; i < 42; i++) cases.push([randArr(randInt(2, 100), 0, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), 0, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), 0, 10000)]);
    return cases;
  }
},

// ─── 6. Sum of Unique Elements ───
{
  slug: 'sum-of-unique-elements',
  title: 'Sum of Unique Elements',
  description: 'Given an integer array nums, return the sum of all the unique elements of nums. An element is unique if it appears exactly once.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table', 'Counting'],
  constraints: '1 <= nums.length <= 100, 1 <= nums[i] <= 100',
  examples: [
    { input: '[1,2,3,2]', output: '4', explanation: 'Unique elements are 1 and 3. Sum = 4.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count First', content: 'Use a hash map to count occurrences, then sum those with count 1.' }],
  jsSolution: (nums) => {
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;
    let sum = 0;
    for (const [k, v] of Object.entries(freq)) if (v === 1) sum += Number(k);
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1]]); cases.push([[1, 1]]); cases.push([[1, 2, 3, 2]]); cases.push([[1, 1, 1, 1]]);
    cases.push([Array.from({ length: 100 }, (_, i) => (i % 50) + 1)]);
    cases.push([Array.from({ length: 100 }, (_, i) => i + 1)]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(2, 30), 1, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 1, 100)]);
    return cases;
  }
},

// ─── 7. Can Place Flowers ───
{
  slug: 'can-place-flowers',
  title: 'Can Place Flowers',
  description: 'Given a flowerbed array where 0 means empty and 1 means planted, return true if n new flowers can be planted without violating the no-adjacent-flowers rule.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy'],
  constraints: '1 <= flowerbed.length <= 2 * 10^4, flowerbed[i] is 0 or 1, 0 <= n <= flowerbed.length',
  examples: [
    { input: '[1,0,0,0,1], 1', output: 'true', explanation: 'One flower can be planted at index 2.' }
  ],
  args: [
    { name: 'flowerbed', cpp: 'vector<int>', java: 'int[]', py: 'flowerbed: List[int]', js: 'flowerbed' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Greedy Scan', content: 'Scan left to right and plant greedily whenever possible.' }],
  jsSolution: (flowerbed, n) => {
    let count = 0;
    const fb = [...flowerbed];
    for (let i = 0; i < fb.length; i++) {
      if (fb[i] === 0 && (i === 0 || fb[i - 1] === 0) && (i === fb.length - 1 || fb[i + 1] === 0)) {
        fb[i] = 1; count++;
      }
    }
    return count >= n;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0], 1]); cases.push([[1], 0]); cases.push([[1, 0, 0, 0, 1], 1]); cases.push([[1, 0, 0, 0, 1], 2]);
    cases.push([[0, 0, 0, 0, 0], 3]); cases.push([[1, 0, 1, 0, 1], 0]); cases.push([[0], 0]);
    cases.push([[0, 0, 0], 2]); cases.push([[1], 1]);
    for (let i = 0; i < 41; i++) {
      const len = randInt(1, 50);
      const bed = Array.from({ length: len }, () => Math.random() < 0.5 ? 0 : 1);
      // fix adjacent 1s
      for (let j = 1; j < bed.length; j++) if (bed[j] === 1 && bed[j-1] === 1) bed[j] = 0;
      cases.push([bed, randInt(0, Math.ceil(len / 2))]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 500);
      const bed = Array.from({ length: len }, () => Math.random() < 0.6 ? 0 : 1);
      for (let j = 1; j < bed.length; j++) if (bed[j] === 1 && bed[j-1] === 1) bed[j] = 0;
      cases.push([bed, randInt(0, Math.ceil(len / 3))]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(500, 5000);
      const bed = Array.from({ length: len }, () => Math.random() < 0.7 ? 0 : 1);
      for (let j = 1; j < bed.length; j++) if (bed[j] === 1 && bed[j-1] === 1) bed[j] = 0;
      cases.push([bed, randInt(0, Math.ceil(len / 4))]);
    }
    return cases;
  }
},

// ─── 8. Product of Array Except Self ───
{
  slug: 'product-except-self',
  title: 'Product of Array Except Self',
  description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Do not use division.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Prefix Sum'],
  constraints: '2 <= nums.length <= 10^5, -30 <= nums[i] <= 30',
  examples: [
    { input: '[1,2,3,4]', output: '[24,12,8,6]', explanation: 'Products: 2*3*4=24, 1*3*4=12, 1*2*4=8, 1*2*3=6' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Prefix/Suffix', content: 'Compute prefix products from left, then suffix products from right.' }],
  jsSolution: (nums) => {
    const n = nums.length, res = Array(n).fill(1);
    let left = 1;
    for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
    let right = 1;
    for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4]]); cases.push([[-1, 1, 0, -3, 3]]); cases.push([[0, 0]]); cases.push([[1, 1]]);
    cases.push([[2, -2]]); cases.push([[0, 1, 2, 3]]); cases.push([[30, 30, 30]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(2, 50), -30, 30)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -30, 30)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), -10, 10)]);
    return cases;
  }
},

// ─── 9. Maximum Subarray ───
{
  slug: 'maximum-subarray-sum',
  title: 'Maximum Subarray Sum',
  description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
  constraints: '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4',
  examples: [
    { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: "Kadane's Algorithm", content: 'Track current sum and global max. Reset current sum when it goes negative.' }],
  jsSolution: (nums) => {
    let maxSum = nums[0], curSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
      curSum = Math.max(nums[i], curSum + nums[i]);
      maxSum = Math.max(maxSum, curSum);
    }
    return maxSum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-1]]); cases.push([[1]]); cases.push([[-2, 1, -3, 4, -1, 2, 1, -5, 4]]); cases.push([[-1, -2, -3]]);
    cases.push([[5, 4, -1, 7, 8]]); cases.push([[0, 0, 0]]); cases.push([[-10000]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 100), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), -10000, 10000)]);
    return cases;
  }
},

// ─── 10. Rotate Array ───
{
  slug: 'rotate-array-k-steps',
  title: 'Rotate Array',
  description: 'Given an integer array nums, rotate the array to the right by k steps and return the result.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Math'],
  constraints: '1 <= nums.length <= 10^5, 0 <= k <= 10^5',
  examples: [
    { input: '[1,2,3,4,5,6,7], 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotate right by 3 steps.' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Reverse Trick', content: 'Reverse the whole array, then reverse first k and last n-k elements.' }],
  jsSolution: (nums, k) => {
    const n = nums.length;
    k = k % n;
    if (k === 0) return [...nums];
    return [...nums.slice(n - k), ...nums.slice(0, n - k)];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1], 0]); cases.push([[1], 1]); cases.push([[1, 2], 1]); cases.push([[1, 2, 3, 4, 5, 6, 7], 3]);
    cases.push([[1, 2, 3], 0]); cases.push([[1, 2, 3], 3]); cases.push([[1, 2, 3], 100]);
    for (let i = 0; i < 43; i++) { const n = randInt(1, 100); cases.push([randArr(n, -100, 100), randInt(0, 200)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(100, 1000); cases.push([randArr(n, -1000, 1000), randInt(0, 2000)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(1000, 10000); cases.push([randArr(n, -10000, 10000), randInt(0, 100000)]); }
    return cases;
  }
},

// ─── 11. Remove Duplicates from Sorted Array ───
{
  slug: 'remove-duplicates-sorted-array',
  title: 'Remove Duplicates from Sorted Array',
  description: 'Given a sorted integer array nums, remove the duplicates in-place and return the resulting array with unique elements.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= nums.length <= 3 * 10^4, -100 <= nums[i] <= 100, nums is sorted non-decreasingly',
  examples: [
    { input: '[1,1,2]', output: '[1,2]', explanation: 'After removing duplicates, the array is [1,2].' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Pointers', content: 'Use a slow pointer to track unique position and a fast pointer to scan.' }],
  jsSolution: (nums) => [...new Set(nums)],
  inputGenerator: () => {
    const cases = [];
    cases.push([[1]]); cases.push([[1, 1]]); cases.push([[1, 2]]); cases.push([[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]]);
    cases.push([[-100, -100, 0, 0, 100, 100]]); cases.push([Array(100).fill(5)]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), -100, 100).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -100, 100).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), -100, 100).sort((a, b) => a - b)]);
    return cases;
  }
},

// ─── 12. Maximum Product Subarray ───
{
  slug: 'max-product-subarray',
  title: 'Maximum Product Subarray',
  description: 'Given an integer array nums, find a subarray that has the largest product, and return the product.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 2 * 10^4, -10 <= nums[i] <= 10',
  examples: [
    { input: '[2,3,-2,4]', output: '6', explanation: '[2,3] has the largest product 6.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Min and Max', content: 'Track both minimum and maximum product at each step, since a negative can become positive.' }],
  jsSolution: (nums) => {
    let maxP = nums[0], minP = nums[0], result = nums[0];
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < 0) [maxP, minP] = [minP, maxP];
      maxP = Math.max(nums[i], maxP * nums[i]);
      minP = Math.min(nums[i], minP * nums[i]);
      result = Math.max(result, maxP);
    }
    return result;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 3, -2, 4]]); cases.push([[-2, 0, -1]]); cases.push([[0]]); cases.push([[-1]]);
    cases.push([[-2, -3, 4]]); cases.push([[2, -5, -2, -4, 3]]); cases.push([[0, 0, 0]]); cases.push([[-10, 10]]);
    for (let i = 0; i < 42; i++) cases.push([randArr(randInt(1, 50), -10, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -10, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), -10, 10)]);
    return cases;
  }
},

// ─── 13. Merge Intervals ───
{
  slug: 'merge-intervals',
  title: 'Merge Intervals',
  description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return the array of non-overlapping intervals.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sorting'],
  constraints: '1 <= intervals.length <= 10^4, intervals[i].length == 2, 0 <= start_i <= end_i <= 10^4',
  examples: [
    { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap → [1,6].' }
  ],
  args: [{ name: 'intervals', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'intervals: List[List[int]]', js: 'intervals' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Sort First', content: 'Sort by start time, then merge overlapping intervals in one pass.' }],
  jsSolution: (intervals) => {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
      else merged.push(intervals[i]);
    }
    return merged;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 3], [2, 6], [8, 10], [15, 18]]]); cases.push([[[1, 4], [4, 5]]]); cases.push([[[1, 1]]]);
    cases.push([[[1, 10], [2, 3], [4, 5]]]); cases.push([[[1, 2], [3, 4], [5, 6]]]);
    const genIntervals = (n, maxVal) => {
      const ivs = [];
      for (let i = 0; i < n; i++) { const s = randInt(0, maxVal); ivs.push([s, s + randInt(0, 50)]); }
      return ivs;
    };
    for (let i = 0; i < 45; i++) cases.push([genIntervals(randInt(1, 20), 100)]);
    for (let i = 0; i < 50; i++) cases.push([genIntervals(randInt(20, 200), 1000)]);
    for (let i = 0; i < 50; i++) cases.push([genIntervals(randInt(200, 1000), 10000)]);
    return cases;
  }
},

// ─── 14. Container With Most Water ───
{
  slug: 'container-with-most-water',
  title: 'Container With Most Water',
  description: 'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container that holds the most water.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers', 'Greedy'],
  constraints: '2 <= height.length <= 10^5, 0 <= height[i] <= 10^4',
  examples: [
    { input: '[1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 and 8 (heights 8 and 7) give area = 7 * 7 = 49.' }
  ],
  args: [{ name: 'height', cpp: 'vector<int>', java: 'int[]', py: 'height: List[int]', js: 'height' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two Pointers', content: 'Start with widest container and move the shorter pointer inward.' }],
  jsSolution: (height) => {
    let l = 0, r = height.length - 1, maxArea = 0;
    while (l < r) {
      maxArea = Math.max(maxArea, Math.min(height[l], height[r]) * (r - l));
      if (height[l] < height[r]) l++; else r--;
    }
    return maxArea;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1]]); cases.push([[1, 8, 6, 2, 5, 4, 8, 3, 7]]); cases.push([[0, 0]]); cases.push([[10000, 10000]]);
    cases.push([[1, 2, 1]]); cases.push([[4, 3, 2, 1, 4]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(2, 100), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), 0, 5000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), 0, 10000)]);
    return cases;
  }
},

// ─── 15. Subarray Sum Equals K ───
{
  slug: 'subarray-sum-equals-k',
  title: 'Subarray Sum Equals K',
  description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 2 * 10^4, -1000 <= nums[i] <= 1000, -10^7 <= k <= 10^7',
  examples: [
    { input: '[1,1,1], 2', output: '2', explanation: 'Subarrays [1,1] at index 0-1 and 1-2.' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Prefix Sum + Hash Map', content: 'Use a hash map to store prefix sum frequencies.' }],
  jsSolution: (nums, k) => {
    const map = { 0: 1 };
    let sum = 0, count = 0;
    for (const n of nums) {
      sum += n;
      if (map[sum - k]) count += map[sum - k];
      map[sum] = (map[sum] || 0) + 1;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 1], 2]); cases.push([[1, 2, 3], 3]); cases.push([[1], 0]); cases.push([[1], 1]);
    cases.push([[-1, -1, 1], 0]); cases.push([[0, 0, 0, 0], 0]); cases.push([[1, -1, 1, -1], 0]);
    for (let i = 0; i < 43; i++) { const a = randArr(randInt(1, 50), -100, 100); cases.push([a, randInt(-200, 200)]); }
    for (let i = 0; i < 50; i++) { const a = randArr(randInt(50, 500), -1000, 1000); cases.push([a, randInt(-5000, 5000)]); }
    for (let i = 0; i < 50; i++) { const a = randArr(randInt(500, 5000), -1000, 1000); cases.push([a, randInt(-10000, 10000)]); }
    return cases;
  }
},

// ─── 16. Longest Consecutive Sequence ───
{
  slug: 'longest-consecutive-sequence',
  title: 'Longest Consecutive Sequence',
  description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. Must run in O(n) time.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table', 'Union Find'],
  constraints: '0 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9',
  examples: [
    { input: '[100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive sequence is [1,2,3,4].' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Hash Set', content: 'Use a set. For each number that has no predecessor, count the streak length.' }],
  jsSolution: (nums) => {
    if (nums.length === 0) return 0;
    const set = new Set(nums);
    let longest = 0;
    for (const n of set) {
      if (!set.has(n - 1)) {
        let len = 1;
        while (set.has(n + len)) len++;
        longest = Math.max(longest, len);
      }
    }
    return longest;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[]]); cases.push([[1]]); cases.push([[100, 4, 200, 1, 3, 2]]); cases.push([[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]]);
    cases.push([[1, 1, 1]]); cases.push([[0, -1, -2, 1, 2]]); cases.push([[-1000000000, 1000000000]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(0, 100), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), -10000, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), -100000, 100000)]);
    return cases;
  }
},

// ─── 17. Top K Frequent Elements ───
{
  slug: 'top-k-frequent-elements',
  title: 'Top K Frequent Elements',
  description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table', 'Sorting', 'Heap'],
  constraints: '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4, k <= number of unique elements',
  examples: [
    { input: '[1,1,1,2,2,3], 2', output: '[1,2]', explanation: '1 appears 3 times, 2 appears 2 times.' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Bucket Sort', content: 'Count frequencies, then use bucket sort by frequency for O(n) solution.' }],
  jsSolution: (nums, k) => {
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, k).map(e => Number(e[0]));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1], 1]); cases.push([[1, 1, 1, 2, 2, 3], 2]); cases.push([[1, 2], 2]); cases.push([[3, 3, 3, 3], 1]);
    cases.push([[1, 2, 3, 4, 5], 3]);
    for (let i = 0; i < 45; i++) {
      const a = randArr(randInt(1, 50), -100, 100);
      const unique = new Set(a).size;
      cases.push([a, randInt(1, unique)]);
    }
    for (let i = 0; i < 50; i++) {
      const a = randArr(randInt(50, 500), -1000, 1000);
      const unique = new Set(a).size;
      cases.push([a, randInt(1, Math.min(unique, 50))]);
    }
    for (let i = 0; i < 50; i++) {
      const a = randArr(randInt(500, 5000), -10000, 10000);
      const unique = new Set(a).size;
      cases.push([a, randInt(1, Math.min(unique, 100))]);
    }
    return cases;
  }
},

// ─── 18. Jump Game ───
{
  slug: 'jump-game',
  title: 'Jump Game',
  description: 'Given an array of non-negative integers nums, you are initially at the first index. Each element represents your maximum jump length at that position. Return true if you can reach the last index.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 10^4, 0 <= nums[i] <= 10^5',
  examples: [
    { input: '[2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Greedy Reach', content: 'Track the furthest index you can reach. If current index exceeds it, return false.' }],
  jsSolution: (nums) => {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
      if (i > maxReach) return false;
      maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0]]); cases.push([[1]]); cases.push([[2, 3, 1, 1, 4]]); cases.push([[3, 2, 1, 0, 4]]);
    cases.push([[0, 1]]); cases.push([[1, 0, 0, 0]]); cases.push([[100000]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 50), 0, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 0, 1000)]);
    return cases;
  }
},

// ─── 19. Set Matrix Zeroes ───
{
  slug: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  description: 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. Do it in-place and return the matrix.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Matrix', 'Hash Table'],
  constraints: '1 <= m, n <= 200, -2^31 <= matrix[i][j] <= 2^31 - 1',
  examples: [
    { input: '[[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]', explanation: 'Element at [1][1] is 0, so row 1 and column 1 become 0.' }
  ],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Mark First Row/Col', content: 'Use first row and column as markers to save space.' }],
  jsSolution: (matrix) => {
    const m = matrix.length, n = matrix[0].length;
    const mat = matrix.map(r => [...r]);
    const zeroRows = new Set(), zeroCols = new Set();
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (mat[i][j] === 0) { zeroRows.add(i); zeroCols.add(j); }
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (zeroRows.has(i) || zeroCols.has(j)) mat[i][j] = 0;
    return mat;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0]]]); cases.push([[[1]]]); cases.push([[[1, 1, 1], [1, 0, 1], [1, 1, 1]]]);
    cases.push([[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]]);
    for (let i = 0; i < 46; i++) {
      const m = randInt(1, 10), n = randInt(1, 10);
      cases.push([Array.from({ length: m }, () => randArr(n, -10, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(10, 50), n = randInt(10, 50);
      cases.push([Array.from({ length: m }, () => randArr(n, -100, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(50, 200), n = randInt(50, 200);
      cases.push([Array.from({ length: m }, () => randArr(n, -1000, 1000))]);
    }
    return cases;
  }
},

// ─── 20. Spiral Matrix ───
{
  slug: 'spiral-matrix',
  title: 'Spiral Matrix',
  description: 'Given an m x n matrix, return all elements of the matrix in spiral order (clockwise from top-left).',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Matrix', 'Simulation'],
  constraints: '1 <= m, n <= 10, -100 <= matrix[i][j] <= 100',
  examples: [
    { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Spiral from outside to inside.' }
  ],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Layer by Layer', content: 'Peel off the outermost layer in each iteration.' }],
  jsSolution: (matrix) => {
    const res = [];
    let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
      for (let i = left; i <= right; i++) res.push(matrix[top][i]);
      top++;
      for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
      right--;
      if (top <= bottom) { for (let i = right; i >= left; i--) res.push(matrix[bottom][i]); bottom--; }
      if (left <= right) { for (let i = bottom; i >= top; i--) res.push(matrix[i][left]); left++; }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1]]]); cases.push([[[1, 2, 3]]]); cases.push([[[1], [2], [3]]]);
    cases.push([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]); cases.push([[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]]);
    for (let i = 0; i < 45; i++) {
      const m = randInt(1, 10), n = randInt(1, 10);
      cases.push([Array.from({ length: m }, () => randArr(n, -100, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(1, 10), n = randInt(1, 10);
      cases.push([Array.from({ length: m }, () => randArr(n, -100, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(1, 10), n = randInt(1, 10);
      cases.push([Array.from({ length: m }, () => randArr(n, -100, 100))]);
    }
    return cases;
  }
},

// ─── 21. Rotate Image ───
{
  slug: 'rotate-image',
  title: 'Rotate Image',
  description: 'Given an n x n 2D matrix representing an image, rotate the image by 90 degrees clockwise. Return the rotated matrix.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Matrix', 'Math'],
  constraints: '1 <= n <= 20, -1000 <= matrix[i][j] <= 1000',
  examples: [
    { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: 'Rotate 90 degrees clockwise.' }
  ],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Transpose + Reverse', content: 'Transpose the matrix then reverse each row.' }],
  jsSolution: (matrix) => {
    const n = matrix.length;
    const res = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) res[j][n - 1 - i] = matrix[i][j];
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1]]]); cases.push([[[1, 2], [3, 4]]]); cases.push([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 10);
      cases.push([Array.from({ length: n }, () => randArr(n, -1000, 1000))]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(5, 15);
      cases.push([Array.from({ length: n }, () => randArr(n, -1000, 1000))]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(10, 20);
      cases.push([Array.from({ length: n }, () => randArr(n, -1000, 1000))]);
    }
    return cases;
  }
},

// ─── 22. Gas Station ───
{
  slug: 'gas-station',
  title: 'Gas Station',
  description: 'There are n gas stations along a circular route. You are given gas[i] and cost[i]. Return the starting station index if you can travel around the circuit once clockwise, or -1 if impossible.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy'],
  constraints: '1 <= n <= 10^5, 0 <= gas[i], cost[i] <= 10^4',
  examples: [
    { input: '[1,2,3,4,5], [3,4,5,1,2]', output: '3', explanation: 'Start at station 3 with 4 gas units.' }
  ],
  args: [
    { name: 'gas', cpp: 'vector<int>', java: 'int[]', py: 'gas: List[int]', js: 'gas' },
    { name: 'cost', cpp: 'vector<int>', java: 'int[]', py: 'cost: List[int]', js: 'cost' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Single Pass', content: 'If total gas >= total cost, a solution exists. Track deficit to find the start.' }],
  jsSolution: (gas, cost) => {
    let totalTank = 0, currTank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
      const diff = gas[i] - cost[i];
      totalTank += diff;
      currTank += diff;
      if (currTank < 0) { start = i + 1; currTank = 0; }
    }
    return totalTank >= 0 ? start : -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]]); cases.push([[2, 3, 4], [3, 4, 3]]); cases.push([[5], [4]]);
    cases.push([[1], [2]]); cases.push([[0], [0]]); cases.push([[3, 1, 1], [1, 2, 2]]);
    for (let i = 0; i < 44; i++) { const n = randInt(1, 50); cases.push([randArr(n, 0, 100), randArr(n, 0, 100)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 0, 1000), randArr(n, 0, 1000)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, 0, 10000), randArr(n, 0, 10000)]); }
    return cases;
  }
},

// ─── 23. Sort Colors ───
{
  slug: 'sort-colors',
  title: 'Sort Colors',
  description: 'Given an array nums with n objects colored red (0), white (1), and blue (2), sort them in-place so that they are in order. Return the sorted array.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= n <= 300, nums[i] is 0, 1, or 2',
  examples: [
    { input: '[2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: 'Dutch National Flag partitioning.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Three Pointers', content: 'Use low, mid, and high pointers to partition in one pass.' }],
  jsSolution: (nums) => [...nums].sort((a, b) => a - b),
  inputGenerator: () => {
    const cases = [];
    cases.push([[0]]); cases.push([[2, 0, 2, 1, 1, 0]]); cases.push([[2, 0, 1]]); cases.push([[0, 0, 0]]);
    cases.push([[2, 2, 2]]); cases.push([[1, 1, 1]]); cases.push([[0, 1, 2]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 30), 0, 2)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 100), 0, 2)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 300), 0, 2)]);
    return cases;
  }
},

// ─── 24. H-Index ───
{
  slug: 'h-index',
  title: 'H-Index',
  description: 'Given an array citations where citations[i] indicates the number of citations a researcher received for their ith paper, return the researcher\'s h-index (the maximum h such that h papers have at least h citations).',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sorting', 'Counting Sort'],
  constraints: '1 <= n <= 5000, 0 <= citations[i] <= 1000',
  examples: [
    { input: '[3,0,6,1,5]', output: '3', explanation: '3 papers have at least 3 citations.' }
  ],
  args: [{ name: 'citations', cpp: 'vector<int>', java: 'int[]', py: 'citations: List[int]', js: 'citations' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Counting Sort', content: 'Use a bucket of size n+1 to count citations, then scan from the top.' }],
  jsSolution: (citations) => {
    const n = citations.length;
    const buckets = Array(n + 1).fill(0);
    for (const c of citations) buckets[Math.min(c, n)]++;
    let total = 0;
    for (let i = n; i >= 0; i--) { total += buckets[i]; if (total >= i) return i; }
    return 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 0, 6, 1, 5]]); cases.push([[1, 3, 1]]); cases.push([[0]]); cases.push([[100]]);
    cases.push([[0, 0, 0, 0]]); cases.push([[1, 1, 1, 1, 1]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 0, 1000)]);
    return cases;
  }
},

// ─── 25. Trapping Rain Water ───
{
  slug: 'trapping-rain-water',
  title: 'Trapping Rain Water',
  description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
  constraints: '1 <= n <= 2 * 10^4, 0 <= height[i] <= 10^5',
  examples: [
    { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' }
  ],
  args: [{ name: 'height', cpp: 'vector<int>', java: 'int[]', py: 'height: List[int]', js: 'height' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two Pointers', content: 'Use left and right pointers tracking max heights from each side.' }],
  jsSolution: (height) => {
    let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
    while (l < r) {
      if (height[l] < height[r]) { lMax = Math.max(lMax, height[l]); water += lMax - height[l]; l++; }
      else { rMax = Math.max(rMax, height[r]); water += rMax - height[r]; r--; }
    }
    return water;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]]); cases.push([[4, 2, 0, 3, 2, 5]]); cases.push([[0]]);
    cases.push([[1, 1]]); cases.push([[5, 0, 5]]); cases.push([[0, 0, 0]]); cases.push([[3, 0, 0, 2, 0, 4]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 50), 0, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 100000)]);
    return cases;
  }
}

];

export default problems;
