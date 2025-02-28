const mongoose = require('mongoose');
const baseContentSchema = require('./BaseContent');

const documentationSchema = new mongoose.Schema({
    ...baseContentSchema.obj,
    content: {
        type: String,
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
        required: true
    },
    section: {
        type: String,
        enum: ['overview', 'getting-started', 'concepts', 'advanced', 'best-practices', 'examples'],
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    codeExamples: [{
        title: String,
        description: String,
        code: String,
        language: String
    }],
    references: [{
        title: String,
        url: String
    }],
    contributors: [{
        name: String,
        githubUsername: String,
        avatar: String
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Documentation', documentationSchema);