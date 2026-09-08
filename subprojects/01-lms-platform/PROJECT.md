# Subproject 01: LMS Platform (UOB My Digital Space)

## Purpose

Mengembangkan antarmuka aplikasi web LMS asinkronus terpadu (single portal) yang melayani seluruh jenjang (SD, SMP, SMA) dan backend Google Apps Script baru.

## Deliverables

- Web App Single Portal (Vue 3 / Vite modern web frontend).
- Video Player Interaktif dengan UX baru:
  - Indikator jumlah kuis di video aktif (misal "Kuis 1 dari 3").
  - Switcher & navigasi antar kuis.
  - Fitur tutup/tunda pop-up kuis tanpa memblokir video secara permanen.
  - Kunci progres materi (tombol next video disabled jika belum semua kuis tuntas).
- Autentikasi Cerdas:
  - Pilihan sekolah murid -> Auto-detection jenjang (SD/SMP/SMA) -> Auto-load kurikulum jenjang terkait.
- Backend Google Apps Script (`Code.gs`) baru:
  - Endpoint auth sekolah/siswa.
  - Handler submit kuis & logging progres multi-jenjang ke Google Sheets.
