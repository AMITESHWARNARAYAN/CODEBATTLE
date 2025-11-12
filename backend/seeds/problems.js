import Problem from '../models/Problem.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 9, so we return [0, 1].'
      }
    ],
    testCases: [
      {
        input: JSON.stringify([2, 7, 11, 15, 9]),
        expectedOutput: JSON.stringify([0, 1]),
        isHidden: false
      },
      {
        input: JSON.stringify([3, 2, 4, 6]),
        expectedOutput: JSON.stringify([1, 2]),
        isHidden: false
      },
      {
        input: JSON.stringify([3, 3, 6]),
        expectedOutput: JSON.stringify([0, 1]),
        isHidden: true
      }
    ],
    functionSignature: {
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    \n}'
    },
    timeLimit: 2000,
    memoryLimit: 256
  },
  {
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    constraints: '1 <= s.length <= 10^5',
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: 'The string "hello" becomes "olleh"'
      }
    ],
    testCases: [
      {
        input: JSON.stringify([['h', 'e', 'l', 'l', 'o']]),
        expectedOutput: JSON.stringify(['o', 'l', 'l', 'e', 'h']),
        isHidden: false
      },
      {
        input: JSON.stringify([['H', 'a', 'n', 'n', 'a', 'h']]),
        expectedOutput: JSON.stringify(['h', 'a', 'n', 'n', 'a', 'H']),
        isHidden: false
      }
    ],
    functionSignature: {
      cpp: 'void reverseString(vector<char>& s) {\n    \n}'
    },
    timeLimit: 2000,
    memoryLimit: 256
  },
  {
    title: 'Palindrome Number',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    difficulty: 'Easy',
    tags: ['Math'],
    constraints: '-2^31 <= x <= 2^31 - 1',
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      }
    ],
    testCases: [
      {
        input: JSON.stringify([121]),
        expectedOutput: JSON.stringify(true),
        isHidden: false
      },
      {
        input: JSON.stringify([-121]),
        expectedOutput: JSON.stringify(false),
        isHidden: false
      },
      {
        input: JSON.stringify([10]),
        expectedOutput: JSON.stringify(false),
        isHidden: true
      }
    ],
    functionSignature: {
      cpp: 'bool isPalindrome(int x) {\n    \n}'
    },
    timeLimit: 2000,
    memoryLimit: 256
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    constraints: '1 <= s.length <= 10^4',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The string contains valid parentheses.'
      }
    ],
    testCases: [
      {
        input: JSON.stringify(['()']),
        expectedOutput: JSON.stringify(true),
        isHidden: false
      },
      {
        input: JSON.stringify(['()[]{}'])  ,
        expectedOutput: JSON.stringify(true),
        isHidden: false
      },
      {
        input: JSON.stringify(['(]']),
        expectedOutput: JSON.stringify(false),
        isHidden: true
      }
    ],
    functionSignature: {
      cpp: 'bool isValid(string s) {\n    \n}'
    },
    timeLimit: 2000,
    memoryLimit: 256
  },
  {
    title: 'Merge Sorted Array',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of valid elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'],
    constraints: 'nums1.length == m + n, nums2.length == n',
    examples: [
      {
        input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        output: '[1,2,2,3,5,6]',
        explanation: 'The arrays are merged into [1,2,2,3,5,6]'
      }
    ],
    testCases: [
      {
        input: JSON.stringify([[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3]),
        expectedOutput: JSON.stringify([1, 2, 2, 3, 5, 6]),
        isHidden: false
      }
    ],
    functionSignature: {
      cpp: 'void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    \n}'
    },
    timeLimit: 2000,
    memoryLimit: 256
  }
];

const seedProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Insert new problems
    const created = await Problem.insertMany(problems);
    console.log(`Created ${created.length} problems`);

    await mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedProblems();

