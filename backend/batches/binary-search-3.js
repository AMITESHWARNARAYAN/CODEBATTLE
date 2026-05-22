// Binary Search — Batch 3 (1 problem to complete Binary Search to exactly 50)
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

export const problems = [
{
  slug: 'minimize-maximum-of-array',
  title: 'Minimize Maximum of Array',
  description: 'You are given a 0-indexed array nums comprising n non-negative integers. In one operation, you can choose an index i (1 <= i < n) and nums[i] > 0, decrease nums[i] by 1 and increase nums[i-1] by 1. Return the minimum possible value of the maximum integer of nums after any number of operations.',
  difficulty: 'Medium',
  category: 'Binary Search',
  tags: ['Array', 'Binary Search', 'Dynamic Programming', 'Greedy', 'Prefix Sum'],
  constraints: '2 <= nums.length <= 10^5, 0 <= nums[i] <= 10^9',
  examples: [{ input: '[3,7,1,6]', output: '5', explanation: 'One optimal sequence: decrease nums[1] and increase nums[0] 2 times. Array becomes [5,5,1,6]. Decrease nums[3] and increase nums[2] 1 time. Array becomes [5,5,2,5]. The maximum integer is 5.' }],
  args: [{ name: 'nums', cpp: 'vector<int>', java: 'int[]', py: 'nums: List[int]', js: 'nums' }],
  retType: { cpp: 'int', java: 'int', py: 'int' },
  hints: [{ title: 'Binary Search on Answer', content: 'Binary search the minimum possible maximum value in range [0, max(nums)]. For a guess mid, check if we can reduce all elements to <= mid by carrying over excess capacity from right to left.' }],
  jsSolution: (nums) => {
    const check = (maxVal) => {
      let carry = 0;
      for (let i = nums.length - 1; i >= 0; i--) {
        carry = Math.max(0, carry + nums[i] - maxVal);
      }
      return carry === 0;
    };
    let lo = 0, hi = Math.max(...nums);
    let ans = hi;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (check(mid)) {
        ans = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    return ans;
  },
  inputGenerator: () => {
    const cases = [];
    cases.push([[3, 7, 1, 6]]);
    cases.push([[10, 1]]);
    cases.push([[5, 0, 5, 0]]);
    const gen = (n) => {
      return [randArr(n, 0, 1000)];
    };
    for (let i = 0; i < 47; i++) cases.push(gen(randInt(2, 10)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(10, 50)));
    for (let i = 0; i < 50; i++) cases.push(gen(randInt(50, 200)));
    return cases;
  }
}
];
