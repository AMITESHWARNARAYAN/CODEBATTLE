import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from './models/Problem.js';
import Category from './models/Category.js';

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const category = await Category.findOne({ name: 'Bit Manipulation' });
  if (!category) {
    console.log('Category not found');
    await mongoose.disconnect();
    return;
  }
  const problems = await Problem.find({ category: category._id });
  console.log(`Found ${problems.length} problems in Math & Geometry:`);
  for (const p of problems) {
    console.log(`- ${p.title} (${p.slug})`);
  }
  await mongoose.disconnect();
}

main().catch(console.error);
