import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const p = await Problem.findOne({ 'metaData.name': 'solve' });
    console.log(JSON.stringify(p, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

inspect();
