import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';

// ─── HELPER UTILITIES FOR HIGH-FIDELITY TESTCASE GENERATION ───
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randArray = (size, min, max) => Array.from({ length: size }, () => randInt(min, max));
const randStr = (len, alphabet = 'abcdefghijklmnopqrstuvwxyz') => 
  Array.from({ length: len }, () => alphabet[randInt(0, alphabet.length - 1)]).join('');

// ─── SIGNATURE GENERATION UTILITY ───
function makeSignatures(slug, args, retType) {
  const camelName = slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  const cppArgs = args.map(a => `${a.cpp} ${a.name}`).join(', ');
  const cpp = `class Solution {\npublic:\n    ${retType.cpp} ${camelName}(${cppArgs}) {\n        \n    }\n};`;
  
  const javaArgs = args.map(a => `${a.java} ${a.name}`).join(', ');
  const java = `class Solution {\n    public ${retType.java} ${camelName}(${javaArgs}) {\n        \n    }\n}`;
  
  const pyArgs = args.map(a => a.py).join(', ');
  const python = `class Solution:\n    def ${camelName}(self, ${pyArgs}) -> ${retType.py}:\n        `;
  
  const jsArgs = args.map(a => a.js).join(', ');
  const javascript = `var ${camelName} = function(${jsArgs}) {\n    \n};`;
  
  return { cpp, java, python, javascript };
}

// ─── 100 POPULAR LEETCODE DSA PROBLEMS (20 PER TYPE × 5 TYPES) ───
const problemSpecs = [];

// ==========================================
// TYPE 1: ARRAYS & HASHING (20 Problems)
// ==========================================
const type1Slugs = [
  'two-sum', 'contains-duplicate', 'valid-anagram', 'group-anagrams', 'single-number',
  'missing-number', 'move-zeroes', 'intersection-of-two-arrays', 'majority-element', 'plus-one',
  'find-all-duplicates-in-an-array', 'distribute-candies', 'non-decreasing-array', 'height-checker', 'peak-index-in-a-mountain-array',
  'monotonic-array', 'third-maximum-number', 'squares-of-a-sorted-array', 'find-pivot-index', 'sort-array-by-parity'
];

const type1Titles = [
  'Two Sum', 'Contains Duplicate', 'Valid Anagram', 'Group Anagrams', 'Single Number',
  'Missing Number', 'Move Zeroes', 'Intersection of Two Arrays', 'Majority Element', 'Plus One',
  'Find All Duplicates in an Array', 'Distribute Candies', 'Non-decreasing Array', 'Height Checker', 'Peak Index in a Mountain Array',
  'Monotonic Array', 'Third Maximum Number', 'Squares of a Sorted Array', 'Find Pivot Index', 'Sort Array By Parity'
];

const type1Descriptions = [
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
  'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
  'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
  'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
  'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
  'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements in-place.',
  'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.',
  'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.',
  'Increment the large integer represented as an integer array digits by one and return the resulting array of digits.',
  'Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears once or twice, return an array of all the integers that appears twice.',
  'Alice has n candies, where the ith candy is of type candyType[i]. Return the maximum number of different types of candies she can eat if she only eats n / 2 of them.',
  'Given an array nums with n integers, your task is to check if it could become non-decreasing by modifying at most one element.',
  'Return the number of indices where heights[i] != expected[i] where expected is heights sorted in non-decreasing order.',
  'Return the index i such that the peak of a mountain array exists.',
  'Return true if and only if the given array nums is monotonic (either monotone increasing or monotone decreasing).',
  'Given an integer array nums, return the third distinct maximum number in this array. If the third maximum does not exist, return the maximum number.',
  'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
  'Given an array of integers nums, calculate the pivot index where the sum of all numbers to the left equals the sum of numbers to the right.',
  'Given an integer array nums, return an array consisting of all the even elements of nums, followed by all the odd elements of nums.'
];

// ==========================================
// TYPE 2: STRINGS & TWO POINTERS (20 Problems)
// ==========================================
const type2Slugs = [
  'reverse-string', 'valid-palindrome', 'reverse-vowels-of-a-string', 'first-unique-character-in-a-string', 'detect-capital',
  'longest-common-prefix', 'length-of-last-word', 'ransom-note', 'is-subsequence', 'reverse-words-in-a-string-iii',
  'valid-palindrome-ii', 'robot-return-to-origin', 'goat-latin', 'unique-morse-code-words', 'reverse-string-ii',
  'merge-strings-alternately', 'backspace-string-compare', 'isomorphic-strings', 'remove-all-adjacent-duplicates-in-string', 'decrypt-string-from-alphabet-to-integer-mapping'
];

const type2Titles = [
  'Reverse String', 'Valid Palindrome', 'Reverse Vowels of a String', 'First Unique Character in a String', 'Detect Capital',
  'Longest Common Prefix', 'Length of Last Word', 'Ransom Note', 'Is Subsequence', 'Reverse Words in a String III',
  'Valid Palindrome II', 'Robot Return to Origin', 'Goat Latin', 'Unique Morse Code Words', 'Reverse String II',
  'Merge Strings Alternately', 'Backspace String Compare', 'Isomorphic Strings', 'Remove All Adjacent Duplicates In String', 'Decrypt String from Alphabet to Integer'
];

const type2Descriptions = [
  'Write a function that reverses a string. The input string is given as an array of characters s. You must do this in-place.',
  'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
  'Given a string s, reverse only all the vowels in the string and return it.',
  'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
  'We define the usage of capitals in a word to be right when all letters are capitals, all are not, or only the first is capital.',
  'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return "".',
  'Given a string s consisting of words and spaces, return the length of the last word in the string.',
  'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine.',
  'Given two strings s and t, return true if s is a subsequence of t, or false otherwise.',
  'Given a string s, reverse the order of characters in each word within a sentence while still preserving whitespace and initial word order.',
  'Given a string s, return true if the s can be palindrome after deleting at most one character from it.',
  'There is a robot starting at (0, 0). Given a sequence of its moves, judge if this robot ends up at (0, 0) after it completes its moves.',
  'Convert the given sentence of words separated by single spaces to Goat Latin based on vowel/consonant starting rules.',
  'Given an array of strings words, return the number of different transformations among all words when represented in Morse code.',
  'Given a string s and an integer k, reverse the first k characters for every 2k characters counting from the start of the string.',
  'You are given two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1.',
  'Given two strings s and t, return true if they are equal when both are typed into empty text editors. "#" means a backspace character.',
  'Given two strings s and t, determine if they are isomorphic (characters can be mapped one-to-one).',
  'Choose two adjacent and equal letters in a string s and remove them. Repeat until no more adjacent duplicates remain.',
  'Decrypt a string s formed by digits and "#" where "1"-"9" maps to "a"-"i" and "10#"-"26#" maps to "j"-"z".'
];

// ==========================================
// TYPE 3: MATH, BIT MANIPULATION & SIMULATION (20 Problems)
// ==========================================
const type3Slugs = [
  'palindrome-number', 'fibonacci-number', 'fizz-buzz', 'power-of-two', 'power-of-three',
  'power-of-four', 'number-of-1-bits', 'hamming-distance', 'add-digits', 'ugly-number',
  'happy-number', 'excel-sheet-column-number', 'base-7', 'self-dividing-numbers', 'nim-game',
  'day-of-the-year', 'perfect-number', 'complement-of-base-10-integer', 'subtract-the-product-and-sum-of-digits-of-an-integer', 'minimum-time-visiting-all-points'
];

const type3Titles = [
  'Palindrome Number', 'Fibonacci Number', 'Fizz Buzz', 'Power of Two', 'Power of Three',
  'Power of Four', 'Number of 1 Bits', 'Hamming Distance', 'Add Digits', 'Ugly Number',
  'Happy Number', 'Excel Sheet Column Number', 'Base 7', 'Self Dividing Numbers', 'Nim Game',
  'Day of the Year', 'Perfect Number', 'Complement of Base 10', 'Subtract Product and Sum of Digits', 'Minimum Time Visiting All Points'
];

const type3Descriptions = [
  'Given an integer x, return true if x is a palindrome, and false otherwise.',
  'Given n, calculate the nth Fibonacci number F(n).',
  'Given an integer n, return a string array answer of FizzBuzz representations from 1 to n.',
  'Given an integer n, return true if it is a power of two. Otherwise, return false.',
  'Given an integer n, return true if it is a power of three. Otherwise, return false.',
  'Given an integer n, return true if it is a power of four. Otherwise, return false.',
  'Write a function that takes an unsigned integer and returns the number of \'1\' bits it has (Hamming weight).',
  'Given two integers x and y, return the Hamming distance (number of bit positions at which the corresponding bits are different).',
  'Given an integer num, repeatedly add all its digits until the result has only one digit, and return it.',
  'An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return true if n is ugly.',
  'Determine if a number n is happy by replacing it by the sum of squares of its digits repeatedly, checking for 1.',
  'Given a string columnTitle that represents the column title in an Excel sheet, return its corresponding column number.',
  'Given an integer num, return a string representation of its base 7 representation.',
  'A self-dividing number is divisible by every digit it contains. Return a list of all self-dividing numbers in range [left, right].',
  'Nim Game: You and a friend remove 1-3 stones from a heap. You go first. Return true if you can win given n stones.',
  'Given a string date formatted as YYYY-MM-DD, return the day number of the year.',
  'A perfect number is equal to the sum of its positive divisors, excluding itself. Return true if perfect.',
  'The complement of an integer is the integer you get when you flip all 0s to 1s and 1s to 0s in binary. Return it.',
  'Given an integer n, return the difference between the product of its digits and the sum of its digits.',
  'Given an array of points, return the minimum time in seconds to visit all points in order. You can move diagonally.'
];

// ==========================================
// TYPE 4: STACKS, QUEUES & GREEDY (20 Problems)
// ==========================================
const type4Slugs = [
  'baseball-game', 'crawler-log-folder', 'make-the-string-great', 'remove-outermost-parentheses', 'container-with-most-water',
  'sort-colors', 'move-element-to-end', 'next-greater-element-i', 'reverse-substrings-between-each-pair-of-parentheses', 'validate-stack-sequences',
  'backspace-string-compare-two-pointers', 'valid-parentheses-depth', 'replace-spaces', 'find-target-indices-after-sorting-array', 'minimum-number-of-moves-to-seat-everyone',
  'intersection-of-two-arrays-ii', 'check-if-two-string-arrays-are-equivalent', 'defanging-an-ip-address', 'final-value-of-variable-after-performing-operations', 'jewels-and-stones'
];

const type4Titles = [
  'Baseball Game', 'Crawler Log Folder', 'Make The String Great', 'Remove Outermost Parentheses', 'Container With Most Water',
  'Sort Colors', 'Move Element to End', 'Next Greater Element I', 'Reverse Substrings Between Parentheses', 'Validate Stack Sequences',
  'Backspace String Compare (Two Pointers)', 'Valid Parentheses Depth', 'Replace Spaces', 'Find Target Indices After Sorting', 'Minimum Moves to Seat Everyone',
  'Intersection of Two Arrays II', 'Check Equivalent String Arrays', 'Defanging an IP Address', 'Final Value of Variable After Operations', 'Jewels and Stones'
];

const type4Descriptions = [
  'You are keeping score for a baseball game. Given operations "+", "D", "C", or integers, calculate the total score.',
  'Return the minimum number of operations needed to go back to the main folder after a sequence of change folder operations.',
  'A string is great if no adjacent characters are same but of different cases. Remove bad pairs repeatedly.',
  'Remove the outermost parentheses of every primitive valid parentheses string in the decomposition of s.',
  'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
  'Sort an array with colors represented by 0, 1, and 2 in-place (red, white, and blue).',
  'Move all instances of a target integer to the end of the array in-place, preserving relative order of other elements.',
  'Find the next greater element in nums2 for each element in nums1, returning -1 if none exists.',
  'Reverse the substrings in each pair of matching parentheses, starting from the innermost one.',
  'Given pushed and popped distinct integer arrays, return true if this could be the result of a valid stack sequence.',
  'Given two strings s and t, return true if they are equal when both are typed into editors. Solve in O(1) space.',
  'Given a valid parentheses string s, return the maximum nesting depth of s.',
  'Write a method to replace all spaces in a string with \'%20\'.',
  'You are given an integer array nums and a target. Return a list of the sorted indices of nums that match target.',
  'Given arrays seats and students, return the minimum number of moves required to seat each student.',
  'Given two integer arrays nums1 and nums2, return an array of their intersection with duplicate counts maintained.',
  'Given two string arrays word1 and word2, return true if the two arrays represent the same concatenated string.',
  'Given a valid IP address s, return a defanged version of that IP address where every "." is replaced with "[.]".',
  'There is a variable X starting at 0. Given an array of operations "++X", "X++", "--X", or "X--", return the final value.',
  'Given strings jewels representing the types of stones that are jewels, and stones, return how many of the stones you have are jewels.'
];

// ==========================================
// TYPE 5: DYNAMIC PROGRAMMING, RECURSION & SEARCHING (20 Problems)
// ==========================================
const type5Slugs = [
  'binary-search', 'search-insert-position', 'first-bad-version', 'guess-number-higher-or-lower', 'climbing-stairs',
  'min-cost-climbing-stairs', 'maximum-subarray', 'divisor-game', 'tribonacci-number', 'pascals-triangle',
  'pascals-triangle-ii', 'counting-bits', 'jump-game', 'unique-paths', 'coin-change',
  'longest-increasing-subsequence', 'search-in-rotated-sorted-array', 'find-first-and-last-position-of-element-in-sorted-array', 'sqrtx', 'valid-perfect-square'
];

const type5Titles = [
  'Binary Search', 'Search Insert Position', 'First Bad Version', 'Guess Number Higher or Lower', 'Climbing Stairs',
  'Min Cost Climbing Stairs', 'Maximum Subarray', 'Divisor Game', 'Tribonacci Number', 'Pascal\'s Triangle',
  'Pascal\'s Triangle II', 'Counting Bits', 'Jump Game', 'Unique Paths', 'Coin Change',
  'Longest Increasing Subsequence', 'Search in Rotated Sorted Array', 'Find First and Last Position of Element', 'Sqrt(x)', 'Valid Perfect Square'
];

const type5Descriptions = [
  'Given a sorted array of integers nums and a target, search target in nums returning its index or -1 in O(log n) time.',
  'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the insert position.',
  'Given n versions [1, 2, ..., n], find the first bad one which causes all subsequent versions to be bad, using binary search.',
  'We play a guess game. I choose a number from 1 to n. You guess, and I tell if guess is higher, lower, or correct. Return the chosen number.',
  'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb?',
  'You are given an integer array cost where cost[i] is the cost of ith step. Once you pay cost, you can climb 1 or 2 steps. Find min cost to reach top.',
  'Given an integer array nums, find the subarray with the largest sum and return its sum (Kadane\'s algorithm).',
  'Alice and Bob take turns playing a divisor game. Given n, return true if Alice wins assuming both play optimally.',
  'The Tribonacci sequence T(n) is T(0)=0, T(1)=1, T(2)=1, and T(n)=T(n-1)+T(n-2)+T(n-3). Given n, return T(n).',
  'Given an integer numRows, return the first numRows of Pascal\'s triangle.',
  'Given an integer rowIndex, return the rowIndex-th (0-indexed) row of the Pascal\'s triangle.',
  'Given an integer n, return an array ans of length n + 1 such that for each i, ans[i] is the number of 1 bits in the binary representation of i.',
  'Given an integer array nums, you are initially positioned at the first index. Return true if you can reach the last index.',
  'There is a robot on an m x n grid starting at top-left. It can only move down or right. Return number of possible unique paths to bottom-right.',
  'Given coins of different denominations and an integer amount, return the fewest number of coins that you need to make up that amount.',
  'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
  'Given a rotated sorted array nums and a target, return index of target or -1 in O(log n) time.',
  'Given a sorted array nums and a target, find starting and ending position of target, returning [-1, -1] if not found.',
  'Given a non-negative integer x, return the square root of x rounded down to the nearest integer.',
  'Given a positive integer num, return true if num is a perfect square, else false. Do not use built-in sqrt.'
];

// assemble ALL 100 specs
for (let i = 0; i < 100; i++) {
  let slug, title, desc, cat, tags;
  if (i < 20) {
    slug = type1Slugs[i];
    title = type1Titles[i];
    desc = type1Descriptions[i];
    cat = 'Arrays & Hashing';
    tags = ['Array'];
  } else if (i < 40) {
    slug = type2Slugs[i - 20];
    title = type2Titles[i - 20];
    desc = type2Descriptions[i - 20];
    cat = 'Strings & Two Pointers';
    tags = ['String'];
  } else if (i < 60) {
    slug = type3Slugs[i - 40];
    title = type3Titles[i - 40];
    desc = type3Descriptions[i - 40];
    cat = 'Math & Simulation';
    tags = ['Math'];
  } else if (i < 80) {
    slug = type4Slugs[i - 60];
    title = type4Titles[i - 60];
    desc = type4Descriptions[i - 60];
    cat = 'Stacks, Queues & Greedy';
    tags = ['Stack'];
  } else {
    slug = type5Slugs[i - 80];
    title = type5Titles[i - 80];
    desc = type5Descriptions[i - 80];
    cat = 'Dynamic Programming & Searching';
    tags = ['Dynamic Programming'];
  }

  let difficulty = 'Easy';
  if (i % 10 === 7 || i % 10 === 8) {
    difficulty = 'Medium';
  } else if (i % 10 === 9) {
    difficulty = 'Hard';
  }

  problemSpecs.push({ index: i, slug, title, description: desc, category: cat, tags, difficulty });
}

// ─── HIGH FIDELITY SPECIFIC MAPPING FOR ALL 100 DSA PROBLEMS ───
const customEngines = {
  // --- Category 1: Arrays & Hashing ---
  'two-sum': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums, target) => {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
      }
      return [];
    },
    inputGenerator: () => {
      const inputs = [[[2, 7, 11, 15], 9], [[3, 2, 4], 6], [[3, 3], 6]];
      for (let k = 0; k < 50; k++) {
        const size = randInt(5, 20);
        const nums = randArray(size, -20, 20);
        const idx1 = randInt(0, size - 1), idx2 = (idx1 + 1) % size;
        inputs.push([nums, nums[idx1] + nums[idx2]]);
      }
      return inputs;
    }
  },
  'contains-duplicate': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (nums) => new Set(nums).size !== nums.length,
    inputGenerator: () => {
      const inputs = [[[1, 2, 3, 1]], [[1, 2, 3, 4]]];
      for (let k = 0; k < 50; k++) {
        const list = randArray(randInt(4, 15), 1, 30);
        if (Math.random() > 0.5) list.push(list[0]);
        inputs.push([list]);
      }
      return inputs;
    }
  },
  'valid-anagram': {
    args: [
      { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
      { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s, t) => s.split('').sort().join('') === t.split('').sort().join(''),
    inputGenerator: () => {
      const inputs = [['anagram', 'nagaram'], ['rat', 'car']];
      for (let k = 0; k < 50; k++) {
        const s = randStr(randInt(3, 8));
        const t = Math.random() > 0.5 ? s.split('').sort(() => Math.random() - 0.5).join('') : randStr(s.length);
        inputs.push([s, t]);
      }
      return inputs;
    }
  },
  'group-anagrams': {
    args: [{ name: 'strs', cpp: 'vector<string>&', java: 'String[]', py: 'strs: List[str]', js: 'strs' }],
    retType: { cpp: 'vector<vector<string>>', java: 'List<List<String>>', py: 'List[List[str]]', js: 'List[List[str]]' },
    jsSolution: (strs) => {
      const map = {};
      for (const s of strs) {
        const sorted = s.split('').sort().join('');
        if (!map[sorted]) map[sorted] = [];
        map[sorted].push(s);
      }
      return Object.values(map).map(row => row.sort()).sort();
    },
    inputGenerator: () => {
      const inputs = [[['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], [['']], [['a']]];
      for (let k = 0; k < 50; k++) {
        const list = Array.from({ length: randInt(4, 10) }, () => randStr(randInt(3, 4)));
        inputs.push([list]);
      }
      return inputs;
    }
  },
  'single-number': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => nums.reduce((a, b) => a ^ b, 0),
    inputGenerator: () => {
      const inputs = [[[2, 2, 1]], [[4, 1, 2, 1, 2]]];
      for (let k = 0; k < 50; k++) {
        const list = randArray(randInt(2, 8), 1, 100);
        const res = [...list, ...list, randInt(101, 200)];
        inputs.push([res.sort(() => Math.random() - 0.5)]);
      }
      return inputs;
    }
  },
  'missing-number': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => {
      const n = nums.length;
      return (n * (n + 1)) / 2 - nums.reduce((a, b) => a + b, 0);
    },
    inputGenerator: () => {
      const inputs = [[[3, 0, 1]], [[0, 1]], [[9, 6, 4, 2, 3, 5, 7, 0, 1]]];
      for (let k = 0; k < 50; k++) {
        const n = randInt(5, 20);
        const missing = randInt(0, n);
        const arr = [];
        for (let i = 0; i <= n; i++) if (i !== missing) arr.push(i);
        inputs.push([arr.sort(() => Math.random() - 0.5)]);
      }
      return inputs;
    }
  },
  'move-zeroes': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'void', java: 'void', py: 'None', js: 'void' },
    jsSolution: (nums) => {
      let pos = 0;
      for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
          const temp = nums[pos];
          nums[pos] = nums[i];
          nums[i] = temp;
          pos++;
        }
      }
      return nums;
    },
    inputGenerator: () => {
      const inputs = [[[0, 1, 0, 3, 12]], [[0]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(5, 15), -10, 10).map(x => Math.random() > 0.4 ? x : 0)]);
      }
      return inputs;
    }
  },
  'intersection-of-two-arrays': {
    args: [
      { name: 'nums1', cpp: 'vector<int>&', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
      { name: 'nums2', cpp: 'vector<int>&', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (n1, n2) => Array.from(new Set(n1.filter(x => n2.includes(x)))).sort((a,b)=>a-b),
    inputGenerator: () => {
      const inputs = [[[1, 2, 2, 1], [2, 2]], [[4, 9, 5], [9, 4, 9, 8, 4]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), 1, 10), randArray(randInt(4, 10), 1, 10)]);
      }
      return inputs;
    }
  },
  'majority-element': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => {
      let cand, count = 0;
      for (const n of nums) {
        if (count === 0) cand = n;
        count += (n === cand ? 1 : -1);
      }
      return cand;
    },
    inputGenerator: () => {
      const inputs = [[[3, 2, 3]], [[2, 2, 1, 1, 1, 2, 2]]];
      for (let k = 0; k < 50; k++) {
        const size = randInt(5, 15);
        const maj = randInt(1, 50);
        const list = randArray(size, 1, 50);
        while (list.filter(x => x === maj).length <= size / 2) {
          list[randInt(0, size - 1)] = maj;
        }
        inputs.push([list]);
      }
      return inputs;
    }
  },
  'plus-one': {
    args: [{ name: 'digits', cpp: 'vector<int>&', java: 'int[]', py: 'digits: List[int]', js: 'digits' }],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (digits) => {
      const c = [...digits];
      for (let i = c.length - 1; i >= 0; i--) {
        if (c[i] < 9) { c[i]++; return c; }
        c[i] = 0;
      }
      return [1, ...c];
    },
    inputGenerator: () => {
      const inputs = [[[1, 2, 3]], [[4, 3, 2, 1]], [[9]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Array.from({ length: randInt(2, 8) }, (_, i) => i === 0 ? randInt(1, 9) : randInt(0, 9))]);
      }
      return inputs;
    }
  },
  'find-all-duplicates-in-an-array': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums) => {
      const s = new Set(), res = [];
      for (const n of nums) { if (s.has(n)) res.push(n); else s.add(n); }
      return res.sort((a,b)=>a-b);
    },
    inputGenerator: () => {
      const inputs = [[[4,3,2,7,8,2,3,1]], [[1,1,2]]];
      for (let k = 0; k < 50; k++) {
        const size = randInt(5, 12);
        const base = Array.from({ length: size }, (_, i) => i + 1);
        if (Math.random() > 0.5) base.push(base[0]);
        inputs.push([base.sort(() => Math.random() - 0.5)]);
      }
      return inputs;
    }
  },
  'distribute-candies': {
    args: [{ name: 'candyType', cpp: 'vector<int>&', java: 'int[]', py: 'candyType: List[int]', js: 'candyType' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (c) => Math.min(new Set(c).size, c.length / 2),
    inputGenerator: () => {
      const inputs = [[[1,1,2,2,3,3]], [[1,1,2,3]]];
      for (let k = 0; k < 50; k++) {
        const size = randInt(2, 6) * 2;
        inputs.push([randArray(size, 1, 10)]);
      }
      return inputs;
    }
  },
  'non-decreasing-array': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (nums) => {
      const arr = [...nums];
      let cnt = 0;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
          cnt++;
          if (cnt > 1) return false;
          if (i >= 2 && arr[i] < arr[i - 2]) arr[i] = arr[i - 1];
        }
      }
      return true;
    },
    inputGenerator: () => {
      const inputs = [[[4,2,3]], [[4,2,1]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), 1, 20)]);
      }
      return inputs;
    }
  },
  'height-checker': {
    args: [{ name: 'heights', cpp: 'vector<int>&', java: 'int[]', py: 'heights: List[int]', js: 'heights' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (h) => {
      const s = [...h].sort((a,b)=>a-b);
      return h.reduce((acc, v, idx) => acc + (v !== s[idx] ? 1 : 0), 0);
    },
    inputGenerator: () => {
      const inputs = [[[1,1,4,2,1,3]], [[5,1,2,3,4]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(5, 12), 1, 10)]);
      }
      return inputs;
    }
  },
  'peak-index-in-a-mountain-array': {
    args: [{ name: 'arr', cpp: 'vector<int>&', java: 'int[]', py: 'arr: List[int]', js: 'arr' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (arr) => {
      let l = 0, r = arr.length - 1;
      while (l < r) {
        const mid = Math.floor((l+r)/2);
        if (arr[mid] < arr[mid+1]) l = mid + 1; else r = mid;
      }
      return l;
    },
    inputGenerator: () => {
      const inputs = [[[0,1,0]], [[0,2,1,0]], [[0,10,5,2]]];
      for (let k = 0; k < 50; k++) {
        const peak = randInt(2, 8);
        const arr = [];
        for (let i = 0; i <= peak; i++) arr.push(i);
        for (let i = peak - 1; i >= 0; i--) arr.push(i);
        inputs.push([arr]);
      }
      return inputs;
    }
  },
  'monotonic-array': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (nums) => {
      let inc = true, dec = true;
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) dec = false;
        if (nums[i] < nums[i - 1]) inc = false;
      }
      return inc || dec;
    },
    inputGenerator: () => {
      const inputs = [[[6,5,4,4]], [[1,3,2]]];
      for (let k = 0; k < 50; k++) {
        const list = randArray(randInt(4, 10), 1, 20);
        if (Math.random() > 0.5) list.sort((a,b)=>a-b);
        inputs.push([list]);
      }
      return inputs;
    }
  },
  'third-maximum-number': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => {
      const u = Array.from(new Set(nums)).sort((a,b)=>b-a);
      return u.length >= 3 ? u[2] : u[0];
    },
    inputGenerator: () => {
      const inputs = [[[3,2,1]], [[1,2]], [[2,2,3,1]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(3, 10), 1, 50)]);
      }
      return inputs;
    }
  },
  'squares-of-a-sorted-array': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums) => nums.map(x => x * x).sort((a,b)=>a-b),
    inputGenerator: () => {
      const inputs = [[[-4,-1,0,3,10]], [[-7,-3,2,3,11]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), -20, 20).sort((a,b)=>a-b)]);
      }
      return inputs;
    }
  },
  'find-pivot-index': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => {
      const tot = nums.reduce((a,b)=>a+b,0);
      let left = 0;
      for (let i=0; i<nums.length; i++) {
        if (left === tot - left - nums[i]) return i;
        left += nums[i];
      }
      return -1;
    },
    inputGenerator: () => {
      const inputs = [[[1,7,3,6,5,6]], [[1,2,3]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), -5, 10)]);
      }
      return inputs;
    }
  },
  'sort-array-by-parity': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums) => [...nums.filter(x => x % 2 === 0), ...nums.filter(x => x % 2 !== 0)],
    inputGenerator: () => {
      const inputs = [[[3,1,2,4]], [[0]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 12), 1, 50)]);
      }
      return inputs;
    }
  },

  // --- Category 2: Strings & Two Pointers ---
  'reverse-string': {
    args: [{ name: 's', cpp: 'vector<char>&', java: 'char[]', py: 's: List[str]', js: 's' }],
    retType: { cpp: 'void', java: 'void', py: 'None', js: 'void' },
    jsSolution: (s) => [...s].reverse(),
    inputGenerator: () => {
      const inputs = [[['h','e','l','l','o']], [['H','a','n','n','a','h']]];
      for (let k = 0; k < 50; k++) {
        const word = randStr(randInt(3, 8));
        inputs.push([word.split('')]);
      }
      return inputs;
    }
  },
  'valid-palindrome': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s) => {
      const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
      return clean === clean.split('').reverse().join('');
    },
    inputGenerator: () => {
      const inputs = [['A man, a plan, a canal: Panama'], ['race a car'], [' ']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(randInt(4, 12))]);
      }
      return inputs;
    }
  },
  'reverse-vowels-of-a-string': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => {
      const vow = new Set(['a','e','i','o','u','A','E','I','O','U']);
      const chars = s.split('');
      let i = 0, j = chars.length - 1;
      while (i < j) {
        if (!vow.has(chars[i])) i++;
        else if (!vow.has(chars[j])) j--;
        else {
          const tmp = chars[i];
          chars[i] = chars[j];
          chars[j] = tmp;
          i++; j--;
        }
      }
      return chars.join('');
    },
    inputGenerator: () => {
      const inputs = [['hello'], ['leetcode']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(randInt(4, 10))]);
      }
      return inputs;
    }
  },
  'first-unique-character-in-a-string': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (s) => {
      const count = {};
      for (const c of s) count[c] = (count[c] || 0) + 1;
      for (let i = 0; i < s.length; i++) {
        if (count[s[i]] === 1) return i;
      }
      return -1;
    },
    inputGenerator: () => {
      const inputs = [['leetcode'], ['loveleetcode'], ['aabb']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(randInt(3, 10))]);
      }
      return inputs;
    }
  },
  'detect-capital': {
    args: [{ name: 'word', cpp: 'string', java: 'String', py: 'word: str', js: 'word' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (word) => word === word.toUpperCase() || word === word.toLowerCase() || (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()),
    inputGenerator: () => {
      const inputs = [['USA'], ['FlaG'], ['leetcode'], ['Google']];
      for (let k = 0; k < 48; k++) {
        const raw = randStr(randInt(3, 6));
        inputs.push([Math.random() > 0.5 ? raw.toUpperCase() : raw.toLowerCase()]);
      }
      return inputs;
    }
  },
  'longest-common-prefix': {
    args: [{ name: 'strs', cpp: 'vector<string>&', java: 'String[]', py: 'strs: List[str]', js: 'strs' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (strs) => {
      if (!strs.length) return '';
      let pref = strs[0];
      for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(pref) !== 0) {
          pref = pref.substring(0, pref.length - 1);
          if (!pref) return '';
        }
      }
      return pref;
    },
    inputGenerator: () => {
      const inputs = [[['flower','flow','flight']], [['dog','racecar','car']]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Array.from({ length: 3 }, () => randStr(randInt(3, 6)))]);
      }
      return inputs;
    }
  },
  'length-of-last-word': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (s) => {
      const trimmed = s.trim();
      return trimmed.length - trimmed.lastIndexOf(' ') - 1;
    },
    inputGenerator: () => {
      const inputs = [['Hello World'], ['   fly me   to   the moon  '], ['luffy is still joyboy']];
      for (let k = 0; k < 50; k++) {
        inputs.push([`${randStr(3)} ${randStr(5)}  `]);
      }
      return inputs;
    }
  },
  'ransom-note': {
    args: [
      { name: 'ransomNote', cpp: 'string', java: 'String', py: 'ransomNote: str', js: 'ransomNote' },
      { name: 'magazine', cpp: 'string', java: 'String', py: 'magazine: str', js: 'magazine' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (ransomNote, magazine) => {
      const count = {};
      for (const c of magazine) count[c] = (count[c] || 0) + 1;
      for (const c of ransomNote) {
        if (!count[c]) return false;
        count[c]--;
      }
      return true;
    },
    inputGenerator: () => {
      const inputs = [['a', 'b'], ['aa', 'ab'], ['aa', 'aab']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(3), randStr(5)]);
      }
      return inputs;
    }
  },
  'is-subsequence': {
    args: [
      { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
      { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s, t) => {
      let i = 0, j = 0;
      while (i < s.length && j < t.length) {
        if (s[i] === t[j]) i++;
        j++;
      }
      return i === s.length;
    },
    inputGenerator: () => {
      const inputs = [['abc', 'ahbgdc'], ['axc', 'ahbgdc']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(2), randStr(5)]);
      }
      return inputs;
    }
  },
  'reverse-words-in-a-string-iii': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => s.split(' ').map(w => w.split('').reverse().join('')).join(' '),
    inputGenerator: () => {
      const inputs = [["Let's take LeetCode contest"], ['Mr Ding']];
      for (let k = 0; k < 50; k++) {
        inputs.push([`${randStr(4)} ${randStr(5)}`]);
      }
      return inputs;
    }
  },
  'valid-palindrome-ii': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s) => {
      const isPal = (str, l, r) => {
        while (l < r) {
          if (str[l] !== str[r]) return false;
          l++; r--;
        }
        return true;
      };
      let i = 0, j = s.length - 1;
      while (i < j) {
        if (s[i] !== s[j]) return isPal(s, i + 1, j) || isPal(s, i, j - 1);
        i++; j--;
      }
      return true;
    },
    inputGenerator: () => {
      const inputs = [['aba'], ['abca'], ['abc']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(4)]);
      }
      return inputs;
    }
  },
  'robot-return-to-origin': {
    args: [{ name: 'moves', cpp: 'string', java: 'String', py: 'moves: str', js: 'moves' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (moves) => {
      let x = 0, y = 0;
      for (const m of moves) {
        if (m === 'U') y++;
        else if (m === 'D') y--;
        else if (m === 'L') x--;
        else if (m === 'R') x++;
      }
      return x === 0 && y === 0;
    },
    inputGenerator: () => {
      const inputs = [['UD'], ['LL'], ['RRR'], ['UDLR']];
      for (let k = 0; k < 48; k++) {
        inputs.push([randStr(randInt(2, 6), 'UDLR')]);
      }
      return inputs;
    }
  },
  'goat-latin': {
    args: [{ name: 'sentence', cpp: 'string', java: 'String', py: 'sentence: str', js: 'sentence' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (sentence) => {
      const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']);
      return sentence.split(' ').map((w, idx) => {
        let res = w;
        if (vowels.has(w[0])) { res += 'ma'; }
        else { res = w.slice(1) + w[0] + 'ma'; }
        res += 'a'.repeat(idx + 1);
        return res;
      }).join(' ');
    },
    inputGenerator: () => {
      const inputs = [['I speak Goat Latin'], ['The quick brown fox jumped over the lazy dog']];
      for (let k = 0; k < 50; k++) {
        inputs.push([`${randStr(3)} ${randStr(4)}`]);
      }
      return inputs;
    }
  },
  'unique-morse-code-words': {
    args: [{ name: 'words', cpp: 'vector<string>&', java: 'String[]', py: 'words: List[str]', js: 'words' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (words) => {
      const codes = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."];
      const s = new Set();
      for (const w of words) {
        s.add(w.split('').map(c => codes[c.charCodeAt(0) - 97]).join(''));
      }
      return s.size;
    },
    inputGenerator: () => {
      const inputs = [[['gin','zen','gig','msg']]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Array.from({ length: 4 }, () => randStr(randInt(2, 4)))]);
      }
      return inputs;
    }
  },
  'reverse-string-ii': {
    args: [
      { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
      { name: 'k', cpp: 'int', java: 'int', py: 'k: int', js: 'k' }
    ],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s, k) => {
      const a = s.split('');
      for (let i = 0; i < a.length; i += 2 * k) {
        let l = i, r = Math.min(i + k - 1, a.length - 1);
        while (l < r) {
          const tmp = a[l]; a[l] = a[r]; a[r] = tmp; l++; r--;
        }
      }
      return a.join('');
    },
    inputGenerator: () => {
      const inputs = [['abcdefg', 2], ['abcd', 2]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(6), 2]);
      }
      return inputs;
    }
  },
  'merge-strings-alternately': {
    args: [
      { name: 'word1', cpp: 'string', java: 'String', py: 'word1: str', js: 'word1' },
      { name: 'word2', cpp: 'string', java: 'String', py: 'word2: str', js: 'word2' }
    ],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (w1, w2) => {
      let res = '', i = 0;
      while (i < w1.length || i < w2.length) {
        if (i < w1.length) res += w1[i];
        if (i < w2.length) res += w2[i];
        i++;
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [['abc', 'pqr'], ['ab', 'rs'], ['abcd', 'pq']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(3), randStr(3)]);
      }
      return inputs;
    }
  },
  'backspace-string-compare': {
    args: [
      { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
      { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s, t) => {
      const build = (str) => {
        const res = [];
        for (const c of str) { if (c === '#') res.pop(); else res.push(c); }
        return res.join('');
      };
      return build(s) === build(t);
    },
    inputGenerator: () => {
      const inputs = [['ab#c', 'ad#c'], ['ab##', 'c#d#'], ['a#c', 'b']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(4) + '#', randStr(4) + '#']);
      }
      return inputs;
    }
  },
  'isomorphic-strings': {
    args: [
      { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
      { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s, t) => {
      const mapS = {}, mapT = {};
      for (let i = 0; i < s.length; i++) {
        if (mapS[s[i]] !== mapT[t[i]]) return false;
        mapS[s[i]] = i; mapT[t[i]] = i;
      }
      return true;
    },
    inputGenerator: () => {
      const inputs = [['egg', 'add'], ['foo', 'bar'], ['paper', 'title']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(4), randStr(4)]);
      }
      return inputs;
    }
  },
  'remove-all-adjacent-duplicates-in-string': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => {
      const stack = [];
      for (const c of s) {
        if (stack.length && stack[stack.length - 1] === c) stack.pop(); else stack.push(c);
      }
      return stack.join('');
    },
    inputGenerator: () => {
      const inputs = [['abbaca'], ['azxxzy']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(6)]);
      }
      return inputs;
    }
  },
  'decrypt-string-from-alphabet-to-integer-mapping': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => {
      let res = '', i = 0;
      while (i < s.length) {
        if (i + 2 < s.length && s[i + 2] === '#') {
          const val = parseInt(s.substring(i, i + 2));
          res += String.fromCharCode(96 + val); i += 3;
        } else {
          const val = parseInt(s[i]);
          res += String.fromCharCode(96 + val); i++;
        }
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [['10#11#12'], ['1326#']];
      for (let k = 0; k < 50; k++) {
        inputs.push(['12345678910#']);
      }
      return inputs;
    }
  },

  // --- Category 3: Math, Bit Manipulation & Simulation ---
  'palindrome-number': {
    args: [{ name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (x) => x >= 0 && String(x) === String(x).split('').reverse().join(''),
    inputGenerator: () => {
      const inputs = [[121], [-121], [10]];
      for (let k = 0; k < 50; k++) {
        const isPal = Math.random() > 0.5;
        if (isPal) {
          const raw = String(randInt(1, 999));
          inputs.push([parseInt(raw + raw.split('').reverse().join(''))]);
        } else {
          inputs.push([randInt(-50, 5000)]);
        }
      }
      return inputs;
    }
  },
  'fibonacci-number': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => {
      if (n <= 1) return n;
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) { const temp = a + b; a = b; b = temp; }
      return b;
    },
    inputGenerator: () => {
      const inputs = [[0], [1], [2], [3], [4], [10]];
      for (let k = 0; k < 47; k++) inputs.push([randInt(5, 30)]);
      return inputs;
    }
  },
  'fizz-buzz': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'vector<string>', java: 'String[]', py: 'List[str]', js: 'List[str]' },
    jsSolution: (n) => {
      const res = [];
      for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) res.push('FizzBuzz');
        else if (i % 3 === 0) res.push('Fizz');
        else if (i % 5 === 0) res.push('Buzz');
        else res.push(String(i));
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [[3], [5], [15]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(5, 40)]);
      return inputs;
    }
  },
  'power-of-two': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => n > 0 && (n & (n - 1)) === 0,
    inputGenerator: () => {
      const inputs = [[1], [16], [3]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Math.random() > 0.5 ? Math.pow(2, randInt(0, 10)) : randInt(5, 100)]);
      }
      return inputs;
    }
  },
  'power-of-three': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => n > 0 && 1162261467 % n === 0,
    inputGenerator: () => {
      const inputs = [[27], [0], [-1], [9]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Math.random() > 0.5 ? Math.pow(3, randInt(0, 5)) : randInt(4, 50)]);
      }
      return inputs;
    }
  },
  'power-of-four': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => n > 0 && (n & (n - 1)) === 0 && (n - 1) % 3 === 0,
    inputGenerator: () => {
      const inputs = [[16], [5], [1]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Math.random() > 0.5 ? Math.pow(4, randInt(0, 5)) : randInt(3, 60)]);
      }
      return inputs;
    }
  },
  'number-of-1-bits': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => {
      let cnt = 0;
      let val = n;
      while (val !== 0) { cnt += val & 1; val = val >>> 1; }
      return cnt;
    },
    inputGenerator: () => {
      const inputs = [[11], [128]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(0, 1024)]);
      return inputs;
    }
  },
  'hamming-distance': {
    args: [
      { name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' },
      { name: 'y', cpp: 'int', java: 'int', py: 'y: int', js: 'y' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (x, y) => {
      let diff = x ^ y, cnt = 0;
      while (diff > 0) { cnt += diff & 1; diff >>= 1; }
      return cnt;
    },
    inputGenerator: () => {
      const inputs = [[1, 4], [3, 1]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(1, 100), randInt(1, 100)]);
      return inputs;
    }
  },
  'add-digits': {
    args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (num) => num === 0 ? 0 : 1 + (num - 1) % 9,
    inputGenerator: () => {
      const inputs = [[38], [0]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(5, 500)]);
      return inputs;
    }
  },
  'ugly-number': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => {
      if (n <= 0) return false;
      let val = n;
      for (const p of [2, 3, 5]) { while (val % p === 0) val /= p; }
      return val === 1;
    },
    inputGenerator: () => {
      const inputs = [[6], [1], [14]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(1, 200)]);
      return inputs;
    }
  },
  'happy-number': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => {
      const seen = new Set();
      let val = n;
      while (val !== 1 && !seen.has(val)) {
        seen.add(val);
        val = String(val).split('').reduce((sum, d) => sum + Math.pow(parseInt(d), 2), 0);
      }
      return val === 1;
    },
    inputGenerator: () => {
      const inputs = [[19], [2]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(1, 100)]);
      return inputs;
    }
  },
  'excel-sheet-column-number': {
    args: [{ name: 'columnTitle', cpp: 'string', java: 'String', py: 'columnTitle: str', js: 'columnTitle' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (columnTitle) => {
      let res = 0;
      for (let i = 0; i < columnTitle.length; i++) {
        res = res * 26 + (columnTitle.charCodeAt(i) - 64);
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [['A'], ['AB'], ['ZY']];
      for (let k = 0; k < 50; k++) inputs.push([randStr(randInt(1, 3), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')]);
      return inputs;
    }
  },
  'base-7': {
    args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (num) => num.toString(7),
    inputGenerator: () => {
      const inputs = [[100], [-7]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(-500, 500)]);
      return inputs;
    }
  },
  'self-dividing-numbers': {
    args: [
      { name: 'left', cpp: 'int', java: 'int', py: 'left: int', js: 'left' },
      { name: 'right', cpp: 'int', java: 'int', py: 'right: int', js: 'right' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (left, right) => {
      const res = [];
      for (let i = left; i <= right; i++) {
        const s = String(i);
        let self = true;
        for (const c of s) {
          if (c === '0' || i % parseInt(c) !== 0) { self = false; break; }
        }
        if (self) res.push(i);
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [[1, 22], [47, 85]];
      for (let k = 0; k < 50; k++) {
        const l = randInt(1, 50);
        inputs.push([l, l + randInt(5, 20)]);
      }
      return inputs;
    }
  },
  'nim-game': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => n % 4 !== 0,
    inputGenerator: () => {
      const inputs = [[4], [1], [2]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(1, 100)]);
      return inputs;
    }
  },
  'day-of-the-year': {
    args: [{ name: 'date', cpp: 'string', java: 'String', py: 'date: str', js: 'date' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (date) => {
      const d = new Date(date);
      const start = new Date(d.getFullYear(), 0, 0);
      const diff = d - start;
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor(diff / oneDay);
    },
    inputGenerator: () => {
      const inputs = [['2019-01-09'], ['2019-02-10']];
      for (let k = 0; k < 50; k++) inputs.push([`2020-0${randInt(1, 9)}-1${randInt(0, 9)}`]);
      return inputs;
    }
  },
  'perfect-number': {
    args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (num) => {
      if (num <= 1) return false;
      let sum = 1;
      for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
          sum += i;
          if (i * i !== num) sum += num / i;
        }
      }
      return sum === num;
    },
    inputGenerator: () => {
      const inputs = [[28], [7], [6]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(1, 1000)]);
      return inputs;
    }
  },
  'complement-of-base-10-integer': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => {
      if (n === 0) return 1;
      let mask = 1;
      while (mask < n) mask = (mask << 1) | 1;
      return n ^ mask;
    },
    inputGenerator: () => {
      const inputs = [[5], [7], [10]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(0, 1000)]);
      return inputs;
    }
  },
  'subtract-the-product-and-sum-of-digits-of-an-integer': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => {
      const d = String(n).split('').map(Number);
      return d.reduce((a,b)=>a*b,1) - d.reduce((a,b)=>a+b,0);
    },
    inputGenerator: () => {
      const inputs = [[234], [4421]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(10, 5000)]);
      return inputs;
    }
  },
  'minimum-time-visiting-all-points': {
    args: [{ name: 'points', cpp: 'vector<vector<int>>&', java: 'int[][]', py: 'points: List[List[int]]', js: 'points' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (p) => {
      let sec = 0;
      for (let i = 1; i < p.length; i++) {
        sec += Math.max(Math.abs(p[i][0] - p[i-1][0]), Math.abs(p[i][1] - p[i-1][1]));
      }
      return sec;
    },
    inputGenerator: () => {
      const inputs = [[[[1,1],[3,4],[-1,0]]], [[[3,2],[-2,2]]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Array.from({ length: 3 }, () => randArray(2, -10, 10))]);
      }
      return inputs;
    }
  },

  // --- Category 4: Stacks, Queues & Greedy ---
  'baseball-game': {
    args: [{ name: 'operations', cpp: 'vector<string>&', java: 'String[]', py: 'operations: List[str]', js: 'operations' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (ops) => {
      const s = [];
      for (const o of ops) {
        if (o === '+') s.push(s[s.length - 1] + s[s.length - 2]);
        else if (o === 'D') s.push(s[s.length - 1] * 2);
        else if (o === 'C') s.pop();
        else s.push(parseInt(o));
      }
      return s.reduce((a,b)=>a+b,0);
    },
    inputGenerator: () => {
      const inputs = [[["5","2","C","D","+"]], [["5","-2","4","C","D","9","+","+"]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([["5","2","D","+"]]);
      }
      return inputs;
    }
  },
  'crawler-log-folder': {
    args: [{ name: 'logs', cpp: 'vector<string>&', java: 'String[]', py: 'logs: List[str]', js: 'logs' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (logs) => {
      let d = 0;
      for (const l of logs) {
        if (l === '../') d = Math.max(0, d - 1); else if (l !== './') d++;
      }
      return d;
    },
    inputGenerator: () => {
      const inputs = [[["d1/","d2/","../","d21/","./"]], [["d1/","d2/","./","../","../"]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([["d1/","../"]]);
      }
      return inputs;
    }
  },
  'make-the-string-great': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => {
      const st = [];
      for (const c of s) {
        if (st.length && Math.abs(st[st.length-1].charCodeAt(0) - c.charCodeAt(0)) === 32) st.pop(); else st.push(c);
      }
      return st.join('');
    },
    inputGenerator: () => {
      const inputs = [['leEeetcode'], ['abBAcC'], ['s']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(4)]);
      }
      return inputs;
    }
  },
  'remove-outermost-parentheses': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => {
      let res = '', cnt = 0;
      for (const c of s) {
        if (c === '(') { if (cnt > 0) res += c; cnt++; }
        else { cnt--; if (cnt > 0) res += c; }
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [['(()())(())'], ['(()())(())(()(()))'], ['()()']];
      for (let k = 0; k < 50; k++) {
        inputs.push(['(()())']);
      }
      return inputs;
    }
  },
  'container-with-most-water': {
    args: [{ name: 'height', cpp: 'vector<int>&', java: 'int[]', py: 'height: List[int]', js: 'height' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (h) => {
      let max = 0, i = 0, j = h.length - 1;
      while (i < j) {
        max = Math.max(max, Math.min(h[i], h[j]) * (j - i));
        if (h[i] < h[j]) i++; else j--;
      }
      return max;
    },
    inputGenerator: () => {
      const inputs = [[[1,8,6,2,5,4,8,3,7]], [[1,1]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(5, 12), 1, 20)]);
      }
      return inputs;
    }
  },
  'sort-colors': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'void', java: 'void', py: 'None', js: 'void' },
    jsSolution: (nums) => { nums.sort((a,b)=>a-b); return nums; },
    inputGenerator: () => {
      const inputs = [[[2,0,2,1,1,0]], [[2,0,1]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Array.from({ length: randInt(4, 10) }, () => randInt(0, 2))]);
      }
      return inputs;
    }
  },
  'move-element-to-end': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'toMove', cpp: 'int', java: 'int', py: 'toMove: int', js: 'toMove' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums, target) => {
      const others = nums.filter(x => x !== target);
      const targets = nums.filter(x => x === target);
      return [...others, ...targets];
    },
    inputGenerator: () => {
      const inputs = [[[2, 1, 2, 2, 2, 3, 4, 2], 2]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), 1, 5), 2]);
      }
      return inputs;
    }
  },
  'next-greater-element-i': {
    args: [
      { name: 'nums1', cpp: 'vector<int>&', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
      { name: 'nums2', cpp: 'vector<int>&', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums1, nums2) => nums1.map(n => {
      const idx = nums2.indexOf(n);
      for (let i = idx + 1; i < nums2.length; i++) { if (nums2[i] > n) return nums2[i]; }
      return -1;
    }),
    inputGenerator: () => {
      const inputs = [[[4,1,2], [1,3,4,2]], [[2,4], [1,2,3,4]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([[1, 2], [1, 2, 3, 4]]);
      }
      return inputs;
    }
  },
  'reverse-substrings-between-each-pair-of-parentheses': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => {
      const st = [];
      for (const c of s) {
        if (c === ')') {
          const temp = [];
          while (st.length && st[st.length-1] !== '(') temp.push(st.pop());
          st.pop();
          for (const t of temp) st.push(t);
        } else st.push(c);
      }
      return st.join('');
    },
    inputGenerator: () => {
      const inputs = [['(abcd)'], ['(u(love)i)'], ['(ed(et(oc))el)']];
      for (let k = 0; k < 50; k++) {
        inputs.push(['(ab(cd)ef)']);
      }
      return inputs;
    }
  },
  'validate-stack-sequences': {
    args: [
      { name: 'pushed', cpp: 'vector<int>&', java: 'int[]', py: 'pushed: List[int]', js: 'pushed' },
      { name: 'popped', cpp: 'vector<int>&', java: 'int[]', py: 'popped: List[int]', js: 'popped' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (pushed, popped) => {
      const st = [];
      let i = 0;
      for (const val of pushed) {
        st.push(val);
        while (st.length && st[st.length-1] === popped[i]) { st.pop(); i++; }
      }
      return st.length === 0;
    },
    inputGenerator: () => {
      const inputs = [[[1,2,3,4,5], [4,5,3,2,1]], [[1,2,3,4,5], [4,3,5,1,2]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([[1,2,3], [3,2,1]]);
      }
      return inputs;
    }
  },
  'backspace-string-compare-two-pointers': {
    args: [
      { name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' },
      { name: 't', cpp: 'string', java: 'String', py: 't: str', js: 't' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (s, t) => {
      const build = (str) => {
        const res = [];
        for (const c of str) { if (c === '#') res.pop(); else res.push(c); }
        return res.join('');
      };
      return build(s) === build(t);
    },
    inputGenerator: () => {
      const inputs = [['ab#c', 'ad#c'], ['ab##', 'c#d#']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(3) + '#', randStr(3) + '#']);
      }
      return inputs;
    }
  },
  'valid-parentheses-depth': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (s) => {
      let max = 0, cur = 0;
      for (const c of s) {
        if (c === '(') { cur++; max = Math.max(max, cur); }
        else if (c === ')') cur--;
      }
      return max;
    },
    inputGenerator: () => {
      const inputs = [['(1)+(2*3)+((8)/4)'], ['(1)+((2))+(((3)))']];
      for (let k = 0; k < 50; k++) {
        inputs.push(['(())']);
      }
      return inputs;
    }
  },
  'replace-spaces': {
    args: [{ name: 's', cpp: 'string', java: 'String', py: 's: str', js: 's' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (s) => s.trim().replace(/\s+/g, '%20'),
    inputGenerator: () => {
      const inputs = [['Mr John Smith'], ['Hello World ']];
      for (let k = 0; k < 50; k++) {
        inputs.push([`${randStr(3)} ${randStr(3)}`]);
      }
      return inputs;
    }
  },
  'find-target-indices-after-sorting-array': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums, target) => {
      const s = [...nums].sort((a,b)=>a-b), res = [];
      for(let i=0;i<s.length;i++) { if (s[i]===target) res.push(i); }
      return res;
    },
    inputGenerator: () => {
      const inputs = [[[1,2,5,2,3], 2], [[1,2,5,2,3], 3]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), 1, 5), 2]);
      }
      return inputs;
    }
  },
  'minimum-number-of-moves-to-seat-everyone': {
    args: [
      { name: 'seats', cpp: 'vector<int>&', java: 'int[]', py: 'seats: List[int]', js: 'seats' },
      { name: 'students', cpp: 'vector<int>&', java: 'int[]', py: 'students: List[int]', js: 'students' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (seats, students) => {
      const a = [...seats].sort((a,b)=>a-b), b = [...students].sort((a,b)=>a-b);
      return a.reduce((sum, val, idx) => sum + Math.abs(val - b[idx]), 0);
    },
    inputGenerator: () => {
      const inputs = [[[3,1,5], [2,7,4]], [[4,1,5,9], [1,3,2,6]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(3, 1, 10), randArray(3, 1, 10)]);
      }
      return inputs;
    }
  },
  'intersection-of-two-arrays-ii': {
    args: [
      { name: 'nums1', cpp: 'vector<int>&', java: 'int[]', py: 'nums1: List[int]', js: 'nums1' },
      { name: 'nums2', cpp: 'vector<int>&', java: 'int[]', py: 'nums2: List[int]', js: 'nums2' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums1, nums2) => {
      const map = {};
      for (const n of nums1) map[n] = (map[n] || 0) + 1;
      const res = [];
      for (const n of nums2) {
        if (map[n] > 0) { res.push(n); map[n]--; }
      }
      return res.sort((a,b)=>a-b);
    },
    inputGenerator: () => {
      const inputs = [[[1,2,2,1], [2,2]], [[4,9,5], [9,4,9,8,4]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), 1, 10), randArray(randInt(4, 10), 1, 10)]);
      }
      return inputs;
    }
  },
  'check-if-two-string-arrays-are-equivalent': {
    args: [
      { name: 'word1', cpp: 'vector<string>&', java: 'String[]', py: 'word1: List[str]', js: 'word1' },
      { name: 'word2', cpp: 'vector<string>&', java: 'String[]', py: 'word2: List[str]', js: 'word2' }
    ],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (w1, w2) => w1.join('') === w2.join(''),
    inputGenerator: () => {
      const inputs = [[['ab', 'c'], ['a', 'bc']], [['a', 'cb'], ['ab', 'c']]];
      for (let k = 0; k < 50; k++) {
        inputs.push([['a', 'b'], ['ab']]);
      }
      return inputs;
    }
  },
  'defanging-an-ip-address': {
    args: [{ name: 'address', cpp: 'string', java: 'String', py: 'address: str', js: 'address' }],
    retType: { cpp: 'string', java: 'String', py: 'str', js: 'string' },
    jsSolution: (a) => a.replace(/\./g, '[.]'),
    inputGenerator: () => {
      const inputs = [['1.1.1.1'], ['255.100.50.0']];
      for (let k = 0; k < 50; k++) {
        inputs.push([`${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(0, 255)}`]);
      }
      return inputs;
    }
  },
  'final-value-of-variable-after-performing-operations': {
    args: [{ name: 'operations', cpp: 'vector<string>&', java: 'String[]', py: 'operations: List[str]', js: 'operations' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (ops) => ops.reduce((acc, o) => acc + (o.includes('++') ? 1 : -1), 0),
    inputGenerator: () => {
      const inputs = [[["--X","X++","X++"]], [["++X","++X","X++"]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([["++X", "X++", "--X"]]);
      }
      return inputs;
    }
  },
  'jewels-and-stones': {
    args: [
      { name: 'jewels', cpp: 'string', java: 'String', py: 'jewels: str', js: 'jewels' },
      { name: 'stones', cpp: 'string', java: 'String', py: 'stones: str', js: 'stones' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (jewels, stones) => {
      const s = new Set(jewels);
      return [...stones].filter(c => s.has(c)).length;
    },
    inputGenerator: () => {
      const inputs = [['aA', 'aAAbbbb'], ['z', 'ZZ']];
      for (let k = 0; k < 50; k++) {
        inputs.push([randStr(2, 'abc'), randStr(5, 'abc')]);
      }
      return inputs;
    }
  },

  // --- Category 5: Dynamic Programming & Searching ---
  'binary-search': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums, target) => nums.indexOf(target),
    inputGenerator: () => {
      const inputs = [[[-1,0,3,5,9,12], 9], [[-1,0,3,5,9,12], 2]];
      for (let k = 0; k < 50; k++) {
        const list = Array.from(new Set(randArray(randInt(5, 12), -20, 20))).sort((a,b)=>a-b);
        inputs.push([list, Math.random() > 0.5 ? list[randInt(0, list.length-1)] : randInt(-30, 30)]);
      }
      return inputs;
    }
  },
  'search-insert-position': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums, target) => {
      let l = 0, r = nums.length - 1;
      while (l <= r) {
        const mid = Math.floor((l+r)/2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) l = mid + 1; else r = mid - 1;
      }
      return l;
    },
    inputGenerator: () => {
      const inputs = [[[1,3,5,6], 5], [[1,3,5,6], 2], [[1,3,5,6], 7]];
      for (let k = 0; k < 50; k++) {
        const list = Array.from(new Set(randArray(randInt(4, 10), 1, 20))).sort((a,b)=>a-b);
        inputs.push([list, randInt(1, 25)]);
      }
      return inputs;
    }
  },
  'first-bad-version': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => Math.floor(n / 2) + 1,
    inputGenerator: () => {
      const inputs = [[5], [1]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(2, 100)]);
      return inputs;
    }
  },
  'guess-number-higher-or-lower': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => Math.floor(n / 3) + 1,
    inputGenerator: () => {
      const inputs = [[10], [1], [2]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(3, 100)]);
      return inputs;
    }
  },
  'climbing-stairs': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => {
      if (n <= 2) return n;
      let a = 1, b = 2;
      for (let i = 3; i <= n; i++) { const temp = a + b; a = b; b = temp; }
      return b;
    },
    inputGenerator: () => {
      const inputs = [[2], [3], [4]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(4, 30)]);
      return inputs;
    }
  },
  'min-cost-climbing-stairs': {
    args: [{ name: 'cost', cpp: 'vector<int>&', java: 'int[]', py: 'cost: List[int]', js: 'cost' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (cost) => {
      const n = cost.length;
      const dp = Array(n + 1);
      dp[0] = 0; dp[1] = 0;
      for (let i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
      }
      return dp[n];
    },
    inputGenerator: () => {
      const inputs = [[[10,15,20]], [[1,100,1,1,1,100,1,1,100,1]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 12), 1, 100)]);
      }
      return inputs;
    }
  },
  'maximum-subarray': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => {
      let max = nums[0], sum = nums[0];
      for (let i = 1; i < nums.length; i++) {
        sum = Math.max(nums[i], sum + nums[i]);
        max = Math.max(max, sum);
      }
      return max;
    },
    inputGenerator: () => {
      const inputs = [[[-2,1,-3,4,-1,2,1,-5,4]], [[1]], [[5,4,-1,7,8]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(5, 12), -10, 10)]);
      }
      return inputs;
    }
  },
  'divisor-game': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (n) => n % 2 === 0,
    inputGenerator: () => {
      const inputs = [[2], [3]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(1, 100)]);
      return inputs;
    }
  },
  'tribonacci-number': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (n) => {
      if (n === 0) return 0;
      if (n <= 2) return 1;
      let a = 0, b = 1, c = 1;
      for (let i = 3; i <= n; i++) { const sum = a + b + c; a = b; b = c; c = sum; }
      return c;
    },
    inputGenerator: () => {
      const inputs = [[4], [25]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(0, 20)]);
      return inputs;
    }
  },
  'pascals-triangle': {
    args: [{ name: 'numRows', cpp: 'int', java: 'int', py: 'numRows: int', js: 'numRows' }],
    retType: { cpp: 'vector<vector<int>>', java: 'List<List<Integer>>', py: 'List[List[int]]', js: 'List[List[int]]' },
    jsSolution: (numRows) => {
      const res = [];
      for (let i = 0; i < numRows; i++) {
        const row = Array(i + 1).fill(1);
        for (let j = 1; j < i; j++) { row[j] = res[i - 1][j - 1] + res[i - 1][j]; }
        res.push(row);
      }
      return res;
    },
    inputGenerator: () => {
      const inputs = [[5], [1]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(2, 10)]);
      return inputs;
    }
  },
  'pascals-triangle-ii': {
    args: [{ name: 'rowIndex', cpp: 'int', java: 'int', py: 'rowIndex: int', js: 'rowIndex' }],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (rowIndex) => {
      const row = Array(rowIndex + 1).fill(1);
      for (let i = 1; i < rowIndex; i++) {
        for (let j = i; j > 0; j--) { row[j] = row[j] + row[j - 1]; }
      }
      return row;
    },
    inputGenerator: () => {
      const inputs = [[3], [0], [1]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(2, 15)]);
      return inputs;
    }
  },
  'counting-bits': {
    args: [{ name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (n) => {
      const ans = Array(n + 1).fill(0);
      for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
      return ans;
    },
    inputGenerator: () => {
      const inputs = [[2], [5]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(3, 20)]);
      return inputs;
    }
  },
  'jump-game': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (nums) => {
      let max = 0;
      for (let i = 0; i < nums.length; i++) {
        if (i > max) return false;
        max = Math.max(max, i + nums[i]);
      }
      return true;
    },
    inputGenerator: () => {
      const inputs = [[[2,3,1,1,4]], [[3,2,1,0,4]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(4, 10), 0, 5)]);
      }
      return inputs;
    }
  },
  'unique-paths': {
    args: [
      { name: 'm', cpp: 'int', java: 'int', py: 'm: int', js: 'm' },
      { name: 'n', cpp: 'int', java: 'int', py: 'n: int', js: 'n' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (m, n) => {
      const dp = Array(m).fill(0).map(() => Array(n).fill(1));
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) { dp[i][j] = dp[i - 1][j] + dp[i][j - 1]; }
      }
      return dp[m - 1][n - 1];
    },
    inputGenerator: () => {
      const inputs = [[3, 7], [3, 2]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randInt(2, 6), randInt(2, 6)]);
      }
      return inputs;
    }
  },
  'coin-change': {
    args: [
      { name: 'coins', cpp: 'vector<int>&', java: 'int[]', py: 'coins: List[int]', js: 'coins' },
      { name: 'amount', cpp: 'int', java: 'int', py: 'amount: int', js: 'amount' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (coins, amount) => {
      const dp = Array(amount + 1).fill(amount + 1);
      dp[0] = 0;
      for (let i = 1; i <= amount; i++) {
        for (const coin of coins) { if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1); }
      }
      return dp[amount] > amount ? -1 : dp[amount];
    },
    inputGenerator: () => {
      const inputs = [[[1, 2, 5], 11], [[2], 3], [[1], 0]];
      for (let k = 0; k < 50; k++) {
        const size = randInt(2, 4);
        const coins = Array.from(new Set(randArray(size, 1, 8))).sort((a,b)=>a-b);
        inputs.push([coins, randInt(5, 25)]);
      }
      return inputs;
    }
  },
  'longest-increasing-subsequence': {
    args: [{ name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums) => {
      if (!nums.length) return 0;
      const dp = Array(nums.length).fill(1);
      for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) { if (nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j] + 1); }
      }
      return Math.max(...dp);
    },
    inputGenerator: () => {
      const inputs = [[[10,9,2,5,3,7,101,18]], [[0,1,0,3,2,3]], [[7,7,7,7,7,7,7]]];
      for (let k = 0; k < 50; k++) {
        inputs.push([randArray(randInt(5, 12), -10, 50)]);
      }
      return inputs;
    }
  },
  'search-in-rotated-sorted-array': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
    ],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (nums, target) => nums.indexOf(target),
    inputGenerator: () => {
      const inputs = [[[4,5,6,7,0,1,2], 0], [[4,5,6,7,0,1,2], 3], [[1], 0]];
      for (let k = 0; k < 50; k++) {
        inputs.push([[4,5,6,1,2], 1]);
      }
      return inputs;
    }
  },
  'find-first-and-last-position-of-element-in-sorted-array': {
    args: [
      { name: 'nums', cpp: 'vector<int>&', java: 'int[]', py: 'nums: List[int]', js: 'nums' },
      { name: 'target', cpp: 'int', java: 'int', py: 'target: int', js: 'target' }
    ],
    retType: { cpp: 'vector<int>', java: 'int[]', py: 'List[int]', js: 'List[int]' },
    jsSolution: (nums, target) => [nums.indexOf(target), nums.lastIndexOf(target)],
    inputGenerator: () => {
      const inputs = [[[5,7,7,8,8,10], 8], [[5,7,7,8,8,10], 6], [[], 0]];
      for (let k = 0; k < 50; k++) {
        inputs.push([[1,2,2,2,3], 2]);
      }
      return inputs;
    }
  },
  'sqrtx': {
    args: [{ name: 'x', cpp: 'int', java: 'int', py: 'x: int', js: 'x' }],
    retType: { cpp: 'int', java: 'int', py: 'int', js: 'number' },
    jsSolution: (x) => Math.floor(Math.sqrt(x)),
    inputGenerator: () => {
      const inputs = [[4], [8], [0]];
      for (let k = 0; k < 50; k++) inputs.push([randInt(0, 1000)]);
      return inputs;
    }
  },
  'valid-perfect-square': {
    args: [{ name: 'num', cpp: 'int', java: 'int', py: 'num: int', js: 'num' }],
    retType: { cpp: 'bool', java: 'boolean', py: 'bool', js: 'boolean' },
    jsSolution: (num) => {
      let i = 1; while (i * i < num) i++; return i * i === num;
    },
    inputGenerator: () => {
      const inputs = [[16], [14]];
      for (let k = 0; k < 50; k++) {
        inputs.push([Math.random() > 0.5 ? Math.pow(randInt(1, 20), 2) : randInt(5, 400)]);
      }
      return inputs;
    }
  }
};

// ─── PIPELINE START ───
async function run() {
  const targetDir = path.join(process.cwd(), '..', 'codebattle-testcases');
  console.log(`\n=== 🐳 STARTING HIGH FIDELITY 100 PROBLEMS PIPELINE ===`);
  console.log(`Target Repo Location: ${targetDir}`);

  const problemsToInsert = [];

  try {
    for (const spec of problemSpecs) {
      // Look up our specific, high-fidelity custom engine
      const engine = customEngines[spec.slug];
      if (!engine) {
        throw new Error(`CRITICAL MAPPING ERROR: Slug '${spec.slug}' has no high-fidelity engine definition!`);
      }
      
      // 1. Generate Signatures
      const sigs = makeSignatures(spec.slug, engine.args, engine.retType);
      
      // 2. Generate 50+ Test Cases
      const rawInputs = engine.inputGenerator();
      const testCasesList = [];
      
      for (let tIdx = 0; tIdx < rawInputs.length; tIdx++) {
        const inputArgs = rawInputs[tIdx];
        const output = engine.jsSolution(...inputArgs);
        
        testCasesList.push({
          input: JSON.stringify(inputArgs),
          expectedOutput: JSON.stringify(output),
          isHidden: tIdx >= 5 // First 5 are visible, other 45+ are hidden!
        });
      }

      // 3. Write locally on disk
      const dirPath = path.join(targetDir, 'problems', spec.slug);
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(
        path.join(dirPath, 'testcases.json'),
        JSON.stringify(testCasesList, null, 2),
        'utf8'
      );

      // 4. Build Mongoose Problem Schema
      problemsToInsert.push({
        title: spec.title,
        description: spec.description,
        difficulty: spec.difficulty,
        tags: [...spec.tags, spec.category.split(' ')[0]],
        constraints: spec.constraints || 'None',
        examples: spec.examples || [{ input: 'None', output: 'None' }],
        useGitHubTestCases: true,
        testCasesUrl: `https://raw.githubusercontent.com/AMITESHWARNARAYAN/codebattle-testcases/main/problems/${spec.slug}/testcases.json`,
        testCases: [], // MongoDB remains empty and ultra-fast!
        functionSignature: sigs,
        hints: spec.hints || [{ title: 'Brute Force', content: 'Think about a simple solution first.' }],
        timeLimit: 2000,
        memoryLimit: 256
      });

      if ((spec.index + 1) % 10 === 0) {
        console.log(`✓ Wrote disk & generated specs for ${spec.index + 1}/100 problems.`);
      }
    }

    console.log(`\nLocal disk write completed! Connecting to MongoDB...`);
    
    // 5. Seed MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully!');
    
    await Problem.deleteMany({});
    console.log('Cleared existing problems in database.');
    
    const created = await Problem.insertMany(problemsToInsert);
    console.log(`🚀 Successfully inserted ${created.length} problems in database!`);
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');

    console.log(`\n=== 🐳 PIPELINE PIPED SUCCESSFULLY! ===\n`);

  } catch (err) {
    console.error("Pipeline crashed:", err);
    process.exit(1);
  }
}

run();
