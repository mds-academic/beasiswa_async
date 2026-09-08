/**
 * UOB My Digital Space — Asynchronous Learning Platform Logic
 * Subproject 01: Interactive Player, Quiz Switcher, Single-Portal Auth, & Progress Lock
 */

// Live Google Apps Script Web App Deployment URL (Account: rgcuob@gmail.com)
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeN6qSeNLl3G08JkKsJ1HTGLzk7smy4idTfpJgA4LxvgI_WR9G0JKeg9qohVDV4yyd/exec';

function syncProgressToBackend(quizId, isCorrect, score) {
  if (!state.student || !state.student.email || !state.student.school) return;
  try {
    fetch(APP_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: state.student.email,
        name: state.student.name,
        school: state.student.school,
        level: state.student.level,
        quizId: quizId,
        isCorrect: isCorrect,
        score: score || 100
      })
    }).catch((err) => console.warn('Progress sync warning:', err));
  } catch (err) {
    console.warn('Progress sync exception:', err);
  }
}

// ==================== STATE MANAGEMENT ====================
const state = {
  isLoggedIn: false,
  student: {
    name: '',
    school: '',
    email: '',
    level: 'SMA',
    dataFile: 'courseData-highschool.json'
  },
  courseData: [],
  currentStepIndex: 0,
  submittedQuizIds: new Set(),
  activeQuiz: null,
  activeQuizIndex: 0,
  activeStepQuizzes: [],
  ytPlayer: null,
  isPlayerReady: false,
  isPlaying: false,
  playerCheckTimer: null,
  hasStartedVideo: false,
  currentSlideIndex: 0
};

// ==================== DOM ELEMENTS ====================
const el = {
  loginOverlay: document.querySelector('#login-overlay'),
  loginForm: document.querySelector('#login-form'),
  schoolSelect: document.querySelector('#school-select'),
  studentNameInput: document.querySelector('#student-name'),
  studentEmailInput: document.querySelector('#student-email'),
  loginDetectedBadge: document.querySelector('#login-detected-badge'),
  loginStatusMsg: document.querySelector('#login-status-msg'),

  siteShell: document.querySelector('#site-shell'),
  displayStudentName: document.querySelector('#display-student-name'),
  displayStudentMeta: document.querySelector('#display-student-meta'),
  studentAvatar: document.querySelector('#student-avatar'),
  studentChip: document.querySelector('#student-chip'),
  profileDropdown: document.querySelector('#profile-dropdown'),
  btnLogout: document.querySelector('#btn-logout'),

  sidebarMissionTitle: document.querySelector('#sidebar-mission-title'),
  sidebarMissionDesc: document.querySelector('#sidebar-mission-desc'),
  progressText: document.querySelector('#progress-text'),
  progressFill: document.querySelector('#progress-fill'),
  lessonNav: document.querySelector('#lesson-nav'),
  mobileStepSelect: document.querySelector('#mobile-step-select'),

  lessonKicker: document.querySelector('#lesson-kicker'),
  lessonTitle: document.querySelector('#lesson-title'),
  mediaTypeBadge: document.querySelector('#media-type-badge'),
  lessonDuration: document.querySelector('#lesson-duration'),

  videoContainerBox: document.querySelector('#video-container-box'),
  videoFrame: document.querySelector('#video-frame'),
  customThumbnail: document.querySelector('#custom-thumbnail'),
  thumbnailImg: document.querySelector('#thumbnail-img'),
  centerPlayBtn: document.querySelector('#center-play-btn'),
  videoLoading: document.querySelector('#video-loading'),
  videoControls: document.querySelector('#video-controls'),
  btnPlayPause: document.querySelector('#btn-play-pause'),
  videoSeekBar: document.querySelector('#video-seek-bar'),
  videoTimeDisplay: document.querySelector('#video-time-display'),
  btnMute: document.querySelector('#btn-mute'),
  btnFullscreen: document.querySelector('#btn-fullscreen'),
  bookmarksContainer: document.querySelector('#bookmarks-container'),

  slidesContainerBox: document.querySelector('#slides-container-box'),
  slidesCounterText: document.querySelector('#slides-counter-text'),
  slidesCanvas: document.querySelector('#slides-canvas'),
  btnPrevSlide: document.querySelector('#btn-prev-slide'),
  btnNextSlide: document.querySelector('#btn-next-slide'),
  slidesDots: document.querySelector('#slides-dots'),
  btnExpandSlides: document.querySelector('#btn-expand-slides'),

  quizSwitcherStrip: document.querySelector('#quiz-switcher-strip'),
  quizSummaryStatus: document.querySelector('#quiz-summary-status'),
  quizPillsList: document.querySelector('#quiz-pills-list'),
  btnOpenActiveQuiz: document.querySelector('#btn-open-active-quiz'),

  summaryTitle: document.querySelector('#summary-title'),
  summaryBody: document.querySelector('#summary-body'),

  btnPrevStep: document.querySelector('#btn-prev-step'),
  btnNextStep: document.querySelector('#btn-next-step'),
  nextStepIcon: document.querySelector('#next-step-icon'),
  stepGateInfo: document.querySelector('#step-gate-info'),

  advisoryModal: document.querySelector('#advisory-modal'),
  btnOpenAdvisory: document.querySelector('#btn-open-advisory'),
  btnDismissAdvisory: document.querySelector('#btn-dismiss-advisory'),

  quizModal: document.querySelector('#quiz-modal'),
  modalQuizNumber: document.querySelector('#modal-quiz-number'),
  modalQuizTitle: document.querySelector('#modal-quiz-title'),
  modalQuizQuestion: document.querySelector('#modal-quiz-question'),
  modalQuizOptions: document.querySelector('#modal-quiz-options'),
  quizFeedbackBox: document.querySelector('#quiz-feedback-box'),
  feedbackIcon: document.querySelector('#feedback-icon'),
  feedbackText: document.querySelector('#feedback-text'),
  btnCloseQuizModal: document.querySelector('#btn-close-quiz-modal'),
  btnRewatchQuiz: document.querySelector('#btn-rewatch-quiz'),
  btnDeferQuiz: document.querySelector('#btn-defer-quiz'),
  btnSubmitQuiz: document.querySelector('#btn-submit-quiz')
};

// ==================== INIT & EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
  setupLoginEvents();
  setupProfileDropdown();
  setupAdvisoryModal();
  setupQuizModalEvents();
  setupPlayerControlEvents();
  setupSlideControlEvents();
  setupStepNavEvents();

  // Gentle Advisory check on mobile load
  if (window.innerWidth < 768) {
    setTimeout(() => {
      if (el.advisoryModal) el.advisoryModal.showModal();
    }, 1200);
  }
});

// ==================== 1. AUTHENTICATION (SINGLE PORTAL) ====================
function setupLoginEvents() {
  // Pilihan sekolah mendeteksi level
  el.schoolSelect.addEventListener('change', () => {
    const val = el.schoolSelect.value;
    if (!val) return;
    const [schoolName, level, dataFile] = val.split('|');
    el.loginDetectedBadge.textContent = `Terdeteksi: Jenjang ${level} (${schoolName})`;
    el.loginDetectedBadge.style.color = level === 'SMA' ? '#ffd93d' : level === 'SMP' ? '#43d7ff' : '#27c881';
  });

  // Submit Login
  el.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = el.schoolSelect.value;
    if (!val) {
      showLoginStatus('Silakan pilih sekolah terlebih dahulu.', 'error');
      return;
    }

    const [schoolName, level, dataFile] = val.split('|');
    const name = el.studentNameInput.value.trim();
    const email = el.studentEmailInput.value.trim();

    if (!name || !email) {
      showLoginStatus('Nama dan email wajib diisi.', 'error');
      return;
    }

    state.student = { name, school: schoolName, email, level, dataFile };
    showLoginStatus('Memuat kurikulum kelas...', 'normal');

    try {
      await loadCourseData(dataFile);
      state.isLoggedIn = true;

      // Update profil di topbar
      el.displayStudentName.textContent = name;
      el.displayStudentMeta.textContent = `${level} · ${schoolName}`;
      el.studentAvatar.style.backgroundImage = `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}')`;

      // Sembunyikan login & tampilkan dashboard
      el.loginOverlay.style.display = 'none';
      el.siteShell.style.display = 'block';

      // Set deskripsi misi sidebar
      el.sidebarMissionTitle.textContent =
        level === 'SMA'
          ? 'Misi: Python Programming'
          : level === 'SMP'
          ? 'Misi: App Inventor Mobile'
          : 'Misi: Scratch Visual Coding';

      // Restore local progress
      const storageKey = `uob_progress_${email}_${schoolName}`;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            state.submittedQuizIds = new Set(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to read localStorage:', e);
      }

      // Background Server-First sync from Google Sheets
      try {
        const getUrl = `${APP_SCRIPT_URL}?action=get_progress&email=${encodeURIComponent(email)}&school=${encodeURIComponent(schoolName)}&level=${encodeURIComponent(level)}`;
        fetch(getUrl)
          .then((r) => r.json())
          .then((res) => {
            if (res && res.success && res.data && Array.isArray(res.data.submittedQuizIds)) {
              res.data.submittedQuizIds.forEach((id) => state.submittedQuizIds.add(id));
              localStorage.setItem(storageKey, JSON.stringify([...state.submittedQuizIds]));
              renderQuizSwitcherStrip();
              checkProgressGate();
            }
          })
          .catch((err) => console.log('Backend sync offline/deferred:', err));
      } catch (err) {
        console.log('Background sync deferred:', err);
      }

      buildSidebarModuleList();
      goToStep(0);
    } catch (err) {
      console.error(err);
      showLoginStatus('Gagal memuat data kurikulum. Silakan coba lagi.', 'error');
    }
  });
}

function showLoginStatus(msg, type) {
  el.loginStatusMsg.textContent = msg;
  el.loginStatusMsg.style.color = type === 'error' ? '#f04438' : '#027a48';
}

async function loadCourseData(filename) {
  const res = await fetch(`./data/${filename}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  state.courseData = Array.isArray(data) ? data : Object.values(data);
}

function setupProfileDropdown() {
  el.studentChip.addEventListener('click', (e) => {
    e.stopPropagation();
    el.profileDropdown.hidden = !el.profileDropdown.hidden;
  });

  document.addEventListener('click', () => {
    if (el.profileDropdown) el.profileDropdown.hidden = true;
  });

  el.btnLogout.addEventListener('click', () => {
    state.isLoggedIn = false;
    teardownPlayer();
    el.siteShell.style.display = 'none';
    el.loginOverlay.style.display = 'flex';
    el.loginForm.reset();
    el.loginStatusMsg.textContent = '';
    el.loginDetectedBadge.textContent = 'Pilih Sekolah untuk Mulai';
  });
}

function setupAdvisoryModal() {
  el.btnOpenAdvisory.addEventListener('click', () => {
    el.advisoryModal.showModal();
  });
  el.btnDismissAdvisory.addEventListener('click', () => {
    el.advisoryModal.close();
  });
}

// ==================== 2. MODULE & SIDEBAR NAVIGATION ====================
function buildSidebarModuleList() {
  el.lessonNav.innerHTML = '';
  el.mobileStepSelect.innerHTML = '';

  state.courseData.forEach((step, idx) => {
    const numStr = String(idx).padStart(2, '0');

    // Desktop Tab
    const tab = document.createElement('button');
    tab.className = `lesson-tab ${idx === state.currentStepIndex ? 'active' : ''}`;
    tab.type = 'button';
    tab.id = `lesson-tab-${idx}`;
    tab.innerHTML = `
      <span class="tab-number">${numStr}</span>
      <span class="tab-copy">
        <strong>${step.title || 'Materi Belajar'}</strong>
        <span>${step.kicker || 'Modul'}</span>
      </span>
      <span class="tab-arrow" aria-hidden="true">›</span>
    `;
    tab.addEventListener('click', () => goToStep(idx));
    el.lessonNav.appendChild(tab);

    // Mobile Select Option
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${numStr} · ${step.title || 'Materi'}`;
    el.mobileStepSelect.appendChild(opt);
  });

  el.mobileStepSelect.addEventListener('change', (e) => {
    goToStep(Number(e.target.value));
  });

  updateMissionProgress();
}

function updateMissionProgress() {
  const total = state.courseData.length;
  const current = state.currentStepIndex + 1;
  el.progressText.textContent = `${current} dari ${total} Materi`;
  const pct = Math.min(100, Math.round((current / total) * 100));
  el.progressFill.style.width = `${pct}%`;
}

// ==================== 3. STEP TRANSITION & MEDIA RENDERING ====================
function goToStep(stepIndex) {
  if (stepIndex < 0 || stepIndex >= state.courseData.length) return;

  // Hentikan player video sebelumnya
  teardownPlayer();

  state.currentStepIndex = stepIndex;
  const step = state.courseData[stepIndex];

  // Update Active Tab Highlight
  document.querySelectorAll('.lesson-tab').forEach((tab, idx) => {
    tab.classList.toggle('active', idx === stepIndex);
  });
  if (el.mobileStepSelect) el.mobileStepSelect.value = stepIndex;
  updateMissionProgress();

  // Header Details
  el.lessonKicker.textContent = step.kicker || `MODUL ${String(stepIndex).padStart(2, '0')}`;
  el.lessonTitle.textContent = step.title || 'Materi Belajar';
  el.lessonDuration.textContent = step.duration || '10 Menit';

  // Deteksi Tipe Media: Video atau HTML Slides
  const isVideo = step.type !== 'html_slides' && (step.videoId || step.youtubeId || (typeof step.videoUrl === 'string' && step.videoUrl.length > 0));

  if (isVideo) {
    el.mediaTypeBadge.textContent = '▶ Video Interaktif';
    el.mediaTypeBadge.style.color = '#43d7ff';
    el.videoContainerBox.style.display = 'flex';
    el.slidesContainerBox.style.display = 'none';
    renderVideoStep(step);
  } else {
    el.mediaTypeBadge.textContent = '📄 Slide Bacaan';
    el.mediaTypeBadge.style.color = '#ffd93d';
    el.videoContainerBox.style.display = 'none';
    el.slidesContainerBox.style.display = 'flex';
    renderSlidesStep(step);
  }

  // Render Bookmarks
  renderBookmarks(step.bookmarks || []);

  // Ambil data kuis pada materi ini
  state.activeStepQuizzes = extractQuizzesFromStep(step);
  renderQuizSwitcherStrip();

  // Render Rangkuman
  renderSummary(step);

  // Periksa Status Kunci Progres (Next Step Button)
  checkProgressGate();

  // Scroll smooth ke atas area konten
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function extractQuizzesFromStep(step) {
  if (Array.isArray(step.quizzes) && step.quizzes.length > 0) {
    return step.quizzes.map((q, i) => ({
      id: q.id || `quiz-${state.currentStepIndex}-${i}`,
      question: q.question || 'Pertanyaan Cek Pemahaman',
      options: q.options || ['Pilihan A', 'Pilihan B', 'Pilihan C'],
      answer: q.answer !== undefined ? q.answer : 0,
      explanation: q.explanation || 'Jawaban tepat sesuai materi yang dijelaskan.',
      time: q.time || q.timestamp || 45
    }));
  }
  if (step.quiz) {
    return [{
      id: step.quiz.id || `quiz-${state.currentStepIndex}-0`,
      question: step.quiz.question || 'Pertanyaan Kuis',
      options: step.quiz.options || ['Pilihan A', 'Pilihan B'],
      answer: step.quiz.answer !== undefined ? step.quiz.answer : 0,
      explanation: step.quiz.explanation || 'Penjelasan kuis.',
      time: step.quiz.time || step.quiz.timestamp || 30
    }];
  }
  return [];
}

// ==================== 4. VIDEO PLAYER (YOUTUBE WITH CUSTOM CONTROLS) ====================
function renderVideoStep(step) {
  state.hasStartedVideo = false;
  state.isPlaying = false;
  el.btnPlayPause.textContent = '▶';
  el.videoSeekBar.value = 0;
  el.videoTimeDisplay.textContent = '0:00 / 0:00';

  // Thumbnail
  const vidId = step.videoId || step.youtubeId || 'yxmLOk5vcFg';
  el.thumbnailImg.src = step.thumbnailUrl || `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
  el.customThumbnail.style.display = 'block';

  // Inisialisasi YouTube Player
  initYouTubePlayer(vidId, step.startSeconds || 0, step.endSeconds || 0);
}

function initYouTubePlayer(videoId, startSeconds, endSeconds) {
  if (!window.YT || !window.YT.Player) {
    setTimeout(() => initYouTubePlayer(videoId, startSeconds, endSeconds), 300);
    return;
  }

  const mountDiv = document.querySelector('#youtube-player');
  if (!mountDiv) return;

  state.ytPlayer = new YT.Player('youtube-player', {
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      start: startSeconds || 0
    },
    events: {
      onReady: (event) => {
        state.isPlayerReady = true;
        if (startSeconds) event.target.seekTo(startSeconds, true);
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          state.isPlaying = true;
          el.btnPlayPause.textContent = '⏸';
          startPlayerTicker(endSeconds);
        } else {
          state.isPlaying = false;
          el.btnPlayPause.textContent = '▶';
          stopPlayerTicker();
        }
      }
    }
  });
}

function startPlayerTicker(endSeconds) {
  stopPlayerTicker();
  state.playerCheckTimer = setInterval(() => {
    if (!state.ytPlayer || !state.ytPlayer.getCurrentTime) return;
    const curTime = state.ytPlayer.getCurrentTime();
    const duration = state.ytPlayer.getDuration() || 1;

    // Update Seekbar & Time Display
    el.videoSeekBar.value = (curTime / duration) * 100;
    el.videoTimeDisplay.textContent = `${formatTime(curTime)} / ${formatTime(duration)}`;

    // Guard End Seconds
    if (endSeconds > 0 && curTime >= endSeconds) {
      state.ytPlayer.pauseVideo();
    }

    // Trigger Pop-up Quiz bila waktu tiba dan kuis belum selesai
    state.activeStepQuizzes.forEach((q, idx) => {
      if (!state.submittedQuizIds.has(q.id)) {
        if (Math.abs(curTime - q.time) < 1.2) {
          state.ytPlayer.pauseVideo();
          openQuizModal(idx);
        }
      }
    });
  }, 500);
}

function stopPlayerTicker() {
  if (state.playerCheckTimer) clearInterval(state.playerCheckTimer);
  state.playerCheckTimer = null;
}

function teardownPlayer() {
  stopPlayerTicker();
  if (state.ytPlayer && state.ytPlayer.destroy) {
    try {
      state.ytPlayer.destroy();
    } catch (e) {}
  }
  state.ytPlayer = null;
  state.isPlayerReady = false;
  state.isPlaying = false;

  // Re-create mount div
  const frame = document.querySelector('#video-frame');
  const existingMount = document.querySelector('#youtube-player');
  if (!existingMount && frame) {
    const newDiv = document.createElement('div');
    newDiv.id = 'youtube-player';
    frame.prepend(newDiv);
  }
}

function setupPlayerControlEvents() {
  const togglePlay = () => {
    if (el.customThumbnail.style.display !== 'none') {
      el.customThumbnail.style.display = 'none';
      state.hasStartedVideo = true;
    }
    if (!state.ytPlayer) return;
    if (state.isPlaying) {
      state.ytPlayer.pauseVideo();
    } else {
      state.ytPlayer.playVideo();
    }
  };

  el.centerPlayBtn.addEventListener('click', togglePlay);
  el.customThumbnail.addEventListener('click', togglePlay);
  el.btnPlayPause.addEventListener('click', togglePlay);

  el.videoSeekBar.addEventListener('input', (e) => {
    if (!state.ytPlayer || !state.ytPlayer.getDuration) return;
    const seekPercent = Number(e.target.value);
    const duration = state.ytPlayer.getDuration();
    const seekToTime = (seekPercent / 100) * duration;
    state.ytPlayer.seekTo(seekToTime, true);
  });

  el.btnMute.addEventListener('click', () => {
    if (!state.ytPlayer) return;
    if (state.ytPlayer.isMuted()) {
      state.ytPlayer.unMute();
      el.btnMute.textContent = '🔊';
    } else {
      state.ytPlayer.mute();
      el.btnMute.textContent = '🔇';
    }
  });

  el.btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      el.videoFrame.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

function renderBookmarks(bookmarks) {
  el.bookmarksContainer.innerHTML = '';
  if (!bookmarks || bookmarks.length === 0) return;

  bookmarks.forEach((bm) => {
    const btn = document.createElement('button');
    btn.className = 'bookmark-btn';
    btn.type = 'button';
    btn.innerHTML = `<span class="bookmark-time">${formatTime(bm.time || 0)}</span> <span>${bm.label || 'Bookmark'}</span>`;
    btn.addEventListener('click', () => {
      if (el.customThumbnail.style.display !== 'none') {
        el.customThumbnail.style.display = 'none';
      }
      if (state.ytPlayer && state.ytPlayer.seekTo) {
        state.ytPlayer.seekTo(bm.time || 0, true);
        state.ytPlayer.playVideo();
      }
    });
    el.bookmarksContainer.appendChild(btn);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ==================== 5. HTML SLIDES VIEWER ====================
function renderSlidesStep(step) {
  const slides = step.slides || [
    {
      title: 'Mengenal Lingkungan Coding',
      content: 'Selamat datang di area belajar koding asinkronus. Di materi ini, kita akan membaca konsep dasar sebelum praktik.',
      code: 'print("Halo Dunia! Selamat belajar Python.")'
    },
    {
      title: 'Cara Menjalankan Kode',
      content: 'Setiap baris kode dibaca oleh komputer dari atas ke bawah secara berurutan. Klik tombol Play untuk melihat hasilnya.',
      code: '# Ini adalah baris komentar\nx = 10\ny = 20\nprint("Total:", x + y)'
    }
  ];

  state.currentSlideIndex = 0;
  displaySlideCard(slides, 0);

  // Render Slide Dots
  el.slidesDots.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `slide-dot ${i === 0 ? 'active' : ''}`;
    el.slidesDots.appendChild(dot);
  });
}

function displaySlideCard(slides, index) {
  const slide = slides[index];
  el.slidesCounterText.textContent = `Halaman ${index + 1} dari ${slides.length}`;

  el.slidesCanvas.innerHTML = `
    <div class="slide-content-view">
      <h4>${slide.title || 'Topik Slide'}</h4>
      <p>${slide.content || ''}</p>
      ${slide.code ? `<pre class="slide-code-box"><code>${escapeHtml(slide.code)}</code></pre>` : ''}
    </div>
  `;

  el.btnPrevSlide.disabled = index === 0;
  el.btnNextSlide.disabled = index === slides.length - 1;

  // Update dots
  document.querySelectorAll('.slide-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function setupSlideControlEvents() {
  el.btnPrevSlide.addEventListener('click', () => {
    const step = state.courseData[state.currentStepIndex];
    const slides = step.slides || [];
    if (state.currentSlideIndex > 0) {
      state.currentSlideIndex--;
      displaySlideCard(slides, state.currentSlideIndex);
    }
  });

  el.btnNextSlide.addEventListener('click', () => {
    const step = state.courseData[state.currentStepIndex];
    const slides = step.slides || [];
    if (state.currentSlideIndex < slides.length - 1) {
      state.currentSlideIndex++;
      displaySlideCard(slides, state.currentSlideIndex);
    }
  });

  el.btnExpandSlides.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      el.slidesContainerBox.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==================== 6. QUIZ SWITCHER & INTERACTIVE MODAL ====================
function renderQuizSwitcherStrip() {
  el.quizPillsList.innerHTML = '';
  const quizzes = state.activeStepQuizzes;

  if (quizzes.length === 0) {
    el.quizSummaryStatus.textContent = 'Materi ini tidak memiliki kuis wajib.';
    el.btnOpenActiveQuiz.style.display = 'none';
    return;
  }

  el.btnOpenActiveQuiz.style.display = 'inline-block';
  const completedCount = quizzes.filter((q) => state.submittedQuizIds.has(q.id)).length;
  el.quizSummaryStatus.textContent = `${quizzes.length} Kuis: ${completedCount} Selesai · ${quizzes.length - completedCount} Belum`;

  quizzes.forEach((quiz, i) => {
    const isDone = state.submittedQuizIds.has(quiz.id);
    const pill = document.createElement('button');
    pill.className = `quiz-pill-btn ${isDone ? 'completed' : ''}`;
    pill.type = 'button';
    pill.innerHTML = `<span>${isDone ? '✓' : '⏱'}</span> <span>Kuis ${i + 1}</span>`;
    pill.addEventListener('click', () => openQuizModal(i));
    el.quizPillsList.appendChild(pill);
  });

  el.btnOpenActiveQuiz.onclick = () => {
    const firstUnfinished = quizzes.findIndex((q) => !state.submittedQuizIds.has(q.id));
    openQuizModal(firstUnfinished !== -1 ? firstUnfinished : 0);
  };
}

function openQuizModal(quizIndex) {
  const quiz = state.activeStepQuizzes[quizIndex];
  if (!quiz) return;

  state.activeQuiz = quiz;
  state.activeQuizIndex = quizIndex;

  el.modalQuizNumber.textContent = `Kuis ${quizIndex + 1} dari ${state.activeStepQuizzes.length}`;
  el.modalQuizTitle.textContent = quiz.title || 'Cek Pemahaman Materi';
  el.modalQuizQuestion.textContent = quiz.question || 'Pertanyaan';

  el.modalQuizOptions.innerHTML = '';
  quiz.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.className = 'quiz-option-card';
    label.innerHTML = `
      <input type="radio" name="quiz-choice" value="${idx}" class="option-radio" />
      <span class="option-text">${opt}</span>
    `;
    label.addEventListener('click', () => {
      document.querySelectorAll('.quiz-option-card').forEach((c) => c.classList.remove('selected'));
      label.classList.add('selected');
    });
    el.modalQuizOptions.appendChild(label);
  });

  el.quizFeedbackBox.hidden = true;
  el.quizModal.showModal();
}

function setupQuizModalEvents() {
  const closeModal = () => {
    el.quizModal.close();
  };

  el.btnCloseQuizModal.addEventListener('click', closeModal);
  el.btnDeferQuiz.addEventListener('click', closeModal);

  // Rewatch 30 Detik
  el.btnRewatchQuiz.addEventListener('click', () => {
    closeModal();
    if (state.ytPlayer && state.ytPlayer.getCurrentTime) {
      const cur = state.ytPlayer.getCurrentTime();
      const targetTime = Math.max(0, cur - 30);
      state.ytPlayer.seekTo(targetTime, true);
      state.ytPlayer.playVideo();
    }
  });

  // Kirim Jawaban
  el.btnSubmitQuiz.addEventListener('click', () => {
    const selected = document.querySelector('input[name="quiz-choice"]:checked');
    if (!selected) {
      showQuizFeedback('Silakan pilih salah satu jawaban terlebih dahulu.', 'error');
      return;
    }

    const selectedIdx = Number(selected.value);
    const quiz = state.activeQuiz;

    if (selectedIdx === quiz.answer) {
      // Jawaban Benar
      state.submittedQuizIds.add(quiz.id);

      // Save to localStorage
      try {
        const storageKey = `uob_progress_${state.student.email}_${state.student.school}`;
        localStorage.setItem(storageKey, JSON.stringify([...state.submittedQuizIds]));
      } catch (e) {}

      // Sync ke Google Apps Script backend (rgcuob@gmail.com)
      syncProgressToBackend(quiz.id, true, 100);

      showQuizFeedback(`Bagus sekali! Jawabanmu benar. ${quiz.explanation || ''}`, 'success');
      renderQuizSwitcherStrip();
      checkProgressGate();

      setTimeout(() => {
        closeModal();
      }, 1600);
    } else {
      // Jawaban Salah
      showQuizFeedback('Jawaban belum tepat. Coba baca atau tonton ulang penjelasannya ya.', 'error');
    }
  });
}

function showQuizFeedback(msg, type) {
  el.quizFeedbackBox.hidden = false;
  el.quizFeedbackBox.className = `quiz-feedback-box ${type}`;
  el.feedbackIcon.textContent = type === 'success' ? '✓' : '!';
  el.feedbackText.textContent = msg;
}

// ==================== 7. PROGRESS LOCK GATE & SUMMARY ====================
function checkProgressGate() {
  const quizzes = state.activeStepQuizzes;
  const isCurrentStepCompleted = quizzes.every((q) => state.submittedQuizIds.has(q.id));
  const isLastStep = state.currentStepIndex >= state.courseData.length - 1;

  if (isLastStep) {
    el.btnNextStep.disabled = true;
    el.nextStepIcon.textContent = '★';
    el.stepGateInfo.textContent = 'Selamat! Kamu telah menyelesaikan semua materi pada misi ini.';
    return;
  }

  if (isCurrentStepCompleted) {
    el.btnNextStep.disabled = false;
    el.nextStepIcon.textContent = '→';
    el.stepGateInfo.textContent = '✓ Semua aktivitas tuntas! Kamu bisa lanjut ke materi berikutnya.';
    el.stepGateInfo.style.color = '#27c881';
  } else {
    el.btnNextStep.disabled = true;
    el.nextStepIcon.textContent = '🔒';
    el.stepGateInfo.textContent = 'Selesaikan seluruh kuis pada materi ini untuk membuka materi selanjutnya.';
    el.stepGateInfo.style.color = '#ffd93d';
  }
}

function renderSummary(step) {
  el.summaryTitle.textContent = step.summaryTitle || `Poin Penting: ${step.title}`;
  if (Array.isArray(step.summaryPoints) && step.summaryPoints.length > 0) {
    el.summaryBody.innerHTML = `<ul>${step.summaryPoints.map((p) => `<li>${p}</li>`).join('')}</ul>`;
  } else if (step.summary) {
    el.summaryBody.innerHTML = `<p>${step.summary}</p>`;
  } else {
    el.summaryBody.innerHTML = `<p>Pelajari konsep utama pada materi ini dan uji pemahamanmu dengan kuis interaktif di atas.</p>`;
  }
}

function setupStepNavEvents() {
  el.btnPrevStep.addEventListener('click', () => {
    if (state.currentStepIndex > 0) {
      goToStep(state.currentStepIndex - 1);
    }
  });

  el.btnNextStep.addEventListener('click', () => {
    const isCurrentStepCompleted = state.activeStepQuizzes.every((q) => state.submittedQuizIds.has(q.id));
    if (isCurrentStepCompleted && state.currentStepIndex < state.courseData.length - 1) {
      goToStep(state.currentStepIndex + 1);
    }
  });
}
