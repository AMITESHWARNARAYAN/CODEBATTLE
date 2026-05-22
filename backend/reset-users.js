/**
 * Reset admin & test users to fresh state.
 * 
 * This script:
 * 1. Resets user stats (rating, wins, losses, matches, streaks, solved problems) to 0
 * 2. Deletes all matches involving these users
 * 3. Deletes all submissions by these users
 * 4. Deletes all notifications for these users
 * 5. Deletes all drafts by these users
 * 
 * Does NOT delete: Problems, Contests, Discussions, or the user accounts themselves.
 * 
 * Run: node reset-users.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Match from './models/Match.js';
import Submission from './models/Submission.js';
import Notification from './models/Notification.js';
import Draft from './models/Draft.js';

const EMAILS_TO_RESET = [
  'admin@codebattle.com',
  'testuser1@codebattle.com',
  'testuser2@codebattle.com'
];

async function reset() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected.\n');

  // Find the users
  const users = await User.find({ email: { $in: EMAILS_TO_RESET } });
  const userIds = users.map(u => u._id);
  const userNames = users.map(u => `${u.username} (${u.email})`);

  console.log(`Found ${users.length} users to reset:`);
  userNames.forEach(n => console.log(`  • ${n}`));
  console.log('');

  if (users.length === 0) {
    console.log('No users found. Exiting.');
    await mongoose.disconnect();
    return;
  }

  // 1. Delete matches involving these users
  const matchResult = await Match.deleteMany({ players: { $in: userIds } });
  console.log(`🗑️  Deleted ${matchResult.deletedCount} matches`);

  // 2. Delete submissions by these users
  const subResult = await Submission.deleteMany({ user: { $in: userIds } });
  console.log(`🗑️  Deleted ${subResult.deletedCount} submissions`);

  // 3. Delete notifications for these users
  const notifResult = await Notification.deleteMany({ userId: { $in: userIds } });
  console.log(`🗑️  Deleted ${notifResult.deletedCount} notifications`);

  // 4. Delete drafts by these users
  const draftResult = await Draft.deleteMany({ userId: { $in: userIds } });
  console.log(`🗑️  Deleted ${draftResult.deletedCount} drafts`);

  // 5. Reset user stats to fresh
  for (const user of users) {
    user.rating = 0;
    user.wins = 0;
    user.losses = 0;
    user.draws = 0;
    user.totalMatches = 0;
    user.highestRating = 0;
    user.lowestRating = 0;
    user.contestRating = 0;
    user.contestHighestRating = 0;
    user.contestLowestRating = 0;
    user.contestsParticipated = 0;
    user.matchHistory = [];
    user.currentStreak = 0;
    user.longestStreak = 0;
    user.lastDailyChallengeDate = null;
    user.dailyChallengesCompleted = 0;
    user.solvedProblems = [];
    user.totalSolved = 0;
    user.easySolved = 0;
    user.mediumSolved = 0;
    user.hardSolved = 0;
    user.badges = [];
    user.streak = { current: 0, longest: 0, lastLoginDate: null };
    user.isOnline = false;

    await user.save();
    console.log(`✅ Reset ${user.username} to fresh state`);
  }

  console.log('\n🎉 All done! Users are back to fresh level.');
  await mongoose.disconnect();
  console.log('👋 Disconnected.');
}

reset().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
