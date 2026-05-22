// Linked List — Batch 1 (25 problems)
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
  slug: 'reverse-linked-list',
  title: 'Reverse Linked List',
  description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Recursion'],
  constraints: 'The number of nodes in the list is the range [0, 5000]. -5000 <= Node.val <= 5000',
  examples: [{ input: '[1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'The list is reversed.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Iterative Pointers', content: 'Maintain prev, curr, and next pointers. Move curr to prev and advance.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let prev = null, curr = head;
    while (curr) {
      let nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    return toArr(prev);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5]]);
    cases.push([[1, 2]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), -50, 50)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 100), -500, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(100, 500), -1000, 1000)]);
    return cases;
  }
},

// 2
{
  slug: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Recursion'],
  constraints: 'The number of nodes in both lists is in the range [0, 50]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,4], [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'The lists are merged in sorted order.' }],
  args: [
    { name: 'list1', cpp: 'ListNode*', java: 'ListNode', py: 'list1: Optional[ListNode]', js: 'list1' },
    { name: 'list2', cpp: 'ListNode*', java: 'ListNode', py: 'list2: Optional[ListNode]', js: 'list2' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Dummy Node', content: 'Create a dummy node and compare nodes from both lists, connecting the smaller node to your merged list.' }],
  jsSolution: (arr1, arr2) => {
    let l1 = toList(arr1), l2 = toList(arr2);
    let dummy = new ListNode(0);
    let curr = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) {
        curr.next = l1;
        l1 = l1.next;
      } else {
        curr.next = l2;
        l2 = l2.next;
      }
      curr = curr.next;
    }
    curr.next = l1 || l2;
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 4], [1, 3, 4]]);
    cases.push([[], []]);
    cases.push([[], [0]]);
    const genSorted = (n) => randArr(n, -50, 50).sort((a, b) => a - b);
    for (let i = 0; i < 47; i++) cases.push([genSorted(randInt(0, 10)), genSorted(randInt(0, 10))]);
    for (let i = 0; i < 50; i++) cases.push([genSorted(randInt(10, 30)), genSorted(randInt(10, 30))]);
    for (let i = 0; i < 50; i++) cases.push([genSorted(randInt(30, 50)), genSorted(randInt(30, 50))]);
    return cases;
  }
},

// 3
{
  slug: 'middle-of-the-linked-list',
  title: 'Middle of the Linked List',
  description: 'Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is in the range [1, 100]. 1 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,4,5]', output: '[3,4,5]', explanation: 'The middle node of the list is 3.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Fast and Slow Pointers', content: 'Advance slow pointer by 1 and fast pointer by 2. When fast reaches end, slow will be in the middle.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let slow = head, fast = head;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    return toArr(slow);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5]]);
    cases.push([[1, 2, 3, 4, 5, 6]]);
    cases.push([[1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 100), 1, 100)]);
    return cases;
  }
},

// 4
{
  slug: 'remove-linked-list-elements',
  title: 'Remove Linked List Elements',
  description: 'Given the head of a linked list and an integer val, remove all the nodes of the linked list that has Node.val == val, and return the new head.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Recursion'],
  constraints: 'The number of nodes in the list is in the range [0, 10^4]. 1 <= Node.val <= 50, 0 <= val <= 50',
  examples: [{ input: '[1,2,6,3,4,5,6], 6', output: '[1,2,3,4,5]', explanation: 'All nodes with value 6 are removed.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'val', cpp: 'int', java: 'int', py: 'val: int', js: 'val' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Sentinel Node', content: 'Create a dummy/sentinel node pointing to head to handle deletions at the beginning easily.' }],
  jsSolution: (arr, val) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    while (curr.next) {
      if (curr.next.val === val) {
        curr.next = curr.next.next;
      } else {
        curr = curr.next;
      }
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 6, 3, 4, 5, 6], 6]);
    cases.push([[], 1]);
    cases.push([[7, 7, 7, 7], 7]);
    const gen = (n) => {
      const arr = randArr(n, 1, 10);
      const val = randInt(1, 10);
      return [arr, val];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 15)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(15, 80)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(80, 300)));
    return cases;
  }
},

// 5
{
  slug: 'remove-duplicates-from-sorted-list',
  title: 'Remove Duplicates from Sorted List',
  description: 'Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is in the range [0, 300]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,1,2]', output: '[1,2]', explanation: '1 appears once now.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Compare neighbors', content: 'Compare curr.val with curr.next.val. If equal, bypass curr.next. Otherwise advance curr.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let curr = head;
    while (curr && curr.next) {
      if (curr.val === curr.next.val) {
        curr.next = curr.next.next;
      } else {
        curr = curr.next;
      }
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 1, 2]]);
    cases.push([[1, 1, 2, 3, 3]]);
    cases.push([[]]);
    const genSortedDups = (n) => {
      const arr = randArr(n, -50, 50).sort((a, b) => a - b);
      return [arr];
    };
    for (let i = 0; i < 47; i++) cases.push(genSortedDups(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(genSortedDups(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(genSortedDups(randInt(50, 200)));
    return cases;
  }
},

// 6
{
  slug: 'remove-duplicates-from-sorted-list-ii',
  title: 'Remove Duplicates from Sorted List II',
  description: 'Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is in the range [0, 300]. -100 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,3,4,4,5]', output: '[1,2,5]', explanation: 'Distinct nodes are returned.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Sentinel + Subloop', content: 'Use a sentinel node. For each node, if it has duplicates, run a subloop to skip all nodes with that value.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    while (prev.next && prev.next.next) {
      if (prev.next.val === prev.next.next.val) {
        let val = prev.next.val;
        while (prev.next && prev.next.val === val) {
          prev.next = prev.next.next;
        }
      } else {
        prev = prev.next;
      }
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 3, 4, 4, 5]]);
    cases.push([[1, 1, 1, 2, 3]]);
    cases.push([[]]);
    const gen = (n) => {
      const arr = randArr(n, -50, 50).sort((a, b) => a - b);
      return [arr];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 7
{
  slug: 'remove-nth-node-from-end-of-list',
  title: 'Remove Nth Node From End of List',
  description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is sz. 1 <= sz <= 30. 0 <= Node.val <= 100, 1 <= n <= sz',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[1,2,3,5]', explanation: '2nd node from end (4) is removed.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Two Pointer Gap', content: 'Move fast pointer n steps ahead. Then move both fast and slow together. Slow will end up just before the node to be deleted.' }],
  jsSolution: (arr, n) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let first = dummy, second = dummy;
    for (let i = 0; i <= n; i++) {
      first = first.next;
    }
    while (first) {
      first = first.next;
      second = second.next;
    }
    second.next = second.next.next;
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]);
    cases.push([[1], 1]);
    cases.push([[1, 2], 1]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(1, n);
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 20)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(20, 30)));
    return cases;
  }
},

// 8
{
  slug: 'palindrome-linked-list',
  title: 'Palindrome Linked List',
  description: 'Given the head of a singly linked list, return true if it is a palindrome or false otherwise.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'],
  constraints: 'The number of nodes in the list is in the range [1, 10^5]. 0 <= Node.val <= 9',
  examples: [{ input: '[1,2,2,1]', output: 'true', explanation: 'The list is symmetric.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'bool', java: 'boolean', py: 'bool' },
  hints: [{ title: 'Middle + Reverse', content: 'Find middle, reverse second half, and compare it element-by-element with the first half.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    if (!head || !head.next) return true;
    let slow = head, fast = head;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    let prev = null, curr = slow;
    while (curr) {
      let nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    let p1 = head, p2 = prev;
    while (p2) {
      if (p1.val !== p2.val) return false;
      p1 = p1.next;
      p2 = p2.next;
    }
    return true;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 2, 1]]);
    cases.push([[1, 2]]);
    cases.push([[1]]);
    const gen = (n) => {
      const half = randArr(Math.floor(n / 2), 0, 9);
      const isPal = Math.random() < 0.5;
      const secondHalf = isPal ? [...half].reverse() : randArr(Math.floor(n / 2), 0, 9);
      const middle = n % 2 === 1 ? [randInt(0, 9)] : [];
      return [[...half, ...middle, ...secondHalf]];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 9
{
  slug: 'odd-even-linked-list',
  title: 'Odd Even Linked List',
  description: 'Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the linked list is in the range [0, 10^4]. -10^6 <= Node.val <= 10^6',
  examples: [{ input: '[1,2,3,4,5]', output: '[1,3,5,2,4]', explanation: 'Odd indexed nodes grouped first, then even ones.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Two chains', content: 'Maintain odd and even pointers. odd.next = even.next, odd = odd.next; even.next = odd.next, even = even.next. Connect end of odd to head of even.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    if (!head || !head.next) return toArr(head);
    let odd = head, even = head.next, evenHead = even;
    while (even && even.next) {
      odd.next = even.next;
      odd = odd.next;
      even.next = odd.next;
      even = even.next;
    }
    odd.next = evenHead;
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5]]);
    cases.push([[2, 1, 3, 5, 6, 4, 7]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), -500, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), -1000, 1000)]);
    return cases;
  }
},

// 10
{
  slug: 'swapping-nodes-in-a-linked-list',
  title: 'Swapping Nodes in a Linked List',
  description: 'You are given the head of a linked list, and an integer k. Return the head of the linked list after swapping the values of the kth node from the beginning and the kth node from the end (the list is 1-indexed).',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is n. 1 <= k <= n <= 10^5. 0 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[1,4,3,2,5]', explanation: '2nd node (2) and 2nd node from end (4) are swapped.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Two Pointers Gap Swapping', content: 'Find kth node from start by walking k-1 steps. Then use second pointer starting at head and move both together to find kth from end.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    let first = head;
    for (let i = 1; i < k; i++) first = first.next;
    let slow = head, fast = first;
    while (fast.next) {
      slow = slow.next;
      fast = fast.next;
    }
    let temp = first.val;
    first.val = slow.val;
    slow.val = temp;
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]);
    cases.push([[7, 9, 6, 6, 7, 8, 3, 0, 9, 5], 5]);
    cases.push([[1], 1]);
    const gen = (n) => {
      const arr = randArr(n, 0, 100);
      const k = randInt(1, n);
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 11
{
  slug: 'delete-the-middle-node-of-a-linked-list',
  title: 'Delete the Middle Node of a Linked List',
  description: 'You are given the head of a linked list. Delete the middle node, and return the head of the modified linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is in the range [1, 10^5]. 1 <= Node.val <= 10^5',
  examples: [{ input: '[1,3,4,7,1,2,6]', output: '[1,3,4,1,2,6]', explanation: 'Middle node (7) is deleted.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Fast/Slow Pointer delete', content: 'Use fast and slow pointers, but track slow\'s previous node. Delete slow by pointing prev.next to slow.next.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    if (!head || !head.next) return [];
    let prev = null, slow = head, fast = head;
    while (fast && fast.next) {
      prev = slow;
      slow = slow.next;
      fast = fast.next.next;
    }
    prev.next = slow.next;
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 3, 4, 7, 1, 2, 6]]);
    cases.push([[1, 2, 3, 4]]);
    cases.push([[2, 1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), 1, 100)]);
    return cases;
  }
},

// 12
{
  slug: 'rotate-list',
  title: 'Rotate List',
  description: 'Given the head of a linked list, rotate the list to the right by k places.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is in the range [0, 500]. 0 <= k <= 2 * 10^9',
  examples: [{ input: '[1,2,3,4,5], 2', output: '[4,5,1,2,3]', explanation: 'Rotated 2 times.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Connect Ring', content: 'Find list length, connect tail to head to form circular list. Then walk len - (k % len) steps and break connection.' }],
  jsSolution: (arr, k) => {
    let head = toList(arr);
    if (!head || !head.next || k === 0) return toArr(head);
    let len = 1, curr = head;
    while (curr.next) {
      len++;
      curr = curr.next;
    }
    curr.next = head; // form cycle
    let breakIdx = len - (k % len);
    for (let i = 0; i < breakIdx; i++) {
      curr = curr.next;
    }
    let newHead = curr.next;
    curr.next = null; // break cycle
    return toArr(newHead);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2]);
    cases.push([[0, 1, 2], 4]);
    cases.push([[], 0]);
    const gen = (n) => {
      const arr = randArr(n, 1, 100);
      const k = randInt(0, 1000);
      return [arr, k];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 13
{
  slug: 'partition-list',
  title: 'Partition List',
  description: 'Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x. Preserve original relative order of nodes.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers'],
  constraints: 'The number of nodes in the list is in the range [0, 200]. -100 <= Node.val <= 100, -200 <= x <= 200',
  examples: [{ input: '[1,4,3,2,5,2], 3', output: '[1,2,2,4,3,5]', explanation: 'All nodes < 3 are partitioned before nodes >= 3.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Two Dummy Lists', content: 'Create two separate lists: one for nodes < x and one for nodes >= x. Combine them at the end.' }],
  jsSolution: (arr, x) => {
    let head = toList(arr);
    let beforeDummy = new ListNode(0), afterDummy = new ListNode(0);
    let b = beforeDummy, a = afterDummy;
    let curr = head;
    while (curr) {
      if (curr.val < x) {
        b.next = curr;
        b = b.next;
      } else {
        a.next = curr;
        a = a.next;
      }
      curr = curr.next;
    }
    a.next = null;
    b.next = afterDummy.next;
    return toArr(beforeDummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 4, 3, 2, 5, 2], 3]);
    cases.push([[2, 1], 2]);
    cases.push([[], 0]);
    const gen = (n) => {
      const arr = randArr(n, -50, 50);
      const x = randInt(-60, 60);
      return [arr, x];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 14
{
  slug: 'merge-nodes-in-between-zeros',
  title: 'Merge Nodes in Between Zeros',
  description: 'You are given the head of a linked list, which contains a series of integers separated by 0s. The beginning and end of the linked list are guaranteed to have Node.val == 0. Merge all consecutive nodes between 0s into a single node with their sum, and remove all 0s.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Simulation'],
  constraints: 'The number of nodes in the list is in the range [3, 2 * 10^5]. Node.val is 0 or 1 <= Node.val <= 1000. No two consecutive nodes have Node.val == 0.',
  examples: [{ input: '[0,3,1,0,4,5,2,0]', output: '[4,11]', explanation: '3+1=4, 4+5+2=11.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Sum nodes', content: 'Traverse the list. Maintain running sum. When 0 is encountered, write sum to active node and move pointer.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    let ptr = dummy;
    let curr = head.next, sum = 0;
    while (curr) {
      if (curr.val === 0) {
        ptr.next = new ListNode(sum);
        ptr = ptr.next;
        sum = 0;
      } else {
        sum += curr.val;
      }
      curr = curr.next;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[0, 3, 1, 0, 4, 5, 2, 0]]);
    cases.push([[0, 1, 0, 3, 0, 2, 2, 0]]);
    const genZeros = (n) => {
      const arr = [0];
      for (let i = 0; i < n; i++) {
        const subLen = randInt(1, 4);
        for (let j = 0; j < subLen; j++) arr.push(randInt(1, 10));
        arr.push(0);
      }
      return [arr];
    };
    for (let i = 0; i < 48; i++) cases.push(genZeros(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(genZeros(randInt(5, 15)));
    for (let i = 0; i < 50; i++) cases.push(genZeros(randInt(15, 40)));
    return cases;
  }
},

// 15
{
  slug: 'add-two-numbers',
  title: 'Add Two Numbers',
  description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Math', 'Recursion'],
  constraints: 'The number of nodes in each linked list is in the range [1, 100]. 0 <= Node.val <= 9. It is guaranteed that the list represents a number that does not have leading zeros, except the number 0 itself.',
  examples: [{ input: '[2,4,3], [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' }],
  args: [
    { name: 'l1', cpp: 'ListNode*', java: 'ListNode', py: 'l1: Optional[ListNode]', js: 'l1' },
    { name: 'l2', cpp: 'ListNode*', java: 'ListNode', py: 'l2: Optional[ListNode]', js: 'l2' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Carry over logic', content: 'Iterate both lists. val = l1.val + l2.val + carry. Record carry = Math.floor(val/10), digit = val % 10.' }],
  jsSolution: (arr1, arr2) => {
    let l1 = toList(arr1), l2 = toList(arr2);
    let dummy = new ListNode(0);
    let curr = dummy, carry = 0;
    while (l1 || l2 || carry) {
      let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
      carry = Math.floor(sum / 10);
      curr.next = new ListNode(sum % 10);
      curr = curr.next;
      if (l1) l1 = l1.next;
      if (l2) l2 = l2.next;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 4, 3], [5, 6, 4]]);
    cases.push([[0], [0]]);
    cases.push([[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]]);
    const genDigits = (n) => {
      const arr = Array.from({ length: n }, () => randInt(0, 9));
      if (arr[arr.length - 1] === 0 && n > 1) arr[arr.length - 1] = randInt(1, 9);
      return arr;
    };
    for (let i = 0; i < 47; i++) cases.push([genDigits(randInt(1, 5)), genDigits(randInt(1, 5))]);
    for (let i = 0; i < 50; i++) cases.push([genDigits(randInt(5, 15)), genDigits(randInt(5, 15))]);
    for (let i = 0; i < 50; i++) cases.push([genDigits(randInt(15, 40)), genDigits(randInt(15, 40))]);
    return cases;
  }
},

// 16
{
  slug: 'add-two-numbers-ii',
  title: 'Add Two Numbers II',
  description: 'You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first. Add the two numbers and return the sum as a linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Math', 'Stack'],
  constraints: 'The number of nodes in each linked list is in the range [1, 100]. 0 <= Node.val <= 9. It is guaranteed that the list represents a number that does not have leading zeros, except the number 0 itself.',
  examples: [{ input: '[7,2,4,3], [5,6,4]', output: '[7,8,0,7]', explanation: '7243 + 564 = 7807.' }],
  args: [
    { name: 'l1', cpp: 'ListNode*', java: 'ListNode', py: 'l1: Optional[ListNode]', js: 'l1' },
    { name: 'l2', cpp: 'ListNode*', java: 'ListNode', py: 'l2: Optional[ListNode]', js: 'l2' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Using Stacks', content: 'Push values of both lists into two stacks. Pop values to add them from least-significant digit, prepending new nodes to the result list.' }],
  jsSolution: (arr1, arr2) => {
    let s1 = [], s2 = [];
    let l1 = toList(arr1), l2 = toList(arr2);
    while (l1) { s1.push(l1.val); l1 = l1.next; }
    while (l2) { s2.push(l2.val); l2 = l2.next; }
    let head = null, carry = 0;
    while (s1.length || s2.length || carry) {
      let sum = (s1.length ? s1.pop() : 0) + (s2.length ? s2.pop() : 0) + carry;
      carry = Math.floor(sum / 10);
      let node = new ListNode(sum % 10);
      node.next = head;
      head = node;
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[7, 2, 4, 3], [5, 6, 4]]);
    cases.push([[0], [0]]);
    cases.push([[9, 9, 9], [1]]);
    const gen = (n) => {
      const arr = Array.from({ length: n }, () => randInt(0, 9));
      if (arr[0] === 0 && n > 1) arr[0] = randInt(1, 9);
      return arr;
    };
    for (let i = 0; i < 47; i++) cases.push([gen(randInt(1, 5)), gen(randInt(1, 5))]);
    for (let i = 0; i < 50; i++) cases.push([gen(randInt(5, 15)), gen(randInt(5, 15))]);
    for (let i = 0; i < 50; i++) cases.push([gen(randInt(15, 40)), gen(randInt(15, 40))]);
    return cases;
  }
},

// 17
{
  slug: 'double-a-number-represented-as-a-linked-list',
  title: 'Double a Number Represented as a Linked List',
  description: 'You are given the head of a non-empty linked list representing a non-negative integer without leading zeroes. Double the number and return the head of the modified linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Math', 'Stack'],
  constraints: 'The number of nodes in the list is in the range [1, 10^4]. 0 <= Node.val <= 9',
  examples: [{ input: '[1,8,9]', output: '[3,7,8]', explanation: '189 * 2 = 378.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Doubling from right', content: 'Either reverse first and double, or use recursion or a stack to double from right to left with carry.' }],
  jsSolution: (arr) => {
    let s = [];
    let head = toList(arr);
    let curr = head;
    while (curr) { s.push(curr.val); curr = curr.next; }
    let nextHead = null, carry = 0;
    while (s.length || carry) {
      let doubleVal = (s.length ? s.pop() * 2 : 0) + carry;
      carry = Math.floor(doubleVal / 10);
      let node = new ListNode(doubleVal % 10);
      node.next = nextHead;
      nextHead = node;
    }
    return toArr(nextHead);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 8, 9]]);
    cases.push([[9, 9, 9]]);
    cases.push([[0]]);
    const gen = (n) => {
      const arr = Array.from({ length: n }, () => randInt(0, 9));
      if (arr[0] === 0 && n > 1) arr[0] = randInt(1, 9);
      return [arr];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(1, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
},

// 18
{
  slug: 'reverse-linked-list-ii',
  title: 'Reverse Linked List II',
  description: 'Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the list is n. 1 <= n <= 500. -500 <= Node.val <= 500, 1 <= left <= right <= n',
  examples: [{ input: '[1,2,3,4,5], 2, 4', output: '[1,4,3,2,5]', explanation: 'Subsegment from index 2 to 4 is reversed.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'left', cpp: 'int', java: 'int', py: 'left: int', js: 'left' },
    { name: 'right', cpp: 'int', java: 'int', py: 'right: int', js: 'right' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Find Subsegment', content: 'Walk to index left-1, keep reference to pre-reversal node. Reverse right-left+1 nodes, then reconnect properly.' }],
  jsSolution: (arr, left, right) => {
    let head = toList(arr);
    if (!head || left === right) return toArr(head);
    let dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    for (let i = 1; i < left; i++) prev = prev.next;
    let curr = prev.next;
    for (let i = 0; i < right - left; i++) {
      let temp = curr.next;
      curr.next = temp.next;
      temp.next = prev.next;
      prev.next = temp;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4, 5], 2, 4]);
    cases.push([[5], 1, 1]);
    cases.push([[1, 2], 1, 2]);
    const gen = (n) => {
      const arr = randArr(n, -100, 100);
      const l = randInt(1, n);
      const r = randInt(l, n);
      return [arr, l, r];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 19
{
  slug: 'swap-nodes-in-pairs',
  title: 'Swap Nodes in Pairs',
  description: 'Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list\'s nodes.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Recursion'],
  constraints: 'The number of nodes in the list is in the range [0, 100]. 0 <= Node.val <= 100',
  examples: [{ input: '[1,2,3,4]', output: '[2,1,4,3]', explanation: 'Adjacent nodes are swapped.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Pairwise traversal', content: 'Maintain a dummy node pointing to head. For every pair, perform node swaps using pointers.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    while (curr.next && curr.next.next) {
      let first = curr.next;
      let second = curr.next.next;
      first.next = second.next;
      second.next = first;
      curr.next = second;
      curr = first;
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[1, 2, 3, 4]]);
    cases.push([[]]);
    cases.push([[1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 0, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 100), 0, 100)]);
    return cases;
  }
},

// 20
{
  slug: 'insert-greatest-common-divisors-in-linked-list',
  title: 'Insert Greatest Common Divisors in Linked List',
  description: 'Given the head of a linked list, insert a new node with a value equal to the greatest common divisor of adjacent nodes between them.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Math', 'Number Theory'],
  constraints: 'The number of nodes in the list is in the range [1, 5000]. 1 <= Node.val <= 1000',
  examples: [{ input: '[18,6,10,3]', output: '[18,6,6,2,10,1,3]', explanation: 'GCD(18,6)=6, GCD(6,10)=2, GCD(10,3)=1.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'GCD calculation', content: 'Walk through nodes. For adjacent node values a and b, compute gcd(a,b) and insert new node in between.' }],
  jsSolution: (arr) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    let head = toList(arr);
    if (!head || !head.next) return toArr(head);
    let curr = head;
    while (curr && curr.next) {
      let g = gcd(curr.val, curr.next.val);
      let node = new ListNode(g);
      node.next = curr.next;
      curr.next = node;
      curr = node.next;
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[18, 6, 10, 3]]);
    cases.push([[7]]);
    cases.push([[9, 9]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), 1, 1000)]);
    return cases;
  }
},

// 21
{
  slug: 'next-greater-node-in-linked-list',
  title: 'Next Greater Node In Linked List',
  description: 'Given the head of a linked list, return an integer array answer where answer[i] is the next greater node value of the ith node. If there is no next greater node, answer[i] = 0.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Array', 'Linked List', 'Stack', 'Monotonic Stack'],
  constraints: 'The number of nodes in the list is n. 1 <= n <= 10000. 1 <= Node.val <= 10^9',
  examples: [{ input: '[2,1,5]', output: '[5,5,0]', explanation: 'Next greater of 2 is 5, next greater of 1 is 5, next greater of 5 is 0.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]' },
  hints: [{ title: 'Monotonic Stack', content: 'Convert list to array. Use a monotonic stack to store indices and find next greater element in O(n).' }],
  jsSolution: (arr) => {
    const vals = [];
    let head = toList(arr);
    while (head) { vals.push(head.val); head = head.next; }
    const ans = Array(vals.length).fill(0);
    const stack = [];
    for (let i = 0; i < vals.length; i++) {
      while (stack.length && vals[stack[stack.length - 1]] < vals[i]) {
        ans[stack.pop()] = vals[i];
      }
      stack.push(i);
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[2, 1, 5]]);
    cases.push([[2, 7, 4, 3, 5]]);
    cases.push([[1, 7, 5, 1, 9, 2, 5, 1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), 1, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 200), 1, 1000)]);
    return cases;
  }
},

// 22
{
  slug: 'sort-list',
  title: 'Sort List',
  description: 'Given the head of a linked list, return the list after sorting it in O(n log n) time and O(1) memory complexity.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Divide and Conquer', 'Sorting', 'Merge Sort'],
  constraints: 'The number of nodes in the list is in the range [0, 5 * 10^4]. -10^5 <= Node.val <= 10^5',
  examples: [{ input: '[4,2,1,3]', output: '[1,2,3,4]', explanation: 'The list is sorted.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Merge Sort', content: 'Use merge sort. Use fast and slow pointers to split the list in half. Recursively sort each half, and merge them.' }],
  jsSolution: (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 2, 1, 3]]);
    cases.push([[-1, 5, 3, 4, 0]]);
    cases.push([[]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), -100, 100)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), -500, 500)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), -1000, 1000)]);
    return cases;
  }
},

// 23
{
  slug: 'delete-node-in-a-linked-list',
  title: 'Delete Node in a Linked List',
  description: 'Delete node from a singly linked list. You are only given access to the node to be deleted, not the head. (For our simulation, the node to delete is passed as its value target, and the list is modified).',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List'],
  constraints: 'The number of nodes in the given list is in the range [2, 1000]. -1000 <= Node.val <= 1000, all values are unique, target is guaranteed to be in the list and not the tail node.',
  examples: [{ input: '[4,5,1,9], 5', output: '[4,1,9]', explanation: 'Node 5 is deleted.' }],
  args: [
    { name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' },
    { name: 'nodeVal', cpp: 'int', java: 'int', py: 'nodeVal: int', js: 'nodeVal' }
  ],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Copy value next', content: 'Since we can\'t access prev node, copy next node\'s value to active node, and point next to next.next.' }],
  jsSolution: (arr, nodeVal) => {
    let head = toList(arr);
    let curr = head;
    while (curr) {
      if (curr.val === nodeVal) {
        if (curr.next) {
          curr.val = curr.next.val;
          curr.next = curr.next.next;
        }
        break;
      }
      curr = curr.next;
    }
    return toArr(head);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[4, 5, 1, 9], 5]);
    cases.push([[4, 5, 1, 9], 1]);
    const gen = (n) => {
      const set = new Set();
      while (set.size < n) set.add(randInt(-1000, 1000));
      const arr = [...set];
      const nodeVal = arr[randInt(0, n - 2)]; // not tail
      return [arr, nodeVal];
    };
    for (let i = 0; i < 48; i++) cases.push(gen(randInt(3, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 150)));
    return cases;
  }
},

// 24
{
  slug: 'remove-duplicates-from-an-unsorted-linked-list',
  title: 'Remove Duplicates from an Unsorted Linked List',
  description: 'Given the head of an unsorted linked list, return the list after removing all duplicate values, leaving only the first occurrence.',
  difficulty: 'Easy',
  category: 'Linked List',
  tags: ['Linked List', 'Hash Table'],
  constraints: 'The number of nodes in the list is in the range [1, 10^4]. -100 <= Node.val <= 100',
  examples: [{ input: '[3,4,3,2,4,2]', output: '[3,4,2]', explanation: 'All duplicate occurrences of values are deleted.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'ListNode*', java: 'ListNode', py: 'Optional[ListNode]' },
  hints: [{ title: 'Hash Set Track', content: 'Traverse list, maintain a Hash Set of seen values. If val is seen, skip node. Otherwise add to set.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let seen = new Set();
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy;
    while (curr.next) {
      if (seen.has(curr.next.val)) {
        curr.next = curr.next.next;
      } else {
        seen.add(curr.next.val);
        curr = curr.next;
      }
    }
    return toArr(dummy.next);
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 4, 3, 2, 4, 2]]);
    cases.push([[1, 2, 3]]);
    cases.push([[1, 1, 1]]);
    for (let i = 0; i < 47; i++) cases.push([randArr(randInt(1, 10), 1, 10)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(10, 50), -20, 20)]);
    for (let i = 0; i < 50; i++) cases.push([randArr(randInt(50, 150), -50, 50)]);
    return cases;
  }
},

// 25
{
  slug: 'maximum-twin-sum-of-a-linked-list',
  title: 'Maximum Twin Sum of a Linked List',
  description: 'In a linked list of size n (even), the ith node (0-indexed) is the twin of the (n-1-i)th node. The twin sum is the sum of a node and its twin. Return the maximum twin sum of the linked list.',
  difficulty: 'Medium',
  category: 'Linked List',
  tags: ['Linked List', 'Two Pointers', 'Stack'],
  constraints: 'The number of nodes in the list is an even integer in the range [2, 10^5]. 1 <= Node.val <= 10^5',
  examples: [{ input: '[5,4,2,1]', output: '6', explanation: 'Twin pairs are: 5 and 1 (sum 6), 4 and 2 (sum 6). Maximum twin sum is 6.' }],
  args: [{ name: 'head', cpp: 'ListNode*', java: 'ListNode', py: 'head: Optional[ListNode]', js: 'head' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Middle + Reverse', content: 'Find middle node. Reverse the second half. Walk both halves simultaneously, computing twin sum, and find maximum.' }],
  jsSolution: (arr) => {
    let head = toList(arr);
    let slow = head, fast = head;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    let prev = null, curr = slow;
    while (curr) {
      let nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    let p1 = head, p2 = prev, maxVal = 0;
    while (p2) {
      maxVal = Math.max(maxVal, p1.val + p2.val);
      p1 = p1.next;
      p2 = p2.next;
    }
    return maxVal;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[5, 4, 2, 1]]);
    cases.push([[4, 2, 2, 3]]);
    cases.push([[1, 100000]]);
    const genEven = (n) => {
      return [randArr(n * 2, 1, 1000)];
    };
    for (let i = 0; i < 47; i++) cases.push(genEven(randInt(1, 5)));
    for (let i = 0; i < 50; i++) cases.push(genEven(randInt(5, 20)));
    for (let i = 0; i < 50; i++) cases.push(genEven(randInt(20, 100)));
    return cases;
  }
}
];
