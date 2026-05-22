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
  const problems = await Problem.find();
  const counts = {};
  for (const name of Object.values(catMap)) {
    counts[name] = 0;
  }
  for (const p of problems) {
    if (p.category) {
      const name = catMap[p.category.toString()] || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    } else {
      counts['No Category'] = (counts['No Category'] || 0) + 1;
    }
  }
  console.log("=== Category Counts ===");
  console.log(JSON.stringify(counts, null, 2));
  await mongoose.disconnect();
}

main().catch(console.error);
