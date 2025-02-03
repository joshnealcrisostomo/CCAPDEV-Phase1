// On page load, read the username from URL and render the post
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

        if (posts[username]) {
        // Populating the profile page
        document.getElementById("displayName").textContent = posts[username].displayName;
        document.getElementById("postusername").textContent = posts[username].postusername;
        document.getElementById("postduration").textContent = posts[username].postduration;
        document.getElementById("postTitle").textContent = posts[username].postTitle;
        document.getElementById("posterpfp").src = posts[username].posterpfp;
        document.getElementById("postContent").textContent = posts[username].postContent;
        document.getElementById("postImage").src = posts[username].postImage;
        document.getElementById("votes").textContent = posts[username].votes;
    } else {
        document.querySelector(".middle-panel").innerHTML = "<h2>User Not Found</h2>";
    }
});