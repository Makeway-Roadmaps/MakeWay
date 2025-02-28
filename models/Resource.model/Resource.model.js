const mongoose = require('mongoose');
const baseContentSchema = require('./BaseContent');

const resourceSchema = new mongoose.Schema({
    ...baseContentSchema.obj,
    type: {
        type: String,
        enum: ['article', 'video', 'course', 'book', 'documentation', 'github', 'tool'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    provider: {
        name: String,
        url: String,
        verified: Boolean
    },
    pricing: {
        type: {
            type: String,
            enum: ['free', 'paid', 'freemium'],
            default: 'free'
        },
        amount: Number,
        currency: String
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    duration: {
        value: Number,
        unit: {
            type: String,
            enum: ['minutes', 'hours', 'days', 'weeks']
        }
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5
        },
        count: Number
    },
    technologies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology'
    }]
});

module.exports = mongoose.model('Resource', resourceSchema);