const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true, // Assuming postId should be unique
  },
  postTitle: {
    type: String,
    required: true,
  },
  postduration: {
    type: String,
    required: true,
    default: 'Just now', // Default to 'Just now'
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
    type: String,
    default: '0', // Default to 0 votes
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
});

module.exports = mongoose.model('Post', postSchema);