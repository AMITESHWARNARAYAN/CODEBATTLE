// Stack — Batch 2 (28 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'valid-parentheses',
  title: 'Valid Parentheses',
  description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 10^4, s consists of parenthesis characters only',
  examples: [{ input: '"()[]{}"', output: 'true', explanation: 'All brackets are closed in order.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Use Stack', content: 'Push opening brackets. Pop and check match when closing brackets are encountered.' }],
  jsSolution: (s) => {
    const map = { ')': '(', '}': '{', ']': '[' };
    const stack = [];
    for (const c of s) {
      if (map[c]) {
        if (stack.pop() !== map[c]) return false;
      } else {
        stack.push(c);
      }
    }
    return stack.length === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['()[]{}']); cases.push(['(]']); cases.push(['([)]']);
    const genValid = (depth) => {
      if (depth === 0) return '';
      const r = Math.random();
      const pair = r < 0.33 ? ['(', ')'] : r < 0.66 ? ['[', ']'] : ['{', '}'];
      const inner = genValid(depth - 1);
      return pair[0] + inner + pair[1];
    };
    const genInvalid = (len) => {
      const chars = '()[]{}';
      return Array.from({ length: len }, () => chars[randInt(0, 5)]).join('');
    };
    for (let i = 0; i < 47; i++) {
      cases.push([Math.random() < 0.5 ? genValid(randInt(1, 10)) : genInvalid(randInt(2, 20))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? genValid(randInt(10, 50)) : genInvalid(randInt(20, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([Math.random() < 0.5 ? genValid(randInt(50, 200)) : genInvalid(randInt(100, 500))]);
    }
    return cases;
  }
},

// 2
{
  slug: 'longest-valid-parentheses',
  title: 'Longest Valid Parentheses',
  description: 'Given a string s containing just the characters \'(\' and \')\', return the length of the longest valid (well-formed) parentheses substring.',
  difficulty: 'Hard',
  category: 'Stack',
  tags: ['String', 'Stack', 'Dynamic Programming'],
  constraints: '0 <= s.length <= 3 * 10^4',
  examples: [{ input: '")()())"', output: '4', explanation: 'The longest valid parentheses substring is "()()".' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Stack Indices', content: 'Push indices of parentheses. Pop for \')\'. Distance to stack top is current valid length.' }],
  jsSolution: (s) => {
    const stack = [-1];
    let maxLen = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') {
        stack.push(i);
      } else {
        stack.pop();
        if (stack.length === 0) {
          stack.push(i);
        } else {
          maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
        }
      }
    }
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([')()())']); cases.push(['(()']); cases.push(['']);
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 50), '()')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(50, 300), '()')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(300, 1500), '()')]);
    }
    return cases;
  }
},

// 3
{
  slug: 'next-greater-element-i',
  title: 'Next Greater Element I',
  description: 'Given two unique integer arrays nums1 and nums2 where nums1 is a subset of nums2, return an array of the next greater element for each element in nums1 in nums2. If not found, return -1.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Array', 'Hash Table', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= nums1.length <= nums2.length <= 1000, 0 <= nums[i] <= 10^4, all integers in nums1 and nums2 are unique.',
  examples: [{ input: '[4,1,2], [1,3,4,2]', output: '[-1,3,-1]', explanation: 'NGE of 4 is -1, 1 is 3, 2 is -1.' }],
  args: [
    { name: 'nums1', cpp: 'vector<int>', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
    { name: 'nums2', cpp: 'vector<int>', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack + Map', content: 'Scan nums2 from left to right. Maintain decreasing stack. Pop and record in hash map when current element is larger.' }],
  jsSolution: (nums1, nums2) => {
    const map = new Map();
    const stack = [];
    for (const num of nums2) {
      while (stack.length > 0 && stack[stack.length - 1] < num) {
        map.set(stack.pop(), num);
      }
      stack.push(num);
    }
    return nums1.map(num => map.has(num) ? map.get(num) : -1);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 1, 2], [1, 3, 4, 2]]);
    cases.push([[2, 4], [1, 2, 3, 4]]);
    cases.push([[1], [1]]);
    const genPair = (n, m) => {
      const set = new Set();
      while (set.size < m) set.add(randInt(1, m * 3));
      const nums2 = [...set];
      const nums1 = [];
      const shuffled = [...nums2].sort(() => Math.random() - 0.5);
      for (let i = 0; i < n; i++) nums1.push(shuffled[i]);
      return [nums1, nums2];
    };
    for (let i = 0; i < 47; i++) {
      const m = randInt(5, 30); const n = randInt(1, m);
      cases.push(genPair(n, m));
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(30, 200); const n = randInt(10, m);
      cases.push(genPair(n, m));
    }
    for (let i = 0; i < 50; i++) {
      const m = randInt(200, 800); const n = randInt(50, m);
      cases.push(genPair(n, m));
    }
    return cases;
  }
},

// 4
{
  slug: 'largest-rectangle-in-histogram',
  title: 'Largest Rectangle in Histogram',
  description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
  difficulty: 'Hard',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= heights.length <= 10^5, 0 <= heights[i] <= 10^4',
  examples: [{ input: '[2,1,5,6,2,3]', output: '10', explanation: 'The largest rectangle is formed by heights 5 and 6, area = 10.' }],
  args: [{ name: 'heights', cpp: 'vector<int>', java: 'int[]', py: 'heights: List[int]', js: 'heights' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Monotonic Stack', content: 'Maintain indices in stack in increasing height order. Pop when current height is less.' }],
  jsSolution: (heights) => {
    const stack = [];
    let maxArea = 0;
    for (let i = 0; i <= heights.length; i++) {
      const h = i === heights.length ? 0 : heights[i];
      while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
        const height = heights[stack.pop()];
        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        maxArea = Math.max(maxArea, height * width);
      }
      stack.push(i);
    }
    return maxArea;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 5, 6, 2, 3]]); cases.push([[2, 4]]); cases.push([[0]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 50), 0, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 500), 0, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(500, 3000), 0, 10000)]);
    }
    return cases;
  }
},

// 5
{
  slug: 'remove-duplicate-letters',
  title: 'Remove Duplicate Letters',
  description: 'Given a string s, remove duplicate letters so that every letter appears once and only once. Ensure the result is the lexicographically smallest possible among all potential results.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Greedy', 'Monotonic Stack'],
  constraints: '1 <= s.length <= 10^4, s consists of lowercase English letters',
  examples: [{ input: '"bcabc"', output: '"abc"', explanation: '"abc" is the smallest option.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Greedy Stack', content: 'Count character frequencies. Push to stack, pop if top character is greater than current and will appear later.' }],
  jsSolution: (s) => {
    const count = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;
    const seen = new Set();
    const stack = [];
    for (const c of s) {
      count[c]--;
      if (seen.has(c)) continue;
      while (stack.length > 0 && stack[stack.length - 1] > c && count[stack[stack.length - 1]] > 0) {
        seen.delete(stack.pop());
      }
      stack.push(c);
      seen.add(c);
    }
    return stack.join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['bcabc']); cases.push(['cbacdcbc']); cases.push(['a']);
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 50), 'abcdefghijklmnopqrstuvwxyz')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(50, 300), 'abcdefghijklmnopqrstuvwxyz')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(300, 1000), 'abcdefghijklmnopqrstuvwxyz')]);
    }
    return cases;
  }
},

// 6
{
  slug: 'minimum-add-to-make-parentheses-valid',
  title: 'Minimum Add to Make Parentheses Valid',
  description: 'Given a parentheses string s, return the minimum number of parentheses we must add to make the resulting string valid.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Greedy'],
  constraints: '1 <= s.length <= 1000, s consists of \'(\' and \')\'',
  examples: [{ input: '"())"', output: '1', explanation: 'Add one \'(\' at the start.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Balance', content: 'Keep a balance of opened parentheses. If balance goes negative, we need an opening bracket addition.' }],
  jsSolution: (s) => {
    let left = 0, right = 0;
    for (const c of s) {
      if (c === '(') {
        left++;
      } else {
        if (left > 0) left--;
        else right++;
      }
    }
    return left + right;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['())']); cases.push(['(((']); cases.push(['()']);
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 50), '()')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(50, 200), '()')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(200, 1000), '()')]);
    }
    return cases;
  }
},

// 7
{
  slug: 'backspace-string-compare',
  title: 'Backspace String Compare',
  description: 'Given two strings s and t, return true if they are equal when both are typed into empty text editors. \'#\' means a backspace character.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Two Pointers', 'String', 'Stack', 'Simulation'],
  constraints: '1 <= s.length, t.length <= 200, s and t contain lowercase letters and \'#\' characters',
  examples: [{ input: '"ab#c", "ad#c"', output: 'true', explanation: 'Both become "ac".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Use Stack Simulation', content: 'Build a helper to compile the string. Push letters to stack, pop on \'#\'.' }],
  jsSolution: (s, t) => {
    const build = (str) => {
      const stack = [];
      for (const c of str) {
        if (c === '#') {
          if (stack.length > 0) stack.pop();
        } else {
          stack.push(c);
        }
      }
      return stack.join('');
    };
    return build(s) === build(t);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['ab#c', 'ad#c']);
    cases.push(['ab##', 'c#d#']);
    cases.push(['a#c', 'b']);
    const chars = 'abcdefghijklmnopqrstuvwxyz#';
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 30), chars), randStr(randInt(1, 30), chars)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(30, 100), chars), randStr(randInt(30, 100), chars)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(100, 200), chars), randStr(randInt(100, 200), chars)]);
    }
    return cases;
  }
},

// 8
{
  slug: 'minimum-swaps-to-make-string-balanced',
  title: 'Minimum Number of Swaps to Make the String Balanced',
  description: 'You are given a 0-indexed string s of even length n. The string consists of exactly n / 2 opening brackets \'[\' and n / 2 closing brackets \']\'. Return the minimum number of swaps to make s balanced.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Two Pointers', 'String', 'Stack', 'Greedy'],
  constraints: 'n == s.length, 2 <= n <= 10^6, n is even, s has exactly n/2 \'[\' and n/2 \']\'',
  examples: [{ input: '"]]][[["', output: '2', explanation: 'Swap [0, 5] and [1, 4] to balance.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Cancel Pairs', content: 'Eliminate all valid pairs "[]". Count the remaining unmatched closing brackets.' }],
  jsSolution: (s) => {
    let size = 0;
    for (const c of s) {
      if (c === '[') size++;
      else if (size > 0) size--;
    }
    return Math.ceil(size / 2);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([']]][[[']); cases.push(['[]']); cases.push(['[][]']);
    const genBalancedPart = (n) => {
      const half = n / 2;
      const brackets = [...Array(half).fill('['), ...Array(half).fill(']')];
      for (let i = brackets.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [brackets[i], brackets[j]] = [brackets[j], brackets[i]];
      }
      return brackets.join('');
    };
    for (let i = 0; i < 47; i++) {
      cases.push([genBalancedPart(randInt(2, 40) * 2)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genBalancedPart(randInt(40, 200) * 2)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genBalancedPart(randInt(200, 1000) * 2)]);
    }
    return cases;
  }
},

// 9
{
  slug: 'validate-stack-sequences',
  title: 'Validate Stack Sequences',
  description: 'Given two integer arrays pushed and popped each with distinct values, return true if this could have been the result of a sequence of push and pop operations on an initially empty stack.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Simulation'],
  constraints: '1 <= pushed.length <= 1000, popped.length == pushed.length, values in pushed are distinct, popped is a permutation of pushed',
  examples: [{ input: '[1,2,3,4,5], [4,5,3,2,1]', output: 'true', explanation: 'Push 1..4, pop 4, push 5, pop 5, pop 3..1.' }],
  args: [
    { name: 'pushed', cpp: 'vector<int>', java: 'int[]', py: 'pushed: List[int]', js: 'pushed' },
    { name: 'popped', cpp: 'vector<int>', java: 'int[]', py: 'popped: List[int]', js: 'popped' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Simulation', content: 'Use a stack. For each element in pushed, push to stack and then pop greedily while stack top matches popped.' }],
  jsSolution: (pushed, popped) => {
    const stack = [];
    let i = 0;
    for (const x of pushed) {
      stack.push(x);
      while (stack.length > 0 && stack[stack.length - 1] === popped[i]) {
        stack.pop();
        i++;
      }
    }
    return i === popped.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], [4, 5, 3, 2, 1]]);
    cases.push([[1, 2, 3, 4, 5], [4, 3, 5, 1, 2]]);
    cases.push([[1], [1]]);
    const genPair = (n) => {
      const pushed = Array.from({ length: n }, (_, i) => i + 1);
      const popped = [];
      const stack = [];
      const tempPushed = [...pushed];
      let pIdx = 0;
      while (pIdx < n || stack.length > 0) {
        if (stack.length === 0 || (pIdx < n && Math.random() < 0.5)) {
          stack.push(tempPushed[pIdx++]);
        } else {
          popped.push(stack.pop());
        }
      }
      if (Math.random() < 0.3) {
        // Shuffle popped to make it invalid
        for (let i = popped.length - 1; i > 0; i--) {
          const j = randInt(0, i);
          [popped[i], popped[j]] = [popped[j], popped[i]];
        }
      }
      return [pushed, popped];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genPair(randInt(2, 20)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPair(randInt(20, 100)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPair(randInt(100, 500)));
    }
    return cases;
  }
},

// 10
{
  slug: 'pattern-132',
  title: '132 Pattern',
  description: 'Given an array of n integers nums, return true if there is a 132 pattern in nums. A 132 pattern is a subsequence of three integers nums[i], nums[j] and nums[k] such that i < j < k and nums[i] < nums[k] < nums[j].',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Binary Search', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= nums.length <= 2 * 10^5, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[3,1,4,2]', output: 'true', explanation: '[1, 4, 2] is a 132 pattern.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Reverse Monotonic Stack', content: 'Iterate backwards. Keep a monotonic stack of numbers. Track the second largest number.' }],
  jsSolution: (nums) => {
    let third = -Infinity;
    const stack = [];
    for (let i = nums.length - 1; i >= 0; i--) {
      if (nums[i] < third) return true;
      while (stack.length > 0 && nums[i] > stack[stack.length - 1]) {
        third = stack.pop();
      }
      stack.push(nums[i]);
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, 4, 2]]); cases.push([[1, 2, 3, 4]]); cases.push([[-1, 3, 2, 0]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(5, 50), -100, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 300), -1000, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(300, 1500), -10000, 10000)]);
    }
    return cases;
  }
},

// 11
{
  slug: 'next-greater-node-in-linked-list',
  title: 'Next Greater Node in Linked List',
  description: 'Given an array of integers values representing a singly linked list, for each node in the list, find the value of the next node that has a strictly larger value. Return an array of these next greater values (using 0 for no larger node).',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= values.length <= 10^4, 1 <= values[i] <= 10^9',
  examples: [{ input: '[2,7,4,3,5]', output: '[7,0,5,5,0]', explanation: 'Next greater of 2 is 7, 7 is 0, 4 is 5, 3 is 5, 5 is 0.' }],
  args: [{ name: 'values', cpp: 'vector<int>', java: 'int[]', py: 'values: List[int]', js: 'values' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack on Indices', content: 'Convert list to array. Maintain a monotonic stack of indices of decreasing values.' }],
  jsSolution: (values) => {
    const res = Array(values.length).fill(0);
    const stack = [];
    for (let i = 0; i < values.length; i++) {
      while (stack.length > 0 && values[stack[stack.length - 1]] < values[i]) {
        res[stack.pop()] = values[i];
      }
      stack.push(i);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 7, 4, 3, 5]]); cases.push([[1, 7, 5, 1, 9, 2, 5, 1]]); cases.push([[2, 1]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(2, 50), 1, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 400), 1, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(400, 2000), 1, 10000)]);
    }
    return cases;
  }
},

// 12
{
  slug: 'sum-of-subarray-minimums',
  title: 'Sum of Subarray Minimums',
  description: 'Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. Return the answer modulo 10^9 + 7.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= arr.length <= 3 * 10^4, 1 <= arr[i] <= 3 * 10^4',
  examples: [{ input: '[3,1,2,4]', output: '17', explanation: 'Subarrays and mins: [3](3), [1](1), [2](2), [4](4), [3,1](1), [1,2](1), [2,4](2), [3,1,2](1), [1,2,4](1), [3,1,2,4](1). Sum = 17.' }],
  args: [{ name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Previous/Next Less Elements', content: 'For each element, find how many subarrays have it as the minimum. Count = (i - PLE) * (NLE - i).' }],
  jsSolution: (arr) => {
    const MOD = 1e9 + 7;
    const n = arr.length;
    const left = Array(n).fill(-1);
    const right = Array(n).fill(n);
    let stack = [];
    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
        stack.pop();
      }
      if (stack.length > 0) left[i] = stack[stack.length - 1];
      stack.push(i);
    }
    stack = [];
    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
        stack.pop();
      }
      if (stack.length > 0) right[i] = stack[stack.length - 1];
      stack.push(i);
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const l = i - left[i];
      const r = right[i] - i;
      sum = (sum + arr[i] * l * r) % MOD;
    }
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, 2, 4]]); cases.push([[11, 81, 94, 43, 3]]); cases.push([[5]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 50), 1, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 400), 1, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(400, 2000), 1, 10000)]);
    }
    return cases;
  }
},

// 13
{
  slug: 'sum-of-subarray-ranges',
  title: 'Sum of Subarray Ranges',
  description: 'You are given an integer array nums. The range of a subarray is the difference between the largest and smallest element in the subarray. Return the sum of all subarray ranges.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= nums.length <= 2 * 10^4, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,2,3]', output: '4', explanation: 'Ranges: [1](0), [2](0), [3](0), [1,2](1), [2,3](1), [1,2,3](2). Sum = 4.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Subarray Ranges', content: 'Sum of ranges is Sum of Maxima - Sum of Minima. Compute each independently in O(N) using monotonic stacks.' }],
  jsSolution: (nums) => {
    let totalMax = 0, totalMin = 0;
    const n = nums.length;
    let stack = [];
    const leftMax = Array(n).fill(-1);
    const rightMax = Array(n).fill(n);
    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i]) stack.pop();
      if (stack.length > 0) leftMax[i] = stack[stack.length - 1];
      stack.push(i);
    }
    stack = [];
    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) stack.pop();
      if (stack.length > 0) rightMax[i] = stack[stack.length - 1];
      stack.push(i);
    }
    for (let i = 0; i < n; i++) {
      totalMax += nums[i] * (i - leftMax[i]) * (rightMax[i] - i);
    }
    stack = [];
    const leftMin = Array(n).fill(-1);
    const rightMin = Array(n).fill(n);
    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) stack.pop();
      if (stack.length > 0) leftMin[i] = stack[stack.length - 1];
      stack.push(i);
    }
    stack = [];
    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) stack.pop();
      if (stack.length > 0) rightMin[i] = stack[stack.length - 1];
      stack.push(i);
    }
    for (let i = 0; i < n; i++) {
      totalMin += nums[i] * (i - leftMin[i]) * (rightMin[i] - i);
    }
    return totalMax - totalMin;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]); cases.push([[1, 3, 3]]); cases.push([[4, -2, -3, 4, 1]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 50), -100, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 400), -1000, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(400, 1500), -10000, 10000)]);
    }
    return cases;
  }
},

// 14
{
  slug: 'max-chunks-to-make-sorted',
  title: 'Max Chunks To Make Sorted',
  description: 'You are given an integer array arr of length n that represents a permutation of the integers from 0 to n - 1. We partition the array into chunks, sort them, and combine them. Return the maximum number of chunks we can partition.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Greedy', 'Monotonic Stack'],
  constraints: 'n == arr.length, 1 <= n <= 10, 0 <= arr[i] < n, all values in arr are unique',
  examples: [{ input: '[4,3,2,1,0]', output: '1', explanation: 'We must sort the whole array to get 0..4.' }],
  args: [{ name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Max Equals Index', content: 'Iterate the array. If the maximum element seen so far is equal to the current index, we can form a chunk.' }],
  jsSolution: (arr) => {
    let chunks = 0, maxVal = 0;
    for (let i = 0; i < arr.length; i++) {
      maxVal = Math.max(maxVal, arr[i]);
      if (maxVal === i) chunks++;
    }
    return chunks;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 3, 2, 1, 0]]); cases.push([[1, 0, 2, 3, 4]]); cases.push([[0]]);
    const genPerm = (n) => {
      const arr = Array.from({ length: n }, (_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    for (let i = 0; i < 47; i++) {
      cases.push([genPerm(randInt(1, 6))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genPerm(randInt(6, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genPerm(randInt(8, 10))]);
    }
    return cases;
  }
},

// 15
{
  slug: 'max-chunks-to-make-sorted-ii',
  title: 'Max Chunks To Make Sorted II',
  description: 'We partition the array arr into chunks, sort them, and combine them to form a sorted array. Return the maximum number of chunks we can partition.',
  difficulty: 'Hard',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Greedy', 'Sorting', 'Monotonic Stack'],
  constraints: '1 <= arr.length <= 2000, 0 <= arr[i] <= 10^8',
  examples: [{ input: '[2,1,3,4,4]', output: '4', explanation: '[2, 1], [3], [4], [4] are the chunks.' }],
  args: [{ name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Monotonic Stack', content: 'Store maximums of chunks in a monotonic stack. Pop if current element is smaller than stack top.' }],
  jsSolution: (arr) => {
    const stack = [];
    for (const num of arr) {
      let curMax = num;
      while (stack.length > 0 && stack[stack.length - 1] > num) {
        curMax = Math.max(curMax, stack.pop());
      }
      stack.push(curMax);
    }
    return stack.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 3, 4, 4]]); cases.push([[5, 4, 3, 2, 1]]); cases.push([[100]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 30), 0, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(30, 200), 0, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(200, 1000), 0, 100000)]);
    }
    return cases;
  }
},

// 16
{
  slug: 'make-the-string-great',
  title: 'Make The String Great',
  description: 'Given a string s of lower and upper case English letters. A good string is a string which doesn\'t have two adjacent characters s[i] and s[i + 1] where s[i] is lower-case and s[i+1] is same letter in upper-case (or vice versa). Return the final good string.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 100, s contains only lowercase and uppercase English letters',
  examples: [{ input: '"leEeetcode"', output: '"leetcode"', explanation: '"eE" gets removed.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Character Casing Stack', content: 'Use a stack. If current char and stack top are opposite cases of the same letter, pop stack top. Else, push.' }],
  jsSolution: (s) => {
    const stack = [];
    for (const c of s) {
      if (stack.length > 0 && Math.abs(stack[stack.length - 1].charCodeAt(0) - c.charCodeAt(0)) === 32) {
        stack.pop();
      } else {
        stack.push(c);
      }
    }
    return stack.join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['leEeetcode']); cases.push(['abBAcC']); cases.push(['s']);
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 20), alphabet)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(20, 60), alphabet)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(60, 100), alphabet)]);
    }
    return cases;
  }
},

// 17
{
  slug: 'baseball-game',
  title: 'Baseball Game',
  description: 'Apply a list of string operations to keep record of baseball scores. return the sum of all scores. Operations: integer x (new score), "+" (new score is sum of last two), "D" (double the last score), "C" (pop last score).',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Simulation'],
  constraints: '1 <= operations.length <= 1000, ops[i] is numeric or "+", "D", "C"',
  examples: [{ input: '["5","2","C","D","+"]', output: '30', explanation: 'Scores: [5], [5,2], [5], [5,10], [5,10,15]. Sum = 30.' }],
  args: [{ name: 'operations', cpp: 'vector<string>', java: 'String[]', py: 'operations: List[str]', js: 'operations' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Record Stack', content: 'Push new values to stack. Pop on "C", double top on "D", sum top two on "+".' }],
  jsSolution: (operations) => {
    const stack = [];
    for (const op of operations) {
      if (op === '+') {
        stack.push((stack[stack.length - 1] || 0) + (stack[stack.length - 2] || 0));
      } else if (op === 'D') {
        stack.push((stack[stack.length - 1] || 0) * 2);
      } else if (op === 'C') {
        stack.pop();
      } else {
        stack.push(parseInt(op, 10));
      }
    }
    return stack.reduce((a, b) => a + b, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([['5', '2', 'C', 'D', '+']]);
    cases.push([['5', '-2', '4', 'C', 'D', '9', '+', '+']]);
    cases.push([['1']]);
    const genOps = (n) => {
      const ops = [];
      let count = 0;
      for (let j = 0; j < n; j++) {
        const r = Math.random();
        if (r < 0.5 || count < 2) {
          ops.push(String(randInt(-100, 100)));
          count++;
        } else if (r < 0.7) {
          ops.push('+');
          count++;
        } else if (r < 0.85) {
          ops.push('D');
          count++;
        } else {
          ops.push('C');
          count--;
        }
      }
      return ops;
    };
    for (let i = 0; i < 47; i++) {
      cases.push([genOps(randInt(2, 20))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genOps(randInt(20, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genOps(randInt(100, 500))]);
    }
    return cases;
  }
},

// 18
{
  slug: 'crawler-log-folder',
  title: 'Crawler Log Folder',
  description: 'Given a list of strings logs representing operations on a folder system, return the minimum number of folder changes to go back to the main directory. Operations: "../" (parent), "./" (current), "x/" (child).',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Array', 'String', 'Stack', 'Simulation'],
  constraints: '1 <= logs.length <= 1000, logs[i] consists of lowercase letters and digits, and ends with "/"',
  examples: [{ input: '["d1/","d2/","../","d21/","./"]', output: '2', explanation: 'Ends up at 2 directories deep.' }],
  args: [{ name: 'logs', cpp: 'vector<string>', java: 'String[]', py: 'logs: List[str]', js: 'logs' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Simulate Depth', content: 'Start at depth 0. Increment on "x/", decrement on "../" (never below 0), ignore "./".' }],
  jsSolution: (logs) => {
    let depth = 0;
    for (const log of logs) {
      if (log === '../') {
        depth = Math.max(0, depth - 1);
      } else if (log !== './') {
        depth++;
      }
    }
    return depth;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([['d1/', 'd2/', '../', 'd21/', './']]);
    cases.push([['d1/', 'd2/', './', 'd3/', '../', 'd31/']]);
    cases.push([['../', '../']]);
    const genLogs = (n) => {
      const logs = [];
      for (let i = 0; i < n; i++) {
        const r = Math.random();
        if (r < 0.6) logs.push(randStr(randInt(1, 5)) + '/');
        else if (r < 0.85) logs.push('../');
        else logs.push('./');
      }
      return logs;
    };
    for (let i = 0; i < 47; i++) {
      cases.push([genLogs(randInt(1, 20))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genLogs(randInt(20, 100))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genLogs(randInt(100, 500))]);
    }
    return cases;
  }
},

// 19
{
  slug: 'final-prices-with-a-special-discount-in-a-shop',
  title: 'Final Prices With a Special Discount',
  description: 'Given the array prices, return an array where the ith element is the final price after applying a special discount equal to the first price to the right that is smaller than or equal to prices[i].',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= prices.length <= 500, 1 <= prices[i] <= 1000',
  examples: [{ input: '[8,4,6,2,3]', output: '[4,2,4,2,3]', explanation: '8 gets discount of 4 (final 4), 4 gets 2 (final 2), 6 gets 2 (final 4), 2 gets 0 (final 2), 3 gets 0 (final 3).' }],
  args: [{ name: 'prices', cpp: 'vector<int>', java: 'int[]', py: 'prices: List[int]', js: 'prices' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack', content: 'Keep indices of prices in a monotonic increasing stack. Update final price when a smaller or equal price is found.' }],
  jsSolution: (prices) => {
    const res = [...prices];
    const stack = [];
    for (let i = 0; i < prices.length; i++) {
      while (stack.length > 0 && prices[stack[stack.length - 1]] >= prices[i]) {
        const idx = stack.pop();
        res[idx] -= prices[i];
      }
      stack.push(i);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[8, 4, 6, 2, 3]]); cases.push([[1, 2, 3, 4, 5]]); cases.push([[10, 1, 1, 6]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 20), 1, 50)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(20, 100), 1, 200)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(100, 400), 1, 1000)]);
    }
    return cases;
  }
},

// 20
{
  slug: 'minimum-cost-tree-from-leaf-values',
  title: 'Minimum Cost Tree From Leaf Values',
  description: 'Given an array of positive integers arr representing leaf values in an in-order traversal, return the smallest possible sum of values of each non-leaf node.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
  constraints: '2 <= arr.length <= 40, 1 <= arr[i] <= 15',
  examples: [{ input: '[6,2,4]', output: '32', explanation: 'Root gets max(6)*max(2,4) = 24. Leaf nodes: 6 and 2*4. Non-leaf sum = 24 + 8 = 32.' }],
  args: [{ name: 'arr', cpp: 'vector<int>', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Reduce Larger Leaf Pairs First', content: 'Find local minimum leaf value, multiply with minimum of its neighbors, delete the local minimum, and repeat.' }],
  jsSolution: (arr) => {
    let res = 0;
    const stack = [Infinity];
    for (const x of arr) {
      while (stack[stack.length - 1] <= x) {
        const mid = stack.pop();
        res += mid * Math.min(stack[stack.length - 1], x);
      }
      stack.push(x);
    }
    while (stack.length > 2) {
      res += stack.pop() * stack[stack.length - 1];
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[6, 2, 4]]); cases.push([[4, 11]]); cases.push([[1, 2, 3, 4]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(2, 10), 1, 10)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(10, 25), 1, 15)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(25, 40), 1, 15)]);
    }
    return cases;
  }
},

// 21
{
  slug: 'remove-all-adjacent-duplicates-in-string',
  title: 'Remove All Adjacent Duplicates In String',
  description: 'You are given a string s consisting of lowercase English letters. Repeatedly remove duplicate adjacent letters until no two adjacent letters are equal. Return the final string.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 10^5, s consists of lowercase English letters',
  examples: [{ input: '"abbaca"', output: '"ca"', explanation: 'abbaca -> aaca -> ca.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Iterative Deletion', content: 'Use a stack. For each letter, if matches top, pop. Else, push.' }],
  jsSolution: (s) => {
    const stack = [];
    for (const c of s) {
      if (stack.length > 0 && stack[stack.length - 1] === c) {
        stack.pop();
      } else {
        stack.push(c);
      }
    }
    return stack.join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['abbaca']); cases.push(['azxxzy']); cases.push(['a']);
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 30))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(30, 200))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(200, 1000))]);
    }
    return cases;
  }
},

// 22
{
  slug: 'maximum-nesting-depth-of-the-parentheses',
  title: 'Maximum Nesting Depth of the Parentheses',
  description: 'Given a valid parentheses string s, return the maximum nesting depth of s.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 100, s consists of digits, parentheses, and math operations',
  examples: [{ input: '"(1+(2*3)+((8)/4))+1"', output: '3', explanation: 'The digit 8 is inside 3 nested parentheses.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Depth', content: 'Increment depth on \'(\' and decrement on \')\'. Keep maximum value of depth.' }],
  jsSolution: (s) => {
    let maxDepth = 0, current = 0;
    for (const c of s) {
      if (c === '(') {
        current++;
        maxDepth = Math.max(maxDepth, current);
      } else if (c === ')') {
        current--;
      }
    }
    return maxDepth;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['(1+(2*3)+((8)/4))+1']); cases.push(['(1)+((2))+(((3)))']); cases.push(['1']);
    const genExpr = (depth) => {
      if (depth === 0) return String(randInt(1, 9));
      const r = Math.random();
      if (r < 0.4) return '(' + genExpr(depth - 1) + '+' + genExpr(depth - 1) + ')';
      return genExpr(depth - 1) + '*' + genExpr(depth - 1);
    };
    for (let i = 0; i < 47; i++) {
      cases.push([genExpr(randInt(0, 3))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genExpr(randInt(3, 5))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genExpr(randInt(5, 8))]);
    }
    return cases;
  }
},

// 23
{
  slug: 'decoded-string-at-index',
  title: 'Decoded String at Index',
  description: 'You are given an encoded string s and an integer k. Decode the string by writing letters directly and repeating the current decoded string d-1 times when a digit d is met. Return the kth letter (1-indexed).',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Two Pointers'],
  constraints: '2 <= s.length <= 100, s consists of lowercase letters and digits 2-9, s starts with a letter, 1 <= k <= 10^9, Decoded string is guaranteed to have less than 2^63 letters.',
  examples: [{ input: '"leet2code3", 10', output: '"o"', explanation: 'Decoded: "leetleetcodeleetleetcodeleetleetcode". The 10th letter is "o".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Work Backwards', content: 'First calculate total decoded length. Then iterate backwards, reducing K modulo current length when a digit is met.' }],
  jsSolution: (s, k) => {
    let size = 0n;
    for (const c of s) {
      if (c >= '0' && c <= '9') {
        size *= BigInt(c - '0');
      } else {
        size++;
      }
    }
    let BigK = BigInt(k);
    for (let i = s.length - 1; i >= 0; i--) {
      const c = s[i];
      BigK %= size;
      if (BigK === 0n && !(c >= '0' && c <= '9')) {
        return c;
      }
      if (c >= '0' && c <= '9') {
        size /= BigInt(c - '0');
      } else {
        size--;
      }
    }
    return '';
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['leet2code3', 10]);
    cases.push(['ha22', 5]);
    cases.push(['a234567899b', 1]);
    const genDecoded = () => {
      // Create a valid string whose size is not too large
      let s = randStr(randInt(2, 6), 'abcdefghijklmnopqrstuvwxyz');
      let size = s.length;
      for (let i = 0; i < 3; i++) {
        const digit = randInt(2, 4);
        s += digit;
        size *= digit;
        const add = randStr(randInt(1, 3), 'abcdefghijklmnopqrstuvwxyz');
        s += add;
        size += add.length;
      }
      const k = randInt(1, Math.min(size, 100000));
      return [s, k];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genDecoded());
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genDecoded());
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genDecoded());
    }
    return cases;
  }
},

// 24
{
  slug: 'number-of-visible-people-in-a-queue',
  title: 'Number of Visible People in a Queue',
  description: 'There are n people standing in a queue. You are given an array heights of distinct integers where heights[i] represents the height of the ith person. Return an array answer where answer[i] is the number of people the ith person can see to their right in the queue.',
  difficulty: 'Hard',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= heights.length <= 10^5, 1 <= heights[i] <= 10^5, all integers in heights are unique',
  examples: [{ input: '[10,6,8,5,11,9]', output: '[3,1,2,1,1,0]', explanation: '10 sees 6, 8, 11 (3 people). 6 sees 8 (1 person). 8 sees 5, 11 (2 people). 5 sees 11 (1 person). 11 sees 9 (1 person). 9 sees nobody.' }],
  args: [{ name: 'heights', cpp: 'vector<int>', java: 'int[]', py: 'heights: List[int]', js: 'heights' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Decreasing Stack', content: 'Iterate backwards. Keep a monotonic decreasing stack of heights. The number of pops + 1 (if stack is not empty) is the answer.' }],
  jsSolution: (heights) => {
    const n = heights.length;
    const res = Array(n).fill(0);
    const stack = [];
    for (let i = n - 1; i >= 0; i--) {
      let count = 0;
      while (stack.length > 0 && heights[i] > stack[stack.length - 1]) {
        stack.pop();
        count++;
      }
      if (stack.length > 0) count++;
      res[i] = count;
      stack.push(heights[i]);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[10, 6, 8, 5, 11, 9]]); cases.push([[5, 1, 2, 3, 10]]); cases.push([[1, 2]]);
    const genDistinct = (n) => {
      const set = new Set();
      while (set.size < n) set.add(randInt(1, n * 3));
      return [...set];
    };
    for (let i = 0; i < 47; i++) {
      cases.push([genDistinct(randInt(1, 50))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genDistinct(randInt(50, 400))]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([genDistinct(randInt(400, 2000))]);
    }
    return cases;
  }
},

// 25
{
  slug: 'check-if-a-parentheses-string-can-be-valid',
  title: 'Check if a Parentheses String Can Be Valid',
  description: 'You are given a parentheses string s and a binary string locked where locked[i] is \'1\' if s[i] cannot be changed, and \'0\' if it can be changed. Return true if we can make s valid.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Greedy'],
  constraints: 'n == s.length, locked.length == s.length, 1 <= n <= 10^5, s[i] is \'(\' or \')\', locked[i] is \'0\' or \'1\'',
  examples: [{ input: '"))()))", "010100"', output: 'true', explanation: 'Indices 0, 2, 4, 5 are unlocked and can be modified to balance the locked parenthesis.' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'locked', cpp: 'string', java: 'String', py: 'locked: str', js: 'locked' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Track Indices of Open Brackets', content: 'Maintain two stacks: one for locked \'(\' indices, and one for unlocked indices. Balance them.' }],
  jsSolution: (s, locked) => {
    if (s.length % 2 !== 0) return false;
    let open = [], unlocked = [];
    for (let i = 0; i < s.length; i++) {
      if (locked[i] === '0') {
        unlocked.push(i);
      } else if (s[i] === '(') {
        open.push(i);
      } else if (s[i] === ')') {
        if (open.length > 0) open.pop();
        else if (unlocked.length > 0) unlocked.pop();
        else return false;
      }
    }
    while (open.length > 0 && unlocked.length > 0) {
      if (open[open.length - 1] < unlocked[unlocked.length - 1]) {
        open.pop();
        unlocked.pop();
      } else {
        break;
      }
    }
    return open.length === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['))()))', '010100']);
    cases.push(['()()', '0000']);
    cases.push([')', '0']);
    const genPair = (n) => {
      const s = randStr(n, '()');
      const locked = randStr(n, '01');
      return [s, locked];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genPair(randInt(1, 25) * 2));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPair(randInt(25, 200) * 2));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPair(randInt(200, 1000) * 2));
    }
    return cases;
  }
},

// 26
{
  slug: 'next-greater-element-right',
  title: 'Next Greater Element',
  description: 'Given an array of integers nums, find the next greater element for each element. The next greater element of an element x is the first element to its right that is strictly greater than x. If it does not exist, return -1 for this element.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,3,2,4]', output: '[3,4,4,-1]', explanation: '1 gets 3, 3 gets 4, 2 gets 4, 4 gets -1.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Indices Stack', content: 'Push indices to a monotonic decreasing stack. When meeting a larger value, pop stack top and assign value.' }],
  jsSolution: (nums) => {
    const res = Array(nums.length).fill(-1);
    const stack = [];
    for (let i = 0; i < nums.length; i++) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
        res[stack.pop()] = nums[i];
      }
      stack.push(i);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 2, 4]]); cases.push([[5, 4, 3, 2, 1]]); cases.push([[10]]);
    for (let i = 0; i < 47; i++) {
      cases.push([randArr(randInt(1, 50), -100, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(50, 400), -1000, 1000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randArr(randInt(400, 2000), -10000, 10000)]);
    }
    return cases;
  }
},

// 27
{
  slug: 'minimum-insertions-to-balance-a-parentheses-string',
  title: 'Minimum Insertions to Balance Parentheses',
  description: 'Given a parentheses string s containing only \'(\' and \')\', a parentheses string is balanced if \'(\' is paired with two consecutive \')\'. Return the minimum insertions to balance s.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Greedy'],
  constraints: '1 <= s.length <= 10^5, s consists of only \'(\' and \')\'',
  examples: [{ input: '"(()))"', output: '1', explanation: 'One \')\' insertion is needed at the end.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Track Double Right Brackets', content: 'Count opening brackets. When a \')\' is met, check if next character is also \')\'. If not, we insert one.' }],
  jsSolution: (s) => {
    let insertions = 0, open = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') {
        open++;
      } else {
        if (i + 1 < s.length && s[i + 1] === ')') {
          i++;
        } else {
          insertions++;
        }
        if (open > 0) open--;
        else insertions++;
      }
    }
    return insertions + open * 2;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['(()))']); cases.push(['())']); cases.push(['))())(']);
    for (let i = 0; i < 47; i++) {
      cases.push([randStr(randInt(1, 50), '()')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(50, 400), '()')]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randStr(randInt(400, 2000), '()')]);
    }
    return cases;
  }
},

// 28
{
  slug: 'find-the-most-competitive-subsequence',
  title: 'Find the Most Competitive Subsequence',
  description: 'Given an integer array nums and a positive integer k, return the most competitive subsequence of nums of size k. An array a is more competitive than b if at the first index they differ, a[i] < b[i].',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Greedy', 'Monotonic Stack'],
  constraints: '1 <= nums.length <= 10^5, 0 <= nums[i] <= 10^9, 1 <= k <= nums.length',
  examples: [{ input: '[3,5,2,6], 2', output: '[2,6]', explanation: 'Subsequence of size 2: [3,5], [3,2], [3,6], [5,2], [5,6], [2,6]. [2,6] is the most competitive.' }],
  args: [
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack of size K', content: 'Maintain an increasing stack of elements. We can pop elements only if we still have enough elements left in nums to complete size K.' }],
  jsSolution: (nums, k) => {
    const stack = [];
    let rem = nums.length - k;
    for (const num of nums) {
      while (stack.length > 0 && stack[stack.length - 1] > num && rem > 0) {
        stack.pop();
        rem--;
      }
      stack.push(num);
    }
    return stack.slice(0, k);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 2, 6], 2]);
    cases.push([[2, 4, 3, 3, 5, 4, 9, 6], 4]);
    cases.push([[1], 1]);
    const genPair = (n) => {
      const arr = randArr(n, 1, n * 2);
      const k = randInt(1, n);
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) {
      cases.push(genPair(randInt(1, 50)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPair(randInt(50, 400)));
    }
    for (let i = 0; i < 50; i++) {
      cases.push(genPair(randInt(400, 2000)));
    }
    return cases;
  }
}

];

export default problems;
