document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");

    if (users[username]) {
        // Populating the profile page
        document.getElementById("profile-name").textContent = users[username].displayName;
        document.getElementById("display-name").textContent = users[username].displayName;  // for header display
        document.getElementById("username").textContent = users[username].username;
        document.getElementById("bio").textContent = users[username].bio;
        document.getElementById("profile-pic").src = users[username].profilePic;
    } else {
        document.querySelector(".middle-panel").innerHTML = "<h2>User Not Found</h2>";
    }
});
