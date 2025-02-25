const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require("mongodb");
const Post = require('./postSchema'); // Adjust path as needed
const User = require('./UserSchema'); // Adjust path as needed

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

mongoose.connect(uri);

async function createPost(postId, postTitle, postduration, postContent, postImage, votes, comments, userId) {
  try {

    if(!ObjectId.isValid(userId)){
      console.log("UserId is not a valid ObjectId : ", userId);
  }
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
      votes,
      comments, // will be an object id array list also
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

async function deletePost(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      return { success: false, message: "Invalid Post ID format" };
    }

    const objectId = new ObjectId(postId);

    // Check if the post exists
    const postExists = await Post.findById(objectId);
    if (!postExists) {
      console.error("❌ Post not found.");
      return { success: false, message: "Post not found in database" };
    }

    console.log("🔍 Found post, proceeding with deletion:", postExists);

    // Delete the post
    const deleteResult = await Post.deleteOne({ _id: objectId });

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

module.exports = { createPost, deletePost };