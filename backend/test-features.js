import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from './models/Problem.js';
import ProblemMetadata from './models/ProblemMetadata.js';
import User from './models/User.js';

dotenv.config();

async function test() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codebattle';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get first problem
    const problem = await Problem.findOne();
    if (!problem) {
      console.log('❌ No problems found in database. Run seed first.');
      process.exit(1);
    }
    
    console.log('\n📝 Problem:', problem.title, '(' + problem._id + ')');
    console.log('Function Signatures:', Object.keys(problem.functionSignature || {}));

    // Check ProblemMetadata
    let metadata = await ProblemMetadata.findOne({ problem: problem._id });
    if (!metadata) {
      console.log('❌ No metadata for this problem. Creating...');
      metadata = await ProblemMetadata.create({
        problem: problem._id,
        likedBy: [],
        dislikedBy: [],
        commentCount: 0
      });
      console.log('✅ Created metadata');
    } else {
      console.log('✅ Metadata exists');
    }

    console.log('📊 Metadata:', {
      likes: metadata.likedBy?.length || 0,
      dislikes: metadata.dislikedBy?.length || 0,
      comments: metadata.commentCount || 0
    });

    // Get first user
    let user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Creating test user...');
      user = await User.create({
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed',
        bookmarkedProblems: []
      });
      console.log('✅ Created test user:', user._id);
    } else {
      console.log('✅ Test user exists:', user._id);
    }

    // Simulate like
    console.log('\n🧪 Testing like functionality...');
    const userIdStr = user._id.toString();
    const likeIndex = metadata.likedBy.findIndex(id => id.toString() === userIdStr);
    
    if (likeIndex > -1) {
      console.log('❌ User already liked. Index:', likeIndex);
    } else {
      console.log('✅ Like would work. Current likedBy array:', metadata.likedBy.map(id => id.toString()));
    }

    // Check hints structure
    console.log('\n💡 Problem hints:', problem.hints || 'MISSING');
    
    // Check all function signatures
    console.log('\n📦 Function signatures:');
    console.log('  - cpp:', problem.functionSignature?.cpp ? '✅' : '❌');
    console.log('  - java:', problem.functionSignature?.java ? '✅' : '❌');
    console.log('  - python:', problem.functionSignature?.python ? '✅' : '❌');
    console.log('  - javascript:', problem.functionSignature?.javascript ? '✅' : '❌');

    await mongoose.disconnect();
    console.log('\n✅ Test complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
