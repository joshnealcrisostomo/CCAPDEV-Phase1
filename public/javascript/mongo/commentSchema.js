const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
