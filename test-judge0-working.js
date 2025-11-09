import axios from 'axios';

const JUDGE0_API_KEY = 'b842b887fdmsha3b9da636116bf2p1010fcjsn1ed2536e0363';
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

async function testJudge0() {
  try {
    console.log('Testing Judge0 API with code submission...\n');

    // Simple JavaScript code to test
    const code = `
function solve(nums) {
  return nums.reduce((a, b) => a + b, 0);
}

const result = solve([1, 2, 3, 4, 5]);
console.log(result);
`;

    // Submit code
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: 63, // JavaScript (Node.js)
        stdin: '',
        expected_output: '15'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      }
    );

    console.log('✅ Submission successful!');
    console.log('Status:', response.data.status.description);
    console.log('Output:', response.data.stdout);
    console.log('Time:', response.data.time, 'seconds');
    console.log('Memory:', response.data.memory, 'KB');
    console.log('\n🎉 Judge0 API is working perfectly!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testJudge0();

