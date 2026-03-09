/* SELECT ELEMENTS */
const mainNav = document.querySelector('.navigation ul');
const hamButton = document.querySelector('#menu');
const navLinks = document.querySelectorAll('.navigation a');

/* TOGGLE MENU */
hamButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    hamButton.classList.toggle('open');
    
    // Lock both html and body at the same time
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* CLOSE MENU WHEN A LINK IS CLICKED */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamButton.classList.remove('open');

        document.body.style.overflow = '';
    });
});