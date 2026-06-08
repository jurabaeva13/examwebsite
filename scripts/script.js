// Open and close the mobile menu
const menuButton = document.getElementById('mobile-menu-btn');
const closeButton = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuButton && closeButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
    closeButton.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
}
