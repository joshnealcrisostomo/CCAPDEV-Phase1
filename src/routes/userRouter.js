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

router.post('/updateProfile', upload.single('profilePic'), async (req, res) => {
    try {
        const { username, displayName, bio } = req.body;
        const profilePic = req.file ? `/profilePictures/${req.file.filename}` : null;

        const result = await updateUser(username, displayName, bio, profilePic);

        if (result.success) {
            console.log("✅ Profile successfully updated in DB");
            res.redirect('/profile/' + username);
        } else {
            console.log("❌ Profile update failed:", result.message);
            res.status(400).send(result.message);
        }
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
