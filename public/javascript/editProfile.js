// editProfile.js
// Event listener for return button
document.querySelector('.exit-btn').addEventListener('click', function() {
    window.history.back(); // This goes back to the last page in the browser's history
});

// Profile picture change functionality
const profilePicInput = document.getElementById('profile-pic-input');
const editForPfpButton = document.querySelector('.edit-for-pfp');
const profilePic = document.getElementById('profile-pic');

editForPfpButton.addEventListener('click', () => {
    profilePicInput.click(); // Trigger file input
});

profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePic.src = e.target.result; // Update preview
        };
        reader.readAsDataURL(file);
    }
});