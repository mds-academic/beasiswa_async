# State: UOB My Digital Space - Async LMS & Curriculum Revamp

## Current Status

- **Status**: LMS platform and Apps Script backend updated and deployed; endpoint smoke test passed.
- **Active Focus**: Review PRD, finalisasi struktur repositori, dan verifikasi alur kurikulum & arsitektur web app.
- **Last Updated**: 2026-09-09

## Completed

- Inisialisasi struktur proyek induk `projects/uob-async-lms/` beserta subproject `subprojects/01-lms-platform/` dan `subprojects/02-curriculum-sequencing/`.
- Penyusunan draft PRD komprehensif ([PRD.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/PRD.md)) termasuk penanganan 6 akar masalah bug lama dan spesifikasi mobile modal.
- Penyusunan Rencana Implementasi Scaffolding Kurikulum ([02-implementation-plan-curriculum-scaffolding-smp-sma-sd.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/planning/02-implementation-plan-curriculum-scaffolding-smp-sma-sd.md)).
- Konfigurasi remote Git origin ke `git@github.com:mds-academic/beasiswa_async.git`.
- **Eksekusi Subproject 02 (Curriculum Sequencing) Selesai**:
  - Audit & analisis kesenjangan materi lama ([curriculum-audit-and-scaffolding-gap-analysis.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/mapping/curriculum-audit-and-scaffolding-gap-analysis.md)).
  - Generate dataset kurikulum SMA (`courseData-highschool.json`), SMP (`courseData-middleschool.json`), dan SD template (`courseData-upperprimary.json`).
  - Injeksi dataset ke `subprojects/01-lms-platform/src/data/`.
- **Eksekusi Subproject 01 (LMS Platform) Selesai**:
  - Antarmuka baru dibuat dari nol (*completely new*) di `subprojects/01-lms-platform/src/` (`index.html`, `styles.css`, `app.js`).
  - Fitur interaktif terimplementasi: Gentle Advisory Modal (< 768px), Less-Strict Quiz Pop-up & Switcher Strip, Progress Lock Gate (kunci materi selanjutnya), Single-Portal Login Multi-Jenjang, dan Hybrid Media Container (YouTube & HTML Slides).
  - Autentikasi Clasp diverifikasi aktif di bawah akun resmi **`rgcuob@gmail.com` (Gita Pengbenar)**.
  - Pembuatan Google Spreadsheet baru terpusat: `1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k` ([UOB My Digital Space Master Database](https://docs.google.com/spreadsheets/d/1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k/edit)).
  - Container-bound Apps Script project terpasang dan terdeploy via Clasp: `AKfycbxeN6qSeNLl3G08JkKsJ1HTGLzk7smy4idTfpJgA4LxvgI_WR9G0JKeg9qohVDV4yyd`.
  - Sinkronisasi progres dua arah (Local Storage & Server-First Sync via Apps Script) terpasang di `src/app.js`.
- **Redesain Skeuomorphism, Mini Project Challenge, Score Report & Sertifikat Digital Selesai**:
  - Poin 3: Mobile Advisory Modal persuasif dan ramah untuk layar smartphone (< 768px) dengan panduan rekomendasi perangkat laptop/komputer.
  - Poin 4: Redesain visual Skeuomorphism taktil (tombol 3D bergradien cembung, specular highlights, bayangan hardware realistis) dan modern typography (**Plus Jakarta Sans** untuk headings, **Inter** untuk body, **Fira Code** untuk terminal IDE).
  - Poin 5: Mini project dikonversi menjadi **Tantangan Praktik Mandiri Non-Gating** (bebas dilewati kapan saja tanpa memblokir materi berikutnya) dengan input formulir fleksibel (SMA: editor Python + link Colab/GitHub + file `.py`; SMP: link MIT App Inventor + file `.aia`/`.apk`; SD: link Scratch + file `.sb3`).
  - Poin 6: Score Report komprehensif (kuis selesai, akurasi, challenge terkumpul, status kelulusan) dan Sertifikat Kelulusan Digital Resmi (UOB My Digital Space x Ruangguru/Kalananti) dengan nomor seri unik, stempel timbul emas 3D, dan fitur Cetak / Simpan PDF (`@media print`).
  - Poin 7: Logika Server-First SSOT Sync diperbaiki — jika baris siswa di-reset atau dihapus admin di Google Sheets, browser otomatis mereset bersih `localStorage` dan mengembalikan siswa ke Materi 01.
  - Verifikasi otomatis Playwright test suite 4-Gate (Mobile Advisory, Desktop Login, Certificate Modal, Challenge Panel) lolos 100%.
  - Sinkronisasi identik ke `docs/` dan push berhasil ke GitHub remote `main`.

- **Revisi LMS Terkini Berdasarkan Feedback Pengguna (2026-09-09)**:
  - **Pembersihan Topbar Desktop**: Dihapus tombol *"Panduan Perangkat"* dan *"Sertifikat & Skor"* dari topbar desktop. Panduan perangkat hanya otomatis aktif di mobile view.
  - **Tab Akhir Sidebar Terkunci (`🎓 Sertifikat & Rekap Nilai`)**: Sertifikat kelulusan dipindahkan menjadi tab terakhir di sidebar berstatus terkunci (`🔒`), hanya terbuka bila seluruh materi selesai.
  - **Dokumen Cetak 2 Halaman A4 Presisi**:
    - Halaman 1: Certificate of Completion resmi berlatar navy/emas.
    - Halaman 2: Transkrip Hasil Evaluasi Belajar (rincian modul, pop-up kuis, skor, dan matriks 4 kompetensi).
    - Tanda tangan resmi entitas: **`UOB My Digital Space`** (*Academic Team & Organizing Committee*), tanpa nama personal.
  - **Bento Box Pop-up Quiz Tracker**: Menggantikan cheat sheet sempit di bawah video dengan Bento Card `📝 Evaluasi Pop-up Kuis` (daftar scrollable 1 baris bersih per kuis dengan badge status dan tombol aksi).
  - **Perbaikan Tampilan Slide Pembelajaran & Layar Penuh**:
    - Ganti istilah Sandbox menjadi "Slide Pembelajaran".
    - Container lega (`min-height: 640px; height: 75vh;`) tanpa ter-crop ke tengah di desktop (`.site-shell` diperlebar ke `min(1560px, calc(100% - 32px))`).
    - Tombol layar penuh (`requestFullscreen()`) bekerja optimal untuk container slide iframe.
  - **Validasi Login Ketat & Strict Sidebar Gating**:
    - Input email dan tombol masuk terkunci default sampai sekolah dipilih di combobox.
    - Siswa reguler tidak dapat melompati materi yang berstatus terkunci (`🔒`).
  - **Verifikasi Otomatis**: Seluruh 7 pengujian Playwright end-to-end (`scratch/test_revision_features.py`) lolos 100%.
  - **Sinkronisasi Kode**: `src/` disinkronkan identik ke `docs/`.

## Blockers & Open Questions

Tidak ada blocker teknis aktif. Seluruh kurikulum dan spreadsheet sinkron 100%.

## Concrete Next Steps

1. Pengujian live pada GitHub Pages: `https://mds-academic.github.io/beasiswa_async/`.
2. Pengujian input karya challenge mandiri oleh siswa pada berbagai jenjang (SD, SMP, SMA).

