document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post");

    if (!postId || !posts[postId]) {
        document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
        return;
    }

    const postData = posts[postId];

    // Compile Handlebars template
    const templateSource = document.getElementById("post-template").innerHTML.trim();
    const template = Handlebars.compile(templateSource);
    const compiledHtml = template(postData);

    // Insert compiled HTML into page
    document.getElementById("post-container").innerHTML = compiledHtml;
});
