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

function toggleCommentOptionsMenu(event) {
    const dots = event.target;
    const commentId = dots.getAttribute('data-comment-id');
    const menu = document.getElementById(`comment-menu-${commentId}`);
    
    // Close all other comment menus
    document.querySelectorAll('.comment-dots-menu').forEach(m => {
        if (m.id !== `comment-menu-${commentId}`) {
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

const dotsElements = document.querySelectorAll('.dots');
dotsElements.forEach(dots => {
    dots.addEventListener('click', toggleOptionsMenu);
});

function attachCommentDotsListeners() {
    document.querySelectorAll('.comment-dots').forEach(dots => {
        dots.addEventListener('click', toggleCommentOptionsMenu);
    });
}

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
                    attachCommentDotsListeners();
                })
                .catch(error => console.error("Error loading content:", error));
        });
    });
    
    // Initial attachment of listeners
    attachDeleteListeners();
    attachDotsListeners();
    attachCommentDotsListeners();
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

async function handleDeleteComment(event) {
    event.preventDefault();
    const commentId = this.getAttribute('data-comment-id');
    
    console.log("🗑️ Delete button clicked for comment:", commentId); // Debugging

    if (!commentId) {
        alert("❌ Comment ID not found!");
        return;
    }

    const confirmDelete = confirm("Are you sure? This action cannot be undone?");
    if (!confirmDelete) return;

    try {
        console.log("📡 Sending DELETE request to /comments/" + commentId); // Debugging

        const response = await fetch(`/comments/${commentId}`, {  // ✅ FIXED ROUTE
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("📝 Server Response:", data); // Debugging

        if (response.ok) {
            alert("✅ Comment deleted successfully!");
            const commentElement = this.closest('.comment');
            if (commentElement) {
                commentElement.remove(); // ✅ Removes from UI
            } else {
                window.location.reload();
            }
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error deleting comment:", error);
        alert("❌ Network error. Please try again.");
    }
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-comment-btn")) {
        console.log("🗑️ Delete comment button clicked:", event.target); // Debugging
        handleDeleteComment.call(event.target, event);
    }
});

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