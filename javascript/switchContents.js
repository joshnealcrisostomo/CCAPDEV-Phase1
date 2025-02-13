function redirectTo(page) {
    window.location.href = `../main_html/${page}.html`;
}

function redirectToProfile(username) {
    window.location.href = `profile.html?user=${username}`;
}

function redirectToProfileVisitor(username) {
    window.location.href = `profile_visitor.html?user=${username}`;
}

function redirectToPublicProfile(username) {
    window.location.href = `publicProfile.html?user=${username}`;

}

function redirectToEditProfile() {
    const username = document.getElementById("username").textContent.trim();
    if (username) {
        window.location.href = `editProfile.html?user=${username}`;
    } else {
        console.error("Username not found.");
    }
}

function redirectToPost(postId) {
    window.location.href = `postTemplate.html?post=${postId}`;
}

function redirectToVisitorPost(postId) {
    window.location.href = `visitorPostTemplate.html?post=${postId}`;
}


function redirectToEditPost() {
    window.location.href = `editPost.html`;
}

