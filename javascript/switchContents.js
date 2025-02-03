// In profile.html
document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.querySelector(".content");
    const menuButtons = document.querySelectorAll(".prof-menu-btn span a");
    const editProfileButton = document.querySelector(".edit-btn");

    // Load the last viewed section from localStorage
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

    // Set the active section and content on load
    menuButtons.forEach((btn) => btn.classList.remove("active"));
    const activeButton = document.querySelector(`.${lastViewedSection}-btn`);
    if (activeButton) activeButton.classList.add("active");
    contentDiv.innerHTML = lastViewedContent[lastViewedSection] || "<p>Content not found.</p>";

    // Update the content and save the section in localStorage when switching
    menuButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            menuButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const section = button.classList[0].split("-")[0];
            contentDiv.innerHTML = lastViewedContent[section] || "<p>Content not found.</p>";

            // Save the section to localStorage
            localStorage.setItem("lastViewedSection", section);
        });
    });

/*
    // Handle the "Edit Profile" button click
    if (editProfileButton) {
        editProfileButton.addEventListener("click", () => {
            // Save the last viewed section to localStorage before navigating
            localStorage.setItem("lastViewedSection", lastViewedSection);
            window.location.href = "../main_html/editProfile.html";
        });
    }
});

// In editProfile.html
document.addEventListener("DOMContentLoaded", () => {
    const exitButton = document.querySelector(".exit-btn");
    const saveButton = document.querySelector(".save-btn");

    // Handle the "Exit" button click
    if (exitButton) {
        exitButton.addEventListener("click", () => {
            window.location.href = "../main_html/profile.html";
        });
    }

    // Handle the "Save" button click
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            // Simulate saving logic here, if needed

            // Navigate back to the profile page
            window.location.href = "../main_html/profile.html";
        });
    }
*/        
});

function redirectToEditProfile() {
    window.location.href = 'editProfile.html';  
}

function redirectToUserProfile() {
    window.location.href = 'profile.html'; 
}

function redirectToRegister() {
    window.location.href = 'register.html'; 
}

function redirectToLogin() {
    window.location.href = 'login.html'; 
}

function redirectToExplore() {
    window.location.href = 'explore.html';
}

function redirectToHome() {
    window.location.href = 'dashboard.html';
}

function redirectToProfile() {
    window.location.href = 'profile.html';

}

function redirectToVisitor() {
    window.location.href = 'visitor_dashboard.html';
}

function redirectToCreate() {
    window.location.href = 'create.html';
}

function redirectToSamplePost1() {
    window.location.href = 'sample_post.html'
}

function redirectToSamplePost2() {
    window.location.href = 'sample2.html'
}

function redirectToSettings() {
    window.location.href = 'settings.html';
}