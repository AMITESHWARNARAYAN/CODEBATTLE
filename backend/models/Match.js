import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  memoryUsed: {
    type: Number, // in MB
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    default: 'Wrong Answer'
  },
  timeComplexity: {
    type: String,
    default: 'Unknown'
  },
  spaceComplexity: {
    type: String,
    default: 'Unknown'
  }
});

const matchSchema = new mongoose.Schema({
  matchType: {
    type: String,
    enum: ['matchmaking', 'friend', 'solo'],
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  submissions: [submissionSchema],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in seconds
  },
  ratingChanges: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    oldRating: Number,
    newRating: Number,
    change: Number
  }],
  inviteCode: {
    type: String,
    unique: true,
    sparse: true // Only for friend matches
  },
  challengerEmail: {
    type: String,
    sparse: true // Email of the challenger
  },
  challengedEmail: {
    type: String,
    sparse: true // Email of the challenged player
  },
  challengeStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending',
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
matchSchema.index({ status: 1, matchType: 1 });
matchSchema.index({ inviteCode: 1 });

const Match = mongoose.model('Match', matchSchema);

export default Match;

