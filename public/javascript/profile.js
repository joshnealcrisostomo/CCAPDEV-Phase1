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

document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".prof-menu-btn a");
    const contentDiv = document.querySelector(".content");

    menuButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove active class from all buttons
            menuButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const tab = this.classList[0].replace("-btn", ""); // Extract tab name from class
            const username = window.location.pathname.split('/').pop(); // Get username from URL

            fetch(`/profile/${username}/content/${tab}`)
                .then(response => response.text())
                .then(html => {
                    contentDiv.innerHTML = html;
                })
                .catch(error => console.error("Error loading content:", error));
        });
    });
});

document.querySelector(".delete-post-btn").addEventListener("click", async function () {
    const postId = this.dataset.postId; // Get postId from button dataset
    const confirmDelete = confirm("Are you sure? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
        const response = await fetch("/deletePost", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId }) // Send postId in request body
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Post deleted successfully!");
            window.location.href = "/dashboard"; // Redirect after deletion
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error deleting post:", error);
        alert("❌ Network error. Please try again.");
    }
});
