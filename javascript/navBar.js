document.addEventListener('DOMContentLoaded', function() {
    // Delegate the click event to the parent element
    const navBar = document.querySelector('.left-panel');
    
    if (navBar) {
        navBar.addEventListener('click', function(event) {
            if (event.target && event.target.matches('.logout')) {
                const isConfirmed = confirm("Are you sure you want to logout?");
                if (isConfirmed) {
                    window.location.href = '../main_html/login.html'; // Redirect to login
                }
            }
        });
    }
});
