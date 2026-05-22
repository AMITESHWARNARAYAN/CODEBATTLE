import axios from 'axios';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const API_URL = 'http://localhost:5000/api';
const USER_EMAIL = 'testuser1@codebattle.com';
const USER_PASSWORD = 'test123456';

async function testDrafts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to DB');

        console.log('\n1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: USER_EMAIL,
            password: USER_PASSWORD
        });
        const token = loginRes.data.token;
        console.log('✅ Login successful');

        // Get a problem ID
        const problem = await Problem.findOne();
        if (!problem) {
            console.log('❌ No problems found in DB to test with');
            return;
        }
        const problemId = problem._id.toString();
        console.log(`Using Problem ID: ${problemId}`);

        console.log('\n2. Saving Draft...');
        const draftCode = '// This is a draft code\nconsole.log("Hello Draft");';
        await axios.post(
            `${API_URL}/drafts`,
            {
                problemId,
                code: draftCode,
                language: 'javascript'
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Draft saved');

        console.log('\n3. Retrieving Draft...');
        const getRes = await axios.get(
            `${API_URL}/drafts/${problemId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (getRes.data.code === draftCode) {
            console.log('🎉 SUCCESS: Draft retrieved matches saved code');
        } else {
            console.log('❌ FAILURE: Draft mismatch');
            console.log('Expected:', draftCode);
            console.log('Got:', getRes.data.code);
        }

        mongoose.disconnect();

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
        if (mongoose.connection.readyState !== 0) mongoose.disconnect();
    }
}

testDrafts();
