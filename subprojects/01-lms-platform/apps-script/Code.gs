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

    // 00. Setup Curriculum Sheets
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
    "Rangkuman / Cheatsheet Singkat",
    "Target Capaian & Hasil Belajar",
    "Status Kesiapan Materi"
  ];
  
  const payload = {"sd": [[1, "up-mod-00", "Modul 0: Orientasi Pembelajaran Asinkronus SD", "up-0-0", "Introduction to Async Learning", "Video Interaktif & Orientasi", "Video 00 · Pengenalan", "https://youtu.be/yxmLOk5vcFg", "Orientasi Pembelajaran Mandiri (Async Learning), ritme belajar personal, cara kerja pop-up quiz interaktif, panduan mandiri & bantuan fasilitator.", "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri", "Siswa memahami alur belajar mandiri di platform UOB My Digital Space dan siap mengikuti modul coding visual.", "Siap (Wadah & Video Orientasi)"], [2, "up-mod-01", "Modul 1: Petualangan Pertama — Data & Kebutuhan vs Keinginan", "up-1-1", "Mengenal & Menampilkan Data Sederhana", "Video Interaktif & Animasi Konsep", "Checkpoint 01 · Data", "", "Pengenalan Data di sekitar kita, membedakan Kebutuhan Primer (Needs) vs Keinginan (Wants), pentingnya prioritas belanja.", "Needs: Kebutuhan penting (makanan, sekolah, kesehatan)\nWants: Keinginan tambahan (mainan mahal, jajan berlebih)", "Siswa mampu mengelompokkan barang belanja ke kategori Needs vs Wants dengan tepat.", "Draft Rancangan (Curriculum Sequencing)"], [3, "up-mod-01", "Modul 1: Petualangan Pertama — Data & Kebutuhan vs Keinginan", "up-1-2", "Menjaga Keamanan Data Pribadi Online", "Proyek Mandiri Scratch", "Checkpoint 02 · Aman di Internet", "", "Pengenalan Sprite & Backdrop Scratch, event 'When Green Flag Clicked', memindahkan sprite ke keranjang yang sesuai.", "Blok Event: when green flag clicked\nBlok Motion: go to x:.. y:..\nBlok Sensing: touching mouse-pointer?", "Siswa menghasilkan game interaktif pemilahan kebutuhan belanja sederhana di Scratch.", "Draft Rancangan (Framework Siap)"], [4, "up-mod-02", "Modul 2: Celengan Digital — Mengenal Variabel di Scratch", "up-2-1", "Membuat Variabel Celengan di Scratch", "Video Interaktif & Konsep Coding", "Checkpoint 01 · Variabel", "", "Konsep Variabel sebagai kotak penyimpan nilai, membuat variabel 'Saldo_Celengan', inisialisasi nilai awal (set to 0).", "Blok Variables:\n- set [Saldo] to [0]\n- change [Saldo] by [1000]", "Siswa mengerti fungsi variabel untuk menyimpan dan memperbarui data angka secara dinamis.", "Draft Rancangan (Curriculum Sequencing)"], [5, "up-mod-02", "Modul 2: Celengan Digital — Mengenal Variabel di Scratch", "up-2-2", "Mengontrol Saldo & Menghitung Tabungan", "Proyek Mandiri Scratch", "Checkpoint 02 · Target", "", "Membuat tombol pecahan koin/uang (1.000, 2.000, 5.000), event 'when this sprite clicked', menambah isi celengan digital.", "when this sprite clicked\nchange [Saldo] by [2000]\nsay (join [Total tabungan: Rp ] [Saldo])", "Siswa berhasil membuat proyek simulasi celengan digital interaktif dengan Scratch.", "Draft Rancangan (Framework Siap)"], [6, "up-mod-03", "Modul 3: Karakter Cerdas — Logika Percabangan (If-Then)", "up-3-1", "Blok Percabangan: Jika..., Maka..., Jika Tidak...", "Video Interaktif & Logika Pemrograman", "Checkpoint 01 · Keputusan", "", "Logika Percabangan (If-Then), operator perbandingan (> dan <), mengecek apakah saldo cukup sebelum membeli barang.", "if < [Saldo] > [Harga] > then\n  say [Uang cukup! Silakan beli]\nelse\n  say [Tabung lagi ya!]", "Siswa memahami bagaimana komputer mengambil keputusan cerdas berdasarkan kondisi angka.", "Draft Rancangan (Curriculum Sequencing)"], [7, "up-mod-03", "Modul 3: Karakter Cerdas — Logika Percabangan (If-Then)", "up-3-2", "Mengirim Pesan Antar Karakter (Broadcast Message)", "Proyek Mandiri Scratch", "Checkpoint 02 · Broadcast", "", "Penerapan blok 'If-Then-Else', interaksi pembeli dan kasir, pengurangan otomatis saldo jika pembelian disetujui.", "change [Saldo] by (0 - [Harga])\nbroadcast [transaksi_sukses]", "Siswa membangun sistem simulasi kasir cerdas yang menolak pembelian jika saldo tidak cukup.", "Draft Rancangan (Framework Siap)"], [8, "up-mod-04", "Modul 4: Proyek Game Interaktif — Kuis Finansial Seru", "up-4-1", "Mini Game Petualangan Belanja Bijak", "Capstone Project Akhir", "Final Project · Game Scratch", "", "Integrasi Sprite, Variabel Skor/Saldo, Broadcast Message, Timer Game, dan Kuis Cerdas Finansial.", "Gabungan Modul 1-3:\n- Variabel Skor & Saldo\n- Logika If-Then evaluasi jawaban\n- Sound efek & pesan reward", "Siswa menghasilkan Game Kuis Edukasi Finansial lengkap yang dapat dimainkan teman dan keluarga.", "Draft Rancangan (Framework Siap)"]], "smp": [[1, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-0", "Introduction to Async Learning", "Slide Interaktif & Video Orientasi", "Video 00 · Orientasi", "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-00.html", "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, cheat sheet, dan panduan fasilitas belajar.", "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri", "Siswa memahami aturan dan ritme pembelajaran mandiri serta siap menggunakan platform LMS.", "Siap (Wadah & Slide Live)"], [2, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-1", "Sign In ke MIT App Inventor", "Video Tutorial Resmi (Kak Laras)", "Persiapan Alat · Sign In", "https://youtu.be/tT1FtLbLqkE", "Panduan Sign In ke MIT App Inventor (ai2.appinventor.mit.edu), autentikasi akun Google, menyetujui izin Terms of Service.", "1. Buka ai2.appinventor.mit.edu\n2. Klik 'Create Apps!'\n3. Login dengan akun Google\n4. Klik 'Continue' melewati welcome dialog", "Siswa berhasil login dan membuka workspace proyek perdana di MIT App Inventor.", "Siap (Video Tutorial Kak Laras)"], [3, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-2", "Mendesain User Interface (UI)", "Video Tutorial Resmi (Kak Laras)", "Desain Antarmuka · UI Designer", "https://youtu.be/5M9jTl5pPsI", "Eksplorasi antarmuka MIT App Inventor: Menu Bar, Project List, tombol Switcher Designer View vs Blocks Editor, panel Properties.", "- Designer View: Merancang tampilan visual aplikasi\n- Blocks Editor: Menyusun logika & perilaku tombol\n- Projects > Start new project", "Siswa mengenali fungsi navigasi utama di App Inventor dan memahami perbedaan Designer vs Blocks.", "Siap (Video Tutorial Kak Laras)"], [4, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-3", "Publish Proyek App Inventor ke Gallery", "Video Tutorial Resmi (Kak Laras)", "Portofolio Digital · Gallery", "https://youtu.be/_aAQ8nFUAqc", "Mengenal Palette dan Komponen UI: Menarik Button, Label, TextBox, Image dari Palette ke Viewer, mengatur Text & Background.", "- Palette: Gudang komponen (User Interface, Layout, Storage)\n- Viewer: Layar simulasi HP\n- Components: Daftar hierarki elemen", "Siswa mampu menyusun komponen User Interface dasar di layar Viewer dan mengubah properti teks.", "Siap (Video Tutorial Kak Laras)"], [5, "ms-mod-00", "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor", "ms-0-4", "Pengantar Logika Blok & Virtual TinyDB", "Video Tutorial Resmi (Kak Laras)", "Slide Interaktif · Logika Blok", "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-00.html", "Live Testing dengan MIT AI2 Companion: Mengunduh aplikasi di HP Android/iOS, menghubungkan via scan QR Code / 6-digit code, live reload.", "- Connect > AI Companion\n- Buka aplikasi MIT AI2 Companion di HP\n- Scan QR code atau ketik 6 karakter kode", "Siswa berhasil menjalankan dan menguji aplikasi secara langsung di layar smartphone fisik.", "Siap (Video Tutorial Kak Laras)"], [6, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-1", "Input Aman", "Video Interaktif & Kuis", "Checkpoint 01 · Input", "https://youtu.be/UhutS4BVKhk", "Input Aman & Validasi Form: Event handling Button.Click, membaca teks TextBox, logika pengecekan form kosong (is empty string).", "when Button1.Click do\n  if is empty TextBox1.Text then\n    set LabelStatus.Text to 'Mohon isi data!'", "Siswa dapat memvalidasi form agar aplikasi tidak error saat pengguna belum memasukkan teks.", "Siap (Video Curated & Kuis)"], [7, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-2", "Mini Project Form Aman", "Proyek Mandiri Form Aman", "Checkpoint 01 · Mini Project", "https://youtu.be/UhutS4BVKhk", "Membuat antarmuka input nomor & nama dengan tombol validasi dan label feedback visual berwarna hijau/merah.", "Desain: TextBox (Nama), TextBox (Nomor), Button (Kirim), Label (Pesan Error)\nBlok: Validasi panjang karakter & jenis angka.", "Siswa menghasilkan antarmuka form aman pertama di MIT App Inventor.", "Siap (Framework Proyek)"], [8, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-3", "Flowchart Logika Data", "Video Interaktif & Kuis", "Checkpoint 03 · Flowchart", "https://youtu.be/UhutS4BVKhk", "Flowchart & Alur Logika Data: Simbol terminator (Mulai/Selesai), proses (Persegi panjang), keputusan (Belah ketupat), input/output (Jajar genjang).", "Mulai -> Input Data -> Apakah Data Valid? [Ya -> Proses -> Simpan / Tidak -> Tampilkan Error] -> Selesai", "Siswa mampu merancang alur algoritma aplikasi ke dalam bentuk flowchart standar sebelum membuat kode blok.", "Siap (Video Curated & Kuis)"], [9, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-4", "Data & Privacy App", "Video Interaktif & Kuis", "Checkpoint 04 · Data", "https://youtu.be/UhutS4BVKhk", "Data & Privacy App: Etika perlindungan data pribadi, prinsip kerahasiaan password dan PIN, masking karakter dengan tanda bintang (*).", "Properti TextBox:\n- Set 'NumbersOnly' = true untuk input nominal uang\n- Masking data sensitif", "Siswa menyadari pentingnya privasi data dan menerapkan pembatasan input yang aman pada aplikasi.", "Siap (Video Curated & Kuis)"], [10, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-5", "Mini Project Cek Pesan Aman", "Proyek Mandiri Cek Pesan Aman", "Checkpoint 05 · Mini Project", "https://youtu.be/UhutS4BVKhk", "Membangun aplikasi pendeteksi pesan phishing/tautan mencurigakan menggunakan percabangan kata kunci sensitif.", "if contains text (TextBoxPesan.Text) piece ('minta password') then\n  set LabelWarning.Text to 'WASPADA PHISHING!'", "Siswa menghasilkan aplikasi pendeteksi pesan penipuan digital interaktif.", "Siap (Framework Proyek)"], [11, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-6", "Eksplorasi Data Pribadi", "Video Interaktif & Kuis", "Checkpoint 01 · Mulai di sini", "https://youtu.be/cWfbcaSg7Eo", "Eksplorasi Data Pribadi: Menelaah jenis data publik (nama display) vs data rahasia (NIK, password, OTP, data perbankan).", "Prinsip Keamanan:\nJangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun, termasuk pihak yang mengaku staf/admin.", "Siswa memiliki literasi digital yang kuat mengenai perlindungan identitas pribadi.", "Siap (Video Curated & Kuis)"], [12, "ms-mod-01", "Modul 1: Logika Instruksi, Flowchart & Input Aman", "ms-1-7", "Etika dan Tanggung Jawab Digital", "Video Interaktif & Kuis", "Checkpoint 02", "https://youtu.be/cWfbcaSg7Eo", "Etika dan Tanggung Jawab Digital: Menghormati hak cipta konten, tidak membuat aplikasi berbahaya (spam/malware), etika programmer.", "Tanggung Jawab Kreator Digital:\n1. Transparan penggunaan izin aplikasi\n2. Menjaga data pengguna\n3. Bermanfaat untuk masyarakat", "Siswa menginternalisasi norma etika pengembangan software yang bertanggung jawab.", "Siap (Video Curated & Kuis)"], [13, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-1", "PERCABANGAN GANDA", "Video Interaktif & Kuis", "Checkpoint 01 · Logika di Dunia Nyata", "https://youtu.be/tDkIcceTzII", "Percabangan Ganda di Dunia Nyata: Logika pengambilan keputusan dengan multi-syarat (kondisi A, kondisi B, atau kondisi default).", "Jika hujan -> Bawa payung\nJika mendung -> Siapkan jas hujan\nSelain itu -> Tidak perlu payung", "Siswa mampu memodelkan keputusan dunia nyata ke dalam struktur logika percabangan bersyarat.", "Siap (Video Curated & Kuis)"], [14, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-2", "APP INVENTOR", "Video Interaktif & Kuis", "Checkpoint 02 · Percabangan Blok", "https://youtu.be/tDkIcceTzII", "App Inventor: Percabangan Blok If-Else. Menggunakan mutator roda gigi biru untuk menambah 'else if' dan 'else'.", "Blok Control:\nif [syarat] then [...]\nelse if [syarat2] then [...]\nelse [...]", "Siswa menguasai penggunaan blok If-Else bertingkat di App Inventor.", "Siap (Video Curated & Kuis)"], [15, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-3", "LITERASI KEUANGAN", "Video Interaktif & Kuis", "Checkpoint 03 · Uang Digital", "https://youtu.be/tDkIcceTzII", "Literasi Keuangan: Uang Digital vs Fisik, cara kerja dompet digital (e-wallet), QRIS, dan pencatatan transaksi non-tunai.", "Kelebihan Uang Digital: Praktis, tercatat otomatis, nirsentuh.\nRisiko: Rentan impulsif & pencurian akun bila password lemah.", "Siswa memahami mekanisme transaksi finansial modern dan risikonya.", "Siap (Video Curated & Kuis)"], [16, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-4", "LITERASI KEUANGAN", "Video Interaktif & Kuis", "Checkpoint 04 · Needs vs Wants", "https://youtu.be/tDkIcceTzII", "Literasi Keuangan: Skala Prioritas Belanja — Kebutuhan Utama vs Keinginan Hiburan, aturan alokasi 50/30/20.", "Kebutuhan (Needs) didahulukan 50%\nKeinginan (Wants) dibatasi maksimal 30%\nTabungan & Investasi 20%", "Siswa mampu membuat keputusan finansial yang bijak dan mengelompokkan pos pengeluaran.", "Siap (Video Curated & Kuis)"], [17, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-5", "APP INVENTOR + FINANSIAL", "Video Interaktif & Kuis", "Checkpoint 05 · Aplikasi Kalkulator Keuangan", "https://youtu.be/tDkIcceTzII", "Aplikasi Kalkulator Keuangan: Mengintegrasikan komponen input nominal, blok perkalian/pembagian persentase, dan label alokasi.", "set LabelKebutuhan.Text to (TextBoxUang.Text * 0.5)\nset LabelTabungan.Text to (TextBoxUang.Text * 0.2)", "Siswa membangun kalkulator alokasi anggaran otomatis berbasis rumus finansial.", "Siap (Video Curated & Kuis)"], [18, "ms-mod-02", "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)", "ms-2-6", "FINAL PROJECT", "Proyek Mandiri Final Percabangan", "Checkpoint 06 · Mini Project", "https://youtu.be/tDkIcceTzII", "Membangun aplikasi simulator penasihat belanja: Memberi saran 'Boleh Beli' atau 'Tunda Dulu' berdasarkan saldo saat ini.", "if (Saldo - HargaBarang) < 50000 then\n  set LabelSaran.Text to 'Tunda! Saldo tabunganmu hampir habis.'\nelse\n  set LabelSaran.Text to 'Aman dibeli!'", "Siswa menghasilkan aplikasi asisten belanja cerdas dengan validasi multi-kondisi.", "Siap (Framework Proyek)"], [19, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-1", "Membuat dan Memanggil Procedures", "Video Interaktif & Kuis", "Checkpoint 01 · Mulai di sini", "https://youtu.be/P8Ea0v8Gy2o", "Membuat & Memanggil Procedures: Blok 'to procedure do' (tanpa kembalian) dan 'to procedure result' (mengembalikan nilai), parameter.", "to hitungDiskon (harga, persen) do\n  result: harga - (harga * persen / 100)\ncall hitungDiskon(100000, 10)", "Siswa memahami cara kerja prosedur/fungsi untuk membagi kode program menjadi modul-modul efisien.", "Siap (Video Curated & Kuis)"], [20, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-2", "Mini Project Kalkulator", "Proyek Mandiri Kalkulator", "Checkpoint 02 · Mini Project", "https://youtu.be/P8Ea0v8Gy2o", "Mini Project Kalkulator Modular: Menerapkan prosedur hitungTambah, hitungKurang, hitungKali, dan resetForm.", "Prosedur 'bersihkanLayar':\nset TextBox1.Text to ''\nset TextBox2.Text to ''\nset LabelHasil.Text to '0'", "Siswa membuat kalkulator modular tanpa duplikasi kode blok.", "Siap (Framework Proyek)"], [21, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-3", "Optimasi dan Modularisasi Kode", "Video Interaktif & Kuis", "Checkpoint 03", "https://youtu.be/P8Ea0v8Gy2o", "Optimasi dan Modularisasi Kode: Prinsip DRY (Don't Repeat Yourself), meningkatkan keterbacaan kode blok.", "Jangan copy-paste blok yang sama berulang kali; bungkus ke dalam satu Prosedur dan panggil namanya!", "Siswa mampu menyederhanakan kode blok yang rumit menjadi bersih dan mudah dipelihara.", "Siap (Video Curated & Kuis)"], [22, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-4", "Uji Coba dan Debugging", "Video Interaktif & Kuis", "Checkpoint 04", "https://youtu.be/P8Ea0v8Gy2o", "Uji Coba & Debugging: Menggunakan fitur 'Do It' di Blocks Editor untuk menginspeksi nilai variabel secara instan, melacak bug.", "Klik kanan blok kode > pilih 'Do It' untuk melihat nilai keluaran blok secara langsung di layar monitor.", "Siswa menguasai teknik debugging profesional di MIT App Inventor.", "Siap (Video Curated & Kuis)"], [23, "ms-mod-03", "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures", "ms-3-5", "Presentasi dan Refleksi", "Video Interaktif & Refleksi", "Checkpoint 05", "https://youtu.be/P8Ea0v8Gy2o", "Presentasi & Refleksi: Mengevaluasi arsitektur blok, kenyamanan antarmuka pengguna (UI/UX), dan dokumentasi kode.", "Kriteria Desain Aplikasi yang Baik:\n1. Tampilan bersih dan rapi\n2. Tombol mudah ditekan\n3. Tidak ada error/crash saat input salah", "Siswa mampu melakukan review kritis terhadap aplikasi ciptaannya.", "Siap (Video Curated & Kuis)"], [24, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-1", "Penyimpanan Data dengan TinyDB", "Video Interaktif & Kuis", "Checkpoint 03 · Logika Data", "https://youtu.be/cWfbcaSg7Eo", "Penyimpanan Data Lokal dengan TinyDB: Konsep database lokal, komponen non-visible TinyDB, pasangan Tag (kunci) & Value (nilai).", "call TinyDB1.StoreValue tag 'saldo' valueToStore 50000\ncall TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0", "Siswa memahami cara menyimpan data agar tidak terhapus ketika aplikasi ditutup atau HP di-restart.", "Siap (Video Curated & Kuis)"], [25, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-2", "Mengelola Data Aman di TinyDB", "Video Interaktif & Kuis", "Checkpoint 04 · Praktik Mengelola", "https://youtu.be/cWfbcaSg7Eo", "Mengelola Data Aman di TinyDB: Pencegahan error data hilang dengan memberikan nilai default (valueIfTagNotThere), update nilai.", "Tag unik: Gunakan tag deskriptif ('user_name', 'total_saldo', 'riwayat_catatan')", "Siswa mampu membaca dan memperbarui data persisten secara stabil.", "Siap (Video Curated & Kuis)"], [26, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-3", "Mini Project Tiny DB", "Proyek Mandiri TinyDB", "Checkpoint 05 · Hands-on", "https://youtu.be/cWfbcaSg7Eo", "Mini Project Celengan Persisten: Membuat aplikasi pencatat tabungan yang menyimpan saldo ke TinyDB setiap kali koin ditambahkan.", "when Screen1.Initialize do\n  set global Saldo to (call TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0)\n  set LabelSaldo.Text to get global Saldo", "Siswa menghasilkan aplikasi tabungan dengan penyimpanan data persisten lokal yang andal.", "Siap (Framework Proyek)"], [27, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-4", "Menganalisis Data Finansial", "Video Interaktif & Kuis", "Checkpoint 06 · Finansial", "https://youtu.be/UhutS4BVKhk", "Menganalisis Data Finansial: Mengolah data transaksi yang tersimpan di TinyDB untuk menghitung total pengeluaran mingguan.", "Menggunakan list blok di App Inventor untuk mengiterasi daftar belanjaan dan menghitung total.", "Siswa mampu melakukan kalkulasi analitik sederhana atas data tersimpan.", "Siap (Video Curated & Kuis)"], [28, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-5", "Mini Project C", "Proyek Mandiri Kas Mini", "Checkpoint 07 · Mini Project", "https://youtu.be/UhutS4BVKhk", "Mini Project Pengelolaan Kas Mini: Menggabungkan form transaksi, validasi input, prosedur hitung saldo, dan TinyDB.", "Aplikasi Kas:\n- Form Masuk/Keluar\n- Validasi saldo tidak minus\n- Auto-save ke TinyDB\n- Reset tombol", "Siswa membuat aplikasi buku kas keuangan mini lengkap berbasis mobile.", "Siap (Framework Proyek)"], [29, "ms-mod-04", "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB", "ms-4-6", "Keamanan dalam Bertransaksi Digital", "Video Interaktif & Kuis", "Checkpoint 08 · Keamanan", "https://youtu.be/UhutS4BVKhk", "Keamanan Transaksi Digital: Bahaya malware pembaca penyimpanan lokal, prinsip keamanan penyimpanan offline vs cloud.", "Penting: Jangan pernah menyimpan kata sandi polos (plain-text password) di dalam database lokal tanpa pengamanan.", "Siswa memahami risiko keamanan data pada penyimpanan mobile lokal.", "Siap (Video Curated & Kuis)"], [30, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-1", "Merancang Solusi Digital", "Video Interaktif & Panduan Desain", "Checkpoint 06", "https://youtu.be/P8Ea0v8Gy2o", "Merancang Solusi Digital: Tahap Design Thinking, menentukan persona pengguna, mendefinisikan fitur utama aplikasi solusi.", "Tahap Desain:\n1. Empathize: Temukan masalah keuangan sekitar\n2. Define: Pilih 1 masalah utama\n3. Ideate: Rancang fitur aplikasi", "Siswa mampu menyusun konsep arsitektur proyek akhir yang terarah dan solutif.", "Siap (Video Curated & Kuis)"], [31, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-2", "Merancang Solusi Digital", "Proyek Mandiri Wireframing", "Checkpoint 07", "https://youtu.be/P8Ea0v8Gy2o", "Penyusunan Mockup & Wireframe: Mengatur tata letak antarmuka di Designer View dengan Vertical & Horizontal Arrangement.", "Gunakan HorizontalArrangement untuk tombol berdampingan, VerticalArrangement untuk form input bertumpuk.", "Siswa menghasilkan tata letak antarmuka aplikasi akhir yang rapi dan responsif.", "Siap (Framework Proyek)"], [32, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-3", "Final Project", "Proyek Akhir Capstone", "Checkpoint 09 · Final Project", "https://youtu.be/UhutS4BVKhk", "Final Project Capstone: Implementasi menyeluruh mengintegrasikan validasi form, multi-screen, prosedur modular, dan TinyDB.", "Komponen Wajib Proyek Akhir:\n- Minimal 2 Layar / Screen\n- Form Input + Validasi\n- 2 Procedure\n- TinyDB Storage", "Siswa menyelesaikan satu aplikasi mobile edukasi finansial utuh yang siap pakai.", "Siap (Framework Proyek)"], [33, "ms-mod-05", "Modul 5: Proyek Akhir Solusi Digital & Refleksi", "ms-5-4", "Mempublikasikan Final Project ke Gallery", "Video Panduan & Publikasi Gallery", "Tahap Akhir · Publikasi Karya", "https://youtu.be/_aAQ8nFUAqc", "Mempublikasikan Final Project ke MIT App Inventor Gallery, membuat link portfolio publik, dan mengekspor file APK/AIA.", "1. Projects > Export selected project (.aia) to my computer\n2. Projects > Publish to Gallery\n3. Tulis deskripsi & screenshot", "Siswa berhasil mempublikasikan karyanya ke Gallery global dan mengumpulkan link portofolio.", "Siap (Panduan Publikasi)"]], "sma": [[1, "hs-mod-00", "Modul 0: Orientasi Pembelajaran Asinkronus", "hs-0-0", "Introduction to Async Learning", "Slide Interaktif & Video Orientasi", "Video 00 · Orientasi", "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-00.html", "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, & Slide Jembatan Google Colab: membuat notebook, sel kode, tombol run, dan output.", "Google Colab:\n- Shift + Enter: Jalankan cell & pindah ke cell berikutnya\n- Ctrl + Enter: Jalankan cell di tempat\n- print('Halo Dunia')", "Siswa memahami alur belajar dan mampu membuat serta menjalankan kode Python pertama di Google Colab.", "Siap (Wadah & Slide Live)"], [2, "hs-mod-01", "Modul 1: Fondasi Data — Input, Tipe Data & Validasi", "hs-1-1", "Input, Masalah Input User, dan Konsep Validasi", "Video Interaktif & Kuis", "Materi 01", "https://youtu.be/pKYN1E60xtU", "Input Pengguna, Masalah Tipe Data, dan Sanitasi: Fungsi input() selalu menghasilkan string, type casting int() dan float(), sanitasi teks .strip() dan .lower().", "nama = input('Nama: ').strip()\numur = int(input('Umur: '))\nsaldo = float(input('Saldo: '))", "Siswa memahami perbedaan tipe data teks dan angka serta cara mengonversi input pengguna dengan aman.", "Siap (Video Curated & Kuis)"], [3, "hs-mod-01", "Modul 1: Fondasi Data — Input, Tipe Data & Validasi", "hs-1-2", "Sanitasi & Validasi Input dalam Program Keuangan", "Video Interaktif & Kuis", "Materi 02", "https://youtu.be/pKYN1E60xtU", "Sanitasi & Validasi Input Keuangan: Memeriksa nilai tidak boleh negatif, mencegah input kosong, dan validasi jenis transaksi (debit/kredit).", "if nominal <= 0:\n    print('Nominal harus lebih dari 0!')\nelse:\n    saldo += nominal", "Siswa mampu menulis logika pemeriksaan awal untuk mencegah data input tidak valid masuk ke sistem.", "Siap (Video Curated & Kuis)"], [4, "hs-mod-01", "Modul 1: Fondasi Data — Input, Tipe Data & Validasi", "hs-1-3", "Safe Transaction Input", "Proyek Mandiri Python", "Mini Project", "https://youtu.be/pKYN1E60xtU", "Safe Transaction Input: Membangun terminal input pencatatan saldo yang memvalidasi tipe data dan batas nominal minimum.", "def catat_transaksi():\n    raw = input('Nominal: ').strip()\n    # validasi angka & simpan", "Siswa menghasilkan script Python input transaksi yang tahan terhadap kesalahan pengetikan pengguna.", "Siap (Framework Proyek)"], [5, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-1", "Bagaimana Program Bisa Memilih?", "Video Interaktif & Kuis", "Checkpoint 01 · Mulai di sini", "https://youtu.be/MLgrQoRo2oo", "Bagaimana Program Bisa Memilih? Logika boolean True dan False, operator perbandingan (==, !=, <, >, <=, >=).", "5 > 3  # True\n10 == 20 # False\n'apel' != 'jeruk' # True", "Siswa memahami ekspresi logika perbandingan sebagai penentu arah eksekusi program.", "Siap (Video Curated & Kuis)"], [6, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-2", "Menulis Conditional di Python", "Video Interaktif & Kuis", "Checkpoint 02 · Saatnya praktik", "https://youtu.be/-hYK440Vlr8", "Menulis Conditional di Python: Sintaks if dan else, aturan indentasi 4 spasi (PEP 8), blok eksekusi bersyarat.", "if saldo >= harga:\n    print('Transaksi disetujui')\nelse:\n    print('Saldo tidak mencukupi')", "Siswa mampu menulis pernyataan if-else dengan indentasi yang benar di Python.", "Siap (Video Curated & Kuis)"], [7, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-3", "Multi Branch Conditionals", "Video Interaktif & Kuis", "Checkpoint 03 · Logika Tambahan", "https://youtu.be/_jm2p3pstrM", "Multi Branch Conditionals: Menangani lebih dari dua alternatif menggunakan pernyataan 'elif', urutan evaluasi kondisi.", "if skor >= 85:\n    grade = 'A'\nelif skor >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'", "Siswa mampu merancang logika percabangan multi-kondisi yang efisien.", "Siap (Video Curated & Kuis)"], [8, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-4", "Nested Conditionals", "Video Interaktif & Kuis", "Checkpoint 04 · Bersarang", "https://youtu.be/_e3hs1nWuME", "Nested Conditionals: Percabangan bersarang (if di dalam if) untuk validasi bertingkat (misal: cek status akun lalu cek saldo).", "if akun_aktif:\n    if saldo >= nominal:\n        proses_tarik_tunai()\n    else:\n        print('Saldo kurang')\nelse:\n    print('Akun dibekukan')", "Siswa dapat menyusun validasi keamanan bertingkat menggunakan percabangan bersarang.", "Siap (Video Curated & Kuis)"], [9, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-5", "Logical Operator", "Video Interaktif & Kuis", "Checkpoint 05 · Logika Kombinasi", "https://youtu.be/_iRZY0-_skc", "Logical Operator: Menggabungkan kondisi logika majemuk menggunakan operator 'and', 'or', dan 'not'.", "if usia >= 17 and punya_ktp:\n    buka_rekening()\nif status == 'VIP' or belanja > 500000:\n    beri_diskon()", "Siswa mampu menyederhanakan kode bertingkat dengan menggabungkan syarat menggunakan operator logika.", "Siap (Video Curated & Kuis)"], [10, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-6", "Needs vs Wants & Risks", "Video Interaktif & Kuis", "Checkpoint 06 · Financial Literacy", "https://youtu.be/bMsKBaRsKmc", "Needs vs Wants & Risks: Menganalisis risiko finansial (bunga pinjaman, denda, overbudget) dan klasifikasi kebutuhan belanja.", "Dana Darurat = Minimal 3x pengeluaran bulanan\nPrioritas 1: Kebutuhan pokok & cicilan utang\nPrioritas 2: Tabungan\nPrioritas 3: Hiburan", "Siswa memiliki wawasan literasi finansial analitis mengenai mitigasi risiko pengeluaran.", "Siap (Video Curated & Kuis)"], [11, "hs-mod-02", "Modul 2: Logika Percabangan — Conditional Logic (If-Else)", "hs-2-7", "Smart Budget & Risk Planner", "Proyek Mandiri Python", "Mini Project", "https://youtu.be/bMsKBaRsKmc", "Smart Budget & Risk Planner: Program konsol Python yang mengevaluasi pos anggaran bulanan dan memberikan skor kesehatan keuangan.", "Kalkulasi rasio tabungan = (total_tabungan / total_pemasukan) * 100\nEvaluasi skor: Sehat (>= 20%), Waspada (10-19%), Bahaya (< 10%)", "Siswa menghasilkan aplikasi penilai kesehatan anggaran pribadi berbasis percabangan logika.", "Siap (Framework Proyek)"], [12, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-1", "Video Pembelajaran", "Video Interaktif & Kuis", "Checkpoint 01", "https://youtu.be/RnyYn2SzFVU", "Pengantar Algoritma & Loop: Konsep automasi tugas repetitif, sintaks perulangan 'for item in sequence', fungsi range(n).", "for i in range(5):\n    print(f'Iterasi ke-{i}')", "Siswa memahami cara kerja loop for untuk mengulang instruksi tanpa menulis kode berulang kali.", "Siap (Video Curated & Kuis)"], [13, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-2", "Optimasi Loop & Step Count", "Video Interaktif & Kuis", "Checkpoint 02", "https://youtu.be/RnyYn2SzFVU", "Optimasi Loop & Step Count: Mengatur parameter range(start, stop, step), variabel akumulator untuk menjumlahkan saldo berkala.", "total_saldo = 0\nfor nominal in daftar_setoran:\n    total_saldo += nominal", "Siswa mampu mengontrol jalannya iterasi loop dan menghitung akumulasi nilai secara bertahap.", "Siap (Video Curated & Kuis)"], [14, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-3", "Optimasi Program Python", "Video Interaktif & Kuis", "Tonton Video Ini", "https://youtu.be/RnyYn2SzFVU", "Optimasi Program Python: Perulangan 'while condition', kondisi terminasi, penggunaan keyword 'break' dan 'continue'.", "while True:\n    perintah = input('Perintah: ')\n    if perintah == 'exit':\n        break", "Siswa menguasai penggunaan perulangan while untuk program interaktif berbasis menu.", "Siap (Video Curated & Kuis)"], [15, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-4", "Mini Project Optimasi", "Proyek Mandiri Python", "Checkpoint 04 · Optimasi", "https://youtu.be/RnyYn2SzFVU", "Mini Project Optimasi Loop: Membuat kalkulator simulasi target tabungan (menghitung berapa bulan target tercapai).", "bulan = 0\nwhile saldo < target:\n    saldo += setoran_bulanan\n    bulan += 1", "Siswa membangun program simulasi target finansial dengan perulangan otomatis.", "Siap (Framework Proyek)"], [16, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-5", "Functions in Python", "Video Interaktif & Kuis", "Materi 03 · Function", "https://youtu.be/RnyYn2SzFVU", "Functions in Python: Mendefinisikan fungsi sendiri dengan keyword 'def', parameter dan argumen, keyword 'return' vs print().", "def hitung_pajak(penghasilan):\n    return penghasilan * 0.05\n\npajak_saya = hitung_pajak(10000000)", "Siswa memahami konsep fungsi modular yang dapat menerima input dan mengembalikan nilai hasil komputasi.", "Siap (Video Curated & Kuis)"], [17, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-6", "Modular Design in Python", "Video Interaktif & Kuis", "Materi 04", "https://youtu.be/hP6MSkerx9A", "Modular Design in Python: Memecah program menjadi fungsi-fungsi kecil yang independen (Single Responsibility Principle).", "def input_data(): ...\ndef validasi_data(): ...\ndef simpan_data(): ...\ndef tampilkan_laporan(): ...", "Siswa mampu merancang arsitektur kode yang bersih, mudah dibaca, dan mudah di-test.", "Siap (Video Curated & Kuis)"], [18, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-7", "Mini Project", "Proyek Mandiri Python", "Checkpoint 05", "https://youtu.be/hP6MSkerx9A", "Mini Project Modular: Membangun sistem kasir modular dengan fungsi terpisah untuk hitung_subtotal, hitung_diskon, dan cetak_struk.", "def hitung_diskon(total):\n    return total * 0.1 if total >= 100000 else 0", "Siswa menghasilkan script kasir modular dengan pembagian fungsi yang rapi.", "Siap (Framework Proyek)"], [19, "hs-mod-03", "Modul 3: Otomasi & Desain Modular — Loops & Functions", "hs-3-8", "Financial Literacy", "Video Interaktif & Kuis", "Menabung, Bunga Tunggal, Bunga Majemuk", "https://youtu.be/hP6MSkerx9A", "Financial Literacy: Bunga Tunggal vs Bunga Majemuk (Compound Interest), implementasi rumus eksponensial di Python.", "Bunga Tunggal: A = P * (1 + r * t)\nBunga Majemuk: A = P * ((1 + r) ** t)", "Siswa memahami dampak eksponensial bunga majemuk dalam investasi jangka panjang melalui simulasi Python.", "Siap (Video Curated & Kuis)"], [20, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-1", "Try-Except dan Debugging Program Python", "Video Interaktif & Kuis", "Materi 03", "https://youtu.be/pKYN1E60xtU", "Try-Except dan Debugging: Menangani runtime error dengan blok try-except, menangkap ValueError saat konversi angka.", "try:\n    nominal = float(input('Nominal: '))\nexcept ValueError:\n    print('Harap masukkan angka yang valid!')", "Siswa mampu mencegah program berhenti tiba-tiba (crash) akibat input tidak terduga dari pengguna.", "Siap (Video Curated & Kuis)"], [21, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-2", "Safe Input with Error Handling", "Proyek Mandiri Python", "Mini Project", "https://youtu.be/pKYN1E60xtU", "Safe Input with Error Handling: Membuat fungsi helper get_valid_float(prompt) yang meminta input berulang hingga valid.", "def get_valid_float(prompt):\n    while True:\n        try:\n            return float(input(prompt))\n        except ValueError:\n            print('Input salah, ulangi lagi.')", "Siswa menghasilkan fungsi pembaca angka yang 100% anti-crash.", "Siap (Framework Proyek)"], [22, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-3", "Langkah Debugging Code", "Video Interaktif & Kuis", "Materi 04", "https://youtu.be/pKYN1E60xtU", "Langkah Debugging Code: Membaca error traceback di Python, mengidentifikasi nomor baris error, teknik print debugging.", "Traceback (most recent call last):\n  File 'app.py', line 12, in <module>\n    saldo += uang\nTypeError: unsupported operand type(s) for +=: 'float' and 'str'", "Siswa memiliki kemampuan membaca pesan error Python dan menemukan sumber bug secara mandiri.", "Siap (Video Curated & Kuis)"], [23, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-4", "Debugging Program Belanja", "Proyek Mandiri Debugging", "Mini Project", "https://youtu.be/pKYN1E60xtU", "Debugging Program Belanja: Mengidentifikasi dan memperbaiki 5 bug tersembunyi (SyntaxError, TypeError, ZeroDivisionError).", "Misi: Periksa tipe data variabel, perbaiki indentasi, dan tambahkan try-except pada pembagian diskon.", "Siswa membuktikan keahlian problem-solving dengan mereparasi kode program yang rusak.", "Siap (Framework Proyek)"], [24, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-5", "Dictionary dan List Transaksi", "Video Interaktif & Kuis", "Materi 04", "https://youtu.be/pKYN1E60xtU", "Dictionary dan List Transaksi: Struktur data key-value pair, membuat record transaksi {'tanggal', 'kategori', 'nominal'}, list of dicts.", "transaksi = {'kategori': 'Makanan', 'nominal': 25000}\nriwayat = []\nriwayat.append(transaksi)", "Siswa menguasai penyimpanan dan manipulasi struktur data majemuk (list of dictionaries) di Python.", "Siap (Video Curated & Kuis)"], [25, "hs-mod-04", "Modul 4: Keamanan Kode — Error Handling & Dictionary", "hs-4-6", "Analisis Data Keuangan dengan Python", "Video Interaktif & Kuis", "Materi 05", "https://youtu.be/pKYN1E60xtU", "Analisis Data Keuangan: Menghitung total pengeluaran dengan sum(), mencari transaksi terbesar max() dan terkecil min().", "total = sum(t['nominal'] for t in riwayat)\npengeluaran_terbesar = max(t['nominal'] for t in riwayat)", "Siswa mampu mengekstrak insight analitik keuangan dari koleksi data transaksi.", "Siap (Video Curated & Kuis)"], [26, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-1", "Design Thinking & Kebutuhan Pengguna", "Video Interaktif & Perancangan", "BERTANYA SEBELUM BERAKSI", "https://youtu.be/S1j2gt3Up74", "Design Thinking & Kebutuhan Pengguna: Memetakan problem statement manajemen keuangan siswa SMA dan merumuskan solusi.", "User Persona: Pelajar SMA dengan uang saku terbatas yang sering kehabisan uang sebelum akhir bulan.", "Siswa mampu merumuskan spesifikasi kebutuhan fungsional aplikasi keuangan terintegrasi.", "Siap (Video Curated & Kuis)"], [27, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-2", "Flowchart & Use Case", "Video Interaktif & Desain Sistem", "MERANCANG PROGRAM", "https://youtu.be/S1j2gt3Up74", "Flowchart & Use Case: Diagram arsitektur menu utama aplikasi (Tambah Transaksi, Lihat Laporan, Analisis Anggaran, Keluar).", "Arsitektur Sistem:\n1. Main Menu Loop\n2. Modul Input (try-except)\n3. Modul Data (list of dicts)\n4. Modul Report", "Siswa mampu membuat diagram alur sistem yang komprehensif untuk proyek akhirnya.", "Siap (Video Curated & Kuis)"], [28, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-3", "Menganalisis Data Transaksi", "Video Interaktif & Analisis", "DATA CELENGAN", "https://youtu.be/S1j2gt3Up74", "Menganalisis Data Transaksi Celengan: Mengelompokkan transaksi berdasarkan kategori dan membandingkan realisasi vs anggaran.", "kategori_total = {}\nfor t in riwayat:\n    kat = t['kategori']\n    kategori_total[kat] = kategori_total.get(kat, 0) + t['nominal']", "Siswa mampu menerapkan algoritma pengelompokan (grouping & aggregation) data keuangan.", "Siap (Video Curated & Kuis)"], [29, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-4", "Logika & Rekomendasi Pintar", "Video Interaktif & Logika Pintar", "FINANCIAL DATA", "https://youtu.be/S1j2gt3Up74", "Logika Rekomendasi Pintar: Memberikan saran finansial otomatis ('Peringatan: Pos Hiburan Anda melebihi 30% anggaran').", "if kategori_total.get('Hiburan', 0) > budget_hiburan:\n    print('🚨 PERINGATAN: Pos Hiburan overbudget!')", "Siswa mengimplementasikan fitur kecerdasan berbasis aturan (rule-based intelligence) pada aplikasinya.", "Siap (Video Curated & Kuis)"], [30, "hs-mod-05", "Modul 5: Proyek Integrasi — Financial Literacy App", "hs-5-5", "Menyatukan Kode Program", "Capstone Project Akhir", "APP INTEGRATION", "https://youtu.be/S1j2gt3Up74", "Capstone Integration: Menggabungkan seluruh komponen menjadi aplikasi utuh Financial Literacy App di Google Colab.", "Kriteria Capstone:\n- Validasi Input Try-Except\n- Struktur Data Dictionary & List\n- Fungsi Modular\n- Laporan Ringkasan Finansial", "Siswa menghasilkan satu aplikasi konsol Python lengkap untuk manajemen literasi finansial pribadi.", "Siap (Framework Proyek)"]]};
  
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
    sheet.setRowHeight(1, 35);
    
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
      sheet.getRange(2, 12, cfg.rows.length, 1).setHorizontalAlignment('center');
      
      // Shading alternating rows
      for (let r = 2; r <= cfg.rows.length + 1; r++) {
        if (r % 2 === 1) {
          sheet.getRange(r, 1, 1, headers.length).setBackground('#F8F9FA');
        }
      }
      
      // Wrap text for descriptive columns
      sheet.getRange(2, 9, cfg.rows.length, 3).setWrap(true);
    }
    
    sheet.setFrozenRows(1);
    
    // Custom column widths
    sheet.setColumnWidth(1, 45);   // No
    sheet.setColumnWidth(2, 100);  // Modul ID
    sheet.setColumnWidth(3, 230);  // Nama Modul
    sheet.setColumnWidth(4, 80);   // Step ID
    sheet.setColumnWidth(5, 230);  // Judul Step
    sheet.setColumnWidth(6, 170);  // Tipe
    sheet.setColumnWidth(7, 120);  // Kicker
    sheet.setColumnWidth(8, 250);  // Link Media
    sheet.setColumnWidth(9, 320);  // Konsep
    sheet.setColumnWidth(10, 260); // Cheatsheet
    sheet.setColumnWidth(11, 280); // Capaian
    sheet.setColumnWidth(12, 160); // Status
  });
  
  return { success: true, message: "Tab materi-sd, materi-smp, materi-sma berhasil dibuat dan diisi lengkap!", totalSD: payload.sd.length, totalSMP: payload.smp.length, totalSMA: payload.sma.length };
}
