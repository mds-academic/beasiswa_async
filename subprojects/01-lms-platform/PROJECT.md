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

## Kebutuhan disetujui pengguna — 2026-09-08: materi campuran untuk pemula

- Materi lama SMA dimulai sekitar sesi 25, bukan pengantar nol. LMS baru harus melayani siswa yang belum mengenal Python, Google Colab, atau cara menjalankan kode.
- Gunakan video lama bila penjelasan tersedia. Kekurangan dijembatani bacaan HTML slides terpisah yang tampil di area materi utama; video baru dapat menggantikannya di masa depan. Tidak perlu menunggu produksi video baru.
- Video mempertahankan bookmark waktu. HTML slides memiliki bookmark halaman/bagian, navigasi baca, dan tampilan diperbesar/fullscreen. Kedua format tetap memiliki rangkuman di bawah area materi.
- Batas startSeconds/endSeconds, bookmark, dan waktu pause/quiz/resume/skip yang sudah dikurasi adalah data sumber yang harus dipreservasi. Re-sequencing memindahkan unit materi beserta metadata waktunya, bukan mereset setiap video ke awal atau memutar video penuh.
- Ketidaksesuaian timestamp dilaporkan untuk pemeriksaan; tidak “diperbaiki” otomatis atau ditebak. Bila batas tidak tersedia, tandai belum diketahui tanpa mengarang batas baru.
- Tahap sekarang: kebutuhan platform dicatat dalam PRD/knowledge/plan; prioritas eksekusi adalah review sequencing SMP–SMA rinci, bukan implementasi player atau produksi semua slides.
