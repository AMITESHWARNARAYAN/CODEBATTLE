// Stack — Batch 1 (22 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'min-stack-problem',
  title: 'Min Stack Operations',
  description: 'Given a sequence of stack operations ("push", "pop", "top", "getMin") and their corresponding values, return an array of outputs. "push" returns null, "pop" returns null, "top" returns the top element, "getMin" returns the minimum element in the stack.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Stack', 'Design'],
  constraints: '1 <= operations.length <= 10^4',
  examples: [{ input: '["push", "push", "push", "getMin", "pop", "top", "getMin"], [[-2], [0], [-3], [], [], [], []]', output: '[null, null, null, -3, null, 0, -2]', explanation: 'Min stack actions.' }],
  args: [
    { name: 'ops', cpp: 'vector<string>', java: 'String[]', py: 'ops: List[str]', js: 'ops' },
    { name: 'vals', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'vals: List[List[int]]', js: 'vals' }
  ],
  retType: { cpp: 'vector<string>', java: 'String[]', py: 'List[str]' },
  hints: [{ title: 'Two Stacks', content: 'Use an auxiliary stack to store the minimum value at each state.' }],
  jsSolution: (ops, vals) => {
    const stack = [];
    const minStack = [];
    const res = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op === 'push') {
        const val = vals[i][0];
        stack.push(val);
        if (minStack.length === 0 || val <= minStack[minStack.length - 1]) minStack.push(val);
        res.push('null');
      } else if (op === 'pop') {
        if (stack.length > 0) {
          const val = stack.pop();
          if (val === minStack[minStack.length - 1]) minStack.pop();
        }
        res.push('null');
      } else if (op === 'top') {
        res.push(stack.length > 0 ? String(stack[stack.length - 1]) : 'null');
      } else if (op === 'getMin') {
        res.push(minStack.length > 0 ? String(minStack[minStack.length - 1]) : 'null');
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([
      ['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
      [[-2], [0], [-3], [], [], [], []]
    ]);
    for (let i = 0; i < 49; i++) {
      const len = randInt(10, 50);
      const ops = [];
      const vals = [];
      let count = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4 || count === 0) {
          ops.push('push');
          vals.push([randInt(-100, 100)]);
          count++;
        } else if (r < 0.6) {
          ops.push('pop');
          vals.push([]);
          count--;
        } else if (r < 0.8) {
          ops.push('top');
          vals.push([]);
        } else {
          ops.push('getMin');
          vals.push([]);
        }
      }
      cases.push([ops, vals]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 200);
      const ops = [];
      const vals = [];
      let count = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4 || count === 0) {
          ops.push('push');
          vals.push([randInt(-1000, 1000)]);
          count++;
        } else if (r < 0.6) {
          ops.push('pop');
          vals.push([]);
          count--;
        } else if (r < 0.8) {
          ops.push('top');
          vals.push([]);
        } else {
          ops.push('getMin');
          vals.push([]);
        }
      }
      cases.push([ops, vals]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(200, 1000);
      const ops = [];
      const vals = [];
      let count = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4 || count === 0) {
          ops.push('push');
          vals.push([randInt(-100000, 100000)]);
          count++;
        } else if (r < 0.6) {
          ops.push('pop');
          vals.push([]);
          count--;
        } else if (r < 0.8) {
          ops.push('top');
          vals.push([]);
        } else {
          ops.push('getMin');
          vals.push([]);
        }
      }
      cases.push([ops, vals]);
    }
    return cases;
  }
},

// 2
{
  slug: 'evaluate-reverse-polish-notation',
  title: 'Evaluate Reverse Polish Notation',
  description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /. Each operand may be an integer or another expression. Division between two integers should truncate toward zero.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Math', 'Stack'],
  constraints: '1 <= tokens.length <= 10^4, tokens[i] is operator or integer in range [-200, 200]',
  examples: [{ input: '["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9.' }],
  args: [{ name: 'tokens', cpp: 'vector<string>', java: 'String[]', py: 'tokens: List[str]', js: 'tokens' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Using Stack', content: 'Push operands onto stack. When operator is found, pop two, apply operation, and push result.' }],
  jsSolution: (tokens) => {
    const stack = [];
    for (const t of tokens) {
      if (['+', '-', '*', '/'].includes(t)) {
        const b = stack.pop();
        const a = stack.pop();
        if (t === '+') stack.push(a + b);
        else if (t === '-') stack.push(a - b);
        else if (t === '*') stack.push(a * b);
        else if (t === '/') {
          const div = a / b;
          stack.push(div < 0 ? Math.ceil(div) : Math.floor(div));
        }
      } else {
        stack.push(Number(t));
      }
    }
    return stack[0];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([['2', '1', '+', '3', '*']]);
    cases.push([['4', '13', '5', '/', '+']]);
    cases.push([['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']]);
    const genExpr = (depth) => {
      if (depth === 0) return [String(randInt(1, 10))];
      const left = genExpr(depth - 1);
      const right = genExpr(depth - 1);
      const ops = ['+', '-', '*', '/'];
      const op = ops[randInt(0, 3)];
      return [...left, ...right, op];
    };
    for (let i = 0; i < 47; i++) cases.push([genExpr(randInt(1, 3))]);
    for (let i = 0; i < 50; i++) cases.push([genExpr(randInt(3, 5))]);
    for (let i = 0; i < 50; i++) cases.push([genExpr(randInt(5, 7))]);
    return cases;
  }
},

// 3
{
  slug: 'generate-parentheses',
  title: 'Generate Parentheses',
  description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Dynamic Programming', 'Backtracking'],
  constraints: '1 <= n <= 8',
  examples: [{ input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: 'All 5 combinations of size 3.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Backtracking', content: 'Only add close parenthesis if it is less than open.' }],
  jsSolution: (n) => {
    const res = [];
    const backtrack = (curr, open, close) => {
      if (curr.length === 2 * n) { res.push(curr); return; }
      if (open < n) backtrack(curr + '(', open + 1, close);
      if (close < open) backtrack(curr + ')', open, close + 1);
    };
    backtrack('', 0, 0);
    return res.sort();
  },
  inputGenerator: () => {
    const cases = [];
    for (let i = 1; i <= 8; i++) cases.push([i]);
    while (cases.length < 150) {
      cases.push([randInt(1, 8)]);
    }
    return cases;
  }
},

// 4
{
  slug: 'daily-temperatures',
  title: 'Daily Temperatures',
  description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future day, keep answer[i] == 0.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= temperatures.length <= 10^5, 30 <= temperatures[i] <= 100',
  examples: [{ input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Warmer temperatures.' }],
  args: [{ name: 'temperatures', cpp: 'vector<int>', java: 'int[]', py: 'temperatures: List[int]', js: 'temperatures' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack', content: 'Maintain a decreasing stack of indices.' }],
  jsSolution: (temperatures) => {
    const res = Array(temperatures.length).fill(0);
    const stack = [];
    for (let i = 0; i < temperatures.length; i++) {
      while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
        const idx = stack.pop();
        res[idx] = i - idx;
      }
      stack.push(i);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[73, 74, 75, 71, 69, 72, 76, 73]]); cases.push([[30, 40, 50, 60]]); cases.push([[60, 50, 40, 30]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), 30, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 30, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 10000), 30, 100)]);
    return cases;
  }
},

// 5
{
  slug: 'car-fleet',
  title: 'Car Fleet',
  description: 'There are n cars at positions on a 1D road traveling to a destination. Given arrays position and speed, and integer target, return the number of car fleets that will arrive at the destination.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Sorting', 'Monotonic Stack'],
  constraints: '1 <= position.length <= 10^5, speed.length == position.length, 0 < target <= 10^6, all positions distinct',
  examples: [{ input: '12, [10,8,0,5,3], [2,4,1,1,3]', output: '3', explanation: 'Three fleets will arrive.' }],
  args: [
    { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' },
    { name: 'position', cpp: 'vector<int>', java: 'int[]', py: 'position: List[int]', js: 'position' },
    { name: 'speed', cpp: 'vector<int>', java: 'int[]', py: 'speed: List[int]', js: 'speed' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Calculate Time', content: 'Sort cars by starting position descending. Calculate arrival time. If current car takes less or equal time than previous, it joins previous fleet.' }],
  jsSolution: (target, position, speed) => {
    if (position.length === 0) return 0;
    const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]);
    let fleets = 0, maxTime = 0;
    for (const [p, s] of cars) {
      const time = (target - p) / s;
      if (time > maxTime) { fleets++; maxTime = time; }
    }
    return fleets;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]]); cases.push([10, [3], [3]]); cases.push([100, [0, 2, 4], [4, 2, 1]]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 50); const t = randInt(n + 10, n + 100);
      const pos = []; const s = randArr(n, 1, 10);
      const set = new Set();
      while (set.size < n) set.add(randInt(0, t - 1));
      cases.push([t, [...set], s]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500); const t = randInt(n + 10, n + 1000);
      const s = randArr(n, 1, 50);
      const set = new Set();
      while (set.size < n) set.add(randInt(0, t - 1));
      cases.push([t, [...set], s]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 5000); const t = randInt(n + 5000, n + 50000);
      const s = randArr(n, 1, 100);
      const set = new Set();
      while (set.size < n) set.add(randInt(0, t - 1));
      cases.push([t, [...set], s]);
    }
    return cases;
  }
},

// 6
{
  slug: 'simplify-path',
  title: 'Simplify Path',
  description: 'Given an absolute Unix-style path, simplify it to the canonical path (resolving "." and "..").',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= path.length <= 3000, path starts with "/"',
  examples: [{ input: '"/home//foo/"', output: '"/home/foo"', explanation: 'Double slash simplified, trailing slash removed.' }],
  args: [{ name: 'path', cpp: 'string', java: 'String', py: 'path: str', js: 'path' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Split and Process', content: 'Split path by "/". Use a stack to track directory names. Pop on "..", skip "." and empty parts.' }],
  jsSolution: (path) => {
    const stack = [];
    const parts = path.split('/');
    for (const p of parts) {
      if (p === '..') { if (stack.length > 0) stack.pop(); }
      else if (p && p !== '.') { stack.push(p); }
    }
    return '/' + stack.join('/');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['/home/']); cases.push(['/../']); cases.push(['/home//foo/']); cases.push(['/a/./b/../../c/']);
    const chars = 'abcdef/..';
    for (let i = 0; i < 46; i++) {
      const len = randInt(1, 50);
      cases.push(['/' + Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 200);
      cases.push(['/' + Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(200, 1000);
      cases.push(['/' + Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    }
    return cases;
  }
},

// 7
{
  slug: 'decode-string',
  title: 'Decode String',
  description: 'Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. You may assume that the input string is always valid.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Recursion'],
  constraints: '1 <= s.length <= 300, s consists of lowercase English letters, digits, and square brackets',
  examples: [{ input: '"3[a]2[bc]"', output: '"aaabcbc"', explanation: 'Decodes successfully.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Using Stack', content: 'Use stack to keep track of repeat counts and previously decoded strings.' }],
  jsSolution: (s) => {
    const numStack = [];
    const strStack = [];
    let curStr = '';
    let curNum = 0;
    for (const c of s) {
      if (c >= '0' && c <= '9') {
        curNum = curNum * 10 + Number(c);
      } else if (c === '[') {
        numStack.push(curNum);
        strStack.push(curStr);
        curNum = 0;
        curStr = '';
      } else if (c === ']') {
        const repeat = numStack.pop();
        const prev = strStack.pop();
        curStr = prev + curStr.repeat(repeat);
      } else {
        curStr += c;
      }
    }
    return curStr;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['3[a]2[bc]']); cases.push(['3[a2[c]]']); cases.push(['2[abc]3[cd]ef']);
    const genNested = (depth) => {
      if (depth === 0) return randStr(randInt(1, 3));
      const r = randInt(1, 5);
      return `${r}[${genNested(depth - 1)}]` + randStr(randInt(0, 2));
    };
    for (let i = 0; i < 47; i++) cases.push([genNested(randInt(1, 2))]);
    for (let i = 0; i < 50; i++) cases.push([genNested(randInt(2, 3))]);
    for (let i = 0; i < 50; i++) cases.push([genNested(randInt(3, 4))]);
    return cases;
  }
},

// 8
{
  slug: 'asteroid-collision',
  title: 'Asteroid Collision',
  description: 'We are given an array of integers representing asteroids in a row. The absolute value represents its size, and the sign represents its direction (positive for right, negative for left). Find the state of the asteroids after all collisions.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack'],
  constraints: '2 <= asteroids.length <= 10^4, -1000 <= asteroids[i] <= 1000, asteroids[i] != 0',
  examples: [{ input: '[5,10,-5]', output: '[5,10]', explanation: '10 and -5 collide, 10 wins. 5 and 10 move in same direction.' }],
  args: [{ name: 'asteroids', cpp: 'vector<int>', java: 'int[]', py: 'asteroids: List[int]', js: 'asteroids' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Stack Collision Logic', content: 'Push right-moving asteroids. For left-moving asteroids, resolve collisions with stack top.' }],
  jsSolution: (asteroids) => {
    const stack = [];
    for (const ast of asteroids) {
      let alive = true;
      while (stack.length > 0 && ast < 0 && stack[stack.length - 1] > 0) {
        const top = stack[stack.length - 1];
        if (Math.abs(ast) > Math.abs(top)) { stack.pop(); continue; }
        else if (Math.abs(ast) === Math.abs(top)) { stack.pop(); }
        alive = false; break;
      }
      if (alive) stack.push(ast);
    }
    return stack;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 10, -5]]); cases.push([[8, -8]]); cases.push([[10, 2, -5]]);
    const genAst = (n) => {
      const arr = [];
      for (let i = 0; i < n; i++) {
        let v = randInt(-100, 100);
        while (v === 0) v = randInt(-100, 100);
        arr.push(v);
      }
      return arr;
    };
    for (let i = 0; i < 47; i++) cases.push([genAst(randInt(2, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genAst(randInt(50, 500))]);
    for (let i = 0; i < 50; i++) cases.push([genAst(randInt(500, 5000))]);
    return cases;
  }
},

// 9
{
  slug: 'online-stock-span',
  title: 'Online Stock Span',
  description: 'Write a class that collects daily price quotes for some stock, and returns the span of that stock\'s price for the current day. The span of the stock\'s price today is defined as the maximum number of consecutive days (starting from today and going backwards) for which the price of the stock was less than or equal to today\'s price. Return results of sequence of stock prices.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Stack', 'Design', 'Monotonic Stack'],
  constraints: '1 <= prices.length <= 10^4',
  examples: [{ input: '[100,80,60,70,60,75,85]', output: '[1,1,1,2,1,4,6]', explanation: 'Span for each quote.' }],
  args: [{ name: 'prices', cpp: 'vector<int>', java: 'int[]', py: 'prices: List[int]', js: 'prices' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack of Pairs', content: 'Push pairs [price, span] onto monotonic stack. If current price >= top, add top\'s span and pop.' }],
  jsSolution: (prices) => {
    const stack = []; // [price, span]
    const res = [];
    for (const p of prices) {
      let span = 1;
      while (stack.length > 0 && stack[stack.length - 1][0] <= p) {
        span += stack.pop()[1];
      }
      stack.push([p, span]);
      res.push(span);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[100, 80, 60, 70, 60, 75, 85]]); cases.push([[10, 20, 30, 40, 50]]); cases.push([[50, 40, 30, 20, 10]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), 1, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), 1, 10000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), 1, 100000)]);
    return cases;
  }
},

// 10
{
  slug: 'score-of-parentheses',
  title: 'Score of Parentheses',
  description: 'Given a balanced parentheses string s, return the score of the string: "()" has score 1, AB has score A + B, and (A) has score 2 * A.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '2 <= s.length <= 100, s is balanced parentheses',
  examples: [{ input: '"(())"', output: '2', explanation: '(() has score 1, (( )) has score 2.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Depth Score', content: 'Track current depth. Add 2^depth when you see "()".' }],
  jsSolution: (s) => {
    let score = 0, depth = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') depth++;
      else {
        depth--;
        if (s[i - 1] === '(') score += 1 << depth;
      }
    }
    return score;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['(())']); cases.push(['()']); cases.push(['()()']); cases.push(['(()(()))']);
    const genBalanced = (depth) => {
      if (depth === 0) return '()';
      if (Math.random() < 0.5) return '()' + genBalanced(depth - 1);
      return '(' + genBalanced(depth - 1) + ')';
    };
    for (let i = 0; i < 46; i++) cases.push([genBalanced(randInt(1, 5))]);
    for (let i = 0; i < 50; i++) cases.push([genBalanced(randInt(5, 15))]);
    for (let i = 0; i < 50; i++) cases.push([genBalanced(randInt(15, 30))]);
    return cases;
  }
},

// 11
{
  slug: 'valid-parenthesis-string',
  title: 'Valid Parenthesis String',
  description: 'Given a string s containing only three types of characters: "(", ")" and "*", return true if s is valid. "*" can act as "(", ")" or empty.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Greedy', 'Dynamic Programming'],
  constraints: '1 <= s.length <= 100',
  examples: [{ input: '"(*)"', output: 'true', explanation: '"*" acts as empty/none.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Min Max Open', content: 'Track min and max possible open brackets. minOpen cannot go below 0. Check if minOpen is 0 at the end.' }],
  jsSolution: (s) => {
    let minO = 0, maxO = 0;
    for (const c of s) {
      if (c === '(') { minO++; maxO++; }
      else if (c === ')') { minO--; maxO--; }
      else { minO--; maxO++; }
      if (maxO < 0) return false;
      if (minO < 0) minO = 0;
    }
    return minO === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['(*)']); cases.push(['()']); cases.push(['(*))']); cases.push(['(']); cases.push(['*']);
    const chars = '()*';
    for (let i = 0; i < 45; i++) cases.push([Array.from({ length: randInt(1, 15) }, () => chars[randInt(0, 2)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(15, 50) }, () => chars[randInt(0, 2)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(50, 100) }, () => chars[randInt(0, 2)]).join('')]);
    return cases;
  }
},

// 12
{
  slug: 'next-greater-element-ii',
  title: 'Next Greater Element II',
  description: 'Given a circular integer array nums, return the next greater number for every element in nums. The next greater number of nums[i] is the first greater number in its next traversal, searching circularly.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Monotonic Stack'],
  constraints: '1 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
  examples: [{ input: '[1,2,1]', output: '[2,-1,2]', explanation: 'Next greater circular.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Double Traversal Stack', content: 'Iterate the array twice, push indices to monotonic decreasing stack.' }],
  jsSolution: (nums) => {
    const n = nums.length;
    const res = Array(n).fill(-1);
    const stack = [];
    for (let i = 0; i < 2 * n; i++) {
      while (stack.length > 0 && nums[i % n] > nums[stack[stack.length - 1]]) {
        res[stack.pop()] = nums[i % n];
      }
      if (i < n) stack.push(i);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 1]]); cases.push([[5, 4, 3, 2, 1]]); cases.push([[1, 2, 3, 4, 5]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 500), -1000, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(500, 5000), -1000000, 1000000)]);
    return cases;
  }
},

// 13
{
  slug: 'minimum-remove-to-make-valid-parentheses',
  title: 'Minimum Remove to Make Valid Parentheses',
  description: 'Given a string s of "(" , ")" and lowercase English characters, remove the minimum number of parentheses in any positions so that the resulting parentheses string is valid and return any valid string.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 10^5, s[i] is "(", ")" or lowercase English letter',
  examples: [{ input: '"lee(t(c)o)de)"', output: '"lee(t(c)o)de"', explanation: 'Remove last closing parenthesis.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Using Stack for Indices', content: 'Keep track of open parentheses indices. For close parentheses, pop or mark for removal if stack is empty.' }],
  jsSolution: (s) => {
    const stack = [];
    const remove = new Set();
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') stack.push(i);
      else if (s[i] === ')') {
        if (stack.length > 0) stack.pop();
        else remove.add(i);
      }
    }
    while (stack.length > 0) remove.add(stack.pop());
    let res = '';
    for (let i = 0; i < s.length; i++) if (!remove.has(i)) res += s[i];
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['lee(t(c)o)de)']); cases.push(['a)b(c)d']); cases.push(['))((']); cases.push(['a(b(c)d)']);
    const chars = 'abc()';
    for (let i = 0; i < 46; i++) cases.push([Array.from({ length: randInt(1, 50) }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(50, 500) }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    for (let i = 0; i < 50; i++) cases.push([Array.from({ length: randInt(500, 5000) }, () => chars[randInt(0, chars.length - 1)]).join('')]);
    return cases;
  }
},

// 14
{
  slug: 'build-an-array-with-stack-operations',
  title: 'Build an Array With Stack Operations',
  description: 'You have a target array and a range of numbers 1..n. Read numbers from the stream sequentially. Return the stack operations needed to build the target array ("Push", "Pop").',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Simulation'],
  constraints: '1 <= target.length <= 100, 1 <= target[i] <= n <= 100, target is strictly increasing',
  examples: [{ input: '[1,3], 3', output: '["Push","Push","Pop","Push"]', explanation: 'Read 1: Push. Read 2: Push, Pop. Read 3: Push.' }],
  args: [
    { name: 'target', cpp: 'vector<int>', java: 'int[]', py: 'target: List[int]', js: 'target' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'vector<string>', java: 'String[]', py: 'List[str]' },
  hints: [{ title: 'Simulation', content: 'For each number in 1..n, if it is in target, output "Push". If not, output "Push" then "Pop". Stop when target is fully built.' }],
  jsSolution: (target, n) => {
    const res = [];
    let idx = 0;
    for (let i = 1; i <= n && idx < target.length; i++) {
      res.push('Push');
      if (target[idx] === i) idx++;
      else res.push('Pop');
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3], 3]); cases.push([[1, 2, 3], 3]); cases.push([[1, 2], 4]);
    for (let i = 0; i < 47; i++) {
      const len = randInt(1, 20); const n = randInt(len, len + 10);
      const s = new Set();
      while (s.size < len) s.add(randInt(1, n));
      cases.push([[...s].sort((a, b) => a - b), n]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(10, 40); const n = randInt(len, len + 30);
      const s = new Set();
      while (s.size < len) s.add(randInt(1, n));
      cases.push([[...s].sort((a, b) => a - b), n]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(30, 80); const n = randInt(len, len + 20);
      const s = new Set();
      while (s.size < len) s.add(randInt(1, n));
      cases.push([[...s].sort((a, b) => a - b), n]);
    }
    return cases;
  }
},

// 15
{
  slug: 'remove-all-adjacent-duplicates-in-string-ii',
  title: 'Remove All Adjacent Duplicates in String II',
  description: 'You are given a string s and an integer k, a k-duplicate removal consists of choosing k adjacent and equal characters from s and removing them, causing the left and the right side of the deleted substring to concatenate together. Return the final string after all such duplicate removals.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 10^5, 2 <= k <= 100',
  examples: [{ input: '"deeedbbcccbdaa", 3', output: '"aa"', explanation: '"eee" removed → "ddbbcccbdaa", "ccc" removed → "ddbbbdaa", "bbb" removed → "dddaa", "ddd" removed → "aa".' }],
  args: [
    { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Monotonic count stack', content: 'Use stack to store pairs [char, count]. If count reaches k, pop from stack.' }],
  jsSolution: (s, k) => {
    const stack = []; // [char, count]
    for (const c of s) {
      if (stack.length > 0 && stack[stack.length - 1][0] === c) {
        stack[stack.length - 1][1]++;
        if (stack[stack.length - 1][1] === k) stack.pop();
      } else {
        stack.push([c, 1]);
      }
    }
    return stack.map(([c, count]) => c.repeat(count)).join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['deeedbbcccbdaa', 3]); cases.push(['abcd', 2]); cases.push(['pbbcggttciiippooaais', 2]);
    for (let i = 0; i < 47; i++) cases.push([randStr(randInt(1, 50), 'abcd'), randInt(2, 5)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(50, 500), 'abcdef'), randInt(2, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randStr(randInt(500, 5000)), randInt(2, 15)]);
    return cases;
  }
},

// 16
{
  slug: 'clumsy-factorial',
  title: 'Clumsy Factorial',
  description: 'Clumsy factorial of n is defined by applying operations *, /, +, - sequentially on n, n-1, n-2... Return the clumsy factorial.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Math', 'Stack', 'Simulation'],
  constraints: '1 <= n <= 10000',
  examples: [{ input: '4', output: '7', explanation: '4 * 3 / 2 + 1 = 7.' }],
  args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Using Stack', content: 'Simulate high precedence operations (*, /) directly on top of stack. Add and subtract later.' }],
  jsSolution: (n) => {
    const stack = [n];
    let op = 0;
    for (let i = n - 1; i >= 1; i--) {
      if (op === 0) stack.push(stack.pop() * i);
      else if (op === 1) {
        const top = stack.pop();
        stack.push(top < 0 ? Math.ceil(top / i) : Math.floor(top / i));
      } else if (op === 2) stack.push(i);
      else stack.push(-i);
      op = (op + 1) % 4;
    }
    return stack.reduce((a, b) => a + b, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4]); cases.push([10]); cases.push([1]); cases.push([2]); cases.push([3]);
    for (let i = 0; i < 45; i++) cases.push([randInt(1, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(50, 1000)]);
    for (let i = 0; i < 50; i++) cases.push([randInt(1000, 10000)]);
    return cases;
  }
},

// 17
{
  slug: 'exclusive-time-of-functions',
  title: 'Exclusive Time of Functions',
  description: 'Given execution logs of n functions, return the exclusive time of each function. Logs format: "{id}:{"start"|"end"}:{timestamp}".',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Array', 'Stack'],
  constraints: '1 <= n <= 100, 1 <= logs.length <= 500',
  examples: [{ input: '2, ["0:start:0","1:start:2","1:end:5","0:end:6"]', output: '[3,4]', explanation: 'Function 0 runs for 0-2 (2s) and 5-6 (1s), total 3s. Function 1 runs for 2-5 (4s), total 4s.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'logs', cpp: 'vector<string>', java: 'String[]', py: 'logs: List[str]', js: 'logs' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Using Stack', content: 'Track current running function. Subtract elapsed time from calling function.' }],
  jsSolution: (n, logs) => {
    const res = Array(n).fill(0);
    const stack = []; // [id, startTime]
    let prevTime = 0;
    for (const log of logs) {
      const [idStr, status, timeStr] = log.split(':');
      const id = Number(idStr);
      const time = Number(timeStr);
      if (status === 'start') {
        if (stack.length > 0) {
          res[stack[stack.length - 1][0]] += time - prevTime;
        }
        stack.push([id, time]);
        prevTime = time;
      } else {
        const top = stack.pop();
        res[top[0]] += time - prevTime + 1;
        prevTime = time + 1;
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2, ['0:start:0', '1:start:2', '1:end:5', '0:end:6']]);
    cases.push([1, ['0:start:0', '0:end:0']]);
    const genLogs = (n) => {
      const logs = [];
      const stack = [];
      let time = 0;
      let step = 0;
      while (logs.length < 50) {
        if (stack.length === 0 || (stack.length < n && Math.random() < 0.5)) {
          const id = randInt(0, n - 1);
          logs.push(`${id}:start:${time}`);
          stack.push(id);
          time += randInt(1, 5);
        } else {
          const id = stack.pop();
          logs.push(`${id}:end:${time}`);
          time += randInt(1, 5);
        }
        if (stack.length === 0 && logs.length > 10) break;
      }
      while (stack.length > 0) {
        const id = stack.pop();
        logs.push(`${id}:end:${time}`);
        time += randInt(1, 5);
      }
      return logs;
    };
    for (let i = 0; i < 48; i++) {
      const n = randInt(1, 5);
      cases.push([n, genLogs(n)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(5, 20);
      cases.push([n, genLogs(n)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(20, 100);
      cases.push([n, genLogs(n)]);
    }
    return cases;
  }
},

// 18
{
  slug: 'basic-calculator',
  title: 'Basic Calculator',
  description: 'Implement a basic calculator to evaluate a simple expression string containing non-negative integers, "+", "-", "(", ")" and empty spaces.',
  difficulty: 'Hard',
  category: 'Stack',
  tags: ['Math', 'String', 'Stack', 'Recursion'],
  constraints: '1 <= s.length <= 3 * 10^5, s is valid',
  examples: [{ input: '"1 + (4 + 5 + 2) - 3"', output: '9', explanation: 'Evaluates to 9.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Signs and Parentheses Stack', content: 'Use stack to store current running sum and current sign when encountering "(".' }],
  jsSolution: (s) => {
    let sum = 0, sign = 1, num = 0;
    const stack = [];
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c >= '0' && c <= '9') {
        num = num * 10 + Number(c);
      } else if (c === '+') {
        sum += sign * num; num = 0; sign = 1;
      } else if (c === '-') {
        sum += sign * num; num = 0; sign = -1;
      } else if (c === '(') {
        stack.push(sum); stack.push(sign);
        sum = 0; sign = 1;
      } else if (c === ')') {
        sum += sign * num; num = 0;
        sum *= stack.pop(); // sign
        sum += stack.pop(); // prev sum
      }
    }
    return sum + sign * num;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['1 + (4 + 5 + 2) - 3']); cases.push([' 2-1 + 2 ']); cases.push(['(1+(4+5+2)-3)+(6+8)']);
    const genExp = (depth) => {
      if (depth === 0) return String(randInt(1, 20));
      if (Math.random() < 0.5) return `${genExp(depth - 1)} + ${randInt(1, 10)}`;
      return `(${genExp(depth - 1)}) - ${randInt(1, 10)}`;
    };
    for (let i = 0; i < 47; i++) cases.push([genExp(randInt(1, 2))]);
    for (let i = 0; i < 50; i++) cases.push([genExp(randInt(2, 3))]);
    for (let i = 0; i < 50; i++) cases.push([genExp(randInt(3, 4))]);
    return cases;
  }
},

// 19
{
  slug: 'basic-calculator-ii',
  title: 'Basic Calculator II',
  description: 'Implement a basic calculator to evaluate a simple expression string containing non-negative integers, "+", "-", "*", "/" and empty spaces.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Math', 'String', 'Stack'],
  constraints: '1 <= s.length <= 3 * 10^5',
  examples: [{ input: '" 3+2*2 "', output: '7', explanation: 'Multiply first, then add.' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Using Stack', content: 'Keep current number. On operator, push signed number onto stack (or multiply/divide immediately). Sum stack at the end.' }],
  jsSolution: (s) => {
    const stack = [];
    let num = 0, sign = '+';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c >= '0' && c <= '9') num = num * 10 + Number(c);
      if ((isNaN(c) && c !== ' ') || i === s.length - 1) {
        if (sign === '+') stack.push(num);
        else if (sign === '-') stack.push(-num);
        else if (sign === '*') stack.push(stack.pop() * num);
        else if (sign === '/') {
          const top = stack.pop();
          stack.push(top < 0 ? Math.ceil(top / num) : Math.floor(top / num));
        }
        sign = c;
        num = 0;
      }
    }
    return stack.reduce((a, b) => a + b, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([' 3+2*2 ']); cases.push([' 3/2 ']); cases.push([' 3 + 5 / 2 ']);
    const ops = ['+', '-', '*', '/'];
    const genExp = (len) => {
      let res = String(randInt(1, 15));
      for (let i = 0; i < len; i++) {
        res += ` ${ops[randInt(0, 3)]} ${randInt(1, 10)}`;
      }
      return res;
    };
    for (let i = 0; i < 47; i++) cases.push([genExp(randInt(1, 3))]);
    for (let i = 0; i < 50; i++) cases.push([genExp(randInt(3, 7))]);
    for (let i = 0; i < 50; i++) cases.push([genExp(randInt(7, 15))]);
    return cases;
  }
},

// 20
{
  slug: 'check-if-word-is-valid-after-substitutions',
  title: 'Check If Word Is Valid After Substitutions',
  description: 'Given a string s, determine if it is valid. A string is valid if we can start with empty string and repeatedly insert "abc" in any position.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack'],
  constraints: '1 <= s.length <= 2 * 10^4, s consists of a, b, c',
  examples: [{ input: '"aabcbc"', output: 'true', explanation: '"" → "abc" → "aabcbc".' }],
  args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Using Stack', content: 'Push characters. Whenever top three are "abc", pop them.' }],
  jsSolution: (s) => {
    const stack = [];
    for (const c of s) {
      if (c === 'c') {
        if (stack.pop() !== 'b' || stack.pop() !== 'a') return false;
      } else {
        stack.push(c);
      }
    }
    return stack.length === 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['aabcbc']); cases.push(['abcabcababcc']); cases.push(['abccba']); cases.push(['a']);
    const genValid = (depth) => {
      if (depth === 0) return 'abc';
      const inner = genValid(depth - 1);
      const r = Math.random();
      if (r < 0.3) return 'abc' + inner;
      if (r < 0.6) return inner + 'abc';
      return inner.slice(0, 3) + 'abc' + inner.slice(3);
    };
    for (let i = 0; i < 46; i++) {
      if (Math.random() < 0.5) cases.push([genValid(randInt(1, 4))]);
      else cases.push([randStr(randInt(1, 20), 'abc')]);
    }
    for (let i = 0; i < 50; i++) {
      if (Math.random() < 0.5) cases.push([genValid(randInt(5, 10))]);
      else cases.push([randStr(randInt(20, 100), 'abc')]);
    }
    for (let i = 0; i < 50; i++) {
      if (Math.random() < 0.5) cases.push([genValid(randInt(10, 30))]);
      else cases.push([randStr(randInt(100, 1000), 'abc')]);
    }
    return cases;
  }
},

// 21
{
  slug: 'remove-k-digits',
  title: 'Remove K Digits',
  description: 'Given a non-negative integer represented as a string num, and an integer k, remove k digits from the number so that the new number is the smallest possible.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['String', 'Stack', 'Greedy', 'Monotonic Stack'],
  constraints: '1 <= k <= num.length <= 10^5, num consists of digits only, no leading zeros in input',
  examples: [{ input: '"1432219", 3', output: '"1219"', explanation: 'Remove 4, 3, 2.' }],
  args: [
    { name: 'num', cpp: 'string', java: 'String', py: 'num: str', js: 'num' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'string', java: 'String', py: 'str' },
  hints: [{ title: 'Monotonic Increasing Stack', content: 'Maintain an increasing stack of digits. Pop if current digit < top and k > 0.' }],
  jsSolution: (num, k) => {
    if (k === num.length) return '0';
    const stack = [];
    let rem = k;
    for (const d of num) {
      while (stack.length > 0 && rem > 0 && stack[stack.length - 1] > d) {
        stack.pop(); rem--;
      }
      stack.push(d);
    }
    while (rem > 0) { stack.pop(); rem--; }
    while (stack.length > 0 && stack[0] === '0') stack.shift();
    return stack.length === 0 ? '0' : stack.join('');
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(['1432219', 3]); cases.push(['10200', 1]); cases.push(['10', 2]);
    for (let i = 0; i < 47; i++) {
      const n = randInt(1, 50);
      cases.push([randStr(n, '0123456789'), randInt(1, n)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(50, 500);
      cases.push([randStr(n, '0123456789'), randInt(1, n)]);
    }
    for (let i = 0; i < 50; i++) {
      const n = randInt(500, 5000);
      cases.push([randStr(n, '0123456789'), randInt(1, n)]);
    }
    return cases;
  }
},

// 22
{
  slug: 'maximal-rectangle-area',
  title: 'Maximal Rectangle',
  description: 'Given a rows x cols binary matrix filled with 0\'s and 1\'s, find the largest rectangle containing only 1\'s and return its area.',
  difficulty: 'Hard',
  category: 'Stack',
  tags: ['Array', 'Stack', 'Dynamic Programming', 'Matrix', 'Monotonic Stack'],
  constraints: '0 <= row, col <= 200, matrix[i][j] is "0" or "1"',
  examples: [{ input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: '6', explanation: 'Largest rectangle of 1s has area 6.' }],
  args: [{ name: 'matrix', cpp: 'vector<vector<char>>', java: 'char[][]', py: 'matrix: List[List[str]]', js: 'matrix' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Histogram Approach', content: 'Maintain a 1D heights array representing histogram columns. For each row, run Largest Rectangle in Histogram.' }],
  jsSolution: (matrix) => {
    if (!matrix.length || !matrix[0].length) return 0;
    const cols = matrix[0].length;
    const heights = Array(cols).fill(0);
    let maxArea = 0;
    const largestRectangle = (heights) => {
      const stack = [];
      let maxA = 0;
      for (let i = 0; i <= heights.length; i++) {
        const h = i === heights.length ? 0 : heights[i];
        while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
          const height = heights[stack.pop()];
          const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
          maxA = Math.max(maxA, height * width);
        }
        stack.push(i);
      }
      return maxA;
    };
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < cols; c++) {
        heights[c] = matrix[r][c] === '1' ? heights[c] + 1 : 0;
      }
      maxArea = Math.max(maxArea, largestRectangle(heights));
    }
    return maxArea;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]]);
    cases.push([[['0']]]); cases.push([[['1']]]);
    for (let i = 0; i < 47; i++) {
      const r = randInt(1, 10); const c = randInt(1, 10);
      cases.push([Array.from({ length: r }, () => Array.from({ length: c }, () => Math.random() < 0.7 ? '1' : '0'))]);
    }
    for (let i = 0; i < 50; i++) {
      const r = randInt(10, 30); const c = randInt(10, 30);
      cases.push([Array.from({ length: r }, () => Array.from({ length: c }, () => Math.random() < 0.7 ? '1' : '0'))]);
    }
    for (let i = 0; i < 50; i++) {
      const r = randInt(30, 100); const c = randInt(30, 100);
      cases.push([Array.from({ length: r }, () => Array.from({ length: c }, () => Math.random() < 0.7 ? '1' : '0'))]);
    }
    return cases;
  }
}

];

export default problems;
