document.addEventListener('DOMContentLoaded', function() {
    const updateCommentForm = document.getElementById('updateCommentForm');
    
    if (updateCommentForm) {
        updateCommentForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const commentId = updateCommentForm.getAttribute('data-comment-id');
            const postId = updateCommentForm.getAttribute('data-post-id');
            console.log("📝 Editing Comment ID:", commentId); // Debugging
            console.log("📩 Redirecting to Post ID:", postId); // Debugging

            if (!commentId) {
                alert("❌ Error: Comment ID is missing!");
                return;
            }

            const formData = new FormData(this);
            const commentData = {
                commentText: formData.get('commentText'),
                postId: postId
            };

            try {
                const response = await fetch(`/updateComment/${commentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentData),
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.success) {
                    alert('✅ Comment updated successfully!');
                    window.location.href = `/post/${postId}`;
                } else {
                    alert(`❌ ${result.message}`);
                }
            } catch (error) {
                console.error('Error updating comment:', error);
                alert('❌ Network error. Please try again.');
            }
        });
    }

    // Cancel button functionality
    const cancelButton = document.querySelector('.cancel-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.history.back();
        });
    }
});