const { createPost } = require('./crudPost.js');
const { MongoClient, ObjectId } = require("mongodb");

async function exampleCreatePost() {
const postId = 'post123'; // Unique post ID
const postTitle = 'My First Post';
const postduration = '5 min read';
const postContent = 'This is the content of my first post.';
const postImage = 'https://example.com/image.jpg';
const votes = 4; // Initial votes
const comments = []; // Initial comments (array of ObjectIds)


const userId = '67ba08fa14e872f6047419c1'; // Replace with a valid user ID from your database
try {
    const result = await createPost(
      postId,
      postTitle,
      postduration,
      postContent,
      postImage,
      votes,
      comments,
      userId
    );

    if (result.success) {
      console.log(result.message);
    } else {
      console.error('Failed to create post:', result.message);
    }
  } catch (error) {
    console.error('Error in exampleCreatePost:', error);
  }
}

exampleCreatePost();