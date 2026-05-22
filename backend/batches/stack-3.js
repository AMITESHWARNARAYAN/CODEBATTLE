// Stack — Batch 3 (2 problems to complete 50 Stack problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));
const randStr = (len, alpha = 'abcdefghijklmnopqrstuvwxyz') =>
  Array.from({ length: len }, () => alpha[randInt(0, alpha.length - 1)]).join('');

export const problems = [

// 1
{
  slug: 'custom-increment-stack',
  title: 'Design a Custom Increment Stack',
  description: 'Given a sequence of stack operations ("push", "pop", "increment") and their corresponding values, return an array of outputs. "push" returns null, "pop" returns the popped element (or -1 if empty), "increment" (increments bottom k elements by val) returns null.',
  difficulty: 'Medium',
  category: 'Stack',
  tags: ['Stack', 'Design'],
  constraints: '1 <= operations.length <= 10^4',
  examples: [{ input: '["push", "push", "pop", "push", "push", "push", "increment", "increment", "pop", "pop", "pop", "pop"], [[1], [2], [], [2], [3], [4], [5, 100], [2, 100], [], [], [], []]', output: '[null, null, 2, null, null, null, null, null, 104, 203, 201, -1]', explanation: 'Custom increment stack simulation.' }],
  args: [
    { name: 'ops', cpp: 'vector<string>', java: 'String[]', py: 'ops: List[str]', js: 'ops' },
    { name: 'vals', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'vals: List[List[int]]', js: 'vals' }
  ],
  retType: { cpp: 'vector<string>', java: 'String[]', py: 'List[str]' },
  hints: [{ title: 'Lazy Increment', content: 'Use an auxiliary array to track lazy increments for O(1) time complexity.' }],
  jsSolution: (ops, vals) => {
    const stack = [];
    const inc = [];
    const maxSize = 10000;
    const res = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op === 'push') {
        const val = vals[i][0];
        if (stack.length < maxSize) {
          stack.push(val);
          inc.push(0);
        }
        res.push('null');
      } else if (op === 'pop') {
        if (stack.length === 0) {
          res.push('-1');
        } else {
          const idx = stack.length - 1;
          if (idx > 0) inc[idx - 1] += inc[idx];
          const val = stack.pop() + inc.pop();
          res.push(String(val));
        }
      } else if (op === 'increment') {
        const k = vals[i][0];
        const val = vals[i][1];
        const limit = Math.min(k, stack.length) - 1;
        if (limit >= 0) {
          inc[limit] += val;
        }
        res.push('null');
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([
      ['push', 'push', 'pop', 'push', 'push', 'push', 'increment', 'increment', 'pop', 'pop', 'pop', 'pop'],
      [[1], [2], [], [2], [3], [4], [5, 100], [2, 100], [], [], [], []]
    ]);
    for (let i = 0; i < 49; i++) {
      const len = randInt(10, 50);
      const ops = [];
      const vals = [];
      let size = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4) {
          ops.push('push');
          vals.push([randInt(1, 100)]);
          size++;
        } else if (r < 0.7 && size > 0) {
          ops.push('pop');
          vals.push([]);
          size--;
        } else {
          ops.push('increment');
          vals.push([randInt(1, 30), randInt(1, 50)]);
        }
      }
      cases.push([ops, vals]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 200);
      const ops = [];
      const vals = [];
      let size = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4) {
          ops.push('push');
          vals.push([randInt(1, 500)]);
          size++;
        } else if (r < 0.7 && size > 0) {
          ops.push('pop');
          vals.push([]);
          size--;
        } else {
          ops.push('increment');
          vals.push([randInt(1, 100), randInt(1, 100)]);
        }
      }
      cases.push([ops, vals]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(200, 1000);
      const ops = [];
      const vals = [];
      let size = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4) {
          ops.push('push');
          vals.push([randInt(1, 1000)]);
          size++;
        } else if (r < 0.7 && size > 0) {
          ops.push('pop');
          vals.push([]);
          size--;
        } else {
          ops.push('increment');
          vals.push([randInt(1, 500), randInt(1, 200)]);
        }
      }
      cases.push([ops, vals]);
    }
    return cases;
  }
},

// 2
{
  slug: 'simulate-queue-using-stacks',
  title: 'Simulate Queue using Stacks',
  description: 'Given a sequence of queue operations ("push", "pop", "peek", "empty") and their corresponding values, return an array of outputs. "push" returns null, "pop" returns the popped front element, "peek" returns the front element, "empty" returns true or false.',
  difficulty: 'Easy',
  category: 'Stack',
  tags: ['Stack', 'Design', 'Queue'],
  constraints: '1 <= operations.length <= 1000',
  examples: [{ input: '["push", "push", "peek", "pop", "empty"], [[1], [2], [], [], []]', output: '[null, null, 1, 1, false]', explanation: 'Queue simulation.' }],
  args: [
    { name: 'ops', cpp: 'vector<string>', java: 'String[]', py: 'ops: List[str]', js: 'ops' },
    { name: 'vals', cpp: 'vector<vector<int>>', java: 'int[][]', py: 'vals: List[List[int]]', js: 'vals' }
  ],
  retType: { cpp: 'vector<string>', java: 'String[]', py: 'List[str]' },
  hints: [{ title: 'Two Stacks', content: 'Use an input stack and an output stack. Move elements from input to output when pop/peek is called and output stack is empty.' }],
  jsSolution: (ops, vals) => {
    const s1 = [];
    const s2 = [];
    const res = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op === 'push') {
        const val = vals[i][0];
        s1.push(val);
        res.push('null');
      } else if (op === 'pop') {
        if (s2.length === 0) {
          while (s1.length > 0) s2.push(s1.pop());
        }
        res.push(String(s2.pop()));
      } else if (op === 'peek') {
        if (s2.length === 0) {
          while (s1.length > 0) s2.push(s1.pop());
        }
        res.push(String(s2[s2.length - 1]));
      } else if (op === 'empty') {
        res.push(String(s1.length === 0 && s2.length === 0));
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([
      ['push', 'push', 'peek', 'pop', 'empty'],
      [[1], [2], [], [], []]
    ]);
    for (let i = 0; i < 49; i++) {
      const len = randInt(10, 50);
      const ops = [];
      const vals = [];
      let size = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4 || size === 0) {
          ops.push('push');
          vals.push([randInt(1, 100)]);
          size++;
        } else if (r < 0.7) {
          ops.push('pop');
          vals.push([]);
          size--;
        } else if (r < 0.9) {
          ops.push('peek');
          vals.push([]);
        } else {
          ops.push('empty');
          vals.push([]);
        }
      }
      cases.push([ops, vals]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(50, 200);
      const ops = [];
      const vals = [];
      let size = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4 || size === 0) {
          ops.push('push');
          vals.push([randInt(1, 500)]);
          size++;
        } else if (r < 0.7) {
          ops.push('pop');
          vals.push([]);
          size--;
        } else if (r < 0.9) {
          ops.push('peek');
          vals.push([]);
        } else {
          ops.push('empty');
          vals.push([]);
        }
      }
      cases.push([ops, vals]);
    }
    for (let i = 0; i < 50; i++) {
      const len = randInt(200, 500);
      const ops = [];
      const vals = [];
      let size = 0;
      for (let j = 0; j < len; j++) {
        const r = Math.random();
        if (r < 0.4 || size === 0) {
          ops.push('push');
          vals.push([randInt(1, 1000)]);
          size++;
        } else if (r < 0.7) {
          ops.push('pop');
          vals.push([]);
          size--;
        } else if (r < 0.9) {
          ops.push('peek');
          vals.push([]);
        } else {
          ops.push('empty');
          vals.push([]);
        }
      }
      cases.push([ops, vals]);
    }
    return cases;
  }
}

];

export default problems;
