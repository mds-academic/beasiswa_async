/**
 * UOB My Digital Space — Asynchronous Learning Platform Logic
 * Subproject 01: Interactive Player, Sandbox Container, Typo Suggestion, & Grade Auto-Detection
 */

// Live Google Apps Script Web App Deployment URL (Account: rgcuob@gmail.com)
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybx1KlcTW7Rofbb7OSGWtWeEAU_uflLAG3bqfS9edl-tSlIPmRh4FnheBWCaKxb06S/exec';

// ==================== STATE MANAGEMENT ====================
const state = {
  isLoggedIn: false,
  selectedSchool: null,
  student: {
    name: '',
    school: '',
    rombel: '',
    email: '',
    grade: '',
    level: 'SMA',
    dataFile: 'courseData-highschool.json'
  },
  masterSchools: [],
  schoolStudents: [],
  allStudentsData: [],
  courseData: [],
  currentStepIndex: 0,
  activeMediaMode: 'video', // 'video' or 'sandbox'
  submittedQuizIds: new Set(),
  activeQuiz: null,
  activeQuizIndex: 0,
  activeStepQuizzes: [],
  ytPlayer: null,
  isPlayerReady: false,
  isPlaying: false,
  playerCheckTimer: null,
  hasStartedVideo: false,
  introPlayedSteps: new Set(),
  isIntroPlaying: false,
  videoMaxTimeWatched: 0,
  videoDuration: 0,
  videoWatchedToEnd: false,
  submittedChallenges: new Map(),
  unlockedStepIndex: 0
};
window.state = state;

// ==================== DOM ELEMENTS ====================
const el = {
  // Login Overlay & Controls
  loginOverlay: document.querySelector('#login-overlay'),
  loginForm: document.querySelector('#login-form'),
  loginSchoolInput: document.querySelector('#login-school-input'),
  loginSchoolDropdown: document.querySelector('#login-school-dropdown'),
  btnClearSchool: document.querySelector('#btn-clear-school'),
  loginEmailInput: document.querySelector('#login-email-input'),
  loginDetectedBadge: document.querySelector('#login-detected-badge'),
  btnToggleEmailHelp: document.querySelector('#btn-toggle-email-help'),
  emailHelpPanel: document.querySelector('#email-help-panel'),
  emailHelpQuery: document.querySelector('#email-help-query'),
  emailHelpResults: document.querySelector('#email-help-results'),
  btnLogin: document.querySelector('#btn-login'),
  loginErrorContainer: document.querySelector('#login-error-container'),
  loginErrorTitle: document.querySelector('#login-error-title'),
  loginErrorDesc: document.querySelector('#login-error-desc'),
  loginSuggestionCard: document.querySelector('#login-suggestion-card'),
  loginSuggestionEmail: document.querySelector('#login-suggestion-email'),
  btnUseSuggestion: document.querySelector('#btn-use-suggestion'),

  // Admin Password Modal
  adminPasswordModal: document.querySelector('#admin-password-modal'),
  adminModalSubtitle: document.querySelector('#admin-modal-subtitle'),
  adminPasswordForm: document.querySelector('#admin-password-form'),
  adminPasswordInput: document.querySelector('#admin-password-input'),
  adminModalError: document.querySelector('#admin-modal-error'),
  adminModalErrorText: document.querySelector('#admin-modal-error-text'),
  btnCancelAdminModal: document.querySelector('#btn-cancel-admin-modal'),

  // Site Shell & Topbar
  siteShell: document.querySelector('#site-shell'),
  displayStudentName: document.querySelector('#display-student-name'),
  displayStudentMeta: document.querySelector('#display-student-meta'),
  studentAvatar: document.querySelector('#student-avatar'),
  studentChip: document.querySelector('#student-chip'),
  profileDropdown: document.querySelector('#profile-dropdown'),
  btnLogout: document.querySelector('#btn-logout'),
  btnOpenAdvisory: document.querySelector('#btn-open-advisory'),
  advisoryModal: document.querySelector('#advisory-modal'),
  btnDismissAdvisory: document.querySelector('#btn-dismiss-advisory'),
  btnOpenCertificate: document.querySelector('#btn-open-certificate'),
  btnDropdownCert: document.querySelector('#btn-dropdown-cert'),

  // Sidebar
  sidebarMissionTitle: document.querySelector('#sidebar-mission-title'),
  sidebarMissionDesc: document.querySelector('#sidebar-mission-desc'),
  progressText: document.querySelector('#progress-text'),
  progressFill: document.querySelector('#progress-fill'),
  lessonNav: document.querySelector('#lesson-nav'),
  mobileStepSelect: document.querySelector('#mobile-step-select'),

  // Content Header
  lessonKicker: document.querySelector('#lesson-kicker'),
  lessonTitle: document.querySelector('#lesson-title'),
  mediaTypeBadge: document.querySelector('#media-type-badge'),
  lessonDuration: document.querySelector('#lesson-duration'),

  // Media Switcher & Player
  mediaSwitcherTabs: document.querySelector('#media-switcher-tabs'),
  tabModeVideo: document.querySelector('#tab-mode-video'),
  tabModeSandbox: document.querySelector('#tab-mode-sandbox'),
  introVideoCard: document.querySelector('#intro-video-card'),
  introVideoText: document.querySelector('#intro-video-text'),
  videoContainerBox: document.querySelector('#video-container-box'),
  videoFrame: document.querySelector('#video-frame'),
  introVideo: document.querySelector('#intro-video'),
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

  // Sandbox Container
  sandboxContainer: document.querySelector('#sandbox-container'),
  sandboxTitle: document.querySelector('#sandbox-title'),
  sandboxIframe: document.querySelector('#sandbox-iframe'),
  btnReloadSandbox: document.querySelector('#btn-reload-sandbox'),
  btnFullscreenSandbox: document.querySelector('#btn-fullscreen-sandbox'),

  // Quiz Switcher Strip
  quizSwitcherStrip: document.querySelector('#quiz-switcher-strip'),
  quizSummaryStatus: document.querySelector('#quiz-summary-status'),
  quizPillsList: document.querySelector('#quiz-pills-list'),
  btnOpenActiveQuiz: document.querySelector('#btn-open-active-quiz'),

  // Challenge Panel (Mini Project Mandiri — Non-Gating)
  challengePanel: document.querySelector('#challenge-panel'),
  challengeTitle: document.querySelector('#challenge-title'),
  challengeStatusBadge: document.querySelector('#challenge-status-badge'),
  challengeDesc: document.querySelector('#challenge-desc'),
  challengeTasksBox: document.querySelector('#challenge-tasks-box'),
  groupCodeInput: document.querySelector('#group-code-input'),
  challengeCodeEditor: document.querySelector('#challenge-code-editor'),
  groupLinkInput: document.querySelector('#group-link-input'),
  challengeUrlLabel: document.querySelector('#challenge-url-label'),
  challengeUrlInput: document.querySelector('#challenge-url-input'),
  groupFileInput: document.querySelector('#group-file-input'),
  challengeFileLabel: document.querySelector('#challenge-file-label'),
  challengeFileInput: document.querySelector('#challenge-file-input'),
  fileSelectedName: document.querySelector('#file-selected-name'),
  btnSubmitChallenge: document.querySelector('#btn-submit-challenge'),
  btnSkipChallenge: document.querySelector('#btn-skip-challenge'),
  challengeSubmitFeedback: document.querySelector('#challenge-submit-feedback'),

  // Exact Legacy Below-Video 2-Column Cards
  summaryHeadingIcon: document.querySelector('#summary-heading-icon'),
  summaryCardTitle: document.querySelector('#summary-card-title'),
  takeawayList: document.querySelector('#takeaway-list'),
  focusCardTitle: document.querySelector('#focus-card-title'),
  focusCardDesc: document.querySelector('#focus-card-desc'),
  focusCardCode: document.querySelector('#focus-card-code'),

  // Lesson Reading Accordion
  readingAccordion: document.querySelector('#reading-accordion'),
  readingHeaderLabel: document.querySelector('#reading-header-label'),
  readingHeaderTitle: document.querySelector('#reading-header-title'),
  readingHeaderDesc: document.querySelector('#reading-header-desc'),
  readingHeaderBadge: document.querySelector('#reading-header-badge'),
  readingConceptGrid: document.querySelector('#reading-concept-grid'),
  readingSectionTitle: document.querySelector('#reading-section-title'),
  readingSectionCode: document.querySelector('#reading-section-code'),
  readingSectionNote: document.querySelector('#reading-section-note'),

  // Step Nav Gate
  btnPrevStep: document.querySelector('#btn-prev-step'),
  btnNextStep: document.querySelector('#btn-next-step'),
  nextStepIcon: document.querySelector('#next-step-icon'),
  stepGateInfo: document.querySelector('#step-gate-info'),
  btnAdminBypass: document.querySelector('#btn-admin-bypass'),

  // Quiz Modal Dialog
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
  btnSubmitQuiz: document.querySelector('#btn-submit-quiz'),

  // Certificate Modal Dialog
  certificateModal: document.querySelector('#certificate-modal'),
  btnCloseCertModal: document.querySelector('#btn-close-cert-modal'),
  reportQuizzesCount: document.querySelector('#report-quizzes-count'),
  reportAccuracy: document.querySelector('#report-accuracy'),
  reportChallengesCount: document.querySelector('#report-challenges-count'),
  reportStatus: document.querySelector('#report-status'),
  certStudentName: document.querySelector('#cert-student-name'),
  certStudentSchool: document.querySelector('#cert-student-school'),
  certProgramName: document.querySelector('#cert-program-name'),
  certSerialNo: document.querySelector('#cert-serial-no'),
  certDateText: document.querySelector('#cert-date-text'),
  btnPrintCertificate: document.querySelector('#btn-print-certificate'),
  btnDismissCertificate: document.querySelector('#btn-dismiss-certificate'),
  advisoryContinueBtn: document.querySelector('#btn-close-advisory-modal'),

  // Bento Box Pop-up Quiz Evaluator
  bentoQuizCard: document.querySelector('#bento-quiz-tracker-card'),
  bentoQuizList: document.querySelector('#bento-quiz-list'),
  bentoQuizCounter: document.querySelector('#bento-quiz-counter'),

  // Transcript (Page 2)
  certTranscriptTbody: document.querySelector('#cert-transcript-tbody'),
  transcriptStudentName: document.querySelector('#transcript-student-name'),
  transcriptStudentSchool: document.querySelector('#transcript-student-school'),
  transcriptDate: document.querySelector('#transcript-date'),
  transcriptStatus: document.querySelector('#transcript-status'),
  transcriptSerialRef: document.querySelector('#transcript-serial-ref')
};

// ==================== HELPER ALGORITHMS ====================

/**
 * Algoritma Levenshtein Distance untuk toleransi typo email siswa
 */
function levenshteinDistance(a, b) {
  const s1 = String(a || '').toLowerCase().trim();
  const s2 = String(b || '').toLowerCase().trim();
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

/**
 * Menentukan jenjang dan file kurikulum berdasarkan grade_name dari Google Sheet
 */
function resolveCurriculumFromGrade(gradeName) {
  const g = String(gradeName || '').toLowerCase().trim();
  if (g.includes('sma') || g.includes('high') || g.includes('senior') || g.includes('python')) {
    return { level: 'SMA', dataFile: 'courseData-highschool.json' };
  } else if (g.includes('smp') || g.includes('middle') || g.includes('junior') || g.includes('app')) {
    return { level: 'SMP', dataFile: 'courseData-middleschool.json' };
  } else {
    return { level: 'SD', dataFile: 'courseData-upperprimary.json' };
  }
}

/**
 * Masking email untuk tampilan aman (contoh: bu***@gmail.com)
 */
function maskEmail(email) {
  const str = String(email || '').trim();
  const parts = str.split('@');
  if (parts.length !== 2) return str;
  const username = parts[0];
  const domain = parts[1];
  if (username.length <= 2) return `${username}***@${domain}`;
  return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`;
}

/**
 * Hash string deterministik untuk nomor seri sertifikat digital
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

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

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
  await loadMasterData();
  setupLoginEvents();
  setupProfileDropdown();
  setupAdvisoryModal();
  setupChallengePanelEvents();
  setupCertificateModalEvents();
  setupMediaSwitcherEvents();
  setupPlayerControlEvents();
  setupQuizModalEvents();
  setupStepNavEvents();

  // Mobile Gentle Advisory Check
  if (window.innerWidth < 768) {
    setTimeout(() => {
      checkMobileAdvisory();
    }, 1200);
  }
});

// ==================== 1. DATA LOADING & COMBOBOX SEARCH ====================
const ADMIN_VIRTUAL_SCHOOLS = [
  { school: 'SD UOB', grade_name: 'Upper Primary', level: 'SD', isVirtual: true },
  { school: 'SMP UOB', grade_name: 'Middle School', level: 'SMP', isVirtual: true },
  { school: 'SMA UOB', grade_name: 'High School', level: 'SMA', isVirtual: true }
];

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function rebuildMasterSchools(serverSchools = null) {
  const schoolMap = new Map();

  // 1. Masukkan sekolah virtual UOB (tanpa tag/badge mencolok)
  ADMIN_VIRTUAL_SCHOOLS.forEach((adm) => {
    schoolMap.set(adm.school.toLowerCase().trim(), { ...adm });
  });

  // 2. Jika ada data server dari Google Apps Script, gabungkan
  if (Array.isArray(serverSchools) && serverSchools.length > 0) {
    serverSchools.forEach((s) => {
      const name = String(s.school || '').trim();
      if (name && !schoolMap.has(name.toLowerCase())) {
        const cur = resolveCurriculumFromGrade(s.grade_name);
        schoolMap.set(name.toLowerCase(), {
          school: name,
          grade_name: s.grade_name || 'High School',
          level: s.level || cur.level
        });
      }
    });
  }

  // 3. Masukkan dari master data murid lokal (504 siswa real)
  if (Array.isArray(state.allStudentsData) && state.allStudentsData.length > 0) {
    state.allStudentsData.forEach((s) => {
      const name = String(s.school_name || '').trim();
      if (name && !schoolMap.has(name.toLowerCase())) {
        const cur = resolveCurriculumFromGrade(s.grade_name);
        schoolMap.set(name.toLowerCase(), {
          school: name,
          grade_name: s.grade_name || 'High School',
          level: cur.level
        });
      }
    });
  }

  state.masterSchools = Array.from(schoolMap.values()).sort((a, b) => a.school.localeCompare(b.school));
}

async function loadMasterData() {
  // 1. Inisialisasi awal instan (0ms latency)
  rebuildMasterSchools();

  // 2. Load local student master fixture (504 siswa real)
  try {
    const res = await fetch('./data/ops-student-data.json');
    if (res.ok) {
      state.allStudentsData = await res.json();
      rebuildMasterSchools();
    }
  } catch (e) {
    console.warn('Local student fixture load warning:', e);
  }

  // 3. Background Sync (non-blocking) dari Google Apps Script backend
  (async () => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=schools`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.schools) && data.schools.length > 0) {
          rebuildMasterSchools(data.schools);
        }
      }
    } catch (err) {
      console.log('Background schools update deferred.');
    }
  })();
}

function setupLoginEvents() {
  let activeDropdownIndex = -1;

  // Tombol Reset / Clear Sekolah
  if (el.btnClearSchool) {
    el.btnClearSchool.addEventListener('click', () => {
      resetSchoolSelection();
      el.loginSchoolInput.focus();
      showSchoolDropdown();
    });
  }

  function resetSchoolSelection() {
    state.selectedSchool = null;
    state.schoolStudents = [];
    el.loginSchoolInput.value = '';
    if (el.btnClearSchool) el.btnClearSchool.style.display = 'none';
    el.loginDetectedBadge.textContent = 'Pilih atau Ketik Sekolah untuk Mulai';
    el.loginDetectedBadge.style.color = '';
    el.loginEmailInput.value = '';
    el.loginEmailInput.placeholder = 'Pilih sekolah terlebih dahulu...';
    el.loginEmailInput.disabled = true;
    el.btnToggleEmailHelp.disabled = true;
    el.btnLogin.disabled = true;
    el.emailHelpPanel.hidden = true;
    hideLoginError();
  }

  // 1. School Combobox Search & Selection
  const showSchoolDropdown = () => {
    const query = el.loginSchoolInput.value.toLowerCase().trim();
    if (el.btnClearSchool) {
      el.btnClearSchool.style.display = el.loginSchoolInput.value.trim() ? 'flex' : 'none';
    }

    const isVirtualSchool = (s) => s.isVirtual || s.school.toUpperCase().includes('UOB');

    const filtered = state.masterSchools.filter((s) => {
      if (isVirtualSchool(s)) {
        return query.includes('uob') && s.school.toLowerCase().includes(query);
      }
      return !query || s.school.toLowerCase().includes(query);
    });

    // Urutkan: yang diawali query di paling atas
    if (query) {
      filtered.sort((a, b) => {
        const aStarts = a.school.toLowerCase().startsWith(query);
        const bStarts = b.school.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.school.localeCompare(b.school);
      });
    }

    activeDropdownIndex = -1;
    el.loginSchoolDropdown.innerHTML = '';

    if (filtered.length === 0) {
      el.loginSchoolDropdown.innerHTML = '<p>Sekolah tidak ditemukan. Coba ketik kata kunci lain (misal: "uob", "strada", "smp").</p>';
    } else {
      filtered.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dropdown-item-school';
        btn.dataset.index = idx;

        const highlightedName = highlightMatch(item.school, query);
        btn.innerHTML = `<strong>${highlightedName}</strong> <span style="opacity:0.75; font-size:0.8rem; margin-left:6px;">(${item.level})</span>`;
        btn.addEventListener('click', () => selectSchool(item));
        el.loginSchoolDropdown.appendChild(btn);
      });
    }
    el.loginSchoolDropdown.hidden = false;
  };

  el.loginSchoolInput.addEventListener('focus', () => {
    if (el.loginSchoolInput.value) {
      el.loginSchoolInput.select();
    }
    showSchoolDropdown();
  });

  el.loginSchoolInput.addEventListener('input', showSchoolDropdown);

  // Keyboard navigation untuk combobox sekolah
  el.loginSchoolInput.addEventListener('keydown', (e) => {
    const buttons = el.loginSchoolDropdown.querySelectorAll('button');
    if (el.loginSchoolDropdown.hidden || buttons.length === 0) {
      if (e.key === 'ArrowDown') {
        showSchoolDropdown();
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeDropdownIndex = (activeDropdownIndex + 1) % buttons.length;
      updateActiveDropdownItem(buttons);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeDropdownIndex = (activeDropdownIndex - 1 + buttons.length) % buttons.length;
      updateActiveDropdownItem(buttons);
    } else if (e.key === 'Enter') {
      if (activeDropdownIndex >= 0 && activeDropdownIndex < buttons.length) {
        e.preventDefault();
        buttons[activeDropdownIndex].click();
      }
    } else if (e.key === 'Escape') {
      el.loginSchoolDropdown.hidden = true;
    }
  });

  function updateActiveDropdownItem(buttons) {
    buttons.forEach((b, i) => {
      if (i === activeDropdownIndex) {
        b.classList.add('dropdown-item-active');
        b.scrollIntoView({ block: 'nearest' });
      } else {
        b.classList.remove('dropdown-item-active');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (
      !el.loginSchoolInput.contains(e.target) &&
      !el.loginSchoolDropdown.contains(e.target) &&
      (!el.btnClearSchool || !el.btnClearSchool.contains(e.target))
    ) {
      el.loginSchoolDropdown.hidden = true;
    }
  });

  function selectSchool(schoolItem) {
    state.selectedSchool = schoolItem;
    el.loginSchoolInput.value = schoolItem.school;
    el.loginSchoolDropdown.hidden = true;
    if (el.btnClearSchool) el.btnClearSchool.style.display = 'flex';

    // Filter daftar siswa sekolah ini untuk email helper & typo suggestion
    state.schoolStudents = state.allStudentsData.filter(
      (s) => String(s.school_name || '').toLowerCase().trim() === schoolItem.school.toLowerCase().trim()
    );

    // Update badge jenjang
    const cur = resolveCurriculumFromGrade(schoolItem.grade_name);
    const isUobSchool = schoolItem.school.toUpperCase().includes('UOB');

    el.loginDetectedBadge.textContent = `Terdeteksi: Jenjang ${cur.level} (${schoolItem.school})`;
    el.loginDetectedBadge.style.color = cur.level === 'SMA' ? '#ffd93d' : cur.level === 'SMP' ? '#43d7ff' : '#27c881';

    if (isUobSchool) {
      if (!el.loginEmailInput.value || el.loginEmailInput.value.trim() === '') {
        el.loginEmailInput.value = 'permata@mds.com';
      }
    } else {
      el.loginEmailInput.placeholder = 'nama@email.com';
      if (el.loginEmailInput.value === 'permata@mds.com') {
        el.loginEmailInput.value = '';
      }
    }

    // Aktifkan input email & tombol cari bantuan
    el.loginEmailInput.disabled = false;
    el.btnToggleEmailHelp.disabled = false;
    el.btnLogin.disabled = false;
    el.loginEmailInput.focus();

    // Reset error & help panel
    hideLoginError();
    el.emailHelpPanel.hidden = true;
  }

  // 2. Email Input Listener
  el.loginEmailInput.addEventListener('input', () => {
    hideLoginError();
  });

  // 3. Email Helper Panel Toggle & Search
  el.btnToggleEmailHelp.addEventListener('click', () => {
    el.emailHelpPanel.hidden = !el.emailHelpPanel.hidden;
    if (!el.emailHelpPanel.hidden) {
      el.emailHelpQuery.value = '';
      renderEmailHelpResults('');
      el.emailHelpQuery.focus();
    }
  });

  el.emailHelpQuery.addEventListener('input', (e) => {
    renderEmailHelpResults(e.target.value.trim());
  });

  function renderEmailHelpResults(query) {
    const q = query.toLowerCase();
    const isAdminSchool = state.selectedSchool && (state.selectedSchool.isAdmin || state.selectedSchool.school.toUpperCase().includes('UOB'));

    if (isAdminSchool) {
      el.emailHelpResults.innerHTML = `
        <div class="email-help-result" style="border-left: 4px solid #7c3aed;">
          <strong>Admin MDS (${state.selectedSchool.school})</strong>
          <code>permata@mds.com</code>
        </div>
      `;
      const card = el.emailHelpResults.querySelector('.email-help-result');
      card.addEventListener('click', () => {
        el.loginEmailInput.value = 'permata@mds.com';
        el.emailHelpPanel.hidden = true;
        hideLoginError();
        attemptLogin();
      });
      return;
    }

    const students = state.schoolStudents.filter(
      (s) => !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );

    el.emailHelpResults.innerHTML = '';
    if (students.length === 0) {
      el.emailHelpResults.innerHTML = '<p>Tidak ada nama atau email yang cocok di sekolah ini.</p>';
      return;
    }

    students.forEach((s) => {
      const card = document.createElement('div');
      card.className = 'email-help-result';
      card.innerHTML = `
        <strong>${s.name} (${s.rombel_name || 'Kelas'})</strong>
        <code>${maskEmail(s.email)}</code>
      `;
      card.addEventListener('click', () => {
        el.loginEmailInput.value = s.email;
        el.emailHelpPanel.hidden = true;
        hideLoginError();
        attemptLogin();
      });
      el.emailHelpResults.appendChild(card);
    });
  }

  // 4. Form Submit Login
  el.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    attemptLogin();
  });

  // 5. Use Suggestion Button Click
  el.btnUseSuggestion.addEventListener('click', () => {
    const suggested = el.loginSuggestionEmail.dataset.fullEmail;
    if (suggested) {
      el.loginEmailInput.value = suggested;
      hideLoginError();
      attemptLogin();
    }
  });

  // 6. Admin Password Modal Events
  if (el.btnCancelAdminModal && el.adminPasswordModal) {
    el.btnCancelAdminModal.addEventListener('click', () => {
      el.adminPasswordModal.close();
    });
  }

  if (el.adminPasswordForm && el.adminPasswordModal) {
    el.adminPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = el.adminPasswordInput ? el.adminPasswordInput.value.trim() : '';
      const schoolName = state.selectedSchool ? state.selectedSchool.school : 'SD UOB';
      const curLevel = state.selectedSchool ? state.selectedSchool.level : 'SD';
      executeAdminLogin(schoolName, curLevel, password);
    });
  }
}

function hideLoginError() {
  el.loginErrorContainer.style.display = 'none';
  el.loginSuggestionCard.style.display = 'none';
}

function showLoginError(title, desc, suggestion = null) {
  el.loginErrorContainer.style.display = 'flex';
  el.loginErrorTitle.textContent = title;
  el.loginErrorDesc.textContent = desc;

  if (suggestion) {
    el.loginSuggestionCard.style.display = 'block';
    el.loginSuggestionEmail.textContent = suggestion.suggestedEmail;
    el.loginSuggestionEmail.dataset.fullEmail = suggestion.fullEmail;
  } else {
    el.loginSuggestionCard.style.display = 'none';
  }
}

// ==================== 2. ATTEMPT LOGIN WITH ADMIN AUTH & TYPO SUGGESTION ====================
function openAdminPasswordModal(schoolName, curLevel) {
  if (el.adminPasswordModal && typeof el.adminPasswordModal.showModal === 'function') {
    if (el.adminModalSubtitle) {
      el.adminModalSubtitle.textContent = `Jenjang ${curLevel || ''} (${schoolName})`;
    }
    if (el.adminPasswordInput) {
      el.adminPasswordInput.value = '';
    }
    if (el.adminModalError) {
      el.adminModalError.style.display = 'none';
    }
    el.adminPasswordModal.showModal();
    setTimeout(() => {
      if (el.adminPasswordInput) el.adminPasswordInput.focus();
    }, 60);
    return;
  }

  // Fallback prompt jika browser tidak mendukung dialog element
  const adminPassword = window.prompt(
    `Verifikasi Sandi Akses\n\nJenjang ${curLevel} (${schoolName}).\nSilakan masukkan Sandi Akses:`,
    ''
  );
  if (adminPassword === null) return;
  executeAdminLogin(schoolName, curLevel, adminPassword);
}

function executeAdminLogin(schoolName, curLevel, password) {
  if (password !== 'KalanantiDihati') {
    if (el.adminModalError) {
      el.adminModalError.style.display = 'flex';
      if (el.adminModalErrorText) {
        el.adminModalErrorText.textContent = 'Sandi yang Anda masukkan salah!';
      }
      if (el.adminPasswordInput) el.adminPasswordInput.select();
    }
    showLoginError('Sandi Salah', 'Sandi yang Anda masukkan tidak sesuai.');
    return false;
  }

  // Tutup modal jika terbuka
  if (el.adminPasswordModal && el.adminPasswordModal.open) {
    el.adminPasswordModal.close();
  }

  el.btnLogin.disabled = true;
  el.btnLogin.querySelector('span').textContent = 'Memverifikasi...';

  const emailInput = (el.loginEmailInput.value || '').toLowerCase().trim() || 'permata@mds.com';

  // Verifikasi ke backend Apps Script (background logging non-blocking)
  try {
    const loginUrl = `${APP_SCRIPT_URL}?action=login&email=${encodeURIComponent(emailInput)}&school=${encodeURIComponent(schoolName)}&password=${encodeURIComponent(password)}`;
    fetch(loginUrl).catch((e) => console.log('Apps Script login notice:', e));
  } catch (e) {
    console.warn('Backend notify deferred:', e);
  }

  const cur = resolveCurriculumFromGrade(state.selectedSchool ? state.selectedSchool.grade_name : 'Kelas 4');
  state.student = {
    name: `Admin Permata (${schoolName})`,
    school: schoolName,
    rombel: 'Super Admin',
    email: 'permata@mds.com',
    grade: state.selectedSchool ? state.selectedSchool.grade_name : 'Kelas 4',
    level: cur.level,
    dataFile: cur.dataFile,
    isAdmin: true
  };

  completeSuccessfulLogin();
  return true;
}

async function attemptLogin() {
  const rawSchoolInput = (el.loginSchoolInput.value || '').trim();
  const emailInput = (el.loginEmailInput.value || '').toLowerCase().trim();

  // 1. Auto-resolve sekolah jika belum diklik dari dropdown
  if (!state.selectedSchool && rawSchoolInput) {
    const exactMatch = state.masterSchools.find(
      (s) => s.school.toLowerCase() === rawSchoolInput.toLowerCase()
    );
    if (exactMatch) {
      state.selectedSchool = exactMatch;
    } else {
      const partialMatch = state.masterSchools.find(
        (s) => s.school.toLowerCase().includes(rawSchoolInput.toLowerCase()) ||
               rawSchoolInput.toLowerCase().includes(s.school.toLowerCase())
      );
      if (partialMatch) {
        state.selectedSchool = partialMatch;
      }
    }
  }

  // 2. Alur Khusus Admin (email permata@mds.com atau sekolah mengandung UOB)
  const isAdminEmail = emailInput === 'permata@mds.com';
  const isUobSchool = rawSchoolInput.toUpperCase().includes('UOB') ||
    (state.selectedSchool && state.selectedSchool.school.toUpperCase().includes('UOB'));

  if (isAdminEmail || isUobSchool) {
    if (!state.selectedSchool) {
      let matchedVirtual = ADMIN_VIRTUAL_SCHOOLS[0]; // SD UOB default
      if (rawSchoolInput.toLowerCase().includes('smp') || rawSchoolInput.toLowerCase().includes('middle')) {
        matchedVirtual = ADMIN_VIRTUAL_SCHOOLS[1]; // SMP UOB
      } else if (rawSchoolInput.toLowerCase().includes('sma') || rawSchoolInput.toLowerCase().includes('high')) {
        matchedVirtual = ADMIN_VIRTUAL_SCHOOLS[2]; // SMA UOB
      }
      state.selectedSchool = matchedVirtual;
      el.loginSchoolInput.value = matchedVirtual.school;
    }

    if (!el.loginEmailInput.value || el.loginEmailInput.value.trim() === '') {
      el.loginEmailInput.value = 'permata@mds.com';
    }

    const schoolName = state.selectedSchool.school;
    const cur = resolveCurriculumFromGrade(state.selectedSchool.grade_name);
    openAdminPasswordModal(schoolName, cur.level);
    return;
  }

  // 3. Pastikan sekolah sudah dipilih
  if (!state.selectedSchool) {
    showLoginError('Sekolah Belum Dipilih', 'Silakan pilih atau ketik nama sekolah mitra Anda terlebih dahulu sebelum memasukkan email.');
    return;
  }

  if (!emailInput) {
    showLoginError('Email Masih Kosong', 'Silakan masukkan email yang terdaftar di Akademia Ruangguru.');
    return;
  }

  const schoolName = state.selectedSchool.school;

  // ==================== ALUR SISWA REGULER ====================
  el.btnLogin.disabled = true;
  el.btnLogin.querySelector('span').textContent = 'Memverifikasi...';

  // Pastikan schoolStudents terisi
  if (!state.schoolStudents || state.schoolStudents.length === 0) {
    state.schoolStudents = state.allStudentsData.filter(
      (s) => String(s.school_name || '').toLowerCase().trim() === schoolName.toLowerCase().trim()
    );
  }

  // A. Cek kecocokan langsung di data lokal/memori (500+ siswa real)
  let matchedStudent = state.schoolStudents.find(
    (s) => String(s.email || '').toLowerCase().trim() === emailInput
  );

  // Jika belum cocok per nama sekolah, cari global di allStudentsData
  if (!matchedStudent) {
    matchedStudent = state.allStudentsData.find(
      (s) => String(s.email || '').toLowerCase().trim() === emailInput
    );
  }

  // B. Jika tidak ditemukan di lokal, coba verifikasi ke backend Apps Script
  if (!matchedStudent) {
    try {
      const loginUrl = `${APP_SCRIPT_URL}?action=login&email=${encodeURIComponent(emailInput)}&school=${encodeURIComponent(schoolName)}`;
      const res = await fetch(loginUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.student) {
          matchedStudent = json.student;
        } else if (json.suggestion) {
          handleTypoSuggestion(json.suggestion, emailInput);
          el.btnLogin.disabled = false;
          el.btnLogin.querySelector('span').textContent = 'Mulai Belajar →';
          return;
        }
      }
    } catch (err) {
      console.warn('Backend login lookup deferred, checking local Levenshtein:', err);
    }
  }

  // C. Jika Berhasil Match: Masuk ke Kelas!
  if (matchedStudent) {
    const cur = resolveCurriculumFromGrade(matchedStudent.grade_name || state.selectedSchool.grade_name);
    state.student = {
      name: matchedStudent.name || 'Siswa Kalananti',
      school: matchedStudent.school_name || schoolName,
      rombel: matchedStudent.rombel_name || 'Kelas Reguler',
      email: matchedStudent.email || emailInput,
      grade: matchedStudent.grade_name || state.selectedSchool.grade_name,
      level: cur.level,
      dataFile: cur.dataFile,
      isAdmin: false
    };

    completeSuccessfulLogin();
  } else {
    // D. Email Tidak Match: Hitung Levenshtein Distance
    let closest = null;
    let minDistance = 999;
    const candidates = state.schoolStudents.length > 0 ? state.schoolStudents : state.allStudentsData;

    candidates.forEach((st) => {
      const dist = levenshteinDistance(emailInput, st.email);
      if (dist < minDistance && dist <= 6) {
        minDistance = dist;
        closest = {
          name: st.name,
          suggestedEmail: st.email,
          fullEmail: st.email,
          distance: dist
        };
      }
    });

    el.btnLogin.disabled = false;
    el.btnLogin.querySelector('span').textContent = 'Mulai Belajar →';

    if (closest) {
      showLoginError(
        'Email Belum Cocok',
        `Email "${emailInput}" belum cocok dengan data siswa ${schoolName}. Kami menemukan email dengan ejaan paling mendekati:`,
        closest
      );
    } else {
      showLoginError(
        'Email Belum Terdaftar',
        `Email "${emailInput}" tidak ditemukan pada data siswa ${schoolName}. Coba periksa kembali penulisan email atau gunakan tombol "Cari Email Saya" di atas.`
      );
    }
  }
}

function handleTypoSuggestion(backendSuggestion, originalInput) {
  showLoginError(
    'Email Belum Cocok',
    `Email "${originalInput}" memiliki kemiripan dengan data terdaftar di sekolah ini:`,
    {
      suggestedEmail: backendSuggestion.suggestedEmail || backendSuggestion.maskedEmail,
      fullEmail: backendSuggestion.suggestedEmail
    }
  );
}

// ==================== 3. SUCCESSFUL LOGIN & DASHBOARD MOUNT ====================
async function completeSuccessfulLogin() {
  hideLoginError();
  state.isLoggedIn = true;

  // Update profil di topbar
  el.displayStudentName.textContent = state.student.name;
  el.displayStudentMeta.textContent = `${state.student.school} · ${state.student.rombel} (${state.student.level})`;
  el.studentAvatar.style.backgroundImage = `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(state.student.name)}')`;

  // Tampilkan dashboard, sembunyikan login
  el.loginOverlay.style.display = 'none';
  el.siteShell.style.display = 'block';

  // Set judul misi di sidebar
  el.sidebarMissionTitle.textContent =
    state.student.level === 'SMA'
      ? 'Misi: Python Programming'
      : state.student.level === 'SMP'
      ? 'Misi: App Inventor Mobile'
      : 'Misi: Scratch Visual Coding';

  // Restore Local Progress
  const storageKey = `uob_progress_${state.student.email}_${state.student.school}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        state.submittedQuizIds = new Set(parsed);
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // Restore Submitted Challenges
  const challengeStoreKey = `uob_challenges_${state.student.email}_${state.student.school}`;
  try {
    const savedCh = localStorage.getItem(challengeStoreKey);
    if (savedCh) {
      const parsedCh = JSON.parse(savedCh);
      if (Array.isArray(parsedCh)) {
        state.submittedChallenges = new Map(parsedCh);
      }
    }
  } catch (e) {}

  // Load Kurikulum sesuai jenjang yang terdeteksi
  try {
    await loadCourseData(state.student.dataFile);
    if (state.student.isAdmin) {
      state.unlockedStepIndex = 9999;
    } else {
      let unlocked = 0;
      for (let i = 0; i < state.courseData.length; i++) {
        const qList = extractQuizzesFromStep(state.courseData[i]);
        const allQDone = qList.length === 0 || qList.every((q) => state.submittedQuizIds.has(q.id));
        if (allQDone) {
          unlocked = i + 1;
        } else {
          break;
        }
      }
      try {
        const savedUnlocked = localStorage.getItem(`uob_unlocked_${state.student.email}_${state.student.school}`);
        if (savedUnlocked) {
          unlocked = Math.max(unlocked, Number(savedUnlocked));
        }
      } catch (e) {}
      state.unlockedStepIndex = unlocked;
    }
    buildSidebarModuleList();
    goToStep(0);
  } catch (err) {
    console.error('Failed to load course dataset:', err);
    alert('Gagal memuat kurikulum materi. Silakan refresh halaman.');
  }

  // Server-First SSOT Sync from Google Sheets (Jika admin reset/delete di backend, frontend WAJIB reset)
  try {
    const getUrl = `${APP_SCRIPT_URL}?action=get_progress&email=${encodeURIComponent(state.student.email)}&school=${encodeURIComponent(state.student.school)}&level=${encodeURIComponent(state.student.level)}`;
    fetch(getUrl)
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success) {
          const serverQuizzes = res.data && Array.isArray(res.data.submittedQuizIds) ? res.data.submittedQuizIds : [];
          if (serverQuizzes.length === 0) {
            console.warn('[SSOT Sync] Data di spreadsheet kosong atau di-reset admin. Mereset progres lokal...');
            state.submittedQuizIds.clear();
            localStorage.removeItem(storageKey);
            localStorage.removeItem(`uob_last_step_${state.student.email}_${state.student.school}`);
            state.currentStepIndex = 0;
            goToStep(0);
          } else {
            state.submittedQuizIds = new Set(serverQuizzes);
            localStorage.setItem(storageKey, JSON.stringify([...state.submittedQuizIds]));
          }
          renderQuizSwitcherStrip();
          checkProgressGate();
        } else if (res && (res.studentFound === false || res.notFound)) {
          console.warn('[SSOT Sync] Data siswa tidak ditemukan di spreadsheet. Mereset progres lokal...');
          state.submittedQuizIds.clear();
          localStorage.removeItem(storageKey);
          localStorage.removeItem(`uob_last_step_${state.student.email}_${state.student.school}`);
          state.currentStepIndex = 0;
          goToStep(0);
          renderQuizSwitcherStrip();
          checkProgressGate();
        }
      })
      .catch((err) => console.log('Backend sync offline/deferred:', err));
  } catch (e) {}

  checkMobileAdvisory();
}

async function loadCourseData(filename) {
  const res = await fetch(`./data/${filename}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  state.rawCourseData = data;
  if (data && Array.isArray(data.modules)) {
    const allSteps = [];
    data.modules.forEach((mod) => {
      if (Array.isArray(mod.steps)) {
        mod.steps.forEach((step) => {
          allSteps.push({
            ...step,
            moduleTitle: mod.title,
            moduleId: mod.id,
            moduleDesc: mod.description
          });
        });
      }
    });
    state.courseData = allSteps;
  } else if (Array.isArray(data)) {
    state.courseData = data;
  } else if (data && typeof data === 'object') {
    state.courseData = Object.values(data);
  } else {
    state.courseData = [];
  }
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
    el.loginEmailInput.value = '';
    el.loginEmailInput.disabled = true;
    el.btnToggleEmailHelp.disabled = true;
    el.btnLogin.disabled = true;
    el.btnLogin.querySelector('span').textContent = 'Mulai Belajar';
    el.loginDetectedBadge.textContent = 'Pilih Sekolah untuk Mulai';
    hideLoginError();
  });
}

function setupAdvisoryModal() {
  if (el.btnOpenAdvisory) {
    el.btnOpenAdvisory.addEventListener('click', () => {
      el.advisoryModal?.showModal();
    });
  }
  if (el.btnDismissAdvisory) {
    el.btnDismissAdvisory.addEventListener('click', () => {
      sessionStorage.setItem('uob_advisory_dismissed', 'true');
      el.advisoryModal?.close();
    });
  }
  if (el.advisoryContinueBtn) {
    el.advisoryContinueBtn.addEventListener('click', () => {
      sessionStorage.setItem('uob_advisory_dismissed', 'true');
      el.advisoryModal?.close();
    });
  }
}

function checkMobileAdvisory() {
  const isMobile = window.innerWidth <= 768;
  const alreadyDismissed = sessionStorage.getItem('uob_advisory_dismissed');
  if (isMobile && !alreadyDismissed && el.advisoryModal) {
    el.advisoryModal.showModal();
  }
}

// ==================== 4. SIDEBAR & NAVIGATION ====================
function buildSidebarModuleList() {
  el.lessonNav.innerHTML = '';
  el.mobileStepSelect.innerHTML = '';

  const isAdmin = Boolean(state.student && state.student.isAdmin);
  const isAllCourseCompleted = isAdmin || state.unlockedStepIndex >= state.courseData.length;

  state.courseData.forEach((step, index) => {
    const isUnlocked = isAdmin || index <= state.unlockedStepIndex;
    const isCompleted = index < state.unlockedStepIndex;

    // Desktop Tab Item
    const tab = document.createElement('button');
    tab.className = `lesson-tab ${index === state.currentStepIndex ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;
    tab.type = 'button';
    tab.setAttribute('data-step-index', index);
    tab.innerHTML = `
      <span class="tab-number">${isUnlocked ? (isCompleted ? '✓' : String(index + 1).padStart(2, '0')) : '🔒'}</span>
      <div class="tab-copy">
        <strong>${step.title || `Materi ${index + 1}`}</strong>
        <span>${step.duration || '10 Menit'} · ${step.type === 'slide' ? 'Slide' : 'Video'}</span>
      </div>
      <span class="tab-arrow">${isUnlocked ? '→' : '🔒'}</span>
    `;
    tab.addEventListener('click', () => {
      if (!isUnlocked) {
        alert(`🔒 Materi ${index + 1} masih terkunci! Selesaikan materi ${state.unlockedStepIndex + 1} terlebih dahulu (tonton video & selesaikan semua pop-up kuis) untuk membuka materi ini.`);
        return;
      }
      goToStep(index);
    });
    el.lessonNav.appendChild(tab);

    // Mobile Select Option
    const opt = document.createElement('option');
    opt.value = index;
    opt.disabled = !isUnlocked;
    opt.textContent = `${isUnlocked ? (isCompleted ? '✓ ' : '') : '🔒 '}${String(index + 1).padStart(2, '0')}. ${step.title}`;
    el.mobileStepSelect.appendChild(opt);
  });

  // Tab Terakhir: 🎓 Sertifikat & Rekap Nilai
  const certTab = document.createElement('button');
  certTab.className = `lesson-tab certificate-tab ${!isAllCourseCompleted ? 'locked' : ''}`;
  certTab.type = 'button';
  certTab.id = 'tab-certificate-final';
  certTab.innerHTML = `
    <span class="tab-number">${isAllCourseCompleted ? '🎓' : '🔒'}</span>
    <div class="tab-copy">
      <strong>Sertifikat & Rekap Nilai</strong>
      <span>${isAllCourseCompleted ? 'Siap Diterbitkan' : 'Terkunci (Selesaikan Semua)'}</span>
    </div>
    <span class="tab-arrow">${isAllCourseCompleted ? '→' : '🔒'}</span>
  `;
  certTab.addEventListener('click', () => {
    if (!isAllCourseCompleted) {
      alert('🔒 Tab Sertifikat & Rekap Nilai masih terkunci! Selesaikan semua video dan kuis dari Materi 01 hingga akhir untuk membuka sertifikat kelulusan.');
      return;
    }
    openCertificateModal();
  });
  el.lessonNav.appendChild(certTab);

  // Mobile Option for Certificate
  const certOpt = document.createElement('option');
  certOpt.value = 'certificate';
  certOpt.disabled = !isAllCourseCompleted;
  certOpt.textContent = `${isAllCourseCompleted ? '🎓' : '🔒'} Sertifikat & Rekap Nilai`;
  el.mobileStepSelect.appendChild(certOpt);

  el.mobileStepSelect.onchange = (e) => {
    if (e.target.value === 'certificate') {
      if (isAllCourseCompleted) {
        openCertificateModal();
      } else {
        alert('🔒 Tab Sertifikat & Rekap Nilai masih terkunci!');
        el.mobileStepSelect.value = state.currentStepIndex;
      }
      return;
    }
    const idx = Number(e.target.value);
    if (!isAdmin && idx > state.unlockedStepIndex) {
      alert(`🔒 Materi ${idx + 1} masih terkunci.`);
      el.mobileStepSelect.value = state.currentStepIndex;
      return;
    }
    goToStep(idx);
  };

  updateProgressIndicator();
}

function updateProgressIndicator() {
  const total = state.courseData.length;
  const current = state.currentStepIndex + 1;
  el.progressText.textContent = `${current} dari ${total} Materi`;
  const percent = Math.min(100, Math.round((current / total) * 100));
  el.progressFill.style.width = `${percent}%`;
}

// ==================== 5. STEP CONTENT & MEDIA SWITCHER ====================
function goToStep(index) {
  if (index < 0 || index >= state.courseData.length) return;
  const isAdmin = Boolean(state.student && state.student.isAdmin);
  if (!isAdmin && index > state.unlockedStepIndex) {
    alert(`🔒 Materi ${index + 1} masih terkunci! Selesaikan materi sebelumnya terlebih dahulu.`);
    return;
  }

  state.currentStepIndex = index;
  state.videoMaxTimeWatched = 0;
  state.videoDuration = 0;
  state.videoWatchedToEnd = false;
  state.isIntroPlaying = false;
  if (el.introVideo) {
    try {
      el.introVideo.pause();
    } catch (e) {}
    el.introVideo.currentTime = 0;
    el.introVideo.style.display = 'none';
  }
  teardownPlayer();

  const step = state.courseData[index];

  // Update Header Info
  el.lessonKicker.textContent = step.kicker || `MODUL ${String(index + 1).padStart(2, '0')}`;
  el.lessonTitle.textContent = step.title;
  el.mediaTypeBadge.textContent = step.type === 'slide' ? '📄 Slide Interaktif' : '▶ Video';
  el.lessonDuration.textContent = step.duration || '10 Menit';

  // Extract Quizzes & Render Bento Tracker
  state.activeStepQuizzes = extractQuizzesFromStep(step);
  renderBentoQuizTracker();

  // Setup Sandbox Iframe Slide Path
  const slidePath = step.slideUrl || (state.student.level === 'SMA' ? './slides/bridge-hs-00.html' : './slides/bridge-ms-00.html');
  el.sandboxIframe.src = slidePath;
  el.sandboxTitle.textContent = step.title;

  // Media Mode: Default to Video if type is video, otherwise Sandbox/Slide
  if (step.type === 'slide') {
    el.videoFrame.classList.add('slide-mode');
    activateMediaMode('sandbox');
    if (!step.youtubeId && !step.videoUrl) {
      el.mediaSwitcherTabs.style.display = 'none';
    } else {
      el.mediaSwitcherTabs.style.display = 'flex';
    }
  } else {
    el.videoFrame.classList.remove('slide-mode');
    activateMediaMode('video');
    renderVideoStep(step);
    if (step.slideUrl) {
      el.mediaSwitcherTabs.style.display = 'flex';
    } else {
      el.mediaSwitcherTabs.style.display = 'none';
    }
  }

  // Render Intro Video Card (Pengantar Materi Sebelum Menonton)
  if (el.introVideoCard && el.introVideoText) {
    if (step.introVideo || step.introText) {
      el.introVideoText.innerHTML = step.introVideo || step.introText;
      el.introVideoCard.style.display = 'block';
    } else {
      el.introVideoCard.style.display = 'none';
    }
  }

  // Render Bookmarks
  renderBookmarks(step.bookmarks || []);

  // Render Exact Legacy 2-Column Cards Below Video
  renderLegacyCards(step, index);

  // Render Challenge Panel (Mini Project Mandiri — Non-Gating)
  renderChallengePanel(step, index);

  // Render Lesson Reading Accordion
  renderReadingAccordion(step, index);

  // Update Sidebar Active Class
  document.querySelectorAll('.lesson-tab').forEach((tab) => {
    const tabIdx = Number(tab.getAttribute('data-step-index'));
    if (!isNaN(tabIdx)) {
      tab.classList.toggle('active', tabIdx === index);
    }
  });
  el.mobileStepSelect.value = index;

  updateProgressIndicator();
  checkProgressGate();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function extractQuizzesFromStep(step) {
  if (Array.isArray(step.quizzes) && step.quizzes.length > 0) {
    const list = [];
    step.quizzes.forEach((item, idx) => {
      if (item.questions && Array.isArray(item.questions)) {
        item.questions.forEach((q, qIdx) => {
          if (q.type !== 'info') {
            list.push({
              id: q.id || `q-${step.id || state.currentStepIndex}-${idx}-${qIdx}`,
              title: q.title || `Kuis ${list.length + 1}`,
              question: q.question || q.title || 'Pertanyaan Kuis',
              options: q.options || ['Benar', 'Salah'],
              answer: q.answer !== undefined ? q.answer : 0,
              explanation: q.explanation || 'Penjelasan tepat sesuai materi.',
              time: item.time || 30
            });
          }
        });
      } else if (item.question) {
        list.push({
          id: item.id || `q-${step.id || state.currentStepIndex}-${idx}`,
          title: item.title || `Kuis ${list.length + 1}`,
          question: item.question,
          options: item.options || ['Pilihan A', 'Pilihan B'],
          answer: item.answer !== undefined ? item.answer : 0,
          explanation: item.explanation || 'Penjelasan tepat.',
          time: item.time || 30
        });
      }
    });
    if (list.length > 0) return list;
  }

  if (step.quiz) {
    return [{
      id: step.quiz.id || `quiz-${state.currentStepIndex}-0`,
      title: 'Cek Pemahaman',
      question: step.quiz.question || 'Pertanyaan Kuis',
      options: step.quiz.options || ['Pilihan A', 'Pilihan B'],
      answer: step.quiz.answer !== undefined ? step.quiz.answer : 0,
      explanation: step.quiz.explanation || 'Penjelasan kuis.',
      time: step.quiz.time || 30
    }];
  }

  return [];
}

// ==================== 6. MEDIA SWITCHER (VIDEO vs SANDBOX) ====================
function setupMediaSwitcherEvents() {
  el.tabModeVideo.addEventListener('click', () => {
    activateMediaMode('video');
  });

  el.tabModeSandbox.addEventListener('click', () => {
    activateMediaMode('sandbox');
  });

  // Sandbox Toolbar Buttons
  el.btnReloadSandbox.addEventListener('click', () => {
    el.sandboxIframe.src = el.sandboxIframe.src;
  });

  el.btnFullscreenSandbox.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      const target = el.sandboxContainer || el.videoFrame;
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {
          if (el.videoFrame.requestFullscreen) el.videoFrame.requestFullscreen().catch(() => {});
        });
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });
}

function activateMediaMode(mode) {
  state.activeMediaMode = mode;
  if (mode === 'sandbox') {
    el.tabModeSandbox.classList.add('active');
    el.tabModeVideo.classList.remove('active');
    if (el.videoFrame) el.videoFrame.classList.add('slide-mode');
    el.sandboxContainer.style.display = 'flex';
    el.videoControls.style.display = 'none';
    el.customThumbnail.style.display = 'none';

    // Pause Video jika sedang main
    if (state.ytPlayer && state.isPlaying) {
      state.ytPlayer.pauseVideo();
    }
  } else {
    el.tabModeVideo.classList.add('active');
    el.tabModeSandbox.classList.remove('active');
    if (el.videoFrame) el.videoFrame.classList.remove('slide-mode');
    el.sandboxContainer.style.display = 'none';
    el.videoControls.style.display = 'flex';
    if (!state.hasStartedVideo) {
      el.customThumbnail.style.display = 'block';
    }
  }
}

// ==================== 7. VIDEO PLAYER (YOUTUBE WITH CONTROLS) ====================
function renderVideoStep(step) {
  state.hasStartedVideo = false;
  state.isPlaying = false;
  state.isIntroPlaying = false;
  el.btnPlayPause.textContent = '▶';
  el.videoSeekBar.value = 0;
  el.videoTimeDisplay.textContent = '0:00 / 0:00';

  if (el.introVideo) {
    try {
      el.introVideo.pause();
    } catch (e) {}
    el.introVideo.currentTime = 0;
    el.introVideo.style.display = 'none';
  }

  const vidId = step.videoId || step.youtubeId || 'yxmLOk5vcFg';
  el.thumbnailImg.src = step.thumbnailUrl || `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
  el.customThumbnail.style.display = 'block';

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
        state.videoDuration = event.target.getDuration() || 0;
        if (startSeconds) event.target.seekTo(startSeconds, true);
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          state.isPlaying = true;
          el.btnPlayPause.textContent = '⏸';
          startPlayerTicker(endSeconds);
        } else if (event.data === YT.PlayerState.ENDED) {
          state.isPlaying = false;
          state.videoWatchedToEnd = true;
          el.btnPlayPause.textContent = '▶';
          stopPlayerTicker();
          checkProgressGate();
          renderQuizSwitcherStrip();
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

    state.videoDuration = duration;
    const prevMax = state.videoMaxTimeWatched || 0;
    state.videoMaxTimeWatched = Math.max(prevMax, curTime);

    // Cek apakah baru saja mencapai batas minimal 10 detik terakhir
    const threshold = Math.max(1, duration - 10);
    if (prevMax < threshold && state.videoMaxTimeWatched >= threshold) {
      checkProgressGate();
      renderQuizSwitcherStrip();
    }

    el.videoSeekBar.value = (curTime / duration) * 100;
    el.videoTimeDisplay.textContent = `${formatTime(curTime)} / ${formatTime(duration)}`;

    if (endSeconds > 0 && curTime >= endSeconds) {
      state.ytPlayer.pauseVideo();
    }

    // Trigger Pop-up Quiz bila waktu tiba
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

  const frame = document.querySelector('#video-frame');
  const existingMount = document.querySelector('#youtube-player');
  if (!existingMount && frame) {
    const newDiv = document.createElement('div');
    newDiv.id = 'youtube-player';
    frame.prepend(newDiv);
  }
}

/**
 * 4-Detik Intro Video Bumper (intro.mp4)
 * Wajib diputar sebelum video materi utama YouTube berputar
 */
function playIntroBumper(onFinish) {
  if (!el.introVideo) {
    if (onFinish) onFinish();
    return;
  }

  el.customThumbnail.style.display = 'none';
  el.introVideo.style.display = 'block';
  el.introVideo.currentTime = 0;
  state.isIntroPlaying = true;
  el.btnPlayPause.textContent = '⏸';

  let finished = false;
  const finishIntro = () => {
    if (finished) return;
    finished = true;
    state.isIntroPlaying = false;
    state.introPlayedSteps.add(state.currentStepIndex);
    el.introVideo.style.display = 'none';
    if (onFinish) onFinish();
  };

  el.introVideo.onended = finishIntro;
  el.introVideo.onerror = (err) => {
    console.warn('Intro video playback error:', err);
    finishIntro();
  };

  const playPromise = el.introVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn('Intro video play exception:', err);
      finishIntro();
    });
  }
}

function setupPlayerControlEvents() {
  const togglePlay = () => {
    const step = state.courseData[state.currentStepIndex];
    const isVideoStep = !step || step.type !== 'slide';

    // 1. Jika intro video sedang berjalan, toggle play/pause intro
    if (state.isIntroPlaying && el.introVideo) {
      if (el.introVideo.paused) {
        el.introVideo.play();
        el.btnPlayPause.textContent = '⏸';
      } else {
        el.introVideo.pause();
        el.btnPlayPause.textContent = '▶';
      }
      return;
    }

    // 2. Jika belum pernah memutar intro di materi video ini, putar intro 4 detik dulu
    if (isVideoStep && !state.introPlayedSteps.has(state.currentStepIndex)) {
      playIntroBumper(() => {
        if (state.ytPlayer && state.ytPlayer.playVideo) {
          state.ytPlayer.playVideo();
        }
      });
      return;
    }

    // 3. Kontrol reguler YouTube
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

  el.centerPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });
  el.customThumbnail.addEventListener('click', (e) => {
    if (e.target === el.centerPlayBtn) return;
    togglePlay();
  });
  el.btnPlayPause.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

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
      activateMediaMode('video');
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

// ==================== 8. EXACT LEGACY BELOW-VIDEO CARDS & READING ====================
function renderLegacyCards(step, index) {
  // Loot Box Summary Card
  el.summaryHeadingIcon.textContent = String(index + 1).padStart(2, '0');
  el.summaryCardTitle.textContent = step.lootboxTitle || 'Loot Box Hari Ini 🎁';

  const defaultTakeaways = [
    `<strong>Program itu pintar!</strong> Nggak cuma jalan lurus, komputer mengikuti alur logika secara berurutan.`,
    `<strong>Kayak di dunia nyata.</strong> Logika pemrograman meniru bagaimana kita membuat keputusan setiap hari.`,
    `<strong>Jawabannya pasti.</strong> Setiap kondisi menghasilkan Benar (True) atau Salah (False).`,
    `<strong>Praktik kunci utama.</strong> Semakin sering mencoba dan mengutak-atik kode, semakin terbiasa!`
  ];

  const takeaways = Array.isArray(step.takeaways) && step.takeaways.length > 0 ? step.takeaways : defaultTakeaways;
  el.takeawayList.innerHTML = takeaways.map((t) => `<li>${t}</li>`).join('');

  // Focus Card (Cheat Sheet Emas Pastel)
  el.focusCardTitle.textContent = step.cheatsheetTitle || 'Kalo bener, gaskeun!';
  el.focusCardDesc.textContent = step.cheatsheetDesc || 'Coba ingat apa konsep logika penting yang baru saja kamu pelajari?';
  el.focusCardCode.innerHTML = step.cheatsheetCode || `<span class="keyword">print</span>(<span class="string">"Semangat Belajar Coding!"</span>)`;
}

function renderReadingAccordion(step, index) {
  el.readingHeaderLabel.textContent = `Materi Bacaan ${String(index + 1).padStart(2, '0')}`;
  el.readingHeaderTitle.textContent = step.readingTitle || step.title;
  el.readingHeaderDesc.textContent = step.readingDesc || 'Biar makin paham dan mantap, baca rangkuman materi ini setelah nonton video atau menyimak slide ya!';

  // Concept Grid Cards (A, B, C)
  const defaultConcepts = [
    { num: 'A', title: 'Kode itu Nggak Kaku', desc: 'Bikin program kamu bisa memilih apa yang ingin dilakukan sesuai input pengguna.' },
    { num: 'B', title: 'Kondisi = Memberi Pertanyaan', desc: 'Misalnya: "Apakah saldo cukup?", "Apakah tombol sudah ditekan?".' },
    { num: 'C', title: 'Pasti dan Terukur', desc: 'Hasil evaluasi logika komputer hanya berupa True (Benar) atau False (Salah).' }
  ];

  const concepts = Array.isArray(step.concepts) && step.concepts.length > 0 ? step.concepts : defaultConcepts;
  el.readingConceptGrid.innerHTML = concepts.map((c) => `
    <article class="concept-card">
      <span class="concept-number">${c.num}</span>
      <h4>${c.title}</h4>
      <p>${c.desc}</p>
    </article>
  `).join('');

  // Reading Section Code & Note
  el.readingSectionTitle.textContent = step.sectionTitle || 'Dari Dunia Nyata ke Dunia Kode';
  el.readingSectionCode.textContent = step.sectionCode || `# Komputer mengecek syarat sebelum menjalankan aksi\nsaldo = 50000\nharga = 25000\n\nif saldo >= harga:\n    print("Transaksi Berhasil!")`;
  el.readingSectionNote.innerHTML = step.sectionNote || `<strong>Intinya:</strong> Kondisi itu seperti satpam pintu. Kalau syarat terpenuhi (True), pintu dibuka!`;
}

// ==================== 9. BENTO QUIZ TRACKER & MODAL ====================
function renderBentoQuizTracker() {
  if (!el.bentoQuizList) return;
  el.bentoQuizList.innerHTML = '';
  const quizzes = state.activeStepQuizzes || [];
  const completedCount = quizzes.filter((q) => state.submittedQuizIds.has(q.id)).length;

  if (el.bentoQuizCounter) {
    if (quizzes.length === 0) {
      el.bentoQuizCounter.textContent = 'Materi ini fokus pada pembelajaran mandiri tanpa evaluasi pop-up kuis.';
    } else {
      el.bentoQuizCounter.textContent = `${completedCount} dari ${quizzes.length} Pop-up Kuis Selesai`;
    }
  }

  if (quizzes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'bento-quiz-empty';
    empty.innerHTML = '<p>💡 Materi ini fokus pada pemahaman konsep/slide. Lanjutkan menyimak materi atau mencoba tantangan praktik.</p>';
    el.bentoQuizList.appendChild(empty);
    return;
  }

  quizzes.forEach((quiz, i) => {
    const isDone = state.submittedQuizIds.has(quiz.id);
    const item = document.createElement('div');
    item.className = 'bento-quiz-item';

    const timeLabel = quiz.time ? formatTime(quiz.time) : '';
    const cleanPrompt = (quiz.question || quiz.title || `Kuis ${i + 1}`).replace(/<[^>]*>?/gm, '');

    item.innerHTML = `
      <div class="bento-quiz-meta">
        <span class="bento-quiz-num">Kuis ${i + 1}</span>
        ${timeLabel ? `<span class="bento-quiz-time">⏱ ${timeLabel}</span>` : ''}
        <span class="bento-quiz-prompt" title="${cleanPrompt}">${cleanPrompt}</span>
      </div>
      <div class="bento-quiz-actions">
        <span class="${isDone ? 'bento-badge-done' : 'bento-badge-pending'}">
          ${isDone ? '✓ Selesai' : '⏳ Belum'}
        </span>
        <button type="button" class="btn-bento-open-quiz">
          ${isDone ? 'Ulas Kuis' : 'Buka Kuis'}
        </button>
      </div>
    `;

    const btnOpen = item.querySelector('.btn-bento-open-quiz');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => openQuizModal(i));
    }
    el.bentoQuizList.appendChild(item);
  });
}

function renderQuizSwitcherStrip() {
  renderBentoQuizTracker();
  if (!el.quizPillsList) return;
  el.quizPillsList.innerHTML = '';
  const quizzes = state.activeStepQuizzes;
  const step = state.courseData[state.currentStepIndex];
  const isVideoStep = !step || step.type !== 'slide';

  const isVideoWatchedEnough = !isVideoStep || state.videoWatchedToEnd || (state.videoDuration > 0 && state.videoMaxTimeWatched >= Math.max(1, state.videoDuration - 10));

  if (quizzes.length === 0 && !isVideoStep) {
    if (el.quizSummaryStatus) el.quizSummaryStatus.textContent = 'Materi slide interaktif dapat dipelajari secara mandiri.';
    if (el.btnOpenActiveQuiz) el.btnOpenActiveQuiz.style.display = 'none';
    return;
  }

  const completedCount = quizzes.filter((q) => state.submittedQuizIds.has(q.id)).length;

  if (quizzes.length === 0) {
    if (el.quizSummaryStatus) el.quizSummaryStatus.textContent = isVideoWatchedEnough ? '✓ Video tuntas ditonton.' : '⏱ Tonton video setidaknya s.d. 10 detik terakhir.';
    if (el.btnOpenActiveQuiz) el.btnOpenActiveQuiz.style.display = 'none';
  } else {
    if (el.btnOpenActiveQuiz) el.btnOpenActiveQuiz.style.display = 'inline-block';
    if (el.quizSummaryStatus) el.quizSummaryStatus.textContent = `Tracker: ${quizzes.length} Pop-up Kuis (${completedCount}/${quizzes.length} Selesai) · Video: ${isVideoWatchedEnough ? '✓ Tuntas' : '⏱ Belum Tuntas'}`;
  }

  // Render Quiz Pills
  quizzes.forEach((quiz, i) => {
    const isDone = state.submittedQuizIds.has(quiz.id);
    const pill = document.createElement('button');
    pill.className = `quiz-pill-btn ${isDone ? 'completed' : ''}`;
    pill.type = 'button';
    const timeLabel = quiz.time ? formatTime(quiz.time) : '';
    pill.innerHTML = `<span>${isDone ? '✓' : '⏱'}</span> <span>${timeLabel ? timeLabel + ' · ' : ''}Kuis ${i + 1} (${isDone ? 'Selesai' : 'Belum'})</span>`;
    pill.addEventListener('click', () => openQuizModal(i));
    el.quizPillsList.appendChild(pill);
  });

  // Render Video Status Pill
  if (isVideoStep) {
    const videoPill = document.createElement('div');
    videoPill.className = `quiz-pill-btn ${isVideoWatchedEnough ? 'completed' : ''}`;
    videoPill.style.cursor = 'default';
    videoPill.innerHTML = `<span>${isVideoWatchedEnough ? '✓' : '⏱'}</span> <span>Video: ${isVideoWatchedEnough ? 'Ditonton s.d. 10 Detik Akhir' : 'Belum 10 Detik Terakhir'}</span>`;
    el.quizPillsList.appendChild(videoPill);
  }

  if (quizzes.length > 0 && el.btnOpenActiveQuiz) {
    const allDone = completedCount === quizzes.length;
    el.btnOpenActiveQuiz.textContent = allDone ? '✓ Semua Kuis Tuntas' : 'Buka Kuis Pop-up';
    el.btnOpenActiveQuiz.onclick = () => {
      const firstUnfinished = quizzes.findIndex((q) => !state.submittedQuizIds.has(q.id));
      openQuizModal(firstUnfinished !== -1 ? firstUnfinished : 0);
    };
  }
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

  el.btnRewatchQuiz.addEventListener('click', () => {
    closeModal();
    if (state.ytPlayer && state.ytPlayer.getCurrentTime) {
      const cur = state.ytPlayer.getCurrentTime();
      const targetTime = Math.max(0, cur - 30);
      state.ytPlayer.seekTo(targetTime, true);
      state.ytPlayer.playVideo();
    }
  });

  el.btnSubmitQuiz.addEventListener('click', () => {
    const selected = document.querySelector('input[name="quiz-choice"]:checked');
    if (!selected) {
      showQuizFeedback('Silakan pilih salah satu jawaban terlebih dahulu.', 'error');
      return;
    }

    const selectedIdx = Number(selected.value);
    const quiz = state.activeQuiz;

    if (selectedIdx === quiz.answer) {
      state.submittedQuizIds.add(quiz.id);

      try {
        const storageKey = `uob_progress_${state.student.email}_${state.student.school}`;
        localStorage.setItem(storageKey, JSON.stringify([...state.submittedQuizIds]));
      } catch (e) {}

      syncProgressToBackend(quiz.id, true, 100);

      showQuizFeedback(`Bagus sekali! Jawabanmu benar. ${quiz.explanation || ''}`, 'success');
      renderQuizSwitcherStrip();
      checkProgressGate();

      setTimeout(() => {
        closeModal();
      }, 1600);
    } else {
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

// ==================== 10. PROGRESS LOCK GATE ====================
function updateSidebarLockStates() {
  const isAdmin = Boolean(state.student && state.student.isAdmin);
  const isAllCourseCompleted = isAdmin || state.unlockedStepIndex >= state.courseData.length;

  document.querySelectorAll('.lesson-tab').forEach((tab) => {
    if (tab.id === 'tab-certificate-final') {
      tab.classList.toggle('locked', !isAllCourseCompleted);
      const numSpan = tab.querySelector('.tab-number');
      if (numSpan) numSpan.textContent = isAllCourseCompleted ? '🎓' : '🔒';
      const arrowSpan = tab.querySelector('.tab-arrow');
      if (arrowSpan) arrowSpan.textContent = isAllCourseCompleted ? '→' : '🔒';
      const descSpan = tab.querySelector('.tab-copy span');
      if (descSpan) descSpan.textContent = isAllCourseCompleted ? 'Siap Diterbitkan' : 'Terkunci (Selesaikan Semua)';
      return;
    }
    const idx = Number(tab.getAttribute('data-step-index'));
    if (!isNaN(idx)) {
      const isUnlocked = isAdmin || idx <= state.unlockedStepIndex;
      const isCompleted = idx < state.unlockedStepIndex;
      tab.classList.toggle('locked', !isUnlocked);
      const numSpan = tab.querySelector('.tab-number');
      if (numSpan) numSpan.textContent = isUnlocked ? (isCompleted ? '✓' : String(idx + 1).padStart(2, '0')) : '🔒';
      const arrowSpan = tab.querySelector('.tab-arrow');
      if (arrowSpan) arrowSpan.textContent = isUnlocked ? '→' : '🔒';
    }
  });

  if (el.mobileStepSelect) {
    Array.from(el.mobileStepSelect.options).forEach((opt) => {
      if (opt.value === 'certificate') {
        opt.disabled = !isAllCourseCompleted;
        opt.textContent = `${isAllCourseCompleted ? '🎓' : '🔒'} Sertifikat & Rekap Nilai`;
      } else {
        const idx = Number(opt.value);
        if (!isNaN(idx)) {
          const isUnlocked = isAdmin || idx <= state.unlockedStepIndex;
          opt.disabled = !isUnlocked;
        }
      }
    });
  }
}

function checkProgressGate() {
  const isLastStep = state.currentStepIndex >= state.courseData.length - 1;
  const step = state.courseData[state.currentStepIndex];
  const isVideoStep = !step || step.type !== 'slide';

  const quizzes = state.activeStepQuizzes;
  const completedCount = quizzes.filter((q) => state.submittedQuizIds.has(q.id)).length;
  const isAllQuizzesCompleted = completedCount === quizzes.length;
  const isVideoWatchedEnough = !isVideoStep || state.videoWatchedToEnd || (state.videoDuration > 0 && state.videoMaxTimeWatched >= Math.max(1, state.videoDuration - 10));
  const isRequirementMet = isAllQuizzesCompleted && isVideoWatchedEnough;

  const isAdmin = Boolean(state.student && state.student.isAdmin);

  if (isRequirementMet) {
    state.unlockedStepIndex = Math.max(state.unlockedStepIndex, state.currentStepIndex + 1);
    if (isLastStep) {
      state.unlockedStepIndex = state.courseData.length;
    }
    if (state.student && state.student.email) {
      try {
        localStorage.setItem(`uob_unlocked_${state.student.email}_${state.student.school}`, state.unlockedStepIndex);
      } catch (e) {}
    }
    updateSidebarLockStates();
  }

  if (isLastStep) {
    if (isRequirementMet) {
      el.btnNextStep.disabled = false;
      el.nextStepIcon.textContent = '🎓';
      el.stepGateInfo.textContent = '★ Selamat! Kamu telah menyelesaikan seluruh materi. Klik untuk membuka Sertifikat & Rekap Nilai!';
      el.stepGateInfo.style.color = '#27c881';
    } else {
      el.btnNextStep.disabled = true;
      el.nextStepIcon.textContent = '🔒';
      el.stepGateInfo.textContent = '⚠️ Selesaikan video dan kuis pada materi terakhir ini untuk membuka tab Sertifikat & Rekap Nilai.';
      el.stepGateInfo.style.color = '#ffd93d';
    }
    if (el.btnAdminBypass) el.btnAdminBypass.style.display = 'none';
    return;
  }

  if (isRequirementMet) {
    el.btnNextStep.disabled = false;
    el.nextStepIcon.textContent = '→';
    el.stepGateInfo.textContent = '✓ Semua kuis selesai & video telah ditonton hingga 10 detik terakhir! Kamu bisa lanjut ke materi berikutnya.';
    el.stepGateInfo.style.color = '#27c881';
    if (el.btnAdminBypass) el.btnAdminBypass.style.display = 'none';
  } else {
    el.btnNextStep.disabled = true;
    el.nextStepIcon.textContent = '🔒';

    // Rincikan syarat yang belum dipenuhi
    const pendingItems = [];
    if (!isAllQuizzesCompleted) {
      pendingItems.push(`${quizzes.length - completedCount} kuis pop-up belum dikerjakan`);
    }
    if (!isVideoWatchedEnough) {
      pendingItems.push('video belum ditonton setidaknya sampai 10 detik terakhir');
    }

    const warningText = `⚠️ Belum bisa lanjut: ${pendingItems.join(' dan ')}. Selesaikan untuk membuka materi selanjutnya.`;
    el.stepGateInfo.style.color = '#ffd93d';

    // Khusus Admin: Tetap tampilkan peringatan status siswa, namun tombol bypass dimunculkan
    if (isAdmin) {
      el.stepGateInfo.innerHTML = `<span>${warningText}</span><br><span style="color:#a78bfa;font-size:0.8rem;font-weight:700;">(Peringatan Status Siswa — Khusus Admin gunakan tombol bypass di bawah untuk melompat)</span>`;
      if (el.btnAdminBypass) el.btnAdminBypass.style.display = 'inline-flex';
    } else {
      el.stepGateInfo.textContent = warningText;
      if (el.btnAdminBypass) el.btnAdminBypass.style.display = 'none';
    }
  }
}

function setupStepNavEvents() {
  el.btnPrevStep.addEventListener('click', () => {
    if (state.currentStepIndex > 0) {
      goToStep(state.currentStepIndex - 1);
    }
  });

  el.btnNextStep.addEventListener('click', () => {
    const isLastStep = state.currentStepIndex >= state.courseData.length - 1;
    if (isLastStep) {
      openCertificateModal();
      return;
    }
    const quizzes = state.activeStepQuizzes;
    const isCurrentStepCompleted = quizzes.every((q) => state.submittedQuizIds.has(q.id));
    const step = state.courseData[state.currentStepIndex];
    const isVideoStep = !step || step.type !== 'slide';
    const isVideoWatchedEnough = !isVideoStep || state.videoWatchedToEnd || (state.videoDuration > 0 && state.videoMaxTimeWatched >= Math.max(1, state.videoDuration - 10));

    if (isCurrentStepCompleted && isVideoWatchedEnough && state.currentStepIndex < state.courseData.length - 1) {
      state.unlockedStepIndex = Math.max(state.unlockedStepIndex, state.currentStepIndex + 1);
      updateSidebarLockStates();
      goToStep(state.currentStepIndex + 1);
    }
  });

  if (el.btnAdminBypass) {
    el.btnAdminBypass.addEventListener('click', () => {
      state.unlockedStepIndex = Math.max(state.unlockedStepIndex, state.currentStepIndex + 1);
      updateSidebarLockStates();
      if (state.currentStepIndex < state.courseData.length - 1) {
        goToStep(state.currentStepIndex + 1);
      } else {
        openCertificateModal();
      }
    });
  }
}

// ==================== 11. CHALLENGE PANEL LOGIC (NON-GATING) ====================
function renderChallengePanel(step, index) {
  if (!el.challengePanel) return;

  const isChallengeStep = Boolean(
    step.practice ||
    step.miniProject ||
    step.type === 'challenge' ||
    (step.title && (step.title.toLowerCase().includes('project') || step.title.toLowerCase().includes('tantangan') || step.title.toLowerCase().includes('tugas')))
  );

  if (!isChallengeStep) {
    el.challengePanel.style.display = 'none';
    return;
  }

  el.challengePanel.style.display = 'block';

  // Title & description
  const chTitle = step.practice?.title || step.miniProject?.title || step.title || 'Tantangan Praktik Mandiri';
  const chDesc = step.practice?.instruction || step.miniProject?.description || 'Tantangan ini bersifat opsional untuk mengasah dan melatih kemampuan kodingmu secara mandiri. Kamu bebas melewatinya dan lanjut ke materi berikutnya kapan saja!';

  if (el.challengeTitle) el.challengeTitle.textContent = chTitle;
  if (el.challengeDesc) el.challengeDesc.textContent = chDesc;

  // Tasks list
  if (el.challengeTasksBox) {
    const rawTasks = step.practice?.tasks || step.miniProject?.tasks || step.practice?.checklist;
    const tasks = Array.isArray(rawTasks) && rawTasks.length > 0 ? rawTasks : [
      'Buka IDE koding sesuai jenjang belajarmu.',
      'Terapkan logika dan konsep yang telah dipelajari pada video materi ini.',
      'Uji coba program dan pastikan berjalan lancar tanpa error!'
    ];

    el.challengeTasksBox.innerHTML = `
      <ul>
        ${tasks.map((t) => `<li>${typeof t === 'string' ? t : (t.text || t.task || JSON.stringify(t))}</li>`).join('')}
      </ul>
    `;
  }

  // Adjust inputs based on student level
  const level = state.student?.level || 'SMA';
  if (level === 'SMA') {
    if (el.groupCodeInput) el.groupCodeInput.style.display = 'block';
    if (el.groupLinkInput) el.groupLinkInput.style.display = 'block';
    if (el.challengeUrlLabel) el.challengeUrlLabel.textContent = 'Atau Tautan Proyek (Google Colab / GitHub):';
    if (el.challengeUrlInput) el.challengeUrlInput.placeholder = 'https://colab.research.google.com/...';
    if (el.groupFileInput) el.groupFileInput.style.display = 'block';
    if (el.challengeFileLabel) el.challengeFileLabel.textContent = 'Atau Unggah Berkas Python (.py / .ipynb):';
    if (el.challengeFileInput) el.challengeFileInput.accept = '.py,.ipynb,.txt';
  } else if (level === 'SMP') {
    if (el.groupCodeInput) el.groupCodeInput.style.display = 'none';
    if (el.groupLinkInput) el.groupLinkInput.style.display = 'block';
    if (el.challengeUrlLabel) el.challengeUrlLabel.textContent = 'Tautan Galeri MIT App Inventor / Google Drive:';
    if (el.challengeUrlInput) el.challengeUrlInput.placeholder = 'https://ai2.appinventor.mit.edu/... atau link Google Drive';
    if (el.groupFileInput) el.groupFileInput.style.display = 'block';
    if (el.challengeFileLabel) el.challengeFileLabel.textContent = 'Atau Unggah Berkas Proyek (.aia / .apk):';
    if (el.challengeFileInput) el.challengeFileInput.accept = '.aia,.apk,.zip';
  } else {
    // SD
    if (el.groupCodeInput) el.groupCodeInput.style.display = 'none';
    if (el.groupLinkInput) el.groupLinkInput.style.display = 'block';
    if (el.challengeUrlLabel) el.challengeUrlLabel.textContent = 'Tautan Proyek Scratch (scratch.mit.edu):';
    if (el.challengeUrlInput) el.challengeUrlInput.placeholder = 'https://scratch.mit.edu/projects/...';
    if (el.groupFileInput) el.groupFileInput.style.display = 'block';
    if (el.challengeFileLabel) el.challengeFileLabel.textContent = 'Atau Unggah Berkas Proyek Scratch (.sb3):';
    if (el.challengeFileInput) el.challengeFileInput.accept = '.sb3,.zip';
  }

  // Restore prior submission if exists
  const chKey = step.id || `step_${index}`;
  const savedCh = state.submittedChallenges?.get(chKey);
  if (savedCh) {
    if (el.challengeCodeEditor && savedCh.code) el.challengeCodeEditor.value = savedCh.code;
    if (el.challengeUrlInput && savedCh.url) el.challengeUrlInput.value = savedCh.url;
    if (el.fileSelectedName && savedCh.fileName) el.fileSelectedName.textContent = `✓ ${savedCh.fileName}`;
    if (el.challengeSubmitFeedback) {
      el.challengeSubmitFeedback.style.display = 'block';
      el.challengeSubmitFeedback.className = 'challenge-submit-feedback success';
      el.challengeSubmitFeedback.textContent = `✓ Karya tantangan telah tersimpan (${new Date(savedCh.timestamp).toLocaleTimeString('id-ID')}). Kamu bisa memperbaruinya kapan saja!`;
    }
  } else {
    if (el.challengeSubmitFeedback) el.challengeSubmitFeedback.style.display = 'none';
  }
}

function setupChallengePanelEvents() {
  if (el.challengeFileInput) {
    el.challengeFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file && el.fileSelectedName) {
        el.fileSelectedName.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      }
    });
  }

  if (el.btnSubmitChallenge) {
    el.btnSubmitChallenge.addEventListener('click', () => {
      const step = state.courseData[state.currentStepIndex];
      const chKey = step?.id || `step_${state.currentStepIndex}`;
      const codeVal = el.challengeCodeEditor?.value?.trim() || '';
      const urlVal = el.challengeUrlInput?.value?.trim() || '';
      const file = el.challengeFileInput?.files?.[0];
      const fileName = file ? file.name : (el.fileSelectedName?.textContent.replace(/^✓\s*|^📄\s*/, '') || '');

      if (!codeVal && !urlVal && !file && !fileName) {
        alert('Silakan tulis kode, masukkan tautan proyek, atau unggah berkas karya terlebih dahulu.');
        return;
      }

      const submissionData = {
        stepId: chKey,
        stepTitle: step?.title || '',
        code: codeVal,
        url: urlVal,
        fileName: fileName,
        timestamp: new Date().toISOString()
      };

      state.submittedChallenges.set(chKey, submissionData);

      // Save to localStorage
      const challengeStoreKey = `uob_challenges_${state.student.email}_${state.student.school}`;
      try {
        localStorage.setItem(challengeStoreKey, JSON.stringify([...state.submittedChallenges]));
      } catch (e) {}

      // Optional async push to Google Apps Script
      try {
        fetch(APP_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit_challenge',
            email: state.student.email,
            school: state.student.school,
            level: state.student.level,
            submission: submissionData
          })
        }).catch(() => {});
      } catch (e) {}

      if (el.challengeSubmitFeedback) {
        el.challengeSubmitFeedback.style.display = 'block';
        el.challengeSubmitFeedback.className = 'challenge-submit-feedback success';
        el.challengeSubmitFeedback.textContent = '🎉 Hebat! Karya tantanganmu berhasil dikumpulkan. Kamu bebas lanjut ke materi berikutnya!';
      }
    });
  }

  if (el.btnSkipChallenge) {
    el.btnSkipChallenge.addEventListener('click', () => {
      // Non-gating: Scroll smoothly to footer nav or next step
      el.btnNextStep?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

// ==================== 12. CERTIFICATE & SCORE REPORT LOGIC ====================
function openCertificateModal() {
  if (!el.certificateModal) return;

  // Calculate statistics
  let totalQuizzes = 0;
  let passedQuizzes = 0;

  state.courseData.forEach((step) => {
    const qList = extractQuizzesFromStep(step);
    totalQuizzes += qList.length;
    qList.forEach((q) => {
      if (state.submittedQuizIds.has(q.id)) {
        passedQuizzes++;
      }
    });
  });

  const accuracy = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 100;
  const challengeCount = state.submittedChallenges ? state.submittedChallenges.size : 0;
  const isCompleted = passedQuizzes >= Math.max(1, Math.floor(totalQuizzes * 0.7));

  // Update Score Report Grid
  if (el.reportQuizzesCount) el.reportQuizzesCount.textContent = `${passedQuizzes} / ${totalQuizzes}`;
  if (el.reportAccuracy) el.reportAccuracy.textContent = `${accuracy}%`;
  if (el.reportChallengesCount) el.reportChallengesCount.textContent = `${challengeCount}`;
  if (el.reportStatus) {
    el.reportStatus.textContent = passedQuizzes >= totalQuizzes ? 'LULUS (PERFECT)' : (isCompleted ? 'LULUS' : 'PROGRES');
  }

  // Common Meta
  const studentName = state.student.name || 'Peserta Pembelajaran';
  const school = state.student.school || 'Sekolah Mitra UOB';
  const rombel = state.student.rombel ? ` · ${state.student.rombel}` : '';
  const level = state.student.level ? ` (${state.student.level})` : '';
  const fullSchoolText = `${school}${rombel}${level}`;

  const programName =
    state.student.level === 'SMA'
      ? 'Asynchronous Coding Exploration: Python for High School'
      : state.student.level === 'SMP'
      ? 'Asynchronous Coding Exploration: MIT App Inventor for Middle School'
      : 'Asynchronous Coding Exploration: Scratch Visual Coding for Primary School';

  const hash = Math.abs(hashString((state.student.email || 'user') + (state.student.school || 'uob'))).toString().padStart(6, '0').slice(0, 6);
  const serialNo = `MDS-2026-${state.student.level || 'GEN'}-${hash}`;

  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('id-ID', options);

  // Update Page 1: Certificate of Completion
  if (el.certStudentName) el.certStudentName.textContent = studentName;
  if (el.certStudentSchool) el.certStudentSchool.textContent = fullSchoolText;
  if (el.certProgramName) el.certProgramName.textContent = programName;
  if (el.certSerialNo) el.certSerialNo.textContent = serialNo;
  if (el.certDateText) el.certDateText.textContent = `Diterbitkan pada: ${formattedDate}`;

  // Update Page 2: Academic Transcript
  if (el.transcriptStudentName) el.transcriptStudentName.textContent = studentName;
  if (el.transcriptStudentSchool) el.transcriptStudentSchool.textContent = fullSchoolText;
  if (el.transcriptDate) el.transcriptDate.textContent = formattedDate;
  if (el.transcriptSerialRef) el.transcriptSerialRef.textContent = serialNo;
  if (el.transcriptStatus) {
    el.transcriptStatus.textContent = `${accuracy}% · ${passedQuizzes >= totalQuizzes ? 'LULUS (PERFECT)' : 'LULUS'}`;
  }

  // Populate Transcript Module Breakdown Table
  if (el.certTranscriptTbody) {
    el.certTranscriptTbody.innerHTML = '';
    state.courseData.forEach((step, idx) => {
      const qList = extractQuizzesFromStep(step);
      const stepQuizzesCompleted = qList.filter((q) => state.submittedQuizIds.has(q.id)).length;
      const isStepDone = qList.length === 0 || stepQuizzesCompleted === qList.length;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center; font-weight: 700;">${String(idx + 1).padStart(2, '0')}</td>
        <td><strong>${step.title || `Materi ${idx + 1}`}</strong></td>
        <td>${qList.length > 0 ? `${stepQuizzesCompleted}/${qList.length} Pop-up Kuis` : 'Materi Slide Interaktif'}</td>
        <td style="font-weight: 700; color: #092764;">${qList.length > 0 ? (isStepDone ? '100 / 100' : `${Math.round((stepQuizzesCompleted / qList.length) * 100)} / 100`) : '100 / 100'}</td>
        <td><span class="transcript-badge-done">${isStepDone ? '✓ Tuntas' : '⏳ Progres'}</span></td>
      `;
      el.certTranscriptTbody.appendChild(tr);
    });
  }

  el.certificateModal.showModal();
}

function setupCertificateModalEvents() {
  if (el.btnOpenCertificate) {
    el.btnOpenCertificate.addEventListener('click', openCertificateModal);
  }
  if (el.btnDropdownCert) {
    el.btnDropdownCert.addEventListener('click', () => {
      if (el.profileDropdown) el.profileDropdown.hidden = true;
      openCertificateModal();
    });
  }
  if (el.btnCloseCertModal) {
    el.btnCloseCertModal.addEventListener('click', () => {
      el.certificateModal.close();
    });
  }
  if (el.btnDismissCertificate) {
    el.btnDismissCertificate.addEventListener('click', () => {
      el.certificateModal.close();
    });
  }
  if (el.btnPrintCertificate) {
    el.btnPrintCertificate.addEventListener('click', () => {
      window.print();
    });
  }
}

