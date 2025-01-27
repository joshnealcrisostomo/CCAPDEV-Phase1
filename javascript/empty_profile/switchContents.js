document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.querySelector(".content");
    const menuButtons = document.querySelectorAll(".prof-menu-btn span a");

    const contentData = {
        posts: `<img src="../icons/pin.png" alt="pin-icon" class="empty-icon">
                <p>@username hasn't posted yet.</p>`,
        comments: `<img src="../icons/comment.png" alt="comment-icon" class="empty-icon">
                   <p>@username hasn't commented yet.</p>`,
        bookmark: `<img src="../icons/bookmark.png" alt="bookmark-icon" class="empty-icon">
                    <p>@username hasn't bookmarked anything yet.</p>`,
        upvoted: `<img src="../icons/up.png" alt="upvote-icon" class="empty-icon">
                  <p>@username hasn't upvoted anything yet.</p>`,
        downvoted: `<img src="../icons/down.png" alt="downvote-icon" class="empty-icon">
                    <p>@username hasn't downvoted anything yet.</p>`
    };

    menuButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            menuButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const section = button.classList[0].split("-")[0];
            contentDiv.innerHTML = contentData[section] || "<p>Content not found.</p>";
        });
    });
});