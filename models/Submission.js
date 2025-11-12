import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp']
  },
  status: {
    type: String,
    required: true,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error']
  },
  runtime: {
    type: Number, // in milliseconds
    default: 0
  },
  memory: {
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
  errorMessage: {
    type: String,
    default: ''
  },
  isDailyChallenge: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient queries
submissionSchema.index({ user: 1, problem: 1, submittedAt: -1 });
submissionSchema.index({ user: 1, status: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;

