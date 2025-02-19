document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("post-container").addEventListener("click", function (event) {
        if (event.target.classList.contains("dots")) {
            event.stopPropagation();
            let menu = event.target.nextElementSibling;

            document.querySelectorAll(".dots-menu").forEach(m => {
                if (m !== menu) m.style.display = "none";
            });

            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        }
    });

    document.addEventListener("click", function () {
        document.querySelectorAll(".dots-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });

    document.getElementById("post-container").addEventListener("click", function (event) {
        if (event.target.classList.contains("dots-menu")) {
            event.stopPropagation();
        }
    });
});
