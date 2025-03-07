const express = require("express");
const router = express.Router();
const { deleteUser } = require("../../public/javascript/mongo/deleteUser");
const { updateUser } = require('../../public/javascript/mongo/updateUser.js');
const { ObjectId } = require("mongodb");

const multer = require('multer');
const path = require('path');

// Configure storage for profile pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profilePictures/'); // Save profile pictures here
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Configure storage for header pictures
const headerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/headerPictures/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

// Initialize Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});


// DELETE: Delete user account
router.delete("/deleteAccount", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = req.session.user._id;
    console.log("🛑 DELETE request for user:", userId);

    try {
        const result = await deleteUser(userId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("❌ Error destroying session:", err);
                return res.status(500).json({ message: "Error logging out after account deletion." });
            }
            console.log("✅ User deleted successfully, session ended.");
            res.json({ success: true, message: "Account deleted." });
        });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/updateProfile', upload.fields([{ name: 'profilePic' }, { name: 'headerPic' }]), async (req, res) => {
    try {
        const { username, displayName, bio } = req.body;
        const profilePic = req.files['profilePic'] ? `/profilePictures/${req.files['profilePic'][0].filename}` : null;
        const headerPic = req.files['headerPic'] ? `/profileHeaders/${req.files['headerPic'][0].filename}` : null;

        const result = await updateUser(username, displayName, bio, profilePic, headerPic);

        if (result.success) {
    console.log("✅ Profile successfully updated in DB");
    res.json({ success: true, headerPic, username }); // Include username in response
} else {
    console.log("❌ Profile update failed:", result.message);
    res.status(400).json({ success: false, message: result.message });
}

    } catch (error) {
        console.error('❌ Error updating profile:', error);
        res.status(500).send('Server error');
    }
});

router.get("/getUserData", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ headerPic: user.headerPic });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
