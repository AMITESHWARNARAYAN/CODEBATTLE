// Two Pointers — Batch 1 (25 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'reverse-only-letters',
  title: 'Reverse Only Letters',
  description: 'Given a string s, reverse only the letters and leave non-letter characters in their original positions. Return the resulting string.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers'],
  constraints: '1 <= s.length <= 100',
  examples: [{ input: '"ab-cd"', output: '"dc-ba"', explanation: 'Reverse letters only.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Two Pointers', content: 'Use left and right pointers, skip non-letters.' }],
  jsSolution: (s) => {
    const a = [...s]; let l = 0, r = a.length - 1;
    const isLetter = c => /[a-zA-Z]/.test(c);
    while (l < r) {
      if (!isLetter(a[l])) { l++; continue; }
      if (!isLetter(a[r])) { r--; continue; }
      [a[l], a[r]] = [a[r], a[l]]; l++; r--;
    }
    return a.join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ab-cd']); cases.push(['a-bC-dEf-ghIj']); cases.push(['Test1ng-Leet=code-Q!']);
    cases.push(['a']); cases.push(['---']); cases.push(['abcdef']);
    for (let i = 0; i < 44; i++) {
      const len = randInt(1, 50);
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_!@#';
      cases.push([Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 80);
      const chars = 'abcdefABCDEF-!.?';
      cases.push([Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(80, 100);
      const chars = 'abcXYZ123-!';
      cases.push([Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    }
    return cases;
  }
},

// 2
{
  slug: 'remove-element-inplace',
  title: 'Remove Element',
  description: 'Given an integer array nums and an integer val, remove all occurrences of val in-place and return the resulting array.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '0 <= nums.length <= 100, 0 <= nums[i] <= 50, 0 <= val <= 100',
  examples: [{ input: '[3,2,2,3], 3', output: '[2,2]', explanation: 'Remove all 3s.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'val', cpp: 'int', java: 'int', py: 'val: int', js: 'val' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Overwrite', content: 'Use a slow pointer to write non-val elements.' }],
  jsSolution: (nums, val) => nums.filter(n => n !== val),
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 2, 2, 3], 3]); cases.push([[0, 1, 2, 2, 3, 0, 4, 2], 2]); cases.push([[], 1]);
    cases.push([[1], 1]); cases.push([[1], 2]); cases.push([[1, 1, 1], 1]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(0, 30), 0, 10), randInt(0, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 0, 30), randInt(0, 30)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 0, 50), randInt(0, 50)]);
    return cases;
  }
},

// 3
{
  slug: 'valid-palindrome-ii',
  title: 'Valid Palindrome II',
  description: 'Given a string s, return true if the string can be a palindrome after deleting at most one character from it.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers', 'Greedy'],
  constraints: '1 <= s.length <= 10^5, s consists of lowercase English letters',
  examples: [{ input: '"aba"', output: 'true', explanation: 'Already a palindrome.' }, { input: '"abca"', output: 'true', explanation: 'Remove c to get "aba".' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Skip One', content: 'When mismatch found, try skipping left or right character.' }],
  jsSolution: (s) => {
    const isPalin = (s, l, r) => { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; };
    let l = 0, r = s.length - 1;
    while (l < r) {
      if (s[l] !== s[r]) return isPalin(s, l + 1, r) || isPalin(s, l, r - 1);
      l++; r--;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['aba']); cases.push(['abca']); cases.push(['abc']); cases.push(['a']); cases.push(['aa']);
    cases.push(['ab']); cases.push(['racecar']); cases.push(['deeee']);
    for (let i = 0; i < 42; i++) cases.push([randStr(randInt(1, 50))]);
    for (let i = 0; i < 50; i++) {
      const half = randStr(randInt(10, 50));
      const pal = half + [...half].reverse().join('');
      cases.push([pal]);
    }
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(100, 1000))]);
    return cases;
  }
},

// 4
{
  slug: 'move-element-to-end',
  title: 'Move Element to End',
  description: 'Given an array of integers and a target value, move all instances of the target to the end of the array, maintaining the order of non-target elements. Return the modified array.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '0 <= nums.length <= 10^4, -10^4 <= nums[i] <= 10^4',
  examples: [{ input: '[2,1,2,2,2,3,4,2], 2', output: '[1,3,4,2,2,2,2,2]', explanation: 'Move all 2s to end.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Partition', content: 'Collect non-target elements first, then fill remaining with target.' }],
  jsSolution: (nums, target) => {
    const nonT = nums.filter(n => n !== target);
    const tCount = nums.length - nonT.length;
    return [...nonT, ...Array(tCount).fill(target)];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 2, 2, 2, 3, 4, 2], 2]); cases.push([[], 3]); cases.push([[1, 1, 1], 1]);
    cases.push([[1, 2, 3], 4]); cases.push([[5], 5]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(0, 50), -10, 10), randInt(-10, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), -100, 100), randInt(-100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(200, 1000), -10000, 10000), randInt(-10000, 10000)]);
    return cases;
  }
},

// 5
{
  slug: 'string-compression',
  title: 'String Compression',
  description: 'Given an array of characters chars, compress it using the following algorithm: for each group of consecutive repeating characters, append the character followed by the group length if > 1. Return the compressed array.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers'],
  constraints: '1 <= chars.length <= 2000, chars[i] is a lowercase letter, uppercase letter, digit, or symbol',
  examples: [{ input: '["a","a","b","b","c","c","c"]', output: '["a","2","b","2","c","3"]', explanation: 'Groups: aa, bb, ccc.' }],
  args: [{ name: 'chars', cpp: 'vector<char>', java: 'char[]', py: 'chars: List[str]', js: 'chars' }],
  retType: { cpp: 'vector<char>', java: 'char[]', py: 'List[str]' },
  hints: [{ title: 'Read-Write Pointer', content: 'Use a read pointer to count groups and a write pointer to output.' }],
  jsSolution: (chars) => {
    const res = [];
    let i = 0;
    while (i < chars.length) {
      let j = i;
      while (j < chars.length && chars[j] === chars[i]) j++;
      res.push(chars[i]);
      if (j - i > 1) res.push(...String(j - i).split(''));
      i = j;
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([['a', 'a', 'b', 'b', 'c', 'c', 'c']]); cases.push([['a']]); cases.push([['a', 'b', 'c']]);
    cases.push([['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']]);
    for (let i = 0; i < 46; i++) {
      const len = randInt(1, 50);
      const alpha = 'abcde';
      cases.push([Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)])]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 200);
      const alpha = 'abcdefgh';
      cases.push([Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)])]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(200, 2000);
      const alpha = 'abcdefghij';
      cases.push([Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)])]);
    }
    return cases;
  }
},

// 6
{
  slug: 'three-sum-closest',
  title: '3Sum Closest',
  description: 'Given an integer array nums and a target, find three integers whose sum is closest to target. Return the sum.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '3 <= nums.length <= 500, -1000 <= nums[i] <= 1000, -10^4 <= target <= 10^4',
  examples: [{ input: '[-1,2,1,-4], 1', output: '2', explanation: 'Closest sum: -1 + 2 + 1 = 2.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Two Pointers', content: 'Sort, fix one element, use two pointers for the rest.' }],
  jsSolution: (nums, target) => {
    nums.sort((a, b) => a - b);
    let closest = nums[0] + nums[1] + nums[2];
    for (let i = 0; i < nums.length - 2; i++) {
      let l = i + 1, r = nums.length - 1;
      while (l < r) {
        const sum = nums[i] + nums[l] + nums[r];
        if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;
        if (sum < target) l++;
        else if (sum > target) r--;
        else return sum;
      }
    }
    return closest;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-1, 2, 1, -4], 1]); cases.push([[0, 0, 0], 1]); cases.push([[1, 1, 1], 3]);
    cases.push([[-1, 0, 1], 0]); cases.push([[1000, -1000, 0], 0]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(3, 30), -100, 100), randInt(-200, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 100), -500, 500), randInt(-1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 500), -1000, 1000), randInt(-10000, 10000)]);
    return cases;
  }
},

// 7
{
  slug: 'boats-to-save-people',
  title: 'Boats to Save People',
  description: 'Given people[i] is the weight of the ith person and an integer limit (each boat carries at most 2 people with total weight <= limit), return the minimum number of boats.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting'],
  constraints: '1 <= people.length <= 5 * 10^4, 1 <= people[i] <= limit <= 3 * 10^4',
  examples: [{ input: '[3,2,2,1], 3', output: '3', explanation: 'Boats: (1,2), (2), (3).' }],
  args: [
    { name: 'people', cpp: 'vector<int>', java: 'int[]', py: 'people: List[int]', js: 'people' },
    { name: 'limit', cpp: 'int', java: 'int', py: 'limit: int', js: 'limit' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Greedy', content: 'Sort, pair lightest with heaviest when possible.' }],
  jsSolution: (people, limit) => {
    people.sort((a, b) => a - b);
    let boats = 0, l = 0, r = people.length - 1;
    while (l <= r) {
      if (people[l] + people[r] <= limit) l++;
      r--; boats++;
    }
    return boats;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 2, 2, 1], 3]); cases.push([[3, 5, 3, 4], 5]); cases.push([[1], 1]); cases.push([[1, 2], 3]);
    for (let i = 0; i < 46; i++) {
      const limit = randInt(1, 100);
      const p = Array.from({ length: randInt(1, 50) }, () => randInt(1, limit));
      cases.push([p, limit]);
    }
    for (let i = 0; i < 50; i++) {
      const limit = randInt(100, 1000);
      const p = Array.from({ length: randInt(50, 500) }, () => randInt(1, limit));
      cases.push([p, limit]);
    }
    for (let i = 0; i < 50; i++) {
      const limit = randInt(1000, 30000);
      const p = Array.from({ length: randInt(500, 5000) }, () => randInt(1, limit));
      cases.push([p, limit]);
    }
    return cases;
  }
},

// 8
{
  slug: 'four-sum',
  title: '4Sum',
  description: 'Given an array nums and a target, return all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a,b,c,d are distinct and their sum equals target.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 200, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
  examples: [{ input: '[1,0,-1,0,-2,2], 0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]', explanation: 'Three unique quadruplets.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Reduce to 3Sum', content: 'Fix one element and solve 3Sum for the remainder.' }],
  jsSolution: (nums, target) => {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 3; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) continue;
      for (let j = i + 1; j < nums.length - 2; j++) {
        if (j > i + 1 && nums[j] === nums[j - 1]) continue;
        let l = j + 1, r = nums.length - 1;
        while (l < r) {
          const sum = nums[i] + nums[j] + nums[l] + nums[r];
          if (sum === target) {
            res.push([nums[i], nums[j], nums[l], nums[r]]);
            while (l < r && nums[l] === nums[l + 1]) l++;
            while (l < r && nums[r] === nums[r - 1]) r--;
            l++; r--;
          } else if (sum < target) l++;
          else r--;
        }
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, -1, 0, -2, 2], 0]); cases.push([[2, 2, 2, 2, 2], 8]); cases.push([[0, 0, 0, 0], 0]);
    cases.push([[1, 2, 3, 4], 10]); cases.push([[1], 1]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 30), -50, 50), randInt(-200, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 80), -100, 100), randInt(-400, 400)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(80, 200), -1000, 1000), randInt(-4000, 4000)]);
    return cases;
  }
},

// 9
{
  slug: 'trapping-rain-water-tp',
  title: 'Trapping Rain Water (Two Pointers)',
  description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap. Solve with two pointers approach.',
  difficulty: 'Hard',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= n <= 2 * 10^4, 0 <= height[i] <= 10^5',
  examples: [{ input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water.' }],
  args: [{ name: 'height', cpp: 'vector<int>', java: 'int[]', py: 'height: List[int]', js: 'height' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two Pointers', content: 'Track left max and right max while moving inward.' }],
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
    cases.push([[1, 1]]); cases.push([[5, 0, 5]]); cases.push([[0, 0, 0]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 0, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 100000)]);
    return cases;
  }
},

// 10
{
  slug: 'partition-labels',
  title: 'Partition Labels',
  description: 'Given a string s, partition it into as many parts as possible so that each letter appears in at most one part. Return an array of the sizes of the parts.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers', 'Greedy', 'Hash Table'],
  constraints: '1 <= s.length <= 500, s consists of lowercase English letters',
  examples: [{ input: '"ababcbacadefegdehijhklij"', output: '[9,7,8]', explanation: 'Partition: "ababcbaca", "defegde", "hijhklij".' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Last Occurrence', content: 'Track last occurrence of each character, extend partition to cover it.' }],
  jsSolution: (s) => {
    const last = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;
    const res = [];
    let start = 0, end = 0;
    for (let i = 0; i < s.length; i++) {
      end = Math.max(end, last[s[i]]);
      if (i === end) { res.push(end - start + 1); start = end + 1; }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ababcbacadefegdehijhklij']); cases.push(['eccbbbbdec']); cases.push(['a']); cases.push(['abcabc']);
    cases.push(['aaa']); cases.push(['abcdefghijklmnopqrstuvwxyz']);
    for (let i = 0; i < 44; i++) cases.push([randStr(randInt(1, 50))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 200))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(200, 500))]);
    return cases;
  }
},

// 11
{
  slug: 'two-sum-less-than-k',
  title: 'Two Sum Less Than K',
  description: 'Given an array of integers nums and an integer k, return the maximum sum nums[i] + nums[j] such that i < j and the sum is strictly less than k. Return -1 if no such pair exists.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 100, 1 <= nums[i] <= 1000, 1 <= k <= 2000',
  examples: [{ input: '[34,23,1,24,75,33,54,8], 60', output: '58', explanation: '34 + 24 = 58 < 60.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Two Pointers', content: 'Sort the array, use two pointers to find the maximum pair sum < k.' }],
  jsSolution: (nums, k) => {
    nums.sort((a, b) => a - b);
    let l = 0, r = nums.length - 1, best = -1;
    while (l < r) {
      const sum = nums[l] + nums[r];
      if (sum < k) { best = Math.max(best, sum); l++; }
      else r--;
    }
    return best;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[34, 23, 1, 24, 75, 33, 54, 8], 60]); cases.push([[10, 20, 30], 15]); cases.push([[1], 2]);
    cases.push([[1, 1], 2]); cases.push([[1, 1], 3]); cases.push([[1000, 1000], 2000]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 30), 1, 100), randInt(1, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 60), 1, 500), randInt(1, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 100), 1, 1000), randInt(1, 2000)]);
    return cases;
  }
},

// 12
{
  slug: 'assign-cookies',
  title: 'Assign Cookies',
  description: 'Given greed factors g[] for children and cookie sizes s[], assign cookies to maximize the number of content children. Each child gets at most one cookie, and is content only if cookie size >= greed factor.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting'],
  constraints: '1 <= g.length, s.length <= 3 * 10^4, 1 <= g[i], s[j] <= 2^31 - 1',
  examples: [{ input: '[1,2,3], [1,1]', output: '1', explanation: 'Only one child with greed 1 can be content.' }],
  args: [
    { name: 'g', cpp: 'vector<int>', java: 'int[]', py: 'g: List[int]', js: 'g' },
    { name: 's', cpp: 'vector<int>', java: 'int[]', py: 's: List[int]', js: 's' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort Both', content: 'Sort both arrays and greedily assign smallest sufficient cookie.' }],
  jsSolution: (g, s) => {
    g.sort((a, b) => a - b); s.sort((a, b) => a - b);
    let i = 0, j = 0;
    while (i < g.length && j < s.length) {
      if (s[j] >= g[i]) i++;
      j++;
    }
    return i;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], [1, 1]]); cases.push([[1, 2], [1, 2, 3]]); cases.push([[10], [1]]);
    cases.push([[1], [1]]); cases.push([[1, 1], [1, 1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), 1, 100), randArr(randInt(1, 50), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 1000), randArr(randInt(50, 500), 1, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 1, 10000), randArr(randInt(500, 5000), 1, 10000)]);
    return cases;
  }
},

// 13
{
  slug: 'longest-mountain-in-array',
  title: 'Longest Mountain in Array',
  description: 'Given an integer array arr, return the length of the longest subarray which is a mountain (strictly increases then strictly decreases, length >= 3). Return 0 if no mountain exists.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= arr.length <= 10^4, 0 <= arr[i] <= 10^4',
  examples: [{ input: '[2,1,4,7,3,2,5]', output: '5', explanation: 'Mountain [1,4,7,3,2] has length 5.' }],
  args: [{ name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Expand from Peak', content: 'For each peak, expand left and right to find the full mountain.' }],
  jsSolution: (arr) => {
    let longest = 0;
    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
        let l = i, r = i;
        while (l > 0 && arr[l - 1] < arr[l]) l--;
        while (r < arr.length - 1 && arr[r + 1] < arr[r]) r++;
        longest = Math.max(longest, r - l + 1);
      }
    }
    return longest;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 4, 7, 3, 2, 5]]); cases.push([[2, 2, 2]]); cases.push([[1, 2, 3]]);
    cases.push([[3, 2, 1]]); cases.push([[0, 1, 0]]); cases.push([[1]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 10000)]);
    return cases;
  }
},

// 14
{
  slug: 'sort-array-by-parity-ii',
  title: 'Sort Array By Parity II',
  description: 'Given an array of integers where half are even and half are odd, rearrange so that nums[i] is even when i is even, and odd when i is odd.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '2 <= nums.length <= 2 * 10^4, nums.length is even, half are even, half are odd',
  examples: [{ input: '[4,2,5,7]', output: '[4,5,2,7]', explanation: 'Even indices have even values, odd indices have odd values.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Passes', content: 'Place evens at even indices, odds at odd indices.' }],
  jsSolution: (nums) => {
    const evens = nums.filter(n => n % 2 === 0);
    const odds = nums.filter(n => n % 2 === 1);
    const res = [];
    for (let i = 0; i < nums.length; i++) res.push(i % 2 === 0 ? evens.shift() : odds.shift());
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 5, 7]]); cases.push([[2, 3]]); cases.push([[2, 3, 4, 1]]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 25);
      const evens = Array.from({ length: n }, () => randInt(0, 500) * 2);
      const odds = Array.from({ length: n }, () => randInt(0, 500) * 2 + 1);
      const arr = [...evens, ...odds];
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(25, 100);
      const evens = Array.from({ length: n }, () => randInt(0, 5000) * 2);
      const odds = Array.from({ length: n }, () => randInt(0, 5000) * 2 + 1);
      const arr = [...evens, ...odds];
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(100, 5000);
      const evens = Array.from({ length: n }, () => randInt(0, 5000) * 2);
      const odds = Array.from({ length: n }, () => randInt(0, 5000) * 2 + 1);
      const arr = [...evens, ...odds];
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr]);
    }
    return cases;
  }
},

// 15
{
  slug: 'remove-nth-from-end-list',
  title: 'Remove Nth Node From End (Array)',
  description: 'Given an array representing a linked list and an integer n, remove the nth node from the end and return the modified array.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '1 <= arr.length <= 30, 1 <= n <= arr.length',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[1,2,3,5]', explanation: 'Remove 2nd from end (value 4).' }],
  args: [
    { name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Calculate Index', content: 'Index to remove = length - n.' }],
  jsSolution: (arr, n) => {
    const idx = arr.length - n;
    return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]); cases.push([[1], 1]); cases.push([[1, 2], 1]); cases.push([[1, 2], 2]);
    for (let i = 0; i < 46; i++) { const len = randInt(1, 15); cases.push([randArr(len, 1, 100), randInt(1, len)]); }
    for (let i = 0; i < 50; i++) { const len = randInt(15, 25); cases.push([randArr(len, 1, 100), randInt(1, len)]); }
    for (let i = 0; i < 50; i++) { const len = randInt(25, 30); cases.push([randArr(len, 1, 100), randInt(1, len)]); }
    return cases;
  }
},

// 16
{
  slug: 'merge-sorted-arrays',
  title: 'Merge Sorted Arrays',
  description: 'Given two sorted integer arrays nums1 and nums2, merge them into a single sorted array and return it.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '0 <= nums1.length, nums2.length <= 200, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,2,3], [2,5,6]', output: '[1,2,2,3,5,6]', explanation: 'Merge sorted.' }],
  args: [
    { name: 'nums1', cpp: 'vector<int>', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
    { name: 'nums2', cpp: 'vector<int>', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Pointers', content: 'Compare elements from both arrays and pick the smaller one.' }],
  jsSolution: (nums1, nums2) => {
    const res = [];
    let i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
      if (nums1[i] <= nums2[j]) res.push(nums1[i++]);
      else res.push(nums2[j++]);
    }
    while (i < nums1.length) res.push(nums1[i++]);
    while (j < nums2.length) res.push(nums2[j++]);
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], [2, 5, 6]]); cases.push([[], [1]]); cases.push([[1], []]);
    cases.push([[], []]); cases.push([[1], [1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(0, 30), -100, 100).sort((a, b) => a - b), randArr(randInt(0, 30), -100, 100).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 100), -10000, 10000).sort((a, b) => a - b), randArr(randInt(30, 100), -10000, 10000).sort((a, b) => a - b)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 200), -1000000000, 1000000000).sort((a, b) => a - b), randArr(randInt(100, 200), -1000000000, 1000000000).sort((a, b) => a - b)]);
    return cases;
  }
},

// 17
{
  slug: 'interval-list-intersections',
  title: 'Interval List Intersections',
  description: 'Given two sorted lists of closed intervals, return the intersection of these two interval lists.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers'],
  constraints: '0 <= length <= 1000, 0 <= start <= end <= 10^9',
  examples: [{ input: '[[0,2],[5,10],[13,23],[24,25]], [[1,5],[8,12],[15,24],[25,26]]', output: '[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]', explanation: 'Pairwise intersections.' }],
  args: [
    { name: 'firstList', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'firstList: List[List[int]]', js: 'firstList' },
    { name: 'secondList', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'secondList: List[List[int]]', js: 'secondList' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Two Pointers', content: 'Compare intervals, compute overlap, advance the one that ends first.' }],
  jsSolution: (firstList, secondList) => {
    const res = [];
    let i = 0, j = 0;
    while (i < firstList.length && j < secondList.length) {
      const lo = Math.max(firstList[i][0], secondList[j][0]);
      const hi = Math.min(firstList[i][1], secondList[j][1]);
      if (lo <= hi) res.push([lo, hi]);
      if (firstList[i][1] < secondList[j][1]) i++;
      else j++;
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]]);
    cases.push([[], [[1, 2]]]); cases.push([[[1, 2]], []]); cases.push([[[1, 5]], [[1, 5]]]);
    const genSorted = (n, maxV) => {
      const ivs = [];
      let cur = 0;
      for (let k = 0; k < n; k++) {
        const s = cur + randInt(0, Math.floor(maxV / n));
        const e = s + randInt(0, Math.floor(maxV / n));
        ivs.push([s, e]);
        cur = e + 1;
      }
      return ivs;
    };
    for (let i = 0; i < 46; i++) cases.push([genSorted(randInt(0, 10), 100), genSorted(randInt(0, 10), 100)]);
    for (let i = 0; i < 50; i++) cases.push([genSorted(randInt(10, 50), 10000), genSorted(randInt(10, 50), 10000)]);
    for (let i = 0; i < 50; i++) cases.push([genSorted(randInt(50, 200), 1000000), genSorted(randInt(50, 200), 1000000)]);
    return cases;
  }
},

// 18
{
  slug: 'find-pair-with-given-diff',
  title: 'Find Pair With Given Difference',
  description: 'Given an array of distinct integers and a target difference k, find a pair (a, b) such that a - b = k. Return [a, b] sorted in descending order, or [-1, -1] if no pair exists.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Hash Table', 'Sorting'],
  constraints: '2 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4, 0 <= k <= 10^4',
  examples: [{ input: '[5,20,3,2,50,80], 78', output: '[80,2]', explanation: '80 - 2 = 78.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Hash Set', content: 'For each element, check if element + k or element - k exists in a set.' }],
  jsSolution: (nums, k) => {
    const set = new Set(nums);
    for (const n of nums) {
      if (set.has(n - k)) return [n, n - k].sort((a, b) => b - a);
    }
    return [-1, -1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 20, 3, 2, 50, 80], 78]); cases.push([[1, 2, 3], 0]); cases.push([[90, 70, 20, 80, 50], 45]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(2, 50);
      const s = new Set();
      while (s.size < n) s.add(randInt(-100, 100));
      cases.push([[...s], randInt(0, 200)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 200);
      const s = new Set();
      while (s.size < n) s.add(randInt(-1000, 1000));
      cases.push([[...s], randInt(0, 2000)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(200, 1000);
      const s = new Set();
      while (s.size < n) s.add(randInt(-10000, 10000));
      cases.push([[...s], randInt(0, 10000)]);
    }
    return cases;
  }
},

// 19
{
  slug: 'max-number-of-k-sum-pairs',
  title: 'Max Number of K-Sum Pairs',
  description: 'Given an integer array nums and an integer k, return the maximum number of operations where you pick two numbers from the array whose sum equals k, removing them.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Hash Table', 'Sorting'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^9, 1 <= k <= 10^9',
  examples: [{ input: '[1,2,3,4], 5', output: '2', explanation: 'Pairs: (1,4) and (2,3).' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Two Pointers', content: 'Sort and use two pointers from both ends.' }],
  jsSolution: (nums, k) => {
    nums.sort((a, b) => a - b);
    let l = 0, r = nums.length - 1, ops = 0;
    while (l < r) {
      const sum = nums[l] + nums[r];
      if (sum === k) { ops++; l++; r--; }
      else if (sum < k) l++;
      else r--;
    }
    return ops;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4], 5]); cases.push([[3, 1, 3, 4, 3], 6]); cases.push([[1], 2]);
    cases.push([[1, 1, 1, 1], 2]); cases.push([[1, 2], 3]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), 1, 100), randInt(2, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 10000), randInt(2, 20000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 1, 1000000000), randInt(2, 1000000000)]);
    return cases;
  }
},

// 20
{
  slug: 'dutch-national-flag',
  title: 'Dutch National Flag',
  description: 'Given an array containing only 0s, 1s, and 2s, sort it in-place using the Dutch National Flag algorithm. Return the sorted array.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Sorting'],
  constraints: '1 <= nums.length <= 300, nums[i] is 0, 1, or 2',
  examples: [{ input: '[2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: 'Three-way partition.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Three Pointers', content: 'low for 0s, mid for scanning, high for 2s.' }],
  jsSolution: (nums) => {
    const a = [...nums];
    let low = 0, mid = 0, high = a.length - 1;
    while (mid <= high) {
      if (a[mid] === 0) { [a[low], a[mid]] = [a[mid], a[low]]; low++; mid++; }
      else if (a[mid] === 1) mid++;
      else { [a[mid], a[high]] = [a[high], a[mid]]; high--; }
    }
    return a;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 0, 2, 1, 1, 0]]); cases.push([[0]]); cases.push([[2, 2, 2]]); cases.push([[0, 1, 2]]);
    for (let i = 0; i < 46; i++) cases.push([randArr(randInt(1, 30), 0, 2)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 100), 0, 2)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 300), 0, 2)]);
    return cases;
  }
},

// 21
{
  slug: 'minimize-max-pair-sum',
  title: 'Minimize Maximum Pair Sum in Array',
  description: 'Given an array of even length, pair up elements to minimize the maximum pair sum. Return the minimized maximum pair sum.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting'],
  constraints: '2 <= nums.length <= 10^5, nums.length is even, 1 <= nums[i] <= 10^5',
  examples: [{ input: '[3,5,2,3]', output: '7', explanation: 'Pairs: (2,5) and (3,3). Max sum is 7.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Pair Extremes', content: 'Sort and pair smallest with largest.' }],
  jsSolution: (nums) => {
    nums.sort((a, b) => a - b);
    let maxSum = 0;
    for (let i = 0; i < nums.length / 2; i++) {
      maxSum = Math.max(maxSum, nums[i] + nums[nums.length - 1 - i]);
    }
    return maxSum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 2, 3]]); cases.push([[3, 5, 4, 2, 4, 6]]); cases.push([[1, 1]]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 25) * 2; cases.push([randArr(n, 1, 100)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(25, 250) * 2; cases.push([randArr(n, 1, 10000)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(250, 5000) * 2; cases.push([randArr(n, 1, 100000)]); }
    return cases;
  }
},

// 22
{
  slug: 'reverse-words-in-string',
  title: 'Reverse Words in a String',
  description: 'Given a string s, reverse the order of words. A word is a sequence of non-space characters. Return the string with words reversed and single spaces between them.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['String', 'Two Pointers'],
  constraints: '1 <= s.length <= 10^4, s contains English letters, digits, and spaces',
  examples: [{ input: '"the sky is blue"', output: '"blue is sky the"', explanation: 'Reverse word order.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Split and Reverse', content: 'Split by spaces, filter empty strings, reverse and join.' }],
  jsSolution: (s) => s.trim().split(/\s+/).reverse().join(' '),
  inputGenerator: () => {
    const cases = [];
    cases.push(['the sky is blue']); cases.push(['  hello world  ']); cases.push(['a good   example']);
    cases.push(['word']); cases.push([' single ']);
    const genSentence = (wordCount) => {
      const words = [];
      for (let i = 0; i < wordCount; i++) words.push(randStr(randInt(1, 10)));
      return words.join(' '.repeat(randInt(1, 3)));
    };
    for (let i = 0; i < 45; i++) cases.push([genSentence(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genSentence(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genSentence(randInt(50, 200))]);
    return cases;
  }
},

// 23
{
  slug: 'next-greater-element-sorted',
  title: 'Next Greater Element (Sorted Array)',
  description: 'Given a sorted array and a target, return an array of two elements: the greatest element less than target and the smallest element greater than target. If either does not exist, use -1.',
  difficulty: 'Easy',
  category: 'Two Pointers',
  tags: ['Array', 'Binary Search', 'Two Pointers'],
  constraints: '1 <= nums.length <= 10^4, -10^4 <= nums[i], target <= 10^4, nums is sorted',
  examples: [{ input: '[1,3,5,7,9], 5', output: '[3,7]', explanation: '3 < 5 and 7 > 5 are the closest neighbors.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Binary Search', content: 'Find insertion point and check neighbors.' }],
  jsSolution: (nums, target) => {
    let lower = -1, upper = -1;
    for (const n of nums) {
      if (n < target) lower = n;
      if (n > target && upper === -1) upper = n;
    }
    return [lower, upper];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 5, 7, 9], 5]); cases.push([[1, 2, 3], 0]); cases.push([[1, 2, 3], 4]);
    cases.push([[5], 5]); cases.push([[1, 3], 2]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), -100, 100).sort((a, b) => a - b), randInt(-100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000).sort((a, b) => a - b), randInt(-1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), -10000, 10000).sort((a, b) => a - b), randInt(-10000, 10000)]);
    return cases;
  }
},

// 24
{
  slug: 'max-consecutive-ones-iii',
  title: 'Max Consecutive Ones III',
  description: 'Given a binary array nums and an integer k, return the maximum number of consecutive 1s if you can flip at most k 0s.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Sliding Window', 'Two Pointers'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1, 0 <= k <= nums.length',
  examples: [{ input: '[1,1,1,0,0,0,1,1,1,1,0], 2', output: '6', explanation: 'Flip 2 zeros to get [1,1,1,0,0,1,1,1,1,1,1].' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Expand right, shrink left when zeros exceed k.' }],
  jsSolution: (nums, k) => {
    let l = 0, zeros = 0, maxLen = 0;
    for (let r = 0; r < nums.length; r++) {
      if (nums[r] === 0) zeros++;
      while (zeros > k) { if (nums[l] === 0) zeros--; l++; }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2]); cases.push([[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3]);
    cases.push([[1], 0]); cases.push([[0], 0]); cases.push([[0], 1]); cases.push([[1, 1, 1, 1], 0]);
    for (let i = 0; i < 44; i++) { const n = randInt(1, 50); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    return cases;
  }
},

// 25
{
  slug: 'find-k-closest-elements',
  title: 'Find K Closest Elements',
  description: 'Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array, sorted in ascending order.',
  difficulty: 'Medium',
  category: 'Two Pointers',
  tags: ['Array', 'Two Pointers', 'Binary Search', 'Sorting'],
  constraints: '1 <= k <= arr.length <= 10^4, -10^4 <= arr[i], x <= 10^4',
  examples: [{ input: '[1,2,3,4,5], 4, 3', output: '[1,2,3,4]', explanation: '4 closest to 3: [1,2,3,4].' }],
  args: [
    { name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' },
    { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Binary Search Window', content: 'Binary search for the left boundary of the k-element window.' }],
  jsSolution: (arr, k, x) => {
    let l = 0, r = arr.length - k;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (x - arr[mid] > arr[mid + k] - x) l = mid + 1;
      else r = mid;
    }
    return arr.slice(l, l + k);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 4, 3]); cases.push([[1, 2, 3, 4, 5], 4, -1]); cases.push([[1], 1, 1]);
    cases.push([[1, 1, 1, 10, 10, 10], 1, 9]); cases.push([[0, 0, 1, 2, 3, 3, 4, 7, 7, 8], 3, 5]);
    for (let i = 0; i < 45; i++) {
      const n = randInt(1, 50);
      const arr = randArr(n, -100, 100).sort((a, b) => a - b);
      cases.push([arr, randInt(1, n), randInt(-100, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500);
      const arr = randArr(n, -1000, 1000).sort((a, b) => a - b);
      cases.push([arr, randInt(1, n), randInt(-1000, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 10000);
      const arr = randArr(n, -10000, 10000).sort((a, b) => a - b);
      cases.push([arr, randInt(1, n), randInt(-10000, 10000)]);
    }
    return cases;
  }
}

];

export default problems;
