/**
 * UOB My Digital Space — Asynchronous Learning Platform Logic
 * Subproject 01: Interactive Player, Sandbox Container, Typo Suggestion, & Grade Auto-Detection
 */

import { LOGO_RUANGGURU, LOGO_UOB_MDS } from './assets/logos/logo-assets.js';

// Live Google Apps Script Web App Deployment URL (Account: rgcuob@gmail.com)
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwXvyynsPJ_wUU4KGfj0Z9B3Is0m00U1lUjVEn5lLs/exec';

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
  introPlaybackToken: 0,
  isIntroPlaying: false,
  videoMaxTimeWatched: 0,
  videoDuration: 0,
  videoWatchedToEnd: false,
  watchedStepIndices: new Set(),
  submittedChallenges: new Map(),
  quizAttempts: new Map(),
  quizScores: new Map(),
  unlockedStepIndex: 0,
  isRestoringProgress: false
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
  advisoryModal: document.querySelector('#advisory-modal'),
  btnDismissAdvisory: document.querySelector('#btn-dismiss-advisory'),
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
  tabModeSlide: document.querySelector('#tab-mode-slide') || document.querySelector('#tab-mode-sandbox'),
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

  // Slide Pembelajaran Container
  slideContainer: document.querySelector('#slide-container') || document.querySelector('#sandbox-container'),
  slideTitle: document.querySelector('#slide-title') || document.querySelector('#sandbox-title'),
  slideIframe: document.querySelector('#slide-iframe') || document.querySelector('#sandbox-iframe'),
  btnReloadSlide: document.querySelector('#btn-reload-slide') || document.querySelector('#btn-reload-sandbox'),
  btnFullscreenSlide: document.querySelector('#btn-fullscreen-slide') || document.querySelector('#btn-fullscreen-sandbox'),

  // Skeuomorphic In-App Alert Modal
  appAlertModal: document.querySelector('#app-alert-modal'),
  appAlertIcon: document.querySelector('#app-alert-icon'),
  appAlertTitle: document.querySelector('#app-alert-title'),
  appAlertMessage: document.querySelector('#app-alert-message'),
  btnCloseAppAlert: document.querySelector('#btn-close-app-alert'),

  // Quiz Switcher Strip
  quizSwitcherStrip: document.querySelector('#quiz-switcher-strip'),
  quizSummaryStatus: document.querySelector('#quiz-summary-status'),
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
  modalQuizIcon: document.querySelector('#modal-quiz-icon'),
  modalQuizAttemptsBadge: document.querySelector('#modal-quiz-attempts-badge'),
  modalQuizNumber: document.querySelector('#modal-quiz-number'),
  modalQuizTitle: document.querySelector('#modal-quiz-title'),
  modalQuizQuestion: document.querySelector('#modal-quiz-question'),
  modalQuizOptions: document.querySelector('#modal-quiz-options'),
  quizFeedbackBox: document.querySelector('#quiz-feedback-box'),
  feedbackIcon: document.querySelector('#feedback-icon'),
  feedbackTitle: document.querySelector('#feedback-title'),
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
  btnBrowserPrint: document.querySelector('#btn-browser-print'),
  btnDismissCertificate: document.querySelector('#btn-dismiss-certificate'),
  certAdminWatermark: document.querySelector('#cert-admin-watermark'),
  transcriptAdminWatermark: document.querySelector('#transcript-admin-watermark'),
  certLogoRg: document.querySelector('#cert-logo-rg'),
  certLogoUob: document.querySelector('#cert-logo-uob'),
  transcriptLogoRg: document.querySelector('#transcript-logo-rg'),
  transcriptLogoUob: document.querySelector('#transcript-logo-uob'),
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
 * Normalisasi format jawaban kuis agar kompatibel dengan 'A/B/C/D', angka, boolean, dan teks opsi
 */
function normalizeQuizAnswer(rawAnswer, options) {
  if (rawAnswer === null || rawAnswer === undefined) return 0;
  if (typeof rawAnswer === 'number') return rawAnswer;
  if (typeof rawAnswer === 'boolean') return rawAnswer ? 0 : 1;
  const str = String(rawAnswer).trim().toUpperCase();
  if (str === 'A') return 0;
  if (str === 'B') return 1;
  if (str === 'C') return 2;
  if (str === 'D') return 3;
  if (str === 'TRUE' || str === 'BENAR') return 0;
  if (str === 'FALSE' || str === 'SALAH') return 1;
  const num = parseInt(str, 10);
  if (!isNaN(num) && String(num) === str) return num;
  if (Array.isArray(options)) {
    const matchIdx = options.findIndex((opt) => {
      const cleanOpt = String(opt).replace(/^[A-D]\.\s*/i, '').trim().toLowerCase();
      const cleanAns = String(rawAnswer).replace(/^[A-D]\.\s*/i, '').trim().toLowerCase();
      return cleanOpt === cleanAns;
    });
    if (matchIdx !== -1) return matchIdx;
  }
  return 0;
}

/**
 * Skeuomorphic In-App Alert Modal (Menggantikan window.alert)
 */
function showAppAlert({
  title = 'Pemberitahuan',
  message = '',
  icon = 'ℹ️',
  buttonText = 'Mengerti',
  cancelText = null,
  onConfirm = null,
  onCancel = null
}) {
  if (el.appAlertIcon) el.appAlertIcon.textContent = icon;
  if (el.appAlertTitle) el.appAlertTitle.textContent = title;
  if (el.appAlertMessage) el.appAlertMessage.textContent = message;

  const actionsContainer = document.querySelector('#app-alert-actions');
  if (actionsContainer) {
    actionsContainer.innerHTML = '';

    if (cancelText) {
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'app-alert-secondary-btn';
      cancelBtn.textContent = cancelText;
      cancelBtn.onclick = () => {
        if (el.appAlertModal && typeof el.appAlertModal.close === 'function') {
          el.appAlertModal.close();
        }
        if (typeof onCancel === 'function') onCancel();
      };
      actionsContainer.appendChild(cancelBtn);
    }

    const primaryBtn = document.createElement('button');
    primaryBtn.type = 'button';
    primaryBtn.className = 'app-alert-primary-btn';
    primaryBtn.id = 'btn-close-app-alert';
    primaryBtn.textContent = buttonText;
    primaryBtn.onclick = () => {
      if (el.appAlertModal && typeof el.appAlertModal.close === 'function') {
        el.appAlertModal.close();
      }
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };
    actionsContainer.appendChild(primaryBtn);
  }

  if (el.appAlertModal) {
    if (el.appAlertModal.open) {
      try { el.appAlertModal.close(); } catch (e) {}
    }
    if (typeof el.appAlertModal.showModal === 'function') {
      try {
        el.appAlertModal.showModal();
        return;
      } catch (e) {}
    }
  }

  // Fallback: Custom inline toast if dialog API fails, no native window.alert
  let toast = document.querySelector('#app-alert-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-alert-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#092764;color:#fff;padding:14px 24px;border-radius:12px;border:2px solid #ffd93d;box-shadow:0 8px 24px rgba(0,0,0,0.4);z-index:999999;font-family:sans-serif;font-weight:700;display:flex;align-items:center;gap:12px;max-width:90vw;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.style.display = 'flex';
  setTimeout(() => { toast.style.display = 'none'; if (typeof onConfirm === 'function') onConfirm(); }, 4000);
}

/**
 * Lightweight Toast Notification
 */
function showToast(message) {
  let toast = document.querySelector('#app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#092764;color:#fff;padding:12px 24px;border-radius:10px;border:1.5px solid #38bdf8;box-shadow:0 8px 24px rgba(0,0,0,0.35);z-index:999999;font-family:var(--font-body, sans-serif);font-size:0.85rem;font-weight:600;display:flex;align-items:center;gap:10px;max-width:90vw;transition:opacity 0.3s ease;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'flex';
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 3500);
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

function syncProgressToBackend(quizId, isCorrect, score, activity = {}) {
  if (!state.student || !state.student.email || !state.student.school) return;
  try {
    fetch(APP_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: quizId ? 'submit_quiz' : 'save_activity',
        email: state.student.email,
        name: state.student.name,
        school: state.student.school,
        level: state.student.level,
        quizId: quizId || '',
        isCorrect: Boolean(isCorrect),
        score: score || 0,
        lastStepId: activity.lastStepId || (state.courseData[state.currentStepIndex] || {}).id || '',
        watchedStepIds: Array.isArray(activity.watchedStepIds)
          ? activity.watchedStepIds
          : [...state.watchedStepIndices].map((i) => state.courseData[i]?.id).filter(Boolean)
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
      name: matchedStudent.name || 'Peserta Pembelajaran',
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


function recomputeUnlockedStepIndex() {
  if (state.student.isAdmin) {
    state.unlockedStepIndex = 9999;
    return;
  }
  let unlocked = 0;
  for (let i = 0; i < state.courseData.length; i++) {
    const step = state.courseData[i];
    const qList = extractQuizzesFromStep(step);
    const allQDone = qList.length === 0 || qList.every((q) => state.submittedQuizIds.has(q.id));
    const isWatched = step.type === 'slide' || state.watchedStepIndices.has(i);
    if (allQDone && isWatched) unlocked = i + 1;
    else break;
  }
  state.unlockedStepIndex = unlocked;
}

function restoreServerActivity(progressResponse) {
  const data = progressResponse?.data || {};
  const progress = progressResponse?.progress || {};
  const watchedIds = Array.isArray(data.watchedStepIds)
    ? data.watchedStepIds
    : String(progress['_Watched Steps'] || '').split(',').map((v) => v.trim()).filter(Boolean);
  watchedIds.forEach((id) => {
    const index = state.courseData.findIndex((step) => step.id === id);
    if (index >= 0) state.watchedStepIndices.add(index);
  });
  const lastStepId = data.lastStepId || progress['_Last Step'] || '';
  recomputeUnlockedStepIndex();
  if (lastStepId) {
    const lastIndex = state.courseData.findIndex((step) => step.id === lastStepId);
    if (lastIndex >= 0 && lastIndex <= state.unlockedStepIndex) {
      state.currentStepIndex = lastIndex;
      goToStep(lastIndex);
    }
  }
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
  state.isRestoringProgress = true;
  const storageKey = `uob_progress_${state.student.email}_${state.student.school}`;
  let savedLocalLastStepId = '';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        state.submittedQuizIds = new Set(parsed);
      }
    }
    savedLocalLastStepId = localStorage.getItem(`uob_last_step_${state.student.email}_${state.student.school}`) || '';
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // Restore Quiz Attempts and Scores
  try {
    const savedAtt = localStorage.getItem(`uob_quiz_attempts_${state.student.email}_${state.student.school}`);
    if (savedAtt) {
      const parsed = JSON.parse(savedAtt);
      if (Array.isArray(parsed)) {
        state.quizAttempts = new Map(parsed);
      }
    }
    const savedScores = localStorage.getItem(`uob_quiz_scores_${state.student.email}_${state.student.school}`);
    if (savedScores) {
      const parsed = JSON.parse(savedScores);
      if (Array.isArray(parsed)) {
        state.quizScores = new Map(parsed);
      }
    }
  } catch (e) {
    console.warn('LocalStorage quiz attempts/scores read error:', e);
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

  // Pulihkan riwayat tontonan materi video yang tuntas
  try {
    const savedWatched = localStorage.getItem(`uob_watched_${state.student.email}_${state.student.school}`);
    if (savedWatched) {
      const parsedWatched = JSON.parse(savedWatched);
      if (Array.isArray(parsedWatched)) {
        state.watchedStepIndices = new Set(parsedWatched.map(Number));
      }
    }
  } catch (e) {}

  // Load Kurikulum sesuai jenjang yang terdeteksi
  try {
    await loadCourseData(state.student.dataFile);
    recomputeUnlockedStepIndex();

  } catch (err) {
    console.error('Failed to load course dataset:', err);
    showAppAlert({
      title: 'Gagal Memuat Kurikulum',
      message: 'Tidak dapat mengunduh berkas kurikulum materi. Silakan periksa koneksi internet Anda atau klik tombol di bawah untuk memuat ulang.',
      icon: '⚠️',
      buttonText: 'Muat Ulang Halaman',
      onConfirm: () => window.location.reload()
    });
    return;
  }

  buildSidebarModuleList();
  const localLastIndex = state.courseData.findIndex((step) => step.id === savedLocalLastStepId);
  goToStep(localLastIndex >= 0 && localLastIndex <= state.unlockedStepIndex ? localLastIndex : 0);

  // Server-First SSOT Sync from Google Sheets (Two-Way Safe Sync)
  try {
    const getUrl = `${APP_SCRIPT_URL}?action=get_progress&email=${encodeURIComponent(state.student.email)}&school=${encodeURIComponent(state.student.school)}&level=${encodeURIComponent(state.student.level)}`;
    fetch(getUrl)
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success) {
          let serverQuizzes = [];
          if (res.data && Array.isArray(res.data.submittedQuizIds)) {
            serverQuizzes = res.data.submittedQuizIds;
          } else if (res.progress && typeof res.progress === 'object') {
            Object.keys(res.progress).forEach((headerKey) => {
              const val = res.progress[headerKey];
              if (val !== '' && val !== null && val !== undefined) {
                const cleanQuizId = headerKey.replace(/\s*\[.*?\]\s*$/, '').trim();
                if (cleanQuizId) serverQuizzes.push(cleanQuizId);
              }
            });
          }

          if (serverQuizzes.length > 0) {
            serverQuizzes.forEach((id) => state.submittedQuizIds.add(id));
            try {
              localStorage.setItem(storageKey, JSON.stringify([...state.submittedQuizIds]));
            } catch (e) {}
          }
          if (res.data || res.progress) {
            restoreServerActivity(res);
          }
          if (res.resetByAdmin === true) {
            console.warn('[SSOT Sync] Data di-reset oleh admin. Mereset progres lokal...');
            state.submittedQuizIds.clear();
            localStorage.removeItem(storageKey);
            localStorage.removeItem(`uob_last_step_${state.student.email}_${state.student.school}`);
            state.currentStepIndex = 0;
            goToStep(0);
          }
          state.isRestoringProgress = false;
          renderQuizSwitcherStrip();
          checkProgressGate();
        } else if (res && (res.studentFound === false || res.notFound)) {
          state.isRestoringProgress = false;
          console.warn('[SSOT Sync] Data siswa belum tersimpan di spreadsheet.');
        }
      })
      .catch((err) => {
        state.isRestoringProgress = false;
        console.log('Backend sync offline/deferred:', err);
      });
  } catch (e) {
    state.isRestoringProgress = false;
  }

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
    state.quizAttempts.clear();
    state.quizScores.clear();
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
        showAppAlert({
          title: 'Materi Masih Terkunci',
          message: `Materi ${index + 1} belum terbuka. Tonton video pembelajaran dan selesaikan semua pop-up kuis pada Materi ${state.unlockedStepIndex + 1} terlebih dahulu untuk membuka materi ini!`,
          icon: '🔒',
          buttonText: '▶ Lanjutkan Nonton Video',
          cancelText: 'Tutup',
          onConfirm: () => {
            goToStep(state.unlockedStepIndex);
            if (state.ytPlayer && state.ytPlayer.playVideo && el.customThumbnail && el.customThumbnail.style.display === 'none') {
              state.ytPlayer.playVideo();
            }
          }
        });
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
      showAppAlert({
        title: 'Sertifikat & Rekap Nilai Terkunci',
        message: 'Selesaikan seluruh video pembelajaran dan kuis dari Materi 01 hingga akhir untuk membuka dan mencetak Sertifikat Kelulusan 2 Halaman A4 beserta Rekap Nilai kamu.',
        icon: '🎓',
        buttonText: 'Lanjutkan Pembelajaran',
        onConfirm: () => {
          goToStep(state.unlockedStepIndex);
        }
      });
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
        el.mobileStepSelect.value = state.currentStepIndex;
        showAppAlert({
          title: 'Sertifikat & Rekap Nilai Terkunci',
          message: 'Selesaikan seluruh video pembelajaran dan kuis dari awal hingga akhir untuk membuka Sertifikat Kelulusan 2 Halaman A4.',
          icon: '🎓',
          buttonText: 'Lanjutkan Pembelajaran',
          onConfirm: () => {
            goToStep(state.unlockedStepIndex);
          }
        });
      }
      return;
    }
    const idx = Number(e.target.value);
    if (!isAdmin && idx > state.unlockedStepIndex) {
      el.mobileStepSelect.value = state.currentStepIndex;
      showAppAlert({
        title: 'Materi Masih Terkunci',
        message: `Materi ${idx + 1} belum terbuka. Selesaikan materi ${state.unlockedStepIndex + 1} terlebih dahulu (tonton video & kuis).`,
        icon: '🔒',
        buttonText: '▶ Lanjutkan Nonton Video',
        cancelText: 'Tutup',
        onConfirm: () => {
          goToStep(state.unlockedStepIndex);
        }
      });
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
    showAppAlert({
      title: 'Materi Masih Terkunci',
      message: `Materi ${index + 1} belum terbuka. Selesaikan materi ${state.unlockedStepIndex + 1} terlebih dahulu.`,
      icon: '🔒',
      buttonText: '▶ Lanjutkan Nonton Video',
      onConfirm: () => {
        goToStep(state.unlockedStepIndex);
      }
    });
    return;
  }

  state.currentStepIndex = index;
  const currentStepId = state.courseData[index]?.id || `step-${index}`;
  if (state.isLoggedIn && state.student?.email && !state.isRestoringProgress) {
    try { localStorage.setItem(`uob_last_step_${state.student.email}_${state.student.school}`, currentStepId); } catch (e) {}
    syncProgressToBackend('', true, 0, {
      lastStepId: currentStepId,
      watchedStepIds: [...state.watchedStepIndices].map((i) => state.courseData[i]?.id).filter(Boolean)
    });
  }
  state.videoMaxTimeWatched = 0;
  state.videoDuration = 0;
  state.videoWatchedToEnd = false;
  state.isIntroPlaying = false;
  state.introPlaybackToken += 1;
  if (el.introVideo) {
    try {
      el.introVideo.pause();
    } catch (e) {}
    el.introVideo.currentTime = 0;
    el.introVideo.style.display = 'none';
    el.introVideo.onended = null;
    el.introVideo.onpause = null;
    el.introVideo.onseeking = null;
  }
  if (el.videoControls) el.videoControls.style.display = 'flex';
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

  // Setup Slide Iframe Path (Hanya jika modul memang memiliki slideUrl)
  const slidePath = step.slideUrl || '';
  if (el.slideIframe) {
    el.slideIframe.src = slidePath;
  }
  if (el.slideTitle) {
    el.slideTitle.textContent = step.title;
  }

  // Media Mode: Default to Video if type is video, otherwise Slide
  if (step.type === 'slide') {
    el.videoFrame.classList.add('slide-mode');
    activateMediaMode('slide');
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
            let rawAns = q.answer !== undefined ? q.answer : (q.correct !== undefined ? q.correct : (q.correctIndex !== undefined ? q.correctIndex : 0));
            let opts = Array.isArray(q.options) && q.options.length > 0 ? q.options : (Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : null);
            if (!opts) {
              const ansStr = String(rawAns).trim();
              if (rawAns === true || rawAns === false || ['true', 'false', 'benar', 'salah'].includes(ansStr.toLowerCase())) {
                opts = ['Benar', 'Salah'];
                rawAns = (rawAns === true || ['true', 'benar'].includes(ansStr.toLowerCase())) ? 0 : 1;
              } else if (/^\d+$/.test(ansStr)) {
                const val = parseInt(ansStr, 10);
                opts = [String(Math.max(0, val - 1)), String(val), String(val + 1), String(val + 2)];
                rawAns = 1;
              } else if (ansStr.startsWith('.')) {
                opts = [ansStr, '.upper()', '.replace()', '.find()'];
                rawAns = 0;
              } else {
                opts = [ansStr, 'Pilihan Lain'];
                rawAns = 0;
              }
            }
            const normAns = normalizeQuizAnswer(rawAns, opts);
            list.push({
              id: q.id || `q-${step.id || state.currentStepIndex}-${idx}-${qIdx}`,
              title: q.title || `Kuis ${list.length + 1}`,
              question: q.question || q.title || 'Pertanyaan Kuis',
              options: opts,
              answer: rawAns,
              correctIndex: normAns,
              explanation: q.explanation || 'Penjelasan tepat sesuai materi.',
              time: item.time || 30
            });
          }
        });
      } else if (item.question) {
        let rawAns = item.answer !== undefined ? item.answer : (item.correct !== undefined ? item.correct : (item.correctIndex !== undefined ? item.correctIndex : 0));
        let opts = Array.isArray(item.options) && item.options.length > 0 ? item.options : (Array.isArray(item.choices) && item.choices.length > 0 ? item.choices : null);
        if (!opts) {
          opts = ['Pilihan A', 'Pilihan B'];
        }
        const normAns = normalizeQuizAnswer(rawAns, opts);
        list.push({
          id: item.id || `q-${step.id || state.currentStepIndex}-${idx}`,
          title: item.title || `Kuis ${list.length + 1}`,
          question: item.question,
          options: opts,
          answer: rawAns,
          correctIndex: normAns,
          explanation: item.explanation || 'Penjelasan tepat.',
          time: item.time || 30
        });
      }
    });
    if (list.length > 0) return list;
  }

  if (step.quiz) {
    let rawAns = step.quiz.answer !== undefined ? step.quiz.answer : (step.quiz.correct !== undefined ? step.quiz.correct : (step.quiz.correctIndex !== undefined ? step.quiz.correctIndex : 0));
    let opts = Array.isArray(step.quiz.options) && step.quiz.options.length > 0 ? step.quiz.options : (Array.isArray(step.quiz.choices) && step.quiz.choices.length > 0 ? step.quiz.choices : null);
    if (!opts) opts = ['Pilihan A', 'Pilihan B'];
    const normAns = normalizeQuizAnswer(rawAns, opts);
    return [{
      id: step.quiz.id || `quiz-${state.currentStepIndex}-0`,
      title: 'Cek Pemahaman',
      question: step.quiz.question || 'Pertanyaan Kuis',
      options: opts,
      answer: rawAns,
      correctIndex: normAns,
      explanation: step.quiz.explanation || 'Penjelasan kuis.',
      time: step.quiz.time || 30
    }];
  }

  return [];
}


// ==================== 6. MEDIA SWITCHER (VIDEO vs SLIDE) ====================
function setupMediaSwitcherEvents() {
  if (el.tabModeVideo) {
    el.tabModeVideo.addEventListener('click', () => {
      activateMediaMode('video');
    });
  }

  const slideBtn = el.tabModeSlide || el.tabModeSandbox;
  if (slideBtn) {
    slideBtn.addEventListener('click', () => {
      activateMediaMode('slide');
    });
  }

  // Slide Toolbar Buttons
  const reloadBtn = el.btnReloadSlide || el.btnReloadSandbox;
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      const iframe = el.slideIframe || el.sandboxIframe;
      if (iframe) iframe.src = iframe.src;
    });
  }

  const fullscreenBtn = el.btnFullscreenSlide || el.btnFullscreenSandbox;
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        const target = el.slideContainer || el.sandboxContainer || el.videoFrame;
        if (target && target.requestFullscreen) {
          target.requestFullscreen().catch(() => {
            if (el.videoFrame && el.videoFrame.requestFullscreen) el.videoFrame.requestFullscreen().catch(() => {});
          });
        } else if (target && target.webkitRequestFullscreen) {
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
}

function activateMediaMode(mode) {
  state.activeMediaMode = mode;
  const slideTab = el.tabModeSlide || el.tabModeSandbox;
  const slideBox = el.slideContainer || el.sandboxContainer;

  if (mode === 'slide' || mode === 'sandbox') {
    if (slideTab) slideTab.classList.add('active');
    if (el.tabModeVideo) el.tabModeVideo.classList.remove('active');
    if (el.videoFrame) el.videoFrame.classList.add('slide-mode');
    if (slideBox) slideBox.style.display = 'flex';
    if (el.videoControls) el.videoControls.style.display = 'none';
    if (el.customThumbnail) el.customThumbnail.style.display = 'none';

    // Pause Video jika sedang main
    if (state.ytPlayer && state.isPlaying) {
      state.ytPlayer.pauseVideo();
    }
  } else {
    if (el.tabModeVideo) el.tabModeVideo.classList.add('active');
    if (slideTab) slideTab.classList.remove('active');
    if (el.videoFrame) el.videoFrame.classList.remove('slide-mode');
    if (slideBox) slideBox.style.display = 'none';
    if (el.videoControls) el.videoControls.style.display = 'flex';
    if (!state.hasStartedVideo && el.customThumbnail) {
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

  const startSeconds = step.startSeconds || 0;
  const endSeconds = step.endSeconds || 0;
  const initialSpan = (endSeconds > startSeconds) ? (endSeconds - startSeconds) : 0;
  el.videoTimeDisplay.textContent = initialSpan > 0 ? `0:00 / ${formatTime(initialSpan)}` : '0:00 / 0:00';

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

  initYouTubePlayer(vidId, startSeconds, endSeconds);
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
        // Never let YouTube start while the lesson is only being rendered.
        // Playback is allowed only from the explicit Play action (or after bumper completion).
        try { event.target.pauseVideo(); } catch (e) {}
        state.isPlayerReady = true;
        state.isPlaying = false;
        state.videoDuration = event.target.getDuration() || 0;
        if (startSeconds) event.target.seekTo(startSeconds, true);
        const effectiveEnd = (endSeconds && endSeconds > 0) ? endSeconds : state.videoDuration;
        const segmentSpan = Math.max(1, effectiveEnd - startSeconds);
        el.videoTimeDisplay.textContent = `0:00 / ${formatTime(segmentSpan)}`;
        el.videoSeekBar.value = 0;
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          // A player event can arrive during iframe hydration. Reject it unless
          // the learner explicitly started the lesson after any bumper.
          if (!state.hasStartedVideo || state.isIntroPlaying) {
            try { event.target.pauseVideo(); } catch (e) {}
            state.isPlaying = false;
            el.btnPlayPause.textContent = '▶';
            return;
          }
          state.isPlaying = true;
          el.btnPlayPause.textContent = '⏸';
          startPlayerTicker(endSeconds);
        } else if (event.data === YT.PlayerState.ENDED) {
          state.isPlaying = false;
          markCurrentStepVideoWatched();
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
  const currentStep = state.courseData[state.currentStepIndex];
  const startSeconds = (currentStep && currentStep.startSeconds > 0) ? currentStep.startSeconds : 0;

  state.playerCheckTimer = setInterval(() => {
    if (!state.ytPlayer || !state.ytPlayer.getCurrentTime) return;
    const curTime = state.ytPlayer.getCurrentTime();
    const duration = state.ytPlayer.getDuration() || 1;

    state.videoDuration = duration;
    const prevMax = state.videoMaxTimeWatched || 0;
    state.videoMaxTimeWatched = Math.max(prevMax, curTime);

    const effectiveEnd = (endSeconds && endSeconds > 0) ? endSeconds : duration;
    const segmentSpan = Math.max(1, effectiveEnd - startSeconds);
    const threshold = Math.max(1, effectiveEnd - 10);

    // Cek apakah mencapai threshold 10 detik terakhir segmen video
    if (state.videoMaxTimeWatched >= threshold) {
      markCurrentStepVideoWatched();
      if (prevMax < threshold) {
        checkProgressGate();
        renderQuizSwitcherStrip();
      }
    }

    // Waktu & seekbar dihitung relatif terhadap durasi segmen materi (Bukan raw full YouTube)
    const elapsedInSegment = Math.max(0, Math.min(curTime - startSeconds, segmentSpan));
    const progressPercent = Math.max(0, Math.min((elapsedInSegment / segmentSpan) * 100, 100));

    el.videoSeekBar.value = progressPercent;
    el.videoTimeDisplay.textContent = `${formatTime(elapsedInSegment)} / ${formatTime(segmentSpan)}`;

    if (endSeconds > 0 && curTime >= endSeconds) {
      state.ytPlayer.pauseVideo();
      markCurrentStepVideoWatched();
      checkProgressGate();
      renderQuizSwitcherStrip();
    }

    // Trigger Pop-up Quiz bila waktu tiba (Mendukung timestamp absolut maupun relatif terhadap segmen)
    state.activeStepQuizzes.forEach((q, idx) => {
      if (!state.submittedQuizIds.has(q.id)) {
        const targetTriggerTime = (startSeconds > 0 && q.time < startSeconds) ? (startSeconds + q.time) : q.time;
        if (Math.abs(curTime - targetTriggerTime) < 1.4) {
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
function getIntroMode(step) {
  if (!step) return 'none';
  if (step.introMode === 'bumper' || step.introMode === 'embedded' || step.introMode === 'none') {
    return step.introMode;
  }
  if (step.embeddedIntro === true) return 'embedded';
  // No explicit bumper instruction means the source video owns its intro.
  return 'embedded';
}

function shouldPlayIntroBumper(step) {
  return Boolean(step && step.type !== 'slide' && getIntroMode(step) === 'bumper');
}

/** Play the external 4-second bumper as a locked, non-interactive pre-roll. */
function playIntroBumper(onFinish) {
  const step = state.courseData[state.currentStepIndex];
  const stepId = step && step.id ? step.id : `step-${state.currentStepIndex}`;
  const token = ++state.introPlaybackToken;
  if (!shouldPlayIntroBumper(step) || !el.introVideo) {
    if (onFinish) onFinish();
    return;
  }

  el.customThumbnail.style.display = 'none';
  el.introVideo.style.display = 'block';
  el.introVideo.controls = false;
  el.introVideo.currentTime = 0;
  state.isIntroPlaying = true;
  state.introPlayedSteps.delete(stepId);
  el.btnPlayPause.textContent = '⏳';
  if (el.videoControls) el.videoControls.style.display = 'none';
  if (el.videoFrame) el.videoFrame.classList.add('intro-playing');

  let finished = false;
  const isCurrentPlayback = () => (
    !finished && token === state.introPlaybackToken &&
    state.courseData[state.currentStepIndex] === step
  );
  const finishIntro = () => {
    if (finished) return;
    finished = true;
    if (token !== state.introPlaybackToken) return;
    state.isIntroPlaying = false;
    state.introPlayedSteps.add(stepId);
    el.introVideo.style.display = 'none';
    el.introVideo.onended = null;
    el.introVideo.onpause = null;
    el.introVideo.onseeking = null;
    if (el.videoControls) el.videoControls.style.display = 'flex';
    if (el.videoFrame) el.videoFrame.classList.remove('intro-playing');
    el.btnPlayPause.textContent = '▶';
    if (onFinish) onFinish();
  };

  // A bumper is not a learner-controlled media surface.
  el.introVideo.onpause = () => {
    if (isCurrentPlayback()) el.introVideo.play().catch(() => {});
  };
  el.introVideo.onseeking = () => {
    if (isCurrentPlayback()) el.introVideo.currentTime = 0;
  };
  el.introVideo.oncontextmenu = (event) => event.preventDefault();
  el.introVideo.onended = finishIntro;
  el.introVideo.onerror = (err) => {
    console.warn('Intro bumper playback error:', err);
    // Do not strand the learner if the optional external bumper cannot load.
    finishIntro();
  };

  const playPromise = el.introVideo.play();
  if (playPromise !== undefined) playPromise.catch((err) => {
    console.warn('Intro bumper play exception:', err);
    finishIntro();
  });
}
function setupPlayerControlEvents() {
  const togglePlay = () => {
    const step = state.courseData[state.currentStepIndex];
    const isVideoStep = Boolean(step && step.type !== 'slide');

    // Bumper bukan media yang bisa dikontrol siswa.
    if (state.isIntroPlaying) return;

    // Hanya video yang secara eksplisit diberi introMode:'bumper' memakai bumper eksternal.
    const stepId = step && step.id ? step.id : `step-${state.currentStepIndex}`;
    if (isVideoStep && shouldPlayIntroBumper(step) && !state.introPlayedSteps.has(stepId)) {
      playIntroBumper(() => {
        // Strict order: bumper ended → reveal/start YouTube.
        state.hasStartedVideo = true;
        el.customThumbnail.style.display = 'none';
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
    const currentStep = state.courseData[state.currentStepIndex];
    const duration = state.ytPlayer.getDuration();
    const seekPercent = Number(e.target.value);
    const start = (currentStep && currentStep.startSeconds > 0) ? currentStep.startSeconds : 0;
    const end = (currentStep && currentStep.endSeconds > 0) ? currentStep.endSeconds : duration;
    const segmentSpan = Math.max(1, end - start);
    let seekToTime = start + (seekPercent / 100) * segmentSpan;
    if (seekToTime < start) seekToTime = start;
    if (seekToTime > end) seekToTime = end;
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

  const currentStep = state.courseData[state.currentStepIndex];
  const start = (currentStep && currentStep.startSeconds > 0) ? currentStep.startSeconds : 0;
  const end = (currentStep && currentStep.endSeconds > 0) ? currentStep.endSeconds : 0;

  bookmarks.forEach((bm) => {
    const btn = document.createElement('button');
    btn.className = 'bookmark-btn';
    btn.type = 'button';

    const rawTime = bm.time || 0;
    const relTime = (start > 0 && rawTime >= start) ? (rawTime - start) : rawTime;

    btn.innerHTML = `<span class="bookmark-time">${formatTime(relTime)}</span> <span>${bm.label || 'Bookmark'}</span>`;
    btn.addEventListener('click', () => {
      activateMediaMode('video');
      if (el.customThumbnail.style.display !== 'none') {
        el.customThumbnail.style.display = 'none';
      }
      if (state.ytPlayer && state.ytPlayer.seekTo) {
        let targetTime = (start > 0 && rawTime < start) ? (start + rawTime) : rawTime;
        if (start > 0 && targetTime < start) targetTime = start;
        if (end > 0 && targetTime > end) targetTime = end;
        state.hasStartedVideo = true;
        state.ytPlayer.seekTo(targetTime, true);
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

/**
 * Menandai video modul saat ini telah tuntas ditonton dan menyimpannya secara persisten
 */
function markCurrentStepVideoWatched() {
  state.videoWatchedToEnd = true;
  state.watchedStepIndices.add(state.currentStepIndex);
  if (state.student && state.student.email) {
    try {
      localStorage.setItem(`uob_watched_${state.student.email}_${state.student.school}`, JSON.stringify([...state.watchedStepIndices]));
    } catch (e) {}
    syncProgressToBackend('', true, 0, {
      lastStepId: state.courseData[state.currentStepIndex]?.id || '',
      watchedStepIds: [...state.watchedStepIndices].map((i) => state.courseData[i]?.id).filter(Boolean)
    });
  }
}

/**
 * Memeriksa apakah video modul saat ini telah tuntas ditonton hingga 10 detik terakhir segmen
 */
function isCurrentStepVideoWatchedEnough() {
  const step = state.courseData[state.currentStepIndex];
  if (!step || step.type === 'slide') return true;
  if (state.videoWatchedToEnd || state.watchedStepIndices.has(state.currentStepIndex)) return true;
  const targetEnd = (step.endSeconds && step.endSeconds > 0) ? step.endSeconds : state.videoDuration;
  return targetEnd > 0 && (state.videoMaxTimeWatched >= Math.max(1, targetEnd - 10));
}

// ==================== 8. EXACT LEGACY BELOW-VIDEO CARDS & READING ====================
function renderLegacyCards(step, index) {
  // Loot Box Summary Card
  if (el.summaryHeadingIcon) el.summaryHeadingIcon.textContent = String(index + 1).padStart(2, '0');
  if (el.summaryCardTitle) el.summaryCardTitle.textContent = step.lootboxTitle || 'Loot Box Hari Ini 🎁';

  const defaultTakeaways = [
    `<strong>Program itu pintar!</strong> Nggak cuma jalan lurus, komputer mengikuti alur logika secara berurutan.`,
    `<strong>Kayak di dunia nyata.</strong> Logika pemrograman meniru bagaimana kita membuat keputusan setiap hari.`,
    `<strong>Jawabannya pasti.</strong> Setiap kondisi menghasilkan Benar (True) atau Salah (False).`,
    `<strong>Praktik kunci utama.</strong> Semakin sering mencoba dan mengutak-atik kode, semakin terbiasa!`
  ];

  const takeaways = Array.isArray(step.takeaways) && step.takeaways.length > 0 ? step.takeaways : defaultTakeaways;
  if (el.takeawayList) el.takeawayList.innerHTML = takeaways.map((t) => `<li>${t}</li>`).join('');

  // Focus Card (Cheat Sheet Emas Pastel)
  if (el.focusCardTitle) el.focusCardTitle.textContent = step.cheatsheetTitle || 'Kalo bener, gaskeun!';
  if (el.focusCardDesc) el.focusCardDesc.textContent = step.cheatsheetDesc || 'Coba ingat apa konsep logika penting yang baru saja kamu pelajari?';
  if (el.focusCardCode) el.focusCardCode.innerHTML = step.cheatsheetCode || `<span class="keyword">print</span>(<span class="string">"Semangat Belajar Coding!"</span>)`;
}

function renderReadingAccordion(step, index) {
  if (el.readingHeaderLabel) el.readingHeaderLabel.textContent = `Materi Bacaan ${String(index + 1).padStart(2, '0')}`;
  if (el.readingHeaderTitle) el.readingHeaderTitle.textContent = step.readingTitle || step.title;
  if (el.readingHeaderDesc) el.readingHeaderDesc.textContent = step.readingDesc || 'Biar makin paham dan mantap, baca rangkuman materi ini setelah nonton video atau menyimak slide ya!';

  // Concept Grid Cards (A, B, C)
  const defaultConcepts = [
    { num: 'A', title: 'Kode itu Nggak Kaku', desc: 'Bikin program kamu bisa memilih apa yang ingin dilakukan sesuai input pengguna.' },
    { num: 'B', title: 'Kondisi = Memberi Pertanyaan', desc: 'Misalnya: "Apakah saldo cukup?", "Apakah tombol sudah ditekan?".' },
    { num: 'C', title: 'Pasti dan Terukur', desc: 'Hasil evaluasi logika komputer hanya berupa True (Benar) atau False (Salah).' }
  ];

  const concepts = Array.isArray(step.concepts) && step.concepts.length > 0 ? step.concepts : defaultConcepts;
  if (el.readingConceptGrid) {
    el.readingConceptGrid.innerHTML = concepts.map((c) => `
      <article class="concept-card">
        <span class="concept-number">${c.num}</span>
        <h4>${c.title}</h4>
        <p>${c.desc}</p>
      </article>
    `).join('');
  }

  // Reading Section Code & Note
  if (el.readingSectionTitle) el.readingSectionTitle.textContent = step.sectionTitle || 'Dari Dunia Nyata ke Dunia Kode';
  if (el.readingSectionCode) el.readingSectionCode.textContent = step.sectionCode || `# Komputer mengecek syarat sebelum menjalankan aksi\nsaldo = 50000\nharga = 25000\n\nif saldo >= harga:\n    print("Transaksi Berhasil!")`;
  if (el.readingSectionNote) el.readingSectionNote.innerHTML = step.sectionNote || `<strong>Intinya:</strong> Kondisi itu seperti satpam pintu. Kalau syarat terpenuhi (True), pintu dibuka!`;
}

// ==================== 9. BENTO QUIZ TRACKER & MODAL ====================
function updateQuizAttemptsBadge(quizId, isSubmitted, score) {
  if (!el.modalQuizAttemptsBadge) return;
  const attempts = state.quizAttempts.get(quizId) || 0;
  const finalScore = score !== undefined && score !== null ? score : state.quizScores.get(quizId);

  el.modalQuizAttemptsBadge.className = 'quiz-attempts-badge';

  if (isSubmitted) {
    if (finalScore === 0 || attempts >= 3) {
      el.modalQuizAttemptsBadge.classList.add('danger');
      el.modalQuizAttemptsBadge.textContent = '⚠️ Kesempatan Habis · Nilai: 0';
      if (el.modalQuizIcon) el.modalQuizIcon.textContent = '🤖';
    } else {
      el.modalQuizAttemptsBadge.textContent = '✓ Selesai · Nilai: 100';
      if (el.modalQuizIcon) el.modalQuizIcon.textContent = '🌟';
    }
  } else {
    if (attempts === 0) {
      el.modalQuizAttemptsBadge.textContent = '🎯 Kesempatan: 3 / 3';
      if (el.modalQuizIcon) el.modalQuizIcon.textContent = '🤖';
    } else if (attempts === 1) {
      el.modalQuizAttemptsBadge.classList.add('warning');
      el.modalQuizAttemptsBadge.textContent = '🎯 Kesempatan: 2 / 3';
      if (el.modalQuizIcon) el.modalQuizIcon.textContent = '🤔';
    } else if (attempts === 2) {
      el.modalQuizAttemptsBadge.classList.add('danger');
      el.modalQuizAttemptsBadge.textContent = '⚠️ Kesempatan Terakhir: 1 / 3';
      if (el.modalQuizIcon) el.modalQuizIcon.textContent = '🚨';
    } else {
      el.modalQuizAttemptsBadge.classList.add('danger');
      el.modalQuizAttemptsBadge.textContent = '⚠️ Batas Tercapai: 0 / 3';
      if (el.modalQuizIcon) el.modalQuizIcon.textContent = '🤖';
    }
  }
}

function showQuizFeedback(msg, type, title) {
  if (!el.quizFeedbackBox) return;
  el.quizFeedbackBox.hidden = false;
  el.quizFeedbackBox.className = `quiz-feedback-box ${type}`;
  if (el.feedbackIcon) {
    el.feedbackIcon.textContent = type === 'success' ? '🎉' : type === 'limit-reached' ? '⚠️' : '❌';
  }
  if (el.feedbackTitle) {
    el.feedbackTitle.textContent =
      title || (type === 'success' ? 'Jawaban Benar!' : type === 'limit-reached' ? 'Batas Percobaan Habis (3/3)' : 'Jawaban Belum Tepat');
  }
  if (el.feedbackText) {
    el.feedbackText.innerHTML = msg;
  }
}

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

  const currentStep = state.courseData[state.currentStepIndex];
  const start = (currentStep && currentStep.startSeconds > 0) ? currentStep.startSeconds : 0;

  quizzes.forEach((quiz, i) => {
    const isDone = state.submittedQuizIds.has(quiz.id);
    const score = state.quizScores.get(quiz.id);
    const attempts = state.quizAttempts.get(quiz.id) || 0;
    const item = document.createElement('div');
    item.className = 'bento-quiz-item';

    let relTime = quiz.time;
    if (quiz.time !== undefined && quiz.time !== null) {
      relTime = (start > 0 && quiz.time >= start) ? (quiz.time - start) : quiz.time;
    }
    const timeLabel = (relTime !== undefined && relTime !== null && relTime >= 0) ? formatTime(relTime) : '';
    const cleanPrompt = (quiz.question || quiz.title || `Kuis ${i + 1}`).replace(/<[^>]*>?/gm, '');

    let badgeHtml = '';
    let btnLabel = 'Buka Kuis';

    if (isDone) {
      if (score === 0 || attempts >= 3) {
        badgeHtml = `<span class="bento-badge-done" style="background:#fef3c7; color:#b45309; border-color:#b45309; box-shadow:2px 2px 0 #b45309;">⚠️ Selesai (Nilai: 0)</span>`;
        btnLabel = 'Ulas Pembahasan';
      } else {
        badgeHtml = `<span class="bento-badge-done">✓ Selesai (100)</span>`;
        btnLabel = 'Ulas Kuis';
      }
    } else {
      if (attempts > 0) {
        badgeHtml = `<span class="bento-badge-pending" style="background:#fee2e2; color:#b91c1c; border-color:#b91c1c;">⏳ Coba Lagi (${attempts}/3)</span>`;
        btnLabel = 'Lanjut Kuis';
      } else {
        badgeHtml = `<span class="bento-badge-pending">⏳ Belum</span>`;
        btnLabel = 'Buka Kuis';
      }
    }

    item.innerHTML = `
      <div class="bento-quiz-meta">
        <span class="bento-quiz-num">Kuis ${i + 1}</span>
        ${timeLabel ? `<span class="bento-quiz-time">⏱ ${timeLabel}</span>` : ''}
        <span class="bento-quiz-prompt" title="${cleanPrompt}">${cleanPrompt}</span>
      </div>
      <div class="bento-quiz-actions">
        ${badgeHtml}
        <button type="button" class="btn-bento-open-quiz">
          ${btnLabel}
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
}

function openQuizModal(quizIndex) {
  const quiz = state.activeStepQuizzes[quizIndex];
  if (!quiz) return;

  state.activeQuiz = quiz;
  state.activeQuizIndex = quizIndex;

  const isDone = state.submittedQuizIds.has(quiz.id);
  const score = state.quizScores.get(quiz.id);
  const attempts = state.quizAttempts.get(quiz.id) || 0;
  const targetCorrect = quiz.correctIndex !== undefined ? quiz.correctIndex : normalizeQuizAnswer(quiz.answer, quiz.options);

  if (el.modalQuizNumber) {
    el.modalQuizNumber.textContent = `Kuis ${quizIndex + 1} dari ${state.activeStepQuizzes.length} · Jawab materi video yang baru kamu tonton`;
  }
  if (el.modalQuizTitle) {
    el.modalQuizTitle.textContent = quiz.title || 'Checkpoint Pemahaman Materi ⏱';
  }
  if (el.modalQuizQuestion) {
    el.modalQuizQuestion.textContent = quiz.question || 'Pertanyaan Kuis';
  }

  updateQuizAttemptsBadge(quiz.id, isDone, score);

  // Render opsi jawaban bergaya 3D komik dengan alfabet A, B, C, D
  el.modalQuizOptions.innerHTML = '';
  quiz.options.forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const label = document.createElement('label');
    label.className = 'quiz-option-card';

    if (isDone) {
      if (idx === targetCorrect) {
        label.classList.add('correct-highlight');
      }
    }

    label.innerHTML = `
      <input type="radio" name="quiz-choice" value="${idx}" class="option-radio" ${isDone ? 'disabled' : ''} />
      <span class="option-letter-badge">${letter}</span>
      <span class="option-text">${opt}</span>
    `;

    if (!isDone) {
      label.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option-card').forEach((c) => {
          c.classList.remove('selected');
          c.classList.remove('wrong-highlight');
        });
        label.classList.add('selected');
        const radio = label.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    }
    el.modalQuizOptions.appendChild(label);
  });

  // Atur state tombol dan feedback box
  if (isDone) {
    if (el.btnRewatchQuiz) el.btnRewatchQuiz.style.display = 'none';
    if (el.btnDeferQuiz) el.btnDeferQuiz.style.display = 'none';
    if (el.btnSubmitQuiz) {
      el.btnSubmitQuiz.classList.add('btn-continue-mode');
      el.btnSubmitQuiz.innerHTML = 'Tutup & Lanjutkan Belajar ➔';
    }

    const explanationHtml = quiz.explanation
      ? `<div class="feedback-key-box"><strong>Pembahasan Materi:</strong><br>${quiz.explanation}</div>`
      : '';

    if (score === 0 || attempts >= 3) {
      const msg = `Kuis ini tercatat selesai dengan nilai <strong>0 / 100</strong> karena telah mencapai batas maksimal 3 kali percobaan.<br><br>
        <strong>Kunci Jawaban yang Benar:</strong> ${String.fromCharCode(65 + targetCorrect)}. ${quiz.options[targetCorrect]}${explanationHtml}`;
      showQuizFeedback(msg, 'limit-reached', '⚠️ Kesempatan Menjawab Habis (3/3)');
    } else {
      const msg = `Hebat! Kuis ini telah kamu selesaikan dengan nilai sempurna (100 / 100).${explanationHtml}`;
      showQuizFeedback(msg, 'success', '🎉 Kuis Selesai');
    }
  } else {
    if (el.btnRewatchQuiz) {
      el.btnRewatchQuiz.style.display = 'inline-flex';
      el.btnRewatchQuiz.classList.remove('pulse-hint');
    }
    if (el.btnDeferQuiz) el.btnDeferQuiz.style.display = 'inline-block';
    if (el.btnSubmitQuiz) {
      el.btnSubmitQuiz.classList.remove('btn-continue-mode');
      el.btnSubmitQuiz.innerHTML = 'Kirim Jawaban 🚀';
    }

    if (attempts > 0) {
      const remaining = Math.max(0, 3 - attempts);
      showQuizFeedback(
        `Kamu sudah mencoba ${attempts} kali. Sisa kesempatan: <strong>${remaining} kali lagi</strong>. Pilih opsi jawaban yang paling tepat ya!`,
        'error',
        `Percobaan ke-${attempts + 1} dari 3`
      );
    } else {
      el.quizFeedbackBox.hidden = true;
    }
  }

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
      const currentStep = state.courseData[state.currentStepIndex];
      const start = (currentStep && currentStep.startSeconds > 0) ? currentStep.startSeconds : 0;
      const targetTime = Math.max(start, cur - 30);
      state.ytPlayer.seekTo(targetTime, true);
      state.ytPlayer.playVideo();
    }
  });

  el.btnSubmitQuiz.addEventListener('click', () => {
    const quiz = state.activeQuiz;
    if (!quiz) return;

    // Jika dalam mode tombol Lanjut / Kuis sudah berstatus selesai, tutup modal dan buka gate
    if (el.btnSubmitQuiz.classList.contains('btn-continue-mode') || state.submittedQuizIds.has(quiz.id)) {
      closeModal();
      renderQuizSwitcherStrip();
      checkProgressGate();
      return;
    }

    const selected = document.querySelector('input[name="quiz-choice"]:checked');
    if (!selected) {
      showQuizFeedback('Silakan pilih salah satu opsi jawaban (A, B, C, atau D) terlebih dahulu ya!', 'error', 'Pilih Jawaban Dulu');
      return;
    }

    const selectedIdx = Number(selected.value);
    const targetCorrect = quiz.correctIndex !== undefined ? quiz.correctIndex : normalizeQuizAnswer(quiz.answer, quiz.options);

    // ==================== JAWABAN BENAR ====================
    if (selectedIdx === targetCorrect) {
      state.submittedQuizIds.add(quiz.id);
      state.quizScores.set(quiz.id, 100);
      const attempts = (state.quizAttempts.get(quiz.id) || 0) + 1;
      state.quizAttempts.set(quiz.id, attempts);

      // Simpan riwayat progres ke LocalStorage
      try {
        const studentEmail = state.student.email;
        const studentSchool = state.student.school;
        localStorage.setItem(`uob_progress_${studentEmail}_${studentSchool}`, JSON.stringify([...state.submittedQuizIds]));
        localStorage.setItem(`uob_quiz_scores_${studentEmail}_${studentSchool}`, JSON.stringify([...state.quizScores]));
        localStorage.setItem(`uob_quiz_attempts_${studentEmail}_${studentSchool}`, JSON.stringify([...state.quizAttempts]));
      } catch (e) {}

      syncProgressToBackend(quiz.id, true, 100);

      // Highlight opsi benar & kunci pilihan
      document.querySelectorAll('.quiz-option-card').forEach((c, idx) => {
        const radio = c.querySelector('input');
        if (radio) radio.disabled = true;
        if (idx === targetCorrect) {
          c.classList.add('correct-highlight');
        }
      });

      updateQuizAttemptsBadge(quiz.id, true, 100);

      const explanationHtml = quiz.explanation
        ? `<div class="feedback-key-box"><strong>Pembahasan:</strong><br>${quiz.explanation}</div>`
        : '';
      const msg = `Luar biasa! Pilihanmu 100% tepat. Nilai kuis ini tercatat: <strong>100 / 100</strong>.${explanationHtml}`;
      showQuizFeedback(msg, 'success', '🎉 JAWABAN TEPAT! HEBAT SEKALI!');

      if (el.btnRewatchQuiz) el.btnRewatchQuiz.style.display = 'none';
      if (el.btnDeferQuiz) el.btnDeferQuiz.style.display = 'none';
      el.btnSubmitQuiz.innerHTML = 'Lanjutkan Misi Belajar ➔';
      el.btnSubmitQuiz.classList.add('btn-continue-mode');

      renderQuizSwitcherStrip();
      checkProgressGate();

    // ==================== JAWABAN SALAH ====================
    } else {
      const currentAtt = (state.quizAttempts.get(quiz.id) || 0) + 1;
      state.quizAttempts.set(quiz.id, currentAtt);

      try {
        const studentEmail = state.student.email;
        const studentSchool = state.student.school;
        localStorage.setItem(`uob_quiz_attempts_${studentEmail}_${studentSchool}`, JSON.stringify([...state.quizAttempts]));
      } catch (e) {}

      const selectedCard = selected.closest('.quiz-option-card');
      if (selectedCard) {
        selectedCard.classList.add('wrong-highlight');
      }

      // KASUS A: Masih ada kesempatan (Percobaan 1 atau 2)
      if (currentAtt < 3) {
        const sisa = 3 - currentAtt;
        updateQuizAttemptsBadge(quiz.id, false, null);

        const msg = `Jawabanmu belum tepat. Kamu masih memiliki <strong>${sisa} kali kesempatan lagi</strong>.<br><br>
          Yuk periksa kembali materi video atau klik tombol <strong>"↺ Putar Ulang 30 Detik"</strong> di bawah untuk menyimak penjelasannya lagi!`;
        showQuizFeedback(msg, 'error', `❌ Jawaban Belum Tepat (Percobaan ${currentAtt} dari 3)`);

        if (el.btnRewatchQuiz) {
          el.btnRewatchQuiz.classList.add('pulse-hint');
        }

      // KASUS B: Batas 3x Tercapai (Percobaan ke-3 SALAH)
      // Auto-save nilai 0, tandai kuis selesai agar tidak mentok, beri tahu siswa & tampilkan kunci jawaban
      } else {
        state.quizScores.set(quiz.id, 0);
        state.submittedQuizIds.add(quiz.id);

        try {
          const studentEmail = state.student.email;
          const studentSchool = state.student.school;
          localStorage.setItem(`uob_progress_${studentEmail}_${studentSchool}`, JSON.stringify([...state.submittedQuizIds]));
          localStorage.setItem(`uob_quiz_scores_${studentEmail}_${studentSchool}`, JSON.stringify([...state.quizScores]));
          localStorage.setItem(`uob_quiz_attempts_${studentEmail}_${studentSchool}`, JSON.stringify([...state.quizAttempts]));
        } catch (e) {}

        syncProgressToBackend(quiz.id, false, 0);

        // Kunci semua opsi & sorot kunci jawaban yang benar
        document.querySelectorAll('.quiz-option-card').forEach((c, idx) => {
          const radio = c.querySelector('input');
          if (radio) radio.disabled = true;
          if (idx === targetCorrect) {
            c.classList.add('correct-highlight');
          }
        });

        updateQuizAttemptsBadge(quiz.id, true, 0);

        const explanationHtml = quiz.explanation
          ? `<div class="feedback-key-box"><strong>Pembahasan Materi:</strong><br>${quiz.explanation}</div>`
          : '';
        const msg = `<p style="margin: 0 0 8px 0;">Nilai kuis ini tercatat: <strong>0 / 100</strong> karena telah mencapai batas maksimal 3 kali percobaan.</p>
          <p style="margin: 0 0 10px 0;">Jangan berkecil hati! Kuis ini sekarang <strong>telah dianggap selesai</strong> agar kamu dapat membuka materi berikutnya dan menuntaskan pembelajaranmu.</p>
          <div class="feedback-key-box">
            <strong>Kunci Jawaban yang Benar:</strong> ${String.fromCharCode(65 + targetCorrect)}. ${quiz.options[targetCorrect]}<br>
            ${quiz.explanation ? `<div style="margin-top: 6px;"><strong>Pembahasan:</strong> ${quiz.explanation}</div>` : ''}
          </div>`;

        showQuizFeedback(msg, 'limit-reached', '⚠️ Kesempatan Menjawab Habis (3/3)');

        if (el.btnRewatchQuiz) el.btnRewatchQuiz.style.display = 'none';
        if (el.btnDeferQuiz) el.btnDeferQuiz.style.display = 'none';
        el.btnSubmitQuiz.innerHTML = 'Lanjutkan Misi Belajar ➔';
        el.btnSubmitQuiz.classList.add('btn-continue-mode');

        renderQuizSwitcherStrip();
        checkProgressGate();
      }
    }
  });
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
  const isVideoWatchedEnough = isCurrentStepVideoWatchedEnough();
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
    const isVideoWatchedEnough = isCurrentStepVideoWatchedEnough();

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
    if (el.challengeCodeEditor) el.challengeCodeEditor.value = '';
    if (el.challengeUrlInput) el.challengeUrlInput.value = '';
    if (el.fileSelectedName) el.fileSelectedName.textContent = 'Belum ada file dipilih';
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
      const rawFileName = el.fileSelectedName?.textContent?.trim() || '';
      const hasRealFile = file || (rawFileName && !rawFileName.toLowerCase().includes('belum ada file') && !rawFileName.toLowerCase().includes('tidak ada file'));
      const fileName = file ? file.name : (hasRealFile ? rawFileName.replace(/^✓\s*|^📄\s*/, '') : '');

      if (!codeVal && !urlVal && !fileName) {
        showAppAlert({
          title: 'Karya Proyek Kosong',
          message: 'Silakan tulis kode pada editor, masukkan tautan proyek Scratch/MIT App Inventor, atau unggah berkas karya proyek kamu terlebih dahulu.',
          icon: '💡',
          buttonText: 'Periksa Kembali'
        });
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
        const step = state.courseData[state.currentStepIndex] || {};
        fetch(APP_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit_challenge',
            email: state.student.email,
            name: state.student.name,
            school: state.student.school,
            level: state.student.level,
            stepId: step.id || `step-${state.currentStepIndex + 1}`,
            submission: submissionData
          })
        }).catch(() => {});
      } catch (e) {}

      if (el.challengeSubmitFeedback) {
        el.challengeSubmitFeedback.style.display = 'block';
        el.challengeSubmitFeedback.className = 'challenge-submit-feedback success';
        el.challengeSubmitFeedback.textContent = '🎉 Hebat! Karya tantanganmu berhasil tersimpan di browser dan diarsipkan ke rekapitulasi. Kamu bebas lanjut ke materi berikutnya kapan saja!';
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

/**
 * Evaluasi terpusat kelulusan siswa (Server-First Data Contract)
 */
function evaluateStudentEligibility() {
  const totalSteps = state.courseData ? state.courseData.length : 0;
  const isCourseFinished = totalSteps > 0 && state.unlockedStepIndex >= totalSteps;

  let totalQuizzes = 0;
  let submittedCount = 0;
  let totalScoreEarned = 0;
  let passedQuizzes = 0;
  let zeroScoreCount = 0;

  state.courseData.forEach((step) => {
    const qList = extractQuizzesFromStep(step);
    totalQuizzes += qList.length;
    qList.forEach((q) => {
      if (state.submittedQuizIds.has(q.id)) {
        submittedCount++;
        const score = state.quizScores.get(q.id);
        // Nilai aktual: jika gagal 3x atau skor 0, catat apa adanya (jangan default ke 100)
        const actualScore = (score !== undefined && score !== null) ? Number(score) : 0;
        totalScoreEarned += actualScore;
        if (actualScore > 0) {
          passedQuizzes++;
        } else {
          zeroScoreCount++;
        }
      }
    });
  });

  const isQuizzesFinished = totalQuizzes === 0 || submittedCount >= totalQuizzes;
  const accuracy = totalQuizzes > 0 ? Math.round(totalScoreEarned / totalQuizzes) : 100;
  const isPassing = accuracy >= 70; // Standar kelulusan resmi UOB MDS
  const isAdmin = Boolean(state.student && state.student.isAdmin);
  const isFullyEligible = isCourseFinished && isQuizzesFinished && isPassing;

  return {
    isFullyEligible,
    isAdmin,
    isCourseFinished,
    isQuizzesFinished,
    totalQuizzes,
    submittedCount,
    passedQuizzes,
    zeroScoreCount,
    accuracy,
    isPassing
  };
}

/**
 * Membuka modal sertifikat kelulusan dan transkrip hasil evaluasi
 */
function openCertificateModal() {
  if (!el.certificateModal) return;

  if (state.isRestoringProgress) {
    showAppAlert({
      title: 'Sinkronisasi Progres Belajar',
      message: 'Data progres belajar sedang disinkronkan dengan server. Silakan tunggu beberapa detik sebelum membuka sertifikat.',
      icon: '⏳'
    });
    return;
  }

  const eligibility = evaluateStudentEligibility();

  // Guard Terpusat: Tolak jika belum eligible dan bukan admin
  if (!eligibility.isFullyEligible && !eligibility.isAdmin) {
    const remainingSteps = Math.max(0, state.courseData.length - state.unlockedStepIndex);
    const remainingQuizzes = Math.max(0, eligibility.totalQuizzes - eligibility.submittedCount);

    showAppAlert({
      title: 'Sertifikat & Rekap Nilai Terkunci',
      message: `Kamu belum memenuhi seluruh syarat kelulusan resmi UOB My Digital Space:\n\n• Materi tuntas: ${Math.min(state.unlockedStepIndex, state.courseData.length)} / ${state.courseData.length} modul (${remainingSteps > 0 ? `${remainingSteps} modul tersisa` : 'Lengkap'})\n• Kuis disubmit: ${eligibility.submittedCount} / ${eligibility.totalQuizzes} kuis (${remainingQuizzes > 0 ? `${remainingQuizzes} kuis tersisa` : 'Lengkap'})\n• Akurasi pemahaman: ${eligibility.accuracy}% (ambang batas kelulusan: minimal 70%)\n\nSelesaikan seluruh rangkaian materi dan kuis untuk membuka dokumen resmi.`,
      icon: '🎓',
      buttonText: 'Lanjutkan Belajar',
      onConfirm: () => {
        goToStep(state.unlockedStepIndex < state.courseData.length ? state.unlockedStepIndex : 0);
      }
    });
    return;
  }

  // Watermark Khusus untuk Pratinjau Admin yang belum tuntas
  const isAdminPreview = eligibility.isAdmin && !eligibility.isFullyEligible;
  if (el.certAdminWatermark) el.certAdminWatermark.style.display = isAdminPreview ? 'block' : 'none';
  if (el.transcriptAdminWatermark) el.transcriptAdminWatermark.style.display = isAdminPreview ? 'block' : 'none';

  renderCertificateData();
  el.certificateModal.showModal();
}

/**
 * Render & Populate Data Sertifikat dan Transkrip Lengkap
 */
function renderCertificateData() {
  const eligibility = evaluateStudentEligibility();
  const isAdminPreview = eligibility.isAdmin && !eligibility.isFullyEligible;

  // Update Score Report Grid
  const challengeCount = state.submittedChallenges ? state.submittedChallenges.size : 0;
  if (el.reportQuizzesCount) el.reportQuizzesCount.textContent = `${eligibility.submittedCount} / ${eligibility.totalQuizzes}`;
  if (el.reportAccuracy) el.reportAccuracy.textContent = `${eligibility.accuracy}%`;
  if (el.reportChallengesCount) el.reportChallengesCount.textContent = `${challengeCount}`;
  if (el.reportStatus) {
    if (isAdminPreview) {
      el.reportStatus.textContent = `PREVIEW ADMIN (${eligibility.accuracy}%)`;
    } else if (eligibility.accuracy >= 90) {
      el.reportStatus.textContent = 'LULUS (PUJIAN)';
    } else {
      el.reportStatus.textContent = 'LULUS (MEMUASKAN)';
    }
  }

  // Common Metadata
  const studentName = state.student && state.student.name ? state.student.name : 'Peserta Pembelajaran';
  const school = state.student && state.student.school ? state.student.school : 'Sekolah Mitra UOB';
  const rombel = state.student && state.student.rombel ? ` · ${state.student.rombel}` : '';
  const level = state.student && state.student.level ? ` (${state.student.level})` : '';
  const fullSchoolText = `${school}${rombel}${level}`;

  const programName =
    state.student && state.student.level === 'SMA'
      ? 'Asynchronous Coding Exploration: Python for High School'
      : state.student && state.student.level === 'SMP'
      ? 'Asynchronous Coding Exploration: MIT App Inventor for Middle School'
      : 'Asynchronous Coding Exploration: Scratch Visual Coding for Primary School';

  // Nomor Seri Deterministik Format Resmi UOB MDS
  const hash = Math.abs(hashString(((state.student && state.student.email) || 'user') + ((state.student && state.student.school) || 'uob'))).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
  const serialNo = `UOB-MDS-${(state.student && state.student.level) || 'GEN'}-2026-${hash}`;

  // Tanggal Kelulusan Resmi
  const completionDate = state.student && state.student.completedAt ? new Date(state.student.completedAt) : new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = completionDate.toLocaleDateString('id-ID', options);

  // Update Page 1: Certificate of Completion (Landscape A4)
  if (el.certStudentName) el.certStudentName.textContent = studentName;
  if (el.certStudentSchool) el.certStudentSchool.textContent = fullSchoolText;
  if (el.certProgramName) el.certProgramName.textContent = programName;
  if (el.certSerialNo) el.certSerialNo.textContent = serialNo;
  if (el.certDateText) el.certDateText.textContent = `Diterbitkan pada: ${formattedDate}`;

  // Update Page 2: Academic Transcript (Portrait A4)
  if (el.transcriptStudentName) el.transcriptStudentName.textContent = studentName;
  if (el.transcriptStudentSchool) el.transcriptStudentSchool.textContent = fullSchoolText;
  if (el.transcriptDate) el.transcriptDate.textContent = formattedDate;
  if (el.transcriptSerialRef) el.transcriptSerialRef.textContent = serialNo;
  if (el.transcriptStatus) {
    if (isAdminPreview) {
      el.transcriptStatus.textContent = `PRATINJAU ADMIN (${eligibility.accuracy}%)`;
    } else {
      el.transcriptStatus.textContent = `${eligibility.accuracy}% · ${eligibility.accuracy >= 90 ? 'LULUS DENGAN PUJIAN' : 'LULUS'}`;
    }
  }

  // Populate Transcript Module Breakdown Table (Compact & Accurate)
  if (el.certTranscriptTbody && state.courseData && state.courseData.length > 0) {
    el.certTranscriptTbody.innerHTML = '';
    state.courseData.forEach((step, idx) => {
      const qList = extractQuizzesFromStep(step);
      let stepTotalScore = 0;
      let stepSubmitted = 0;

      qList.forEach((q) => {
        if (state.submittedQuizIds.has(q.id)) {
          stepSubmitted++;
          const sc = state.quizScores.get(q.id);
          stepTotalScore += (sc !== undefined && sc !== null) ? Number(sc) : 0;
        }
      });

      const isStepDone = qList.length === 0 || stepSubmitted === qList.length;
      let scoreDisplay = '';
      let statusBadge = '';

      if (qList.length > 0) {
        if (isStepDone) {
          const avgScore = Math.round(stepTotalScore / qList.length);
          if (avgScore === 0) {
            scoreDisplay = `<span style="font-weight: 800; color: #dc2626;">0 / 100</span>`;
            statusBadge = `<span class="transcript-badge-zero">Perlu Remedial</span>`;
          } else {
            scoreDisplay = `<span style="font-weight: 700; color: #092764;">${avgScore} / 100</span>`;
            statusBadge = `<span class="transcript-badge-done">✓ Tuntas</span>`;
          }
        } else {
          scoreDisplay = `<span style="color: #64748b;">${stepSubmitted}/${qList.length} Selesai</span>`;
          statusBadge = `<span class="transcript-badge-pending">⏳ Belum</span>`;
        }
      } else {
        scoreDisplay = `<span style="font-weight: 700; color: #092764;">100 / 100</span>`;
        statusBadge = `<span class="transcript-badge-done">✓ Tuntas</span>`;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center; font-weight: 700;">${String(idx + 1).padStart(2, '0')}</td>
        <td><strong>${step.title || `Materi ${idx + 1}`}</strong></td>
        <td>${qList.length > 0 ? `${stepSubmitted}/${qList.length} Pop-up Kuis` : 'Materi Slide Interaktif'}</td>
        <td style="text-align: center;">${scoreDisplay}</td>
        <td style="text-align: center;">${statusBadge}</td>
      `;
      el.certTranscriptTbody.appendChild(tr);
    });
  }
}

/**
 * Ekspor Dokumen Resmi 2 Halaman (Halaman 1 Landscape A4 & Halaman 2 Portrait A4) via html2pdf Bundle
 */
async function exportCertificateToPdf() {
  if (typeof window.html2pdf !== 'function') {
    showToast('Library PDF belum siap, beralih ke dialog cetak browser...');
    window.print();
    return;
  }

  const eligibility = evaluateStudentEligibility();
  if (!eligibility.isFullyEligible && !eligibility.isAdmin) {
    showToast('Dokumen terkunci: selesaikan seluruh materi dan kuis terlebih dahulu.');
    return;
  }

  const btn = el.btnPrintCertificate;
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Mengenerate PDF (Halaman 1 Landscape & Halaman 2 Portrait)...';
  }

  // Buat Surface Sandbox Terisolasi Berukuran A4 Tetap di (0,0) yang Tidak Terlihat (Opacity 0)
  const sandbox = document.createElement('div');
  sandbox.id = 'cert-render-sandbox';
  sandbox.style.cssText = 'position: fixed !important; left: 0 !important; top: 0 !important; width: 1123px !important; z-index: -9999 !important; background: #ffffff !important; pointer-events: none !important; opacity: 0 !important;';
  document.body.appendChild(sandbox);

  try {
    const page1Orig = document.querySelector('#cert-page-1');
    const page2Orig = document.querySelector('#cert-page-2');
    if (!page1Orig || !page2Orig) throw new Error('Elemen template sertifikat tidak ditemukan');

    // Pastikan data tabel transkrip dan metadata sertifikat selalu terpopulasi sebelum diclone
    renderCertificateData();

    // Tunggu font web terpasang stabil
    if (document.fonts && document.fonts.ready) {
      try {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]);
      } catch (_) {}
    }

    // ==================== 1. Surface Halaman 1: Landscape A4 (1123 × 794 px) ====================
    const surface1 = document.createElement('div');
    surface1.className = 'sandbox-surface-page-1';
    const clone1 = page1Orig.cloneNode(true);
    clone1.style.width = '100%';
    clone1.style.height = '100%';
    clone1.style.maxWidth = 'none';

    // Hapus total seluruh watermark pratinjau admin pada dokumen cetak / ekspor PDF
    const w1 = clone1.querySelector('#cert-admin-watermark');
    if (w1) w1.remove();

    // Sematkan Base64 Logo untuk menjamin 0% risiko CORS dan 100% offline-ready
    const c1LogoRg = clone1.querySelector('#cert-logo-rg');
    if (c1LogoRg) c1LogoRg.src = LOGO_RUANGGURU;
    const c1LogoUob = clone1.querySelector('#cert-logo-uob');
    if (c1LogoUob) c1LogoUob.src = LOGO_UOB_MDS;
    // Injeksi style presisi untuk Halaman 1 agar seal emas dan warna latar selalu tampil kaya
    const p1Style = document.createElement('style');
    p1Style.innerHTML = `
      .sandbox-surface-page-1 .certificate-frame {
        background-color: #faf8f5 !important;
        background: linear-gradient(180deg, #ffffff 0%, #faf8f5 70%, #f4eee1 100%) !important;
      }
      .sandbox-surface-page-1 .cert-gold-seal {
        background-color: #d97706 !important;
        background: linear-gradient(135deg, #fffbeb 0%, #fde047 25%, #eab308 45%, #d97706 70%, #92400e 100%) !important;
        border: 3.5px solid #ffffff !important;
        box-shadow: 0 0 0 2px #b45309, 0 6px 16px rgba(146, 64, 14, 0.4) !important;
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
      }
    `;
    clone1.appendChild(p1Style);

    surface1.appendChild(clone1);
    sandbox.appendChild(surface1);

    await new Promise((r) => setTimeout(r, 120));

    // Render Canvas Halaman 1 (Landscape) Resolusi Tinggi Skala 2x
    // WAJIB set orientation: 'landscape' agar toContainer tidak memotong lebar ke 794px
    const canvas1 = await window.html2pdf().set({
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        logging: false
      }
    }).from(surface1).toCanvas().get('canvas');
    surface1.remove();

    // ==================== 2. Surface Halaman 2: Portrait A4 (794 × 1123 px) ====================
    const surface2 = document.createElement('div');
    surface2.className = 'sandbox-surface-page-2';
    const clone2 = page2Orig.cloneNode(true);
    clone2.style.width = '100%';
    clone2.style.maxWidth = 'none';

    // Hapus total seluruh watermark pratinjau admin pada dokumen cetak / ekspor PDF
    const w2 = clone2.querySelector('#transcript-admin-watermark');
    if (w2) w2.remove();

    // Pastikan status di transkrip bersih dari teks "PRATINJAU ADMIN"
    const statusEl = clone2.querySelector('#transcript-status');
    if (statusEl) {
      statusEl.textContent = `${eligibility.accuracy || 100}% · ${(eligibility.accuracy || 100) >= 90 ? 'LULUS DENGAN PUJIAN' : 'LULUS'}`;
    }

    // Injeksi style presisi full-length agar frame dan seluruh konten Halaman 2 menyentuh batas bawah A4 tanpa nanggung
    const stepCount = (state.courseData && state.courseData.length) || 36;
    const compStyle = document.createElement('style');
    compStyle.innerHTML = `
      .sandbox-surface-page-2 { padding: 16px !important; }
      .sandbox-surface-page-2 .transcript-frame {
        height: 100% !important;
        min-height: calc(1123px - 32px) !important;
        max-height: calc(1123px - 32px) !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 16px 20px !important;
        border: 3.5px solid #092764 !important;
        border-radius: 6px !important;
        background: #ffffff !important;
      }
      .sandbox-surface-page-2 .transcript-header {
        margin-bottom: 8px !important;
        padding-bottom: 8px !important;
      }
      .sandbox-surface-page-2 .transcript-logo-rg { height: 25px !important; }
      .sandbox-surface-page-2 .transcript-logo-uob { height: 22px !important; width: auto !important; object-fit: contain !important; }
      .sandbox-surface-page-2 .transcript-badge { font-size: 0.62rem !important; padding: 2px 8px !important; margin-bottom: 2px !important; }
      .sandbox-surface-page-2 .transcript-title { font-size: 1.05rem !important; margin: 0 !important; }
      .sandbox-surface-page-2 .transcript-subtitle { font-size: 0.68rem !important; }
      .sandbox-surface-page-2 .transcript-meta-grid {
        padding: 6px 12px !important;
        gap: 8px !important;
        margin-bottom: 8px !important;
      }
      .sandbox-surface-page-2 .transcript-meta-item .meta-label { font-size: 0.60rem !important; margin-bottom: 2px !important; }
      .sandbox-surface-page-2 .transcript-meta-item strong { font-size: 0.78rem !important; }
      .sandbox-surface-page-2 .transcript-table-container {
        margin-bottom: 8px !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 6px !important;
        flex: 1 1 auto !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .sandbox-surface-page-2 .transcript-table {
        height: 100% !important;
      }
      .sandbox-surface-page-2 .transcript-table th {
        padding: ${stepCount <= 18 ? '5px 6px' : '3px 6px'} !important;
        font-size: 0.66rem !important;
      }
      .sandbox-surface-page-2 .transcript-table td {
        padding: ${stepCount <= 18 ? '5.5px 6px' : '1.8px 6px'} !important;
        font-size: ${stepCount <= 18 ? '0.66rem' : '0.61rem'} !important;
        line-height: 1.15 !important;
      }
      .sandbox-surface-page-2 .transcript-badge-done,
      .sandbox-surface-page-2 .transcript-badge-zero,
      .sandbox-surface-page-2 .transcript-badge-pending {
        padding: 1px 5px !important;
        font-size: 0.58rem !important;
      }
      .sandbox-surface-page-2 .transcript-competencies {
        padding: 8px 12px !important;
        margin-bottom: 8px !important;
      }
      .sandbox-surface-page-2 .competency-heading { font-size: 0.72rem !important; margin-bottom: 5px !important; }
      .sandbox-surface-page-2 .competency-box { padding: 5px 8px !important; }
      .sandbox-surface-page-2 .competency-box strong { font-size: 0.68rem !important; margin-bottom: 2px !important; }
      .sandbox-surface-page-2 .competency-box span { font-size: 0.59rem !important; line-height: 1.25 !important; }
      .sandbox-surface-page-2 .transcript-footer {
        padding-top: 8px !important;
        border-top: 1.5px solid #092764 !important;
      }
      .sandbox-surface-page-2 .transcript-note { font-size: 0.60rem !important; line-height: 1.3 !important; }
      .sandbox-surface-page-2 .cert-signatory-name { font-size: 0.76rem !important; }
      .sandbox-surface-page-2 .cert-signatory-role { font-size: 0.62rem !important; }
    `;
    clone2.appendChild(compStyle);

    const c2LogoRg = clone2.querySelector('#transcript-logo-rg');
    if (c2LogoRg) c2LogoRg.src = LOGO_RUANGGURU;
    const c2LogoUob = clone2.querySelector('#transcript-logo-uob');
    if (c2LogoUob) c2LogoUob.src = LOGO_UOB_MDS;
    surface2.appendChild(clone2);
    sandbox.appendChild(surface2);

    await new Promise((r) => setTimeout(r, 120));

    // Render Canvas Halaman 2 (Portrait) Resolusi Tinggi Skala 2x
    // WAJIB set orientation: 'portrait' agar rasio aspek tepat A4 portrait
    const canvas2 = await window.html2pdf().set({
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        logging: false
      }
    }).from(surface2).toCanvas().get('canvas');
    surface2.remove();

    // ==================== 3. Kompilasi PDF Multi-Orientasi ====================
    const dummy = document.createElement('div');
    const pdf = await window.html2pdf().set({
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape',
        compress: true
      }
    }).from(dummy).toPdf().get('pdf');

    // Halaman 1: Landscape A4 (297 mm × 210 mm)
    const img1 = canvas1.toDataURL('image/jpeg', 0.96);
    pdf.addImage(img1, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');

    // Halaman 2: Portrait A4 (210 mm × 297 mm)
    pdf.addPage('a4', 'portrait');
    const img2 = canvas2.toDataURL('image/jpeg', 0.96);
    pdf.addImage(img2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    // Penamaan Berkas PDF Tersanitasi
    const studentNameRaw = state.student && state.student.name ? state.student.name : 'Siswa';
    const sanitizedName = studentNameRaw.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '_') || 'Peserta';
    const levelTag = state.student && state.student.level ? state.student.level : 'LMS';
    const filename = `Sertifikat_UOB_MDS_${levelTag}_${sanitizedName}.pdf`;

    pdf.save(filename);
    showToast(`✓ Berhasil mengunduh ${filename}! Halaman 1 Landscape A4 & Halaman 2 Portrait A4.`);
  } catch (err) {
    console.error('Gagal mengekspor PDF:', err);
    showToast('Terjadi kendala ekspor PDF, membuka dialog cetak browser...');
    window.print();
  } finally {
    sandbox.remove();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
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
  // Tombol Utama: Ekspor PDF Multi-Orientasi
  if (el.btnPrintCertificate) {
    el.btnPrintCertificate.addEventListener('click', () => {
      exportCertificateToPdf();
    });
  }
  // Tombol Sekunder: Cetak Langsung Browser (Fallback)
  if (el.btnBrowserPrint) {
    el.btnBrowserPrint.addEventListener('click', () => {
      window.print();
    });
  }
}

// Expose core controller functions to window for in-browser testing & diagnostics
window.goToStep = goToStep;
window.buildSidebarModuleList = buildSidebarModuleList;
window.openCertificateModal = openCertificateModal;
window.exportCertificateToPdf = exportCertificateToPdf;
window.recomputeUnlockedStepIndex = recomputeUnlockedStepIndex;
window.extractQuizzesFromStep = extractQuizzesFromStep;
window.renderCertificateData = renderCertificateData;


