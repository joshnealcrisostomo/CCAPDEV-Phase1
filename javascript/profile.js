document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    const profileContainer = document.getElementById("profile-container");

    if (users[username]) {
        const source = document.getElementById("profile-template").innerHTML;
        const template = Handlebars.compile(source);
        const profileHTML = template(users[username]);
        profileContainer.innerHTML = profileHTML;
    } else {
        profileContainer.innerHTML = "<h2>User Not Found</h2>";
    }
});