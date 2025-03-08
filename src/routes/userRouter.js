const express = require("express");
const router = express.Router();
const { deleteUser } = require("../../public/javascript/mongo/deleteUser");
const { updateUser } = require('../../public/javascript/mongo/updateUser.js');
const { ObjectId } = require("mongodb");

const multer = require('multer');
const path = require('path');

// Storage Configuration for Profile & Header Pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "profilePic") {
            cb(null, 'public/profilePictures/'); // Profile pictures go here
        } else if (file.fieldname === "headerPic") {
            cb(null, 'public/headerPictures/'); // Header pictures go here
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

//  File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

// Multer Upload Configuration (Profile & Header)
const upload = multer({ storage, fileFilter });

// DELETE: Delete User Account
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

//  POST: Update Profile (Profile & Header Picture Upload)
router.post('/updateProfile', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'headerPic', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log("Files received:", req.files);

        const { username, displayName, bio } = req.body;

        const profilePic = req.files['profilePic'] ? `/profilePictures/${req.files['profilePic'][0].filename}` : null;
        const headerPic = req.files['headerPic'] ? `/headerPictures/${req.files['headerPic'][0].filename}` : null;

        console.log("Profile Pic Path:", profilePic);
        console.log("Header Pic Path:", headerPic);

        const result = await updateUser(username, displayName, bio, profilePic, headerPic);

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
