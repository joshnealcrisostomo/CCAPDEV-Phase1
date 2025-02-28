const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true,
  },
  postContent: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    default: '', // Default to an empty string if no image
  },
  votes: {
    type: Number, // Changed to Number type for easier manipulation
    default: 0,
  },
  tags: {
    type: String,
    default: '', // Default to an empty string if no tags
  },
  comments: {
    type: String,
    default: '', // Default to an empty string for comments
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Author is required
  },
},{
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);