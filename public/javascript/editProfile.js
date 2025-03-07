// editProfile.js

// Event listener for return button
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
            headerPic.style.height = "100%";
            headerPic.style.objectFit = "cover";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("updateProfileForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents default form submission

    const formData = new FormData(this);

    fetch("/updateProfile", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.headerPic) {

            const profileHeader = document.getElementById("profile-header-pic");
            if (profileHeader) {
                profileHeader.src = data.headerPic;
            }

            alert("✅ Profile updated successfully!");

            setTimeout(() => {
                window.location.href = `/profile/${data.username}`;
            }, 1000);
        } else {
            alert("❌ Failed to update profile. Try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error updating profile:", error);
        alert("❌ An error occurred. Please try again.");
    });
});
