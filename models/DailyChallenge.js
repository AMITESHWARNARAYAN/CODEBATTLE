import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    runtime: Number,
    memory: Number
  }],
  totalParticipants: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient date queries
dailyChallengeSchema.index({ date: -1 });

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);

export default DailyChallenge;

