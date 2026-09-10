# Implementation Plan: Panduan Lengkap Pengguna LMS UOB My Digital Space (Deck PDF & HTML)

Dokumen ini menjabarkan rencana pembuatan berkas panduan pengguna (User Onboarding & Navigation Guide Deck) dalam format **HTML Presentation Slides** yang dikonversi menjadi **PDF Landscape A4 berkualitas tinggi**, lengkap dengan tangkapan layar asli (*real screenshots*) langkah demi langkah untuk memudahkan pengguna baru atau evaluator dalam mencoba platform LMS Asynchronous UOB My Digital Space.

---

## 1. Tujuan & Ruang Lingkup

Menghasilkan panduan visual komprehensif yang memandu pengguna langkah demi langkah dari awal membuka portal, memilih sekolah, memasukkan identitas/email siswa, membaca slide pengantar, menonton video kurasi, mengerjakan pop-up kuis, mengumpulkan tantangan praktik mandiri, hingga membuka tab kelulusan dan mengunduh sertifikat resmi 2 halaman.

### Deliverable Utama:
1. **Asset Tangkapan Layar Langkah demi Langkah (`docs/guide/assets/`)**:
   - Screenshot resolusi tinggi yang ditangkap langsung via Playwright Chromium dari instance LMS aktif (`http://localhost:8080/`):
     - `step_01_portal_login.png`: Tampilan awal portal & pencarian sekolah mitra.
     - `step_02_school_dropdown.png`: Pilihan dropdown sekolah & auto-detect jenjang.
     - `step_03_student_email_select.png`: Pemilihan email siswa & validasi data.
     - `step_04_dashboard_overview.png`: Tampilan dashboard siswa, topbar, dan progress bar misi.
     - `step_05_sidebar_navigation.png`: Sidebar modul belajar, status ikon (centang, play, gembok terkunci).
     - `step_06_reading_slide.png`: Antarmuka slide pembelajaran interaktif, navigasi slide, tombol perbesar.
     - `step_07_video_player.png`: Video player YouTube terkurasi, batas waktu materi, tombol rewatch 30s, dan bookmarks.
     - `step_08_interactive_quiz.png`: Notifikasi pop-up kuis less-strict, opsi jawaban, dan Bento Box tracker kuis.
     - `step_09_quiz_feedback.png`: Umpan balik nilai kuis instan & terbukanya kunci materi selanjutnya.
     - `step_10_challenge_panel.png`: Panel form Tantangan Praktik Mandiri (Python/Scratch/App Inventor).
     - `step_11_certificate_unlocked.png`: Tab sidebar sertifikat terbuka setelah 100% tuntas.
     - `step_12_cert_page1.png`: Pratinjau Sertifikat Kelulusan resmi (Halaman 1 Landscape A4).
     - `step_13_cert_page2.png`: Pratinjau Transkrip Hasil Evaluasi Belajar (Halaman 2 Portrait A4).
     - `step_14_mobile_advisory.png`: Dialog saran perangkat laptop/komputer untuk kenyamanan koding.
2. **Interactive HTML Slide Deck (`docs/guide/index.html`)**:
   - Presentasi slide 16:9 modern bertema luar angkasa khas UOB My Digital Space (navy blue, golden accents, Plus Jakarta Sans, Inter, skeuomorphic badges, step callouts).
   - Fitur interaktif di browser: Navigasi slide (Next/Prev, Keyboard Arrow, Jump select, Fullscreen presentation mode, Auto-fit scale).
   - Aturan `@media print` presisi untuk konversi cetak ke PDF ukuran A4 Landscape tanpa margin terpotong.
3. **Berkas PDF Siap Pakai (`docs/guide/panduan-pengguna-lms-uob.pdf`)**:
   - Dihasilkan langsung dari HTML menggunakan headless Chromium Playwright dengan styling grafis latar belakang aktif (`print_background=True`).
   - Disalin juga ke folder `Downloads` pengguna agar dapat langsung dibuka dan dibagikan.

---

## 2. Struktur 15 Slide Panduan Pengguna (Widescreen 16:9 Overhaul)

Menjawab tuntas masukan pengguna mengenai ukuran gambar yang kekecilan di layout ganda, glitch visual Chromium print (`-webkit-background-clip`), dan konten terpotong pada batas halaman A4:

- **Slide 1: Cover & Pengantar Resmi**:
  - Dual Logo resmi Ruangguru dan UOB Indonesia, floating space planets, dan starfield background.
  - Judul solid tanpa efek text-clip glitch: *Panduan Lengkap Pengguna & Navigasi Belajar Mandiri — UOB My Digital Space*.
  - Jenjang Badges resmi: `SD · Scratch Logic`, `SMP · App Inventor`, `SMA · Python Coding`.
  - 4 Pilar belajar: Akses Mandiri, Materi Terkurasi, Kuis Interaktif, dan Sertifikat Kelulusan 2 Halaman.
- **Slide 2: Persiapan Perangkat & Rekomendasi Penggunaan**:
  - Rekomendasi perangkat: Laptop/PC (layar ≥ 1024px) dengan Google Chrome/Edge.
  - Tangkapan layar asli **Mobile Gentle Advisory Modal** (`step_14_mobile_advisory.png`) yang ramah bagi siswa saat mengakses via smartphone.
- **Slide 3: Langkah 1 — Membuka Portal & Mencari Nama Sekolah**:
  - URL portal LMS (`http://localhost:8080/` atau URL domain publik).
  - Panduan interaktif fitur combobox pencarian nama sekolah (misal: "andalus").
  - Auto-detection jenjang otomatis (SD / SMP / SMA).
  - Tangkapan layar tajam berbingkai besar: `step_01_portal_login.png` & `step_02_school_dropdown.png`.
- **Slide 4: Langkah 2 — Memilih Email Siswa & Masuk ke Kelas**:
  - Pemilihan email/nama siswa terdaftar, konfirmasi identitas kelas.
  - Tombol 3D skeuomorphic *"Masuk ke Kelas"*.
  - Tangkapan layar: `step_03_student_email_select.png`.
- **Slide 5: Matriks Kurikulum Abridged Per Jenjang (SD, SMP, SMA)**:
  - Tabel perbandingan komprehensif 3 jenjang format lega widescreen:
    - **SD (Scratch)**: 4 Modul · 18 Step (1 Slide Pengantar · 17 Video Tutorial · 18 Kuis Interaktif · 3 Proyek Hands-on di Scratch Editor).
    - **SMP (App Inventor)**: 6 Modul · 36 Step (4 Slide Bacaan · 24 Video Tutorial · 46 Kuis · 8 Mini Project yang Bisa Dikumpul).
    - **SMA (Python)**: 6 Modul · 36 Step (6 Slide Bacaan · 23 Video Tutorial · 59 Kuis · 7 Mini Project yang Bisa Dikumpul).
- **Slide 6: Detail Modul & Mini Project yang Dapat Dikumpulkan**:
  - 3 Kolom Bento lega tanpa cutoff vertikal:
    - **SD**: Modul 0 Kenalan Scratch, Modul 1 About Me (7 video), Modul 2 Racing Car (6 video), Modul 3 Increase Your Earnings (4 video).
    - **SMP**: 8 Mini Project (Form Aman, Cek Pesan Aman, Final Project If-Else, Kalkulator Prosedur, Tiny DB, Mini Project C, Solusi Digital, Final Project App).
    - **SMA**: 7 Mini Project (Smart Budget & Risk Planner, Mini Project Optimasi, Mini Project Fungsi, Safe Transaction Input, Safe Input Error Handling, Debugging Program Belanja, Financial Literacy Capstone).
- **Slide 7: Langkah 3A — Mengenal Beranda Belajar (Dashboard Overview)**:
  - Dipisah menjadi slide tersendiri agar screenshot berukuran besar dan terbaca jelas (`max-height: 640px; width: 100%`).
  - Menjelaskan Topbar profil siswa, badge sekolah, nama lengkap, dan progress bar misi real-time.
  - Tangkapan layar: `step_04_dashboard_overview.png`.
- **Slide 8: Langkah 3B — Navigasi Sidebar Misi & Arti 3 Status**:
  - Dipisah menjadi slide tersendiri untuk menampilkan struktur modul dan arti 3 indikator visual dengan jelas:
    - Centang Hijau (`✓`): Materi telah selesai dipelajari.
    - Play Biru (`▶`): Materi aktif yang sedang dibuka.
    - Gembok Abu-abu (`🔒`): Materi terkunci sebelum materi sebelumnya tuntas.
  - Tangkapan layar: `step_05_sidebar_navigation.png`.
- **Slide 9: Langkah 4 — Membaca & Mempelajari Slide Interaktif**:
  - Mempelajari slide fondasi konsep mandiri, navigasi, code preview, dan kotak rangkuman.
  - Tangkapan layar: `step_06_reading_slide.png`.
- **Slide 10: Langkah 5 — Menonton Video Modul Terkurasi**:
  - Pemutar video YouTube terintegrasi, seek bar, tombol *"Tonton Ulang 30 Detik"*, dan bookmark topik.
  - Tangkapan layar: `step_07_video_player.png`.
- **Slide 11: Langkah 6 — Menjawab Kuis Pop-up Interaktif**:
  - Penjelasan kuis ramah *Less-Strict*, kartu opsi 3D (A, B, C, D), dan Bento Box tracker status soal.
  - Tangkapan layar: `step_08_interactive_quiz.png`.
- **Slide 12: Langkah 7 — Umpan Balik Kuis & Buka Materi Selanjutnya**:
  - Umpan balik instan jawaban benar & tombol *"Materi Selanjutnya"* membuka gembok materi berikutnya.
  - Tangkapan layar: `step_09_quiz_feedback.png`.
- **Slide 13: Langkah 8 — Mengerjakan Tantangan Praktik (Mini Project Panel)**:
  - Panel form Mini Project non-gating: input formulir fleksibel (editor kode Python, link Colab/GitHub/App Inventor/Scratch, upload berkas).
  - Tangkapan layar: `step_10_challenge_panel.png`.
- **Slide 14: Langkah 9 — Mengklaim & Mengunduh Sertifikat Resmi (2 Halaman)**:
  - Menggunakan tangkapan layar ultra-high-resolution 2000px langsung dari PDF resmi:
    - Halaman 1: Sertifikat Kelulusan resmi berbingkai emas & stempel 3D (Landscape A4).
    - Halaman 2: Transkrip Akademik resmi full-length dengan rekap seluruh materi & matriks 4 kompetensi (Portrait A4).
  - Tangkapan layar: `step_12_cert_page1.png` & `step_13_cert_page2.png`.
- **Slide 15: Penutup, Tips Sukses Belajar, & Pusat Bantuan**:
  - 3 Tips sukses belajar mandiri (Rutin, Praktik, Ulang Video), FAQ umum, dan kontak tim bantuan teknis Ruangguru x UOB Indonesia.

---

## 3. Rencana Eksekusi Teknis & Resolusi Masalah

1. **Resolusi Glitch Box Kuning Chromium Print**:
   - Penyebab: Penggunaan `-webkit-background-clip: text` bersama gradien teks memicu Chromium print engine merender kotak solid kuning yang menimpa teks.
   - Solusi: Menggunakan warna solid langsung `color: var(--yellow);` (`#ffd93d`). Hasilnya teks tercetak tajam tanpa glitch kotak penutup.
2. **Resolusi Gambar Kekecilan & Tampilan Sempit**:
   - Penyebab: Kanvas A4 Landscape (`297mm × 210mm` / ~`1122px × 793px`) terlalu sempit secara vertikal saat menampilkan dua tangkapan layar sekaligus.
   - Solusi: Beralih ke kanvas presentasi widescreen 16:9 (`1920px × 1080px`) dan memisahkan tampilan Dashboard dan Sidebar ke Slide 7 dan Slide 8. Setiap screenshot kini berdimensi besar (> 1000px width, 640px height) dengan teks yang 100% terbaca tajam.
3. **Resolusi Konten Terpotong (Zero Cutoffs & Leaks)**:
   - Penyebab: Batas halaman A4 memaksa konten tinggi meluap ke halaman berikutnya.
   - Solusi: Tinggi tepat `1080px` per slide dengan CSS page breaks eksklusif `@page { size: 1920px 1080px; margin: 0; }` dan `.deck-slide { page-break-after: always; break-after: page; height: 1080px; max-height: 1080px; }`.

---

## 4. Verifikasi Mutu

1. **Kelengkapan Materi**:
   - 15 slide tuntas mencakup seluruh langkah onboarding, rincian kurikulum abridged SD/SMP/SMA, dan tips sukses belajar.
2. **Kualitas Visual & Render PDF**:
   - Verifikasi visual per halaman via ekstraksi gambar PNG membuktikan: 0 glitch teks, 0 konten terpotong, screenshot tajam dan besar.
   - Berkas PDF tepat 15 halaman (11.79 MB).
3. **Sinkronisasi & Git**:
   - Sinkronisasi identik ke `subprojects/01-lms-platform/docs/guide/` dan salinan unduhan di `/Users/yazidhilmi/Downloads/`.
   - Git commit checkpoint & push ke remote repository.
