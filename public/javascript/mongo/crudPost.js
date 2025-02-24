// createPost.js
const mongoose = require('mongoose');
const Post = require('./postSchema'); // Adjust path as needed
const User = require('./UserSchema'); // Adjust path as needed

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

mongoose.connect(uri);

async function createPost(postId, postTitle, postduration, postContent, postImage, displayName, votes, comments, userId) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create the new post
    const newPost = new Post({
      postId,
      postTitle,
      postduration,
      postContent,
      postImage,
      displayName,
      votes,
      comments,
      author: user._id, // Assign the user's ObjectId
    });

    // Save the post
    await newPost.save();

    console.log('Post created successfully!');
    return { success: true, message: 'Post created successfully' };
  } catch (error) {
    console.error('Error in createPost:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

module.exports = { createPost };