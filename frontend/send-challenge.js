const axios = require('axios');

async function test() {
  try {
    // 1. Register testA
    let tokenA;
    try {
      const resA = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'testA',
        email: 'testA@example.com',
        password: 'password123'
      });
      tokenA = resA.data.token;
      console.log('Registered testA');
    } catch (e) {
      // If already exists, login
      const resA = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'testA@example.com',
        password: 'password123'
      });
      tokenA = resA.data.token;
      console.log('Logged in testA');
    }

    // 2. Register testB just to make sure it exists
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: 'testB',
        email: 'testB@example.com',
        password: 'password123'
      });
      console.log('Registered testB');
    } catch (e) {
      console.log('testB already exists');
    }

    // Wait 5 seconds so the browser agent has time to be ready
    console.log('Waiting 5 seconds before sending challenge...');
    await new Promise(r => setTimeout(r, 30000));

    // 3. Send challenge from testA to testB
    const res = await axios.post('http://localhost:5000/api/matches/friend/challenge-by-email', {
      friendEmail: 'testB@example.com'
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    console.log('Challenge sent:', res.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

test();
