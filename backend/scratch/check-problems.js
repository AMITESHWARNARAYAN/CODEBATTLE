import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const total = await Problem.countDocuments();
    const withSolve = await Problem.countDocuments({ 'metaData.name': 'solve' });
    
    console.log(`Total problems in DB: ${total}`);
    console.log(`Problems with metaData.name = 'solve': ${withSolve}`);

    const sample = await Problem.find({}, { title: 1, metaData: 1 }).limit(10);
    console.log('\nSample problems:');
    sample.forEach(p => {
      console.log(`- ${p.title}: metaData = ${JSON.stringify(p.metaData)}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
