// Bit Manipulation — Batch 1 (45 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'reverse-bits',
  title: 'Reverse Bits',
  description: 'Reverse bits of a given 32 bits unsigned integer.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Bit Manipulation'],
  constraints: 'n must be a 32-bit integer.',
  examples: [{ input: '43261596', output: '964176192' }],
  args: [{ name: 'n', cpp: 'uint32_t', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'uint32_t', java: 'int', py: 'int' },
  hints: [{ title: 'Bitwise shift reversing', content: 'Loop 32 times. Shift result to left by 1, and add n & 1, then shift n to right by 1.' }],
  jsSolution: (n) => {
    let result = 0;
    for (let i = 0; i < 32; i++) {
      result = (result << 1) | (n & 1);
      n = n >>> 1;
    }
    return result >>> 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([43261596]);
    for (let i = 0; i < 149; i++) {
      cases.push([randInt(0, 2147483647)]);
    }
    return cases;
  }
},

// 2
{
  slug: 'counting-bits',
  title: 'Counting Bits',
  description: 'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1 bits in the binary representation of i.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Dynamic Programming', 'Bit Manipulation'],
  constraints: '0 <= n <= 10^5',
  examples: [{ input: '2', output: '[0,1,1]' }, { input: '5', output: '[0,1,1,2,1,2]' }],
  args: [{ name: 'n', cpp: 'int', java: 'int[]', py: 'n: int', js: 'n' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'DP bit count connection', content: 'An integer i has the same bit count as Math.floor(i/2) plus 1 if i is odd. dp[i] = dp[i >> 1] + (i & 1).' }],
  jsSolution: (n) => {
    const ans = Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      ans[i] = ans[i >> 1] + (i & 1);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2]);
    cases.push([5]);
    for (let i = 0; i < 148; i++) {
      cases.push([randInt(0, 200)]);
    }
    return cases;
  }
},

// 3
{
  slug: 'missing-number',
  title: 'Missing Number',
  description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'],
  constraints: 'n == nums.length. 1 <= n <= 10000. All the numbers of nums are unique.',
  examples: [{ input: '[3,0,1]', output: '2' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'XOR all elements and indices', content: 'XOR all elements in nums and all indices from 0 to n. The indices and nums will cancel each other out, leaving only the missing number.' }],
  jsSolution: (nums) => {
    let xor = nums.length;
    for (let i = 0; i < nums.length; i++) {
      xor ^= i ^ nums[i];
    }
    return xor;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 0, 1]]);
    
    const gen = (n) => {
      const arr = Array.from({ length: n + 1 }, (_, i) => i);
      const missing = randInt(0, n);
      arr.splice(missing, 1);
      // Shuffle
      return [arr.sort(() => Math.random() - 0.5)];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 100)));
    return cases;
  }
},

// 4
{
  slug: 'single-number-ii',
  title: 'Single Number II',
  description: 'Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it. You must implement a solution with a linear runtime complexity and use only constant extra space.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: '1 <= nums.length <= 30000. -2^31 <= nums[i] <= 2^31 - 1.',
  examples: [{ input: '[2,2,3,2]', output: '3' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bit column sum mod 3', content: 'For each bit position from 0 to 31, sum the bits of all numbers in the array. The sum modulo 3 gives the bit value of the single number.' }],
  jsSolution: (nums) => {
    let ones = 0, twos = 0;
    for (let i = 0; i < nums.length; i++) {
      ones = (ones ^ nums[i]) & ~twos;
      twos = (twos ^ nums[i]) & ~ones;
    }
    return ones;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 2, 3, 2]]);
    
    const gen = (n) => {
      const arr = [];
      const single = randInt(-100, 100);
      for (let j = 0; j < n; j++) {
        const val = randInt(-100, 100);
        if (val !== single) {
          arr.push(val, val, val);
        }
      }
      arr.push(single);
      return [arr.sort(() => Math.random() - 0.5)];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 5
{
  slug: 'single-number-iii',
  title: 'Single Number III',
  description: 'Given an integer array nums, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once. You can return the answer in any order.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: '2 <= nums.length <= 30000. -2^31 <= nums[i] <= 2^31 - 1.',
  examples: [{ input: '[1,2,1,3,2,5]', output: '[3,5]' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'XOR grouping', content: 'XOR all elements to get x = a ^ b. Find the lowest set bit in x: diff = x & -x. Group numbers by whether they have this bit set or not. XORing each group reveals a and b.' }],
  jsSolution: (nums) => {
    let xor = 0;
    for (let i = 0; i < nums.length; i++) xor ^= nums[i];
    const diff = xor & -xor;
    let a = 0, b = 0;
    for (let i = 0; i < nums.length; i++) {
      if ((nums[i] & diff) === 0) {
        a ^= nums[i];
      } else {
        b ^= nums[i];
      }
    }
    return [a, b].sort((x, y) => x - y);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 1, 3, 2, 5]]);
    
    const gen = (n) => {
      const arr = [];
      const single1 = randInt(-100, 100);
      let single2 = randInt(-100, 100);
      while (single2 === single1) single2 = randInt(-100, 100);
      for (let j = 0; j < n; j++) {
        const val = randInt(-100, 100);
        if (val !== single1 && val !== single2) {
          arr.push(val, val);
        }
      }
      arr.push(single1, single2);
      return [arr.sort(() => Math.random() - 0.5)];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 6
{
  slug: 'bitwise-and-of-numbers-range',
  title: 'Bitwise AND of Numbers Range',
  description: 'Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Bit Manipulation'],
  constraints: '0 <= left <= right <= 2^31 - 1',
  examples: [{ input: '5, 7', output: '4' }, { input: '0, 0', output: '0' }],
  args: [
    { name: 'left', cpp: 'int', java: 'int', py: 'left: int', js: 'left' },
    { name: 'right', cpp: 'int', java: 'int', py: 'right: int', js: 'right' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Common binary prefix', content: 'Shift both left and right to the right until they are equal, counting the shifts. The common prefix shifted back to the left is the range AND.' }],
  jsSolution: (left, right) => {
    let shift = 0;
    while (left < right) {
      left >>= 1;
      right >>= 1;
      shift++;
    }
    return left << shift;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5, 7]);
    cases.push([0, 0]);
    for (let i = 0; i < 48; i++) {
      const left = randInt(1, 100);
      cases.push([left, left + randInt(0, 10)]);
    }
    for (let i = 0; i < 50; i++) {
      const left = randInt(100, 10000);
      cases.push([left, left + randInt(0, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      const left = randInt(10000, 1000000);
      cases.push([left, left + randInt(0, 1000)]);
    }
    return cases;
  }
},

// 7
{
  slug: 'binary-watch',
  title: 'Binary Watch',
  description: 'A binary watch has 4 LEDs on the top to represent hours (0-11), and 6 LEDs on the bottom to represent minutes (0-59). Each LED represents a zero or one, with the least significant bit on the right. Given an integer turnedOn, return all possible times the watch could represent. You may return the answer in any order.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Backtracking', 'Bit Manipulation'],
  constraints: '0 <= turnedOn <= 10',
  examples: [{ input: '1', output: '["0:01","0:02","0:04","0:08","0:16","0:32","1:00","2:00","4:00","8:00"]' }],
  args: [{ name: 'turnedOn', cpp: 'int', java: 'int', py: 'turnedOn: int', js: 'turnedOn' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Iterate all possible times', content: 'Generate all hours (0-11) and minutes (0-59). Count the set bits in hours and minutes. If the sum matches turnedOn, format the time string and add it to results.' }],
  jsSolution: (turnedOn) => {
    const countBits = (num) => {
      let count = 0;
      while (num > 0) {
        count += num & 1;
        num >>= 1;
      }
      return count;
    };
    const ans = [];
    for (let h = 0; h < 12; h++) {
      for (let m = 0; m < 60; m++) {
        if (countBits(h) + countBits(m) === turnedOn) {
          ans.push(`${h}:${m < 10 ? '0' + m : m}`);
        }
      }
    }
    return ans.sort();
  },
  inputGenerator: () => {
    const cases = [];
    for (let i = 0; i < 150; i++) {
      cases.push([randInt(0, 10)]);
    }
    return cases;
  }
},

// 8
{
  slug: 'sum-of-two-integers',
  title: 'Sum of Two Integers',
  description: 'Given two integers a and b, return the sum of the two integers without using the operators + and -.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '-1000 <= a, b <= 1000',
  examples: [{ input: '1, 2', output: '3' }, { input: '2, 3', output: '5' }],
  args: [
    { name: 'a', cpp: 'int', java: 'int', py: 'a: int', js: 'a' },
    { name: 'b', cpp: 'int', java: 'int', py: 'b: int', js: 'b' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'XOR and Carry', content: 'XOR represents addition without carry: sum = a ^ b. AND shifted by 1 represents carries: carry = (a & b) << 1. Repeat until carry is 0.' }],
  jsSolution: (a, b) => {
    while (b !== 0) {
      const carry = (a & b) << 1;
      a = a ^ b;
      b = carry;
    }
    return a;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1, 2]);
    cases.push([2, 3]);
    for (let i = 0; i < 148; i++) {
      cases.push([randInt(-500, 500), randInt(-500, 500)]);
    }
    return cases;
  }
},

// 9
{
  slug: 'utf-8-validation',
  title: 'UTF-8 Validation',
  description: 'Given an integer array data representing the data, return whether it is a valid UTF-8 encoding. A character in UTF8 can be from 1 to 4 bytes long, subjected to certain rules depending on the prefix bits.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: '1 <= data.length <= 20000. 0 <= data[i] <= 255.',
  examples: [{ input: '[197,130,1]', output: 'true' }, { input: '[235,140,4]', output: 'false' }],
  args: [{ name: 'data', cpp: 'vector<int>&', java: 'int[]', py: 'data: List[int]', js: 'data' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Check prefix bits', content: 'Determine the number of bytes from the first byte\'s leading bits. Then, check if the subsequent bytes have \'10\' as their leading two bits.' }],
  jsSolution: (data) => {
    let bytesToProcess = 0;
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      if (bytesToProcess === 0) {
        if ((byte >> 5) === 0b110) bytesToProcess = 1;
        else if ((byte >> 4) === 0b1110) bytesToProcess = 2;
        else if ((byte >> 3) === 0b11110) bytesToProcess = 3;
        else if ((byte >> 7) !== 0) return false;
      } else {
        if ((byte >> 6) !== 0b10) return false;
        bytesToProcess--;
      }
    }
    return bytesToProcess === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[197, 130, 1]]);
    cases.push([[235, 140, 4]]);
    
    const gen = () => {
      const arr = [];
      const len = randInt(1, 4);
      for (let j = 0; j < len; j++) arr.push(randInt(0, 255));
      return [arr];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 10
{
  slug: 'maximum-xor-of-two-numbers-in-an-array',
  title: 'Maximum XOR of Two Numbers in an Array',
  description: 'Given an integer array nums, return the maximum result of nums[i] XOR nums[j], where 0 <= i <= j < n.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Hash Table', 'Bit Manipulation', 'Trie'],
  constraints: '1 <= nums.length <= 20000. 0 <= nums[i] <= 2^31 - 1.',
  examples: [{ input: '[3,10,5,25,2,8]', output: '28', explanation: 'The maximum result is 5 XOR 25 = 28.' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Greedy bit prefix build', content: 'Build the maximum XOR bit by bit from MSB to LSB. For each bit, verify if we can construct a prefix ending with 1 at that bit position by using prefixes set.' }],
  jsSolution: (nums) => {
    let max = 0, mask = 0;
    for (let i = 30; i >= 0; i--) {
      mask = mask | (1 << i);
      const set = new Set();
      for (let j = 0; j < nums.length; j++) {
        set.add(nums[j] & mask);
      }
      const tmp = max | (1 << i);
      for (const prefix of set) {
        if (set.has(prefix ^ tmp)) {
          max = tmp;
          break;
        }
      }
    }
    return max;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 10, 5, 25, 2, 8]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(2, 6), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 20), 0, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 0, 10000)]);
    return cases;
  }
},

// 11
{
  slug: 'integer-replacement',
  title: 'Integer Replacement',
  description: 'Given a positive integer n, you can apply one of the following operations:\n- If n is even, replace n with n / 2.\n- If n is odd, replace n with either n + 1 or n - 1.\nReturn the minimum number of operations needed for n to become 1.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Dynamic Programming', 'Greedy', 'Bit Manipulation', 'Memoization'],
  constraints: '1 <= n <= 2^31 - 1',
  examples: [{ input: '8', output: '3' }, { input: '7', output: '4', explanation: '7 -> 8 -> 4 -> 2 -> 1 or 7 -> 6 -> 3 -> 2 -> 1.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Greedy odd adjustment', content: 'If n is even, divide by 2. If n is odd, look at the two lowest bits. If n & 3 == 3 and n != 3, n + 1 yields more trailing zeros than n - 1.' }],
  jsSolution: (n) => {
    let count = 0;
    while (n > 1) {
      if ((n & 1) === 0) {
        n >>>= 1;
      } else {
        if (n === 3 || (n & 3) === 1) {
          n--;
        } else {
          n++;
        }
      }
      count++;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([8]);
    cases.push([7]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 100000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100000, 2000000000)]);
    return cases;
  }
},

// 12
{
  slug: 'gray-code',
  title: 'Gray Code',
  description: 'An n-bit gray code sequence is a sequence of 2^n integers where:\n- Every integer is in the inclusive range [0, 2^n - 1],\n- The first integer is 0,\n- An integer appears no more than once in the sequence,\n- The binary representation of every pair of adjacent integers differs by exactly one bit,\n- The binary representation of the first and last integers differs by exactly one bit.\nGiven an integer n, return any valid n-bit gray code sequence.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Math', 'Backtracking', 'Bit Manipulation'],
  constraints: '1 <= n <= 16',
  examples: [{ input: '2', output: '[0,1,3,2]' }],
  args: [{ name: 'n', cpp: 'int', java: 'List<Integer>', py: 'n: int', js: 'n' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Gray code mapping formula', content: 'The ith gray code value can be computed using the formula: i ^ (i >> 1) for i from 0 to 2^n - 1.' }],
  jsSolution: (n) => {
    const limit = 1 << n;
    const ans = [];
    for (let i = 0; i < limit; i++) {
      ans.push(i ^ (i >> 1));
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2]);
    cases.push([1]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 4)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(4, 8)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(8, 12)]);
    return cases;
  }
},

// 13
{
  slug: 'maximum-product-of-word-lengths',
  title: 'Maximum Product of Word Lengths',
  description: 'Given a string array words, return the maximum value of length(words[i]) * length(words[j]) where the two words do not share common letters. If no such two words exist, return 0.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'String', 'Bit Manipulation'],
  constraints: '2 <= words.length <= 1000. 1 <= words[i].length <= 1000. words[i] consists of only lowercase English letters.',
  examples: [{ input: '["abcw","baz","foo","bar","xtfn","abcdef"]', output: '16', explanation: '"abcw" and "xtfn" have no shared chars (4 * 4 = 16).' }],
  args: [{ name: 'words', cpp: 'vector<string>&', java: 'String[]', py: 'words: List[str]', js: 'words' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Char set to Bitmask', content: 'Represent each word as a 26-bit bitmask where bit k is set if char k + \'a\' is in the word. Two words have no common chars if mask1 & mask2 == 0.' }],
  jsSolution: (words) => {
    const masks = Array(words.length).fill(0);
    for (let i = 0; i < words.length; i++) {
      let mask = 0;
      for (let j = 0; j < words[i].length; j++) {
        mask |= 1 << (words[i].charCodeAt(j) - 97);
      }
      masks[i] = mask;
    }
    let max = 0;
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        if ((masks[i] & masks[j]) === 0) {
          max = Math.max(max, words[i].length * words[j].length);
        }
      }
    }
    return max;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["abcw", "baz", "foo", "bar", "xtfn", "abcdef"]]);
    
    const gen = (n) => {
      const words = Array.from({ length: n }, () => randStr(randInt(1, 8)));
      return [words];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 14
{
  slug: 'binary-number-with-alternating-bits',
  title: 'Binary Number with Alternating Bits',
  description: 'Given a positive integer n, check whether it has alternating bits: namely, if two adjacent bits will always have different values.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Bit Manipulation'],
  constraints: '1 <= n <= 2^31 - 1',
  examples: [{ input: '5', output: 'true', explanation: '5 in binary is 101.' }, { input: '7', output: 'false', explanation: '7 in binary is 111.' }],
  args: [{ name: 'n', cpp: 'int', java: 'boolean', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'XOR Shift matching', content: 'XOR n with n >> 1. If bits are alternating, the result will have all bits set to 1. Check if x = (n ^ (n >> 1)) satisfies (x & (x + 1)) == 0.' }],
  jsSolution: (n) => {
    const x = n ^ (n >> 1);
    return (x & (x + 1)) === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5]);
    cases.push([7]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 100000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100000, 2000000000)]);
    return cases;
  }
},

// 15
{
  slug: 'prime-number-of-set-bits-in-binary-representation',
  title: 'Prime Number of Set Bits in Binary Representation',
  description: 'Given two integers left and right, return the count of numbers in the inclusive range [left, right] having a prime number of set bits in their binary representation.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '1 <= left <= right <= 10^6',
  examples: [{ input: '6, 10', output: '4' }],
  args: [
    { name: 'left', cpp: 'int', java: 'int', py: 'left: int', js: 'left' },
    { name: 'right', cpp: 'int', java: 'int', py: 'right: int', js: 'right' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Set bit count checks', content: 'For each number in the range, count set bits. Since right is up to 10^6, bit count is at most 20. Primes <= 20 are {2, 3, 5, 7, 11, 13, 17, 19}.' }],
  jsSolution: (left, right) => {
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);
    const countBits = (num) => {
      let count = 0;
      while (num > 0) {
        count += num & 1;
        num >>= 1;
      }
      return count;
    };
    let count = 0;
    for (let i = left; i <= right; i++) {
      if (primes.has(countBits(i))) count++;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([6, 10]);
    for (let i = 0; i < 48; i++) {
      const left = randInt(1, 100);
      cases.push([left, left + randInt(0, 30)]);
    }
    for (let i = 0; i < 50; i++) {
      const left = randInt(100, 10000);
      cases.push([left, left + randInt(0, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      const left = randInt(10000, 900000);
      cases.push([left, left + randInt(0, 500)]);
    }
    return cases;
  }
},

// 16
{
  slug: 'letter-case-permutation',
  title: 'Letter Case Permutation',
  description: 'Given a string s, we can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings we could generate. You can return the output in any order.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['String', 'Backtracking', 'Bit Manipulation'],
  constraints: '1 <= s.length <= 12. s consists of lowercase English letters, uppercase English letters, and digits.',
  examples: [{ input: '"a1b2"', output: '["a1b2","a1B2","A1b2","A1B2"]' }],
  args: [{ name: 's', cpp: 'string', java: 'List<String>', py: 's: str', js: 's' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Bitmask of case choices', content: 'Identify indices of all alphabetic characters in s. Let there be k letters. Iterate from 0 to 2^k - 1, treating the binary representation as choices to make the letters lower or upper case.' }],
  jsSolution: (s) => {
    const ans = [];
    const recurse = (idx, current) => {
      if (idx === s.length) {
        ans.push(current);
        return;
      }
      const char = s[idx];
      if (/[a-zA-Z]/.test(char)) {
        recurse(idx + 1, current + char.toLowerCase());
        recurse(idx + 1, current + char.toUpperCase());
      } else {
        recurse(idx + 1, current + char);
      }
    };
    recurse(0, "");
    return ans.sort();
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["a1b2"]);
    for (let i = 0; i < 49; i++) cases.push([randStr(randInt(1, 4), "ab12")]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(4, 7), "abcde123")]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(7, 10), "abcdef1234")]);
    return cases;
  }
},

// 17
{
  slug: 'triples-with-bitwise-and-equal-to-zero',
  title: 'Triples with Bitwise AND Equal To Zero',
  description: 'Given an integer array nums, return the number of AND triples. An AND triple is a triple of indices (i, j, k) such that:\n- 0 <= i < nums.length\n- 0 <= j < nums.length\n- 0 <= k < nums.length\n- nums[i] & nums[j] & nums[k] == 0',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'Hash Table', 'Bit Manipulation'],
  constraints: '1 <= nums.length <= 1000. 0 <= nums[i] < 2^16.',
  examples: [{ input: '[2,1,3]', output: '12' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Map count pairwise ANDs', content: 'Precompute counts of all pairwise AND values: counts[nums[i] & nums[j]]++. Then iterate through nums, check for each precomputed AND val x: if (x & nums[k]) == 0, add count to total.' }],
  jsSolution: (nums) => {
    const count = Array(1 << 16).fill(0);
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        count[nums[i] & nums[j]]++;
      }
    }
    let ans = 0;
    for (let k = 0; k < nums.length; k++) {
      const val = nums[k];
      for (let x = 0; x < (1 << 16); x++) {
        if (count[x] > 0 && (x & val) === 0) {
          ans += count[x];
        }
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 3]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(1, 5), 0, 15)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(5, 12), 0, 31)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(12, 25), 0, 63)]);
    return cases;
  }
},

// 18
{
  slug: 'find-the-difference',
  title: 'Find the Difference',
  description: 'You are given two strings s and t. String t is generated by random shuffling string s and then add one more letter at a random position. Return the letter that was added to t.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Hash Table', 'String', 'Bit Manipulation', 'Sorting'],
  constraints: '0 <= s.length <= 1000. t.length == s.length + 1. s and t consist of lowercase English letters.',
  examples: [{ input: '"abcd", "abcde"', output: '"e"' }],
  args: [
    { name: 's', cpp: 'string', java: 'char', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'char', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'char', java: 'char', py: 'str' },
  hints: [{ title: 'XOR character codes', content: 'XOR the character codes of all characters in both s and t. The repeating characters will cancel each other out, leaving only the added letter code.' }],
  jsSolution: (s, t) => {
    let xor = 0;
    for (let i = 0; i < s.length; i++) xor ^= s.charCodeAt(i);
    for (let i = 0; i < t.length; i++) xor ^= t.charCodeAt(i);
    return String.fromCharCode(xor);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abcd", "abcde"]);
    
    const gen = (n) => {
      const s = randStr(n);
      const extra = randStr(1);
      const t = [...s, extra].sort(() => Math.random() - 0.5).join('');
      return [s, t];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 19
{
  slug: 'decode-xored-array',
  title: 'Decode XORed Array',
  description: 'There is a hidden integer array arr of length n that consists of non-negative integers. It was encoded into another integer array encoded of length n - 1, such that encoded[i] = arr[i] XOR arr[i + 1]. You are given the encoded array and an integer first which is the first element of arr, i.e., arr[0]. Return the reconstructed array.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: 'encoded.length == n - 1. 1 <= n <= 10^4. 0 <= encoded[i] <= 10^5.',
  examples: [{ input: '[1,2,3], 1', output: '[1,0,2,1]' }],
  args: [
    { name: 'encoded', cpp: 'vector<int>&', java: 'int[]', py: 'encoded: List[int]', js: 'encoded' },
    { name: 'first', cpp: 'int', java: 'int', py: 'first: int', js: 'first' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'XOR property propagation', content: 'Since encoded[i] = arr[i] ^ arr[i+1], XORing both sides by arr[i] gives arr[i+1] = encoded[i] ^ arr[i]. Construct elements sequentially starting from first.' }],
  jsSolution: (encoded, first) => {
    const arr = [first];
    for (let i = 0; i < encoded.length; i++) {
      arr.push(encoded[i] ^ arr[i]);
    }
    return arr;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], 1]);
    
    const gen = (n) => {
      const arr = randArr(n, 0, 30);
      const encoded = [];
      for (let j = 0; j < n - 1; j++) {
        encoded.push(arr[j] ^ arr[j + 1]);
      }
      return [encoded, arr[0]];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 20
{
  slug: 'xor-operation-in-an-array',
  title: 'XOR Operation in an Array',
  description: 'You are given an integer n and an integer start. Define an array nums where nums[i] = start + 2 * i (0-indexed) and n == nums.length. Return the bitwise XOR of all elements of nums.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '1 <= n <= 1000. 0 <= start <= 1000.',
  examples: [{ input: '5, 0', output: '8' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'start', cpp: 'int', java: 'int', py: 'start: int', js: 'start' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Iterative XOR build', content: 'Generate elements in a loop or solve using mathematical XOR pattern: ans ^= start + 2*i for each i in 0..n-1.' }],
  jsSolution: (n, start) => {
    let ans = 0;
    for (let i = 0; i < n; i++) {
      ans ^= (start + 2 * i);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5, 0]);
    for (let i = 0; i < 149; i++) {
      cases.push([randInt(1, 20), randInt(0, 20)]);
    }
    return cases;
  }
},

// 21
{
  slug: 'xor-queries-of-a-subarray',
  title: 'XOR Queries of a Subarray',
  description: 'You are given an array arr of positive integers and a 2D array queries where queries[i] = [Li, Ri]. For each query i compute the XOR value from Li to Ri. Return an array containing the results.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: '1 <= arr.length, queries.length <= 10^4. 1 <= arr[i] <= 10^9. queries[i].length == 2.',
  examples: [{ input: '[1,3,4,8], [[0,1],[1,2],[0,3],[3,3]]', output: '[2,7,14,8]' }],
  args: [
    { name: 'arr', cpp: 'vector<int>&', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'queries', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'queries: List[List[int]]', js: 'queries' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Prefix XOR arrays', content: 'Build a prefix XOR array: pref[i] = pref[i-1] ^ arr[i-1]. A range XOR [L, R] is computed in O(1) time as pref[R+1] ^ pref[L].' }],
  jsSolution: (arr, queries) => {
    const prefix = Array(arr.length + 1).fill(0);
    for (let i = 0; i < arr.length; i++) {
      prefix[i + 1] = prefix[i] ^ arr[i];
    }
    const ans = [];
    for (let i = 0; i < queries.length; i++) {
      ans.push(prefix[queries[i][1] + 1] ^ prefix[queries[i][0]]);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 4, 8], [[0, 1], [1, 2], [0, 3], [3, 3]]]);
    
    const gen = (n) => {
      const arr = randArr(n, 1, 20);
      const q = [];
      for (let j = 0; j < 3; j++) {
        const left = randInt(0, n - 1);
        q.push([left, randInt(left, n - 1)]);
      }
      return [arr, q];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 22
{
  slug: 'minimum-flips-to-make-a-or-b-equal-to-c',
  title: 'Minimum Flips to Make a OR b Equal to c',
  description: 'Given 3 positives numbers a, b and c. Return the minimum flips required in some bits of a and b to make ( a OR b == c ).',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Bit Manipulation'],
  constraints: '1 <= a, b, c <= 10^9',
  examples: [{ input: '2, 6, 5', output: '3' }],
  args: [
    { name: 'a', cpp: 'int', java: 'int', py: 'a: int', js: 'a' },
    { name: 'b', cpp: 'int', java: 'int', py: 'b: int', js: 'b' },
    { name: 'c', cpp: 'int', java: 'int', py: 'c: int', js: 'c' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bitwise bit comparison', content: 'For each bit from 0 to 30, compare current bit values. If bit c is 0, we must flip both a and b bits if they are 1. If bit c is 1, and both a and b bits are 0, we need exactly 1 flip.' }],
  jsSolution: (a, b, c) => {
    let flips = 0;
    for (let i = 0; i < 31; i++) {
      const bitA = (a >> i) & 1;
      const bitB = (b >> i) & 1;
      const bitC = (c >> i) & 1;
      if (bitC === 0) {
        flips += bitA + bitB;
      } else {
        if (bitA === 0 && bitB === 0) flips += 1;
      }
    }
    return flips;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2, 6, 5]);
    for (let i = 0; i < 149; i++) {
      cases.push([randInt(1, 100), randInt(1, 100), randInt(1, 100)]);
    }
    return cases;
  }
},

// 23
{
  slug: 'total-hamming-distance',
  title: 'Total Hamming Distance',
  description: 'Find the sum of Hamming distances between all pairs of the given integers.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Math', 'Bit Manipulation'],
  constraints: '1 <= nums.length <= 10^4. 0 <= nums[i] <= 10^9.',
  examples: [{ input: '[4,14,2]', output: '6' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count bit columns', content: 'For each of the 30 bit positions, count how many numbers have bit 1 (k) and how many have bit 0 (n - k). The distance added by this column is k * (n - k).' }],
  jsSolution: (nums) => {
    let ans = 0;
    const n = nums.length;
    for (let i = 0; i < 30; i++) {
      let ones = 0;
      for (let j = 0; j < n; j++) {
        if (((nums[j] >> i) & 1) === 1) ones++;
      }
      ans += ones * (n - ones);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 14, 2]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(2, 6), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 20), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 0, 10000)]);
    return cases;
  }
},

// 24
{
  slug: 'number-of-steps-to-reduce-a-number-in-binary-representation-to-one',
  title: 'Number of Steps to Reduce a Number in Binary Representation to One',
  description: 'Given the binary representation of an integer as a string s, return the number of steps to reduce it to 1 under these rules:\n- If current number is even, divide it by 2.\n- If current number is odd, add 1 to it.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['String', 'Bit Manipulation'],
  constraints: '1 <= s.length <= 500. s consists of characters \'0\' or \'1\'. s[0] == \'1\'.',
  examples: [{ input: '"1101"', output: '6' }],
  args: [{ name: 's', cpp: 'string', java: 'int', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Simulate with carry', content: 'Iterate backwards. If the current bit is 1, we must add 1 (makes it 0, sets carry to 1), adding two steps (addition then division). If current bit is 0, we divide (adds 1 step).' }],
  jsSolution: (s) => {
    let steps = 0;
    let carry = 0;
    for (let i = s.length - 1; i > 0; i--) {
      const bit = parseInt(s[i]) + carry;
      if (bit === 1) {
        steps += 2;
        carry = 1;
      } else {
        steps += 1;
      }
    }
    return steps + carry;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["1101"]);
    for (let i = 0; i < 49; i++) cases.push(["1" + randStr(randInt(1, 10), "01")]);
    for (let i = 0; i < 50; i++) cases.push(["1" + randStr(randInt(10, 30), "01")]);
    for (let i = 0; i < 50; i++) cases.push(["1" + randStr(randInt(30, 80), "01")]);
    return cases;
  }
},

// 25
{
  slug: 'maximum-score-words-formed-by-letters',
  title: 'Maximum Score Words Formed by Letters',
  description: 'Given a list of words, list of single letters (might contain duplicates) and score of every character. Return the maximum score of any valid set of words you can form.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'String', 'Dynamic Programming', 'Backtracking', 'Bitmask'],
  constraints: '1 <= words.length <= 14. 1 <= words[i].length <= 15. letters.length <= 100. letters[i].length == 1. score.length == 26.',
  examples: [{ input: '["dog","cat","dad","good"], ["a","a","c","d","d","d","g","o","o"], [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]', output: '23' }],
  args: [
    { name: 'words', cpp: 'vector<string>&', java: 'String[]', py: 'words: List[str]', js: 'words' },
    { name: 'letters', cpp: 'vector<char>&', java: 'char[]', py: 'letters: List[str]', js: 'letters' },
    { name: 'score', cpp: 'vector<int>&', java: 'int[]', py: 'score: List[int]', js: 'score' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bitmask of word subsets', content: 'Since words size is <= 14, there are only 2^14 subsets of words. For each subset, check if it can be formed with the given letters, calculate the score, and track maximum.' }],
  jsSolution: (words, letters, score) => {
    const letterCounts = Array(26).fill(0);
    for (let i = 0; i < letters.length; i++) {
      letterCounts[letters.charCodeAt ? letters.charCodeAt(i) - 97 : letters[i].charCodeAt(0) - 97]++;
    }
    
    let maxScore = 0;
    const limit = 1 << words.length;
    for (let mask = 0; mask < limit; mask++) {
      const counts = Array(26).fill(0);
      let isValid = true;
      let currentScore = 0;
      for (let i = 0; i < words.length; i++) {
        if ((mask & (1 << i)) !== 0) {
          for (let j = 0; j < words[i].length; j++) {
            const idx = words[i].charCodeAt(j) - 97;
            counts[idx]++;
            currentScore += score[idx];
            if (counts[idx] > letterCounts[idx]) {
              isValid = false;
              break;
            }
          }
        }
        if (!isValid) break;
      }
      if (isValid) {
        maxScore = Math.max(maxScore, currentScore);
      }
    }
    return maxScore;
  },
  inputGenerator: () => {
    const cases = [];
    const score = [1, 0, 9, 5, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cases.push([["dog", "cat", "dad", "good"], ["a", "a", "c", "d", "d", "d", "g", "o", "o"], score]);
    
    const gen = (wCount) => {
      const words = Array.from({ length: wCount }, () => randStr(randInt(2, 4), "abcdg"));
      const letters = randStr(randInt(5, 12), "abcdg").split('');
      return [words, letters, score];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 8)));
    return cases;
  }
},

// 26
{
  slug: 'maximum-xor-with-an-element-from-array',
  title: 'Maximum XOR With an Element From Array',
  description: 'You are given an array nums consisting of non-negative integers. You are also given a 2D array queries where queries[i] = [xi, mi]. The answer to the ith query is the maximum bitwise XOR value of xi with any element of nums that does not exceed mi. If all elements in nums exceed mi, the answer is -1. Return an array of results.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation', 'Trie'],
  constraints: '1 <= nums.length, queries.length <= 20000. 0 <= nums[i], xi, mi <= 10^9.',
  examples: [{ input: '[0,1,2,3,4], [[3,1],[1,3],[5,6]]', output: '[3,3,7]' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'queries', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'queries: List[List[int]]', js: 'queries' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Offline Sorting and Trie', content: 'Sort both nums and queries by limit value mi. Insert elements into a binary Trie as they become <= mi. Perform maximum XOR queries in the Trie.' }],
  jsSolution: (nums, queries) => {
    // Offline processing
    const sortedNums = [...nums].sort((a, b) => a - b);
    const indexedQueries = queries.map((q, idx) => ({ x: q[0], m: q[1], idx }));
    indexedQueries.sort((a, b) => a.m - b.m);
    
    class TrieNode {
      constructor() {
        this.children = {};
      }
    }
    const root = new TrieNode();
    const insert = (val) => {
      let node = root;
      for (let i = 30; i >= 0; i--) {
        const bit = (val >> i) & 1;
        if (!node.children[bit]) node.children[bit] = new TrieNode();
        node = node.children[bit];
      }
    };
    const query = (val) => {
      let node = root;
      let ans = 0;
      for (let i = 30; i >= 0; i--) {
        const bit = (val >> i) & 1;
        const target = bit ^ 1;
        if (node.children[target]) {
          ans |= (1 << i);
          node = node.children[target];
        } else if (node.children[bit]) {
          node = node.children[bit];
        } else {
          return -1;
        }
      }
      return ans;
    };
    
    const ans = Array(queries.length).fill(-1);
    let numIdx = 0;
    for (let i = 0; i < indexedQueries.length; i++) {
      const q = indexedQueries[i];
      while (numIdx < sortedNums.length && sortedNums[numIdx] <= q.m) {
        insert(sortedNums[numIdx]);
        numIdx++;
      }
      ans[q.idx] = query(q.x);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 1, 2, 3, 4], [[3, 1], [1, 3], [5, 6]]]);
    
    const gen = (n) => {
      const nums = randArr(n, 0, 30);
      const q = [];
      for (let j = 0; j < 3; j++) {
        q.push([randInt(0, 30), randInt(0, 35)]);
      }
      return [nums, q];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 27
{
  slug: 'minimum-one-bit-operations-to-make-integers-zero',
  title: 'Minimum One Bit Operations to Make Integers Zero',
  description: 'Given an integer n, you must transform it into 0 using the following operations:\n- Change the rightmost bit of n.\n- Change the ith bit of n if the (i-1)th bit is 1 and all bits from (i-2) down to 0 are 0.\nReturn the minimum number of operations.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Math', 'Dynamic Programming', 'Bit Manipulation'],
  constraints: '0 <= n <= 10^9',
  examples: [{ input: '3', output: '2', explanation: '3 (11) -> 2 (10) -> 0 (00).' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Gray code decoding relation', content: 'This is the inverse of Gray code mapping! Convert n from Gray code representation to standard binary representation to find the number of operations.' }],
  jsSolution: (n) => {
    let ans = 0;
    while (n > 0) {
      ans ^= n;
      n >>>= 1;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([0]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10000, 100000000)]);
    return cases;
  }
},

// 28
{
  slug: 'chalkboard-xor-game',
  title: 'Chalkboard XOR Game',
  description: 'Alice and Bob play a game with chalkboard numbers. A round is played by erasing one number. Alice starts. A player loses if the XOR sum of all numbers left is 0 before they erase any number. Return true if Alice wins, assuming optimal play.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'Math', 'Bit Manipulation', 'Game Theory'],
  constraints: '1 <= nums.length <= 1000. 0 <= nums[i] < 2^16.',
  examples: [{ input: '[1,1,2]', output: 'false' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Mathematical winning state', content: 'Alice wins if the initial XOR sum is 0 (as Bob immediately loses before any move) or if the count of numbers is even.' }],
  jsSolution: (nums) => {
    let xor = 0;
    for (let i = 0; i < nums.length; i++) xor ^= nums[i];
    return xor === 0 || nums.length % 2 === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 2]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(1, 5), 0, 15)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(5, 15), 0, 63)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(15, 30), 0, 255)]);
    return cases;
  }
},

// 29
{
  slug: 'find-a-value-of-a-mysterious-function-nearest-to-target',
  title: 'Find a Value of a Mysterious Function Nearest to Target',
  description: 'Given an array arr and an integer target. Return the minimum absolute difference between the bitwise AND of any contiguous subarray of arr and target.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'Binary Search', 'Bit Manipulation', 'Segment Tree'],
  constraints: '1 <= arr.length <= 20000. 1 <= arr[i], target <= 10^6.',
  examples: [{ input: '[9,12,3,7,15], 5', output: '2', explanation: 'Subarray [9,12,3] -> AND is 0. Subarray [12,3] -> AND is 0. Subarray [3,7] -> AND is 3. Subarray [7] -> AND is 7. Closest is 7 (diff 2) or 3 (diff 2).' }],
  args: [
    { name: 'arr', cpp: 'vector<int>&', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Deduplicated AND sets', content: 'As we scan from left to right, keep a set of all possible bitwise AND values of subarrays ending at the current position. There are at most 30 unique AND values. Update set and compare with target.' }],
  jsSolution: (arr, target) => {
    let ans = Infinity;
    let s = new Set();
    for (let i = 0; i < arr.length; i++) {
      const nextS = new Set();
      nextS.add(arr[i]);
      ans = Math.min(ans, Math.abs(arr[i] - target));
      for (const val of s) {
        const nextVal = val & arr[i];
        nextS.add(nextVal);
        ans = Math.min(ans, Math.abs(nextVal - target));
      }
      s = nextS;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[9, 12, 3, 7, 15], 5]);
    
    const gen = (n) => {
      const arr = randArr(n, 1, 30);
      const target = randInt(1, 30);
      return [arr, target];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 30
{
  slug: 'maximum-product-of-the-length-of-two-palindromic-subsequences',
  title: 'Maximum Product of the Length of Two Palindromic Subsequences',
  description: 'Given a string s, find two disjoint palindromic subsequences of s such that the product of their lengths is maximized. Return the maximum product.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['String', 'Dynamic Programming', 'Backtracking', 'Bitmask'],
  constraints: '2 <= s.length <= 12. s consists of only lowercase English letters.',
  examples: [{ input: '"leetcodecom"', output: '9', explanation: 'Disjoint subsequences: "ete" and "cdc". Lengths are 3 * 3 = 9.' }],
  args: [{ name: 's', cpp: 'string', java: 'int', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bitmask of disjoint subsets', content: 'Generate all 2^n subsequences of s using bitmasks. Filter those that are palindromes. Then, compare all pairs of disjoint palindromic subsequences (mask1 & mask2 == 0) and find max length product.' }],
  jsSolution: (s) => {
    const n = s.length;
    const map = {};
    const limit = 1 << n;
    
    const isPal = (str) => {
      let l = 0, r = str.length - 1;
      while (l < r) {
        if (str[l] !== str[r]) return false;
        l++;
        r--;
      }
      return true;
    };
    
    for (let mask = 1; mask < limit; mask++) {
      let sub = "";
      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) !== 0) {
          sub += s[i];
        }
      }
      if (isPal(sub)) {
        map[mask] = sub.length;
      }
    }
    
    let max = 0;
    const masks = Object.keys(map).map(Number);
    for (let i = 0; i < masks.length; i++) {
      for (let j = i + 1; j < masks.length; j++) {
        if ((masks[i] & masks[j]) === 0) {
          max = Math.max(max, map[masks[i]] * map[masks[j]]);
        }
      }
    }
    return max;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["leetcodecom"]);
    for (let i = 0; i < 49; i++) cases.push([randStr(randInt(2, 5))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(5, 8))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(8, 12))]);
    return cases;
  }
},

// 31
{
  slug: 'minimize-xor',
  title: 'Minimize XOR',
  description: 'Given two positive integers num1 and num2, find the positive integer x such that x has the same number of set bits as num2, and the value x XOR num1 is minimal.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Greedy', 'Bit Manipulation'],
  constraints: '1 <= num1, num2 <= 10^9',
  examples: [{ input: '3, 5', output: '3', explanation: 'num2 has 2 set bits. x = 3 has 2 set bits and x XOR 3 = 0, which is minimum.' }],
  args: [
    { name: 'num1', cpp: 'int', java: 'int', py: 'num1: int', js: 'num1' },
    { name: 'num2', cpp: 'int', java: 'int', py: 'num2: int', js: 'num2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Greedy bit build matching', content: 'Count the set bits in num2. Let it be `target`. Start constructing x matching num1\'s set bits from MSB to LSB. If we still need more set bits, fill them in from LSB to MSB in 0 bits.' }],
  jsSolution: (num1, num2) => {
    const countBits = (num) => {
      let count = 0;
      while (num > 0) {
        count += num & 1;
        num >>= 1;
      }
      return count;
    };
    
    let target = countBits(num2);
    let x = 0;
    
    // Greedy match num1 bits from MSB
    for (let i = 30; i >= 0 && target > 0; i--) {
      if ((num1 & (1 << i)) !== 0) {
        x |= (1 << i);
        target--;
      }
    }
    
    // Fill remaining bits from LSB
    for (let i = 0; i <= 30 && target > 0; i++) {
      if ((x & (1 << i)) === 0) {
        x |= (1 << i);
        target--;
      }
    }
    return x;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, 5]);
    for (let i = 0; i < 149; i++) {
      cases.push([randInt(1, 100), randInt(1, 100)]);
    }
    return cases;
  }
},

// 32
{
  slug: 'check-if-a-string-contains-all-binary-codes-of-size-k',
  title: 'Check If a String Contains All Binary Codes of Size K',
  description: 'Given a binary string s and an integer k, return true if every binary code of length k is a substring of s. Otherwise, return false.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Hash Table', 'String', 'Bit Manipulation', 'Rolling Hash'],
  constraints: '1 <= s.length <= 10^4. 1 <= k <= 20. s consists of characters \'0\' and \'1\'.',
  examples: [{ input: '"00110110", 2', output: 'true', explanation: 'All binary codes of size 2: "00", "01", "10", "11" are present.' }],
  args: [
    { name: 's', cpp: 'string', java: 'boolean', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Collect all size K substrings', content: 'Generate all substrings of size k from s. Put them into a hash set. Check if the final size of the set is equal to 2^k.' }],
  jsSolution: (s, k) => {
    if (s.length < (1 << k) + k - 1) return false;
    const set = new Set();
    for (let i = 0; i <= s.length - k; i++) {
      set.add(s.substring(i, i + k));
    }
    return set.size === (1 << k);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["00110110", 2]);
    
    const gen = (l, k, solvable) => {
      if (solvable) {
        // Construct cyclic binary sequence (de Bruijn sequence) or random combinations
        let s = "";
        for (let j = 0; j < (1 << k); j++) {
          s += j.toString(2).padStart(k, '0');
        }
        return [s, k];
      } else {
        return [randStr(l, "01"), k];
      }
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(15, 2, Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(40, 3, Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(100, 4, Math.random() < 0.5));
    return cases;
  }
},

// 33
{
  slug: 'concatenation-of-consecutive-binary-numbers',
  title: 'Concatenation of Consecutive Binary Numbers',
  description: 'Given an integer n, return the decimal value of the concatenation of the binary representations of 1 to n, modulo 10^9 + 7.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '1 <= n <= 10^4',
  examples: [{ input: '3', output: '27', explanation: 'Concats 1 (1), 2 (10), 3 (11) to get 11011 (27).' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Shift and Accumulate', content: 'For each i from 1 to n, find the binary length of i. Shift current answer left by that length, and add i, modulo 10^9 + 7.' }],
  jsSolution: (n) => {
    const MOD = 1000000007;
    let ans = 0;
    let len = 0;
    for (let i = 1; i <= n; i++) {
      if ((i & (i - 1)) === 0) len++;
      ans = ((ans * Math.pow(2, len)) + i) % MOD;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([1]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(20, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 1000)]);
    return cases;
  }
},

// 34
{
  slug: 'count-pairs-with-xor-in-a-range',
  title: 'Count Pairs With XOR in a Range',
  description: 'Given a 0-indexed integer array nums and two integers low and high, return the number of nice pairs. A nice pair is a pair of indices (i, j) such that 0 <= i < j < nums.length and low <= (nums[i] XOR nums[j]) <= high.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation', 'Trie'],
  constraints: '1 <= nums.length <= 1000. 1 <= nums[i], low, high <= 20000.',
  examples: [{ input: '[1,4,2,7], 2, 6', output: '6' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'low', cpp: 'int', java: 'int', py: 'low: int', js: 'low' },
    { name: 'high', cpp: 'int', java: 'int', py: 'high: int', js: 'high' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'XOR counts using Trie', content: 'Count number of elements with XOR < x. Let countLess(x) be the number of pairs with XOR < x. The final result is countLess(high + 1) - countLess(low).' }],
  jsSolution: (nums, low, high) => {
    class TrieNode {
      constructor() {
        this.children = {};
        this.count = 0;
      }
    }
    const root = new TrieNode();
    const insert = (val) => {
      let node = root;
      for (let i = 15; i >= 0; i--) {
        const bit = (val >> i) & 1;
        if (!node.children[bit]) node.children[bit] = new TrieNode();
        node = node.children[bit];
        node.count++;
      }
    };
    const countPairsLess = (val, limit) => {
      let node = root;
      let count = 0;
      for (let i = 15; i >= 0 && node; i--) {
        const valBit = (val >> i) & 1;
        const limitBit = (limit >> i) & 1;
        if (limitBit === 1) {
          if (node.children[valBit]) count += node.children[valBit].count;
          node = node.children[valBit ^ 1];
        } else {
          node = node.children[valBit];
        }
      }
      return count;
    };
    
    let ans = 0;
    for (let i = 0; i < nums.length; i++) {
      ans += countPairsLess(nums[i], high + 1) - countPairsLess(nums[i], low);
      insert(nums[i]);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 4, 2, 7], 2, 6]);
    
    const gen = (n) => {
      const nums = randArr(n, 1, 100);
      const low = randInt(1, 20);
      const high = low + randInt(5, 50);
      return [nums, low, high];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 35
{
  slug: 'largest-combination-with-bitwise-and-greater-than-zero',
  title: 'Largest Combination With Bitwise AND Greater Than Zero',
  description: 'The bitwise AND of an array nums is the bitwise AND of all integers in it. Return the size of the largest combination of nums with a bitwise AND greater than 0.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: '1 <= candidates.length <= 10^5. 1 <= candidates[i] <= 10^7.',
  examples: [{ input: '[16,17,71,62,12,24,14]', output: '4' }],
  args: [{ name: 'candidates', cpp: 'vector<int>&', java: 'int[]', py: 'candidates: List[int]', js: 'candidates' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bit position frequency counts', content: 'For each bit position from 0 to 23, count how many numbers in candidates have this bit set. The answer is the maximum count among all bit positions.' }],
  jsSolution: (candidates) => {
    let max = 0;
    for (let i = 0; i < 24; i++) {
      let count = 0;
      for (let j = 0; j < candidates.length; j++) {
        if (((candidates[j] >> i) & 1) === 1) count++;
      }
      max = Math.max(max, count);
    }
    return max;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[16, 17, 71, 62, 12, 24, 14]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(2, 6), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 20), 1, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 1, 10000)]);
    return cases;
  }
},

// 36
{
  slug: 'smallest-subarrays-with-maximum-bitwise-or',
  title: 'Smallest Subarrays With Maximum Bitwise OR',
  description: 'You are given a 0-indexed array nums of size n. Return an array of size n, where ans[i] is the length of the shortest subarray starting at i that has the maximum possible bitwise OR.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Bit Manipulation'],
  constraints: '1 <= nums.length <= 10^5. 0 <= nums[i] <= 10^9.',
  examples: [{ input: '[1,0,2,1,3]', output: '[3,3,2,2,1]' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Backward bit index tracking', content: 'Track the last position of set bits at each of 30 bit positions. Iterate backwards: for each index i, maximum OR is attained by extending to the maximum of last position among all set bits present in nums[i..n-1].' }],
  jsSolution: (nums) => {
    const n = nums.length;
    const ans = Array(n).fill(1);
    const last = Array(30).fill(-1);
    for (let i = n - 1; i >= 0; i--) {
      for (let b = 0; b < 30; b++) {
        if (((nums[i] >> b) & 1) === 1) last[b] = i;
      }
      let furthest = i;
      for (let b = 0; b < 30; b++) {
        furthest = Math.max(furthest, last[b]);
      }
      ans[i] = furthest - i + 1;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 2, 1, 3]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(2, 6), 0, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 20), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 0, 255)]);
    return cases;
  }
},

// 37
{
  slug: 'bitwise-ors-of-subarrays',
  title: 'Bitwise ORs of Subarrays',
  description: 'Given an array of positive integers arr, return the number of unique values of bitwise ORs of contiguous subarrays.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Dynamic Programming', 'Bit Manipulation'],
  constraints: '1 <= arr.length <= 10^4. 0 <= arr[i] <= 10^9.',
  examples: [{ input: '[1,1,2]', output: '3', explanation: 'Unique OR values: 1, 2, 3.' }],
  args: [{ name: 'arr', cpp: 'vector<int>&', java: 'int', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Deduplicated OR sets', content: 'As we scan left to right, keep a set of all possible bitwise ORs of subarrays ending at the current index. Put all generated values into a global results set.' }],
  jsSolution: (arr) => {
    const ansSet = new Set();
    let curSet = new Set();
    for (let i = 0; i < arr.length; i++) {
      const nextSet = new Set();
      nextSet.add(arr[i]);
      ansSet.add(arr[i]);
      for (const val of curSet) {
        const nextVal = val | arr[i];
        nextSet.add(nextVal);
        ansSet.add(nextVal);
      }
      curSet = nextSet;
    }
    return ansSet.size;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 2]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(2, 6), 1, 15)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 20), 1, 63)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 1, 255)]);
    return cases;
  }
},

// 38
{
  slug: 'number-of-wonderful-substrings',
  title: 'Number of Wonderful Substrings',
  description: 'A wonderful string is a string where at most one letter appears an odd number of times. Given a string word, return the number of wonderful non-empty substrings in word.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Hash Table', 'String', 'Bit Manipulation', 'Prefix Sum'],
  constraints: '1 <= word.length <= 10^4. word consists of lowercase English letters from \'a\' to \'j\'.',
  examples: [{ input: '"aba"', output: '4', explanation: 'Wonderful substrings: "a", "b", "a", "aba".' }],
  args: [{ name: 'word', cpp: 'string', java: 'long', py: 'word: str', js: 'word' }],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Bitmask of char parity', content: 'Represent letter frequency parity with a 10-bit bitmask. Maintain prefix bitmasks. Use a count array to check matching prefix parities (differing by at most one bit).' }],
  jsSolution: (word) => {
    const count = Array(1 << 10).fill(0);
    count[0] = 1;
    let mask = 0;
    let ans = 0;
    for (let i = 0; i < word.length; i++) {
      const idx = word.charCodeAt(i) - 97;
      mask ^= (1 << idx);
      ans += count[mask];
      for (let b = 0; b < 10; b++) {
        ans += count[mask ^ (1 << b)];
      }
      count[mask]++;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["aba"]);
    cases.push(["aabb"]);
    const chars = "abcdefghij";
    for (let i = 0; i < 48; i++) cases.push([randStr(randInt(1, 10), chars)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(10, 30), chars)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(30, 80), chars)]);
    return cases;
  }
},

// 39
{
  slug: 'strictly-palindromic-number',
  title: 'Strictly Palindromic Number',
  description: 'An integer n is strictly palindromic if for every base b between 2 and n - 2 (inclusive), the string representation of n in base b is palindromic. Return true if n is strictly palindromic and false otherwise.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Math', 'Two Pointers', 'Bit Manipulation'],
  constraints: '4 <= n <= 10^5',
  examples: [{ input: '9', output: 'false' }],
  args: [{ name: 'n', cpp: 'int', java: 'boolean', py: 'n: int', js: 'n' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Mathematical proof of impossibility', content: 'For any n >= 4, in base n - 2, n is represented as "12", which is never palindromic. Thus, n is never strictly palindromic and it always returns false.' }],
  jsSolution: (n) => {
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([9]);
    cases.push([4]);
    for (let i = 0; i < 148; i++) {
      cases.push([randInt(4, 1000)]);
    }
    return cases;
  }
},

// 40
{
  slug: 'pyramid-transition-matrix',
  title: 'Pyramid Transition Matrix',
  description: 'We are stacking blocks on top of each other. Each block is labeled with a single character. We are given a bottom string bottom and an allowed list of strings allowed. Check if we can build a complete pyramid using bottom and allowed.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Bit Manipulation', 'Backtracking', 'DFS'],
  constraints: '2 <= bottom.length <= 6. 1 <= allowed.length <= 200. allowed[i].length == 3.',
  examples: [{ input: '"BCD", ["BCG","CDE","GEA","FFF"]', output: 'true' }],
  args: [
    { name: 'bottom', cpp: 'string', java: 'boolean', py: 'bottom: str', js: 'bottom' },
    { name: 'allowed', cpp: 'vector<string>&', java: 'List<String>', py: 'allowed: List[str]', js: 'allowed' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Trie transitioning', content: 'Map a pair of chars to their allowed top blocks using bitmasks or lists. Run DFS to generate next row candidates, backtracking if a row is invalid.' }],
  jsSolution: (bottom, allowed) => {
    const map = {};
    for (let i = 0; i < allowed.length; i++) {
      const key = allowed[i].substring(0, 2);
      if (!map[key]) map[key] = [];
      map[key].push(allowed[i][2]);
    }
    const memo = {};
    
    const solve = (row, nextRow) => {
      if (row.length === 1) return true;
      const state = row + "#" + nextRow;
      if (memo[state] !== undefined) return memo[state];
      
      const idx = nextRow.length;
      if (idx === row.length - 1) {
        return memo[state] = solve(nextRow, "");
      }
      
      const key = row.substring(idx, idx + 2);
      const candidates = map[key] || [];
      for (let i = 0; i < candidates.length; i++) {
        if (solve(row, nextRow + candidates[i])) {
          return memo[state] = true;
        }
      }
      return memo[state] = false;
    };
    return solve(bottom, "");
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["BCD", ["BCG", "CDE", "GEA", "FFF"]]);
    
    const gen = (bottomLen) => {
      const bottom = randStr(bottomLen, "ABC");
      const allowed = [];
      for (let j = 0; j < 10; j++) {
        allowed.push(randStr(3, "ABC"));
      }
      return [bottom, allowed];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(3));
    for (let i = 0; i < 50; i++) cases.push(gen(4));
    for (let i = 0; i < 50; i++) cases.push(gen(5));
    return cases;
  }
},

// 41
{
  slug: 'can-i-win',
  title: 'Can I Win',
  description: 'In the "100 game", two players take turns choosing an integer from 1 to maxChoosableInteger. The player who first reaches or exceeds desiredTotal wins. Return true if the first player can force a win, otherwise false.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Dynamic Programming', 'Bitmask', 'Game Theory', 'Memoization'],
  constraints: '1 <= maxChoosableInteger <= 20. 0 <= desiredTotal <= 300.',
  examples: [{ input: '10, 11', output: 'false' }],
  args: [
    { name: 'maxChoosableInteger', cpp: 'int', java: 'int', py: 'maxChoosableInteger: int', js: 'maxChoosableInteger' },
    { name: 'desiredTotal', cpp: 'int', java: 'int', py: 'desiredTotal: int', js: 'desiredTotal' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Minimax DP with Bitmask', content: 'Let a bitmask represent the state of chosen integers. Solve using minimax algorithm with memoization: if any choice leads to Bob losing, Alice wins.' }],
  jsSolution: (maxChoosableInteger, desiredTotal) => {
    const sum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
    if (sum < desiredTotal) return false;
    if (desiredTotal <= 0) return true;
    const memo = {};
    
    const dfs = (mask, curTotal) => {
      if (memo[mask] !== undefined) return memo[mask];
      for (let i = 1; i <= maxChoosableInteger; i++) {
        if ((mask & (1 << i)) === 0) {
          if (curTotal + i >= desiredTotal || !dfs(mask | (1 << i), curTotal + i)) {
            return memo[mask] = true;
          }
        }
      }
      return memo[mask] = false;
    };
    return dfs(0, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([10, 11]);
    for (let i = 0; i < 49; i++) {
      const maxC = randInt(2, 6);
      cases.push([maxC, randInt(0, 15)]);
    }
    for (let i = 0; i < 50; i++) {
      const maxC = randInt(6, 12);
      cases.push([maxC, randInt(10, 40)]);
    }
    for (let i = 0; i < 50; i++) {
      const maxC = randInt(12, 18);
      cases.push([maxC, randInt(20, 60)]);
    }
    return cases;
  }
},

// 42
{
  slug: 'beautiful-arrangement',
  title: 'Beautiful Arrangement',
  description: 'Suppose you have n integers labeled 1 to n. A permutation of these n integers perm (1-indexed) is considered a beautiful arrangement if for every 1 <= i <= n, either: perm[i] is divisible by i, or i is divisible by perm[i]. Given an integer n, return the number of the beautiful arrangements you can construct.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Dynamic Programming', 'Backtracking', 'Bitmask'],
  constraints: '1 <= n <= 15',
  examples: [{ input: '2', output: '2', explanation: 'Permutations are [1,2] (beautiful) and [2,1] (beautiful).' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bitmask DP on subsets', content: 'Let a bitmask represent which numbers are already placed. Solve using bitmask DP where state transitions assign next placement digit to current position index.' }],
  jsSolution: (n) => {
    const memo = Array(1 << (n + 1)).fill(-1);
    const dfs = (pos, mask) => {
      if (pos > n) return 1;
      if (memo[mask] !== -1) return memo[mask];
      let count = 0;
      for (let i = 1; i <= n; i++) {
        if ((mask & (1 << i)) === 0) {
          if (i % pos === 0 || pos % i === 0) {
            count += dfs(pos + 1, mask | (1 << i));
          }
        }
      }
      return memo[mask] = count;
    };
    return dfs(1, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2]);
    for (let i = 0; i < 149; i++) {
      cases.push([randInt(1, 10)]);
    }
    return cases;
  }
},

// 43
{
  slug: 'find-the-k-th-lucky-number',
  title: 'Find the K-th Lucky Number',
  description: 'We know that a lucky number is a positive integer that contains only digits 4 and 7. Given an integer k, return the k-th lucky number as a string.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Math', 'Bit Manipulation'],
  constraints: '1 <= k <= 10^9',
  examples: [{ input: '4', output: '"74"' }, { input: '10', output: '"477"' }],
  args: [{ name: 'k', cpp: 'int', java: 'String', py: 'k: int', js: 'k' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Binary mapping', content: 'The sequence size grows as powers of 2. The kth lucky number corresponds to the binary representation of k + 1. Exclude the leading 1 bit, and map 0 -> "4" and 1 -> "7".' }],
  jsSolution: (k) => {
    let binary = (k + 1).toString(2);
    let ans = "";
    for (let i = 1; i < binary.length; i++) {
      ans += binary[i] === '0' ? '4' : '7';
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4]);
    cases.push([10]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 100000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100000, 100000000)]);
    return cases;
  }
},

// 44
{
  slug: 'split-array-with-same-average',
  title: 'Split Array With Same Average',
  description: 'You are given an integer array nums. Return true if you can partition nums into two non-empty arrays A and B such that average(A) == average(B), otherwise false.',
  difficulty: 'Hard',
  category: 'Bit Manipulation',
  tags: ['Array', 'Dynamic Programming', 'Bitmask'],
  constraints: '1 <= nums.length <= 30. 0 <= nums[i] <= 10000.',
  examples: [{ input: '[1,2,3,4,5,6,7,8]', output: 'true', explanation: 'A = [1,3,5,7,8] (average 4.8), B = [2,4,6] (average 4.0). Wait, A average is (1+3+5+7+8)/5 = 4.8, B average is (2+4+6)/3 = 4.0. Not same. A = [1,8,4,5], B = [2,3,6,7] (both averages are 4.5).' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'boolean', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Math validation of subset sizes', content: 'average(A) == average(nums) means sum(A) = sum(nums) * len(A) / len(nums). Since sum(A) must be an integer, sum(nums) * len(A) % len(nums) == 0. Check all possible sizes i from 1 to n/2. Run subset sum to see if sum(A) is achievable.' }],
  jsSolution: (nums) => {
    const n = nums.length;
    if (n === 1) return false;
    const sum = nums.reduce((s, v) => s + v, 0);
    const memo = {};
    nums.sort((a, b) => b - a);
    
    const solve = (idx, count, target) => {
      if (count === 0) return target === 0;
      if (idx === n || target < 0) return false;
      const key = idx + "#" + count + "#" + target;
      if (memo[key] !== undefined) return memo[key];
      return memo[key] = solve(idx + 1, count - 1, target - nums[idx]) || solve(idx + 1, count, target);
    };
    
    for (let len = 1; len <= Math.floor(n / 2); len++) {
      if ((sum * len) % n === 0) {
        const target = (sum * len) / n;
        if (solve(0, len, target)) return true;
      }
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6, 7, 8]]);
    
    const gen = (n) => {
      const arr = randArr(n, 1, 10);
      return [arr];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 18)));
    return cases;
  }
},

// 45
{
  slug: 'find-xor-sum-of-all-pairs-bitwise-and',
  title: 'Find XOR Sum of All Pairs Bitwise AND',
  description: 'The XOR sum of an array is the bitwise XOR of all its elements. Given two 0-indexed integer arrays arr1 and arr2, return the XOR sum of all (arr1[i] AND arr2[j]) values.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'Math', 'Bit Manipulation'],
  constraints: '1 <= arr1.length, arr2.length <= 10^5. 0 <= arr1[i], arr2[j] <= 10^9.',
  examples: [{ input: '[12], [4]', output: '4' }],
  args: [
    { name: 'arr1', cpp: 'vector<int>&', java: 'int[]', py: 'arr1: List[int]', js: 'arr1' },
    { name: 'arr2', cpp: 'vector<int>&', java: 'int[]', py: 'arr2: List[int]', js: 'arr2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Distributive property of XOR over AND', content: 'The expression simplifies mathematically to (xorSum(arr1) AND xorSum(arr2)). Compute XOR sums of both arrays and return their bitwise AND.' }],
  jsSolution: (arr1, arr2) => {
    let xor1 = 0, xor2 = 0;
    for (let i = 0; i < arr1.length; i++) xor1 ^= arr1[i];
    for (let i = 0; i < arr2.length; i++) xor2 ^= arr2[i];
    return xor1 & xor2;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[12], [4]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(1, 5), 0, 50), randArr(randInt(1, 5), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(5, 15), 0, 500), randArr(randInt(5, 15), 0, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(15, 30), 0, 10000), randArr(randInt(15, 30), 0, 10000)]);
    return cases;
  }
}

];
