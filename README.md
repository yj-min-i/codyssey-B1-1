# 나를 소개하는 웹페이지 처음부터 만들기

> 윤정민의 반응형 포트폴리오 웹사이트입니다. 외부 라이브러리 없이 순수 HTML/CSS/JavaScript로 처음부터 끝까지 제작했습니다.

---

## 1. 프로젝트 소개

React, Vue 같은 프레임워크 없이 순수 HTML/CSS/JavaScript만으로 반응형 포트폴리오 웹사이트를 처음부터 끝까지 만들어보는 미션입니다. "사용자 이벤트 → 상태 변경 → 화면 업데이트"로 이어지는 웹의 기본 동작 원리를 직접 손으로 구현하며 익히는 것이 목표였고, GitHub API를 연동해 실제 서비스에서 자주 마주치는 로딩/에러/빈 상태 처리까지 경험해보았습니다.

- **배포 URL**: https://yj-min-i.github.io/codyssey-B1-1/
- **GitHub 저장소**: https://github.com/yj-min-i/codyssey-B1-1

---

## 2. 스크린샷

### 데스크톱
![데스크톱 화면](screenshots/desktop.png)

### 모바일
![모바일 화면](screenshots/mobile.png)

### 다크모드
![다크모드 화면](screenshots/dark-mode.png)

---

## 3. 사용 기술

| 분류 | 기술 |
|---|---|
| 마크업 | HTML5 (시맨틱 태그) |
| 스타일 | CSS3 (Flexbox, Grid, CSS 변수, 미디어 쿼리) |
| 로직 | Vanilla JavaScript (ES6+) |
| 외부 연동 | GitHub REST API |
| 배포 | GitHub Pages |

React, Vue, jQuery, Bootstrap, Tailwind CSS 등 **외부 프레임워크·라이브러리는 사용하지 않았습니다.**

---

## 4. 폴더 구조

```
codyssey-B1-1/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── screenshots/
│   ├── desktop.png
│   ├── mobile.png
│   └── dark-mode.png
└── README.md
```

> 이미지 자산은 About 섹션의 GitHub 프로필 아바타 1개뿐이며, `https://github.com/사용자명.png` 원격 URL을 직접 불러오기 때문에 별도의 로컬 `images/` 폴더는 두지 않았습니다.

---

## 5. 주요 기능

### 5.1 반응형 레이아웃
모바일 퍼스트로 작성했으며, 브레이크포인트는 다음과 같습니다.
- 기본(모바일): ~767px
- 태블릿: 768px 이상
- 데스크톱: 1024px 이상

### 5.2 인터랙티브 UI
- **햄버거 메뉴**: 모바일 화면에서 네비게이션이 숨겨지고 햄버거 버튼 클릭 시 메뉴가 열림/닫힘
- **부드러운 스크롤**: 네비게이션 클릭 시 해당 섹션으로 부드럽게 이동
- **스크롤 탑 버튼**: 스크롤이 300px 이상 내려가면 버튼이 나타나고, 클릭 시 페이지 최상단으로 이동
- **네비게이션 스타일 변경**: 스크롤이 60px 이상 내려가면 네비게이션 배경색이 변경됨
- **다크모드 토글**: 클릭 시 테마 전환, `localStorage`에 저장되어 새로고침해도 유지됨
- **스크롤 애니메이션**: Intersection Observer(threshold 0.2)를 이용해 섹션이 화면에 들어올 때 페이드인 효과 적용
- **Hero CTA 버튼**: "View Projects", "Contact" 링크를 버튼 형태로 스타일링해 시각적으로 다음 행동을 유도
- **입력 필드 실시간 안내**: 에러가 표시된 필드에 다시 타이핑을 시작하면(`input` 이벤트) 해당 에러 메시지가 즉시 사라짐
- **햄버거 메뉴 애니메이션**: 클릭 시 아이콘이 90도 회전하고, 메뉴는 페이드인+슬라이드다운 애니메이션과 함께 열림

### 5.3 GitHub API 연동
- GitHub REST API(`https://api.github.com/users/yj-min-i/repos`)에서 저장소 목록을 가져와 Projects 섹션에 카드 형태로 렌더링합니다.
- 아래 4가지 상태를 모두 UI로 표현합니다.
  - **로딩 상태**: 데이터 요청 중 "로딩 중..." 표시
  - **성공 상태**: 저장소 카드 리스트 렌더링
  - **에러 상태**: "프로젝트를 불러올 수 없습니다" 메시지 + 재시도 버튼
  - **빈 상태**: "표시할 프로젝트가 없습니다" 메시지
- `fetch` + `async/await` + `try/catch`로 비동기 처리 및 에러 핸들링을 구현했습니다.
- GitHub API는 인증 없이 호출 시 시간당 60회 제한(Rate Limit)이 있으며, 상태 코드에 따라 사용자 메시지를 구분합니다. 403(Rate Limit 초과)이면 "요청 한도를 초과했습니다"라는 안내를, 그 외 실패는 "프로젝트를 불러올 수 없습니다"라는 일반 메시지를 보여주고, 콘솔에는 항상 상세 에러를 남깁니다.
- API 응답 문자열(저장소 이름·설명)은 `innerHTML`에 그대로 넣지 않고 HTML 특수문자를 이스케이프한 뒤 렌더링해 XSS를 방지합니다.

### 5.4 폼 유효성 검사 (Contact)
- 이름/이메일/메시지 필수값 검증 (빈 필드 제출 불가)
- 이메일 형식 정규식 검증 (필수값 검증과 형식 검증을 분리해, 빈 칸일 때도 정확한 안내 메시지가 뜨도록 처리)
- 에러 메시지가 각 입력 필드 근처에 표시됨
- 에러가 있는 입력에는 `aria-invalid="true"`를 설정하고, 제출 실패 시 첫 번째 에러 필드로 포커스를 이동해 스크린리더·키보드 사용자를 돕습니다.
- `event.preventDefault()`로 기본 제출 동작을 막고, 통과 시 성공 메시지 표시

---

## 6. "상태 → 렌더링" 흐름

이 프로젝트는 테마, 모바일 메뉴 열림 여부, GitHub API 응답, 폼 에러 메시지라는 4가지 상태를 하나의 중앙 `STATE` 객체로 모아 관리합니다(자세한 구조는 13.2 참고). 각 기능은 동일하게 "사용자 이벤트 → `STATE`의 해당 값 변경 → 그 값을 읽는 `render*` 함수 호출"의 흐름을 따릅니다.

1. **다크모드 토글**: 버튼 클릭 → `STATE.theme` 변경 → `renderTheme()`가 `data-theme` 속성과 CSS 변수를 갱신하며 전체 화면 스타일 변경 → `localStorage`에 상태 저장
2. **GitHub API 연동**: 페이지 로드 → `STATE.apiStatus`가 `loading → success/error/empty`로 변경 → `renderProjects()`가 `STATE.apiStatus`/`STATE.repos`를 읽어 Projects 섹션을 다시 렌더링
3. **폼 유효성 검사**: 제출 버튼 클릭 → `STATE.formErrors` 갱신 → 각 필드 에러 메시지 표시/숨김, 성공 메시지 표시
4. **모바일 메뉴 토글**: 햄버거 버튼 클릭 → `STATE.menuOpen` 변경 → `renderMenu()`가 네비게이션 메뉴 표시/숨김

---

## 7. 설정 가능한 임계값

| 항목 | 값 | 위치 |
|---|---|---|
| 스크롤 탑 버튼 표시 기준 | 300px | `js/main.js` `SCROLL_TOP_THRESHOLD` |
| 네비게이션 스타일 변경 기준 | 60px | `js/main.js` `NAV_STYLE_THRESHOLD` |
| Intersection Observer threshold | 0.2 | `js/main.js` `IntersectionObserver` 옵션 |

---

## 8. 로컬 실행 방법

```bash
git clone https://github.com/yj-min-i/codyssey-B1-1.git
cd codyssey-B1-1
```

VS Code에서 열고, `index.html`을 우클릭 → **"Open with Live Server"** 로 실행합니다. 별도 빌드/설치 과정 없이 바로 동작합니다.

---

## 9. 배포 방법

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

GitHub 저장소 → **Settings → Pages** → Branch를 `main`으로 지정하면 자동으로 배포되며, 아래 URL에서 확인할 수 있습니다.

```
https://yj-min-i.github.io/codyssey-B1-1/
```

---

## 10. 코드 스타일 및 제약 준수 사항

- `var` 대신 `const`/`let`만 사용
- HTML `onclick` 속성 대신 `addEventListener`로 이벤트 연결
- 인라인 `style="..."` 미사용 (모든 스타일은 `css/style.css`에서 관리)
- 최신 Chrome 브라우저에서 정상 동작 확인 완료

---

## 11. 배운 점 / 회고

DOM을 직접 선택하고(`querySelector`), 이벤트를 연결하고(`addEventListener`), 상태가 바뀔 때마다 화면을 다시 그리는 과정을 손으로 짜보면서, React 같은 프레임워크가 내부적으로 무엇을 자동화해주는 기술인지 조금 더 감이 잡혔습니다. 특히 GitHub API 연동에서 로딩/성공/에러/빈 상태를 각각 다른 함수로 나눠 처리하면서, 비동기 데이터를 다루는 화면은 "성공했을 때"만 생각해서는 안 되고 실패 상황까지 미리 설계해야 한다는 점을 체감했습니다.

---

## 12. 보너스 과제

기본 요구사항 구현에 집중하느라 대부분의 보너스 과제는 진행하지 않았지만, **시스템 다크 모드 감지**는 접근성 보완 과정에서 함께 구현했습니다. `window.matchMedia('(prefers-color-scheme: dark)')`로 `localStorage`에 저장된 값이 없을 때(첫 방문) 사용자의 OS 다크모드 설정을 초기 테마로 반영합니다(13.5 참고).

---

## 13. 설계 노트 및 보완 사항

과제 완성 후 자체적으로 점검하면서 확인한 설계 의도와, 시간 관계상 이번 제출에는 포함하지 않은 개선 여지를 정리합니다.

### 13.1 레이아웃 기술 선택 근거
- **네비게이션 — Flexbox**: 로고, 메뉴, 다크모드 버튼을 한 줄에서 양 끝/사이로 정렬해야 해서 `justify-content: space-between`을 쓰는 Flexbox가 적합했습니다.
- **Projects 카드 — Grid**: 카드 개수가 API 응답에 따라 가변적이고, 화면 너비에 따라 한 줄에 들어가는 카드 수가 자동으로 바뀌어야 해서 `repeat(auto-fit, minmax(250px, 1fr))`를 쓰는 Grid를 선택했습니다. Flexbox의 `flex-wrap`으로도 비슷하게 구현할 수 있지만, 열 너비를 최소/최대값으로 동시에 제어하기에는 Grid의 `minmax()`가 더 직관적이었습니다.

### 13.2 상태 관리 방식 (중앙 STATE 객체)

`js/main.js` 상단에 아래와 같은 중앙 `STATE` 객체를 두고, 테마·모바일 메뉴 열림 여부·GitHub API 응답·폼 에러 메시지라는 4가지 상태를 이 객체 하나로 모아서 관리합니다.

```js
const STATE = {
  theme: getInitialTheme(), // localStorage 값이 없으면 OS 다크모드 설정을 따름 (13.5 참고)
  menuOpen: false,
  repos: [],
  apiStatus: 'idle', // idle | loading | success | error | empty
  apiErrorMessage: '',
  formErrors: { name: '', email: '', message: '' },
};
```

각 기능은 모두 동일한 패턴을 따릅니다: **이벤트 발생 → `STATE`의 해당 값 변경 → 그 값만 읽어서 화면을 다시 그리는 `render*` 함수 호출.**

- 다크모드 토글 → `STATE.theme` 변경 → `renderTheme()`
- 모바일 메뉴 토글 → `STATE.menuOpen` 변경 → `renderMenu()`
- GitHub API 응답 → `STATE.apiStatus`(`loading → success/error/empty`) + `STATE.repos` 변경 → `renderProjects()`
- 폼 검증 결과 → `STATE.formErrors` 변경 → `renderFieldError()`

4가지 상태는 서로 완전히 독립적이라 값 하나가 바뀌었다고 다른 값까지 같이 갱신해야 하는 경우는 없습니다. 그래도 중앙 객체로 모아둔 이유는, "지금 앱 전체 상태가 뭔지"를 `STATE` 하나만 보고 파악할 수 있고, 각 `render*` 함수가 항상 `STATE`라는 동일한 출처에서 값을 읽기 때문에 나중에 상태끼리 서로 참조해야 하는 기능(예: 다크모드에 따라 Projects 카드 디자인도 달라지게 하기)이 추가되더라도 기존 구조를 크게 바꾸지 않고 확장할 수 있기 때문입니다.

### 13.3 접근성(Accessibility) 관련
- 햄버거 버튼에 `aria-label="메뉴 열기"`를 기본 적용했고, 메뉴 열림/닫힘 상태를 `aria-expanded` 속성으로 함께 갱신하도록 했습니다.
- 폼 에러 메시지 영역(`name-error`, `email-error`, `message-error`)에는 `aria-live="polite"`를 적용해, 스크린리더 사용자에게도 에러 발생 시 실시간으로 안내되도록 했습니다.
- About 섹션의 프로필 이미지에는 `alt="윤정민 GitHub 프로필 이미지"`를 명시했습니다.
- 폼 입력값이 유효하지 않으면 해당 입력에 `aria-invalid="true"`를 설정하고, 제출 실패 시 첫 번째 에러 필드로 포커스를 이동시킵니다.
- 햄버거·다크모드 버튼, 폼 제출 버튼, 스크롤 탑 버튼 등 클릭 요소는 모두 최소 44×44px의 터치 영역을 확보했습니다.

### 13.4 타이포그래피
`:root`에 `--font-base`(시스템 기본 폰트 스택)와 `--font-size-base`(16px) 변수를 정의해 `body`에 적용했습니다. 다만 제목·본문별 크기 단계(예: `--font-size-sm`, `--font-size-lg`)까지는 세분화하지 않았고, 커스텀 웹폰트 대신 OS 기본 폰트(`-apple-system` 등)를 그대로 사용했습니다. 지금은 크기 구분이 필요한 만큼 요소가 다양하지 않아 기본값 하나로 충분하다고 판단했으며, 추후 타이포그래피 위계(제목/부제목/본문 등)가 늘어나면 크기별 변수로 확장할 계획입니다.

### 13.5 다크모드 초기값
`localStorage`에 저장된 값이 있으면 그 값을 최우선으로 사용합니다. 저장된 값이 없는 첫 방문 시에는 `window.matchMedia('(prefers-color-scheme: dark)')`로 사용자의 OS 다크모드 설정을 확인해 초기 테마로 반영합니다. 즉 우선순위는 `localStorage 저장값 > OS 설정 > light(기본값)` 순입니다.

### 13.6 에러 처리 상세도
GitHub API 호출 실패 시 상태 코드에 따라 사용자 메시지를 구분합니다. 403(Rate Limit 초과)이면 "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."를, 그 외 실패는 "프로젝트를 불러올 수 없습니다."를 보여줍니다. `catch` 블록에서는 `console.error()`로 콘솔에도 항상 상세 에러를 함께 기록해, 사용자에게 보여주는 메시지(간단·안전)와 개발자가 디버깅에 쓰는 정보(상세)를 분리했습니다.

### 13.7 XSS 방어
GitHub API 응답의 저장소 이름·설명은 외부에서 온 문자열이라, `innerHTML`에 그대로 넣으면 악성 스크립트가 포함된 값이 실행될 위험이 있습니다. `escapeHTML()` 헬퍼로 `<`, `>`, `&` 등 HTML 특수문자를 텍스트로 치환한 뒤에만 카드 HTML에 삽입하도록 했습니다.

### 13.8 이벤트 핸들러 구성
현재 `js/main.js`는 파일을 하나로 두되, `// ===== 기능명 =====` 주석으로 기능 단위를 구분하고 각 기능마다 전용 `render*` 함수를 두는 방식으로 정리했습니다. 기능이 4~5개 수준인 이 프로젝트 규모에서는 파일을 여러 개로 쪼개는 것보다, 한 파일 안에서 기능별 섹션을 명확히 나누는 편이 오히려 코드를 한눈에 따라가기 쉽다고 판단했습니다. 기능이 더 늘어나면 `theme.js`, `form.js`처럼 파일 단위로 분리하는 것을 고려할 수 있습니다.

### 13.9 개발용 상태 로그
`main.js` 상단의 `DEBUG` 상수를 `true`로 바꾸면, 상태가 바뀔 때마다(`renderMenu`, `renderTheme`, `setError`, `renderProjects` 호출 시점) 그 시점의 `STATE` 전체를 콘솔에 출력해 상태 변화 흐름을 추적할 수 있습니다. 기본값은 `false`로 두어 배포 시에는 콘솔에 불필요한 로그가 남지 않도록 했습니다.