import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const USER_EMAIL = 'testuser1@codebattle.com';
const USER_PASSWORD = 'test123456';

async function testCustomRun() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: USER_EMAIL,
            password: USER_PASSWORD
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful');

        console.log('\n2. Testing Custom Input Execution...');
        const code = `
      // JavaScript example
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.on('line', (line) => {
        const nums = line.split(' ').map(Number);
        const sum = nums.reduce((a, b) => a + b, 0);
        console.log(sum);
        rl.close();
      });
    `;

        const input = '10 20 30';

        const runRes = await axios.post(
            `${API_URL}/judge/run`,
            {
                code,
                language: 'javascript',
                input
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log('✅ Execution Result:', runRes.data);

        if (runRes.data.output.trim() === '60') {
            console.log('🎉 SUCCESS: Output matches expected value (60)');
        } else {
            console.log('❌ FAILURE: Output mismatch');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

testCustomRun();
