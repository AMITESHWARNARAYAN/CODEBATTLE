import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  submission: {
    code: String,
    language: String,
    runtime: Number,
    memory: Number,
    testCasesPassed: Number,
    totalTestCases: Number
  },
  score: {
    type: Number,
    default: 0
  }
});

const adminChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeType: {
    type: String,
    enum: ['global', 'targeted'],
    default: 'global'
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  participants: [participantSchema],
  totalParticipants: {
    type: Number,
    default: 0
  },
  completedCount: {
    type: Number,
    default: 0
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badge: {
      type: String,
      default: ''
    }
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
adminChallengeSchema.index({ status: 1, startDate: 1 });
adminChallengeSchema.index({ createdBy: 1 });
adminChallengeSchema.index({ challengeType: 1 });

// Update status based on dates
adminChallengeSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status === 'scheduled' && this.startDate <= now && this.endDate > now) {
    this.status = 'active';
  } else if (this.status === 'active' && this.endDate <= now) {
    this.status = 'completed';
  }
  
  this.updatedAt = now;
  next();
});

const AdminChallenge = mongoose.model('AdminChallenge', adminChallengeSchema);

export default AdminChallenge;

