const mongoose = require("mongoose");
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const { deleteUser } = require("./public/javascript/mongo/deleteUser");

const express = require("express");
const cors = require("cors");
const path = require("path");
const hbs = require("hbs");
const methodOverride = require("method-override");
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    });

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(methodOverride("_method"));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/layouts"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "public")));

const posts = require("./src/models/contents");
const router = require('./src/routes/router.js');
const userRoutes = require("./src/routes/userRouter.js");

console.log("📂 Checking Router Type:", typeof router);
console.log("📂 Checking UserRouter Type:", typeof userRoutes);

if (typeof router === "function") {
    app.use(router);
} else {
    console.error("❌ ERROR: router.js is not a valid middleware function!");
}

if (typeof userRoutes === "function") {
    app.use(userRoutes);
} else {
    console.error("❌ ERROR: userRouter.js is not a valid middleware function!");
}

app.get("/", (req, res) => {
    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard", { posts: Object.values(posts), isLoggedIn: true });
});

const User = require("./public/javascript/mongo/UserSchema.js");

app.use(async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId); 
            req.session.user = user;
        } catch (error) {
            console.error("❌ Error loading user profile:", error);
        }
    }
    next();
});

// Settings Route
app.get("/settings", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");

        console.log("Session User Data:", req.session.user);

        const user = await User.findById(req.session.user._id);
        if (!user) {
            console.log("❌ User Not Found in Database");
            return res.redirect("/dashboard");
        }

        console.log("✅ User Found:", user);
        res.render("settings", { user, isLoggedIn: true });
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.redirect("/dashboard");
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        if (!req.session.user) {
            console.log("❌ Unauthorized DELETE request.");
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = req.params.id;
        console.log("🛑 Deleting user:", userId);

        const result = await deleteUser(userId);

        if (!result.success) {
            console.log("❌ Delete failed:", result.message);
            return res.status(404).json({ message: result.message });
        }

        console.log("✅ User deleted:", userId);
        req.session.destroy();
        res.status(200).json({ message: "User deleted successfully", redirect: "/register" });
    } catch (error) {
        console.error("❌ Error handling DELETE request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});