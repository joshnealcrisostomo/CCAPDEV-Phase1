document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dots").forEach(dots => {
        dots.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevents the click from bubbling up
            let menu = this.nextElementSibling;
            
            // Close other open menus
            document.querySelectorAll(".dots-menu").forEach(m => {
                if (m !== menu) m.style.display = "none";
            });

            // Toggle the clicked menu
            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function () {
        document.querySelectorAll(".dots-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });

    // Prevent closing when clicking inside the menu
    document.querySelectorAll(".dots-menu").forEach(menu => {
        menu.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    });
});
