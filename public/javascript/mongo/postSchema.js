const mongoose = require('mongoose');

// Define the schema for the `posts` collection
const postSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), // Automatically generate ObjectId
  },
  postId: {
    type: String,
    required: true,
  },
  postusername: {
    type: String,
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postduration: {
    type: String,
    required: true,
  },
  posterpfp: {
    type: String,
    required: true,
  },
  postContent: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  votes: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    default: "", // Default value for comments
  },
});

// Create a Mongoose model for the `posts` collection
const Post = mongoose.model('Post', postSchema);

module.exports = Post;