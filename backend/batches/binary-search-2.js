// Binary Search — Batch 2 (22 problems to complete Binary Search to 50)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'find-first-and-last-position-of-element-in-sorted-array',
  title: 'Find First and Last Position of Element in Sorted Array',
  description: 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an O(log n) algorithm.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '0 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9, nums is sorted in non-decreasing order.',
  examples: [{ input: '[5,7,7,8,8,10], 8', output: '[3,4]', explanation: '8 first appears at index 3 and last at index 4.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Binary Searches', content: 'Run binary search twice: once to find the leftmost boundary of the target, and once to find the rightmost boundary.' }],
  jsSolution: (nums, target) => {
    const findBound = (isFirst) => {
      let lo = 0, hi = nums.length - 1, ans = -1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] === target) {
          ans = mid;
          if (isFirst) hi = mid - 1;
          else lo = mid + 1;
        } else if (nums[mid] < target) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      return ans;
    };
    return [findBound(true), findBound(false)];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 7, 7, 8, 8, 10], 8]);
    cases.push([[5, 7, 7, 8, 8, 10], 6]);
    cases.push([[], 0]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100).sort((a, b) => a - b);
      const target = Math.random() < 0.7 ? (arr.length ? arr[randInt(0, n - 1)] : 0) : randInt(-150, 150);
      return [arr, target];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(100, 1000)));
    return cases;
  }
},

// 2
{
  slug: 'sqrtx',
  title: 'Sqrt(x)',
  description: 'Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative. You must not use any built-in exponent functions.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Math', 'Binary Search'],
  constraints: '0 <= x <= 2^31 - 1',
  examples: [{ input: '8', output: '2', explanation: 'The square root of 8 is 2.828... and rounded down to nearest integer is 2.' }],
  args: [{ name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search range', content: 'Search in range [1, x]. If mid * mid <= x, record mid and search right. Otherwise search left.' }],
  jsSolution: (x) => {
    if (x === 0 || x === 1) return x;
    let lo = 1, hi = x, ans = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (mid * mid === x) return mid;
      if (mid * mid < x) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4]);
    cases.push([8]);
    cases.push([0]);
    for (let i = 0; i < 47; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10000, 2000000)]);
    return cases;
  }
},

// 3
{
  slug: 'search-in-a-sorted-array-of-unknown-size',
  title: 'Search in a Sorted Array of Unknown Size',
  description: 'Given an integer array sorted in ascending order and a target value, return the index if target is found. You do not know the size of the array, but you have an API that returns 2147483647 when index is out of bounds. Find target in O(log n) complexity.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 10^4, -9999 <= nums[i] <= 9999, nums is sorted in strictly increasing order.',
  examples: [{ input: '[-1,0,3,5,9,12], 9', output: '4', explanation: '9 exists in array and its index is 4.' }],
  args: [
    { name: 'reader', cpp: 'vector<int>', java: 'int[]', py: 'reader: List[int]', js: 'reader' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Exponential Backoff', content: 'Find boundaries first. Start with hi = 1, and double it until reader[hi] >= target. Then run normal binary search between hi/2 and hi.' }],
  jsSolution: (reader, target) => {
    const read = (i) => i >= reader.length ? 2147483647 : reader[i];
    let lo = 0, hi = 1;
    while (read(hi) < target) {
      lo = hi;
      hi *= 2;
    }
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const val = read(mid);
      if (val === target) return mid;
      if (val < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-1, 0, 3, 5, 9, 12], 9]);
    cases.push([[-1, 0, 3, 5, 9, 12], 2]);
    cases.push([[5], 5]);
    const gen = (n) => {
      const set = new Set();
      while (set.size < n) set.add(randInt(-5000, 5000));
      const arr = [...set].sort((a, b) => a - b);
      const target = Math.random() < 0.6 ? arr[randInt(0, n - 1)] : randInt(-6000, 6000);
      return [arr, target];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(100, 1000)));
    return cases;
  }
},

// 4
{
  slug: 'kth-smallest-element-in-a-sorted-matrix',
  title: 'Kth Smallest Element in a Sorted Matrix',
  description: 'Given an n x n matrix where each of the rows and columns are sorted in ascending order, return the kth smallest element in the matrix. You must find it in O(n log(max - min)) time.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Matrix', 'Sorting'],
  constraints: 'n == matrix.length == matrix[i].length, 1 <= n <= 300, -10^9 <= matrix[i][j] <= 10^9, 1 <= k <= n^2',
  examples: [{ input: '[[1,5,9],[10,11,13],[12,13,15]], 8', output: '13', explanation: 'The 8th smallest element in sorted order is 13.' }],
  args: [
    { name: 'matrix', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Value Range', content: 'Search value range [matrix[0][0], matrix[n-1][n-1]]. Count how many elements are <= mid using a two-pointer walk from top-right to bottom-left.' }],
  jsSolution: (matrix, k) => {
    const n = matrix.length;
    const countLessOrEqual = (target) => {
      let count = 0, r = n - 1, c = 0;
      while (r >= 0 && c < n) {
        if (matrix[r][c] <= target) {
          count += (r + 1);
          c++;
        } else {
          r--;
        }
      }
      return count;
    };
    let lo = matrix[0][0], hi = matrix[n - 1][n - 1];
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (countLessOrEqual(mid) >= k) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8]);
    cases.push([[[1, 2], [1, 3]], 2]);
    cases.push([[[5]], 1]);
    const gen = (n) => {
      const mat = Array.from({ length: n }, () => Array(n).fill(0));
      mat[0][0] = randInt(-100, 100);
      for (let j = 1; j < n; j++) mat[0][j] = mat[0][j - 1] + randInt(0, 5);
      for (let i = 1; i < n; i++) mat[i][0] = mat[i - 1][0] + randInt(0, 5);
      for (let i = 1; i < n; i++) {
        for (let j = 1; j < n; j++) {
          mat[i][j] = Math.max(mat[i - 1][j], mat[i][j - 1]) + randInt(0, 5);
        }
      }
      const k = randInt(1, n * n);
      return [mat, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 5
{
  slug: 'heaters',
  title: 'Heaters',
  description: 'Every house can be warmed if it is within a heater\'s radius. Given positions of houses and heaters, return the minimum warm radius of heaters so that all houses can be warmed.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Two Pointers', 'Binary Search', 'Sorting'],
  constraints: '1 <= houses.length, heaters.length <= 2.5 * 10^4, 1 <= houses[i], heaters[i] <= 10^9',
  examples: [{ input: '[1,2,3],[2]', output: '1', explanation: 'Heater at 2 warms houses at 1, 2, 3 with radius 1.' }],
  args: [
    { name: 'houses', cpp: 'vector<int>', java: 'int[]', py: 'houses: List[int]', js: 'houses' },
    { name: 'heaters', cpp: 'vector<int>', java: 'int[]', py: 'heaters: List[int]', js: 'heaters' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Heater', content: 'Sort the heaters array. For each house, binary search for the nearest heater (either just below or just above) and find the minimal distance.' }],
  jsSolution: (houses, heaters) => {
    heaters.sort((a, b) => a - b);
    let ans = 0;
    for (const house of houses) {
      let lo = 0, hi = heaters.length - 1;
      let dist = Infinity;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const diff = heaters[mid] - house;
        dist = Math.min(dist, Math.abs(diff));
        if (diff === 0) break;
        if (diff < 0) lo = mid + 1;
        else hi = mid - 1;
      }
      ans = Math.max(ans, dist);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], [2]]);
    cases.push([[1, 2, 3, 4], [1, 4]]);
    cases.push([[1, 5], [2]]);
    const gen = (n, m) => {
      const houses = randArr(n, 1, 1000);
      const heaters = randArr(m, 1, 1000);
      return [houses, heaters];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10), randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50), randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200), randInt(20, 100)));
    return cases;
  }
},

// 6
{
  slug: 'swim-in-rising-water',
  title: 'Swim in Rising Water',
  description: 'Given an n x n integer grid of elevations, return the least time t until you can swim from top-left (0,0) to bottom-right (n-1, n-1) if you can only swim through cells of elevation <= t.',
  difficulty: 'Hard',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Union Find', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
  constraints: 'n == grid.length == grid[i].length, 1 <= n <= 50, 0 <= grid[i][j] < n^2, grid is a permutation of [0, n^2 - 1].',
  examples: [{ input: '[[0,2],[1,3]]', output: '3', explanation: 'At time 3, path 0-1-3 is connected, all elevations are <= 3.' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Answers + BFS', content: 'The time range is [0, n^2-1]. For a guess mid, check if there exists a valid path using BFS or DFS.' }],
  jsSolution: (grid) => {
    const n = grid.length;
    const canReach = (t) => {
      if (grid[0][0] > t) return false;
      const visited = Array.from({ length: n }, () => Array(n).fill(false));
      visited[0][0] = true;
      const q = [[0, 0]];
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      let head = 0;
      while (head < q.length) {
        const [r, c] = q[head++];
        if (r === n - 1 && c === n - 1) return true;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] <= t) {
            visited[nr][nc] = true;
            q.push([nr, nc]);
          }
        }
      }
      return false;
    };
    let lo = grid[0][0], hi = n * n - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (canReach(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 2], [1, 3]]]);
    cases.push([[[0, 1, 2, 3], [12, 13, 14, 4], [11, 15, 9, 5], [10, 8, 7, 6]]]);
    const genPerm = (n) => {
      const vals = Array.from({ length: n * n }, (_, i) => i);
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [vals[i], vals[j]] = [vals[j], vals[i]];
      }
      const grid = [];
      for (let i = 0; i < n; i++) {
        grid.push(vals.slice(i * n, (i + 1) * n));
      }
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(genPerm(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(genPerm(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(genPerm(randInt(8, 12)));
    return cases;
  }
},

// 7
{
  slug: 'ugly-number-iii',
  title: 'Ugly Number III',
  description: 'An ugly number is a positive integer that is divisible by a, b, or c. Given four integers n, a, b, and c, return the nth ugly number. The answer is guaranteed to fit in a 32-bit signed integer.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Math', 'Binary Search', 'Number Theory'],
  constraints: '1 <= n, a, b, c <= 10^9, a * b * c <= 10^18',
  examples: [{ input: '3, 2, 3, 5', output: '4', explanation: 'Ugly numbers are 2, 3, 4, 5, 6, 8... The 3rd one is 4.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'a', cpp: 'int', java: 'int', py: 'a: int', js: 'a' },
    { name: 'b', cpp: 'int', java: 'int', py: 'b: int', js: 'b' },
    { name: 'c', cpp: 'int', java: 'int', py: 'c: int', js: 'c' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Inclusion-Exclusion Principle', content: 'Count ugly numbers <= x: x/a + x/b + x/c - x/lcm(a,b) - x/lcm(b,c) - x/lcm(a,c) + x/lcm(a,b,c). Use Binary Search.' }],
  jsSolution: (n, a, b, c) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    const lcm = (x, y) => (x * y) / gcd(x, y);
    const ab = lcm(a, b);
    const bc = lcm(b, c);
    const ac = lcm(a, c);
    const abc = lcm(a, bc);
    const count = (x) => {
      return Math.floor(x / a) + Math.floor(x / b) + Math.floor(x / c)
        - Math.floor(x / ab) - Math.floor(x / bc) - Math.floor(x / ac)
        + Math.floor(x / abc);
    };
    let lo = 1, hi = 2 * (10 ** 9);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (count(mid) >= n) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, 2, 3, 5]);
    cases.push([4, 2, 3, 4]);
    cases.push([5, 2, 11, 13]);
    const gen = () => {
      const a = randInt(2, 10);
      const b = randInt(2, 10);
      const c = randInt(2, 10);
      const n = randInt(1, 1000);
      return [n, a, b, c];
    };
    for (let i = 0; i < 47; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) {
      const a = randInt(5, 50);
      const b = randInt(5, 50);
      const c = randInt(5, 50);
      const n = randInt(1000, 100000);
      cases.push([n, a, b, c]);
    }
    for (let i = 0; i < 50; i++) {
      const a = randInt(50, 1000);
      const b = randInt(50, 1000);
      const c = randInt(50, 1000);
      const n = randInt(100000, 10000000);
      cases.push([n, a, b, c]);
    }
    return cases;
  }
},

// 8
{
  slug: 'maximum-tastiness-of-candy-basket',
  title: 'Maximum Tastiness of Candy Basket',
  description: 'You are given an array of prices and integer k. The tastiness of a candy basket is the minimum absolute difference of the prices of any two candies in the basket. Return the maximum tastiness of a candy basket.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Sorting'],
  constraints: '2 <= k <= price.length <= 10^5, 1 <= price[i] <= 10^9',
  examples: [{ input: '[13,5,1,8,21,2], 3', output: '8', explanation: 'Choose candies at [1, 8, 21]. Min difference is 7? Wait: 8-1=7, 21-8=13. Minimum is 7. If we choose [1, 13, 21], differences are 12 and 8. Min difference is 8. Maximum tastiness is 8.' }],
  args: [
    { name: 'price', cpp: 'vector<int>', java: 'int[]', py: 'price: List[int]', js: 'price' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Difference', content: 'Sort prices. Binary search the minimal absolute difference in range [0, price[n-1] - price[0]]. For a diff mid, greedily select elements.' }],
  jsSolution: (price, k) => {
    price.sort((a, b) => a - b);
    const check = (diff) => {
      let count = 1, prev = price[0];
      for (let i = 1; i < price.length; i++) {
        if (price[i] - prev >= diff) {
          count++;
          prev = price[i];
          if (count >= k) return true;
        }
      }
      return false;
    };
    let lo = 0, hi = price[price.length - 1] - price[0];
    let ans = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (check(mid)) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[13, 5, 1, 8, 21, 2], 3]);
    cases.push([[1, 3, 1], 2]);
    cases.push([[7, 7, 7, 7], 2]);
    const gen = (n) => {
      const price = randArr(n, 1, 500);
      const k = randInt(2, Math.max(2, Math.floor(n / 2)));
      return [price, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(4, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 60)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(60, 200)));
    return cases;
  }
},

// 9
{
  slug: 'find-a-peak-element-ii',
  title: 'Find a Peak Element II',
  description: 'A peak element in a 2D grid is an element that is strictly greater than all of its adjacent neighbors. Find any peak element in grid and return its index [i, j].',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Matrix', 'Divide and Conquer'],
  constraints: 'm == grid.length, n == grid[i].length, 1 <= m, n <= 500, 1 <= grid[i][j] <= 10^5, no adjacent cells are equal.',
  examples: [{ input: '[[1,4],[3,2]]', output: '[0,1]', explanation: '4 is greater than 1 and 2. 3 is also a peak.' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Binary Search Rows', content: 'Search rows. For mid row, find index of max element in that row. Compare with elements at mid-1 and mid+1. Move towards the greater neighbor.' }],
  jsSolution: (grid) => {
    const m = grid.length, n = grid[0].length;
    let lo = 0, hi = m - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      let maxCol = 0;
      for (let j = 1; j < n; j++) {
        if (grid[mid][j] > grid[mid][maxCol]) maxCol = j;
      }
      const isTopValGreater = mid > 0 && grid[mid - 1][maxCol] > grid[mid][maxCol];
      const isBottomValGreater = mid < m - 1 && grid[mid + 1][maxCol] > grid[mid][maxCol];
      if (!isTopValGreater && !isBottomValGreater) {
        return [mid, maxCol];
      } else if (isTopValGreater) {
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    return [-1, -1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 4], [3, 2]]]);
    cases.push([[[10, 20, 15], [21, 30, 14], [7, 16, 32]]]);
    cases.push([[[1]]]);
    const gen = (m, n) => {
      const mat = [];
      const used = new Set();
      for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
          let val = randInt(1, 10000);
          while (used.has(val)) val = randInt(1, 10000);
          used.add(val);
          row.push(val);
        }
        mat.push(row);
      }
      return [mat];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 5), randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15), randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30), randInt(15, 30)));
    return cases;
  }
},

// 10
{
  slug: 'minimum-speed-to-arrive-on-time',
  title: 'Minimum Speed to Arrive on Time',
  description: 'Given floating-point hour and array dist representing distances between consecutive train stations. Return the minimum positive integer speed required to reach on time, or -1 if impossible.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= dist.length <= 10^5, 1 <= dist[i] <= 10^5, 1 <= hour <= 10^9',
  examples: [{ input: '[1,3,2], 6', output: '1', explanation: 'At speed 1: ceil(1/1) + ceil(3/1) + 2/1 = 1 + 3 + 2 = 6 hours.' }],
  args: [
    { name: 'dist', cpp: 'vector<int>', java: 'int[]', py: 'dist: List[int]', js: 'dist' },
    { name: 'hour', cpp: 'double', java: 'double', py: 'hour: float', js: 'hour' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Floating Point Limits', content: 'Binary search speed in [1, 10^7]. Remember for last train we do not round up, we just do exact division.' }],
  jsSolution: (dist, hour) => {
    const n = dist.length;
    if (hour <= n - 1) return -1;
    const check = (speed) => {
      let time = 0;
      for (let i = 0; i < n - 1; i++) {
        time += Math.ceil(dist[i] / speed);
      }
      time += dist[n - 1] / speed;
      return time <= hour;
    };
    let lo = 1, hi = 10000000;
    let ans = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (check(mid)) {
        ans = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 2], 6.0]);
    cases.push([[1, 3, 2], 2.7]);
    cases.push([[1, 3, 2], 1.9]);
    const gen = (n) => {
      const dist = randArr(n, 1, 100);
      const hour = n - 0.5 + Math.random() * 5;
      return [dist, parseFloat(hour.toFixed(2))];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 11
{
  slug: 'minimum-time-to-complete-trips',
  title: 'Minimum Time to Complete Trips',
  description: 'Given bus round-trip times and totalTrips, return the minimum time required for all buses to complete at least totalTrips trips collectively.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= time.length <= 10^5, 1 <= time[i] <= 10^7, 1 <= totalTrips <= 10^7',
  examples: [{ input: '[1,2,3], 5', output: '3', explanation: 'At time 3, bus 1 completes 3 trips, bus 2 completes 1 trip, bus 3 completes 1 trip. Total = 3+1+1 = 5 trips.' }],
  args: [
    { name: 'time', cpp: 'vector<int>', java: 'int[]', py: 'time: List[int]', js: 'time' },
    { name: 'totalTrips', cpp: 'int', java: 'int', py: 'totalTrips: int', js: 'totalTrips' }
  ],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Binary Search on Trip Time', content: 'Search time in range [1, min(time)*totalTrips]. For mid, calculate total trips completed by summing mid/time[i] for all buses.' }],
  jsSolution: (time, totalTrips) => {
    const check = (t) => {
      let trips = 0;
      for (const x of time) {
        trips += Math.floor(t / x);
        if (trips >= totalTrips) return true;
      }
      return trips >= totalTrips;
    };
    let lo = 1, hi = Math.min(...time) * totalTrips;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (check(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], 5]);
    cases.push([[2], 1]);
    cases.push([[5, 10], 3]);
    const gen = (n) => {
      const time = randArr(n, 1, 100);
      const totalTrips = randInt(1, 1000);
      return [time, totalTrips];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 12
{
  slug: 'most-beautiful-item-for-each-query',
  title: 'Most Beautiful Item for Each Query',
  description: 'Given products with [price, beauty] and queries, return an array of maximum beauty at or below query prices in queries.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Sorting'],
  constraints: '1 <= items.length, queries.length <= 10^5, items[i].length == 2, 1 <= price, beauty, query <= 10^9',
  examples: [{ input: '[[1,2],[3,2],[2,4],[5,6],[3,5]], [1,2,3,4,5,6]', output: '[2,4,5,5,6,6]', explanation: 'Queries beauty is determined by max beauty <= query price.' }],
  args: [
    { name: 'items', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'items: List[List[int]]', js: 'items' },
    { name: 'queries', cpp: 'vector<int>', java: 'int[]', py: 'queries: List[int]', js: 'queries' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Sort Items and Queries', content: 'Sort items by price. Precompute running maximum beauty. Then binary search each query.' }],
  jsSolution: (items, queries) => {
    items.sort((a, b) => a[0] - b[0]);
    const n = items.length;
    const maxBeautyAtPrice = [];
    let maxB = 0;
    for (const [p, b] of items) {
      maxB = Math.max(maxB, b);
      maxBeautyAtPrice.push([p, maxB]);
    }
    const ans = [];
    for (const q of queries) {
      let lo = 0, hi = n - 1, res = 0;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (maxBeautyAtPrice[mid][0] <= q) {
          res = maxBeautyAtPrice[mid][1];
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      ans.push(res);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [3, 2], [2, 4], [5, 6], [3, 5]], [1, 2, 3, 4, 5, 6]]);
    cases.push([[[1, 2]], [1, 2, 0]]);
    const gen = (n, q) => {
      const items = Array.from({ length: n }, () => [randInt(1, 100), randInt(1, 50)]);
      const queries = randArr(q, 1, 120);
      return [items, queries];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 5), randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 50), randInt(5, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200), randInt(50, 200)));
    return cases;
  }
},

// 13
{
  slug: 'find-positive-integer-solution-for-a-given-equation',
  title: 'Find Positive Integer Solution for a Given Equation',
  description: 'Given a function f(x, y) = x * y + x + y which is strictly increasing. Find all positive integer pairs x and y such that f(x, y) == z.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Math', 'Two Pointers', 'Binary Search', 'Interactive'],
  constraints: '1 <= z <= 10^5',
  examples: [{ input: '5', output: '[[1,2],[2,1]]', explanation: 'f(1,2) = 1*2+1+2=5. f(2,1)=5.' }],
  args: [{ name: 'z', cpp: 'int', java: 'int', py: 'z: int', js: 'z' }],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'Strictly Increasing Function', content: 'For each x in range [1, z], binary search for y in range [1, z] such that x*y+x+y == z.' }],
  jsSolution: (z) => {
    const f = (x, y) => x * y + x + y;
    const ans = [];
    for (let x = 1; x <= 1000; x++) {
      let lo = 1, hi = 1000;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const val = f(x, mid);
        if (val === z) {
          ans.push([x, mid]);
          break;
        }
        if (val < z) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5]);
    cases.push([11]);
    cases.push([1]);
    for (let i = 0; i < 47; i++) cases.push([randInt(2, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(500, 5000)]);
    return cases;
  }
},

// 14
{
  slug: 'find-the-smallest-divisor-given-a-threshold',
  title: 'Find the Smallest Divisor Given a Threshold',
  description: 'Given an array of integers nums and an integer threshold, choose a positive integer divisor, divide all elements by it, and sum the rounded-up divisions. Find the smallest divisor such that sum <= threshold.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 5 * 10^4, 1 <= nums[i] <= 10^6, nums.length <= threshold <= 10^6',
  examples: [{ input: '[1,2,5,9], 6', output: '5', explanation: 'Divisor 5: ceil(1/5) + ceil(2/5) + ceil(5/5) + ceil(9/5) = 1+1+1+2 = 5 <= 6.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'threshold', cpp: 'int', java: 'int', py: 'threshold: int', js: 'threshold' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Divisor', content: 'Search range is [1, max(nums)]. For a divisor mid, calculate the sum. If <= threshold, search left. Otherwise search right.' }],
  jsSolution: (nums, threshold) => {
    const check = (div) => {
      let sum = 0;
      for (const x of nums) {
        sum += Math.ceil(x / div);
      }
      return sum <= threshold;
    };
    let lo = 1, hi = Math.max(...nums);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (check(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 5, 9], 6]);
    cases.push([[2, 3, 5, 7, 11], 11]);
    cases.push([[19], 1]);
    const gen = (n) => {
      const nums = randArr(n, 1, 1000);
      const threshold = randInt(n, n * 10);
      return [nums, threshold];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 15
{
  slug: 'maximum-number-of-removable-characters',
  title: 'Maximum Number of Removable Characters',
  description: 'Given strings s and p, and an array removable. Return maximum k such that p is still a subsequence of s after removing removable[0], ..., removable[k-1] characters.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['String', 'Array', 'Binary Search'],
  constraints: '1 <= p.length <= s.length <= 10^5, 1 <= removable.length <= s.length, all elements of removable are unique.',
  examples: [{ input: '"abcacb", "ab", [3,1,0]', output: '2', explanation: 'Remove removable[0], removable[1]: s becomes "a_ca_b". "ab" is still subsequence. Remove removable[2] also, s becomes "__ca_b", "ab" not subsequence. Maximum is 2.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'p', cpp: 'string', java: 'String', py: 'p: str', js: 'p' },
    { name: 'removable', cpp: 'vector<int>', java: 'int[]', py: 'removable: List[int]', js: 'removable' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on k', content: 'Search range [0, removable.length]. For a mid, mark index as removed, and test if p is subsequence of s in O(s.length).' }],
  jsSolution: (s, p, removable) => {
    const isSub = (k) => {
      const removed = new Set();
      for (let i = 0; i < k; i++) removed.add(removable[i]);
      let i = 0, j = 0;
      while (i < s.length && j < p.length) {
        if (!removed.has(i) && s[i] === p[j]) {
          j++;
        }
        i++;
      }
      return j === p.length;
    };
    let lo = 0, hi = removable.length;
    let ans = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (isSub(mid)) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abcacb", "ab", [3, 1, 0]]);
    cases.push(["abacanisi", "abc", [0, 2, 4, 6]]);
    cases.push(["a", "a", [0]]);
    const gen = (n) => {
      const alphabet = 'abc';
      const s = randStr(n, alphabet);
      const p = randStr(randInt(1, Math.ceil(n / 2)), alphabet);
      // Ensure p is actually a subsequence of s initially to make a valid test
      const removable = [];
      const indices = Array.from({ length: n }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return [s, p, indices.slice(0, randInt(1, n))];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 30)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(30, 80)));
    return cases;
  }
},

// 16
{
  slug: 'maximum-value-at-a-given-index-in-a-bounded-array',
  title: 'Maximum Value at a Given Index in a Bounded Array',
  description: 'Construct array nums of size n containing positive integers where abs(nums[i]-nums[i+1]) <= 1 and sum(nums) <= maxSum. Return the maximum possible value of nums[index].',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Binary Search', 'Greedy'],
  constraints: '1 <= n <= maxSum <= 10^9, 0 <= index < n',
  examples: [{ input: '4, 1, 4', output: '2', explanation: 'Construct array [1,2,1,1] whose sum is 5? Wait: maxSum is 4. Array [1,2,1,0]? Integers must be positive. Array [1,2,1,1] has sum 5. So nums[1] maximum can be 2.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'index', cpp: 'int', java: 'int', py: 'index: int', js: 'index' },
    { name: 'maxSum', cpp: 'int', java: 'int', py: 'maxSum: int', js: 'maxSum' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Math formula for sum', content: 'Let nums[index] be val. Sum is val + sum of left arithmetic progression + sum of right arithmetic progression. Binary search val in range [1, maxSum].' }],
  jsSolution: (n, index, maxSum) => {
    const sumRange = (val, len) => {
      if (len <= 0) return 0;
      if (val >= len) {
        return ((val + val - len + 1) * len) / 2;
      }
      return ((val + 1) * val) / 2 + (len - val);
    };
    const check = (val) => {
      const leftSum = sumRange(val - 1, index);
      const rightSum = sumRange(val - 1, n - index - 1);
      return val + leftSum + rightSum <= maxSum;
    };
    let lo = 1, hi = maxSum;
    let ans = 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (check(mid)) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, 1, 4]);
    cases.push([6, 1, 10]);
    cases.push([1, 0, 20]);
    const gen = () => {
      const n = randInt(1, 100);
      const index = randInt(0, n - 1);
      const maxSum = randInt(n, n * 5);
      return [n, index, maxSum];
    };
    for (let i = 0; i < 47; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) {
      const n = randInt(100, 1000);
      const index = randInt(0, n - 1);
      const maxSum = randInt(n, n * 10);
      cases.push([n, index, maxSum]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(1000, 5000);
      const index = randInt(0, n - 1);
      const maxSum = randInt(n, n * 20);
      cases.push([n, index, maxSum]);
    }
    return cases;
  }
},

// 17
{
  slug: 'k-th-smallest-prime-fraction',
  title: 'K-th Smallest Prime Fraction',
  description: 'Given sorted prime array arr and k, return the kth smallest prime fraction arr[i] / arr[j] as [arr[i], arr[j]].',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Sorting', 'Heap (Priority Queue)'],
  constraints: '2 <= arr.length <= 1000, arr consists of 1 and prime numbers, 1 <= k <= arr.length * (arr.length - 1) / 2',
  examples: [{ input: '[1,2,3,5], 3', output: '[2,5]', explanation: 'Fractions in sorted order: 1/5, 1/3, 2/5 (3rd smallest), 1/2, 3/5, 2/3...' }],
  args: [
    { name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Binary Search Fractions', content: 'Search fraction value in range [0, 1]. For each guess mid, use two pointers to count fractions <= mid.' }],
  jsSolution: (arr, k) => {
    const n = arr.length;
    let lo = 0.0, hi = 1.0;
    while (lo < hi) {
      const mid = (lo + hi) / 2;
      let count = 0, p = 0, q = 1, j = 1;
      for (let i = 0; i < n; i++) {
        while (j < n && arr[i] >= mid * arr[j]) {
          j++;
        }
        count += (n - j);
        if (j < n && arr[i] * q > p * arr[j]) {
          p = arr[i];
          q = arr[j];
        }
      }
      if (count === k) return [p, q];
      if (count < k) lo = mid;
      else hi = mid;
    }
    return [];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 5], 3]);
    cases.push([[1, 7], 1]);
    cases.push([[1, 2, 5, 7, 11, 13], 5]);
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    const gen = (n) => {
      const pSubset = [1];
      const used = new Set();
      while (pSubset.length < n) {
        const p = primes[randInt(0, primes.length - 1)];
        if (!used.has(p)) {
          used.add(p);
          pSubset.push(p);
        }
      }
      pSubset.sort((a, b) => a - b);
      const totalFractions = (n * (n - 1)) / 2;
      const k = randInt(1, totalFractions);
      return [pSubset, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20)));
    return cases;
  }
},

// 18
{
  slug: 'online-election',
  title: 'Online Election',
  description: 'Implement a system that queries the leader of an election at historical timestamp t. Votes are cast at times[i] for persons[i]. Find the leader in O(log n) per query.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Hash Table', 'Binary Search', 'Design'],
  constraints: '1 <= persons.length == times.length <= 5000, 1 <= persons[i] <= 5000, times is strictly increasing, queries.length <= 5000',
  examples: [{ input: '[0,1,1,0,0,1,0], [0,5,10,15,20,25,30], [3,12,25,15,24,8]', output: '[0,1,1,0,0,1]', explanation: 'q(3)=0, q(12)=1, q(25)=1, q(15)=0, q(24)=0, q(8)=1.' }],
  args: [
    { name: 'persons', cpp: 'vector<int>', java: 'int[]', py: 'persons: List[int]', js: 'persons' },
    { name: 'times', cpp: 'vector<int>', java: 'int[]', py: 'times: List[int]', js: 'times' },
    { name: 'queries', cpp: 'vector<int>', java: 'int[]', py: 'queries: List[int]', js: 'queries' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Precompute Leader', content: 'Scan the persons list to precompute who was the leader at each index of times. When queried at time t, binary search the largest time <= t.' }],
  jsSolution: (persons, times, queries) => {
    const leaders = [];
    const counts = {};
    let lead = -1;
    for (let i = 0; i < persons.length; i++) {
      const p = persons[i];
      counts[p] = (counts[p] || 0) + 1;
      if (lead === -1 || counts[p] >= counts[lead]) {
        lead = p;
      }
      leaders.push(lead);
    }
    const ans = [];
    for (const t of queries) {
      let lo = 0, hi = times.length - 1, idx = 0;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (times[mid] <= t) {
          idx = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      ans.push(leaders[idx]);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 1, 1, 0, 0, 1, 0], [0, 5, 10, 15, 20, 25, 30], [3, 12, 25, 15, 24, 8]]);
    cases.push([[0], [0], [0, 1, 10]]);
    const gen = (n) => {
      const persons = randArr(n, 0, Math.floor(n / 2));
      const times = [];
      let cur = 0;
      for (let i = 0; i < n; i++) {
        cur += randInt(1, 10);
        times.push(cur);
      }
      const queries = randArr(randInt(1, 10), 0, cur + 5);
      return [persons, times, queries];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 19
{
  slug: 'check-if-a-number-is-majority-element-in-a-sorted-array',
  title: 'Check If a Number Is Majority Element in a Sorted Array',
  description: 'Given sorted array nums and target, return true if target is a majority element (appears strictly more than nums.length / 2 times).',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search'],
  constraints: '1 <= nums.length <= 1000, -10^9 <= nums[i], target <= 10^9, nums is sorted in non-decreasing order.',
  examples: [{ input: '[2,4,5,5,5,5,5,6,6], 5', output: 'true', explanation: '5 appears 5 times, which is > 9/2 = 4.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'First Appearance + Offset', content: 'Find first occurrence index of target using binary search. Then check if target is still present at index + nums.length/2.' }],
  jsSolution: (nums, target) => {
    const n = nums.length;
    let lo = 0, hi = n - 1, first = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] === target) {
        first = mid;
        hi = mid - 1;
      } else if (nums[mid] < target) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (first === -1) return false;
    return first + Math.floor(n / 2) < n && nums[first + Math.floor(n / 2)] === target;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 4, 5, 5, 5, 5, 5, 6, 6], 5]);
    cases.push([[10, 100, 101, 101], 101]);
    cases.push([[1], 1]);
    const gen = (n) => {
      const target = randInt(-10, 10);
      const arr = [];
      const majorityCount = Math.random() < 0.5 ? Math.floor(n / 2) + randInt(1, 3) : randInt(0, Math.floor(n / 2));
      for (let i = 0; i < majorityCount; i++) arr.push(target);
      while (arr.length < n) {
        let val = randInt(-20, 20);
        if (val !== target) arr.push(val);
      }
      arr.sort((a, b) => a - b);
      return [arr, target];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(100, 400)));
    return cases;
  }
},

// 20
{
  slug: 'find-the-distance-value-between-two-arrays',
  title: 'Find Distance Value Between Two Arrays',
  description: 'Given arrays arr1 and arr2, and integer d, return the number of elements arr1[i] such that there is no element arr2[j] with |arr1[i] - arr2[j]| <= d.',
  difficulty: 'Easy',
  category: 'Binary Search',
  tags: ['Array', 'Two Pointers', 'Binary Search', 'Sorting'],
  constraints: '1 <= arr1.length, arr2.length <= 500, -1000 <= arr1[i], arr2[j] <= 1000, 0 <= d <= 100',
  examples: [{ input: '[4,5,8], [10,9,1,8], 2', output: '2', explanation: 'arr1[0]=4: no arr2[j] has diff <= 2. arr1[1]=5: no arr2[j] has diff <= 2. arr1[2]=8: arr2[3]=8 has diff 0 <= 2. Distance value = 2.' }],
  args: [
    { name: 'arr1', cpp: 'vector<int>', java: 'int[]', py: 'arr1: List[int]', js: 'arr1' },
    { name: 'arr2', cpp: 'vector<int>', java: 'int[]', py: 'arr2: List[int]', js: 'arr2' },
    { name: 'd', cpp: 'int', java: 'int', py: 'd: int', js: 'd' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search Elements', content: 'Sort arr2. For each element x in arr1, binary search in arr2 to find if any element is in range [x-d, x+d]. If not, increment count.' }],
  jsSolution: (arr1, arr2, d) => {
    arr2.sort((a, b) => a - b);
    let count = 0;
    for (const x of arr1) {
      let lo = 0, hi = arr2.length - 1, found = false;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (Math.abs(arr2[mid] - x) <= d) {
          found = true;
          break;
        }
        if (arr2[mid] < x) lo = mid + 1;
        else hi = mid - 1;
      }
      if (!found) count++;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 5, 8], [10, 9, 1, 8], 2]);
    cases.push([[1, 4, 2, 3], [-4, -3, 6, 10, 20, 30], 3]);
    cases.push([[2, 1, 100, 3], [-5, -2, 10, 12, 15], 3]);
    const gen = (n, m) => {
      const arr1 = randArr(n, -100, 100);
      const arr2 = randArr(m, -100, 100);
      const d = randInt(0, 10);
      return [arr1, arr2, d];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10), randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50), randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 100), randInt(50, 100)));
    return cases;
  }
},

// 21
{
  slug: 'snapshot-array',
  title: 'Snapshot Array',
  description: 'Implement a SnapshotArray that supports setting values, taking snapshots, and querying historical values at a specific snapshot ID. Simulating operations: set(index, val), snap(), and get(index, snap_id).',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Hash Table', 'Binary Search', 'Design'],
  constraints: '1 <= length <= 5000, 1 <= ops.length <= 5000, ops contains operations [type, index/none, value/snap_id]',
  examples: [{ input: '3, [[0,0,5],[1],[0,0,6],[2,0,0]]', output: '[5]', explanation: 'Set 0 to 5. Snap (id=0). Set 0 to 6. Get 0 at snap 0 = 5.' }],
  args: [
    { name: 'length', cpp: 'int', java: 'int', py: 'length: int', js: 'length' },
    { name: 'ops', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'ops: List[List[int]]', js: 'ops' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Store history lists', content: 'Each index can have a list of [snap_id, value] pairs. When setting a value, push or update current snap_id. When getting, binary search for snap_id.' }],
  jsSolution: (length, ops) => {
    const map = Array.from({ length }, () => [[-1, 0]]);
    let snapId = 0;
    const ans = [];
    for (const op of ops) {
      const type = op[0];
      if (type === 0) { // set index val
        const idx = op[1], val = op[2];
        const history = map[idx];
        if (history[history.length - 1][0] === snapId) {
          history[history.length - 1][1] = val;
        } else {
          history.push([snapId, val]);
        }
      } else if (type === 1) { // snap
        snapId++;
      } else { // get index snap_id
        const idx = op[1], sId = op[2];
        const history = map[idx];
        let lo = 0, hi = history.length - 1, val = 0;
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (history[mid][0] <= sId) {
            val = history[mid][1];
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        ans.push(val);
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, [[0, 0, 5], [1], [0, 0, 6], [2, 0, 0]]]);
    cases.push([1, [[0, 0, 15], [2, 0, 0], [1], [2, 0, 0]]]);
    const gen = (n, m) => {
      const ops = [];
      let snapsCount = 0;
      for (let i = 0; i < m; i++) {
        const r = Math.random();
        if (r < 0.5) { // set
          ops.push([0, randInt(0, n - 1), randInt(1, 100)]);
        } else if (r < 0.7) { // snap
          ops.push([1, 0, 0]);
          snapsCount++;
        } else { // get
          ops.push([2, randInt(0, n - 1), randInt(0, snapsCount)]);
        }
      }
      return [n, ops];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 5), randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 20), randInt(15, 60)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100), randInt(60, 200)));
    return cases;
  }
},

// 22
{
  slug: 'plates-between-candles',
  title: 'Plates Between Candles',
  description: 'Given string s containing plate \'*\' and candle \'|\', and queries. Calculate the number of plates between two candles in the substring [left, right] for each query.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['String', 'Array', 'Binary Search', 'Prefix Sum'],
  constraints: '3 <= s.length <= 10^5, s consists of \'*\' and \'|\', 1 <= queries.length <= 10^5',
  examples: [{ input: '"**|**|***|", [[2,5],[5,9]]', output: '[2,3]', explanation: 'query [2,5] matches "|**|". Plates count is 2. query [5,9] matches "|***|". Plates count is 3.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'queries', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'queries: List[List[int]]', js: 'queries' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Candle Indices array', content: 'Collect all indexes of \'|\' into a list. For each query, binary search the first candle >= left and the last candle <= right. Count of plates is distance - count of candles.' }],
  jsSolution: (s, queries) => {
    const candles = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '|') candles.push(i);
    }
    const ans = [];
    for (const [qL, qR] of queries) {
      let lo = 0, hi = candles.length - 1, firstCandleIdx = -1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (candles[mid] >= qL) {
          firstCandleIdx = mid;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      lo = 0; hi = candles.length - 1;
      let lastCandleIdx = -1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (candles[mid] <= qR) {
          lastCandleIdx = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (firstCandleIdx === -1 || lastCandleIdx === -1 || firstCandleIdx >= lastCandleIdx) {
        ans.push(0);
      } else {
        const totalIndices = candles[lastCandleIdx] - candles[firstCandleIdx] + 1;
        const candlesCount = lastCandleIdx - firstCandleIdx + 1;
        ans.push(totalIndices - candlesCount);
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["**|**|***|", [[2, 5], [5, 9]]]);
    cases.push(["||*||", [[0, 4], [1, 3]]]);
    cases.push(["*|*", [[0, 2]]]);
    const gen = (n, q) => {
      const sArr = Array.from({ length: n }, () => Math.random() < 0.4 ? '|' : '*');
      const s = sArr.join('');
      const queries = [];
      for (let i = 0; i < q; i++) {
        const left = randInt(0, n - 2);
        const right = randInt(left + 1, n - 1);
        queries.push([left, right]);
      }
      return [s, queries];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(3, 10), randInt(1, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50), randInt(3, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200), randInt(10, 30)));
    return cases;
  }
}
];
