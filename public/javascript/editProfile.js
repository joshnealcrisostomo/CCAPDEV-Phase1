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
