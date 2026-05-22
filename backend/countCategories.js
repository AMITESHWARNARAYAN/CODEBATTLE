import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from './models/Problem.js';
import Category from './models/Category.js';

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const categories = await Category.find();
  const catMap = {};
  for (const cat of categories) {
    catMap[cat._id.toString()] = cat.name;
  }
  const problems = await Problem.find().populate('category');
  const catCounts = {};
  for (const p of problems) {
    const catName = p.category ? p.category.name : 'Unknown';
    if (!catCounts[catName]) {
      catCounts[catName] = { count: 0, titles: [] };
    }
    catCounts[catName].count++;
    catCounts[catName].titles.push(p.title);
  }
  console.log(JSON.stringify(catCounts, null, 2));
  await mongoose.disconnect();
}

main().catch(console.error);
