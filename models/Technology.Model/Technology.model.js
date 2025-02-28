const mongoose = require('mongoose');
const baseContentSchema = require('./BaseContent');

const technologySchema = new mongoose.Schema({
    ...baseContentSchema.obj,
    category: {
        type: String,
        enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills'],
        required: true
    },
    icon: String,
    popularity: {
        type: Number,
        default: 0
    },
    versions: [{
        version: String,
        releaseDate: Date,
        isLatest: Boolean,
        documentation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Documentation'
        }
    }],
    relatedTechnologies: [{
        technology: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technology'
        },
        relationship: {
            type: String,
            enum: ['prerequisite', 'alternative', 'complementary']
        }
    }]
});

module.exports = mongoose.model('Technology', technologySchema);