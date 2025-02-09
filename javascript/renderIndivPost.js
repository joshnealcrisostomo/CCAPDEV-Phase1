document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post");

    if (!postId || !posts[postId]) {
        document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
        console.error("Post not found for ID:", postId);
        return;
    }

    const postData = posts[postId];

    // Ensure comments and nestedComments are always arrays
    postData.comments = postData.comments || [];
    postData.comments.forEach(comment => {
        comment.nestedComments = comment.nestedComments || [];
    });

    // Debugging Output
    alert(JSON.stringify(postData, null, 2));

    // Compile Handlebars template
    const templateSource = document.getElementById("post-template").innerHTML.trim();
    const template = Handlebars.compile(templateSource);
    const compiledHtml = template(postData);

    // Insert compiled HTML into page
    document.getElementById("post-container").innerHTML = compiledHtml;
});
