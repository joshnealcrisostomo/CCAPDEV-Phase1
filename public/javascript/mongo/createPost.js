const mongoose = require("mongoose");
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const Post = require('./postSchema.js');

mongoose.connect(uri);

async function createPost(postId, postusername, postTitle, postduration, posterpfp, postContent, postImage, displayName, votes, comments, customId = null) {
  try {
    let _id = customId ? new mongoose.Types.ObjectId(customId) : undefined;
    const newPost = new Post({
        _id: _id,
        postId,
        postusername,
        postTitle,
        postduration,
        posterpfp,
        postContent,
        postImage,
        displayName,
        votes,
        comments,
    });

    await newPost.save();
    console.log('Post saved successfully!');
    return { success: true, message: 'Post created successfully' };
  } catch (error) {
    console.error('Error in createPost:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

module.exports = { createPost };