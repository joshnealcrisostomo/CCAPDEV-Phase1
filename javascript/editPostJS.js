window.addEventListener('load', function() {
    fetch('TestProfile.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            const title = doc.getElementById('post-title').textContent;
            const body = doc.getElementById('post-body').textContent;
            const tags = doc.getElementById('post-tags').textContent;

            document.getElementById('post-title').value = title;
            document.getElementById('post-body').value = body;
            document.getElementById('tags').value = tags;
        })
        .catch(error => console.error('Error loading post data:', error));

    document.getElementById('post-title').addEventListener('input', function() {
        const charCount = this.value.length;
        document.getElementById('char-count').textContent = `${charCount}/200`;
    });
});

function saveChanges() {
    const updatedTitle = document.getElementById('post-title').value;
    const updatedBody = document.getElementById('post-body').value;
    const updatedTags = document.getElementById('tags').value;

    console.log("Post updated with title:", updatedTitle);
    console.log("Body:", updatedBody);
    console.log("Tags:", updatedTags);

    alert("Changes saved!");
}
