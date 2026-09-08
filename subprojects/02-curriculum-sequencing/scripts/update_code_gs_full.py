import json

# 1. Load payload v2 (which now has 100% quizzes)
with open('projects/uob-async-lms/subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v2.json', 'r', encoding='utf-8') as f:
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
          "Skor: 100 | Jawaban: A | Benar ✓",
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
          97,
          "A (Sangat Baik)",
          "33 / 33 Selesai",
          "Lulus Bersertifikat 🎓",
          // 33 sample values
          ...Array(33).fill("Skor: 100 | Benar ✓")
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
          "30 / 30 Selesai",
          "Lulus Bersertifikat 🎓",
          // 30 sample values
          ...Array(30).fill("Skor: 100 | Benar ✓")
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
    sheet.setFrozenColumns(4); // Freeze up to Sekolah so student identity stays visible when scrolling right
  }});

  return {{
    success: true,
    message: "Tab ops-result-sd, ops-result-smp, dan ops-result-sma berhasil diinisialisasi dengan skala nilai 100 dan pelacakan jawaban per kuis!"
  }};
}}

// ==================== CURRICULUM SHEETS POPULATOR ====================
function populateCurriculumSheets() {{
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const headers = [
    \"No\",
    \"Modul ID\",
    \"Nama Modul\",
    \"Step ID\",
    \"Judul Step / Materi\",
    \"Tipe Pembelajaran\",
    \"Durasi / Kicker\",
    \"Link Media / Slide / Video\",
    \"Konsep & Topik yang Dipelajari\",
    \"Pop-up Quiz Interaktif (Waktu, Soal & Kunci)\",
    \"Mini Project / Hands-on Tugas Praktik\",
    \"Rangkuman / Cheatsheet Singkat\",
    \"Target Capaian & Hasil Belajar\",
    \"Status Kesiapan Materi\"
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
    sheet.setColumnWidth(4, 80);   // Step ID
    sheet.setColumnWidth(5, 220);  // Judul Step
    sheet.setColumnWidth(6, 170);  // Tipe
    sheet.setColumnWidth(7, 120);  // Kicker
    sheet.setColumnWidth(8, 240);  // Link Media
    sheet.setColumnWidth(9, 300);  // Konsep
    sheet.setColumnWidth(10, 340); // Pop-up Quiz
    sheet.setColumnWidth(11, 340); // Mini Project
    sheet.setColumnWidth(12, 260); // Cheatsheet
    sheet.setColumnWidth(13, 280); // Capaian
    sheet.setColumnWidth(14, 160); // Status
  }});
  
  return {{ success: true, message: \"Tab materi-sd, materi-smp, materi-sma berhasil diperbarui!\", totalSD: payload.sd.length, totalSMP: payload.smp.length, totalSMA: payload.sma.length }};
}}

function setupAllLMSSheets() {{
  const res1 = setupResultTrackingSheets();
  const res2 = populateCurriculumSheets();
  return {{
    success: true,
    resultTracking: res1,
    curriculumSheets: res2
  }};
}}
'''

# Read base Code.gs
code_gs_path = 'projects/uob-async-lms/subprojects/01-lms-platform/apps-script/Code.gs'
with open(code_gs_path, 'r', encoding='utf-8') as f:
    orig_code = f.read()

# Cut off previous dynamic populator functions
idx = orig_code.find('// ==================== CURRICULUM SHEETS POPULATOR ====================')
if idx != -1:
    orig_code = orig_code[:idx]

idx2 = orig_code.find('// ==================== RESULT TRACKING SHEETS INITIALIZER ====================')
if idx2 != -1:
    orig_code = orig_code[:idx2]

# Ensure action routing in doGet
if "action === 'setup_all_sheets'" not in orig_code:
    hook = "if (action === 'setup_curriculum_sheets') {"
    replacement = "if (action === 'setup_all_sheets') {\\n      return respond(setupAllLMSSheets());\\n    }\\n\\n    if (action === 'setup_result_sheets') {\\n      return respond(setupResultTrackingSheets());\\n    }\\n\\n    if (action === 'setup_curriculum_sheets') {"
    orig_code = orig_code.replace(hook, replacement)

full_updated_code = orig_code.strip() + '\n\n' + code_snippet.strip() + '\n'

with open(code_gs_path, 'w', encoding='utf-8') as f:
    f.write(full_updated_code)

print("Generated full updated Code.gs with setupResultTrackingSheets & populateCurriculumSheets!")
