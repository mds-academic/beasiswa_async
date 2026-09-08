# Product Requirements Document (PRD)
## UOB My Digital Space: Asynchronous Learning Platform & Curriculum Revamp

---

## 1. Executive Summary & Problem Statement

Program CSR **UOB My Digital Space** (didukung oleh Kalananti) menyediakan pembelajaran asinkronus koding dan literasi digital bagi siswa sekolah mitra. Pada iterasi sebelumnya, terdapat beberapa pain-point operasional dan pedagogis:
1. **Interaktivitas Video Terlalu Kaku (Too Strict)**: Pop-up kuis muncul secara tiba-tiba tanpa pemberitahuan dan memblokir video secara paksa. Siswa yang belum siap menjawab tidak memiliki opsi untuk menutup atau menunda kuis, sehingga memicu rasa frustrasi dan drop-off rate tinggi.
2. **Fragmentasi Tautan (Multiple Links)**: Tautan dashboard dipisah-pisah berdasarkan jenjang dan grup (High School Grup A-D, Middle School Grup A-D, dst.), menyulitkan tim operasional dan guru pendamping dalam mendistribusikan link secara terpadu.
3. **Alur Kurikulum Belum Runtut untuk Pemula (Non-Linear Sequencing)**: Susunan video dan topik koding di beberapa jenjang belum mengikuti progresi pembelajaran komputasi yang bertahap (misal: langsung menyentuh perulangan sebelum memahami logika kondisi atau variabel), sehingga membingungkan siswa yang sama sekali belum pernah belajar koding (zero-experience).

Dokumen PRD ini menetapkan spesifikasi untuk merancang ulang **Platform LMS Asinkronus** yang lebih ramah siswa (*less strict* tapi tetap menjamin akuntabilitas penyelesaian kuis) serta **Merestrukturisasi Alur Kurikulum Koding** secara logis dan pedagogis untuk SD, SMP, dan SMA.

---

## 2. Product Vision & Key Objectives

### 2.1 Visi Produk
Menghadirkan pengalaman belajar mandiri (asynchronous) yang menyenangkan, inklusif, dan tidak mengintimidasi bagi siswa sekolah dasar hingga menengah di Indonesia, sekaligus memberikan kendali pemantauan progres yang akurat bagi tim operasional.

### 2.2 Tujuan Utama (Key Goals)
1. **Single Entry Portal**: 1 tautan aplikasi web tunggal untuk semua jenjang. Deteksi jenjang (SD / SMP / SMA) dilakukan otomatis setelah siswa memilih sekolah pada form login.
2. **Less-Strict & Transparent Video Quizzing**:
   - Siswa diberi transparansi sejak awal mengenai jumlah kuis di video aktif (misal: *"Video ini memiliki 3 Pop-up Kuis"*).
   - Terdapat navigasi/indikator kuis (siswa dapat melompat/membuka kuis 1, 2, atau 3).
   - Siswa dapat menutup (*close/dismiss*) jendela pop-up kuis yang muncul untuk melanjutkan menonton video, tanpa kehilangan akses membuka kuis kembali.
   - **Progress Completion Gate**: Tombol *"Lanjut ke Video Berikutnya"* tetap terkunci rapat hingga seluruh kuis pada video aktif berstatus dikerjakan (*submitted*).
3. **Curriculum Re-sequencing for Beginners**:
   - Menata ulang alur materi koding SMP, SMA, dan SD dengan tangga logika:
     `Dasar Pemikiran Komputasi & Output` → `Variabel & Tipe Data` → `Logika Percabangan (If-Else)` → `Perulangan (Loops)` → `Mini Project Terapan`.
4. **Clean & Scalable Backend**:
   - Google Apps Script (`Code.gs`) baru yang menangani registrasi/login multi-jenjang dan logging progres/nilai ke Google Sheets secara modular dan otomatis.

## 2.3 Pelajaran dari Sistem Lama & Solusi Arsitektur (Anti-Bug Architecture)

Berdasarkan evaluasi sistem lama di `/Academic_Content/B2B/UOB/Async`, platform baru ini mengadopsi 6 solusi arsitektur wajib:

| No | Gejala Bug Lama | Akar Masalah (Root Cause) | Solusi Arsitektur Baru |
|---|---|---|---|
| 1 | Di halaman login, video 00 sudah auto-play sendiri di latar belakang | Komponen iframe YouTube ter-mount di DOM sebelum autentikasi selesai | **Conditional Mounting**: Komponen video player sama sekali tidak di-render ke DOM selama `isAuthenticated === false`. |
| 2 | Saat pindah tab/modul, video tab lama tetap memutar audio sendiri di latar | Player instance tab lama tidak di-teardown / di-pause saat state tab berubah | **Lifecycle Teardown Hook**: Setiap pergantian tab/modul mengeksekusi `player.pauseVideo()` atau `player.destroy()` sebelum me-mount video baru. |
| 3 | Pop-up kuis sudah diisi (bahkan tersimpan di backend), tapi tombol lanjut tab berikutnya tetap terkunci (stuck) | Pengecekan completion terikat pada selector class CSS typo (`.quiz-next-btn` vs `.quiz-next`) atau mismatch ID kuis | **Reactive ID-based Gate**: Progress lock hanya bergantung pada data reaktif murni (`submittedQuizIds.has(quiz.id)`), 100% independen dari animasi CSS atau manipulasi class DOM. |
| 4 & 5 | Data siswa dihapus di backend untuk reset, tapi browser tetap nyangkut karena data browser (localStorage) usang | Client hanya percaya pada `localStorage` tanpa two-way sync dari server | **Server-First Hydration**: Saat siswa login, aplikasi menarik snapshot progres terkini dari Google Sheets via Apps Script. Jika data di sheet kosong (di-reset admin), frontend otomatis mengosongkan cache lokal dan menyelaraskan state. |
| 6 | Setiap login di tanggal berbeda membuat row baru di Google Sheets dengan data kredensial yang sama (duplikasi row) | Skrip backend lama selalu memanggil `appendRow()` tanpa validasi keberadaan record | **Atomic Upsert Pattern**: Skrip `Code.gs` baru memeriksa kombinasi unik `Email + Sekolah`. Jika sudah ada, lakukan update pada baris tersebut; jika belum ada, buat baris baru. |

---

## 2.4 Mobile UX & Gentle Advisory Modal

Platform baru didesain responsif (*mobile-friendly*), namun karena pembelajaran coding membutuhkan ruang layar yang leluasa:
- **Deteksi Perangkat Mobile**: Jika viewport terdeteksi berukuran mobile (< 768px):
  - Sistem menampilkan **CSS Modal Dialog** yang elegan (bukan `window.alert()`).
  - **Pesan**: *"Untuk kenyamanan dan kemudahan belajar koding yang optimal, disarankan menggunakan perangkat Laptop, Komputer, atau Tablet."*
  - **Tombol Aksi**: *"Mengerti, Tetap Lanjutkan"* (siswa tidak diblokir secara kaku jika hanya memiliki perangkat ponsel).

---

## 3. Project Organization & Subprojects

Proyek ini dikelola dalam satu folder induk (`projects/uob-async-lms/`) dengan pembagian 2 subproject terisolasi:

```
projects/uob-async-lms/
├── PRD.md                                    # Dokumen PRD Utama (file ini)
├── PROJECT.md                                # Project Brief Induk
├── MEMORY.md                                 # Keputusan & Konteks Tahan Lama
├── STATE.md                                  # Checkpoint Status Terkini
├── CANVAS.md                                 # Dashboard Artefak
├── HISTORY.md                                # Log Interaksi Induk
├── AGENTS.md                                 # Aturan Agen Induk
├── planning/
│   ├── 01-implementation-plan-...md          # Rencana Induk
│   └── 02-implementation-plan-...md          # Rencana Scaffolding Kurikulum
└── subprojects/
    ├── 01-lms-platform/                      # Subproject 1: Web App & Apps Script
    │   ├── AGENTS.md
    │   ├── PROJECT.md
    │   ├── STATE.md
    │   ├── MEMORY.md
    │   ├── HISTORY.md
    │   ├── src/                              # Komponen Vue 3, Player, Auth, Styles
    │   └── backend/                          # Code.gs & Integrasi Sheets
    └── 02-curriculum-sequencing/             # Subproject 2: Kurasi & Data Modul
        ├── AGENTS.md
        ├── PROJECT.md
        ├── STATE.md
        ├── MEMORY.md
        ├── HISTORY.md
        ├── mapping/                          # Peta Alur Pedagogis SD, SMP, SMA
        └── output/                           # courseData.json siap injeksi
```

---

## 4. Functional Specifications

### 4.1 Modul Autentikasi & Smart Routing (Subproject 1)
- **Data Kredensial Login (3 Field)**:
  1. **Nama Sekolah**: Dropdown pencarian sekolah mitra.
  2. **Nama Siswa**: Pilihan nama dari roster sekolah.
  3. **Email Akademia**: Email resmi siswa terdaftar di Akademia Ruangguru.
- **Deteksi Jenjang Otomatis**:
  - `SD` → Memuat struktur modul Upper Primary (Visual Logic / Scratch template).
  - `SMP` → Memuat modul Middle School (Logic / App Inventor / Python Dasar).
  - `SMA` → Memuat modul High School (Python Applied / Safe Coding).
- **Two-Way Server Sync**:
  - Setelah verifikasi berhasil, frontend mengambil riwayat kuis & modul dari backend Google Sheets.
  - Memperbarui cache `localStorage` sesuai snapshot server terbaru.

### 4.2 Modul Video Player & Quiz Interaction UX (Subproject 1)
- **Komponen Player**:
  - Video embed responsif (YouTube / Drive video player).
  - **Quiz Indicator Pill Bar**: Terletak di atas atau di samping player, menampilkan status seluruh kuis pada video aktif:
    - `Dot Abu-abu`: Belum dikerjakan (Unattempted).
    - `Dot Oranye / Berkedip`: Siap dikerjakan / Muncul pada timestamp tertentu.
    - `Dot Hijau`: Sudah dikerjakan (Submitted).
- **Mekanisme Pop-up Kuis**:
  - Saat timestamp video menyentuh waktu kuis (atau saat siswa mengeklik pill kuis): modal kuis muncul secara anggun (*slide-over* atau *modal dialog*).
  - **Tombol Tutup / Tunda ("Tonton Dulu")**: Siswa dapat menutup kuis kapan saja untuk mengecek kembali video.
  - **Tombol Mundur 30 Detik ("Putar Ulang Penjelasan")**: Membantu siswa mengingat kembali materi terkait.
  - **Submission**: Siswa memilih jawaban dan menekan *"Kirim Jawaban"*. Jawaban langsung tercatat ke local state dan dikirim ke backend.
- **Progress Gate (Kunci Navigasi Video)**:
  - Tombol *"Lanjut ke Video Berikutnya"* atau tab materi selanjutnya dalam status non-aktif (*disabled*) selama masih ada kuis yang belum berstatus `Submitted`.
  - Tooltip informatif: *"Selesaikan semua (X) kuis pada video ini sebelum melanjutkan."*

### 4.3 Alur Kurikulum Koding Ramah Pemula (Subproject 2)
Penyusunan ulang kurikulum wajib mematuhi kaidah **scaffolding pedagogis**:
1. **Tahap 1: Pengenalan & Mental Model Pemrograman**
   - Apa itu instruksi komputer? Bagaimana komputer berpikir?
   - Input, Output, dan Lingkungan Koding.
2. **Tahap 2: Variabel & Tipe Data (Penyimpanan Memori)**
   - Mengapa butuh variabel?
   - Tipe data angka (integer, float), teks (string), dan boolean.
3. **Tahap 3: Logika Kondisional & Pengambilan Keputusan**
   - Pembanding relasional (`==`, `!=`, `<`, `>`).
   - Struktur percabangan (`if`, `else`, `elif`).
4. **Tahap 4: Otomasi & Perulangan (Looping)**
   - Kebutuhan otomasi: mengapa tidak menulis baris berulang?
   - Struktur `for` loop dan `while` loop.
5. **Tahap 5: Mini Proyek & Evaluasi Terapan**
   - Menggabungkan variabel, kondisi, dan looping ke dalam satu aplikasi interaktif (game tebak angka, kalkulator sederhana, atau quiz app).

### 4.4 Format Data Kurikulum Standar (`courseData.json`)
Struktur data tunggal yang dihasilkan oleh Subproject 2 untuk dibaca langsung oleh Subproject 1:
```json
{
  "level": "middle_school",
  "title": "Dasar Pemrograman Python untuk SMP",
  "modules": [
    {
      "id": "mod-01",
      "title": "Modul 1: Variabel & Dunia Koding",
      "videos": [
        {
          "id": "vid-01",
          "title": "Mengenal Variabel di Python",
          "videoUrl": "https://www.youtube.com/embed/...",
          "summary": "Rangkuman singkat materi variabel...",
          "quizzes": [
            {
              "id": "quiz-01-a",
              "timestamp": 125,
              "question": "Manakah cara penulisan variabel yang benar di Python?",
              "options": ["1nama = 'Budi'", "nama_siswa = 'Budi'", "nama-siswa = 'Budi'"],
              "correctAnswerIndex": 1,
              "explanation": "Nama variabel tidak boleh diawali angka atau mengandung strip."
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 5. Backend, Clasp, & Git Deployment

- **Remote Git Repository**:
  - Target: `git@github.com:mds-academic/beasiswa_async.git`
  - SSH Host: `github.com` via Identity `~/.ssh/id_ed25519_academic_mds` (User: `mds-academic`).
- **Google Apps Script & Clasp**:
  - Manajemen script via `@google/clasp`.
  - Deployment dengan akun RGC UOB baru yang disiapkan.
  - Spreadsheet baru sebagai master data dan logging hasil siswa.
- **Operasi Backend**:
  - Action `auth`: Validasi nama, sekolah, email + return historical progress snapshot.
  - Action `submitQuiz`: Menyimpan skor kuis ke Google Sheets dengan metode Upsert.
  - Action `submitProject`: Menyimpan kode ide atau kuis akhir.

- **Platform**: Google Apps Script (Web App Deployment).
- **Database**: Google Sheets Terpusat.
  - `ops-schools-meta`: Master sekolah, jenjang (SD/SMP/SMA), PIC pendamping.
  - `ops-students-roster`: Master nama siswa, email akademia, dan ID sekolah.
  - `ops-progress-sd`, `ops-progress-smp`, `ops-progress-sma`: Logging riwayat submission kuis, waktu submit, skor, dan status kelulusan modul per jenjang.
- **CORS & Response Format**: RESTful JSON responses (`success: true/false`, payload, error message).

---

## 6. Definition of Done & Acceptance Criteria

1. **User Authentication**:
   - Memilih sekolah SD menampilkan modul SD.
   - Memilih sekolah SMP menampilkan modul SMP.
   - Memilih sekolah SMA menampilkan modul SMA.
2. **Video & Quiz Player**:
   - Indikator kuis menampilkan jumlah total kuis dengan akurat.
   - Siswa dapat membuka, menutup, dan melompat antar kuis secara mulus.
   - Tombol video berikutnya terkunci bila kuis belum berstatus submitted.
3. **Kurikulum**:
   - Peta materi SD, SMP, SMA bebas dari loncatan konsep koding.
   - Berkas `courseData.json` tervalidasi skemanya dan terhubung ke web app.
4. **Operasional**:
   - Submit kuis berhasil tercatat di Google Sheets tanpa error timeout.

## Kebutuhan disetujui pengguna — 2026-09-08: materi campuran untuk pemula

- Materi lama SMA dimulai sekitar sesi 25, bukan pengantar nol. LMS baru harus melayani siswa yang belum mengenal Python, Google Colab, atau cara menjalankan kode.
- Gunakan video lama bila penjelasan tersedia. Kekurangan dijembatani bacaan HTML slides terpisah yang tampil di area materi utama; video baru dapat menggantikannya di masa depan. Tidak perlu menunggu produksi video baru.
- Video mempertahankan bookmark waktu. HTML slides memiliki bookmark halaman/bagian, navigasi baca, dan tampilan diperbesar/fullscreen. Kedua format tetap memiliki rangkuman di bawah area materi.
- Batas startSeconds/endSeconds, bookmark, dan waktu pause/quiz/resume/skip yang sudah dikurasi adalah data sumber yang harus dipreservasi. Re-sequencing memindahkan unit materi beserta metadata waktunya, bukan mereset setiap video ke awal atau memutar video penuh.
- Ketidaksesuaian timestamp dilaporkan untuk pemeriksaan; tidak “diperbaiki” otomatis atau ditebak. Bila batas tidak tersedia, tandai belum diketahui tanpa mengarang batas baru.
- Tahap sekarang: kebutuhan platform dicatat dalam PRD/knowledge/plan; prioritas eksekusi adalah review sequencing SMP–SMA rinci, bukan implementasi player atau produksi semua slides.

### Spesifikasi tambahan: area materi video dan HTML slides

Satu daftar langkah pembelajaran mendukung dua media utama: video YouTube dan dokumen HTML slides terpisah. Jenis media dipisahkan dari jenis aktivitas (pelajaran/proyek) agar proyek yang memiliki video tetap dapat dirender dengan benar. Skema `videos` pada contoh §4.4 adalah contoh lama; arah kontrak baru menggunakan `modules[].steps[]` dengan media eksplisit dan lapisan kompatibilitas untuk JSON yang ada.

| Perilaku | Video | HTML slides |
|---|---|---|
| Area utama | Player dengan video ID/link dan rentang sumber | Viewer/iframe menuju artefak HTML terpisah |
| Bookmark | Detik absolut pada sumber video | ID slide/bagian yang stabil |
| Navigasi | Seek dibatasi pada segmen yang dikurasi | Sebelumnya/berikutnya dan lompat bookmark |
| Perbesar | Fullscreen/tampilan luas | Fullscreen/tampilan luas dengan konten tetap terbaca |
| Rangkuman | Di bawah player | Di bawah viewer |
| Latihan | Pemicu timestamp atau manual sesuai metadata | Pemicu slide/bagian atau manual; tidak memakai waktu video palsu |
| Progres | Kuis wajib tetap harus submitted | Kuis wajib tetap harus submitted; halaman terakhir terbaca bukan bukti penguasaan |

Perubahan media atau fullscreen tidak menghapus posisi baca dan jawaban. Saat berganti ke slides, video sebelumnya berhenti. Kegagalan memuat media menampilkan pesan dan opsi coba lagi, bukan menandai selesai. Penanganan halaman tanpa kuis: sediakan tindakan eksplisit “Selesai membaca” sebagai usulan mekanisme completion; tidak menambah kuis wajib otomatis.

### Acceptance criteria tambahan

1. Materi video → slides → video dapat dibuka dalam urutan kurikulum yang sama, dengan rangkuman pada setiap langkah.
2. Bookmark slides membuka bagian yang benar dan tetap berfungsi dalam tampilan diperbesar.
3. Video selalu dimulai dan berhenti pada batas yang dikurasi; seek, replay, rewind, dan navigasi kuis tidak membocorkan filler di luar rentang.
4. Metadata batas/waktu dari sumber lama memiliki snapshot pembanding; perubahan tidak disengaja harus terdeteksi sebelum migrasi.
5. Setiap materi tambahan pada mapping memiliki tujuan, prasyarat, isi penjelasan, praktik, dan hubungan eksplisit ke materi video berikutnya.
