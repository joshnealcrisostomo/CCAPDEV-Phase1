// In profile.html
document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.querySelector(".content");
    const menuButtons = document.querySelectorAll(".prof-menu-btn span a");
    const editProfileButton = document.querySelector(".edit-btn");

    const lastViewedSection = localStorage.getItem("lastViewedSection") || "posts";
    const lastViewedContent = {
        posts: `<img src="../icons/pin.png" alt="pin-icon" class="empty-icon">
                <p>@username hasn't posted yet.</p>`,
        comments: `<img src="../icons/comment.png" alt="comment-icon" class="empty-icon">
                   <p>@username hasn't commented yet.</p>`,
        bookmark: `<img src="../icons/bookmark.png" alt="bookmark-icon" class="empty-icon">
                    <p>@username hasn't bookmarked anything yet.</p>`,
        upvoted: `<img src="../icons/up.png" alt="upvote-icon" class="empty-icon">
                  <p>@username hasn't upvoted anything yet.</p>`,
        downvoted: `<img src="../icons/down.png" alt="downvote-icon" class="empty-icon">
                    <p>@username hasn't downvoted anything yet.</p>`,
    };

    menuButtons.forEach((btn) => btn.classList.remove("active"));
    const activeButton = document.querySelector(`.${lastViewedSection}-btn`);
    if (activeButton) activeButton.classList.add("active");
    contentDiv.innerHTML = lastViewedContent[lastViewedSection] || "<p>Content not found.</p>";

    menuButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            menuButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const section = button.classList[0].split("-")[0];
            contentDiv.innerHTML = lastViewedContent[section] || "<p>Content not found.</p>";

            localStorage.setItem("lastViewedSection", section);
        });
    });
});

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
    window.location.href = `try_indiv.html?post=${postId}`;
}


function redirectToEditPost() {
    window.location.href = `editPost.html`;
}

