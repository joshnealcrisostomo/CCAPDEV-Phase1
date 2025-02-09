document.addEventListener("DOMContentLoaded", function () {
    const postsData = Object.values(posts); // Convert object to array
    const templateSource = document.getElementById("post-template").innerHTML;
    const template = Handlebars.compile(templateSource);
    const compiledHtml = template({ posts: postsData });

    document.getElementById("posts-container").innerHTML = compiledHtml;
});
