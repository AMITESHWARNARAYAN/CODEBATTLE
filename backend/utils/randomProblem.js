import Problem from '../models/Problem.js';

/**
 * Get a random problem using MongoDB's $sample aggregation.
 * 
 * This is O(1) vs the old countDocuments() + findOne().skip(random) approach
 * which was O(N) because MongoDB has to scan and discard N documents.
 * 
 * @param {Object} filter - Optional MongoDB filter (e.g., { difficulty: 'Easy' })
 * @returns {Promise<Object|null>} A random problem document, or null if none found
 */
export async function getRandomProblem(filter = {}) {
  const pipeline = [];

  // Apply filter if provided
  if (Object.keys(filter).length > 0) {
    pipeline.push({ $match: filter });
  }

  // $sample picks N random documents efficiently using a random cursor
  pipeline.push({ $sample: { size: 1 } });

  const results = await Problem.aggregate(pipeline);

  if (results.length === 0) return null;

  // aggregate() returns plain objects, not Mongoose documents.
  // Hydrate to get a full Mongoose document with methods and virtuals.
  return Problem.hydrate(results[0]);
}
