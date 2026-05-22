import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['learning-path', 'tutorial', 'video', 'article', 'external', 'course', 'problem-sheet'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'DSA',
      'Algorithms',
      'Data Structures',
      'System Design',
      'Competitive Programming',
      'Interview Preparation',
      'Problem Solving',
      'Language Specific',
      'Web Development',
      'Database',
      'Other'
    ]
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'Beginner'
  },
  topics: [{
    type: String,
    trim: true
  }],
  url: {
    type: String,
    trim: true
  },
  platform: {
    type: String,
    enum: ['YouTube', 'GitHub', 'LeetCode', 'GeeksforGeeks', 'CodeForces', 'HackerRank', 'Internal', 'Other'],
    default: 'Internal'
  },
  icon: {
    type: String,
    default: 'BookOpen'
  },
  color: {
    type: String,
    default: 'orange'
  },
  duration: {
    type: String, // e.g., "2 hours", "5 weeks", "150 problems"
    default: ''
  },
  author: {
    type: String,
    default: 'CodeBattle Team'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  content: {
    type: String, // Rich text content for articles/tutorials
    default: ''
  },
  problemIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
resourceSchema.index({ type: 1, category: 1 });
resourceSchema.index({ isPublished: 1, order: 1 });
resourceSchema.index({ tags: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
