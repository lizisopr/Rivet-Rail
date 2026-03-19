const burger = document.getElementById('burger-checkbox');
const nav = document.querySelector('.navmenu');
const navLinks = document.querySelectorAll('.navmenu a');

burger.addEventListener('change', () => {
  nav.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    burger.checked = false; 
  });
});

const closeBtn = document.querySelector('.close-menu');

closeBtn.addEventListener('click', () => {
  nav.classList.remove('active');
  overlay.classList.remove('active');
  burger.checked = false;
});