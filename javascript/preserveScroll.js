document.addEventListener("DOMContentLoaded", function () {
    // Restore scroll position if available
    if (localStorage.getItem("scrollPosition") !== null) {
        window.scrollTo(0, localStorage.getItem("scrollPosition"));
    }
});

window.addEventListener("beforeunload", function () {
    // Save the current scroll position
    localStorage.setItem("scrollPosition", window.scrollY);
});
