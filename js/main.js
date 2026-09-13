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

const form = document.querySelector('.contact-form');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(field, message) {
  document.getElementById(`${field}-error`).textContent = message;
}
function clearErrors() {
  ['name', 'email', 'message'].forEach((f) => setError(f, ''));
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); // 기본 제출(새로고침) 방지
  clearErrors();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let isValid = true;

  if (!name) { setError('name', '이름을 입력해주세요.'); isValid = false; }

  // 이메일: "필수값 검증"과 "형식 검증"을 분리 — 순서 중요.
  if (!email) {
    setError('email', '이메일을 입력해주세요.');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    setError('email', '올바른 이메일 형식이 아닙니다.');
    isValid = false;
  }

  if (!message) { setError('message', '메시지를 입력해주세요.'); isValid = false; }

  const successMsg = document.getElementById('success-msg');
  if (isValid) {
    successMsg.textContent = '문의가 성공적으로 접수되었습니다!';
    form.reset();
  } else {
    successMsg.textContent = '';
  }
});

const GITHUB_USERNAME = 'yj-min-i';
const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const projectsGrid = document.querySelector('.projects-grid');

function renderLoading() {
  projectsGrid.innerHTML = '<p class="state-msg">로딩 중...</p>';
}
function renderError() {
  projectsGrid.innerHTML = `
    <p class="state-msg">프로젝트를 불러올 수 없습니다.</p>
    <button class="retry-btn">다시 시도</button>
  `;
  document.querySelector('.retry-btn').addEventListener('click', loadProjects);
}
function renderEmpty() {
  projectsGrid.innerHTML = '<p class="state-msg">표시할 프로젝트가 없습니다.</p>';
}
function renderProjects(repos) {
  projectsGrid.innerHTML = repos
    .map((repo) => `
      <article class="project-card">
        <h3>${repo.name}</h3>
        <p>${repo.description ?? '설명이 없습니다.'}</p>
        <span>⭐ ${repo.stargazers_count}</span>
      </article>
    `)
    .join('');
}

async function loadProjects() {
  renderLoading();
  try {
    const response = await fetch(REPOS_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const repos = await response.json();

    if (repos.length === 0) {
      renderEmpty();
      return;
    }
    renderProjects(repos);
  } catch (error) {
    renderError();
  }
}

loadProjects();