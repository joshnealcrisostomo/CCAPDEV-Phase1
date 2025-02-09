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

    // Register Handlebars helper for checking if a value is an array
    Handlebars.registerHelper('isArray', function (value) {
        return Array.isArray(value);
    });

    // Compile Handlebars template
    const templateSource = document.getElementById("post-template").innerHTML.trim();
    const template = Handlebars.compile(templateSource);
    const compiledHtml = template(postData);

    // Insert compiled HTML into page
    document.getElementById("post-container").innerHTML = compiledHtml;
});
