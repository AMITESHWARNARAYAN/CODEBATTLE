import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Interview Experience',
      'Offer Letter',
      'Rejection Story',
      'Preparation Strategy',
      'Career Switch',
      'Internship Experience',
      'Coding Round',
      'System Design Round',
      'HR Round',
      'Tips & Advice',
      'Success Story',
      'Other'
    ]
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    trim: true,
    default: ''
  },
  outcome: {
    type: String,
    enum: ['Selected', 'Rejected', 'Pending', 'N/A'],
    default: 'N/A'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now }
  }],
  views: {
    type: Number,
    default: 0
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

storySchema.index({ category: 1, createdAt: -1 });
storySchema.index({ company: 1 });
storySchema.index({ tags: 1 });
storySchema.index({ author: 1 });

const Story = mongoose.model('Story', storySchema);
export default Story;
