const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    content: [{
      type: String
    }],
    votes: {
      type: Number,
      default: 0
    },
    comments: [{ // Nested comments use the same structure
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment' // Self-reference
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model('Comment', commentSchema);

