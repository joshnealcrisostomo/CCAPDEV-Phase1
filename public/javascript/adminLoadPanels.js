async function loadPanels() {
    const leftPanel = await fetch('../main_html/adminNavBar.html').then(response => response.text());
    const rightPanel = await fetch('../main_html/adminRightPanel.html').then(response => response.text());
    document.getElementById('left-panel').innerHTML = leftPanel;
    document.getElementById('right-panel').innerHTML = rightPanel;

    const navBar = document.querySelector('.left-panel');
    if (navBar) {
        navBar.addEventListener('click', function(event) {
            if (event.target && event.target.matches('.logout')) {
                const isConfirmed = confirm("Are you sure you want to logout?");
                if (isConfirmed) {
                    window.location.href = '../main_html/login.html';
                }
            }
        });
    }
}

loadPanels();

document.querySelectorAll('.progress-bar').forEach(bar => {
    let progress = bar.querySelector('.progress');
    let percent = progress.style.width;
    bar.parentElement.querySelector('.percentage').innerText = percent;
});
