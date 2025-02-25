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