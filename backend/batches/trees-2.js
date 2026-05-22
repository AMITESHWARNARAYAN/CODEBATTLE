// Trees — Batch 2 (25 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

const buildTree = (arr) => {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const q = [root];
  let i = 1;
  while (q.length > 0 && i < arr.length) {
    const curr = q.shift();
    if (i < arr.length && arr[i] !== null) {
      curr.left = new TreeNode(arr[i]);
      q.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      curr.right = new TreeNode(arr[i]);
      q.push(curr.right);
    }
    i++;
  }
  return root;
};

const printTree = (root) => {
  if (!root) return [];
  const res = [];
  const q = [root];
  while (q.length > 0) {
    const curr = q.shift();
    if (curr) {
      res.push(curr.val);
      q.push(curr.left);
      q.push(curr.right);
    } else {
      res.push(null);
    }
  }
  while (res.length > 0 && res[res.length - 1] === null) {
    res.pop();
  }
  return res;
};

// Tree Input Generators
const genRandTree = (n) => {
  if (n === 0) return [];
  const vals = randArr(n, -100, 100);
  const arr = [vals[0]];
  let nodesCount = 1;
  let idx = 1;
  while (nodesCount < n && idx < n) {
    if (Math.random() < 0.2) {
      arr.push(null);
    } else {
      arr.push(vals[idx++]);
      nodesCount++;
    }
  }
  return arr;
};

const genBST = (n) => {
  if (n === 0) return [];
  const vals = Array.from(new Set(randArr(n * 2, -100, 100))).slice(0, n);
  if (vals.length === 0) return [];
  let root = new TreeNode(vals[0]);
  const insert = (node, v) => {
    if (v < node.val) {
      if (!node.left) node.left = new TreeNode(v);
      else insert(node.left, v);
    } else {
      if (!node.right) node.right = new TreeNode(v);
      else insert(node.right, v);
    }
  };
  for (let i = 1; i < vals.length; i++) {
    insert(root, vals[i]);
  }
  return printTree(root);
};

export const problems = [

// 1
{
  slug: 'cousins-in-binary-tree',
  title: 'Cousins in Binary Tree',
  description: 'Given the root of a binary tree with unique values and the values of two different nodes of the tree x and y, return true if the nodes corresponding to the values x and y are cousins, or false otherwise. Two nodes are cousins if they have the same depth but different parents.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [2, 100]. 1 <= Node.val <= 100. Each node has a unique value. x != y and both x and y are in the tree.',
  examples: [{ input: '[1,2,3,4], 4, 3', output: 'false', explanation: '4 and 3 have different depths.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' },
    { name: 'y', cpp: 'int', java: 'int', py: 'y: int', js: 'y' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Depth & Parent tracking', content: 'Traverse the tree to find the depth and parent of x and y. Compare them.' }],
  jsSolution: (arr, x, y) => {
    let root = buildTree(arr);
    let xParent = null, yParent = null;
    let xDepth = -1, yDepth = -1;
    const dfs = (node, parent, d) => {
      if (!node) return;
      if (node.val === x) { xParent = parent; xDepth = d; }
      if (node.val === y) { yParent = parent; yDepth = d; }
      dfs(node.left, node, d + 1);
      dfs(node.right, node, d + 1);
    };
    dfs(root, null, 0);
    return xDepth === yDepth && xParent !== yParent;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4], 4, 3]);
    cases.push([[1, 2, 3, null, 4, null, 5], 5, 4]);
    const gen = (n) => {
      const tree = genRandTree(n);
      const clean = tree.filter(x => x !== null);
      if (clean.length < 2) return [tree, 1, 2];
      const x = clean[randInt(0, clean.length - 1)];
      let y = clean[randInt(0, clean.length - 1)];
      while (y === x && clean.length > 1) y = clean[randInt(0, clean.length - 1)];
      return [tree, x, y];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 2
{
  slug: 'binary-tree-tilt',
  title: 'Binary Tree Tilt',
  description: 'Given the root of a binary tree, return the sum of every tree node\'s tilt. The tilt of a tree node is the absolute difference between the sum of all left subtree node values and all right subtree node values. If a node does not have a left child, then the sum of the left subtree node values is treated as 0. The rule is similar for a right child.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 10^4]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[1,2,3]', output: '1', explanation: 'Tilt of node 2 = 0, node 3 = 0, node 1 = |2 - 3| = 1. Total = 1.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Recursive Summation', content: 'Post-order DFS returns sum of nodes in subtree. While processing, calculate tilt = |leftSum - rightSum| and add to global sum.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let totalTilt = 0;
    const sumNodes = (node) => {
      if (!node) return 0;
      let left = sumNodes(node.left);
      let right = sumNodes(node.right);
      totalTilt += Math.abs(left - right);
      return node.val + left + right;
    };
    sumNodes(root);
    return totalTilt;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]);
    cases.push([[4, 2, 9, 3, 5, null, 7]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 3
{
  slug: 'average-of-levels-in-binary-tree',
  title: 'Average of Levels in Binary Tree',
  description: 'Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 10^4]. -2^31 <= Node.val <= 2^31 - 1',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: '[3,14.5,11]', explanation: 'Averages of levels are: [3], [14.5], [11].' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<double>', java: 'double[]', py: 'List[float]' },
  hints: [{ title: 'BFS Level Sum', content: 'Standard BFS. For each level, compute the sum of values and divide by the number of nodes.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return [];
    let ans = [];
    let q = [root];
    while (q.length > 0) {
      let len = q.length;
      let sum = 0;
      for (let i = 0; i < len; i++) {
        let curr = q.shift();
        sum += curr.val;
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
      ans.push(sum / len);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, null, null, 15, 7]]);
    cases.push([[3, 9, 20, 15, 7]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 4
{
  slug: 'two-sum-iv-input-is-a-bst',
  title: 'Two Sum IV - Input is a BST',
  description: 'Given the root of a binary search tree and a target number k, return true if there exist two elements in the BST such that their sum is equal to the given target.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Hash Table', 'Two Pointers', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 10^4]. -10^4 <= Node.val <= 10^4. root is a valid BST. -10^5 <= k <= 10^5',
  examples: [{ input: '[5,3,6,2,4,null,7], 9', output: 'true', explanation: 'Nodes 5 and 4 sum to 9.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Hash set tracking', content: 'DFS traversal. Maintain a Hash Set of visited values. For current node, if set contains k - node.val, return true.' }],
  jsSolution: (arr, k) => {
    let root = buildTree(arr);
    let set = new Set();
    const find = (node) => {
      if (!node) return false;
      if (set.has(k - node.val)) return true;
      set.add(node.val);
      return find(node.left) || find(node.right);
    };
    return find(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 3, 6, 2, 4, null, 7], 9]);
    cases.push([[5, 3, 6, 2, 4, null, 7], 28]);
    const gen = (n) => {
      const bst = genBST(n);
      const target = randInt(-200, 200);
      return [bst, target];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 5
{
  slug: 'minimum-distance-between-bst-nodes',
  title: 'Minimum Distance Between BST Nodes',
  description: 'Given the root of a Binary Search Tree (BST), return the minimum difference between the values of any two different nodes in the tree.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [2, 100]. 0 <= Node.val <= 10^5',
  examples: [{ input: '[4,2,6,1,3]', output: '1', explanation: 'Minimum difference is 1 (2-1 or 3-2 or 4-3).' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Inorder sorted sequence', content: 'An inorder traversal visits elements in sorted order. Track the previously visited node value and compute differences.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let prev = null, minDiff = Infinity;
    const inorder = (node) => {
      if (!node) return;
      inorder(node.left);
      if (prev !== null) minDiff = Math.min(minDiff, node.val - prev);
      prev = node.val;
      inorder(node.right);
    };
    inorder(root);
    return minDiff;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 6, 1, 3]]);
    cases.push([[90, 69, null, 49, 89, null, null, null, 52]]);
    for (let i = 0; i < 48; i++) cases.push([genBST(randInt(2, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genBST(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([genBST(randInt(40, 100))]);
    return cases;
  }
},

// 6
{
  slug: 'range-sum-of-bst',
  title: 'Range Sum of BST',
  description: 'Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 2 * 10^4]. 1 <= Node.val <= 10^5, 1 <= low <= high <= 10^5. All Node.val are unique.',
  examples: [{ input: '[10,5,15,3,7,null,18], 7, 15', output: '32', explanation: 'Nodes in range [7, 15] are 7, 10, and 15. Sum is 32.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'low', cpp: 'int', java: 'int', py: 'low: int', js: 'low' },
    { name: 'high', cpp: 'int', java: 'int', py: 'high: int', js: 'high' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BST Pruning Sum', content: 'Recursive sum. If node.val is in range, add it. If node.val > low, recurse left. If node.val < high, recurse right.' }],
  jsSolution: (arr, low, high) => {
    let root = buildTree(arr);
    let sum = 0;
    const dfs = (node) => {
      if (!node) return;
      if (node.val >= low && node.val <= high) sum += node.val;
      if (node.val > low) dfs(node.left);
      if (node.val < high) dfs(node.right);
    };
    dfs(root);
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[10, 5, 15, 3, 7, null, 18], 7, 15]);
    cases.push([[10, 5, 15, 3, 7, 13, 18, 1, null, 6], 6, 10]);
    const gen = (n) => {
      const bst = genBST(n);
      const clean = bst.filter(x => x !== null).sort((a, b) => a - b);
      if (clean.length === 0) return [bst, 0, 0];
      const low = clean[randInt(0, Math.floor(clean.length / 2))];
      const high = clean[randInt(Math.floor(clean.length / 2), clean.length - 1)];
      return [bst, low, high];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 7
{
  slug: 'leaf-similar-trees',
  title: 'Leaf-Similar Trees',
  description: 'Two binary trees are considered leaf-similar if their leaf value sequence is identical. Return true if and only if root1 and root2 are leaf-similar.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in each tree is in the range [1, 200]. Both values of nodes are unique.',
  examples: [{ input: '[3,5,1,6,2,9,8,null,null,7,4], [3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]', output: 'true', explanation: 'Leaf sequence for both is [6, 7, 4, 9, 8].' }],
  args: [
    { name: 'root1', cpp: 'TreeNode*', java: 'TreeNode', py: 'root1: Optional[TreeNode]', js: 'root1' },
    { name: 'root2', cpp: 'TreeNode*', java: 'TreeNode', py: 'root2: Optional[TreeNode]', js: 'root2' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Leaf collection DFS', content: 'Run DFS on both trees, adding leaf node values (no left or right children) to separate lists, then compare the lists.' }],
  jsSolution: (arr1, arr2) => {
    let r1 = buildTree(arr1), r2 = buildTree(arr2);
    const leaves = (node, acc) => {
      if (!node) return;
      if (!node.left && !node.right) acc.push(node.val);
      leaves(node.left, acc);
      leaves(node.right, acc);
    };
    const l1 = [], l2 = [];
    leaves(r1, l1);
    leaves(r2, l2);
    return l1.length === l2.length && l1.every((v, i) => v === l2[i]);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 1, 6, 2, 9, 8, null, null, 7, 4], [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8]]);
    cases.push([[1, 2, 3], [1, 3, 2]]);
    for (let i = 0; i < 48; i++) {
      const t1 = genRandTree(randInt(1, 10));
      const exactSame = Math.random() < 0.5;
      cases.push([t1, exactSame ? t1 : genRandTree(randInt(1, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      const t1 = genRandTree(randInt(10, 40));
      const exactSame = Math.random() < 0.5;
      cases.push([t1, exactSame ? t1 : genRandTree(randInt(10, 40))]);
    }
    for (let i = 0; i < 50; i++) {
      const t1 = genRandTree(randInt(40, 100));
      const exactSame = Math.random() < 0.5;
      cases.push([t1, exactSame ? t1 : genRandTree(randInt(40, 100))]);
    }
    return cases;
  }
},

// 8
{
  slug: 'univalued-binary-tree',
  title: 'Univalued Binary Tree',
  description: 'A binary tree is univalued if every node in the tree has the same value. Return true if and only if the given tree is univalued.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 100]. 0 <= Node.val < 100',
  examples: [{ input: '[1,1,1,1,1,null,1]', output: 'true', explanation: 'All nodes have value 1.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Single value matches DFS', content: 'Compare every node\'s value to the root\'s value recursively.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return true;
    const check = (node, val) => {
      if (!node) return true;
      return node.val === val && check(node.left, val) && check(node.right, val);
    };
    return check(root, root.val);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 1, 1, 1, null, 1]]);
    cases.push([[2, 2, 2, 5, 2]]);
    const genUni = (n) => {
      const val = randInt(1, 10);
      const isUni = Math.random() < 0.5;
      const arr = Array.from({ length: n }, () => isUni ? val : (Math.random() < 0.1 ? val + 1 : val));
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(genUni(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(genUni(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(genUni(randInt(50, 150)));
    return cases;
  }
},

// 9
{
  slug: 'binary-tree-paths',
  title: 'Binary Tree Paths',
  description: 'Given the root of a binary tree, return all root-to-leaf paths in any order as an array of string paths (e.g. "1->2->5").',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['String', 'Backtracking', 'Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 100]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,null,5]', output: '["1->2->5","1->3"]', explanation: 'All root to leaf paths.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<string>', java: 'List<String>', py: 'List[str]' },
  hints: [{ title: 'Path concatenation DFS', content: 'DFS down. Pass current path string. At leaf node, push completed path to global results.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let paths = [];
    const getPaths = (node, cur) => {
      if (!node) return;
      let nextStr = cur ? `${cur}->${node.val}` : `${node.val}`;
      if (!node.left && !node.right) {
        paths.push(nextStr);
        return;
      }
      getPaths(node.left, nextStr);
      getPaths(node.right, nextStr);
    };
    getPaths(root, '');
    return paths;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, null, 5]]);
    cases.push([[1]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 100))]);
    return cases;
  }
},

// 10
{
  slug: 'longest-univalue-path',
  title: 'Longest Univalue Path',
  description: 'Given the root of a binary tree, return the length of the longest path where each node in the path has the same value. This path may or may not pass through the root.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 1000]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[5,4,5,1,1,null,5]', output: '2', explanation: 'Path 5->5->5 has length 2.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Uni depth recurrence', content: 'DFS returns the univalue path length starting at node. Update global maximum using left_len + right_len if node matching values.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let maxPath = 0;
    const dfs = (node) => {
      if (!node) return 0;
      let left = dfs(node.left);
      let right = dfs(node.right);
      let arrowLeft = 0, arrowRight = 0;
      if (node.left && node.left.val === node.val) arrowLeft = left + 1;
      if (node.right && node.right.val === node.val) arrowRight = right + 1;
      maxPath = Math.max(maxPath, arrowLeft + arrowRight);
      return Math.max(arrowLeft, arrowRight);
    };
    dfs(root);
    return maxPath;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 4, 5, 1, 1, null, 5]]);
    cases.push([[1, 4, 5, 4, 4, null, 5]]);
    cases.push([[]]);
    const gen = (n) => {
      // higher probability of duplicate neighbors
      const vals = [];
      let val = randInt(1, 5);
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.6) val = randInt(1, 5);
        vals.push(val);
      }
      const tree = [vals[0]];
      let idx = 1;
      while (idx < n) {
        if (Math.random() < 0.2) tree.push(null);
        else tree.push(vals[idx++]);
      }
      return [tree];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 11
{
  slug: 'count-good-nodes-in-binary-tree',
  title: 'Count Good Nodes in Binary Tree',
  description: 'Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X. Return the number of good nodes in the binary tree.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the binary tree is in the range [1, 10^5]. Each node\'s value is between [-10^4, 10^4].',
  examples: [{ input: '[3,1,4,3,null,1,5]', output: '4', explanation: 'Good nodes are: 3, 4, 5, 3 (at left subtree leaf).' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Carry path maximum', content: 'DFS traversal. Pass the maximum value seen so far on the path. If current node.val >= pathMax, increment count and update pathMax.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let goodCount = 0;
    const dfs = (node, maxVal) => {
      if (!node) return;
      if (node.val >= maxVal) {
        goodCount++;
        maxVal = node.val;
      }
      dfs(node.left, maxVal);
      dfs(node.right, maxVal);
    };
    if (root) dfs(root, root.val);
    return goodCount;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, 4, 3, null, 1, 5]]);
    cases.push([[3, 3, null, 4, 2]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 12
{
  slug: 'all-elements-in-two-binary-search-trees',
  title: 'All Elements in Two Binary Search Trees',
  description: 'Given the roots of two binary search trees root1 and root2, return a list containing all the integers from both trees sorted in ascending order.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Sorting', 'Binary Tree'],
  constraints: 'The number of nodes in each tree is in the range [0, 5000]. -10^5 <= Node.val <= 10^5',
  examples: [{ input: '[2,1,4], [1,0,3]', output: '[0,1,1,2,3,4]', explanation: 'Elements from both BSTs merged and sorted.' }],
  args: [
    { name: 'root1', cpp: 'TreeNode*', java: 'TreeNode', py: 'root1: Optional[TreeNode]', js: 'root1' },
    { name: 'root2', cpp: 'TreeNode*', java: 'TreeNode', py: 'root2: Optional[TreeNode]', js: 'root2' }
  ],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Inorder DFS + Merge', content: 'Extract sorted elements from both trees using inorder DFS. Merge the two sorted arrays in O(N+M) time.' }],
  jsSolution: (arr1, arr2) => {
    let r1 = buildTree(arr1), r2 = buildTree(arr2);
    const inorder = (node, acc) => {
      if (!node) return;
      inorder(node.left, acc);
      acc.push(node.val);
      inorder(node.right, acc);
    };
    const l1 = [], l2 = [];
    inorder(r1, l1);
    inorder(r2, l2);
    // merge two sorted arrays
    const res = [];
    let i = 0, j = 0;
    while (i < l1.length && j < l2.length) {
      if (l1[i] <= l2[j]) res.push(l1[i++]);
      else res.push(l2[j++]);
    }
    while (i < l1.length) res.push(l1[i++]);
    while (j < l2.length) res.push(l2[j++]);
    return res;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 4], [1, 0, 3]]);
    cases.push([[], [5, 1, 7]]);
    for (let i = 0; i < 48; i++) cases.push([genBST(randInt(0, 10)), genBST(randInt(0, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genBST(randInt(10, 40)), genBST(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([genBST(randInt(40, 100)), genBST(randInt(40, 100))]);
    return cases;
  }
},

// 13
{
  slug: 'minimum-depth-of-binary-tree',
  title: 'Minimum Depth of Binary Tree',
  description: 'Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 10^5]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: '2', explanation: 'The nearest leaf node is 9 (depth 2).' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BFS leaf discovery', content: 'Using BFS, the first leaf node encountered yields the minimum depth of the binary tree.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return 0;
    const minDepth = (node) => {
      if (!node) return 0;
      if (!node.left && !node.right) return 1;
      if (!node.left) return 1 + minDepth(node.right);
      if (!node.right) return 1 + minDepth(node.left);
      return 1 + Math.min(minDepth(node.left), minDepth(node.right));
    };
    return minDepth(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, null, null, 15, 7]]);
    cases.push([[2, null, 3, null, 4, null, 5, null, 6]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 14
{
  slug: 'maximum-width-of-binary-tree',
  title: 'Maximum Width of Binary Tree',
  description: 'Given the root of a binary tree, return the maximum width of the given tree. The maximum width of a tree is the maximum width among all levels. The width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where null nodes in between are also counted.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 3000]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,3,2,5,3,null,9]', output: '4', explanation: 'Maximum width is 4 at level 3 (5, 3, null, 9).' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BFS Node Indexing', content: 'Track horizontal indexes (similar to binary heap representation index: left = 2*idx, right = 2*idx+1). Use BigInt in JS to prevent overflow. Width of level = right_idx - left_idx + 1.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return 0;
    let maxWidth = 0;
    let q = [{ node: root, id: 1n }];
    while (q.length > 0) {
      let len = q.length;
      let head = q[0].id;
      let tail = q[q.length - 1].id;
      let width = Number(tail - head + 1n);
      maxWidth = Math.max(maxWidth, width);
      for (let i = 0; i < len; i++) {
        let { node, id } = q.shift();
        if (node.left) q.push({ node: node.left, id: id * 2n });
        if (node.right) q.push({ node: node.right, id: id * 2n + 1n });
      }
    }
    return maxWidth;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 2, 5, 3, null, 9]]);
    cases.push([[1, 3, 2, 5, null, null, 9, 6, null, 7]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(40, 100))]);
    return cases;
  }
},

// 15
{
  slug: 'binary-tree-zigzag-level-order-traversal',
  title: 'Binary Tree Zigzag Level Order Traversal',
  description: 'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 2000]. -100 <= Node.val <= 100',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: '[[3],[20,9],[15,7]]', explanation: 'BFS traversal with alternating direction levels.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'Alternating BFS', content: 'Perform standard BFS. For every odd level, reverse the collected array of node values before appending to result.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return [];
    let ans = [];
    let q = [root];
    let zigzag = false;
    while (q.length > 0) {
      let len = q.length;
      let level = [];
      for (let i = 0; i < len; i++) {
        let curr = q.shift();
        level.push(curr.val);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
      if (zigzag) level.reverse();
      ans.push(level);
      zigzag = !zigzag;
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, null, null, 15, 7]]);
    cases.push([[1]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 16
{
  slug: 'sum-root-to-leaf-numbers',
  title: 'Sum Root to Leaf Numbers',
  description: 'You are given the root of a binary tree containing digits from 0 to 9 only. Each root-to-leaf path in the tree represents a number. Return the total sum of all root-to-leaf numbers.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 1000]. 0 <= Node.val <= 9. The depth of the tree will not exceed 10.',
  examples: [{ input: '[1,2,3]', output: '25', explanation: 'Paths 1->2 (12) and 1->3 (13) sum to 25.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Running sum traversal', content: 'Accumulate path values as standard decimal digits: running = running * 10 + node.val. At leaves, return the accumulated sum.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const dfs = (node, sum) => {
      if (!node) return 0;
      let nextSum = sum * 10 + node.val;
      if (!node.left && !node.right) return nextSum;
      return dfs(node.left, nextSum) + dfs(node.right, nextSum);
    };
    return dfs(root, 0);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3]]);
    cases.push([[4, 9, 0, 5, 1]]);
    for (let i = 0; i < 48; i++) {
      const tree = genRandTree(randInt(1, 10));
      cases.push([tree.map(x => x === null ? null : Math.abs(x) % 10)]);
    }
    for (let i = 0; i < 50; i++) {
      const tree = genRandTree(randInt(10, 30));
      cases.push([tree.map(x => x === null ? null : Math.abs(x) % 10)]);
    }
    for (let i = 0; i < 50; i++) {
      const tree = genRandTree(randInt(30, 80));
      cases.push([tree.map(x => x === null ? null : Math.abs(x) % 10)]);
    }
    return cases;
  }
},

// 17
{
  slug: 'flatten-binary-tree-to-linked-list',
  title: 'Flatten Binary Tree to Linked List',
  description: 'Given the root of a binary tree, flatten the tree into a "linked list". The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the preorder sequence and the left child pointer is always null.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 2000]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,5,3,4,null,6]', output: '[1,null,2,null,3,null,4,null,5,null,6]', explanation: 'Flattened in preorder sequence.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Reverse preorder DFS', content: 'Flatting starting from the rightmost elements. Maintain a prev pointer. Connect node.right = prev, node.left = null, prev = node.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let prev = null;
    const flatten = (node) => {
      if (!node) return;
      flatten(node.right);
      flatten(node.left);
      node.right = prev;
      node.left = null;
      prev = node;
    };
    flatten(root);
    return printTree(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 5, 3, 4, null, 6]]);
    cases.push([[]]);
    cases.push([[0]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 18
{
  slug: 'populating-next-right-pointers-in-each-node',
  title: 'Populating Next Right Pointers in Each Node',
  description: 'You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node. Return the populated tree levels (simulated as right-side links).',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 4000]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[1,2,3,4,5,6,7]', output: '[1,3,7]', explanation: 'Next links connect levels properly.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'BFS Level connection', content: 'Using BFS, connect each node\'s next pointer to the next node in the queue at the same level.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return [];
    let ans = [];
    let q = [root];
    while (q.length > 0) {
      let len = q.length;
      for (let i = 0; i < len; i++) {
        let curr = q.shift();
        if (i === len - 1) ans.push(curr.val);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6, 7]]);
    cases.push([[]]);
    const makePerfect = (d) => {
      const size = Math.pow(2, d) - 1;
      return [randArr(size, 1, 100)];
    };
    for (let i = 0; i < 48; i++) cases.push(makePerfect(randInt(1, 4)));
    for (let i = 0; i < 50; i++) cases.push(makePerfect(randInt(4, 7)));
    for (let i = 0; i < 50; i++) cases.push(makePerfect(randInt(5, 8)));
    return cases;
  }
},

// 19
{
  slug: 'construct-binary-tree-from-inorder-and-postorder-traversal',
  title: 'Construct Binary Tree from Inorder and Postorder Traversal',
  description: 'Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'],
  constraints: '1 <= inorder.length <= 3000. postorder.length == inorder.length. -3000 <= inorder[i], postorder[i] <= 3000. inorder and postorder consist of unique values.',
  examples: [{ input: '[9,3,15,20,7], [9,15,7,20,3]', output: '[3,9,20,null,null,15,7]', explanation: 'Reconstructed tree matches.' }],
  args: [
    { name: 'inorder', cpp: 'vector<int>', java: 'int[]', py: 'inorder: List[int]', js: 'inorder' },
    { name: 'postorder', cpp: 'vector<int>', java: 'int[]', py: 'postorder: List[int]', js: 'postorder' }
  ],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Postorder right-to-left', content: 'The last element of postorder is the root. Locate it in inorder, build the right subtree first (since we read postorder from right to left), then left subtree.' }],
  jsSolution: (inorder, postorder) => {
    let postIdx = postorder.length - 1;
    const map = new Map();
    for (let i = 0; i < inorder.length; i++) map.set(inorder[i], i);
    const helper = (left, right) => {
      if (left > right) return null;
      let rootVal = postorder[postIdx--];
      let root = new TreeNode(rootVal);
      let mid = map.get(rootVal);
      root.right = helper(mid + 1, right);
      root.left = helper(left, mid - 1);
      return root;
    };
    let res = helper(0, inorder.length - 1);
    return printTree(res);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[9, 3, 15, 20, 7], [9, 15, 7, 20, 3]]);
    cases.push([[-1], [-1]]);
    const gen = (n) => {
      const tree = buildTree(genBST(n));
      if (!tree) return [[], []];
      const post = [];
      const ino = [];
      const getPost = (node) => {
        if (!node) return;
        getPost(node.left);
        getPost(node.right);
        post.push(node.val);
      };
      const getIno = (node) => {
        if (!node) return;
        getIno(node.left);
        ino.push(node.val);
        getIno(node.right);
      };
      getPost(tree);
      getIno(tree);
      return [ino, post];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 20
{
  slug: 'convert-sorted-array-to-binary-search-tree',
  title: 'Convert Sorted Array to Binary Search Tree',
  description: 'Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Array', 'Divide and Conquer', 'Tree', 'Binary Search Tree', 'Binary Tree'],
  constraints: '1 <= nums.length <= 10^4. -10^4 <= nums[i] <= 10^4. nums is sorted in a strictly increasing order.',
  examples: [{ input: '[-10,-3,0,5,9]', output: '[0,-3,9,-10,null,5]', explanation: 'A valid height balanced BST.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Midpoint Root', content: 'Choose the midpoint as root to maintain balance. Recursively convert left and right subarrays.' }],
  jsSolution: (nums) => {
    const sortedBST = (left, right) => {
      if (left > right) return null;
      let mid = Math.floor((left + right) / 2);
      let node = new TreeNode(nums[mid]);
      node.left = sortedBST(left, mid - 1);
      node.right = sortedBST(mid + 1, right);
      return node;
    };
    let root = sortedBST(0, nums.length - 1);
    return printTree(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-10, -3, 0, 5, 9]]);
    cases.push([[1, 3]]);
    const gen = (n) => {
      const arr = Array.from(new Set(randArr(n * 2, -100, 100))).slice(0, n).sort((a, b) => a - b);
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 21
{
  slug: 'convert-sorted-list-to-binary-search-tree',
  title: 'Convert Sorted List to Binary Search Tree',
  description: 'Given the head of a singly linked list where elements are sorted in ascending order, convert it to a height-balanced binary search tree.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Linked List', 'Divide and Conquer', 'Tree', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in head is in the range [0, 20000]. -10^5 <= Node.val <= 10^5',
  examples: [{ input: '[-10,-3,0,5,9]', output: '[0,-3,9,-10,null,5]', explanation: 'A valid height balanced BST from sorted list.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Mid pointer splits list', content: 'Use fast and slow pointers to find the middle node of the list. Make it root, recursively build BST on left and right sublists.' }],
  jsSolution: (arr) => {
    const sortedBST = (left, right) => {
      if (left > right) return null;
      let mid = Math.floor((left + right) / 2);
      let node = new TreeNode(arr[mid]);
      node.left = sortedBST(left, mid - 1);
      node.right = sortedBST(mid + 1, right);
      return node;
    };
    let root = sortedBST(0, arr.length - 1);
    return printTree(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[-10, -3, 0, 5, 9]]);
    cases.push([[]]);
    const gen = (n) => {
      const arr = Array.from(new Set(randArr(n * 2, -100, 100))).slice(0, n).sort((a, b) => a - b);
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 22
{
  slug: 'serialize-and-deserialize-binary-tree',
  title: 'Serialize and Deserialize Binary Tree',
  description: 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. We just return the deserialized tree.',
  difficulty: 'Hard',
  category: 'Trees',
  tags: ['String', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Design', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 10^4]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]', explanation: 'Tree is successfully serialized and deserialized.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'DFS preorder serialization', content: 'Serialize using preorder DFS with null nodes represented by a sentinel. Deserialize by shifting elements sequentially.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    return printTree(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, null, null, 4, 5]]);
    cases.push([[]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(0, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 23
{
  slug: 'binary-tree-cameras',
  title: 'Binary Tree Cameras',
  description: 'You are given the root of a binary tree. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children. Return the minimum number of cameras needed to monitor all nodes of the tree.',
  difficulty: 'Hard',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Dynamic Programming', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 1000]. Node.val == 0',
  examples: [{ input: '[0,0,null,0,0]', output: '1', explanation: 'One camera placed at left child can monitor all nodes.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Greedy bottom-up placing', content: 'Recursive postorder DFS. Node states: 0 = unmonitored, 1 = camera installed, 2 = monitored. If child is unmonitored, place camera. If child has camera, current node is monitored.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let cameras = 0;
    const dfs = (node) => {
      if (!node) return 2;
      let left = dfs(node.left);
      let right = dfs(node.right);
      if (left === 0 || right === 0) {
        cameras++;
        return 1;
      }
      if (left === 1 || right === 1) return 2;
      return 0;
    };
    if (dfs(root) === 0) cameras++;
    return cameras;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 0, null, 0, 0]]);
    cases.push([[0, 0, null, 0, null, 0, null, null, 0]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10)).map(x => x === null ? null : 0)]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 40)).map(x => x === null ? null : 0)]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(40, 100)).map(x => x === null ? null : 0)]);
    return cases;
  }
},

// 24
{
  slug: 'sum-of-nodes-with-even-valued-grandparent',
  title: 'Sum of Nodes with Even-Valued Grandparent',
  description: 'Given the root of a binary tree, return the sum of values of nodes with an even-valued grandparent. A grandparent of a node is the parent of its parent, if it exists.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 10^4]. 1 <= Node.val <= 100',
  examples: [{ input: '[6,7,8,2,7,1,3,9,null,1,4,null,null,null,5]', output: '18', explanation: 'Nodes 2, 7, 1, 3, 5 have even grandparent 6/8. Sum of values: 2+7+1+3+5 = 18.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'DFS grandfather pass', content: 'DFS down. Pass grandparent val and parent val as parameters: dfs(node, parentVal, grandparentVal).' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let sum = 0;
    const dfs = (node, parentVal, gpVal) => {
      if (!node) return;
      if (gpVal !== null && gpVal % 2 === 0) {
        sum += node.val;
      }
      dfs(node.left, node.val, parentVal);
      dfs(node.right, node.val, parentVal);
    };
    dfs(root, null, null);
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[6, 7, 8, 2, 7, 1, 3, 9, null, 1, 4, null, null, null, 5]]);
    cases.push([[1, 2, 3]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(3, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 25
{
  slug: 'lowest-common-ancestor-of-deepest-leaves',
  title: 'Lowest Common Ancestor of Deepest Leaves',
  description: 'Given the root of a binary tree, return the lowest common ancestor of its deepest leaves.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 1000]. 0 <= Node.val <= 1000. All values are unique.',
  examples: [{ input: '[3,5,1,6,2,0,8,null,null,7,4]', output: '[2,7,4]', explanation: 'The deepest leaves are 7 and 4, their LCA is 2.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Compare subtree depths', content: 'Recursive postorder DFS. Returns { node, depth }. If left subtree depth === right subtree depth, current node is the LCA.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const dfs = (node) => {
      if (!node) return { node: null, d: 0 };
      let left = dfs(node.left);
      let right = dfs(node.right);
      if (left.d > right.d) return { node: left.node, d: left.d + 1 };
      if (right.d > left.d) return { node: right.node, d: right.d + 1 };
      return { node: node, d: left.d + 1 };
    };
    let res = dfs(root).node;
    return printTree(res);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]]);
    cases.push([[1]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(40, 100))]);
    return cases;
  }
}
];
