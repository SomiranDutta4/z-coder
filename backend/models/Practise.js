const mongoose = require('mongoose');

const practiseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    titleSlug:{
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    acRate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paidOnly: {
        type: Boolean,
        required: true
    },
    topicTags: [{
        name: {
            type: String,   
            required: true
        },
        slug: {
            type: String,
            required: true
        }
    }],
});

module.exports = mongoose.model('Practise', practiseSchema);