// Graphs — Batch 1 (25 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

export const problems = [

// 1
{
  slug: 'find-center-of-star-graph',
  title: 'Find Center of Star Graph',
  description: 'There is an undirected star graph consisting of n nodes labeled from 1 to n. A star graph is a graph where there is one center node and exactly n - 1 edges that connect the center node with every other node. Given a 2D integer array edges where each edges[i] = [ui, vi] indicates that there is an edge between the nodes ui and vi, return the center of the given star graph.',
  difficulty: 'Easy',
  category: 'Graphs',
  tags: ['Graph'],
  constraints: '3 <= n <= 10^5. edges.length == n - 1. edges[i].length == 2. The given edges represent a valid star graph.',
  examples: [{ input: '[[1,2],[5,1],[1,3],[1,4]]', output: '1', explanation: 'Node 1 is connected to every other node.' }],
  args: [{ name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Common node', content: 'The center node must appear in every edge. Thus, it is simply the common node between the first two edges.' }],
  jsSolution: (edges) => {
    const [u1, v1] = edges[0];
    const [u2, v2] = edges[1];
    return (u1 === u2 || u1 === v2) ? u1 : v1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [5, 1], [1, 3], [1, 4]]]);
    cases.push([[[1, 2], [2, 3], [4, 2]]]);
    
    const gen = (n) => {
      const center = randInt(1, n);
      const edges = [];
      for (let i = 1; i <= n; i++) {
        if (i !== center) {
          if (Math.random() < 0.5) {
            edges.push([center, i]);
          } else {
            edges.push([i, center]);
          }
        }
      }
      // Shuffle edges
      for (let i = edges.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [edges[i], edges[j]] = [edges[j], edges[i]];
      }
      return [edges];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(4, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 2
{
  slug: 'find-if-path-exists-in-graph',
  title: 'Find if Path Exists in Graph',
  description: 'There is a bi-directional graph with n vertices, where each vertex is labeled from 0 to n - 1 (inclusive). The edges in the graph are represented as a 2D integer array edges where each edges[i] = [ui, vi] denotes a bi-directional edge between vertex ui and vertex vi. Every vertex pair is connected by at most one edge, and no vertex has a self-loop. Given edges and integers n, source, and destination, return true if there is a valid path from source to destination, or false otherwise.',
  difficulty: 'Easy',
  category: 'Graphs',
  tags: ['Graph', 'Depth-First Search', 'Breadth-First Search', 'Union Find'],
  constraints: '1 <= n <= 2 * 10^5. 0 <= edges.length <= 2 * 10^5. 0 <= source, destination <= n - 1',
  examples: [{ input: '3, [[0,1],[1,2],[2,0]], 0, 2', output: 'true', explanation: 'There are two paths from 0 to 2: 0->2 and 0->1->2.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' },
    { name: 'source', cpp: 'int', java: 'int', py: 'source: int', js: 'source' },
    { name: 'destination', cpp: 'int', java: 'int', py: 'destination: int', js: 'destination' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'BFS or DFS', content: 'Build adjacency list representation. Run standard BFS or DFS starting from source, checking if you reach destination.' }],
  jsSolution: (n, edges, source, destination) => {
    if (source === destination) return true;
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      if (u < n && v < n) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }
    const visited = new Set();
    const q = [source];
    visited.add(source);
    while (q.length > 0) {
      const curr = q.shift();
      if (curr === destination) return true;
      for (const neighbor of adj[curr]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          q.push(neighbor);
        }
      }
    }
    return false;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([3, [[0, 1], [1, 2], [2, 0]], 0, 2]);
    cases.push([6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5]);
    
    const gen = (n, hasPath) => {
      const edges = [];
      const src = randInt(0, n - 1);
      let dst = randInt(0, n - 1);
      while (dst === src && n > 1) dst = randInt(0, n - 1);
      
      if (hasPath) {
        // Create a definite path src -> ... -> dst
        let curr = src;
        const visited = new Set([src]);
        const pathLen = randInt(1, Math.min(n - 1, 10));
        for (let i = 0; i < pathLen - 1; i++) {
          let nextNode = randInt(0, n - 1);
          while (visited.has(nextNode)) nextNode = randInt(0, n - 1);
          edges.push([curr, nextNode]);
          visited.add(nextNode);
          curr = nextNode;
        }
        edges.push([curr, dst]);
      } else {
        // Partition nodes into disjoint sets A and B
        const A = new Set();
        const B = new Set();
        for (let i = 0; i < n; i++) {
          if (Math.random() < 0.5) A.add(i);
          else B.add(i);
        }
        A.add(src);
        B.add(dst);
        A.delete(dst);
        B.delete(src);
        
        const listA = Array.from(A);
        const listB = Array.from(B);
        
        // Add random edges inside A
        for (let i = 0; i < listA.length; i++) {
          if (Math.random() < 0.4 && i + 1 < listA.length) {
            edges.push([listA[i], listA[i + 1]]);
          }
        }
        // Add random edges inside B
        for (let i = 0; i < listB.length; i++) {
          if (Math.random() < 0.4 && i + 1 < listB.length) {
            edges.push([listB[i], listB[i + 1]]);
          }
        }
      }
      // Add random noise edges
      const extra = randInt(0, n);
      for (let i = 0; i < extra; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u !== v) {
          // ensure no cross-partition edges if hasPath is false
          if (!hasPath) {
            const inA = (x) => src === x || (x !== dst && Math.random() < 0.5); // simple heuristic
            if ((src === u || src === v) || (dst === u || dst === v)) {
              continue;
            }
          }
          edges.push([u, v]);
        }
      }
      return [n, edges, src, dst];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100), Math.random() < 0.5));
    return cases;
  }
},

// 3
{
  slug: 'number-of-islands',
  title: 'Number of Islands',
  description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
  constraints: 'm == grid.length. n == grid[i].length. 1 <= m, n <= 300. grid[i][j] is \'0\' or \'1\'.',
  examples: [{
    input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
    output: '1'
  }],
  args: [{ name: 'grid', cpp: 'vector<vector<char>>&', java: 'char[][]', py: 'grid: List[List[str]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'DFS Grid Traversal', content: 'Iterate through the grid. When encountering "1", run DFS/BFS to mark all connected lands as "0", and increment island count.' }],
  jsSolution: (grid) => {
    if (!grid || grid.length === 0) return 0;
    const R = grid.length;
    const C = grid[0].length;
    let count = 0;
    // Clone grid to avoid side effects in verification
    const copy = grid.map(row => [...row]);
    
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C || copy[r][c] === '0') return;
      copy[r][c] = '0';
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (copy[r][c] === '1') {
          count++;
          dfs(r, c);
        }
      }
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]]);
    cases.push([[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.4 ? '1' : '0')
      );
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15), randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30), randInt(15, 30)));
    return cases;
  }
},

// 4
{
  slug: 'max-area-of-island',
  title: 'Max Area of Island',
  description: 'You are given an m x n binary matrix grid. An island is a group of 1\'s (representing land) connected 4-directionally (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water. The area of an island is the number of cells with a value 1 in the island. Return the maximum area of an island in grid. If there is no island, return 0.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
  constraints: 'm == grid.length. n == grid[i].length. 1 <= m, n <= 50. grid[i][j] is 0 or 1.',
  examples: [{
    input: '[[0,0,1,0,0],[0,0,1,0,1],[0,1,1,0,1]]',
    output: '4',
    explanation: 'Max island consists of [0,2], [1,2], [2,1], [2,2] (area = 4).'
  }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'DFS Area Sum', content: 'Run DFS on lands, counting the total number of connected 1s. Return the maximum area tracked across all cells.' }],
  jsSolution: (grid) => {
    if (!grid || grid.length === 0) return 0;
    const R = grid.length;
    const C = grid[0].length;
    let maxArea = 0;
    const copy = grid.map(row => [...row]);
    
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C || copy[r][c] === 0) return 0;
      copy[r][c] = 0;
      return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    };
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (copy[r][c] === 1) {
          maxArea = Math.max(maxArea, dfs(r, c));
        }
      }
    }
    return maxArea;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 0, 1, 0, 0], [0, 0, 1, 0, 1], [0, 1, 1, 0, 1]]]);
    cases.push([[[1, 1, 0, 1], [1, 0, 0, 1], [0, 0, 1, 1]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.35 ? 1 : 0)
      );
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15), randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30), randInt(15, 30)));
    return cases;
  }
},

// 5
{
  slug: 'flood-fill',
  title: 'Flood Fill',
  description: 'An image is represented by an m x n integer grid image where image[r][c] represents the pixel value of the image. You are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc]. Return the modified image after performing the flood fill.',
  difficulty: 'Easy',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == image.length. n == image[i].length. 1 <= m, n <= 50. 0 <= image[i][j], color < 2^16. 0 <= sr < m. 0 <= sc < n.',
  examples: [{
    input: '[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2',
    output: '[[2,2,2],[2,2,0],[2,0,1]]',
    explanation: 'From the center of the image (row 1, col 1), all pixels connected by path of the same color are colored 2.'
  }],
  args: [
    { name: 'image', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'image: List[List[int]]', js: 'image' },
    { name: 'sr', cpp: 'int', java: 'int', py: 'sr: int', js: 'sr' },
    { name: 'sc', cpp: 'int', java: 'int', py: 'sc: int', js: 'sc' },
    { name: 'color', cpp: 'int', java: 'int', py: 'color: int', js: 'color' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Avoid Infinite Loop', content: 'If the starting pixel already has the target color, return the image immediately. Otherwise, do DFS on pixels matching the start color.' }],
  jsSolution: (image, sr, sc, color) => {
    const copy = image.map(row => [...row]);
    const startColor = copy[sr][sc];
    if (startColor === color) return copy;
    const R = copy.length;
    const C = copy[0].length;
    
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C || copy[r][c] !== startColor) return;
      copy[r][c] = color;
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
    dfs(sr, sc);
    return copy;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2]);
    cases.push([[[0, 0, 0], [0, 0, 0]], 0, 0, 0]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => randInt(0, 3))
      );
      const sr = randInt(0, r - 1);
      const sc = randInt(0, c - 1);
      const color = randInt(0, 5);
      return [grid, sr, sc, color];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15), randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30), randInt(15, 30)));
    return cases;
  }
},

// 6
{
  slug: 'rotting-oranges',
  title: 'Rotting Oranges',
  description: 'You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == grid.length. n == grid[i].length. 1 <= m, n <= 10. grid[i][j] is 0, 1, or 2.',
  examples: [{
    input: '[[2,1,1],[1,1,0],[0,1,1]]',
    output: '4',
    explanation: 'Rotting spreads through the grid step by step in 4 minutes.'
  }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Multi-source BFS', content: 'Find all rotten oranges initially and push to queue. Keep count of fresh oranges. Perform level-order BFS, decrementing fresh oranges.' }],
  jsSolution: (grid) => {
    const R = grid.length;
    const C = grid[0].length;
    const q = [];
    let fresh = 0;
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (grid[r][c] === 2) q.push([r, c, 0]);
        else if (grid[r][c] === 1) fresh++;
      }
    }
    
    // Copy grid to avoid side effects
    const copy = grid.map(row => [...row]);
    let minutes = 0;
    
    while (q.length > 0) {
      const [r, c, m] = q.shift();
      minutes = m;
      
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C && copy[nr][nc] === 1) {
          copy[nr][nc] = 2;
          fresh--;
          q.push([nr, nc, m + 1]);
        }
      }
    }
    
    return fresh === 0 ? minutes : -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[2, 1, 1], [1, 1, 0], [0, 1, 1]]]);
    cases.push([[[2, 1, 1], [0, 1, 1], [1, 0, 1]]]);
    cases.push([[[0, 2]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => {
          const rand = Math.random();
          return rand < 0.15 ? 2 : (rand < 0.65 ? 1 : 0);
        })
      );
      return [grid];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 4), randInt(2, 4)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(4, 7), randInt(4, 7)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(7, 10), randInt(7, 10)));
    return cases;
  }
},

// 7
{
  slug: 'pacific-atlantic-water-flow',
  title: 'Pacific Atlantic Water Flow',
  description: 'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island\'s left and top edges, and the Atlantic Ocean touches the island\'s right and bottom edges. Given a 2D integer array heights where heights[r][c] represents the height above sea level of the cell at (r, c), return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
  constraints: 'm == heights.length. n == heights[r].length. 1 <= m, n <= 200. 0 <= heights[r][c] <= 10^5.',
  examples: [{
    input: '[[1,2,2,3],[3,2,3,4],[2,4,5,3]]',
    output: '[[0,3],[1,2],[1,3],[2,1],[2,2]]'
  }],
  args: [{ name: 'heights', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'heights: List[List[int]]', js: 'heights' }],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Reverse Flow', content: 'Instead of searching from each cell, run DFS/BFS outward from ocean edges. Find all cells reachable from Pacific, and all from Atlantic. The intersection is the answer.' }],
  jsSolution: (heights) => {
    if (!heights || heights.length === 0) return [];
    const R = heights.length;
    const C = heights[0].length;
    
    const pac = Array.from({ length: R }, () => Array(C).fill(false));
    const atl = Array.from({ length: R }, () => Array(C).fill(false));
    
    const dfs = (r, c, visited, prevVal) => {
      if (r < 0 || c < 0 || r >= R || c >= C || visited[r][c] || heights[r][c] < prevVal) return;
      visited[r][c] = true;
      dfs(r + 1, c, visited, heights[r][c]);
      dfs(r - 1, c, visited, heights[r][c]);
      dfs(r, c + 1, visited, heights[r][c]);
      dfs(r, c - 1, visited, heights[r][c]);
    };
    
    for (let c = 0; c < C; c++) {
      dfs(0, c, pac, heights[0][c]);
      dfs(R - 1, c, atl, heights[R - 1][c]);
    }
    for (let r = 0; r < R; r++) {
      dfs(r, 0, pac, heights[r][0]);
      dfs(r, C - 1, atl, heights[r][C - 1]);
    }
    
    const res = [];
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (pac[r][c] && atl[r][c]) {
          res.push([r, c]);
        }
      }
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2, 2, 3], [3, 2, 3, 4], [2, 4, 5, 3]]]);
    cases.push([[[2, 1], [1, 2]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => randInt(1, 20))
      );
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 10), randInt(5, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 20), randInt(10, 20)));
    return cases;
  }
},

// 8
{
  slug: 'surrounded-regions',
  title: 'Surrounded Regions',
  description: 'Given an m x n matrix board containing \'X\' and \'O\', capture all regions that are 4-directionally surrounded by \'X\'. A region is captured by flipping all \'O\'s into \'X\'s in that surrounded region. Capture should be in-place, meaning you modify board directly.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
  constraints: 'm == board.length. n == board[i].length. 1 <= m, n <= 200. board[i][j] is \'X\' or \'O\'.',
  examples: [{
    input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
    output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',
    explanation: 'Surrounded regions should not be on the border, nor connected to a border \'O\' via other \'O\'s.'
  }],
  args: [{ name: 'board', cpp: 'vector<vector<char>>&', java: 'char[][]', py: 'board: List[List[str]]', js: 'board' }],
  retType: { cpp: 'void', java: 'void', py: 'None' },
  hints: [{ title: 'Border Traversal First', content: 'Run DFS starting from any \'O\' on the borders, marking them as non-surrounded (e.g. change to \'E\'). Finally, scan the board: flip remaining \'O\'s to \'X\', and restore \'E\'s back to \'O\'.' }],
  jsSolution: (board) => {
    // Return modified board (or edit in place)
    if (!board || board.length === 0) return;
    const R = board.length;
    const C = board[0].length;
    
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== 'O') return;
      board[r][c] = 'E';
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
    
    for (let c = 0; c < C; c++) {
      dfs(0, c);
      dfs(R - 1, c);
    }
    for (let r = 0; r < R; r++) {
      dfs(r, 0);
      dfs(r, C - 1);
    }
    
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (board[r][c] === 'O') board[r][c] = 'X';
        else if (board[r][c] === 'E') board[r][c] = 'O';
      }
    }
    return board;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]]);
    cases.push([[["X", "O", "X"], ["O", "X", "O"], ["X", "O", "X"]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.4 ? 'O' : 'X')
      );
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5), randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12), randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20), randInt(12, 20)));
    return cases;
  }
},

// 9
{
  slug: 'course-schedule',
  title: 'Course Schedule',
  description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
  constraints: '1 <= numCourses <= 2000. 0 <= prerequisites.length <= 5000. prerequisites[i].length == 2. All prerequisites pairs are unique.',
  examples: [{ input: '2, [[1,0]]', output: 'true', explanation: 'Course 1 requires Course 0. You can take 0, then 1.' }],
  args: [
    { name: 'numCourses', cpp: 'int', java: 'int', py: 'numCourses: int', js: 'numCourses' },
    { name: 'prerequisites', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'prerequisites: List[List[int]]', js: 'prerequisites' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Cycle Detection', content: 'This is a cycle detection problem in a directed graph. Represent prerequisites as adjacency list and run DFS checking for back edges.' }],
  jsSolution: (numCourses, prerequisites) => {
    const adj = Array.from({ length: numCourses }, () => []);
    for (const [u, v] of prerequisites) {
      if (u < numCourses && v < numCourses) {
        adj[v].push(u);
      }
    }
    const visited = Array(numCourses).fill(0); // 0 = unvisited, 1 = visiting, 2 = visited
    
    const hasCycle = (curr) => {
      if (visited[curr] === 1) return true;
      if (visited[curr] === 2) return false;
      
      visited[curr] = 1;
      for (const neighbor of adj[curr]) {
        if (hasCycle(neighbor)) return true;
      }
      visited[curr] = 2;
      return false;
    };
    
    for (let i = 0; i < numCourses; i++) {
      if (hasCycle(i)) return false;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([2, [[1, 0]]]);
    cases.push([2, [[1, 0], [0, 1]]]);
    
    const gen = (n, hasCycle) => {
      const edges = [];
      const numEdges = randInt(0, n * 2);
      if (hasCycle && n > 1) {
        // Create a cycle
        const cycleLen = randInt(2, Math.min(n, 5));
        const cycleNodes = [];
        for (let i = 0; i < cycleLen; i++) {
          let node = randInt(0, n - 1);
          while (cycleNodes.includes(node)) node = randInt(0, n - 1);
          cycleNodes.push(node);
        }
        for (let i = 0; i < cycleLen; i++) {
          edges.push([cycleNodes[(i + 1) % cycleLen], cycleNodes[i]]);
        }
      }
      // Add random DAG edges
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u < v) { // DAG order to prevent unintended cycles
          edges.push([v, u]);
        }
      }
      // Deduplicate edges
      const seen = new Set();
      const unique = [];
      for (const [u, v] of edges) {
        const hash = `${u},${v}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          unique.push([u, v]);
        }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 10
{
  slug: 'course-schedule-ii',
  title: 'Course Schedule II',
  description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
  constraints: '1 <= numCourses <= 2000. 0 <= prerequisites.length <= 5000. prerequisites[i].length == 2. All prerequisites pairs are unique.',
  examples: [{ input: '4, [[1,0],[2,0],[3,1],[3,2]]', output: '[0,2,1,3]', explanation: 'Take 0 first, then 1 and 2, and finally 3.' }],
  args: [
    { name: 'numCourses', cpp: 'int', java: 'int', py: 'numCourses: int', js: 'numCourses' },
    { name: 'prerequisites', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'prerequisites: List[List[int]]', js: 'prerequisites' }
  ],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Topological order list', content: 'Use Kahn\'s algorithm (BFS with in-degrees) or DFS with post-order traversal to output the courses in reverse topological order.' }],
  jsSolution: (numCourses, prerequisites) => {
    const adj = Array.from({ length: numCourses }, () => []);
    const inDegree = Array(numCourses).fill(0);
    for (const [u, v] of prerequisites) {
      if (u < numCourses && v < numCourses) {
        adj[v].push(u);
        inDegree[u]++;
      }
    }
    const q = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) q.push(i);
    }
    const order = [];
    while (q.length > 0) {
      const curr = q.shift();
      order.push(curr);
      for (const neighbor of adj[curr]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          q.push(neighbor);
        }
      }
    }
    return order.length === numCourses ? order : [];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, [[1, 0], [2, 0], [3, 1], [3, 2]]]);
    cases.push([2, [[1, 0], [0, 1]]]);
    
    const gen = (n, hasCycle) => {
      const edges = [];
      const numEdges = randInt(0, n * 2);
      if (hasCycle && n > 1) {
        const cycleLen = randInt(2, Math.min(n, 5));
        const cycleNodes = [];
        for (let i = 0; i < cycleLen; i++) {
          let node = randInt(0, n - 1);
          while (cycleNodes.includes(node)) node = randInt(0, n - 1);
          cycleNodes.push(node);
        }
        for (let i = 0; i < cycleLen; i++) {
          edges.push([cycleNodes[(i + 1) % cycleLen], cycleNodes[i]]);
        }
      }
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        if (u < v) {
          edges.push([v, u]);
        }
      }
      const seen = new Set();
      const unique = [];
      for (const [u, v] of edges) {
        const hash = `${u},${v}`;
        if (!seen.has(hash)) {
          seen.add(hash);
          unique.push([u, v]);
        }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 11
{
  slug: 'redundant-connection',
  title: 'Redundant Connection',
  description: 'In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge makes a cycle. Return an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: 'n == edges.length. 3 <= n <= 1000. edges[i].length == 2. 1 <= ui < vi <= n. The given graph is connected and has exactly one cycle.',
  examples: [{ input: '[[1,2],[1,3],[2,3]]', output: '[2,3]', explanation: 'Removing [2,3] makes the graph a valid tree 1-2 and 1-3.' }],
  args: [{ name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Disjoint Set (Union Find)', content: 'Iterate through the edges. Connect nodes using Union-Find. If you find an edge where both nodes already share the same parent, that edge creates the cycle!' }],
  jsSolution: (edges) => {
    const n = edges.length;
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    const union = (i, j) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
        return true;
      }
      return false;
    };
    for (const [u, v] of edges) {
      if (!union(u, v)) return [u, v];
    }
    return [];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [1, 3], [2, 3]]]);
    cases.push([[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]]);
    
    const gen = (n) => {
      const parent = Array.from({ length: n + 1 }, (_, i) => i);
      const find = (i) => {
        if (parent[i] === i) return i;
        return parent[i] = find(parent[i]);
      };
      const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) { parent[rootI] = rootJ; return true; }
        return false;
      };
      
      const treeEdges = [];
      // Build a random spanning tree
      let components = n;
      while (components > 1) {
        const u = randInt(1, n);
        const v = randInt(1, n);
        if (u !== v && union(u, v)) {
          treeEdges.push([u, v]);
          components--;
        }
      }
      
      // Find two vertices that are not directly connected but connected via path, and add an edge
      let u = randInt(1, n);
      let v = randInt(1, n);
      while (u === v || treeEdges.some(([x, y]) => (x === u && y === v) || (x === v && y === u))) {
        u = randInt(1, n);
        v = randInt(1, n);
      }
      
      treeEdges.push([u, v]);
      // Shuffle treeEdges
      for (let i = treeEdges.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [treeEdges[i], treeEdges[j]] = [treeEdges[j], treeEdges[i]];
      }
      return [treeEdges];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 12
{
  slug: 'number-of-connected-components-in-an-undirected-graph',
  title: 'Number of Connected Components in an Undirected Graph',
  description: 'You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph. Return the number of connected components in the graph.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: '1 <= n <= 2000. 0 <= edges.length <= 5000. edges[i].length == 2. 0 <= ai < bi < n. All edges are unique.',
  examples: [{ input: '5, [[0,1],[1,2],[3,4]]', output: '2', explanation: 'Components are: {0,1,2} and {3,4}. Total = 2.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Union Find Components', content: 'Initialize count to n. For every edge, perform a Union. If the union is successful (nodes had different roots), decrement count. Finally return count.' }],
  jsSolution: (n, edges) => {
    const parent = Array.from({ length: n }, (_, i) => i);
    let count = n;
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    const union = (i, j) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
        count--;
        return true;
      }
      return false;
    };
    for (const [u, v] of edges) {
      if (u < n && v < n) union(u, v);
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5, [[0, 1], [1, 2], [3, 4]]]);
    cases.push([5, [[0, 1], [1, 2], [2, 3], [3, 4]]]);
    
    const gen = (n) => {
      const edges = [];
      const numEdges = randInt(0, Math.floor(n * 1.5));
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
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 13
{
  slug: 'graph-valid-tree',
  title: 'Graph Valid Tree',
  description: 'Given n nodes labeled from 0 to n - 1 and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a valid tree. An undirected graph is a tree if and only if it is connected and has no cycles.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: '1 <= n <= 2000. 0 <= edges.length <= 5000. edges[i].length == 2. 0 <= ui, vi < n. No self loops or duplicate edges.',
  examples: [{ input: '5, [[0,1],[0,2],[0,3],[1,4]]', output: 'true', explanation: 'All nodes are connected and there are no cycles.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Tree properties', content: 'A valid tree with n nodes must have exactly n - 1 edges and be fully connected. Check if edges.length === n - 1, and run Union-Find or BFS to ensure connectivity.' }],
  jsSolution: (n, edges) => {
    if (edges.length !== n - 1) return false;
    const parent = Array.from({ length: n }, (_, i) => i);
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    const union = (i, j) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) { parent[rootI] = rootJ; return true; }
      return false;
    };
    for (const [u, v] of edges) {
      if (u >= n || v >= n || !union(u, v)) return false;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([5, [[0, 1], [0, 2], [0, 3], [1, 4]]]);
    cases.push([5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]]);
    
    const gen = (n, isValid) => {
      const edges = [];
      if (isValid) {
        // Generate valid tree
        const parent = Array.from({ length: n }, (_, i) => i);
        const find = (i) => { if (parent[i] === i) return i; return parent[i] = find(parent[i]); };
        const union = (i, j) => { const rI = find(i); const rJ = find(j); if (rI !== rJ) { parent[rI] = rJ; return true; } return false; };
        let count = n;
        while (count > 1) {
          const u = randInt(0, n - 1);
          const v = randInt(0, n - 1);
          if (u !== v && union(u, v)) {
            edges.push([u, v]);
            count--;
          }
        }
      } else {
        // Either too many/few edges or has cycle
        const numEdges = Math.random() < 0.5 ? randInt(0, n - 2) : randInt(n, n + 5);
        for (let i = 0; i < numEdges; i++) {
          const u = randInt(0, n - 1);
          const v = randInt(0, n - 1);
          if (u !== v) edges.push([u, v]);
        }
      }
      const seen = new Set();
      const unique = [];
      for (const [u, v] of edges) {
        const hash = `${Math.min(u, v)},${Math.max(u, v)}`;
        if (!seen.has(hash)) { seen.add(hash); unique.push([u, v]); }
      }
      return [n, unique];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100), Math.random() < 0.5));
    return cases;
  }
},

// 14
{
  slug: 'keys-and-rooms',
  title: 'Keys and Rooms',
  description: 'There are n rooms labeled from 0 to n - 1 and all the rooms are locked except for room 0. Your goal is to visit all the rooms. However, you cannot enter a locked room without its key. When you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms. Given an array rooms where rooms[i] is the list of keys prescribed in room i, return true if you can visit all the rooms, or false otherwise.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Graph'],
  constraints: 'n == rooms.length. 2 <= n <= 1000. 0 <= rooms[i].length <= 1000. 0 <= rooms[i][j] < n. All values of rooms[i] are unique.',
  examples: [{ input: '[[1],[2],[3],[]]', output: 'true', explanation: 'We start in room 0, get key 1. Go to room 1, get key 2. Go to room 2, get key 3. All rooms visited.' }],
  args: [{ name: 'rooms', cpp: 'vector<vector<int>>&', java: 'List<List<Integer>>', py: 'rooms: List[List[int]]', js: 'rooms' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Room BFS', content: 'Standard BFS. Maintain a visited set starting with room 0. Queue rooms reachable. At the end, check if visited set size equals n.' }],
  jsSolution: (rooms) => {
    const visited = new Set([0]);
    const q = [0];
    while (q.length > 0) {
      const curr = q.shift();
      for (const key of rooms[curr]) {
        if (!visited.has(key)) {
          visited.add(key);
          q.push(key);
        }
      }
    }
    return visited.size === rooms.length;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1], [2], [3], []]]);
    cases.push([[[1, 3], [3, 0, 1], [2], [0]]]);
    
    const gen = (n, solvable) => {
      const rooms = Array.from({ length: n }, () => []);
      if (solvable) {
        // Ensure connectivity
        const path = Array.from({ length: n }, (_, i) => i);
        // Shuffle paths except 0 at start
        for (let i = n - 1; i > 1; i--) {
          const j = randInt(1, i);
          [path[i], path[j]] = [path[j], path[i]];
        }
        for (let i = 0; i < n - 1; i++) {
          rooms[path[i]].push(path[i + 1]);
        }
      }
      // Add random key noises
      for (let i = 0; i < n; i++) {
        const numKeys = randInt(0, Math.min(n, 3));
        for (let k = 0; k < numKeys; k++) {
          const target = randInt(0, n - 1);
          if (target !== i && !rooms[i].includes(target)) {
            rooms[i].push(target);
          }
        }
      }
      return [rooms];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60), Math.random() < 0.5));
    return cases;
  }
},

// 15
{
  slug: 'shortest-path-in-binary-matrix',
  title: 'Shortest Path in Binary Matrix',
  description: 'Given an n x n binary matrix grid, return the length of the shortest clear path in the matrix. If there is no clear path, return -1. A clear path in a binary matrix is a path from the top-left cell (i.e., (0, 0)) to the bottom-right cell (i.e., (n - 1, n - 1)) such that: all visited cells are 0, and all adjacent cells of the path are 8-directionally connected.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Breadth-First Search', 'Matrix'],
  constraints: 'n == grid.length. n == grid[i].length. 1 <= n <= 100. grid[i][j] is 0 or 1.',
  examples: [{ input: '[[0,1],[1,0]]', output: '2', explanation: 'Path is [0,0] -> [1,1] (8-directional, length 2).' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: '8-directional BFS', content: 'Queue cells starting from (0,0) with length 1. Do BFS moving to any of the 8 neighbors if within bounds and value is 0. Mark visited in grid to avoid loops.' }],
  jsSolution: (grid) => {
    const N = grid.length;
    if (grid[0][0] === 1 || grid[N - 1][N - 1] === 1) return -1;
    if (N === 1) return 1;
    
    const copy = grid.map(row => [...row]);
    const q = [[0, 0, 1]];
    copy[0][0] = 1; // Mark visited
    
    while (q.length > 0) {
      const [r, c, len] = q.shift();
      if (r === N - 1 && c === N - 1) return len;
      
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < N && nc < N && copy[nr][nc] === 0) {
            copy[nr][nc] = 1;
            q.push([nr, nc, len + 1]);
          }
        }
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[0, 1], [1, 0]]]);
    cases.push([[[0, 0, 0], [1, 1, 0], [1, 1, 0]]]);
    
    const gen = (n) => {
      const grid = Array.from({ length: n }, () => 
        Array.from({ length: n }, () => Math.random() < 0.25 ? 1 : 0)
      );
      grid[0][0] = 0;
      grid[n - 1][n - 1] = 0;
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 16
{
  slug: 'as-far-from-land-as-possible',
  title: 'As Far from Land as Possible',
  description: 'Given an n x n grid containing only values 0 and 1, where 0 represents water and 1 represents land, find a water cell such that its distance to the nearest land cell is maximized, and return the distance. If no land or water exists in the grid, return -1. The distance used in this problem is the Manhattan distance: d([r1, c1], [r2, c2]) = |r1 - r2| + |c1 - c2|.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Breadth-First Search', 'Dynamic Programming', 'Matrix'],
  constraints: 'n == grid.length. n == grid[i].length. 1 <= n <= 100. grid[i][j] is 0 or 1.',
  examples: [{ input: '[[1,0,1],[0,0,0],[1,0,1]]', output: '2', explanation: 'Cell [1,1] is at distance 2 from all lands, which is the maximum.' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Multi-source BFS from land', content: 'Add all land cells (1s) to the queue initially. Run BFS expanding outwards to water cells (0s). Keep track of the levels/distances. The last cell processed yields the maximum distance.' }],
  jsSolution: (grid) => {
    const N = grid.length;
    const q = [];
    const copy = grid.map(row => [...row]);
    
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (copy[r][c] === 1) q.push([r, c]);
      }
    }
    
    if (q.length === 0 || q.length === N * N) return -1;
    
    let maxDist = -1;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
    while (q.length > 0) {
      const size = q.length;
      maxDist++;
      for (let i = 0; i < size; i++) {
        const [r, c] = q.shift();
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < N && nc < N && copy[nr][nc] === 0) {
            copy[nr][nc] = 1;
            q.push([nr, nc]);
          }
        }
      }
    }
    return maxDist;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 0, 1], [0, 0, 0], [1, 0, 1]]]);
    cases.push([[[1, 1], [1, 1]]]);
    
    const gen = (n) => {
      const grid = Array.from({ length: n }, () => 
        Array.from({ length: n }, () => Math.random() < 0.2 ? 1 : 0)
      );
      // Ensure at least one 1 and one 0 to avoid all-same degenerate cases
      if (grid.every(r => r.every(v => v === 0))) grid[0][0] = 1;
      if (grid.every(r => r.every(v => v === 1))) grid[0][0] = 0;
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30)));
    return cases;
  }
},

// 17
{
  slug: 'is-graph-bipartite',
  title: 'Is Graph Bipartite?',
  description: 'There is an undirected graph with n nodes, where each node is numbered between 0 and n - 1. You are given a 2D array graph, where graph[u] is an array of nodes that node u is adjacent to. Return true if the graph is bipartite, or false otherwise.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
  constraints: 'graph.length == n. 1 <= n <= 100. 0 <= graph[u].length < n. graph[u] does not contain u. No self-loops or multiple edges.',
  examples: [{ input: '[[1,3],[0,2],[1,3],[0,2]]', output: 'true', explanation: 'We can partition nodes into {0, 2} and {1, 3}.' }],
  args: [{ name: 'graph', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'graph: List[List[int]]', js: 'graph' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Two-coloring DFS', content: 'A graph is bipartite if it can be colored with two colors (e.g. 1 and -1) such that no two adjacent nodes have the same color. Use DFS to color nodes.' }],
  jsSolution: (graph) => {
    const n = graph.length;
    const colors = Array(n).fill(0); // 0 = uncolored, 1 = Red, -1 = Blue
    
    const bfs = (start) => {
      colors[start] = 1;
      const q = [start];
      while (q.length > 0) {
        const curr = q.shift();
        for (const neighbor of graph[curr]) {
          if (colors[neighbor] === colors[curr]) return false;
          if (colors[neighbor] === 0) {
            colors[neighbor] = -colors[curr];
            q.push(neighbor);
          }
        }
      }
      return true;
    };
    
    for (let i = 0; i < n; i++) {
      if (colors[i] === 0) {
        if (!bfs(i)) return false;
      }
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 3], [0, 2], [1, 3], [0, 2]]]);
    cases.push([[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]]);
    
    const gen = (n, isBipartite) => {
      const graph = Array.from({ length: n }, () => []);
      if (isBipartite) {
        const color = Array(n).fill(0);
        for (let i = 0; i < n; i++) color[i] = Math.random() < 0.5 ? 1 : -1;
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            if (color[i] !== color[j] && Math.random() < 0.35) {
              graph[i].push(j);
              graph[j].push(i);
            }
          }
        }
      } else {
        // Random edges containing odd cycle
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            if (Math.random() < 0.3) {
              graph[i].push(j);
              graph[j].push(i);
            }
          }
        }
        // Force odd cycle (0-1-2-0) if size is large enough
        if (n >= 3) {
          if (!graph[0].includes(1)) { graph[0].push(1); graph[1].push(0); }
          if (!graph[1].includes(2)) { graph[1].push(2); graph[2].push(1); }
          if (!graph[2].includes(0)) { graph[2].push(0); graph[0].push(2); }
        }
      }
      return [graph];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25), Math.random() < 0.5));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 50), Math.random() < 0.5));
    return cases;
  }
},

// 18
{
  slug: 'network-delay-time',
  title: 'Network Delay Time',
  description: 'You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = [ui, vi, wi], where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target. We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Shortest Path'],
  constraints: '1 <= k <= n <= 100. 1 <= times.length <= 6000. times[i] = [ui, vi, wi]. 1 <= ui, vi <= n, ui != vi. 0 <= wi <= 100.',
  examples: [{ input: '[[2,1,1],[2,3,1],[3,4,1]], 4, 2', output: '2', explanation: 'Signal starts at 2. 1 and 3 receive at t=1. 4 receives at t=2. All nodes have it.' }],
  args: [
    { name: 'times', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'times: List[List[int]]', js: 'times' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Dijkstra Single-source Shortest Path', content: 'Build adjacency list. Use Dijkstra\'s algorithm (or Bellman-Ford / simple queue) to track min distances from k to all nodes. The answer is the max distance. If any node is unreachable, return -1.' }],
  jsSolution: (times, n, k) => {
    const dist = Array(n + 1).fill(Infinity);
    dist[k] = 0;
    
    // Bellman-Ford simplifies edge representation for verification
    for (let i = 0; i < n; i++) {
      let updated = false;
      for (const [u, v, w] of times) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          updated = true;
        }
      }
      if (!updated) break;
    }
    
    let max = 0;
    for (let i = 1; i <= n; i++) {
      if (dist[i] === Infinity) return -1;
      max = Math.max(max, dist[i]);
    }
    return max;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2]);
    cases.push([[[1, 2, 1]], 2, 1]);
    
    const gen = (n) => {
      const times = [];
      const numEdges = randInt(n - 1, n * 2);
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(1, n);
        const v = randInt(1, n);
        const w = randInt(1, 20);
        if (u !== v) {
          times.push([u, v, w]);
        }
      }
      const k = randInt(1, n);
      return [times, n, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 50)));
    return cases;
  }
},

// 19
{
  slug: 'cheapest-flights-within-k-stops',
  title: 'Cheapest Flights Within K Stops',
  description: 'There are n cities connected by some number of flights. You are given an array flights where flights[i] = [from, to, price] indicates that there is a flight from city from to city to with cost price. You are also given three integers src, dst, and k, return the cheapest price from src to dst with at most k stops. If there is no such route, return -1.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Breadth-First Search', 'Graph', 'Shortest Path'],
  constraints: '1 <= n <= 100. 0 <= flights.length <= (n * (n - 1) / 2). flights[i].length == 3. 0 <= from, to < n. 1 <= price <= 10^4. src != dst. 0 <= k < n.',
  examples: [{ input: '4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1', output: '700', explanation: 'Path 0->1->3 has cost 700 with 1 stop.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'flights', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'flights: List[List[int]]', js: 'flights' },
    { name: 'src', cpp: 'int', java: 'int', py: 'src: int', js: 'src' },
    { name: 'dst', cpp: 'int', java: 'int', py: 'dst: int', js: 'dst' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bellman-Ford variant', content: 'Use Bellman-Ford algorithm with K + 1 iterations. In each iteration, copy the distances array to avoid multiple-hop expansion within a single iteration.' }],
  jsSolution: (n, flights, src, dst, k) => {
    let prices = Array(n).fill(Infinity);
    prices[src] = 0;
    
    for (let i = 0; i <= k; i++) {
      const temp = [...prices];
      for (const [u, v, p] of flights) {
        if (prices[u] === Infinity) continue;
        if (prices[u] + p < temp[v]) {
          temp[v] = prices[u] + p;
        }
      }
      prices = temp;
    }
    return prices[dst] === Infinity ? -1 : prices[dst];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1]);
    cases.push([3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0]);
    
    const gen = (n) => {
      const flights = [];
      const numEdges = randInt(n - 1, n * 2);
      for (let i = 0; i < numEdges; i++) {
        const u = randInt(0, n - 1);
        const v = randInt(0, n - 1);
        const p = randInt(10, 500);
        if (u !== v) flights.push([u, v, p]);
      }
      const src = randInt(0, n - 1);
      let dst = randInt(0, n - 1);
      while (dst === src && n > 1) dst = randInt(0, n - 1);
      const k = randInt(0, Math.floor(n / 2));
      return [n, flights, src, dst, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 40)));
    return cases;
  }
},

// 20
{
  slug: 'all-paths-from-source-to-target',
  title: 'All Paths From Source to Target',
  description: 'Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n - 1, find all possible paths from node 0 to node n - 1 and return them in any order. The graph is given as follows: graph[i] is a list of all nodes you can visit from node i.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Backtracking', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
  constraints: 'n == graph.length. 2 <= n <= 15. 0 <= graph[i][j] < n. graph[i][j] != i (no self-loops). All elements of graph[i] are unique.',
  examples: [{ input: '[[1,2],[3],[3],[]]', output: '[[0,1,3],[0,2,3]]', explanation: 'Two paths from 0 to 3.' }],
  args: [{ name: 'graph', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'graph: List[List[int]]', js: 'graph' }],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'DFS Backtracking', content: 'Since it is a DAG, we can just run a standard DFS backtracking from node 0. Accumulate the path. When node reaches n - 1, save a copy of the path.' }],
  jsSolution: (graph) => {
    const N = graph.length;
    const paths = [];
    const dfs = (curr, path) => {
      if (curr === N - 1) {
        paths.push([...path]);
        return;
      }
      for (const neighbor of graph[curr]) {
        path.push(neighbor);
        dfs(neighbor, path);
        path.pop();
      }
    };
    dfs(0, [0]);
    return paths;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [3], [3], []]]);
    cases.push([[[4, 3, 1], [3, 2, 4], [3], [4], []]]);
    
    const gen = (n) => {
      const graph = Array.from({ length: n }, () => []);
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.random() < 0.5) {
            graph[i].push(j);
          }
        }
      }
      return [graph];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 15)));
    return cases;
  }
},

// 21
{
  slug: 'find-eventual-safe-states',
  title: 'Find Eventual Safe States',
  description: 'There is a directed graph of n nodes with each node labeled from 0 to n - 1. The graph is represented by a 0-indexed 2D integer array graph where graph[i] is an integer array of nodes adjacent to node i. A node is a terminal node if there are no outgoing edges. A node is a safe node if every possible path starting from that node leads to a terminal node (or another safe node). Return an array containing all the safe nodes of the graph. The answer should be sorted in ascending order.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
  constraints: 'n == graph.length. 1 <= n <= 10^4. 0 <= graph[i].length <= n. graph[i] does not contain i. All values of graph[i] are unique.',
  examples: [{ input: '[[1,2],[2,3],[5],[0],[5],[],[]]', output: '[2,4,5,6]', explanation: 'Safe nodes are 2, 4, 5, 6 as all paths from them lead to terminal/safe nodes.' }],
  args: [{ name: 'graph', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'graph: List[List[int]]', js: 'graph' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'DFS coloring or reverse BFS', content: 'A node is safe if it is NOT part of a cycle and cannot reach a cycle. Use DFS with 3 colors: 0 (unvisited), 1 (visiting/in cycle), 2 (safe).' }],
  jsSolution: (graph) => {
    const N = graph.length;
    const colors = Array(N).fill(0); // 0=unvisited, 1=visiting, 2=safe
    
    const isSafe = (curr) => {
      if (colors[curr] > 0) return colors[curr] === 2;
      colors[curr] = 1; // Mark visiting
      for (const neighbor of graph[curr]) {
        if (!isSafe(neighbor)) return false;
      }
      colors[curr] = 2; // Mark safe
      return true;
    };
    
    const safeNodes = [];
    for (let i = 0; i < N; i++) {
      if (isSafe(i)) safeNodes.push(i);
    }
    return safeNodes.sort((a, b) => a - b);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 2], [2, 3], [5], [0], [5], [], []]]);
    cases.push([[[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]]);
    
    const gen = (n) => {
      const graph = Array.from({ length: n }, () => []);
      for (let i = 0; i < n; i++) {
        const numEdges = randInt(0, Math.min(n - 1, 3));
        for (let k = 0; k < numEdges; k++) {
          const target = randInt(0, n - 1);
          if (target !== i && !graph[i].includes(target)) {
            graph[i].push(target);
          }
        }
      }
      return [graph];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 8)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
},

// 22
{
  slug: 'minimum-number-of-vertices-to-reach-all-nodes',
  title: 'Minimum Number of Vertices to Reach All Nodes',
  description: 'Given a directed acyclic graph, with n vertices numbered from 0 to n-1, and an array edges where edges[i] = [from, to] represents a directed edge from node from to node to. Find the smallest set of vertices from which all nodes in the graph are reachable. It\'s guaranteed that a unique solution exists.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Graph'],
  constraints: '2 <= n <= 10^5. 1 <= edges.length <= min(10^5, n * (n - 1) / 2). edges[i].length == 2. 0 <= from, to < n. All edges are unique.',
  examples: [{ input: '6, [[0,1],[0,2],[2,5],[3,4],[4,2]]', output: '[0,3]', explanation: '0 and 3 have indegree 0. All other nodes can be reached from them.' }],
  args: [
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' },
    { name: 'edges', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'edges: List[List[int]]', js: 'edges' }
  ],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'In-degree 0 nodes', content: 'A node can only be reached from itself if its in-degree is 0. Since the graph is a DAG, all nodes with in-degree 0 must be in the starting set, and they are sufficient to reach all other nodes.' }],
  jsSolution: (n, edges) => {
    const hasInDegree = Array(n).fill(false);
    for (const [, v] of edges) {
      if (v < n) hasInDegree[v] = true;
    }
    const res = [];
    for (let i = 0; i < n; i++) {
      if (!hasInDegree[i]) res.push(i);
    }
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([6, [[0, 1], [0, 2], [2, 5], [3, 4], [4, 2]]]);
    cases.push([5, [[0, 1], [2, 1], [3, 1], [1, 4]]]);
    
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
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(8, 25)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(25, 60)));
    return cases;
  }
},

// 23
{
  slug: 'reconstruct-itinerary',
  title: 'Reconstruct Itinerary',
  description: 'You are given a list of airline tickets where tickets[i] = [from, to] represent the departure and the arrival airports of one flight. Reconstruct the itinerary in order and return it. All of the tickets belong to a man who departs from "JFK". Thus, the itinerary must begin with "JFK". If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string. You may assume all tickets form at least one valid itinerary. You must use all the tickets once and only once.',
  difficulty: 'Hard',
  category: 'Graphs',
  tags: ['Depth-First Search', 'Graph', 'Eulerian Circuit'],
  constraints: '1 <= tickets.length <= 300. tickets[i].length == 2. from.length == 3. to.length == 3. from and to consist of uppercase English letters.',
  examples: [{ input: '[["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]', output: '["JFK","MUC","LHR","SFO","SJC"]' }],
  args: [{ name: 'tickets', cpp: 'vector<vector<string>>&', java: 'List<List<String>>', py: 'tickets: List[List[str]]', js: 'tickets' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Eulerian Path (Hierholzer\'s Algorithm)', content: 'This is finding an Eulerian path in a directed graph. Sort neighbors lexically. Run DFS: visit neighbors in order, removing flights as you go. Post-order add current airport to list, then reverse the list.' }],
  jsSolution: (tickets) => {
    const adj = {};
    for (const [from, to] of tickets) {
      if (!adj[from]) adj[from] = [];
      adj[from].push(to);
    }
    for (const key of Object.keys(adj)) {
      adj[key].sort().reverse(); // reverse so we can pop from end in O(1)
    }
    
    const itinerary = [];
    const visit = (curr) => {
      const dests = adj[curr] || [];
      while (dests.length > 0) {
        visit(dests.pop());
      }
      itinerary.push(curr);
    };
    
    visit('JFK');
    return itinerary.reverse();
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]]);
    cases.push([[["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]]]);
    
    const airports = ['JFK', 'SFO', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'JFK', 'SFO', 'LAX']; // Duplicate JFK/SFO to boost occurrence
    
    const gen = (ticketCount) => {
      // Build a random Eulerian path to guarantee a valid solution exists
      const tickets = [];
      let curr = 'JFK';
      for (let i = 0; i < ticketCount; i++) {
        let nextNode = airports[randInt(0, airports.length - 1)];
        while (nextNode === curr) nextNode = airports[randInt(0, airports.length - 1)];
        tickets.push([curr, nextNode]);
        curr = nextNode;
      }
      // Shuffle tickets
      for (let i = tickets.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [tickets[i], tickets[j]] = [tickets[j], tickets[i]];
      }
      return [tickets];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20)));
    return cases;
  }
},

// 24
{
  slug: 'word-ladder',
  title: 'Word Ladder',
  description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that: every adjacent pair of words differs by a single letter, and each si is in wordList. Note that beginWord does not need to be in wordList. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
  difficulty: 'Hard',
  category: 'Graphs',
  tags: ['Hash Table', 'String', 'Breadth-First Search'],
  constraints: '1 <= beginWord.length <= 10. endWord.length == beginWord.length. 1 <= wordList.length <= 5000. wordList[i].length == beginWord.length. beginWord and endWord consist of lowercase English letters. All words in wordList are unique.',
  examples: [{ input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'Shortest sequence: hit -> hot -> dot -> dog -> cog (5 words).' }],
  args: [
    { name: 'beginWord', cpp: 'string', java: 'String', py: 'beginWord: str', js: 'beginWord' },
    { name: 'endWord', cpp: 'string', java: 'String', py: 'endWord: str', js: 'endWord' },
    { name: 'wordList', cpp: 'vector<string>&', java: 'List<String>', py: 'wordList: List[str]', js: 'wordList' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Standard BFS Queue', content: 'Shortest path means BFS. Store wordList in a Hash Set for O(1) lookups. Run BFS changing one character at a time from a-z. If neighbor is in set, enqueue and delete from set.' }],
  jsSolution: (beginWord, endWord, wordList) => {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const q = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    
    while (q.length > 0) {
      const [curr, len] = q.shift();
      if (curr === endWord) return len;
      
      for (let i = 0; i < curr.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const char = String.fromCharCode(c);
          if (char === curr[i]) continue;
          const nextWord = curr.slice(0, i) + char + curr.slice(i + 1);
          
          if (wordSet.has(nextWord) && !visited.has(nextWord)) {
            visited.add(nextWord);
            q.push([nextWord, len + 1]);
          }
        }
      }
    }
    return 0;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push(["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]]);
    cases.push(["hit", "cog", ["hot", "dot", "dog", "lot", "log"]]);
    
    const words = ['hot', 'dot', 'dog', 'lot', 'log', 'cog', 'hat', 'cat', 'bat', 'bet', 'get', 'pet', 'pit', 'sit', 'fit', 'fig', 'dig', 'pig', 'pin', 'pan', 'fan'];
    
    const gen = (wordCount) => {
      const shuf = words.sort(() => 0.5 - Math.random()).slice(0, wordCount);
      const begin = 'hit';
      const end = shuf[randInt(0, shuf.length - 1)];
      return [begin, end, shuf];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 18)));
    return cases;
  }
},

// 25
{
  slug: 'number-of-closed-islands',
  title: 'Number of Closed Islands',
  description: 'Given a 2D grid consists of 0s (land) and 1s (water). An island is a maximal 4-directionally connected group of 0s and a closed island is an island totally (all left, top, right, bottom) surrounded by 1s. Return the number of closed islands.',
  difficulty: 'Medium',
  category: 'Graphs',
  tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
  constraints: '1 <= grid.length, grid[0].length <= 100. grid[i][j] is 0 or 1.',
  examples: [{ input: '[[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]', output: '2', explanation: 'Islands in the middle are closed, borders are not closed.' }],
  args: [{ name: 'grid', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'grid: List[List[int]]', js: 'grid' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Eliminate boundary islands first', content: 'Scan the borders of the grid. Any land (0) on the border can never be a closed island. Run DFS on border 0s to flip them to 1. Then, standard count of remaining islands.' }],
  jsSolution: (grid) => {
    const R = grid.length;
    const C = grid[0].length;
    const copy = grid.map(row => [...row]);
    
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C || copy[r][c] === 1) return;
      copy[r][c] = 1;
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
    
    for (let c = 0; c < C; c++) {
      dfs(0, c);
      dfs(R - 1, c);
    }
    for (let r = 0; r < R; r++) {
      dfs(r, 0);
      dfs(r, C - 1);
    }
    
    let count = 0;
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (copy[r][c] === 0) {
          count++;
          dfs(r, c);
        }
      }
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 1, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 1, 1, 0], [1, 0, 1, 0, 1, 1, 1, 0], [1, 0, 0, 0, 0, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 0]]]);
    cases.push([[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]]);
    
    const gen = (r, c) => {
      const grid = Array.from({ length: r }, () => 
        Array.from({ length: c }, () => Math.random() < 0.35 ? 0 : 1)
      );
      return [grid];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 6), randInt(2, 6)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(6, 12), randInt(6, 12)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(12, 20), randInt(12, 20)));
    return cases;
  }
}

];
