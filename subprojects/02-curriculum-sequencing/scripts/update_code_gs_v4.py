"""
Update Code.gs with Payload v4
Embeds 22-step SD curriculum, 36-step SMP, 36-step SMA, 22-step ops-result-sd, and 11 Changelog records.
"""
import json

# 1. Load payload v4
payload_path = 'subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v4.json'
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

# Build seed evaluations for SD (22 steps)
sd_evals = ['"Skor: 100 | Selesai ✓"' for _ in range(len(sd_step_ids))]
sd_evals_str = ',\n          '.join(sd_evals)

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
          "22 / 22 Selesai",
          "Lulus Bersertifikat 🎓",
          {sd_evals_str}
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
    }},
    {{
      sheetName: SHEET_RESULT_SMA,
      title: "Rekapitulasi Nilai & Jawaban Siswa SMA (High School)",
      stepHeaders: {sma_step_headers_json},
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
    }}
  ];

  configs.forEach(cfg => {{
    let sheet = ss.getSheetByName(cfg.sheetName);
    if (!sheet) {{
      sheet = ss.insertSheet(cfg.sheetName);
    }} else {{
      sheet.clear();
    }}

    const fullHeaders = baseHeaders.concat(cfg.stepHeaders);
    const headerRange = sheet.getRange(1, 1, 1, fullHeaders.length);
    headerRange.setValues([fullHeaders]);
    headerRange.setBackground('#092764');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 40);

    if (cfg.seedData && cfg.seedData.length > 0) {{
      const dataRange = sheet.getRange(2, 1, cfg.seedData.length, cfg.seedData[0].length);
      dataRange.setValues(cfg.seedData);
      dataRange.setVerticalAlignment('middle');
      dataRange.setFontFamily('Arial');
      dataRange.setFontSize(10);
      sheet.getRange(2, 1, cfg.seedData.length, 1).setHorizontalAlignment('center');
      sheet.getRange(2, 6, cfg.seedData.length, 5).setHorizontalAlignment('center');
    }}

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

    for (let c = 11; c <= fullHeaders.length; c++) {{
      sheet.setColumnWidth(c, 240);
    }}
  }});

  return {{
    success: true,
    message: "Tab ops-result-sd (22 steps), ops-result-smp (36 steps), dan ops-result-sma (36 steps) berhasil diinisialisasi!"
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
    message: "Tab materi-sd (22), materi-smp (36), materi-sma (36) berhasil diperbarui!", 
    totalSD: payload.sd.length, 
    totalSMP: payload.smp.length, 
    totalSMA: payload.sma.length 
  }};
}}

// ==================== CHANGELOG & AUDIT LOG POPULATOR ====================
function populateChangelogSheet() {{
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetName = "Changelog & Audit Log";
  
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {{
    sheet = ss.insertSheet(sheetName);
  }} else {{
    sheet.clear();
  }}
  
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
  
  const changelogRows = {json.dumps(payload['changelog'], ensure_ascii=False)};
  
  const dataRange = sheet.getRange(2, 1, changelogRows.length, headers.length);
  dataRange.setValues(changelogRows);
  dataRange.setVerticalAlignment('top');
  dataRange.setFontFamily('Arial');
  dataRange.setFontSize(10);
  
  sheet.getRange(2, 1, changelogRows.length, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 6, changelogRows.length, 2).setHorizontalAlignment('center');
  
  for (let r = 2; r <= changelogRows.length + 1; r++) {{
    if (r % 2 === 1) {{
      sheet.getRange(r, 1, 1, headers.length).setBackground('#F8F9FA');
    }}
  }}
  
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

  return {{
    success: true,
    message: "Tab Changelog & Audit Log berhasil dibuat dengan 11 catatan perbaikan resmi!",
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

print(f"✅ Generated updated Code.gs v4 with 22-step SD curriculum!")
