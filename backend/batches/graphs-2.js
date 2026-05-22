// Graphs — Batch 2 (25 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

export const problems = [

// 1
{
  slug: 'find-the-town-judge',
  title: 'Find the Town Judge',
  description: 'In a town, there are n people labeled from 1 to n. There is a rumor that one of these people is secretly the town judge. If the town judge exists, then: the town judge trusts nobody, everybody (except the town judge) trusts the town judge, and there is exactly one person that satisfies properties 1 and 2. You are given an array trust where trust[i] = [ai, bi] representing that the person labeled ai trusts the person labeled bi. Return the label of the town judge if the town judge exists and can be identified, or return -1 otherwise.',
  difficulty: 'Easy',
  category: 'Graphs',
  tags: ['Array', 'Hash Table', 'Graph'],
  constraints: '1 <= n <= 1000. 0 <= trust.length <= 10^4. trust[i].length == 2. All trust relations are unique.',
  examples: [{ input: '3, [[1,3],[2,3]]', output: '3', explanation: '1 and 2 trust 3. 3 trusts nobody. 3 is the town judge.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'trust', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'trust: List[List[int]]', js: 'trust' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'In-degree and out-degree', content: 'Track in-degrees and out-degrees of all people. The town judge must have in-degree == n - 1 and out-degree == 0.' }],
  jsSolution: (n, trust) => {
    const inDegree = Array(n + 1).fill(0);
    const outDegree = Array(n + 1).fill(0);
    for (const [u, v] of trust) {
      if (u <= n && v <= n) {
        outDegree[u]++;
        inDegree[v]++;
      }
    }
    for (let i = 1; i <= n; i++) {
      if (inDegree[i] === n - 1 && outDegree[i] === 0) return i;
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, [[1, 3], [2, 3]]]);
    cases.push([3, [[1, 3], [2, 3], [3, 1]]]);
    
    const gen = (n, hasJudge) => {
      const trust = [];
      if (hasJudge) {
        const judge = randInt(1, n);
        for (let i = 1; i <= n; i++) {
          if (i !== judge) {
            trust.push([i, judge]);
          }
        }
        // Add random noises that don't involve the judge outdegree
        const extra = randInt(0, n);
        for (let i = 0; i < extra; i++) {
          const u = randInt(1, n);
          const v = randInt(1, n);
          if (u !== judge && v !== judge && u !== v) {
            trust.push([u, v]);
          }
        }
      } else {
        const extra = randInt(0, n * 2);
        for (let i = 0; i < extra; i++) {
          const u = randInt(1, n);
          const v = randInt(1, n);
          if (u !== v) trust.push([u, v]);
        }
      }
      // Deduplicate trust
      const seen = new Set();
      const unique = [];
      for (const [u, v] of trust) {
        const hash = `${u},${v}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          unique.push([u, v]);
        }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 2
{
  slug: 'maximal-network-rank',
  title: 'Maximal Network Rank',
  description: 'There is an infrastructure of n cities with some number of roads. You are given an integer n and a 2D integer array roads where roads[i] = [ui, vi] indicates that there is a bidirectional road between cities ui and vi. The network rank of two different cities is the total number of directly connected roads to either city. If a road is directly connected to both cities, it is only counted once. The maximal network rank of the entire infrastructure is the maximum network rank of all pairs of different cities. Return the maximal network rank.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Graph'],
  constraints: '2 <= n <= 100. 0 <= roads.length <= n * (n - 1) / 2. roads[i].length == 2. ui != vi.',
  examples: [{ input: '4, [[0,1],[0,3],[1,2],[1,3]]', output: '4', explanation: 'The network rank of cities 0 and 1 is 4 (roads: 0-1, 0-3, 1-2, 1-3).' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'roads', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'roads: List[List[int]]', js: 'roads' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Pairwise Rank Summation', content: 'Calculate in-degree/degree of each city. Store existing roads in a 2D adjacent matrix/set. For each pair of cities (i, j), network rank is degree[i] + degree[j] - (1 if there is a road between i and j). Find the maximum.' }],
  jsSolution: (n, roads) => {
    const degree = Array(n).fill(0);
    const connected = Array.from({ length: n }, () => Array(n).fill(false));
    for (const [u, v] of roads) {
      if (u < n && v < n) {
        degree[u]++;
        degree[v]++;
        connected[u][v] = true;
        connected[v][u] = true;
      }
    }
    let maxRank = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let rank = degree[i] + degree[j];
        if (connected[i][j]) rank--;
        maxRank = Math.max(maxRank, rank);
      }
    }
    return maxRank;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, [[0, 1], [0, 3], [1, 2], [1, 3]]]);
    cases.push([5, [[0, 1], [0, 3], [1, 2], [1, 3], [2, 3], [2, 4]]]);
    
    const gen = (n) => {
      const roads = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.random() < 0.3) {
            roads.push([i, j]);
          }
        }
      }
      return [n, roads];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 40)));
    return cases;
  }
},

// 3
{
  slug: 'min-cost-to-connect-all-points',
  title: 'Min Cost to Connect All Points',
  description: 'You are given a 2D integer array points where points[i] = [xi, yi] represents the coordinates of the ith point on a 2D plane. The cost of connecting two points [xi, yi] and [xj, yj] is the Manhattan distance between them: |xi - xj| + |yi - yj|. Return the minimum cost to make all points connected. All points are connected if there is exactly one simple path between any two points.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Union Find', 'Minimum Spanning Tree'],
  constraints: '1 <= points.length <= 1000. -10^6 <= xi, yi <= 10^6. All points are distinct.',
  examples: [{ input: '[[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20' }],
  args: [{ name: 'points', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'points: List[List[int]]', js: 'points' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Prim\'s or Kruskal\'s MST', content: 'Generate all possible edges between points with their Manhattan distances. Run Kruskal\'s algorithm using Union-Find to find the Minimum Spanning Tree weight.' }],
  jsSolution: (points) => {
    const N = points.length;
    const parent = Array.from({ length: N }, (_, i) => i);
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    const union = (i, j) => {
      const rI = find(i);
      const rJ = find(j);
      if (rI !== rJ) { parent[rI] = rJ; return true; }
      return false;
    };
    
    const edges = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dist = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
        edges.push([i, j, dist]);
      }
    }
    
    edges.sort((a, b) => a[2] - b[2]);
    let cost = 0;
    let edgesUsed = 0;
    
    for (const [u, v, w] of edges) {
      if (union(u, v)) {
        cost += w;
        edgesUsed++;
        if (edgesUsed === N - 1) break;
      }
    }
    return cost;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]]);
    cases.push([[[3, 12], [-2, 5], [-4, 1]]]);
    
    const gen = (n) => {
      const points = [];
      const seen = new Set();
      while (points.length < n) {
        const x = randInt(-100, 100);
        const y = randInt(-100, 100);
        const hash = `${x},${y}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          points.push([x, y]);
        }
      }
      return [points];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 4
{
  slug: 'number-of-operations-to-make-network-connected',
  title: 'Number of Operations to Make Network Connected',
  description: 'There are n computers numbered from 0 to n - 1 connected by ethernet cables connections where connections[i] = [ai, bi] represents a connection between computers ai and bi. Any computer can reach any other computer directly or indirectly through the network. You are given an initial computer network connections. You can extract certain redundant cables and connect them between any two unconnected computers to make all the computers connected. Return the minimum number of times you need to do this in order to make all the computers connected. If it is impossible, return -1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: '1 <= n <= 10^5. 1 <= connections.length <= min(10^5, n * (n - 1) / 2). connections[i].length == 2. 0 <= ai, bi < n.',
  examples: [{ input: '4, [[0,1],[0,2],[1,2]]', output: '1', explanation: 'We can extract edge [1,2] and connect 2 to 3 to make all connected.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'connections', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'connections: List[List[int]]', js: 'connections' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Redundant Cable Extraction', content: 'We need at least n - 1 cables to connect n computers. If connections.length < n - 1, return -1. Otherwise, the answer is just the number of independent components - 1.' }],
  jsSolution: (n, connections) => {
    if (connections.length < n - 1) return -1;
    const parent = Array.from({ length: n }, (_, i) => i);
    let components = n;
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    const union = (i, j) => {
      const rI = find(i);
      const rJ = find(j);
      if (rI !== rJ) {
        parent[rI] = rJ;
        components--;
        return true;
      }
      return false;
    };
    for (const [u, v] of connections) {
      if (u < n && v < n) union(u, v);
    }
    return components - 1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, [[0, 1], [0, 2], [1, 2]]]);
    cases.push([6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]]);
    
    const gen = (n, solvable) => {
      const connections = [];
      const edges = solvable ? randInt(n - 1, n * 2) : randInt(0, n - 2);
      for (let i = 0; i < edges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u !== v) connections.push([u, v]);
      }
      const seen = new Set();
      const unique = [];
      for (const [u, v] of connections) {
        const hash = `${Math.min(u, v)},${Math.max(u, v)}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          unique.push([u, v]);
        }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 50), Math.random() < 0.5));
    return cases;
  }
},

// 5
{
  slug: 'shortest-bridge',
  title: 'Shortest Bridge',
  description: 'You are given an n x n binary matrix grid where 1 represents land and 0 represents water. An island is a 4-directionally connected group of 1s not connected to any other 1s. There are exactly two islands in grid. You may change 0s to 1s to connect the two islands to form one island. Return the smallest number of 0s you must flip to connect the two islands.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
  constraints: 'n == grid.length. n == grid[i].length. 2 <= n <= 100. grid[i][j] is 0 or 1. There are exactly two islands in grid.',
  examples: [{ input: '[[0,1,0],[0,0,0],[0,0,1]]', output: '2', explanation: 'Flip two zeros at [1,1] and [1,2] or [0,2] and [1,2].' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'DFS + BFS combo', content: 'Run DFS to find the first island. Enqueue all its cells with distance 0, and change their value in grid to 2 (to mark visited). Then run BFS from these cells to find the second island (value 1).' }],
  jsSolution: (grid) => {
    const N = grid.length;
    const copy = grid.map(row => [...row]);
    const q = [];
    
    // Find first cell of the first island
    let found = false;
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= N || c >= N || copy[r][c] !== 1) return;
      copy[r][c] = 2; // Mark as part of island 1
      q.push([r, c, 0]);
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
    
    for (let r = 0; r < N; r++) {
      if (found) break;
      for (let c = 0; c < N; c++) {
        if (copy[r][c] === 1) {
          dfs(r, c);
          found = true;
          break;
        }
      }
    }
    
    // Multi-source BFS to find island 2 (1s)
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length > 0) {
      const [r, c, dist] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < N && nc < N) {
          if (copy[nr][nc] === 1) return dist;
          if (copy[nr][nc] === 0) {
            copy[nr][nc] = 2;
            q.push([nr, nc, dist + 1]);
          }
        }
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 1, 0], [0, 0, 0], [0, 0, 1]]]);
    cases.push([[[1, 1, 0, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 1, 1]]]);
    
    const gen = (n) => {
      const grid = Array.from({ length: n }, () => Array(n).fill(0));
      // Randomly spawn island 1 in top-left
      grid[0][0] = 1;
      if (Math.random() < 0.5) grid[0][1] = 1;
      if (Math.random() < 0.5) grid[1][0] = 1;
      
      // Randomly spawn island 2 in bottom-right
      grid[n - 1][n - 1] = 1;
      if (Math.random() < 0.5) grid[n - 1][n - 2] = 1;
      if (Math.random() < 0.5) grid[n - 2][n - 1] = 1;
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 15)));
    return cases;
  }
},

// 6
{
  slug: 'time-needed-to-inform-all-employees',
  title: 'Time Needed to Inform All Employees',
  description: 'A company has n employees with a unique ID from 0 to n - 1. The head of the company is the one with headID. Each employee has one direct manager given in the manager array where manager[i] is the direct manager of the i-th employee, manager[headID] = -1. Also, it is guaranteed that the subordination relationships have a tree structure. The head of the company wants to inform all the employees of an urgent piece of news. He will inform his direct subordinates and they will inform their subordinates and so on until all employees are informed. The i-th employee needs informTime[i] minutes to inform all of his direct subordinates. Return the number of minutes needed to inform all the employees.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Tree'],
  constraints: '1 <= n <= 10^5. 0 <= headID < n. manager.length == n. manager[headID] == -1. informTime.length == n. 0 <= informTime[i] <= 1000. informTime[i] == 0 if employee i has no subordinates.',
  examples: [{ input: '1, 0, [-1], [0]', output: '0' }, { input: '6, 2, [2,2,-1,2,2,2], [0,0,1,0,0,0]', output: '1' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'headID', cpp: 'int', java: 'int', py: 'headID: int', js: 'headID' },
    { name: 'manager', cpp: 'vector<int>&', java: 'int[]', py: 'manager: List[int]', js: 'manager' },
    { name: 'informTime', cpp: 'vector<int>&', java: 'int[]', py: 'informTime: List[int]', js: 'informTime' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Tree traversal path max', content: 'Construct an adjacency list from manager relationships. Run DFS/BFS starting from headID, propagating the cumulative informTime down. Return the maximum time reached.' }],
  jsSolution: (n, headID, manager, informTime) => {
    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      if (manager[i] !== -1 && manager[i] < n) {
        adj[manager[i]].push(i);
      }
    }
    
    let maxTime = 0;
    const dfs = (curr, time) => {
      maxTime = Math.max(maxTime, time);
      for (const child of adj[curr]) {
        dfs(child, time + informTime[curr]);
      }
    };
    dfs(headID, 0);
    return maxTime;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([1, 0, [-1], [0]]);
    cases.push([6, 2, [2, 2, -1, 2, 2, 2], [0, 0, 1, 0, 0, 0]]);
    
    const gen = (n) => {
      const manager = Array(n).fill(-1);
      const informTime = Array(n).fill(0);
      const head = randInt(0, n - 1);
      
      // Build a subordination tree
      for (let i = 0; i < n; i++) {
        if (i !== head) {
          manager[i] = randInt(0, i - 1);
          if (manager[i] === i) manager[i] = head; // avoid cycles
        }
      }
      
      // Ensure manager[head] = -1
      manager[head] = -1;
      
      // Managers get positive informTime
      for (let i = 0; i < n; i++) {
        if (manager[i] !== -1) {
          informTime[manager[i]] = randInt(1, 10);
        }
      }
      return [n, head, manager, informTime];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
},

// 7
{
  slug: 'open-the-lock',
  title: 'Open the Lock',
  description: 'You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: \'0\', \'1\', \'2\', \'3\', \'4\', \'5\', \'6\', \'7\', \'8\', \'9\'. You can turn each wheel 4-directionally. The lock initially starts at \'0000\'. You are given a list of deadends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it. Given target, return the minimum total number of turns required to open the lock, or -1 if it is impossible.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Hash Table', 'String', 'Breadth-First Search'],
  constraints: '1 <= deadends.length <= 500. deadends[i].length == 4. target.length == 4. target consists of digits only. target != "0000".',
  examples: [{ input: '["0201","0101","0102","1212","2002"], "0202"', output: '6', explanation: 'Sequence of turns: 0000 -> 5 other states -> 0202.' }],
  args: [
    { name: 'deadends', cpp: 'vector<string>&', java: 'List<String>', py: 'deadends: List[str]', js: 'deadends' },
    { name: 'target', cpp: 'string', java: 'String', py: 'target: str', js: 'target' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Circular BFS combination', content: 'Use BFS starting from "0000" with steps 0. Use a visited Hash Set containing all deadends to quickly prune invalid moves.' }],
  jsSolution: (deadends, target) => {
    const dead = new Set(deadends);
    if (dead.has('0000')) return -1;
    if (target === '0000') return 0;
    
    const q = [['0000', 0]];
    const visited = new Set(['0000']);
    
    while (q.length > 0) {
      const [curr, steps] = q.shift();
      if (curr === target) return steps;
      
      for (let i = 0; i < 4; i++) {
        const digit = parseInt(curr[i], 10);
        for (const diff of [-1, 1]) {
          const nextDigit = (digit + diff + 10) % 10;
          const nextState = curr.substring(0, i) + nextDigit + curr.substring(i + 1);
          
          if (!dead.has(nextState) && !visited.has(nextState)) {
            visited.add(nextState);
            q.push([nextState, steps + 1]);
          }
        }
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([["0201", "0101", "0102", "1212", "2002"], "0202"]);
    cases.push([["8888"], "0009"]);
    
    const gen = () => {
      const target = Array.from({ length: 4 }, () => randInt(0, 9)).join('');
      const deadends = [];
      const numDeads = randInt(0, 10);
      for (let i = 0; i < numDeads; i++) {
        const dead = Array.from({ length: 4 }, () => randInt(0, 9)).join('');
        if (dead !== '0000' && dead !== target) {
          deadends.push(dead);
        }
      }
      return [deadends, target];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 8
{
  slug: 'snakes-and-ladders',
  title: 'Snakes and Ladders',
  description: 'You are given an n x n integer matrix board where the cells are labeled from 1 to n^2 in a Boustrophedon style starting from the bottom left of the board (i.e. board[n-1][0]) and alternating direction each row. You start on square 1 of the board. In each state, you choose a destination square next with label label + 1 to min(label + 6, n^2). If next has a snake or ladder (i.e. board[r][c] != -1), you must move to the destination of that snake or ladder. Otherwise, you move to next. Return the least number of moves required to reach the square n^2. If it is not possible, return -1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Breadth-First Search', 'Matrix'],
  constraints: 'n == board.length. n == board[i].length. 2 <= n <= 20. board[i][j] is -1 or in the range [1, n^2].',
  examples: [{ input: '[[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]', output: '4' }],
  args: [{ name: 'board', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'board: List[List[int]]', js: 'board' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Grid to 1D mapping', content: 'Flatten the 2D Boustrophedon grid to a 1D array of size n^2 + 1. Run standard BFS starting from square 1 with moves 0.' }],
  jsSolution: (board) => {
    const N = board.length;
    const n2 = N * N;
    
    // Map index 1..n^2 to board cell coordinates [r, c]
    const getCoords = (idx) => {
      let r = Math.floor((idx - 1) / N);
      let c = (idx - 1) % N;
      if (r % 2 === 1) c = N - 1 - c;
      return [N - 1 - r, c];
    };
    
    const q = [[1, 0]];
    const visited = new Set([1]);
    
    while (q.length > 0) {
      const [curr, moves] = q.shift();
      if (curr === n2) return moves;
      
      const maxNext = Math.min(curr + 6, n2);
      for (let next = curr + 1; next <= maxNext; next++) {
        const [r, c] = getCoords(next);
        const dest = board[r][c] === -1 ? next : board[r][c];
        
        if (!visited.has(dest)) {
          visited.add(dest);
          q.push([dest, moves + 1]);
        }
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, 15, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, 15, -1, -1, -1, -1]]]);
    cases.push([[[-1, 4], [-1, -1]]]);
    
    const gen = (n) => {
      const board = Array.from({ length: n }, () => Array(n).fill(-1));
      // Add a couple of random ladders or snakes
      const numJumps = randInt(0, Math.floor(n * n / 6));
      for (let i = 0; i < numJumps; i++) {
        const r = randInt(0, n - 1);
        const c = randInt(0, n - 1);
        const target = randInt(1, n * n);
        // Avoid infinite jumps
        if (target !== 1 && target !== n * n && (r !== 0 || c !== 0)) {
          board[r][c] = target;
        }
      }
      return [board];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 12)));
    return cases;
  }
},

// 9
{
  slug: 'detonate-the-maximum-bombs',
  title: 'Detonate the Maximum Bombs',
  description: 'You are given a list of bombs. The range of a bomb is defined as the area where its effect can be felt. This area is in the shape of a circle with the center as the bomb\'s location and the radius as its range. You may choose to detonate a single bomb. When a bomb is detonated, it will detonate all other bombs that lie in its range. These bombs will further detonate other bombs in their range. Given the list of bombs, return the maximum number of bombs that can be detonated if you are allowed to detonate only one bomb.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Math', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
  constraints: '1 <= bombs.length <= 100. bombs[i].length == 3. 1 <= xi, yi, ri <= 10^5.',
  examples: [{ input: '[[2,1,3],[6,1,4]]', output: '2', explanation: 'Detonating bomb 0 triggers bomb 1. Max bombs = 2.' }],
  args: [{ name: 'bombs', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'bombs: List[List[int]]', js: 'bombs' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Directed graph construction', content: 'Build a directed graph where an edge u -> v exists if bomb u can trigger bomb v (distance between centers <= radius of u). Run DFS/BFS from each node to count reachable components. Return the max.' }],
  jsSolution: (bombs) => {
    const N = bombs.length;
    const adj = Array.from({ length: N }, () => []);
    
    for (let i = 0; i < N; i++) {
      const [xi, yi, ri] = bombs[i];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const [xj, yj] = bombs[j];
        const distSq = (xi - xj) * (xi - xj) + (yi - yj) * (yi - yj);
        if (distSq <= ri * ri) {
          adj[i].push(j);
        }
      }
    }
    
    const bfs = (start) => {
      const visited = new Set([start]);
      const q = [start];
      while (q.length > 0) {
        const curr = q.shift();
        for (const neighbor of adj[curr]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            q.push(neighbor);
          }
        }
      }
      return visited.size;
    };
    
    let maxDetonated = 0;
    for (let i = 0; i < N; i++) {
      maxDetonated = Math.max(maxDetonated, bfs(i));
    }
    return maxDetonated;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[2, 1, 3], [6, 1, 4]]]);
    cases.push([[[1, 1, 5], [10, 10, 5]]]);
    
    const gen = (n) => {
      const bombs = [];
      for (let i = 0; i < n; i++) {
        bombs.push([randInt(1, 20), randInt(1, 20), randInt(1, 15)]);
      }
      return [bombs];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 10
{
  slug: 'count-sub-islands',
  title: 'Count Sub Islands',
  description: 'You are given two m x n binary matrices grid1 and grid2 containing only 0s (representing water) and 1s (representing land). An island in grid2 is considered a sub-island of an island in grid1 if every cell in the island in grid2 is also a land cell in grid1. Return the number of islands in grid2 that are considered sub-islands of islands in grid1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
  constraints: 'm == grid1.length == grid2.length. n == grid1[i].length == grid2[i].length. 1 <= m, n <= 200. grid1[i][j], grid2[i][j] is 0 or 1.',
  examples: [{
    input: '[[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0]], [[1,1,0,0,0],[0,1,1,0,1],[0,0,0,0,0]]',
    output: '1',
    explanation: 'There is only one sub-island in grid2 that is completely matching lands in grid1.'
  }],
  args: [
    { name: 'grid1', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid1: List[List[int]]', js: 'grid1' },
    { name: 'grid2', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid2: List[List[int]]', js: 'grid2' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Pruned DFS on grid2', content: 'Run DFS on lands of grid2 to find islands. During DFS traversal of island, check if every land cell matching grid2[r][c] is also a 1 in grid1. If yes, count as sub-island.' }],
  jsSolution: (grid1, grid2) => {
    const R = grid2.length;
    const C = grid2[0].length;
    const copy2 = grid2.map(row => [...row]);
    
    let subIslands = 0;
    
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C || copy2[r][c] === 0) return true;
      copy2[r][c] = 0;
      
      let match = grid1[r][c] === 1;
      const d1 = dfs(r + 1, c);
      const d2 = dfs(r - 1, c);
      const d3 = dfs(r, c + 1);
      const d4 = dfs(r, c - 1);
      
      return match && d1 && d2 && d3 && d4;
    };
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (copy2[r][c] === 1) {
          if (dfs(r, c)) subIslands++;
        }
      }
    }
    return subIslands;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1, 1, 0, 0], [0, 1, 1, 1, 1], [0, 0, 0, 0, 0]], [[1, 1, 0, 0, 0], [0, 1, 1, 0, 1], [0, 0, 0, 0, 0]]]);
    
    const gen = (r, c) => {
      const grid1 = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.45 ? 1 : 0)
      );
      const grid2 = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => 0)
      );
      // Copy some land from grid1 to grid2 with 50% probability to make sub-islands
      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (grid1[i][j] === 1 && Math.random() < 0.6) {
            grid2[i][j] = 1;
          }
        }
      }
      return [grid1, grid2];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12), randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20), randInt(12, 20)));
    return cases;
  }
},

// 11
{
  slug: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
  title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
  description: 'There are n cities numbered from 0 to n-1. Given the array edges where edges[i] = [from, to, weight] defines a bidirectional weighted edge between cities from and to, and given an integer distanceThreshold. Return the city with the smallest number of cities that are reachable through some path and whose distance is at most distanceThreshold. If there are multiple such cities, return the city with the greatest number.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Dynamic Programming', 'Graph', 'Shortest Path'],
  constraints: '2 <= n <= 100. 0 <= edges.length <= n * (n - 1) / 2. edges[i].length == 3. 0 <= from, to < n. 1 <= weight, distanceThreshold <= 10^4.',
  examples: [{ input: '4, [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], 4', output: '3', explanation: 'Smallest neighbors reachable <= 4 is City 3 (neighbors: {1, 2}).' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' },
    { name: 'distanceThreshold', cpp: 'int', java: 'int', py: 'distanceThreshold: int', js: 'distanceThreshold' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Floyd-Warshall Algorithm', content: 'Run Floyd-Warshall to compute all-pairs shortest paths. Then, for each city, count how many other cities are within distanceThreshold. Pick the city meeting the criteria.' }],
  jsSolution: (n, edges, distanceThreshold) => {
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    
    for (const [u, v, w] of edges) {
      if (u < n && v < n) {
        dist[u][v] = w;
        dist[v][u] = w;
      }
    }
    
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }
    
    let minReachable = Infinity;
    let ansCity = -1;
    
    for (let i = 0; i < n; i++) {
      let count = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j && dist[i][j] <= distanceThreshold) {
          count++;
        }
      }
      if (count <= minReachable) {
        minReachable = count;
        ansCity = i;
      }
    }
    return ansCity;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4]);
    cases.push([5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2]);
    
    const gen = (n) => {
      const edges = [];
      const numEdges = randInt(n - 1, n * 2);
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        const w = randInt(1, 50);
        if (u !== v) edges.push([u, v, w]);
      }
      const distanceThreshold = randInt(10, 80);
      return [n, edges, distanceThreshold];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 35)));
    return cases;
  }
},

// 12
{
  slug: 'path-with-maximum-probability',
  title: 'Path with Maximum Probability',
  description: 'You are given an undirected weighted graph of n nodes (0-indexed), represented by an edge list where edges[i] = [a, b] is an undirected edge connecting the nodes a and b with a probability of success of traversing that edge succProb[i]. Given two nodes start and end, find the path with the maximum probability of success to go from start to end and return its success probability. If there is no path from start to end, return 0. Your answer will be accepted if it differs from the correct answer by at most 10^-5.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Graph', 'Shortest Path'],
  constraints: '2 <= n <= 10^4. 0 <= edges.length <= start_node.length <= 2 * 10^4. 0 <= succProb[i] <= 1. 0 <= start, end < n.',
  examples: [{ input: '3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.2], 0, 2', output: '0.25', explanation: 'Path 0->1->2 has probability 0.5 * 0.5 = 0.25.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' },
    { name: 'succProb', cpp: 'vector<double>&', java: 'double[]', py: 'succProb: List[float]', js: 'succProb' },
    { name: 'start_node', cpp: 'int', java: 'int', py: 'start_node: int', js: 'start_node' },
    { name: 'end_node', cpp: 'int', java: 'int', py: 'end_node: int', js: 'end_node' }
  ],
  retType: { cpp: 'double', java: 'double', py: 'float' },
  hints: [{ title: 'Dijkstra for product prob', content: 'Use Dijkstra\'s shortest path algorithm. Instead of adding weights, multiply probabilities. Track max probabilities starting from start_node as 1.0.' }],
  jsSolution: (n, edges, succProb, start_node, end_node) => {
    const probs = Array(n).fill(0);
    probs[start_node] = 1.0;
    
    // Bellman-Ford simplifies execution for verification
    for (let i = 0; i < n; i++) {
      let updated = false;
      for (let j = 0; j < edges.length; j++) {
        const [u, v] = edges[j];
        const p = succProb[j];
        if (u < n && v < n) {
          if (probs[u] * p > probs[v]) {
            probs[v] = probs[u] * p;
            updated = true;
          }
          if (probs[v] * p > probs[u]) {
            probs[u] = probs[v] * p;
            updated = true;
          }
        }
      }
      if (!updated) break;
    }
    
    const ans = probs[end_node];
    return Math.round(ans * 100000) / 100000; // round to 5 decimal places for verification match
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2]);
    cases.push([3, [[0, 1]], [0.5], 0, 2]);
    
    const gen = (n) => {
      const edges = [];
      const succProb = [];
      const numEdges = randInt(n - 1, n * 2);
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u !== v) {
          edges.push([u, v]);
          succProb.push(Math.round((0.1 + Math.random() * 0.9) * 10) / 10);
        }
      }
      const start = randInt(0, n - 1);
      let end = randInt(0, n - 1);
      while (end === start && n > 1) end = randInt(0, n - 1);
      return [n, edges, succProb, start, end];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20)));
    return cases;
  }
},

// 13
{
  slug: 'minimum-genetic-mutation',
  title: 'Minimum Genetic Mutation',
  description: 'A gene string can be represented by an 8-character long string, with choices from \'A\', \'C\', \'G\', and \'T\'. A genetic mutation can occur from startGene to endGene where one mutation is defined as a 1-character change in the gene string. You are also given a gene bank bank that records all the valid gene mutations. A gene must be in bank to make it a valid gene string. Given the two gene strings startGene and endGene and the gene bank bank, return the minimum number of mutations needed to mutate from startGene to endGene. If there is no such mutation, return -1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Hash Table', 'String', 'Breadth-First Search'],
  constraints: 'startGene.length == endGene.length == 8. 0 <= bank.length <= 10. bank[i].length == 8. startGene, endGene, bank[i] consist of \'A\', \'C\', \'G\', and \'T\'.',
  examples: [{ input: '"AACCGGTT", "AACCGGTA", ["AACCGGTA"]', output: '1' }],
  args: [
    { name: 'startGene', cpp: 'string', java: 'String', py: 'startGene: str', js: 'startGene' },
    { name: 'endGene', cpp: 'string', java: 'String', py: 'endGene: str', js: 'endGene' },
    { name: 'bank', cpp: 'vector<string>&', java: 'List<String>', py: 'bank: List[str]', js: 'bank' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BFS mutation', content: 'BFS queue starting with [startGene, 0]. In each step, generate all single letter changes and check if they exist in bank. Remove matched nodes from bank set.' }],
  jsSolution: (startGene, endGene, bank) => {
    const bankSet = new Set(bank);
    if (!bankSet.has(endGene)) return -1;
    
    const q = [[startGene, 0]];
    const visited = new Set([startGene]);
    
    while (q.length > 0) {
      const [curr, steps] = q.shift();
      if (curr === endGene) return steps;
      
      for (let i = 0; i < curr.length; i++) {
        for (const char of ['A', 'C', 'G', 'T']) {
          if (char === curr[i]) continue;
          const nextGene = curr.substring(0, i) + char + curr.substring(i + 1);
          if (bankSet.has(nextGene) && !visited.has(nextGene)) {
            visited.add(nextGene);
            q.push([nextGene, steps + 1]);
          }
        }
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["AACCGGTT", "AACCGGTA", ["AACCGGTA"]]);
    cases.push(["AACCGGTT", "AAACGGTA", ["AACCGGTA", "AACCGCTA", "AAACGGTA"]]);
    
    const genes = ['AACCGGTT', 'AACCGGTA', 'AACCGCTA', 'AAACGGTA', 'AAACGGAA', 'AAACGGAT', 'TTACGGAT', 'TGACGGAT'];
    const gen = () => {
      const start = 'AACCGGTT';
      const end = genes[randInt(1, genes.length - 1)];
      const bank = genes.slice(1, randInt(2, genes.length));
      return [start, end, bank];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 14
{
  slug: 'critical-connections-in-a-network',
  title: 'Critical Connections in a Network',
  description: 'There are n servers numbered from 0 to n - 1 connected by undirected server-to-server connections forming a network. You are given the representation of the connections. A critical connection is a connection that, if removed, will make some servers unable to reach some other server. Return all critical connections in the network in any order.',
  difficulty: 'Hard',
  category: 'Graphs',
  tags: ['Graph', 'Depth-First Search'],
  constraints: '2 <= n <= 10^5. n - 1 <= connections.length <= 10^5. connections[i] = [ai, bi].',
  examples: [{ input: '4, [[0,1],[1,2],[2,0],[1,3]]', output: '[[1,3]]', explanation: 'Only [1,3] is critical as [0,1], [1,2], [2,0] form a cycle.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'connections', cpp: 'vector<vector<int>>&', java: 'List<List<Integer>>', py: 'connections: List[List[int]]', js: 'connections' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'Tarjan\'s Bridge Finding', content: 'Use Tarjan\'s DFS bridge-finding algorithm. Maintain discovery time (`disc`) and lowest reachable node time (`low`). If DFS on child yields `low[child] > disc[node]`, it means the edge is a bridge (critical connection).' }],
  jsSolution: (n, connections) => {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of connections) {
      if (u < n && v < n) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }
    const disc = Array(n).fill(-1);
    const low = Array(n).fill(-1);
    const bridges = [];
    let time = 0;
    
    const dfs = (node, parent) => {
      disc[node] = low[node] = time++;
      for (const neighbor of adj[node]) {
        if (neighbor === parent) continue;
        if (disc[neighbor] === -1) {
          dfs(neighbor, node);
          low[node] = Math.min(low[node], low[neighbor]);
          if (low[neighbor] > disc[node]) {
            bridges.push([Math.min(node, neighbor), Math.max(node, neighbor)]);
          }
        } else {
          low[node] = Math.min(low[node], disc[neighbor]);
        }
      }
    };
    
    dfs(0, -1);
    return bridges;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, [[0, 1], [1, 2], [2, 0], [1, 3]]]);
    cases.push([5, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]]]);
    
    const gen = (n) => {
      // Build a base cycle graph (0-1-2-0)
      const edges = [[0, 1], [1, 2], [2, 0]];
      // Add branches up to n - 1
      for (let i = 3; i < n; i++) {
        edges.push([randInt(0, i - 1), i]);
      }
      return [n, edges];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(4, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 50)));
    return cases;
  }
},

// 15
{
  slug: 'evaluate-division',
  title: 'Evaluate Division',
  description: 'You are given an array of variable pairs equations and an array of real numbers values, where equations[i] = [Ai, Bi] and values[i] represent the equation Ai / Bi = values[i]. Each Ai or Bi is a string that represents a single variable. You are also given some queries, where queries[j] = [Cj, Dj] represents the jth query where you must find the value of Cj / Dj = ?. Return the answers to all queries. If a single answer cannot be determined, return -1.0.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Hash Table', 'String', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: '1 <= equations.length <= 20. equations[i].length == 2. values.length == equations.length. 0.0 < values[i] <= 20.0. 1 <= queries.length <= 20. queries[i].length == 2.',
  examples: [{ input: '[["a","b"],["b","c"]], [2.0,3.0], [["a","c"],["b","a"],["a","e"]]', output: '[6.0,0.5,-1.0]' }],
  args: [
    { name: 'equations', cpp: 'vector<vector<string>>&', java: 'List<List<String>>', py: 'equations: List[List[str]]', js: 'equations' },
    { name: 'values', cpp: 'vector<double>&', java: 'double[]', py: 'values: List[float]', js: 'values' },
    { name: 'queries', cpp: 'vector<vector<string>>&', java: 'List<List<String>>', py: 'queries: List[List[str]]', js: 'queries' }
  ],
  retType: { cpp: 'vector<double>', java: 'double[]', py: 'List[float]' },
  hints: [{ title: 'Weighted Directed Graph DFS', content: 'Represent variables as vertices and equations as directed edges with weights (Ai -> Bi with weight val, Bi -> Ai with weight 1/val). Run DFS for each query to compute the cumulative product path.' }],
  jsSolution: (equations, values, queries) => {
    const adj = {};
    for (let i = 0; i < equations.length; i++) {
      const [u, v] = equations[i];
      const val = values[i];
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push([v, val]);
      adj[v].push([u, 1.0 / val]);
    }
    
    const solve = (start, end, visited) => {
      if (!adj[start] || !adj[end]) return -1.0;
      if (start === end) return 1.0;
      
      visited.add(start);
      for (const [neighbor, val] of adj[start]) {
        if (!visited.has(neighbor)) {
          const product = solve(neighbor, end, visited);
          if (product !== -1.0) {
            return val * product;
          }
        }
      }
      return -1.0;
    };
    
    return queries.map(([u, v]) => solve(u, v, new Set()));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[["a", "b"], ["b", "c"]], [2.0, 3.0], [["a", "c"], ["b", "a"], ["a", "e"]]]);
    cases.push([[["a", "b"]], [0.5], [["a", "b"], ["b", "a"]]]);
    
    const gen = () => {
      const equations = [["x", "y"], ["y", "z"], ["z", "w"]];
      const values = [randInt(2, 5), randInt(1, 4), randInt(3, 6)];
      const queries = [["x", "z"], ["y", "w"], ["x", "a"]];
      return [equations, values, queries];
    };
    for (let i = 0; i < 48; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    for (let i = 0; i < 50; i++) cases.push(gen());
    return cases;
  }
},

// 16
{
  slug: 'all-ancestors-of-a-node-in-a-directed-acyclic-graph',
  title: 'All Ancestors of a Node in a Directed Acyclic Graph',
  description: 'You are given a positive integer n representing the number of nodes of a Directed Acyclic Graph (DAG). The nodes are numbered from 0 to n - 1 (inclusive). You are also given a 2D integer array edges where edges[i] = [from, to] denotes that there is a directed edge from from to to in the graph. Return a list answer where answer[i] is the list of ancestors of the i-th node, sorted in ascending order. A node u is an ancestor of v if u can reach v through a set of directed edges.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
  constraints: '1 <= n <= 1000. 0 <= edges.length <= min(2000, n * (n - 1) / 2). edges[i].length == 2. 0 <= from, to < n. from != to. There are no duplicate edges.',
  examples: [{ input: '5, [[0,1],[0,2],[1,3],[2,3],[3,4]]', output: '[[0],[0],[0],[0,1,2],[0,1,2,3]]', explanation: 'Ancestors are listed and sorted ascending.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'Reversed Edge DFS', content: 'Reverse the edges so parent points to child, wait - no, if we reverse edges (u -> v becomes v -> u), then ancestors of node i are just all reachable nodes from node i. Run DFS from each node to mark reachable nodes.' }],
  jsSolution: (n, edges) => {
    const revAdj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      if (u < n && v < n) {
        revAdj[v].push(u); // parent points to v? u points to v, so revAdj[v] contains u
      }
    }
    
    const getAncestors = (start) => {
      const visited = new Set();
      const q = [start];
      while (q.length > 0) {
        const curr = q.shift();
        for (const ancestor of revAdj[curr]) {
          if (!visited.has(ancestor)) {
            visited.add(ancestor);
            q.push(ancestor);
          }
        }
      }
      return Array.from(visited).sort((a, b) => a - b);
    };
    
    const ans = [];
    for (let i = 0; i < n; i++) {
      ans.push(getAncestors(i));
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]]);
    cases.push([3, [[0, 1], [1, 2]]]);
    
    const gen = (n) => {
      const edges = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.random() < 0.35) {
            edges.push([i, j]);
          }
        }
      }
      return [n, edges];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 35)));
    return cases;
  }
},

// 17
{
  slug: 'loud-and-rich',
  title: 'Loud and Rich',
  description: 'There is a group of n people labeled from 0 to n - 1 where each person has a different amount of money and a different level of quietness. You are given richer, a 2D integer array where richer[i] = [ai, bi] indicates that ai has more money than bi. Also, quiet is an integer array where quiet[i] is the quietness of person i. Return an integer array answer where answer[x] = y such that person y is among all people who have equal to or more money than x, and y has the least quietness.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Graph'],
  constraints: 'n == quiet.length. 1 <= n <= 500. 0 <= richer.length <= n * (n - 1) / 2. richer[i] = [ai, bi]. All values of quiet are unique.',
  examples: [{ input: '[[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]], [3,2,5,4,6,1,7,0]', output: '[5,5,2,5,4,5,6,7]' }],
  args: [
    { name: 'richer', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'richer: List[List[int]]', js: 'richer' },
    { name: 'quiet', cpp: 'vector<int>&', java: 'int[]', py: 'quiet: List[int]', js: 'quiet' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Memoized DFS on DAG', content: 'Construct a DAG where an edge u -> v means u is richer than v. Run memoized DFS: for person x, find the quietest person among all richer ancestors (starting from their direct richer parents).' }],
  jsSolution: (richer, quiet) => {
    const N = quiet.length;
    const adj = Array.from({ length: N }, () => []);
    for (const [u, v] of richer) {
      if (u < N && v < N) {
        adj[v].push(u); // reverse link to find richer ancestors easily
      }
    }
    
    const ans = Array(N).fill(-1);
    
    const dfs = (node) => {
      if (ans[node] !== -1) return ans[node];
      ans[node] = node;
      for (const parent of adj[node]) {
        const candidate = dfs(parent);
        if (quiet[candidate] < quiet[ans[node]]) {
          ans[node] = candidate;
        }
      }
      return ans[node];
    };
    
    for (let i = 0; i < N; i++) dfs(i);
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 0], [2, 1], [3, 1], [3, 7], [4, 3], [5, 3], [6, 3]], [3, 2, 5, 4, 6, 1, 7, 0]]);
    cases.push([[], [0]]);
    
    const gen = (n) => {
      const richer = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.random() < 0.3) {
            richer.push([i, j]);
          }
        }
      }
      // Unique random quiet values
      const quiet = Array.from({ length: n }, (_, i) => i).sort(() => 0.5 - Math.random());
      return [richer, quiet];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 18
{
  slug: 'map-of-highest-peak',
  title: 'Map of Highest Peak',
  description: 'You are given an m x n integer matrix isWater where isWater[i][j] is 0 if cell (i, j) is land and 1 if cell (i, j) is water. You must assign each cell a height such that: the height of each water cell must be 0, the height of any two adjacent cells must differ by at most 1, and the height of each cell must be as large as possible. Return an integer matrix height representing the height assignment.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == isWater.length. n == isWater[i].length. 1 <= m, n <= 1000. isWater[i][j] is 0 or 1. There is at least one water cell.',
  examples: [{ input: '[[0,1],[0,0]]', output: '[[1,0],[2,1]]', explanation: 'Water cell at [0,1] is 0. Surrounding lands are 1, and the far land is 2.' }],
  args: [{ name: 'isWater', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'isWater: List[List[int]]', js: 'isWater' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Multi-source BFS', content: 'This is a shortest distance problem. Enqueue all water cells with height 0. Run BFS, assigning height[neighbor] = height[curr] + 1 for unvisited cells.' }],
  jsSolution: (isWater) => {
    const R = isWater.length;
    const C = isWater[0].length;
    const height = Array.from({ length: R }, () => Array(C).fill(-1));
    const q = [];
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (isWater[r][c] === 1) {
          height[r][c] = 0;
          q.push([r, c]);
        }
      }
    }
    
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length > 0) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C && height[nr][nc] === -1) {
          height[nr][nc] = height[r][c] + 1;
          q.push([nr, nc]);
        }
      }
    }
    return height;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 1], [0, 0]]]);
    cases.push([[[0, 0, 1], [1, 0, 0], [0, 0, 0]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.2 ? 1 : 0)
      );
      grid[randInt(0, r - 1)][randInt(0, c - 1)] = 1; // guarantee at least one water
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12), randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20), randInt(12, 20)));
    return cases;
  }
},

// 19
{
  slug: 'matrix-01',
  title: '01 Matrix',
  description: 'Given an m x n binary matrix mat, return the distance of the nearest 0 for each cell. The distance between two adjacent cells is 1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Dynamic Programming', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == mat.length. n == mat[i].length. 1 <= m, n <= 10^4. mat[i][j] is 0 or 1. There is at least one 0 in mat.',
  examples: [{ input: '[[0,0,0],[0,1,0],[1,1,1]]', output: '[[0,0,0],[0,1,0],[1,2,1]]' }],
  args: [{ name: 'mat', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'mat: List[List[int]]', js: 'mat' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Multi-source BFS from 0s', content: 'Push all coordinates of 0s into queue. Initialize distances of 1s to Infinity. Run BFS, updating neighbor distances as dist[curr] + 1.' }],
  jsSolution: (mat) => {
    const R = mat.length;
    const C = mat[0].length;
    const dist = Array.from({ length: R }, () => Array(C).fill(Infinity));
    const q = [];
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (mat[r][c] === 0) {
          dist[r][c] = 0;
          q.push([r, c]);
        }
      }
    }
    
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length > 0) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C && dist[nr][nc] === Infinity) {
          dist[nr][nc] = dist[r][c] + 1;
          q.push([nr, nc]);
        }
      }
    }
    return dist;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 0, 0], [0, 1, 0], [1, 1, 1]]]);
    cases.push([[[0, 0, 0], [0, 1, 0], [0, 0, 0]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.25 ? 0 : 1)
      );
      grid[randInt(0, r - 1)][randInt(0, c - 1)] = 0; // guarantee at least one 0
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12), randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20), randInt(12, 20)));
    return cases;
  }
},

// 20
{
  slug: 'coloring-a-border',
  title: 'Coloring A Border',
  description: 'You are given a 2D integer grid grid, and three integers row, col, and color. A component of a grid is a 4-directionally connected group of grid square of the same color as grid[row][col]. The border of a component is defined as any pixel in the component that is either 4-directionally adjacent to a pixel outside the component, or is on the boundary of the grid. Color the border of this component with color. Return the final grid.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == grid.length. n == grid[i].length. 1 <= m, n <= 50. 1 <= grid[i][j], color <= 1000. 0 <= row < m. 0 <= col < n.',
  examples: [{ input: '[[1,1],[1,2]], 0, 0, 3', output: '[[3,3],[3,2]]' }],
  args: [
    { name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' },
    { name: 'row', cpp: 'int', java: 'int', py: 'row: int', js: 'row' },
    { name: 'col', cpp: 'int', java: 'int', py: 'col: int', js: 'col' },
    { name: 'color', cpp: 'int', java: 'int', py: 'color: int', js: 'color' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'DFS Border Detection', content: 'Run DFS from grid[row][col] to find the component. Mark visited cells. A cell is a border if it is on the outer boundary of the grid or has any 4-directional neighbor not in the component. Paint only borders.' }],
  jsSolution: (grid, row, col, color) => {
    const R = grid.length;
    const C = grid[0].length;
    const startColor = grid[row][col];
    const copy = grid.map(row => [...row]);
    const visited = Array.from({ length: R }, () => Array(C).fill(false));
    const borders = [];
    
    const dfs = (r, c) => {
      visited[r][c] = true;
      let isBorder = false;
      
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= R || nc >= C) {
          isBorder = true;
        } else {
          if (!visited[nr][nc] && grid[nr][nc] === startColor) {
            dfs(nr, nc);
          } else if (grid[nr][nc] !== startColor && !visited[nr][nc]) {
            isBorder = true;
          }
        }
      }
      if (isBorder) borders.push([r, c]);
    };
    
    dfs(row, col);
    for (const [br, bc] of borders) {
      copy[br][bc] = color;
    }
    return copy;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1], [1, 2]], 0, 0, 3]);
    cases.push([[[1, 2, 2], [2, 3, 2]], 0, 1, 3]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => randInt(1, 3))
      );
      const row = randInt(0, r - 1);
      const col = randInt(0, c - 1);
      const color = randInt(5, 10);
      return [grid, row, col, color];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 10), randInt(5, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 15), randInt(10, 15)));
    return cases;
  }
},

// 21
{
  slug: 'minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix',
  title: 'Minimum Number of Flips to Convert Binary Matrix to Zero Matrix',
  description: 'Given a m x n binary matrix mat. In one step, you can choose one cell and flip it and all the four neighbors of it if they exist (Flip is changing 1 to 0 and 0 to 1). A zero matrix is a matrix with all cells equal to 0. Return the minimum number of steps required to convert mat to a zero matrix or -1 if you cannot.',
  difficulty: 'Hard',
  category: 'Graphs',
  tags: ['Array', 'Bit Manipulation', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == mat.length. n == mat[i].length. 1 <= m, n <= 3. mat[i][j] is 0 or 1.',
  examples: [{ input: '[[0,0],[0,1]]', output: '3', explanation: 'Flip at [1,0] -> flip at [0,1] -> flip at [1,1].' }],
  args: [{ name: 'mat', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'mat: List[List[int]]', js: 'mat' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BFS over Bitmask States', content: 'Since matrix size is at most 3x3, there are only 2^9 = 512 states. Represent matrix as a bitmask. Run BFS starting with the initial matrix state.' }],
  jsSolution: (mat) => {
    const R = mat.length;
    const C = mat[0].length;
    const limit = R * C;
    
    const serialize = (m) => {
      let mask = 0;
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          if (m[r][c] === 1) {
            mask |= (1 << (r * C + c));
          }
        }
      }
      return mask;
    };
    
    const flipCell = (mask, r, c) => {
      const dirs = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C) {
          const bitIdx = nr * C + nc;
          mask ^= (1 << bitIdx);
        }
      }
      return mask;
    };
    
    const start = serialize(mat);
    if (start === 0) return 0;
    
    const q = [[start, 0]];
    const visited = new Set([start]);
    
    while (q.length > 0) {
      const [curr, steps] = q.shift();
      if (curr === 0) return steps;
      
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          const nextMask = flipCell(curr, r, c);
          if (!visited.has(nextMask)) {
            visited.add(nextMask);
            q.push([nextMask, steps + 1]);
          }
        }
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 0], [0, 1]]]);
    cases.push([[[1, 0, 0], [1, 0, 0]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.5 ? 1 : 0)
      );
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 2), randInt(1, 2)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(2, 3), randInt(2, 3)));
    for (let i = 0; i < 50; i++) cases.push(gen(3, 3));
    return cases;
  }
},

// 22
{
  slug: 'minimum-cost-to-reach-destination-in-time',
  title: 'Minimum Cost to Reach Destination in Time',
  description: 'There is a country with n cities, numbered from 0 to n - 1. You want to travel from city 0 to city n - 1. You are given an integer maxTime, and a 2D integer array edges where edges[i] = [ui, vi, timei] indicates a road between ui and vi taking timei. Also, you are given passingFees array where passingFees[i] is the fee to enter city i. Return the minimum cost to reach city n - 1 in maxTime. If it is impossible, return -1.',
  difficulty: 'Hard',
  category: 'Graphs',
  tags: ['Graph', 'Shortest Path'],
  constraints: '2 <= n <= 1000. 1 <= maxTime <= 1000. 0 <= edges.length <= 1000. edges[i].length == 3. 1 <= timei <= 1000. passingFees.length == n. 1 <= passingFees[i] <= 1000.',
  examples: [{ input: '30, [[0,1,10],[1,2,15],[0,2,25]], [5,10,20]', output: '25' }],
  args: [
    { name: 'maxTime', cpp: 'int', java: 'int', py: 'maxTime: int', js: 'maxTime' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' },
    { name: 'passingFees', cpp: 'vector<int>&', java: 'int[]', py: 'passingFees: List[int]', js: 'passingFees' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Dijkstra with time states', content: 'Dijkstra tracking the minimum cost to reach node `i` in time `t`. Maintain `minTime[node]` array representing the minimum time we have reached `node` with a cheaper fee. Prune states accordingly.' }],
  jsSolution: (maxTime, edges, passingFees) => {
    const N = passingFees.length;
    const adj = Array.from({ length: N }, () => []);
    for (const [u, v, t] of edges) {
      if (u < N && v < N) {
        adj[u].push([v, t]);
        adj[v].push([u, t]);
      }
    }
    
    // DP state: dp[i][t] = min cost to reach city i in exactly t time
    const dp = Array.from({ length: N }, () => Array(maxTime + 1).fill(Infinity));
    dp[0][0] = passingFees[0];
    
    const q = [[0, 0, passingFees[0]]]; // [u, t, fee]
    
    while (q.length > 0) {
      q.sort((a, b) => a[2] - b[2]); // Sort to act like Dijkstra
      const [u, t, fee] = q.shift();
      
      if (fee > dp[u][t]) continue;
      
      for (const [v, travelTime] of adj[u]) {
        const nextTime = t + travelTime;
        if (nextTime <= maxTime) {
          const nextFee = fee + passingFees[v];
          if (nextFee < dp[v][nextTime]) {
            dp[v][nextTime] = nextFee;
            q.push([v, nextTime, nextFee]);
          }
        }
      }
    }
    
    let minCost = Infinity;
    for (let t = 0; t <= maxTime; t++) {
      minCost = Math.min(minCost, dp[N - 1][t]);
    }
    return minCost === Infinity ? -1 : minCost;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([30, [[0, 1, 10], [1, 2, 15], [0, 2, 25]], [5, 10, 20]]);
    cases.push([20, [[0, 1, 10], [1, 2, 15], [0, 2, 25]], [5, 10, 20]]);
    
    const gen = (n) => {
      const edges = [];
      for (let i = 0; i < n - 1; i++) {
        edges.push([i, i + 1, randInt(5, 15)]);
      }
      // Add a couple of random shortcuts
      const shortcuts = randInt(0, 3);
      for (let i = 0; i < shortcuts; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u !== v) edges.push([u, v, randInt(5, 20)]);
      }
      const maxTime = randInt(20, 60);
      const passingFees = Array.from({ length: n }, () => randInt(1, 50));
      return [maxTime, edges, passingFees];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 18)));
    return cases;
  }
},

// 23
{
  slug: 'count-unreachable-pairs-of-nodes-in-an-undirected-graph',
  title: 'Count Unreachable Pairs of Nodes in an Undirected Graph',
  description: 'You are given an integer n and a 2D integer array edges where edges[i] = [ai, bi] denotes that there is an undirected edge between nodes ai and bi. Return the number of pairs of different nodes that are unreachable from each other.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: '1 <= n <= 10^5. 0 <= edges.length <= 2 * 10^5. edges[i].length == 2. 0 <= ai, bi < n.',
  examples: [{ input: '3, [[0,1]]', output: '2', explanation: 'Node 2 is unreachable from 0 and 1. Unreachable pairs are: (0,2) and (1,2).' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }
  ],
  retType: { cpp: 'long long', java: 'long', py: 'int' },
  hints: [{ title: 'Connected component sizes', content: 'Find sizes of all connected components using Union-Find or DFS. The number of unreachable pairs is: sum(size * (n - size)) / 2.' }],
  jsSolution: (n, edges) => {
    const parent = Array.from({ length: n }, (_, i) => i);
    const size = Array(n).fill(1);
    
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    
    const union = (i, j) => {
      const rI = find(i);
      const rJ = find(j);
      if (rI !== rJ) {
        if (size[rI] < size[rJ]) {
          parent[rI] = rJ;
          size[rJ] += size[rI];
        } else {
          parent[rJ] = rI;
          size[rI] += size[rJ];
        }
      }
    };
    
    for (const [u, v] of edges) {
      if (u < n && v < n) union(u, v);
    }
    
    const roots = {};
    for (let i = 0; i < n; i++) {
      const root = find(i);
      roots[root] = size[root];
    }
    
    let ans = 0;
    let nodesRemaining = n;
    for (const count of Object.values(roots)) {
      ans += count * (nodesRemaining - count);
      nodesRemaining -= count;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, [[0, 1]]]);
    cases.push([7, [[0, 2], [0, 5], [2, 4], [1, 6], [5, 4]]]);
    
    const gen = (n) => {
      const edges = [];
      const numEdges = randInt(0, Math.floor(n * 1.2));
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u !== v) edges.push([u, v]);
      }
      const seen = new Set();
      const unique = [];
      for (const [u, v] of edges) {
        const hash = `${Math.min(u, v)},${Math.max(u, v)}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          unique.push([u, v]);
        }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
},

// 24
{
  slug: 'number-of-ways-to-arrive-at-destination',
  title: 'Number of Ways to Arrive at Destination',
  description: 'You are in a city that consists of n intersections numbered from 0 to n - 1 with bi-directional roads between some intersections. You are given a 2D integer array roads where roads[i] = [ui, vi, timei] means that there is a road between intersections ui and vi that takes timei minutes to travel. You want to know in how many ways you can travel from intersection 0 to intersection n - 1 in the shortest amount of time. Return the number of ways you can arrive at your destination. Since the answer may be large, return it modulo 10^9 + 7.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Dynamic Programming', 'Graph', 'Shortest Path'],
  constraints: '1 <= n <= 200. n - 1 <= roads.length <= n * (n - 1) / 2. roads[i].length == 3. 0 <= ui, vi < n. 1 <= timei <= 10^9. All intersections are connected.',
  examples: [{ input: '7, [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]', output: '4' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'roads', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'roads: List[List[int]]', js: 'roads' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Dijkstra SSSP with DP counter', content: 'Dijkstra single source shortest path from 0. Track `dist[i]` and `ways[i]`. If a cheaper path is found to `v`, update `dist[v] = dist[u] + cost` and reset `ways[v] = ways[u]`. If path of equal cost is found, add `ways[v] = (ways[v] + ways[u]) % MOD`.' }],
  jsSolution: (n, roads) => {
    const MOD = 1000000007;
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v, t] of roads) {
      if (u < n && v < n) {
        adj[u].push([v, t]);
        adj[v].push([u, t]);
      }
    }
    
    const dist = Array(n).fill(Infinity);
    const ways = Array(n).fill(0);
    dist[0] = 0;
    ways[0] = 1;
    
    const q = [[0, 0]]; // [node, time]
    
    while (q.length > 0) {
      q.sort((a, b) => a[1] - b[1]);
      const [u, time] = q.shift();
      
      if (time > dist[u]) continue;
      
      for (const [v, t] of adj[u]) {
        const nextTime = time + t;
        if (nextTime < dist[v]) {
          dist[v] = nextTime;
          ways[v] = ways[u];
          q.push([v, nextTime]);
        } else if (nextTime === dist[v]) {
          ways[v] = (ways[v] + ways[u]) % MOD;
        }
      }
    }
    return ways[n - 1];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([7, [[0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3], [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2]]]);
    cases.push([2, [[0, 1, 3]]]);
    
    const gen = (n) => {
      const roads = [];
      for (let i = 0; i < n - 1; i++) {
        roads.push([i, i + 1, randInt(1, 10)]);
      }
      // Add random edges
      const extra = randInt(0, n);
      for (let i = 0; i < extra; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u !== v) roads.push([u, v, randInt(1, 10)]);
      }
      return [n, roads];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 35)));
    return cases;
  }
},

// 25
{
  slug: 'divide-nodes-into-the-maximum-number-of-groups',
  title: 'Divide Nodes Into the Maximum Number of Groups',
  description: 'You are given a positive integer n representing the number of nodes in an undirected graph. The nodes are labeled from 1 to n. You are also given a 2D integer array edges where edges[i] = [ai, bi] indicates that there is a bidirectional edge between nodes ai and bi. Return the maximum number of groups the nodes can be divided into such that: each node belongs to exactly one group, for every edge [ai, bi], if ai is in group x and bi is in group y, then |x - y| == 1. Return -1 if it is impossible to group the nodes.',
  difficulty: 'Hard',
  category: 'Graphs',
  tags: ['Breadth-First Search', 'Union Find', 'Graph'],
  constraints: '1 <= n <= 500. 1 <= edges.length <= 10^4. edges[i].length == 2. 1 <= ai, vi <= n. No self loops or duplicate edges.',
  examples: [{ input: '6, [[1,2],[1,4],[1,5],[2,6],[5,6]]', output: '4', explanation: 'Group 1: {4}, Group 2: {1}, Group 3: {2, 5}, Group 4: {6}. Total = 4 groups.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Graph bipartiteness BFS', content: 'A valid grouping exists if and only if each connected component is bipartite (has no odd cycles). The maximum groups in a bipartite component is the maximum BFS depth starting from any node in that component.' }],
  jsSolution: (n, edges) => {
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v] of edges) {
      if (u <= n && v <= n) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }
    
    // Check if component is bipartite, and find all components
    const color = Array(n + 1).fill(0);
    const components = [];
    
    for (let i = 1; i <= n; i++) {
      if (color[i] === 0) {
        const comp = [];
        const q = [i];
        color[i] = 1;
        while (q.length > 0) {
          const curr = q.shift();
          comp.push(curr);
          for (const neighbor of adj[curr]) {
            if (color[neighbor] === color[curr]) return -1; // odd cycle
            if (color[neighbor] === 0) {
              color[neighbor] = -color[curr];
              q.push(neighbor);
            }
          }
        }
        components.push(comp);
      }
    }
    
    // For each node, find the max BFS depth
    const bfsMaxDepth = (start) => {
      const visited = Array(n + 1).fill(-1);
      visited[start] = 1;
      const q = [start];
      let maxD = 1;
      while (q.length > 0) {
        const curr = q.shift();
        for (const neighbor of adj[curr]) {
          if (visited[neighbor] === -1) {
            visited[neighbor] = visited[curr] + 1;
            maxD = Math.max(maxD, visited[neighbor]);
            q.push(neighbor);
          }
        }
      }
      return maxD;
    };
    
    let totalGroups = 0;
    for (const comp of components) {
      let maxDepthForComp = 0;
      for (const node of comp) {
        maxDepthForComp = Math.max(maxDepthForComp, bfsMaxDepth(node));
      }
      totalGroups += maxDepthForComp;
    }
    return totalGroups;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([6, [[1, 2], [1, 4], [1, 5], [2, 6], [5, 6]]]);
    cases.push([3, [[1, 2], [2, 3], [3, 1]]]);
    
    const gen = (n, bipartite) => {
      const edges = [];
      if (bipartite) {
        const parent = Array.from({ length: n + 1 }, (_, i) => i);
        const find = (i) => { if (parent[i] === i) return i; return parent[i] = find(parent[i]); };
        const union = (i, j) => { const rI = find(i); const rJ = find(j); if (rI !== rJ) { parent[rI] = rJ; return true; } return false; };
        
        // Build bipartite trees
        let count = n;
        while (count > 1) {
          const u = randInt(1, n);
          const v = randInt(1, n);
          if (u !== v && union(u, v)) {
            edges.push([u, v]);
            count--;
          }
        }
      } else {
        // Odd cycle generator
        for (let i = 1; i <= n; i++) {
          for (let j = i + 1; j <= n; j++) {
            if (Math.random() < 0.35) edges.push([i, j]);
          }
        }
        if (n >= 3) {
          edges.push([1, 2]);
          edges.push([2, 3]);
          edges.push([3, 1]);
        }
      }
      const seen = new Set();
      const unique = [];
      for (const [u, v] of edges) {
        const hash = `${Math.min(u, v)},${Math.max(u, v)}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          unique.push([u, v]);
        }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 35), Math.random() < 0.5));
    return cases;
  }
}

];
