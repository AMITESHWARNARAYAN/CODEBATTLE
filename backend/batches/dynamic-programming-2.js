// Dynamic Programming — Batch 2 (5 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'best-time-to-buy-and-sell-stock-iii',
  title: 'Best Time to Buy and Sell Stock III',
  description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. You may complete at most two transactions. Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= prices.length <= 10^5. 0 <= prices[i] <= 10^5.',
  examples: [{ input: '[3,3,5,0,0,3,1,4]', output: '6', explanation: 'Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3. Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.' }],
  args: [{ name: 'prices', cpp: 'vector<int>&', java: 'int[]', py: 'prices: List[int]', js: 'prices' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Four states DP', content: 'Track four variables: buy1, sell1, buy2, sell2. For each price: buy1 = max(buy1, -price), sell1 = max(sell1, buy1 + price), buy2 = max(buy2, sell1 - price), sell2 = max(sell2, buy2 + price).' }],
  jsSolution: (prices) => {
    let buy1 = -Infinity, sell1 = 0;
    let buy2 = -Infinity, sell2 = 0;
    for (let i = 0; i < prices.length; i++) {
      buy1 = Math.max(buy1, -prices[i]);
      sell1 = Math.max(sell1, buy1 + prices[i]);
      buy2 = Math.max(buy2, sell1 - prices[i]);
      sell2 = Math.max(sell2, buy2 + prices[i]);
    }
    return sell2;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 3, 5, 0, 0, 3, 1, 4]]);
    for (let i = 0; i < 49; i++) cases.push([randArr(randInt(1, 10), 0, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 30), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(30, 80), 0, 500)]);
    return cases;
  }
},

// 2
{
  slug: 'best-time-to-buy-and-sell-stock-iv',
  title: 'Best Time to Buy and Sell Stock IV',
  description: 'You are given an integer k and an array of integers prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. You may complete at most k transactions. Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming'],
  constraints: '1 <= k <= 100. 1 <= prices.length <= 1000. 0 <= prices[i] <= 1000.',
  examples: [{ input: '2, [2,4,1]', output: '2' }, { input: '2, [3,2,6,5,0,3]', output: '7' }],
  args: [
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' },
    { name: 'prices', cpp: 'vector<int>&', java: 'int[]', py: 'prices: List[int]', js: 'prices' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Multi-transaction DP table', content: 'Use two DP arrays: buy[i] and sell[i] up to k. Update them for each price.' }],
  jsSolution: (k, prices) => {
    if (prices.length === 0 || k === 0) return 0;
    if (k >= prices.length / 2) {
      let profit = 0;
      for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
      }
      return profit;
    }
    const buy = Array(k + 1).fill(-Infinity);
    const sell = Array(k + 1).fill(0);
    for (let i = 0; i < prices.length; i++) {
      for (let j = 1; j <= k; j++) {
        buy[j] = Math.max(buy[j], sell[j - 1] - prices[i]);
        sell[j] = Math.max(sell[j], buy[j] + prices[i]);
      }
    }
    return sell[k];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2, [2, 4, 1]]);
    cases.push([2, [3, 2, 6, 5, 0, 3]]);
    
    const gen = (n) => {
      const prices = randArr(n, 0, 50);
      const k = randInt(1, Math.ceil(n / 2));
      return [k, prices];
    };
    
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
},

// 3
{
  slug: 'ones-and-zeroes',
  title: 'Ones and Zeroes',
  description: 'You are given an array of binary strings strs and two integers m and n. Return the size of the largest subset of strs such that there are at most m 0\'s and n 1\'s in the subset. A subset x is a subset of y if all elements of x are also elements of y.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'String', 'Dynamic Programming'],
  constraints: '1 <= strs.length <= 600. 1 <= strs[i].length <= 100. strs[i] consists only of digits \'0\' and \'1\'. 1 <= m, n <= 100.',
  examples: [{ input: '["10","0001","111001","1","0"], 5, 3', output: '4', explanation: 'The largest subset is {"10", "0001", "1", "0"}, containing 5 zeros and 3 ones.' }],
  args: [
    { name: 'strs', cpp: 'vector<string>&', java: 'String[]', py: 'strs: List[str]', js: 'strs' },
    { name: 'm', cpp: 'int', java: 'int', py: 'm: int', js: 'm' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '2D Knapsack DP', content: 'Let dp[i][j] represent the maximum subset size with at most i zeros and j ones. For each string, count its zeros and ones (z, o), then update dp: dp[i][j] = max(dp[i][j], 1 + dp[i - z][j - o]) backwards.' }],
  jsSolution: (strs, m, n) => {
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let s = 0; s < strs.length; s++) {
      let zeros = 0, ones = 0;
      for (let i = 0; i < strs[s].length; i++) {
        if (strs[s][i] === '0') zeros++;
        else ones++;
      }
      for (let i = m; i >= zeros; i--) {
        for (let j = n; j >= ones; j--) {
          dp[i][j] = Math.max(dp[i][j], 1 + dp[i - zeros][j - ones]);
        }
      }
    }
    return dp[m][n];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["10", "0001", "111001", "1", "0"], 5, 3]);
    
    const gen = (len, strLen) => {
      const list = Array.from({ length: len }, () => randStr(randInt(1, strLen), "01"));
      const m = randInt(1, len * 2);
      const n = randInt(1, len * 2);
      return [list, m, n];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 5), 4));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12), 6));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 25), 8));
    return cases;
  }
},

// 4
{
  slug: 'longest-palindromic-subsequence',
  title: 'Longest Palindromic Subsequence',
  description: 'Given a string s, find the longest palindromic subsequence\'s length in s.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['String', 'Dynamic Programming'],
  constraints: '1 <= s.length <= 1000. s consists of lowercase English letters.',
  examples: [{ input: '"bbbab"', output: '4', explanation: 'One possible longest palindromic subsequence is "bbbb".' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Interval DP matching', content: 'Let dp[i][j] be the length of the longest palindromic subsequence in s[i...j]. If s[i] == s[j], dp[i][j] = 2 + dp[i+1][j-1]. Otherwise, dp[i][j] = max(dp[i+1][j], dp[i][j-1]).' }],
  jsSolution: (s) => {
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      dp[i][i] = 1;
      for (let j = i + 1; j < n; j++) {
        if (s[i] === s[j]) {
          dp[i][j] = dp[i + 1][j - 1] + 2;
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
        }
      }
    }
    return dp[0][n - 1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["bbbab"]);
    for (let i = 0; i < 49; i++) cases.push([randStr(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(10, 30))]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(30, 80))]);
    return cases;
  }
},

// 5
{
  slug: 'maximum-length-of-pair-chain',
  title: 'Maximum Length of Pair Chain',
  description: 'You are given an array of n pairs pairs where pairs[i] = [left_i, right_i] and left_i < right_i. A chain can be formed where pair p1 = [a, b] can tail p2 = [c, d] if b < c. Find the longest chain of pairs you can form. You do not need to use up all the given pairs. You can select pairs in any order.',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'],
  constraints: 'n == pairs.length. 1 <= n <= 2250. -1000 <= left_i < right_i <= 1000.',
  examples: [{ input: '[[1,2],[2,3],[3,4]]', output: '2', explanation: 'The longest chain is [1,2] -> [3,4].' }],
  args: [{ name: 'pairs', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'pairs: List[List[int]]', js: 'pairs' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Sorting + Greedy/DP', content: 'Sort pairs by their second elements. Use a greedy approach (or DP): pick the pair that ends earliest, then find the next pair that starts after the current pair ends.' }],
  jsSolution: (pairs) => {
    pairs.sort((a, b) => a[1] - b[1]);
    let curr = -Infinity;
    let count = 0;
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i][0] > curr) {
        count++;
        curr = pairs[i][1];
      }
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [2, 3], [3, 4]]]);
    
    const gen = (n) => {
      const list = [];
      for (let j = 0; j < n; j++) {
        const left = randInt(-100, 100);
        list.push([left, left + randInt(1, 10)]);
      }
      return [list];
    };
    
    for (let i = 0; i < 49; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 50)));
    return cases;
  }
}

];
