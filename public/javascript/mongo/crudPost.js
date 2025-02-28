const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const Post = require('./postSchema'); // Adjust path as needed
const User = require('./UserSchema'); // Adjust path as needed

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

mongoose.connect(uri);

async function createPost(postTitle, postContent, postImage, tags, userId) {
  try {
    // Validate userId
    if(!ObjectId.isValid(userId)){
      console.log("UserId is not a valid ObjectId : ", userId);
      throw new Error('Invalid user ID format');
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create the new post
    const newPost = new Post({
      postTitle,
      postContent,
      postImage: postImage || '', // Use provided image or default empty string
      votes: 0, // Default to 0 votes
      tags: tags || '', // Use provided tags or default empty string
      comments: '', // Default to empty string as per schema
      author: user._id, // Assign the user's ObjectId
    });

    // Save the post
    await newPost.save();

    console.log('Post created successfully!');
    return { success: true, message: 'Post created successfully', post: newPost };
  } catch (error) {
    console.error('Error in createPost:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

async function deletePost(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      return { success: false, message: "Invalid Post ID format" };
    }

    // Check if the post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      console.error("❌ Post not found.");
      return { success: false, message: "Post not found in database" };
    }

    console.log("🔍 Found post, proceeding with deletion:", postExists);

    // Delete the post
    const deleteResult = await Post.deleteOne({ _id: postId });

    if (deleteResult.deletedCount === 0) {
      console.error("❌ Post deletion failed:", postId);
      return { success: false, message: "Post could not be deleted" };
    }

    console.log("✅ Post deleted successfully:", postId);
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return { success: false, message: "Server error" };
  }
}

async function updatePost(postId, updateData) {
  try {
    if (!ObjectId.isValid(postId)) {
      return { success: false, message: "Invalid Post ID format" };
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    // Update only the fields that are provided
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    console.log("✅ Post updated successfully:", updatedPost);
    return { 
      success: true, 
      message: "Post updated successfully",
      post: updatedPost
    };
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function getPostById(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      return { success: false, message: "Invalid Post ID format" };
    }

    const post = await Post.findById(postId).populate('author', 'username email');
    
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    return { success: true, post };
  } catch (error) {
    console.error("❌ Error retrieving post:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

module.exports = { createPost, deletePost, updatePost, getPostById };