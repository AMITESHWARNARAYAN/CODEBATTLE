import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false // Some test cases are hidden from users
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  companyTags: [{
    type: String,
    trim: true
  }],
  lists: [{
    type: String,
    enum: ['Top 100 Liked', 'Blind 75', 'NeetCode 150', 'Top Interview Questions', 'Beginner Friendly'],
    trim: true
  }],
  frequency: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  constraints: {
    type: String,
    default: ''
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  functionSignature: {
    cpp: {
      type: String,
      default: ''
    }
  },
  timeLimit: {
    type: Number,
    default: 2000 // milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 256 // MB
  },
  acceptanceRate: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  successfulSubmissions: {
    type: Number,
    default: 0
  },
  solutionLink: {
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;

