// Math & Geometry — Batch 2 (10 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'self-dividing-numbers',
  title: 'Self Dividing Numbers',
  description: 'A self-dividing number is a number that is divisible by every digit it contains. For example, 128 is a self-dividing number because 128 % 1 == 0, 128 % 2 == 0, and 128 % 8 == 0. A self-dividing number is not allowed to contain the digit zero. Given two integers left and right, return a list of all the self-dividing numbers in the range [left, right] (both inclusive).',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: '1 <= left <= right <= 10000',
  examples: [{ input: '1, 22', output: '[1,2,3,4,5,6,7,8,9,11,12,15,22]' }],
  args: [
    { name: 'left', cpp: 'int', java: 'int', py: 'left: int', js: 'left' },
    { name: 'right', cpp: 'int', java: 'int', py: 'right: int', js: 'right' }
  ],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Check digit by digit', content: 'For each number in the range, extract digits. If any digit is 0 or the number is not divisible by that digit, skip it.' }],
  jsSolution: (left, right) => {
    const isSelfDividing = (num) => {
      let temp = num;
      while (temp > 0) {
        const d = temp % 10;
        if (d === 0 || num % d !== 0) return false;
        temp = Math.floor(temp / 10);
      }
      return true;
    };
    const ans = [];
    for (let i = left; i <= right; i++) {
      if (isSelfDividing(i)) ans.push(i);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1, 22]);
    cases.push([47, 85]);
    for (let i = 0; i < 48; i++) {
      const left = randInt(1, 100);
      const right = left + randInt(0, 50);
      cases.push([left, right]);
    }
    for (let i = 0; i < 50; i++) {
      const left = randInt(100, 1000);
      const right = left + randInt(50, 200);
      cases.push([left, right]);
    }
    for (let i = 0; i < 50; i++) {
      const left = randInt(1000, 9000);
      const right = left + randInt(100, 300);
      cases.push([left, right]);
    }
    return cases;
  }
},

// 2
{
  slug: 'base-7',
  title: 'Base 7',
  description: 'Given an integer num, return a string of its base 7 representation.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: '-10^7 <= num <= 10^7',
  examples: [{ input: '100', output: '"202"' }, { input: '-7', output: '"-10"' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Repeated Division', content: 'Handle 0 and negative cases. For positive cases, continuously divide by 7 and collect remainders, then reverse them.' }],
  jsSolution: (num) => {
    if (num === 0) return "0";
    let isNeg = num < 0;
    let n = Math.abs(num);
    let res = "";
    while (n > 0) {
      res = (n % 7) + res;
      n = Math.floor(n / 7);
    }
    return isNeg ? "-" + res : res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([100]);
    cases.push([-7]);
    cases.push([0]);
    for (let i = 0; i < 47; i++) {
      cases.push([randInt(-100, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(-10000, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(-1000000, 1000000)]);
    }
    return cases;
  }
},

// 3
{
  slug: 'perfect-number',
  title: 'Perfect Number',
  description: 'A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. A divisor of an integer x is an integer that can divide x evenly. Given an integer n, return true if n is a perfect number, otherwise return false.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: '1 <= n <= 10^8',
  examples: [{ input: '28', output: 'true', explanation: '28 = 1 + 2 + 4 + 7 + 14' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Optimize divisor search', content: 'Only check divisors up to sqrt(n). If i divides n, then both i and n/i are divisors.' }],
  jsSolution: (num) => {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) {
        sum += i;
        if (i * i !== num) sum += num / i;
      }
    }
    return sum === num;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([28]);
    cases.push([6]);
    cases.push([1]);
    const perfects = [6, 28, 496, 8128, 33550336];
    for (let i = 0; i < 47; i++) {
      cases.push([Math.random() < 0.2 ? perfects[randInt(0, 3)] : randInt(1, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.2 ? perfects[randInt(0, 3)] : randInt(1000, 100000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.2 ? perfects[randInt(0, 4)] : randInt(100000, 10000000)]);
    }
    return cases;
  }
},

// 4
{
  slug: 'happy-number',
  title: 'Happy Number',
  description: 'Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process:\n- Starting with any positive integer, replace the number by the sum of the squares of its digits.\n- Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.\n- Those numbers for which this process ends in 1 are happy.\nReturn true if n is a happy number, and false if not.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Two Pointers', 'Hash Table'],
  constraints: '1 <= n <= 2^31 - 1',
  examples: [{ input: '19', output: 'true' }, { input: '2', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Detecting Cycles', content: 'Use Floyd\'s Cycle Finding algorithm (fast and slow pointers) or a hash set to detect loops.' }],
  jsSolution: (n) => {
    const getNext = (num) => {
      let sum = 0;
      while (num > 0) {
        const d = num % 10;
        sum += d * d;
        num = Math.floor(num / 10);
      }
      return sum;
    };
    let slow = n;
    let fast = getNext(n);
    while (fast !== 1 && slow !== fast) {
      slow = getNext(slow);
      fast = getNext(getNext(fast));
    }
    return fast === 1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([19]);
    cases.push([2]);
    for (let i = 0; i < 48; i++) {
      cases.push([randInt(1, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(10000, 1000000)]);
    }
    return cases;
  }
},

// 5
{
  slug: 'excel-sheet-column-title',
  title: 'Excel Sheet Column Title',
  description: 'Given an integer columnNumber, return its corresponding column title as it appears in an Excel sheet. For example: A -> 1, B -> 2, C -> 3, Z -> 26, AA -> 27, AB -> 28 etc.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'String'],
  constraints: '1 <= columnNumber <= 2^31 - 1',
  examples: [{ input: '1', output: '"A"' }, { input: '28', output: '"AB"' }, { input: '701', output: '"ZY"' }],
  args: [{ name: 'columnNumber', cpp: 'int', java: 'int', py: 'columnNumber: int', js: 'columnNumber' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Base 26 conversion', content: 'This is a base-26 system but 1-indexed. Decrement columnNumber by 1 at each step before taking modulo 26.' }],
  jsSolution: (columnNumber) => {
    let ans = "";
    while (columnNumber > 0) {
      columnNumber--;
      ans = String.fromCharCode(65 + (columnNumber % 26)) + ans;
      columnNumber = Math.floor(columnNumber / 26);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1]);
    cases.push([28]);
    cases.push([701]);
    for (let i = 0; i < 47; i++) {
      cases.push([randInt(1, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(10000, 1000000)]);
    }
    return cases;
  }
},

// 6
{
  slug: 'excel-sheet-column-number',
  title: 'Excel Sheet Column Number',
  description: 'Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'String'],
  constraints: '1 <= columnTitle.length <= 7. columnTitle consists only of uppercase English letters.',
  examples: [{ input: '"A"', output: '1' }, { input: '"AB"', output: '28' }, { input: '"ZY"', output: '701' }],
  args: [{ name: 'columnTitle', cpp: 'string', java: 'String', py: 'columnTitle: str', js: 'columnTitle' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Base-26 evaluation', content: 'Iterate from left to right. Accumulate result = result * 26 + (char - \'A\' + 1).' }],
  jsSolution: (columnTitle) => {
    let ans = 0;
    for (let i = 0; i < columnTitle.length; i++) {
      ans = ans * 26 + (columnTitle.charCodeAt(i) - 65 + 1);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["A"]);
    cases.push(["AB"]);
    cases.push(["ZY"]);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(1, chars)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(2, chars)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(3, 4), chars)]);
    }
    return cases;
  }
},

// 7
{
  slug: 'add-digits',
  title: 'Add Digits',
  description: 'Given an integer num, repeatedly add all its digits until the result has only one digit, and return it.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math', 'Number Theory'],
  constraints: '0 <= num <= 2^31 - 1',
  examples: [{ input: '38', output: '2', explanation: '3 + 8 = 11, 1 + 1 = 2.' }],
  args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Digital Root formula', content: 'The digital root can be computed in O(1) time. For num == 0, return 0. Otherwise, return 1 + (num - 1) % 9.' }],
  jsSolution: (num) => {
    if (num === 0) return 0;
    return 1 + (num - 1) % 9;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([38]);
    cases.push([0]);
    for (let i = 0; i < 48; i++) {
      cases.push([randInt(1, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100, 100000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100000, 2000000000)]);
    }
    return cases;
  }
},

// 8
{
  slug: 'ugly-number',
  title: 'Ugly Number',
  description: 'An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return true if n is an ugly number, otherwise return false.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Math'],
  constraints: '-2^31 <= n <= 2^31 - 1',
  examples: [{ input: '6', output: 'true' }, { input: '14', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Repeated Division by prime factors', content: 'Divide n by 2, 3, and 5 repeatedly as long as it is divisible. If the final value is 1, n is ugly.' }],
  jsSolution: (n) => {
    if (n <= 0) return false;
    for (const factor of [2, 3, 5]) {
      while (n % factor === 0) {
        n /= factor;
      }
    }
    return n === 1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([6]);
    cases.push([14]);
    cases.push([1]);
    for (let i = 0; i < 47; i++) {
      cases.push([randInt(-50, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100, 10000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(10000, 10000000)]);
    }
    return cases;
  }
},

// 9
{
  slug: 'minimum-time-visiting-all-points',
  title: 'Minimum Time Visiting All Points',
  description: 'On a 2D plane, there are n points with integer coordinates points[i] = [xi, yi]. Return the minimum time in seconds to visit all points in the order given by points. You can move diagonally, horizontally, or vertically by 1 unit in 1 second.',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  tags: ['Array', 'Math', 'Geometry'],
  constraints: 'points.length == n. 1 <= n <= 100. points[i].length == 2. -1000 <= points[i][j] <= 1000.',
  examples: [{ input: '[[1,1],[3,4],[-1,0]]', output: '7' }],
  args: [{ name: 'points', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'points: List[List[int]]', js: 'points' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Chebyshev Distance', content: 'The minimum time between two points (x1, y1) and (x2, y2) is max(abs(x1 - x2), abs(y1 - y2)). Sum this distance over all consecutive pairs.' }],
  jsSolution: (points) => {
    let ans = 0;
    for (let i = 1; i < points.length; i++) {
      ans += Math.max(
        Math.abs(points[i][0] - points[i - 1][0]),
        Math.abs(points[i][1] - points[i - 1][1])
      );
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1], [3, 4], [-1, 0]]]);
    
    const gen = (n) => {
      const pts = [];
      for (let j = 0; j < n; j++) {
        pts.push([randInt(-50, 50), randInt(-50, 50)]);
      }
      return [pts];
    };
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 10
{
  slug: 'valid-square',
  title: 'Valid Square',
  description: 'Given the coordinates of four points in 2D space p1, p2, p3 and p4, return true if the four points construct a square. The coordinate of a point pi is represented by [xi, yi]. The input is not given in any particular order. A valid square has four equal sides and four equal angles (90-degree angles).',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  tags: ['Math', 'Geometry'],
  constraints: 'p1.length == p2.length == p3.length == p4.length == 2. -10000 <= xi, yi <= 10000.',
  examples: [{ input: '[0,0], [1,1], [1,0], [0,1]', output: 'true' }],
  args: [
    { name: 'p1', cpp: 'vector<int>&', java: 'int[]', py: 'p1: List[int]', js: 'p1' },
    { name: 'p2', cpp: 'vector<int>&', java: 'int[]', py: 'p2: List[int]', js: 'p2' },
    { name: 'p3', cpp: 'vector<int>&', java: 'int[]', py: 'p3: List[int]', js: 'p3' },
    { name: 'p4', cpp: 'vector<int>&', java: 'int[]', py: 'p4: List[int]', js: 'p4' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Distance sorting', content: 'Calculate squared distances between all pairs of 4 points. There are 6 distances. Sort them. In a valid square, the first 4 (sides) must be equal and positive, and the last 2 (diagonals) must be equal.' }],
  jsSolution: (p1, p2, p3, p4) => {
    const distSq = (a, b) => (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
    const d = [
      distSq(p1, p2),
      distSq(p1, p3),
      distSq(p1, p4),
      distSq(p2, p3),
      distSq(p2, p4),
      distSq(p3, p4)
    ].sort((x, y) => x - y);
    
    return d[0] > 0 && d[0] === d[1] && d[1] === d[2] && d[2] === d[3] && d[4] === d[5] && d[4] === 2 * d[0];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 0], [1, 1], [1, 0], [0, 1]]);
    cases.push([[0, 0], [1, 1], [1, 0], [0, 0]]); // invalid
    
    const genSquare = () => {
      const cx = randInt(-50, 50);
      const cy = randInt(-50, 50);
      const side = randInt(1, 20);
      // Construct a valid square
      const p1 = [cx, cy];
      const p2 = [cx + side, cy];
      const p3 = [cx, cy + side];
      const p4 = [cx + side, cy + side];
      // Shuffle points to simulate arbitrary input order
      const pts = [p1, p2, p3, p4].sort(() => Math.random() - 0.5);
      return pts;
    };
    
    const genNonSquare = () => {
      return [
        [randInt(-50, 50), randInt(-50, 50)],
        [randInt(-50, 50), randInt(-50, 50)],
        [randInt(-50, 50), randInt(-50, 50)],
        [randInt(-50, 50), randInt(-50, 50)]
      ];
    };
    
    for (let i = 0; i < 48; i++) {
      const pts = Math.random() < 0.5 ? genSquare() : genNonSquare();
      cases.push(pts);
    }
    for (let i = 0; i < 50; i++) {
      const pts = Math.random() < 0.5 ? genSquare() : genNonSquare();
      cases.push(pts);
    }
    for (let i = 0; i < 50; i++) {
      const pts = Math.random() < 0.5 ? genSquare() : genNonSquare();
      cases.push(pts);
    }
    return cases;
  }
}

];
