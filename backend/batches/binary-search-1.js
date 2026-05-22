// Binary Search — Batch 1 (22 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'search-a-2d-matrix',
  title: 'Search a 2D Matrix',
  description: 'Given an m x n integer matrix where each row is sorted in non-decreasing order and the first integer of each row is greater than the last integer of the previous row, return true if target is in the matrix.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Matrix'],
  constraints: 'm == matrix.length, n == matrix[i].length, 1 <= m, n <= 100, -10^4 <= matrix[i][j], target <= 10^4',
  examples: [{ input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3', output: 'true', explanation: '3 exists at row 0, col 1.' }],
  args: [
    { name: 'matrix', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Binary Search 1D', content: 'Treat the 2D matrix as a virtual 1D array of size m * n. Index mid corresponds to row = Math.floor(mid / n) and col = mid % n.' }],
  jsSolution: (matrix, target) => {
    if (!matrix.length || !matrix[0].length) return false;
    const m = matrix.length;
    const n = matrix[0].length;
    let lo = 0, hi = m * n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const val = matrix[Math.floor(mid / n)][mid % n];
      if (val === target) return true;
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3]);
    cases.push([[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13]);
    cases.push([[[1]], 1]);
    const genMatrix = (m, n) => {
      const arr = [];
      let val = randInt(-100, 100);
      for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
          val += randInt(1, 10);
          row.push(val);
        }
        arr.push(row);
      }
      const target = Math.random() < 0.5 ? arr[randInt(0, m - 1)][randInt(0, n - 1)] : randInt(-500, 1500);
      return [arr, target];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genMatrix(randInt(1, 10), randInt(1, 10)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(10, 30), randInt(10, 30)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(30, 50), randInt(30, 50)));
    }
    return cases;
  }
},

// 2
{
  slug: 'search-a-2d-matrix-ii',
  title: 'Search a 2D Matrix II',
  description: 'Write an efficient algorithm that searches for a value target in an m x n integer matrix. The matrix is sorted in ascending order from left to right and top to bottom.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Divide and Conquer', 'Matrix'],
  constraints: 'm == matrix.length, n == matrix[i].length, 1 <= m, n <= 300, -10^9 <= matrix[i][j], target <= 10^9',
  examples: [{ input: '[[1,4,7],[2,5,8],[3,6,9]], 5', output: 'true', explanation: '5 exists in matrix.' }],
  args: [
    { name: 'matrix', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Pointers from Corner', content: 'Start from top-right corner. If current value > target, move left. If current value < target, move down.' }],
  jsSolution: (matrix, target) => {
    if (!matrix.length || !matrix[0].length) return false;
    let r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
      if (matrix[r][c] === target) return true;
      if (matrix[r][c] > target) c--;
      else r++;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 4, 7], [2, 5, 8], [3, 6, 9]], 5]);
    cases.push([[[1, 4, 7], [2, 5, 8], [3, 6, 9]], 20]);
    cases.push([[[5]], 5]);
    const genMatrix = (m, n) => {
      const mat = Array.from({ length: m }, () => Array(n).fill(0));
      mat[0][0] = randInt(1, 10);
      for (let j = 1; j < n; j++) mat[0][j] = mat[0][j - 1] + randInt(1, 5);
      for (let i = 1; i < m; i++) mat[i][0] = mat[i - 1][0] + randInt(1, 5);
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          mat[i][j] = Math.max(mat[i - 1][j], mat[i][j - 1]) + randInt(1, 5);
        }
      }
      const target = Math.random() < 0.5 ? mat[randInt(0, m - 1)][randInt(0, n - 1)] : randInt(1, m * n * 5);
      return [mat, target];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genMatrix(randInt(1, 10), randInt(1, 10)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(10, 30), randInt(10, 30)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(30, 80), randInt(30, 80)));
    }
    return cases;
  }
},

// 3
{
  slug: 'find-minimum-in-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  description: 'Given a sorted array of unique integers rotated between 1 and n times, return the minimum element of this array.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 5000, -5000 <= nums[i] <= 5000, all elements are unique',
  examples: [{ input: '[3,4,5,1,2]', output: '1', explanation: 'The minimum element is 1.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Rotation Point', content: 'Compare nums[mid] with nums[hi]. If nums[mid] > nums[hi], min is on the right. Else, min is on the left.' }],
  jsSolution: (nums) => {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else hi = mid;
    }
    return nums[lo];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 4, 5, 1, 2]]); cases.push([[4, 5, 6, 7, 0, 1, 2]]); cases.push([[11, 13, 15, 17]]);
    const genRotated = (n) => {
      const set = new Set();
      while (set.size < n) set.add(randInt(-1000, 1000));
      const sorted = [...set].sort((a, b) => a - b);
      const rot = randInt(0, n - 1);
      const res = [...sorted.slice(rot), ...sorted.slice(0, rot)];
      return [res];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genRotated(randInt(1, 50)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genRotated(randInt(50, 400)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genRotated(randInt(400, 2000)));
    }
    return cases;
  }
},

// 4
{
  slug: 'find-minimum-in-rotated-sorted-array-ii',
  title: 'Find Minimum in Rotated Sorted Array II',
  description: 'Given a sorted array of integers rotated between 1 and n times that may contain duplicates, return the minimum element.',
  difficulty: 'Hard',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 5000, -5000 <= nums[i] <= 5000',
  examples: [{ input: '[2,2,2,0,1]', output: '0', explanation: 'The minimum element is 0.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Handle Duplicates', content: 'Same as NGE, but if nums[mid] == nums[hi], decrement hi by 1.' }],
  jsSolution: (nums) => {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else if (nums[mid] < nums[hi]) hi = mid;
      else hi--;
    }
    return nums[lo];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 2, 2, 0, 1]]); cases.push([[1, 3, 5]]); cases.push([[10, 1, 10, 10, 10]]);
    const genRotatedDup = (n) => {
      const arr = randArr(n, -100, 100).sort((a, b) => a - b);
      const rot = randInt(0, n - 1);
      const res = [...arr.slice(rot), ...arr.slice(0, rot)];
      return [res];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genRotatedDup(randInt(1, 50)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genRotatedDup(randInt(50, 400)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genRotatedDup(randInt(400, 2000)));
    }
    return cases;
  }
},

// 5
{
  slug: 'find-peak-element',
  title: 'Find Peak Element',
  description: 'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 1000, -2^31 <= nums[i] <= 2^31 - 1, nums[i] != nums[i + 1] for all valid i',
  examples: [{ input: '[1,2,3,1]', output: '2', explanation: '3 is a peak element and its index is 2.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Peaks', content: 'Compare nums[mid] with nums[mid + 1]. If nums[mid] < nums[mid + 1], peak lies on the right. Else, on the left.' }],
  jsSolution: (nums) => {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] < nums[mid + 1]) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 1]]); cases.push([[1, 2, 1, 3, 5, 6, 4]]); cases.push([[1]]);
    const genPeaks = (n) => {
      const arr = [];
      let val = randInt(-1000, 1000);
      arr.push(val);
      for (let i = 1; i < n; i++) {
        let next = randInt(-1000, 1000);
        while (next === val) next = randInt(-1000, 1000);
        arr.push(next);
        val = next;
      }
      return [arr];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genPeaks(randInt(1, 50)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPeaks(randInt(50, 200)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPeaks(randInt(200, 800)));
    }
    return cases;
  }
},

// 6
{
  slug: 'search-in-rotated-sorted-array-ii',
  title: 'Search in Rotated Sorted Array II',
  description: 'Given a sorted integer array nums rotated at some pivot containing duplicates, return true if target is in nums.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 5000, -10^4 <= nums[i], target <= 10^4',
  examples: [{ input: '[2,5,6,0,0,1,2], 0', output: 'true', explanation: '0 exists in array.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Handle Duplicate rotation search', content: 'Compare nums[mid] with nums[lo]. If nums[lo] == nums[mid] == nums[hi], increment lo and decrement hi.' }],
  jsSolution: (nums, target) => {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] === target) return true;
      if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
        lo++; hi--;
      } else if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 5, 6, 0, 0, 1, 2], 0]);
    cases.push([[2, 5, 6, 0, 0, 1, 2], 3]);
    cases.push([[1], 0]);
    const genRotatedDup = (n) => {
      const arr = randArr(n, -100, 100).sort((a, b) => a - b);
      const rot = randInt(0, n - 1);
      const nums = [...arr.slice(rot), ...arr.slice(0, rot)];
      const target = Math.random() < 0.5 ? nums[randInt(0, n - 1)] : randInt(-200, 200);
      return [nums, target];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genRotatedDup(randInt(1, 50)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genRotatedDup(randInt(50, 400)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genRotatedDup(randInt(400, 2000)));
    }
    return cases;
  }
},

// 7
{
  slug: 'koko-eating-bananas',
  title: 'Koko Eating Bananas',
  description: 'Koko loves to eat bananas. There are n piles of bananas. Koko can choose an eating speed k (bananas per hour). Return the minimum integer k such that she can eat all the bananas within h hours.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= piles.length <= 10^4, piles.length <= h <= 10^9, 1 <= piles[i] <= 10^9',
  examples: [{ input: '[3,6,7,11], 8', output: '4', explanation: 'With speed 4, she finishes in 3/4 + 6/4 + 7/4 + 11/4 = 1+2+2+3 = 8 hours.' }],
  args: [
    { name: 'piles', cpp: 'vector<int>', java: 'int[]', py: 'piles: List[int]', js: 'piles' },
    { name: 'h', cpp: 'int', java: 'int', py: 'h: int', js: 'h' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Answers', content: 'Search speed range [1, max(piles)]. For speed mid, sum Math.ceil(pile/mid). Adjust bounds based on sum.' }],
  jsSolution: (piles, h) => {
    let lo = 1, hi = Math.max(...piles);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      let hours = 0;
      for (const p of piles) hours += Math.ceil(p / mid);
      if (hours <= h) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 6, 7, 11], 8]);
    cases.push([[30, 11, 23, 4, 20], 5]);
    cases.push([[30, 11, 23, 4, 20], 6]);
    const genKoko = (n) => {
      const piles = randArr(n, 1, 1000);
      const total = piles.reduce((a, b) => a + b, 0);
      const h = randInt(n, n * 5);
      return [piles, h];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genKoko(randInt(1, 30)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genKoko(randInt(30, 200)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genKoko(randInt(200, 1000)));
    }
    return cases;
  }
},

// 8
{
  slug: 'capacity-to-ship-packages-within-d-days',
  title: 'Capacity To Ship Packages Within D Days',
  description: 'A conveyor belt has packages that must be shipped from one port to another within days days. Given an array weights and integer days, return the least weight capacity of the ship that will result in all packages being shipped in order within days.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= days <= weights.length <= 5 * 10^4, 1 <= weights[i] <= 500',
  examples: [{ input: '[1,2,3,4,5,6,7,8,9,10], 5', output: '15', explanation: 'With capacity 15, packages are shipped in 5 days.' }],
  args: [
    { name: 'weights', cpp: 'vector<int>', java: 'int[]', py: 'weights: List[int]', js: 'weights' },
    { name: 'days', cpp: 'int', java: 'int', py: 'days: int', js: 'days' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Capacity', content: 'Lower bound is max(weights), upper bound is sum(weights). Check if capacity mid is enough to ship packages in <= days.' }],
  jsSolution: (weights, days) => {
    let lo = Math.max(...weights);
    let hi = weights.reduce((a, b) => a + b, 0);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      let cur = 0, count = 1;
      for (const w of weights) {
        if (cur + w > mid) {
          count++; cur = w;
        } else {
          cur += w;
        }
      }
      if (count <= days) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5]);
    cases.push([[3, 2, 2, 4, 1, 4], 3]);
    cases.push([[1, 2, 1], 2]);
    const genShip = (n) => {
      const weights = randArr(n, 1, 100);
      const days = randInt(1, n);
      return [weights, days];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genShip(randInt(1, 30)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genShip(randInt(30, 200)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genShip(randInt(200, 1000)));
    }
    return cases;
  }
},

// 9
{
  slug: 'sqrtx',
  title: 'Sqrt(x)',
  description: 'Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Math', 'Binary Search'],
  constraints: '0 <= x <= 2^31 - 1',
  examples: [{ input: '8', output: '2', explanation: 'Square root of 8 is 2.828... rounded down to 2.' }],
  args: [{ name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Range', content: 'Search value in range [0, x]. If mid * mid <= x, record mid and search right. Else, search left.' }],
  jsSolution: (x) => {
    if (x === 0 || x === 1) return x;
    let lo = 1, hi = x, res = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (mid * mid === x) return mid;
      if (mid * mid < x) {
        res = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4]); cases.push([8]); cases.push([0]); cases.push([1]);
    for (let i = 0; i < 46; i++) {
      cases.push([randInt(2, 500)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(500, 50000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(50000, 1000000)]);
    }
    return cases;
  }
},

// 10
{
  slug: 'arranging-coins',
  title: 'Arranging Coins',
  description: 'You have n coins and you want to build a staircase where the ith row has exactly i coins. Return the number of complete rows of the staircase you can build.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Math', 'Binary Search'],
  constraints: '1 <= n <= 2^31 - 1',
  examples: [{ input: '5', output: '2', explanation: '1 + 2 = 3 coins. 3rd row needs 3, but only 2 coins left. 2 complete rows.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Formula', content: 'Rows k requires k*(k+1)/2 coins. Binary search for k in [1, n].' }],
  jsSolution: (n) => {
    let lo = 1, hi = n, res = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const coins = (mid * (mid + 1)) / 2;
      if (coins === n) return mid;
      if (coins < n) {
        res = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5]); cases.push([8]); cases.push([1]);
    for (let i = 0; i < 47; i++) {
      cases.push([randInt(1, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(1000, 100000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100000, 10000000)]);
    }
    return cases;
  }
},

// 11
{
  slug: 'count-negative-numbers-in-a-sorted-matrix',
  title: 'Count Negative Numbers in a Sorted Matrix',
  description: 'Given a m x n matrix grid which is sorted in non-increasing order both row-wise and column-wise, return the number of negative numbers in grid.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Matrix'],
  constraints: 'm == grid.length, n == grid[i].length, 1 <= m, n <= 100, -100 <= grid[i][j] <= 100',
  examples: [{ input: '[[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]', output: '8', explanation: 'There are 8 negatives in the grid.' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Row', content: 'For each row, use binary search to find the first index of negative number. Negatives in row = n - index.' }],
  jsSolution: (grid) => {
    let count = 0;
    const n = grid[0].length;
    for (const row of grid) {
      let lo = 0, hi = n - 1, firstNegIdx = n;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (row[mid] < 0) {
          firstNegIdx = mid;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      count += (n - firstNegIdx);
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]]]);
    cases.push([[[3, 2], [1, 0]]]);
    cases.push([[[ -1 ]]]);
    const genMatrix = (m, n) => {
      const grid = [];
      for (let i = 0; i < m; i++) {
        const row = randArr(n, -50, 50).sort((a, b) => b - a);
        grid.push(row);
      }
      return [grid];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genMatrix(randInt(1, 10), randInt(1, 10)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(10, 30), randInt(10, 30)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(30, 80), randInt(30, 80)));
    }
    return cases;
  }
},

// 12
{
  slug: 'find-smallest-letter-greater-than-target',
  title: 'Find Smallest Letter Greater Than Target',
  description: 'Given a characters array letters that is sorted in non-decreasing order and a character target, return the smallest character in the array that is larger than target. Wrap around if none found.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '2 <= letters.length <= 10^4, letters consists of lowercase English letters, letters is sorted, target is lowercase English letter',
  examples: [{ input: '["c","f","j"], "a"', output: '"c"', explanation: '"c" is the smallest letter > "a".' }],
  args: [
    { name: 'letters', cpp: 'vector<char>', java: 'char[]', py: 'letters: List[str]', js: 'letters' },
    { name: 'target', cpp: 'char', java: 'char', py: 'target: str', js: 'target' }
  ],
  retType: { cpp: 'char', java: 'char', py: 'str' },
  hints: [{ title: 'Binary Search Letters', content: 'Run binary search. If target >= letters[mid], search right. Else, search left.' }],
  jsSolution: (letters, target) => {
    let lo = 0, hi = letters.length - 1, resIdx = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (letters[mid] > target) {
        resIdx = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    return letters[resIdx];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([['c', 'f', 'j'], 'a']);
    cases.push([['c', 'f', 'j'], 'c']);
    cases.push([['x', 'x', 'y', 'y'], 'z']);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const genLetters = (n) => {
      const letters = randStr(n, alphabet).split('').sort();
      const target = alphabet[randInt(0, 25)];
      return [letters, target];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genLetters(randInt(2, 20)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genLetters(randInt(20, 100)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genLetters(randInt(100, 500)));
    }
    return cases;
  }
},

// 13
{
  slug: 'fair-candy-swap',
  title: 'Fair Candy Swap',
  description: 'Alice and Bob have different amounts of candy. You are given two arrays aliceSizes and bobSizes. Return an array of size 2: [aliceSizes[i], bobSizes[j]] representing the candies swapped so they both have the same total amount.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Hash Table', 'Binary Search', 'Sorting'],
  constraints: '1 <= aliceSizes.length, bobSizes.length <= 10^4, 1 <= aliceSizes[i], bobSizes[j] <= 10^5, Sum is same after swapping',
  examples: [{ input: '[1,1], [2,2]', output: '[1,2]', explanation: 'After swapping, Alice sum = 2, Bob sum = 2.' }],
  args: [
    { name: 'aliceSizes', cpp: 'vector<int>', java: 'int[]', py: 'aliceSizes: List[int]', js: 'aliceSizes' },
    { name: 'bobSizes', cpp: 'vector<int>', java: 'int[]', py: 'bobSizes: List[int]', js: 'bobSizes' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Math Transformation + Search', content: 'Let Alice total sum be SA and Bob SB. Alice needs to swap x and Bob y. SA - x + y = SB - y + x => y = x + (SB - SA)/2. Sort Bob sizes and search for y for each x.' }],
  jsSolution: (aliceSizes, bobSizes) => {
    const sumA = aliceSizes.reduce((a, b) => a + b, 0);
    const sumB = bobSizes.reduce((a, b) => a + b, 0);
    const diff = (sumB - sumA) / 2;
    bobSizes.sort((a, b) => a - b);
    for (const x of aliceSizes) {
      const target = x + diff;
      let lo = 0, hi = bobSizes.length - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (bobSizes[mid] === target) return [x, target];
        if (bobSizes[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return [];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1], [2, 2]]);
    cases.push([[1, 2], [2, 3]]);
    cases.push([[2], [1, 3]]);
    const genSwap = (n, m) => {
      const alice = randArr(n, 1, 100);
      const bob = randArr(m, 1, 100);
      const sumA = alice.reduce((a, b) => a + b, 0);
      const sumB = bob.reduce((a, b) => a + b, 0);
      const diff = sumB - sumA;
      if (diff % 2 !== 0) {
        bob[0] += 1;
      }
      const newSumB = bob.reduce((a, b) => a + b, 0);
      const targetDiff = (newSumB - sumA) / 2;
      const idxA = randInt(0, n - 1);
      const idxB = randInt(0, m - 1);
      bob[idxB] = alice[idxA] + targetDiff;
      return [alice, bob];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genSwap(randInt(1, 10), randInt(1, 10)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genSwap(randInt(10, 50), randInt(10, 50)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genSwap(randInt(50, 100), randInt(50, 100)));
    }
    return cases;
  }
},

// 14
{
  slug: 'the-k-weakest-rows-in-a-matrix',
  title: 'The K Weakest Rows in a Matrix',
  description: 'Given a m x n binary matrix where 1s (soldiers) appear before 0s (civilians), return the indices of the k weakest rows sorted from weakest to strongest. Row i is weaker than j if row i has fewer soldiers, or if they have same soldiers and i < j.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Sorting', 'Matrix'],
  constraints: 'm == mat.length, n == mat[i].length, 2 <= m, n <= 100, mat[i][j] is 0 or 1, 1 <= k <= m',
  examples: [{ input: '[[1,1,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,1,1]], 3', output: '[2,0,3]', explanation: 'Soldiers count: Row 2 (1), Row 0 (2), Row 3 (2), Row 1 (4), Row 4 (5). The weakest 3 rows are 2, 0, 3.' }],
  args: [
    { name: 'mat', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'mat: List[List[int]]', js: 'mat' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Binary Search Row Soldiers', content: 'Use binary search to count the number of 1s in each row (first index of 0 is count of 1s). Store [soldiers, rowIndex] and sort.' }],
  jsSolution: (mat, k) => {
    const rows = [];
    for (let i = 0; i < mat.length; i++) {
      const row = mat[i];
      let lo = 0, hi = row.length - 1, count = row.length;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (row[mid] === 0) {
          count = mid;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      rows.push([count, i]);
    }
    rows.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
    return rows.slice(0, k).map(x => x[1]);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [1, 1, 1, 1, 1]], 3]);
    cases.push([[[1, 0, 0], [1, 1, 0], [1, 1, 1]], 2]);
    const genMatrix = (m, n) => {
      const mat = [];
      for (let i = 0; i < m; i++) {
        const ones = randInt(0, n);
        mat.push([...Array(ones).fill(1), ...Array(n - ones).fill(0)]);
      }
      const k = randInt(1, m);
      return [mat, k];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genMatrix(randInt(2, 8), randInt(2, 8)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(8, 25), randInt(8, 25)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genMatrix(randInt(25, 60), randInt(25, 60)));
    }
    return cases;
  }
},

// 15
{
  slug: 'special-array-with-x-elements-greater-than-or-equal-x',
  title: 'Special Array With X Elements Greater Than or Equal X',
  description: 'Given an array of non-negative integers nums, return x if there exists an x such that there are exactly x numbers in nums that are greater than or equal to x. Otherwise, return -1.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Sorting'],
  constraints: '1 <= nums.length <= 100, 0 <= nums[i] <= 1000',
  examples: [{ input: '[3,5]', output: '2', explanation: 'There are 2 elements >= 2.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort and Count', content: 'Sort the array descending. Or search x in range [1, n]. Count elements >= x.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    for (let x = 1; x <= n; x++) {
      let lo = 0, hi = n - 1, count = 0;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] >= x) {
          count = n - mid;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      if (count === x) return x;
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5]]); cases.push([[0, 0]]); cases.push([[0, 4, 3, 0, 4]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 20), 0, 30)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(20, 50), 0, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 100), 0, 500)]);
    }
    return cases;
  }
},

// 16
{
  slug: 'single-element-in-a-sorted-array',
  title: 'Single Element in a Sorted Array',
  description: 'You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Return the single element that appears only once.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 10^5, nums is sorted',
  examples: [{ input: '[1,1,2,3,3,4,4,8,8]', output: '2', explanation: '2 is the only single element.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Indices Pair', content: 'All duplicates start at even index before the single element. If mid is even and nums[mid] == nums[mid+1], single is to the right.' }],
  jsSolution: (nums) => {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
      let mid = Math.floor((lo + hi) / 2);
      if (mid % 2 === 1) mid--;
      if (nums[mid] === nums[mid + 1]) lo = mid + 2;
      else hi = mid;
    }
    return nums[lo];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 2, 3, 3, 4, 4, 8, 8]]); cases.push([[3, 3, 7, 7, 10, 11, 11]]); cases.push([[1]]);
    const genSingle = (n) => {
      const arr = [];
      let val = randInt(1, 10);
      for (let i = 0; i < n; i++) {
        arr.push(val, val);
        val += randInt(1, 5);
      }
      const idx = randInt(0, n);
      arr.splice(idx * 2, 0, val + 10);
      return [arr];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genSingle(randInt(1, 30)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genSingle(randInt(30, 200)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genSingle(randInt(200, 1000)));
    }
    return cases;
  }
},

// 17
{
  slug: 'minimum-limit-of-balls-in-a-bag',
  title: 'Minimum Limit of Balls in a Bag',
  description: 'You are given an integer array nums where the ith bag contains nums[i] balls. You can divide bags into smaller bags. Return the minimum possible max balls in a bag after at most maxOperations operations.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 10^5, 1 <= maxOperations, nums[i] <= 10^9',
  examples: [{ input: '[9], 2', output: '3', explanation: 'Divide 9 into 3, 6, then 3, 3, 3. Max is 3.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'maxOperations', cpp: 'int', java: 'int', py: 'maxOperations: int', js: 'maxOperations' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Answers', content: 'Search target size mid in [1, max(nums)]. Number of operations for num is Math.floor((num - 1) / mid). Check if total <= maxOperations.' }],
  jsSolution: (nums, maxOperations) => {
    let lo = 1, hi = Math.max(...nums);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      let ops = 0;
      for (const num of nums) {
        ops += Math.floor((num - 1) / mid);
      }
      if (ops <= maxOperations) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[9], 2]);
    cases.push([[2, 4, 8, 2], 4]);
    cases.push([[7, 17], 2]);
    const genBag = (n) => {
      const nums = randArr(n, 1, 100);
      const ops = randInt(1, n * 5);
      return [nums, ops];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genBag(randInt(1, 20)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genBag(randInt(20, 100)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genBag(randInt(100, 500)));
    }
    return cases;
  }
},

// 18
{
  slug: 'magnetic-force-between-two-balls',
  title: 'Magnetic Force Between Two Balls',
  description: 'Given n basket positions, return the maximum minimum magnetic force between m balls placed in m baskets.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Sorting'],
  constraints: 'n == position.length, 2 <= n <= 10^5, 0 <= position[i] <= 10^9, 2 <= m <= n',
  examples: [{ input: '[1,2,8,4,9], 3', output: '3', explanation: 'Place balls at 1, 4, 9. Min force is 3.' }],
  args: [
    { name: 'position', cpp: 'vector<int>', java: 'int[]', py: 'position: List[int]', js: 'position' },
    { name: 'm', cpp: 'int', java: 'int', py: 'm: int', js: 'm' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Force', content: 'Sort positions. Binary search mid force in [1, max-min]. Greedily place balls and check if we can place >= m.' }],
  jsSolution: (position, m) => {
    position.sort((a, b) => a - b);
    let lo = 1, hi = position[position.length - 1] - position[0];
    let res = 1;
    const canPlace = (force) => {
      let count = 1, prev = position[0];
      for (let i = 1; i < position.length; i++) {
        if (position[i] - prev >= force) {
          count++; prev = position[i];
          if (count >= m) return true;
        }
      }
      return false;
    };
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (canPlace(mid)) {
        res = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 8, 4, 9], 3]);
    cases.push([[5, 4, 3, 2, 1, 1000000000], 2]);
    const genBalls = (n) => {
      const set = new Set();
      while (set.size < n) set.add(randInt(0, n * 10));
      const pos = [...set];
      const m = randInt(2, n);
      return [pos, m];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genBalls(randInt(3, 20)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genBalls(randInt(20, 100)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genBalls(randInt(100, 500)));
    }
    return cases;
  }
},

// 19
{
  slug: 'find-kth-smallest-pair-distance',
  title: 'Find K-th Smallest Pair Distance',
  description: 'Given an integer array nums and integer k, return the kth smallest distance among all pairs (nums[i], nums[j]) where i < j.',
  difficulty: 'Hard',
  category: 'Binary Search',
  tags: ['Array', 'Two Pointers', 'Binary Search', 'Sorting'],
  constraints: 'n == nums.length, 2 <= n <= 10^4, 0 <= nums[i] <= 10^6, 1 <= k <= n * (n - 1) / 2',
  examples: [{ input: '[1,3,1], 1', output: '0', explanation: 'Pairs: (1,3)[2], (1,1)[0], (3,1)[2]. 1st smallest distance is 0.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Distance + Sliding Window', content: 'Sort array. BS distance in [0, max-min]. Count pairs with distance <= mid using two pointers. Adjust BS bounds.' }],
  jsSolution: (nums, k) => {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    let lo = 0, hi = nums[n - 1] - nums[0];
    const countPairs = (dist) => {
      let count = 0, left = 0;
      for (let right = 0; right < n; right++) {
        while (nums[right] - nums[left] > dist) left++;
        count += right - left;
      }
      return count;
    };
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (countPairs(mid) >= k) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 1], 1]);
    cases.push([[1, 1, 1], 2]);
    cases.push([[1, 6, 1], 3]);
    const genPairs = (n) => {
      const nums = randArr(n, 0, n * 5);
      const k = randInt(1, Math.min(100, (n * (n - 1)) / 2));
      return [nums, k];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genPairs(randInt(3, 15)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPairs(randInt(15, 60)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPairs(randInt(60, 150)));
    }
    return cases;
  }
},

// 20
{
  slug: 'divide-chocolate',
  title: 'Divide Chocolate',
  description: 'You have one chocolate bar that consists of some chunks. Each chunk has a sweetness level. You want to share the chocolate with your k friends. Return the maximum total sweetness you can get for your own piece by dividing the bar into k + 1 pieces.',
  difficulty: 'Hard',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '0 <= k < sweetness.length <= 10^4, 1 <= sweetness[i] <= 10^5',
  examples: [{ input: '[1,2,3,4,5,6,7,8,9], 5', output: '6', explanation: 'Divide into [1,2,3], [4,5], [6], [7], [8], [9]. Min sweetness is 6 (friends sweetness is 6, 9, 6, 7, 8, 9).' }],
  args: [
    { name: 'sweetness', cpp: 'vector<int>', java: 'int[]', py: 'sweetness: List[int]', js: 'sweetness' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Min Sweetness', content: 'Search minimum sweetness of a piece mid in [min(sweetness), sum(sweetness)]. Check if we can divide chocolate into >= k+1 pieces with sweetness >= mid.' }],
  jsSolution: (sweetness, k) => {
    let lo = Math.min(...sweetness);
    let hi = sweetness.reduce((a, b) => a + b, 0);
    let res = lo;
    const canDivide = (minSweet) => {
      let count = 0, cur = 0;
      for (const s of sweetness) {
        cur += s;
        if (cur >= minSweet) {
          count++; cur = 0;
        }
      }
      return count >= k + 1;
    };
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (canDivide(mid)) {
        res = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6, 7, 8, 9], 5]);
    cases.push([[5, 6, 7, 8, 9, 1, 2, 3, 4], 8]);
    cases.push([[1, 2, 2, 1, 2, 2, 1, 2, 2], 2]);
    const genChoc = (n) => {
      const sweetness = randArr(n, 1, 100);
      const k = randInt(0, n - 1);
      return [sweetness, k];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genChoc(randInt(2, 20)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genChoc(randInt(20, 100)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genChoc(randInt(100, 500)));
    }
    return cases;
  }
},

// 21
{
  slug: 'h-index-ii',
  title: 'H-Index II',
  description: 'Given an array of citations sorted in ascending order, calculate the researcher\'s h-index.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= citations.length <= 10^5, 0 <= citations[i] <= 1000',
  examples: [{ input: '[0,1,3,5,6]', output: '3', explanation: '[3,5,6] citations means 3 papers have >= 3 citations.' }],
  args: [{ name: 'citations', cpp: 'vector<int>', java: 'int[]', py: 'citations: List[int]', js: 'citations' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Citations', content: 'Compare citations[mid] with n - mid. If citations[mid] >= n - mid, search left. Else, search right.' }],
  jsSolution: (citations) => {
    const n = citations.length;
    let lo = 0, hi = n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (citations[mid] === n - mid) return n - mid;
      if (citations[mid] < n - mid) lo = mid + 1;
      else hi = mid - 1;
    }
    return n - lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 1, 3, 5, 6]]); cases.push([[1, 2, 100]]); cases.push([[0]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 30), 0, 50).sort((a, b) => a - b)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(30, 200), 0, 300).sort((a, b) => a - b)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(200, 1000), 0, 1000).sort((a, b) => a - b)]);
    }
    return cases;
  }
},

// 22
{
  slug: 'time-based-key-value-store',
  title: 'Time Based Key-Value Store',
  description: 'Design a time-based key-value data structure that can store multiple values for the same key at different timestamps and retrieve the key\'s value at a certain timestamp. Given operations "set" (saves [key, value, timestamp]) and "get" (returns value associated with largest timestamp_prev <= timestamp).',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Hash Table', 'String', 'Binary Search', 'Design'],
  constraints: '1 <= operations.length <= 10^3, timestamp is strictly increasing for set operations',
  examples: [{ input: '["set", "get", "get", "set", "get"], [["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4]]', output: '[null, "bar", "bar", null, "bar2"]', explanation: 'Set/get values with timestamps.' }],
  args: [
    { name: 'ops', cpp: 'vector<string>', java: 'String[]', py: 'ops: List[str]', js: 'ops' },
    { name: 'vals', cpp: 'vector<vector<string>>', java: 'String[][]', py: 'vals: List[List[str]]', js: 'vals' }
  ],
  retType: { cpp: 'vector<string>', java: 'String[]', py: 'List[str]' },
  hints: [{ title: 'Binary Search Timestamps', content: 'For each key, store a list of [timestamp, value] pairs. Since timestamps are sorted, use binary search to locate the largest timestamp <= target.' }],
  jsSolution: (ops, vals) => {
    const store = new Map();
    const res = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op === 'set') {
        const key = vals[i][0];
        const val = vals[i][1];
        const ts = parseInt(vals[i][2], 10);
        if (!store.has(key)) store.set(key, []);
        store.get(key).push([ts, val]);
        res.push('null');
      } else if (op === 'get') {
        const key = vals[i][0];
        const ts = parseInt(vals[i][1], 10);
        if (!store.has(key)) {
          res.push('');
          continue;
        }
        const arr = store.get(key);
        let lo = 0, hi = arr.length - 1, ans = '';
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (arr[mid][0] <= ts) {
            ans = arr[mid][1];
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        res.push(ans);
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([
      ['set', 'get', 'get', 'set', 'get'],
      [['foo', 'bar', '1'], ['foo', '1'], ['foo', '3'], ['foo', 'bar2', '4'], ['foo', '4']]
    ]);
    const genOps = (n) => {
      const ops = [];
      const vals = [];
      const keys = ['foo', 'baz', 'qux'];
      let ts = 1;
      for (let j = 0; j < n; j++) {
        if (Math.random() < 0.4) {
          ops.push('set');
          vals.push([keys[randInt(0, 2)], randStr(3), String(ts)]);
          ts += randInt(1, 10);
        } else {
          ops.push('get');
          vals.push([keys[randInt(0, 2)], String(randInt(1, ts + 5))]);
        }
      }
      return [ops, vals];
    };
    for (let i = 0; i < 49; i++) {
      cases.push(genOps(randInt(5, 20)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genOps(randInt(20, 100)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genOps(randInt(100, 300)));
    }
    return cases;
  }
}

];

export default problems;
