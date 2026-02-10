const burger = document.getElementById('burger-checkbox');
const nav = document.querySelector('.navmenu');
const navLinks = document.querySelectorAll('.navmenu a');

// Toggle menu when burger is clicked
burger.addEventListener('change', () => {
  nav.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    burger.checked = false; // Uncheck the box so the burger icon resets
  });
});