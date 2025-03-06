document.querySelector('.return-btn').addEventListener('click', function() {
    window.history.back();
});

const dotsElements = document.querySelectorAll('.dots');
dotsElements.forEach(dots => {
    dots.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleOptionsMenu(this);
    });
});

function toggleOptionsMenu(dotsElement) {
    const postId = dotsElement.closest('.dots-container').querySelector('.dots-menu').id.replace('menu-', '');
    const menu = document.getElementById(`menu-${postId}`);
    if (menu) {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
}

window.addEventListener('click', function(event) {
    if (!event.target.closest('.dots') && !event.target.closest('.dots-menu')) {
        document.querySelectorAll('.dots-menu').forEach(menu => {
            menu.style.display = "none";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".action-btn").forEach(button => {
        if (button.textContent.trim() === "Reply") {
            button.addEventListener("click", function () {
                let commentContainer = this.closest(".comment");
                let existingReplyContainer = commentContainer.querySelector(".reply-input-container");

                if (existingReplyContainer) {
                    existingReplyContainer.remove();
                } else {
                    let replyContainer = document.createElement("div");
                    replyContainer.classList.add("reply-input-container");
                    replyContainer.style.marginLeft = "30px";
                    replyContainer.style.marginTop = "10px";

                    let replyInput = document.createElement("textarea");
                    replyInput.placeholder = "Write a reply...";
                    replyInput.style.width = "80%";
                    replyInput.style.height = "36px";
                    replyInput.style.border = "1px solid #c7b9b9";
                    replyInput.style.borderRadius = "40px";
                    replyInput.style.padding = "10px";
                    replyInput.style.resize = "none";

                    let submitButton = document.createElement("button");
                    submitButton.textContent = "Reply";
                    submitButton.classList.add("add-comment-btn");
                    submitButton.style.marginLeft = "10px";
                    submitButton.style.position = "relative";
                    submitButton.style.top = "-15px";

                    replyContainer.appendChild(replyInput);
                    replyContainer.appendChild(submitButton);
                    commentContainer.appendChild(replyContainer);

                    replyInput.addEventListener("input", function () {
                        this.style.height = "36px"; 
                        if (this.scrollHeight > this.clientHeight) {
                            this.style.height = Math.min(this.scrollHeight, 150) + "px"; 
                        }

                        if (this.scrollHeight >= 100) {
                            this.style.overflowY = "auto";
                        } else {
                            this.style.overflowY = "hidden";
                        }
                    });

                    submitButton.addEventListener("click", function () {
                        let replyText = replyInput.value.trim();
                        if (replyText) {
                            console.log("Reply Submitted:", replyText);
                            replyContainer.remove();
                        }
                    });
                }
            });
        }
    });

    // Comment Button Functionality
    async function fetchComments() {
        let postId = window.location.pathname.split("/").pop();
        const commentsContainer = document.querySelector(".comments-section");

        try {
            let response = await fetch(`/comments/${postId}`);
            let data = await response.json();

            commentsContainer.innerHTML = "";

            if (Array.isArray(data)) {
                data.forEach(comment => {
                    console.log("🛠️ Comment Data:", comment);
                    let newComment = document.createElement("div");
                    newComment.classList.add("comment");
                    newComment.innerHTML = `
                        <div class="user-comment">
                        <strong>${comment.username}</strong>
                            <span>${new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <div class="main-comment">
                            <p>${comment.content}</p>
                        </div>
                        <div class="comment-actions">
                            <button class="vote-btn upvote">▲</button>
                            <span class="vote-count">${comment.votes}</span>
                            <button class="vote-btn downvote">▼</button>
                            <button class="action-btn">Reply</button>
                        </div>
                    `;
                    commentsContainer.appendChild(newComment);
                });
            }
        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }

    fetchComments();
    
    const commentBtn = document.querySelector("#comment-btn");
    const commentInput = document.querySelector("#comment-input");

    if (!commentBtn || !commentInput) {
        console.error("❌ Comment button or input not found!");
        return;
    }

    let username = document.body.getAttribute('data-username') || "Anonymous";
    let postId = window.location.pathname.split("/").pop();

    commentBtn.addEventListener("click", async function () {
        let commentText = commentInput.value.trim();
        if (commentText === "") {
            console.warn("⚠️ Empty comment!");
            return;
        }

        try {
            let response = await fetch("/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, username, content: commentText })
            });

            let data = await response.json();
            console.log("📩 API Response:", data);

            if (data.success) {
                commentInput.value = "";
                fetchComments();
            } else {
                console.error("❌ Failed to save comment:", data.message);
            }
        } catch (error) {
            console.error("❌ Error saving comment:", error);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const commentTextArea = document.querySelector(".add-comment-section textarea");

    commentTextArea.addEventListener("input", function () {
        this.style.height = "36px";
        if (this.scrollHeight > this.clientHeight) {
            this.style.height = Math.min(this.scrollHeight, 150) + "px";
        }

        if (this.scrollHeight >= 100) {
            this.style.overflowY = "auto";
        } else {
            this.style.overflowY = "hidden";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".delete-post-btn").forEach(btn => {
        btn.addEventListener("click", handleDeletePost);
    });

    document.querySelectorAll(".vote-btn").forEach(btn => {
        btn.addEventListener("click", handleVote);
    });
});

async function handleDeletePost(event) {
    event.preventDefault();
    const postId = this.getAttribute('data-post-id');
    const confirmDelete = confirm("Are you sure? This action cannot be undone.");

    if (!confirmDelete) return;

    try {
        const response = await fetch("/deletePost", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Post deleted successfully!");
            const postElement = this.closest('.post');
            if (postElement) {
                postElement.remove();
            } else {
                window.location.reload();
            }
            window.location.href = "/dashboard";
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error deleting post:", error);
        alert("❌ Network error. Please try again.");
    }
}

async function handleVote(event) {
    event.preventDefault();
    const isPostVote = this.closest('.post-actions');
    const isCommentVote = this.closest('.comment-actions');
    const isUpvote = this.querySelector('img[alt="upvote"]') || this.classList.contains('upvote');
    const postId = this.getAttribute('data-post-id');

    if (!postId) {
        console.error("Post ID not found");
        return;
    }

    let commentId;

    if (isCommentVote) {
        commentId = this.closest('.comment').getAttribute('data-comment-id');
    }

    if (isPostVote) {
        try {
            const voteContainer = this.closest('.vote-container');
            const voteCount = voteContainer.querySelector('.vote-count');
            const isCurrentlyUpvoted = voteContainer.classList.contains('upvoted');

            const response = await fetch(isUpvote ? `/upvotePost/${postId}` : `/downvotePost/${postId}`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                voteCount.textContent = data.votes;

                if (isUpvote) {
                    if (isCurrentlyUpvoted) {
                        voteContainer.classList.remove('upvoted');
                        voteCount.classList.remove('upvoted');
                    } else {
                        voteContainer.classList.add('upvoted');
                        voteCount.classList.add('upvoted');
                    }
                } else {
                    if (isCurrentlyUpvoted) {
                        voteContainer.classList.remove('upvoted');
                        voteCount.classList.remove('upvoted');
                    }
                }
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error voting:", error);
            alert("❌ Network error. Please try again.");
        }
    } else if (isCommentVote) {
        try {
            const voteContainer = this.closest('.comment-actions').querySelector('.vote-container');
            const voteCount = this.closest('.comment-actions').querySelector('.vote-count');
            const isCurrentlyUpvoted = voteContainer.classList.contains('upvoted');

            const response = await fetch(isUpvote ? `/upvoteComment/${postId}/${commentId}` : `/downvoteComment/${postId}/${commentId}`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                voteCount.textContent = data.votes;

                if (isUpvote) {
                    if (isCurrentlyUpvoted) {
                        voteContainer.classList.remove('upvoted');
                        voteCount.classList.remove('upvoted');
                    } else {
                        voteContainer.classList.add('upvoted');
                        voteCount.classList.add('upvoted');
                    }
                } else {
                    if (isCurrentlyUpvoted) {
                        voteContainer.classList.remove('upvoted');
                        voteCount.classList.remove('upvoted');
                    }
                }
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error voting:", error);
            alert("❌ Network error. Please try again.");
        }
    }
}