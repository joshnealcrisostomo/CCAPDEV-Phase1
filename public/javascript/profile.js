document.querySelector('.return-btn').addEventListener('click', function() {
    window.history.back();
});

document.querySelector('.edit-btn').addEventListener('click', function() {
    window.location.href = '/editProfile';
});

function toggleOptionsMenu(event) {
    const dots = event.target;
    const postId = dots.getAttribute('data-post-id');
    const menu = document.getElementById(`menu-${postId}`);
    
    // Close all other menus first
    document.querySelectorAll('.dots-menu').forEach(m => {
        if (m.id !== `menu-${postId}`) {
            m.style.display = "none";
        }
    });

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

// Set up dots menu click listeners
const dotsElements = document.querySelectorAll('.dots');
dotsElements.forEach(dots => {
    dots.addEventListener('click', toggleOptionsMenu);
});

// Close options menu if clicked outside
window.addEventListener('click', function(event) {
    if (!event.target.closest('.dots') && !event.target.closest('.dots-menu')) {
        document.querySelectorAll('.dots-menu').forEach(menu => {
            menu.style.display = "none";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".prof-menu-btn a");
    const contentDiv = document.querySelector(".content");

    menuButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove active class from all buttons
            menuButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const tab = this.classList[0].replace("-btn", ""); 
            const username = window.location.pathname.split('/').pop();

            fetch(`/profile/${username}/content/${tab}`)
                .then(response => response.text())
                .then(html => {
                    contentDiv.innerHTML = html;
                    
                    // Reattach event listeners to newly loaded content
                    attachDeleteListeners();
                    attachDotsListeners();
                })
                .catch(error => console.error("Error loading content:", error));
        });
    });
    
    // Initial attachment of listeners
    attachDeleteListeners();
    attachDotsListeners();
});

function attachDotsListeners() {
    const dotsElements = document.querySelectorAll('.dots');
    dotsElements.forEach(dots => {
        dots.addEventListener('click', toggleOptionsMenu);
    });
}

function attachDeleteListeners() {
    document.querySelectorAll(".delete-post-btn").forEach(btn => {
        btn.addEventListener("click", handleDeletePost);
    });
}

async function handleDeletePost(event) {
    event.preventDefault();
    const postId = this.getAttribute('data-post-id');
    const confirmDelete = confirm("Are you sure? This action cannot be undone.");
    
    if (!confirmDelete) return;

    try {
        const response = await fetch("/deletePost", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Post deleted successfully!");
            // Remove the post from the DOM
            const postElement = this.closest('.post');
            if (postElement) {
                postElement.remove();
            } else {
                // If DOM removal fails, refresh the page
                window.location.reload();
            }
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error deleting post:", error);
        alert("❌ Network error. Please try again.");
    }
}