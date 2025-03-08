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
                    let commentHTML = generateCommentHTML(comment, document.body.getAttribute('data-username'));
                    commentsContainer.appendChild(commentHTML);
                });
            }
    
        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }
    
    function generateCommentHTML(comment, loggedInUser) {
        let isAuthor = loggedInUser && loggedInUser === comment.username;
        let isLoggedIn = !!loggedInUser;
    
        let commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
    
        let dotsMenuHTML = "";
        if (isLoggedIn) {
            dotsMenuHTML = `
                <div class="comment-dots-container">
                    <div class="comment-dots">⋮</div>
                    <div id="menu-${comment._id}" class="comment-dots-menu">
                        ${!isAuthor ? `<a href="/report/${comment._id}">Report</a>` : ''}
                        ${isAuthor ? `<a href="/editComment/${comment._id}">Edit</a>` : ''}
                        ${isAuthor ? `<a href="#" class="delete-comment-btn" data-comment-id="${comment._id}">Delete</a>` : ''}
                    </div>
                </div>
            `;
        }
    
        commentDiv.innerHTML = `
            <div class="user-comment">
                <strong>${comment.username}</strong>
                <div class="comment-header-right">
                    <span>${new Date(comment.createdAt).toLocaleString()}</span>
                    ${dotsMenuHTML}
                </div>
            </div>
            <div class="main-comment">
                <p>${comment.content}</p>
            </div>
            <div class="comment-actions">
                <button class="vote-btn upvote">▲</button>
                <span class="vote-count">${comment.votes}</span>
                <button class="vote-btn downvote">▼</button>
                ${isLoggedIn ? '<button class="action-btn">Reply</button>' : ''}
                <button class="action-btn">Share</button>
            </div>
        `;
    
        if (comment.nestedComments && comment.nestedComments.length > 0) {
            let nestedCommentsDiv = document.createElement("div");
            nestedCommentsDiv.classList.add("nested-comments");
    
            comment.nestedComments.forEach(nestedComment => {
                let nestedCommentHTML = generateCommentHTML(nestedComment, loggedInUser);
                nestedCommentsDiv.appendChild(nestedCommentHTML);
            });
    
            commentDiv.appendChild(nestedCommentsDiv);
        }
    
        return commentDiv;
    }
    
    // Centralized event delegation for all ellipsis clicks
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('dots') || event.target.classList.contains('comment-dots')) {
            event.stopPropagation();
            const dotsElement = event.target;
            const menu = dotsElement.nextElementSibling;
            if (menu) {
                menu.style.display = menu.style.display === "block" ? "none" : "block";
            }
        } else if (!event.target.closest('.dots') && !event.target.closest('.dots-menu') &&
                   !event.target.closest('.comment-dots') && !event.target.closest('.comment-dots-menu')) {
            document.querySelectorAll('.dots-menu, .comment-dots-menu').forEach(menu => {
                menu.style.display = "none";
            });
        }
    });
    
    
    document.addEventListener("DOMContentLoaded", function(){
        fetchComments();
    });

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

// Add this code to add event listeners for delete comment buttons
document.addEventListener('click', async function(event) {
    // Check if clicked element is a delete comment button
    if (event.target.classList.contains('delete-comment-btn') || 
        (event.target.parentElement && event.target.parentElement.classList.contains('delete-comment-btn'))) {
        
        event.preventDefault();
        
        // Get the comment ID from the data attribute
        const element = event.target.classList.contains('delete-comment-btn') ? 
                        event.target : event.target.parentElement;
        const commentId = element.getAttribute('data-comment-id');
        
        if (!commentId) {
            console.error("❌ Comment ID not found");
            return;
        }
        
        // Confirm deletion
        const confirmDelete = confirm("Are you sure you want to delete this comment? This action cannot be undone.");
        if (!confirmDelete) return;
        
        try {
            // Send delete request
            const response = await fetch(`/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Remove the comment from the DOM
                const commentElement = element.closest('.comment');
                if (commentElement) {
                    commentElement.remove();
                }
                console.log("✅ Comment deleted successfully");
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error deleting comment:", error);
            alert("❌ Network error. Please try again.");
        }
    }
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