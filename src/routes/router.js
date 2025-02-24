const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb'); // Add this import

const contentsPath = path.join(__dirname, '../models/contents.json');
const latestPostsPath = path.join(__dirname, '../models/latestPosts.json');
const reportsPath = path.join(__dirname, '../models/reports.json');

const authController = require('../../public/javascript/mongo/registerUser.js');
const { loginUser } = require('../../public/javascript/mongo/loginUser.js');

router.use(cookieParser());

// MongoDB connection URI
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

// Global variables
let isLoggedIn = false; // Default value
let loggedInUser = ''; // Default value
let user = {};

// MongoDB client
let client;

// Connect to MongoDB
async function connect() {
    client = new MongoClient(uri);
    await client.connect();
    return client.db('test');
}

// Close MongoDB connection
async function close() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

// Close the connection when the application exits
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
    const postsArray = Object.entries(contentsData).map(([postId, post]) => ({
        postId,
        ...post
    }));

    res.render('dashboard', {
        posts: postsArray,
        layout: 'dashboard',
        title: 'ByaHero!',
        isLoggedIn,
        loggedInUser,
        user 
    });
});

// Profile route
router.get('/profile/:username', async (req, res) => {
    let { username } = req.params;

    // Ensure username starts with '@'
    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    try {
        const db = await connect();
        const usersCollection = db.collection('users');

        // Fetch the viewed user's data from MongoDB
        const viewedUser = await usersCollection.findOne({ username });

        if (!viewedUser) {
            return res.status(404).send('User not found');
        }

        // Fetch posts associated with the viewed user (if needed)
        const userPosts = Object.entries(contentsData)
            .filter(([postId, post]) => post.postusername === username)
            .map(([postId, post]) => ({ postId, ...post }));

        // Check if the profile being viewed belongs to the logged-in user
        if (loggedInUser.toLowerCase() === username.toLowerCase()) {
            // Render the profile page for the logged-in user
            res.render('profile', {
                displayName: viewedUser.displayName,
                username: viewedUser.username,
                profilePic: viewedUser.profilePic,
                bio: viewedUser.bio,
                posts: userPosts,
                layout: 'profile',
                title: `${viewedUser.displayName}'s Profile`,
                isLoggedIn,
                loggedInUser,
                viewedUser
            });
        } else {
            // Render the public profile page for other users
            res.render('publicProfile', {
                displayName: viewedUser.displayName,
                username: viewedUser.username,
                profilePic: viewedUser.profilePic,
                bio: viewedUser.bio,
                posts: userPosts,
                layout: 'publicProfile',
                title: `${viewedUser.displayName}'s Profile`,
                isLoggedIn,
                loggedInUser,
                viewedUser
            });
        }
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
        isLoggedIn,
        loggedInUser
    });
});

// Settings route
router.get('/settings', (req, res) => {
    res.render('settings', {
        layout: 'settings',
        title: 'Settings',
        isLoggedIn,
        loggedInUser
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
    const rememberMeCookie = req.cookies.rememberMe;

    if (rememberMeCookie) {
        // Automatically log the user in
        isLoggedIn = true;
        loggedInUser = rememberMeCookie;
        user = { username: rememberMeCookie }; // Store the user data

        // Redirect to the dashboard
        return res.redirect('/dashboard');
    }

    res.render('login', {
        layout: 'login',
        title: 'Sign In',
        isLoggedIn: false,
    });
});

// POST route for login
router.post('/loginPost', async (req, res) => {
    const { username, password, rememberMe } = req.body;

    try {
        // Check if the credentials match the admin credentials
        if (username === '@admin' && password === 'admin123') {
            // Update global variables
            isLoggedIn = true;
            loggedInUser = username;
            user = { username: 'admin' }; // Store the admin user data

            // Redirect to /admin
            return res.json({ success: true, redirect: '/admin' });
        }

        // Otherwise, proceed with normal login
        const result = await loginUser(username, password);

        if (result.success) {
            // Update global variables
            isLoggedIn = true;
            loggedInUser = username;
            user = result.user; // Store the user data

            // Set cookie if "Remember Me" is checked
            if (rememberMe) {
                const threeWeeks = 21 * 24 * 60 * 60 * 1000; // 3 weeks in milliseconds
                res.cookie('rememberMe', username, { maxAge: threeWeeks, httpOnly: true });
            }

            res.json({ success: true, user });
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
    // Update global variables
    isLoggedIn = false;
    loggedInUser = '';

    // Clear the "Remember Me" cookie
    res.clearCookie('rememberMe');

    // Redirect to the welcome page
    res.redirect('/login');
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
        isLoggedIn,
        loggedInUser
    });
});

// Notifications page
router.get('/notifications', (req, res) => {
    res.render('notifications', {
        layout: 'notifications',
        title: 'Notifications',
        isLoggedIn,
        loggedInUser
    });
});

// Edit post page
router.get('/editPost', (req, res) => {
    res.render('editPost', {
        layout: 'editPost',
        title: 'Edit your post',
        isLoggedIn,
        loggedInUser
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
        isLoggedIn,
        loggedInUser
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

module.exports = router;