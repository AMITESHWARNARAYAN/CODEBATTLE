// Math & Geometry — Batch 3 (8 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'clumsy-factorial',
  title: 'Clumsy Factorial',
  description: 'The clumsy factorial of an integer n is defined by applying a fixed rotation of operations: multiplication \'*\', division \'/\', addition \'+\', and subtraction \'-\' in this order on the consecutive integers. For example, clumsy(10) = 10 * 9 / 8 + 7 - 6 * 5 / 4 + 3 - 2 * 1. Return the clumsy factorial of n. Division is integer division, truncating toward zero.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Stack', 'Simulation'],
  constraints: '1 <= n <= 10000',
  examples: [{ input: '4', output: '7', explanation: '4 * 3 / 2 + 1 = 7' }, { input: '10', output: '12', explanation: '10 * 9 / 8 + 7 - 6 * 5 / 4 + 3 - 2 * 1 = 12' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Simulate with Stack', content: 'Use a stack to keep track of numbers. Multiplication and division can be performed immediately by popping the top element, applying the operation, and pushing back. Addition and subtraction can be pushed as positive or negative numbers to sum at the end.' }],
  jsSolution: (n) => {
    let op = 0; // 0: *, 1: /, 2: +, 3: -
    const stack = [n];
    for (let i = n - 1; i > 0; i--) {
      if (op === 0) {
        stack.push(stack.pop() * i);
      } else if (op === 1) {
        const val = stack.pop();
        stack.push(val >= 0 ? Math.floor(val / i) : Math.ceil(val / i));
      } else if (op === 2) {
        stack.push(i);
      } else {
        stack.push(-i);
      }
      op = (op + 1) % 4;
    }
    return stack.reduce((sum, val) => sum + val, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4]);
    cases.push([10]);
    for (let i = 0; i < 48; i++) {
      cases.push([randInt(1, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(1000, 10000)]);
    }
    return cases;
  }
},

// 2
{
  slug: 'reordered-power-of-2',
  title: 'Reordered Power of 2',
  description: 'You are given an integer n. We reorder the digits in any order (including the original order) such that the leading digit is not zero. Return true if and only if we can do this so that the resulting number is a power of two.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Sorting'],
  constraints: '1 <= n <= 10^9',
  examples: [{ input: '1', output: 'true' }, { input: '10', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Count Digit Frequencies', content: 'Two numbers can be reordered into one another if and only if they have the same counts of each digit. Since n is up to 10^9, there are only 31 possible powers of 2. Compare the digit frequency of n with each power of 2.' }],
  jsSolution: (n) => {
    const getFreq = (num) => {
      const freq = Array(10).fill(0);
      while (num > 0) {
        freq[num % 10]++;
        num = Math.floor(num / 10);
      }
      return freq.join(',');
    };
    const targetFreq = getFreq(n);
    for (let i = 0; i < 31; i++) {
      if (getFreq(1 << i) === targetFreq) return true;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1]);
    cases.push([10]);
    for (let i = 0; i < 48; i++) {
      cases.push([Math.random() < 0.3 ? (1 << randInt(0, 30)) : randInt(1, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.3 ? (1 << randInt(0, 30)) : randInt(1000, 1000000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.3 ? (1 << randInt(0, 30)) : randInt(1000000, 1000000000)]);
    }
    return cases;
  }
},

// 3
{
  slug: 'integer-break',
  title: 'Integer Break',
  description: 'Given an integer n, break it into the sum of k positive integers, where k >= 2, and maximize the product of those integers. Return the maximum product you can get.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Dynamic Programming'],
  constraints: '2 <= n <= 58',
  examples: [{ input: '2', output: '1', explanation: '2 = 1 + 1, 1 * 1 = 1' }, { input: '10', output: '36', explanation: '10 = 3 + 3 + 4, 3 * 3 * 4 = 36' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Power of 3 rule', content: 'For n > 4, we should break the integer into as many 3s as possible. If n % 3 == 1, we should have one 4 (2*2) instead of a 3 and a 1.' }],
  jsSolution: (n) => {
    if (n === 2) return 1;
    if (n === 3) return 2;
    let num3 = Math.floor(n / 3);
    let rem = n % 3;
    if (rem === 1) {
      num3--;
      return Math.pow(3, num3) * 4;
    }
    if (rem === 2) {
      return Math.pow(3, num3) * 2;
    }
    return Math.pow(3, num3);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2]);
    cases.push([10]);
    for (let i = 0; i < 148; i++) {
      cases.push([randInt(2, 58)]);
    }
    return cases;
  }
},

// 4
{
  slug: 'super-ugly-number',
  title: 'Super Ugly Number',
  description: 'A super ugly number is a positive integer whose prime factors are in the array primes. Given an integer n and an array of integers primes, return the nth super ugly number. The nth super ugly number is guaranteed to fit in a 32-bit signed integer.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Dynamic Programming'],
  constraints: '1 <= n <= 10^5. 1 <= primes.length <= 100. 2 <= primes[i] <= 1000. primes[i] is prime.',
  examples: [{ input: '12, [2,7,13,19]', output: '32', explanation: '[1, 2, 4, 7, 8, 13, 14, 16, 19, 26, 28, 32] is the sequence.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'primes', cpp: 'vector<int>&', java: 'int[]', py: 'primes: List[int]', js: 'primes' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Multi-pointer DP', content: 'Initialize an array dp size n. Track index pointers for each prime in primes. The next ugly number is the minimum of dp[pointers[j]] * primes[j].' }],
  jsSolution: (n, primes) => {
    const dp = Array(n).fill(0);
    dp[0] = 1;
    const pointers = Array(primes.length).fill(0);
    const nextVal = [...primes];
    
    for (let i = 1; i < n; i++) {
      let min = nextVal[0];
      for (let j = 1; j < primes.length; j++) {
        if (nextVal[j] < min) min = nextVal[j];
      }
      dp[i] = min;
      for (let j = 0; j < primes.length; j++) {
        if (nextVal[j] === min) {
          pointers[j]++;
          nextVal[j] = dp[pointers[j]] * primes[j];
        }
      }
    }
    return dp[n - 1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([12, [2, 7, 13, 19]]);
    
    const gen = (nMax, primesCount) => {
      const allPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      const selected = allPrimes.sort(() => Math.random() - 0.5).slice(0, primesCount).sort((a, b) => a - b);
      return [randInt(5, nMax), selected];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(30, 3));
    for (let i = 0; i < 50; i++) cases.push(gen(100, 4));
    for (let i = 0; i < 50; i++) cases.push(gen(500, 5));
    return cases;
  }
},

// 5
{
  slug: 'valid-triangle-number',
  title: 'Valid Triangle Number',
  description: 'Given an integer array nums, return the number of triplets chosen from the array that can make triangles if we take them as side lengths of a triangle.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Array', 'Two Pointers', 'Binary Search', 'Greedy', 'Sorting'],
  constraints: '1 <= nums.length <= 1000. 0 <= nums[i] <= 1000.',
  examples: [{ input: '[2,2,3,4]', output: '3', explanation: 'Valid combinations: [2,3,4] (using first 2), [2,3,4] (using second 2), [2,2,3]' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sorting and Two Pointers', content: 'Sort the array. Fix the largest side at index i from right to left. Then use two pointers l = 0 and r = i - 1. If nums[l] + nums[r] > nums[i], then all elements from l to r-1 can also form a triangle with r and i, so add r - l to count and decrement r, else increment l.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    let count = 0;
    for (let i = nums.length - 1; i >= 2; i--) {
      let l = 0, r = i - 1;
      while (l < r) {
        if (nums[l] + nums[r] > nums[i]) {
          count += r - l;
          r--;
        } else {
          l++;
        }
      }
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 2, 3, 4]]);
    for (let i = 0; i < 49; i++) {
      cases.push([randArr(randInt(3, 10), 0, 15)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(10, 30), 1, 50)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(30, 80), 1, 100)]);
    }
    return cases;
  }
},

// 6
{
  slug: 'day-of-the-week',
  title: 'Day of the Week',
  description: 'Given a date, return the corresponding day of the week for that date. The return value should be one of the following values: {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: 'The given date is valid between the years 1971 and 2100.',
  examples: [{ input: '31, 8, 2019', output: '"Saturday"' }],
  args: [
    { name: 'day', cpp: 'int', java: 'int', py: 'day: int', js: 'day' },
    { name: 'month', cpp: 'int', java: 'int', py: 'month: int', js: 'month' },
    { name: 'year', cpp: 'int', java: 'int', py: 'year: int', js: 'year' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Zeller\'s Congruence or Date Object', content: 'Use the standard JavaScript Date object or Zeller\'s Congruence algorithm to calculate the day of the week.' }],
  jsSolution: (day, month, year) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(year, month - 1, day);
    return days[d.getDay()];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([31, 8, 2019]);
    
    const genDate = () => {
      const year = randInt(1971, 2099);
      const month = randInt(1, 12);
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      let maxDays = 31;
      if (month === 4 || month === 6 || month === 9 || month === 11) maxDays = 30;
      else if (month === 2) maxDays = isLeap ? 29 : 28;
      const day = randInt(1, maxDays);
      return [day, month, year];
    };
    
    for (let i = 0; i < 49; i++) cases.push(genDate());
    for (let i = 0; i < 50; i++) cases.push(genDate());
    for (let i = 0; i < 50; i++) cases.push(genDate());
    return cases;
  }
},

// 7
{
  slug: 'fraction-to-recurring-decimal',
  title: 'Fraction to Recurring Decimal',
  description: 'Given two integers representing the numerator and denominator of a fraction, return the fraction in string format. If the fractional part is repeating, enclose the repeating part in parentheses. If multiple answers are possible, return any of them.',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Hash Table', 'Math', 'String'],
  constraints: '-2^31 <= numerator, denominator <= 2^31 - 1. denominator != 0.',
  examples: [{ input: '1, 2', output: '"0.5"' }, { input: '2, 1', output: '"2"' }, { input: '4, 333', output: '"0.(012)"' }],
  args: [
    { name: 'numerator', cpp: 'int', java: 'int', py: 'numerator: int', js: 'numerator' },
    { name: 'denominator', cpp: 'int', java: 'int', py: 'denominator: int', js: 'denominator' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Map for Remainder Indexing', content: 'Perform long division. Store each remainder and its index in a map. If a remainder repeats, insert parentheses at the corresponding index.' }],
  jsSolution: (numerator, denominator) => {
    if (numerator === 0) return "0";
    let res = "";
    if (Math.sign(numerator) !== Math.sign(denominator)) {
      res += "-";
    }
    let num = Math.abs(numerator);
    let den = Math.abs(denominator);
    res += Math.floor(num / den);
    let rem = num % den;
    if (rem === 0) return res;
    
    res += ".";
    const map = new Map();
    while (rem !== 0) {
      if (map.has(rem)) {
        const idx = map.get(rem);
        res = res.substring(0, idx) + "(" + res.substring(idx) + ")";
        break;
      }
      map.set(rem, res.length);
      rem *= 10;
      res += Math.floor(rem / den);
      rem %= den;
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1, 2]);
    cases.push([2, 1]);
    cases.push([4, 333]);
    
    const gen = () => {
      const num = randInt(-100, 100);
      const den = randInt(1, 50) * (Math.random() < 0.5 ? 1 : -1);
      return [num, den];
    };
    
    for (let i = 0; i < 47; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 8
{
  slug: 'kth-smallest-in-multiplication-table',
  title: 'K-th Smallest in Multiplication Table',
  description: 'Nearly every one of us used the multiplication table. The multiplication table of size m x n has elements table[i][j] = i * j (1-indexed). Given m, n and k, return the k-th smallest element in the table.',
  difficulty: 'Hard',
  category: 'Math & Geometry',
  tags: ['Math', 'Binary Search'],
  constraints: '1 <= m, n <= 3 * 10^4. 1 <= k <= m * n.',
  examples: [{ input: '3, 3, 5', output: '3', explanation: 'Table is [[1,2,3],[2,4,6],[3,6,9]]. Sorted: [1,2,2,3,3,4,6,6,9]. 5th is 3.' }],
  args: [
    { name: 'm', cpp: 'int', java: 'int', py: 'm: int', js: 'm' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Range', content: 'The values are in range [1, m * n]. Binary search for the value x. For a mid value, we can count how many numbers in the table are <= mid by summing min(floor(mid / i), n) for each row i.' }],
  jsSolution: (m, n, k) => {
    const countLessEqual = (val) => {
      let count = 0;
      for (let i = 1; i <= m; i++) {
        count += Math.min(Math.floor(val / i), n);
      }
      return count;
    };
    
    let l = 1, r = m * n;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      if (countLessEqual(mid) >= k) {
        r = mid;
      } else {
        l = mid + 1;
      }
    }
    return l;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, 3, 5]);
    
    const gen = (maxDim) => {
      const m = randInt(1, maxDim);
      const n = randInt(1, maxDim);
      const k = randInt(1, m * n);
      return [m, n, k];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(10));
    for (let i = 0; i < 50; i++) cases.push(gen(50));
    for (let i = 0; i < 50; i++) cases.push(gen(150));
    return cases;
  }
}

];
