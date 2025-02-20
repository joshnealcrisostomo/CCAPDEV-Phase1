const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const contentsPath = path.join(__dirname, '../models/contents.json');
const usersDataPath = path.join(__dirname, '../models/users.json');
const latestPostsPath = path.join(__dirname, '../models/latestPosts.json');

// Global variables
const loggedInUser = '@euly123'; // Assume the logged-in user is @euly123
let user = {}; // This will be updated after reading usersData

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

// Load users.json
let usersData = {};
if (fs.existsSync(usersDataPath)) {
    try {
        usersData = JSON.parse(fs.readFileSync(usersDataPath, 'utf8'));
        console.log(`File ${usersDataPath} found.`);
        user = usersData[loggedInUser] || {}; // Update global user variable
    } catch (error) {
        console.error('Error reading users.json:', error);
    }
} else {
    console.warn(`File ${usersDataPath} NOT found.`);
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
        isLoggedIn: true,
        loggedInUser
    });
});

// Profile route
router.get('/profile/:username', (req, res) => {
    let { username } = req.params;

    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    const viewedUser = usersData[username];

    if (!viewedUser) {
        return res.status(404).send('User not found');
    }

    const userPosts = Object.entries(contentsData)
        .filter(([postId, post]) => post.postusername === username)
        .map(([postId, post]) => ({ postId, ...post }));

    if (loggedInUser.toLowerCase() === username.toLowerCase()) {
        res.render('profile', {
            displayName: viewedUser.displayName,
            username: viewedUser.username,
            profilePic: viewedUser.profilePic,
            bio: viewedUser.bio,
            posts: userPosts,
            layout: 'profile',
            title: `${viewedUser.displayName}'s Profile`,
            isLoggedIn: true,
            loggedInUser,
            viewedUser
        });
    } else {
        res.render('publicProfile', {
            displayName: viewedUser.displayName,
            username: viewedUser.username,
            profilePic: viewedUser.profilePic,
            bio: viewedUser.bio,
            posts: userPosts,
            layout: 'publicProfile',
            title: `${viewedUser.displayName}'s Profile`,
            isLoggedIn: true,
            loggedInUser,
            viewedUser
        });
    }
});

// Explore route
router.get('/explore', (req, res) => {
    res.render('explore', { 
        latestPosts: latestPostsData,
        layout: 'explore',
        title: 'Explore',
        isLoggedIn: true,
        loggedInUser
    });
});

// Settings route
router.get('/settings', (req, res) => {
    res.render('settings', {
        layout: 'settings',
        title: 'Settings',
        isLoggedIn: true,
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

// Login route
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'login',
        title: 'Sign In',
        isLoggedIn: false,
    });
});

// POST route for login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = usersData[username];
    if (user && user.password === password) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
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
        isLoggedIn: true
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

// Get all users
router.get('/users', (req, res) => {
    res.json(usersData);
});

// Create post page
router.get('/createPost', (req, res) => {
    res.render('createPost', {
        layout: 'createPost',
        title: 'Create a Post!',
        isLoggedIn: true,
        loggedInUser
    });
});

// Notifications page
router.get('/notifications', (req, res) => {
    res.render('notifications', {
        layout: 'notifications',
        title: 'Notifications',
        isLoggedIn: true,
        loggedInUser
    });
});

// Edit post page
router.get('/editPost', (req, res) => {
    res.render('editPost', {
        layout: 'editPost',
        title: 'Edit your post',
        isLoggedIn: true,
        loggedInUser
    });
});

// Edit post page
router.get('/editProfile', (req, res) => {
    res.render('editProfile', {
        profilePic: user.profilePic,
        displayName: user.displayName,
        bio: user.bio,
        layout: 'editProfile',
        title: 'Edit your profile',
        isLoggedIn: true,
        loggedInUser
    });    
});

module.exports = router;
