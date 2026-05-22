import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  // ─── Battle Rating (1v1 Matchmaking & Friend Challenges) ───
  rating: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  draws: {
    type: Number,
    default: 0
  },
  totalMatches: {
    type: Number,
    default: 0
  },
  highestRating: {
    type: Number,
    default: 0
  },
  lowestRating: {
    type: Number,
    default: 0
  },
  // ─── Contest Rating (Live Rated Contests) ───
  contestRating: {
    type: Number,
    default: 0
  },
  contestHighestRating: {
    type: Number,
    default: 0
  },
  contestLowestRating: {
    type: Number,
    default: 0
  },
  contestsParticipated: {
    type: Number,
    default: 0
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  matchHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Daily Challenge Streak
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastDailyChallengeDate: {
    type: Date,
    default: null
  },
  dailyChallengesCompleted: {
    type: Number,
    default: 0
  },
  // Problem Solving Stats
  solvedProblems: [{
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    },
    solvedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalSolved: {
    type: Number,
    default: 0
  },
  easySolved: {
    type: Number,
    default: 0
  },
  mediumSolved: {
    type: Number,
    default: 0
  },
  hardSolved: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String,
    enum: ['Daily Streak', 'Problem Solver', 'Contest Winner', 'Bug Hunter']
  }],
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastLoginDate: { type: Date }
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update rating
// type: 'battle' (default, 1v1) or 'contest' (live contests)
userSchema.methods.updateRating = function (newRating, type = 'battle') {
  // Enforce rating floor at 0 — never go negative
  const safeRating = Math.max(0, newRating);

  if (type === 'contest') {
    this.contestRating = safeRating;
    if (safeRating > this.contestHighestRating) {
      this.contestHighestRating = safeRating;
    }
    if (safeRating < this.contestLowestRating) {
      this.contestLowestRating = safeRating;
    }
  } else {
    this.rating = safeRating;
    if (safeRating > this.highestRating) {
      this.highestRating = safeRating;
    }
    if (safeRating < this.lowestRating) {
      this.lowestRating = safeRating;
    }
  }
};

const User = mongoose.model('User', userSchema);

export default User;

