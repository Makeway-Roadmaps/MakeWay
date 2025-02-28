
const mongoose = require('mongoose');

const roadmapNodeSchema = new mongoose.Schema({
    technology: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    type: {
        type: String,
        enum: ['core', 'optional', 'recommended'],
        default: 'core'
    },
    position: {
        x: Number,
        y: Number
    },
    connections: [{
        node: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RoadmapNode'
        },
        relationship: {
            type: String,
            enum: ['prerequisite', 'leads-to', 'alternative']
        }
    }],
    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }]
});

module.exports = mongoose.model('RoadmapNode', roadmapNodeSchema);