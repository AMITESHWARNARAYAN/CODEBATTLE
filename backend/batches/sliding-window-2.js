// Sliding Window — Batch 2 (25 more problems, #26–50)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 26
{
  slug: 'longest-ones-iii',
  title: 'Max Consecutive Ones III',
  description: 'Given a binary array nums and an integer k, return the maximum number of consecutive 1\'s in the array if you can flip at most k 0\'s.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1, 0 <= k <= nums.length',
  examples: [{ input: '[1,1,1,0,0,0,1,1,1,1,0], 2', output: '6', explanation: 'Flip two zeros to get [1,1,1,0,0,1,1,1,1,1,1].' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Expand right. If zeros in window exceed k, shrink left.' }],
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
    cases.push([[0], 0]); cases.push([[1], 0]); cases.push([[0], 1]);
    for (let i = 0; i < 45; i++) { const n = randInt(1, 50); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randArr(n, 0, 1), randInt(0, 100)]); }
    return cases;
  }
},

// 27
{
  slug: 'longest-ones-after-deleting',
  title: 'Longest Subarray of 1\'s After Deleting One Element',
  description: 'Given a binary array nums, you must delete one element from it. Return the size of the longest remaining subarray containing only 1\'s.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1',
  examples: [{ input: '[1,1,0,1]', output: '3', explanation: 'Delete 0 at index 2 to get [1,1,1] of length 3.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Max Consecutive Ones III', content: 'This is equivalent to Max Consecutive Ones III with k=1, but you must delete exactly one element, so length is windowSize - 1.' }],
  jsSolution: (nums) => {
    let l = 0, zeros = 0, maxLen = 0;
    for (let r = 0; r < nums.length; r++) {
      if (nums[r] === 0) zeros++;
      while (zeros > 1) { if (nums[l] === 0) zeros--; l++; }
      maxLen = Math.max(maxLen, r - l);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 0, 1]]); cases.push([[0, 1, 1, 1, 0, 1, 1, 0, 1]]); cases.push([[1, 1, 1]]);
    cases.push([[0]]); cases.push([[1]]); cases.push([[0, 0, 0]]);
    for (let i = 0; i < 44; i++) cases.push([randArr(randInt(1, 50), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 1)]);
    return cases;
  }
},

// 28
{
  slug: 'max-erasure-value',
  title: 'Maximum Erasure Value',
  description: 'Given an array of positive integers nums, you want to erase a subarray containing unique elements. Return the maximum sum of elements among all unique subarrays.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^4',
  examples: [{ input: '[4,2,4,5,6]', output: '17', explanation: 'Optimal subarray is [2,4,5,6] with sum 17.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window + Set', content: 'Expand right, adding elements to set. If duplicate, shrink left.' }],
  jsSolution: (nums) => {
    const set = new Set();
    let l = 0, sum = 0, maxSum = 0;
    for (let r = 0; r < nums.length; r++) {
      while (set.has(nums[r])) { set.delete(nums[l]); sum -= nums[l]; l++; }
      set.add(nums[r]);
      sum += nums[r];
      maxSum = Math.max(maxSum, sum);
    }
    return maxSum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 4, 5, 6]]); cases.push([[5, 2, 1, 2, 5, 2, 1, 2, 5]]); cases.push([[10]]); cases.push([[1, 2, 3, 4, 5]]);
    for (let i = 0; i < 46; i++) cases.push([randArr(randInt(1, 50), 1, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 1, 1000)]);
    return cases;
  }
},

// 29
{
  slug: 'min-operations-reduce-x',
  title: 'Minimum Operations to Reduce X to Zero',
  description: 'Given an integer array nums and an integer x, you can remove elements from the front or back of the array. Find the minimum number of operations to reduce x to exactly 0, or -1 if impossible.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Hash Table', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^4, 1 <= x <= 10^9',
  examples: [{ input: '[1,1,4,2,3], 5', output: '2', explanation: 'Remove 3 and 2 from back (total sum 5) in 2 operations.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Invert the Problem', content: 'Find the longest subarray whose sum equals totalSum - x.' }],
  jsSolution: (nums, x) => {
    const total = nums.reduce((a, b) => a + b, 0);
    const target = total - x;
    if (target < 0) return -1;
    if (target === 0) return nums.length;
    let l = 0, sum = 0, maxLen = -1;
    for (let r = 0; r < nums.length; r++) {
      sum += nums[r];
      while (sum > target) sum -= nums[l++];
      if (sum === target) maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen === -1 ? -1 : nums.length - maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 4, 2, 3], 5]); cases.push([[5, 6, 7, 8, 9], 4]); cases.push([[3, 2, 20, 1, 1, 3], 10]);
    cases.push([[1], 1]); cases.push([[1], 2]);
    for (let i = 0; i < 45; i++) {
      const arr = randArr(randInt(1, 50), 1, 20);
      cases.push([arr, randInt(1, arr.reduce((a, b) => a + b, 0) + 5)]);
    }
    for (let i = 0; i < 50; i++) {
      const arr = randArr(randInt(50, 500), 1, 50);
      cases.push([arr, randInt(1, arr.reduce((a, b) => a + b, 0))]);
    }
    for (let i = 0; i < 50; i++) {
      const arr = randArr(randInt(500, 5000), 1, 100);
      cases.push([arr, randInt(1, arr.reduce((a, b) => a + b, 0))]);
    }
    return cases;
  }
},

// 30
{
  slug: 'longest-substring-two-distinct',
  title: 'Longest Substring with At Most Two Distinct Characters',
  description: 'Given a string s, return the length of the longest substring that contains at most two distinct characters.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 10^5',
  examples: [{ input: '"eceba"', output: '3', explanation: '"ece" has length 3.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Maintain count of chars. Shrink left when unique count > 2.' }],
  jsSolution: (s) => {
    const map = {};
    let l = 0, maxLen = 0, distinct = 0;
    for (let r = 0; r < s.length; r++) {
      if (!map[s[r]]) distinct++;
      map[s[r]] = (map[s[r]] || 0) + 1;
      while (distinct > 2) {
        map[s[l]]--;
        if (map[s[l]] === 0) { delete map[s[l]]; distinct--; }
        l++;
      }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['eceba']); cases.push(['ccaabbb']); cases.push(['a']); cases.push(['ab']); cases.push(['abc']);
    for (let i = 0; i < 45; i++) cases.push([randStr(randInt(1, 50), 'abc')]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500), 'abcdef')]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 5000), 'abcdefghijklmnopqrstuvwxyz')]);
    return cases;
  }
},

// 31
{
  slug: 'max-freq-substring',
  title: 'Maximum Number of Occurrences of a Substring',
  description: 'Given a string s, return the maximum number of occurrences of any substring under constraints: max unique characters <= maxLetters, substring size is between minSize and maxSize.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 10^5, 1 <= maxLetters <= 26, 1 <= minSize <= maxSize <= 26',
  examples: [{ input: '"aababcaab", 2, 3, 4', output: '2', explanation: '"aab" occurs twice with unique chars <= 2.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'maxLetters', cpp: 'int', java: 'int', py: 'maxLetters: int', js: 'maxLetters' },
    { name: 'minSize', cpp: 'int', java: 'int', py: 'minSize: int', js: 'minSize' },
    { name: 'maxSize', cpp: 'int', java: 'int', py: 'maxSize: int', js: 'maxSize' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Min Size Rule', content: 'Any substring of size > minSize that occurs multiple times must have its prefix of size minSize also occur at least as many times. Thus, we only need to count substrings of size minSize.' }],
  jsSolution: (s, maxLetters, minSize, maxSize) => {
    const counts = {};
    let maxOccur = 0;
    for (let i = 0; i <= s.length - minSize; i++) {
      const sub = s.substring(i, i + minSize);
      const unique = new Set(sub).size;
      if (unique <= maxLetters) {
        counts[sub] = (counts[sub] || 0) + 1;
        maxOccur = Math.max(maxOccur, counts[sub]);
      }
    }
    return maxOccur;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['aababcaab', 2, 3, 4]); cases.push(['aaaa', 1, 3, 3]); cases.push(['aabcabcab', 2, 2, 3]);
    for (let i = 0; i < 47; i++) {
      const min = randInt(2, 6);
      cases.push([randStr(randInt(10, 50), 'abcde'), randInt(1, 5), min, randInt(min, min + 3)]);
    }
    for (let i = 0; i < 50; i++) {
      const min = randInt(2, 10);
      cases.push([randStr(randInt(50, 500)), randInt(2, 10), min, randInt(min, min + 5)]);
    }
    for (let i = 0; i < 50; i++) {
      const min = randInt(2, 15);
      cases.push([randStr(randInt(500, 5000)), randInt(2, 15), min, randInt(min, min + 5)]);
    }
    return cases;
  }
},

// 32
{
  slug: 'longest-abs-diff-limit',
  title: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit',
  description: 'Given an array of integers nums and an integer limit, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to limit.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Queue', 'Monotonic Queue'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^9, 0 <= limit <= 10^9',
  examples: [{ input: '[8,2,4,7], 4', output: '2', explanation: 'Subarray [2,4] or [4,7] are valid.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'limit', cpp: 'int', java: 'int', py: 'limit: int', js: 'limit' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Monotonic Deque', content: 'Use one increasing and one decreasing deque to maintain min and max of window.' }],
  jsSolution: (nums, limit) => {
    const maxQ = [], minQ = [];
    let l = 0, maxLen = 0;
    for (let r = 0; r < nums.length; r++) {
      while (maxQ.length && nums[maxQ[maxQ.length - 1]] <= nums[r]) maxQ.pop();
      while (minQ.length && nums[minQ[minQ.length - 1]] >= nums[r]) minQ.pop();
      maxQ.push(r); minQ.push(r);
      while (nums[maxQ[0]] - nums[minQ[0]] > limit) {
        l++;
        if (maxQ[0] < l) maxQ.shift();
        if (minQ[0] < l) minQ.shift();
      }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[8, 2, 4, 7], 4]); cases.push([[10, 1, 2, 4, 7, 2], 5]); cases.push([[4, 2, 2, 2, 4, 4, 2, 2], 0]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), 1, 50), randInt(0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 1000), randInt(0, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 1, 100000), randInt(0, 50000)]);
    return cases;
  }
},

// 33
{
  slug: 'k-length-no-repeats',
  title: 'Find K-Length Substrings With No Repeated Characters',
  description: 'Given a string s and an integer k, return the number of substrings of s of length k that have no repeated characters.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 10^5, 1 <= k <= 10^5',
  examples: [{ input: '"havefunonfirsttry", 5', output: '6', explanation: 'Valid substrings: "havef","avefu","vefun","efuno","onfir","nfirs".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Track duplicate counts. Shrink window when duplicates exist or length > k.' }],
  jsSolution: (s, k) => {
    if (k > s.length || k > 26) return 0;
    const map = {};
    let l = 0, duplicates = 0, count = 0;
    for (let r = 0; r < s.length; r++) {
      map[s[r]] = (map[s[r]] || 0) + 1;
      if (map[s[r]] === 2) duplicates++;
      if (r - l + 1 > k) {
        map[s[l]]--;
        if (map[s[l]] === 1) duplicates--;
        l++;
      }
      if (r - l + 1 === k && duplicates === 0) count++;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['havefunonfirsttry', 5]); cases.push(['home', 5]); cases.push(['a', 1]);
    for (let i = 0; i < 47; i++) {
      const s = randStr(randInt(1, 50));
      cases.push([s, randInt(1, s.length + 5)]);
    }
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(50, 500));
      cases.push([s, randInt(1, 30)]);
    }
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(500, 5000));
      cases.push([s, randInt(1, 35)]);
    }
    return cases;
  }
},

// 34
{
  slug: 'count-subarrays-bounds',
  title: 'Count Subarrays With Fixed Bounds',
  description: 'Given an integer array nums and two integers minK and maxK, return the number of subarrays where the minimum value is minK and the maximum value is maxK.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Queue'],
  constraints: '2 <= nums.length <= 10^5, 1 <= nums[i], minK, maxK <= 10^6',
  examples: [{ input: '[1,3,5,2,7,5], 1, 5', output: '2', explanation: 'Valid subarrays: [1,3,5], [1,3,5,2].' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'minK', cpp: 'int', java: 'int', py: 'minK: int', js: 'minK' },
    { name: 'maxK', cpp: 'int', java: 'int', py: 'maxK: int', js: 'maxK' }
  ],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Boundary Tracking', content: 'Track latest positions of values out of bounds, latest minK, and latest maxK.' }],
  jsSolution: (nums, minK, maxK) => {
    let badIdx = -1, minIdx = -1, maxIdx = -1;
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < minK || nums[i] > maxK) badIdx = i;
      if (nums[i] === minK) minIdx = i;
      if (nums[i] === maxK) maxIdx = i;
      count += Math.max(0, Math.min(minIdx, maxIdx) - badIdx);
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 5, 2, 7, 5], 1, 5]); cases.push([[1, 1, 1, 1], 1, 1]);
    for (let i = 0; i < 48; i++) {
      const arr = randArr(randInt(2, 50), 1, 10);
      cases.push([arr, 2, 8]);
    }
    for (let i = 0; i < 50; i++) {
      const arr = randArr(randInt(50, 500), 1, 100);
      cases.push([arr, 10, 80]);
    }
    for (let i = 0; i < 50; i++) {
      const arr = randArr(randInt(500, 5000), 1, 1000);
      cases.push([arr, 100, 800]);
    }
    return cases;
  }
},

// 35
{
  slug: 'number-subarrays-bounded-max',
  title: 'Number of Subarrays with Bounded Maximum',
  description: 'Given an integer array nums and two integers left and right, return the number of contiguous subarrays such that the value of the maximum array element in that subarray is in the range [left, right].',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, 0 <= nums[i] <= 10^9, 0 <= left <= right <= 10^9',
  examples: [{ input: '[2,1,4,3], 2, 3', output: '3', explanation: 'Valid subarrays: [2], [2,1], [3].' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'left', cpp: 'int', java: 'int', py: 'left: int', js: 'left' },
    { name: 'right', cpp: 'int', java: 'int', py: 'right: int', js: 'right' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count Helper', content: 'Count(max <= right) - Count(max < left).' }],
  jsSolution: (nums, left, right) => {
    const count = (bound) => {
      let ans = 0, cur = 0;
      for (const x of nums) {
        cur = x <= bound ? cur + 1 : 0;
        ans += cur;
      }
      return ans;
    };
    return count(right) - count(left - 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 4, 3], 2, 3]); cases.push([[2, 9, 2, 5, 6], 2, 8]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(1, 50), 1, 20), 5, 15]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 100), 20, 80]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 1, 100000), 2000, 80000]);
    return cases;
  }
},

// 36
{
  slug: 'max-consecutive-answers',
  title: 'Maximize the Confusion of an Exam',
  description: 'Given a string answerKey where answerKey[i] is "T" or "F", you can flip at most k answers. Return the maximum number of consecutive same answers.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window'],
  constraints: '1 <= answerKey.length <= 5 * 10^4, 0 <= k <= answerKey.length',
  examples: [{ input: '"TTFF", 2', output: '4', explanation: 'Flip both "F"s to get "TTTT".' }],
  args: [
    { name: 'answerKey', cpp: 'string', java: 'String', py: 'answerKey: str', js: 'answerKey' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Two Passes or Max', content: 'Run sliding window to find max consecutive "T"s with k flips, and max "F"s with k flips.' }],
  jsSolution: (answerKey, k) => {
    const maxConsecutive = (target) => {
      let l = 0, diff = 0, maxLen = 0;
      for (let r = 0; r < answerKey.length; r++) {
        if (answerKey[r] !== target) diff++;
        while (diff > k) {
          if (answerKey[l] !== target) diff--;
          l++;
        }
        maxLen = Math.max(maxLen, r - l + 1);
      }
      return maxLen;
    };
    return Math.max(maxConsecutive('T'), maxConsecutive('F'));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['TTFF', 2]); cases.push(['TFFT', 1]); cases.push(['TTFTTFTT', 1]);
    const tf = 'TF';
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 50);
      cases.push([Array.from({ length: n }, () => tf[randInt(0, 1)]).join(''), randInt(0, n)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500);
      cases.push([Array.from({ length: n }, () => tf[randInt(0, 1)]).join(''), randInt(0, n)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 5000);
      cases.push([Array.from({ length: n }, () => tf[randInt(0, 1)]).join(''), randInt(0, 200)]);
    }
    return cases;
  }
},

// 37
{
  slug: 'longest-nice-substring',
  title: 'Longest Nice Substring',
  description: 'A string is nice if for every letter it contains, both its uppercase and lowercase are present. Given s, return the longest nice substring.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Divide and Conquer'],
  constraints: '1 <= s.length <= 100, s consists of uppercase and lowercase English letters',
  examples: [{ input: '"YazaAay"', output: '"aAa"', explanation: '"aAa" is nice because "a" and "A" are both in it.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Divide and Conquer', content: 'Find a character that violates the condition, split by that character, recurse.' }],
  jsSolution: (s) => {
    const solve = (str) => {
      if (str.length < 2) return '';
      const set = new Set(str);
      for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (!set.has(c.toLowerCase()) || !set.has(c.toUpperCase())) {
          const s1 = solve(str.substring(0, i));
          const s2 = solve(str.substring(i + 1));
          return s1.length >= s2.length ? s1 : s2;
        }
      }
      return str;
    };
    return solve(s);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['YazaAay']); cases.push(['Bb']); cases.push(['c']); cases.push(['dD']);
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 46; i++) cases.push([randStr(randInt(1, 20), letters)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(20, 50), letters)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 100), letters)]);
    return cases;
  }
},

// 38
{
  slug: 'substring-contain-all-chars',
  title: 'Shortest Substring Containing Alphabet',
  description: 'Given a lowercase string s, find the minimum length of a substring containing all characters from a to z. If none, return -1.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= s.length <= 10^5',
  examples: [{ input: '"abcdefghijklmnopqrstuvwxyz"', output: '26', explanation: 'The full alphabet itself.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'All Characters', content: 'Minimum window substring where target has 1 of each letter from a to z.' }],
  jsSolution: (s) => {
    const map = {};
    let distinct = 0, l = 0, minLen = Infinity;
    for (let r = 0; r < s.length; r++) {
      if (!map[s[r]]) distinct++;
      map[s[r]] = (map[s[r]] || 0) + 1;
      while (distinct === 26) {
        minLen = Math.min(minLen, r - l + 1);
        map[s[l]]--;
        if (map[s[l]] === 0) { delete map[s[l]]; distinct--; }
        l++;
      }
    }
    return minLen === Infinity ? -1 : minLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abcdefghijklmnopqrstuvwxyz']); cases.push(['abcdefghijklmnopqrstuvwxy']); cases.push(['a']);
    for (let i = 0; i < 47; i++) {
      const s = randStr(randInt(20, 60)) + 'abcdefghijklmnopqrstuvwxyz';
      const arr = s.split('');
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr.join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(50, 500)) + 'abcdefghijklmnopqrstuvwxyz';
      const arr = s.split('');
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr.join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const s = randStr(randInt(500, 5000)) + 'abcdefghijklmnopqrstuvwxyz';
      const arr = s.split('');
      for (let j = arr.length - 1; j > 0; j--) { const k = randInt(0, j); [arr[j], arr[k]] = [arr[k], arr[j]]; }
      cases.push([arr.join('')]);
    }
    return cases;
  }
},

// 39
{
  slug: 'max-sum-distinct-k',
  title: 'Maximum Sum of Distinct Subarrays With Length K',
  description: 'Given an integer array nums and an integer k, return the maximum subarray sum of all the subarrays of nums that meet the conditions: length is k, and all elements are distinct. If no such subarray exists, return 0.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Hash Table'],
  constraints: '1 <= k <= nums.length <= 10^5, 1 <= nums[i] <= 10^5',
  examples: [{ input: '[1,5,4,2,9,9,9], 3', output: '15', explanation: 'Subarray [5,4,2] sum is 11, [4,2,9] sum is 15.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Fixed Window Map', content: 'Track duplicate count and sum in fixed window of size k.' }],
  jsSolution: (nums, k) => {
    const map = {};
    let sum = 0, maxSum = 0, duplicates = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i];
      map[nums[i]] = (map[nums[i]] || 0) + 1;
      if (map[nums[i]] === 2) duplicates++;
      if (i >= k) {
        const out = nums[i - k];
        sum -= out;
        map[out]--;
        if (map[out] === 1) duplicates--;
      }
      if (i >= k - 1 && duplicates === 0) maxSum = Math.max(maxSum, sum);
    }
    return maxSum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 5, 4, 2, 9, 9, 9], 3]); cases.push([[4, 4, 4], 3]); cases.push([[1, 2, 3], 3]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 50); cases.push([randArr(n, 1, 20), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 1, 100), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 5000); cases.push([randArr(n, 1, 1000), randInt(1, n)]); }
    return cases;
  }
},

// 40
{
  slug: 'frequency-of-most-freq',
  title: 'Frequency of the Most Frequent Element',
  description: 'Given an array nums and an integer k, you can increment any element at most k times. Return the maximum possible frequency of an element after at most k operations.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Sorting', 'Binary Search'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i], k <= 10^5',
  examples: [{ input: '[1,2,4], 5', output: '3', explanation: 'Increment 1 and 2 to 4 to get frequency 3.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort + Window', content: 'Sort the array. A window [l, r] is valid if nums[r]*(r-l+1) - windowSum <= k.' }],
  jsSolution: (nums, k) => {
    nums.sort((a, b) => a - b);
    let l = 0, sum = 0, maxF = 0;
    for (let r = 0; r < nums.length; r++) {
      sum += nums[r];
      while (nums[r] * (r - l + 1) - sum > k) sum -= nums[l++];
      maxF = Math.max(maxF, r - l + 1);
    }
    return maxF;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 4], 5]); cases.push([[1, 4, 8, 13], 5]); cases.push([[3, 9, 6], 2]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 50); cases.push([randArr(n, 1, 50), randInt(0, 100)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 1, 1000), randInt(0, 1000)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 5000); cases.push([randArr(n, 1, 10000), randInt(0, 50000)]); }
    return cases;
  }
},

// 41
{
  slug: 'min-swaps-group-ones',
  title: 'Minimum Swaps to Group All 1\'s Together',
  description: 'Given a binary array data, return the minimum number of swaps required to group all 1\'s present in the array together in any place in the array.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= data.length <= 10^5, data[i] is 0 or 1',
  examples: [{ input: '[1,0,1,0,1]', output: '1', explanation: 'Group ones to get [0,1,1,1,0] or similar.' }],
  args: [{ name: 'data', cpp: 'vector<int>', java: 'int[]', py: 'data: List[int]', js: 'data' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Count Window Size', content: 'Count total 1\'s in array. Slide a window of that size, find the one with maximum 1\'s. Min swaps = total 1\'s - max 1\'s in window.' }],
  jsSolution: (data) => {
    const totalOnes = data.reduce((a, b) => a + b, 0);
    if (totalOnes <= 1) return 0;
    let ones = 0, maxOnes = 0;
    for (let i = 0; i < data.length; i++) {
      ones += data[i];
      if (i >= totalOnes) ones -= data[i - totalOnes];
      if (i >= totalOnes - 1) maxOnes = Math.max(maxOnes, ones);
    }
    return totalOnes - maxOnes;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 1, 0, 1]]); cases.push([[0, 0, 0, 1, 0]]); cases.push([[1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 1)]);
    return cases;
  }
},

// 42
{
  slug: 'min-swaps-group-ones-ii',
  title: 'Minimum Swaps to Group All 1\'s Together II',
  description: 'Given a circular binary array nums, return the minimum number of swaps required to group all 1\'s present in the array together.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1',
  examples: [{ input: '[0,1,0,1,1,0,0]', output: '1', explanation: 'One swap groups all 1s.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Circular Extension', content: 'Same as min swaps to group all 1\'s, but extend the array circularly (nums + nums).' }],
  jsSolution: (nums) => {
    const totalOnes = nums.reduce((a, b) => a + b, 0);
    if (totalOnes <= 1) return 0;
    const extended = [...nums, ...nums];
    let ones = 0, maxOnes = 0;
    for (let i = 0; i < extended.length; i++) {
      ones += extended[i];
      if (i >= totalOnes) ones -= extended[i - totalOnes];
      if (i >= totalOnes - 1) maxOnes = Math.max(maxOnes, ones);
    }
    return totalOnes - Math.min(totalOnes, maxOnes);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 1, 0, 1, 1, 0, 0]]); cases.push([[0, 1, 1, 1, 0, 0, 1, 1, 0]]); cases.push([[1, 1, 0, 0, 1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 0, 1)]);
    return cases;
  }
},

// 43
{
  slug: 'longest-subarray-ones',
  title: 'Longest Subarray of 1\'s After Deleting At Most K Elements',
  description: 'Given an array nums containing only 0\'s and 1\'s, and an integer k, return the maximum number of consecutive 1\'s in the array if you can delete at most k elements.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1, 0 <= k <= nums.length',
  examples: [{ input: '[1,1,0,0,1,1,1,0,1], 1', output: '4', explanation: 'Delete 0 at index 7 to get length 4.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Equivalent Problem', content: 'Deleting at most k elements is equivalent to flipping at most k zeros to ones, return the number of ones.' }],
  jsSolution: (nums, k) => {
    let l = 0, zeros = 0, maxLen = 0;
    for (let r = 0; r < nums.length; r++) {
      if (nums[r] === 0) zeros++;
      while (zeros > k) { if (nums[l] === 0) zeros--; l++; }
      maxLen = Math.max(maxLen, r - l + 1 - zeros);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 0, 0, 1, 1, 1, 0, 1], 1]); cases.push([[0, 0, 0], 2]); cases.push([[1, 1, 1], 0]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 50); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randArr(n, 0, 1), randInt(0, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 5000); cases.push([randArr(n, 0, 1), randInt(0, 100)]); }
    return cases;
  }
},

// 44
{
  slug: 'max-consecutive-ones-ii',
  title: 'Max Consecutive Ones II',
  description: 'Given a binary array nums, return the maximum number of consecutive 1\'s in the array if you can flip at most one 0.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window'],
  constraints: '1 <= nums.length <= 10^5, nums[i] is 0 or 1',
  examples: [{ input: '[1,0,1,1,0]', output: '4', explanation: 'Flip the 0 at index 1 to get [1,1,1,1,0] of length 4.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Max Consecutive Ones III with k=1', content: 'Implement window where at most 1 zero is allowed.' }],
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
    cases.push([[1, 0, 1, 1, 0]]); cases.push([[1, 1, 1, 1]]); cases.push([[0, 0, 0]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 0, 1)]);
    return cases;
  }
},

// 45
{
  slug: 'find-k-closest-elements-sw',
  title: 'Find K Closest Elements (Sliding Window)',
  description: 'Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array. The result should also be sorted in ascending order.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['Array', 'Two Pointers', 'Binary Search', 'Sliding Window'],
  constraints: '1 <= k <= arr.length <= 10^4, arr is sorted, -10^4 <= arr[i], x <= 10^4',
  examples: [{ input: '[1,2,3,4,5], 4, 3', output: '[1,2,3,4]', explanation: 'Four closest to 3 are [1,2,3,4].' }],
  args: [
    { name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' },
    { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Two Pointers', content: 'Since the array is sorted, the k closest elements must form a contiguous subarray. Eliminate elements from the edges.' }],
  jsSolution: (arr, k, x) => {
    let l = 0, r = arr.length - 1;
    while (r - l >= k) {
      if (Math.abs(arr[l] - x) <= Math.abs(arr[r] - x)) r--;
      else l++;
    }
    return arr.slice(l, r + 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 4, 3]); cases.push([[1, 2, 3, 4, 5], 4, -1]);
    for (let i = 0; i < 48; i++) {
      const n = randInt(1, 50);
      cases.push([randArr(n, -100, 100).sort((a, b) => a - b), randInt(1, n), randInt(-150, 150)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500);
      cases.push([randArr(n, -1000, 1000).sort((a, b) => a - b), randInt(1, n), randInt(-1200, 1200)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 10000);
      cases.push([randArr(n, -10000, 10000).sort((a, b) => a - b), randInt(1, n), randInt(-12000, 12000)]);
    }
    return cases;
  }
},

// 46
{
  slug: 'min-window-subsequence',
  title: 'Minimum Window Subsequence',
  description: 'Given strings s1 and s2, return the minimum contiguous substring of s1 such that s2 is a subsequence of this substring.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Dynamic Programming'],
  constraints: '1 <= s1.length <= 2000, 1 <= s2.length <= 100',
  examples: [{ input: '"abcdebdde", "bde"', output: '"bcde"', explanation: '"bcde" has "bde" as subsequence.' }],
  args: [
    { name: 's1', cpp: 'string', java: 'String', py: 's1: str', js: 's1' },
    { name: 's2', cpp: 'string', java: 'String', py: 's2: str', js: 's2' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Two Pointers Match', content: 'Find a matching end point. Then walk backwards to find the optimal start point.' }],
  jsSolution: (s1, s2) => {
    let minLen = Infinity, startIdx = -1;
    let i = 0, j = 0;
    while (i < s1.length) {
      if (s1[i] === s2[j]) {
        j++;
        if (j === s2.length) {
          let end = i;
          j--;
          while (j >= 0) {
            if (s1[i] === s2[j]) j--;
            i--;
          }
          i++; j++;
          if (end - i + 1 < minLen) {
            minLen = end - i + 1;
            startIdx = i;
          }
        }
      }
      i++;
    }
    return startIdx === -1 ? '' : s1.substring(startIdx, startIdx + minLen);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abcdebdde', 'bde']); cases.push(['a', 'a']); cases.push(['a', 'b']);
    for (let i = 0; i < 47; i++) cases.push([randStr(randInt(1, 50)), randStr(randInt(1, 5))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500)), randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 2000)), randStr(randInt(1, 20))]);
    return cases;
  }
},

// 47
{
  slug: 'count-subarrays-score-less-k',
  title: 'Count Subarrays With Score Less Than K',
  description: 'The score of a subarray is defined as the product of its sum and its length. Given a positive integer array nums and an integer k, return the number of non-empty subarrays whose score is strictly less than k.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['Array', 'Sliding Window', 'Prefix Sum'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^5, 1 <= k <= 10^15',
  examples: [{ input: '[2,1,4,3,5], 10', output: '6', explanation: '6 subarrays have score < 10.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'long long', java: 'long', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Sliding Window', content: 'Expand right. Shrink left when sum * len >= k.' }],
  jsSolution: (nums, k) => {
    let l = 0, sum = 0, count = 0;
    for (let r = 0; r < nums.length; r++) {
      sum += nums[r];
      while (sum * (r - l + 1) >= k) sum -= nums[l++];
      count += r - l + 1;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 4, 3, 5], 10]); cases.push([[1, 1, 1], 5]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(1, 50), 1, 10), randInt(1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 50), randInt(100, 100000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 1, 100), randInt(10000, 10000000)]);
    return cases;
  }
},

// 48
{
  slug: 'longest-substring-k-repeating',
  title: 'Longest Substring with At Least K Repeating Characters',
  description: 'Given a string s and an integer k, return the length of the longest substring of s such that the frequency of each character in this substring is >= k.',
  difficulty: 'Hard',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table', 'Divide and Conquer'],
  constraints: '1 <= s.length <= 10^4, 1 <= k <= 10^5',
  examples: [{ input: '"aaabb", 3', output: '3', explanation: '"aaa" is longest valid.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Divide and Conquer', content: 'Find a character whose total count in s is < k. Split s by this character and recurse.' }],
  jsSolution: (s, k) => {
    const solve = (str) => {
      if (str.length < k) return 0;
      const count = {};
      for (const c of str) count[c] = (count[c] || 0) + 1;
      for (let i = 0; i < str.length; i++) {
        if (count[str[i]] < k) {
          const s1 = solve(str.substring(0, i));
          const s2 = solve(str.substring(i + 1));
          return Math.max(s1, s2);
        }
      }
      return str.length;
    };
    return solve(s);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['aaabb', 3]); cases.push(['ababbc', 2]); cases.push(['a', 2]); cases.push(['a', 1]);
    for (let i = 0; i < 46; i++) cases.push([randStr(randInt(1, 50), 'abc'), randInt(1, 5)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500), 'abcdef'), randInt(1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 2000)), randInt(1, 15)]);
    return cases;
  }
},

// 49
{
  slug: 'max-vowels-k',
  title: 'Maximum Vowels in a Substring of Length K',
  description: 'Given a string s and an integer k, return the maximum number of vowel letters (a, e, i, o, u) in any substring of s with length k.',
  difficulty: 'Easy',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window'],
  constraints: '1 <= s.length <= 10^5, 1 <= k <= s.length',
  examples: [{ input: '"abciiidef", 3', output: '3', explanation: 'Vowels: "iii" has 3.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Fixed Window', content: 'Track vowel count in sliding window of size k.' }],
  jsSolution: (s, k) => {
    const isV = (c) => 'aeiou'.includes(c);
    let count = 0, maxV = 0;
    for (let i = 0; i < s.length; i++) {
      if (isV(s[i])) count++;
      if (i >= k && isV(s[i - k])) count--;
      if (i >= k - 1) maxV = Math.max(maxV, count);
    }
    return maxV;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abciiidef', 3]); cases.push(['aeiou', 2]); cases.push(['leetcode', 3]);
    for (let i = 0; i < 47; i++) { const n = randInt(1, 50); cases.push([randStr(n), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(50, 500); cases.push([randStr(n), randInt(1, n)]); }
    for (let i = 0; i < 50; i++) { const n = randInt(500, 10000); cases.push([randStr(n), randInt(1, n)]); }
    return cases;
  }
},

// 50
{
  slug: 'longest-substring-unique-chars',
  title: 'Longest Substring of Unique Characters',
  description: 'Given a string s, return the length of the longest substring containing only unique characters.',
  difficulty: 'Medium',
  category: 'Sliding Window',
  tags: ['String', 'Sliding Window', 'Hash Table'],
  constraints: '0 <= s.length <= 10^5',
  examples: [{ input: '"abcabcbb"', output: '3', explanation: '"abc" is longest.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Unique Elements', content: 'Track duplicate indices, adjust left pointer.' }],
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
    cases.push(['abcabcbb']); cases.push(['bbbbb']); cases.push(['']);
    for (let i = 0; i < 47; i++) cases.push([randStr(randInt(0, 50))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 5000))]);
    return cases;
  }
}

];

export default problems;
