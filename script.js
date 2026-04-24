// Function to load header and footer
function loadHeaderFooter() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            highlightActivePage(); // Highlight current page after loading
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Function to highlight active page in navigation
function highlightActivePage() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    const page = currentPage === "" ? "index.html" : currentPage;

    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    // Loop through links and add active class to matching link
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Load when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeaderFooter);