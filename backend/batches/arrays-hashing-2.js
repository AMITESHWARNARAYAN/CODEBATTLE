// Arrays & Hashing — Batch 2 (25 more problems, #26–50)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

export const problems = [

// ─── 26. First Missing Positive ───
{
  slug: 'first-missing-positive',
  title: 'First Missing Positive',
  description: 'Given an unsorted integer array nums, return the smallest missing positive integer. Must run in O(n) time and O(1) extra space.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table'],
  constraints: '1 <= nums.length <= 10^5, -2^31 <= nums[i] <= 2^31 - 1',
  examples: [
    { input: '[3,4,-1,1]', output: '2', explanation: '1 is present, 2 is missing.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Cyclic Sort', content: 'Place each positive number at its correct index (nums[i] at index nums[i]-1).' }],
  jsSolution: (nums) => {
    const n = nums.length;
    const a = [...nums];
    for (let i = 0; i < n; i++) {
      while (a[i] > 0 && a[i] <= n && a[a[i] - 1] !== a[i]) {
        [a[a[i] - 1], a[i]] = [a[i], a[a[i] - 1]];
      }
    }
    for (let i = 0; i < n; i++) if (a[i] !== i + 1) return i + 1;
    return n + 1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 0]]); cases.push([[3, 4, -1, 1]]); cases.push([[7, 8, 9, 11, 12]]);
    cases.push([[1]]); cases.push([[2]]); cases.push([[-1, -2, -3]]); cases.push([[1, 2, 3, 4, 5]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 100), -10, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), -100000, 100000)]);
    return cases;
  }
},

// ─── 27. Maximum Gap ───
{
  slug: 'maximum-gap',
  title: 'Maximum Gap',
  description: 'Given an integer array nums, return the maximum difference between two successive elements in its sorted form. If the array has fewer than 2 elements, return 0.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sorting', 'Bucket Sort'],
  constraints: '1 <= nums.length <= 10^5, 0 <= nums[i] <= 10^9',
  examples: [
    { input: '[3,6,9,1]', output: '3', explanation: 'Sorted: [1,3,6,9]. Max gap is 3 (between 3 and 6, or 6 and 9).' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bucket Sort', content: 'Max gap is at least ceil((max-min)/(n-1)). Use buckets of that size.' }],
  jsSolution: (nums) => {
    if (nums.length < 2) return 0;
    const sorted = [...nums].sort((a, b) => a - b);
    let maxGap = 0;
    for (let i = 1; i < sorted.length; i++) maxGap = Math.max(maxGap, sorted[i] - sorted[i - 1]);
    return maxGap;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 6, 9, 1]]); cases.push([[10]]); cases.push([[1, 10000000]]); cases.push([[1, 1, 1, 1]]);
    cases.push([[0, 0]]); cases.push([[5, 5, 5]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 100), 0, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), 0, 1000000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), 0, 1000000000)]);
    return cases;
  }
},

// ─── 28. Shortest Unsorted Continuous Subarray ───
{
  slug: 'shortest-unsorted-subarray',
  title: 'Shortest Unsorted Continuous Subarray',
  description: 'Given an integer array nums, find the shortest subarray such that sorting only this subarray makes the whole array sorted. Return its length.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers', 'Sorting', 'Stack'],
  constraints: '1 <= nums.length <= 10^4, -10^5 <= nums[i] <= 10^5',
  examples: [
    { input: '[2,6,4,8,10,9,15]', output: '5', explanation: 'Sort subarray [6,4,8,10,9] to make the whole array sorted.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Compare with Sorted', content: 'Compare original with sorted version to find leftmost and rightmost mismatch.' }],
  jsSolution: (nums) => {
    const sorted = [...nums].sort((a, b) => a - b);
    let l = 0, r = nums.length - 1;
    while (l < nums.length && nums[l] === sorted[l]) l++;
    while (r > l && nums[r] === sorted[r]) r--;
    return r - l + (l === r && nums[l] === sorted[l] ? 0 : 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 6, 4, 8, 10, 9, 15]]); cases.push([[1, 2, 3, 4]]); cases.push([[1]]); cases.push([[2, 1]]);
    cases.push([[1, 3, 2, 2, 2]]); cases.push([[1, 2, 3, 3, 3]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), -100000, 100000)]);
    return cases;
  }
},

// ─── 29. Largest Rectangle in Histogram ───
{
  slug: 'largest-rectangle-histogram',
  title: 'Largest Rectangle in Histogram',
  description: 'Given an array of integers heights representing the histogram bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= heights.length <= 10^5, 0 <= heights[i] <= 10^4',
  examples: [
    { input: '[2,1,5,6,2,3]', output: '10', explanation: 'Rectangle of height 5 and width 2 gives area 10.' }
  ],
  args: [{ name: 'heights', cpp: 'vector<int>', java: 'int[]', py: 'heights: List[int]', js: 'heights' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Monotonic Stack', content: 'Use a stack to track indices of increasing heights.' }],
  jsSolution: (heights) => {
    const stack = [];
    let maxArea = 0;
    const h = [...heights, 0];
    for (let i = 0; i < h.length; i++) {
      while (stack.length && h[stack[stack.length - 1]] > h[i]) {
        const height = h[stack.pop()];
        const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
        maxArea = Math.max(maxArea, height * width);
      }
      stack.push(i);
    }
    return maxArea;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 5, 6, 2, 3]]); cases.push([[2, 4]]); cases.push([[1]]); cases.push([[0]]);
    cases.push([[1, 1, 1, 1]]); cases.push([[6, 7, 5, 2, 4, 5, 0, 3]]); cases.push([[10000]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 10000)]);
    return cases;
  }
},

// ─── 30. Sliding Window Maximum ───
{
  slug: 'sliding-window-maximum',
  title: 'Sliding Window Maximum',
  description: 'Given an array nums and a sliding window of size k moving from left to right, return the max value in each window position.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Queue', 'Sliding Window', 'Monotonic Queue'],
  constraints: '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4, 1 <= k <= nums.length',
  examples: [
    { input: '[1,3,-1,-3,5,3,6,7], 3', output: '[3,3,5,5,6,7]', explanation: 'Max of each window of size 3.' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Deque', content: 'Use a monotonic deque to maintain decreasing order of elements in the window.' }],
  jsSolution: (nums, k) => {
    const deque = [], res = [];
    for (let i = 0; i < nums.length; i++) {
      while (deque.length && deque[0] < i - k + 1) deque.shift();
      while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
      deque.push(i);
      if (i >= k - 1) res.push(nums[deque[0]]);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, -1, -3, 5, 3, 6, 7], 3]); cases.push([[1], 1]); cases.push([[1, -1], 1]);
    cases.push([[9, 11], 2]); cases.push([[4, -2], 2]); cases.push([[7, 2, 4], 2]);
    for (let i = 0; i < 44; i++) { const n = randInt(1, 100); cases.push([randArr(n, -100, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(100, 1000); cases.push([randArr(n, -1000, 1000), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(1000, 10000); cases.push([randArr(n, -10000, 10000), randInt(1, n)]); }
    return cases;
  }
},

// ─── 31. Longest Increasing Subsequence ───
{
  slug: 'longest-increasing-subseq',
  title: 'Longest Increasing Subsequence',
  description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Binary Search', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 2500, -10^4 <= nums[i] <= 10^4',
  examples: [
    { input: '[10,9,2,5,3,7,101,18]', output: '4', explanation: 'The LIS is [2,3,7,101], length 4.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Patience Sorting', content: 'Maintain tails array and use binary search for O(n log n) solution.' }],
  jsSolution: (nums) => {
    const tails = [];
    for (const n of nums) {
      let lo = 0, hi = tails.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < n) lo = mid + 1; else hi = mid; }
      tails[lo] = n;
    }
    return tails.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[10, 9, 2, 5, 3, 7, 101, 18]]); cases.push([[0, 1, 0, 3, 2, 3]]); cases.push([[7, 7, 7, 7]]);
    cases.push([[1]]); cases.push([[5, 4, 3, 2, 1]]); cases.push([[1, 2, 3, 4, 5]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 2500), -10000, 10000)]);
    return cases;
  }
},

// ─── 32. Maximum Sum Circular Subarray ───
{
  slug: 'max-sum-circular-subarray',
  title: 'Maximum Sum Circular Subarray',
  description: 'Given a circular integer array nums, find the maximum possible sum of a non-empty subarray (the array wraps around).',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Dynamic Programming', 'Queue'],
  constraints: '1 <= nums.length <= 3 * 10^4, -3 * 10^4 <= nums[i] <= 3 * 10^4',
  examples: [
    { input: '[1,-2,3,-2]', output: '3', explanation: 'Subarray [3] has maximum sum 3.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Max Subarray + Min Subarray', content: 'Answer is max(maxSubarray, totalSum - minSubarray). Handle all-negative edge case.' }],
  jsSolution: (nums) => {
    let maxSum = nums[0], curMax = 0, minSum = nums[0], curMin = 0, total = 0;
    for (const n of nums) {
      curMax = Math.max(n, curMax + n);
      maxSum = Math.max(maxSum, curMax);
      curMin = Math.min(n, curMin + n);
      minSum = Math.min(minSum, curMin);
      total += n;
    }
    return maxSum > 0 ? Math.max(maxSum, total - minSum) : maxSum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, -2, 3, -2]]); cases.push([[5, -3, 5]]); cases.push([[3, -1, 2, -1]]); cases.push([[3, -2, 2, -3]]);
    cases.push([[-1, -2, -3]]); cases.push([[1]]); cases.push([[-3, -2, -3]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 100), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), -30000, 30000)]);
    return cases;
  }
},

// ─── 33. Count Inversions ───
{
  slug: 'count-inversions',
  title: 'Count Inversions',
  description: 'Given an array of integers, count the number of inversions. An inversion is a pair (i, j) where i < j but nums[i] > nums[j].',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Divide and Conquer', 'Merge Sort'],
  constraints: '1 <= nums.length <= 5 * 10^4, -10^9 <= nums[i] <= 10^9',
  examples: [
    { input: '[2,4,1,3,5]', output: '3', explanation: 'Inversions: (2,1), (4,1), (4,3).' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Merge Sort', content: 'Count inversions during merge step of merge sort.' }],
  jsSolution: (nums) => {
    let count = 0;
    function mergeSort(arr) {
      if (arr.length <= 1) return arr;
      const mid = arr.length >> 1;
      const left = mergeSort(arr.slice(0, mid));
      const right = mergeSort(arr.slice(mid));
      const merged = [];
      let i = 0, j = 0;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) { merged.push(left[i++]); }
        else { merged.push(right[j++]); count += left.length - i; }
      }
      while (i < left.length) merged.push(left[i++]);
      while (j < right.length) merged.push(right[j++]);
      return merged;
    }
    mergeSort([...nums]);
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1]]); cases.push([[2, 1]]); cases.push([[1, 2]]); cases.push([[2, 4, 1, 3, 5]]);
    cases.push([[5, 4, 3, 2, 1]]); cases.push([[1, 2, 3, 4, 5]]); cases.push([[1, 1, 1]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 100), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 1000), -10000, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(1000, 10000), -1000000000, 1000000000)]);
    return cases;
  }
},

// ─── 34. Pascal's Triangle Row ───
{
  slug: 'pascals-triangle-row',
  title: "Pascal's Triangle Row",
  description: 'Given an integer rowIndex, return the rowIndex-th (0-indexed) row of Pascal\'s triangle.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '0 <= rowIndex <= 33',
  examples: [
    { input: '3', output: '[1,3,3,1]', explanation: 'Row 3 of Pascal\'s triangle.' }
  ],
  args: [{ name: 'rowIndex', cpp: 'int', java: 'int', py: 'rowIndex: int', js: 'rowIndex' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Iterative Build', content: 'Start with [1] and build up row by row using previous row.' }],
  jsSolution: (rowIndex) => {
    let row = [1];
    for (let i = 1; i <= rowIndex; i++) {
      const newRow = [1];
      for (let j = 1; j < i; j++) newRow.push(row[j - 1] + row[j]);
      newRow.push(1);
      row = newRow;
    }
    return row;
  },
  inputGenerator: () => {
    const cases = [];
    for (let i = 0; i <= 33; i++) cases.push([i]);
    // Fill rest with random values from valid range
    for (let i = 0; i < 117; i++) cases.push([randInt(0, 33)]);
    return cases;
  }
},

// ─── 35. Maximum Average Subarray I ───
{
  slug: 'max-average-subarray',
  title: 'Maximum Average Subarray I',
  description: 'Given an integer array nums and an integer k, find the contiguous subarray of length k that has the maximum average value and return that value.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= k <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4',
  examples: [
    { input: '[1,12,-5,-6,50,3], 4', output: '12.75', explanation: 'Max average subarray is [12,-5,-6,50] = 51/4 = 12.75.' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Sliding Window', content: 'Compute sum of first k elements, then slide the window.' }],
  jsSolution: (nums, k) => {
    let sum = 0;
    for (let i = 0; i < k; i++) sum += nums[i];
    let maxSum = sum;
    for (let i = k; i < nums.length; i++) {
      sum += nums[i] - nums[i - k];
      maxSum = Math.max(maxSum, sum);
    }
    return maxSum / k;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 12, -5, -6, 50, 3], 4]); cases.push([[5], 1]); cases.push([[0, 4, 0, 3, 2], 1]);
    cases.push([[-1, -2, -3], 2]); cases.push([[10000, -10000], 2]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 100); cases.push([randArr(n, -100, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(100, 1000); cases.push([randArr(n, -1000, 1000), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(1000, 10000); cases.push([randArr(n, -10000, 10000), randInt(1, n)]); }
    return cases;
  }
},

// ─── 36. Array Partition ───
{
  slug: 'array-partition',
  title: 'Array Partition',
  description: 'Given an integer array nums of 2n integers, group them into n pairs and return the maximum sum of min(a_i, b_i) for all pairs.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sorting', 'Greedy'],
  constraints: '1 <= n <= 10^4, -10^4 <= nums[i] <= 10^4',
  examples: [
    { input: '[1,4,3,2]', output: '4', explanation: 'Pairs (1,2) and (3,4) give min(1,2)+min(3,4)=1+3=4.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort', content: 'Sort and sum every other element starting from index 0.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    let sum = 0;
    for (let i = 0; i < nums.length; i += 2) sum += nums[i];
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 4, 3, 2]]); cases.push([[6, 2, 6, 5, 1, 2]]); cases.push([[1, 1]]);
    cases.push([[-1, -2]]); cases.push([[-10000, 10000]]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 50); cases.push([randArr(2 * n, -100, 100)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(2 * n, -1000, 1000)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 5000); cases.push([randArr(2 * n, -10000, 10000)]); }
    return cases;
  }
},

// ─── 37. Two Sum II - Sorted ───
{
  slug: 'two-sum-sorted',
  title: 'Two Sum II - Input Array Is Sorted',
  description: 'Given a 1-indexed sorted array numbers and a target, find two numbers that add up to target. Return their 1-indexed positions [index1, index2].',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers', 'Binary Search'],
  constraints: '2 <= numbers.length <= 3 * 10^4, -1000 <= numbers[i] <= 1000, numbers is sorted',
  examples: [
    { input: '[2,7,11,15], 9', output: '[1,2]', explanation: 'numbers[1] + numbers[2] = 2 + 7 = 9.' }
  ],
  args: [
    { name: 'numbers', cpp: 'vector<int>', java: 'int[]', py: 'numbers: List[int]', js: 'numbers' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Pointers', content: 'Use left and right pointers since array is sorted.' }],
  jsSolution: (numbers, target) => {
    let l = 0, r = numbers.length - 1;
    while (l < r) {
      const sum = numbers[l] + numbers[r];
      if (sum === target) return [l + 1, r + 1];
      else if (sum < target) l++;
      else r--;
    }
    return [-1, -1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 7, 11, 15], 9]); cases.push([[2, 3, 4], 6]); cases.push([[-1, 0], -1]);
    cases.push([[1, 2], 3]); cases.push([[-1000, 1000], 0]);
    // Ensure a valid pair exists
    for (let i = 0; i < 45; i++) {
      const n = randInt(2, 50);
      const arr = randArr(n, -100, 100).sort((a, b) => a - b);
      const i1 = randInt(0, n - 2), i2 = randInt(i1 + 1, n - 1);
      cases.push([arr, arr[i1] + arr[i2]]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500);
      const arr = randArr(n, -1000, 1000).sort((a, b) => a - b);
      const i1 = randInt(0, n - 2), i2 = randInt(i1 + 1, n - 1);
      cases.push([arr, arr[i1] + arr[i2]]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 5000);
      const arr = randArr(n, -1000, 1000).sort((a, b) => a - b);
      const i1 = randInt(0, n - 2), i2 = randInt(i1 + 1, n - 1);
      cases.push([arr, arr[i1] + arr[i2]]);
    }
    return cases;
  }
},

// ─── 38. Minimum Size Subarray Sum ───
{
  slug: 'min-size-subarray-sum',
  title: 'Minimum Size Subarray Sum',
  description: 'Given a target and a positive integer array nums, return the minimal length of a subarray whose sum is >= target. If none, return 0.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sliding Window', 'Binary Search', 'Prefix Sum'],
  constraints: '1 <= target <= 10^9, 1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^4',
  examples: [
    { input: '7, [2,3,1,2,4,3]', output: '2', explanation: 'Subarray [4,3] has sum 7 and length 2.' }
  ],
  args: [
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' },
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Expand right pointer to add elements, shrink left to minimize window.' }],
  jsSolution: (target, nums) => {
    let left = 0, sum = 0, minLen = Infinity;
    for (let right = 0; right < nums.length; right++) {
      sum += nums[right];
      while (sum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        sum -= nums[left++];
      }
    }
    return minLen === Infinity ? 0 : minLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([7, [2, 3, 1, 2, 4, 3]]); cases.push([4, [1, 4, 4]]); cases.push([11, [1, 1, 1, 1, 1, 1, 1, 1]]);
    cases.push([1, [1]]); cases.push([100, [1]]); cases.push([15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]]);
    for (let i = 0; i < 44; i++) { const a = randArr(randInt(1, 50), 1, 100); cases.push([randInt(1, 500), a]); }
    for (let i = 0; i < 50; i++) { const a = randArr(randInt(50, 500), 1, 1000); cases.push([randInt(1, 10000), a]); }
    for (let i = 0; i < 50; i++) { const a = randArr(randInt(500, 10000), 1, 10000); cases.push([randInt(1, 1000000000), a]); }
    return cases;
  }
},

// ─── 39. Next Permutation ───
{
  slug: 'next-permutation',
  title: 'Next Permutation',
  description: 'Given an array of integers nums, rearrange it to the next lexicographically greater permutation. If the array is the last permutation, return the first (sorted ascending).',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= nums.length <= 100, 0 <= nums[i] <= 100',
  examples: [
    { input: '[1,2,3]', output: '[1,3,2]', explanation: 'Next permutation after [1,2,3] is [1,3,2].' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Find Pivot', content: 'Find rightmost pair where nums[i] < nums[i+1], swap with next larger element, reverse suffix.' }],
  jsSolution: (nums) => {
    const a = [...nums], n = a.length;
    let i = n - 2;
    while (i >= 0 && a[i] >= a[i + 1]) i--;
    if (i >= 0) {
      let j = n - 1;
      while (a[j] <= a[i]) j--;
      [a[i], a[j]] = [a[j], a[i]];
    }
    let l = i + 1, r = n - 1;
    while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
    return a;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]); cases.push([[3, 2, 1]]); cases.push([[1, 1, 5]]); cases.push([[1]]);
    cases.push([[1, 1]]); cases.push([[2, 3, 1]]); cases.push([[1, 5, 1]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 20), 0, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 100), 0, 100)]);
    return cases;
  }
},

// ─── 40. Left and Right Sum Differences ───
{
  slug: 'left-right-sum-diff',
  title: 'Left and Right Sum Differences',
  description: 'Given a 0-indexed integer array nums, find for each index the absolute difference between the left sum and right sum. leftSum[i] = sum of elements to the left of i, rightSum[i] = sum of elements to the right of i.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 1000, 1 <= nums[i] <= 10^5',
  examples: [
    { input: '[10,4,8,3]', output: '[15,1,11,22]', explanation: 'abs(0-15)=15, abs(10-11)=1, abs(14-3)=11, abs(22-0)=22' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Prefix Sum', content: 'Compute total sum, then track left sum as you iterate.' }],
  jsSolution: (nums) => {
    const total = nums.reduce((a, b) => a + b, 0);
    const res = [];
    let leftSum = 0;
    for (let i = 0; i < nums.length; i++) {
      const rightSum = total - leftSum - nums[i];
      res.push(Math.abs(leftSum - rightSum));
      leftSum += nums[i];
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[10, 4, 8, 3]]); cases.push([[1]]); cases.push([[1, 1, 1, 1]]); cases.push([[100000]]);
    for (let i = 0; i < 46; i++) cases.push([randArr(randInt(1, 50), 1, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), 1, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(200, 1000), 1, 100000)]);
    return cases;
  }
},

// ─── 41. Count Elements With Maximum Frequency ───
{
  slug: 'count-max-freq-elements',
  title: 'Count Elements With Maximum Frequency',
  description: 'Given an array nums of positive integers, return the total frequency of elements that have the maximum frequency.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table', 'Counting'],
  constraints: '1 <= nums.length <= 100, 1 <= nums[i] <= 100',
  examples: [
    { input: '[1,2,2,3,1,4]', output: '4', explanation: '1 and 2 both appear 2 times (max freq). Total = 2+2 = 4.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count Frequencies', content: 'Count all frequencies, find the max, then sum counts equal to max.' }],
  jsSolution: (nums) => {
    const freq = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;
    const maxF = Math.max(...Object.values(freq));
    return Object.values(freq).filter(f => f === maxF).reduce((a, b) => a + b, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 2, 3, 1, 4]]); cases.push([[1, 2, 3, 4, 5]]); cases.push([[1, 1, 1, 1]]);
    cases.push([[1]]); cases.push([[5, 5, 5, 3, 3, 3]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 30), 1, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 1, 100)]);
    return cases;
  }
},

// ─── 42. Kids With Greatest Candies ───
{
  slug: 'kids-with-greatest-candies',
  title: 'Kids With the Greatest Number of Candies',
  description: 'Given candies[i] representing the number of candies the ith kid has and an integer extraCandies, return a boolean array where result[i] is true if giving all extra candies to kid i makes them have the greatest number.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array'],
  constraints: '2 <= n <= 100, 1 <= candies[i] <= 100, 1 <= extraCandies <= 50',
  examples: [
    { input: '[2,3,5,1,3], 3', output: '[true,true,true,false,true]', explanation: 'With 3 extra: [5,6,8,4,6]. Max existing is 5.' }
  ],
  args: [
    { name: 'candies', cpp: 'vector<int>', java: 'int[]', py: 'candies: List[int]', js: 'candies' },
    { name: 'extraCandies', cpp: 'int', java: 'int', py: 'extraCandies: int', js: 'extraCandies' }
  ],
  retType: { cpp: 'vector<bool>', java: 'boolean[]', py: 'List[bool]' },
  hints: [{ title: 'Find Max', content: 'Find max in array, then check if each element + extra >= max.' }],
  jsSolution: (candies, extraCandies) => {
    const maxC = Math.max(...candies);
    return candies.map(c => c + extraCandies >= maxC);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 3, 5, 1, 3], 3]); cases.push([[4, 2, 1, 1, 2], 1]); cases.push([[12, 1, 12], 10]);
    cases.push([[1, 1], 1]); cases.push([[100, 100], 50]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(2, 30), 1, 100), randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 1, 100), randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 1, 100), randInt(1, 50)]);
    return cases;
  }
},

// ─── 43. Find Common Elements in Three Arrays ───
{
  slug: 'find-common-elements-three',
  title: 'Find Common Elements in Three Arrays',
  description: 'Given three integer arrays, return a sorted array of elements that appear in at least two of the three arrays.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table'],
  constraints: '1 <= arr.length <= 100, 1 <= arr[i] <= 100',
  examples: [
    { input: '[1,1,3,2], [2,3], [3]', output: '[2,3]', explanation: '2 appears in arr1 and arr2. 3 appears in all three.' }
  ],
  args: [
    { name: 'arr1', cpp: 'vector<int>', java: 'int[]', py: 'arr1: List[int]', js: 'arr1' },
    { name: 'arr2', cpp: 'vector<int>', java: 'int[]', py: 'arr2: List[int]', js: 'arr2' },
    { name: 'arr3', cpp: 'vector<int>', java: 'int[]', py: 'arr3: List[int]', js: 'arr3' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Count Sets', content: 'Create a set for each array, count how many sets each element appears in.' }],
  jsSolution: (arr1, arr2, arr3) => {
    const s1 = new Set(arr1), s2 = new Set(arr2), s3 = new Set(arr3);
    const count = {};
    for (const s of [s1, s2, s3]) for (const v of s) count[v] = (count[v] || 0) + 1;
    return Object.entries(count).filter(([_, c]) => c >= 2).map(([k]) => Number(k)).sort((a, b) => a - b);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 3, 2], [2, 3], [3]]); cases.push([[1], [1], [1]]); cases.push([[1], [2], [3]]);
    cases.push([[1, 2], [2, 3], [3, 1]]);
    for (let i = 0; i < 46; i++) cases.push([randArr(randInt(1, 30), 1, 30), randArr(randInt(1, 30), 1, 30), randArr(randInt(1, 30), 1, 30)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 1, 50), randArr(randInt(30, 60), 1, 50), randArr(randInt(30, 60), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 1, 100), randArr(randInt(60, 100), 1, 100), randArr(randInt(60, 100), 1, 100)]);
    return cases;
  }
},

// ─── 44. Candy Distribution (Hard) ───
{
  slug: 'candy-distribution',
  title: 'Candy Distribution',
  description: 'There are n children in a line with ratings. Each child must have at least one candy. Children with higher ratings than their neighbors must get more candies. Return the minimum total candies needed.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy'],
  constraints: '1 <= n <= 2 * 10^4, 0 <= ratings[i] <= 2 * 10^4',
  examples: [
    { input: '[1,0,2]', output: '5', explanation: 'Give [2,1,2] candies for total of 5.' }
  ],
  args: [{ name: 'ratings', cpp: 'vector<int>', java: 'int[]', py: 'ratings: List[int]', js: 'ratings' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two Passes', content: 'Left-to-right pass for increasing, right-to-left for decreasing. Take max.' }],
  jsSolution: (ratings) => {
    const n = ratings.length;
    const candies = Array(n).fill(1);
    for (let i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
    for (let i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    return candies.reduce((a, b) => a + b, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 2]]); cases.push([[1, 2, 2]]); cases.push([[1]]); cases.push([[1, 1, 1]]);
    cases.push([[5, 4, 3, 2, 1]]); cases.push([[1, 2, 3, 4, 5]]); cases.push([[1, 3, 2, 2, 1]]);
    for (let i = 0; i < 43; i++) cases.push([randArr(randInt(1, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 20000)]);
    return cases;
  }
},

// ─── 45. Jump Game II ───
{
  slug: 'jump-game-ii',
  title: 'Jump Game II',
  description: 'Given a 0-indexed array nums, you start at index 0. The value at each position is your maximum jump length. Return the minimum number of jumps to reach the last index.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 10^4, 0 <= nums[i] <= 1000',
  examples: [
    { input: '[2,3,1,1,4]', output: '2', explanation: 'Jump to index 1, then jump to the last index.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BFS/Greedy', content: 'Track the farthest reachable position within each jump range.' }],
  jsSolution: (nums) => {
    let jumps = 0, curEnd = 0, farthest = 0;
    for (let i = 0; i < nums.length - 1; i++) {
      farthest = Math.max(farthest, i + nums[i]);
      if (i === curEnd) { jumps++; curEnd = farthest; }
    }
    return jumps;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 3, 1, 1, 4]]); cases.push([[2, 3, 0, 1, 4]]); cases.push([[1]]); cases.push([[1, 1, 1, 1]]);
    cases.push([[10, 0, 0, 0, 0]]); cases.push([[1, 2, 3]]);
    // Guarantee reachable
    for (let i = 0; i < 44; i++) {
      const n = randInt(1, 50);
      const a = randArr(n, 1, 10);
      cases.push([a]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500);
      const a = randArr(n, 1, 100);
      cases.push([a]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 5000);
      const a = randArr(n, 1, 1000);
      cases.push([a]);
    }
    return cases;
  }
},

// ─── 46. Split Array Largest Sum ───
{
  slug: 'split-array-largest-sum',
  title: 'Split Array Largest Sum',
  description: 'Given an integer array nums and an integer k, split nums into k non-empty continuous subarrays such that the largest sum among all subarrays is minimized. Return the minimized largest sum.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Binary Search', 'Dynamic Programming', 'Greedy'],
  constraints: '1 <= nums.length <= 1000, 0 <= nums[i] <= 10^6, 1 <= k <= min(50, nums.length)',
  examples: [
    { input: '[7,2,5,10,8], 2', output: '18', explanation: 'Split as [7,2,5] and [10,8]. Sums are 14 and 18. Minimized largest is 18.' }
  ],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search', content: 'Binary search on the answer. For a given max sum, check if you can split into <= k subarrays.' }],
  jsSolution: (nums, k) => {
    let lo = Math.max(...nums), hi = nums.reduce((a, b) => a + b, 0);
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      let splits = 1, curSum = 0;
      for (const n of nums) {
        if (curSum + n > mid) { splits++; curSum = n; }
        else curSum += n;
      }
      if (splits <= k) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[7, 2, 5, 10, 8], 2]); cases.push([[1, 2, 3, 4, 5], 2]); cases.push([[1], 1]);
    cases.push([[1, 4, 4], 3]); cases.push([[10, 5, 13, 4, 8, 4, 5, 11, 14, 9, 16, 10, 20, 8], 8]);
    for (let i = 0; i < 45; i++) {
      const n = randInt(1, 50);
      const a = randArr(n, 0, 1000);
      cases.push([a, randInt(1, Math.min(n, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 200);
      const a = randArr(n, 0, 10000);
      cases.push([a, randInt(1, Math.min(n, 25))]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(200, 1000);
      const a = randArr(n, 0, 1000000);
      cases.push([a, randInt(1, Math.min(n, 50))]);
    }
    return cases;
  }
},

// ─── 47. 3Sum ───
{
  slug: 'three-sum',
  title: '3Sum',
  description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0. No duplicate triplets.',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5',
  examples: [
    { input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Two unique triplets sum to 0.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Sort + Two Pointers', content: 'Sort the array, fix one element, use two pointers for the remaining sum.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) continue;
      let l = i + 1, r = nums.length - 1;
      while (l < r) {
        const sum = nums[i] + nums[l] + nums[r];
        if (sum === 0) {
          res.push([nums[i], nums[l], nums[r]]);
          while (l < r && nums[l] === nums[l + 1]) l++;
          while (l < r && nums[r] === nums[r - 1]) r--;
          l++; r--;
        } else if (sum < 0) l++;
        else r--;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-1, 0, 1, 2, -1, -4]]); cases.push([[0, 1, 1]]); cases.push([[0, 0, 0]]);
    cases.push([[0, 0, 0, 0]]); cases.push([[-2, 0, 1, 1, 2]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(3, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(200, 500), -100000, 100000)]);
    return cases;
  }
},

// ─── 48. Largest Number At Least Twice of Others ───
{
  slug: 'largest-twice-others',
  title: 'Largest Number At Least Twice of Others',
  description: 'Given an integer array nums where the largest element is unique, check whether the largest element is at least twice as much as every other number. Return its index or -1 if not.',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Sorting'],
  constraints: '2 <= nums.length <= 50, 0 <= nums[i] <= 100',
  examples: [
    { input: '[3,6,1,0]', output: '1', explanation: '6 is the largest and is >= 2 * 3.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Find Max', content: 'Find the max and second max. Check if max >= 2 * secondMax.' }],
  jsSolution: (nums) => {
    let maxIdx = 0;
    for (let i = 1; i < nums.length; i++) if (nums[i] > nums[maxIdx]) maxIdx = i;
    for (let i = 0; i < nums.length; i++) {
      if (i !== maxIdx && nums[maxIdx] < 2 * nums[i]) return -1;
    }
    return maxIdx;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 6, 1, 0]]); cases.push([[1, 2, 3, 4]]); cases.push([[0, 0, 0, 1]]); cases.push([[100, 50]]);
    cases.push([[50, 100]]); cases.push([[1, 0]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(2, 20), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 35), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(35, 50), 0, 100)]);
    return cases;
  }
},

// ─── 49. Median of Two Sorted Arrays ───
{
  slug: 'median-two-sorted-arrays',
  title: 'Median of Two Sorted Arrays',
  description: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Binary Search', 'Divide and Conquer'],
  constraints: '0 <= m, n <= 1000, 1 <= m + n <= 2000, -10^6 <= nums1[i], nums2[i] <= 10^6',
  examples: [
    { input: '[1,3], [2]', output: '2.0', explanation: 'Merged = [1,2,3]. Median is 2.' }
  ],
  args: [
    { name: 'nums1', cpp: 'vector<int>', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
    { name: 'nums2', cpp: 'vector<int>', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Binary Search on Partition', content: 'Binary search on the smaller array to find the correct partition.' }],
  jsSolution: (nums1, nums2) => {
    const merged = [...nums1, ...nums2].sort((a, b) => a - b);
    const n = merged.length;
    if (n % 2 === 1) return merged[Math.floor(n / 2)];
    return (merged[n / 2 - 1] + merged[n / 2]) / 2;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3], [2]]); cases.push([[1, 2], [3, 4]]); cases.push([[], [1]]); cases.push([[2], []]);
    cases.push([[1], [1]]); cases.push([[1, 1, 1], [1, 1, 1]]);
    for (let i = 0; i < 44; i++) {
      cases.push([randArr(randInt(0, 50), -100, 100).sort((a, b) => a - b), randArr(randInt(1, 50), -100, 100).sort((a, b) => a - b)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(0, 200), -10000, 10000).sort((a, b) => a - b), randArr(randInt(1, 200), -10000, 10000).sort((a, b) => a - b)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(0, 1000), -1000000, 1000000).sort((a, b) => a - b), randArr(randInt(1, 1000), -1000000, 1000000).sort((a, b) => a - b)]);
    }
    return cases;
  }
},

// ─── 50. Minimum Number of Moves to Make Palindrome ───
{
  slug: 'min-moves-palindrome-array',
  title: 'Minimum Moves to Make Array Palindrome',
  description: 'Given an integer array nums, return the minimum number of element swaps (adjacent swaps) needed to make it a palindrome. If not possible, return -1. Assume the array can always be rearranged to form a palindrome.',
  difficulty: 'Hard',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Greedy', 'Two Pointers'],
  constraints: '1 <= nums.length <= 2000, 1 <= nums[i] <= nums.length',
  examples: [
    { input: '[4,3,2,1,2,3,1,4]', output: '4', explanation: 'Rearrange to palindrome with 4 adjacent swaps.' }
  ],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Greedy Two-End', content: 'Match elements from outside in, counting swaps needed.' }],
  jsSolution: (nums) => {
    const a = [...nums];
    let moves = 0;
    let l = 0, r = a.length - 1;
    while (l < r) {
      if (a[l] === a[r]) { l++; r--; continue; }
      let k = r;
      while (k > l && a[k] !== a[l]) k--;
      if (k === l) {
        // odd element, move to center
        [a[l], a[l + 1]] = [a[l + 1], a[l]];
        moves++;
      } else {
        while (k < r) { [a[k], a[k + 1]] = [a[k + 1], a[k]]; k++; moves++; }
        l++; r--;
      }
    }
    return moves;
  },
  inputGenerator: () => {
    const cases = [];
    // Generate palindrome-able arrays
    const genPalinArr = (half) => {
      const a = [];
      for (let i = 0; i < half; i++) { const v = randInt(1, half * 2); a.push(v); a.push(v); }
      // shuffle
      for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    };
    cases.push([[1, 2, 1]]); cases.push([[4, 3, 2, 1, 2, 3, 1, 4]]); cases.push([[1, 1]]);
    cases.push([[1, 2, 2, 1]]); cases.push([[3, 1, 2, 3, 2, 1]]);
    for (let i = 0; i < 45; i++) cases.push([genPalinArr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genPalinArr(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genPalinArr(randInt(50, 200))]);
    return cases;
  }
}

];

export default problems;
