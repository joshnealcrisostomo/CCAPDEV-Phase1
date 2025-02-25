const express = require("express");
const router = express.Router();
const { deletePost } = require("../../public/javascript/mongo/crudPost");

// DELETE: Delete post
router.delete("/deletePost", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { postId } = req.body; // Get postId from request body
    console.log("🛑 DELETE request for post:", postId);

    try {
        const result = await deletePost(postId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
