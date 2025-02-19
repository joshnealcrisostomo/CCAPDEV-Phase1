document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");

    if (users[username]) {
        // Populate edit profile fields with user data
        document.getElementById("display-name").value = users[username].displayName;
        document.getElementById("bio-input").value = users[username].bio;
        document.getElementById("profile-pic").src = users[username].profilePic;
    } else {
        document.querySelector(".container").innerHTML = "<h2>User Not Found</h2>";
    }
});

function redirectToProfile() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");

    // Save the updated display name and bio
    users[username].displayName = document.getElementById("display-name").value;
    users[username].bio = document.getElementById("bio-input").value;

    window.location.href = `profile.html?user=${username}`;
}
