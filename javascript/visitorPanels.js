async function loadPanels() {
    const leftPanel = await fetch('../main_html/visitorNavBar.html').then(response => response.text());
    const rightPanel = await fetch('../main_html/visitorSearchPanel.html').then(response => response.text());

    document.getElementById('left-panel').innerHTML = leftPanel;
    document.getElementById('right-panel').innerHTML = rightPanel;

}

loadPanels();

function redirectToLogin() {
    window.location.href = 'login.html';  // This will redirect to login.html
}
