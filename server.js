const mongoose = require("mongoose")
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const PORT = process.env.PORT || 3000;

const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',  // Use a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to `true` if using HTTPS
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/layouts"));
hbs.registerPartials(path.join(__dirname, "views/partials")); // Register partials

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/main_html", express.static(path.join(__dirname, "main_html")));

// Dummy data (importing posts from a separate file)
const posts = require("./src/models/contents");
const router = require('./src/routes/router.js');

app.use(router);

// Redirect the root ("/") route to "/dashboard"
app.get("/", (req, res) => {
    res.redirect("/dashboard");  // Redirect to the dashboard route
});

// Home Route - Renders Dashboard
app.get("/dashboard", (req, res) => {
    res.render("dashboard", { posts: Object.values(posts), isLoggedIn: true,  }); // Ensure isLoggedIn is set
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
