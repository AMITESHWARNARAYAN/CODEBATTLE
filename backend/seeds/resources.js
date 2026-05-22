import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Resource from '../models/Resource.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${dirname(__dirname)}/.env` });

const resources = [
  // ============ LEARNING PATHS ============
  {
    type: 'learning-path',
    title: 'Striver\'s A2Z DSA Course',
    description: 'Complete Data Structures and Algorithms course from basics to advanced. Learn everything you need for placements and interviews.',
    category: 'DSA',
    difficulty: 'All Levels',
    topics: ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking'],
    duration: '400+ problems',
    author: 'Striver (Raj Vikramaditya)',
    icon: 'Brain',
    color: 'orange',
    order: 1,
    tags: ['DSA', 'Complete Course', 'Beginner Friendly', 'Interview Prep'],
    metadata: {
      sections: [
        {
          title: 'Learn the Basics',
          description: 'Get started with programming basics, patterns, and basic recursion',
          problems: [
            { id: 'basics-1', title: 'User Input / Output', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'basics-2', title: 'Data Types', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'basics-3', title: 'If Else statements', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'basics-4', title: 'Switch Statement', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'basics-5', title: 'What are arrays, strings', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'basics-6', title: 'For loops', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'basics-7', title: 'While loops', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'basics-8', title: 'Functions (Pass by Reference and Value)', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'basics-9', title: 'Time Complexity', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' }
          ]
        },
        {
          title: 'Learn Important Sorting Techniques',
          description: 'Selection Sort, Bubble Sort, Insertion Sort, Merge Sort, Quick Sort, and more',
          problems: [
            { id: 'sort-1', title: 'Selection Sort', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'sort-2', title: 'Bubble Sort', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'sort-3', title: 'Insertion Sort', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'sort-4', title: 'Merge Sort', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'sort-5', title: 'Recursive Bubble Sort', difficulty: 'Medium', platform: 'CodeBattle', url: '/problems' },
            { id: 'sort-6', title: 'Recursive Insertion Sort', difficulty: 'Medium', platform: 'CodeBattle', url: '/problems' },
            { id: 'sort-7', title: 'Quick Sort', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com' }
          ]
        },
        {
          title: 'Solve Problems on Arrays [Easy -> Medium -> Hard]',
          description: 'Master array manipulation, two pointers, sliding window, and more',
          problems: [
            { id: 'array-1', title: 'Largest Element in Array', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'array-2', title: 'Second Largest Element', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'array-3', title: 'Check if Array is Sorted', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'array-4', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array' },
            { id: 'array-5', title: 'Left Rotate an Array by One', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'array-6', title: 'Rotate Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/rotate-array' },
            { id: 'array-7', title: 'Move Zeros to End', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/move-zeroes' },
            { id: 'array-8', title: 'Linear Search', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'array-9', title: 'Union of Two Sorted Arrays', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'array-10', title: 'Find Missing Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/missing-number' },
            { id: 'array-11', title: 'Maximum Consecutive Ones', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/max-consecutive-ones' },
            { id: 'array-12', title: 'Single Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/single-number' },
            { id: 'array-13', title: 'Longest Subarray with Sum K', difficulty: 'Medium', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'array-14', title: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum' },
            { id: 'array-15', title: 'Sort Colors', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-colors' },
            { id: 'array-16', title: 'Majority Element', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/majority-element' },
            { id: 'array-17', title: 'Maximum Subarray (Kadane\'s Algorithm)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray' },
            { id: 'array-18', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
            { id: 'array-19', title: 'Rearrange Array Elements by Sign', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com' },
            { id: 'array-20', title: 'Next Permutation', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/next-permutation' },
            { id: 'array-21', title: 'Leaders in an Array', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'array-22', title: 'Longest Consecutive Sequence', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-consecutive-sequence' },
            { id: 'array-23', title: 'Set Matrix Zeroes', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/set-matrix-zeroes' },
            { id: 'array-24', title: 'Rotate Image', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/rotate-image' },
            { id: 'array-25', title: 'Spiral Matrix', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/spiral-matrix' },
            { id: 'array-26', title: 'Pascal\'s Triangle', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/pascals-triangle' },
            { id: 'array-27', title: '3Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/3sum' },
            { id: 'array-28', title: '4Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/4sum' },
            { id: 'array-29', title: 'Count Subarrays with Given XOR', difficulty: 'Hard', platform: 'CodeBattle', url: '/problems' },
            { id: 'array-30', title: 'Merge Overlapping Intervals', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-intervals' }
          ]
        },
        {
          title: 'Binary Search [1D, 2D Arrays, Search Space]',
          description: 'Master binary search in all its forms',
          problems: [
            { id: 'bs-1', title: 'Binary Search', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-search' },
            { id: 'bs-2', title: 'Lower Bound', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'bs-3', title: 'Upper Bound', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'bs-4', title: 'Search Insert Position', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-insert-position' },
            { id: 'bs-5', title: 'Find First and Last Position', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array' },
            { id: 'bs-6', title: 'Count Occurrences', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'bs-7', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array' },
            { id: 'bs-8', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array' },
            { id: 'bs-9', title: 'Find Peak Element', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-peak-element' },
            { id: 'bs-10', title: 'Square Root', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/sqrtx' },
            { id: 'bs-11', title: 'Koko Eating Bananas', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/koko-eating-bananas' },
            { id: 'bs-12', title: 'Minimum Days to Make M Bouquets', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets' },
            { id: 'bs-13', title: 'Split Array Largest Sum', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/split-array-largest-sum' },
            { id: 'bs-14', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays' }
          ]
        },
        {
          title: 'Strings [Basic and Medium]',
          description: 'Learn string manipulation, pattern matching, and string algorithms',
          problems: [
            { id: 'str-1', title: 'Remove Outermost Parentheses', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/remove-outermost-parentheses' },
            { id: 'str-2', title: 'Reverse Words in a String', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-words-in-a-string' },
            { id: 'str-3', title: 'Largest Odd Number in String', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/largest-odd-number-in-string' },
            { id: 'str-4', title: 'Longest Common Prefix', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-prefix' },
            { id: 'str-5', title: 'Isomorphic Strings', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/isomorphic-strings' },
            { id: 'str-6', title: 'Rotate String', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/rotate-string' },
            { id: 'str-7', title: 'Valid Anagram', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-anagram' },
            { id: 'str-8', title: 'Sort Characters by Frequency', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-characters-by-frequency' },
            { id: 'str-9', title: 'Roman to Integer', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/roman-to-integer' },
            { id: 'str-10', title: 'Longest Palindromic Substring', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring' }
          ]
        },
        {
          title: 'Linked List [Learn 1D & Doubly, Medium, Hard Problems]',
          description: 'Master linked lists from basics to advanced problems',
          problems: [
            { id: 'll-1', title: 'Introduction to Linked List', difficulty: 'Easy', platform: 'CodeBattle', url: '/problems' },
            { id: 'll-2', title: 'Insert Node in Linked List', difficulty: 'Easy', platform: 'GFG', url: 'https://practice.geeksforgeeks.org' },
            { id: 'll-3', title: 'Delete Node in Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/delete-node-in-a-linked-list' },
            { id: 'll-4', title: 'Middle of the Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/middle-of-the-linked-list' },
            { id: 'll-5', title: 'Reverse Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list' },
            { id: 'll-6', title: 'Detect Cycle in a Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle' },
            { id: 'll-7', title: 'Find Starting Point of Cycle', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle-ii' },
            { id: 'll-8', title: 'Palindrome Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/palindrome-linked-list' },
            { id: 'll-9', title: 'Merge Two Sorted Lists', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-two-sorted-lists' },
            { id: 'll-10', title: 'Remove Nth Node From End', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list' },
            { id: 'll-11', title: 'Add Two Numbers', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/add-two-numbers' },
            { id: 'll-12', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists' },
            { id: 'll-13', title: 'Sort List', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-list' },
            { id: 'll-14', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group' }
          ]
        }
      ],
      totalProblems: 456,
      estimatedTime: '6-12 months'
    }
  },
  {
    type: 'learning-path',
    title: 'SDE Sheet - Top Interview Problems',
    description: 'Curated list of 191 must-do problems for software engineer interviews at top companies like Google, Amazon, Microsoft.',
    category: 'Interview Preparation',
    difficulty: 'Intermediate',
    topics: ['Arrays', 'Binary Search', 'Strings', 'Linked List', 'Greedy', 'Recursion', 'Binary Trees', 'DP', 'Graphs', 'Tries'],
    duration: '191 problems',
    author: 'Striver',
    icon: 'Trophy',
    color: 'blue',
    order: 2,
    tags: ['Interview', 'Must Do', 'FAANG', 'Core Problems'],
    metadata: {
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'],
      difficulty: { easy: 45, medium: 98, hard: 48 }
    }
  },
  {
    type: 'learning-path',
    title: 'Blind 75 LeetCode Problems',
    description: 'The 75 most important LeetCode problems that cover all major patterns. Perfect for interview preparation in limited time.',
    category: 'Interview Preparation',
    difficulty: 'Intermediate',
    topics: ['Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math', 'Tree', 'Depth-First Search', 'Binary Search', 'Greedy'],
    duration: '75 problems',
    author: 'CodeBattle Team',
    icon: 'Target',
    color: 'purple',
    order: 3,
    tags: ['Essential', 'Patterns', 'Quick Prep', 'Top Companies'],
    metadata: {
      originalAuthor: 'Blind',
      estimatedTime: '2-4 weeks',
      successRate: '85%'
    }
  },
  {
    type: 'learning-path',
    title: 'NeetCode 150',
    description: 'Extended version with 150 problems covering all important patterns with detailed video explanations.',
    category: 'Problem Solving',
    difficulty: 'All Levels',
    topics: ['Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search', 'Linked List', 'Trees', 'Tries', 'Heap', 'Backtracking', 'Graphs', 'DP'],
    duration: '150 problems',
    author: 'NeetCode',
    icon: 'Code2',
    color: 'green',
    order: 4,
    tags: ['Comprehensive', 'Video Solutions', 'Pattern Based'],
    metadata: {
      hasVideos: true,
      categories: 15
    }
  },

  // ============ PROBLEM SHEETS ============
  {
    type: 'problem-sheet',
    title: 'Striver\'s SDE Sheet Challenge',
    description: 'Take the 30-60 days challenge! Complete all 191 problems and become interview ready.',
    category: 'Interview Preparation',
    difficulty: 'Intermediate',
    topics: ['Complete DSA Coverage'],
    duration: '30-60 days',
    author: 'Striver',
    icon: 'Award',
    color: 'red',
    order: 5,
    url: '#',
    platform: 'Internal',
    tags: ['Challenge', 'Timed', 'Structured', 'Goal Based']
  },
  {
    type: 'problem-sheet',
    title: 'Top 100 Liked Questions',
    description: 'Most loved problems on LeetCode, highly recommended for interview preparation.',
    category: 'Problem Solving',
    difficulty: 'All Levels',
    topics: ['Arrays', 'Trees', 'DP', 'Graphs', 'Strings'],
    duration: '100 problems',
    author: 'LeetCode Community',
    icon: 'Lightbulb',
    color: 'yellow',
    order: 6,
    platform: 'LeetCode',
    tags: ['Popular', 'Community Favorite', 'High Quality']
  },

  // ============ TUTORIALS ============
  {
    type: 'tutorial',
    title: 'Time and Space Complexity Analysis',
    description: 'Master Big O notation, learn how to analyze algorithm efficiency, and understand time-space tradeoffs.',
    category: 'Algorithms',
    difficulty: 'Beginner',
    topics: ['Big O', 'Time Complexity', 'Space Complexity', 'Analysis'],
    duration: '2 hours',
    icon: 'BookOpen',
    color: 'indigo',
    order: 10,
    tags: ['Fundamentals', 'Theory', 'Essential'],
    content: `
# Time and Space Complexity Analysis

## What is Time Complexity?
Time complexity is a measure of the amount of time an algorithm takes to complete as a function of the length of the input...

## Big O Notation
- O(1) - Constant Time
- O(log n) - Logarithmic Time
- O(n) - Linear Time
- O(n log n) - Linearithmic Time
- O(n²) - Quadratic Time
- O(2^n) - Exponential Time

## Examples and Practice Problems
...
    `
  },
  {
    type: 'tutorial',
    title: 'Dynamic Programming Patterns',
    description: 'Learn all major DP patterns: 1D DP, 2D DP, DP on strings, DP on trees, DP with bitmasks, and more.',
    category: 'Algorithms',
    difficulty: 'Advanced',
    topics: ['Dynamic Programming', 'Memoization', 'Tabulation', 'Optimization'],
    duration: '8 hours',
    icon: 'Zap',
    color: 'purple',
    order: 11,
    tags: ['Advanced', 'Patterns', 'Optimization'],
    content: '# Dynamic Programming Patterns\n\nComprehensive guide to DP...'
  },
  {
    type: 'tutorial',
    title: 'Graph Algorithms Masterclass',
    description: 'Complete guide to graphs: BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, MST, Topological Sort, and more.',
    category: 'Algorithms',
    difficulty: 'Advanced',
    topics: ['Graphs', 'BFS', 'DFS', 'Shortest Path', 'MST', 'Topological Sort'],
    duration: '10 hours',
    icon: 'Brain',
    color: 'blue',
    order: 12,
    tags: ['Advanced', 'Comprehensive', 'Graph Theory']
  },
  {
    type: 'tutorial',
    title: 'Binary Search: Patterns and Techniques',
    description: 'Master binary search on arrays, binary search on answer, and all variants. Learn the pattern approach.',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    topics: ['Binary Search', 'Search Algorithms', 'Optimization'],
    duration: '3 hours',
    icon: 'Target',
    color: 'orange',
    order: 13,
    tags: ['Important', 'Pattern', 'Frequently Asked']
  },
  {
    type: 'tutorial',
    title: 'Sliding Window Technique',
    description: 'Master the sliding window pattern for arrays and strings. Learn fixed and variable size windows.',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    topics: ['Arrays', 'Strings', 'Two Pointers', 'Sliding Window'],
    duration: '2 hours',
    icon: 'Code2',
    color: 'green',
    order: 14,
    tags: ['Pattern', 'Arrays', 'Strings', 'Optimization']
  },

  // ============ VIDEO COURSES ============
  {
    type: 'video',
    title: 'Complete C++ STL in One Video',
    description: 'Learn all about C++ Standard Template Library: vectors, maps, sets, algorithms, and more in this comprehensive tutorial.',
    category: 'Language Specific',
    difficulty: 'Beginner',
    topics: ['C++', 'STL', 'Data Structures', 'Algorithms'],
    duration: '3.5 hours',
    author: 'Striver',
    platform: 'YouTube',
    icon: 'Video',
    color: 'red',
    order: 20,
    url: 'https://www.youtube.com/watch?v=example',
    tags: ['C++', 'STL', 'Complete Course', 'Video']
  },
  {
    type: 'video',
    title: 'Trees and Graphs Playlist',
    description: '50+ videos covering every tree and graph algorithm with detailed explanations and code implementations.',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    topics: ['Trees', 'Graphs', 'Algorithms'],
    duration: '25 hours',
    author: 'CodeBattle Team',
    platform: 'YouTube',
    icon: 'Video',
    color: 'blue',
    order: 21,
    tags: ['Video Series', 'Trees', 'Graphs', 'Deep Dive']
  },
  {
    type: 'video',
    title: 'DP for Beginners',
    description: 'Start your dynamic programming journey with this beginner-friendly series covering all basics.',
    category: 'Algorithms',
    difficulty: 'Beginner',
    topics: ['Dynamic Programming', 'Recursion', 'Memoization'],
    duration: '8 hours',
    author: 'CodeBattle Team',
    platform: 'YouTube',
    icon: 'Video',
    color: 'purple',
    order: 22,
    tags: ['Beginner Friendly', 'DP', 'Video Course']
  },

  // ============ ARTICLES ============
  {
    type: 'article',
    title: 'Top 10 Algorithms Every Programmer Should Know',
    description: 'Essential algorithms that form the foundation of computer science and software engineering.',
    category: 'Algorithms',
    difficulty: 'All Levels',
    topics: ['Sorting', 'Searching', 'Graph Algorithms', 'Dynamic Programming'],
    duration: '15 min read',
    icon: 'FileText',
    color: 'gray',
    order: 30,
    tags: ['Must Read', 'Fundamentals', 'Quick Read']
  },
  {
    type: 'article',
    title: 'How to Approach a Coding Interview',
    description: 'Complete guide on how to think, communicate, and solve problems in technical interviews.',
    category: 'Interview Preparation',
    difficulty: 'All Levels',
    topics: ['Interview Tips', 'Problem Solving', 'Communication'],
    duration: '20 min read',
    icon: 'FileText',
    color: 'green',
    order: 31,
    tags: ['Interview', 'Strategy', 'Communication', 'Must Read']
  },
  {
    type: 'article',
    title: 'System Design Basics for Interviews',
    description: 'Learn the fundamentals of system design: scalability, load balancing, caching, databases, and more.',
    category: 'System Design',
    difficulty: 'Advanced',
    topics: ['System Design', 'Scalability', 'Architecture', 'Distributed Systems'],
    duration: '30 min read',
    icon: 'FileText',
    color: 'purple',
    order: 32,
    tags: ['System Design', 'Advanced', 'Architecture']
  },

  // ============ EXTERNAL RESOURCES ============
  {
    type: 'external',
    title: 'LeetCode Platform',
    description: 'Practice on one of the most popular coding interview preparation platforms with 2500+ problems.',
    category: 'Problem Solving',
    difficulty: 'All Levels',
    url: 'https://leetcode.com',
    platform: 'LeetCode',
    icon: 'ExternalLink',
    color: 'yellow',
    order: 40,
    tags: ['Platform', 'Practice', 'Interview']
  },
  {
    type: 'external',
    title: 'GeeksforGeeks DSA Self Paced',
    description: 'Comprehensive DSA course with theory, practice problems, and video lectures.',
    category: 'DSA',
    difficulty: 'All Levels',
    url: 'https://www.geeksforgeeks.org/courses',
    platform: 'GeeksforGeeks',
    icon: 'ExternalLink',
    color: 'green',
    order: 41,
    tags: ['Course', 'Structured', 'Complete']
  },
  {
    type: 'external',
    title: 'Codeforces',
    description: 'Competitive programming platform with regular contests and a large problem archive.',
    category: 'Competitive Programming',
    difficulty: 'Intermediate',
    url: 'https://codeforces.com',
    platform: 'CodeForces',
    icon: 'ExternalLink',
    color: 'blue',
    order: 42,
    tags: ['Competitive', 'Contests', 'Practice']
  },
  {
    type: 'external',
    title: 'Striver\'s Website',
    description: 'Original source for Striver\'s A2Z DSA Course and SDE Sheet with detailed articles and videos.',
    category: 'DSA',
    difficulty: 'All Levels',
    url: 'https://takeuforward.org',
    platform: 'Other',
    icon: 'ExternalLink',
    color: 'orange',
    order: 43,
    tags: ['Original', 'Complete', 'Recommended']
  },

  // ============ COURSES ============
  {
    type: 'course',
    title: 'Complete Interview Preparation',
    description: 'Full-stack interview preparation covering DSA, System Design, CS Fundamentals, and Behavioral Questions.',
    category: 'Interview Preparation',
    difficulty: 'All Levels',
    topics: ['DSA', 'System Design', 'OS', 'DBMS', 'Networks', 'Behavioral'],
    duration: '4-6 months',
    icon: 'GraduationCap',
    color: 'indigo',
    order: 50,
    tags: ['Complete', 'Structured', 'All Topics', 'Placement']
  },
  {
    type: 'course',
    title: 'Competitive Programming Bootcamp',
    description: 'Advanced course for competitive programming covering advanced algorithms, data structures, and problem-solving techniques.',
    category: 'Competitive Programming',
    difficulty: 'Advanced',
    topics: ['Advanced Algorithms', 'Math', 'Number Theory', 'Game Theory', 'String Algorithms'],
    duration: '3 months',
    icon: 'Trophy',
    color: 'red',
    order: 51,
    tags: ['Advanced', 'Competitive', 'Contest Prep']
  }
];

const seedResources = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('🗑️  Cleared existing resources');

    // Insert new resources
    const createdResources = await Resource.insertMany(resources);
    console.log(`✅ Successfully seeded ${createdResources.length} resources`);

    console.log('\n📊 Resources by type:');
    const types = createdResources.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});
    console.table(types);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding resources:', error);
    process.exit(1);
  }
};

seedResources();
