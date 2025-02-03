// On page load, read the username from URL and render the post
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

        if (comments[username]) {
        // Populating the profile page
        document.getElementById("displayName").textContent = comments[username].displayName;
        document.getElementById("comment-username").textContent = comments[username].postusername;
        document.getElementById("comment-duration").textContent = comments[username].postduration;
        document.getElementById("comment-title").textContent = comments[username].postTitle;
        document.getElementById("comment-content").textContent = comments[username].postContent;
        document.getElementById("comment-votes").textContent = comments[username].votes;
    } else {
        document.querySelector(".middle-panel").innerHTML = "<h2>User Not Found</h2>";
    }
});