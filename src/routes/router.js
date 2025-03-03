const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb'); 

const latestPostsPath = path.join(__dirname, '../models/latestPosts.json');

const { getAllReports, getReportById } = require('../../public/javascript/mongo/crudReport.js');
const authController = require('../../public/javascript/mongo/registerUser.js');
const { loginUser } = require('../../public/javascript/mongo/loginUser.js');
const { createPost, deletePost, updatePost } = require('../../public/javascript/mongo/crudPost.js');
const { updateUser } = require('../../public/javascript/mongo/updateUser.js');
const Post = require('../../public/javascript/mongo/postSchema.js');

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
/*
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
*/
router.get('/dashboard', async (req, res) => {
    try {        
        let posts = await Post.find()
                              .populate('author')
                              .sort({ createdAt: -1 })
                              .exec();
        
        res.render('dashboard', {
            posts,
            layout: 'dashboard',
            title: 'ByaHero!',
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || '',
        });
    } catch (error) {
        console.error('Error fetching posts for dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
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

        const userPosts = await Post.find({ author: viewedUser._id })
                                   .populate('author')
                                   .sort({ createdAt: -1 })
                                   .exec();

        const loggedInUser = req.session.user ? req.session.user.username : '';
        const isOwnProfile = req.session.user && req.session.user.username === viewedUser.username;

        if (isOwnProfile) {
            res.render('profile.hbs', {
                displayName: viewedUser.displayName,
                username: viewedUser.username,
                profilePic: viewedUser.profilePic,
                bio: viewedUser.bio,
                posts: userPosts,
                layout: 'profile',
                title: `${viewedUser.displayName}'s Profile`,
                isLoggedIn: !!req.session.user,
                loggedInUser,
                viewedUser
            });
        } else {
            res.render('publicProfile.hbs', {
                displayName: viewedUser.displayName,
                username: viewedUser.username,
                profilePic: viewedUser.profilePic,
                bio: viewedUser.bio,
                posts: userPosts,
                layout: 'publicProfile',
                title: `${viewedUser.displayName}'s Profile`,
                isLoggedIn: !!req.session.user,
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

    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const viewedUser = await usersCollection.findOne({ username });

        if (!viewedUser) {
            return res.status(404).send('User not found');
        }

        const isOwnProfile = req.session.user && req.session.user.username === viewedUser.username;
        
        if(isOwnProfile) {
            switch (tab) {
                case 'comments':
                    const comments = await Post.find({ "comments.author": viewedUser._id })
                                             .populate('author')
                                             .exec();
                    res.render('../partials/profileComments', { comments });
                    break;
                case 'bookmark':
                    const bookmarkedPosts = await Post.find({ _id: { $in: viewedUser.bookmarks || [] } })
                                                    .populate('author')
                                                    .exec();
                    res.render('../partials/profileBookmarks', { bookmarks: bookmarkedPosts });
                    break;
                case 'upvoted':
                    const upvotedPosts = await Post.find({ _id: { $in: viewedUser.upvoted || [] } })
                                                 .populate('author')
                                                 .exec();
                    res.render('../partials/profileUpvoted', { upvoted: upvotedPosts });
                    break;
                case 'downvoted':
                    const downvotedPosts = await Post.find({ _id: { $in: viewedUser.downvoted || [] } })
                                                   .populate('author')
                                                   .exec();
                    res.render('../partials/profileDownvoted', { downvoted: downvotedPosts });
                    break;
                default:
                    const userPosts = await Post.find({ author: viewedUser._id })
                                              .populate('author')
                                              .sort({ createdAt: -1 })
                                              .exec();
                    res.render('../partials/profilePosts', { posts: userPosts, Post });
            }
        } else {
            switch (tab) {
                case 'comments':
                    const comments = await Post.find({ "comments.author": viewedUser._id })
                                             .populate('author')
                                             .exec();
                    res.render('../partials/pubProfileComments', { comments });
                    break;
                case 'upvoted':
                    const upvotedPosts = await Post.find({ _id: { $in: viewedUser.upvoted || [] } })
                                                 .populate('author')
                                                 .exec();
                    res.render('../partials/pubProfileUpvoted', { upvoted: upvotedPosts });
                    break;
                default:
                    const userPosts = await Post.find({ author: viewedUser._id })
                                              .populate('author')
                                              .sort({ createdAt: -1 })
                                              .exec();
                    res.render('../partials/pubProfilePosts', { posts: userPosts, Post });
            }
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
            res.status(200).json({ success: true, message: 'Registration successful!', redirect: '/login' });
        } else {
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
            req.session.loggedInUser = username;
            req.session.user = result.user;
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

// Welcome page
router.get('/welcome', (req, res) => {
    res.render('welcome', {
        layout: 'welcome',
        title: 'Welcome to ByaHero!',
        isLoggedIn: false,
    });
});

// Individual post route
router.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId).populate('author').exec();

        res.render('post', {
            post,
            author: post.author,
            layout: 'post',
            title: `${post.author ? post.author.displayName : 'Unknown'}'s Post`,
            comments: post.comments || [],
            isLoggedIn: !!req.session.user,
            loggedInUser: req.session.loggedInUser
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Error loading post: ' + error.message);
    }
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

// Create post route
router.post('/createPost', async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const {
            postTitle,
            postContent,
            postImage,
            tags,
        } = req.body;

        const userId = req.session.user._id;
        
        const result = await createPost(
            postTitle, 
            postContent, 
            postImage, 
            tags, 
            userId
        );

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in /createPost:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete post router
router.delete('/deletePost', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { postId } = req.body;
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== req.session.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only delete your own posts" });
        }

        const result = await deletePost(postId);

        if (result.success) {
            res.json({ success: true, message: "Post deleted successfully" });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error in delete post route:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Notifications page
router.get('/notifications', (req, res) => {
    res.render('notifications', {
        layout: 'notifications',
        title: 'Notifications',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Update GET route
router.get('/editPost/:id', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const postId = req.params.id;
        
        // Fetch the post
        const post = await Post.findById(postId).populate('author').exec();
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        // Check if the current user is the author of the post
        if (post.author._id.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('You are not authorized to edit this post');
        }
        
        // Render the edit page with the post data
        res.render('editPost', {
            post,
            layout: 'editPost',
            title: 'Edit Post',
            isLoggedIn: !!req.session.user,
            loggedInUser: req.session.user ? req.session.user.username : ''
        });
    } catch (error) {
        console.error('Error loading edit post page:', error);
        res.status(500).send('Server error');
    }
});

// Update POST route 
router.post('/updatePost/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const postId = req.params.id;
        const { postTitle, postContent, tags } = req.body;
        const userId = req.session.user._id;
        
        const result = await updatePost(postId, postTitle, postContent, tags, userId);
        
        if (result.success) {
            return res.redirect(`/post/${postId}`);
        } else {
            const post = await Post.findById(postId).populate('author').exec();
            return res.render('editPost', { 
                post,
                layout: 'editPost',
                title: 'Edit Post',
                isLoggedIn: !!req.session.user,
                loggedInUser: req.session.user ? req.session.user.username : '',
                error: result.message 
            });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Server error');
    }
});

// Edit profile page
router.get('/editProfile', async (req, res) => {
    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username: req.session.loggedInUser });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('editProfile', {
            profilePic: user.profilePic,
            displayName: user.displayName,
            bio: user.bio,
            layout: 'editProfile',
            title: 'Edit your profile',
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || ''
        });
    } catch (error) {
        console.error('Error fetching user for edit profile:', error);
        res.status(500).send('Internal server error');
    }
});


router.get('/admin', async (req, res) => {
    try {
        // Get all reports from database
        const result = await getAllReports();
        
        if (!result.success) {
            console.error('Error fetching reports:', result.message);
            return res.status(500).send('Error fetching reports');
        }
        
        res.render('admin', {
            layout: 'admin',
            title: 'Admin Report',
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || '',
            reports: result.reports // Use reports from database
        });
    } catch (error) {
        console.error('Error in admin route:', error);
        res.status(500).send('Internal server error');
    }
});

// Admin Notifications page
router.get('/adminNotifications', (req, res) => {
    res.render('adminNotifications', {
        layout: 'adminNotifications',
        title: 'Admin Notifications',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Admin Settings page
router.get('/adminSettings', (req, res) => {
    res.render('adminSettings', {
        layout: 'adminSettings',
        title: 'Admin Settings',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Admin single post view
router.get('/adminViewPost/:postId', (req, res) => {
    const { postId } = req.params;
    const postData = contentsData[postId];

    if (!postData) {
        return res.status(404).send('Post not found');
    }

    res.render('post', {
        ...postData,
        postId,
        layout: 'adminViewPost',
        title: `${postData.displayName}'s Post`,
        isLoggedIn: req.session.isLoggedIn || false
    });
});

// Adnin profile route
router.get('/adminProfile/:username', async (req, res) => {
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

        res.render('adminProfile', {
            displayName: viewedUser.displayName,
            username: viewedUser.username,
            profilePic: viewedUser.profilePic,
            bio: viewedUser.bio,
            posts: userPosts,
            layout: 'adminProfile',
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

// Admin menu nav
router.get('/admin/content/:tab', async (req, res) => {
    const { tab } = req.params;
    
    try {
        let filters = {};
        
        // Set appropriate filters based on tab
        switch (tab) {
            case 'commentsReport':
                filters.reportedItemType = 'Comment';
                break;
            case 'usersReport':
                // Note: Your current schema doesn't support User reports
                // You may need to add 'User' to the enum in reportSchema
                filters.reportedItemType = 'User';
                break;
            default: // postsReport
                filters.reportedItemType = 'Post';
        }
        
        // Get filtered reports from database
        const result = await getAllReports(filters);
        
        if (!result.success) {
            console.error(`Error fetching ${tab} reports:`, result.message);
            return res.status(500).send(`Error fetching ${tab} reports`);
        }
        
        // Render appropriate partial with reports from database
        switch (tab) {
            case 'commentsReport':
                res.render('../partials/adminComments', { reports: result.reports });
                break;
            case 'usersReport':
                res.render('../partials/adminUsers', { reports: result.reports });
                break;
            default:
                res.render('../partials/adminPosts', { reports: result.reports });
        }
    } catch (error) {
        console.error(`Error in admin/${tab} route:`, error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
