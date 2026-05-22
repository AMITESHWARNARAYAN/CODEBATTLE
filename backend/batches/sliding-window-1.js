// Sliding Window — Batch 1 (25 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'max-sum-subarray-size-k',
  title: 'Maximum Sum Subarray of Size K',
  description: 'Given an array of positive numbers and a positive number k, find the maximum sum of any contiguous subarray of size k.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= k <= nums.length <= 10^5, 1 <= nums[i] <= 10^4',
  examples: [{ input: '[2,1,5,1,3,2], 3', output: '9', explanation: 'Subarray [5,1,3] has sum 9.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Fixed Window', content: 'Maintain a window of size k, slide it across.' }],
  jsSolution: (nums, k) => {
    let sum = 0, maxS = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i];
      if (i >= k) sum -= nums[i - k];
      if (i >= k - 1) maxS = Math.max(maxS, sum);
    }
    return maxS;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 5, 1, 3, 2], 3]); cases.push([[2, 3, 4, 1, 5], 2]); cases.push([[1], 1]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 50); cases.push([randArr(n, 1, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 1, 1000), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, 1, 10000), randInt(1, n)]); }
    return cases;
  }
},

// 2
{
  slug: 'smallest-subarray-with-sum',
  title: 'Minimum Size Subarray Sum',
  description: 'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum >= target. If no such subarray, return 0.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Binary Search'],
  constraints: '1 <= target <= 10^9, 1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^4',
  examples: [{ input: '7, [2,3,1,2,4,3]', output: '2', explanation: 'Subarray [4,3] has sum 7.' }],
  args: [
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' },
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Shrink Window', content: 'Expand right, shrink left when sum >= target.' }],
  jsSolution: (target, nums) => {
    let l = 0, sum = 0, minLen = Infinity;
    for (let r = 0; r < nums.length; r++) {
      sum += nums[r];
      while (sum >= target) { minLen = Math.min(minLen, r - l + 1); sum -= nums[l++]; }
    }
    return minLen === Infinity ? 0 : minLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([7, [2, 3, 1, 2, 4, 3]]); cases.push([4, [1, 4, 4]]); cases.push([11, [1, 1, 1, 1, 1, 1, 1, 1]]);
    cases.push([1, [1]]); cases.push([100, [1, 2, 3]]);
    for (let i = 0; i < 45; i++) cases.push([randInt(1, 100), randArr(randInt(1, 50), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(1, 10000), randArr(randInt(50, 500), 1, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(1, 100000), randArr(randInt(500, 10000), 1, 10000)]);
    return cases;
  }
},

// 3
{
  slug: 'longest-substring-k-distinct',
  title: 'Longest Substring with At Most K Distinct Characters',
  description: 'Given a string s and an integer k, return the length of the longest substring with at most k distinct characters.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 5 * 10^4, 0 <= k <= 50',
  examples: [{ input: '"eceba", 2', output: '3', explanation: 'Longest substring with at most 2 distinct chars: "ece".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Window + Map', content: 'Use hash map to track character counts in window.' }],
  jsSolution: (s, k) => {
    const map = {};
    let l = 0, maxLen = 0, distinct = 0;
    for (let r = 0; r < s.length; r++) {
      if (!map[s[r]] || map[s[r]] === 0) distinct++;
      map[s[r]] = (map[s[r]] || 0) + 1;
      while (distinct > k) { map[s[l]]--; if (map[s[l]] === 0) distinct--; l++; }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['eceba', 2]); cases.push(['aa', 1]); cases.push(['a', 0]); cases.push(['abcabc', 3]);
    for (let i = 0; i < 46; i++) cases.push([randStr(randInt(1, 50)), randInt(0, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500)), randInt(0, 26)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 5000)), randInt(0, 50)]);
    return cases;
  }
},

// 4
{
  slug: 'fruits-into-baskets',
  title: 'Fruit Into Baskets',
  description: 'Given an array of integers (fruit types), find the maximum number of fruits you can collect with at most 2 baskets (at most 2 distinct types in a contiguous window).',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= fruits.length <= 10^5, 0 <= fruits[i] < fruits.length',
  examples: [{ input: '[1,2,1]', output: '3', explanation: 'Collect all: types 1 and 2.' }],
  args: [{ name: 'fruits', cpp: 'vector<int>', java: 'int[]', py: 'fruits: List[int]', js: 'fruits' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'At Most 2 Distinct', content: 'Same as longest substring with at most 2 distinct.' }],
  jsSolution: (fruits) => {
    const map = {};
    let l = 0, maxLen = 0, distinct = 0;
    for (let r = 0; r < fruits.length; r++) {
      if (!map[fruits[r]]) distinct++;
      map[fruits[r]] = (map[fruits[r]] || 0) + 1;
      while (distinct > 2) { map[fruits[l]]--; if (map[fruits[l]] === 0) { delete map[fruits[l]]; distinct--; } l++; }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 1]]); cases.push([[0, 1, 2, 2]]); cases.push([[1, 2, 3, 2, 2]]); cases.push([[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]]);
    cases.push([[0]]); cases.push([[1, 1]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 0, 5)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 100)]);
    return cases;
  }
},

// 5
{
  slug: 'no-repeat-substring',
  title: 'Longest Substring Without Repeating Characters',
  description: 'Given a string s, find the length of the longest substring without repeating characters.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols, spaces',
  examples: [{ input: '"abcabcbb"', output: '3', explanation: 'Longest: "abc".' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Hash Map', content: 'Track last index of each character, shrink window on duplicates.' }],
  jsSolution: (s) => {
    const map = {};
    let l = 0, maxLen = 0;
    for (let r = 0; r < s.length; r++) {
      if (map[s[r]] !== undefined && map[s[r]] >= l) l = map[s[r]] + 1;
      map[s[r]] = r;
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abcabcbb']); cases.push(['bbbbb']); cases.push(['pwwkew']); cases.push(['']); cases.push([' ']);
    cases.push(['dvdf']); cases.push(['abcdefghijklmnopqrstuvwxyz']);
    for (let i = 0; i < 43; i++) cases.push([randStr(randInt(0, 50))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 5000))]);
    return cases;
  }
},

// 6
{
  slug: 'character-replacement-sw',
  title: 'Longest Repeating Character Replacement',
  description: 'Given a string s and an integer k, you can change at most k characters. Return the length of the longest substring containing the same letter after performing at most k changes.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 10^5, s consists of uppercase English letters, 0 <= k <= s.length',
  examples: [{ input: '"ABAB", 2', output: '4', explanation: 'Replace both A or B with the other.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Max Frequency', content: 'Window size - max freq char count <= k.' }],
  jsSolution: (s, k) => {
    const count = {};
    let l = 0, maxFreq = 0, maxLen = 0;
    for (let r = 0; r < s.length; r++) {
      count[s[r]] = (count[s[r]] || 0) + 1;
      maxFreq = Math.max(maxFreq, count[s[r]]);
      while ((r - l + 1) - maxFreq > k) { count[s[l]]--; l++; }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ABAB', 2]); cases.push(['AABABBA', 1]); cases.push(['A', 0]); cases.push(['AAAA', 2]);
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 46; i++) { const len = randInt(1, 50); cases.push([Array.from({ length: len }, () => upper[randInt(0, 25)]).join(''), randInt(0, len)]); }
    for (let i = 0; i < 50; i++) { const len = randInt(50, 500); cases.push([Array.from({ length: len }, () => upper[randInt(0, 25)]).join(''), randInt(0, len)]); }
    for (let i = 0; i < 50; i++) { const len = randInt(500, 10000); cases.push([Array.from({ length: len }, () => upper[randInt(0, 25)]).join(''), randInt(0, len)]); }
    return cases;
  }
},

// 7
{
  slug: 'max-vowels-in-substring',
  title: 'Maximum Number of Vowels in Substring of Given Length',
  description: 'Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window'],
  constraints: '1 <= s.length <= 10^5, s consists of lowercase English letters, 1 <= k <= s.length',
  examples: [{ input: '"abciiidef", 3', output: '3', explanation: 'Substring "iii" has 3 vowels.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Fixed Window', content: 'Count vowels in window of size k, slide.' }],
  jsSolution: (s, k) => {
    const isVowel = c => 'aeiou'.includes(c);
    let count = 0, maxC = 0;
    for (let i = 0; i < s.length; i++) {
      if (isVowel(s[i])) count++;
      if (i >= k && isVowel(s[i - k])) count--;
      if (i >= k - 1) maxC = Math.max(maxC, count);
    }
    return maxC;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abciiidef', 3]); cases.push(['aeiou', 2]); cases.push(['leetcode', 3]); cases.push(['a', 1]);
    for (let i = 0; i < 46; i++) { const len = randInt(1, 50); cases.push([randStr(len), randInt(1, len)]); }
    for (let i = 0; i < 50; i++) { const len = randInt(50, 500); cases.push([randStr(len), randInt(1, len)]); }
    for (let i = 0; i < 50; i++) { const len = randInt(500, 10000); cases.push([randStr(len), randInt(1, len)]); }
    return cases;
  }
},

// 8
{
  slug: 'grumpy-bookstore-owner',
  title: 'Grumpy Bookstore Owner',
  description: 'Given customers[i] (number of customers at minute i), grumpy[i] (1 if owner is grumpy), and minutes (length of secret technique), the owner can suppress grumpiness for `minutes` consecutive minutes. Return the maximum number of satisfied customers.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= customers.length <= 2 * 10^4, 0 <= customers[i] <= 1000, grumpy[i] is 0 or 1, 1 <= minutes <= customers.length',
  examples: [{ input: '[1,0,1,2,1,1,7,5], [0,1,0,1,0,1,0,1], 3', output: '16', explanation: 'Use technique on minutes 3-5.' }],
  args: [
    { name: 'customers', cpp: 'vector<int>', java: 'int[]', py: 'customers: List[int]', js: 'customers' },
    { name: 'grumpy', cpp: 'vector<int>', java: 'int[]', py: 'grumpy: List[int]', js: 'grumpy' },
    { name: 'minutes', cpp: 'int', java: 'int', py: 'minutes: int', js: 'minutes' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Base + Extra', content: 'Calculate base satisfied. Slide window to find max extra from suppressing grumpiness.' }],
  jsSolution: (customers, grumpy, minutes) => {
    let base = 0;
    for (let i = 0; i < customers.length; i++) if (!grumpy[i]) base += customers[i];
    let extra = 0, maxExtra = 0;
    for (let i = 0; i < customers.length; i++) {
      if (grumpy[i]) extra += customers[i];
      if (i >= minutes && grumpy[i - minutes]) extra -= customers[i - minutes];
      maxExtra = Math.max(maxExtra, extra);
    }
    return base + maxExtra;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 1, 2, 1, 1, 7, 5], [0, 1, 0, 1, 0, 1, 0, 1], 3]);
    cases.push([[1], [0], 1]); cases.push([[4, 10, 10], [1, 1, 0], 2]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 50); const m = randInt(1, n);
      cases.push([randArr(n, 0, 100), randArr(n, 0, 1), m]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500); const m = randInt(1, n);
      cases.push([randArr(n, 0, 500), randArr(n, 0, 1), m]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 20000); const m = randInt(1, n);
      cases.push([randArr(n, 0, 1000), randArr(n, 0, 1), m]);
    }
    return cases;
  }
},

// 9
{
  slug: 'permutation-in-string',
  title: 'Permutation in String',
  description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1 (i.e., one of s1\'s permutations is a substring of s2).',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s1.length, s2.length <= 10^4, s1 and s2 consist of lowercase English letters',
  examples: [{ input: '"ab", "eidbaooo"', output: 'true', explanation: '"ba" is a permutation of "ab" and is in s2.' }],
  args: [
    { name: 's1', cpp: 'string', java: 'String', py: 's1: str', js: 's1' },
    { name: 's2', cpp: 'string', java: 'String', py: 's2: str', js: 's2' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Frequency Match', content: 'Use sliding window of size s1.length on s2, compare character frequencies.' }],
  jsSolution: (s1, s2) => {
    if (s1.length > s2.length) return false;
    const count = Array(26).fill(0);
    for (let i = 0; i < s1.length; i++) {
      count[s1.charCodeAt(i) - 97]++;
      count[s2.charCodeAt(i) - 97]--;
    }
    if (count.every(v => v === 0)) return true;
    for (let i = s1.length; i < s2.length; i++) {
      count[s2.charCodeAt(i) - 97]--;
      count[s2.charCodeAt(i - s1.length) - 97]++;
      if (count.every(v => v === 0)) return true;
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ab', 'eidbaooo']); cases.push(['ab', 'eidboaoo']); cases.push(['a', 'a']); cases.push(['abc', 'ab']);
    for (let i = 0; i < 46; i++) cases.push([randStr(randInt(1, 10)), randStr(randInt(1, 50))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(1, 50)), randStr(randInt(50, 500))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(1, 100)), randStr(randInt(500, 10000))]);
    return cases;
  }
},

// 10
{
  slug: 'find-all-anagrams-sw',
  title: 'Find All Anagrams in a String',
  description: 'Given two strings s and p, return an array of all start indices of p\'s anagrams in s.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length, p.length <= 3 * 10^4, s and p consist of lowercase English letters',
  examples: [{ input: '"cbaebabacd", "abc"', output: '[0,6]', explanation: 'Anagram "cba" at 0 and "bac" at 6.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'p', cpp: 'string', java: 'String', py: 'p: str', js: 'p' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Sliding Window', content: 'Slide a window of size p.length, compare frequency arrays.' }],
  jsSolution: (s, p) => {
    if (p.length > s.length) return [];
    const count = Array(26).fill(0);
    const res = [];
    for (let i = 0; i < p.length; i++) {
      count[p.charCodeAt(i) - 97]++;
      count[s.charCodeAt(i) - 97]--;
    }
    if (count.every(v => v === 0)) res.push(0);
    for (let i = p.length; i < s.length; i++) {
      count[s.charCodeAt(i) - 97]--;
      count[s.charCodeAt(i - p.length) - 97]++;
      if (count.every(v => v === 0)) res.push(i - p.length + 1);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['cbaebabacd', 'abc']); cases.push(['abab', 'ab']); cases.push(['a', 'a']); cases.push(['abc', 'abcd']);
    for (let i = 0; i < 46; i++) cases.push([randStr(randInt(1, 50)), randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500)), randStr(randInt(1, 20))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 10000)), randStr(randInt(1, 50))]);
    return cases;
  }
},

// 11
{
  slug: 'minimum-window-substring-sw',
  title: 'Minimum Window Substring',
  description: 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included. Return "" if no such window.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length, t.length <= 10^5, s and t consist of uppercase and lowercase English letters',
  examples: [{ input: '"ADOBECODEBANC", "ABC"', output: '"BANC"', explanation: 'Minimum window containing A, B, C.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Expand + Shrink', content: 'Expand right to cover t, shrink left to minimize.' }],
  jsSolution: (s, t) => {
    const need = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;
    let l = 0, formed = 0, required = Object.keys(need).length;
    const windowCounts = {};
    let minLen = Infinity, minL = 0;
    for (let r = 0; r < s.length; r++) {
      const c = s[r];
      windowCounts[c] = (windowCounts[c] || 0) + 1;
      if (need[c] !== undefined && windowCounts[c] === need[c]) formed++;
      while (formed === required) {
        if (r - l + 1 < minLen) { minLen = r - l + 1; minL = l; }
        const lc = s[l];
        windowCounts[lc]--;
        if (need[lc] !== undefined && windowCounts[lc] < need[lc]) formed--;
        l++;
      }
    }
    return minLen === Infinity ? '' : s.substring(minL, minL + minLen);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ADOBECODEBANC', 'ABC']); cases.push(['a', 'a']); cases.push(['a', 'aa']); cases.push(['abc', 'cba']);
    const mixed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 46; i++) {
      const sLen = randInt(1, 50), tLen = randInt(1, 10);
      cases.push([Array.from({ length: sLen }, () => mixed[randInt(0, 51)]).join(''), Array.from({ length: tLen }, () => mixed[randInt(0, 51)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const sLen = randInt(50, 500), tLen = randInt(1, 20);
      cases.push([Array.from({ length: sLen }, () => mixed[randInt(0, 51)]).join(''), Array.from({ length: tLen }, () => mixed[randInt(0, 51)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const sLen = randInt(500, 5000), tLen = randInt(1, 50);
      cases.push([Array.from({ length: sLen }, () => mixed[randInt(0, 51)]).join(''), Array.from({ length: tLen }, () => mixed[randInt(0, 51)]).join('')]);
    }
    return cases;
  }
},

// 12
{
  slug: 'sliding-window-maximum',
  title: 'Sliding Window Maximum',
  description: 'Given an array nums and a sliding window of size k, return the max sliding window. Each window moves one position to the right.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Deque', 'Monotonic Queue'],
  constraints: '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4, 1 <= k <= nums.length',
  examples: [{ input: '[1,3,-1,-3,5,3,6,7], 3', output: '[3,3,5,5,6,7]', explanation: 'Max of each window of 3.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Deque', content: 'Maintain a decreasing deque of indices.' }],
  jsSolution: (nums, k) => {
    const deq = [], res = [];
    for (let i = 0; i < nums.length; i++) {
      while (deq.length && deq[0] <= i - k) deq.shift();
      while (deq.length && nums[deq[deq.length - 1]] <= nums[i]) deq.pop();
      deq.push(i);
      if (i >= k - 1) res.push(nums[deq[0]]);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, -1, -3, 5, 3, 6, 7], 3]); cases.push([[1], 1]); cases.push([[1, -1], 1]);
    cases.push([[9, 11], 2]); cases.push([[4, -2], 2]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 50); cases.push([randArr(n, -100, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, -1000, 1000), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, -10000, 10000), randInt(1, n)]); }
    return cases;
  }
},

// 13
{
  slug: 'minimum-window-sort-sw',
  title: 'Minimum Swaps to Sort',
  description: 'Given an array of distinct integers, return the minimum number of swaps required to sort the array.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Graph', 'Sorting'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^5, all values distinct',
  examples: [{ input: '[4,3,1,2]', output: '3', explanation: '3 swaps needed.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Cycle Detection', content: 'Find cycles in the permutation. Each cycle of length k needs k-1 swaps.' }],
  jsSolution: (nums) => {
    const sorted = [...nums].map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
    const visited = new Set();
    let swaps = 0;
    for (let i = 0; i < nums.length; i++) {
      if (visited.has(i) || sorted[i][1] === i) continue;
      let cycleSize = 0, j = i;
      while (!visited.has(j)) { visited.add(j); j = sorted[j][1]; cycleSize++; }
      if (cycleSize > 0) swaps += cycleSize - 1;
    }
    return swaps;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 3, 1, 2]]); cases.push([[1, 2, 3]]); cases.push([[2, 1]]); cases.push([[1]]);
    const genPerm = (n) => { const a = Array.from({ length: n }, (_, i) => i + 1); for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    for (let i = 0; i < 46; i++) cases.push([genPerm(randInt(1, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genPerm(randInt(50, 500))]);
    for (let i = 0; i < 50; i++) cases.push([genPerm(randInt(500, 10000))]);
    return cases;
  }
},

// 14
{
  slug: 'count-good-substrings',
  title: 'Count Good Substrings of Length Three',
  description: 'Given a string s, return the number of good substrings of length three. A good substring has all 3 characters distinct.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 100, s consists of lowercase English letters',
  examples: [{ input: '"xyzzaz"', output: '1', explanation: 'Only "xyz" has all distinct chars.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Window of 3', content: 'Check each window of size 3 for distinct characters.' }],
  jsSolution: (s) => {
    let count = 0;
    for (let i = 0; i <= s.length - 3; i++) {
      if (s[i] !== s[i + 1] && s[i + 1] !== s[i + 2] && s[i] !== s[i + 2]) count++;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['xyzzaz']); cases.push(['aababcabc']); cases.push(['a']); cases.push(['ab']); cases.push(['abc']);
    for (let i = 0; i < 45; i++) cases.push([randStr(randInt(1, 20))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(20, 50))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 100))]);
    return cases;
  }
},

// 15
{
  slug: 'max-points-from-cards',
  title: 'Maximum Points You Can Obtain from Cards',
  description: 'There are cardPoints.length cards. You can take k cards from the beginning or the end. Return the maximum score.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Prefix Sum'],
  constraints: '1 <= cardPoints.length <= 10^5, 1 <= cardPoints[i] <= 10^4, 1 <= k <= cardPoints.length',
  examples: [{ input: '[1,2,3,4,5,6,1], 3', output: '12', explanation: 'Take 1,6,5 from right for 12.' }],
  args: [
    { name: 'cardPoints', cpp: 'vector<int>', java: 'int[]', py: 'cardPoints: List[int]', js: 'cardPoints' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Min Window', content: 'Minimize sum of the window of size n-k.' }],
  jsSolution: (cardPoints, k) => {
    const n = cardPoints.length;
    const windowSize = n - k;
    let total = cardPoints.reduce((a, b) => a + b, 0);
    if (windowSize === 0) return total;
    let windowSum = 0, minWin = Infinity;
    for (let i = 0; i < n; i++) {
      windowSum += cardPoints[i];
      if (i >= windowSize) windowSum -= cardPoints[i - windowSize];
      if (i >= windowSize - 1) minWin = Math.min(minWin, windowSum);
    }
    return total - minWin;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6, 1], 3]); cases.push([[2, 2, 2], 2]); cases.push([[9, 7, 7, 9, 7, 7, 9], 7]);
    cases.push([[1], 1]); cases.push([[1, 100, 1], 1]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 50); cases.push([randArr(n, 1, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 1, 1000), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, 1, 10000), randInt(1, n)]); }
    return cases;
  }
},

// 16
{
  slug: 'subarrays-count-k-sw',
  title: 'Subarrays with K Different Integers',
  description: 'Given an integer array nums and an integer k, return the number of good subarrays (contiguous) that have exactly k different integers.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Hash Table', 'Counting'],
  constraints: '1 <= nums.length <= 2 * 10^4, 1 <= nums[i], k <= nums.length',
  examples: [{ input: '[1,2,1,2,3], 2', output: '7', explanation: '7 subarrays with exactly 2 distinct integers.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'At Most K', content: 'exactlyK = atMostK(k) - atMostK(k-1).' }],
  jsSolution: (nums, k) => {
    const atMost = (k) => {
      const count = {};
      let l = 0, res = 0, distinct = 0;
      for (let r = 0; r < nums.length; r++) {
        if (!count[nums[r]] || count[nums[r]] === 0) distinct++;
        count[nums[r]] = (count[nums[r]] || 0) + 1;
        while (distinct > k) { count[nums[l]]--; if (count[nums[l]] === 0) distinct--; l++; }
        res += r - l + 1;
      }
      return res;
    };
    return atMost(k) - atMost(k - 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 1, 2, 3], 2]); cases.push([[1, 2, 1, 3, 4], 3]); cases.push([[1], 1]); cases.push([[1, 1, 1], 1]);
    for (let i = 0; i < 46; i++) { const n = randInt(1, 50); cases.push([randArr(n, 1, Math.min(n, 10)), randInt(1, Math.min(n, 10))]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 1, Math.min(n, 20)), randInt(1, Math.min(n, 20))]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 5000); cases.push([randArr(n, 1, Math.min(n, 50)), randInt(1, Math.min(n, 50))]); }
    return cases;
  }
},

// 17
{
  slug: 'diet-plan-performance',
  title: 'Diet Plan Performance',
  description: 'Given calories array, window size k, lower bound, upper bound: for each window of k days, if total < lower: score--, if total > upper: score++. Return final score.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= k <= calories.length <= 10^5, 0 <= calories[i] <= 20000',
  examples: [{ input: '[1,2,3,4,5], 1, 3, 3', output: '0', explanation: 'Score balances out.' }],
  args: [
    { name: 'calories', cpp: 'vector<int>', java: 'int[]', py: 'calories: List[int]', js: 'calories' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' },
    { name: 'lower', cpp: 'int', java: 'int', py: 'lower: int', js: 'lower' },
    { name: 'upper', cpp: 'int', java: 'int', py: 'upper: int', js: 'upper' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Fixed Window', content: 'Maintain sum of window of size k, compare with bounds.' }],
  jsSolution: (calories, k, lower, upper) => {
    let sum = 0, score = 0;
    for (let i = 0; i < calories.length; i++) {
      sum += calories[i];
      if (i >= k) sum -= calories[i - k];
      if (i >= k - 1) {
        if (sum < lower) score--;
        else if (sum > upper) score++;
      }
    }
    return score;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 1, 3, 3]); cases.push([[3, 2], 2, 0, 1]); cases.push([[6, 5, 0, 0], 2, 1, 5]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 50); const k = randInt(1, n);
      cases.push([randArr(n, 0, 100), k, randInt(0, k * 50), randInt(k * 50, k * 100)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500); const k = randInt(1, n);
      cases.push([randArr(n, 0, 1000), k, randInt(0, k * 500), randInt(k * 500, k * 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 10000); const k = randInt(1, Math.min(n, 100));
      cases.push([randArr(n, 0, 20000), k, randInt(0, k * 10000), randInt(k * 10000, k * 20000)]);
    }
    return cases;
  }
},

// 18
{
  slug: 'count-number-nice-subarrays',
  title: 'Count Number of Nice Subarrays',
  description: 'Given an array of integers nums and an integer k, a subarray is nice if it contains exactly k odd numbers. Return the number of nice subarrays.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Math'],
  constraints: '1 <= nums.length <= 5 * 10^4, 1 <= nums[i] <= 10^5, 1 <= k <= nums.length',
  examples: [{ input: '[1,1,2,1,1], 3', output: '2', explanation: '[1,1,2,1] and [1,2,1,1].' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'At Most K', content: 'atMost(k) - atMost(k-1) gives exactly k.' }],
  jsSolution: (nums, k) => {
    const atMost = (k) => {
      let l = 0, count = 0, res = 0;
      for (let r = 0; r < nums.length; r++) {
        if (nums[r] % 2 === 1) count++;
        while (count > k) { if (nums[l] % 2 === 1) count--; l++; }
        res += r - l + 1;
      }
      return res;
    };
    return atMost(k) - atMost(k - 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 2, 1, 1], 3]); cases.push([[2, 4, 6], 1]); cases.push([[2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2]);
    cases.push([[1], 1]);
    for (let i = 0; i < 46; i++) { const n = randInt(1, 50); cases.push([randArr(n, 1, 20), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 1, 100), randInt(1, Math.min(n, 50))]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 5000); cases.push([randArr(n, 1, 100000), randInt(1, Math.min(n, 100))]); }
    return cases;
  }
},

// 19
{
  slug: 'binary-subarrays-sum-sw',
  title: 'Binary Subarrays With Sum',
  description: 'Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Hash Table', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 3 * 10^4, nums[i] is 0 or 1, 0 <= goal <= nums.length',
  examples: [{ input: '[1,0,1,0,1], 2', output: '4', explanation: '4 subarrays sum to 2.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'goal', cpp: 'int', java: 'int', py: 'goal: int', js: 'goal' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'At Most K', content: 'atMost(goal) - atMost(goal-1).' }],
  jsSolution: (nums, goal) => {
    const atMost = (g) => {
      if (g < 0) return 0;
      let l = 0, sum = 0, res = 0;
      for (let r = 0; r < nums.length; r++) {
        sum += nums[r];
        while (sum > g) sum -= nums[l++];
        res += r - l + 1;
      }
      return res;
    };
    return atMost(goal) - atMost(goal - 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 1, 0, 1], 2]); cases.push([[0, 0, 0, 0, 0], 0]); cases.push([[1, 1, 1], 3]);
    cases.push([[0], 0]); cases.push([[1], 1]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 50); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 30000); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    return cases;
  }
},

// 20
{
  slug: 'number-of-substrings-three-chars',
  title: 'Number of Substrings Containing All Three Characters',
  description: 'Given a string s consisting only of "a", "b", and "c", return the number of substrings that contain at least one occurrence of all three characters.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '3 <= s.length <= 5 * 10^4, s consists of a, b, c',
  examples: [{ input: '"abcabc"', output: '10', explanation: '10 substrings contain a, b, and c.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'For each right, find the leftmost position where all three chars are covered.' }],
  jsSolution: (s) => {
    const count = { a: 0, b: 0, c: 0 };
    let l = 0, res = 0;
    for (let r = 0; r < s.length; r++) {
      count[s[r]]++;
      while (count.a > 0 && count.b > 0 && count.c > 0) {
        res += s.length - r;
        count[s[l]]--;
        l++;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abcabc']); cases.push(['aaacb']); cases.push(['abc']); cases.push(['aaa']);
    const abc = 'abc';
    for (let i = 0; i < 46; i++) cases.push([Array.from({ length: randInt(3, 50) }, () => abc[randInt(0, 2)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(50, 500) }, () => abc[randInt(0, 2)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(500, 50000) }, () => abc[randInt(0, 2)]).join('')]);
    return cases;
  }
},

// 21
{
  slug: 'longest-turbulent-subarray',
  title: 'Longest Turbulent Subarray',
  description: 'Given an integer array arr, return the length of the maximum size turbulent subarray. A subarray is turbulent if the comparison sign flips between each adjacent pair.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Dynamic Programming'],
  constraints: '1 <= arr.length <= 4 * 10^4, 0 <= arr[i] <= 10^9',
  examples: [{ input: '[9,4,2,10,7,8,8,1,9]', output: '5', explanation: '[4,2,10,7,8] is turbulent.' }],
  args: [{ name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Direction', content: 'Track current turbulent length, reset when pattern breaks.' }],
  jsSolution: (arr) => {
    if (arr.length <= 1) return arr.length;
    let maxLen = 1, len = 1;
    for (let i = 1; i < arr.length; i++) {
      const cmp = Math.sign(arr[i] - arr[i - 1]);
      if (cmp === 0) { len = 1; continue; }
      if (i >= 2) {
        const prevCmp = Math.sign(arr[i - 1] - arr[i - 2]);
        if (prevCmp !== 0 && prevCmp !== cmp) len++;
        else len = 2;
      } else len = 2;
      maxLen = Math.max(maxLen, len);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[9, 4, 2, 10, 7, 8, 8, 1, 9]]); cases.push([[4, 8, 12, 16]]); cases.push([[100]]); cases.push([[1, 1]]);
    for (let i = 0; i < 46; i++) cases.push([randArr(randInt(1, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 40000), 0, 1000000000)]);
    return cases;
  }
},

// 22
{
  slug: 'max-average-subarray',
  title: 'Maximum Average Subarray I',
  description: 'Given an integer array nums and an integer k, find the contiguous subarray of length k that has the maximum average value. Return the max average.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= k <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4',
  examples: [{ input: '[1,12,-5,-6,50,3], 4', output: '12.75', explanation: 'Max avg subarray [12,-5,-6,50] = 51/4 = 12.75.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Sliding Sum', content: 'Maintain a sliding sum of size k, track maximum.' }],
  jsSolution: (nums, k) => {
    let sum = 0, maxSum = -Infinity;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i];
      if (i >= k) sum -= nums[i - k];
      if (i >= k - 1) maxSum = Math.max(maxSum, sum);
    }
    return maxSum / k;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 12, -5, -6, 50, 3], 4]); cases.push([[5], 1]); cases.push([[-1], 1]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 50); cases.push([randArr(n, -100, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, -1000, 1000), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, -10000, 10000), randInt(1, n)]); }
    return cases;
  }
},

// 23
{
  slug: 'replace-substring-balanced',
  title: 'Replace the Substring for Balanced String',
  description: 'Given a string s of length n containing only Q, W, E, R, it is balanced when each char appears n/4 times. Find the minimum length substring to replace to make it balanced.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window'],
  constraints: '4 <= s.length <= 10^5, s.length is multiple of 4, s contains only QWER',
  examples: [{ input: '"QWER"', output: '0', explanation: 'Already balanced.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Find min window where remaining chars outside window have count <= n/4.' }],
  jsSolution: (s) => {
    const n = s.length, target = n / 4;
    const count = { Q: 0, W: 0, E: 0, R: 0 };
    for (const c of s) count[c]++;
    if (Object.values(count).every(v => v === target)) return 0;
    let l = 0, minLen = n;
    for (let r = 0; r < n; r++) {
      count[s[r]]--;
      while (Object.values(count).every(v => v <= target)) {
        minLen = Math.min(minLen, r - l + 1);
        count[s[l]]++;
        l++;
      }
    }
    return minLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['QWER']); cases.push(['QQWE']); cases.push(['QQQW']); cases.push(['QQQQ']);
    const qwer = 'QWER';
    for (let i = 0; i < 46; i++) {
      const n = randInt(1, 12) * 4;
      cases.push([Array.from({ length: n }, () => qwer[randInt(0, 3)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(12, 125) * 4;
      cases.push([Array.from({ length: n }, () => qwer[randInt(0, 3)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(125, 2500) * 4;
      cases.push([Array.from({ length: n }, () => qwer[randInt(0, 3)]).join('')]);
    }
    return cases;
  }
},

// 24
{
  slug: 'longest-ones-after-flip-sw',
  title: 'Max Consecutive Ones After Flip',
  description: 'Given a binary array nums, return the maximum number of consecutive 1s if you can flip at most one 0.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1',
  examples: [{ input: '[1,0,1,1,0]', output: '4', explanation: 'Flip the first 0 to get [1,1,1,1,0].' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Window with k=1', content: 'Same as max consecutive ones III with k=1.' }],
  jsSolution: (nums) => {
    let l = 0, zeros = 0, maxLen = 0;
    for (let r = 0; r < nums.length; r++) {
      if (nums[r] === 0) zeros++;
      while (zeros > 1) { if (nums[l] === 0) zeros--; l++; }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 1, 1, 0]]); cases.push([[1, 1, 1, 1]]); cases.push([[0, 0, 0]]); cases.push([[0]]); cases.push([[1]]);
    for (let i = 0; i < 45; i++) cases.push([randArr(randInt(1, 50), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 100000), 0, 1)]);
    return cases;
  }
},

// 25
{
  slug: 'substring-with-concat-all-words',
  title: 'Substring with Concatenation of All Words',
  description: 'Given a string s and an array of strings words (all same length), find all starting indices of substrings in s that are a concatenation of each word in words exactly once in any order.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 10^4, 1 <= words.length <= 5000, 1 <= words[i].length <= 30',
  examples: [{ input: '"barfoothefoobarman", ["foo","bar"]', output: '[0,9]', explanation: '"barfoo" at 0 and "foobar" at 9.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'words', cpp: 'vector<string>', java: 'String[]', py: 'words: List[str]', js: 'words' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Sliding Window per Offset', content: 'For each starting offset (0..wordLen-1), slide a window of word-sized chunks.' }],
  jsSolution: (s, words) => {
    if (!words.length || !s.length) return [];
    const wLen = words[0].length, wCount = words.length, totalLen = wLen * wCount;
    const wordFreq = {};
    for (const w of words) wordFreq[w] = (wordFreq[w] || 0) + 1;
    const result = [];
    for (let i = 0; i <= s.length - totalLen; i++) {
      const seen = {};
      let j = 0;
      for (; j < wCount; j++) {
        const word = s.substring(i + j * wLen, i + (j + 1) * wLen);
        if (!wordFreq[word]) break;
        seen[word] = (seen[word] || 0) + 1;
        if (seen[word] > wordFreq[word]) break;
      }
      if (j === wCount) result.push(i);
    }
    return result;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['barfoothefoobarman', ['foo', 'bar']]); cases.push(['wordgoodgoodgoodbestword', ['word', 'good', 'best', 'word']]);
    cases.push(['a', ['a']]); cases.push(['aaa', ['a', 'a']]);
    for (let i = 0; i < 46; i++) {
      const wLen = randInt(2, 4), wCount = randInt(1, 3);
      const ws = Array.from({ length: wCount }, () => randStr(wLen));
      const sLen = randInt(wLen * wCount, wLen * wCount + 20);
      cases.push([randStr(sLen), ws]);
    }
    for (let i = 0; i < 50; i++) {
      const wLen = randInt(2, 5), wCount = randInt(1, 5);
      const ws = Array.from({ length: wCount }, () => randStr(wLen));
      const sLen = randInt(wLen * wCount, 200);
      cases.push([randStr(sLen), ws]);
    }
    for (let i = 0; i < 50; i++) {
      const wLen = randInt(2, 5), wCount = randInt(1, 5);
      const ws = Array.from({ length: wCount }, () => randStr(wLen));
      const sLen = randInt(200, 1000);
      cases.push([randStr(sLen), ws]);
    }
    return cases;
  }
}

];

export default problems;
