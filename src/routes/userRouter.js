const express = require("express");
const router = express.Router();
const { deleteUser } = require("../../public/javascript/mongo/deleteUser");
const { updateUser } = require('../../public/javascript/mongo/updateUser.js');
const { ObjectId } = require("mongodb");

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

// POST: Update user profile
router.post('/updateProfile', async (req, res) => {
    const { username, displayName, bio } = req.body;

    try {
        const result = await updateUser(username, displayName, bio);
        if (result.success) {
            res.redirect(`/profile/${username}`);
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
