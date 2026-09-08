# Memory: UOB My Digital Space - Async LMS & Curriculum Revamp

## Core Decisions & Preferences

- **Arsitektur Proyek**: Proyek induk `uob-async-lms` menaungi 2 subproject terpisah:
  1. `subprojects/01-lms-platform/` (Aplikasi web player LMS & backend Apps Script).
  2. `subprojects/02-curriculum-sequencing/` (Kurasi alur materi koding SD, SMP, SMA).
  Masing-masing subproject memiliki file `AGENTS.md`, `STATE.md`, `MEMORY.md`, dan `HISTORY.md` mandiri untuk memisahkan konteks pengembangan kode dan kurikulum.
- **Single Portal Entry**: Tidak ada lagi URL terpisah per grup/jenjang. Satu link web app melayani SD, SMP, dan SMA. Penentuan kurikulum dilakukan otomatis saat autentikasi berdasarkan sekolah asal siswa. Input login hanya membutuhkan 3 field: Nama Siswa, Nama Sekolah, dan Email Akademia.
- **Anti-Bug Architecture (Solusi 6 Bug Lama)**:
  1. *Video 00 autoplay saat login*: Conditional mounting — iframe player tidak di-mount sebelum login selesai.
  2. *Video tab lama nyala sendiri saat pindah tab*: Player lifecycle teardown/pause hook saat perpindahan tab.
  3. *Tombol kuis/next terkunci*: State progress reaktif murni berbasis Set ID kuis yang diselesaikan (`submittedQuizIds`), decoupling total dari class animasi CSS.
  4. & 5. *Data browser tidak sinkron saat di-reset*: Two-way Server-First Sync. Saat login, frontend fetch data terkini dari Google Sheets via Apps Script; jika kosong/direset, bersihkan local cache.
  6. *Duplikasi baris di Google Sheets*: Atomic Upsert Pattern di Apps Script `Code.gs` berbasis composite key `Email + Sekolah`.
- **Mobile Friendly & Gentle Advisory Modal**:
  - Tampilan responsif.
  - Viewport mobile (< 768px) menampilkan CSS dialog modal elegan: *"Untuk kenyamanan dan kemudahan belajar optimal, disarankan menggunakan perangkat Laptop, Komputer, atau Tablet."* dengan tombol dismiss *"Mengerti, Tetap Lanjutkan"*.
- **Pedagogi Koding Pemula**:
  - Kurikulum berurutan secara logis: Konsep/Lingkungan Dasar → Variabel & Tipe Data → Percabangan (If-Else) → Perulangan (Loops) → Proyek Integratif.
  - Jenjang SD: Konten video belum ada, disiapkan template struktur data modular siap pakai.
- **Git & Clasp Deployment**:
  - Remote Git: `git@github.com:mds-academic/beasiswa_async.git` (Identity: `~/.ssh/id_ed25519_academic_mds`).
  - Apps Script Clasp: Akun RGC UOB baru dengan spreadsheet terpusat baru.
- **Sumber Kode & Materi Lama (Strict Read-Only)**:
  - Direktori acuan: `/Users/yazidhilmi/Documents/cloud/Kalananti-cloud/Academic_Content/B2B/UOB/Async/`.
  - **Prinsip Zero-Touch**: DILARANG KERAS mengubah atau memodifikasi file apapun di folder lama tersebut. Folder lama strictly read-only.
  - **Clean Slate / Completely New**: Semua file pengembangan baru (LMS player, slides koding pemula, dataset kurikulum baru, skrip) dibuat sebagai file baru (*completely new*) langsung di dalam folder proyek lokal `projects/uob-async-lms/`.

## Kebutuhan disetujui pengguna — 2026-09-08: materi campuran untuk pemula

- Materi lama SMA dimulai sekitar sesi 25, bukan pengantar nol. LMS baru harus melayani siswa yang belum mengenal Python, Google Colab, atau cara menjalankan kode.
- Gunakan video lama bila penjelasan tersedia. Kekurangan dijembatani bacaan HTML slides terpisah yang tampil di area materi utama; video baru dapat menggantikannya di masa depan. Tidak perlu menunggu produksi video baru.
- Video mempertahankan bookmark waktu. HTML slides memiliki bookmark halaman/bagian, navigasi baca, dan tampilan diperbesar/fullscreen. Kedua format tetap memiliki rangkuman di bawah area materi.
- Batas startSeconds/endSeconds, bookmark, dan waktu pause/quiz/resume/skip yang sudah dikurasi adalah data sumber yang harus dipreservasi. Re-sequencing memindahkan unit materi beserta metadata waktunya, bukan mereset setiap video ke awal atau memutar video penuh.
- Ketidaksesuaian timestamp dilaporkan untuk pemeriksaan; tidak “diperbaiki” otomatis atau ditebak. Bila batas tidak tersedia, tandai belum diketahui tanpa mengarang batas baru.
- Tahap sekarang: kebutuhan platform dicatat dalam PRD/knowledge/plan; prioritas eksekusi adalah review sequencing SMP–SMA rinci, bukan implementasi player atau produksi semua slides.
