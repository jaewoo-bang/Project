// ==========================================
// 1. Supabase 접속 설정 (본인의 정보로 변경 필요)
// ==========================================
const SUPABASE_URL = "https://vvabwtxeegqzlosakuxt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2YWJ3dHhlZWdxemxvc2FrdXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDU0MTMsImV4cCI6MjA5ODUyMTQxM30.ab0V7cBBNrG2NhrTDfvLvPqqbeLErLTPMRGTYacsQw4";


let supabaseInstance = null;

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
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400",
    desc: "영웅의 어두운 내면을 깊이 있게 탐구한 세기의 액션 블록버스터."
  },
  {
    id: 2,
    title: "매드맥스: 분노의 도로",
    genre: "Action",
    emoji: "🔥",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400",
    desc: "황폐화된 사막 한가운데서 생존을 위해 펼쳐지는 폭렬 카체이싱 액션."
  },
  {
    id: 3,
    title: "라라랜드",
    genre: "Romance",
    emoji: "💃",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400",
    desc: "꿈을 쫓는 청춘들의 열정과 계절처럼 변하는 애틋한 로맨스 뮤지컬."
  },
  {
    id: 4,
    title: "어바웃 타임",
    genre: "Romance",
    emoji: "⏰",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400",
    desc: "시간을 되돌리는 능력을 통해 배우는 따스한 삶과 사랑의 교훈."
  },
  {
    id: 5,
    title: "익스트림 잡 (극한직업)",
    genre: "Comedy",
    emoji: "🍗",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=400",
    desc: "낮에는 치킨 장사, 밤에는 잠복근무를 펼치는 마약반 형사들의 코믹 활극."
  },
  {
    id: 6,
    title: "행오버",
    genre: "Comedy",
    emoji: "🥴",
    image: "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=400",
    desc: "총각파티 다음 날 필름이 끊긴 채 사라진 신랑을 찾는 소동극."
  },
  {
    id: 7,
    title: "인터스텔라",
    genre: "Sci-Fi",
    emoji: "🚀",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
    desc: "인류 구원을 위해 성간 우주와 차원의 경계를 넘는 탐험가들의 장엄한 기록."
  },
  {
    id: 8,
    title: "매트릭스",
    genre: "Sci-Fi",
    emoji: "🕶️",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400",
    desc: "인간을 지배하는 기계 문명의 가상 세계에 맞서는 전사 네오의 탄생."
  },
  {
    id: 9,
    title: "컨저링",
    genre: "Horror",
    emoji: "👻",
    image: "https://images.unsplash.com/photo-1505635339358-1110cee0c7e4?q=80&w=400",
    desc: "초자연적 악령에 고통받는 시골 패밀리를 돕는 영매사 워렌 부부의 모험."
  },
  {
    id: 10,
    title: "겟 아웃",
    genre: "Horror",
    emoji: "👁️",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400",
    desc: "연인의 고향 집에 머물며 서서히 밝혀지는 백인 가문의 소름 끼치는 서스펜스."
  }
];

const RECOMMEND_MUSIC = [
  {
    id: 101,
    title: "Dynamite",
    artist: "BTS",
    genre: "Pop",
    emoji: "🎙️",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400",
    desc: "글로벌 차트를 장악한 신나고 밝은 펑키 디스코 풍 댄스곡."
  },
  {
    id: 102,
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    emoji: "🌃",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400",
    desc: "중독성 넘치는 80년대 레트로 신스 비트와 몽환적인 음색."
  },
  {
    id: 103,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Rock",
    emoji: "🎸",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400",
    desc: "아카펠라, 오페라, 메탈이 극적인 서사로 이어지는 명곡."
  },
  {
    id: 104,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    genre: "Rock",
    emoji: "⚡",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400",
    desc: "얼터너티브 그런지 록 붐을 일으키며 청춘의 저항적 감성을 대변하는 곡."
  },
  {
    id: 105,
    title: "Style",
    artist: "Beenzino",
    genre: "Hip-Hop",
    emoji: "🎧",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400",
    desc: "위트 있고 직관적인 플로우와 감각적인 힙합 리듬의 조화."
  },
  {
    id: 106,
    title: "Lose Yourself",
    artist: "Eminem",
    genre: "Hip-Hop",
    emoji: "🎤",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=400",
    desc: "자전적 이야기와 절박한 에너지가 돋보이는 역사적 랩 스타의 수작."
  },
  {
    id: 107,
    title: "Take Five",
    artist: "Dave Brubeck",
    genre: "Jazz",
    emoji: "🎷",
    image: "https://images.unsplash.com/photo-1486591978090-58e619d37fe7?q=80&w=400",
    desc: "5박자의 리듬 위로 흐르는 시원하고 우아한 색소폰 멜로디."
  },
  {
    id: 108,
    title: "Fly Me to the Moon",
    artist: "Frank Sinatra",
    genre: "Jazz",
    emoji: "🌙",
    image: "https://images.unsplash.com/photo-1502318217862-aa4e294ba657?q=80&w=400",
    desc: "스윙 재즈의 정석이자 전 세계의 낭만을 책임진 전설의 목소리."
  },
  {
    id: 109,
    title: "봄바람 (G선상의 아리아)",
    artist: "Various",
    genre: "Classical",
    emoji: "🎻",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400",
    desc: "바흐의 차분한 클래식을 현대적인 뉴에이지 선율로 재해석한 힐링 트랙."
  },
  {
    id: 110,
    title: "월광 소나타",
    artist: "Beethoven",
    genre: "Classical",
    emoji: "🎹",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=400",
    desc: "달빛이 비치는 잔잔한 호숫가처럼 깊고 쓸쓸한 고요를 표현한 곡."
  }
];

// ==========================================
// 3. UI 및 상태 제어 매핑
// ==========================================
const sectionAuth = document.getElementById("section-auth");
const sectionMain = document.getElementById("section-main");
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

document.getElementById("btn-show-mypage").addEventListener("click", (e) => {
  showSection(sectionMyPage);
  updateActiveNavLink(e.currentTarget);
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
      alert("회원가입 완료! 가입한 메일 혹은 계정 정보로 로그인해 주세요.");
      document.getElementById("form-register").reset();
      showAuthBox(loginBox);
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

  setLoading(submitBtn, true);

  try {
    const { error } = await supabaseInstance.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    alert("환영합니다! 맞춤형 CineBeat를 시작합니다.");
    document.getElementById("form-login").reset();
  } catch (error) {
    alert(`로그인 실패: ${error.message}`);
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
  card.className = "content-card";

  const formattedGenre = type === 'movie' ? `🎬 영화 • ${item.genre}` : `🎵 음악 • ${item.genre}`;
  const subtitleInfo = type === 'music' ? `${item.artist}의 트랙` : '무비 컬렉션';

  card.innerHTML = `
    <div class="content-card-media">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
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
  return card;
}

// ==========================================
// 8. 인증 상태 실시간 구독 (실행 시작)
// ==========================================
if (supabaseInstance) {
  supabaseInstance.auth.onAuthStateChange((event, session) => {
    console.log(`인증 상태 변동 감지 [이벤트: ${event}]`);

    if (session) {
      navMenu.classList.remove("hidden");
      showSection(sectionMain);
      updateActiveNavLink(document.getElementById("btn-show-main"));
      renderRecommendations(session.user);
    } else {
      navMenu.classList.add("hidden");
      showSection(sectionAuth);
      showAuthBox(loginBox);
      updateActiveNavLink(null);
    }
  });
} else {
  showSection(sectionAuth);
  showAuthBox(loginBox);
}
