import ProblemMetadata from '../models/ProblemMetadata.js';
import Problem from '../models/Problem.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedMetadata = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all problems
    const problems = await Problem.find();
    console.log(`Found ${problems.length} problems`);

    // Clear existing metadata
    await ProblemMetadata.deleteMany({});
    console.log('Cleared existing metadata');

    // Create metadata for each problem
    const metadataRecords = problems.map(problem => ({
      problem: problem._id,
      companies: [
        { name: 'Google', frequency: 85, acceptanceRate: 32 },
        { name: 'Amazon', frequency: 92, acceptanceRate: 28 },
        { name: 'Facebook', frequency: 78, acceptanceRate: 35 }
      ],
      lists: ['Top 100 Liked', 'Blind 75', 'Top Interview Questions'],
      frequencyData: {
        sixMonths: Math.floor(Math.random() * 100),
        oneYear: Math.floor(Math.random() * 100),
        twoYears: Math.floor(Math.random() * 100),
        allTime: Math.floor(Math.random() * 100)
      },
      likedBy: [],
      dislikedBy: [],
      commentCount: Math.floor(Math.random() * 50),
      isPremium: false,
      similarProblems: [],
      realWorldApplications: [
        'Database query optimization',
        'Search algorithms',
        'Data structure implementation'
      ]
    }));

    const created = await ProblemMetadata.insertMany(metadataRecords);
    console.log(`Created ${created.length} metadata records`);

    await mongoose.connection.close();
    console.log('Metadata seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedMetadata();
