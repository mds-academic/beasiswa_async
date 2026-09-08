# Memory: Subproject 01 - LMS Platform

- **Framework**: Vue 3 / Vite modern web frontend.
- **Interaksi Kuis**:
  - Pop-up dapat ditutup oleh siswa (tidak rigid blocking di detik kemunculan).
  - Terdapat bar navigasi kuis (misal 3 bulatan indikator status kuis: Belum Dikerjakan, Sedang Dibuka, Selesai).
  - Validasi ketat hanya diletakkan saat siswa ingin menekan tombol "Video Selanjutnya / Materi Berikutnya".
- **Autentikasi**:
  - Input nama sekolah memicu pemilahan level sekolah (SD / SMP / SMA) yang langsung menentukan view kurikulum.

## Kebutuhan disetujui pengguna — 2026-09-08: materi campuran untuk pemula

- Materi lama SMA dimulai sekitar sesi 25, bukan pengantar nol. LMS baru harus melayani siswa yang belum mengenal Python, Google Colab, atau cara menjalankan kode.
- Gunakan video lama bila penjelasan tersedia. Kekurangan dijembatani bacaan HTML slides terpisah yang tampil di area materi utama; video baru dapat menggantikannya di masa depan. Tidak perlu menunggu produksi video baru.
- Video mempertahankan bookmark waktu. HTML slides memiliki bookmark halaman/bagian, navigasi baca, dan tampilan diperbesar/fullscreen. Kedua format tetap memiliki rangkuman di bawah area materi.
- Batas startSeconds/endSeconds, bookmark, dan waktu pause/quiz/resume/skip yang sudah dikurasi adalah data sumber yang harus dipreservasi. Re-sequencing memindahkan unit materi beserta metadata waktunya, bukan mereset setiap video ke awal atau memutar video penuh.
- Ketidaksesuaian timestamp dilaporkan untuk pemeriksaan; tidak “diperbaiki” otomatis atau ditebak. Bila batas tidak tersedia, tandai belum diketahui tanpa mengarang batas baru.
- Tahap sekarang: kebutuhan platform dicatat dalam PRD/knowledge/plan; prioritas eksekusi adalah review sequencing SMP–SMA rinci, bukan implementasi player atau produksi semua slides.
