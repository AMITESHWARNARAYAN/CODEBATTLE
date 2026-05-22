import axios from 'axios';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const API_URL = 'http://localhost:5000/api';
const USER_EMAIL = 'testuser1@codebattle.com';
const USER_PASSWORD = 'test123456';

async function testStreak() {
    try {
        // Connect to DB to manipulate data
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to DB');

        console.log('\n1. Initial Login...');
        let loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: USER_EMAIL,
            password: USER_PASSWORD
        });
        let token = loginRes.data.token;

        console.log('Initial Streak:', await getStreak(token));

        console.log('\n2. Simulating "Yesterday"...');
        const user = await User.findOne({ email: USER_EMAIL });

        // Set last login to yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        user.streak.lastLoginDate = yesterday;
        user.streak.current = 1; // Assume streak of 1
        await user.save();
        console.log('✅ DB updated: lastLoginDate set to yesterday');

        console.log('\n3. Login Again (Should increment streak)...');
        loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: USER_EMAIL,
            password: USER_PASSWORD
        });
        token = loginRes.data.token;

        const newStreak = await getStreak(token);
        console.log('New Streak:', newStreak);

        if (newStreak.current === 2) {
            console.log('🎉 SUCCESS: Streak incremented to 2');
        } else {
            console.log('❌ FAILURE: Streak did not increment correctly');
        }

        mongoose.disconnect();

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
        if (mongoose.connection.readyState !== 0) mongoose.disconnect();
    }
}

async function getStreak(token) {
    const res = await axios.get(`${API_URL}/users/badges`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.streak;
}

testStreak();
