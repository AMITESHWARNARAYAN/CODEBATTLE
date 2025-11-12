import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from './models/Topic.js';
import Problem from './models/Problem.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedTopics = async () => {
  try {
    // Check if topics already exist
    const existingTopics = await Topic.countDocuments();
    if (existingTopics > 0) {
      console.log('⚠️  Topics already exist. Skipping seed.');
      process.exit(0);
    }

    console.log('🌱 Seeding topics and problems...\n');

    // Create topics
    const topicsData = [
      {
        name: 'Arrays',
        description: 'Master array manipulation and common array problems',
        icon: '📦',
        color: 'blue'
      },
      {
        name: 'Strings',
        description: 'String processing and manipulation problems',
        icon: '📝',
        color: 'purple'
      },
      {
        name: 'Trees',
        description: 'Tree traversal and binary tree problems',
        icon: '🌳',
        color: 'green'
      },
      {
        name: 'Graphs',
        description: 'Graph algorithms and traversal problems',
        icon: '🔗',
        color: 'cyan'
      }
    ];

    const createdTopics = await Topic.insertMany(topicsData);
    console.log(`✅ Created ${createdTopics.length} topics`);

    // Create problems
    const problemsData = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        constraints: '2 <= nums.length <= 10^4',
        examples: [{ input: '[2,7,11,15], target=9', output: '[0,1]' }],
        testCases: [{ input: '[2,7,11,15]', expected: '[0,1]' }],
        functionSignature: '{"name": "twoSum", "params": ["nums", "target"]}',
        timeLimit: 2000,
        memoryLimit: 256,
        topic: createdTopics[0]._id
      },
      {
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers.',
        difficulty: 'Medium',
        tags: ['Array', 'Math'],
        constraints: '1 <= l1.length, l2.length <= 100',
        examples: [{ input: '[2,4,3], [5,6,4]', output: '[7,0,8]' }],
        testCases: [{ input: '[2,4,3]', expected: '[7,0,8]' }],
        functionSignature: '{"name": "addTwoNumbers", "params": ["l1", "l2"]}',
        timeLimit: 2000,
        memoryLimit: 256,
        topic: createdTopics[0]._id
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        difficulty: 'Medium',
        tags: ['String', 'Sliding Window'],
        constraints: '0 <= s.length <= 5 * 10^4',
        examples: [{ input: '"abcabcbb"', output: '3' }],
        testCases: [{ input: '"abcabcbb"', expected: '3' }],
        functionSignature: '{"name": "lengthOfLongestSubstring", "params": ["s"]}',
        timeLimit: 2000,
        memoryLimit: 256,
        topic: createdTopics[1]._id
      },
      {
        title: 'Median of Two Sorted Arrays',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        difficulty: 'Hard',
        tags: ['Array', 'Binary Search'],
        constraints: 'nums1.length + nums2.length >= 1',
        examples: [{ input: '[1,3], [2]', output: '2.0' }],
        testCases: [{ input: '[1,3]', expected: '2.0' }],
        functionSignature: '{"name": "findMedianSortedArrays", "params": ["nums1", "nums2"]}',
        timeLimit: 2000,
        memoryLimit: 256,
        topic: createdTopics[0]._id
      },
      {
        title: 'Binary Tree Inorder Traversal',
        description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
        difficulty: 'Easy',
        tags: ['Tree', 'DFS'],
        constraints: 'The number of nodes in the tree is in the range [0, 100]',
        examples: [{ input: '[1,null,2,3]', output: '[1,3,2]' }],
        testCases: [{ input: '[1,null,2,3]', expected: '[1,3,2]' }],
        functionSignature: '{"name": "inorderTraversal", "params": ["root"]}',
        timeLimit: 2000,
        memoryLimit: 256,
        topic: createdTopics[2]._id
      }
    ];

    const createdProblems = await Problem.insertMany(problemsData);
    console.log(`✅ Created ${createdProblems.length} problems`);

    // Update topic problem counts and difficulty breakdown
    for (const topic of createdTopics) {
      const topicProblems = createdProblems.filter(p => p.topic.toString() === topic._id.toString());
      topic.problems = topicProblems.map(p => p._id);
      topic.problemCount = topicProblems.length;
      
      topicProblems.forEach(p => {
        if (p.difficulty === 'Easy') topic.difficulty.easy++;
        else if (p.difficulty === 'Medium') topic.difficulty.medium++;
        else if (p.difficulty === 'Hard') topic.difficulty.hard++;
      });
      
      await topic.save();
    }

    console.log('\n✅ Topics seeding completed successfully!');
    console.log('📱 Visit http://localhost:5173/topics to see the topics page\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedTopics());

