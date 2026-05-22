// Dynamic Programming — Batch 1 (42 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'house-robber',
  title: 'House Robber',
  description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 400. 0 <= nums[i] <= 400.',
  examples: [{ input: '[1,2,3,1]', output: '4' }, { input: '[2,7,9,3,1]', output: '12' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'State transitions', content: 'For each house i, we can either rob it (adds nums[i] to best of house i-2) or skip it (retains best of house i-1). dp[i] = max(dp[i-1], dp[i-2] + nums[i]).' }],
  jsSolution: (nums) => {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    let prev2 = 0;
    let prev1 = 0;
    for (let i = 0; i < nums.length; i++) {
      const cur = Math.max(prev1, prev2 + nums[i]);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 1]]);
    cases.push([[2, 7, 9, 3, 1]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(1, 10), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), 0, 400)]);
    return cases;
  }
},

// 2
{
  slug: 'house-robber-ii',
  title: 'House Robber II',
  description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 100. 0 <= nums[i] <= 1000.',
  examples: [{ input: '[2,3,2]', output: '3' }, { input: '[1,2,3,1]', output: '4' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Circular houses', content: 'Since house 0 and house n-1 are adjacent, we cannot rob both. Solve the standard House Robber problem twice: once for houses 0 to n-2, and once for houses 1 to n-1, then return the maximum of the two.' }],
  jsSolution: (nums) => {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    const robRange = (start, end) => {
      let prev2 = 0, prev1 = 0;
      for (let i = start; i <= end; i++) {
        const cur = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = cur;
      }
      return prev1;
    };
    return Math.max(robRange(0, nums.length - 2), robRange(1, nums.length - 1));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 3, 2]]);
    cases.push([[1, 2, 3, 1]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(1, 10), 0, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 40), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(40, 100), 0, 500)]);
    return cases;
  }
},

// 3
{
  slug: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters. (e.g., "ace" is a subsequence of "abcde" while "aec" is not).',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= text1.length, text2.length <= 1000. text1 and text2 consist of only lowercase English characters.',
  examples: [{ input: '"abcde", "ace"', output: '3' }, { input: '"abc", "abc"', output: '3' }],
  args: [
    { name: 'text1', cpp: 'string', java: 'String', py: 'text1: str', js: 'text1' },
    { name: 'text2', cpp: 'string', java: 'String', py: 'text2: str', js: 'text2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '2D grid transitions', content: 'If text1[i] == text2[j], dp[i][j] = 1 + dp[i-1][j-1]. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).' }],
  jsSolution: (text1, text2) => {
    const m = text1.length;
    const n = text2.length;
    let dp = Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
      let nextDp = Array(n + 1).fill(0);
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          nextDp[j] = 1 + dp[j - 1];
        } else {
          nextDp[j] = Math.max(dp[j], nextDp[j - 1]);
        }
      }
      dp = nextDp;
    }
    return dp[n];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abcde", "ace"]);
    cases.push(["abc", "abc"]);
    for (let i = 0; i < 48; i++) cases.push([randStr(randInt(1, 10)), randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(10, 40)), randStr(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(40, 100)), randStr(randInt(40, 100))]);
    return cases;
  }
},

// 4
{
  slug: 'edit-distance',
  title: 'Edit Distance',
  description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '0 <= word1.length, word2.length <= 500. word1 and word2 consist of lowercase English letters.',
  examples: [{ input: '"horse", "ros"', output: '3', explanation: 'horse -> rorse (replace \'h\' with \'r\') -> rose (delete \'r\') -> ros (delete \'e\')' }],
  args: [
    { name: 'word1', cpp: 'string', java: 'String', py: 'word1: str', js: 'word1' },
    { name: 'word2', cpp: 'string', java: 'String', py: 'word2: str', js: 'word2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Levenshtein Distance', content: 'If chars match, cost is dp[i-1][j-1]. Otherwise, cost is 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).' }],
  jsSolution: (word1, word2) => {
    const m = word1.length;
    const n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["horse", "ros"]);
    cases.push(["intention", "execution"]);
    for (let i = 0; i < 48; i++) cases.push([randStr(randInt(0, 5)), randStr(randInt(0, 5))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(5, 15)), randStr(randInt(5, 15))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(15, 30)), randStr(randInt(15, 30))]);
    return cases;
  }
},

// 5
{
  slug: 'jump-game',
  title: 'Jump Game',
  description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Greedy'],
  constraints: '1 <= nums.length <= 10^4. 0 <= nums[i] <= 10^5.',
  examples: [{ input: '[2,3,1,1,4]', output: 'true' }, { input: '[3,2,1,0,4]', output: 'false' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Track max reachable index', content: 'Iterate through the array. At each index, if the current index is greater than the max reachable index so far, return false. Otherwise, update max reachable to max(max_reachable, i + nums[i]).' }],
  jsSolution: (nums) => {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
      if (i > maxReach) return false;
      maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 3, 1, 1, 4]]);
    cases.push([[3, 2, 1, 0, 4]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(2, 8), 0, 4)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(8, 25), 0, 5)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(25, 100), 0, 10)]);
    return cases;
  }
},

// 6
{
  slug: 'jump-game-ii',
  title: 'Jump Game II',
  description: 'You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. In other words, if you are at nums[i], you can jump to any nums[i + j] where 0 <= j <= nums[i] and i + j < n. Return the minimum number of jumps to reach nums[n - 1].',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Greedy'],
  constraints: '1 <= nums.length <= 1000. 0 <= nums[i] <= 1000. It is guaranteed that you can reach the last index.',
  examples: [{ input: '[2,3,1,1,4]', output: '2' }, { input: '[2,3,0,1,4]', output: '2' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BFS levels as jumps', content: 'Maintain the current jump range end, the farthest point reachable with one more jump, and the number of jumps. When we reach the end of the current jump range, increment jump and update the range end.' }],
  jsSolution: (nums) => {
    if (nums.length <= 1) return 0;
    let jumps = 0, curEnd = 0, farthest = 0;
    for (let i = 0; i < nums.length - 1; i++) {
      farthest = Math.max(farthest, i + nums[i]);
      if (i === curEnd) {
        jumps++;
        curEnd = farthest;
        if (curEnd >= nums.length - 1) break;
      }
    }
    return jumps;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 3, 1, 1, 4]]);
    cases.push([[2, 3, 0, 1, 4]]);
    
    const gen = (n) => {
      const nums = Array(n).fill(0);
      for (let i = 0; i < n - 1; i++) {
        nums[i] = randInt(1, Math.min(5, n - i - 1));
      }
      nums[n - 1] = 0;
      return [nums];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
},

// 7
{
  slug: 'unique-paths-ii',
  title: 'Unique Paths II',
  description: 'You are given an m x n integer array grid obstacleGrid. There is a robot initially located at the top-left corner (obstacleGrid[0][0]). The robot tries to move to the bottom-right corner (obstacleGrid[m - 1][n - 1]). The robot can only move either down or right at any point in time. An obstacle and space are marked as 1 or 0 respectively in obstacleGrid. A path that the robot takes cannot include any square that is an obstacle. Return the number of possible unique paths that the robot can take to reach the bottom-right corner.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Matrix'],
  constraints: 'm == obstacleGrid.length. n == obstacleGrid[i].length. 1 <= m, n <= 100. obstacleGrid[i][j] is 0 or 1.',
  examples: [{ input: '[[0,0,0],[0,1,0],[0,0,0]]', output: '2' }],
  args: [{ name: 'obstacleGrid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'obstacleGrid: List[List[int]]', js: 'obstacleGrid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Grid boundary handling', content: 'Initialize dp[0][0] = 1 if grid[0][0] == 0. For each cell (i, j), if grid[i][j] == 1, dp[i][j] = 0. Otherwise, dp[i][j] = dp[i-1][j] + dp[i][j-1].' }],
  jsSolution: (obstacleGrid) => {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    if (obstacleGrid[0][0] === 1) return 0;
    
    const dp = Array.from({ length: m }, () => Array(n).fill(0));
    dp[0][0] = 1;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (obstacleGrid[i][j] === 1) {
          dp[i][j] = 0;
          continue;
        }
        if (i > 0) dp[i][j] += dp[i - 1][j];
        if (j > 0) dp[i][j] += dp[i][j - 1];
      }
    }
    return dp[m - 1][n - 1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 0, 0], [0, 1, 0], [0, 0, 0]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.15 ? 1 : 0)
      );
      grid[0][0] = 0;
      grid[r - 1][c - 1] = 0;
      return [grid];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12), randInt(8, 12)));
    return cases;
  }
},

// 8
{
  slug: 'minimum-path-sum',
  title: 'Minimum Path Sum',
  description: 'Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. Note: You can only move either down or right at any point in time.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Matrix'],
  constraints: 'm == grid.length. n == grid[i].length. 1 <= m, n <= 200. 0 <= grid[i][j] <= 200.',
  examples: [{ input: '[[1,3,1],[1,5,1],[4,2,1]]', output: '7' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sum accumulation', content: 'For each cell (i, j), the minimum path sum is grid[i][j] plus the minimum of path sums from above (i-1, j) and left (i, j-1).' }],
  jsSolution: (grid) => {
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array.from({ length: m }, () => Array(n).fill(0));
    dp[0][0] = grid[0][0];
    for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
    for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m - 1][n - 1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 3, 1], [1, 5, 1], [4, 2, 1]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => randArr(c, 0, 10));
      return [grid];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12), randInt(8, 12)));
    return cases;
  }
},

// 9
{
  slug: 'decode-ways',
  title: 'Decode Ways',
  description: 'A message containing letters from A-Z can be encoded into numbers using the mapping A -> "1", B -> "2", ..., Z -> "26". To decode an encoded message, all the digits must be grouped then mapped back into letters. Given a string s containing only digits, return the number of ways to decode it.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= s.length <= 100. s contains only digits and may contain leading zero(es).',
  examples: [{ input: '"12"', output: '2', explanation: 'Could be "AB" (1 2) or "L" (12).' }, { input: '"226"', output: '3', explanation: '"BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '1-step and 2-step DP check', content: 'For index i, we can take a single digit if s[i] != \'0\'. We can take two digits if the value formed by s[i-1] and s[i] is between 10 and 26. Accumulate ways accordingly.' }],
  jsSolution: (s) => {
    if (s.length === 0 || s[0] === '0') return 0;
    const dp = Array(s.length + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    for (let i = 2; i <= s.length; i++) {
      const one = parseInt(s.substring(i - 1, i));
      const two = parseInt(s.substring(i - 2, i));
      if (one >= 1 && one <= 9) dp[i] += dp[i - 1];
      if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[s.length];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["12"]);
    cases.push(["226"]);
    cases.push(["06"]);
    for (let i = 0; i < 47; i++) cases.push([randStr(randInt(1, 8), "0123456789")]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(8, 20), "123456789")]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(20, 40), "0123456789")]);
    return cases;
  }
},

// 10
{
  slug: 'word-break',
  title: 'Word Break',
  description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
  constraints: '1 <= s.length <= 300. 1 <= wordDict.length <= 1000. 1 <= wordDict[i].length <= 20. s and wordDict[i] consist of only lowercase English letters.',
  examples: [{ input: '"leetcode", ["leet","code"]', output: 'true' }, { input: '"applepenapple", ["apple","pen"]', output: 'true' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'wordDict', cpp: 'vector<string>&', java: 'List<String>', py: 'wordDict: List[str]', js: 'wordDict' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Substring checks', content: 'Let dp[i] be true if s[0...i-1] can be segmented. For each i from 1 to n, and each j < i, if dp[j] is true and s[j...i-1] is in wordDict, then dp[i] is true.' }],
  jsSolution: (s, wordDict) => {
    const set = new Set(wordDict);
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] && set.has(s.substring(j, i))) {
          dp[i] = true;
          break;
        }
      }
    }
    return dp[s.length];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["leetcode", ["leet", "code"]]);
    cases.push(["applepenapple", ["apple", "pen"]]);
    
    const gen = (len, solvable) => {
      const words = ["cat", "dog", "sand", "and", "cats", "apple", "pen", "leet", "code"];
      if (solvable) {
        let s = "";
        while (s.length < len) {
          s += words[randInt(0, words.length - 1)];
        }
        return [s, words];
      } else {
        return [randStr(len), words];
      }
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(5, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 50), Math.random() < 0.5));
    return cases;
  }
},

// 11
{
  slug: 'partition-equal-subset-sum',
  title: 'Partition Equal Subset Sum',
  description: 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 200. 1 <= nums[i] <= 100.',
  examples: [{ input: '[1,5,11,5]', output: 'true' }, { input: '[1,2,3,5]', output: 'false' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Target sum subset', content: 'Sum all elements. If sum is odd, partition is impossible. Otherwise, find if there is a subset that sums up to exactly sum / 2 using 0-1 knapsack DP.' }],
  jsSolution: (nums) => {
    let sum = nums.reduce((s, v) => s + v, 0);
    if (sum % 2 !== 0) return false;
    const target = sum / 2;
    const dp = Array(target + 1).fill(false);
    dp[0] = true;
    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      for (let j = target; j >= val; j--) {
        if (dp[j - val]) dp[j] = true;
      }
    }
    return dp[target];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 5, 11, 5]]);
    cases.push([[1, 2, 3, 5]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(2, 6), 1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 15), 1, 25)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(15, 30), 1, 40)]);
    return cases;
  }
},

// 12
{
  slug: 'target-sum',
  title: 'Target Sum',
  description: 'You are given an integer array nums and an integer target. You want to build an expression using all the integers in nums by assigning either a "+" or "-" sign before each integer and concatenate them all to build an expression. Return the number of different expressions that you can build, which evaluates to target.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Backtracking'],
  constraints: '1 <= nums.length <= 20. 0 <= nums[i] <= 1000. -1000 <= target <= 1000.',
  examples: [{ input: '[1,1,1,1,1], 3', output: '5' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Reduce to Subset Sum', content: 'Let P be the subset of positive values, N be the subset of negatives. sum(P) - sum(N) = target. Adding sum(P) + sum(N) = totalSum gives 2 * sum(P) = target + totalSum. Thus, sum(P) = (target + totalSum) / 2.' }],
  jsSolution: (nums, target) => {
    const sum = nums.reduce((s, v) => s + v, 0);
    if (Math.abs(target) > sum || (target + sum) % 2 !== 0) return 0;
    const subTarget = (target + sum) / 2;
    const dp = Array(subTarget + 1).fill(0);
    dp[0] = 1;
    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      for (let j = subTarget; j >= val; j--) {
        dp[j] += dp[j - val];
      }
    }
    return dp[subTarget];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 1, 1, 1], 3]);
    
    const gen = (n) => {
      const nums = randArr(n, 1, 10);
      const sum = nums.reduce((s, v) => s + v, 0);
      const target = randInt(-sum, sum);
      return [nums, target];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 18)));
    return cases;
  }
},

// 13
{
  slug: 'interleaving-string',
  title: 'Interleaving String',
  description: 'Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2. An interleaving of two strings s and t is a configuration where they are divided into non-empty substrings such that s = s1 + s2 + ... + sn, t = t1 + t2 + ... + tm, and the interleaving is s1 + t1 + s2 + t2 + ... or similar, keeping their relative orders intact.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '0 <= s1.length, s2.length <= 100. 0 <= s3.length <= 200. s1, s2, and s3 consist of lowercase English letters.',
  examples: [{ input: '"aabcc", "dbbca", "aadbbcbcac"', output: 'true' }],
  args: [
    { name: 's1', cpp: 'string', java: 'String', py: 's1: str', js: 's1' },
    { name: 's2', cpp: 'string', java: 'String', py: 's2: str', js: 's2' },
    { name: 's3', cpp: 'string', java: 'String', py: 's3: str', js: 's3' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: '2D grid path matching', content: 'Let dp[i][j] represent if s3[0...i+j-1] is formed by an interleaving of s1[0...i-1] and s2[0...j-1].' }],
  jsSolution: (s1, s2, s3) => {
    if (s1.length + s2.length !== s3.length) return false;
    const dp = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(false));
    dp[0][0] = true;
    for (let i = 1; i <= s1.length; i++) {
      dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
    }
    for (let j = 1; j <= s2.length; j++) {
      dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
    }
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        dp[i][j] = (dp[i - 1][j] && s1[i - 1] === s3[i + j - 1]) ||
                    (dp[i][j - 1] && s2[j - 1] === s3[i + j - 1]);
      }
    }
    return dp[s1.length][s2.length];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["aabcc", "dbbca", "aadbbcbcac"]);
    
    const gen = (l1, l2, match) => {
      const s1 = randStr(l1);
      const s2 = randStr(l2);
      if (match) {
        let i = 0, j = 0;
        let s3 = "";
        while (i < l1 || j < l2) {
          if (i < l1 && (j === l2 || Math.random() < 0.5)) {
            s3 += s1[i++];
          } else {
            s3 += s2[j++];
          }
        }
        return [s1, s2, s3];
      } else {
        return [s1, s2, randStr(l1 + l2)];
      }
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6), randInt(2, 6), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15), randInt(6, 15), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30), randInt(15, 30), Math.random() < 0.5));
    return cases;
  }
},

// 14
{
  slug: 'longest-palindromic-substring',
  title: 'Longest Palindromic Substring',
  description: 'Given a string s, return the longest palindromic substring in s.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= s.length <= 1000. s consists of only digits and English letters.',
  examples: [{ input: '"babad"', output: '"bab"' }, { input: '"cbbd"', output: '"bb"' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Expand around center', content: 'A palindrome can be centered at each character or between two consecutive characters. Expand outwards as long as matching.' }],
  jsSolution: (s) => {
    if (s.length < 1) return "";
    let start = 0, end = 0;
    const expand = (left, right) => {
      while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
      }
      return right - left - 1;
    };
    for (let i = 0; i < s.length; i++) {
      const len1 = expand(i, i);
      const len2 = expand(i, i + 1);
      const len = Math.max(len1, len2);
      if (len > end - start) {
        start = i - Math.floor((len - 1) / 2);
        end = i + Math.floor(len / 2);
      }
    }
    return s.substring(start, end + 1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["babad"]);
    cases.push(["cbbd"]);
    for (let i = 0; i < 48; i++) cases.push([randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(10, 30))]);
    for (let i = 0; i < 50; i++) {
      const pal = randStr(randInt(5, 15));
      const full = randStr(randInt(1, 10)) + pal + [...pal].reverse().join('') + randStr(randInt(1, 10));
      cases.push([full]);
    }
    return cases;
  }
},

// 15
{
  slug: 'palindromic-substrings',
  title: 'Palindromic Substrings',
  description: 'Given a string s, return the number of palindromic substrings in it. A string is a palindrome when it reads the same backward as forward. A substring is a contiguous sequence of characters within the string.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= s.length <= 1000. s consists of lowercase English letters.',
  examples: [{ input: '"abc"', output: '3' }, { input: '"aaa"', output: '6' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Expand around center count', content: 'Similar to finding longest palindrome, count how many valid expansions can be made from each center.' }],
  jsSolution: (s) => {
    let count = 0;
    const expand = (left, right) => {
      while (left >= 0 && right < s.length && s[left] === s[right]) {
        count++;
        left--;
        right++;
      }
    };
    for (let i = 0; i < s.length; i++) {
      expand(i, i);
      expand(i, i + 1);
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abc"]);
    cases.push(["aaa"]);
    for (let i = 0; i < 48; i++) cases.push([randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(10, 30))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(30, 80))]);
    return cases;
  }
},

// 16
{
  slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
  title: 'Best Time to Buy and Sell Stock with Cooldown',
  description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following constraints:\n- After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= prices.length <= 5000. 0 <= prices[i] <= 1000.',
  examples: [{ input: '[1,2,3,0,2]', output: '3', explanation: 'transactions = [buy, sell, cooldown, buy, sell]' }],
  args: [{ name: 'prices', cpp: 'vector<int>&', java: 'int[]', py: 'prices: List[int]', js: 'prices' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'State machine state transitions', content: 'Define three states: held (currently holding a share), sold (just sold a share, entering cooldown), reset (cooldown complete or doing nothing). Work out transitions for each.' }],
  jsSolution: (prices) => {
    if (prices.length === 0) return 0;
    let held = -prices[0];
    let sold = 0;
    let reset = 0;
    for (let i = 1; i < prices.length; i++) {
      const prevSold = sold;
      sold = held + prices[i];
      held = Math.max(held, reset - prices[i]);
      reset = Math.max(reset, prevSold);
    }
    return Math.max(sold, reset);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 0, 2]]);
    cases.push([[1]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(1, 10), 0, 15)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 30), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 80), 0, 500)]);
    return cases;
  }
},

// 17
{
  slug: 'best-time-to-buy-and-sell-stock-with-transaction-fee',
  title: 'Best Time to Buy and Sell Stock with Transaction Fee',
  description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day, and an integer fee representing a transaction fee. Find the maximum profit you can achieve. You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Greedy'],
  constraints: '1 <= prices.length <= 5000. 1 <= prices[i] <= 50000. 0 <= fee <= 50000.',
  examples: [{ input: '[1,3,2,8,4,9], 2', output: '8' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'prices: List[int]', js: 'prices' },
    { name: 'fee', cpp: 'int', java: 'int', py: 'fee: int', js: 'fee' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Hold and Free state tracking', content: 'Define two states: hold (maximum profit holding a stock) and free (maximum profit not holding a stock). hold = max(hold, free - price). free = max(free, hold + price - fee).' }],
  jsSolution: (prices, fee) => {
    if (prices.length === 0) return 0;
    let hold = -prices[0];
    let free = 0;
    for (let i = 1; i < prices.length; i++) {
      const prevHold = hold;
      hold = Math.max(hold, free - prices[i]);
      free = Math.max(free, prevHold + prices[i] - fee);
    }
    return free;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 2, 8, 4, 9], 2]);
    
    const gen = (n) => {
      const prices = randArr(n, 10, 100);
      const fee = randInt(1, 10);
      return [prices, fee];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 30)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(30, 80)));
    return cases;
  }
},

// 18
{
  slug: 'coin-change-ii',
  title: 'Coin Change II',
  description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0. You may assume that you have an infinite number of each kind of coin.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= coins.length <= 300. 1 <= coins[i] <= 5000. 0 <= amount <= 5000.',
  examples: [{ input: '5, [1,2,5]', output: '4' }],
  args: [
    { name: 'amount', cpp: 'int', java: 'int', py: 'amount: int', js: 'amount' },
    { name: 'coins', cpp: 'vector<int>&', java: 'int[]', py: 'coins: List[int]', js: 'coins' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Unbounded knapsack combination count', content: 'For each coin, iterate from coin value to target amount and accumulate ways: dp[j] += dp[j - coin]. dp[0] is initialized to 1.' }],
  jsSolution: (amount, coins) => {
    const dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      for (let j = coin; j <= amount; j++) {
        dp[j] += dp[j - coin];
      }
    }
    return dp[amount];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5, [1, 2, 5]]);
    
    const gen = (maxAmt, coinCount) => {
      const amount = randInt(5, maxAmt);
      const coins = Array.from({ length: coinCount }, () => randInt(1, 10));
      return [amount, [...new Set(coins)].sort((a, b) => a - b)];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(20, 3));
    for (let i = 0; i < 50; i++) cases.push(gen(100, 4));
    for (let i = 0; i < 50; i++) cases.push(gen(200, 5));
    return cases;
  }
},

// 19
{
  slug: 'triangle',
  title: 'Triangle',
  description: 'Given a triangle array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below. More formally, if you are on index i on the current row, you may move to either index i or index i + 1 on the next row.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= triangle.length <= 200. triangle[i].length == i + 1. -10^4 <= triangle[i][j] <= 10^4.',
  examples: [{ input: '[[2],[3,4],[6,5,7],[4,1,8,3]]', output: '11' }],
  args: [{ name: 'triangle', cpp: 'vector<vector<int>>&', java: 'List<List<Integer>>', py: 'triangle: List[List[int]]', js: 'triangle' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bottom-up DP', content: 'Initialize dp to match the bottom row values. Iterate bottom-up: dp[j] = triangle[i][j] + min(dp[j], dp[j+1]).' }],
  jsSolution: (triangle) => {
    const n = triangle.length;
    const dp = [...triangle[n - 1]];
    for (let i = n - 2; i >= 0; i--) {
      for (let j = 0; j <= i; j++) {
        dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
      }
    }
    return dp[0];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]]);
    
    const gen = (rows) => {
      const tri = [];
      for (let i = 0; i < rows; i++) {
        tri.push(randArr(i + 1, -10, 30));
      }
      return [tri];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 15)));
    return cases;
  }
},

// 20
{
  slug: 'maximal-square',
  title: 'Maximal Square',
  description: 'Given an m x n binary matrix filled with 0s and 1s, find the largest square containing only 1s and return its area.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Matrix'],
  constraints: 'm == matrix.length. n == matrix[i].length. 1 <= m, n <= 300. matrix[i][j] is \'0\' or \'1\'.',
  examples: [{ input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: '4' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<char>>&', java: 'char[][]', py: 'matrix: List[List[str]]', js: 'matrix' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Minimum of 3 directions plus 1', content: 'Let dp[i][j] be the side length of the maximal square whose bottom-right corner is at (i, j). If matrix[i][j] is 1, dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).' }],
  jsSolution: (matrix) => {
    if (matrix.length === 0) return 0;
    const m = matrix.length;
    const n = matrix[0].length;
    const dp = Array.from({ length: m }, () => Array(n).fill(0));
    let maxSide = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === '1') {
          if (i === 0 || j === 0) {
            dp[i][j] = 1;
          } else {
            dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
          maxSide = Math.max(maxSide, dp[i][j]);
        }
      }
    }
    return maxSide * maxSide;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]]);
    
    const gen = (r, c) => {
      const mat = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.6 ? "1" : "0")
      );
      return [mat];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12), randInt(8, 12)));
    return cases;
  }
},

// 21
{
  slug: 'combination-sum-iv',
  title: 'Combination Sum IV',
  description: 'Given an array of distinct integers nums and a target integer target, return the number of possible combinations that add up to target. Note that different sequences are counted as different combinations.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 200. 1 <= nums[i] <= 1000. All the elements of nums are unique. 1 <= target <= 1000.',
  examples: [{ input: '[1,2,3], 4', output: '7' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Permutations to Target', content: 'This counts ordered arrangements. Initialize dp[0] = 1. For each sum i from 1 to target, iterate through nums: if i >= num, dp[i] += dp[i - num].' }],
  jsSolution: (nums, target) => {
    const dp = Array(target + 1).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= target; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i >= nums[j]) {
          dp[i] += dp[i - nums[j]];
        }
      }
    }
    return dp[target];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], 4]);
    
    const gen = (targetVal) => {
      const list = randArr(4, 1, 10);
      const unique = [...new Set(list)];
      return [unique, randInt(5, targetVal)];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(15));
    for (let i = 0; i < 50; i++) cases.push(gen(25));
    for (let i = 0; i < 50; i++) cases.push(gen(40));
    return cases;
  }
},

// 22
{
  slug: 'perfect-squares',
  title: 'Perfect Squares',
  description: 'Given an integer n, return the least number of perfect square numbers that sum to n. A perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, 1, 4, 9, and 16 are perfect squares while 3 and 11 are not.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Math', 'Dynamic Programming', 'Breadth-First Search'],
  constraints: '1 <= n <= 10^4',
  examples: [{ input: '12', output: '3', explanation: '12 = 4 + 4 + 4' }, { input: '13', output: '2', explanation: '13 = 4 + 9' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Min square options', content: 'dp[i] = min(dp[i - j*j]) + 1 for all j where j*j <= i.' }],
  jsSolution: (n) => {
    const dp = Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j * j <= i; j++) {
        dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
      }
    }
    return dp[n];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([12]);
    cases.push([13]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(200, 1000)]);
    return cases;
  }
},

// 23
{
  slug: 'number-of-longest-increasing-subsequence',
  title: 'Number of Longest Increasing Subsequence',
  description: 'Given an integer array nums, return the number of longest increasing subsequences. Notice that the sequence has to be strictly increasing.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Segment Tree', 'Binary Indexed Tree'],
  constraints: '1 <= nums.length <= 2000. -10^6 <= nums[i] <= 10^6.',
  examples: [{ input: '[1,3,5,4,7]', output: '2', explanation: 'Two LIS of len 4: [1,3,4,7] and [1,3,5,7].' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Double DP tables', content: 'Use len[i] for LIS length ending at i, and count[i] for number of LIS ending at i. Compare and sum lengths/counts appropriately.' }],
  jsSolution: (nums) => {
    const n = nums.length;
    if (n <= 1) return n;
    const len = Array(n).fill(1);
    const count = Array(n).fill(1);
    let maxLen = 1;
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          if (len[j] + 1 > len[i]) {
            len[i] = len[j] + 1;
            count[i] = count[j];
          } else if (len[j] + 1 === len[i]) {
            count[i] += count[j];
          }
        }
      }
      maxLen = Math.max(maxLen, len[i]);
    }
    let ans = 0;
    for (let i = 0; i < n; i++) {
      if (len[i] === maxLen) ans += count[i];
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 5, 4, 7]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(2, 6), -10, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(6, 20), -20, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), -100, 100)]);
    return cases;
  }
},

// 24
{
  slug: 'partition-to-k-equal-sum-subsets',
  title: 'Partition to K Equal Sum Subsets',
  description: 'Given an integer array nums and an integer k, return true if it is possible to divide this array into k non-empty subsets whose sums are all equal.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Backtracking', 'Bitmask', 'Memoization'],
  constraints: '1 <= k <= nums.length <= 16. 1 <= nums[i] <= 10000. The frequency of each element is in the range [1, 4].',
  examples: [{ input: '[4,3,2,3,5,2,1], 4', output: 'true' }],
  args: [
    { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Bitmask DFS', content: 'Sum up nums. If sum % k != 0, return false. Find subsets summing to sum / k using bitmask DP where state represents which indices are used.' }],
  jsSolution: (nums, k) => {
    const sum = nums.reduce((s, v) => s + v, 0);
    if (sum % k !== 0) return false;
    const target = sum / k;
    const memo = {};
    nums.sort((a, b) => b - a);
    
    const dfs = (mask, curSum) => {
      if (mask === (1 << nums.length) - 1) return true;
      if (memo[mask] !== undefined) return memo[mask];
      for (let i = 0; i < nums.length; i++) {
        if ((mask & (1 << i)) === 0) {
          if (curSum + nums[i] <= target) {
            const nextSum = (curSum + nums[i]) === target ? 0 : curSum + nums[i];
            if (dfs(mask | (1 << i), nextSum)) {
              return memo[mask] = true;
            }
          }
          if (curSum === 0) break; // pruning
        }
      }
      return memo[mask] = false;
    };
    return dfs(0, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 3, 2, 3, 5, 2, 1], 4]);
    
    const gen = (n, k) => {
      const target = randInt(5, 15);
      const nums = [];
      for (let j = 0; j < k; j++) {
        let currentSum = 0;
        while (currentSum < target) {
          const add = randInt(1, Math.min(5, target - currentSum));
          nums.push(add);
          currentSum += add;
        }
      }
      // Shuffle
      return [nums.sort(() => Math.random() - 0.5).slice(0, n), k];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(6, 2));
    for (let i = 0; i < 50; i++) cases.push(gen(8, 3));
    for (let i = 0; i < 50; i++) cases.push(gen(10, 4));
    return cases;
  }
},

// 25
{
  slug: 'out-of-boundary-paths',
  title: 'Out of Boundary Paths',
  description: 'There is an m x n grid with a ball. The ball is initially at the position [startRow, startColumn]. You are allowed to move the ball to one of the four adjacent cells in the grid (possibly out of the grid boundary). You can apply at most maxMove moves to the ball. Given the five integers m, n, maxMove, startRow, startColumn, return the number of paths to move the ball out of the grid boundary. Since the answer can be very large, return it modulo 10^9 + 7.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Dynamic Programming', 'Matrix'],
  constraints: '1 <= m, n <= 50. 0 <= maxMove <= 50. 0 <= startRow < m. 0 <= startColumn < n.',
  examples: [{ input: '2, 2, 2, 0, 0', output: '6' }],
  args: [
    { name: 'm', cpp: 'int', java: 'int', py: 'm: int', js: 'm' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'maxMove', cpp: 'int', java: 'int', py: 'maxMove: int', js: 'maxMove' },
    { name: 'startRow', cpp: 'int', java: 'int', py: 'startRow: int', js: 'startRow' },
    { name: 'startColumn', cpp: 'int', java: 'int', py: 'startColumn: int', js: 'startColumn' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '3D DP transitions', content: 'dp[move][i][j] is the number of ways to reach (i, j) in `move` steps. The moves transition to four neighbors: dp[move][r][c] = sum(dp[move-1][nr][nc]). If neighbor is out of bounds, add to boundary crossing paths count.' }],
  jsSolution: (m, n, maxMove, startRow, startColumn) => {
    const MOD = 1000000007;
    let dp = Array.from({ length: m }, () => Array(n).fill(0));
    dp[startRow][startColumn] = 1;
    let count = 0;
    
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (let move = 1; move <= maxMove; move++) {
      const nextDp = Array.from({ length: m }, () => Array(n).fill(0));
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
          if (dp[r][c] > 0) {
            for (const [dr, dc] of dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
                count = (count + dp[r][c]) % MOD;
              } else {
                nextDp[nr][nc] = (nextDp[nr][nc] + dp[r][c]) % MOD;
              }
            }
          }
        }
      }
      dp = nextDp;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2, 2, 2, 0, 0]);
    cases.push([1, 3, 3, 0, 1]);
    
    const gen = (maxDim, moveLimit) => {
      const r = randInt(1, maxDim);
      const c = randInt(1, maxDim);
      const moves = randInt(0, moveLimit);
      const sr = randInt(0, r - 1);
      const sc = randInt(0, c - 1);
      return [r, c, moves, sr, sc];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(3, 3));
    for (let i = 0; i < 50; i++) cases.push(gen(6, 6));
    for (let i = 0; i < 50; i++) cases.push(gen(12, 10));
    return cases;
  }
},

// 26
{
  slug: 'knight-probability-in-chessboard',
  title: 'Knight Probability in Chessboard',
  description: 'On an n x n chessboard, a knight starts at the cell (row, column) and attempts to make exactly k moves. Return the probability that the knight remains on the board after making k moves. The return value should be parsed as a float.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Dynamic Programming', 'Probability', 'Matrix'],
  constraints: '1 <= n <= 25. 0 <= k <= 100. 0 <= row, column < n.',
  examples: [{ input: '3, 2, 0, 0', output: '0.0625' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' },
    { name: 'row', cpp: 'int', java: 'int', py: 'row: int', js: 'row' },
    { name: 'column', cpp: 'int', java: 'int', py: 'column: int', js: 'column' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Grid transition count', content: 'Track the probability of landing on each cell at step step. A cell (r, c) distributes 1/8 of its probability to its 8 knight moves. Accumulate sum of probabilities on board at step K.' }],
  jsSolution: (n, k, row, column) => {
    let dp = Array.from({ length: n }, () => Array(n).fill(0));
    dp[row][column] = 1.0;
    
    const dirs = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (let step = 0; step < k; step++) {
      const nextDp = Array.from({ length: n }, () => Array(n).fill(0));
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (dp[r][c] > 0) {
            for (const [dr, dc] of dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                nextDp[nr][nc] += dp[r][c] / 8.0;
              }
            }
          }
        }
      }
      dp = nextDp;
    }
    
    let sum = 0.0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        sum += dp[r][c];
      }
    }
    return parseFloat(sum.toFixed(5));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, 2, 0, 0]);
    
    const gen = (maxSize, maxK) => {
      const size = randInt(3, maxSize);
      const moves = randInt(0, maxK);
      const r = randInt(0, size - 1);
      const c = randInt(0, size - 1);
      return [size, moves, r, c];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(4, 3));
    for (let i = 0; i < 50; i++) cases.push(gen(6, 6));
    for (let i = 0; i < 50; i++) cases.push(gen(10, 10));
    return cases;
  }
},

// 27
{
  slug: 'minimum-falling-path-sum',
  title: 'Minimum Falling Path Sum',
  description: 'Given an n x n array of integers matrix, return the minimum sum of any falling path through matrix. A falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right. Specifically, the next element from position (row, col) will be (row + 1, col - 1), (row + 1, col), or (row + 1, col + 1).',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Matrix'],
  constraints: 'n == matrix.length == matrix[i].length. 1 <= n <= 100. -100 <= matrix[i][j] <= 100.',
  examples: [{ input: '[[2,1,3],[6,5,4],[7,8,9]]', output: '13', explanation: 'Optimal path: 1 -> 4 -> 8 (sum 13) or 1 -> 5 -> 7 (sum 13).' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'matrix: List[List[int]]', js: 'matrix' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bottom-up accumulation', content: 'For each cell (i, j) from row 1 to n-1, add the minimum of the three valid upper cells (i-1, j-1), (i-1, j), (i-1, j+1). The final answer is the minimum in the bottom row.' }],
  jsSolution: (matrix) => {
    const n = matrix.length;
    let dp = [...matrix[0]];
    for (let i = 1; i < n; i++) {
      const nextDp = Array(n).fill(0);
      for (let j = 0; j < n; j++) {
        let best = dp[j];
        if (j > 0) best = Math.min(best, dp[j - 1]);
        if (j < n - 1) best = Math.min(best, dp[j + 1]);
        nextDp[j] = matrix[i][j] + best;
      }
      dp = nextDp;
    }
    return Math.min(...dp);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[2, 1, 3], [6, 5, 4], [7, 8, 9]]]);
    
    const gen = (n) => {
      const mat = Array.from({ length: n }, () => randArr(n, -20, 20));
      return [mat];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12)));
    return cases;
  }
},

// 28
{
  slug: 'domino-and-tromino-tiling',
  title: 'Domino and Tromino Tiling',
  description: 'You have two types of tiles: a 2 x 1 domino shape and a tromino shape (L-shape covering 3 grid cells). You want to tile an 2 x n board. Return the number of ways to tile the board. Since the answer may be very large, return it modulo 10^9 + 7.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Dynamic Programming'],
  constraints: '1 <= n <= 1000',
  examples: [{ input: '3', output: '5' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Linear DP recurrences', content: 'Let dp[i] represent the number of ways to tile a 2 x i board. The recurrence relation is dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD.' }],
  jsSolution: (n) => {
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (n === 3) return 5;
    const MOD = 1000000007;
    const dp = Array(n + 1).fill(0);
    dp[1] = 1;
    dp[2] = 2;
    dp[3] = 5;
    for (let i = 4; i <= n; i++) {
      dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;
    }
    return dp[n];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3]);
    cases.push([1]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(20, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 500)]);
    return cases;
  }
},

// 29
{
  slug: 'longest-arithmetic-subsequence',
  title: 'Longest Arithmetic Subsequence',
  description: 'Given an array nums of integers, return the length of the longest arithmetic subsequence in nums. Recall that a subsequence of an array nums is a list nums[i1], nums[i2], ..., nums[ik] with i1 < i2 < ... < ik such that nums[ij+1] - nums[ij] is the same for all 0 <= j < k - 1.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Hash Table', 'Dynamic Programming', 'Binary Search'],
  constraints: '2 <= nums.length <= 1000. 0 <= nums[i] <= 500.',
  examples: [{ input: '[3,6,9,12]', output: '4' }, { input: '[9,4,7,2,10]', output: '3' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '2D DP with differences', content: 'Let dp[i][diff] be the length of the arithmetic subsequence ending at index i with common difference diff. For each j < i, diff = nums[i] - nums[j]. dp[i][diff] = (dp[j][diff] || 1) + 1.' }],
  jsSolution: (nums) => {
    const n = nums.length;
    if (n <= 2) return n;
    const dp = Array.from({ length: n }, () => new Map());
    let maxLen = 2;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        const diff = nums[i] - nums[j];
        const val = (dp[j].get(diff) || 1) + 1;
        dp[i].set(diff, val);
        maxLen = Math.max(maxLen, val);
      }
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 6, 9, 12]]);
    cases.push([[9, 4, 7, 2, 10]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(3, 8), 1, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(8, 20), 1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 50), 1, 100)]);
    return cases;
  }
},

// 30
{
  slug: 'longest-arithmetic-subsequence-of-given-difference',
  title: 'Longest Arithmetic Subsequence of Given Difference',
  description: 'Given an integer array arr and an integer difference, return the length of the longest subsequence in arr which is an arithmetic sequence such that the difference between adjacent elements in the subsequence equals difference. A subsequence is a sequence that can be derived from arr by deleting some or no elements without changing the order of the remaining elements.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Hash Table', 'Dynamic Programming'],
  constraints: '1 <= arr.length <= 10^4. -10^4 <= arr[i], difference <= 10^4.',
  examples: [{ input: '[1,2,3,4], 1', output: '4' }],
  args: [
    { name: 'arr', cpp: 'vector<int>&', java: 'int[]', py: 'arr: List[int]', js: 'arr' },
    { name: 'difference', cpp: 'int', java: 'int', py: 'difference: int', js: 'difference' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Single Pass Hash Map', content: 'Let dp[x] be the length of the arithmetic subsequence ending at value x. Iterate through arr: dp[x] = (dp[x - difference] || 0) + 1. Keep track of the maximum value seen.' }],
  jsSolution: (arr, difference) => {
    const dp = new Map();
    let maxLen = 0;
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const prev = val - difference;
      const count = (dp.get(prev) || 0) + 1;
      dp.set(val, count);
      maxLen = Math.max(maxLen, count);
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4], 1]);
    
    const gen = (n) => {
      const arr = randArr(n, 1, 20);
      const diff = randInt(-3, 3);
      return [arr, diff];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 100)));
    return cases;
  }
},

// 31
{
  slug: 'solving-questions-with-brainpower',
  title: 'Solving Questions With Brainpower',
  description: 'You are given a 0-indexed 2D integer array questions where questions[i] = [points_i, brainpower_i]. The array represents the questions of an exam. You must solve the exam in order from question 0 to n - 1. If you solve question i, you will get points_i points but you will be unable to solve each of the next brainpower_i questions. If you skip question i, you do not get any points but you can solve the next question. Return the maximum points you can earn from the exam.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= questions.length <= 10^4. questions[i].length == 2. 1 <= points_i, brainpower_i <= 10^5.',
  examples: [{ input: '[[3,2],[4,3],[4,4],[2,5]]', output: '5' }],
  args: [{ name: 'questions', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'questions: List[List[int]]', js: 'questions' }],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Backward DP tracking', content: 'Iterate backwards from n-1 to 0. For each question i, we can solve it: dp[i] = points + dp[i + brainpower + 1], or skip it: dp[i] = dp[i + 1]. dp[i] is the max of the two options.' }],
  jsSolution: (questions) => {
    const n = questions.length;
    const dp = Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      const pts = questions[i][0];
      const skip = questions[i][1];
      const nextIdx = i + skip + 1;
      const solveVal = pts + (nextIdx < n ? dp[nextIdx] : 0);
      dp[i] = Math.max(dp[i + 1], solveVal);
    }
    return dp[0];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[3, 2], [4, 3], [4, 4], [2, 5]]]);
    
    const gen = (n) => {
      const q = [];
      for (let j = 0; j < n; j++) {
        q.push([randInt(1, 10), randInt(1, 4)]);
      }
      return [q];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 32
{
  slug: 'count-vowels-permutation',
  title: 'Count Vowels Permutation',
  description: 'Given an integer n, return the number of strings of length n that can be directed under vowel connection rules:\n- Each character is a lower case vowel (\'a\', \'e\', \'i\', \'o\', \'u\')\n- Each vowel \'a\' may only be followed by an \'e\'.\n- Each vowel \'e\' may only be followed by an \'a\' or \'i\'.\n- Each vowel \'i\' may not be followed by another \'i\'.\n- Each vowel \'o\' may only be followed by an \'i\' or \'u\'.\n- Each vowel \'u\' may only be followed by an \'a\'.\nSince the answer may be very large, return it modulo 10^9 + 7.',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['Dynamic Programming'],
  constraints: '1 <= n <= 10^4',
  examples: [{ input: '1', output: '5' }, { input: '2', output: '10' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Transition equations', content: 'Track count of strings of length i ending with each vowel. aCount[i] = eCount[i-1] + iCount[i-1] + uCount[i-1]. Work out equations for all vowels.' }],
  jsSolution: (n) => {
    const MOD = 1000000007;
    let a = 1, e = 1, i = 1, o = 1, u = 1;
    for (let step = 2; step <= n; step++) {
      const nextA = (e + i + u) % MOD;
      const nextE = (a + i) % MOD;
      const nextI = (e + o) % MOD;
      const nextO = i % MOD;
      const nextU = (i + o) % MOD;
      a = nextA;
      e = nextE;
      i = nextI;
      o = nextO;
      u = nextU;
    }
    return (a + e + i + o + u) % MOD;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1]);
    cases.push([2]);
    for (let i = 0; i < 48; i++) cases.push([randInt(1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(10, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 1000)]);
    return cases;
  }
},

// 33
{
  slug: 'is-subsequence',
  title: 'Is Subsequence',
  description: 'Given two strings s and t, return true if s is a subsequence of t, or false otherwise. A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  tags: ['Two Pointers', 'String', 'Dynamic Programming'],
  constraints: '0 <= s.length <= 100. 0 <= t.length <= 10^4.',
  examples: [{ input: '"abc", "ahbgdc"', output: 'true' }, { input: '"axc", "ahbgdc"', output: 'false' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Two Pointers matching', content: 'Track pointer for s and pointer for t. When characters match, advance both. Otherwise, only advance t pointer. If s pointer reaches the end, it is a subsequence.' }],
  jsSolution: (s, t) => {
    let i = 0, j = 0;
    while (i < s.length && j < t.length) {
      if (s[i] === t[j]) {
        i++;
      }
      j++;
    }
    return i === s.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["abc", "ahbgdc"]);
    cases.push(["axc", "ahbgdc"]);
    
    const gen = (l1, l2, match) => {
      const s = randStr(l1);
      if (match) {
        let t = "";
        let i = 0;
        while (t.length < l2) {
          if (i < l1 && Math.random() < 0.3) {
            t += s[i++];
          } else {
            t += randStr(1);
          }
        }
        while (i < l1) {
          t += s[i++];
        }
        return [s, t];
      } else {
        return [s, randStr(l2)];
      }
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 4), randInt(4, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 8), randInt(10, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 15), randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 34
{
  slug: 'get-maximum-in-generated-array',
  title: 'Get Maximum in Generated Array',
  description: 'You are given an integer n. A 0-indexed integer array nums of size n + 1 is generated in the following way:\n- nums[0] = 0\n- nums[1] = 1\n- nums[2 * i] = nums[i] when 2 <= 2 * i <= n\n- nums[2 * i + 1] = nums[i] + nums[i + 1] when 2 <= 2 * i + 1 <= n\nReturn the maximum integer in the array nums.',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  tags: ['Array', 'Simulation'],
  constraints: '0 <= n <= 100',
  examples: [{ input: '7', output: '3', explanation: 'Generated array is [0,1,1,2,1,3,2,3]. Max is 3.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Simulate DP array creation', content: 'Perform simulation according to equations up to index n. Keep track of the maximum value produced.' }],
  jsSolution: (n) => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    const nums = Array(n + 1).fill(0);
    nums[1] = 1;
    let maxVal = 1;
    for (let i = 1; 2 * i <= n; i++) {
      nums[2 * i] = nums[i];
      maxVal = Math.max(maxVal, nums[2 * i]);
      if (2 * i + 1 <= n) {
        nums[2 * i + 1] = nums[i] + nums[i + 1];
        maxVal = Math.max(maxVal, nums[2 * i + 1]);
      }
    }
    return maxVal;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([7]);
    cases.push([0]);
    cases.push([1]);
    for (let i = 0; i < 147; i++) {
      cases.push([randInt(0, 100)]);
    }
    return cases;
  }
},

// 35
{
  slug: 'count-sorted-vowel-strings',
  title: 'Count Sorted Vowel Strings',
  description: 'Given an integer n, return the number of strings of length n that consist only of vowels (a, e, i, o, u) and are lexicographically sorted. A string s is lexicographically sorted if for all valid i, s[i] is the same as or comes before s[i+1] in the alphabet.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
  constraints: '1 <= n <= 50',
  examples: [{ input: '1', output: '5' }, { input: '2', output: '15' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'DP with state tracking', content: 'Let dp[i] be the number of valid sorted vowel strings ending with vowel index i. dp is updated: nextDp[i] = sum(dp[0...i]).' }],
  jsSolution: (n) => {
    let a = 1, e = 1, i = 1, o = 1, u = 1;
    for (let step = 1; step < n; step++) {
      a = a + e + i + o + u;
      e = e + i + o + u;
      i = i + o + u;
      o = o + u;
      u = u;
    }
    return a + e + i + o + u;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1]);
    cases.push([2]);
    for (let i = 0; i < 148; i++) {
      cases.push([randInt(1, 50)]);
    }
    return cases;
  }
},

// 36
{
  slug: 'stone-game',
  title: 'Stone Game',
  description: 'Alice and Bob play a game with piles of stones. There are an even number of piles arranged in a row, and each pile has a positive integer number of stones piles[i]. The objective of the game is to end with the most stones. The total number of stones across all piles is odd, so there are no ties. Alice and Bob take turns, with Alice starting first. Each turn, a player takes the entire pile of stones either from the beginning or from the end of the row. This continues until there are no more piles left. Return true if Alice wins the game, or false otherwise.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Math', 'Dynamic Programming', 'Game Theory'],
  constraints: '2 <= piles.length <= 500. piles.length is even. 1 <= piles[i] <= 500. The sum of all piles is odd.',
  examples: [{ input: '[5,3,4,5]', output: 'true' }],
  args: [{ name: 'piles', cpp: 'vector<int>&', java: 'int[]', py: 'piles: List[int]', js: 'piles' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Game Theory DP or Greedy', content: 'Since Alice goes first and piles length is even, Alice can always choose to pick either all even indexed piles or all odd indexed piles, guaranteeing a win. So mathematically it always returns true.' }],
  jsSolution: (piles) => {
    // Standard mathematical proof shows Alice always wins
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 3, 4, 5]]);
    
    const gen = (n) => {
      const arr = randArr(n, 1, 30);
      const sum = arr.reduce((s, v) => s + v, 0);
      if (sum % 2 === 0) arr[0]++; // make sum odd
      return [arr];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(2));
    for (let i = 0; i < 50; i++) cases.push(gen(4));
    for (let i = 0; i < 50; i++) cases.push(gen(8));
    return cases;
  }
},

// 37
{
  slug: 'champagne-tower',
  title: 'Champagne Tower',
  description: 'We stack glasses in a pyramid, where the first row has 1 glass, the second row has 2 glasses, and so on, down to the 100th row. Each glass holds exactly one cup of champagne. When champagne is poured into the top glass, any excess liquid poured falls equally to the left and right glass below it. Return how full the jth glass in the ith row is (both i and j are 0-indexed). Return value parsed as float.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Dynamic Programming'],
  constraints: '0 <= poured <= 10^9. 0 <= query_glass <= query_row < 100.',
  examples: [{ input: '1, 1, 1', output: '0.0' }, { input: '2, 1, 1', output: '0.5' }],
  args: [
    { name: 'poured', cpp: 'int', java: 'int', py: 'poured: int', js: 'poured' },
    { name: 'query_row', cpp: 'int', java: 'int', py: 'query_row: int', js: 'query_row' },
    { name: 'query_glass', cpp: 'int', java: 'int', py: 'query_glass: int', js: 'query_glass' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Row-by-row simulation', content: 'Maintain the quantity of champagne flowing through each glass. If a glass has amount > 1, pass (amount - 1) / 2 to the two glasses directly below it in the next row.' }],
  jsSolution: (poured, query_row, query_glass) => {
    let row = [poured];
    for (let r = 0; r < query_row; r++) {
      const nextRow = Array(row.length + 1).fill(0);
      for (let c = 0; c < row.length; c++) {
        const extra = row[c] - 1;
        if (extra > 0) {
          nextRow[c] += extra / 2;
          nextRow[c + 1] += extra / 2;
        }
      }
      row = nextRow;
    }
    return parseFloat(Math.min(1, row[query_glass]).toFixed(5));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1, 1, 1]);
    cases.push([2, 1, 1]);
    
    const gen = () => {
      const p = randInt(0, 10);
      const r = randInt(0, 4);
      const g = randInt(0, r);
      return [p, r, g];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 38
{
  slug: 'soup-servings',
  title: 'Soup Servings',
  description: 'There are two types of soup: A and B. Initially, we have n ml of each soup. We have four types of operations: 1) Serve 100ml A and 0ml B, 2) Serve 75ml A and 25ml B, 3) Serve 50ml A and 50ml B, 4) Serve 25ml A and 75ml B. Return the probability that soup A will be empty first, plus half the probability that A and B become empty at the same time. Note that if n >= 5000, return 1.0 directly.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Math', 'Dynamic Programming', 'Probability'],
  constraints: '0 <= n <= 10^9',
  examples: [{ input: '50', output: '0.625' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Reduce n by 25ml base', content: 'Divide n by 25. If n >= 200 (n >= 5000ml), return 1.0 as A is highly likely to be empty first. Use 2D DP memoization for smaller states: dp[a][b] = 0.25 * (dfs(a-4, b) + dfs(a-3, b-1) + dfs(a-2, b-2) + dfs(a-1, b-3)).' }],
  jsSolution: (n) => {
    if (n >= 5000) return 1.0;
    const servings = Math.ceil(n / 25);
    const memo = Array.from({ length: servings + 1 }, () => Array(servings + 1).fill(-1));
    
    const dfs = (a, b) => {
      if (a <= 0 && b <= 0) return 0.5;
      if (a <= 0) return 1.0;
      if (b <= 0) return 0.0;
      if (memo[a][b] !== -1) return memo[a][b];
      
      const p = 0.25 * (
        dfs(a - 4, b) +
        dfs(a - 3, b - 1) +
        dfs(a - 2, b - 2) +
        dfs(a - 1, b - 3)
      );
      return memo[a][b] = p;
    };
    return parseFloat(dfs(servings, servings).toFixed(5));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([50]);
    cases.push([100]);
    for (let i = 0; i < 48; i++) cases.push([randInt(0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(100, 800)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(800, 5500)]);
    return cases;
  }
},

// 39
{
  slug: 'russian-doll-envelopes',
  title: 'Russian Doll Envelopes',
  description: 'You are given a 2D array of integers envelopes where envelopes[i] = [wi, hi] represents the width and the height of an envelope. One envelope can fit into another if and only if both the width and height of one envelope are strictly greater than the other envelope\'s width and height. Return the maximum number of envelopes you can Russian doll (i.e., put one inside another).',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['Array', 'Binary Search', 'Dynamic Programming', 'Sorting'],
  constraints: '1 <= envelopes.length <= 10^5. envelopes[i].length == 2. 1 <= wi, hi <= 10^5.',
  examples: [{ input: '[[5,4],[6,4],[6,7],[2,3]]', output: '3', explanation: 'Russian doll: [2,3] -> [5,4] -> [6,7].' }],
  args: [{ name: 'envelopes', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'envelopes: List[List[int]]', js: 'envelopes' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sort and LIS', content: 'Sort envelopes: width ascending, height descending when widths are equal. Then, run the LIS (Longest Increasing Subsequence) algorithm on the heights using binary search.' }],
  jsSolution: (envelopes) => {
    if (envelopes.length === 0) return 0;
    envelopes.sort((a, b) => {
      if (a[0] === b[0]) return b[1] - a[1];
      return a[0] - b[0];
    });
    
    const dp = [];
    for (let i = 0; i < envelopes.length; i++) {
      const h = envelopes[i][1];
      let l = 0, r = dp.length;
      while (l < r) {
        const mid = Math.floor((l + r) / 2);
        if (dp[mid] >= h) r = mid;
        else l = mid + 1;
      }
      if (l === dp.length) dp.push(h);
      else dp[l] = h;
    }
    return dp.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[5, 4], [6, 4], [6, 7], [2, 3]]]);
    
    const gen = (n) => {
      const list = [];
      for (let j = 0; j < n; j++) {
        list.push([randInt(1, 20), randInt(1, 20)]);
      }
      return [list];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 35)));
    return cases;
  }
},

// 40
{
  slug: 'distinct-subsequences',
  title: 'Distinct Subsequences',
  description: 'Given two strings s and t, return the number of distinct subsequences of s which equals t. The test cases are generated so that the answer fits in a 32-bit signed integer.',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= s.length, t.length <= 1000. s and t consist of English letters.',
  examples: [{ input: '"rabbbit", "rabbit"', output: '3' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '2D matching count', content: 'Let dp[i][j] represent the number of times t[0...j-1] matches as subsequences in s[0...i-1]. If s[i-1] == t[j-1], dp[i][j] = dp[i-1][j-1] + dp[i-1][j] (match + skip). Otherwise, dp[i][j] = dp[i-1][j].' }],
  jsSolution: (s, t) => {
    const m = s.length;
    const n = t.length;
    const dp = Array(n + 1).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= m; i++) {
      for (let j = n; j >= 1; j--) {
        if (s[i - 1] === t[j - 1]) {
          dp[j] += dp[j - 1];
        }
      }
    }
    return dp[n];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["rabbbit", "rabbit"]);
    cases.push(["babgbag", "bag"]);
    
    const gen = (l1, l2, solvable) => {
      const chars = "abc";
      const s = randStr(l1, chars);
      const t = solvable ? s.substring(0, l2) : randStr(l2, chars);
      return [s, t];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), randInt(1, 3), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12), randInt(2, 5), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20), randInt(4, 7), Math.random() < 0.5));
    return cases;
  }
},

// 41
{
  slug: 'burst-balloons',
  title: 'Burst Balloons',
  description: 'You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it, represented by an array nums. You are asked to burst all the balloons. If you burst the ith balloon, you will get nums[i - 1] * nums[i] * nums[i + 1] coins. If i - 1 or i + 1 goes out of bounds, treat it as if there is a balloon with a 1 painted on it. Return the maximum coins you can collect.',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= nums.length <= 300. 0 <= nums[i] <= 100.',
  examples: [{ input: '[3,1,5,8]', output: '167', explanation: '3*1*5 + 3*5*8 + 1*5*8 + 1*8*1 = 167.' }],
  args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Interval DP', content: 'Define dp[i][j] as the max coins for subarray [i, j]. Let k be the last balloon to burst in this interval. dp[i][j] = max(dp[i][k-1] + nums[i-1]*nums[k]*nums[j+1] + dp[k+1][j]).' }],
  jsSolution: (nums) => {
    const list = [1, ...nums.filter(x => x > 0), 1];
    const n = list.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    
    for (let len = 1; len <= n - 2; len++) {
      for (let left = 1; left <= n - len - 1; left++) {
        const right = left + len - 1;
        for (let k = left; k <= right; k++) {
          dp[left][right] = Math.max(
            dp[left][right],
            dp[left][k - 1] + list[left - 1] * list[k] * list[right + 1] + dp[k + 1][right]
          );
        }
      }
    }
    return dp[1][n - 2];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, 5, 8]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(1, 4), 1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(4, 7), 1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(7, 10), 1, 15)]);
    return cases;
  }
},

// 42
{
  slug: 'delete-operation-for-two-strings',
  title: 'Delete Operation for Two Strings',
  description: 'Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same, where in one step you can delete one character in either string.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= word1.length, word2.length <= 500. word1 and word2 consist of lowercase English letters.',
  examples: [{ input: '"sea", "eat"', output: '2', explanation: 'sea -> ea, eat -> ea' }],
  args: [
    { name: 'word1', cpp: 'string', java: 'String', py: 'word1: str', js: 'word1' },
    { name: 'word2', cpp: 'string', java: 'String', py: 'word2: str', js: 'word2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'LCS subtraction', content: 'Find the length of the Longest Common Subsequence of word1 and word2. The number of deletions needed is word1.length + word2.length - 2 * LCS_length.' }],
  jsSolution: (word1, word2) => {
    const m = word1.length;
    const n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = 1 + dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    const lcs = dp[m][n];
    return m + n - 2 * lcs;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["sea", "eat"]);
    for (let i = 0; i < 48; i++) cases.push([randStr(randInt(1, 10)), randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(10, 30)), randStr(randInt(10, 30))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(30, 70)), randStr(randInt(30, 70))]);
    return cases;
  }
}

];
