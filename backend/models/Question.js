const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    body: String,
    tags: [],
    created_at: {
        type: Date,
        default: Date.now()
    },
    user: Object,
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    },
    votes: {
        type: Map,
        of: Number, // 1 for upvote, -1 for downvote
        default: {},
    }
});

module.exports = mongoose.model("Questions", questionSchema);
