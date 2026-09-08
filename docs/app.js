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
  hasStartedVideo: false
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
  btnSubmitQuiz: document.querySelector('#btn-submit-quiz')
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
  setupMediaSwitcherEvents();
  setupPlayerControlEvents();
  setupQuizModalEvents();
  setupStepNavEvents();

  // Mobile Gentle Advisory Check
  if (window.innerWidth < 768) {
    setTimeout(() => {
      if (el.advisoryModal) el.advisoryModal.showModal();
    }, 1200);
  }
});

// ==================== 1. DATA LOADING & COMBOBOX SEARCH ====================
const ADMIN_VIRTUAL_SCHOOLS = [
  { school: 'SD UOB', grade_name: 'Upper Primary', level: 'SD', isAdmin: true },
  { school: 'SMP UOB', grade_name: 'Middle School', level: 'SMP', isAdmin: true },
  { school: 'SMA UOB', grade_name: 'High School', level: 'SMA', isAdmin: true }
];

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

async function loadMasterData() {
  // 1. Inisialisasi sekolah admin secara instan (0ms latency)
  state.masterSchools = [...ADMIN_VIRTUAL_SCHOOLS];

  // 2. Load local student master fixture (berisi 504 siswa real)
  try {
    const res = await fetch('./data/ops-student-data.json');
    if (res.ok) {
      state.allStudentsData = await res.json();
      buildSchoolsFromStudents();
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
          state.masterSchools = data.schools;
          ensureAdminSchoolsInMaster();
          state.masterSchools.sort((a, b) => a.school.localeCompare(b.school));
        }
      }
    } catch (err) {
      console.log('Background schools update deferred.');
    }

    try {
      const res = await fetch(`${APP_SCRIPT_URL}?action=all_students`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.students) && data.students.length > 0) {
          state.allStudentsData = data.students;
          buildSchoolsFromStudents();
        }
      }
    } catch (err) {
      console.log('Background all_students update deferred.');
    }
  })();
}

function buildSchoolsFromStudents() {
  const seen = {};
  ADMIN_VIRTUAL_SCHOOLS.forEach((adm) => {
    seen[adm.school.toLowerCase()] = true;
  });

  state.allStudentsData.forEach((s) => {
    const school = String(s.school_name || '').trim();
    if (school && !seen[school.toLowerCase()]) {
      seen[school.toLowerCase()] = true;
      const cur = resolveCurriculumFromGrade(s.grade_name);
      state.masterSchools.push({
        school: school,
        grade_name: s.grade_name || 'High School',
        level: cur.level
      });
    }
  });
  ensureAdminSchoolsInMaster();
  state.masterSchools.sort((a, b) => a.school.localeCompare(b.school));
}

function ensureAdminSchoolsInMaster() {
  ADMIN_VIRTUAL_SCHOOLS.forEach((adm) => {
    const existing = state.masterSchools.find(
      (s) => s.school.toLowerCase().trim() === adm.school.toLowerCase().trim()
    );
    if (!existing) {
      state.masterSchools.push(adm);
    } else {
      existing.isAdmin = true;
    }
  });
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
    el.loginDetectedBadge.textContent = 'Pilih Sekolah untuk Mulai';
    el.loginDetectedBadge.style.color = '';
    el.loginEmailInput.value = '';
    el.loginEmailInput.placeholder = 'nama@email.com';
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

    const filtered = state.masterSchools.filter((s) => s.school.toLowerCase().includes(query));

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
        const adminBadge = (item.isAdmin || item.school.toUpperCase().includes('UOB'))
          ? '<span class="badge-admin-tag">Akses Admin</span>'
          : '';

        btn.innerHTML = `<strong>${highlightedName}</strong> <span style="opacity:0.75; font-size:0.8rem; margin-left:6px;">(${item.level})</span> ${adminBadge}`;
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
    const isAdminSchool = schoolItem.isAdmin || schoolItem.school.toUpperCase().includes('UOB');

    if (isAdminSchool) {
      el.loginDetectedBadge.textContent = `Akses Admin: ${schoolItem.school} (${cur.level})`;
      el.loginDetectedBadge.style.color = '#7c3aed';
      if (!el.loginEmailInput.value || el.loginEmailInput.value.trim() === '') {
        el.loginEmailInput.value = 'permata@mds.com';
      }
    } else {
      el.loginDetectedBadge.textContent = `Terdeteksi: Jenjang ${cur.level} (${schoolItem.school})`;
      el.loginDetectedBadge.style.color = cur.level === 'SMA' ? '#ffd93d' : cur.level === 'SMP' ? '#43d7ff' : '#27c881';
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
      el.adminModalSubtitle.textContent = `Akses khusus peninjauan kurikulum ${curLevel || ''} (${schoolName})`;
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
    `Akses Admin UOB My Digital Space\n\nAnda sedang mengakses materi jenjang ${curLevel} (${schoolName}).\nSilakan masukkan Password Admin:`,
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
        el.adminModalErrorText.textContent = 'Password admin salah! Silakan periksa kembali.';
      }
      if (el.adminPasswordInput) el.adminPasswordInput.select();
    }
    showLoginError('Password Admin Salah', 'Password admin yang Anda masukkan tidak sesuai.');
    return false;
  }

  // Tutup modal jika terbuka
  if (el.adminPasswordModal && el.adminPasswordModal.open) {
    el.adminPasswordModal.close();
  }

  el.btnLogin.disabled = true;
  el.btnLogin.querySelector('span').textContent = 'Memverifikasi Admin...';

  const emailInput = (el.loginEmailInput.value || '').toLowerCase().trim() || 'permata@mds.com';

  // Verifikasi ke backend Apps Script (background logging non-blocking)
  try {
    const loginUrl = `${APP_SCRIPT_URL}?action=login&email=${encodeURIComponent(emailInput)}&school=${encodeURIComponent(schoolName)}&password=${encodeURIComponent(password)}`;
    fetch(loginUrl).catch((e) => console.log('Apps Script admin login notice:', e));
  } catch (e) {
    console.warn('Backend admin notify deferred:', e);
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
  if (!state.selectedSchool) {
    showLoginError('Sekolah Belum Dipilih', 'Silakan pilih sekolah mitra terlebih dahulu dari kolom pencarian.');
    return;
  }

  const emailInput = el.loginEmailInput.value.toLowerCase().trim();
  const schoolName = state.selectedSchool.school;
  const isVirtualAdminSchool = state.selectedSchool.isAdmin || schoolName.toUpperCase().includes('UOB');
  const isAdminEmail = emailInput === 'permata@mds.com';

  // ==================== ALUR KHUSUS ADMIN (permata@mds.com) ====================
  if (isAdminEmail || isVirtualAdminSchool) {
    if (!isAdminEmail && emailInput) {
      showLoginError(
        'Email Khusus Admin Diperlukan',
        `Sekolah virtual "${schoolName}" ditujukan untuk akses peninjauan materi oleh tim admin. Silakan gunakan email admin: permata@mds.com`
      );
      return;
    }

    const cur = resolveCurriculumFromGrade(state.selectedSchool.grade_name);
    openAdminPasswordModal(schoolName, cur.level);
    return;
  }

  if (!emailInput) {
    showLoginError('Email Masih Kosong', 'Silakan masukkan email yang terdaftar di Akademia Ruangguru.');
    return;
  }

  // ==================== ALUR SISWA REGULER ====================
  el.btnLogin.disabled = true;
  el.btnLogin.querySelector('span').textContent = 'Memverifikasi...';

  // A. Cek kecocokan langsung di data lokal/memori (500+ siswa real)
  let matchedStudent = state.schoolStudents.find(
    (s) => String(s.email || '').toLowerCase().trim() === emailInput
  );

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
          // Backend mengembalikan saran typo Levenshtein
          handleTypoSuggestion(json.suggestion, emailInput);
          el.btnLogin.disabled = false;
          el.btnLogin.querySelector('span').textContent = 'Mulai Belajar';
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
    // D. Email Tidak Match: Hitung Levenshtein Distance terhadap email di sekolah ini
    let closest = null;
    let minDistance = 999;

    state.schoolStudents.forEach((st) => {
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
    el.btnLogin.querySelector('span').textContent = 'Mulai Belajar';

    if (closest) {
      showLoginError(
        'Email Belum Cocok',
        `Email "${emailInput}" belum cocok dengan data siswa ${schoolName}. Kami menemukan email dengan ejaan paling mendekati:`,
        closest
      );
    } else {
      showLoginError(
        'Email Belum Terdaftar',
        `Email "${emailInput}" tidak ditemukan pada data siswa ${schoolName}. Coba cek kembali penulisan email atau gunakan tombol bantuan di atas.`
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

  // Load Kurikulum sesuai jenjang yang terdeteksi
  try {
    await loadCourseData(state.student.dataFile);
    buildSidebarModuleList();
    goToStep(0);
  } catch (err) {
    console.error('Failed to load course dataset:', err);
    alert('Gagal memuat kurikulum materi. Silakan refresh halaman.');
  }

  // Server-First sync progress from Google Sheets
  try {
    const getUrl = `${APP_SCRIPT_URL}?action=get_progress&email=${encodeURIComponent(state.student.email)}&school=${encodeURIComponent(state.student.school)}&level=${encodeURIComponent(state.student.level)}`;
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
  } catch (e) {}
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
  el.btnOpenAdvisory.addEventListener('click', () => {
    el.advisoryModal.showModal();
  });
  el.btnDismissAdvisory.addEventListener('click', () => {
    el.advisoryModal.close();
  });
}

// ==================== 4. SIDEBAR & NAVIGATION ====================
function buildSidebarModuleList() {
  el.lessonNav.innerHTML = '';
  el.mobileStepSelect.innerHTML = '';

  state.courseData.forEach((step, index) => {
    // Desktop Tab Item
    const tab = document.createElement('button');
    tab.className = `lesson-tab ${index === state.currentStepIndex ? 'active' : ''}`;
    tab.type = 'button';
    tab.innerHTML = `
      <span class="tab-number">${String(index + 1).padStart(2, '0')}</span>
      <div class="tab-copy">
        <strong>${step.title || `Materi ${index + 1}`}</strong>
        <span>${step.duration || '10 Menit'} · ${step.type === 'slide' ? 'Slide' : 'Video'}</span>
      </div>
      <span class="tab-arrow">→</span>
    `;
    tab.addEventListener('click', () => goToStep(index));
    el.lessonNav.appendChild(tab);

    // Mobile Select Option
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = `${String(index + 1).padStart(2, '0')}. ${step.title}`;
    el.mobileStepSelect.appendChild(opt);
  });

  el.mobileStepSelect.addEventListener('change', (e) => {
    goToStep(Number(e.target.value));
  });

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
  state.currentStepIndex = index;
  teardownPlayer();

  const step = state.courseData[index];

  // Update Header Info
  el.lessonKicker.textContent = step.kicker || `MODUL ${String(index + 1).padStart(2, '0')}`;
  el.lessonTitle.textContent = step.title;
  el.mediaTypeBadge.textContent = step.type === 'slide' ? '📄 Slide Interaktif' : '▶ Video';
  el.lessonDuration.textContent = step.duration || '10 Menit';

  // Extract Quizzes
  state.activeStepQuizzes = extractQuizzesFromStep(step);
  renderQuizSwitcherStrip();

  // Setup Sandbox Iframe Slide Path
  const slidePath = step.slideUrl || (state.student.level === 'SMA' ? './slides/bridge-hs-00.html' : './slides/bridge-ms-00.html');
  el.sandboxIframe.src = slidePath;
  el.sandboxTitle.textContent = step.title;

  // Media Mode: Default to Video if type is video, otherwise Sandbox
  if (step.type === 'slide') {
    activateMediaMode('sandbox');
  } else {
    activateMediaMode('video');
    renderVideoStep(step);
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

  // Render Lesson Reading Accordion
  renderReadingAccordion(step, index);

  // Update Sidebar Active Class
  document.querySelectorAll('.lesson-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
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
      el.videoFrame.requestFullscreen ? el.videoFrame.requestFullscreen() : el.sandboxContainer.requestFullscreen();
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

function activateMediaMode(mode) {
  state.activeMediaMode = mode;
  if (mode === 'sandbox') {
    el.tabModeSandbox.classList.add('active');
    el.tabModeVideo.classList.remove('active');
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
  el.btnPlayPause.textContent = '▶';
  el.videoSeekBar.value = 0;
  el.videoTimeDisplay.textContent = '0:00 / 0:00';

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

// ==================== 9. QUIZ SWITCHER & MODAL ====================
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
function checkProgressGate() {
  const isLastStep = state.currentStepIndex >= state.courseData.length - 1;

  // Akses Bebas untuk Admin
  if (state.student && state.student.isAdmin) {
    if (isLastStep) {
      el.btnNextStep.disabled = true;
      el.nextStepIcon.textContent = '★';
      el.stepGateInfo.textContent = 'Mode Admin: Anda berada pada materi terakhir misi ini.';
      el.stepGateInfo.style.color = '#7c3aed';
    } else {
      el.btnNextStep.disabled = false;
      el.nextStepIcon.textContent = '→';
      el.stepGateInfo.textContent = '🔓 Mode Admin: Akses bebas untuk meninjau seluruh materi.';
      el.stepGateInfo.style.color = '#7c3aed';
    }
    return;
  }

  const quizzes = state.activeStepQuizzes;
  const isCurrentStepCompleted = quizzes.every((q) => state.submittedQuizIds.has(q.id));

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

function setupStepNavEvents() {
  el.btnPrevStep.addEventListener('click', () => {
    if (state.currentStepIndex > 0) {
      goToStep(state.currentStepIndex - 1);
    }
  });

  el.btnNextStep.addEventListener('click', () => {
    const isCurrentStepCompleted = state.activeStepQuizzes.every((q) => state.submittedQuizIds.has(q.id));
    const isAdmin = Boolean(state.student && state.student.isAdmin);

    if ((isCurrentStepCompleted || isAdmin) && state.currentStepIndex < state.courseData.length - 1) {
      goToStep(state.currentStepIndex + 1);
    }
  });
}
