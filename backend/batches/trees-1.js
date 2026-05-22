// Trees — Batch 1 (25 problems)
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
  slug: 'invert-binary-tree',
  title: 'Invert Binary Tree',
  description: 'Given the root of a binary tree, invert the tree, and return its root.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100',
  examples: [{ input: '[4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'The binary tree is inverted.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Invert Subtrees', content: 'For each node, swap its left and right children, then recursively invert the left and right subtrees.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const invert = (node) => {
      if (!node) return null;
      let left = invert(node.left);
      let right = invert(node.right);
      node.left = right;
      node.right = left;
      return node;
    };
    return printTree(invert(root));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 7, 1, 3, 6, 9]]);
    cases.push([[2, 1, 3]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(40, 100))]);
    return cases;
  }
},

// 2
{
  slug: 'maximum-depth-of-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  description: 'Given the root of a binary tree, return its maximum depth.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 10^4]. -100 <= Node.val <= 100',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: '3', explanation: 'The maximum depth is 3.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Recursion Depth', content: 'The max depth of a tree is 1 plus the maximum of the max depths of its left and right subtrees.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const maxDepth = (node) => {
      if (!node) return 0;
      return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
    };
    return maxDepth(root);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, null, null, 15, 7]]);
    cases.push([[1, null, 2]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 200))]);
    return cases;
  }
},

// 3
{
  slug: 'same-tree',
  title: 'Same Tree',
  description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in both trees is in the range [0, 100]. -10^4 <= Node.val <= 10^4',
  examples: [{ input: '[1,2,3], [1,2,3]', output: 'true', explanation: 'Both trees are structurally identical with identical values.' }],
  args: [
    { name: 'p', cpp: 'TreeNode*', java: 'TreeNode', py: 'p: Optional[TreeNode]', js: 'p' },
    { name: 'q', cpp: 'TreeNode*', java: 'TreeNode', py: 'q: Optional[TreeNode]', js: 'q' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Strict structural matching', content: 'Two trees are the same if their root values are identical, and their left and right subtrees are the same.' }],
  jsSolution: (arr1, arr2) => {
    let p = buildTree(arr1), q = buildTree(arr2);
    const isSame = (n1, n2) => {
      if (!n1 && !n2) return true;
      if (!n1 || !n2) return false;
      return n1.val === n2.val && isSame(n1.left, n2.left) && isSame(n1.right, n2.right);
    };
    return isSame(p, q);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], [1, 2, 3]]);
    cases.push([[1, 2], [1, null, 2]]);
    cases.push([[1, 2, 1], [1, 1, 2]]);
    for (let i = 0; i < 47; i++) {
      const t = genRandTree(randInt(0, 10));
      const exactSame = Math.random() < 0.5;
      cases.push([t, exactSame ? t : genRandTree(randInt(0, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      const t = genRandTree(randInt(10, 40));
      const exactSame = Math.random() < 0.5;
      cases.push([t, exactSame ? t : genRandTree(randInt(10, 40))]);
    }
    for (let i = 0; i < 50; i++) {
      const t = genRandTree(randInt(40, 100));
      const exactSame = Math.random() < 0.5;
      cases.push([t, exactSame ? t : genRandTree(randInt(40, 100))]);
    }
    return cases;
  }
},

// 4
{
  slug: 'symmetric-tree',
  title: 'Symmetric Tree',
  description: 'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 1000]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,2,3,4,4,3]', output: 'true', explanation: 'The tree is symmetric.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Mirror Image logic', content: 'A tree is symmetric if its left subtree is a mirror image of its right subtree. Check if left.val === right.val, left.left mirror right.right, left.right mirror right.left.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return true;
    const isMirror = (n1, n2) => {
      if (!n1 && !n2) return true;
      if (!n1 || !n2) return false;
      return n1.val === n2.val && isMirror(n1.left, n2.right) && isMirror(n1.right, n2.left);
    };
    return isMirror(root.left, root.right);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 2, 3, 4, 4, 3]]);
    cases.push([[1, 2, 2, null, 3, null, 3]]);
    const genSym = (n) => {
      const left = buildTree(genRandTree(n));
      const makeMirror = (node) => {
        if (!node) return null;
        let clone = new TreeNode(node.val);
        clone.left = makeMirror(node.right);
        clone.right = makeMirror(node.left);
        return clone;
      };
      const root = new TreeNode(1);
      root.left = left;
      root.right = makeMirror(left);
      return printTree(root);
    };
    for (let i = 0; i < 48; i++) {
      if (Math.random() < 0.5) cases.push([genSym(randInt(1, 5))]);
      else cases.push([genRandTree(randInt(1, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      if (Math.random() < 0.5) cases.push([genSym(randInt(5, 20))]);
      else cases.push([genRandTree(randInt(10, 40))]);
    }
    for (let i = 0; i < 50; i++) {
      if (Math.random() < 0.5) cases.push([genSym(randInt(20, 50))]);
      else cases.push([genRandTree(randInt(40, 100))]);
    }
    return cases;
  }
},

// 5
{
  slug: 'subtree-of-another-tree',
  title: 'Subtree of Another Tree',
  description: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot, and false otherwise.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'String Matching', 'Binary Tree'],
  constraints: 'The number of nodes in root is in the range [1, 2000]. The number of nodes in subRoot is in the range [1, 1000]. -10^4 <= Node.val <= 10^4',
  examples: [{ input: '[3,4,5,1,2], [4,1,2]', output: 'true', explanation: 'subRoot is structurally matching a subtree of root.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'subRoot', cpp: 'TreeNode*', java: 'TreeNode', py: 'subRoot: Optional[TreeNode]', js: 'subRoot' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'SameTree helper', content: 'For each node in root, check if the subtree starting at this node is identical to subRoot using a SameTree function.' }],
  jsSolution: (arr1, arr2) => {
    let r = buildTree(arr1), s = buildTree(arr2);
    const isSame = (n1, n2) => {
      if (!n1 && !n2) return true;
      if (!n1 || !n2) return false;
      return n1.val === n2.val && isSame(n1.left, n2.left) && isSame(n1.right, n2.right);
    };
    const checkSub = (n) => {
      if (!n) return false;
      if (isSame(n, s)) return true;
      return checkSub(n.left) || checkSub(n.right);
    };
    return checkSub(r);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 4, 5, 1, 2], [4, 1, 2]]);
    cases.push([[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]]);
    for (let i = 0; i < 48; i++) {
      const r = genRandTree(randInt(5, 15));
      const isSub = Math.random() < 0.5;
      if (isSub && r.length > 3) {
        // extract a valid subtree
        const treeRoot = buildTree(r);
        const sub = Math.random() < 0.5 ? treeRoot.left : treeRoot.right;
        cases.push([r, printTree(sub)]);
      } else {
        cases.push([r, genRandTree(randInt(2, 5))]);
      }
    }
    for (let i = 0; i < 50; i++) {
      const r = genRandTree(randInt(15, 50));
      const isSub = Math.random() < 0.5;
      if (isSub) {
        const treeRoot = buildTree(r);
        const sub = Math.random() < 0.5 ? treeRoot.left : treeRoot.right;
        cases.push([r, printTree(sub)]);
      } else {
        cases.push([r, genRandTree(randInt(3, 10))]);
      }
    }
    for (let i = 0; i < 50; i++) {
      const r = genRandTree(randInt(50, 100));
      const isSub = Math.random() < 0.5;
      if (isSub) {
        const treeRoot = buildTree(r);
        const sub = Math.random() < 0.5 ? treeRoot.left : treeRoot.right;
        cases.push([r, printTree(sub)]);
      } else {
        cases.push([r, genRandTree(randInt(5, 15))]);
      }
    }
    return cases;
  }
},

// 6
{
  slug: 'binary-tree-level-order-traversal',
  title: 'Binary Tree Level Order Traversal',
  description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 2000]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'BFS level-by-level output.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'Queue BFS', content: 'Use a queue. For each level, record its size, pop that many nodes, push their values to a list, and push their children to the queue.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    if (!root) return [];
    const ans = [];
    const q = [root];
    while (q.length > 0) {
      let len = q.length;
      let level = [];
      for (let i = 0; i < len; i++) {
        let curr = q.shift();
        level.push(curr.val);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
      ans.push(level);
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

// 7
{
  slug: 'maximum-difference-between-node-and-ancestor',
  title: 'Maximum Difference Between Node and Ancestor',
  description: 'Given the root of a binary tree, find the maximum value v for which there exist different nodes a and b where v = |a.val - b.val| and a is an ancestor of b.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [2, 5000]. 0 <= Node.val <= 10^5',
  examples: [{ input: '[8,3,10,1,6,null,14,null,null,4,7,13]', output: '7', explanation: '|8 - 1| = 7, which is the maximum difference.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Path Min/Max', content: 'As you traverse down the tree, track the minimum and maximum values seen along the path. Result is max(maxVal - minVal).' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let maxDiff = 0;
    const dfs = (node, curMin, curMax) => {
      if (!node) return;
      maxDiff = Math.max(maxDiff, Math.abs(node.val - curMin), Math.abs(node.val - curMax));
      let nMin = Math.min(curMin, node.val);
      let nMax = Math.max(curMax, node.val);
      dfs(node.left, nMin, nMax);
      dfs(node.right, nMin, nMax);
    };
    if (root) dfs(root, root.val, root.val);
    return maxDiff;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13]]);
    cases.push([[1, null, 2, null, 0, 3]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(2, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 8
{
  slug: 'lowest-common-ancestor-of-a-binary-search-tree',
  title: 'Lowest Common Ancestor of a Binary Search Tree',
  description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [2, 10^5]. -10^9 <= Node.val <= 10^9. All Node.val are unique. p and q are guaranteed to be in the BST.',
  examples: [{ input: '[6,2,8,0,4,7,9,null,null,3,5], 2, 8', output: '6', explanation: 'The LCA of 2 and 8 is 6.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'pVal', cpp: 'int', java: 'int', py: 'pVal: int', js: 'pVal' },
    { name: 'qVal', cpp: 'int', java: 'int', py: 'qVal: int', js: 'qVal' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'BST Property LCA', content: 'If both p and q are smaller than root, LCA is in left subtree. If both are larger, LCA is in right subtree. Otherwise, current root is the LCA.' }],
  jsSolution: (arr, pVal, qVal) => {
    let root = buildTree(arr);
    let curr = root;
    while (curr) {
      if (pVal < curr.val && qVal < curr.val) {
        curr = curr.left;
      } else if (pVal > curr.val && qVal > curr.val) {
        curr = curr.right;
      } else {
        return curr.val;
      }
    }
    return -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8]);
    cases.push([[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4]);
    const gen = (n) => {
      const bst = genBST(n);
      // pick two random elements in BST
      const clean = bst.filter(x => x !== null);
      const p = clean[randInt(0, clean.length - 1)];
      let q = clean[randInt(0, clean.length - 1)];
      while (q === p && clean.length > 1) q = clean[randInt(0, clean.length - 1)];
      return [bst, p, q];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 30)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(30, 80)));
    return cases;
  }
},

// 9
{
  slug: 'lowest-common-ancestor-of-a-binary-tree',
  title: 'Lowest Common Ancestor of a Binary Tree',
  description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [2, 10^5]. -10^9 <= Node.val <= 10^9. All Node.val are unique. p and q are guaranteed to be in the tree.',
  examples: [{ input: '[3,5,1,6,2,0,8,null,null,7,4], 5, 1', output: '3', explanation: 'The LCA of 5 and 1 is 3.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'pVal', cpp: 'int', java: 'int', py: 'pVal: int', js: 'pVal' },
    { name: 'qVal', cpp: 'int', java: 'int', py: 'qVal: int', js: 'qVal' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'DFS Search', content: 'Recursive traversal. If current node is p or q, return current. Search left and right subtrees. If both search results are non-null, root is LCA.' }],
  jsSolution: (arr, pVal, qVal) => {
    let root = buildTree(arr);
    const findLCA = (node) => {
      if (!node || node.val === pVal || node.val === qVal) return node;
      let left = findLCA(node.left);
      let right = findLCA(node.right);
      if (left && right) return node;
      return left || right;
    };
    let res = findLCA(root);
    return res ? res.val : -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1]);
    cases.push([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4]);
    const gen = (n) => {
      const tree = genRandTree(n);
      const clean = tree.filter(x => x !== null);
      const p = clean[randInt(0, clean.length - 1)];
      let q = clean[randInt(0, clean.length - 1)];
      while (q === p && clean.length > 1) q = clean[randInt(0, clean.length - 1)];
      return [tree, p, q];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 10
{
  slug: 'validate-binary-search-tree',
  title: 'Validate Binary Search Tree',
  description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 10^4]. -2^31 <= Node.val <= 2^31 - 1',
  examples: [{ input: '[2,1,3]', output: 'true', explanation: 'Root is 2, left is 1, right is 3. Valid BST.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Range Validation', content: 'For each node, it must be strictly greater than a lower bound and strictly less than an upper bound. Pass these bounds recursively.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const validate = (node, low, high) => {
      if (!node) return true;
      if (node.val <= low || node.val >= high) return false;
      return validate(node.left, low, node.val) && validate(node.right, node.val, high);
    };
    return validate(root, -Infinity, Infinity);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 3]]);
    cases.push([[5, 1, 4, null, null, 3, 6]]);
    for (let i = 0; i < 48; i++) {
      if (Math.random() < 0.6) cases.push([genBST(randInt(1, 10))]);
      else cases.push([genRandTree(randInt(1, 10))]);
    }
    for (let i = 0; i < 50; i++) {
      if (Math.random() < 0.6) cases.push([genBST(randInt(10, 40))]);
      else cases.push([genRandTree(randInt(10, 40))]);
    }
    for (let i = 0; i < 50; i++) {
      if (Math.random() < 0.6) cases.push([genBST(randInt(40, 100))]);
      else cases.push([genRandTree(randInt(40, 100))]);
    }
    return cases;
  }
},

// 11
{
  slug: 'kth-smallest-element-in-a-bst',
  title: 'Kth Smallest Element in a BST',
  description: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is n. 1 <= k <= n <= 10^4. 0 <= Node.val <= 10^4',
  examples: [{ input: '[3,1,4,null,2], 1', output: '1', explanation: 'The 1st smallest value is 1.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Inorder Sorts BST', content: 'An inorder traversal of a BST visits the nodes in ascending sorted order. Just perform an inorder traversal and stop at the kth visited node.' }],
  jsSolution: (arr, k) => {
    let root = buildTree(arr);
    let count = 0, ans = -1;
    const inorder = (node) => {
      if (!node || count >= k) return;
      inorder(node.left);
      count++;
      if (count === k) {
        ans = node.val;
        return;
      }
      inorder(node.right);
    };
    inorder(root);
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, 4, null, 2], 1]);
    cases.push([[5, 3, 6, 2, 4, null, null, 1], 3]);
    const gen = (n) => {
      const bst = genBST(n);
      const k = randInt(1, bst.filter(x => x !== null).length);
      return [bst, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 12
{
  slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  title: 'Construct Binary Tree from Preorder and Inorder Traversal',
  description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'],
  constraints: '1 <= preorder.length <= 3000. inorder.length == preorder.length. -3000 <= preorder[i], inorder[i] <= 3000. preorder and inorder consist of unique values.',
  examples: [{ input: '[3,9,20,15,7], [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]', explanation: 'Reconstructed tree matches.' }],
  args: [
    { name: 'preorder', cpp: 'vector<int>', java: 'int[]', py: 'preorder: List[int]', js: 'preorder' },
    { name: 'inorder', cpp: 'vector<int>', java: 'int[]', py: 'inorder: List[int]', js: 'inorder' }
  ],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Preorder head, Inorder split', content: 'First element of preorder is the root. Find it in inorder to split into left and right subtrees, recursively building them.' }],
  jsSolution: (preorder, inorder) => {
    let preIdx = 0;
    const map = new Map();
    for (let i = 0; i < inorder.length; i++) map.set(inorder[i], i);
    const helper = (left, right) => {
      if (left > right) return null;
      let rootVal = preorder[preIdx++];
      let root = new TreeNode(rootVal);
      let mid = map.get(rootVal);
      root.left = helper(left, mid - 1);
      root.right = helper(mid + 1, right);
      return root;
    };
    let res = helper(0, inorder.length - 1);
    return printTree(res);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]]);
    cases.push([[-1], [-1]]);
    const gen = (n) => {
      const tree = buildTree(genBST(n));
      if (!tree) return [[], []];
      const pre = [];
      const ino = [];
      const getPre = (node) => {
        if (!node) return;
        pre.push(node.val);
        getPre(node.left);
        getPre(node.right);
      };
      const getIno = (node) => {
        if (!node) return;
        getIno(node.left);
        ino.push(node.val);
        getIno(node.right);
      };
      getPre(tree);
      getIno(tree);
      return [pre, ino];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 13
{
  slug: 'binary-tree-right-side-view',
  title: 'Binary Tree Right Side View',
  description: 'Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,null,5,null,4]', output: '[1,3,4]', explanation: 'Nodes visible from right are 1, 3, and 4.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'BFS Level Ends', content: 'Perform BFS level by level. The rightmost node at each level is the last node processed in that level.' }],
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
    cases.push([[1, 2, 3, null, 5, null, 4]]);
    cases.push([[1, null, 3]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 100))]);
    return cases;
  }
},

// 14
{
  slug: 'path-sum',
  title: 'Path Sum',
  description: 'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 5000]. -1000 <= Node.val <= 1000, -1000 <= targetSum <= 1000',
  examples: [{ input: '[5,4,8,11,null,13,4,7,2,null,null,null,1], 22', output: 'true', explanation: 'Path 5->4->11->2 sums to 22.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'targetSum', cpp: 'int', java: 'int', py: 'targetSum: int', js: 'targetSum' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Recursive subtract', content: 'At each node, subtract current value from targetSum. If leaf node is reached, check if remaining targetSum is 0.' }],
  jsSolution: (arr, targetSum) => {
    let root = buildTree(arr);
    const hasPath = (node, sum) => {
      if (!node) return false;
      if (!node.left && !node.right) return sum === node.val;
      return hasPath(node.left, sum - node.val) || hasPath(node.right, sum - node.val);
    };
    return hasPath(root, targetSum);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22]);
    cases.push([[1, 2, 3], 5]);
    cases.push([[], 0]);
    const gen = (n) => {
      const tree = genRandTree(n);
      const target = randInt(-100, 500);
      return [tree, target];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 15
{
  slug: 'path-sum-ii',
  title: 'Path Sum II',
  description: 'Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Backtracking', 'Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 5000]. -1000 <= Node.val <= 1000, -1000 <= targetSum <= 1000',
  examples: [{ input: '[5,4,8,11,null,13,4,7,2,null,null,5,1], 22', output: '[[5,4,11,2],[5,8,4,5]]', explanation: 'All paths summing to 22.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'targetSum', cpp: 'int', java: 'int', py: 'targetSum: int', js: 'targetSum' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]' },
  hints: [{ title: 'DFS with backtracking', content: 'DFS down to leaf. Maintain current path. When leaf is reached, if sum matches, add path copy to results. Backtrack.' }],
  jsSolution: (arr, targetSum) => {
    let root = buildTree(arr);
    let paths = [];
    const getPaths = (node, sum, current) => {
      if (!node) return;
      current.push(node.val);
      if (!node.left && !node.right && sum === node.val) {
        paths.push([...current]);
      }
      getPaths(node.left, sum - node.val, current);
      getPaths(node.right, sum - node.val, current);
      current.pop();
    };
    getPaths(root, targetSum, []);
    return paths;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22]);
    cases.push([[1, 2], 0]);
    const gen = (n) => {
      const tree = genRandTree(n);
      const target = randInt(-100, 300);
      return [tree, target];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 16
{
  slug: 'sum-of-left-leaves',
  title: 'Sum of Left Leaves',
  description: 'Given the root of a binary tree, return the sum of all left leaves.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 1000]. -1000 <= Node.val <= 1000',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: '24', explanation: 'Left leaf 9 and 15 sum to 24.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Detect Left Leaf', content: 'Traverse tree. For each node, check if node.left is a leaf (has no left or right child). If so, accumulate node.left.val.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let sum = 0;
    const dfs = (node, isLeft) => {
      if (!node) return;
      if (!node.left && !node.right && isLeft) {
        sum += node.val;
      }
      dfs(node.left, true);
      dfs(node.right, false);
    };
    dfs(root, false);
    return sum;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, null, null, 15, 7]]);
    cases.push([[1]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(2, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 17
{
  slug: 'diameter-of-binary-tree',
  title: 'Diameter of Binary Tree',
  description: 'Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 10^4]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,4,5]', output: '3', explanation: 'Path 4->2->1->3 has length 3.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Max depth combo', content: 'Diameter of a node is left_depth + right_depth. Post-order DFS returns max depth while updating global max diameter.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    let maxDia = 0;
    const depth = (node) => {
      if (!node) return 0;
      let left = depth(node.left);
      let right = depth(node.right);
      maxDia = Math.max(maxDia, left + right);
      return 1 + Math.max(left, right);
    };
    depth(root);
    return maxDia;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5]]);
    cases.push([[1, 2]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 18
{
  slug: 'balanced-binary-tree',
  title: 'Balanced Binary Tree',
  description: 'Given a binary tree, determine if it is height-balanced.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 5000]. -10^4 <= Node.val <= 10^4',
  examples: [{ input: '[3,9,20,null,null,15,7]', output: 'true', explanation: 'Heights of subtrees differ by at most 1.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Difference of depths', content: 'A tree is balanced if subtrees differ by height <= 1 and both subtrees are balanced. Compute depth recursively, returning -1 if unbalanced.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const checkHeight = (node) => {
      if (!node) return 0;
      let left = checkHeight(node.left);
      if (left === -1) return -1;
      let right = checkHeight(node.right);
      if (right === -1) return -1;
      if (Math.abs(left - right) > 1) return -1;
      return 1 + Math.max(left, right);
    };
    return checkHeight(root) !== -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 9, 20, null, null, 15, 7]]);
    cases.push([[1, 2, 2, 3, 3, null, null, 4, 4]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 150))]);
    return cases;
  }
},

// 19
{
  slug: 'merge-two-binary-trees',
  title: 'Merge Two Binary Trees',
  description: 'You are given two binary trees root1 and root2. Merge them into a new binary tree where, if two nodes overlap, sum their values. Otherwise, use the non-null node.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in both trees is in the range [0, 2000]. -10^4 <= Node.val <= 10^4',
  examples: [{ input: '[1,3,2,5], [2,1,3,null,4,null,7]', output: '[3,4,5,5,4,null,7]', explanation: 'Trees are merged with overlapping nodes summed.' }],
  args: [
    { name: 'root1', cpp: 'TreeNode*', java: 'TreeNode', py: 'root1: Optional[TreeNode]', js: 'root1' },
    { name: 'root2', cpp: 'TreeNode*', java: 'TreeNode', py: 'root2: Optional[TreeNode]', js: 'root2' }
  ],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Sum nodes recursion', content: 'If both nodes are null, return null. If one is null, return the other. If both exist, sum values, recurse left and right, and return.' }],
  jsSolution: (arr1, arr2) => {
    let r1 = buildTree(arr1), r2 = buildTree(arr2);
    const merge = (n1, n2) => {
      if (!n1 && !n2) return null;
      if (!n1) return n2;
      if (!n2) return n1;
      let node = new TreeNode(n1.val + n2.val);
      node.left = merge(n1.left, n2.left);
      node.right = merge(n1.right, n2.right);
      return node;
    };
    return printTree(merge(r1, r2));
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 2, 5], [2, 1, 3, null, 4, null, 7]]);
    cases.push([[], [1]]);
    for (let i = 0; i < 48; i++) cases.push([genRandTree(randInt(0, 10)), genRandTree(randInt(0, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 40)), genRandTree(randInt(10, 40))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(40, 100)), genRandTree(randInt(40, 100))]);
    return cases;
  }
},

// 20
{
  slug: 'binary-tree-inorder-traversal',
  title: 'Binary Tree Inorder Traversal',
  description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Stack', 'Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,null,2,3]', output: '[1,3,2]', explanation: 'Left, Root, Right inorder traversal.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Inorder DFS', content: 'Recursively traverse left subtree, visit root, recursively traverse right subtree.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const ans = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      ans.push(node.val);
      traverse(node.right);
    };
    traverse(root);
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, null, 2, 3]]);
    cases.push([[]]);
    cases.push([[1]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 100))]);
    return cases;
  }
},

// 21
{
  slug: 'binary-tree-preorder-traversal',
  title: 'Binary Tree Preorder Traversal',
  description: 'Given the root of a binary tree, return the preorder traversal of its nodes\' values.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Stack', 'Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,null,2,3]', output: '[1,2,3]', explanation: 'Root, Left, Right preorder traversal.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Preorder DFS', content: 'Visit root, recursively traverse left subtree, recursively traverse right subtree.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const ans = [];
    const traverse = (node) => {
      if (!node) return;
      ans.push(node.val);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(root);
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, null, 2, 3]]);
    cases.push([[]]);
    cases.push([[1]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 100))]);
    return cases;
  }
},

// 22
{
  slug: 'binary-tree-postorder-traversal',
  title: 'Binary Tree Postorder Traversal',
  description: 'Given the root of a binary tree, return the postorder traversal of its nodes\' values.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Stack', 'Tree', 'Depth-First Search', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,null,2,3]', output: '[3,2,1]', explanation: 'Left, Right, Root postorder traversal.' }],
  args: [{ name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' }],
  retType: { cpp: 'vector<int>', java: 'List<Integer>', py: 'List[int]' },
  hints: [{ title: 'Postorder DFS', content: 'Recursively traverse left subtree, recursively traverse right subtree, visit root.' }],
  jsSolution: (arr) => {
    let root = buildTree(arr);
    const ans = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      ans.push(node.val);
    };
    traverse(root);
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, null, 2, 3]]);
    cases.push([[]]);
    cases.push([[1]]);
    for (let i = 0; i < 47; i++) cases.push([genRandTree(randInt(1, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(10, 50))]);
    for (let i = 0; i < 50; i++) cases.push([genRandTree(randInt(50, 100))]);
    return cases;
  }
},

// 23
{
  slug: 'search-in-a-binary-search-tree',
  title: 'Search in a Binary Search Tree',
  description: 'Find the node in the BST that the node\'s value equals val and return the subtree rooted with that node. If such a node does not exist, return null.',
  difficulty: 'Easy',
  category: 'Trees',
  tags: ['Tree', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [1, 5000]. 1 <= Node.val <= 10^7. All values are unique. target val is an integer.',
  examples: [{ input: '[4,2,7,1,3], 2', output: '[2,1,3]', explanation: 'Subtree rooted at 2.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'val', cpp: 'int', java: 'int', py: 'val: int', js: 'val' }
  ],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'BST Search Property', content: 'If target val < node.val, search left subtree. If target val > node.val, search right subtree. Otherwise, return current node.' }],
  jsSolution: (arr, val) => {
    let root = buildTree(arr);
    let curr = root;
    while (curr) {
      if (val < curr.val) curr = curr.left;
      else if (val > curr.val) curr = curr.right;
      else break;
    }
    return printTree(curr);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 7, 1, 3], 2]);
    cases.push([[4, 2, 7, 1, 3], 5]);
    const gen = (n) => {
      const bst = genBST(n);
      const clean = bst.filter(x => x !== null);
      const target = Math.random() < 0.8 ? clean[randInt(0, clean.length - 1)] : randInt(-1000, 1000);
      return [bst, target];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 24
{
  slug: 'insert-into-a-binary-search-tree',
  title: 'Insert into a Binary Search Tree',
  description: 'You are given the root node of a binary search tree (BST) and a value to insert into the tree. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 10000]. -10^8 <= Node.val <= 10^8. All values are unique. -10^8 <= val <= 10^8. target val does not exist in the BST.',
  examples: [{ input: '[4,2,7,1,3], 5', output: '[4,2,7,1,3,5]', explanation: '5 is inserted to the left of 7.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'val', cpp: 'int', java: 'int', py: 'val: int', js: 'val' }
  ],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'BST Recursive Insert', content: 'Compare val with node.val. If smaller, recurse left. If larger, recurse right. Insert new node at first null position.' }],
  jsSolution: (arr, val) => {
    let root = buildTree(arr);
    const insert = (node) => {
      if (!node) return new TreeNode(val);
      if (val < node.val) node.left = insert(node.left);
      else node.right = insert(node.right);
      return node;
    };
    let res = insert(root);
    return printTree(res);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 7, 1, 3], 5]);
    cases.push([[], 5]);
    const gen = (n) => {
      const bst = genBST(n);
      const clean = bst.filter(x => x !== null);
      let target = randInt(-1000, 1000);
      while (clean.includes(target)) target = randInt(-1000, 1000);
      return [bst, target];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
},

// 25
{
  slug: 'delete-node-in-a-bst',
  title: 'Delete Node in a BST',
  description: 'Given a root node of a BST and a key, delete the node with the given key in the BST. Return the root node copy of the BST.',
  difficulty: 'Medium',
  category: 'Trees',
  tags: ['Tree', 'Binary Search Tree', 'Binary Tree'],
  constraints: 'The number of nodes in the tree is in the range [0, 10^4]. -10^5 <= Node.val <= 10^5. All Node.val are unique. BST is sorted. -10^5 <= key <= 10^5',
  examples: [{ input: '[5,3,6,2,4,null,7], 3', output: '[5,4,6,2,null,null,7]', explanation: '3 is deleted and replaced with 4.' }],
  args: [
    { name: 'root', cpp: 'TreeNode*', java: 'TreeNode', py: 'root: Optional[TreeNode]', js: 'root' },
    { name: 'key', cpp: 'int', java: 'int', py: 'key: int', js: 'key' }
  ],
  retType: { cpp: 'TreeNode*', java: 'TreeNode', py: 'Optional[TreeNode]' },
  hints: [{ title: 'Three Deletion Cases', content: 'If leaf, remove it. If one child, replace with child. If two children, find inorder successor (min of right subtree), copy successor val, and recursively delete successor.' }],
  jsSolution: (arr, key) => {
    let root = buildTree(arr);
    const getMin = (node) => {
      while (node.left) node = node.left;
      return node;
    };
    const delNode = (node, k) => {
      if (!node) return null;
      if (k < node.val) {
        node.left = delNode(node.left, k);
      } else if (k > node.val) {
        node.right = delNode(node.right, k);
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let temp = getMin(node.right);
        node.val = temp.val;
        node.right = delNode(node.right, temp.val);
      }
      return node;
    };
    let res = delNode(root, key);
    return printTree(res);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 3, 6, 2, 4, null, 7], 3]);
    cases.push([[5, 3, 6, 2, 4, null, 7], 0]);
    cases.push([[], 0]);
    const gen = (n) => {
      const bst = genBST(n);
      const clean = bst.filter(x => x !== null);
      const target = Math.random() < 0.8 && clean.length > 0 ? clean[randInt(0, clean.length - 1)] : randInt(-1000, 1000);
      return [bst, target];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 40)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(40, 100)));
    return cases;
  }
}
];
