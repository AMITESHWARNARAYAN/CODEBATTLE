// Bit Manipulation — Batch 2 (2 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'minimum-bit-flips-to-convert-number',
  title: 'Minimum Bit Flips to Convert Number',
  description: 'A bit flip of a number x is choosing a bit in the binary representation of x and flipping it from either 0 to 1 or 1 to 0. Given two integers start and goal, return the minimum number of bit flips to convert start to goal.',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  tags: ['Bit Manipulation'],
  constraints: '0 <= start, goal <= 10^9',
  examples: [
    { input: '10, 7', output: '3', explanation: '10 is 1010 in binary, and 7 is 0111. We need to flip bits at 0, 1, and 3, which is 3 flips.' }
  ],
  args: [
    { name: 'start', cpp: 'int', java: 'int', py: 'start: int', js: 'start' },
    { name: 'goal', cpp: 'int', java: 'int', py: 'goal: int', js: 'goal' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [
    { title: 'XOR Difference', content: 'Use XOR operation start ^ goal to find positions where bits differ. The number of set bits in the result is the answer.' }
  ],
  jsSolution: (start, goal) => {
    let xor = start ^ goal;
    let count = 0;
    while (xor > 0) {
      count += xor & 1;
      xor >>= 1;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([10, 7]);
    cases.push([3, 4]);
    for (let i = 0; i < 48; i++) {
      cases.push([randInt(0, 100), randInt(0, 100)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100, 100000), randInt(100, 100000)]);
    }
    for (let i = 0; i < 50; i++) {
      cases.push([randInt(100000, 1000000000), randInt(100000, 1000000000)]);
    }
    return cases;
  }
},

// 2
{
  slug: 'maximum-length-of-a-concatenated-string-with-unique-characters',
  title: 'Maximum Length of a Concatenated String with Unique Characters',
  description: 'You are given an array of strings arr. A string s is formed by the concatenation of a subsequence of arr that has unique characters. Return the maximum possible length of s.',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  tags: ['Array', 'String', 'Backtracking', 'Bit Manipulation'],
  constraints: '1 <= arr.length <= 16. 1 <= arr[i].length <= 26. arr[i] contains only lowercase English letters.',
  examples: [
    { input: '["un","iq","ue"]', output: '4', explanation: 'All unique combinations are "un", "iq", "ue", "uniq" (len 4), "ique" (len 4).' }
  ],
  args: [
    { name: 'arr', cpp: 'vector<string>&', java: 'List<String>', py: 'arr: List[str]', js: 'arr' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [
    { title: 'Bitmask representation', content: 'Represent each string in arr as a bitmask of characters. Filter out strings with duplicate characters. Use backtracking to combine masks with zero bitwise AND and track the maximum length.' }
  ],
  jsSolution: (arr) => {
    const masks = [];
    for (let i = 0; i < arr.length; i++) {
      const s = arr[i];
      let mask = 0;
      let dup = false;
      for (let j = 0; j < s.length; j++) {
        const c = s.charCodeAt(j) - 97;
        if ((mask & (1 << c)) !== 0) {
          dup = true;
          break;
        }
        mask |= 1 << c;
      }
      if (!dup) {
        masks.push({ mask, len: s.length });
      }
    }

    let maxLen = 0;
    const dfs = (idx, currMask, currLen) => {
      maxLen = Math.max(maxLen, currLen);
      for (let i = idx; i < masks.length; i++) {
        if ((currMask & masks[i].mask) === 0) {
          dfs(i + 1, currMask | masks[i].mask, currLen + masks[i].len);
        }
      }
    };
    dfs(0, 0, 0);
    return maxLen;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["un", "iq", "ue"]]);
    cases.push([["cha", "r", "act", "ers"]]);
    cases.push([["abcdefghijklmnopqrstuvwxyz"]]);
    
    const gen = (n, maxStrLen) => {
      const list = [];
      for (let i = 0; i < n; i++) {
        list.push(randStr(randInt(1, maxStrLen)));
      }
      return [list];
    };

    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 6), 3));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12), 4));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 16), 5));
    return cases;
  }
}

];
