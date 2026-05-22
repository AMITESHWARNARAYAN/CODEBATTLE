import axios from 'axios';

// ═══ TTL-based Cache for GitHub Test Cases ═══
// Entries expire after CACHE_TTL_MS to ensure updated test cases propagate
// without requiring a server restart. Max cache size prevents memory leaks.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 200;

// Map<url, { data: TestCase[], cachedAt: number }>
const testCasesCache = new Map();

// Negative cache for failed raw GitHub URLs to prevent slow timeouts on repeat requests
const failedUrlsCache = new Map();
const FAILED_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Check if a cache entry is still fresh
 */
function isCacheFresh(entry) {
  return entry && (Date.now() - entry.cachedAt) < CACHE_TTL_MS;
}

/**
 * Evict the oldest cache entry when the cache exceeds MAX_CACHE_SIZE (FIFO)
 */
function evictOldestIfNeeded() {
  if (testCasesCache.size >= MAX_CACHE_SIZE) {
    // Map iterates in insertion order — first key is the oldest
    const oldestKey = testCasesCache.keys().next().value;
    testCasesCache.delete(oldestKey);
    console.log(`[TestCase Cache] Evicted oldest entry: ${oldestKey}`);
  }
}

/**
 * Resolves test cases for a problem. If the problem is configured to use GitHub test cases,
 * it fetches the test cases from the specified GitHub raw URL and caches them with a TTL.
 * 
 * @param {Object} problem - A plain JavaScript representation of a Problem document
 */
export async function resolveTestCases(problem) {
  if (!problem) return;

  if (problem.useGitHubTestCases && problem.testCasesUrl) {
    let testCasesList = [];

    // Check cache — only use entry if it's still fresh
    const cached = testCasesCache.get(problem.testCasesUrl);
    if (isCacheFresh(cached)) {
      testCasesList = cached.data;
    } else {
      // Check negative cache
      const failedEntry = failedUrlsCache.get(problem.testCasesUrl);
      const isNegativeCacheFresh = failedEntry && (Date.now() - failedEntry.failedAt) < FAILED_CACHE_TTL_MS;

      if (isNegativeCacheFresh) {
        console.warn(`[TestCase Fetcher] Negative cache hit for URL: ${problem.testCasesUrl}. Skipping fetch.`);
        if (cached && cached.data) {
          testCasesList = cached.data;
        } else if (Array.isArray(problem.testCases) && problem.testCases.length > 0) {
          testCasesList = problem.testCases;
        } else if (Array.isArray(problem.visibleTestCases) && problem.visibleTestCases.length > 0) {
          testCasesList = problem.visibleTestCases;
        }
      } else {
        // Cache miss or stale — fetch fresh data
        try {
          console.log(`[TestCase Fetcher] Fetching test cases from GitHub: ${problem.testCasesUrl}`);
          const response = await axios.get(`${problem.testCasesUrl}?t=${Date.now()}`, { timeout: 8000 });

          if (Array.isArray(response.data)) {
            testCasesList = response.data;

            // Clear from negative cache on success
            failedUrlsCache.delete(problem.testCasesUrl);

            // Evict oldest entry if at capacity before inserting
            evictOldestIfNeeded();

            testCasesCache.set(problem.testCasesUrl, {
              data: testCasesList,
              cachedAt: Date.now()
            });
            console.log(`[TestCase Fetcher] Cached ${testCasesList.length} test cases (TTL: ${CACHE_TTL_MS / 1000}s).`);
          } else {
            console.error(`[TestCase Fetcher] Expected JSON array but got:`, typeof response.data);
            throw new Error('Expected JSON array from GitHub');
          }
        } catch (err) {
          console.error(`[TestCase Fetcher] Failed to fetch from ${problem.testCasesUrl}:`, err.message);

          // Add to negative cache
          failedUrlsCache.set(problem.testCasesUrl, {
            failedAt: Date.now(),
            reason: err.message
          });

          // Fallback sequence:
          // 1. Stale cache
          // 2. Existing problem.testCases (if populated)
          // 3. Existing problem.visibleTestCases
          if (cached && cached.data) {
            console.warn(`[TestCase Fetcher] Using stale cache as fallback.`);
            testCasesList = cached.data;
          } else if (Array.isArray(problem.testCases) && problem.testCases.length > 0) {
            console.warn(`[TestCase Fetcher] Using local problem.testCases as fallback.`);
            testCasesList = problem.testCases;
          } else if (Array.isArray(problem.visibleTestCases) && problem.visibleTestCases.length > 0) {
            console.warn(`[TestCase Fetcher] Using local problem.visibleTestCases as fallback.`);
            testCasesList = problem.visibleTestCases;
          }
        }
      }
    }

    // Assign the resolved test cases to the problem object
    problem.testCases = testCasesList;
  }
}
