/**
 * UOB My Digital Space — Asynchronous Learning Platform Backend
 * Google Apps Script (Code.gs)
 * 
 * Features:
 * 1. Warning Banner at Row 1 on all operational sheets.
 * 2. Multi-level support (SD, SMP, SMA) in a centralized spreadsheet.
 * 3. Atomic Upsert on composite key (Email + Sekolah) to prevent row duplication.
 * 4. Two-Way Server-First Sync for seamless student progress resumption.
 * 5. Dynamic Header Insertion for flexible curriculum quizzes.
 */

// SPREADSHEET_ID linked to new centralized UOB My Digital Space sheet under rgcuob@gmail.com
const SPREADSHEET_ID = '1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k'; 

const SHEET_STUDENT_DATA = 'ops-student-data';
const SHEET_RESULT_SMA = 'ops-result-sma';
const SHEET_RESULT_SMP = 'ops-result-smp';
const SHEET_RESULT_SD = 'ops-result-sd';

const WARNING_BANNER = "WARNING: DO NOT EDIT OR FILTER THIS DATA. THIS IS DIRECTLY FROM HTML AS THIS WILL AFFECT HOW THE DATA BEING STORED AND SAVED !!";

// ==================== MASTER ORCHESTRATOR (DEFAULT FUNCTION) ====================
function setupAllLMSSheets() {
  const res1 = setupResultTrackingSheets();
  const res2 = populateCurriculumSheets();
  const res3 = populateChangelogSheet();
  return {
    success: true,
    resultTracking: res1,
    curriculumSheets: res2,
    changelogSheet: res3
  };
}

// ==================== GET HANDLER (AUTH & DATA FETCH) ====================
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : '';
    const ssId = (e && e.parameter && e.parameter.spreadsheet_id) || SPREADSHEET_ID;
    
    if (!ssId) {
      return respond({ success: false, message: "Spreadsheet ID belum dikonfigurasi." });
    }

    const ss = SpreadsheetApp.openById(ssId);
    ensureSheetWithWarning(ss, SHEET_STUDENT_DATA, [
      "email", "name", "rombel_name", "school_name", "grade_name", "last_login"
    ]);

    // 00. Setup Curriculum Sheets
    if (action === 'setup_all_sheets') {
      return respond(setupAllLMSSheets());
    }

    if (action === 'setup_result_sheets') {
      return respond(setupResultTrackingSheets());
    }

    if (action === 'setup_curriculum_sheets') {
      return respond(populateCurriculumSheets());
    }

    // 0. Inisialisasi Data Awal (Seed Data jika masih kosong)
    if (action === 'init_seed') {
      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 2) {
        const seedStudents = [
          ["yazid@test.com", "Ahmad Yazid", "XII MIPA 1", "SMAN 8 Jakarta", "High School"],
          ["budi.santoso@gmail.com", "Budi Santoso", "XI MIPA 2", "SMAN 8 Jakarta", "High School"],
          ["citra.lestari@gmail.com", "Citra Lestari", "VIII-A", "SMPN 1 Jakarta", "Middle School"],
          ["dimas.pratama@gmail.com", "Dimas Pratama", "5-B", "SDN Menteng 01", "Upper Primary"],
          ["eni.rahmawati@gmail.com", "Eni Rahmawati", "3-A", "SDN Menteng 01", "Lower Primary"]
        ];
        sheet.getRange(3, 1, seedStudents.length, 5).setValues(seedStudents);
        return respond({ success: true, message: "Seed data berhasil dimasukkan.", total: seedStudents.length });
      }
      return respond({ success: true, message: "Data sheet sudah ada.", total: rows.length - 2 });
    }

    // 1. Ambil daftar sekolah unik dari kolom school_name
    if (action === 'schools') {
      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      const seen = {};
      const schools = [];

      // Row 0 is warning banner, Row 1 is header, data starts at Row 2
      for (let i = 2; i < rows.length; i++) {
        const school = String(rows[i][3] || '').trim(); // Col 3: school_name
        const gradeName = String(rows[i][4] || '').trim(); // Col 4: grade_name
        if (!school || seen[school.toLowerCase()]) continue;
        seen[school.toLowerCase()] = true;
        const cur = resolveCurriculumFromGrade(gradeName);
        schools.push({ school, grade_name: gradeName, level: cur.level });
      }

      // Selalu sertakan sekolah virtual admin UOB
      const adminSchools = [
        { school: "SD UOB", grade_name: "Upper Primary", level: "SD" },
        { school: "SMP UOB", grade_name: "Middle School", level: "SMP" },
        { school: "SMA UOB", grade_name: "High School", level: "SMA" }
      ];
      adminSchools.forEach(as => {
        if (!seen[as.school.toLowerCase()]) {
          seen[as.school.toLowerCase()] = true;
          schools.push(as);
        }
      });

      schools.sort((a, b) => a.school.localeCompare(b.school));
      return respond({ success: true, schools });
    }

    // 1b. Ambil seluruh data siswa untuk sinkronisasi lokal dan pencarian cepat
    if (action === 'all_students') {
      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      const students = [];
      for (let i = 2; i < rows.length; i++) {
        const email = String(rows[i][0] || '').trim();
        const name = String(rows[i][1] || '').trim();
        const rombel = String(rows[i][2] || '').trim();
        const school = String(rows[i][3] || '').trim();
        const grade = String(rows[i][4] || '').trim();
        if (email && school) {
          students.push({
            email,
            name,
            rombel_name: rombel,
            school_name: school,
            grade_name: grade
          });
        }
      }
      return respond({ success: true, total: students.length, students });
    }

    // 2. Cari murid berdasarkan sekolah
    if (action === 'students') {
      const targetSchool = String(e.parameter.school || '').toLowerCase().trim();
      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      const students = [];

      for (let i = 2; i < rows.length; i++) {
        const email = String(rows[i][0] || '').trim();
        const name = String(rows[i][1] || '').trim();
        const rombel = String(rows[i][2] || '').trim();
        const school = String(rows[i][3] || '').trim();
        const grade = String(rows[i][4] || '').trim();

        if (school.toLowerCase() === targetSchool && email) {
          students.push({
            email,
            name,
            rombel_name: rombel,
            school_name: school,
            grade_name: grade,
            maskedEmail: maskEmail(email)
          });
        }
      }

      return respond({ success: true, students });
    }

    // 3. Validasi Login Murid / Admin (Hanya butuh nama sekolah dan email, auto-detect level dari grade_name)
    if (action === 'login') {
      const email = normalizeEmail(e.parameter.email || '');
      const school = String(e.parameter.school || '').toLowerCase().trim();
      const password = String(e.parameter.password || '').trim();

      if (!email || !school) {
        return respond({ success: false, message: "Email dan sekolah wajib diisi." });
      }

      // Akses Khusus Admin MDS (permata@mds.com)
      if (email === 'permata@mds.com') {
        const ADMIN_PASS = 'KalanantiDihati';
        if (password !== ADMIN_PASS) {
          return respond({
            success: false,
            requireAdminPassword: true,
            message: "Akses Admin memerlukan password verifikasi yang benar."
          });
        }

        let level = 'SMA';
        let gradeName = 'High School';
        let dataFile = 'courseData-highschool.json';

        if (school.includes('sd') || school.includes('primary')) {
          level = 'SD';
          gradeName = 'Upper Primary';
          dataFile = 'courseData-upperprimary.json';
        } else if (school.includes('smp') || school.includes('middle')) {
          level = 'SMP';
          gradeName = 'Middle School';
          dataFile = 'courseData-middleschool.json';
        }

        return respond({
          success: true,
          isAdmin: true,
          student: {
            email: 'permata@mds.com',
            name: 'Admin Permata (' + (school === 'sd uob' ? 'SD UOB' : school === 'smp uob' ? 'SMP UOB' : school === 'sma uob' ? 'SMA UOB' : school.toUpperCase()) + ')',
            rombel_name: 'Super Admin',
            school_name: (school === 'sd uob' ? 'SD UOB' : school === 'smp uob' ? 'SMP UOB' : school === 'sma uob' ? 'SMA UOB' : school.toUpperCase()),
            grade_name: gradeName,
            level: level,
            dataFile: dataFile
          }
        });
      }

      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      let matched = null;
      const schoolStudents = [];

      for (let i = 2; i < rows.length; i++) {
        const rEmail = normalizeEmail(rows[i][0] || ''); // Col 0: email
        const rName = String(rows[i][1] || '').trim(); // Col 1: name
        const rRombel = String(rows[i][2] || '').trim(); // Col 2: rombel_name
        const rSchool = String(rows[i][3] || '').trim(); // Col 3: school_name
        const rGrade = String(rows[i][4] || '').trim(); // Col 4: grade_name

        if (rSchool.toLowerCase() === school && rEmail) {
          schoolStudents.push({ email: rEmail, name: rName, rombel_name: rRombel, school_name: rSchool, grade_name: rGrade });

          if (rEmail === email) {
            const cur = resolveCurriculumFromGrade(rGrade);
            matched = {
              email: rEmail,
              name: rName,
              rombel_name: rRombel,
              school_name: rSchool,
              grade_name: rGrade,
              level: cur.level,
              dataFile: cur.dataFile,
              rowIndex: i + 1
            };
            break;
          }
        }
      }

      if (matched) {
        // Update Timestamp Terakhir Login (Col 6: last_login)
        sheet.getRange(matched.rowIndex, 6).setValue(new Date().toISOString());
        return respond({ success: true, student: matched });
      } else {
        // Cari email terdekat jika ada typo (Levenshtein Distance)
        let closestSuggestion = null;
        let minDistance = 999;

        for (let s of schoolStudents) {
          const dist = levenshteinDistance(email, s.email);
          if (dist < minDistance && dist <= 5) {
            minDistance = dist;
            closestSuggestion = {
              name: s.name,
              school: s.school_name,
              maskedEmail: maskEmail(s.email),
              suggestedEmail: s.email,
              distance: dist
            };
          }
        }

        return respond({
          success: false,
          message: "Email belum terdaftar untuk sekolah yang dipilih.",
          suggestion: closestSuggestion
        });
      }
    }

    // 4. Ambil Progres Tersimpan (Two-Way Server-First Sync)
    if (action === 'get_progress') {
      const email = normalizeEmail(e.parameter.email || '');
      const level = String(e.parameter.level || 'SMA').toUpperCase();
      const targetSheetName = getResultSheetName(level);
      const resSheet = ss.getSheetByName(targetSheetName);

      if (!resSheet) {
        return respond({ success: true, progress: {} });
      }

      const rows = resSheet.getDataRange().getValues();
      if (rows.length < 3) {
        return respond({ success: true, progress: {} });
      }

      const headers = rows[1]; // Row 1 adalah header kolom kuis
      let studentRow = null;

      const requestedSchool = String(e.parameter.school || '').trim().toLowerCase();
      for (let i = 2; i < rows.length; i++) {
        const rowEmail = normalizeEmail(rows[i][1]);
        const rowSchool = String(rows[i][3] || '').trim().toLowerCase();
        if (rowEmail === email && (!requestedSchool || rowSchool === requestedSchool)) {
          studentRow = rows[i];
          break;
        }
      }

      if (!studentRow) {
        return respond({ success: true, progress: {} });
      }

      const progressMap = {};
      const submittedQuizIds = [];
      for (let c = 4; c < headers.length; c++) {
        const headerName = String(headers[c] || '').trim();
        if (headerName) {
          const cellVal = studentRow[c];
          progressMap[headerName] = cellVal;
          // Only quiz score columns count as submitted quizzes.
          // Activity metadata and summary columns must never become quiz IDs.
          if (/\[Skor(?: & Jawaban)?\]/i.test(headerName) && cellVal !== '' && cellVal !== null && cellVal !== undefined) {
            const cleanId = headerName.replace(/\s*\[.*?\]\s*$/, '').trim();
            if (cleanId) submittedQuizIds.push(cleanId);
          }
        }
      }

      const watchedRaw = progressMap["_Watched Steps"] || "";
      const watchedStepIds = String(watchedRaw).split(",").map((v) => v.trim()).filter(Boolean);
      return respond({
        success: true,
        studentFound: true,
        progress: progressMap,
        data: {
          submittedQuizIds: submittedQuizIds,
          scores: progressMap,
          lastStepId: String(progressMap["_Last Step"] || "").trim(),
          watchedStepIds: watchedStepIds
        }
      });
    }

    return respond({ success: false, message: "Aksi tidak dikenal." });
  } catch (err) {
    return respond({ success: false, error: err.toString() });
  }
}

// ==================== POST HANDLER (PROGRESS & QUIZ SUBMISSION) ====================
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (ex) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    const ssId = payload.spreadsheet_id || SPREADSHEET_ID;
    if (!ssId) {
      return respond({ success: false, message: "Spreadsheet ID belum dikonfigurasi." });
    }

    const ss = SpreadsheetApp.openById(ssId);
    const email = normalizeEmail(payload.email || '');
    const name = String(payload.name || '').trim();
    const school = String(payload.school || '').trim();
    const level = String(payload.level || 'SMA').toUpperCase();

    // Branch 1: Submit Challenge
    if (payload.action === 'submit_challenge') {
      if (!email || !school) {
        return respond({ success: false, message: "Email dan sekolah wajib ada." });
      }

      const targetSheetName = getResultSheetName(level);
      const resSheet = ss.getSheetByName(targetSheetName);
      if (resSheet) {
        const rows = resSheet.getDataRange().getValues();
        for (let i = 2; i < rows.length; i++) {
          if (normalizeEmail(rows[i][1]) === email) {
            resSheet.getRange(i + 1, 1).setValue(new Date().toISOString());
            break;
          }
        }
      }

      return respond({
        success: true,
        message: "Tantangan praktik berhasil dicatat di server."
      });
    }

    // Branch 2: Activity checkpoint (last tab + completed video IDs)
    if (payload.action === 'save_activity') {
      if (!email || !school) {
        return respond({ success: false, message: "Email dan sekolah wajib ada." });
      }
      const targetSheetName = getResultSheetName(level);
      const resSheet = ensureSheetWithWarning(ss, targetSheetName, [
        "Timestamp", "Email Siswa", "Nama Siswa", "Sekolah"
      ]);
      let rows = resSheet.getDataRange().getValues();
      let headerRow = rows[1] || [];
      let studentRowIndex = -1;
      for (let i = 2; i < rows.length; i++) {
        const rEmail = normalizeEmail(rows[i][1]);
        const rSchool = String(rows[i][3] || '').trim().toLowerCase();
        if (rEmail === email && rSchool === school.toLowerCase()) {
          studentRowIndex = i + 1;
          break;
        }
      }
      if (studentRowIndex === -1) {
        studentRowIndex = Math.max(3, resSheet.getLastRow() + 1);
        resSheet.getRange(studentRowIndex, 1, 1, 4).setValues([[
          new Date().toISOString(), email, name, school
        ]]);
      } else {
        resSheet.getRange(studentRowIndex, 1, 1, 4).setValues([[
          new Date().toISOString(), email, name || rows[studentRowIndex - 1][2], school
        ]]);
      }
      const metadata = {
        "_Last Step": String(payload.lastStepId || '').trim(),
        "_Watched Steps": Array.isArray(payload.watchedStepIds)
          ? payload.watchedStepIds.join(',')
          : String(payload.watchedStepIds || '').trim()
      };
      Object.keys(metadata).forEach((headerName) => {
        let col = -1;
        for (let c = 0; c < headerRow.length; c++) {
          if (String(headerRow[c] || '').trim() === headerName) { col = c + 1; break; }
        }
        if (col === -1) {
          col = Math.max(5, headerRow.length + 1);
          resSheet.getRange(2, col).setValue(headerName);
          headerRow[col - 1] = headerName;
        }
        resSheet.getRange(studentRowIndex, col).setValue(metadata[headerName]);
      });
      return respond({ success: true, message: "Checkpoint aktivitas tersimpan." });
    }

    // Branch 3: Quiz Progress Submission
    const quizId = String(payload.quizId || '').trim();
    const answer = String(payload.answer || '').trim();
    const score = payload.score !== undefined ? payload.score : 100;
    const isCorrect = Boolean(payload.isCorrect);

    if (!email || !school || !quizId) {
      return respond({ success: false, message: "Data tidak lengkap (email, sekolah, quizId wajib ada)." });
    }

    const targetSheetName = getResultSheetName(level);
    const resSheet = ensureSheetWithWarning(ss, targetSheetName, [
      "Timestamp", "Email Siswa", "Nama Siswa", "Sekolah"
    ]);

    // Atomic Upsert: Cari baris siswa berdasarkan Email + Sekolah
    const rows = resSheet.getDataRange().getValues();
    let headerRow = rows[1]; // Row 1 adalah headers
    let studentRowIndex = -1;

    for (let i = 2; i < rows.length; i++) {
      const rEmail = normalizeEmail(rows[i][1]);
      const rSchool = String(rows[i][3] || '').trim().toLowerCase();
      if (rEmail === email && rSchool === school.toLowerCase()) {
        studentRowIndex = i + 1; // 1-indexed sheet row
        break;
      }
    }

    // Jika siswa belum ada di sheet result, buat baris baru
    if (studentRowIndex === -1) {
      studentRowIndex = resSheet.getLastRow() + 1;
      resSheet.getRange(studentRowIndex, 1, 1, 4).setValues([[
        new Date().toISOString(),
        email,
        name,
        school
      ]]);
    } else {
      // Update Timestamp aktivitas
      resSheet.getRange(studentRowIndex, 1).setValue(new Date().toISOString());
    }

    // Pastikan kolom kuis ada di header (Dynamic Header Matching/Insertion)
    const headerColumnName = `${quizId} [Skor & Jawaban]`;
    let quizColIndex = -1;
    for (let c = 0; c < headerRow.length; c++) {
      const h = String(headerRow[c] || '').trim();
      const cleanH = h.replace(/\s*\[.*?\]\s*$/, '').trim();
      if (cleanH === quizId || h.startsWith(quizId) || h === headerColumnName || h === `${quizId} [Skor]`) {
        quizColIndex = c + 1;
        break;
      }
    }

    if (quizColIndex === -1) {
      quizColIndex = headerRow.length + 1;
      resSheet.getRange(2, quizColIndex).setValue(headerColumnName);
    }

    // Tulis nilai kuis pada kolom terkait
    const resultValue = isCorrect ? (score || 100) : 0;
    resSheet.getRange(studentRowIndex, quizColIndex).setValue(resultValue);

    return respond({
      success: true,
      message: "Progres kuis berhasil disimpan secara atomic.",
      row: studentRowIndex,
      col: quizColIndex
    });
  } catch (err) {
    return respond({ success: false, error: err.toString() });
  }
}

// ==================== HELPER FUNCTIONS ====================
function ensureSheetWithWarning(ss, sheetName, defaultHeaders) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // Row 1: Warning Banner
    sheet.getRange(1, 1).setValue(WARNING_BANNER);
    sheet.getRange(1, 1, 1, defaultHeaders.length).merge();
    sheet.getRange(1, 1).setBackground('#7f1d1d').setFontColor('#ffffff').setFontWeight('bold');

    // Row 2: Default Headers
    sheet.getRange(2, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
    sheet.getRange(2, 1, 1, defaultHeaders.length).setBackground('#092764').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(2);
  } else {
    // Pastikan row 1 selalu berisi banner warning
    const val = String(sheet.getRange(1, 1).getValue() || '');
    if (!val.includes("WARNING: DO NOT EDIT OR FILTER")) {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1).setValue(WARNING_BANNER);
      sheet.getRange(1, 1, 1, Math.max(10, sheet.getLastColumn())).merge();
      sheet.getRange(1, 1).setBackground('#7f1d1d').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(2);
    }
  }
  return sheet;
}

function getResultSheetName(level) {
  switch (level) {
    case 'SMP': return SHEET_RESULT_SMP;
    case 'SD': return SHEET_RESULT_SD;
    case 'SMA':
    default: return SHEET_RESULT_SMA;
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function maskEmail(email) {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const user = parts[0];
  const domain = parts[1];
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user.slice(0, 2)}${'*'.repeat(Math.min(5, user.length - 2))}@${domain}`;
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function resolveCurriculumFromGrade(gradeName) {
  const g = String(gradeName || '').toLowerCase().trim();
  if (g.includes('primary') || g.includes('sd') || g.includes('lower') || g.includes('upper')) {
    return { level: 'SD', dataFile: 'courseData-upperprimary.json' };
  }
  if (g.includes('middle') || g.includes('smp')) {
    return { level: 'SMP', dataFile: 'courseData-middleschool.json' };
  }
  return { level: 'SMA', dataFile: 'courseData-highschool.json' };
}

function levenshteinDistance(a, b) {
  a = String(a || '').toLowerCase();
  b = String(b || '').toLowerCase();
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// ==================== RESULT TRACKING SHEETS INITIALIZER ====================
function setupResultTrackingSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const baseHeaders = [
    "Timestamp (Terakhir Aktif)",
    "Email Siswa",
    "Nama Siswa",
    "Sekolah",
    "Rombel / Kelas",
    "Progress (%)",
    "Total Skor (0-100)",
    "Grade / Predikat",
    "Kuis & Proyek Selesai",
    "Status Kelulusan"
  ];

  const configs = [
    {
      sheetName: SHEET_RESULT_SD,
      title: "Rekapitulasi Nilai & Jawaban Siswa SD (Upper Primary)",
      stepHeaders: ["bridge-sd-00 [Skor & Jawaban]", "bridge-sd-01 [Skor & Jawaban]", "up-about-1 [Skor & Jawaban]", "up-about-2 [Skor & Jawaban]", "up-about-3 [Skor & Jawaban]", "up-about-4 [Skor & Jawaban]", "up-about-5 [Skor & Jawaban]", "bridge-sd-02 [Skor & Jawaban]", "up-about-6 [Skor & Jawaban]", "up-about-7 [Skor & Jawaban]", "up-racing-1 [Skor & Jawaban]", "up-racing-2 [Skor & Jawaban]", "bridge-sd-03 [Skor & Jawaban]", "up-racing-3 [Skor & Jawaban]", "up-racing-4 [Skor & Jawaban]", "up-racing-5 [Skor & Jawaban]", "up-racing-6 [Skor & Jawaban]", "bridge-sd-04 [Skor & Jawaban]", "up-earning-1 [Skor & Jawaban]", "up-earning-2 [Skor & Jawaban]", "up-earning-3 [Skor & Jawaban]", "up-earning-4 [Skor & Jawaban]"],
      seedData: [
        [
          new Date().toISOString(),
          "dimas.pratama@gmail.com",
          "Dimas Pratama",
          "SDN Menteng 01",
          "5-B",
          "100%",
          100,
          "A (Sangat Baik)",
          "22 / 22 Selesai",
          "Lulus Bersertifikat 🎓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓"
        ]
      ]
    },
    {
      sheetName: SHEET_RESULT_SMP,
      title: "Rekapitulasi Nilai & Jawaban Siswa SMP (Middle School)",
      stepHeaders: ["ms-0-0 [Skor & Jawaban]", "ms-0-1 [Skor & Jawaban]", "ms-0-2 [Skor & Jawaban]", "ms-0-3 [Skor & Jawaban]", "bridge-ms-00 [Skor & Jawaban]", "bridge-ms-01 [Skor & Jawaban]", "ms-1-1 [Skor & Jawaban]", "ms-1-2 [Skor & Jawaban]", "ms-1-3 [Skor & Jawaban]", "ms-1-4 [Skor & Jawaban]", "ms-1-5 [Skor & Jawaban]", "ms-1-6 [Skor & Jawaban]", "ms-1-7 [Skor & Jawaban]", "ms-2-1 [Skor & Jawaban]", "ms-2-2 [Skor & Jawaban]", "ms-2-3 [Skor & Jawaban]", "ms-2-4 [Skor & Jawaban]", "ms-2-5 [Skor & Jawaban]", "ms-2-6 [Skor & Jawaban]", "ms-3-1 [Skor & Jawaban]", "ms-3-2 [Skor & Jawaban]", "ms-3-3 [Skor & Jawaban]", "bridge-ms-03 [Skor & Jawaban]", "ms-3-4 [Skor & Jawaban]", "ms-3-5 [Skor & Jawaban]", "bridge-ms-02 [Skor & Jawaban]", "ms-4-1 [Skor & Jawaban]", "ms-4-2 [Skor & Jawaban]", "ms-4-3 [Skor & Jawaban]", "ms-4-4 [Skor & Jawaban]", "ms-4-5 [Skor & Jawaban]", "ms-4-6 [Skor & Jawaban]", "ms-5-1 [Skor & Jawaban]", "ms-5-2 [Skor & Jawaban]", "ms-5-3 [Skor & Jawaban]", "ms-5-4 [Skor & Jawaban]"],
      seedData: [
        [
          new Date().toISOString(),
          "citra.lestari@gmail.com",
          "Citra Lestari",
          "SMPN 1 Jakarta",
          "VIII-A",
          "100%",
          98,
          "A (Sangat Baik)",
          "36 / 36 Selesai",
          "Lulus Bersertifikat 🎓",
          // 36 step evaluations
          "Skor: 100 | Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Selesai ✓",
          "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 95 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓",
          "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓",
          "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Capstone: Selesai ✓",
          "Skor: 100 | Selesai ✓"
        ]
      ]
    },
    {
      sheetName: SHEET_RESULT_SMA,
      title: "Rekapitulasi Nilai & Jawaban Siswa SMA (High School)",
      stepHeaders: ["hs-0-0 [Skor & Jawaban]", "bridge-hs-00 [Skor & Jawaban]", "bridge-hs-01 [Skor & Jawaban]", "hs-1-1 [Skor & Jawaban]", "bridge-hs-02 [Skor & Jawaban]", "hs-2-1 [Skor & Jawaban]", "hs-2-2 [Skor & Jawaban]", "hs-2-3 [Skor & Jawaban]", "hs-2-4 [Skor & Jawaban]", "hs-2-5 [Skor & Jawaban]", "hs-2-6 [Skor & Jawaban]", "hs-2-7 [Skor & Jawaban]", "bridge-hs-03 [Skor & Jawaban]", "hs-3-1 [Skor & Jawaban]", "hs-3-2 [Skor & Jawaban]", "hs-3-3 [Skor & Jawaban]", "hs-3-4 [Skor & Jawaban]", "bridge-hs-04 [Skor & Jawaban]", "hs-3-5 [Skor & Jawaban]", "hs-3-6 [Skor & Jawaban]", "hs-3-7 [Skor & Jawaban]", "hs-3-8 [Skor & Jawaban]", "bridge-hs-05 [Skor & Jawaban]", "hs-1-2 [Skor & Jawaban]", "hs-1-3 [Skor & Jawaban]", "hs-4-1 [Skor & Jawaban]", "hs-4-2 [Skor & Jawaban]", "hs-4-3 [Skor & Jawaban]", "hs-4-4 [Skor & Jawaban]", "hs-4-5 [Skor & Jawaban]", "hs-4-6 [Skor & Jawaban]", "hs-5-1 [Skor & Jawaban]", "hs-5-2 [Skor & Jawaban]", "hs-5-3 [Skor & Jawaban]", "hs-5-4 [Skor & Jawaban]", "hs-5-5 [Skor & Jawaban]"],
      seedData: [
        [
          new Date().toISOString(),
          "aditya.wijaya@gmail.com",
          "Aditya Wijaya",
          "SMAN 8 Jakarta",
          "X-MIPA-1",
          "100%",
          100,
          "A (Sangat Baik)",
          "36 / 36 Selesai",
          "Lulus Bersertifikat 🎓",
          // 36 step evaluations
          "Skor: 100 | Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Selesai ✓",
          "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Selesai ✓", "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓",
          "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Jawaban: Benar ✓", "Skor: 100 | Proyek: Selesai ✓", "Skor: 100 | Capstone: Selesai ✓",
          "Skor: 100 | Selesai ✓"
        ]
      ]
    }
  ];

  configs.forEach(cfg => {
    let sheet = ss.getSheetByName(cfg.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(cfg.sheetName);
    } else {
      sheet.clear();
    }

    const fullHeaders = baseHeaders.concat(cfg.stepHeaders);
    const headerRange = sheet.getRange(1, 1, 1, fullHeaders.length);
    headerRange.setValues([fullHeaders]);
    headerRange.setBackground('#092764');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 40);

    if (cfg.seedData && cfg.seedData.length > 0) {
      const dataRange = sheet.getRange(2, 1, cfg.seedData.length, cfg.seedData[0].length);
      dataRange.setValues(cfg.seedData);
      dataRange.setVerticalAlignment('middle');
      dataRange.setFontFamily('Arial');
      dataRange.setFontSize(10);
      sheet.getRange(2, 1, cfg.seedData.length, 1).setHorizontalAlignment('center');
      sheet.getRange(2, 6, cfg.seedData.length, 5).setHorizontalAlignment('center');
    }

    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(5);

    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 220);
    sheet.setColumnWidth(3, 180);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(5, 120);
    sheet.setColumnWidth(6, 110);
    sheet.setColumnWidth(7, 130);
    sheet.setColumnWidth(8, 140);
    sheet.setColumnWidth(9, 160);
    sheet.setColumnWidth(10, 180);

    for (let c = 11; c <= fullHeaders.length; c++) {
      sheet.setColumnWidth(c, 240);
    }
  });

  return {
    success: true,
    message: "Tab ops-result-sd (22 steps), ops-result-smp (36 steps), dan ops-result-sma (36 steps) berhasil diinisialisasi!"
  };
}

// ==================== CURRICULUM SHEETS POPULATOR ====================
function populateCurriculumSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const headers = [
    "No",
    "Modul ID",
    "Nama Modul",
    "Step ID",
    "Judul Step / Materi",
    "Tipe Pembelajaran",
    "Durasi / Kicker",
    "Link Media / Slide / Video",
    "Konsep & Topik yang Dipelajari",
    "Pop-up Quiz Interaktif (Waktu, Soal & Kunci)",
    "Mini Project / Hands-on Tugas Praktik",
    "Rangkuman / Cheatsheet Singkat",
    "Target Capaian & Hasil Belajar",
    "Status Kesiapan Materi"
  ];
  
  const payload = {"sd": [[1, "up-mod-00", "Modul 0: Kenalan dengan Scratch & Fondasi Interaksi", "bridge-sd-00", "Scratch dari Nol: Kenalan dengan Platformnya", "Slide Interaktif & Fondasi", "Materi Jembatan 00 · Kenalan Scratch", "./slides/bridge-sd-00.html", "Orientasi platform Scratch menggunakan referensi visual aktual dari Create & Learn.", "⏱️ [Slide Kuis #1] Checkpoint tersedia di dalam slide interaktif.\n   Pilihan: Baca ulang slide, Lanjut tanpa mencoba, Tutup materi\n   ✅ Kunci: Baca ulang slide\n   💡 Penjelasan: Baca ulang bagian yang belum jelas lalu coba lagi.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenyelesaikan pembacaan, observasi visual, dan checkpoint quiz.\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- Selamat Datang di Scratch\n- Scratch itu apa?\n- Kenali ruang kerjanya\n- Warna dan bentuk blok\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan semua slide dan checkpoint quiz.", "Siap (Slide Standalone & Live Testing Verified)"], [2, "up-mod-00", "Modul 0: Kenalan dengan Scratch & Fondasi Interaksi", "bridge-sd-01", "Dari Karakter ke Kode: Sprite, Costume, dan Event", "Slide Interaktif & Fondasi", "Materi Jembatan 01 · Sprite & Event", "./slides/bridge-sd-01.html", "Jembatan sebelum playlist About Me dengan visual Scratch aktual.", "⏱️ [Slide Kuis #1] Checkpoint tersedia di dalam slide interaktif.\n   Pilihan: Baca ulang slide, Lanjut tanpa mencoba, Tutup materi\n   ✅ Kunci: Baca ulang slide\n   💡 Penjelasan: Baca ulang bagian yang belum jelas lalu coba lagi.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenyelesaikan pembacaan, observasi visual, dan checkpoint quiz.\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- Siapkan Project About Me\n- Sprite, Costume, Backdrop\n- Event membuat project bereaksi\n- Tambahkan suara dan cerita\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan semua slide dan checkpoint quiz.", "Siap (Slide Standalone & Live Testing Verified)"], [3, "up-mod-01", "Modul 1: About Me — Karakter, Suara & Media Interaktif", "up-about-1", "1 About Me - Mendesain Karakter", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/pmSYmmRe4Sw", "Menggambar karakter personal dari kanvas kosong menggunakan Paint editor Scratch: bentuk vektor (lingkaran, kotak), warna kulit sawo matang, rambut, dan outline.", "⏱️ [00:00] Di tab mana kita bisa menggambar atau mengubah tampilan karakter/Sprite sendiri di Scratch?\n   Pilihan: Tab Costumes (Kostum), Tab Sounds (Suara), Tab Code (Kode), Tab File\n   ✅ Kunci: A (Tab Costumes (Kostum))\n   💡 Penjelasan: Tab Costumes menyediakan Paint editor untuk menggambar, mengedit bentuk vektor, dan mengubah tampilan Sprite.", "Desain Karakter Diri: Hapus Sprite kucing bawaan, buat Sprite baru via menu Paint, gambar wajah dan rambut sesuai ciri khas diri sendiri.", "Paint Editor Tools:\n- Select (panah)\n- Circle / Rectangle\n- Fill (warna isi)\n- Outline (garis tepi)", "Siswa terampil menggunakan Paint editor vektor Scratch untuk menggambar karakter diri yang orisinal.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [4, "up-mod-01", "Modul 1: About Me — Karakter, Suara & Media Interaktif", "up-about-2", "2 About Me - Merekam Suara Perkenalan Diri", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/a7VMYsnvmQY", "Pemanfaatan audio interaktif: merekam suara lewat mikrofon di Tab Sounds, memotong rekaman (trim/edit), dan menghubungkannya dengan event 'when this sprite clicked'.", "⏱️ [00:00] Blok Event apa yang digunakan agar suara perkenalan diri berbunyi saat karakter diklik oleh pengguna?\n   Pilihan: when this sprite clicked (ketika sprite ini diklik), when space key pressed, stop all, hide\n   ✅ Kunci: A (when this sprite clicked (ketika sprite ini diklik))\n   💡 Penjelasan: Blok \"when this sprite clicked\" akan mendeteksi klik mouse pada karakter dan langsung menjalankan blok pemutar suara di bawahnya.", "Rekam & Mainkan Suara: Buka tab Sounds, rekam kalimat sapaan 'Halo, namaku...', lalu pasang blok 'when this sprite clicked' -> 'play sound [rekaman] until done'.", "Tab Sounds > Record (ikon mikrofon)\nBlok Sound: play sound [rekaman] until done\nBlok Event: when this sprite clicked", "Siswa mampu merekam audio perkenalan mandiri dan memprogram respon suara saat karakter diklik.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [5, "up-mod-01", "Modul 1: About Me — Karakter, Suara & Media Interaktif", "up-about-3", "3 About Me - Membuat Kostum Makanan", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/pAWCUOSOHAk", "Konsep Multi-Costume dalam satu Sprite: membuat Sprite makanan kesukaan, menduplikasi kostum untuk membuat beberapa variasi menu favorit (apel, burger, es krim).", "⏱️ [00:00] Mengapa kita membuat beberapa Costume berbeda pada Sprite makanan yang sama?\n   Pilihan: Agar satu Sprite makanan bisa berganti-ganti tampilan menu/state yang berbeda, Agar Scratch berjalan lebih cepat, Karena satu Sprite hanya boleh memiliki satu kode saja, Untuk menghapus panggung Scratch\n   ✅ Kunci: A (Agar satu Sprite makanan bisa berganti-ganti tampilan menu/state yang berbeda)\n   💡 Penjelasan: Costume berfungsi sebagai frame atau variasi tampilan, sehingga satu Sprite makanan bisa menampilkan apel, burger, atau es krim secara bergantian.", "Koleksi Kostum Makanan: Buat Sprite baru bernama 'Makanan', lalu buat minimal 3 kostum berbeda yang menampilkan makanan favoritmu.", "Klik kanan Costume > Duplicate\nGunakan Tool Paint untuk menggambar menu berbeda pada tiap frame kostum.", "Siswa memahami konsep frame kostum dan mampu mengelola banyak kostum dalam satu Sprite.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [6, "up-mod-01", "Modul 1: About Me — Karakter, Suara & Media Interaktif", "up-about-4", "4 About Me - Memprogram Sprite Makanan", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/odzpfqdxTEc", "Logika pergantian kostum: blok 'switch costume to', 'next costume', penambahan jeda 'wait [seconds]', dan pengulangan 'repeat' agar makanan berganti-ganti secara dinamis.", "⏱️ [00:00] Blok apa yang digunakan untuk mengganti tampilan kostum ke kostum berikutnya secara berulang?\n   Pilihan: next costume di dalam blok repeat, delete this clone, broadcast message, set volume to 0%\n   ✅ Kunci: A (next costume di dalam blok repeat)\n   💡 Penjelasan: Kombinasi blok \"next costume\" di dalam \"repeat\" (dengan sedikit jeda \"wait\") membuat Sprite berganti kostum secara berurutan dan terlihat dinamis.", "Animasi Menu Makanan: Rangkai kode 'when this sprite clicked' -> 'repeat 5' -> 'next costume' -> 'wait 0.5 seconds' -> 'play sound [pop]'.", "when this sprite clicked\nrepeat (5)\n  next costume\n  wait (0.5) seconds\n  start sound [pop]", "Siswa menguasai kombinasi blok looks, control wait, dan repeat untuk menghasilkan interaksi pergantian kostum.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [7, "up-mod-01", "Modul 1: About Me — Karakter, Suara & Media Interaktif", "up-about-5", "5 About Me - Menambahkan Sprite dengan Emoji", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/EsBPZR9k4X8", "Pengayaan aset visual dengan Sprite emoji/ikon, memposisikan Sprite pada koordinat panggung (X, Y), serta mengatur ukuran (size) dan visibilitas (show/hide).", "⏱️ [00:00] Bagaimana cara meletakkan Sprite emoji di posisi tertentu pada Stage Scratch?\n   Pilihan: Mengatur koordinat posisi x (horizontal) dan y (vertikal) pada panel Sprite, Mengubah ukuran layar komputer, Menghapus backdrop sirkuit, Mematikan speaker audio\n   ✅ Kunci: A (Mengatur koordinat posisi x (horizontal) dan y (vertikal) pada panel Sprite)\n   💡 Penjelasan: Posisi setiap Sprite di Scratch ditentukan oleh koordinat X (kiri-kanan) dan Y (atas-bawah) pada panggung Stage.", "Tata Letak Emoji Hobi: Tambahkan 2-3 Sprite emoji yang mewakili hobi atau minatmu, posisikan rapi di sekitar karakter utama.", "Panel Sprite Properties:\n- X & Y (koordinat)\n- Size (ukuran persentase)\n- Direction (sudut hadap)", "Siswa memahami sistem koordinat X dan Y pada Stage serta dapat menata komposisi beberapa Sprite sekaligus.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [8, "up-mod-02", "Modul 2: Loop, Gerakan Berulang & Animasi Lanjutan", "bridge-sd-02", "Membuat Gerakan Berulang dengan Loop", "Slide Interaktif & Fondasi", "Materi Jembatan 02 · Loop & Animasi", "./slides/bridge-sd-02.html", "Jembatan loop untuk About Me dan Racing Car menggunakan blok Scratch aktual.", "⏱️ [Slide Kuis #1] Checkpoint tersedia di dalam slide interaktif.\n   Pilihan: Baca ulang slide, Lanjut tanpa mencoba, Tutup materi\n   ✅ Kunci: Baca ulang slide\n   💡 Penjelasan: Baca ulang bagian yang belum jelas lalu coba lagi.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenyelesaikan pembacaan, observasi visual, dan checkpoint quiz.\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- Mengapa butuh loop?\n- Repeat, Forever, Repeat Until\n- Gerak adalah aksi kecil\n- Costume sebagai frame\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan semua slide dan checkpoint quiz.", "Siap (Slide Standalone & Live Testing Verified)"], [9, "up-mod-02", "Modul 2: Loop, Gerakan Berulang & Animasi Lanjutan", "up-about-6", "6 About Me - Memprogram Animasi dan Menggunakan Text-to-Speech", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/8PPKejwfq4k", "Integrasi animasi gerak (Motion: move, turn) di dalam loop, sinkronisasi dengan ekstensi cerdas Text-to-Speech (TTS) agar karakter berbicara kalimat perkenalan.", "⏱️ [00:00] Apa fungsi ekstensi Text-to-Speech pada Scratch?\n   Pilihan: Mengubah teks kalimat yang kita ketik menjadi suara bicara otomatis, Menggambar mobil balap 3D, Merekam video webcam, Memperbesar ukuran browser\n   ✅ Kunci: A (Mengubah teks kalimat yang kita ketik menjadi suara bicara otomatis)\n   💡 Penjelasan: Ekstensi Text-to-Speech memanfaatkan kecerdasan buatan untuk menyuarakan teks tulisan menjadi ucapan digital interaktif.", "Karakter Bicara & Bergoyang: Pasang ekstensi Text-to-Speech, ketik teks sapaan pada blok 'speak [...]', kombinasikan dengan blok motion 'turn 15 degrees' di dalam loop repeat.", "Add Extension (+) > Text-to-Speech\nset voice to [alto / tenor]\nspeak [Halo, selamat datang di ceritaku!]", "Siswa berhasil menggabungkan animasi gerakan karakter dengan suara Text-to-Speech otomatis.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [10, "up-mod-02", "Modul 2: Loop, Gerakan Berulang & Animasi Lanjutan", "up-about-7", "7 About Me - Memprogram dengan Effects", "Video Tutorial Resmi (Kak Laras)", "Video About Me · Tutorial", "https://youtu.be/RMwzg1MtZFg", "Manipulasi efek visual interaktif pada blok Looks: efek 'color', 'fisheye', 'whirl', 'pixelate', dan penggunaan blok 'clear graphic effects' untuk reset tampilan.", "⏱️ [00:00] Blok apa yang digunakan untuk mengembalikan warna dan tampilan Sprite ke kondisi awal setelah diberi efek grafis?\n   Pilihan: clear graphic effects, switch backdrop to random, change color effect by 25, turn 15 degrees\n   ✅ Kunci: A (clear graphic effects)\n   💡 Penjelasan: Blok \"clear graphic effects\" menghapus semua modifikasi efek warna, mata ikan, atau kecerahan yang diterapkan ke Sprite.", "Efek Disko Karakter: Buat tombol atau klik event yang memutar efek warna 'change color effect by 25' di dalam loop repeat, lalu tambahkan tombol reset dengan 'clear graphic effects'.", "change [color] effect by (25)\nset [ghost] effect to (0)\nclear graphic effects", "Siswa menyelesaikan Project 1 (About Me) secara utuh dengan perpaduan desain, suara, emoji, TTS, dan efek visual.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [11, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "up-racing-1", "1 Desain Sirkuit", "Video Tutorial Resmi (Kak Laras)", "Video Racing Car · Tutorial", "https://youtu.be/qHSNKAw2tLc", "Perancangan Stage Game: Menggambar sirkuit balapan pada Backdrop menggunakan Paint editor, membuat lintasan aspal, rumput hijau di pinggir, dan jalur meliuk.", "⏱️ [00:00] Di bagian mana kita menggambar lintasan balap mobil yang menjadi latar belakang permainan?\n   Pilihan: Stage / Backdrop, Tab Sound, Extension Library, Sprite Mobil\n   ✅ Kunci: A (Stage / Backdrop)\n   💡 Penjelasan: Lintasan balap digambar pada Stage/Backdrop karena berfungsi sebagai latar statis tempat mobil-mobil balap melaju.", "Menggambar Sirkuit Balap: Pilih Stage > Backdrops, gambar lintasan sirkuit balap tertutup (looping) dengan jalan abu-abu dan rumput hijau di sekelilingnya.", "Stage > Tab Backdrops\nGunakan Brush tebal atau Shape Tool meliuk untuk membuat jalur sirkuit balap.", "Siswa mampu mendesain lingkungan sirkuit game balap yang siap digunakan untuk navigasi mobil.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [12, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "up-racing-2", "2 Desain Mobil", "Video Tutorial Resmi (Kak Laras)", "Video Racing Car · Tutorial", "https://youtu.be/QAJXUrjmetI", "Desain Karakter Top-Down: Menggambar mobil balap dari tampak atas (top-down view), mengatur proporsi bodi, ban, dan menyelaraskan titik pusat (center crosshair) di kanvas.", "⏱️ [00:00] Mengapa titik pusat (center point) Sprite mobil harus tepat berada di tengah gambar pada Paint Editor?\n   Pilihan: Agar saat mobil berbelok (berputar arah), rotasinya pas di poros tengah mobil dan tidak melayang miring, Agar warna mobil berubah menjadi emas, Supaya sirkuit otomatis terhapus, Karena Scratch melarang menggambar di tepi\n   ✅ Kunci: A (Agar saat mobil berbelok (berputar arah), rotasinya pas di poros tengah mobil dan tidak melayang miring)\n   💡 Penjelasan: Titik pusat kanvas menentukan titik poros putaran Sprite saat menjalankan blok perpindahan sudut atau kemudi.", "Desain Mobil Top-Down: Buat Sprite baru bernama 'Mobil 1', gambar badan mobil tampak atas, 4 roda hitam, dan pastikan titik tengah mobil tepat di tanda silang pusat.", "Kanvas Paint Editor:\n- Perhatikan tanda silang (+) di tengah\n- Moncong mobil hadap ke kanan (arah 90 derajat)", "Siswa mampu menggambar aset sprite mobil top-down dengan titik rotasi seimbang.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [13, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "bridge-sd-03", "Input, Sensing, dan Keputusan di Racing Car", "Slide Interaktif & Fondasi", "Materi Jembatan 03 · Sensing & Kontrol", "./slides/bridge-sd-03.html", "Jembatan sebelum coding Racing Car dengan blok Scratch aktual.", "⏱️ [Slide Kuis #1] Checkpoint tersedia di dalam slide interaktif.\n   Pilihan: Baca ulang slide, Lanjut tanpa mencoba, Tutup materi\n   ✅ Kunci: Baca ulang slide\n   💡 Penjelasan: Baca ulang bagian yang belum jelas lalu coba lagi.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenyelesaikan pembacaan, observasi visual, dan checkpoint quiz.\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- Game membutuhkan input\n- Gerak dan pengulangan\n- Sensing bertanya kepada game\n- If membuat aturan\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan semua slide dan checkpoint quiz.", "Siap (Slide Standalone & Live Testing Verified)"], [14, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "up-racing-3", "3 Kode Mobil", "Video Tutorial Resmi (Kak Laras)", "Video Racing Car · Tutorial", "https://youtu.be/lIekdk-dDTw", "Pemrograman Kontrol Kemudi Mobil 1: Menggunakan loop 'forever', kombinasi 'if key [up arrow] pressed' -> 'move 5 steps', serta tombol panah kiri/kanan untuk 'turn 5 degrees'.", "⏱️ [00:00] Blok Motion apa yang digunakan untuk mengubah sudut hadap mobil balap saat tombol panah kiri atau kanan ditekan?\n   Pilihan: turn right / turn left atau point in direction, set size to 100%, say Hello for 2 seconds, ask and wait\n   ✅ Kunci: A (turn right / turn left atau point in direction)\n   💡 Penjelasan: Blok \"turn\" (berbelok sejumlah derajat) atau \"point in direction\" digunakan untuk mengarahkan moncong mobil ke arah belokan yang diinginkan.", "Memprogram Kemudi Mobil 1: Susun blok kontrol kemudi di dalam forever loop sehingga mobil melaju maju saat tombol panah atas ditekan dan berbelok saat panah kiri/kanan ditekan.", "forever\n  if <key [up arrow] pressed?> then (move (5) steps)\n  if <key [left arrow] pressed?> then (turn ccw (5) degrees)\n  if <key [right arrow] pressed?> then (turn cw (5) degrees)", "Siswa berhasil memprogram kemudi mobil balap yang responsif dan mulus di sirkuit.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [15, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "up-racing-4", "4 Duplikasi dan Modifikasi Mobil 2", "Video Tutorial Resmi (Kak Laras)", "Video Racing Car · Tutorial", "https://youtu.be/3zubM7bbNTI", "Game Multiplayer 2 Pemain: Menduplikasi Sprite Mobil 1 menjadi Mobil 2, mengubah warna bodi mobil, dan mengadaptasi tombol pengendali keyboard ke tombol W, A, S, D.", "⏱️ [00:00] Setelah menduplikasi Sprite Mobil 1 menjadi Mobil 2, apa perubahan utama yang wajib dilakukan pada kodenya?\n   Pilihan: Mengganti tombol keyboard pengendalinya (misalnya tombol W-A-S-D untuk Mobil 2) agar tidak bentrok dengan Tombol Panah Mobil 1, Menghapus semua kode gerak Mobil 2, Menghapus seluruh panggung sirkuit, Mengubah bahasa Scratch menjadi bahasa lain\n   ✅ Kunci: A (Mengganti tombol keyboard pengendalinya (misalnya tombol W-A-S-D untuk Mobil 2) agar tidak bentrok dengan Tombol Panah Mobil 1)\n   💡 Penjelasan: Dalam game balap 2 pemain, pemain kedua harus diberi tombol kontrol terpisah (seperti W, A, S, D) agar kedua mobil bisa dikemudikan bersamaan.", "Perakitan Mobil 2: Duplikasi Mobil 1, ganti warnanya menjadi biru/kuning, ubah tombol kemudi menjadi W (maju), A (belok kiri), D (belok kanan), dan atur posisi start berdampingan.", "Mobil 1: Tombol Panah (Arrow Keys)\nMobil 2: Tombol Huruf (W, A, S, D)\nAtur posisi awal: go to x:... y:... saat green flag diklik.", "Siswa mampu merekayasa ulang kode untuk mendukung mode game balap multiplayer dua pemain.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [16, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "up-racing-5", "5 Desain Finish Line", "Video Tutorial Resmi (Kak Laras)", "Video Racing Car · Tutorial", "https://youtu.be/sm1DkpQpRxw", "Tujuan Permainan (Game Objective): Mendesain Sprite Garis Finish bermotif kotak-kotak hitam-putih (checkered flag) dan menempatkannya melintang di sirkuit.", "⏱️ [00:00] Apa fungsi utama Sprite garis finish (finish line) yang diletakkan melintang di lintasan?\n   Pilihan: Sebagai penanda batas akhir sirkuit untuk mendeteksi sentuhan mobil saat balapan selesai, Menghias warna panggung agar terlihat gelap, Mempercepat koneksi internet, Mengganti lagu pengiring\n   ✅ Kunci: A (Sebagai penanda batas akhir sirkuit untuk mendeteksi sentuhan mobil saat balapan selesai)\n   💡 Penjelasan: Garis finish dibuat sebagai Sprite target agar blok Sensing nantinya dapat mendeteksi apakah mobil sudah menyentuhnya.", "Membuat Garis Finish: Gambar Sprite garis finish bermotif kotak hitam putih, posisikan melintang di titik awal/akhir sirkuit.", "Sprite Finish Line: Buat kotak hitam putih selang-seling melintang lebar jalan sirkuit.", "Siswa dapat mendesain elemen target permainan yang berfungsi sebagai checkpoint sensorik.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [17, "up-mod-03", "Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan", "up-racing-6", "6 Kode Menang dan Menyentuh Musuh", "Video Tutorial Resmi (Kak Laras)", "Video Racing Car · Tutorial", "https://youtu.be/qnzD9G15BqE", "Logika Kemenangan & Game Over: Blok Sensing 'touching Finish Line?', menampilkan teks ucapan pemenang ('Mobil 1 Menang!'), memainkan efek suara selebrasi, dan blok 'stop all'.", "⏱️ [00:00] Blok Sensing dan Control apa yang digunakan bersamaan untuk mengecek secara terus-menerus apakah mobil menyentuh garis finish?\n   Pilihan: forever berisi if touching [Finish Line]? then ..., repeat 10 kali berisi say Hello, wait 5 seconds lalu stop all, when I receive start game\n   ✅ Kunci: A (forever berisi if touching [Finish Line]? then ...)\n   💡 Penjelasan: Pengulangan \"forever\" yang membungkus percabangan \"if touching Finish Line?\" memastikan pengecekan tabrakan aktif di setiap detik balapan.", "Aturan Menang & Tabrakan: Lengkapi kode mobil dengan pengecekan: jika menyentuh rumput sirkuit kurangi kecepatan; jika menyentuh garis finish umumkan pemenang dan hentikan permainan.", "if <touching [Finish Line]?> then\n  say [Mobil 1 Menang! 🏆] for (2) secs\n  stop [all]\nif <touching color [#hijau-rumput]?> then (move (-3) steps)", "Siswa menyelesaikan Project 2 (Racing Car Game) secara lengkap dan dapat dimainkan bersama kawan.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [18, "up-mod-04", "Modul 4: Proyek Integratif — Variabel, Broadcast & Percabangan", "bridge-sd-04", "Variable, Broadcast, dan Project Integratif", "Slide Interaktif & Fondasi", "Materi Jembatan 04 · Variabel & Broadcast", "./slides/bridge-sd-04.html", "Jembatan sebelum Increase Your Earnings dengan visual blok Scratch aktual.", "⏱️ [Slide Kuis #1] Checkpoint tersedia di dalam slide interaktif.\n   Pilihan: Baca ulang slide, Lanjut tanpa mencoba, Tutup materi\n   ✅ Kunci: Baca ulang slide\n   💡 Penjelasan: Baca ulang bagian yang belum jelas lalu coba lagi.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenyelesaikan pembacaan, observasi visual, dan checkpoint quiz.\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- Variable adalah kotak nilai\n- Atur nilai awal\n- Broadcast adalah pesan\n- Backdrop adalah babak cerita\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan semua slide dan checkpoint quiz.", "Siap (Slide Standalone & Live Testing Verified)"], [19, "up-mod-04", "Modul 4: Proyek Integratif — Variabel, Broadcast & Percabangan", "up-earning-1", "1. Percakapan Intro", "Video Tutorial Resmi (Kak Laras)", "Video Increase Your Earnings · Capstone", "https://youtu.be/5u7OdPWmJhU", "Remix Starter Project & Alur Cerita: Membuka starter project tema karir/finansial 'Increase Your Earnings', memahami struktur dialog antar-karakter, konsep kredit awal, dan briefing alur pilihan.", "⏱️ [00:00] Mengapa kita melakukan \"Remix\" pada project starter Increase Your Earnings di Scratch?\n   Pilihan: Untuk menyalin project awal yang sudah memiliki aset dan dialog ke akun kita, lalu memprogram logikanya sendiri, Untuk menghapus project milik orang lain, Karena Scratch tidak bisa membuat project baru, Untuk mengunduh aplikasi Scratch Desktop\n   ✅ Kunci: A (Untuk menyalin project awal yang sudah memiliki aset dan dialog ke akun kita, lalu memprogram logikanya sendiri)\n   💡 Penjelasan: Fitur Remix menyalin starter code dan aset lengkap ke workspace kita sehingga kita bisa langsung fokus menambahkan kode interaktif.", "Remix Starter Project: Buka link starter project Increase Your Earnings, klik tombol 'Remix', dan pelajari daftar Sprite dan Backdrop yang telah disiapkan.", "Tombol 'Remix' (kanan atas Scratch)\nPeriksa Sprite: Karakter Utama, Tombol Opsi, Toko, Kantor", "Siswa dapat mengelola dan memodifikasi project starter remix di lingkungan Scratch.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [20, "up-mod-04", "Modul 4: Proyek Integratif — Variabel, Broadcast & Percabangan", "up-earning-2", "2. Memprogram Opsi 1", "Video Tutorial Resmi (Kak Laras)", "Video Increase Your Earnings · Capstone", "https://youtu.be/rb8wuLoVnic", "Pilihan Interaktif & Manajemen Layar: Memprogram tombol pilihan karir/aktivitas, mengubah tampilan scene dengan 'switch backdrop to', menyembunyikan/menampilkan tombol dengan 'show' dan 'hide'.", "⏱️ [00:00] Saat pemain memilih salah satu pekerjaan/opsi pada cerita, bagaimana cara memindahkan tampilan ke tempat kerja yang sesuai?\n   Pilihan: Menggunakan blok switch backdrop to [Nama Tempat Kerja], Mengganti nama akun Scratch, Menghapus semua blok perintah, Memutar lagu berulang-ulang\n   ✅ Kunci: A (Menggunakan blok switch backdrop to [Nama Tempat Kerja])\n   💡 Penjelasan: Blok \"switch backdrop to ...\" digunakan untuk mengubah scene atau latar belakang sesuai keputusan yang dipilih pemain.", "Memprogram Pilihan 1: Saat tombol opsi 1 diklik, sembunyikan tombol pilihan, ganti backdrop ke lokasi kerja, dan tampilkan karakter sedang bekerja.", "when this sprite clicked\nhide\nswitch backdrop to [Tempat_Kerja]\nbroadcast [mulai_kerja]", "Siswa menguasai manajemen perpindahan scene dan visibilitas elemen berdasarkan pilihan pengguna.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [21, "up-mod-05", "Modul 5: Increase Your Earnings — Capstone & Ending", "up-earning-3", "3. Memprogram Opsi 2", "Video Tutorial Resmi (Kak Laras)", "Video Increase Your Earnings · Capstone", "https://youtu.be/t5YIkeWux3U", "Penghitungan Nilai Dinamis: Menambahkan poin kredit penghasilan dengan blok 'change [Kredit] by [angka]', logika percabangan bersyarat, dan interaksi aktivitas kerja.", "⏱️ [00:00] Konsep pemrograman apa yang digunakan untuk mencatat dan menambah jumlah uang/kredit penghasilan yang didapatkan karakter?\n   Pilihan: Variable (misalnya variable Credit/Penghasilan), Backdrop Switcher, Sound Pitch, Pen Color\n   ✅ Kunci: A (Variable (misalnya variable Credit/Penghasilan))\n   💡 Penjelasan: Variable bertindak sebagai wadah penyimpan angka yang nilainya dapat bertambah atau berkurang sesuai aktivitas karakter.", "Akumulasi Kredit: Buat variabel 'Kredit', atur nilai awal ke 0, dan setiap aktivitas kerja terselesaikan, tambahkan kredit sebesar 25 poin.", "change [Kredit] by (25)\nsay (join [Kreditmu bertambah! Total: ] [Kredit]) for (2) secs", "Siswa dapat mengimplementasikan variabel penghasilan yang bertambah secara dinamis berdasarkan keputusan pemain.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"], [22, "up-mod-05", "Modul 5: Increase Your Earnings — Capstone & Ending", "up-earning-4", "4. Memprogram Ending", "Video Tutorial Resmi (Kak Laras)", "Video Increase Your Earnings · Capstone", "https://youtu.be/A1SrFU4pDY4", "Evaluasi Akhir Cerita & Ending Bercabang: Mengirim sinyal 'broadcast [ending]', mengecek total kredit akhir dengan 'if-then-else' (apakah mencapai target finansial), dan menampilkan pesan penutup reflektif.", "⏱️ [00:00] Apa fungsi sinyal \"broadcast\" yang dikirimkan saat permainan mencapai akhir cerita?\n   Pilihan: Mengirimkan pesan ke seluruh Sprite dan Backdrop secara bersamaan agar memicu aksi penutup/ending, Mengunci keyboard komputer, Menghapus file di Google Drive, Memulai ulang komputer\n   ✅ Kunci: A (Mengirimkan pesan ke seluruh Sprite dan Backdrop secara bersamaan agar memicu aksi penutup/ending)\n   💡 Penjelasan: Broadcast mengirimkan pesan radio ke seluruh Sprite. Sprite penerima yang memiliki blok \"when I receive [ending]\" akan langsung merespons secara serentak.", "Babak Akhir Permainan: Rangkai logika ending: jika Kredit >= 50 maka tampilkan backdrop Sukses Finansial & piala; jika belum maka tampilkan pesan motivasi untuk mencoba lagi.", "when I receive [ending]\nif < [Kredit] > (50) > then\n  switch backdrop to [Pemenang_Sukses]\n  play sound [cheer] until done\nelse\n  switch backdrop to [Coba_Lagi]", "Siswa menuntaskan Capstone Project Integratif SD secara paripurna dengan logika keputusan dan ending interaktif.", "Siap (Video Tutorial Kak Laras & Kuis Aktif)"]], "smp": [[1, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-0", "Introduction to Async Learning", "Slide Interaktif & Video Orientasi", "Video 00 · Orientasi", "https://youtu.be/yxmLOk5vcFg", "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, cheat sheet, dan panduan fasilitas belajar.", "⏱️ [00:45] Kapan pop-up quiz interaktif akan muncul saat kamu menonton video materi?\n   Pilihan: A. Hanya setelah kamu menyelesaikan semua modul 1 sampai 5, B. Di tengah-tengah pemutaran video secara otomatis pada checkpoint konsep penting, C. Hanya jika kamu menekan tombol skip, D. Tidak akan pernah muncul kuis\n   ✅ Kunci: B", "Eksplorasi Platform: Membuka dashboard LMS, mencoba switcher slide dan video, mempelajari panduan perangkat.", "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri", "Siswa memahami aturan dan ritme pembelajaran mandiri serta siap menggunakan platform LMS.", "Siap (Wadah & Video Orientasi)"], [2, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-1", "Sign In ke MIT App Inventor", "Video Tutorial Resmi (Kak Laras)", "Persiapan Alat · Sign In", "https://youtu.be/tT1FtLbLqkE", "Panduan Sign In ke MIT App Inventor (ai2.appinventor.mit.edu), autentikasi akun Google, menyetujui izin Terms of Service.", "⏱️ [03:40] Jika kamu memilih opsi 'Continue Without An Account' di MIT App Inventor, apa yang harus kamu catat dan simpan baik-baik agar proyekmu tidak hilang?\n   Pilihan: A. Password email orang tua, B. 4 kata unik 'Revisit Code' (contoh: TOO-DECK-IRA-EGO), C. Screenshot layar desktop saja, D. Nomor handphone teman\n   ✅ Kunci: 1", "Hands-on Akun: Membuka browser, login ke ai2.appinventor.mit.edu dengan akun Google, dan membuat proyek kosong bernama 'Latihan01'.", "1. Buka ai2.appinventor.mit.edu\n2. Klik 'Create Apps!'\n3. Login dengan akun Google\n4. Klik 'Continue' melewati welcome dialog", "Siswa berhasil login dan membuka workspace proyek perdana di MIT App Inventor.", "Siap (Video Tutorial Kak Laras)"], [3, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-2", "Mendesain User Interface (UI)", "Video Tutorial Resmi (Kak Laras)", "Desain Antarmuka · UI Designer", "https://youtu.be/5M9jTl5pPsI", "Eksplorasi antarmuka MIT App Inventor: Menu Bar, Project List, tombol Switcher Designer View vs Blocks Editor, panel Properties.", "⏱️ [05:00] Di bagian mana pada Designer Workspace kita dapat mengatur warna latar belakang (BackgroundColor), ukuran huruf (FontSize), dan teks tombol?\n   Pilihan: A. Palette (kolom kiri), B. Viewer (layar HP), C. Properties (kolom kanan), D. Media\n   ✅ Kunci: 2\n⏱️ [14:10] Fitur apa di menu App Inventor yang digunakan untuk menguji tampilan aplikasi secara langsung di smartphone Android?\n   Pilihan: A. Connect -> AI Companion, B. Build -> App (save .apk to computer), C. Projects -> Import project, D. Help -> About\n   ✅ Kunci: 0", "Hands-on Designer: Mengenal layout antarmuka, mengubah nama screen, dan mengeksplorasi tombol Designer dan Blocks.", "- Designer View: Merancang tampilan visual aplikasi\n- Blocks Editor: Menyusun logika & perilaku tombol\n- Projects > Start new project", "Siswa mengenali fungsi navigasi utama di App Inventor dan memahami perbedaan Designer vs Blocks.", "Siap (Video Tutorial Kak Laras)"], [4, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-3", "Publish Proyek App Inventor ke Gallery", "Video Tutorial Resmi (Kak Laras)", "Portofolio Digital · Gallery", "https://youtu.be/_aAQ8nFUAqc", "Mengenal Palette dan Komponen UI: Menarik Button, Label, TextBox, Image dari Palette ke Viewer, mengatur Text & Background.", "⏱️ [02:00] Bagaimana cara mempublikasikan aplikasi yang sudah selesai ke etalase publik MIT App Inventor Gallery?\n   Pilihan: A. Kirim email ke tim MIT satu per satu, B. Centang nama proyek di 'My Projects', lalu klik tombol 'Publish to Gallery', C. Foto layar laptop lalu kirim ke WhatsApp, D. Hapus proyek lalu buat ulang\n   ✅ Kunci: 1", "Hands-on UI Dasar: Menarik 1 Button dan 1 Label ke Viewer, mengganti warna teks menjadi Navy Blue dan ukuran font 18.", "- Palette: Gudang komponen (User Interface, Layout, Storage)\n- Viewer: Layar simulasi HP\n- Components: Daftar hierarki elemen", "Siswa mampu menyusun komponen User Interface dasar di layar Viewer dan mengubah properti teks.", "Siap (Video Tutorial Kak Laras)"], [5, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "bridge-ms-00", "Panduan Lengkap MIT App Inventor & Uji Proyek Pertamaku", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 00 · Desain UI & Blok Logika SMP", "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-00.html", "Panduan komprehensif membuka MIT App Inventor di browser, memahami 4 panel utama Designer (Palette, Viewer, Components, Properties), merakit balok di Blocks Editor, dan menguji aplikasi di HP via AI2 Companion secara langsung.\n\nTujuan Pembelajaran:\n• Mengenal ekosistem MIT App Inventor (Browser Designer + Blocks Editor + AI Companion)\n• Memahami anatomi 4 panel Designer: Palette, Viewer, Components, dan Properties\n• Merakit balok logika event handler sederhana (when Button.Click)\n• Menghubungkan proyek ke HP menggunakan AI2 Companion untuk live testing", "⏱️ [Slide Kuis #1] Di bagian manakah kita mengatur warna tombol dan ukuran teks?\n   Pilihan: A. Palette, B. Viewer, C. Properties, D. Blocks Built-in\n   ✅ Kunci: C. Properties\n   💡 Penjelasan: Kolom Properties di sebelah kanan digunakan untuk mengatur atribut visual komponen.\n⏱️ [Slide Kuis #2] Di manakah kita merakit logika balok agar tombol bisa bereaksi saat ditekan jari?\n   Pilihan: A. Di Blocks Editor (layar perakitan balok), B. Di Google Drive, C. Di Pengaturan HP, D. Di Palette User Interface\n   ✅ Kunci: A. Di Blocks Editor (layar perakitan balok)\n   💡 Penjelasan: Blocks Editor adalah ruang kerja khusus menyusun balok logika event-driven.", "SIMULASI INTERAKTIF MANDIRI 💻\nSimulasi interaktif tombol klik mengubah label sapaan di simulator layar HP\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Pengenalan App Inventor SMP\n- 2. Mengapa Belajar App Inventor?\n- 3. Cara Kerja Ekosistem Browser & HP\n- 4. Langkah 1: Login Akun Google\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan seluruh tur platform dan menjawab kuis panel Designer dengan benar", "Siap (Slide Standalone & Live Testing Verified)"], [6, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "bridge-ms-01", "Event Tombol, Properti, dan Variabel Blok", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 01 · Pengantar Koding SMP", "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-01.html", "Pahami konsep Event-Driven Programming di App Inventor: komputer menunggu kejadian (when Button.Click) sebelum bertindak. Pelajari cara mengambil input dari TextBox.Text, menggabungkannya dengan blok join, menampilkannya di Label.Text, dan menyimpan nilai ke variabel blok.\n\nTujuan Pembelajaran:\n• Menjelaskan konsep Event-Driven: aplikasi menunggu kejadian sebelum beraksi\n• Menggunakan blok when Button.Click do sebagai pintu masuk aksi\n• Membaca input teks dari komponen TextBox.Text dan menampilkan output ke Label.Text\n• Menggabungkan potongan teks dengan blok join dan menyimpan ke variabel blok sementara", "⏱️ [Slide Kuis #1] Kapan balok-balok yang diletakkan di dalam when Button1.Click do akan dijalankan?\n   Pilihan: A. Setiap 1 detik sekali secara otomatis, B. Hanya saat tombol ditekan oleh jari pengguna, C. Saat laptop ditutup, D. Saat proyek baru dibuat di Designer\n   ✅ Kunci: B. Hanya saat tombol ditekan oleh jari pengguna\n   💡 Penjelasan: Balok event handler hanya aktif mengeksekusi isinya saat tombol ditekan oleh pengguna.", "SIMULASI INTERAKTIF MANDIRI 💻\nMerakit blok tombol sapaan yang menggabungkan nama dari TextBox\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Bagaimana Aplikasi Bereaksi?\n- 2. Blok Emas: when Button.Click\n- 3. Membaca Input: TextBox.Text\n- 4. Menampilkan Output: Label.Text\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menjawab kuis urutan eksekusi blok event dan fungsi join", "Siap (Slide Standalone & Live Testing Verified)"], [7, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-1", "Input Aman", "Video Interaktif & Kuis", "Checkpoint 01 · Input", "https://youtu.be/UhutS4BVKhk", "Input Aman & Validasi Form: Event handling Button.Click, membaca teks TextBox, logika pengecekan form kosong (is empty string).", "⏱️ [22:17] Kamu membuat aplikasi data anggota klub sekolah. Kolom nama wajib diisi. Kondisi mana yang paling tepat untuk mengecek nama kosong?\n   ✅ Kunci: B. Jika TextBoxNama.Text = \"\".", "Latihan Event Handling: Menulis blok when Button.Click yang mengecek apakah TextBoxNama kosong.", "when Button1.Click do\n  if is empty TextBox1.Text then\n    set LabelStatus.Text to 'Mohon isi data!'", "Siswa dapat memvalidasi form agar aplikasi tidak error saat pengguna belum memasukkan teks.", "Siap (Video Terverifikasi & Kuis Aktif)"], [8, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-2", "Mini Project Form Aman", "Proyek Mandiri Form Aman", "Checkpoint 01 · Mini Project", "https://youtu.be/UhutS4BVKhk", "Membuat antarmuka input nomor & nama dengan tombol validasi dan label feedback visual berwarna hijau/merah.", "⏱️ [00:00] Blok apa yang digunakan untuk memeriksa apakah TextBox input nama masih dalam keadaan kosong?\n   Pilihan: A. is number?, B. is empty (dari kelompok Text), C. length of list, D. random integer\n   ✅ Kunci: B", "MINI PROJECT 01: Form Registrasi Aman 📱\nTugas Siswa:\n1. Buka App Inventor, rancang antarmuka form (TextBoxNama, TextBoxNomor, ButtonKirim, LabelPesan)\n2. Atur properti TextBoxNomor menjadi 'NumbersOnly'\n3. Buat blok logika validasi form kosong\n4. Beri feedback warna hijau jika sukses, merah jika salah.\nOutput: Form pendaftaran aman anti-kosong.", "Desain: TextBox (Nama), TextBox (Nomor), Button (Kirim), Label (Pesan Error)\nBlok: Validasi panjang karakter & jenis angka.", "Siswa menghasilkan antarmuka form aman pertama di MIT App Inventor.", "Siap (Framework Proyek & Penilaian)"], [9, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-3", "Flowchart Logika Data", "Video Interaktif & Kuis", "Checkpoint 03 · Flowchart", "https://youtu.be/UhutS4BVKhk", "Flowchart & Alur Logika Data: Simbol terminator (Mulai/Selesai), proses (Persegi panjang), keputusan (Belah ketupat), input/output (Jajar genjang).", "⏱️ [34:37] Mini Quiz: Urutan Flowchart Kamu membuat aplikasi cek umur. Aplikasi harus menerima umur, memastikan umur angka, lalu menampilkan kategori. Urutan yang paling masuk akal adalah...\n   ✅ Kunci: 1", "Latihan Menggambar Flowchart: Membuat diagram alur keputusan validasi form sebelum diimplementasikan ke blok.", "Mulai -> Input Data -> Apakah Data Valid? [Ya -> Proses -> Simpan / Tidak -> Tampilkan Error] -> Selesai", "Siswa mampu merancang alur algoritma aplikasi ke dalam bentuk flowchart standar sebelum membuat kode blok.", "Siap (Video Terverifikasi & Kuis Aktif)"], [10, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-4", "Data & Privacy App", "Video Interaktif & Kuis", "Checkpoint 04 · Data", "https://youtu.be/UhutS4BVKhk", "Data & Privacy App: Etika perlindungan data pribadi, prinsip kerahasiaan password dan PIN, masking karakter dengan tanda bintang (*).", "⏱️ [42:47] Mini Quiz: Data Privacy Kamu membuat aplikasi penghitung uang saku. Aplikasi hanya perlu tahu nominal uang saku dan pengeluaran. Data mana yang tidak perlu diminta?\n   ✅ Kunci: 2", "Latihan Masking Data: Mengatur properti password masking pada kolom input rahasia.", "Properti TextBox:\n- Set 'NumbersOnly' = true untuk input nominal uang\n- Masking data sensitif", "Siswa menyadari pentingnya privasi data dan menerapkan pembatasan input yang aman pada aplikasi.", "Siap (Video Terverifikasi & Kuis Aktif)"], [11, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-5", "Mini Project Cek Pesan Aman", "Proyek Mandiri Cek Pesan Aman", "Checkpoint 05 · Mini Project", "https://youtu.be/UhutS4BVKhk", "Membangun aplikasi pendeteksi pesan phishing/tautan mencurigakan menggunakan percabangan kata kunci sensitif.", "⏱️ [00:00] Blok apa yang digunakan untuk mengecek apakah suatu pesan teks mengandung potongan kata 'minta password'?\n   Pilihan: A. text length, B. contains text piece (dari menu Text), C. split at spaces, D. upcase text\n   ✅ Kunci: B", "MINI PROJECT 02: Aplikasi Pendeteksi Pesan Phishing 🛡️\nTugas Siswa:\n1. Sediakan TextBox untuk mem-paste teks pesan yang mencurigakan\n2. Gunakan blok Text 'contains text piece' untuk mencari kata kunci bahaya ('minta OTP', 'klik link ini', 'hadiah undian')\n3. Tampilkan kartu peringatan merah 'Waspada Penipuan!' jika kata kunci terdeteksi.\nOutput: Alat pemindai pesan penipuan digital sederhana.", "if contains text (TextBoxPesan.Text) piece ('minta password') then\n  set LabelWarning.Text to 'WASPADA PHISHING!'", "Siswa menghasilkan aplikasi pendeteksi pesan penipuan digital interaktif.", "Siap (Framework Proyek & Penilaian)"], [12, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-6", "Eksplorasi Data Pribadi", "Video Interaktif & Kuis", "Checkpoint 01 · Mulai di sini", "https://youtu.be/cWfbcaSg7Eo", "Eksplorasi Data Pribadi: Menelaah jenis data publik (nama display) vs data rahasia (NIK, password, OTP, data perbankan).", "⏱️ [08:03] Manakah di bawah ini yang merupakan Data Pribadi SENSITIF?\n   Pilihan: Warna kesukaanmu, Nomor Induk Kependudukan (NIK), Merek sepatu yang sering kamu pakai\n   ✅ Kunci: Nomor Induk Kependudukan (NIK)\n⏱️ [12:15] Aplikasi apa yang wajar dan masuk akal jika meminta izin mengakses Microphone (Mic)?\n   Pilihan: Aplikasi Perekam Suara (Voice Note), Aplikasi Senter HP, Aplikasi Kalkulator\n   ✅ Kunci: Aplikasi Perekam Suara (Voice Note)\n⏱️ [14:45] Di manakah sebaiknya kamu menaruh 'Password Akun Game'-mu?\n   Pilihan: Di profil Bio Instagram (Publik), Di catatan/brankas yang aman (Sensitif), Di grup WhatsApp kelas (Publik)\n   ✅ Kunci: Di catatan/brankas yang aman (Sensitif)", "Analisis Kasus Keamanan: Mengidentifikasi bahaya kebocoran data pada skenario aplikasi game palsu.", "Prinsip Keamanan:\nJangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun, termasuk pihak yang mengaku staf/admin.", "Siswa memiliki literasi digital yang kuat mengenai perlindungan identitas pribadi.", "Siap (Video Terverifikasi & Kuis Aktif)"], [13, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-7", "Etika dan Tanggung Jawab Digital", "Video Interaktif & Kuis", "Checkpoint 02", "https://youtu.be/cWfbcaSg7Eo", "Etika dan Tanggung Jawab Digital: Menghormati hak cipta konten, tidak membuat aplikasi berbahaya (spam/malware), etika programmer.", "⏱️ [21:13] Jika ada seseorang menelepon mengaku dari pihak Bank dan meminta nomor PIN ATM-mu, apa yang harus kamu lakukan?\n   Pilihan: Berikan PIN-nya agar masalah cepat selesai, Matikan telepon, Bank tidak pernah meminta PIN nasabah, Berikan setengah PIN saja\n   ✅ Kunci: Matikan telepon, Bank tidak pernah meminta PIN nasabah\n⏱️ [23:28] INFO: Latihan Praktik 💻\n⏱️ [25:48] Manakah password di bawah ini yang paling kuat dan aman dari serangan hacker?\n   Pilihan: 12345678, namakucingku, G@r0d4_B1rU!99\n   ✅ Kunci: G@r0d4_B1rU!99\n⏱️ [28:20] Mengapa kita menggunakan blok 'is empty' saat memproses form Login?\n   Pilihan: Untuk menghapus password pengguna, Untuk mencegah pengguna mengirim form jika belum mengisi password, Untuk mengecek apakah HP kehabisan baterai\n   ✅ Kunci: Untuk mencegah pengguna mengirim form jika belum mengisi password", "Refleksi Etika Digital: Menyusun 3 prinsip komitmen pengembang aplikasi yang bertanggung jawab.", "Tanggung Jawab Kreator Digital:\n1. Transparan penggunaan izin aplikasi\n2. Menjaga data pengguna\n3. Bermanfaat untuk masyarakat", "Siswa menginternalisasi norma etika pengembangan software yang bertanggung jawab.", "Siap (Video Terverifikasi & Kuis Aktif)"], [14, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-1", "PERCABANGAN GANDA", "Video Interaktif & Kuis", "Checkpoint 01 · Logika di Dunia Nyata", "https://youtu.be/tDkIcceTzII", "Percabangan Ganda di Dunia Nyata: Logika pengambilan keputusan dengan multi-syarat (kondisi A, kondisi B, atau kondisi default).", "⏱️ [05:31] Apa fungsi dari blok ELSE?\n   Pilihan: A. Mengakhiri seluruh program, B. Menjalankan perintah jika IF bernilai SALAH, C. Menjalankan perintah berulang-ulang tanpa henti\n   ✅ Kunci: B. Menjalankan perintah jika IF bernilai SALAH\n⏱️ [07:50] Simbol apakah yang digunakan untuk membuat percabangan kondisi (IF) dalam flowchart?\n   Pilihan: A. Persegi, B. Belah Ketupat, C. Lingkaran/Oval\n   ✅ Kunci: B. Belah Ketupat", "Latihan Logika Syarat: Menganalisis kondisi cuaca dan menyusun pohon keputusan tindakan.", "Jika hujan -> Bawa payung\nJika mendung -> Siapkan jas hujan\nSelain itu -> Tidak perlu payung", "Siswa mampu memodelkan keputusan dunia nyata ke dalam struktur logika percabangan bersyarat.", "Siap (Video Terverifikasi & Kuis Aktif)"], [15, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-2", "APP INVENTOR", "Video Interaktif & Kuis", "Checkpoint 02 · Percabangan Blok", "https://youtu.be/tDkIcceTzII", "App Inventor: Percabangan Blok If-Else. Menggunakan mutator roda gigi biru untuk menambah 'else if' dan 'else'.", "⏱️ [11:59] Apa yang harus diklik untuk memunculkan pilihan ELSE?\n   Pilihan: A. Klik Kanan > Add Else, B. Ikon roda gigi biru di blok IF\n   ✅ Kunci: B. Ikon roda gigi biru di blok IF", "Hands-on Mutator Blok: Membuka mutator roda gigi biru pada blok If, menambahkan cabang Else-If dan Else.", "Blok Control:\nif [syarat] then [...]\nelse if [syarat2] then [...]\nelse [...]", "Siswa menguasai penggunaan blok If-Else bertingkat di App Inventor.", "Siap (Video Terverifikasi & Kuis Aktif)"], [16, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-3", "LITERASI KEUANGAN", "Video Interaktif & Kuis", "Checkpoint 03 · Uang Digital", "https://youtu.be/tDkIcceTzII", "Literasi Keuangan: Uang Digital vs Fisik, cara kerja dompet digital (e-wallet), QRIS, dan pencatatan transaksi non-tunai.", "⏱️ [19:31] Menerima transfer hadiah Rp 50.000 ke akun Dana disebut?\n   Pilihan: A. Pengeluaran digital, B. Pendapatan digital\n   ✅ Kunci: B. Pendapatan digital", "Latihan Transaksi Digital: Membedakan pos pemasukan digital dan pengeluaran digital pada catatan harian.", "Kelebihan Uang Digital: Praktis, tercatat otomatis, nirsentuh.\nRisiko: Rentan impulsif & pencurian akun bila password lemah.", "Siswa memahami mekanisme transaksi finansial modern dan risikonya.", "Siap (Video Terverifikasi & Kuis Aktif)"], [17, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-4", "LITERASI KEUANGAN", "Video Interaktif & Kuis", "Checkpoint 04 · Needs vs Wants", "https://youtu.be/tDkIcceTzII", "Literasi Keuangan: Skala Prioritas Belanja — Kebutuhan Utama vs Keinginan Hiburan, aturan alokasi 50/30/20.", "⏱️ [26:30] Membeli paket internet agar bisa mengirim tugas presentasi besok pagi termasuk...\n   Pilihan: A. Kebutuhan (Needs), B. Keinginan (Wants)\n   ✅ Kunci: A. Kebutuhan (Needs)\n⏱️ [26:30] Membeli gacha/top-up diamond agar karakter game-mu lebih keren adalah...\n   Pilihan: A. Kebutuhan mutlak, B. Keinginan (Wants)\n   ✅ Kunci: B. Keinginan (Wants)", "Latihan Alokasi Uang Saku: Membagi nominal uang saku Rp 100.000 ke dalam pos 50% kebutuhan, 30% jajan, 20% tabungan.", "Kebutuhan (Needs) didahulukan 50%\nKeinginan (Wants) dibatasi maksimal 30%\nTabungan & Investasi 20%", "Siswa mampu membuat keputusan finansial yang bijak dan mengelompokkan pos pengeluaran.", "Siap (Video Terverifikasi & Kuis Aktif)"], [18, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-5", "APP INVENTOR + FINANSIAL", "Video Interaktif & Kuis", "Checkpoint 05 · Aplikasi Kalkulator Keuangan", "https://youtu.be/tDkIcceTzII", "Aplikasi Kalkulator Keuangan: Mengintegrasikan komponen input nominal, blok perkalian/pembagian persentase, dan label alokasi.", "⏱️ [31:46] Blok warna apa yang digunakan untuk operasi pengurangan (-)?\n   Pilihan: A. Coklat/Emas (Control), B. Biru (Math), C. Merah Muda (Text)\n   ✅ Kunci: B. Biru (Math)", "Hands-on Blok Math: Menyusun blok perkalian matematika untuk menghitung alokasi otomatis saat tombol ditekan.", "set LabelKebutuhan.Text to (TextBoxUang.Text * 0.5)\nset LabelTabungan.Text to (TextBoxUang.Text * 0.2)", "Siswa membangun kalkulator alokasi anggaran otomatis berbasis rumus finansial.", "Siap (Video Terverifikasi & Kuis Aktif)"], [19, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-6", "FINAL PROJECT", "Proyek Mandiri Final Percabangan", "Checkpoint 06 · Mini Project", "https://youtu.be/tDkIcceTzII", "Membangun aplikasi simulator penasihat belanja: Memberi saran 'Boleh Beli' atau 'Tunda Dulu' berdasarkan saldo saat ini.", "⏱️ [00:00] Jika Saldo Celengan = 70.000 dan Harga Barang = 30.000, berapa sisa saldo dan apa saran aplikasi?\n   Pilihan: A. Sisa 40.000 -> Tunda Dulu (karena sisa tabungan < 50.000), B. Sisa 100.000 -> Langsung Beli, C. Saldo Minus -> Tolak, D. Saldo 0\n   ✅ Kunci: A", "MINI PROJECT 03: Penasihat Belanja Cerdas (Smart Shopper) 🛒\nTugas Siswa:\n1. Input Saldo Tabungan dan Harga Barang impian\n2. Gunakan percabangan If-Else:\n   - Jika Saldo - Harga >= Rp 50.000 -> Tampilkan 'Aman Dibeli!' (Hijau)\n   - Jika Saldo - Harga < Rp 50.000 -> Tampilkan 'Tunda Dulu!' (Kuning)\n   - Jika Saldo < Harga -> Tampilkan 'Uang Tidak Cukup!' (Merah)\nOutput: Aplikasi penilai kelayakan belanja otomatis.", "if (Saldo - HargaBarang) < 50000 then\n  set LabelSaran.Text to 'Tunda! Saldo tabunganmu hampir habis.'\nelse\n  set LabelSaran.Text to 'Aman dibeli!'", "Siswa menghasilkan aplikasi asisten belanja cerdas dengan validasi multi-kondisi.", "Siap (Framework Proyek & Penilaian)"], [20, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-1", "Membuat dan Memanggil Procedures", "Video Interaktif & Kuis", "Checkpoint 01 · Mulai di sini", "https://youtu.be/P8Ea0v8Gy2o", "Membuat & Memanggil Procedures: Blok 'to procedure do' (tanpa kembalian) dan 'to procedure result' (mengembalikan nilai), parameter.", "⏱️ [13:13] Kenapa kita menggunakan Procedure di App Inventor?\n   Pilihan: Agar warna aplikasi menjadi lebih bagus., Untuk mengumpulkan beberapa perintah menjadi satu sehingga bisa dipakai berkali-kali tanpa mengulang., Untuk membuat baterai HP menjadi hemat 100%.\n   ✅ Kunci: Untuk mengumpulkan beberapa perintah menjadi satu sehingga bisa dipakai berkali-kali tanpa mengulang.", "Hands-on Procedure: Membuat prosedur sederhana 'tampilkanPesanSukses' dan memanggilnya dari 2 tombol berbeda.", "to hitungDiskon (harga, persen) do\n  result: harga - (harga * persen / 100)\ncall hitungDiskon(100000, 10)", "Siswa memahami cara kerja prosedur/fungsi untuk membagi kode program menjadi modul-modul efisien.", "Siap (Video Terverifikasi & Kuis Aktif)"], [21, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-2", "Mini Project Kalkulator", "Proyek Mandiri Kalkulator", "Checkpoint 02 · Mini Project", "https://youtu.be/P8Ea0v8Gy2o", "Mini Project Kalkulator Modular: Menerapkan prosedur hitungTambah, hitungKurang, hitungKali, dan resetForm.", "⏱️ [00:00] Di mana letak menu untuk membuat blok Procedure baru di MIT App Inventor?\n   Pilihan: A. Di menu Layout Designer, B. Di laci bawaan 'Procedures' pada Blocks Editor, C. Di dalam Google Drive, D. Di galeri foto\n   ✅ Kunci: B", "MINI PROJECT 04: Kalkulator Keuangan Modular 🧮\nTugas Siswa:\n1. Buat antarmuka dengan 2 input angka dan 4 tombol operasi (+, -, *, /)\n2. Buat Procedure terpisah untuk tiap operasi matematika\n3. Buat Procedure 'bersihkanInput' untuk mengosongkan layar\nOutput: Kalkulator modular tanpa duplikasi kode blok.", "Prosedur 'bersihkanLayar':\nset TextBox1.Text to ''\nset TextBox2.Text to ''\nset LabelHasil.Text to '0'", "Siswa membuat kalkulator modular tanpa duplikasi kode blok.", "Siap (Framework Proyek & Penilaian)"], [22, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-3", "Optimasi dan Modularisasi Kode", "Video Interaktif & Kuis", "Checkpoint 03", "https://youtu.be/P8Ea0v8Gy2o", "Optimasi dan Modularisasi Kode: Prinsip DRY (Don't Repeat Yourself), meningkatkan keterbacaan kode blok.", "⏱️ [19:53] Mengapa memecah program menjadi modul-modul (procedure) kecil itu sangat membantu saat terjadi error (bug)?\n   Pilihan: Karena kita bisa mengisolasi masalah dan mencari error di satu \"kotak\" modul spesifik., Karena modul akan secara otomatis menghapus bug tanpa kita suruh., Karena jika memakai modul, App Inventor tidak akan pernah error.\n   ✅ Kunci: Karena kita bisa mengisolasi masalah dan mencari error di satu \"kotak\" modul spesifik.", "Refactoring Blok: Menggabungkan 5 blok duplikat menjadi 1 prosedur tunggal berparameter.", "Jangan copy-paste blok yang sama berulang kali; bungkus ke dalam satu Prosedur dan panggil namanya!", "Siswa mampu menyederhanakan kode blok yang rumit menjadi bersih dan mudah dipelihara.", "Siap (Video Terverifikasi & Kuis Aktif)"], [23, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "bridge-ms-03", "Detektif Blok: Debugging & Uji Kasus Form", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 03 · Kualitas & Pengujian", "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-03.html", "Mengenali indikator error di App Inventor, mengisolasi blok dengan fitur Do It, merancang tabel skenario pengujian (input normal, batas, dan ekstrem/kosong), serta menerapkan etika privasi data pada form aplikasi.\n\nTujuan Pembelajaran:\n• Mengenali tanda error pada App Inventor (blok bertanda silang merah / tanda seru kuning)\n• Menerapkan teknik isolasi: menguji blok satu per satu dengan Do It\n• Membuat tabel uji kasus (Test Cases): input normal, input kosong, dan input angka negatif\n• Menghargai privasi digital: tidak pernah menyimpan password atau PIN ke dalam teks biasa", "⏱️ [Slide Kuis #1] Fitur bawaan apa di Blocks Editor yang bisa kita klik kanan pada suatu blok untuk melihat hasil eksekusinya secara instan saat live testing?\n   Pilihan: A. Do It, B. Delete Block, C. Duplicate, D. Collapse Block\n   ✅ Kunci: A. Do It\n   💡 Penjelasan: Fitur 'Do It' mengeksekusi blok terpilih secara langsung di HP dan menampilkan gelembung hasil outputnya.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenemukan blok yang tertukar antara set Label.Text dan get TextBox.Text\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Ketika Aplikasi Bertingkah Aneh\n- 2. Indikator Error App Inventor\n- 3. Jurus Isolasi: Fitur Do It\n- 4. Tabel Uji Kasus (Test Cases)\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Memperbaiki skenario blok salah pada tabel uji kasus", "Siap (Slide Standalone & Live Testing Verified)"], [24, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-4", "Uji Coba dan Debugging", "Video Interaktif & Kuis", "Checkpoint 04", "https://youtu.be/P8Ea0v8Gy2o", "Uji Coba & Debugging: Menggunakan fitur 'Do It' di Blocks Editor untuk menginspeksi nilai variabel secara instan, melacak bug.", "⏱️ [28:04] Apa fungsi dari blok TinyDB di App Inventor?\n   Pilihan: Menyimpan data kecil secara lokal di handphone pengguna sehingga data tidak hilang saat aplikasi ditutup., Membagikan foto otomatis ke Instagram pengguna., Menyimpan gambar ukuran besar yang dibuat dengan MS Paint.\n   ✅ Kunci: Menyimpan data kecil secara lokal di handphone pengguna sehingga data tidak hilang saat aplikasi ditutup.", "Latihan Do It Debugging: Klik kanan blok ekspresi matematika, pilih 'Do It', dan amati kotak dialog hasil keluaran.", "Klik kanan blok kode > pilih 'Do It' untuk melihat nilai keluaran blok secara langsung di layar monitor.", "Siswa menguasai teknik debugging profesional di MIT App Inventor.", "Siap (Video Terverifikasi & Kuis Aktif)"], [25, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-5", "Presentasi dan Refleksi", "Video Interaktif & Refleksi", "Checkpoint 05", "https://youtu.be/P8Ea0v8Gy2o", "Presentasi & Refleksi: Mengevaluasi arsitektur blok, kenyamanan antarmuka pengguna (UI/UX), dan dokumentasi kode.", "⏱️ [33:27] Saat presentasi, kelompok lain memberi kritik: \"Aplikasi kalian keren, tapi teks petunjuknya sulit dibaca karena warnanya gelap.\" Sikap yang tepat adalah:\n   Pilihan: Menyuruh mereka memeriksa mata ke dokter karena teksnya sudah jelas., Pura-pura mencatat, tapi tidak pernah memperbaiki aplikasinya., Berterima kasih atas feedback tersebut, dan berjanji akan mengubah warna teks menjadi lebih terang.\n   ✅ Kunci: Berterima kasih atas feedback tersebut, dan berjanji akan mengubah warna teks menjadi lebih terang.", "Checklist Audit UI/UX: Menguji aplikasi terhadap 3 kriteria kenyamanan pengguna (kontras warna, ukuran tombol, kejelasan error).", "Kriteria Desain Aplikasi yang Baik:\n1. Tampilan bersih dan rapi\n2. Tombol mudah ditekan\n3. Tidak ada error/crash saat input salah", "Siswa mampu melakukan review kritis terhadap aplikasi ciptaannya.", "Siap (Video Terverifikasi & Kuis Aktif)"], [26, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "bridge-ms-02", "Buku Kas Digital: Menyimpan Data dengan TinyDB", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 02 · Penyimpanan Data SMP", "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-02.html", "Membedakan memori sementara (RAM) vs penyimpanan persisten (TinyDB), menggunakan blok call TinyDB.StoreValue dengan Tag dan ValueToStore, membaca data via call TinyDB.GetValue dengan penanganan default ValueIfTagNotThere, dan menghapus tag.\n\nTujuan Pembelajaran:\n• Membedakan memori sementara (variabel hilang saat app ditutup) dan persisten (TinyDB tetap tersimpan)\n• Menggunakan blok call TinyDB.StoreValue dengan Tag (label) dan ValueToStore (isi)\n• Mengambil data dengan call TinyDB.GetValue dan menyediakan ValueIfTagNotThere (nilai default)\n• Menghapus data tersimpan menggunakan call TinyDB.ClearTag untuk reset saldo", "⏱️ [Slide Kuis #1] Mengapa kita harus mengisi blok 'valueIfTagNotThere' saat memanggil TinyDB.GetValue?\n   Pilihan: A. Agar layar HP tidak pecah, B. Agar aplikasi tidak error jika data dengan Tag tersebut belum pernah disimpan sebelumnya, C. Untuk mengirim data otomatis ke server Google, D. Agar warna teks tombol berubah menjadi hijau\n   ✅ Kunci: B. Agar aplikasi tidak error jika data dengan Tag tersebut belum pernah disimpan sebelumnya\n   💡 Penjelasan: valueIfTagNotThere memberikan nilai cadangan/default jika Tag yang diminta belum pernah tersimpan di HP.", "SIMULASI INTERAKTIF MANDIRI 💻\nSimulasi alur simpan nama dan saldo uang saku lalu membaca kembali nilainya\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Ke Mana Perginya Data?\n- 2. Solusi Persisten: TinyDB\n- 3. Menyimpan Data: Tag & ValueToStore\n- 4. Mengambil Data: GetValue & Nilai Default\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Memilih blok yang tepat untuk mencegah error jika data belum pernah disimpan", "Siap (Slide Standalone & Live Testing Verified)"], [27, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-1", "Penyimpanan Data dengan TinyDB", "Video Interaktif & Kuis", "Checkpoint 03 · Logika Data", "https://youtu.be/cWfbcaSg7Eo", "Penyimpanan Data Lokal dengan TinyDB: Konsep database lokal, komponen non-visible TinyDB, pasangan Tag (kunci) & Value (nilai).", "⏱️ [34:50] Jika kamu ingin membuat fitur 'To-Do List' yang datanya tidak terhapus walau HP direstart, komponen apa yang WAJIB dipakai?\n   Pilihan: Global Variable, TextBox Component, TinyDB (Database Lokal)\n   ✅ Kunci: TinyDB (Database Lokal)\n⏱️ [42:26] Dalam konsep TinyDB, apa fungsi dari sebuah 'Tag'?\n   Pilihan: Sebagai isi data sesungguhnya yang akan disimpan, Sebagai stiker penamaan (judul) agar data mudah dicari di laci, Sebagai warna latar belakang aplikasi\n   ✅ Kunci: Sebagai stiker penamaan (judul) agar data mudah dicari di laci", "Hands-on TinyDB: Memasukkan komponen TinyDB1 dari Palette Storage, melakukan StoreValue pada event tombol.", "call TinyDB1.StoreValue tag 'saldo' valueToStore 50000\ncall TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0", "Siswa memahami cara menyimpan data agar tidak terhapus ketika aplikasi ditutup atau HP di-restart.", "Siap (Video Terverifikasi & Kuis Aktif)"], [28, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-2", "Mengelola Data Aman di TinyDB", "Video Interaktif & Kuis", "Checkpoint 04 · Praktik Mengelola", "https://youtu.be/cWfbcaSg7Eo", "Mengelola Data Aman di TinyDB: Pencegahan error data hilang dengan memberikan nilai default (valueIfTagNotThere), update nilai.", "⏱️ [48:12] Kamu menggunakan StoreValue dengan Tag 'Koin' nilainya 10. Lalu kamu memakai StoreValue lagi dengan Tag 'Koin' nilainya 50. Berapa nilai 'Koin' saat ini?\n   Pilihan: 60 (karena ditambah), 50 (karena ditimpa / di-update), 10 (data pertama yang permanen)\n   ✅ Kunci: 50 (karena ditimpa / di-update)\n⏱️ [50:41] Jika kita ingin aplikasi 'melupakan' seluruh data pada sebuah tag tertentu secara permanen, blok apa yang digunakan?\n   Pilihan: TinyDB1.GetValue, TinyDB1.ClearTag, TinyDB1.StoreValue dengan nilai 0\n   ✅ Kunci: TinyDB1.ClearTag", "Latihan Default Value: Mengambil data saldo dengan nilai default 0 saat pertama kali aplikasi di-install.", "Tag unik: Gunakan tag deskriptif ('user_name', 'total_saldo', 'riwayat_catatan')", "Siswa mampu membaca dan memperbarui data persisten secara stabil.", "Siap (Video Terverifikasi & Kuis Aktif)"], [29, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-3", "Mini Project Tiny DB", "Proyek Mandiri TinyDB", "Checkpoint 05 · Hands-on", "https://youtu.be/cWfbcaSg7Eo", "Mini Project Celengan Persisten: Membuat aplikasi pencatat tabungan yang menyimpan saldo ke TinyDB setiap kali koin ditambahkan.", "⏱️ [00:00] Pada event apa sebaiknya kita memanggil blok 'TinyDB.GetValue' untuk memuat saldo terakhir saat aplikasi baru dibuka?\n   Pilihan: A. when Screen1.Initialize, B. when ButtonExit.Click, C. when Screen1.ErrorOccurred, D. when Screen1.BackPressed\n   ✅ Kunci: A", "MINI PROJECT 05: Celengan Digital Persisten (TinyDB) 🏦\nTugas Siswa:\n1. Rancang antarmuka penampil saldo dan tombol simpan tabungan\n2. Pada Screen.Initialize, ambil saldo dari TinyDB tag 'saldo_tersimpan'\n3. Saat user menekan tombol 'Tabung', tambahkan saldo dan simpan ulang ke TinyDB\n4. Tutup aplikasi di HP lalu buka kembali untuk membuktikan saldo tidak hilang.\nOutput: Aplikasi celengan persisten anti-reset.", "when Screen1.Initialize do\n  set global Saldo to (call TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0)\n  set LabelSaldo.Text to get global Saldo", "Siswa menghasilkan aplikasi tabungan dengan penyimpanan data persisten lokal yang andal.", "Siap (Framework Proyek & Penilaian)"], [30, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-4", "Menganalisis Data Finansial", "Video Interaktif & Kuis", "Checkpoint 06 · Finansial", "https://youtu.be/UhutS4BVKhk", "Menganalisis Data Finansial: Mengolah data transaksi yang tersimpan di TinyDB untuk menghitung total pengeluaran mingguan.", "⏱️ [02:00] Jika kita menyimpan riwayat transaksi belanja berupa List ke TinyDB, blok apa yang digunakan untuk menambahkan item belanja baru ke dalam list?\n   Pilihan: A. remove list item, B. add items to list (dari menu Lists), C. clear list, D. pick random item\n   ✅ Kunci: B", "Latihan Analisis Data: Menghitung total belanja dari list transaksi yang tersimpan di TinyDB.", "Menggunakan list blok di App Inventor untuk mengiterasi daftar belanjaan dan menghitung total.", "Siswa mampu melakukan kalkulasi analitik sederhana atas data tersimpan.", "Siap (Video Terverifikasi & Kuis Aktif)"], [31, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-5", "Mini Project C", "Proyek Mandiri Kas Mini", "Checkpoint 07 · Mini Project", "https://youtu.be/UhutS4BVKhk", "Mini Project Pengelolaan Kas Mini: Menggabungkan form transaksi, validasi input, prosedur hitung saldo, dan TinyDB.", "⏱️ [00:00] Mengapa kita harus memberi nama Tag yang unik dan jelas saat menyimpan data ke TinyDB?\n   Pilihan: A. Agar aplikasi menghabiskan memori HP, B. Agar data tidak tertukar atau tertimpa secara tidak sengaja oleh fitur lain, C. Supaya koneksi WiFi tetap stabil, D. Agar tidak bisa dibaca oleh sistem\n   ✅ Kunci: B", "MINI PROJECT 06: Buku Kas Saku Digital 📖\nTugas Siswa:\n1. Buat fitur pencatatan pemasukan dan pengeluaran\n2. Validasi agar pengeluaran tidak melebihi sisa saldo\n3. Simpan riwayat dan saldo terkini secara otomatis ke TinyDB\nOutput: Aplikasi pembukuan kas mini saku siswa.", "Aplikasi Kas:\n- Form Masuk/Keluar\n- Validasi saldo tidak minus\n- Auto-save ke TinyDB\n- Reset tombol", "Siswa membuat aplikasi buku kas keuangan mini lengkap berbasis mobile.", "Siap (Framework Proyek & Penilaian)"], [32, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-6", "Keamanan dalam Bertransaksi Digital", "Video Interaktif & Kuis", "Checkpoint 08 · Keamanan", "https://youtu.be/UhutS4BVKhk", "Keamanan Transaksi Digital: Bahaya malware pembaca penyimpanan lokal, prinsip keamanan penyimpanan offline vs cloud.", "⏱️ [61:21] Mini Quiz: Finansial & Keamanan Kamu menerima pesan: \"Selamat, kamu menang voucher game. Balas pesan ini dengan email dan password akunmu.\" Apa tindakan paling aman?\n   ✅ Kunci: 1", "Studi Kasus Keamanan: Menganalisis risiko jika password disimpan dalam format plain text di database lokal.", "Prinsip Keamanan Penyimpanan:\nData PIN atau password rahasia tidak boleh disimpan sembarangan di penyimpanan publik tanpa proteksi enkripsi.", "Siswa memahami risiko kebocoran data pada media penyimpanan lokal.", "Siap (Video Terverifikasi & Kuis Aktif)"], [33, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-1", "Merancang Solusi Digital", "Video Interaktif & Konsep Proyek", "Checkpoint 06", "https://youtu.be/P8Ea0v8Gy2o", "Merancang Solusi Digital: Metodologi pemecahan masalah (Identifikasi Masalah, Perancangan Solusi, Desain UI, Pengkodean Blok).", "⏱️ [37:40] Manakah dari ide aplikasi di bawah ini yang merupakan \"Solusi Digital Berdampak Positif\" untuk memecahkan masalah di sekolah?\n   Pilihan: Game tebak-tebakan artis korea., Aplikasi pengingat jadwal piket kelas yang terhubung dengan notifikasi harian., Aplikasi senter yang hanya hidup dan mati secara random.\n   ✅ Kunci: Aplikasi pengingat jadwal piket kelas yang terhubung dengan notifikasi harian.", "Perancangan Solusi: Menuliskan lembar spesifikasi proyek akhir mencakup target pengguna, masalah finansial, dan fitur kunci.", "Langkah Pengembangan Proyek:\n1. Temukan masalah nyata di sekitarmu\n2. Rancang wireframe di kertas\n3. Susun komponen di Designer\n4. Buat blok logika", "Siswa mampu menyusun proposal rancangan aplikasi finansial yang solutif.", "Siap (Video Terverifikasi & Kuis Aktif)"], [34, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-2", "Merancang Solusi Digital", "Proyek Mandiri Wireframe", "Checkpoint 07", "https://youtu.be/P8Ea0v8Gy2o", "Merancang Solusi Digital: Membuat sketsa wireframe antarmuka pengguna dan diagram alur logika aplikasi final.", "⏱️ [00:00] Komponen Layout apa yang paling ideal digunakan untuk menata 2 tombol secara berdampingan ke samping (horizontal)?\n   Pilihan: A. VerticalArrangement, B. HorizontalArrangement, C. Canvas, D. VideoPlayer\n   ✅ Kunci: B", "MINI PROJECT 07: Wireframe & User Flow Proyek Akhir 📐\nTugas Siswa:\n1. Buat sketsa layout layar aplikasi (Beranda, Form Transaksi, Laporan Grafik/Teks)\n2. Tentukan komponen Palette yang dibutuhkan\n3. Buat bagan alur pengguna saat mencatat uang.\nOutput: Dokumen cetak biru desain sebelum masuk ke Blocks Editor.", "Wireframe: Sketsa tata letak tombol, teks, dan gambar agar pengguna nyaman menggunakan aplikasi.", "Siswa menghasilkan desain antarmuka yang matang untuk proyek akhir mereka.", "Siap (Framework Proyek & Penilaian)"], [35, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-3", "Final Project", "Final Capstone Project SMP", "Checkpoint 09 · Final Project", "https://youtu.be/UhutS4BVKhk", "Final Project: Membangun Aplikasi Keuangan Pribadi Siswa Berbasis MIT App Inventor secara utuh dan mandiri.", "⏱️ [00:00] Sebelum mengumpulkan link proyek akhir, uji coba mandiri apa yang wajib dilakukan di HP?\n   Pilihan: A. Mematikan layar HP dan tidur, B. Menguji seluruh tombol, memasukkan form kosong untuk cek error validasi, dan memastikan data tersimpan di TinyDB, C. Menghapus seluruh blok kode, D. Mengubah bahasa HP\n   ✅ Kunci: B", "FINAL CAPSTONE PROJECT SMP: Aplikasi Asisten Finansial Mandiri 🏆\nTugas Siswa:\n1. Gabungkan seluruh keterampilan dari Modul 1-4 (Form Validasi, Percabangan Cerdas, Prosedur Modular, & TinyDB)\n2. Sediakan fitur pencatatan pemasukan/pengeluaran dan grafik target tabungan\n3. Uji aplikasi di HP fisik menggunakan AI Companion hingga zero-bug\n4. Simpan file .aia proyek dan buat video demo singkat 1 menit.\nOutput: Aplikasi mobile Android/iOS edukasi finansial karya mandiri.", "Integrasi Penuh:\n- UI Bersih & Rapi\n- Validasi Anti-Crash\n- Database Persisten TinyDB\n- Fitur Edukasi Finansial Nyata", "Siswa berhasil menciptakan aplikasi mobile multifungsi siap pakai yang mengintegrasikan seluruh konsep pemrograman blok dan literasi keuangan.", "Siap (Framework Capstone Project)"], [36, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-4", "Mempublikasikan Final Project ke Gallery", "Video Tutorial Resmi (Kak Laras)", "Tahap Akhir · Publikasi Karya", "https://youtu.be/_aAQ8nFUAqc", "Mempublikasikan Final Project ke MIT App Inventor Gallery: Menulis deskripsi proyek, mengunggah screenshot, lisensi open-source.", "⏱️ [02:00] Bagaimana cara mempublikasikan aplikasi yang sudah selesai ke etalase publik MIT App Inventor Gallery?\n   Pilihan: A. Kirim email ke tim MIT satu per satu, B. Centang nama proyek di 'My Projects', lalu klik tombol 'Publish to Gallery', C. Foto layar laptop lalu kirim ke WhatsApp, D. Hapus proyek lalu buat ulang\n   ✅ Kunci: 1", "Publikasi Gallery: Mengekspor proyek ke format .aia dan mempublikasikannya ke MIT App Inventor Gallery komunitas global.", "- Projects > Publish to Gallery\n- Tulis Judul, Deskripsi, dan Cara Penggunaan\n- Bagikan link web gallery ke fasilitator & portfolio siswa", "Siswa mampu mempublikasikan dan memamerkan karya aplikasinya ke komunitas global.", "Siap (Video Tutorial Kak Laras)"]], "sma": [[1, "hs-mod-00", "Modul 0: Orientasi & Fondasi Lingkungan Python", "hs-0-0", "Introduction to Async Learning", "Slide Interaktif & Video Orientasi", "Video 00 · Orientasi", "https://youtu.be/yxmLOk5vcFg", "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, & Slide Jembatan Google Colab: membuat notebook, sel kode, tombol run, dan output.", "⏱️ [01:05] Apa keunggulan utama belajar mandiri (asynchronous learning) di platform UOB My Digital Space?\n   Pilihan: A. Harus online bersamaan di jam yang sama setiap hari, B. Kamu memegang kendali penuh atas ritme belajar, bisa pause, ulang, dan coba coding kapan saja, C. Tidak perlu menonton video materi sama sekali, D. Hanya boleh dikerjakan di akhir pekan saja\n   ✅ Kunci: B\n⏱️ [01:50] Pintasan keyboard apa yang digunakan di Google Colab untuk mengeksekusi cell kode dan langsung lanjut ke cell berikutnya?\n   Pilihan: A. Ctrl + C, B. Alt + F4, C. Shift + Enter, D. Ctrl + Z\n   ✅ Kunci: C", "Eksplorasi Google Colab: Membuka colab.research.google.com, membuat notebook baru, mengetik print('Halo Dunia Python!'), dan mengeksekusi dengan Shift+Enter.", "Google Colab:\n- Shift + Enter: Jalankan cell & pindah ke cell berikutnya\n- Ctrl + Enter: Jalankan cell di tempat\n- print('Halo Dunia')", "Siswa memahami alur belajar dan mampu membuat serta menjalankan kode Python pertama di Google Colab.", "Siap (Wadah & Video Orientasi)"], [2, "hs-mod-00", "Modul 0: Orientasi & Fondasi Lingkungan Python", "bridge-hs-00", "Panduan Lengkap Google Colab & Pemrograman Python Pertamaku", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 00 · Dasar Python & Cloud Editor", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-00.html", "Panduan komprehensif membuka Google Colaboratory di browser tanpa instalasi software, memahami anatomi Code Cell vs Text Cell, menulis fungsi print(), mengeksekusi kode dengan shortcut Shift+Enter, serta tips koding anti-error.\n\nTujuan Pembelajaran:\n• Membuka notebook Google Colab baru di browser tanpa instalasi lokal\n• Menulis dan menjalankan kode Python pertama dengan perintah print()\n• Membedakan fungsi Code Cell (untuk kode) dan Text Cell (untuk catatan Markdown)\n• Mengeksekusi sel kode menggunakan pintasan keyboard Shift+Enter", "⏱️ [Slide Kuis #1] Pintasan keyboard (shortcut) apa yang paling cepat untuk menjalankan sel kode di Google Colab?\n   Pilihan: A. Ctrl + C, B. Shift + Enter, C. Alt + F4, D. Esc + Delete\n   ✅ Kunci: B. Shift + Enter\n   💡 Penjelasan: Shift + Enter mengeksekusi kode pada sel saat ini dan langsung berpindah ke sel berikutnya.", "SIMULASI INTERAKTIF MANDIRI 💻\nSimulasi interaktif menulis perintah print() dan menjalankan sel Colab\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Pengenalan Python SMA\n- 2. Mengapa Belajar Python?\n- 3. Apa itu Google Colaboratory?\n- 4. Colab vs Jupyter Notebook Lokal\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan seluruh slide dan menjawab kuis pintasan Colab dengan benar", "Siap (Slide Standalone & Live Testing Verified)"], [3, "hs-mod-00", "Modul 0: Orientasi & Fondasi Lingkungan Python", "bridge-hs-01", "Variabel dan Tipe Data Tanpa Takut", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 01 · Dasar Python", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-01.html", "Variabel adalah wadah penyimpanan di memori komputer yang diberi nama label khusus. Gunakan tanda sama dengan (=) untuk menugaskan nilai. Kenali perbedaan mendasar antara teks (String) dan angka (Integer/Float) agar program tidak salah menghitung.\n\nTujuan Pembelajaran:\n• Menjelaskan konsep variabel sebagai wadah berlabel di memori\n• Membuat variabel menggunakan sintaks assignment (nama = nilai)\n• Membedakan 4 tipe data dasar: str, int, float, dan bool\n• Mengidentifikasi jebakan tipe data: teks \"10\" vs angka 10", "⏱️ [Slide Kuis #1] Jika kita menjalankan kode: a = '50' lalu b = '20', berapakah hasil dari print(a + b)?\n   Pilihan: A. 70, B. '5020', C. Error, D. 50\n   ✅ Kunci: B. '5020'\n   💡 Penjelasan: Karena '50' dan '20' dibungkus tanda kutip, Python memperlakukannya sebagai String (teks). Operator + akan menggabungkan kedua teks menjadi '5020'.", "SIMULASI INTERAKTIF MANDIRI 💻\nPrediksi output perhitungan dan tentukan tipe data variabel\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Analogi Kotak Berlabel\n- 2. Membuat Variabel di Python\n- 3. Tipe Data: String (Teks)\n- 4. Tipe Data: Integer & Float\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menjawab kuis pemahaman tipe data dengan benar", "Siap (Slide Standalone & Live Testing Verified)"], [4, "hs-mod-01", "Modul 1: Fondasi Data — Input Pengguna & Konversi Logika", "hs-1-1", "Input, Masalah Input User, dan Konsep Validasi", "Video Interaktif & Kuis", "Materi 01", "https://youtu.be/pKYN1E60xtU", "Input Pengguna, Masalah Tipe Data, dan Sanitasi: Fungsi input() selalu menghasilkan string, type casting int() dan float(), sanitasi teks .strip() dan .lower().", "⏱️ [04:16] INFO: Huruf Kapital itu Berbeda! ⚠️\n⏱️ [11:40] INFO: Mini Quiz: Sanitasi String 🧹\n⏱️ [11:40] INFO: Mini Quiz: Hapus Spasi ✂️", "Latihan Type Casting: Menerima input nama dan nominal tabungan, mengubah teks ke float, dan mencetak saldo akun.", "nama = input('Nama: ').strip()\numur = int(input('Umur: '))\nsaldo = float(input('Saldo: '))", "Siswa memahami perbedaan tipe data teks dan angka serta cara mengonversi input pengguna dengan aman.", "Siap (Video Terverifikasi & Kuis Aktif)"], [5, "hs-mod-01", "Modul 1: Fondasi Data — Input Pengguna & Konversi Logika", "bridge-hs-02", "Dari Input Teks Menjadi Logika Keputusan", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 02 · Dasar Python", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-02.html", "Pahami mengapa fungsi input() selalu menghasilkan tipe String, cara mengubah teks angka menjadi bilangan bulat dengan int(), menggunakan operator perbandingan (==, !=, >, <), dan aturan indentasi 4 spasi pada percabangan if-else.\n\nTujuan Pembelajaran:\n• Mengetahui bahwa fungsi input() selalu menghasilkan tipe String (teks)\n• Mengubah teks angka menjadi bilangan bulat dengan int() dan float()\n• Menggunakan operator perbandingan (==, !=, >, <, >=, <=) untuk menghasilkan Boolean\n• Memahami aturan indentasi 4 spasi dalam blok percabangan if-else", "⏱️ [Slide Kuis #1] Jika pengguna memasukkan angka '25000' pada fungsi nominal = input('Masukkan belanja: '), tipe data apa yang dimiliki variabel nominal?\n   Pilihan: A. Integer (bilangan bulat), B. String (teks), C. Float (desimal), D. Boolean (True/False)\n   ✅ Kunci: B. String (teks)\n   💡 Penjelasan: Fungsi input() di Python selalu mengembalikan nilai bertipe String, meskipun pengguna mengetik angka.", "SIMULASI INTERAKTIF MANDIRI 💻\nSimulasi konversi input nominal uang dan cek saldo cukup/kurang\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Mengapa Input Perlu Perlakuan Khusus?\n- 2. Rahasia Terbesar input(): Selalu String\n- 3. Konversi Tipe Data: int() & float()\n- 4. Operator Perbandingan & Boolean\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menyelesaikan tabel perbandingan boolean dan kuis indentasi", "Siap (Slide Standalone & Live Testing Verified)"], [6, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-1", "Bagaimana Program Bisa Memilih?", "Video Interaktif & Kuis", "Checkpoint 01 · Mulai di sini", "https://youtu.be/MLgrQoRo2oo", "Bagaimana Program Bisa Memilih? Logika boolean True dan False, operator perbandingan (==, !=, <, >, <=, >=).", "⏱️ [03:00] Dalam pemrograman Python, tipe data apa yang hanya memiliki dua kemungkinan nilai: True atau False?\n   Pilihan: A. String (str), B. Integer (int), C. Boolean (bool), D. Float (float)\n   ✅ Kunci: C\n⏱️ [06:00] Operator apa yang digunakan di Python untuk mengecek apakah dua nilai adalah SAMA PERSIS?\n   Pilihan: A. = (satu tanda sama dengan), B. == (dua tanda sama dengan), C. != (tanda seru sama dengan), D. >= (lebih besar sama dengan)\n   ✅ Kunci: B", "Latihan Evaluasi Boolean: Membandingkan variabel saldo dengan harga belanjaan untuk menghasilkan True atau False.", "5 > 3  # True\n10 == 20 # False\n'apel' != 'jeruk' # True", "Siswa memahami ekspresi logika perbandingan sebagai penentu arah eksekusi program.", "Siap (Video Terverifikasi & Kuis Aktif)"], [7, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-2", "Menulis Conditional di Python", "Video Interaktif & Kuis", "Checkpoint 02 · Saatnya praktik", "https://youtu.be/-hYK440Vlr8", "Menulis Conditional di Python: Sintaks if dan else, aturan indentasi 4 spasi (PEP 8), blok eksekusi bersyarat.", "⏱️ [05:00] Syarat dalam pemrograman yang bernilai benar disebut dengan True.\n   ✅ Kunci: True\n⏱️ [05:00] Keputusan dalam pemrograman mirip seperti kita memilih tindakan di kehidupan nyata berdasarkan suatu syarat.\n   ✅ Kunci: True\n⏱️ [05:00] Komputer akan tetap menjalankan perintah di dalam 'if' walaupun syaratnya bernilai False.\n   ✅ Kunci: False\n⏱️ [05:00] Dalam membuat syarat (kondisi), kita tidak bisa membandingkan angka.\n   ✅ Kunci: False\n⏱️ [10:17] Multi-branch decision adalah keputusan dengan banyak cabang pilihan yang dapat dieksekusi bersamaan.\n   ✅ Kunci: False\n⏱️ [10:17] Dalam Python, kita dapat membuat percabangan yang lebih dari dua jalan menggunakan kata kunci 'elif'.\n   ✅ Kunci: True\n⏱️ [10:17] Urutan kondisi pada if-elif sangat penting karena Python membaca dari atas ke bawah dan berhenti pada kondisi pertama yang benar.\n   ✅ Kunci: True", "Latihan Logika Diskon: Menulis blok if-else untuk memberikan potongan harga jika total belanja >= Rp 100.000.", "if saldo >= harga:\n    print('Transaksi disetujui')\nelse:\n    print('Saldo tidak mencukupi')", "Siswa mampu menulis pernyataan if-else dengan indentasi yang benar di Python.", "Siap (Video Terverifikasi & Kuis Aktif)"], [8, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-3", "Multi Branch Conditionals", "Video Interaktif & Kuis", "Checkpoint 03 · Logika Tambahan", "https://youtu.be/_jm2p3pstrM", "Multi Branch Conditionals: Menangani lebih dari dua alternatif menggunakan pernyataan 'elif', urutan evaluasi kondisi.", "- (Materi Praktik Langsung)", "Latihan Penentuan Grade Diskon: Membuat percabangan bertingkat (Member Platinum 20%, Gold 10%, Silver 5%, Non-member 0%).", "if skor >= 85:\n    grade = 'A'\nelif skor >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'", "Siswa mampu merancang logika percabangan multi-kondisi yang efisien.", "Siap (Video Terverifikasi & Kuis Aktif)"], [9, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-4", "Nested Conditionals", "Video Interaktif & Kuis", "Checkpoint 04 · Bersarang", "https://youtu.be/_e3hs1nWuME", "Nested Conditionals: Percabangan bersarang (if di dalam if) untuk validasi bertingkat (misal: cek status akun lalu cek saldo).", "- (Materi Praktik Langsung)", "Latihan Simulasi Tarik Tunai ATM: Memeriksa apakah PIN benar, jika benar baru mengecek kecukupan saldo tabungan.", "if akun_aktif:\n    if saldo >= nominal:\n        proses_tarik_tunai()\n    else:\n        print('Saldo kurang')\nelse:\n    print('Akun dibekukan')", "Siswa dapat menyusun validasi keamanan bertingkat menggunakan percabangan bersarang.", "Siap (Video Terverifikasi & Kuis Aktif)"], [10, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-5", "Logical Operator", "Video Interaktif & Kuis", "Checkpoint 05 · Logika Kombinasi", "https://youtu.be/_iRZY0-_skc", "Logical Operator: Menggabungkan kondisi logika majemuk menggunakan operator 'and', 'or', dan 'not'.", "- (Materi Praktik Langsung)", "Latihan Syarat Majemuk: Menguji kondisi 'if usia >= 17 and punya_ktp' untuk pembukaan rekening bank digital.", "if usia >= 17 and punya_ktp:\n    buka_rekening()\nif status == 'VIP' or belanja > 500000:\n    beri_diskon()", "Siswa mampu menyederhanakan kode bertingkat dengan menggabungkan syarat menggunakan operator logika.", "Siap (Video Terverifikasi & Kuis Aktif)"], [11, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-6", "Needs vs Wants & Risks", "Video Interaktif & Kuis", "Checkpoint 06 · Financial Literacy", "https://youtu.be/bMsKBaRsKmc", "Needs vs Wants & Risks: Menganalisis risiko finansial (bunga pinjaman, denda, overbudget) dan klasifikasi kebutuhan belanja.", "- (Materi Praktik Langsung)", "Analisis Anggaran Saku: Menghitung persentase alokasi dana darurat minimal 3x pengeluaran bulanan.", "Dana Darurat = Minimal 3x pengeluaran bulanan\nPrioritas 1: Kebutuhan pokok & cicilan utang\nPrioritas 2: Tabungan\nPrioritas 3: Hiburan", "Siswa memiliki wawasan literasi finansial analitis mengenai mitigasi risiko pengeluaran.", "Siap (Video Terverifikasi & Kuis Aktif)"], [12, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-7", "Smart Budget & Risk Planner", "Proyek Mandiri Python", "Mini Project", "https://youtu.be/bMsKBaRsKmc", "Smart Budget & Risk Planner: Program konsol Python yang mengevaluasi pos anggaran bulanan dan memberikan skor kesehatan keuangan.", "⏱️ [00:00] Jika seorang siswa memiliki pemasukan Rp 100.000 dan menabung Rp 25.000, berapa rasio tabungannya dan apa status anggarannya?\n   Pilihan: A. 10% — Status Bahaya, B. 15% — Status Waspada, C. 25% — Status Sehat (karena >= 20%), D. 50% — Status Overbudget\n   ✅ Kunci: C", "MINI PROJECT 01: Smart Budget & Risk Planner 📊\nTugas Siswa:\n1. Buat program Python yang meminta input pendapatan bulanan dan 3 pos pengeluaran\n2. Gunakan percabangan elif & operator logika untuk menghitung rasio tabungan\n3. Tampilkan kartu evaluasi: 'Keuangan Sehat' (Hijau), 'Waspada' (Kuning), atau 'Bahaya Defisit' (Merah).\nOutput: Script Python konsultan keuangan otomatis.", "Rasio Tabungan = (Tabungan / Total Pendapatan) * 100%\nJika rasio >= 20% -> Keuangan Sehat\nJika rasio < 10% -> Peringatan Berhemat", "Siswa menghasilkan program penasihat anggaran otomatis berbasis percabangan logika Python.", "Siap (Framework Proyek & Penilaian)"], [13, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "bridge-hs-03", "Mengulang Tanpa Bosan: List dan For Loop", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 03 · Logika Iterasi", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-03.html", "Membuat List dengan tanda kurung siku [ ], menjalankan loop for item in list untuk memproses elemen satu per satu, memahami batas range(start, stop), dan menerapkan pola accumulator total = total + x untuk agregasi data finansial.\n\nTujuan Pembelajaran:\n• Membuat struktur data List menggunakan tanda kurung siku [ ]\n• Menjalankan perulangan for item in list untuk memproses elemen satu per satu\n• Menggunakan fungsi range(start, stop) untuk hitungan berurutan\n• Menerapkan pola accumulator (total = total + nominal) untuk menghitung saldo", "⏱️ [Slide Kuis #1] Berapakah nilai akhir dari variabel total setelah kode ini selesai dijalankan?\ntotal = 0\nfor x in [10, 20, 30]:\n    total = total + x\n   Pilihan: A. 30, B. 50, C. 60, D. 0\n   ✅ Kunci: C. 60\n   💡 Penjelasan: Loop menjumlahkan: 0 + 10 = 10, lalu 10 + 20 = 30, lalu 30 + 30 = 60.", "SIMULASI INTERAKTIF MANDIRI 💻\nMenelusuri tabel iterasi akumulasi 3 transaksi harian\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Masalah Pengulangan Manual\n- 2. Struktur Data List [ ]\n- 3. Perulangan for ... in list\n- 4. Menghasilkan Deret Angka: range()\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menghitung total akhir dari loop dan kuis batas range", "Siap (Slide Standalone & Live Testing Verified)"], [14, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-1", "Video Pembelajaran", "Video Interaktif & Kuis", "Checkpoint 01", "https://youtu.be/RnyYn2SzFVU", "Pengenalan Loop: Konsep perulangan untuk mengotomasikan tugas repetitif tanpa menulis ulang kode baris demi baris.", "⏱️ [03:58] Temanmu memikirkan angka 1 sampai 100. Kamu hanya boleh bertanya 'Apakah lebih besar/kecil?'. Bagaimana cara tercepat untuk menebak angka tersebut dengan jumlah tebakan sesedikit mungkin? Jelaskan logikamu!", "Latihan Eksekusi Loop: Menulis for loop sederhana untuk mencetak deret angka 1 sampai 10.", "for i in range(1, 11):\n    print(f'Angka ke-{i}')", "Siswa memahami pentingnya loop untuk efisiensi komputasi dan otomasi.", "Siap (Video Terverifikasi & Kuis Aktif)"], [15, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-2", "Optimasi Loop & Step Count", "Video Interaktif & Kuis", "Checkpoint 02", "https://youtu.be/RnyYn2SzFVU", "Optimasi Loop & Step Count: Penggunaan range(start, stop, step), iterating over lists, dan loop counter.", "⏱️ [14:41] INFO: Mini Activity: Hitung Step Count 🎯\n⏱️ [14:41] INFO: Latihan: Tebak Output 🕵️‍♂️", "Latihan Range Step: Menghitung akumulasi bunga tabungan majemuk setiap 3 bulan (step=3) selama setahun.", "range(0, 10, 2) # 0, 2, 4, 6, 8\nfor bulan in range(3, 13, 3):\n    saldo *= 1.01", "Siswa menguasai variasi parameter fungsi range() untuk mengontrol lompatan iterasi.", "Siap (Video Terverifikasi & Kuis Aktif)"], [16, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-3", "Optimasi Program Python", "Video Interaktif & Kuis", "Tonton Video Ini", "https://youtu.be/RnyYn2SzFVU", "Optimasi Program Python: Mencegah infinite loop (pada while), efisiensi algoritma loop, dan break/continue statements.", "⏱️ [26:56] INFO: Latihan: Pilih Algoritma Lebih Efisien 🤔", "Latihan Break Condition: Menghentikan perulangan pencatatan belanja saat total pengeluaran melebihi limit kredit.", "for transaksi in daftar:\n    if total > batas_limit:\n        print('Limit terlampaui!')\n        break", "Siswa mampu mengendalikan alur eksekusi perulangan secara aman tanpa risiko hang.", "Siap (Video Terverifikasi & Kuis Aktif)"], [17, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-4", "Mini Project Optimasi", "Proyek Mandiri Python", "Checkpoint 04 · Optimasi", "https://youtu.be/RnyYn2SzFVU", "Mini Project Optimasi Loop: Menghitung simulasi target tabungan masa depan dengan suku bunga tahunan menggunakan For Loop.", "⏱️ [00:00] Di dalam loop akumulasi 'while saldo < target', mengapa kita wajib menambahkan 'bulan += 1' pada setiap putaran?\n   Pilihan: A. Agar font angka berubah warna, B. Sebagai penghitung (counter) berapa periode/bulan yang dibutuhkan hingga saldo mencapai target, C. Agar program berhenti seketika, D. Agar saldo tidak berkurang\n   ✅ Kunci: B", "MINI PROJECT 02: Simulator Target Tabungan & Investasi 📈\nTugas Siswa:\n1. Input saldo awal, setoran bulanan, dan target tabungan impian\n2. Gunakan loop untuk mengiterasi bulan demi bulan hingga saldo mencapai target\n3. Cetak tabel proyeksi pertumbuhan uang dari bulan ke-1 hingga target tercapai.\nOutput: Simulator proyeksi tabungan masa depan mandiri.", "while saldo < target:\n    bulan += 1\n    saldo += setoran_bulanan\nprint(f'Target tercapai dalam {bulan} bulan!')", "Siswa berhasil membangun simulator kalkulasi keuangan berbasis perulangan.", "Siap (Framework Proyek & Penilaian)"], [18, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "bridge-hs-04", "Fungsi: Mesin Cetak Kode Mandiri", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 04 · Modularisasi Kode", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-04.html", "Definisikan fungsi modular dengan def nama(parameter):, bedakan parameter vs argumen, pahami perbedaan mendasar perintah return (menghasilkan nilai yang bisa disimpan) vs print() (hanya mencetak ke layar), dan reusability kode.\n\nTujuan Pembelajaran:\n• Mendefinisikan fungsi sendiri dengan kata kunci def nama_fungsi(parameter):\n• Membedakan parameter (wadah input fungsi) dan argumen (nilai nyata)\n• Memahami perbedaan penting antara perintah return (menghasilkan nilai) dan print (menampilkan ke layar)\n• Memanggil fungsi berulang kali dengan input berbeda tanpa menduplikasi kode", "⏱️ [Slide Kuis #1] Jika kita ingin hasil perhitungan dari sebuah fungsi bisa disimpan ke dalam variabel atau dipakai untuk perhitungan lain, perintah apa yang harus digunakan di akhir fungsi?\n   Pilihan: A. print(), B. return, C. break, D. input()\n   ✅ Kunci: B. return\n   💡 Penjelasan: Perintah return mengembalikan nilai ke pemanggil fungsi sehingga dapat disimpan dalam variabel. print() hanya menampilkan ke layar.", "SIMULASI INTERAKTIF MANDIRI 💻\nMembuat fungsi hitung_diskon(belanja, persen) dan memeriksa hasil return-nya\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Bahaya Copy-Paste Kode\n- 2. Anatomi Fungsi: Kata Kunci def\n- 3. Parameter vs Argumen\n- 4. Perbedaan Kritis: return vs print()\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menentukan output dari fungsi dengan return vs print", "Siap (Slide Standalone & Live Testing Verified)"], [19, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-5", "Functions in Python", "Video Interaktif & Kuis", "Materi 03 · Function", "https://youtu.be/RnyYn2SzFVU", "Functions in Python: Sintaks fungsi def, parameter input, return value, dan scope variabel (lokal vs global).", "⏱️ [52:14] INFO: Latihan: Print atau Return? 🤔\n⏱️ [52:14] INFO: Latihan: Print atau Return? 🤔", "Hands-on Pembuatan Fungsi: Menulis fungsi hitung_pajak(penghasilan) yang mengembalikan nilai nominal pajak wajib dibayar.", "def hitung_pajak(penghasilan):\n    tarif = 0.05 if penghasilan < 50000000 else 0.15\n    return penghasilan * tarif", "Siswa mampu membuat fungsi kustom dengan parameter dan return value yang benar.", "Siap (Video Terverifikasi & Kuis Aktif)"], [20, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-6", "Modular Design in Python", "Video Interaktif & Kuis", "Materi 04", "https://youtu.be/hP6MSkerx9A", "Modular Design in Python: Memecah aplikasi besar menjadi fungsi-fungsi kecil yang fokus pada 1 tugas (Single Responsibility).", "⏱️ [10:22] INFO: Latihan Debugging 🕵️‍♂️", "Refactoring Kode Modular: Mengubah skrip monolitik 50 baris menjadi 4 fungsi modular independen.", "Struktur Program Modular:\n1. Fungsi Input & Validasi\n2. Fungsi Pemrosesan & Kalkulasi\n3. Fungsi Output & Laporan", "Siswa mampu merancang arsitektur program yang rapi, modular, dan mudah di-debug.", "Siap (Video Terverifikasi & Kuis Aktif)"], [21, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-7", "Mini Project", "Proyek Mandiri Python", "Checkpoint 05", "https://youtu.be/hP6MSkerx9A", "Mini Project Fungsi Modular: Membangun modul kalkulator suku bunga pinjaman dan simulasi cicilan bulanan (Amortisasi).", "⏱️ [00:00] Apa manfaat utama memisahkan perhitungan diskon ke dalam fungsi 'hitung_diskon(subtotal)' tersendiri?\n   Pilihan: A. Kode jadi lebih panjang dan membingungkan, B. Prinsip modularitas: aturan diskon mudah diubah sewaktu-waktu tanpa mengganggu fungsi cetak struk, C. Agar program hanya bisa dijalankan di satu laptop saja, D. Mengurangi kecepatan loading Colab\n   ✅ Kunci: B", "MINI PROJECT 03: Kalkulator Simulasi Cicilan Finansial 💳\nTugas Siswa:\n1. Buat fungsi 'hitung_angsuran(pokok, bunga, tenor)'\n2. Buat fungsi 'tampilkan_tabel_angsuran(jadwal)'\n3. Jalankan fungsi utama 'main()' untuk menyatukan alur program.\nOutput: Modul kalkulator cicilan finansial terstandar.", "def hitung_angsuran(pokok, bunga_tahunan, tenor_bulan):\n    bunga_bulan = (bunga_tahunan / 100) / 12\n    return pokok * (bunga_bulan / (1 - (1 + bunga_bulan)**(-tenor_bulan)))", "Siswa menguasai pembuatan modul fungsi keuangan dengan rumus matematis nyata.", "Siap (Framework Proyek & Penilaian)"], [22, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-8", "Financial Literacy", "Video Interaktif & Kuis", "Menabung, Bunga Tunggal, Bunga Majemuk", "https://youtu.be/hP6MSkerx9A", "Financial Literacy: Konsep Cashflow (arus kas positif vs negatif), rasio likuiditas, dan pentingnya pembukuan rapi.", "⏱️ [23:12] INFO: Latihan: Lengkapi Function 🧩\n⏱️ [34:12] INFO: Latihan: Tebak Hasil Tahun Pertama 🧠", "Analisis Studi Kasus UMKM: Mengevaluasi laporan keuangan toko kelontong digital dan mendiagnosis kebocoran dana operasional.", "Net Cashflow = Total Pemasukan - Total Pengeluaran\nJika Cashflow Negatif -> Potong pos keinginan / tingkatkan pemasukan", "Siswa memahami indikator kesehatan finansial dan manajemen arus kas bisnis.", "Siap (Video Terverifikasi & Kuis Aktif)"], [23, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "bridge-hs-05", "Kamus Data: Menyimpan Transaksi dengan Dictionary", "Materi Jembatan Interaktif (Slide Standalone)", "Materi Jembatan 05 · Struktur Data Lanjutan", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-05.html", "Pahami konsep Key-Value pair pada struktur data Dictionary { }, akses data via data['nominal'], simpan riwayat mutasi transaksi berupa List of Dictionaries, dan pelajari cara menambahkan transaksi baru dengan method .append().\n\nTujuan Pembelajaran:\n• Memahami konsep Key-Value pair pada struktur data Dictionary { }\n• Mengakses nilai dictionary menggunakan kuncinya: data[\"nominal\"]\n• Menyimpan sekumpulan record transaksi dalam format List of Dictionaries\n• Menambahkan item transaksi baru ke dalam list riwayat dengan .append()", "⏱️ [Slide Kuis #1] Jika transaksi = {'kategori': 'Makan', 'nominal': 15000}, bagaimana cara mengambil angka nominal 15000 tersebut?\n   Pilihan: A. transaksi[0], B. transaksi['nominal'], C. transaksi.nominal, D. transaksi.get_all()\n   ✅ Kunci: B. transaksi['nominal']\n   💡 Penjelasan: Pada dictionary Python, nilai diakses menggunakan tanda kurung siku dengan nama kuncinya: transaksi['nominal'].", "SIMULASI INTERAKTIF MANDIRI 💻\nMembaca mutasi rekening dalam bentuk list of dicts dan mencetak laporannya\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul.", "Panduan Navigasi Slide:\n- 1. Keterbatasan List Tunggal\n- 2. Kamus Data: Key-Value Pair { }\n- 3. Mengakses Nilai Menggunakan Kunci\n- 4. Menyimpan Riwayat: List of Dictionaries\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi.", "Menjawab kuis akses key dictionary dan manipulasi list of dicts", "Siap (Slide Standalone & Live Testing Verified)"], [24, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-1-2", "Sanitasi & Validasi Input dalam Program Keuangan", "Video Interaktif & Kuis", "Materi 02", "https://youtu.be/pKYN1E60xtU", "Sanitasi & Validasi Input Keuangan: Memeriksa nilai tidak boleh negatif, mencegah input kosong, dan validasi jenis transaksi (debit/kredit).", "⏱️ [17:57] INFO: Bahayanya Angka Negatif! ⚠️\n⏱️ [26:23] INFO: Latihan: Lengkapi Function! 🧩\n⏱️ [26:23] INFO: Latihan: Lengkapi Method! 🧩\n⏱️ [26:23] INFO: Latihan: Lengkapi Function `validate_amount` 🧩\n⏱️ [26:23] INFO: Kuis Kilat: Sanitasi vs Validasi ⚖️", "Latihan Validasi Fungsi: Menulis fungsi clean_text(teks) dan validate_amount(nominal) untuk memeriksa syarat angka > 0.", "if nominal <= 0:\n    print('Nominal harus lebih dari 0!')\nelse:\n    saldo += nominal", "Siswa mampu menulis logika pemeriksaan awal untuk mencegah data input tidak valid masuk ke sistem.", "Siap (Video Terverifikasi & Kuis Aktif)"], [25, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-1-3", "Safe Transaction Input", "Proyek Mandiri Python (Persiapan Capstone)", "Mini Project", "https://youtu.be/pKYN1E60xtU", "Safe Transaction Input: Membangun terminal input pencatatan saldo yang memvalidasi tipe data dan batas nominal minimum.", "⏱️ [00:00] INFO: Mini Project: Safe Transaction Input 🛡️", "MINI PROJECT 05: Safe Transaction Input 🛡️\nTugas Siswa:\n1. Buat program konsol input transaksi dompet digital\n2. Minta input kategori dan nominal uang\n3. Terapkan sanitasi .strip().lower()\n4. Validasi nilai harus berupa angka positif\n5. Cetak konfirmasi transaksi yang berhasil dicatat.\nOutput: Script Python input saldo transaksi yang tahan kesalahan input user.", "def catat_transaksi():\n    raw = input('Nominal: ').strip()\n    # validasi angka & simpan", "Siswa menghasilkan script Python input transaksi yang tahan terhadap kesalahan pengetikan pengguna.", "Siap (Framework Proyek & Penilaian)"], [26, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-1", "Try-Except dan Debugging Program Python", "Video Interaktif & Kuis", "Materi 03", "https://youtu.be/pKYN1E60xtU", "Try-Except & Debugging: Menangani runtime error (ValueError, ZeroDivisionError), blok try-except-else-finally.", "⏱️ [31:22] INFO: Jenis Error yang Sering Muncul 🐛\n⏱️ [38:17] INFO: Latihan: Tebak Jenis Error! 🕵️‍♂️\n⏱️ [38:17] INFO: Latihan: Lengkapi Blok `try-except` 🧩", "Hands-on Error Handling: Membungkus konversi int(input()) dengan blok try-except ValueError agar aplikasi tidak crash.", "try:\n    nominal = float(input('Nominal: '))\nexcept ValueError:\n    print('Error: Masukkan angka yang valid!')", "Siswa mampu mencegah program crash akibat kesalahan ketik input dari pengguna.", "Siap (Video Terverifikasi & Kuis Aktif)"], [27, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-2", "Safe Input with Error Handling", "Proyek Mandiri Python", "Mini Project", "https://youtu.be/pKYN1E60xtU", "Safe Input with Error Handling: Membuat modul pembaca input uang yang kebal terhadap huruf, simbol aneh, dan angka negatif.", "⏱️ [39:16] INFO: Mini Project: Safe Input with Error Handling 🛡️", "MINI PROJECT 04: Modul Pembaca Input Kebal Crash 🛡️\nTugas Siswa:\n1. Buat fungsi 'get_valid_amount(prompt)'\n2. Pasang loop while True dengan try-except\n3. Uji dengan memasukkan huruf 'abc', simbol '#$%', dan angka minus '-5000'\n4. Buktikan program terus meminta input ulang dengan ramah tanpa crash.\nOutput: Fungsi sanitasi input profesional siap pakai.", "def get_valid_amount(prompt):\n    while True:\n        try:\n            val = float(input(prompt))\n            if val > 0: return val\n            print('Nominal harus positif!')\n        except ValueError:\n            print('Masukkan format angka!')", "Siswa mampu membuat fungsi pertahanan input (defensive programming) tingkat lanjut.", "Siap (Framework Proyek & Penilaian)"], [28, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-3", "Langkah Debugging Code", "Video Interaktif & Kuis", "Materi 04", "https://youtu.be/pKYN1E60xtU", "Langkah Debugging Code: Membaca Traceback error Python, mendiagnosis letak baris penyebab bug, dan menggunakan print-debugging.", "⏱️ [49:08] INFO: Latihan: Cari Sumber Bug 🔎\n⏱️ [49:08] INFO: Latihan: Perbaiki Nilai Diskon 🛠️", "Latihan Membaca Traceback: Menganalisis 3 pesan error umum (NameError, TypeError, IndexError) dan memperbaikinya.", "Cara Membaca Traceback:\n1. Lihat baris terbawah untuk nama error\n2. Lihat baris kode file yang ditunjuk panah\n3. Periksa tipe variabel pada baris tersebut", "Siswa percaya diri dalam membaca pesan error dan mampu memperbaiki bug secara mandiri.", "Siap (Video Terverifikasi & Kuis Aktif)"], [29, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-4", "Debugging Program Belanja", "Proyek Mandiri Python", "Mini Project", "https://youtu.be/pKYN1E60xtU", "Debugging Program Belanja: Mengidentifikasi dan memperbaiki 5 bug logika tersembunyi pada kode aplikasi kasir toko.", "⏱️ [00:00] INFO: Mini Project: Debugging Program Belanja 🛍️🕵️‍♂️", "MINI PROJECT 06: Detektif Kode — Bug Hunter Kasir Toko 🔍\nTugas Siswa:\n1. Unduh kode kasir toko yang sengaja dirusak (mengandung bug diskon, bug kembalian minus, dan bug tipe data)\n2. Pasang print-debug dan perbaiki tiap kesalahan\n3. Pastikan program menghasilkan struk belanja yang 100% akurat.\nOutput: Kode kasir yang telah di-refactor bebas bug.", "Checklist Debugging:\n[ ] Cek tipe data tiap variabel\n[ ] Cek tanda operator matematika\n[ ] Cek kondisi percabangan batas minimum", "Siswa memiliki insting investigasi bug kode yang tajam.", "Siap (Framework Proyek & Penilaian)"], [30, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-5", "Dictionary dan List Transaksi", "Video Interaktif & Kuis", "Materi 04", "https://youtu.be/pKYN1E60xtU", "Dictionary & List Transaksi: Menggabungkan struktur data List of Dictionaries untuk menyimpan riwayat transaksi lengkap dengan tanggal, kategori, dan nominal.", "⏱️ [56:54] INFO: Pemahaman: Dictionary & Keys 🔑\n⏱️ [64:53] INFO: Latihan: Data Structures 🧩", "Hands-on Struktur Data: Membuat list 'buku_kas = []' dan menambahkan data transaksi baru menggunakan buku_kas.append({...}).", "buku_kas = []\nbuku_kas.append({'tgl': '08-09', 'pos': 'Makan', 'nominal': 20000})\nfor trx in buku_kas:\n    print(f\"{trx['tgl']} - {trx['pos']}: Rp {trx['nominal']:,}\")", "Siswa menguasai manipulasi database memori terstruktur menggunakan List of Dictionaries.", "Siap (Video Terverifikasi & Kuis Aktif)"], [31, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-6", "Analisis Data Keuangan dengan Python", "Video Interaktif & Kuis", "Materi 05", "https://youtu.be/pKYN1E60xtU", "Analisis Data Keuangan dengan Python: Menghitung total pengeluaran per kategori (filter), mencari transaksi terbesar (max), dan rata-rata pengeluaran harian.", "⏱️ [71:03] INFO: Perintah Python 🐍 (1/4)\n⏱️ [71:03] INFO: Perintah Python 🐍 (2/4)\n⏱️ [71:03] INFO: Perintah Python 🐍 (3/4)\n⏱️ [71:03] INFO: Perintah Python 🐍 (4/4)\n⏱️ [73:26] INFO: Perintah Python 🐍 (1/4)\n⏱️ [73:26] INFO: Perintah Python 🐍 (2/4)\n⏱️ [73:26] INFO: Perintah Python 🐍 (3/4)\n⏱️ [73:26] INFO: Perintah Python 🐍 (4/4)", "Latihan Agregasi Data: Menulis skrip analitik yang mengelompokkan total belanja berdasarkan kategori 'Makanan', 'Transport', dan 'Pendidikan'.", "kategori_total = {}\nfor trx in buku_kas:\n    k = trx['kategori']\n    kategori_total[k] = kategori_total.get(k, 0) + trx['nominal']", "Siswa mampu menghasilkan wawasan analitik dari data transaksi terstruktur.", "Siap (Video Terverifikasi & Kuis Aktif)"], [32, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-1", "Design Thinking & Kebutuhan Pengguna", "Video Interaktif & Konsep Capstone", "BERTANYA SEBELUM BERAKSI", "https://youtu.be/S1j2gt3Up74", "Design Thinking & Kebutuhan Pengguna: Menentukan persona pengguna (pelajar/mahasiswa), memetakan pain points pencatatan uang manual, merumuskan fitur solusi.", "⏱️ [02:51] Susun Kalimat Masalah Sendiri\n⏱️ [15:59] Pasangkan Kebutuhan Pengguna dengan Fitur yang Cocok\n⏱️ [18:21] Bisa Dibuat Sekarang atau Nanti? (Feasibility)", "Perancangan Persona Pengguna: Menyusun lembar profil calon pengguna aplikasi keuangan cerdas.", "Design Thinking Stage:\n1. Empathize: Rasakan kesulitan pengguna\n2. Define: Rumuskan problem statement\n3. Ideate: Rancang fitur solusi terbaik", "Siswa mampu merancang solusi perangkat lunak yang berorientasi pada kebutuhan pengguna nyata.", "Siap (Video Terverifikasi & Kuis Aktif)"], [33, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-2", "Flowchart & Use Case", "Video Interaktif & Desain Sistem", "MERANCANG PROGRAM", "https://youtu.be/S1j2gt3Up74", "Flowchart & Use Case: Merancang diagram alur program menyeluruh (Menu Utama, Catat Transaksi, Lihat Laporan, Rekomendasi Pintar, Ekspor Data).", "⏱️ [30:47] Mini Activity: Rakit Peta Petualangan ⚙️ Klik tombol alur di bawah secara berurutan agar aplikasi celengan kita berjalan benar!\n⏱️ [33:16] Cara Memasukkan ASCII Art ke Python\n⏱️ [37:07] Latihan: Pasangkan Tombol & Fungsi 🧩", "Perancangan Diagram Sistem: Menggambar bagan alur eksekusi aplikasi Capstone sebelum implementasi kode.", "Diagram Menu Utama:\n1. Tambah Transaksi -> Validasi -> Simpan\n2. Lihat Buku Kas -> Format Tampilan\n3. Evaluasi Finansial -> Analitik Cerdas\n4. Keluar", "Siswa mampu merencanakan arsitektur alur program kompleks secara terstruktur.", "Siap (Video Terverifikasi & Kuis Aktif)"], [34, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-3", "Menganalisis Data Transaksi", "Video Interaktif & Logika Analitik", "DATA CELENGAN", "https://youtu.be/S1j2gt3Up74", "Menganalisis Data Transaksi: Mengolah riwayat transaksi untuk mendeteksi anomali overspending dan mengukur rasio kesehatan dompet digital.", "⏱️ [02:30] Bagaimana cara elegan di Python untuk menjumlahkan nominal pada dictionary 'kategori_total[kat]' jika key tersebut belum pernah ada sebelumnya?\n   Pilihan: A. kategori_total[kat] = kategori_total[kat] + nominal, B. kategori_total[kat] = kategori_total.get(kat, 0) + nominal, C. delete kategori_total[kat], D. kategori_total.clear()\n   ✅ Kunci: B", "Latihan Algoritma Deteksi: Menulis algoritma yang memberikan alert peringatan jika pengeluaran harian melampaui rata-rata 3 hari sebelumnya.", "if pengeluaran_hari_ini > (rata_rata * 1.5):\n    print('⚠️ Alert: Pengeluaran tidak wajar terdeteksi!')", "Siswa mampu mengintegrasikan logika analitik prediktif ke dalam aplikasi kasir.", "Siap (Video Terverifikasi & Kuis Aktif)"], [35, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-4", "Logika & Rekomendasi Pintar", "Video Interaktif & Logika Rekomendasi", "FINANCIAL DATA", "https://youtu.be/S1j2gt3Up74", "Logika Rekomendasi Pintar: Menghasilkan saran finansial otomatis yang dipersonalisasi berdasarkan perilaku belanja siswa.", "⏱️ [49:33] Tebak Rahasia Data 🕵️", "Latihan Engine Rekomendasi: Menghasilkan rekomendasi 'Pangkas jajan kopi' jika pos hiburan melampaui 35% total budget.", "def rekomendasi_anggaran(rasio_wants):\n    if rasio_wants > 30:\n        return 'Kurangi pos belanja non-pokok minggu ini!'\n    return 'Anggaranmu dalam batas aman prima.'", "Siswa mampu membangun aturan rekomendasi cerdas (Rule-based Expert System).", "Siap (Video Terverifikasi & Kuis Aktif)"], [36, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-5", "Menyatukan Kode Program", "Final Capstone Project SMA", "APP INTEGRATION", "https://youtu.be/S1j2gt3Up74", "Final Project: Membangun Aplikasi Konsol 'Smart Personal Financial Advisor & Transaction Tracker' Berbasis Python secara Utuh.", "⏱️ [52:01] Pasangkan Kekuatan Konsep! 🧩\n⏱️ [61:01] Misi Penyelamatan: Jinakkan Loop Gila! 🕵️‍♂️", "FINAL CAPSTONE PROJECT SMA: Python Smart Financial Advisor 🏆\nTugas Siswa:\n1. Bangun aplikasi Python lengkap dalam 1 file notebook Colab terstruktur\n2. Terapkan modul input tahan crash (Try-Except), list of dicts database, modular functions, dan logika rekomendasi belanja\n3. Sediakan antarmuka terminal interaktif berbasis teks dengan menu navigasi yang elegan\n4. Jalankan pengujian menyeluruh dengan minimal 10 transaksi dummy\n5. Kumpulkan link Google Colab publik ke platform LMS.\nOutput: Sistem terminal penasihat keuangan pintar karya mandiri.", "Struktur Capstone Final:\n- Module 1: Input Validator & Sanitizer\n- Module 2: Transaction Database Engine\n- Module 3: Analytics & Reporting\n- Module 4: Smart Advisor Engine\n- Module 5: Interactive Terminal CLI Loop", "Siswa berhasil menciptakan aplikasi perangkat lunak Python analitik finansial yang siap pakai dan layak dijadikan portofolio unggulan.", "Siap (Framework Capstone Project)"]], "changelog": [[1, "Audit Blocker (B1)", "bridge-ms-00.html & bridge-ms-00.json (SMP Modul 0)", "Residu TinyDB pada modul orientasi awal (virtualTinyDB, simpanTinyDB, bacaTinyDB, StoreValue/GetValue). TinyDB merupakan materi Modul 4 dan dilarang diperkenalkan di Modul 0 agar tidak membingungkan siswa.", "Menghapus seluruh fungsi dan referensi TinyDB dari HTML & JSON; digantikan dengan Web Storage (localStorage) standar murni untuk penyimpanan preferensi visual/audio tanpa memperkenalkan blok TinyDB prematur.", "❌ GAGAL (Tercemar komponen Storage Modul 4)", "✅ RESOLVED (100% Bersih dari Residu TinyDB)", "Gate 4 audit lolos 0 match regex TinyDB; pengujian simulasi berjalan mulus di browser."], [2, "Audit Blocker (B2)", "hs-4-6, hs-5-1, ms-1-4, ms-3-1, hs-5-3, ms-4-4", "Anomali timestamp: bookmark video berada di luar batas durasi total (misal 12:00 saat video hanya 11:24) dan trigger kuis pop-up berada di luar rentang aktif video.", "Timestamp asli 100% dipertahankan tanpa diubah atau ditebak sembarangan. Anomali bookmark (hs-4-6, hs-5-1, ms-1-4, ms-3-1) dan kuis segmen (hs-5-3, ms-4-4) diamankan secara non-destruktif dengan status 'review_required', 'outOfBounds: true', dan 'manual_checkpoint' (autoplay: false) agar pemutar video tidak crash.", "❌ ANOMALI (Bookmark & kuis out-of-bounds)", "✅ RESOLVED (Timestamp Asli Dipertahankan & Anomali Diamankan)", "Gate 6 audit-verifikasi lolos: 6 anomali terbukti berstatus review_required & manual_checkpoint; pemutar video aman."], [3, "Audit Blocker (B3)", "bridge-hs-01.json, bridge-ms-01.json, & 8 Bridge JSON", "Inkonsistensi skema metadata: bridge-hs-01 dan bridge-ms-01 menggunakan skema lama tanpa array learningObjectives; kicker dan duration tidak seragam.", "Standardisasi seluruh 10 file metadata JSON bridge slides dengan skema kanonikal v1 (level, kicker, duration, learningObjectives, practice, completionCriteria, bookmarks, quizzes).", "❌ INKONSISTEN (Skema metadata berbeda)", "✅ RESOLVED (10/10 File Terstandar Penuh)", "Gate 5 & 6 lolos validasi skema JSON v1 100% tanpa ada field yang hilang."], [4, "Audit Blocker (B4)", "scripts/verify_scaffolding.py", "Skrip validasi awal hanya memiliki 4 gate sederhana dan tidak mendeteksi anomali batas durasi video atau pencemaran konsep antar modul.", "Ekspansi skrip verifikasi otomatis menjadi 8-Gate Validator komprehensif (Integritas File, Prasyarat DAG, Batas Timestamp, Residu TinyDB, Skema Metadata, Kuis 100%, QA Visual).", "⚠️ PARSIAL (4 Gate Sederhana)", "✅ RESOLVED (8/8 Gates Passed, Zero Warning)", "Eksekusi verify_scaffolding.py menghasilkan exit code 0 tanpa error atau warning."], [5, "Arsitektur Scaffolding", "hs-1-3 (Safe Transaction Input) -> Direlokasi ke Modul 4", "Siswa di Modul 1 dituntut membuat script terminal pencatatan transaksi sebelum mempelajari loops, functions, atau dictionaries, memicu cognitive overload.", "Merelokasi hs-1-3 ke Modul 4 (Keamanan Kode & Validasi) tepat setelah materi sanitasi input dan sebelum persiapan capstone Modul 5.", "⚠️ COGNITIVE OVERLOAD (Loncat Konsep)", "✅ RESOLVED (Alur Scaffolding Bertahap & Mulus)", "Struktur DAG kurikulum SMA lolos validasi dependensi prasyarat berurutan."], [6, "Materi Jembatan (Bridge)", "10 Slide Bridge (bridge-ms-00..03 & bridge-hs-00..05)", "Kesenjangan pemahaman antara video tutorial konseptual dengan hands-on praktikum di MIT App Inventor dan Google Colab Python.", "Membangun 10 modul slide interaktif mandiri berstandar web modern (Glassmorphism, simulator interaktif, pop-up quiz, live testing guide).", "❌ BELUM ADA (Gap Pengetahuan Siswa)", "✅ IMPLEMENTED (10/10 Slide Lengkap & Live)", "10 slide terdeploy di GitHub Pages dan terintegrasi penuh ke platform LMS."], [7, "Penjaminan Mutu Visual (QA)", "run_visual_qa.py & 20 Tangkapan Layar QA", "Memastikan seluruh slide interaktif bebas dari runtime JavaScript error dan tampilan responsif di desktop maupun smartphone.", "Automasi pengujian browser nyata (Playwright) di viewport Desktop (1440x900) dan Mobile (375x812) dengan audit console log otomatis.", "⚠️ BELUM DIUJI (Potensi Layout Overflow)", "✅ VERIFIED (20/20 Lolos, 0 Console Error)", "Tersimpan 20 tangkapan layar verifikasi di drafts/qa/screenshots/."], [8, "Integritas & Sinkronisasi File", "sync_to_production.py & 3 Direktori Repositori", "Risiko ketidakcocokan versi dataset dan slide antara modul perancangan kurikulum, aplikasi LMS, dan web publik.", "Otomasi sinkronisasi file terpusat dengan verifikasi hash SHA256 identik antara Subproject 02, Subproject 01, dan docs/.", "⚠️ DESINKRONISASI (File Tersebar Manual)", "✅ SYNCHRONIZED (Hash SHA256 100% Identik)", "Skrip audit SHA256 mengonfirmasi kecocokan hash 100% di semua direktori produksi."], [9, "Sistem Rekapitulasi & Penilaian", "ops-result-sd, ops-result-smp, ops-result-sma & Code.gs", "Tab penilaian di spreadsheet belum memuat kolom untuk 4 bridge SMP dan 6 bridge SMA, serta perlu sistem grade 0-100 transparan.", "Menyesuaikan header pelacakan nilai menjadi 8 step SD, 36 step SMP, dan 36 step SMA; mencatat skor kuis individual dan total nilai konversi 100.", "⚠️ INKOMPLIT (Belum ada kolom materi bridge)", "✅ UPDATED (Lengkap 8 SD, 36 SMP, 36 SMA)", "Fungsi setupResultTrackingSheets() di Apps Script berhasil di-deploy."], [10, "Publikasi Master Spreadsheet", "Master Spreadsheet (ID: 1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k)", "Menyajikan seluruh detail kurikulum multi-jenjang, pemetaan kuis/proyek, dan catatan audit perubahan secara transparan untuk stakeholder.", "Mengunggah data v3 ke tab materi-sd, materi-smp, materi-sma, tab ops-result, dan tab baru Changelog & Audit Log.", "⚠️ OUTDATED (Belum mencerminkan hasil audit)", "✅ LIVE & SYNCHRONIZED (Single Source of Truth)", "Eksekusi otomatis via Apps Script & verifikasi visual tangkapan layar."], [11, "Injeksi Kurikulum Scratch SD Final (22 Step)", "materi-sd, ops-result-sd, Code.gs, courseData-upperprimary.json", "Tab materi-sd sebelumnya masih memuat draft placeholder 8 baris dan ops-result-sd hanya memiliki 8 kolom evaluasi.", "Menginjeksi kurikulum Scratch SD final 22 step (6 modul: 5 slide bridge interaktif + 17 video tutorial resmi Kak Laras), menstandarisasi introMode: embedded, dan memperluas kolom pelacakan ops-result-sd menjadi 22 step lengkap.", "⚠️ INKOMPLIT (Draft Placeholder 8 Baris)", "✅ LIVE & SYNCHRONIZED (22 Step Paripurna)", "Eksekusi otomatis via Apps Script CDP, inspeksi runtime LMS (23 tab), dan verifikasi visual Google Sheet."]]};
  
  const configs = [
    { sheetName: 'materi-sd', title: 'Kurikulum SD (Upper Primary)', rows: payload.sd },
    { sheetName: 'materi-smp', title: 'Kurikulum SMP (Middle School)', rows: payload.smp },
    { sheetName: 'materi-sma', title: 'Kurikulum SMA (High School)', rows: payload.sma }
  ];
  
  configs.forEach(cfg => {
    let sheet = ss.getSheetByName(cfg.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(cfg.sheetName);
    } else {
      sheet.clear();
    }
    
    // Set Header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#092764');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 38);
    
    // Set Rows
    if (cfg.rows && cfg.rows.length > 0) {
      const dataRange = sheet.getRange(2, 1, cfg.rows.length, headers.length);
      dataRange.setValues(cfg.rows);
      dataRange.setVerticalAlignment('top');
      dataRange.setFontFamily('Arial');
      dataRange.setFontSize(10);
      
      // Center alignment for specific columns
      sheet.getRange(2, 1, cfg.rows.length, 1).setHorizontalAlignment('center');
      sheet.getRange(2, 2, cfg.rows.length, 1).setHorizontalAlignment('center');
      sheet.getRange(2, 4, cfg.rows.length, 1).setHorizontalAlignment('center');
      sheet.getRange(2, 6, cfg.rows.length, 2).setHorizontalAlignment('center');
      sheet.getRange(2, 14, cfg.rows.length, 1).setHorizontalAlignment('center');
      
      // Shading alternating rows
      for (let r = 2; r <= cfg.rows.length + 1; r++) {
        if (r % 2 === 1) {
          sheet.getRange(r, 1, 1, headers.length).setBackground('#F8F9FA');
        }
      }
      
      // Wrap text for descriptive columns (9, 10, 11, 12, 13)
      sheet.getRange(2, 9, cfg.rows.length, 5).setWrap(true);
    }
    
    sheet.setFrozenRows(1);
    
    // Custom column widths
    sheet.setColumnWidth(1, 45);   // No
    sheet.setColumnWidth(2, 100);  // Modul ID
    sheet.setColumnWidth(3, 220);  // Nama Modul
    sheet.setColumnWidth(4, 90);   // Step ID
    sheet.setColumnWidth(5, 230);  // Judul Step
    sheet.setColumnWidth(6, 180);  // Tipe
    sheet.setColumnWidth(7, 130);  // Kicker
    sheet.setColumnWidth(8, 240);  // Link Media
    sheet.setColumnWidth(9, 310);  // Konsep
    sheet.setColumnWidth(10, 350); // Pop-up Quiz
    sheet.setColumnWidth(11, 350); // Mini Project
    sheet.setColumnWidth(12, 270); // Cheatsheet
    sheet.setColumnWidth(13, 280); // Capaian
    sheet.setColumnWidth(14, 160); // Status
  });
  
  return { 
    success: true, 
    message: "Tab materi-sd (22), materi-smp (36), materi-sma (36) berhasil diperbarui!", 
    totalSD: payload.sd.length, 
    totalSMP: payload.smp.length, 
    totalSMA: payload.sma.length 
  };
}

// ==================== CHANGELOG & AUDIT LOG POPULATOR ====================
function populateChangelogSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetName = "Changelog & Audit Log";
  
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  
  const headers = [
    "No",
    "Aspek Perbaikan",
    "Komponen & File Terdampak",
    "Deskripsi Isu Sebelumnya",
    "Implementasi Solusi Paripurna",
    "Kondisi Awal",
    "Kondisi Final",
    "Metode Verifikasi & Bukti Uji"
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground('#092764');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  
  const changelogRows = [[1, "Audit Blocker (B1)", "bridge-ms-00.html & bridge-ms-00.json (SMP Modul 0)", "Residu TinyDB pada modul orientasi awal (virtualTinyDB, simpanTinyDB, bacaTinyDB, StoreValue/GetValue). TinyDB merupakan materi Modul 4 dan dilarang diperkenalkan di Modul 0 agar tidak membingungkan siswa.", "Menghapus seluruh fungsi dan referensi TinyDB dari HTML & JSON; digantikan dengan Web Storage (localStorage) standar murni untuk penyimpanan preferensi visual/audio tanpa memperkenalkan blok TinyDB prematur.", "❌ GAGAL (Tercemar komponen Storage Modul 4)", "✅ RESOLVED (100% Bersih dari Residu TinyDB)", "Gate 4 audit lolos 0 match regex TinyDB; pengujian simulasi berjalan mulus di browser."], [2, "Audit Blocker (B2)", "hs-4-6, hs-5-1, ms-1-4, ms-3-1, hs-5-3, ms-4-4", "Anomali timestamp: bookmark video berada di luar batas durasi total (misal 12:00 saat video hanya 11:24) dan trigger kuis pop-up berada di luar rentang aktif video.", "Timestamp asli 100% dipertahankan tanpa diubah atau ditebak sembarangan. Anomali bookmark (hs-4-6, hs-5-1, ms-1-4, ms-3-1) dan kuis segmen (hs-5-3, ms-4-4) diamankan secara non-destruktif dengan status 'review_required', 'outOfBounds: true', dan 'manual_checkpoint' (autoplay: false) agar pemutar video tidak crash.", "❌ ANOMALI (Bookmark & kuis out-of-bounds)", "✅ RESOLVED (Timestamp Asli Dipertahankan & Anomali Diamankan)", "Gate 6 audit-verifikasi lolos: 6 anomali terbukti berstatus review_required & manual_checkpoint; pemutar video aman."], [3, "Audit Blocker (B3)", "bridge-hs-01.json, bridge-ms-01.json, & 8 Bridge JSON", "Inkonsistensi skema metadata: bridge-hs-01 dan bridge-ms-01 menggunakan skema lama tanpa array learningObjectives; kicker dan duration tidak seragam.", "Standardisasi seluruh 10 file metadata JSON bridge slides dengan skema kanonikal v1 (level, kicker, duration, learningObjectives, practice, completionCriteria, bookmarks, quizzes).", "❌ INKONSISTEN (Skema metadata berbeda)", "✅ RESOLVED (10/10 File Terstandar Penuh)", "Gate 5 & 6 lolos validasi skema JSON v1 100% tanpa ada field yang hilang."], [4, "Audit Blocker (B4)", "scripts/verify_scaffolding.py", "Skrip validasi awal hanya memiliki 4 gate sederhana dan tidak mendeteksi anomali batas durasi video atau pencemaran konsep antar modul.", "Ekspansi skrip verifikasi otomatis menjadi 8-Gate Validator komprehensif (Integritas File, Prasyarat DAG, Batas Timestamp, Residu TinyDB, Skema Metadata, Kuis 100%, QA Visual).", "⚠️ PARSIAL (4 Gate Sederhana)", "✅ RESOLVED (8/8 Gates Passed, Zero Warning)", "Eksekusi verify_scaffolding.py menghasilkan exit code 0 tanpa error atau warning."], [5, "Arsitektur Scaffolding", "hs-1-3 (Safe Transaction Input) -> Direlokasi ke Modul 4", "Siswa di Modul 1 dituntut membuat script terminal pencatatan transaksi sebelum mempelajari loops, functions, atau dictionaries, memicu cognitive overload.", "Merelokasi hs-1-3 ke Modul 4 (Keamanan Kode & Validasi) tepat setelah materi sanitasi input dan sebelum persiapan capstone Modul 5.", "⚠️ COGNITIVE OVERLOAD (Loncat Konsep)", "✅ RESOLVED (Alur Scaffolding Bertahap & Mulus)", "Struktur DAG kurikulum SMA lolos validasi dependensi prasyarat berurutan."], [6, "Materi Jembatan (Bridge)", "10 Slide Bridge (bridge-ms-00..03 & bridge-hs-00..05)", "Kesenjangan pemahaman antara video tutorial konseptual dengan hands-on praktikum di MIT App Inventor dan Google Colab Python.", "Membangun 10 modul slide interaktif mandiri berstandar web modern (Glassmorphism, simulator interaktif, pop-up quiz, live testing guide).", "❌ BELUM ADA (Gap Pengetahuan Siswa)", "✅ IMPLEMENTED (10/10 Slide Lengkap & Live)", "10 slide terdeploy di GitHub Pages dan terintegrasi penuh ke platform LMS."], [7, "Penjaminan Mutu Visual (QA)", "run_visual_qa.py & 20 Tangkapan Layar QA", "Memastikan seluruh slide interaktif bebas dari runtime JavaScript error dan tampilan responsif di desktop maupun smartphone.", "Automasi pengujian browser nyata (Playwright) di viewport Desktop (1440x900) dan Mobile (375x812) dengan audit console log otomatis.", "⚠️ BELUM DIUJI (Potensi Layout Overflow)", "✅ VERIFIED (20/20 Lolos, 0 Console Error)", "Tersimpan 20 tangkapan layar verifikasi di drafts/qa/screenshots/."], [8, "Integritas & Sinkronisasi File", "sync_to_production.py & 3 Direktori Repositori", "Risiko ketidakcocokan versi dataset dan slide antara modul perancangan kurikulum, aplikasi LMS, dan web publik.", "Otomasi sinkronisasi file terpusat dengan verifikasi hash SHA256 identik antara Subproject 02, Subproject 01, dan docs/.", "⚠️ DESINKRONISASI (File Tersebar Manual)", "✅ SYNCHRONIZED (Hash SHA256 100% Identik)", "Skrip audit SHA256 mengonfirmasi kecocokan hash 100% di semua direktori produksi."], [9, "Sistem Rekapitulasi & Penilaian", "ops-result-sd, ops-result-smp, ops-result-sma & Code.gs", "Tab penilaian di spreadsheet belum memuat kolom untuk 4 bridge SMP dan 6 bridge SMA, serta perlu sistem grade 0-100 transparan.", "Menyesuaikan header pelacakan nilai menjadi 8 step SD, 36 step SMP, dan 36 step SMA; mencatat skor kuis individual dan total nilai konversi 100.", "⚠️ INKOMPLIT (Belum ada kolom materi bridge)", "✅ UPDATED (Lengkap 8 SD, 36 SMP, 36 SMA)", "Fungsi setupResultTrackingSheets() di Apps Script berhasil di-deploy."], [10, "Publikasi Master Spreadsheet", "Master Spreadsheet (ID: 1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k)", "Menyajikan seluruh detail kurikulum multi-jenjang, pemetaan kuis/proyek, dan catatan audit perubahan secara transparan untuk stakeholder.", "Mengunggah data v3 ke tab materi-sd, materi-smp, materi-sma, tab ops-result, dan tab baru Changelog & Audit Log.", "⚠️ OUTDATED (Belum mencerminkan hasil audit)", "✅ LIVE & SYNCHRONIZED (Single Source of Truth)", "Eksekusi otomatis via Apps Script & verifikasi visual tangkapan layar."], [11, "Injeksi Kurikulum Scratch SD Final (22 Step)", "materi-sd, ops-result-sd, Code.gs, courseData-upperprimary.json", "Tab materi-sd sebelumnya masih memuat draft placeholder 8 baris dan ops-result-sd hanya memiliki 8 kolom evaluasi.", "Menginjeksi kurikulum Scratch SD final 22 step (6 modul: 5 slide bridge interaktif + 17 video tutorial resmi Kak Laras), menstandarisasi introMode: embedded, dan memperluas kolom pelacakan ops-result-sd menjadi 22 step lengkap.", "⚠️ INKOMPLIT (Draft Placeholder 8 Baris)", "✅ LIVE & SYNCHRONIZED (22 Step Paripurna)", "Eksekusi otomatis via Apps Script CDP, inspeksi runtime LMS (23 tab), dan verifikasi visual Google Sheet."]];
  
  const dataRange = sheet.getRange(2, 1, changelogRows.length, headers.length);
  dataRange.setValues(changelogRows);
  dataRange.setVerticalAlignment('top');
  dataRange.setFontFamily('Arial');
  dataRange.setFontSize(10);
  
  sheet.getRange(2, 1, changelogRows.length, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 6, changelogRows.length, 2).setHorizontalAlignment('center');
  
  for (let r = 2; r <= changelogRows.length + 1; r++) {
    if (r % 2 === 1) {
      sheet.getRange(r, 1, 1, headers.length).setBackground('#F8F9FA');
    }
  }
  
  sheet.getRange(2, 2, changelogRows.length, 4).setWrap(true);
  sheet.getRange(2, 8, changelogRows.length, 1).setWrap(true);
  
  sheet.setFrozenRows(1);
  
  sheet.setColumnWidth(1, 45);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 220);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 340);
  sheet.setColumnWidth(6, 170);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 260);

  return {
    success: true,
    message: "Tab Changelog & Audit Log berhasil dibuat dengan 11 catatan perbaikan resmi!",
    totalRecords: changelogRows.length
  };
}
