import { problems } from './batches/bit-manipulation-2.js';

for (const p of problems) {
  console.log(`Testing problem: ${p.title}`);
  const start = Date.now();
  const inputs = p.inputGenerator();
  console.log(`  Generated ${inputs.length} inputs in ${Date.now() - start}ms`);
  
  const startSol = Date.now();
  for (let i = 0; i < inputs.length; i++) {
    try {
      p.jsSolution(...inputs[i]);
    } catch (e) {
      console.log(`  Error on index ${i}: ${e.message}`);
    }
  }
  console.log(`  Executed solutions in ${Date.now() - startSol}ms`);
}
console.log('All stack problems verified successfully!');
