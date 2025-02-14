document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post");

    if (!postId || !posts[postId]) {
        document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
        console.error("Post not found for ID:", postId);
        return;
    }

    const postData = posts[postId];

    postData.comments = postData.comments || [];
    postData.comments.forEach(comment => {
        comment.nestedComments = comment.nestedComments || [];
    });

    Handlebars.registerHelper('isArray', function (value) {
        return Array.isArray(value);
    });

    const templateSource = document.getElementById("post-template").innerHTML.trim();
    const template = Handlebars.compile(templateSource);
    const compiledHtml = template(postData);

    document.getElementById("post-container").innerHTML = compiledHtml;

    document.title = `${postData.postusername}'s Post`;
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
});

