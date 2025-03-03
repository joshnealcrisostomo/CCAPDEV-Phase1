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