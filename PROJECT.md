# Project: UOB My Digital Space - Async LMS & Curriculum Revamp

## Purpose

Membangun ulang ekosistem platform pembelajaran asinkronus (LMS) dan merestrukturisasi urutan kurikulum koding untuk program CSR UOB My Digital Space (Kalananti). Proyek ini menyatukan portal multi-jenjang (SD, SMP, SMA) ke dalam satu aplikasi web yang terintegrasi, dengan UX interaktif video kuis yang lebih ramah siswa (less strict), serta perombakan alur pembelajaran coding agar runtut, bertahap, dan mudah dipahami oleh murid pemula mutlak (zero-experience).

## Desired Outcome

1. **Aplikasi LMS Asinkronus Terpadu (Subproject 1)**:
   - Satu tautan web app (single portal) untuk seluruh jenjang (SD, SMP, SMA).
   - Autentikasi/login berbasis pemilihan sekolah yang secara otomatis mendeteksi jenjang siswa dan menampilkan kurikulum yang relevan.
   - Mekanisme Pop-up Quiz video yang fleksibel: siswa dapat menutup/menunda pop-up, melihat indikator jumlah kuis di video aktif (misal 3 pop-up), dan berpindah antar-kuis.
   - Kunci progres materi (progress lock): tombol navigasi ke video berikutnya hanya terbuka jika semua pop-up kuis pada video aktif telah diselesaikan.
   - Backend Google Apps Script (`Code.gs`) baru dengan skema penyimpanan Google Spreadsheet yang terpisah dan terstruktur rapi untuk pelaporan nilai & progres.

2. **Kurikulum & Alur Materi Terstruktur (Subproject 2)**:
   - Evaluasi dan penyusunan ulang video pembelajaran coding untuk SMP, SMA, dan SD.
   - Alur pedagogis yang logis bagi siswa pemula (misal: Konsep Dasar → Variabel & Tipe Data → Kondisi/Percabangan → Perulangan/Looping → Mini Project).
   - Data kurikulum terstandarisasi (`courseData`) yang siap diinjeksikan langsung ke dalam platform LMS.

## Deliverables

- [PRD Komprehensif](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/PRD.md) mencakup arsitektur teknis, spesifikasi fungsional, dan skema data.
- **Subproject 1 (`subprojects/01-lms-platform/`)**:
  - Source code web app LMS (Vue 3 / Vite modern web stack).
  - Skrip backend Google Apps Script (`Code.gs`) baru untuk endpoint auth, logging progres kuis, dan sync Google Sheets.
- **Subproject 2 (`subprojects/02-curriculum-sequencing/`)**:
  - Peta kurikulum & urutan materi video SD, SMP, SMA yang telah dirapikan.
  - Berkas skema data modul/video (`courseData.json` / `courseData.js`) teruji.

## Scope

- Desain sistem interaksi baru pada video player (drawer/modal kuis non-intrusif, switcher kuis, progress gate validator).
- Autentikasi cerdas berbasis sekolah dengan auto-routing kurikulum.
- Restrukturisasi urutan video dan materi coding eksisting dari repositori UOB Async.
- Pemisahan tata kelola subproject (History, Memory, dan Agents rules terpisah per domain).

## Non-Goals

- Merekam ulang video produksi dari nol (proyek ini fokus pada re-sequencing, kurasi, pembuatan metadata kuis, dan injeksi ke LMS baru).
- Mengubah identitas visual brand (desain visual, palet warna, dan elemen grafis tetap mempertahankan tema khas UOB My Digital Space).

## Audience

- Siswa SD (Upper Primary), SMP (Middle School), dan SMA (High School) peserta program beasiswa CSR UOB My Digital Space.
- Tim Akademik Kalananti dan Operations/PIC UOB untuk monitoring progres dan hasil belajar siswa.

## Constraints and Preferences

- UX tidak boleh terlalu mengekang (tidak memaksa murid menonton video tanpa tahu ada kuis tersembunyi), tetapi tetap memastikan integritas pembelajaran (semua kuis harus dikerjakan sebelum lanjut).
- Single deployment URL untuk mempermudah distribusi ke ratusan siswa sekolah mitra.
- Arsitektur subproject modular: isolasi konteks antara platform web development dan curriculum curation.

## Definition of Done

- Web LMS dapat diakses melalui 1 URL tunggal, login berhasil mendeteksi jenjang sekolah murid, dan memuat materi yang sesuai.
- Video player menampilkan indikator kuis, modal kuis dapat dibuka/tutup secara fleksibel, dan tombol "Lanjut" terkunci hingga semua kuis tuntas.
- Data submit kuis dan progres tersimpan sempurna di Google Sheets via Apps Script baru.
- Peta materi SMP, SMA, dan SD tersusun secara runtut dan tervalidasi pada file konfigurasi data LMS.

## Origin Context

- Transkrip brief pengguna tanggal 8 September 2026.
- Sumber aset dan referensi kode sebelumnya di `/Users/yazidhilmi/Documents/cloud/Kalananti-cloud/Academic_Content/B2B/UOB/Async/`.
