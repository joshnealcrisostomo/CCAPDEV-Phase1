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
router.delete("/users/:id", async (req, res) => {
    console.log("🛑 DELETE request received for user ID:", req.params.id);
    console.log("Session User Data:", req.session.user);

    try {
        if (!req.session.user) {
            console.log("❌ Unauthorized DELETE request");
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = new ObjectId(String(req.session.user._id));
        if (!userId.equals(new ObjectId(String(req.params.id)))) {
            console.log("❌ Forbidden: User can only delete their own account");
            return res.status(403).json({ message: "Forbidden. You can only delete your own account." });
        }

        console.log("✅ Proceeding with account deletion:", req.params.id);
        const result = await deleteUser(req.params.id);
        if (!result.success) {
            console.log("❌ User not found");
            return res.status(404).json({ message: result.message });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("❌ Error destroying session:", err);
            }
            console.log("✅ User deleted successfully, redirecting to register");
            res.redirect("/register");
        });
        
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
