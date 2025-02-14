document.addEventListener("DOMContentLoaded", function () {
    if (typeof posts !== "undefined") {
        const postsData = Object.values(posts); // Convert object to array
        
        if (document.getElementById("post-template")) {
            const templateSource = document.getElementById("post-template").innerHTML;
            const template = Handlebars.compile(templateSource);
            const compiledHtml = template({ posts: postsData });
            document.getElementById("posts-container").innerHTML = compiledHtml;
        }

        if (document.getElementById("visitor-post-template")) {
            const visitorTemplateSource = document.getElementById("visitor-post-template").innerHTML;
            const visitorTemplate = Handlebars.compile(visitorTemplateSource);
            const visitorCompiledHtml = visitorTemplate({ posts: postsData });
            document.getElementById("visitor-posts-container").innerHTML = visitorCompiledHtml;
        }
    }
});