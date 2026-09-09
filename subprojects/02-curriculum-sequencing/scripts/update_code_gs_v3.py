import json

# 1. Load payload v3
payload_path = 'subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v3.json'
with open(payload_path, 'r', encoding='utf-8') as f:
    payload = json.load(f)

payload_json_str = json.dumps(payload, ensure_ascii=False)

# 2. Extract step IDs for each level
sd_step_ids = [r[3] for r in payload['sd']]
smp_step_ids = [r[3] for r in payload['smp']]
sma_step_ids = [r[3] for r in payload['sma']]

sd_step_headers_json = json.dumps([f"{sid} [Skor & Jawaban]" for sid in sd_step_ids], ensure_ascii=False)
smp_step_headers_json = json.dumps([f"{sid} [Skor & Jawaban]" for sid in smp_step_ids], ensure_ascii=False)
sma_step_headers_json = json.dumps([f"{sid} [Skor & Jawaban]" for sid in sma_step_ids], ensure_ascii=False)

print(f"SD Steps: {len(sd_step_ids)}, SMP Steps: {len(smp_step_ids)}, SMA Steps: {len(sma_step_ids)}")
print(f"Changelog Rows: {len(payload['changelog'])}")

# Master orchestrator placed at top
top_orchestrator = '''
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
'''

code_snippet = f'''
// ==================== RESULT TRACKING SHEETS INITIALIZER ====================
function setupResultTrackingSheets() {{
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
    {{
      sheetName: SHEET_RESULT_SD,
      title: "Rekapitulasi Nilai & Jawaban Siswa SD (Upper Primary)",
      stepHeaders: {sd_step_headers_json},
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
          "8 / 8 Selesai",
          "Lulus Bersertifikat 🎓",
          "Skor: 100 | Selesai ✓",
          "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓",
          "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓",
          "Skor: 100 | Jawaban: Benar ✓",
          "Skor: 100 | Proyek: Selesai ✓",
          "Skor: 100 | Capstone: Selesai ✓"
        ]
      ]
    }},
    {{
      sheetName: SHEET_RESULT_SMP,
      title: "Rekapitulasi Nilai & Jawaban Siswa SMP (Middle School)",
      stepHeaders: {smp_step_headers_json},
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
          ...Array(36).fill("Skor: 100 | Benar ✓")
        ]
      ]
    }},
    {{
      sheetName: SHEET_RESULT_SMA,
      title: "Rekapitulasi Nilai & Jawaban Siswa SMA (High School)",
      stepHeaders: {sma_step_headers_json},
      seedData: [
        [
          new Date().toISOString(),
          "yazid@test.com",
          "Ahmad Yazid",
          "SMAN 8 Jakarta",
          "XII MIPA 1",
          "100%",
          100,
          "A (Sangat Baik)",
          "36 / 36 Selesai",
          "Lulus Bersertifikat 🎓",
          // 36 step evaluations
          ...Array(36).fill("Skor: 100 | Benar ✓")
        ]
      ]
    }}
  ];

  configs.forEach(cfg => {{
    let sheet = ss.getSheetByName(cfg.sheetName);
    if (!sheet) {{
      sheet = ss.insertSheet(cfg.sheetName);
    }} else {{
      sheet.clear();
    }}

    const allHeaders = baseHeaders.concat(cfg.stepHeaders);

    // Row 1: Warning Banner
    sheet.getRange(1, 1).setValue(WARNING_BANNER);
    sheet.getRange(1, 1, 1, allHeaders.length).merge();
    sheet.getRange(1, 1).setBackground('#7f1d1d').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
    sheet.setRowHeight(1, 28);

    // Row 2: Headers
    const headerRange = sheet.getRange(2, 1, 1, allHeaders.length);
    headerRange.setValues([allHeaders]);
    headerRange.setBackground('#092764').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.setRowHeight(2, 38);

    // Set Column Widths for Metadata & Summary
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 190); // Email
    sheet.setColumnWidth(3, 170); // Nama
    sheet.setColumnWidth(4, 160); // Sekolah
    sheet.setColumnWidth(5, 110); // Rombel
    sheet.setColumnWidth(6, 100); // Progress %
    sheet.setColumnWidth(7, 120); // Total Skor (0-100)
    sheet.setColumnWidth(8, 140); // Grade / Predikat
    sheet.setColumnWidth(9, 140); // Kuis & Proyek Selesai
    sheet.setColumnWidth(10, 160); // Status Kelulusan

    // Set Column Widths for Step Columns
    for (let c = 11; c <= allHeaders.length; c++) {{
      sheet.setColumnWidth(c, 160);
    }}

    // Populate Seed Data if provided
    if (cfg.seedData && cfg.seedData.length > 0) {{
      const dataRange = sheet.getRange(3, 1, cfg.seedData.length, allHeaders.length);
      dataRange.setValues(cfg.seedData);
      dataRange.setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');
      
      // Center align columns 5 to 10
      sheet.getRange(3, 5, cfg.seedData.length, 6).setHorizontalAlignment('center');
    }}

    sheet.setFrozenRows(2);
    // sheet.setFrozenColumns(4);
  }});

  return {{
    success: true,
    message: "Tab ops-result-sd (8 steps), ops-result-smp (36 steps), dan ops-result-sma (36 steps) berhasil diinisialisasi!"
  }};
}}

// ==================== CURRICULUM SHEETS POPULATOR ====================
function populateCurriculumSheets() {{
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
  
  const payload = {payload_json_str};
  
  const configs = [
    {{ sheetName: 'materi-sd', title: 'Kurikulum SD (Upper Primary)', rows: payload.sd }},
    {{ sheetName: 'materi-smp', title: 'Kurikulum SMP (Middle School)', rows: payload.smp }},
    {{ sheetName: 'materi-sma', title: 'Kurikulum SMA (High School)', rows: payload.sma }}
  ];
  
  configs.forEach(cfg => {{
    let sheet = ss.getSheetByName(cfg.sheetName);
    if (!sheet) {{
      sheet = ss.insertSheet(cfg.sheetName);
    }} else {{
      sheet.clear();
    }}
    
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
    if (cfg.rows && cfg.rows.length > 0) {{
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
      for (let r = 2; r <= cfg.rows.length + 1; r++) {{
        if (r % 2 === 1) {{
          sheet.getRange(r, 1, 1, headers.length).setBackground('#F8F9FA');
        }}
      }}
      
      // Wrap text for descriptive columns (9, 10, 11, 12, 13)
      sheet.getRange(2, 9, cfg.rows.length, 5).setWrap(true);
    }}
    
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
  }});
  
  return {{ 
    success: true, 
    message: "Tab materi-sd (8), materi-smp (36), materi-sma (36) berhasil diperbarui!", 
    totalSD: payload.sd.length, 
    totalSMP: payload.smp.length, 
    totalSMA: payload.sma.length 
  }};
}}

// ==================== CHANGELOG & AUDIT LOG POPULATOR ====================
function populateChangelogSheet() {{
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetName = 'Changelog & Audit Log';
  
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {{
    sheet = ss.insertSheet(sheetName);
  }} else {{
    sheet.clear();
  }}

  const payload = {payload_json_str};
  const changelogRows = payload.changelog;

  const totalCols = 8;

  // Row 1: Title Banner
  const titleText = "LOG AUDIT PERBAIKAN & INTEGRITAS KURIKULUM — UOB MY DIGITAL SPACE ASYNCHRONOUS LEARNING";
  sheet.getRange(1, 1).setValue(titleText);
  sheet.getRange(1, 1, 1, totalCols).merge();
  sheet.getRange(1, 1).setBackground('#092764').setFontColor('#ffffff').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  // Row 2: Subtitle Banner (Status & Integrity)
  const subText = "Status Audit Final: VERIFIED & RESOLVED ✅ | 8/8 Gate Scaffolding Passed | Bebas Residu TinyDB Modul 0 | Normalisasi Timestamp & Kuis | Sinkronisasi Multi-Jenjang SHA256 100%";
  sheet.getRange(2, 1).setValue(subText);
  sheet.getRange(2, 1, 1, totalCols).merge();
  sheet.getRange(2, 1).setBackground('#0f172a').setFontColor('#38bdf8').setFontStyle('italic').setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 26);

  // Row 3: Table Headers
  const headers = [
    "No",
    "Kategori / Area",
    "Komponen / File Terdampak",
    "Deskripsi Temuan / Kebutuhan",
    "Tindakan Perbaikan & Solusi Teknis",
    "Status Sebelum Perbaikan",
    "Status Terkini (Resolusi)",
    "Verifikasi & Bukti Uji"
  ];
  const headerRange = sheet.getRange(3, 1, 1, totalCols);
  headerRange.setValues([headers]);
  headerRange.setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 34);

  // Data Rows
  if (changelogRows && changelogRows.length > 0) {{
    const dataRange = sheet.getRange(4, 1, changelogRows.length, totalCols);
    dataRange.setValues(changelogRows);
    dataRange.setVerticalAlignment('top').setFontFamily('Arial').setFontSize(10);

    // Styling per column
    sheet.getRange(4, 1, changelogRows.length, 1).setHorizontalAlignment('center'); // No
    sheet.getRange(4, 2, changelogRows.length, 1).setHorizontalAlignment('center').setFontWeight('bold'); // Kategori
    sheet.getRange(4, 6, changelogRows.length, 2).setHorizontalAlignment('center'); // Status columns

    // Wrap text for descriptive columns
    sheet.getRange(4, 3, changelogRows.length, 3).setWrap(true);
    sheet.getRange(4, 8, changelogRows.length, 1).setWrap(true);

    // Conditional row backgrounds and status badges
    for (let i = 0; i < changelogRows.length; i++) {{
      const r = 4 + i;
      sheet.setRowHeight(r, 65);
      if (i % 2 === 1) {{
        sheet.getRange(r, 1, 1, totalCols).setBackground('#f8fafc');
      }}

      // Badge Sebelum (Col 6)
      const cellSebelum = sheet.getRange(r, 6);
      cellSebelum.setBackground('#fee2e2').setFontColor('#991b1b').setFontWeight('bold');

      // Badge Terkini (Col 7)
      const cellTerkini = sheet.getRange(r, 7);
      cellTerkini.setBackground('#dcfce7').setFontColor('#166534').setFontWeight('bold');
    }}
  }}

  sheet.setFrozenRows(3);
  // sheet.setFrozenColumns(2);

  // Column Widths
  sheet.setColumnWidth(1, 45);   // No
  sheet.setColumnWidth(2, 170);  // Kategori / Area
  sheet.setColumnWidth(3, 210);  // Komponen / File
  sheet.setColumnWidth(4, 310);  // Deskripsi Temuan
  sheet.setColumnWidth(5, 340);  // Tindakan Perbaikan
  sheet.setColumnWidth(6, 180);  // Status Sebelum
  sheet.setColumnWidth(7, 210);  // Status Terkini
  sheet.setColumnWidth(8, 280);  // Verifikasi & Bukti Uji

  return {{
    success: true,
    message: "Tab Changelog & Audit Log berhasil dibuat dengan 10 catatan perbaikan resmi!",
    totalRecords: changelogRows.length
  }};
}}
'''

# Read base Code.gs
code_gs_path = 'subprojects/01-lms-platform/apps-script/Code.gs'
with open(code_gs_path, 'r', encoding='utf-8') as f:
    orig_code = f.read()

# Remove old top orchestrator if present
idx_top = orig_code.find('// ==================== MASTER ORCHESTRATOR (DEFAULT FUNCTION) ====================')
if idx_top != -1:
    idx_top_end = orig_code.find('// ==================== GET HANDLER', idx_top)
    if idx_top_end != -1:
        orig_code = orig_code[:idx_top] + orig_code[idx_top_end:]

# Cut off previous dynamic populator functions at bottom
idx = orig_code.find('// ==================== RESULT TRACKING SHEETS INITIALIZER ====================')
if idx != -1:
    orig_code = orig_code[:idx]

idx2 = orig_code.find('// ==================== CURRICULUM SHEETS POPULATOR ====================')
if idx2 != -1:
    orig_code = orig_code[:idx2]

idx3 = orig_code.find('// ==================== MASTER ORCHESTRATOR ====================')
if idx3 != -1:
    orig_code = orig_code[:idx3]

# Insert top_orchestrator right before doGet
get_handler_marker = '// ==================== GET HANDLER (AUTH & DATA FETCH) ===================='
if get_handler_marker in orig_code:
    parts = orig_code.split(get_handler_marker)
    orig_code = parts[0].strip() + '\n\n' + top_orchestrator.strip() + '\n\n' + get_handler_marker + parts[1]
else:
    orig_code = top_orchestrator.strip() + '\n\n' + orig_code

full_updated_code = orig_code.strip() + '\n\n' + code_snippet.strip() + '\n'

with open(code_gs_path, 'w', encoding='utf-8') as f:
    f.write(full_updated_code)

print(f"✅ Generated updated Code.gs with setupAllLMSSheets as the DEFAULT TOP FUNCTION!")
