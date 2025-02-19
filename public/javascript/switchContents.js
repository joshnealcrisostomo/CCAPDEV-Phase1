// Function to navigate while storing the previous page
function navigateTo(page) {
    sessionStorage.setItem("previousPage", window.location.href); // Store current page before navigating
    window.location.href = page;
}

// Function to go back to the previous page
function goBack() {
    const previousPage = sessionStorage.getItem("previousPage");
    if (previousPage) {
        window.location.href = previousPage;
    } else {
        window.history.back(); // Fallback to browser back if no previous page is stored
    }
}

function redirectTo(page) {
    //navigateTo(`/main_html/${page}.html`);
    app.get("/", (req, res) => {
        res.render(page, { posts: Object.values(posts) });
    });
}

function redirectVisitorTo() {
    navigateTo(`/`);
}

function redirectToDashboard() {
    app.get("/", (req, res) => {
        res.render("dashboard", { posts: Object.values(posts) });
    });
}

function redirectToProfile(username) {
    if (username === "@euly123") {
        navigateTo(`profile.html?user=${username}`);
    } else {
        navigateTo(`publicProfile.html?user=${username}`);
    }
}

function redirectToProfileVisitor(username) {
    navigateTo(`profile_visitor.html?user=${username}`);
}

function redirectToEditProfile() {
    const username = document.getElementById("username")?.textContent.trim();
    if (username) {
        navigateTo(`editProfile.html?user=${username}`);
    } else {
        console.error("Username not found.");
    }
}

function redirectToPost(postId) {
    navigateTo(`postTemplate.html?post=${postId}`);
}

function redirectToVisitorPost(postId) {
    navigateTo(`visitorPostTemplate.html?post=${postId}`);
}

function redirectToEditPost() {
    navigateTo(`editPost.html`);
}

app.get('/profile/:username', (req, res) => {
    const username = req.params.username;

    // Assuming 'users' is an object holding all user data
    const user = users[username];

    if (user) {
        res.render('profile', { user }); // Render profile.hbs with user data
    } else {
        res.status(404).send('User not found');
    }
});


