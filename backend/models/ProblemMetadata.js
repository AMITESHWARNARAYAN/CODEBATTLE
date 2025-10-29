import mongoose from 'mongoose';

const problemMetadataSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    unique: true
  },
  // Company tags
  companies: [{
    name: String,
    frequency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastAsked: Date,
    acceptanceRate: Number
  }],
  // Problem lists
  lists: [{
    type: String,
    enum: [
      'Top 100 Liked',
      'Blind 75',
      'NeetCode 150',
      'Top Interview Questions',
      'Beginner Friendly',
      'Amazon Top 50',
      'Google Top 50',
      'Meta Top 50',
      'Microsoft Top 50',
      'Apple Top 50'
    ]
  }],
  // Frequency data
  frequencyData: {
    sixMonths: { type: Number, default: 0, min: 0, max: 100 },
    oneYear: { type: Number, default: 0, min: 0, max: 100 },
    twoYears: { type: Number, default: 0, min: 0, max: 100 },
    allTime: { type: Number, default: 0, min: 0, max: 100 }
  },
  // Interview experiences
  interviewExperiences: [{
    company: String,
    position: String,
    date: Date,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },
    description: String,
    tips: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    upvotes: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Additional metadata
  isPremium: {
    type: Boolean,
    default: false
  },
  similarProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  hints: [String],
  realWorldApplications: [String],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
problemMetadataSchema.index({ problem: 1 });
problemMetadataSchema.index({ 'companies.name': 1 });
problemMetadataSchema.index({ lists: 1 });

const ProblemMetadata = mongoose.model('ProblemMetadata', problemMetadataSchema);

export default ProblemMetadata;

