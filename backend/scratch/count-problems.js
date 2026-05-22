import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import Category from '../models/Category.js';

await mongoose.connect(process.env.MONGODB_URI);

const cats = await Category.find({}).lean();
console.log('Categories:');
cats.forEach(c => console.log(`  ${c._id}: ${c.name} (icon: ${c.icon})`));

const problems = await Problem.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

console.log('\nProblems by category:');
for (const p of problems) {
  const cat = cats.find(c => c._id.toString() === p._id?.toString());
  console.log(`  ${cat?.name || 'UNCATEGORIZED'}: ${p.count}`);
}

const byDiff = await Problem.aggregate([
  { $group: { _id: '$difficulty', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);
console.log('\nBy difficulty:', byDiff.map(d => `${d._id}: ${d.count}`).join(', '));

const slugs = await Problem.find({}, { slug: 1, title: 1, difficulty: 1, tags: 1, _id: 0 }).lean();
console.log(`\nAll ${slugs.length} problem titles:`);
slugs.forEach(s => console.log(`  [${s.difficulty}] ${s.title} (tags: ${s.tags?.join(', ')})`));

await mongoose.disconnect();
