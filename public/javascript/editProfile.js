/*
document.querySelector('.exit-btn').addEventListener('click', function() {
    window.history.back();
});

// Profile Picture Upload
const profilePicInput = document.getElementById('profile-pic-input');
const editForPfpButton = document.querySelector('.edit-for-pfp');
const profilePic = document.getElementById('profile-pic');

editForPfpButton.addEventListener('click', () => {
    profilePicInput.click();
});

profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Header Image Upload
const headerInput = document.getElementById('header-pic-input');
const editForHeaderButton = document.querySelector('.edit-for-header');
const headerPic = document.getElementById('header-pic');

editForHeaderButton.addEventListener('click', () => {
    headerInput.click();
});

headerInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            headerPic.src = e.target.result;
            headerPic.style.width = "100%";
            headerPic.style.height = "auto";
        };
        reader.readAsDataURL(file);
    }
});

*/

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Exit Button: Go back to the previous page
    document.querySelector('.exit-btn').addEventListener('click', function() {
        window.history.back();
    });

    // ✅ Profile Picture Upload & Live Preview
    const profilePicInput = document.getElementById("profile-pic-input");
    const editForPfpButton = document.querySelector(".edit-for-pfp");
    const profilePicPreview = document.querySelector(".edit-pfp img"); // ✅ Ensures correct selector

    editForPfpButton.addEventListener("click", () => {
        profilePicInput.click(); // ✅ Opens file selector
    });

    profilePicInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicPreview.src = e.target.result; // ✅ Updates preview with new image
            };
            reader.readAsDataURL(file);
        }
    });

    // ✅ Header Image Upload & Live Preview
    const headerPicInput = document.getElementById("header-pic-input");
    const editForHeaderButton = document.querySelector(".edit-for-header");
    const headerPicPreview = document.querySelector(".edit-header-overlay img"); // ✅ Ensures correct selector

    editForHeaderButton.addEventListener("click", () => {
        headerPicInput.click(); // ✅ Opens file selector
    });

    headerPicInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                headerPicPreview.src = e.target.result; // ✅ Updates preview with new image
                headerPicPreview.style.width = "100%"; // ✅ Ensures it fits correctly
                headerPicPreview.style.height = "auto";
            };
            reader.readAsDataURL(file);
        }
    });

    // ✅ Debugging: Check if elements exist
    console.log("Profile Pic Input:", profilePicInput);
    console.log("Header Pic Input:", headerPicInput);
});

