const express = require('express');
const session = require('express-session');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb'); 

const contentsPath = path.join(__dirname, '../models/contents.json');
const latestPostsPath = path.join(__dirname, '../models/latestPosts.json');
const reportsPath = path.join(__dirname, '../models/reports.json');

const authController = require('../../public/javascript/mongo/registerUser.js');
const { loginUser } = require('../../public/javascript/mongo/loginUser.js');
const { createPost } = require('../../public/javascript/mongo/crudPost.js');

// MongoDB connection URI
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

// MongoDB client
let client;

// Connect to MongoDB
async function connect() {
    client = new MongoClient(uri);
    await client.connect();
    return client.db('test');
}

// Close MongoDB connection on app exit
async function close() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

process.on('SIGINT', async () => {
    await close();
    process.exit();
});

// Load contents.json
let contentsData = {};
if (fs.existsSync(contentsPath)) {
    try {
        contentsData = JSON.parse(fs.readFileSync(contentsPath, 'utf8'));
        console.log(`File ${contentsPath} found.`);
    } catch (error) {
        console.error('Error reading contents.json:', error);
    }
} else {
    console.warn(`File ${contentsPath} NOT found.`);
}

// Load latestPosts.json
let latestPostsData = [];
if (fs.existsSync(latestPostsPath)) {
    try {
        latestPostsData = JSON.parse(fs.readFileSync(latestPostsPath, 'utf8'));
        console.log(`File ${latestPostsPath} found.`);
    } catch (error) {
        console.error('Error reading latestPosts.json:', error);
    }
} else {
    console.warn(`File ${latestPostsPath} NOT found.`);
}

// Load reports.json
let reportsData = { reports: [] };
if (fs.existsSync(reportsPath)) {
    try {
        reportsData = JSON.parse(fs.readFileSync(reportsPath, 'utf8'));
        console.log(`File ${reportsPath} found.`);
    } catch (error) {
        console.error('Error reading reports.json:', error);
    }
} else {
    console.warn(`File ${reportsPath} NOT found.`);
}

// Dashboard route
router.get('/dashboard', (req, res) => {
    const postsArray = Object.entries(contentsData).map(([postId, post]) => ({ postId, ...post }));
    
    res.render('dashboard', {
        posts: postsArray,
        layout: 'dashboard',
        title: 'ByaHero!',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || '',
        user: req.session.user || {}
    });
});

// Profile route
router.get('/profile/:username', async (req, res) => {
    let { username } = req.params;
    if (!username.startsWith('@')) username = '@' + username;

    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const viewedUser = await usersCollection.findOne({ username });

        if (!viewedUser) return res.status(404).send('User not found');

        const userPosts = Object.entries(contentsData)
            .filter(([postId, post]) => post.postusername === username)
            .map(([postId, post]) => ({ postId, ...post }));

        res.render('profile', {
            displayName: viewedUser.displayName,
            username: viewedUser.username,
            profilePic: viewedUser.profilePic,
            bio: viewedUser.bio,
            posts: userPosts,
            layout: 'profile',
            title: `${viewedUser.displayName}'s Profile`,
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || '',
            viewedUser
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal server error');
    }
});

// Profile menu nav
router.get('/profile/:username/content/:tab', async (req, res) => {
    let { username, tab } = req.params;

    // Ensure username starts with '@'
    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        let content = [];

        switch (tab) {
            case 'comments':
                content = Object.values(contentsData)
                    .flatMap(post => post.comments)
                    .filter(comment => comment.username === username);
                res.render('../partials/profileComments', { comments: content });
                break;
            case 'bookmark':
                res.render('../partials/profileBookmarks', { bookmarks: user.bookmarks || [] });
                break;
            case 'upvoted':
                res.render('../partials/profileUpvoted', { upvoted: user.upvoted || [] });
                break;
            case 'downvoted':
                res.render('../partials/profileDownvoted', { downvoted: user.downvoted || [] });
                break;
            default:
                content = Object.values(contentsData).filter(post => post.postusername === username);
                res.render('../partials/profilePosts', { posts: content });
        }
    } catch (error) {
        console.error('Error fetching user profile content:', error);
        res.status(500).send('Internal server error');
    }
});

// Explore route
router.get('/explore', (req, res) => {
    res.render('explore', {
        latestPosts: latestPostsData,
        layout: 'explore',
        title: 'Explore',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Settings route
router.get('/settings', (req, res) => {
    res.render('settings', {
        layout: 'settings',
        title: 'Settings',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Registration route
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'register',
        title: 'Sign Up',
        isLoggedIn: false,
    });
});

// Register post route
router.post('/registerPost', async (req, res) => {
    const { email, displayName, username, password, bio, profilePic } = req.body;

    try {
        const result = await authController.registerUser(email, displayName, username, password, bio, profilePic);
        console.log("registerUser result: ", result);

        if (result.success) {
            // Send a success response with a redirect URL
            res.status(200).json({ success: true, message: 'Registration successful!', redirect: '/login' });
        } else {
            // Send an error response
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error in register route: ", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Login route
router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) return res.redirect('/dashboard');

    res.render('login', {
        layout: 'login',
        title: 'Sign In',
        isLoggedIn: false
    });
});

// Login POST route
router.post('/loginPost', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (username === '@admin' && password === 'admin123') {
            req.session.isLoggedIn = true;
            req.session.loggedInUser = username;
            req.session.user = { username: 'admin' };
            return res.json({ success: true, redirect: '/admin' });
        }

        const result = await loginUser(username, password);
        if (result.success) {
            req.session.isLoggedIn = true;
            req.session.loggedInUser = result.user;
            req.session.user = result.user;

            console.log('Session After Login:', req.session);  // Debugging log

            res.json({ success: true, user: result.user });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Error logging out:', err);
        res.redirect('/login');
    });
});

// Single post view
router.get('/post/:postId', (req, res) => {
    const { postId } = req.params;
    const postData = contentsData[postId];

    if (!postData) {
        return res.status(404).send('Post not found');
    }

    res.render('post', {
        ...postData,
        postId,
        layout: 'post',
        title: `${postData.displayName}'s Post`,
        isLoggedIn
    });
});

// Welcome page
router.get('/welcome', (req, res) => {
    res.render('welcome', {
        layout: 'welcome',
        title: 'Welcome to ByaHero!',
        isLoggedIn: false,
    });
});

// Create post page
router.get('/createPost', (req, res) => {
    res.render('createPost', {
        layout: 'createPost',
        title: 'Create a Post!',
        isLoggedIn: req.session.isLoggedIn,
        loggedInUser: req.session.loggedInUser,
        user: req.session.user || {}
    });
});

router.post('/createPost', async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const {
            postTitle,
            postContent,
            tags,
        } = req.body;

        const postId = generateUniquePostId();
        const newPost = {
            postId,
            postTitle,
            postContent,
            tags,
            postusername: req.session.loggedInUser.username,
            displayName: req.session.loggedInUser.displayName,
            posterpfp: req.session.loggedInUser.profilePic,
            timestamp: new Date(),
            votes: 0,
            comments: []
        };

        const db = await connect();
        const postsCollection = db.collection('posts');
        await postsCollection.insertOne(newPost);

        res.status(201).json({ success: true, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error in /createPost:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Helper function to generate a unique postId (replace with your implementation)
function generateUniquePostId() {
    // Example: Using a simple timestamp (not ideal for production)
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
    // or use a uuid library.
}

// Notifications page
router.get('/notifications', (req, res) => {
    res.render('notifications', {
        layout: 'notifications',
        title: 'Notifications',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Edit post page
router.get('/editPost', (req, res) => {
    res.render('editPost', {
        layout: 'editPost',
        title: 'Edit your post',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Edit profile page
router.get('/editProfile', (req, res) => {
    res.render('editProfile', {
        profilePic: user.profilePic,
        displayName: user.displayName,
        bio: user.bio,
        layout: 'editProfile',
        title: 'Edit your profile',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Admin page route
router.get('/admin', (req, res) => {
    res.render('admin', {
        layout: 'admin',
        title: 'Admin Report',
        isLoggedIn,
        loggedInUser,
        reports: reportsData.reports // Pass reports data to Handlebars
    });
});

// Admin Notifications page
router.get('/adminNotifications', (req, res) => {
    res.render('adminNotifications', {
        layout: 'adminNotifications',
        title: 'Admin Notifications',
        isLoggedIn,
        loggedInUser
    });
});

// Admin Settings page
router.get('/adminSettings', (req, res) => {
    res.render('adminSettings', {
        layout: 'adminSettings',
        title: 'Admin Settings',
        isLoggedIn,
        loggedInUser
    });
});

// Admin single post view
router.get('/adminPost/:postId', (req, res) => {
    const { postId } = req.params;
    const postData = contentsData[postId];

    if (!postData) {
        return res.status(404).send('Post not found');
    }

    res.render('post', {
        ...postData,
        postId,
        layout: 'adminPost',
        title: `${postData.displayName}'s Post`,
        isLoggedIn
    });
});

router.get('/session-test', (req, res) => {
    console.log('Session Data:', req.session);
    res.json({
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || null,
        user: req.session.user || {},
        sessionID: req.sessionID
    });
});

module.exports = router;