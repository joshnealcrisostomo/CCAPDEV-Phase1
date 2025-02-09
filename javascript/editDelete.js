document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("post-container").addEventListener("click", function (event) {
        if (event.target.classList.contains("dots")) {
            event.stopPropagation(); // Prevents bubbling
            let menu = event.target.nextElementSibling;

            // Close other open menus
            document.querySelectorAll(".dots-menu").forEach(m => {
                if (m !== menu) m.style.display = "none";
            });

            // Toggle the clicked menu
            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function () {
        document.querySelectorAll(".dots-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });

    // Prevent closing when clicking inside the menu
    document.getElementById("post-container").addEventListener("click", function (event) {
        if (event.target.classList.contains("dots-menu")) {
            event.stopPropagation();
        }
    });
});
