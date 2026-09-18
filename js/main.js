// ===== 중앙 상태 객체 =====
const STATE = {
  theme: localStorage.getItem('theme') || 'light',
  menuOpen: false,
  repos: [],
  apiStatus: 'idle', // idle | loading | success | error | empty
  formErrors: { name: '', email: '', message: '' },
};

// ===== 모바일 메뉴 토글 =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function renderMenu() {
  navMenu.classList.toggle('active', STATE.menuOpen);
  hamburger.setAttribute('aria-expanded', STATE.menuOpen);
}

hamburger.addEventListener('click', () => {
  STATE.menuOpen = !STATE.menuOpen; // 상태 변경
  renderMenu(); // 렌더링
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    STATE.menuOpen = false; // 상태 변경
    renderMenu(); // 렌더링
  });
});

// ===== 스크롤 탑 버튼 & 네비게이션 스타일 변경 =====
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

// ===== 다크모드 =====
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

function renderTheme() {
  root.setAttribute('data-theme', STATE.theme);
  localStorage.setItem('theme', STATE.theme);
}

renderTheme();

themeToggle.addEventListener('click', () => {
  STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark'; // 상태 변경
  renderTheme(); // 렌더링
});

// ===== 스크롤 애니메이션 (Intersection Observer) =====
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

// ===== 폼 유효성 검사 =====
const form = document.querySelector('.contact-form');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderFieldError(field) {
  document.getElementById(`${field}-error`).textContent = STATE.formErrors[field];
}
function setError(field, message) {
  STATE.formErrors[field] = message; // 상태 변경
  renderFieldError(field); // 렌더링
}
function clearErrors() {
  ['name', 'email', 'message'].forEach((f) => setError(f, ''));
}

// input 이벤트: 다시 타이핑을 시작하면 해당 필드의 에러 메시지를 바로 지움
['name', 'email', 'message'].forEach((field) => {
  form[field].addEventListener('input', () => {
    setError(field, '');
  });
});

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

// ===== GitHub API 연동 =====
const GITHUB_USERNAME = 'yj-min-i';
const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const projectsGrid = document.querySelector('.projects-grid');

function renderProjects() {
  if (STATE.apiStatus === 'idle') return;

  if (STATE.apiStatus === 'loading') {
    projectsGrid.innerHTML = '<p class="state-msg">로딩 중...</p>';
    return;
  }
  if (STATE.apiStatus === 'error') {
    projectsGrid.innerHTML = `
      <p class="state-msg">프로젝트를 불러올 수 없습니다.</p>
      <button class="retry-btn">다시 시도</button>
    `;
    document.querySelector('.retry-btn').addEventListener('click', loadProjects);
    return;
  }
  if (STATE.apiStatus === 'empty') {
    projectsGrid.innerHTML = '<p class="state-msg">표시할 프로젝트가 없습니다.</p>';
    return;
  }

  // success
  projectsGrid.innerHTML = STATE.repos
    .map((repo) => {
      // 구조분해 할당으로 repo 객체에서 필요한 값만 추출 (stargazers_count → stars로 이름 변경)
      const { name, description, stargazers_count: stars } = repo;
      return `
        <article class="project-card">
          <h3>${name}</h3>
          <p>${description ?? '설명이 없습니다.'}</p>
          <span>⭐ ${stars}</span>
        </article>
      `;
    })
    .join('');
}

async function loadProjects() {
  STATE.apiStatus = 'loading'; // 상태 변경
  renderProjects(); // 렌더링

  try {
    const response = await fetch(REPOS_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const repos = (await response.json()).filter((repo) => !repo.fork);

    STATE.repos = repos; // 상태 변경
    STATE.apiStatus = repos.length === 0 ? 'empty' : 'success'; // 상태 변경
  } catch (error) {
    console.error('GitHub API 호출 실패:', error);
    STATE.apiStatus = 'error'; // 상태 변경
  }

  renderProjects(); // 렌더링
}

loadProjects();