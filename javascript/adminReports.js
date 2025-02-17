async function loadPanels() {
    const leftPanel = await fetch('../main_html/adminNavBar.html').then(response => response.text());
    const rightPanel = await fetch('../main_html/adminRightPanel.html').then(response => response.text());
    document.getElementById('left-panel').innerHTML = leftPanel;
    document.getElementById('right-panel').innerHTML = rightPanel;

    const navBar = document.querySelector('.left-panel');
    if (navBar) {
        navBar.addEventListener('click', function(event) {
            if (event.target && event.target.matches('.logout')) {
                const isConfirmed = confirm("Are you sure you want to logout?");
                if (isConfirmed) {
                    window.location.href = '../main_html/login.html';
                }
            }
        });
    }
}

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

    if (activeTab.includes("posts-btn") || activeTab.includes("comments-btn")) {
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
            "comments-btn": "no report.",
            "users-btn": "1 report"
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


loadPanels();

document.querySelectorAll('.progress-bar').forEach(bar => {
    let progress = bar.querySelector('.progress');
    let percent = progress.style.width;
    bar.parentElement.querySelector('.percentage').innerText = percent;
});
