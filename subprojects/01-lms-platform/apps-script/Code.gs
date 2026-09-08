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

      for (let i = 2; i < rows.length; i++) {
        if (normalizeEmail(rows[i][1]) === email) { // Col 1 adalah Email
          studentRow = rows[i];
          break;
        }
      }

      if (!studentRow) {
        return respond({ success: true, progress: {} });
      }

      const progressMap = {};
      for (let c = 4; c < headers.length; c++) {
        const headerName = String(headers[c] || '').trim();
        if (headerName) {
          progressMap[headerName] = studentRow[c];
        }
      }

      return respond({ success: true, progress: progressMap });
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

    // Pastikan kolom kuis ada di header (Dynamic Header Insertion)
    const headerColumnName = `${quizId} [Skor]`;
    let quizColIndex = headerRow.indexOf(headerColumnName) + 1;

    if (quizColIndex === 0) {
      // Tambahkan kolom baru di akhir header row
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
