const mongoose = require('mongoose');
const baseContentSchema = require('./BaseContent');

const roadmapSchema = new mongoose.Schema({
    ...baseContentSchema.obj,
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    estimatedDuration: {
        value: Number,
        unit: {
            type: String,
            enum: ['weeks', 'months'],
            default: 'weeks'
        }
    },
    nodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadmapNode'
    }],
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology'
    }],
    learningOutcomes: [{
        description: String,
        skillLevel: {
            type: String,
            enum: ['basic', 'intermediate', 'advanced']
        }
    }],
    careers: [{
        title: String,
        description: String,
        averageSalary: {
            amount: Number,
            currency: String
        }
    }]
});

module.exports = mongoose.model('Roadmap', roadmapSchema);