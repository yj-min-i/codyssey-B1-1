const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

const scrollTopBtn = document.querySelector('.scroll-top-btn');
const nav = document.querySelector('nav');

const SCROLL_TOP_THRESHOLD = 300;
const NAV_STYLE_THRESHOLD = 60;   

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  scrollTopBtn.classList.toggle('visible', y > SCROLL_TOP_THRESHOLD);
  nav.classList.toggle('scrolled', y > NAV_STYLE_THRESHOLD);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});