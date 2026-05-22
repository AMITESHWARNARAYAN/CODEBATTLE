import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema({
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
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one draft per user per problem
draftSchema.index({ user: 1, problem: 1 }, { unique: true });

const Draft = mongoose.model('Draft', draftSchema);

export default Draft;
