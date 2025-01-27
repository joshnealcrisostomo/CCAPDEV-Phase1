async function loadPanels() {
    const leftPanel = await fetch('../main_html/navBar.html').then(response => response.text());
    const rightPanel = await fetch('../main_html/searchPanel.html').then(response => response.text());

    document.getElementById('left-panel').innerHTML = leftPanel;
    document.getElementById('right-panel').innerHTML = rightPanel;
}

loadPanels();