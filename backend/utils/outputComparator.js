// ═══════════════════════════════════════════════════
//  Smart Output Comparison (LeetCode-style)
//  Shared across Docker and Judge0 executors
// ═══════════════════════════════════════════════════

const BOOLEAN_TRUE  = new Set(['true', '1', 'yes']);
const BOOLEAN_FALSE = new Set(['false', '0', 'no']);

export const normalizeValue = (s) => {
  if (!s) return '';
  // Trim whitespace and trailing newlines
  let v = s.trim().replace(/\r\n/g, '\n').replace(/\n+$/, '');
  // Normalize quotes: remove wrapping double-quotes from string outputs (Java/Python)
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  return v;
};

export const compareOutputs = (actual, expected) => {
  const a = normalizeValue(actual);
  const e = normalizeValue(expected);

  // 1. Exact match
  if (a === e) return true;

  // 2. Case-insensitive match (handles True vs true vs TRUE)
  if (a.toLowerCase() === e.toLowerCase()) return true;

  // 3. Boolean normalization (1/true/True/TRUE vs 0/false/False/FALSE)
  const aLow = a.toLowerCase(), eLow = e.toLowerCase();
  if (BOOLEAN_TRUE.has(aLow) && BOOLEAN_TRUE.has(eLow)) return true;
  if (BOOLEAN_FALSE.has(aLow) && BOOLEAN_FALSE.has(eLow)) return true;

  // 4. Numeric comparison with floating-point tolerance
  const an = parseFloat(a), en = parseFloat(e);
  if (!isNaN(an) && !isNaN(en) && a.match(/^-?\d/) && e.match(/^-?\d/)) {
    if (Math.abs(an - en) < 1e-6) return true;
  }

  // 5. JSON deep comparison (arrays, objects) — handles spacing differences
  try {
    const aj = JSON.parse(a), ej = JSON.parse(e);
    if (JSON.stringify(aj) === JSON.stringify(ej)) return true;

    // 5b. Sorted array comparison (for problems where order doesn't matter)
    if (Array.isArray(aj) && Array.isArray(ej) && aj.length === ej.length) {
      // Sort primitive arrays for comparison
      const sortedA = JSON.stringify([...aj].sort());
      const sortedE = JSON.stringify([...ej].sort());
      if (sortedA === sortedE) return true;

      // For nested arrays (like group-anagrams), sort inner arrays then sort outer
      if (Array.isArray(aj[0])) {
        const deepSortA = aj.map(x => Array.isArray(x) ? [...x].sort() : x).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        const deepSortE = ej.map(x => Array.isArray(x) ? [...x].sort() : x).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        if (JSON.stringify(deepSortA) === JSON.stringify(deepSortE)) return true;
      }
    }
  } catch {}

  // 6. Whitespace-collapsed comparison (handles extra spaces/newlines in output)
  if (a.replace(/\s+/g, ' ') === e.replace(/\s+/g, ' ')) return true;

  return false;
};
