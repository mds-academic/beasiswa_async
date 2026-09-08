# Implementation Plan 01: UOB Async LMS & Curriculum Revamp

Pembangunan platform LMS Asinkronus terpadu (single portal) untuk program UOB My Digital Space multi-jenjang (SD, SMP, SMA), pembaruan sistem interaksi kuis video yang lebih fleksibel (less-strict), dan kurasi alur kurikulum koding terstruktur untuk pemula.

## User Review Required

> [!IMPORTANT]
> **Pemisahan 2 Subproject**:
> - `subprojects/01-lms-platform/`: Kode web app player LMS (Vue 3 / Vite) dan backend Google Apps Script.
> - `subprojects/02-curriculum-sequencing/`: Kurasi, penataan ulang alur materi (SMP, SMA, SD), dan metadata kuis siap injeksi.
> Masing-masing memiliki file catatan riwayat (`HISTORY.md`) dan instruksi agen (`AGENTS.md`) mandiri.

> [!IMPORTANT]
> **Mekanisme Baru Pop-up Quiz**:
> Pop-up kuis di video kini dapat ditutup/ditunda oleh siswa, dilengkapi indikator navigasi kuis (misal *"Kuis 1 dari 3"*), namun tombol *"Next Video"* tetap terkunci hingga seluruh kuis pada video aktif dikerjakan.

## Proposed Implementation Phases

### Fase 1: Setup Proyek & Repositori Git
- Inisialisasi struktur repositori lokal di `projects/uob-async-lms/`.
- Setup `.gitignore` dan commit awal untuk menjaga riwayat versi proyek.
- Pendaftaran proyek pada `projects/INDEX.md`.

### Fase 2: Subproject 02 - Curriculum Sequencing & Audit Materi
- Audit komprehensif aset video dan materi eksisting di:
  - `Academic_Content/B2B/UOB/Async/Highschool/`
  - `Academic_Content/B2B/UOB/Async/Middleschool/`
  - `Academic_Content/B2B/UOB/Async/UpperPrimary/`
- Merancang peta pembelajaran bertahap ramah pemula (Variabel → Logika Kondisi → Perulangan → Mini Project).
- Menyusun berkas data standar `courseData.json` yang berisi metadata modul, video, timestamp pop-up, kuis, dan rubrik evaluasi.

### Fase 3: Subproject 01 - LMS Platform Scaffolding & Web App
- Setup scaffold frontend menggunakan Vue 3 + Vite dengan gaya desain khas UOB My Digital Space.
- Implementasi sistem Smart Auth:
  - Dropdown/search sekolah mitra.
  - Auto-routing jenjang (SD / SMP / SMA) untuk memuat data kurikulum yang tepat dari `courseData.json`.
- Implementasi Video Player Interaktif:
  - Quiz counter pill bar & quiz modal yang bisa dibuka/tutup secara fleksibel.
  - Tombol rewatch 30 detik.
  - Progress gate validator (Next video terkunci sebelum semua kuis selesai).
- Local state persistence (`localStorage`) agar progres siswa tidak hilang saat reload.

### Fase 4: Integrasi Backend Google Apps Script & Reporting Sheets
- Penyusunan skrip `Code.gs` baru untuk menangani login dan multi-jenjang submission logging.
- Pengujian endpoint integrasi Google Sheets.

### Fase 5: Uji Coba, QC, & Push Remote GitHub
- Verifikasi alur menyeluruh: Login SD/SMP/SMA → Pemutaran Video → Interaksi Kuis → Kunci Progres → Submit Sheets.
- Commit git final dan push ke repositori GitHub personal `madyazdhil`.

## Verification Plan

### Automated / Syntax Tests
- Validasi struktur skema `courseData.json`.
- Build verifikasi frontend Vue (`npm run build`).

### Manual Verification
- Uji alur login memilih sekolah jenjang SD, SMP, dan SMA.
- Uji interaksi pop-up kuis: membuka kuis, menutup kuis, melompati kuis, dan memastikan tombol lanjut terkunci jika kuis belum beres.
- Verifikasi pencatatan log pada Google Spreadsheet.
