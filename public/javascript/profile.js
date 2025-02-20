document.addEventListener("DOMContentLoaded", function () {
    // Extract the username from the URL path
    const pathParts = window.location.pathname.split('/');
    const username = pathParts[pathParts.length - 1].replace('@', ''); // Remove '@' from username

    const profileContainer = document.querySelector(".middle-panel .user-info");

    if (users[username]) {
        const profileData = users[username];
        document.title = `${profileData.displayName}`;

        // Compile the profile template and render the user info
        const profileHTML = Handlebars.compile(document.querySelector(".middle-panel").innerHTML);
        profileContainer.innerHTML = profileHTML(profileData);

        // Ensure the menu buttons are available after content is rendered
        const menuButtons = document.querySelectorAll(".prof-menu-btn a");

        // Set up the event listeners for the menu buttons after content is rendered
        menuButtons.forEach((btn) => {
            btn.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default anchor link behavior

                // Remove active class from all buttons and add to the clicked button
                menuButtons.forEach((button) => button.classList.remove("active"));
                this.classList.add("active");

                // Update content based on the clicked button
                updateProfileContent(this.classList[0], profileData.username);
            });
        });

        // Default content load: Show posts
        updateProfileContent("posts-btn", profileData.username);
    } else {
        profileContainer.innerHTML = "<h2>User Not Found</h2>";
    }
});

function updateProfileContent(activeTab, username) {
    const contentContainer = document.querySelector(".content");
    let contentHTML = "";

    // Check if the active tab is related to posts or upvoted
    if (activeTab.includes("posts-btn") || activeTab.includes("upvoted-btn")) {
        const userPosts = Object.values(posts).filter(post => post.postusername === username);

        if (userPosts.length > 0) {
            const source = document.getElementById("post-template").innerHTML;
            const template = Handlebars.compile(source);
            contentHTML = template({ posts: userPosts });
        } else {
            contentHTML = `<img src="/icons/pin.png" alt="pin-icon" class="empty-icon">
                           <p>${username} hasn't posted yet.</p>`;
        }
    } else {
        const fallbackMessages = {
            "posts-btn": "hasn't posted yet.",
            "comments-btn": "hasn't commented yet.",
            "bookmark-btn": "hasn't bookmarked anything yet.",
            "upvoted-btn": "hasn't upvoted anything yet.",
            "downvoted-btn": "hasn't downvoted anything yet."
        };

        if (fallbackMessages[activeTab]) {
            contentHTML = `<img src="/icons/${activeTab.replace("-btn", "")}.png" alt="${activeTab}" class="empty-icon">
                           <p>${username} ${fallbackMessages[activeTab]}</p>`;
        } else {
            contentHTML = `<p>Invalid selection.</p>`;
        }
    }

    // Ensure content is updated
    if (contentContainer) {
        contentContainer.innerHTML = contentHTML;
    } else {
        console.error("Content container not found.");
    }
}

// Event listener for return button
document.querySelector('.return-btn').addEventListener('click', function() {
    window.history.back(); // This goes back to the last page in the browser's history
});

// Event listener for edit profile button
document.querySelector('.edit-btn').addEventListener('click', function() {
    window.location.href = '/editProfile';
});

// Toggle options menu for post actions
function toggleOptionsMenu(event) {
    const menu = document.getElementById("optionsMenu");
    const dots = event.target;

    // Toggle the display of the menu
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        const rect = dots.getBoundingClientRect();
        menu.style.position = "fixed"; 
        menu.style.top = `${rect.bottom}px`; 
        menu.style.left = `${rect.left}px`; 
        menu.style.display = "block";
    }
}

// Attach event listener for dots (toggle options menu)
const dotsElements = document.querySelectorAll('.dots');
dotsElements.forEach(dots => {
    dots.addEventListener('click', toggleOptionsMenu);
});

// Close options menu if clicked outside
window.addEventListener('click', function(event) {
    const menu = document.getElementById("optionsMenu");
    if (!event.target.closest('.dots') && !event.target.closest('.dots-menu')) {
        menu.style.display = "none";
    }
});

// Handle post deletion (if necessary)
function deletePost(event) {
    event.preventDefault();  // Prevents page reload (because of the `href="#"`)
    const confirmation = confirm("Are you sure you want to delete this post?");
    if (confirmation) {
        alert("Post deleted successfully!");
        // Here you can add logic to delete the post from the server/database
    }
}

// Add event listener for post delete buttons
const deletePostButtons = document.querySelectorAll('.delete-post-btn');
deletePostButtons.forEach(button => {
    button.addEventListener('click', deletePost);
});
