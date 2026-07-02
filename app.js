// ==========================================
// 1. Supabase 접속 설정 (본인의 정보로 변경 필요)
// ==========================================
const SUPABASE_URL = "https://vvabwtxeegqzlosakuxt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2YWJ3dHhlZWdxemxvc2FrdXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDU0MTMsImV4cCI6MjA5ODUyMTQxM30.ab0V7cBBNrG2NhrTDfvLvPqqbeLErLTPMRGTYacsQw4";




let supabaseInstance = null;
let currentUser = null;

try {
  if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn("⚠️ Supabase URL과 Anon Key가 기본값입니다. 실제 연동을 하려면 app.js 상단에 값을 입력해 주세요.");
  }
} catch (e) {
  console.error("Supabase SDK 초기화 중 에러 발생:", e);
}

// ==========================================
// 2. 추천 시스템 콘텐츠 데이터베이스 (고화질 플레이스홀더 이미지 포함)
// ==========================================
const RECOMMEND_MOVIES = [
  {
    id: 1,
    title: "다크 나이트",
    genre: "Action",
    emoji: "🦇",
    image: "assets/movies/1.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX500_.jpg",
    desc: "영웅의 어두운 내면을 깊이 있게 탐구한 세기의 액션 블록버스터.",
    videoUrl: "https://www.youtube.com/embed/LDG9bisJEaI"
  },
  {
    id: 2,
    title: "매드맥스: 분노의 도로",
    genre: "Action",
    emoji: "🔥",
    image: "assets/movies/2.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTQyMDY2MTA1OF5BMl5BanBnXkFtZTgwNzM1ODYwNTE@._V1_FMjpg_UX500_.jpg",
    desc: "황폐화된 사막 한가운데서 생존을 위해 펼쳐지는 폭렬 카체이싱 액션.",
    videoUrl: "https://www.youtube.com/embed/YWNWi-ZWL3c"
  },
  {
    id: 3,
    title: "라라랜드",
    genre: "Romance",
    emoji: "💃",
    image: "assets/movies/3.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_FMjpg_UX500_.jpg",
    desc: "꿈을 쫓는 청춘들의 열정과 계절처럼 변하는 애틋한 로맨스 뮤지컬.",
    videoUrl: "https://www.youtube.com/embed/je0aAf2f8XQ"
  },
  {
    id: 4,
    title: "어바웃 타임",
    genre: "Romance",
    emoji: "⏰",
    image: "assets/movies/4.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTY3Mjg0NjcxOF5BMl5BanBnXkFtZTgwODYyODA0MDE@._V1_FMjpg_UX500_.jpg",
    desc: "시간을 되돌리는 능력을 통해 배우는 따스한 삶과 사랑의 교훈.",
    videoUrl: "https://www.youtube.com/embed/sdXg6_X5s4Y"
  },
  {
    id: 5,
    title: "극한직업",
    genre: "Comedy",
    emoji: "🍗",
    image: "assets/movies/5.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMjgwNGI5N2QtYmRjMC00YzE2LWIyMTQtYTcxYmU5NjY2N2QzXkEyXkFqcGc@._V1_FMjpg_UX500_.jpg",
    desc: "낮에는 치킨 장사, 밤에는 잠복근무를 펼치는 마약반 형사들의 코믹 활극.",
    videoUrl: "https://www.youtube.com/embed/1G7Z_A2oQsg"
  },
  {
    id: 6,
    title: "행오버",
    genre: "Comedy",
    emoji: "🥴",
    image: "assets/movies/6.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTNjNDU2NTE5N15BMl5BanBnXkFtZTcwMzZhOTc3Mg@@._V1_FMjpg_UX500_.jpg",
    desc: "총각파티 다음 날 필름이 끊긴 채 사라진 신랑을 찾는 소동극.",
    videoUrl: "https://www.youtube.com/embed/tcdUhdOlz9M"
  },
  {
    id: 7,
    title: "인터스텔라",
    genre: "Sci-Fi",
    emoji: "🚀",
    image: "assets/movies/7.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGUtMjI2My00ODA1LTlkNzItOWFjMDUyODY3OWZhXkEyXkFqcGdeQXVyODk2NDQ3MTA@._V1_FMjpg_UX500_.jpg",
    desc: "인류 구원을 위해 성간 우주와 차원의 경계를 넘는 탐험가들의 장엄한 기록.",
    videoUrl: "https://www.youtube.com/embed/zSWdZAToEsQ"
  },
  {
    id: 8,
    title: "매트릭스",
    genre: "Sci-Fi",
    emoji: "🕶️",
    image: "assets/movies/8.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDlkQjRkNzc1ODFiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX500_.jpg",
    desc: "인간을 지배하는 기계 문명의 가상 세계에 맞서는 전사 네오의 탄생.",
    videoUrl: "https://www.youtube.com/embed/m8e-FF8MsqU"
  },
  {
    id: 9,
    title: "컨저링",
    genre: "Horror",
    emoji: "👻",
    image: "assets/movies/9.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_FMjpg_UX500_.jpg",
    desc: "초자연적 악령에 고통받는 시골 패밀리를 돕는 영매사 워렌 부부의 모험.",
    videoUrl: "https://www.youtube.com/embed/k10ETZ42q5o"
  },
  {
    id: 10,
    title: "겟 아웃",
    genre: "Horror",
    emoji: "👁️",
    image: "assets/movies/10.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MDI@._V1_FMjpg_UX500_.jpg",
    desc: "연인의 고향 집에 머물며 서서히 밝혀지는 백인 가문의 소름 끼치는 서스펜스.",
    videoUrl: "https://www.youtube.com/embed/sRfnevzM9kQ"
  },
  {
    id: 11,
    title: "아바타",
    genre: "Sci-Fi",
    emoji: "🌌",
    image: "assets/movies/11.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BYjhiODAzNDktYTM5Yi00YTRkLWFmODUtM2I1OTFiZmM4M2M1XkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_FMjpg_UX500_.jpg",
    desc: "인류의 탐욕에 맞서 나비족과 교감하며 판도라 행성을 수호하는 대서사시.",
    videoUrl: "https://www.youtube.com/embed/5PSNL1q3AVY"
  },
  {
    id: 12,
    title: "토이 스토리",
    genre: "Comedy",
    emoji: "🧸",
    image: "assets/movies/12.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlYTktNzE1Zi00YWJmLThkMGUtMTI5YTI1MGEzYjE5XkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_FMjpg_UX500_.jpg",
    desc: "장난감들의 우정과 생생한 모험을 그린 세계 최초의 3D 애니메이션.",
    videoUrl: "https://www.youtube.com/embed/CxwTL23yhy4"
  },
  {
    id: 13,
    title: "이터널 선샤인",
    genre: "Romance",
    emoji: "❄️",
    image: "assets/movies/13.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_FMjpg_UX500_.jpg",
    desc: "아픈 기억을 지울수록 깊어지는 두 남녀의 애틋하고 기묘한 사랑 이야기.",
    videoUrl: "https://www.youtube.com/embed/yE-f1alkq9I"
  },
  {
    id: 14,
    title: "어벤져스",
    genre: "Action",
    emoji: "🛡️",
    image: "assets/movies/14.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NTk4OTE@._V1_FMjpg_UX500_.jpg",
    desc: "지구의 안보를 위협하는 침략자에 맞서 결성된 슈퍼히어로 연합군.",
    videoUrl: "https://www.youtube.com/embed/eOrNdByGMv8"
  },
  {
    id: 15,
    title: "셔터 아일랜드",
    genre: "Horror",
    emoji: "🏥",
    image: "assets/movies/15.jpg",
    webImage: "https://m.media-amazon.com/images/M/MV5BYzhjN2ViN2YtMjBlOS00MDhiLWJkYTQtNTU1N2U3Yzk2YThjXkEyXkFqcGdeQXVyODk2NDQ3MTA@._V1_FMjpg_UX500_.jpg",
    desc: "탈출 불가능한 병원 섬에서 발생한 실종 사건을 파헤치는 연방 보안관의 서스펜스.",
    videoUrl: "https://www.youtube.com/embed/5iaYLCip5Qk"
  }
];

const RECOMMEND_MUSIC = [
  {
    id: 101,
    title: "Dynamite",
    artist: "BTS",
    genre: "Pop",
    emoji: "🎙️",
    image: "assets/music/101.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273e2e352ca913fb0164c48972e",
    desc: "글로벌 차트를 장악한 신나고 밝은 펑키 디스코 풍 댄스곡.",
    videoUrl: "https://www.youtube.com/embed/gdZLi9oWNZg"
  },
  {
    id: 102,
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    emoji: "🌃",
    image: "assets/music/102.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273c5b10787e9cfce6f4e1f7249",
    desc: "중독성 넘치는 80년대 레트로 신스 비트와 몽환적인 음색.",
    videoUrl: "https://www.youtube.com/embed/4NRXx6U8ABQ"
  },
  {
    id: 103,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Rock",
    emoji: "🎸",
    image: "assets/music/103.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273ce2ee9b69b9175390772594a",
    desc: "아카펠라, 오페라, 메탈이 극적인 서사로 이어지는 명곡.",
    videoUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ"
  },
  {
    id: 104,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    genre: "Rock",
    emoji: "⚡",
    image: "assets/music/104.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273c15eb341d3ee5cf754d92ee9",
    desc: "얼터너티브 그런지 록 붐을 일으키며 청춘의 저항적 감성을 대변하는 곡.",
    videoUrl: "https://www.youtube.com/embed/hTWKbfoikeg"
  },
  {
    id: 105,
    title: "Style",
    artist: "Beenzino",
    genre: "Hip-Hop",
    emoji: "🎧",
    image: "assets/music/105.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273d6b1d4201387d3d1f1f2385b",
    desc: "위트 있고 직관적인 플로우와 감각적인 힙합 리듬의 조화.",
    videoUrl: "https://www.youtube.com/embed/C5K8VepvPZ8"
  },
  {
    id: 106,
    title: "Lose Yourself",
    artist: "Eminem",
    genre: "Hip-Hop",
    emoji: "🎤",
    image: "assets/music/106.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273b400994191d904b78fa5d95d",
    desc: "자전적 이야기와 절박한 에너지가 돋보이는 역사적 랩 스타의 수작.",
    videoUrl: "https://www.youtube.com/embed/_Yhyp-_hK76"
  },
  {
    id: 107,
    title: "Take Five",
    artist: "Dave Brubeck",
    genre: "Jazz",
    emoji: "🎷",
    image: "assets/music/107.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273cb621124619d08ba2d973719",
    desc: "5박자의 리듬 위로 흐르는 시원하고 우아한 색소폰 멜로디.",
    videoUrl: "https://www.youtube.com/embed/ryA6eHZNnXY"
  },
  {
    id: 108,
    title: "Fly Me to the Moon",
    artist: "Frank Sinatra",
    genre: "Jazz",
    emoji: "🌙",
    image: "assets/music/108.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b2731c3c9b7449bdf54fa169f468",
    desc: "스윙 재즈의 정석이자 전 세계의 낭만을 책임진 전설의 목소리.",
    videoUrl: "https://www.youtube.com/embed/ZEcqHAHy1co"
  },
  {
    id: 109,
    title: "봄바람 (G선상의 아리아)",
    artist: "Various",
    genre: "Classical",
    emoji: "🎻",
    image: "assets/music/109.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273297a7a5a8f4c2ff8816c7cf6",
    desc: "바흐의 차분한 클래식을 현대적인 뉴에이지 선율로 재해석한 힐링 트랙.",
    videoUrl: "https://www.youtube.com/embed/kR63_OOh0C8"
  },
  {
    id: 110,
    title: "월광 소나타",
    artist: "Beethoven",
    genre: "Classical",
    emoji: "🎹",
    image: "assets/music/110.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273b2dd09171b3e8111976a4df6",
    desc: "달빛이 비치는 잔잔한 호숫가처럼 깊고 쓸쓸한 고요를 표현한 곡.",
    videoUrl: "https://www.youtube.com/embed/4Tr0otuiQuU"
  },
  {
    id: 111,
    title: "Permission to Dance",
    artist: "BTS",
    genre: "Pop",
    emoji: "🕺",
    image: "assets/music/111.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273574c89df96756627038e2197",
    desc: "지친 일상에 활력을 불어넣는 신나는 댄스 팝 장르의 희망찬 트랙.",
    videoUrl: "https://www.youtube.com/embed/CuklIb9d3fI"
  },
  {
    id: 112,
    title: "Hype Boy",
    artist: "NewJeans",
    genre: "Pop",
    emoji: "🐰",
    image: "assets/music/112.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b2739d28fd01859033a556dd7e68",
    desc: "독특하고 시크한 감성의 비트와 중독적인 멜로디의 하이틴 대표 팝.",
    videoUrl: "https://www.youtube.com/embed/T--6HB1Q2Cw"
  },
  {
    id: 113,
    title: "Hotel California",
    artist: "Eagles",
    genre: "Rock",
    emoji: "🎸",
    image: "assets/music/113.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b2735bfe2a188448ebf5c88b8bb8",
    desc: "기타 솔로가 매력적인 클래식 록의 교과서이자 시대를 불문한 명곡.",
    videoUrl: "https://www.youtube.com/embed/09839DpTctU"
  },
  {
    id: 114,
    title: "하루하루 (Haru Haru)",
    artist: "BIGBANG",
    genre: "Hip-Hop",
    emoji: "⏳",
    image: "assets/music/114.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b273b06fb7a7f45c92cde8626639",
    desc: "서정적인 피아노 선율과 강렬한 랩이 조화를 이루는 센세이션 힙합 트랙.",
    videoUrl: "https://www.youtube.com/embed/MzCbEdtNbJ0"
  },
  {
    id: 115,
    title: "Canon in D",
    artist: "Pachelbel",
    genre: "Classical",
    emoji: "🎼",
    image: "assets/music/115.jpg",
    webImage: "https://i.scdn.co/image/ab67616d0000b27393437bbd6c5c6cfb48981df5",
    desc: "돌고 도는 선율 속에서 편안함과 웅장함을 선물하는 클래식의 대표작.",
    videoUrl: "https://www.youtube.com/embed/Ptk_1MyqW5Y"
  }
];

// ==========================================
// 3. UI 및 상태 제어 매핑
// ==========================================
const sectionAuth = document.getElementById("section-auth");
const sectionMain = document.getElementById("section-main");
const sectionExplore = document.getElementById("section-explore");
const sectionMyPage = document.getElementById("section-mypage");

const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");
const findIdBox = document.getElementById("find-id-box");
const navMenu = document.getElementById("nav-menu");

const welcomeMessage = document.getElementById("welcome-message");
const preferredGenresList = document.getElementById("preferred-genres-list");
const movieRecommendations = document.getElementById("movie-recommendations");
const musicRecommendations = document.getElementById("music-recommendations");

const userInfoText = document.getElementById("user-info-text");

// 회원탈퇴 잠금 장치 요소
const confirmWithdrawText = document.getElementById("confirm-withdraw-text");
const btnWithdraw = document.getElementById("btn-withdraw");

// 화면 가시성 토글 도우미
function showSection(section) {
  sectionAuth.classList.add("hidden");
  sectionMain.classList.add("hidden");
  sectionExplore.classList.add("hidden");
  sectionMyPage.classList.add("hidden");

  section.classList.remove("hidden");
}

// 인증 서브박스 토글 도우미
function showAuthBox(box) {
  loginBox.classList.add("hidden");
  registerBox.classList.add("hidden");
  findIdBox.classList.add("hidden");

  box.classList.remove("hidden");
}

// 네비게이션 탭 액티브 표시 업데이트
function updateActiveNavLink(activeButton) {
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove("active"));
  if (activeButton) activeButton.classList.add("active");
}

// 비동기 통신 로딩 스피너 처리 도우미
function setLoading(button, isLoading) {
  if (!button) return;
  if (isLoading) {
    button.classList.add("loading");
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.disabled = false;
  }
}

// ==========================================
// 4. 전화번호 포맷팅 (자동 하이픈) 헬퍼 함수
// ==========================================
function autoHyphen(str) {
  str = str.replace(/[^0-9]/g, ''); // 숫자 제외 문자 모두 제거
  let tmp = '';

  if (str.length < 4) {
    return str;
  } else if (str.length < 8) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return tmp;
  } else {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 4);
    tmp += '-';
    tmp += str.substr(7);
    return tmp;
  }
}

// 전화번호 입력 이벤트 바인딩
const phoneInputFields = [
  document.getElementById("register-phone"),
  document.getElementById("find-phone")
];

phoneInputFields.forEach(input => {
  if (input) {
    input.addEventListener("input", (e) => {
      e.target.value = autoHyphen(e.target.value);
    });
  }
});

// 전화번호 유효성 검사 (010-0000-0000 규격 검증 정규식)
function isValidPhoneNumber(phone) {
  const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phone);
}

// ==========================================
// 5. 화면 라우팅 리스너
// ==========================================
document.getElementById("link-to-register").addEventListener("click", () => {
  showAuthBox(registerBox);
});

document.getElementById("link-to-login").addEventListener("click", () => {
  showAuthBox(loginBox);
});

document.getElementById("link-to-find-id").addEventListener("click", () => {
  document.getElementById("form-find-id").reset();
  document.getElementById("find-id-result").classList.add("hidden");
  showAuthBox(findIdBox);
});

document.getElementById("link-find-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  showAuthBox(loginBox);
});

document.getElementById("btn-show-main").addEventListener("click", (e) => {
  showSection(sectionMain);
  updateActiveNavLink(e.currentTarget);
});

document.getElementById("btn-show-explore").addEventListener("click", (e) => {
  showSection(sectionExplore);
  updateActiveNavLink(e.currentTarget);
  renderExploreList(); // 둘러보기 화면에 진입할 때 데이터를 렌더링합니다.
});

document.getElementById("btn-show-mypage").addEventListener("click", (e) => {
  showSection(sectionMyPage);
  updateActiveNavLink(e.currentTarget);
  loadUserGenresToEditor(); // 마이페이지로 이동할 때 사용자의 취향 장르를 에디터에 미리 체크해 둡니다.
});

// 회원탈퇴 확인 텍스트 잠금해제 리스너
confirmWithdrawText.addEventListener("input", (e) => {
  btnWithdraw.disabled = (e.target.value !== "탈퇴합니다");
});

// ==========================================
// 6. 회원 기능 비즈니스 로직
// ==========================================

function checkSupabaseInitialized() {
  if (!supabaseInstance) {
    alert("Supabase가 연결되지 않았습니다. app.js 상단에 URL과 Anon Key를 입력해 주세요.");
    return false;
  }
  return true;
}

// [회원가입]
document.getElementById("form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkSupabaseInitialized()) return;

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const phone = document.getElementById("register-phone").value;
  const submitBtn = document.getElementById("btn-register-submit");

  // 이메일 형식 검사 및 흔한 오타 방지
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert("올바른 이메일 형식을 입력해 주세요.");
    return;
  }

  if (email.toLowerCase().endsWith("@gamil.com")) {
    alert("이메일 주소 도메인이 '@gamil.com'으로 입력되었습니다. 혹시 '@gmail.com'의 오타가 아닌지 확인해 주세요.");
    return;
  }

  const selectedGenres = [];
  document.querySelectorAll("input[name='genres']:checked").forEach(cb => {
    selectedGenres.push(cb.value);
  });

  // 010-0000-0000 형식 검사 수행
  if (!isValidPhoneNumber(phone)) {
    alert("전화번호 형식이 올바르지 않습니다. 올바른 포맷(예: 010-1234-5678)으로 기입해 주세요.");
    return;
  }

  if (selectedGenres.length === 0) {
    alert("최소 한 개 이상의 선호 장르를 선택해 주세요!");
    return;
  }

  setLoading(submitBtn, true);

  try {
    // Supabase Auth 가입 시 options.data에 전화번호와 선호 장르 메타데이터 주입
    // 이는 DB 트리거(handle_new_user)가 읽어 profiles 테이블에 원자적으로 레코드를 저장합니다.
    const { data: authData, error: authError } = await supabaseInstance.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          phone: phone,
          preferred_genres: selectedGenres
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      document.getElementById("form-register").reset();
      if (authData.session) {
        alert("회원가입이 완료되었습니다! CineBeat에 오신 것을 환영합니다.");
        // 자동 로그인으로 세션이 생성되었으므로, onAuthStateChange 리스너가 메인 화면으로 자동 전환합니다.
      } else {
        alert("회원가입이 완료되었습니다! 가입하신 계정 정보로 로그인해 주세요.");
        showAuthBox(loginBox);
      }
    }
  } catch (error) {
    alert(`회원가입 실패: ${error.message}`);
  } finally {
    setLoading(submitBtn, false);
  }
});

// [로그인]
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkSupabaseInitialized()) return;

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const submitBtn = document.getElementById("btn-login-submit");
  const errorMsgEl = document.getElementById("login-error-msg");

  // 이전 에러 메시지 초기화
  if (errorMsgEl) {
    errorMsgEl.textContent = "";
    errorMsgEl.classList.add("hidden");
  }

  setLoading(submitBtn, true);

  try {
    const result = await supabaseInstance.auth.signInWithPassword({
      email: email,
      password: password
    });

    console.log("로그인 요청 결과:", result);

    if (result && result.error) throw result.error;

    alert("환영합니다! 맞춤형 CineBeat를 시작합니다.");
    document.getElementById("form-login").reset();
  } catch (error) {
    console.error("로그인 프로세스 오류:", error);

    const errMsg = error && error.message ? error.message : "알 수 없는 오류가 발생했습니다.";
    let displayMsg = `로그인 실패: ${errMsg}`;
    if (errMsg === "Invalid login credentials" || errMsg.includes("invalid")) {
      displayMsg = "로그인 정보가 일치하지 않습니다. 이메일 또는 비밀번호를 다시 확인해 주세요.";
    }

    // 알림창 호출
    alert(displayMsg);

    // 알림창이 브라우저에서 차단되었거나 인지하지 못한 경우를 대비하여 화면에 에러 텍스트 표시
    if (errorMsgEl) {
      errorMsgEl.textContent = displayMsg;
      errorMsgEl.classList.remove("hidden");
    }
  } finally {
    setLoading(submitBtn, false);
  }
});

// [아이디 찾기]
document.getElementById("form-find-id").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkSupabaseInitialized()) return;

  const phoneInput = document.getElementById("find-phone").value;
  const resultArea = document.getElementById("find-id-result");
  const resultDisplay = document.getElementById("found-email-display");
  const submitBtn = document.getElementById("btn-find-submit");

  // 아이디 찾기 시에도 전화번호 포맷 검증
  if (!isValidPhoneNumber(phoneInput)) {
    alert("전화번호 형식을 확인해 주세요. (예: 010-1234-5678)");
    return;
  }

  resultArea.classList.add("hidden");
  setLoading(submitBtn, true);

  try {
    const { data, error } = await supabaseInstance.rpc('find_email_by_phone', {
      phone_num: phoneInput
    });

    if (error) throw error;

    if (data) {
      resultDisplay.textContent = data;
      resultArea.classList.remove("hidden");
    } else {
      alert("해당 전화번호로 가입된 계정이 존재하지 않습니다.");
    }
  } catch (error) {
    alert(`검색 실패: ${error.message}`);
  } finally {
    setLoading(submitBtn, false);
  }
});

// [로그아웃]
document.getElementById("btn-logout").addEventListener("click", async () => {
  if (!checkSupabaseInitialized()) return;

  const { error } = await supabaseInstance.auth.signOut();
  if (error) {
    alert(`로그아웃 오류: ${error.message}`);
  } else {
    alert("안전하게 로그아웃되었습니다.");
  }
});

// [비밀번호 변경]
document.getElementById("form-change-password").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkSupabaseInitialized()) return;

  const newPassword = document.getElementById("new-password").value;
  const submitBtn = document.getElementById("btn-password-submit");

  if (newPassword.length < 6) {
    alert("비밀번호는 6자리 이상 설정하셔야 합니다.");
    return;
  }

  setLoading(submitBtn, true);

  try {
    const { error } = await supabaseInstance.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    alert("비밀번호 변경이 정상 적용되었습니다.");
    document.getElementById("form-change-password").reset();
  } catch (error) {
    alert(`변경 실패: ${error.message}`);
  } finally {
    setLoading(submitBtn, false);
  }
});

// [회원탈퇴]
document.getElementById("btn-withdraw").addEventListener("click", async () => {
  if (!checkSupabaseInitialized()) return;

  const check = confirm("⚠️ 경고: 확인을 누르시면 계정이 즉시 소멸하며 모든 개인화 취향 정보가 복구되지 않습니다. 정말 탈퇴하시겠습니까?");
  if (!check) return;

  const submitBtn = document.getElementById("btn-withdraw");
  setLoading(submitBtn, true);

  try {
    const { error } = await supabaseInstance.rpc('delete_user');

    if (error) throw error;

    alert("CineBeat 회원탈퇴 처리가 정상 종료되었습니다.");
    confirmWithdrawText.value = "";
    submitBtn.disabled = true;
  } catch (error) {
    alert(`탈퇴 중 에러: ${error.message}`);
  } finally {
    setLoading(submitBtn, false);
  }
});

// ==========================================
// 7. 맞춤 추천 렌더링 로직 (로그인 완료 화면 대응)
// ==========================================
async function renderRecommendations(user) {
  welcomeMessage.textContent = `안녕하세요, ${user.email.split('@')[0]}님!`;
  userInfoText.textContent = `계정 이메일: ${user.email}`;
  preferredGenresList.innerHTML = "";
  movieRecommendations.innerHTML = "";
  musicRecommendations.innerHTML = "";

  let preferredGenres = [];

  try {
    const { data, error } = await supabaseInstance
      .from('profiles')
      .select('preferred_genres')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn("프로필 정보를 가져올 수 없습니다. 트리거 설정을 확인해 주세요:", error);
    } else if (data && data.preferred_genres) {
      preferredGenres = data.preferred_genres;
    }
  } catch (err) {
    console.error("데이터 로드 중 오류:", err);
  }

  // 1. 선호 장르 뱃지 렌더링
  if (preferredGenres.length === 0) {
    preferredGenresList.innerHTML = `<span class="text-muted" style="font-size:0.85rem;">가입된 선호 장르 정보가 존재하지 않습니다.</span>`;
  } else {
    preferredGenres.forEach(genre => {
      const badge = document.createElement("span");
      badge.className = "genre-badge";
      badge.textContent = translateGenre(genre);
      preferredGenresList.appendChild(badge);
    });
  }

  // 2. 영화 추천 필터링 및 렌더링
  const matchedMovies = RECOMMEND_MOVIES.filter(movie => preferredGenres.includes(movie.genre));
  if (matchedMovies.length === 0) {
    movieRecommendations.innerHTML = `<p class="subtitle" style="grid-column: 1/-1; text-align:center;">선택하신 영화 취향 장르가 없습니다.</p>`;
  } else {
    matchedMovies.forEach(movie => {
      movieRecommendations.appendChild(createCard(movie, 'movie'));
    });
  }

  // 3. 음악 추천 필터링 및 렌더링
  const matchedMusic = RECOMMEND_MUSIC.filter(music =>
    preferredGenres.some(genre => genre.toLowerCase() === music.genre.toLowerCase())
  );
  if (matchedMusic.length === 0) {
    musicRecommendations.innerHTML = `<p class="subtitle" style="grid-column: 1/-1; text-align:center;">선택하신 음악 취향 장르가 없습니다.</p>`;
  } else {
    matchedMusic.forEach(music => {
      musicRecommendations.appendChild(createCard(music, 'music'));
    });
  }
}

// 장르 한글 번역 도우미
function translateGenre(genre) {
  const map = {
    'Action': '🎬 액션',
    'Comedy': '🍿 코미디',
    'Romance': '💖 로맨스',
    'Sci-Fi': '🛸 SF/판타지',
    'Horror': '👻 공포',
    'Pop': '🎙️ 팝',
    'Rock': '🎸 록/메탈',
    'Hip-Hop': '🎤 힙합',
    'Jazz': '🎷 재즈',
    'Classical': '🎻 클래식'
  };
  return map[genre] || genre;
}

// 추천 카드 돔 생성
function createCard(item, type) {
  const card = document.createElement("div");
  card.className = type === 'movie' ? "content-card movie-card" : "content-card music-card";

  const formattedGenre = type === 'movie' ? `🎬 영화 • ${item.genre}` : `🎵 음악 • ${item.genre}`;
  const subtitleInfo = type === 'music' ? `${item.artist}의 트랙` : '무비 컬렉션';

  card.innerHTML = `
    <div class="content-card-media">
      <img src="${item.image}" alt="${item.title}" 
        onerror="
          if (!this.dataset.fallbackTried) {
            this.dataset.fallbackTried = 'true';
            this.src = '${item.webImage}';
          } else {
            this.style.display = 'none';
            this.nextElementSibling.style.fontSize = '3.5rem';
            this.nextElementSibling.style.position = 'absolute';
            this.nextElementSibling.style.top = '50%';
            this.nextElementSibling.style.left = '50%';
            this.nextElementSibling.style.transform = 'translate(-50%, -50%)';
            this.nextElementSibling.style.background = 'none';
          }
        " 
        loading="lazy">
      <span class="media-overlay-emoji">${item.emoji}</span>
    </div>
    <div class="content-info">
      <span class="content-tag">${formattedGenre}</span>
      <h4 class="content-title">${item.title}</h4>
      <p class="content-description">${item.desc}</p>
      <div class="review-preview">
        <span>${subtitleInfo}</span>
        <button class="review-btn" onclick="alert('한줄평(리뷰) 기능은 추후 추가될 예정입니다!')">리뷰 쓰기</button>
      </div>
    </div>
  `;

  // 카드 클릭 시 상세 미리보기 모달 열기 리스너 연동 (리뷰 쓰기 버튼 영역은 제외)
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("review-btn")) return;
    openDetailModal(item, type);
  });

  return card;
}

// ==========================================
// 7-2. 영화/음악 상세 미리보기 모달 제어
// ==========================================
const detailModal = document.getElementById("detail-modal");
const modalVideo = document.getElementById("modal-video");
const modalTag = document.getElementById("modal-tag");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalCloseBtn = document.getElementById("modal-close-btn");

function openDetailModal(item, type) {
  if (!detailModal) return;

  const formattedGenre = type === 'movie' ? `🎬 영화 • ${translateGenre(item.genre)}` : `🎵 음악 • ${translateGenre(item.genre)}`;
  modalTag.textContent = formattedGenre;
  modalTitle.textContent = item.title + (type === 'music' ? ` - ${item.artist}` : '');
  modalDesc.textContent = item.desc;
  
  // YouTube 비디오 URL 주입
  if (item.videoUrl) {
    modalVideo.src = `${item.videoUrl}?autoplay=1&mute=0`;
    modalVideo.parentElement.style.display = "block";
  } else {
    modalVideo.src = "";
    modalVideo.parentElement.style.display = "none";
  }

  detailModal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // 배경 스크롤 차단
}

function closeDetailModal() {
  if (!detailModal) return;
  
  detailModal.classList.add("hidden");
  modalVideo.src = ""; // 비디오 URL을 비워 재생 음성을 완전히 중단시킵니다.
  document.body.style.overflow = ""; // 배경 스크롤 원복
}

// 모달 닫기 바인딩
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeDetailModal);
}

// 바깥 어두운 영역 클릭 시 모달 닫기
if (detailModal) {
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      closeDetailModal();
    }
  });
}

// ==========================================
// 8. 인증 상태 실시간 구독 (실행 시작)
// ==========================================
if (supabaseInstance) {
  supabaseInstance.auth.onAuthStateChange((event, session) => {
    console.log(`인증 상태 변동 감지 [이벤트: ${event}]`);

    if (session) {
      currentUser = session.user; // 글로벌 변수에 세션 유저 객체 할당
      navMenu.classList.remove("hidden");
      showSection(sectionMain);
      updateActiveNavLink(document.getElementById("btn-show-main"));
      renderRecommendations(session.user);
    } else {
      currentUser = null; // 로그아웃 시 글로벌 변수 초기화
      navMenu.classList.add("hidden");
      updateActiveNavLink(null);

      // 명시적인 로그아웃 이벤트이거나, 보호된 화면(메인 대시보드 또는 마이페이지)에 진입해 있는 경우에만 로그인 화면으로 전환합니다.
      const isViewingProtectedSection = !sectionMain.classList.contains("hidden") || !sectionMyPage.classList.contains("hidden");
      if (event === "SIGNED_OUT" || isViewingProtectedSection) {
        showSection(sectionAuth);
        showAuthBox(loginBox);
      }
    }
  });
} else {
  showSection(sectionAuth);
  showAuthBox(loginBox);
}

// ==========================================
// 9. 마이페이지 취향 장르 수정 및 저장 연동
// ==========================================
const formEditGenres = document.getElementById("form-edit-genres");
const btnEditGenresSubmit = document.getElementById("btn-edit-genres-submit");

async function loadUserGenresToEditor() {
  if (!currentUser || !supabaseInstance) return;

  try {
    const { data, error } = await supabaseInstance
      .from("profiles")
      .select("preferred_genres")
      .eq("id", currentUser.id)
      .single();

    if (error) throw error;

    const preferredGenres = data && data.preferred_genres ? data.preferred_genres : [];
    
    // 체크박스 초기화 및 바인딩
    document.querySelectorAll("input[name='edit-genres']").forEach(cb => {
      cb.checked = preferredGenres.includes(cb.value);
    });
  } catch (error) {
    console.error("사용자 취향 장르 로딩 실패:", error);
  }
}

if (formEditGenres) {
  formEditGenres.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser || !supabaseInstance) return;

    const selectedEditGenres = [];
    document.querySelectorAll("input[name='edit-genres']:checked").forEach(cb => {
      selectedEditGenres.push(cb.value);
    });

    if (selectedEditGenres.length === 0) {
      alert("최소 한 개 이상의 선호 장르를 선택해 주세요!");
      return;
    }

    setLoading(btnEditGenresSubmit, true);

    try {
      const { error } = await supabaseInstance
        .from("profiles")
        .update({ preferred_genres: selectedEditGenres })
        .eq("id", currentUser.id);

      if (error) throw error;

      alert("취향 설정이 저장되었습니다!");
      
      // 추천 홈 갱신 및 대시보드로 복귀
      await renderRecommendations(currentUser);
      showSection(sectionMain);
      updateActiveNavLink(document.getElementById("btn-show-main"));
    } catch (error) {
      alert(`저장 실패: ${error.message}`);
    } finally {
      setLoading(btnEditGenresSubmit, false);
    }
  });
}

// ==========================================
// 10. 전체 둘러보기(Explore) 및 검색/필터링
// ==========================================
const exploreSearchInput = document.getElementById("explore-search-input");
const tabExploreMovie = document.getElementById("tab-explore-movie");
const tabExploreMusic = document.getElementById("tab-explore-music");
const exploreResultsGrid = document.getElementById("explore-results-grid");

let currentExploreTab = "movie"; // "movie" 또는 "music"

function renderExploreList() {
  if (!exploreResultsGrid) return;
  exploreResultsGrid.innerHTML = "";

  const query = exploreSearchInput ? exploreSearchInput.value.trim().toLowerCase() : "";
  let listToRender = [];

  if (currentExploreTab === "movie") {
    // 영화 전체 목록 필터링
    listToRender = RECOMMEND_MOVIES.filter(movie => {
      const matchesTitle = movie.title.toLowerCase().includes(query);
      const matchesDesc = movie.desc.toLowerCase().includes(query);
      const matchesGenre = movie.genre.toLowerCase().includes(query);
      return matchesTitle || matchesDesc || matchesGenre;
    });
  } else {
    // 음악 전체 목록 필터링
    listToRender = RECOMMEND_MUSIC.filter(music => {
      const matchesTitle = music.title.toLowerCase().includes(query);
      const matchesArtist = music.artist.toLowerCase().includes(query);
      const matchesDesc = music.desc.toLowerCase().includes(query);
      const matchesGenre = music.genre.toLowerCase().includes(query);
      return matchesTitle || matchesArtist || matchesDesc || matchesGenre;
    });
  }

  if (listToRender.length === 0) {
    exploreResultsGrid.innerHTML = `<p class="subtitle" style="grid-column: 1/-1; text-align:center; padding: 40px 0;">검색 결과가 존재하지 않습니다.</p>`;
  } else {
    listToRender.forEach(item => {
      exploreResultsGrid.appendChild(createCard(item, currentExploreTab));
    });
  }
}

// 둘러보기 서브 탭 제어 이벤트 리스너
if (tabExploreMovie && tabExploreMusic) {
  tabExploreMovie.addEventListener("click", () => {
    currentExploreTab = "movie";
    tabExploreMovie.classList.add("active");
    tabExploreMusic.classList.remove("active");
    if (exploreSearchInput) exploreSearchInput.value = ""; // 탭 변경 시 검색어 초기화
    renderExploreList();
  });

  tabExploreMusic.addEventListener("click", () => {
    currentExploreTab = "music";
    tabExploreMusic.classList.add("active");
    tabExploreMovie.classList.remove("active");
    if (exploreSearchInput) exploreSearchInput.value = ""; // 탭 변경 시 검색어 초기화
    renderExploreList();
  });
}

// 실시간 검색창 인풋 이벤트 바인딩
if (exploreSearchInput) {
  exploreSearchInput.addEventListener("input", renderExploreList);
}
