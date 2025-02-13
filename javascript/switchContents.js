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

// Modify existing redirect functions to use navigateTo

function redirectTo(page) {
    navigateTo(`../main_html/${page}.html`);
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