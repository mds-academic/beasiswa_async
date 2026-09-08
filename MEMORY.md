# Memory: UOB My Digital Space - Async LMS & Curriculum Revamp

## Core Decisions & Preferences

- **Arsitektur Proyek**: Proyek induk `uob-async-lms` menaungi 2 subproject terpisah:
  1. `subprojects/01-lms-platform/` (Aplikasi web player LMS & backend Apps Script).
  2. `subprojects/02-curriculum-sequencing/` (Kurasi alur materi koding SD, SMP, SMA).
  Masing-masing subproject memiliki file `AGENTS.md`, `STATE.md`, dan `HISTORY.md` mandiri untuk memisahkan konteks pengembangan kode dan kurikulum.
- **Single Portal Entry**: Tidak ada lagi URL terpisah per grup/jenjang. Satu link web app melayani SD, SMP, dan SMA. Penentuan kurikulum dilakukan otomatis saat autentikasi berdasarkan sekolah asal siswa.
- **Interaksi Kuis yang Ramah Siswa (Less Strict)**:
  - Pop-up kuis di video tidak memblokir permanen saat muncul; siswa dapat menutup/menunda pop-up.
  - Terdapat indikator navigasi kuis di video (contoh: "Kuis 1 dari 3"), siswa dapat berpindah antar kuis secara manual.
  - Video Completion Lock: Navigasi tombol "Next Video" / modul selanjutnya wajib dikunci sampai seluruh pop-up kuis pada video aktif telah dikerjakan.
- **Pedagogi Koding Pemula**:
  - Kurikulum harus berurutan secara logis: Konsep/Lingkungan Dasar → Variabel → Percabangan (If-Else) → Perulangan (Loops) → Proyek Integratif.
  - Menghindari materi acak yang memicu kebingungan bagi anak yang belum pernah belajar pemrograman.
- **Backend & Integrasi**:
  - Google Apps Script baru (`Code.gs`) dan skema Google Sheets yang diperbarui untuk mencatat hasil siswa multi-jenjang secara akurat.
- **Sumber Kode Lama**:
  - Direktori acuan: `/Users/yazidhilmi/Documents/cloud/Kalananti-cloud/Academic_Content/B2B/UOB/Async/`.
