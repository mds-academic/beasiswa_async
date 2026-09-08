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
      "No", "Nama Siswa", "Sekolah", "Email Akademia", "Jenjang", "Terakhir Login"
    ]);

    // 1. Ambil daftar sekolah unik
    if (action === 'schools') {
      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      const seen = {};
      const schools = [];

      // Row 0 is warning banner, Row 1 is header, data starts at Row 2
      for (let i = 2; i < rows.length; i++) {
        const school = String(rows[i][2] || '').trim();
        const level = String(rows[i][4] || '').trim().toUpperCase();
        if (!school || seen[school.toLowerCase()]) continue;
        seen[school.toLowerCase()] = true;
        schools.push({ school, level: level || 'SMA' });
      }

      schools.sort((a, b) => a.school.localeCompare(b.school));
      return respond({ success: true, schools });
    }

    // 2. Cari murid berdasarkan sekolah
    if (action === 'students') {
      const targetSchool = String(e.parameter.school || '').toLowerCase().trim();
      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      const students = [];

      for (let i = 2; i < rows.length; i++) {
        const name = String(rows[i][1] || '').trim();
        const school = String(rows[i][2] || '').trim();
        const email = String(rows[i][3] || '').trim();

        if (school.toLowerCase() === targetSchool && email) {
          students.push({
            name,
            school,
            maskedEmail: maskEmail(email)
          });
        }
      }

      return respond({ success: true, students });
    }

    // 3. Validasi Login Murid
    if (action === 'login') {
      const email = normalizeEmail(e.parameter.email || '');
      const school = String(e.parameter.school || '').toLowerCase().trim();

      if (!email || !school) {
        return respond({ success: false, message: "Email dan sekolah wajib diisi." });
      }

      const sheet = ss.getSheetByName(SHEET_STUDENT_DATA);
      const rows = sheet.getDataRange().getValues();
      let matched = null;

      for (let i = 2; i < rows.length; i++) {
        const rName = String(rows[i][1] || '').trim();
        const rSchool = String(rows[i][2] || '').trim();
        const rEmail = normalizeEmail(rows[i][3] || '');
        const rLevel = String(rows[i][4] || 'SMA').trim().toUpperCase();

        if (rEmail === email && rSchool.toLowerCase() === school) {
          matched = {
            name: rName,
            school: rSchool,
            email: rEmail,
            level: rLevel,
            rowIndex: i + 1
          };
          break;
        }
      }

      if (matched) {
        // Update Timestamp Terakhir Login
        sheet.getRange(matched.rowIndex, 6).setValue(new Date().toISOString());
        return respond({ success: true, student: matched });
      } else {
        return respond({ success: false, message: "Email tidak terdaftar pada sekolah yang dipilih." });
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
