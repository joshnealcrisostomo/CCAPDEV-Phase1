document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    const profileContainer = document.getElementById("profile-container");

    if (users[username]) {
        const source = document.getElementById("profile-template").innerHTML;
        const template = Handlebars.compile(source);
        const profileHTML = template(users[username]);
        profileContainer.innerHTML = profileHTML;
    } else {
        profileContainer.innerHTML = "<h2>User Not Found</h2>";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".prof-menu-btn a");

    menuButtons.forEach((btn) => {
        btn.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent page reload

            // Remove "active" class from all buttons
            menuButtons.forEach((button) => button.classList.remove("active"));

            // Add "active" class to clicked button
            this.classList.add("active");

            // Update content dynamically (You need to implement this function)
            updateProfileContent(this.classList[0]); 
        });
    });
});

function updateProfileContent(activeTab) {
    const contentContainer = document.querySelector(".content");
    const usernameElement = document.querySelector(".username");
    const username = usernameElement ? usernameElement.textContent.trim() : "This user";

    let contentHTML = ""; 

    switch (activeTab) {
        case "posts-btn":
            contentHTML = `<img src="../icons/pin.png" alt="pin-icon" class="empty-icon">
                           <p>${username} hasn't posted yet.</p>`;
            break;
        case "comments-btn":
            contentHTML = `<img src="../icons/comment.png" alt="comment-icon" class="empty-icon">
                           <p>${username} hasn't commented yet.</p>`;
            break;
        case "bookmark-btn":
            contentHTML = `<img src="../icons/bookmark.png" alt="bookmark-icon" class="empty-icon">
                           <p>${username} hasn't bookmarked anything yet.</p>`;
            break;
        case "upvoted-btn":
            contentHTML = `<img src="../icons/up.png" alt="upvote-icon" class="empty-icon">
                           <p>${username} hasn't upvoted anything yet.</p>`;
            break;
        case "downvoted-btn":
            contentHTML = `<img src="../icons/down.png" alt="downvote-icon" class="empty-icon">
                           <p>${username} hasn't downvoted anything yet.</p>`;
            break;
        default:
            contentHTML = `<p>Invalid selection.</p>`;
    }

    contentContainer.innerHTML = contentHTML;
}

