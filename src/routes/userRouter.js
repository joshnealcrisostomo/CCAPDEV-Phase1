const express = require("express");
const router = express.Router();
const { deleteUser } = require("../../public/javascript/mongo/deleteUser");
const { ObjectId } = require("mongodb");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    next();
};

// Test route to verify router is working
router.get("/test", (req, res) => {
    res.send("✅ userRouter is working!");
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


module.exports = router;
