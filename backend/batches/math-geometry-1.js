// Math & Geometry — Batch 1 (38 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'power-of-two',
  title: 'Power of Two',
  description: 'Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two if there exists an integer x such that n == 2^x.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '-2^31 <= n <= 2^31 - 1',
  examples: [{ input: '16', output: 'true' }, { input: '3', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Bit manipulation check', content: 'A power of two in binary has exactly one set bit. So n > 0 && (n & (n - 1)) == 0 holds true.' }],
  jsSolution: (n) => {
    return n > 0 && (n & (n - 1)) === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([16]);
    cases.push([3]);
    for (let i = 0; i < 48; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(2, randInt(0, 30)) : randInt(1, 100000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(2, randInt(0, 30)) : randInt(1, 2000000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? -Math.pow(2, randInt(0, 30)) : randInt(-10000, 10000)]);
    }
    return cases;
  }
},

// 2
{
  slug: 'power-of-three',
  title: 'Power of Three',
  description: 'Given an integer n, return true if it is a power of three. Otherwise, return false. An integer n is a power of three if there exists an integer x such that n == 3^x.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Recursion'],
  constraints: '-2^31 <= n <= 2^31 - 1',
  examples: [{ input: '27', output: 'true' }, { input: '0', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Max power of three divisor', content: 'The maximum power of 3 that fits in a 32-bit signed integer is 3^19 = 1162261467. So n > 0 && 1162261467 % n == 0.' }],
  jsSolution: (n) => {
    return n > 0 && 1162261467 % n === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([27]);
    cases.push([0]);
    for (let i = 0; i < 48; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(3, randInt(0, 19)) : randInt(1, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(3, randInt(0, 19)) : randInt(1, 1000000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? -Math.pow(3, randInt(0, 19)) : randInt(-1000, 1000)]);
    }
    return cases;
  }
},

// 3
{
  slug: 'power-of-four',
  title: 'Power of Four',
  description: 'Given an integer n, return true if it is a power of four. Otherwise, return false. An integer n is a power of four if there exists an integer x such that n == 4^x.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '-2^31 <= n <= 2^31 - 1',
  examples: [{ input: '16', output: 'true' }, { input: '5', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Bitmask check', content: 'A power of 4 must be a power of 2, and its single 1 bit must be at an odd position (0x55555555 covers all odd positions).' }],
  jsSolution: (n) => {
    return n > 0 && (n & (n - 1)) === 0 && (n & 0x55555555) !== 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([16]);
    cases.push([5]);
    for (let i = 0; i < 48; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(4, randInt(0, 15)) : randInt(1, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(4, randInt(0, 15)) : randInt(1, 10000000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? -Math.pow(4, randInt(0, 15)) : randInt(-100, 100)]);
    }
    return cases;
  }
},

// 4
{
  slug: 'valid-perfect-square',
  title: 'Valid Perfect Square',
  description: 'Given a positive integer num, return true if num is a perfect square or false otherwise. Do not use any built-in library function such as sqrt.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Binary Search'],
  constraints: '1 <= num <= 2^31 - 1',
  examples: [{ input: '16', output: 'true' }, { input: '14', output: 'false' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Binary Search', content: 'Use binary search in range [1, num] to locate x such that x * x == num.' }],
  jsSolution: (num) => {
    if (num < 1) return false;
    let l = 1, r = num;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      const sq = mid * mid;
      if (sq === num) return true;
      if (sq < num) l = mid + 1;
      else r = mid - 1;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([16]);
    cases.push([14]);
    for (let i = 0; i < 48; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(randInt(1, 100), 2) : randInt(1, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(randInt(100, 1000), 2) : randInt(1, 1000000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? Math.pow(randInt(1000, 46340), 2) : randInt(1000000, 100000000)]);
    }
    return cases;
  }
},

// 5
{
  slug: 'arranging-coins',
  title: 'Arranging Coins',
  description: 'You have n coins and you want to build a staircase with these coins. The staircase consists of k rows where the ith row has exactly i coins. The last row of the staircase may be incomplete. Given the integer n, return the number of complete rows of the staircase you will build.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Binary Search'],
  constraints: '1 <= n <= 2^31 - 1',
  examples: [{ input: '5', output: '2', explanation: 'Rows are 1, 2, and the third is incomplete (only 2 coins left).' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Algebraic formula or binary search', content: 'The sum of first k integers is k * (k + 1) / 2. Solve the quadratic equation k^2 + k - 2n = 0 using quadratic formula: floor(sqrt(2 * n + 0.25) - 0.5).' }],
  jsSolution: (n) => {
    return Math.floor(Math.sqrt(2 * n + 0.25) - 0.5);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5]);
    cases.push([8]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10000, 1000000)]);
    return cases;
  }
},

// 6
{
  slug: 'binary-gap',
  title: 'Binary Gap',
  description: 'Given a positive integer n, find and return the longest distance between any two consecutive 1s in the binary representation of n. If there are not two consecutive 1s, return 0.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '1 <= n <= 10^9',
  examples: [{ input: '22', output: '2', explanation: '22 in binary is 10110. Consecutive 1s distances are 2 and 1. Longest is 2.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track last set bit', content: 'Iterate bits of n. Keep track of the index of the last set bit. If currently at another set bit, compute distance, update max, and update last set bit index.' }],
  jsSolution: (n) => {
    let last = -1;
    let maxDist = 0;
    let idx = 0;
    while (n > 0) {
      if ((n & 1) === 1) {
        if (last !== -1) {
          maxDist = Math.max(maxDist, idx - last);
        }
        last = idx;
      }
      n = n >> 1;
      idx++;
    }
    return maxDist;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([22]);
    cases.push([8]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10000, 10000000)]);
    return cases;
  }
},

// 7
{
  slug: 'smallest-range-i',
  title: 'Smallest Range I',
  description: 'You are given an integer array nums and an integer k. In one operation, you can choose any index i and change nums[i] to nums[i] + x where x is an integer from the range [-k, k]. Return the minimum possible difference between the maximum and minimum elements of nums after applying this operation to all indices.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Math'],
  constraints: '1 <= nums.length <= 10000. 0 <= nums[i] <= 10000. 0 <= k <= 10000.',
  examples: [{ input: '[1], 0', output: '0' }, { input: '[0,10], 2', output: '6' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Min/Max gap adjustment', content: 'Find min and max of nums. The closest we can bring them is by adding k to min and subtracting k from max. The result is max(0, (maxVal - k) - (minVal + k)).' }],
  jsSolution: (nums, k) => {
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < nums.length; i++) {
      min = Math.min(min, nums[i]);
      max = Math.max(max, nums[i]);
    }
    return Math.max(0, max - min - 2 * k);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1], 0]);
    cases.push([[0, 10], 2]);
    
    const gen = (n) => {
      const nums = randArr(n, 0, 100);
      const k = randInt(0, 15);
      return [nums, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 8
{
  slug: 'projection-area-of-3d-shapes',
  title: 'Projection Area of 3D Shapes',
  description: 'You are given an n x n grid where we place some 1 x 1 x 1 cubes that are axis-aligned with the x, y, and z axes. Each value v = grid[i][j] represents a tower of v cubes placed on top of cell (i, j). We view the projection of these cubes onto the xy, yz, and zx planes. Return the total area of all three projections.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Geometry', 'Array', 'Matrix'],
  constraints: 'n == grid.length == grid[i].length. 1 <= n <= 50. 0 <= grid[i][j] <= 100.',
  examples: [{ input: '[[1,2],[3,4]]', output: '17' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sum max of rows/columns', content: 'xy projection: count of all cells with value > 0. yz projection: sum of the max element of each row. zx projection: sum of the max element of each column.' }],
  jsSolution: (grid) => {
    const N = grid.length;
    let xy = 0, yz = 0, zx = 0;
    
    for (let i = 0; i < N; i++) {
      let maxRow = 0;
      let maxCol = 0;
      for (let j = 0; j < N; j++) {
        if (grid[i][j] > 0) xy++;
        maxRow = Math.max(maxRow, grid[i][j]);
        maxCol = Math.max(maxCol, grid[j][i]);
      }
      yz += maxRow;
      zx += maxCol;
    }
    return xy + yz + zx;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [3, 4]]]);
    
    const gen = (n) => {
      const grid = Array.from({ length: n }, () => randArr(n, 0, 10));
      return [grid];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12)));
    return cases;
  }
},

// 9
{
  slug: 'surface-area-of-3d-shapes',
  title: 'Surface Area of 3D Shapes',
  description: 'You are given an n x n grid where we place some 1 x 1 x 1 cubes that are axis-aligned with the x, y, and z axes. Return the total surface area of the resulting 3D shape.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Geometry', 'Array', 'Matrix'],
  constraints: 'n == grid.length == grid[i].length. 1 <= n <= 50. 0 <= grid[i][j] <= 100.',
  examples: [{ input: '[[1,2],[3,4]]', output: '34' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Grid surface subtraction', content: 'For each tower, it contributes 4 * v + 2 surface area if v > 0. Subtract 2 * min(v1, v2) for all adjacent towers in 4 directions as they overlap.' }],
  jsSolution: (grid) => {
    const N = grid.length;
    let ans = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (grid[i][j] > 0) {
          ans += grid[i][j] * 4 + 2;
          if (i > 0) ans -= Math.min(grid[i][j], grid[i - 1][j]) * 2;
          if (j > 0) ans -= Math.min(grid[i][j], grid[i][j - 1]) * 2;
        }
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [3, 4]]]);
    
    const gen = (n) => {
      const grid = Array.from({ length: n }, () => randArr(n, 0, 10));
      return [grid];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12)));
    return cases;
  }
},

// 10
{
  slug: 'x-of-a-kind-in-a-deck-of-cards',
  title: 'X of a Kind in a Deck of Cards',
  description: 'You are given an integer array deck where deck[i] represents the number written on the ith card. Return true if you can partition the deck into groups such that each group contains exactly X cards, all cards in each group are identical, and X >= 2.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Hash Table', 'Math', 'Counting', 'Number Theory'],
  constraints: '1 <= deck.length <= 10^4. 0 <= deck[i] <= 10^4.',
  examples: [{ input: '[1,2,3,4,4,3,2,1]', output: 'true', explanation: 'Possible partition [1,1], [2,2], [3,3], [4,4].' }],
  args: [{ name: 'deck', cpp: 'vector<int>&', java: 'int[]', py: 'deck: List[int]', js: 'deck' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'GCD of Frequencies', content: 'Count frequencies of each card in deck. The partitioning is possible if and only if the greatest common divisor (GCD) of all frequencies is >= 2.' }],
  jsSolution: (deck) => {
    const counts = {};
    for (let i = 0; i < deck.length; i++) counts[deck[i]] = (counts[deck[i]] || 0) + 1;
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    
    let g = -1;
    for (const count of Object.values(counts)) {
      if (g === -1) g = count;
      else g = gcd(g, count);
    }
    return g >= 2;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 4, 3, 2, 1]]);
    
    const gen = (kinds, size, solvable) => {
      const deck = [];
      const count = solvable ? size * 2 : size;
      for (let i = 0; i < kinds; i++) {
        const val = randInt(0, 100);
        const cardFreq = solvable ? count : count + randInt(0, 1);
        for (let j = 0; j < cardFreq; j++) deck.push(val);
      }
      return [deck];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), 2, Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 10), 3, Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 20), 4, Math.random() < 0.5));
    return cases;
  }
},

// 11
{
  slug: 'minimum-moves-to-equal-array-elements',
  title: 'Minimum Moves to Equal Array Elements',
  description: 'Given an integer array nums of size n, return the minimum number of moves required to make all array elements equal. In one move, you can increment n - 1 elements of the array by 1.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Math'],
  constraints: '1 <= nums.length <= 10^5. -10^9 <= nums[i] <= 10^9.',
  examples: [{ input: '[1,2,3]', output: '3', explanation: '[1,2,3] -> [2,3,3] -> [3,4,3] -> [4,4,4].' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Inverse operations logic', content: 'Incrementing n - 1 elements by 1 is mathematically equivalent to decrementing exactly 1 element by 1. Thus, we must decrement all elements to the minimum value.' }],
  jsSolution: (nums) => {
    let min = Infinity;
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      min = Math.min(min, nums[i]);
      sum += nums[i];
    }
    return sum - min * nums.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]);
    
    const gen = (n) => {
      return [randArr(n, -100, 100)];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 12
{
  slug: 'minimum-moves-to-equal-array-elements-ii',
  title: 'Minimum Moves to Equal Array Elements II',
  description: 'Given an integer array nums of size n, return the minimum number of moves required to make all array elements equal. In one move, you can increment or decrement an element of the array by 1.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Sorting'],
  constraints: '1 <= nums.length <= 10^5. -10^9 <= nums[i] <= 10^9.',
  examples: [{ input: '[1,2,3]', output: '2', explanation: 'Equalize to median (2): |1-2| + |2-2| + |3-2| = 2.' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Median logic', content: 'To minimize the sum of absolute deviations, all elements must equal the median of the array. Sort the array and sum absolute differences from the median.' }],
  jsSolution: (nums) => {
    const sorted = [...nums].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    let moves = 0;
    for (let i = 0; i < sorted.length; i++) {
      moves += Math.abs(sorted[i] - median);
    }
    return moves;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]);
    
    const gen = (n) => {
      return [randArr(n, -1000, 1000)];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 13
{
  slug: 'factorial-trailing-zeroes',
  title: 'Factorial Trailing Zeroes',
  description: 'Given an integer n, return the number of trailing zeroes in n!. Note that n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: '0 <= n <= 10^4',
  examples: [{ input: '3', output: '0' }, { input: '5', output: '1', explanation: '5! = 120, trailing zero is 1.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Prime factor 5', content: 'Trailing zeroes are created by prime factors 2 and 5. Since 2s are abundant, just count how many times 5 is a factor in range [1, n] by repeatedly dividing n by 5.' }],
  jsSolution: (n) => {
    let count = 0;
    while (n >= 5) {
      count += Math.floor(n / 5);
      n = Math.floor(n / 5);
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([5]);
    cases.push([0]);
    for (let i = 0; i < 47; i++) cases.push([randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(1000, 10000)]);
    return cases;
  }
},

// 14
{
  slug: 'powx-n',
  title: 'Pow(x, n)',
  description: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Recursion'],
  constraints: '-100.0 < x < 100.0. -2^31 <= n <= 2^31 - 1. n is an integer. Either x is not zero or n > 0. -10^4 <= x^n <= 10^4.',
  examples: [{ input: '2.00000, 10', output: '1024.00000' }],
  args: [
    { name: 'x', cpp: 'double', java: 'double', py: 'x: float', js: 'x' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Binary Exponentiation', content: 'Use recursion or iteration. If n is odd, x^n = x * x^(n-1). If n is even, x^n = (x^(n/2))^2. Handle negative n by replacing x with 1/x and n with -n.' }],
  jsSolution: (x, n) => {
    const myPow = (base, exp) => {
      if (exp === 0) return 1;
      const half = myPow(base, Math.floor(exp / 2));
      if (exp % 2 === 0) return half * half;
      return half * half * base;
    };
    if (n < 0) return parseFloat((1 / myPow(x, -n)).toFixed(5));
    return parseFloat(myPow(x, n).toFixed(5));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2.00000, 10]);
    cases.push([2.10000, 3]);
    cases.push([2.00000, -2]);
    
    const gen = () => {
      const x = parseFloat((randInt(1, 10) + Math.random()).toFixed(3));
      const n = randInt(-10, 15);
      return [x, n];
    };
    for (let i = 0; i < 47; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 15
{
  slug: 'divide-two-integers',
  title: 'Divide Two Integers',
  description: 'Given two integers dividend and divisor, divide two integers without using multiplication, division, and mod operator. Return the quotient after truncating toward zero.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '-2^31 <= dividend, divisor <= 2^31 - 1. divisor != 0.',
  examples: [{ input: '10, 3', output: '3' }],
  args: [
    { name: 'dividend', cpp: 'int', java: 'int', py: 'dividend: int', js: 'dividend' },
    { name: 'divisor', cpp: 'int', java: 'int', py: 'divisor: int', js: 'divisor' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bit shifts subtraction', content: 'Repeatedly subtract divisor doubled (using << bit shifts) from dividend to find quotient components quickly.' }],
  jsSolution: (dividend, divisor) => {
    if (dividend === -2147483648 && divisor === -1) return 2147483647;
    const sign = (dividend < 0) ^ (divisor < 0) ? -1 : 1;
    let dvd = Math.abs(dividend);
    let dvs = Math.abs(divisor);
    let ans = 0;
    while (dvd >= dvs) {
      let temp = dvs, mul = 1;
      while (dvd >= (temp * 2)) {
        temp *= 2;
        mul *= 2;
      }
      dvd -= temp;
      ans += mul;
    }
    return ans * sign;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([10, 3]);
    cases.push([7, -3]);
    
    const gen = () => {
      return [randInt(-500, 500), randInt(1, 20) * (Math.random() < 0.5 ? 1 : -1)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 16
{
  slug: 'rotate-image',
  title: 'Rotate Image',
  description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. Do not allocate another 2D matrix and do the rotation.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Matrix'],
  constraints: 'n == matrix.length == matrix[i].length. 1 <= n <= 20. -1000 <= matrix[i][j] <= 1000.',
  examples: [{ input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'void', java: 'void', py: 'None' },
  hints: [{ title: 'Transpose and Reverse', content: 'First transpose the matrix (swap matrix[i][j] and matrix[j][i]). Then reverse each row of the matrix.' }],
  jsSolution: (matrix) => {
    const n = matrix.length;
    // Transpose
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
    // Reverse rows
    for (let i = 0; i < n; i++) {
      matrix[i].reverse();
    }
    return matrix;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
    
    const gen = (n) => {
      const grid = Array.from({ length: n }, () => randArr(n, 1, 50));
      return [grid];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12)));
    return cases;
  }
},

// 17
{
  slug: 'spiral-matrix',
  title: 'Spiral Matrix',
  description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Matrix', 'Simulation'],
  constraints: 'm == matrix.length. n == matrix[i].length. 1 <= m, n <= 10. -100 <= matrix[i][j] <= 100.',
  examples: [{ input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Boundaries Shrinking', content: 'Track boundaries: left, right, top, bottom. Loop and append rows/columns sequentially, shrinking boundaries at each completed layer.' }],
  jsSolution: (matrix) => {
    if (matrix.length === 0) return [];
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    const ans = [];
    while (top <= bottom && left <= right) {
      for (let i = left; i <= right; i++) ans.push(matrix[top][i]);
      top++;
      for (let i = top; i <= bottom; i++) ans.push(matrix[i][right]);
      right--;
      if (top <= bottom) {
        for (let i = right; i >= left; i--) ans.push(matrix[bottom][i]);
        bottom--;
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) ans.push(matrix[i][left]);
        left++;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
    
    const gen = (r, c) => {
      return [Array.from({ length: r }, () => randArr(c, 1, 30))];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 10), randInt(8, 10)));
    return cases;
  }
},

// 18
{
  slug: 'spiral-matrix-ii',
  title: 'Spiral Matrix II',
  description: 'Given a positive integer n, generate an n x n matrix filled with elements from 1 to n^2 in spiral order.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Matrix', 'Simulation'],
  constraints: '1 <= n <= 20',
  examples: [{ input: '3', output: '[[1,2,3],[8,9,4],[7,6,5]]' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Simulate with cell grid', content: 'Initialize n x n matrix with 0. Keep track of borders (top, bottom, left, right) and write values 1 to n^2 sequentially in layers.' }],
  jsSolution: (n) => {
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    let val = 1;
    let top = 0, bottom = n - 1, left = 0, right = n - 1;
    while (top <= bottom && left <= right) {
      for (let i = left; i <= right; i++) matrix[top][i] = val++;
      top++;
      for (let i = top; i <= bottom; i++) matrix[i][right] = val++;
      right--;
      if (top <= bottom) {
        for (let i = right; i >= left; i--) matrix[bottom][i] = val++;
        bottom--;
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) matrix[i][left] = val++;
        left++;
      }
    }
    return matrix;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([1]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 3)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(3, 8)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(8, 15)]);
    return cases;
  }
},

// 19
{
  slug: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  description: 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s. You must do it in place.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Hash Table', 'Matrix'],
  constraints: 'm == matrix.length. n == matrix[0].length. 1 <= m, n <= 10. -2^31 <= matrix[i][j] <= 2^31 - 1.',
  examples: [{ input: '[[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'void', java: 'void', py: 'None' },
  hints: [{ title: 'Use first row/column as state', content: 'Use first row and column to record if row/column should be zeroed. Track if the first row and first column themselves need to be zeroed separately.' }],
  jsSolution: (matrix) => {
    const R = matrix.length;
    const C = matrix[0].length;
    let isCol = false;
    
    for (let i = 0; i < R; i++) {
      if (matrix[i][0] === 0) isCol = true;
      for (let j = 1; j < C; j++) {
        if (matrix[i][j] === 0) {
          matrix[0][j] = 0;
          matrix[i][0] = 0;
        }
      }
    }
    
    for (let i = 1; i < R; i++) {
      for (let j = 1; j < C; j++) {
        if (matrix[i][0] === 0 || matrix[0][j] === 0) {
          matrix[i][j] = 0;
        }
      }
    }
    
    if (matrix[0][0] === 0) {
      for (let j = 0; j < C; j++) matrix[0][j] = 0;
    }
    if (isCol) {
      for (let i = 0; i < R; i++) matrix[i][0] = 0;
    }
    return matrix;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1, 1], [1, 0, 1], [1, 1, 1]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.15 ? 0 : randInt(1, 20))
      );
      return [grid];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 10), randInt(8, 10)));
    return cases;
  }
},

// 20
{
  slug: 'matrix-diagonal-sum',
  title: 'Matrix Diagonal Sum',
  description: 'Given a square matrix mat, return the sum of the matrix diagonals. Only include the sum of all the elements on the primary diagonal and all the elements on the secondary diagonal that are not part of the primary diagonal.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Matrix'],
  constraints: 'n == mat.length == mat[i].length. 1 <= n <= 100. 1 <= mat[i][j] <= 100.',
  examples: [{ input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '25' }],
  args: [{ name: 'mat', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'mat: List[List[int]]', js: 'mat' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Index-based summation', content: 'Primary diagonal elements are mat[i][i]. Secondary diagonal elements are mat[i][n - 1 - i]. If n is odd, subtract middle cell mat[n/2][n/2] as it is counted twice.' }],
  jsSolution: (mat) => {
    const N = mat.length;
    let sum = 0;
    for (let i = 0; i < N; i++) {
      sum += mat[i][i];
      sum += mat[i][N - 1 - i];
    }
    if (N % 2 === 1) {
      const mid = Math.floor(N / 2);
      sum -= mat[mid][mid];
    }
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]);
    
    const gen = (n) => {
      return [Array.from({ length: n }, () => randArr(n, 1, 10))];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 21
{
  slug: 'transpose-matrix',
  title: 'Transpose Matrix',
  description: 'Given a 2D integer array matrix, return the transpose of matrix. The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix\'s row and column indices.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Matrix', 'Simulation'],
  constraints: 'm == matrix.length. n == matrix[i].length. 1 <= m, n <= 10. -10^5 <= matrix[i][j] <= 10^5.',
  examples: [{ input: '[[1,2,3],[4,5,6]]', output: '[[1,4],[2,5],[3,6]]' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Grid switching indexes', content: 'Initialize target grid of dimension columns x rows. Set target[j][i] = matrix[i][j].' }],
  jsSolution: (matrix) => {
    const R = matrix.length;
    const C = matrix[0].length;
    const ans = Array.from({ length: C }, () => Array(R).fill(0));
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        ans[c][r] = matrix[r][c];
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2, 3], [4, 5, 6]]]);
    
    const gen = (r, c) => {
      return [Array.from({ length: r }, () => randArr(c, 1, 100))];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 10), randInt(8, 10)));
    return cases;
  }
},

// 22
{
  slug: 'reshape-the-matrix',
  title: 'Reshape the Matrix',
  description: 'In MATLAB, there is a handy function called reshape which can reshape an m x n matrix into a new one with a different size r x c keeping its original data. You are given an m x n matrix mat and two integers r and c representing the row number and column number of the wanted reshaped matrix. If the reshape operation with given parameters is possible and legal, output the new reshaped matrix; Otherwise, output the original matrix.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Matrix', 'Simulation'],
  constraints: 'm == mat.length. n == mat[i].length. 1 <= m, n <= 10. -1000 <= mat[i][j] <= 1000. 1 <= r, c <= 20.',
  examples: [{ input: '[[1,2],[3,4]], 1, 4', output: '[[1,2,3,4]]' }],
  args: [
    { name: 'mat', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'mat: List[List[int]]', js: 'mat' },
    { name: 'r', cpp: 'int', java: 'int', py: 'r: int', js: 'r' },
    { name: 'c', cpp: 'int', java: 'int', py: 'c: int', js: 'c' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Cell index flattening', content: 'Check if m * n == r * c. If not, return mat. Otherwise, loop through cells using i from 0 to m*n - 1. Flat index transforms to old: row = i / n, col = i % n. New: row = i / c, col = i % c.' }],
  jsSolution: (mat, r, c) => {
    const M = mat.length;
    const N = mat[0].length;
    if (M * N !== r * c) return mat;
    
    const ans = Array.from({ length: r }, () => Array(c).fill(0));
    for (let i = 0; i < M * N; i++) {
      ans[Math.floor(i / c)][i % c] = mat[Math.floor(i / N)][i % N];
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [3, 4]], 1, 4]);
    cases.push([[[1, 2], [3, 4]], 2, 4]);
    
    const gen = (m, n) => {
      const mat = Array.from({ length: m }, () => randArr(n, 1, 50));
      const possible = Math.random() < 0.5;
      const r = possible ? randInt(1, m * n) : randInt(1, 10);
      const c = possible ? Math.floor((m * n) / r) : randInt(1, 10);
      return [mat, r, c];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 6), randInt(4, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 8), randInt(6, 8)));
    return cases;
  }
},

// 23
{
  slug: 'count-primes',
  title: 'Count Primes',
  description: 'Given an integer n, return the number of prime numbers that are strictly less than n.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Number Theory'],
  constraints: '0 <= n <= 5 * 10^5',
  examples: [{ input: '10', output: '4', explanation: 'There are 4 prime numbers less than 10: 2, 3, 5, 7.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sieve of Eratosthenes', content: 'Initialize a boolean array isPrime of size n to true. Set index 0 and 1 to false. Loop from 2 to sqrt(n). If isPrime[i] is true, mark all multiples i*i, i*(i+1), ... as false.' }],
  jsSolution: (n) => {
    if (n <= 2) return 0;
    const isPrime = Array(n).fill(true);
    isPrime[0] = false;
    isPrime[1] = false;
    for (let i = 2; i * i < n; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j < n; j += i) {
          isPrime[j] = false;
        }
      }
    }
    let count = 0;
    for (let i = 2; i < n; i++) if (isPrime[i]) count++;
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([10]);
    cases.push([0]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 2000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(2000, 20000)]);
    return cases;
  }
},

// 24
{
  slug: 'plus-one',
  title: 'Plus One',
  description: 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0s. Increment the large integer by one and return the resulting array of digits.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Math'],
  constraints: '1 <= digits.length <= 100. 0 <= digits[i] <= 9. digits does not contain any leading 0s.',
  examples: [{ input: '[1,2,3]', output: '[1,2,4]' }],
  args: [{ name: 'digits', cpp: 'vector<int>&', java: 'int[]', py: 'digits: List[int]', js: 'digits' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Backwards iteration carry', content: 'Iterate digits backwards. If current is < 9, increment and return digits. Otherwise set current to 0 and continue. If loop finishes, insert 1 at beginning.' }],
  jsSolution: (digits) => {
    const res = [...digits];
    for (let i = res.length - 1; i >= 0; i--) {
      if (res[i] < 9) {
        res[i]++;
        return res;
      }
      res[i] = 0;
    }
    res.unshift(1);
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]);
    cases.push([[9, 9, 9]]);
    
    const gen = (n) => {
      const arr = [randInt(1, 9)];
      for (let i = 1; i < n; i++) arr.push(randInt(0, 9));
      if (Math.random() < 0.3) {
        // force 9s
        return [Array(n).fill(9)];
      }
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 25
{
  slug: 'add-binary',
  title: 'Add Binary',
  description: 'Given two binary strings a and b, return their sum as a binary string.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'String', 'Simulation', 'Bit Manipulation'],
  constraints: '1 <= a.length, b.length <= 10^4. a and b consist only of \'0\' or \'1\' characters. Each string does not contain leading zeros except for the zero itself.',
  examples: [{ input: '"11", "1"', output: '"100"' }],
  args: [
    { name: 'a', cpp: 'string', java: 'String', py: 'a: str', js: 'a' },
    { name: 'b', cpp: 'string', java: 'String', py: 'b: str', js: 'b' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Digits Simulation', content: 'Use two pointers from both ends. Maintain carry. Add values and mod 2, building binary string backwards.' }],
  jsSolution: (a, b) => {
    let res = "";
    let i = a.length - 1;
    let j = b.length - 1;
    let carry = 0;
    while (i >= 0 || j >= 0 || carry > 0) {
      let sum = carry;
      if (i >= 0) sum += parseInt(a[i--], 10);
      if (j >= 0) sum += parseInt(b[j--], 10);
      res = (sum % 2).toString() + res;
      carry = Math.floor(sum / 2);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["11", "1"]);
    cases.push(["1010", "1011"]);
    
    const gen = (l1, l2) => {
      const a = '1' + Array.from({ length: l1 - 1 }, () => Math.random() < 0.5 ? '0' : '1').join('');
      const b = '1' + Array.from({ length: l2 - 1 }, () => Math.random() < 0.5 ? '0' : '1').join('');
      return [a, b];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20), randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 60), randInt(20, 60)));
    return cases;
  }
},

// 26
{
  slug: 'integer-to-english-words',
  title: 'Integer to English Words',
  description: 'Convert a non-negative integer num to its English words representation.',
  difficulty: 'Hard',
  category: 'Math & Geometry',
  tags: ['Math', 'String', 'Recursion'],
  constraints: '0 <= num <= 2^31 - 1',
  examples: [{ input: '123', output: '"One Hundred Twenty Three"' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Divide by Thousands', content: 'Divide the number into billions, millions, thousands, and remainder. Process each 3-digit group recursively using words for hundreds, tens, and units.' }],
  jsSolution: (num) => {
    if (num === 0) return "Zero";
    const LESS_THAN_20 = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const TENS = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const THOUSANDS = ["", "Thousand", "Million", "Billion"];
    
    const helper = (n) => {
      if (n === 0) return "";
      if (n < 20) return LESS_THAN_20[n] + " ";
      if (n < 100) return TENS[Math.floor(n / 10)] + " " + helper(n % 10);
      return LESS_THAN_20[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
    };
    
    let res = "";
    let i = 0;
    while (num > 0) {
      if (num % 1000 !== 0) {
        res = helper(num % 1000) + THOUSANDS[i] + " " + res;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return res.trim().replace(/\s+/g, ' ');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([123]);
    cases.push([12345]);
    cases.push([0]);
    for (let i = 0; i < 47; i++) cases.push([randInt(1, 99)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 99999)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100000, 10000000)]);
    return cases;
  }
},

// 27
{
  slug: 'rectangle-area',
  title: 'Rectangle Area',
  description: 'Given the coordinates of two rectilinear rectangles in a 2D plane, return the total area covered by the two rectangles. The first rectangle is defined by its bottom-left corner (ax1, ay1) and its top-right corner (ax2, ay2). The second rectangle is defined by its bottom-left corner (bx1, by1) and its top-right corner (bx2, by2).',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Geometry'],
  constraints: '-10^4 <= ax1, ay1, ax2, ay2, bx1, by1, bx2, by2 <= 10^4',
  examples: [{ input: '-3, 0, 3, 4, 0, -1, 9, 2', output: '45' }],
  args: [
    { name: 'ax1', cpp: 'int', java: 'int', py: 'ax1: int', js: 'ax1' },
    { name: 'ay1', cpp: 'int', java: 'int', py: 'ay1: int', js: 'ay1' },
    { name: 'ax2', cpp: 'int', java: 'int', py: 'ax2: int', js: 'ax2' },
    { name: 'ay2', cpp: 'int', java: 'int', py: 'ay2: int', js: 'ay2' },
    { name: 'bx1', cpp: 'int', java: 'int', py: 'bx1: int', js: 'bx1' },
    { name: 'by1', cpp: 'int', java: 'int', py: 'by1: int', js: 'by1' },
    { name: 'bx2', cpp: 'int', java: 'int', py: 'bx2: int', js: 'bx2' },
    { name: 'by2', cpp: 'int', java: 'int', py: 'by2: int', js: 'by2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sum minus intersection', content: 'Calculate separate areas: areaA = (ax2 - ax1) * (ay2 - ay1) and areaB = (bx2 - bx1) * (by2 - by1). Subtract the intersection area which is max(0, min(ax2, bx2) - max(ax1, bx1)) * max(0, min(ay2, by2) - max(ay1, by1)).' }],
  jsSolution: (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) => {
    const areaA = (ax2 - ax1) * (ay2 - ay1);
    const areaB = (bx2 - bx1) * (by2 - by1);
    const overlapX = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
    const overlapY = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
    return areaA + areaB - overlapX * overlapY;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([-3, 0, 3, 4, 0, -1, 9, 2]);
    
    const gen = () => {
      const ax1 = randInt(-10, 0);
      const ay1 = randInt(-10, 0);
      const ax2 = ax1 + randInt(2, 10);
      const ay2 = ay1 + randInt(2, 10);
      const bx1 = randInt(-5, 5);
      const by1 = randInt(-5, 5);
      const bx2 = bx1 + randInt(2, 10);
      const by2 = by1 + randInt(2, 10);
      return [ax1, ay1, ax2, ay2, bx1, by1, bx2, by2];
    };
    for (let i = 0; i < 49; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 28
{
  slug: 'max-points-on-a-line',
  title: 'Max Points on a Line',
  description: 'Given an array of points where points[i] = [xi, yi] represents a point on the 2D plane, return the maximum number of points that lie on the same straight line.',
  difficulty: 'Hard',
  category: 'Math & Geometry',
  tags: ['Array', 'Hash Table', 'Math', 'Geometry'],
  constraints: '1 <= points.length <= 50. points[i].length == 2. All points are unique.',
  examples: [{ input: '[[1,1],[2,2],[3,3]]', output: '3' }],
  args: [{ name: 'points', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'points: List[List[int]]', js: 'points' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Pairwise slope hash', content: 'For each point i, calculate the slopes (dy / dx simplified by GCD) to all other points j. Find the maximum number of points sharing the same slope hash.' }],
  jsSolution: (points) => {
    if (points.length <= 2) return points.length;
    let maxPts = 1;
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    
    for (let i = 0; i < points.length; i++) {
      const slopes = {};
      let localMax = 0;
      for (let j = i + 1; j < points.length; j++) {
        let dy = points[j][1] - points[i][1];
        let dx = points[j][0] - points[i][0];
        const g = gcd(dy, dx);
        dy = Math.floor(dy / g);
        dx = Math.floor(dx / g);
        const hash = `${dy}/${dx}`;
        slopes[hash] = (slopes[hash] || 0) + 1;
        localMax = Math.max(localMax, slopes[hash]);
      }
      maxPts = Math.max(maxPts, localMax + 1);
    }
    return maxPts;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1], [2, 2], [3, 3]]]);
    cases.push([[[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]]);
    
    const gen = (n) => {
      const points = [];
      const seen = new Set();
      // add some collinear points
      const slope = randInt(1, 3);
      for (let i = 0; i < Math.floor(n / 2); i++) {
        points.push([i, i * slope]);
        seen.add(`${i},${i*slope}`);
      }
      while (points.length < n) {
        const x = randInt(-15, 15);
        const y = randInt(-15, 15);
        const hash = `${x},${y}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          points.push([x, y]);
        }
      }
      return [points];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 25)));
    return cases;
  }
},

// 29
{
  slug: 'valid-boomerang',
  title: 'Valid Boomerang',
  description: 'Given an array points where points[i] = [xi, yi] represents a point on the 2D plane, return true if these points are a boomerang. A boomerang is a set of three points that are all distinct and not in a straight line.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Geometry'],
  constraints: 'points.length == 3. points[i].length == 2. 0 <= xi, yi <= 100.',
  examples: [{ input: '[[1,1],[2,3],[3,2]]', output: 'true' }],
  args: [{ name: 'points', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'points: List[List[int]]', js: 'points' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Cross product slope comparison', content: 'Slope from P1 to P2 is (y2 - y1) / (x2 - x1). Slope from P1 to P3 is (y3 - y1) / (x3 - x1). They are collinear if (y2 - y1) * (x3 - x1) == (y3 - y1) * (x2 - x1). Return true if not equal.' }],
  jsSolution: (points) => {
    const [p1, p2, p3] = points;
    return (p2[1] - p1[1]) * (p3[0] - p1[0]) !== (p3[1] - p1[1]) * (p2[0] - p1[0]);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1], [2, 3], [3, 2]]]);
    cases.push([[[1, 1], [2, 2], [3, 3]]]);
    
    const gen = (collinear) => {
      const p1 = [randInt(0, 10), randInt(0, 10)];
      if (collinear) {
        const dx = randInt(1, 3);
        const dy = randInt(1, 3);
        return [[p1, [p1[0] + dx, p1[1] + dy], [p1[0] + 2 * dx, p1[1] + 2 * dy]]];
      } else {
        return [[p1, [randInt(0, 10), randInt(0, 10)], [randInt(0, 10), randInt(0, 10)]]];
      }
    };
    for (let i = 0; i < 48; i++) cases.push(gen(Math.random() < 0.3));
    for (let i = 0; i < 50; i++) cases.push(gen(Math.random() < 0.3));
    for (let i = 0; i < 50; i++) cases.push(gen(Math.random() < 0.3));
    return cases;
  }
},

// 30
{
  slug: 'sign-of-the-product-of-an-array',
  title: 'Sign of the Product of an Array',
  description: 'There is a function signFunc(x) that returns: 1 if x is positive, -1 if x is negative, 0 if x is equal to 0. You are given an integer array nums. Let product be the product of all values in the array nums. Return signFunc(product).',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Math'],
  constraints: '1 <= nums.length <= 1000. -100 <= nums[i] <= 100.',
  examples: [{ input: '[-1,-2,-3,-4,3,2,1]', output: '1' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count negative signs', content: 'Do not multiply. Count the number of negative elements. If there is a zero, return 0. If negatives count is odd, return -1, otherwise 1.' }],
  jsSolution: (nums) => {
    let neg = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === 0) return 0;
      if (nums[i] < 0) neg++;
    }
    return neg % 2 === 1 ? -1 : 1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-1, -2, -3, -4, 3, 2, 1]]);
    cases.push([[1, 5, 0, 2, -3]]);
    
    const gen = (n) => {
      const arr = randArr(n, -10, 10);
      if (Math.random() < 0.2) {
        // inject 0
        arr[randInt(0, n - 1)] = 0;
      }
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 31
{
  slug: 'convert-a-number-to-hexadecimal',
  title: 'Convert a Number to Hexadecimal',
  description: 'Given a 32-bit signed integer num, return a string representing its hexadecimal representation. For negative integers, two’s complement method is used.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '-2^31 <= num <= 2^31 - 1',
  examples: [{ input: '26', output: '"1a"' }, { input: '-1', output: '"ffffffff"' }],
  args: [{ name: 'num', cpp: 'int', java: 'String', py: 'num: int', js: 'num' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: '32-bit unsigned bitwise shifting', content: 'To handle negative numbers natively, convert to unsigned: num >>> 0. Repeatedly take modulo 16 (or num & 15) and map to hex digits.' }],
  jsSolution: (num) => {
    if (num === 0) return "0";
    const hex = "0123456789abcdef";
    let uNum = num >>> 0; // Convert to 32-bit unsigned
    let res = "";
    while (uNum > 0) {
      res = hex[uNum & 15] + res;
      uNum = uNum >>> 4;
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([26]);
    cases.push([-1]);
    cases.push([0]);
    for (let i = 0; i < 47; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 100000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(-100000, 100000)]);
    return cases;
  }
},

// 32
{
  slug: 'water-bottles',
  title: 'Water Bottles',
  description: 'There are numBottles water bottles that are initially full of water. You can exchange numExchange empty water bottles from the market with one full water bottle. Return the maximum number of water bottles you can drink.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Simulation'],
  constraints: '1 <= numBottles <= 100. 2 <= numExchange <= 100.',
  examples: [{ input: '9, 3', output: '13', explanation: 'Drink 9 bottles. Exchange 9 empty for 3 full. Drink 3. Exchange 3 empty for 1 full. Drink 1. Total: 9+3+1 = 13.' }],
  args: [
    { name: 'numBottles', cpp: 'int', java: 'int', py: 'numBottles: int', js: 'numBottles' },
    { name: 'numExchange', cpp: 'int', java: 'int', py: 'numExchange: int', js: 'numExchange' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Simulate rounds', content: 'While you have enough empty bottles to exchange, add the exchanged bottles to your drank counter, and update the empty bottles to (emptyBottles % numExchange) + exchangedBottles.' }],
  jsSolution: (numBottles, numExchange) => {
    let drank = numBottles;
    let empty = numBottles;
    while (empty >= numExchange) {
      const exchanged = Math.floor(empty / numExchange);
      drank += exchanged;
      empty = (empty % numExchange) + exchanged;
    }
    return drank;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([9, 3]);
    cases.push([15, 4]);
    
    const gen = () => {
      return [randInt(1, 100), randInt(2, 15)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 33
{
  slug: 'three-consecutive-odds',
  title: 'Three Consecutive Odds',
  description: 'Given an integer array arr, return true if there are three consecutive odd numbers in the array. Otherwise, return false.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array'],
  constraints: '1 <= arr.length <= 1000. 1 <= arr[i] <= 1000.',
  examples: [{ input: '[2,6,4,1]', output: 'false' }, { input: '[1,2,34,3,4,5,7,23,12]', output: 'true', explanation: '[5,7,23] are three consecutive odds.' }],
  args: [{ name: 'arr', cpp: 'vector<int>&', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Contiguous window of odds', content: 'Loop through array up to length - 2. Check if arr[i], arr[i+1] and arr[i+2] are all odd. Return true if yes.' }],
  jsSolution: (arr) => {
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i] % 2 !== 0 && arr[i + 1] % 2 !== 0 && arr[i + 2] % 2 !== 0) {
        return true;
      }
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 6, 4, 1]]);
    cases.push([[1, 2, 34, 3, 4, 5, 7, 23, 12]]);
    
    const gen = (n, hasThreeOdds) => {
      const arr = randArr(n, 1, 50).map(x => x % 2 === 0 ? x : x + 1); // all evens
      if (hasThreeOdds && n >= 3) {
        const idx = randInt(0, n - 3);
        arr[idx] = 11;
        arr[idx + 1] = 13;
        arr[idx + 2] = 15;
      }
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 34
{
  slug: 'distribute-candies-to-people',
  title: 'Distribute Candies to People',
  description: 'We distribute some number of candies, to a row of n = num_people people in the following way: We give 1 candy to the first person, 2 candies to the second person, and so on until we give n candies to the last person. Then, we go back to the start of the row, giving n + 1 candies to the first person, n + 2 candies to the second person, and so on until we run out of candies. Return an array representing final distribution.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Simulation'],
  constraints: '1 <= candies <= 10^9. 1 <= num_people <= 1000.',
  examples: [{ input: '7, 4', output: '[1,2,3,1]' }],
  args: [
    { name: 'candies', cpp: 'int', java: 'int', py: 'candies: int', js: 'candies' },
    { name: 'num_people', cpp: 'int', java: 'int', py: 'num_people: int', js: 'num_people' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Simulate loop distribution', content: 'Track current round index. Loop over people. In round r, person p receives min(candies, r * num_people + p + 1) candies. Subtract from total candies and repeat until candies == 0.' }],
  jsSolution: (candies, num_people) => {
    const ans = Array(num_people).fill(0);
    let give = 1;
    let idx = 0;
    while (candies > 0) {
      ans[idx] += Math.min(candies, give);
      candies -= give;
      give++;
      idx = (idx + 1) % num_people;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([7, 4]);
    cases.push([10, 3]);
    
    const gen = () => {
      return [randInt(1, 1000), randInt(1, 10)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 35
{
  slug: 'number-of-steps-to-reduce-a-number-to-zero',
  title: 'Number of Steps to Reduce a Number to Zero',
  description: 'Given an integer num, return the number of steps to reduce it to zero. In one step, if the current number is even, you have to divide it by 2, otherwise, you have to subtract 1 from it.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '0 <= num <= 10^6',
  examples: [{ input: '14', output: '6', explanation: '14 -> 7 -> 6 -> 3 -> 2 -> 1 -> 0. Steps: 6.' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Modulo simulation', content: 'Use a loop. If num % 2 === 0, divide by 2, else subtract 1. Count steps until num becomes 0.' }],
  jsSolution: (num) => {
    let steps = 0;
    while (num > 0) {
      if (num % 2 === 0) num /= 2;
      else num--;
      steps++;
    }
    return steps;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([14]);
    cases.push([8]);
    cases.push([0]);
    for (let i = 0; i < 47; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10000, 100000)]);
    return cases;
  }
},

// 36
{
  slug: 'largest-triangle-area',
  title: 'Largest Triangle Area',
  description: 'Given an array of points on the X-Y plane points where points[i] = [xi, yi], return the area of the largest triangle that can be formed by any three different points. Answers within 10^-5 of the actual answer will be accepted.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Geometry'],
  constraints: '3 <= points.length <= 50. -50 <= xi, yi <= 50. All points are unique.',
  examples: [{ input: '[[0,0],[0,1],[1,0],[0,2],[2,0]]', output: '2.00000' }],
  args: [{ name: 'points', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'points: List[List[int]]', js: 'points' }],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Shoelace Formula', content: 'For all combinations of three points (i, j, k), use the shoelace formula to find area: 0.5 * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|. Track the maximum area.' }],
  jsSolution: (points) => {
    let maxArea = 0;
    const N = points.length;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        for (let k = j + 1; k < N; k++) {
          const area = 0.5 * Math.abs(
            points[i][0] * (points[j][1] - points[k][1]) +
            points[j][0] * (points[k][1] - points[i][1]) +
            points[k][0] * (points[i][1] - points[j][1])
          );
          maxArea = Math.max(maxArea, area);
        }
      }
    }
    return parseFloat(maxArea.toFixed(5));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 0], [0, 1], [1, 0], [0, 2], [2, 0]]]);
    
    const gen = (n) => {
      const points = [];
      const seen = new Set();
      while (points.length < n) {
        const x = randInt(-10, 10);
        const y = randInt(-10, 10);
        const hash = `${x},${y}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          points.push([x, y]);
        }
      }
      return [points];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(3, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20)));
    return cases;
  }
},

// 37
{
  slug: 'fizz-buzz-multithreaded',
  title: 'Fizz Buzz Multithreaded',
  description: 'Implement a multithreaded version of Fizz Buzz. You have four threads: Thread A calls fizz(), Thread B calls buzz(), Thread C calls fizzbuzz(), and Thread D calls number(). Modify to output Fizz, Buzz, FizzBuzz, or number in sequence up to n.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: '1 <= n <= 50',
  examples: [{ input: '15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Sequence loop', content: 'Generate the array sequentially. Standard Fizz Buzz mapping: if div by 15 FizzBuzz, else if 3 Fizz, else if 5 Buzz, else string number.' }],
  jsSolution: (n) => {
    const ans = [];
    for (let i = 1; i <= n; i++) {
      if (i % 15 === 0) ans.push("FizzBuzz");
      else if (i % 3 === 0) ans.push("Fizz");
      else if (i % 5 === 0) ans.push("Buzz");
      else ans.push(i.toString());
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([15]);
    cases.push([1]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10, 30)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(30, 50)]);
    return cases;
  }
},

// 38
{
  slug: 'matrix-cells-in-distance-order',
  title: 'Matrix Cells in Distance Order',
  description: 'You are given four integers rows, cols, rCenter, and cCenter. Return the coordinates of all cells in the matrix sorted by their Manhattan distance from (rCenter, cCenter).',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Geometry', 'Sorting'],
  constraints: '1 <= rows, cols <= 100. 0 <= rCenter < rows. 0 <= cCenter < cols.',
  examples: [{ input: '1, 2, 0, 0', output: '[[0,0],[0,1]]' }],
  args: [
    { name: 'rows', cpp: 'int', java: 'int', py: 'rows: int', js: 'rows' },
    { name: 'cols', cpp: 'int', java: 'int', py: 'cols: int', js: 'cols' },
    { name: 'rCenter', cpp: 'int', java: 'int', py: 'rCenter: int', js: 'rCenter' },
    { name: 'cCenter', cpp: 'int', java: 'int', py: 'cCenter: int', js: 'cCenter' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Manhattan distance sort', content: 'Generate all coordinates in the grid. Then sort them by |r - rCenter| + |c - cCenter| Manhattan distance.' }],
  jsSolution: (rows, cols, rCenter, cCenter) => {
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push([r, c]);
      }
    }
    cells.sort((a, b) => {
      const distA = Math.abs(a[0] - rCenter) + Math.abs(a[1] - cCenter);
      const distB = Math.abs(b[0] - rCenter) + Math.abs(b[1] - cCenter);
      return distA - distB;
    });
    return cells;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1, 2, 0, 0]);
    cases.push([2, 2, 0, 1]);
    
    const gen = () => {
      const r = randInt(1, 8);
      const c = randInt(1, 8);
      return [r, c, randInt(0, r - 1), randInt(0, c - 1)];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
}

];
