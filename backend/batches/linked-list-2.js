// Linked List — Batch 2 (25 problems)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

const toList = (arr) => {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
};

const toArr = (head) => {
  const arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }
  return arr;
};

export const problems = [

// 1
{
  slug: 'convert-binary-number-in-a-linked-list-to-integer',
  title: 'Convert Binary Number in a Linked List to Integer',
  description: 'Given head which is a reference node to a singly-linked list. The value of each node in the linked list is either 0 or 1. The linked list holds the binary representation of a number. Return the decimal value of the number in the linked list.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Math'],
  constraints: 'The Linked List is not empty. Number of nodes will not exceed 30. Each node\'s value is either 0 or 1.',
  examples: [{ input: '[1,0,1]', output: '5', explanation: 'Binary "101" is 5 in decimal.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Bit shift', content: 'Traverse the list, shifting the accumulated result by 1 to the left and adding the current node\'s value.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let num = 0;
    while (head) {
      num = (num << 1) | head.val;
      head = head.next;
    }
    return num;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 0, 1]]);
    cases.push([[0]]);
    cases.push([[1]]);
    cases.push([[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]);
    for (let i = 0; i < 46; i++) cases.push([randArr(randInt(1, 10), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 20), 0, 1)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(20, 30), 0, 1)]);
    return cases;
  }
},

// 2
{
  slug: 'split-linked-list-in-parts',
  title: 'Split Linked List in Parts',
  description: 'Given the head of a singly linked list and an integer k, split the linked list into k consecutive linked list parts. The length of each part should be as equal as possible.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is in the range [0, 1000]. 0 <= Node.val <= 1000, 1 <= k <= 50',
  examples: [{ input: '[1,2,3], 5', output: '[[1],[2],[3],[],[]]', explanation: 'The list is split into 5 parts.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'vector<ListNode*>', java: 'ListNode[]', py: 'List[Optional[ListNode]]' },
  hints: [{ title: 'Divide and modulo', content: 'Count total nodes N. Each part has N/k elements, with first N%k parts having an extra node.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    let curr = head, len = 0;
    while (curr) { len++; curr = curr.next; }
    let width = Math.floor(len / k), rem = len % k;
    let ans = [];
    curr = head;
    for (let i = 0; i < k; i++) {
      let partHead = curr;
      let partLen = width + (i < rem ? 1 : 0);
      for (let j = 0; j < partLen - 1; j++) {
        if (curr) curr = curr.next;
      }
      if (curr) {
        let nxt = curr.next;
        curr.next = null;
        curr = nxt;
      }
      ans.push(toArr(partHead));
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], 5]);
    cases.push([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3]);
    cases.push([[], 5]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(1, 15);
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 3
{
  slug: 'reorder-list',
  title: 'Reorder List',
  description: 'You are given the head of a singly linked-list L: L0 -> L1 -> ... -> Ln-1 -> Ln. Reorder the list to be on the form: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Stack'],
  constraints: 'The number of nodes in the list is in the range [1, 5000]. 1 <= Node.val <= 1000',
  examples: [{ input: '[1,2,3,4]', output: '[1,4,2,3]', explanation: 'Reordered list.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Three Steps', content: 'Find middle, reverse second half, and merge both halves alternately.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    if (!head || !head.next) return toArr(head);
    let slow = head, fast = head;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    let prev = null, curr = slow.next;
    slow.next = null;
    while (curr) {
      let nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    let first = head, second = prev;
    while (second) {
      let tmp1 = first.next, tmp2 = second.next;
      first.next = second;
      second.next = tmp1;
      first = tmp1;
      second = tmp2;
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4]]);
    cases.push([[1, 2, 3, 4, 5]]);
    cases.push([[1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), 1, 100)]);
    return cases;
  }
},

// 4
{
  slug: 'split-linked-list-into-odd-and-even-lists',
  title: 'Split Linked List into Odd and Even Lists',
  description: 'Given the head of a linked list, split it into two lists: one containing nodes with odd values, and the other containing nodes with even values. Keep their relative orders.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes is in the range [0, 5000]. -5000 <= Node.val <= 5000',
  examples: [{ input: '[1,2,3,4,5,6]', output: '[[1,3,5],[2,4,6]]', explanation: 'Odd and even values are split.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'vector<ListNode*>', java: 'ListNode[]', py: 'List[Optional[ListNode]]' },
  hints: [{ title: 'Two Dummy nodes', content: 'Traverse, appending odd values to one list, and even values to another.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let oddDummy = new ListNode(0), evenDummy = new ListNode(0);
    let o = oddDummy, e = evenDummy;
    let curr = head;
    while (curr) {
      if (curr.val % 2 !== 0) {
        o.next = curr;
        o = o.next;
      } else {
        e.next = curr;
        e = e.next;
      }
      curr = curr.next;
    }
    o.next = null;
    e.next = null;
    return [toArr(oddDummy.next), toArr(evenDummy.next)];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6]]);
    cases.push([[]]);
    cases.push([[2, 4, 6]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), -50, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), -200, 200)]);
    return cases;
  }
},

// 5
{
  slug: 'insert-node-at-specific-position',
  title: 'Insert Node at Specific Position',
  description: 'Given the head of a linked list, an integer val, and a 0-indexed position pos, insert a node with value val at position pos. If pos is greater than the length of the list, append it to the end.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is in the range [0, 1000]. -1000 <= Node.val <= 1000, 0 <= pos <= 1000',
  examples: [{ input: '[1,2,4], 3, 2', output: '[1,2,3,4]', explanation: '3 is inserted at index 2.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'val', cpp: 'int', java: 'int', py: 'val: int', js: 'val' },
    { name: 'pos', cpp: 'int', java: 'int', py: 'pos: int', js: 'pos' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Walk pos steps', content: 'Walk pos-1 steps from head, create node, insert, and update pointers.' }],
  jsSolution: (arr, val, pos) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    for (let i = 0; i < pos; i++) {
      if (!curr.next) break;
      curr = curr.next;
    }
    let node = new ListNode(val);
    node.next = curr.next;
    curr.next = node;
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 4], 3, 2]);
    cases.push([[], 5, 0]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100);
      const val = randInt(-100, 100);
      const pos = randInt(0, n + 2);
      return [arr, val, pos];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 6
{
  slug: 'delete-node-at-specific-position',
  title: 'Delete Node at Specific Position',
  description: 'Given the head of a linked list and a 0-indexed position pos, delete the node at position pos and return the head of the modified list.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is in the range [1, 1000]. -1000 <= Node.val <= 1000, 0 <= pos < N',
  examples: [{ input: '[1,2,3,4], 2', output: '[1,2,4]', explanation: 'Node at index 2 (3) is deleted.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'pos', cpp: 'int', java: 'int', py: 'pos: int', js: 'pos' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Dummy pointer', content: 'Use a dummy node to easily delete the head (pos = 0).' }],
  jsSolution: (arr, pos) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    for (let i = 0; i < pos; i++) {
      if (curr.next) curr = curr.next;
    }
    if (curr.next) {
      curr.next = curr.next.next;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4], 2]);
    cases.push([[5], 0]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100);
      const pos = randInt(0, n - 1);
      return [arr, pos];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 7
{
  slug: 'remove-nodes-from-linked-list',
  title: 'Remove Nodes From Linked List',
  description: 'Remove every node which has a node with a strictly greater value anywhere to the right side of it in the linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Stack', 'Recursion', 'Monotonic Stack'],
  constraints: 'The number of nodes in the list is in the range [1, 10^5]. 1 <= Node.val <= 10^5',
  examples: [{ input: '[5,2,13,3,8]', output: '[13,8]', explanation: '13 is greater than 5 and 2. 8 is greater than 3.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Reverse processing', content: 'Reverse the list, keep track of maximum value seen. Rebuild the list with nodes >= max value.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let prev = null, curr = head;
    while (curr) {
      let nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    let maxVal = 0, newHead = null;
    curr = prev;
    while (curr) {
      if (curr.val >= maxVal) {
        maxVal = curr.val;
        let node = new ListNode(curr.val);
        node.next = newHead;
        newHead = node;
      }
      curr = curr.next;
    }
    return toArr(newHead);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 2, 13, 3, 8]]);
    cases.push([[1, 1, 1, 1]]);
    cases.push([[10]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), 1, 1000)]);
    return cases;
  }
},

// 8
{
  slug: 'linked-list-components',
  title: 'Linked List Components',
  description: 'We are given head, the head node of a linked list containing unique integer values. We are also given the list nums, a subset of the values in the linked list. Return the number of connected components in nums, where two values are connected if they appear consecutively in the linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Hash Table'],
  constraints: 'The number of nodes in the list is N. 1 <= N <= 10000. 0 <= Node.val < N. All values in linked list are unique.',
  examples: [{ input: '[0,1,2,3], [0,1,3]', output: '2', explanation: '0 and 1 are connected. 3 is a separate component.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Hash set lookahead', content: 'Convert nums array to set. Count how many nodes in the list have their values in the set but their next nodes DO NOT (or represent end of list).' }],
  jsSolution: (arr, nums) => {
    let head = toList(arr);
    let set = new Set(nums);
    let count = 0, inComp = false;
    while (head) {
      if (set.has(head.val)) {
        if (!inComp) {
          inComp = true;
          count++;
        }
      } else {
        inComp = false;
      }
      head = head.next;
    }
    return count;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 1, 2, 3], [0, 1, 3]]);
    cases.push([[0, 1, 2, 3, 4], [0, 3, 1, 4]]);
    const gen = (n) => {
      const arr = Array.from({ length: n }, (_, i) => i);
      const setSize = randInt(1, n);
      const nums = [];
      const temp = [...arr];
      for (let i = 0; i < setSize; i++) {
        const idx = randInt(0, temp.length - 1);
        nums.push(temp.splice(idx, 1)[0]);
      }
      return [arr, nums];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 9
{
  slug: 'reverse-nodes-in-k-group',
  title: 'Reverse Nodes in k-Group',
  description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k, left-over nodes at the end should remain as they are.',
  difficulty: 'Hard',
  category: 'Linked List',
  tags: ['Linked List', 'Recursion'],
  constraints: 'The number of nodes in the list is sz. 1 <= sz <= 5000. 0 <= Node.val <= 1000, 1 <= k <= sz',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[2,1,4,3,5]', explanation: 'Nodes in groups of 2 are reversed.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Check subsegment', content: 'Check if there are at least k nodes left. If so, reverse k nodes, recursively reverse the rest, and link them.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    if (!head || k === 1) return toArr(head);
    let dummy = new ListNode(0);
    dummy.next = head;
    let ptr = dummy;
    while (ptr) {
      let tracker = ptr;
      for (let i = 0; i < k && tracker; i++) tracker = tracker.next;
      if (!tracker) break;
      let prev = tracker.next, curr = ptr.next;
      for (let i = 0; i < k; i++) {
        let nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
      }
      let temp = ptr.next;
      ptr.next = prev;
      ptr = temp;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]);
    cases.push([[1, 2, 3, 4, 5], 3]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(1, n);
      return [arr, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 10
{
  slug: 'intersection-of-two-linked-lists',
  title: 'Intersection of Two Linked Lists',
  description: 'Given the heads of two singly linked-lists headA and headB, return the value of the node at which the two lists intersect. If the two linked lists have no intersection at all, return -1.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Hash Table'],
  constraints: 'The number of nodes of listA is in the range [0, 5000]. The number of nodes of listB is in the range [0, 5000]. 1 <= Node.val <= 10^5.',
  examples: [{ input: '[4,1,8,4,5], [5,6,1,8,4,5], 2, 3', output: '8', explanation: 'Lists intersect at node value 8.' }],
  args: [
    { name: 'headA', cpp: 'ListNode*', java: 'ListNode', py: 'headA: Optional[ListNode]', js: 'headA' },
    { name: 'headB', cpp: 'ListNode*', java: 'ListNode', py: 'headB: Optional[ListNode]', js: 'headB' },
    { name: 'skipA', cpp: 'int', java: 'int', py: 'skipA: int', js: 'skipA' },
    { name: 'skipB', cpp: 'int', java: 'int', py: 'skipB: int', js: 'skipB' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Len diff alignment', content: 'Compute lengths, align starting points by walking diff elements, then walk together to find common node.' }],
  jsSolution: (arrA, arrB, skipA, skipB) => {
    if (skipA >= arrA.length || skipB >= arrB.length) return -1;
    // Intersection values must match!
    let intersectedVal = arrA[skipA];
    return intersectedVal !== undefined ? intersectedVal : -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3]);
    cases.push([[2, 6, 4], [1, 5], 3, 2]);
    const gen = (lenA, lenB, intersectLen) => {
      const common = randArr(intersectLen, 1, 1000);
      const listA = [...randArr(lenA - intersectLen, 1001, 2000), ...common];
      const listB = [...randArr(lenB - intersectLen, 2001, 3000), ...common];
      return [listA, listB, lenA - intersectLen, lenB - intersectLen];
    };
    for (let i = 0; i < 48; i++) {
      const hasInter = Math.random() < 0.8;
      if (hasInter) {
        cases.push(gen(randInt(3, 8), randInt(3, 8), randInt(1, 3)));
      } else {
        cases.push([randArr(randInt(2, 6), 1, 100), randArr(randInt(2, 6), 101, 200), 100, 100]);
      }
    }
    for (let i = 0; i < 50; i++) {
      const hasInter = Math.random() < 0.8;
      if (hasInter) {
        cases.push(gen(randInt(10, 30), randInt(10, 30), randInt(2, 8)));
      } else {
        cases.push([randArr(randInt(10, 30), 1, 100), randArr(randInt(10, 30), 101, 200), 100, 100]);
      }
    }
    for (let i = 0; i < 50; i++) {
      const hasInter = Math.random() < 0.8;
      if (hasInter) {
        cases.push(gen(randInt(30, 80), randInt(30, 80), randInt(5, 15)));
      } else {
        cases.push([randArr(randInt(30, 80), 1, 100), randArr(randInt(30, 80), 101, 200), 500, 500]);
      }
    }
    return cases;
  }
},

// 11
{
  slug: 'linked-list-cycle',
  title: 'Linked List Cycle',
  description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it. pos is used to denote the index of the node that tail\'s next pointer is connected to. Return true if there is a cycle, false otherwise.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Hash Table'],
  constraints: 'The number of nodes in the list is in the range [0, 10^4]. -10^5 <= Node.val <= 10^5, pos is -1 or a valid index in the list.',
  examples: [{ input: '[3,2,0,-4], 1', output: 'true', explanation: 'Tail connects to node at index 1.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'pos', cpp: 'int', java: 'int', py: 'pos: int', js: 'pos' }
  ],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Fast slow pointer cycle check', content: 'Move slow pointer by 1 and fast pointer by 2. If they meet, there is a cycle.' }],
  jsSolution: (arr, pos) => {
    return pos !== -1;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 2, 0, -4], 1]);
    cases.push([[1, 2], 0]);
    cases.push([[1], -1]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100);
      const isCycle = Math.random() < 0.5;
      const pos = isCycle ? randInt(0, n - 1) : -1;
      return [arr, pos];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 12
{
  slug: 'linked-list-cycle-ii',
  title: 'Linked List Cycle II',
  description: 'Given the head of a linked list, return the value of the node where the cycle begins. If there is no cycle, return -1.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Hash Table'],
  constraints: 'The number of nodes in the list is in the range [0, 10^4]. -10^5 <= Node.val <= 10^5, pos is -1 or a valid index in the list.',
  examples: [{ input: '[3,2,0,-4], 1', output: '2', explanation: 'The cycle starts at index 1, which has node value 2.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'pos', cpp: 'int', java: 'int', py: 'pos: int', js: 'pos' }
  ],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Intersection to start', content: 'Find meeting point using fast/slow. Reset slow to head, then advance both slow and fast by 1 until they meet again.' }],
  jsSolution: (arr, pos) => {
    if (pos === -1 || pos >= arr.length) return -1;
    return arr[pos];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 2, 0, -4], 1]);
    cases.push([[1, 2], 0]);
    cases.push([[1], -1]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100);
      const isCycle = Math.random() < 0.5;
      const pos = isCycle ? randInt(0, n - 1) : -1;
      return [arr, pos];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 13
{
  slug: 'delete-nodes-from-linked-list-present-in-array',
  title: 'Delete Nodes From Linked List Present in Array',
  description: 'You are given an array of integers nums and the head of a linked list. Return the head of the modified linked list after removing all nodes from the linked list that have a value that exists in nums.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Array', 'Hash Table', 'Linked List'],
  constraints: '1 <= nums.length <= 10^5, 1 <= nums[i] <= 10^5, The number of nodes in the list is in the range [1, 10^5]. 1 <= Node.val <= 10^5',
  examples: [{ input: '[1,2,3,4,5], [1,2,3]', output: '[4,5]', explanation: '1, 2 and 3 are deleted.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Fast Lookup Set', content: 'Convert nums into a Hash Set for O(1) lookups. Traverse the list, bypassing any matching nodes.' }],
  jsSolution: (arr, nums) => {
    let head = toList(arr);
    let set = new Set(nums);
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    while (curr.next) {
      if (set.has(curr.next.val)) {
        curr.next = curr.next.next;
      } else {
        curr = curr.next;
      }
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], [1, 2, 3]]);
    cases.push([[1, 2, 1, 2, 1, 2], [1]]);
    const gen = (n) => {
      const arr = randArr(n, 1, 50);
      const numsLen = randInt(1, 10);
      const nums = randArr(numsLen, 1, 50);
      return [arr, nums];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 14
{
  slug: 'remove-zero-sum-consecutive-nodes-from-linked-list',
  title: 'Remove Zero Sum Consecutive Nodes from Linked List',
  description: 'Given the head of a linked list, we repeatedly delete consecutive sequences of nodes that sum to 0 until there are no such sequences. After doing so, return the head of the final linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Hash Table'],
  constraints: 'The number of nodes in the list is N. 1 <= N <= 1000. -1000 <= Node.val <= 1000',
  examples: [{ input: '[1,2,-3,3,1]', output: '[3,1]', explanation: '1, 2, -3 sum to 0 and are deleted.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Prefix Sum Map', content: 'Compute prefix sums. If a prefix sum is seen again, it means nodes between the two occurrences sum to 0. Delete them.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let sum = 0;
    let map = new Map();
    let curr = dummy;
    while (curr) {
      sum += curr.val;
      map.set(sum, curr);
      curr = curr.next;
    }
    sum = 0;
    curr = dummy;
    while (curr) {
      sum += curr.val;
      curr.next = map.get(sum).next;
      curr = curr.next;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, -3, 3, 1]]);
    cases.push([[1, 2, 3, -3, -2]]);
    cases.push([[1, 3, -3, -1]]);
    const gen = (n) => {
      // mix positive and negative values that frequently sum to 0
      const arr = [];
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.4) {
          arr.push(randInt(-10, 10));
        } else {
          const val = randInt(1, 10);
          arr.push(val, -val);
        }
      }
      return [arr];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 40)));
    return cases;
  }
},

// 15
{
  slug: 'find-the-minimum-and-maximum-number-of-nodes-between-critical-points',
  title: 'Find the Minimum and Maximum Number of Nodes Between Critical Points',
  description: 'A critical point in a linked list is defined as either a local maxima or a local minima. Find the minimum and maximum distances between any two critical points. Return [-1, -1] if there are fewer than two critical points.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is N. 2 <= N <= 10^5. 1 <= Node.val <= 10^5',
  examples: [{ input: '[3,1,2,5,1,3,4,1]', output: '[1,3]', explanation: 'Local minima are 1 (idx 1), 1 (idx 4), 1 (idx 7). Local maxima are 5 (idx 3), 4 (idx 6). Critical points indices are [1, 3, 4, 6]. Min distance is 1 (3->4). Max is 5 (1->6).' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Track Indices', content: 'Traverse list, checking curr.val against prev.val and next.val. Keep track of indices of all critical points.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    if (!head || !head.next || !head.next.next) return [-1, -1];
    let prev = head;
    let curr = head.next;
    let idx = 1;
    let criticals = [];
    while (curr.next) {
      let nxt = curr.next;
      if ((curr.val > prev.val && curr.val > nxt.val) || (curr.val < prev.val && curr.val < nxt.val)) {
        criticals.push(idx);
      }
      prev = curr;
      curr = nxt;
      idx++;
    }
    if (criticals.length < 2) return [-1, -1];
    let minDist = Infinity;
    let maxDist = criticals[criticals.length - 1] - criticals[0];
    for (let i = 1; i < criticals.length; i++) {
      minDist = Math.min(minDist, criticals[i] - criticals[i - 1]);
    }
    return [minDist, maxDist];
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 1, 2, 5, 1, 3, 4, 1]]);
    cases.push([[1, 3, 2, 2, 3, 2, 2, 2, 7]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(3, 10), 1, 15)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), 1, 500)]);
    return cases;
  }
},

// 16
{
  slug: 'reverse-nodes-in-even-length-groups',
  title: 'Reverse Nodes in Even Length Groups',
  description: 'You are given the head of a linked list. The nodes are grouped in sequential groups of lengths 1, 2, 3, 4, ... Reverse the nodes in each group that has an even length, and return the modified list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is N. 1 <= N <= 10^5. 0 <= Node.val <= 10^5',
  examples: [{ input: '[5,2,6,3,9,1,7,3,8,4]', output: '[5,6,2,3,9,1,4,8,3,7]', explanation: 'Group sizes: 1, 2, 3, 4. Even groups of sizes 2 and 4 are reversed.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Count actual group nodes', content: 'For each target group size g, count the actual number of nodes available. If even, reverse them.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    if (!head || !head.next) return toArr(head);
    let prev = head;
    let groupLen = 2;
    while (prev.next) {
      let tracker = prev.next;
      let count = 0;
      while (tracker && count < groupLen) {
        tracker = tracker.next;
        count++;
      }
      if (count % 2 === 0) {
        let curr = prev.next;
        let p = tracker;
        for (let i = 0; i < count; i++) {
          let nxt = curr.next;
          curr.next = p;
          p = curr;
          curr = nxt;
        }
        let temp = prev.next;
        prev.next = p;
        prev = temp;
      } else {
        for (let i = 0; i < count; i++) {
          prev = prev.next;
        }
      }
      groupLen++;
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 2, 6, 3, 9, 1, 7, 3, 8, 4]]);
    cases.push([[1, 1, 0, 6]]);
    for (let i = 0; i < 48; i++) cases.push([randArr(randInt(1, 15), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(15, 60), 1, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(60, 200), 1, 1000)]);
    return cases;
  }
},

// 17
{
  slug: 'rotate-list-left',
  title: 'Rotate List Left',
  description: 'Given the head of a linked list, rotate the list to the left by k places.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is N. 0 <= N <= 500. 0 <= k <= 10^9',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[3,4,5,1,2]', explanation: 'Rotated left by 2 positions.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Connect and Break', content: 'Form a circular list, walk k % N steps, and break the cycle to form new head.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    if (!head || !head.next || k === 0) return toArr(head);
    let len = 1, curr = head;
    while (curr.next) {
      len++;
      curr = curr.next;
    }
    curr.next = head; // form cycle
    let step = k % len;
    for (let i = 0; i < step; i++) {
      curr = curr.next;
    }
    let newHead = curr.next;
    curr.next = null; // break cycle
    return toArr(newHead);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]);
    cases.push([[1, 2, 3, 4, 5], 7]);
    cases.push([[], 3]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(0, 1000);
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 18
{
  slug: 'add-one-to-a-number-represented-as-linked-list',
  title: 'Add One to a Number Represented as Linked List',
  description: 'A number is represented as a singly linked list where each node contains a single digit. Add 1 to the number and return the head of the modified list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Math'],
  constraints: 'The number of nodes is in the range [1, 1000]. 0 <= Node.val <= 9',
  examples: [{ input: '[4,5,6]', output: '[4,5,7]', explanation: '456 + 1 = 457.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Reverse Add Reverse', content: 'Reverse the list, add 1 with carry propagation, then reverse the list again.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let prev = null, curr = head;
    while (curr) {
      let nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    let carry = 1;
    curr = prev;
    let tail = null;
    while (curr) {
      let val = curr.val + carry;
      curr.val = val % 10;
      carry = Math.floor(val / 10);
      tail = curr;
      curr = curr.next;
    }
    if (carry) {
      tail.next = new ListNode(carry);
    }
    let revPrev = null, revCurr = prev;
    while (revCurr) {
      let nxt = revCurr.next;
      revCurr.next = revPrev;
      revPrev = revCurr;
      revCurr = nxt;
    }
    return toArr(revPrev);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 5, 6]]);
    cases.push([[9, 9, 9]]);
    cases.push([[0]]);
    const gen = (n) => {
      const arr = Array.from({ length: n }, () => randInt(0, 9));
      if (arr[0] === 0 && n > 1) arr[0] = randInt(1, 9);
      return [arr];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 19
{
  slug: 'sort-circular-singly-linked-list',
  title: 'Sort Circular Singly Linked List',
  description: 'Given the head of a circular singly linked list, return the list after sorting it in ascending order (simulated as array outputs).',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Sorting'],
  constraints: 'The number of nodes in the list is N. 0 <= N <= 2000. -1000 <= Node.val <= 1000',
  examples: [{ input: '[4,2,1,3]', output: '[1,2,3,4]', explanation: 'Sorted circular list represented as array.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Sorting list values', content: 'Extract values, sort them, and reconstruct sorted linked list.' }],
  jsSolution: (arr) => {
    return [...arr].sort((a, b) => a - b);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 1, 3]]);
    cases.push([[]]);
    cases.push([[5]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), -200, 200)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), -500, 500)]);
    return cases;
  }
},

// 20
{
  slug: 'merge-k-sorted-lists',
  title: 'Merge k Sorted Lists',
  description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
  difficulty: 'Hard',
  category: 'Linked List',
  tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
  constraints: 'k == lists.length, 0 <= k <= 10^4, 0 <= lists[i].length <= 500, -10^4 <= lists[i][j] <= 10^4, lists[i] is sorted in ascending order.',
  examples: [{ input: '[[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'All k sorted lists are merged.' }],
  args: [{ name: 'lists', cpp: 'vector<ListNode*>', java: 'ListNode[]', py: 'lists: List[Optional[ListNode]]', js: 'lists' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Heap / Divide and Conquer', content: 'Combine lists pair-by-pair recursively (Divide and Conquer) or push head of each list to a Min-Heap.' }],
  jsSolution: (lists) => {
    const arr = [];
    for (const list of lists) {
      for (const val of list) arr.push(val);
    }
    return arr.sort((a, b) => a - b);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[[1, 4, 5], [1, 3, 4], [2, 6]]]);
    cases.push([[[], []]]);
    cases.push([[]]);
    const gen = (k, n) => {
      const lists = [];
      for (let i = 0; i < k; i++) {
        lists.push(randArr(randInt(0, n), -100, 100).sort((a, b) => a - b));
      }
      return [lists];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 5), randInt(0, 5)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(5, 15), randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 30), randInt(15, 30)));
    return cases;
  }
},

// 21
{
  slug: 'swap-kth-node-from-beginning-with-kth-node-from-end',
  title: 'Swap Kth Node From Beginning with Kth Node From End',
  description: 'Given the head of a linked list and an integer k, swap the kth node from the beginning with the kth node from the end. Swap nodes themselves, not just their values.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is N. 1 <= k <= N <= 10^5. 0 <= Node.val <= 10^5',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[1,4,3,2,5]', explanation: '2nd node from start (2) and 2nd from end (4) are swapped.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Track Predecessors', content: 'Find kth from beginning and kth from end, and track their previous nodes to reconstruct pointers correctly during swap.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    let len = arr.length;
    if (k > len) return arr;
    let firstIdx = k - 1;
    let secondIdx = len - k;
    if (firstIdx === secondIdx) return arr;
    let tempVal = arr[firstIdx];
    arr[firstIdx] = arr[secondIdx];
    arr[secondIdx] = tempVal;
    return arr;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]);
    cases.push([[7, 9, 6, 6, 7], 1]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(1, n);
      return [arr, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 22
{
  slug: 'copy-list-with-random-pointer',
  title: 'Copy List with Random Pointer',
  description: 'A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list. Return the copied list represented as node values and random indexes.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Hash Table', 'Linked List'],
  constraints: '0 <= n <= 1000, -10^4 <= Node.val <= 10^4, random_index is -1 or index of pointing node.',
  examples: [{ input: '[7,8,9], [-1,0,0]', output: '[[7,-1],[8,0],[9,0]]', explanation: 'Deep copy of the list with random indices.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'randoms', cpp: 'vector<int>', java: 'int[]', py: 'randoms: List[int]', js: 'randoms' }
  ],
  retType: { cpp: 'vector<vector<int>>', java: 'int[][]', py: 'List[List[int]]' },
  hints: [{ title: 'Hash Map Clone', content: 'Use a Hash Map to map original nodes to their cloned copies, then establish random pointers using the map.' }],
  jsSolution: (arr, randoms) => {
    const ans = [];
    for (let i = 0; i < arr.length; i++) {
      ans.push([arr[i], randoms[i]]);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[7, 8, 9], [-1, 0, 0]]);
    cases.push([[1, 2], [1, -1]]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100);
      const randoms = Array.from({ length: n }, () => randInt(-1, n - 1));
      return [arr, randoms];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 23
{
  slug: 'insert-into-a-sorted-linked-list',
  title: 'Insert Into a Sorted Linked List',
  description: 'Given the head of a sorted linked list in ascending order and a value, insert a new node with this value such that the list remains sorted.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is in the range [0, 5000]. -5000 <= Node.val <= 5000',
  examples: [{ input: '[1,3,4,5], 2', output: '[1,2,3,4,5]', explanation: '2 is inserted maintaining sorted order.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'val', cpp: 'int', java: 'int', py: 'val: int', js: 'val' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Compare nodes', content: 'Walk list until you find a node whose next node has val >= input val. Insert new node there.' }],
  jsSolution: (arr, val) => {
    let head = toList(arr);
    let node = new ListNode(val);
    if (!head) return [val];
    if (val < head.val) {
      node.next = head;
      return toArr(node);
    }
    let curr = head;
    while (curr.next && curr.next.val < val) {
      curr = curr.next;
    }
    node.next = curr.next;
    curr.next = node;
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 4, 5], 2]);
    cases.push([[], 5]);
    cases.push([[1, 2, 3], 0]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100).sort((a, b) => a - b);
      const val = randInt(-120, 120);
      return [arr, val];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 24
{
  slug: 'reverse-alternating-k-nodes-in-a-linked-list',
  title: 'Reverse Alternating k Nodes in a Linked List',
  description: 'Given a linked list, reverse alternating groups of k nodes. First reverse k nodes, then skip k nodes, then reverse k nodes, and so on.',
  difficulty: 'Hard',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is N. 1 <= k <= N <= 10^5. 0 <= Node.val <= 10^5',
  examples: [{ input: '[1,2,3,4,5,6,7,8,9,10], 2', output: '[2,1,3,4,6,5,7,8,10,9]', explanation: 'Groups of 2 are alternately reversed.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Recursive skipping', content: 'Reverse k nodes. Link last reversed node to the (k+1)-th node. Skip k nodes, and recursively call on the rest.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    if (!head || k <= 1) return toArr(head);
    const helper = (node, revFlag) => {
      if (!node) return null;
      let curr = node, prev = null, nxt = null;
      let count = 0;
      if (revFlag) {
        while (curr && count < k) {
          nxt = curr.next;
          curr.next = prev;
          prev = curr;
          curr = nxt;
          count++;
        }
        if (node) node.next = helper(curr, false);
        return prev;
      } else {
        while (curr && count < k - 1) {
          curr = curr.next;
          count++;
        }
        if (curr) curr.next = helper(curr.next, true);
        return node;
      }
    };
    let res = helper(head, true);
    return toArr(res);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2]);
    cases.push([[1, 2, 3, 4], 4]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(1, n);
      return [arr, k];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 25
{
  slug: 'add-multiples-to-linked-list-elements',
  title: 'Add Multiples to Linked List Elements',
  description: 'Given the head of a linked list and a multiplier mult, multiply each node value by mult, and return the modified list.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is N. 0 <= N <= 5000. -1000 <= Node.val <= 1000, 0 <= mult <= 100',
  examples: [{ input: '[1,2,3], 5', output: '[5,10,15]', explanation: 'Each element multiplied by 5.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'mult', cpp: 'int', java: 'int', py: 'mult: int', js: 'mult' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Linear multiplication', content: 'Traverse list, multiplying each node value by mult.' }],
  jsSolution: (arr, mult) => {
    let head = toList(arr);
    let curr = head;
    while (curr) {
      curr.val *= mult;
      curr = curr.next;
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3], 5]);
    cases.push([[], 10]);
    const gen = (n) => {
      const arr = randArr(n, -50, 50);
      const mult = randInt(0, 10);
      return [arr, mult];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(0, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
}
];
