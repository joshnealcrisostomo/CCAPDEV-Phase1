document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    const profileContainer = document.getElementById("profile-container");

    if (users[username]) {
        const source = document.getElementById("profile-template").innerHTML;
        const template = Handlebars.compile(source);
        const profileHTML = template(users[username]);
        profileContainer.innerHTML = profileHTML;

        const menuButtons = document.querySelectorAll(".prof-menu-btn a");

        menuButtons.forEach((btn) => {
            btn.addEventListener("click", function (event) {
                event.preventDefault();
    
                menuButtons.forEach((button) => button.classList.remove("active"));
    
                this.classList.add("active");
    
                updateProfileContent(this.classList[0]); 
            });
        });

        updateProfileContent("posts-btn");
    } else {
        profileContainer.innerHTML = "<h2>User Not Found</h2>";
    }

    document.title = `(${username}) / ByaHero!`;
});

function updateProfileContent(activeTab) {
    const contentContainer = document.querySelector(".content");
    const usernameElement = document.querySelector(".username");
    const username = usernameElement ? usernameElement.textContent.trim() : "";

    let contentHTML = ""; 

    if (activeTab.includes("posts-btn") || activeTab.includes("upvoted-btn")) {
        const userPosts = Object.values(posts).filter(post => post.postusername === username);
                
        if (userPosts.length > 0) {
            const source = document.getElementById("post-template").innerHTML;
            const template = Handlebars.compile(source);
            contentHTML = template({ posts: userPosts });
        } else {
            contentHTML = `<img src="../icons/pin.png" alt="pin-icon" class="empty-icon">
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
            contentHTML = `<img src="../icons/${activeTab.replace("-btn", "")}.png" alt="${activeTab}" class="empty-icon">
                           <p>${username} ${fallbackMessages[activeTab]}</p>`;
        } else {
            contentHTML = `<p>Invalid selection.</p>`;
        }
    }

    contentContainer.innerHTML = contentHTML;
}
