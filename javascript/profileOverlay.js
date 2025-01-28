document.addEventListener("DOMContentLoaded", () => {
    const editProfileBtn = document.querySelector(".edit-btn"); // Corrected selector
    const overlay = document.getElementById("editProfileOverlay");
    const overlayContent = overlay.querySelector(".overlay-content");

    // Function to load editProfile.html content dynamically
    const loadEditProfileContent = async () => {
        try {
            const response = await fetch("../main_html/editProfile.html");
            if (response.ok) {
                const html = await response.text();
                overlayContent.innerHTML = html;

                // Add event listener for the close button inside the loaded content
                const newCloseBtn = overlayContent.querySelector(".exit-btn");
                if (newCloseBtn) {
                    newCloseBtn.addEventListener("click", closeOverlay);
                }
            } else {
                console.error("Failed to load editProfile.html");
            }
        } catch (error) {
            console.error("Error loading editProfile.html:", error);
        }
    };

    // Function to show the overlay
    const openOverlay = () => {
        overlay.classList.add("active");
        loadEditProfileContent();
    };

    // Function to hide the overlay
    const closeOverlay = () => {
        overlay.classList.remove("active");
        overlayContent.innerHTML = ""; // Clear content for reusability
    };

    // Event listener for the "Edit Profile" button
    editProfileBtn.addEventListener("click", openOverlay);
});
