document.addEventListener("DOMContentLoaded", function () {
    const postsBtn = document.querySelector(".posts-btn");
    const commentsBtn = document.querySelector(".comments-btn");
    const usersBtn = document.querySelector(".users-btn");

    const reportedPosts = document.querySelector(".reported-posts");
    const reportedComments = document.createElement("div");
    const reportedUsers = document.createElement("div");

    reportedComments.classList.add("reported-comments");
    reportedUsers.classList.add("reported-users");

    reportedComments.innerHTML = "<h3>Reported Comments</h3><p>No comments reported yet.</p>";
    reportedUsers.innerHTML = "<h3>Reported Users</h3><p>No users reported yet.</p>";

    const contentDiv = document.querySelector(".content");
    contentDiv.appendChild(reportedComments);
    contentDiv.appendChild(reportedUsers);

    function switchContent(activeBtn, sectionToShow) {
        document.querySelectorAll(".prof-menu-btn a").forEach(btn => btn.classList.remove("active"));
        activeBtn.classList.add("active");

        reportedPosts.style.display = "none";
        reportedComments.style.display = "none";
        reportedUsers.style.display = "none";

        sectionToShow.style.display = "block";
    }

    postsBtn.addEventListener("click", function () {
        switchContent(postsBtn, reportedPosts);
    });

    commentsBtn.addEventListener("click", function () {
        switchContent(commentsBtn, reportedComments);
    });

    usersBtn.addEventListener("click", function () {
        switchContent(usersBtn, reportedUsers);
    });

    // Default view: Show posts
    switchContent(postsBtn, reportedPosts);

    window.approvePost = function(postId) {
        console.log(`Post ${postId} approved`);

        const postRow = document.querySelector(`tr[data-post-id="${postId}"]`);
        const statusCell = postRow.querySelector("td:nth-child(4)");
        statusCell.innerHTML = `<span class="badge resolved-badge">Resolved</span>`;
        postRow.setAttribute("data-status", "resolved");
    }

    window.deletePost = function(postId) {
        console.log(`Post ${postId} deleted`);

        const postRow = document.querySelector(`tr[data-post-id="${postId}"]`);
        postRow.remove();
    }
});
