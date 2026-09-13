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

const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

let currentTheme = localStorage.getItem('theme') || 'light';

function renderTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

renderTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark'; // 상태 변경
  renderTheme(currentTheme); // 렌더링
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target); // 한 번 나타난 뒤엔 그만 감시 (성능)
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('main section').forEach((section) => {
  observer.observe(section);
});