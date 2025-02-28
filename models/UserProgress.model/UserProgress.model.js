const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roadmap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
        required: true
    },
    nodeProgress: [{
        node: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RoadmapNode'
        },
        status: {
            type: String,
            enum: ['not-started', 'in-progress', 'completed', 'stuck'],
            default: 'not-started'
        },
        completedResources: [{
            resource: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Resource'
            },
            completedAt: Date,
            rating: Number,
            notes: String
        }],
        timeSpent: Number, // in minutes
        startedAt: Date,
        completedAt: Date
    }],
    certificates: [{
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        url: String,
        verified: Boolean
    }],
    notes: [{
        content: String,
        node: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RoadmapNode'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    overallProgress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);