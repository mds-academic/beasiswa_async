# Implementation Plan 03: Subproject 01 — LMS Platform Implementation & UI Alignment

Tanggal: 2026-09-08  
Status: `Active Plan (In-Place Renewal)`  
Terkait: [02-implementation-plan-curriculum-scaffolding-smp-sma-sd.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/planning/02-implementation-plan-curriculum-scaffolding-smp-sma-sd.md) · [PRD.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/PRD.md) · [Checklist Verifikasi](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/ops/class-verification-checklist.md)

---

## 1. Ringkasan & Tujuan Implementasi

Fokus aktif dialihkan ke pengerjaan **Subproject 01 (LMS Platform)** sementara Subproject 02 (Curriculum Sequencing) tetap berjalan di jalurnya.

Tujuan utama Subproject 01:
1. **Desain Visual Presisi (Identik dengan LMS Eksisting)**:
   - Mempertahankan estetika khas UOB My Digital Space / Kalananti Async: palet warna corporate navy-blue & warm accent, tipografi Google Fonts (Fredoka untuk headings, Nunito untuk body text), layout sidebar misi + progress bar, kartu rangkuman di bawah media player, serta aset visual resmi (logo Ruangguru, logo UOB, ilustrasi planet/space background).
2. **Penyesuaian & Fitur Baru**:
   - **Gentle Advisory Modal (Mobile Reminder)**: Dialog elegan bagi pengguna layar sempit (< 768px) yang menyarankan penggunaan Laptop, Komputer, atau Tablet untuk pengalaman coding yang optimal, dilengkapi tombol dismiss *"Mengerti, Tetap Lanjutkan"*.
   - **Interactive Quiz Switcher & Non-Blocking Pop-up**:
     - Siswa tidak lagi diblokir kaku saat pop-up kuis muncul; mereka dapat menutup/menunda kuis (*"Tutup / Nanti Dulu"*), memutar ulang video mundur 30 detik (*"Rewatch 30 Detik"*), atau membuka kembali kuis kapan saja lewat tombol pill navigasi kuis.
     - Indikator status kuis yang jelas (misal: *"Kuis 1 dari 3"* dengan badge Belum Dikerjakan / Selesai).
   - **Progress Lock Gate**:
     - Tombol navigasi ke materi berikutnya (*"Materi Selanjutnya"*) tetap terkunci (disabled) sampai seluruh kuis pada materi aktif berstatus diselesaikan (submitted).
   - **Hybrid Media Player Container**:
     - Mendukung pemutaran video YouTube (dengan preservasi ketat startSeconds/endSeconds dan bookmarks).
     - Mendukung pembacaan **HTML Slides** interaktif untuk materi pengantar pemula yang belum memiliki rekaman video (lengkap dengan navigasi slide, tombol perbesar/fullscreen, bookmark bagian, dan rangkuman materi).
   - **Single Portal Entry & Auto-Detection Jenjang**:
     - Satu link aplikasi melayani SD, SMP, dan SMA. Pilihan nama sekolah otomatis mendeteksi jenjang dan memuat data kurikulum yang sesuai.
3. **Verifikasi Kelas & Roster Siswa**:
   - Sebelum menyambungkan endpoint penulisan data ke Google Sheets, daftar sekolah/kelas, email akademia, dan mapping jenjang diverifikasi secara ketat agar tidak terjadi salah kamar kurikulum atau data kotor.
4. **Strict Account Guard: Gita Pengbenar**:
   - Seluruh konfigurasi backend Google Workspace, Google Sheets, dan deployment Apps Script **WAJIB** menggunakan akun operasional resmi **Gita Pengbenar**.
   - **DILARANG KERAS** menggunakan akun Gita pribadi. Pemeriksaan identitas akun (avatar & email) menjadi syarat mutlak (hard gate) sebelum aksi publish/clasp.

---

## 2. Tahapan Eksekusi (Implementation Roadmap)

```
[Tahap 1: HTML Shell & Desain Identik LMS + Modals]
                          ↓
[Tahap 2: Verifikasi Kelas, Sekolah, & Data Roster]
                          ↓
[Tahap 3: Logika Player Hybrid (Video Guard + HTML Slides + Quiz Switcher)]
                          ↓
[Tahap 4: Account Guard Gita Pengbenar & Integrasi Apps Script Backend]
                          ↓
[Tahap 5: End-to-End Testing & Git Checkpoint]
```

### Tahap 1: HTML Shell & Desain UI Presisi + Komponen Modal Baru
- Mengonstruksi struktur HTML semantik pada `subprojects/01-lms-platform/src/index.html` mengacu pada layout acuan `sesi25-26/grup-hs-2-a/`.
- Memasukkan Google Fonts (`Fredoka`, `Nunito`) dan stylesheet `styles.css` dengan token desain UOB/Ruangguru (warna, border radius, bayangan, transisi modal).
- Membangun komponen modal:
  1. **Mobile Advisory Modal**: Deteksi viewport mobile / tombol info panduan perangkat.
  2. **Quiz Pop-up Overlay**: Container modal kuis dengan header counter (*"Kuis 1 dari X"*), opsi ganda/isian, tombol submit, tombol *"Rewatch 30 Detik"*, dan tombol *"Tutup (Nanti Dulu)"*.
  3. **Quiz Status Bar / Indicator Strip**: Widget di bawah player untuk melihat daftar kuis materi aktif dan membuka kuis secara fleksibel.
  4. **Login Card**: Form autentikasi 3 input (Nama Siswa, Sekolah / Jenjang, Email Akademia) dengan styling identik.

### Tahap 2: Verifikasi Kelas & Roster Siswa
- Menjalankan checklist verifikasi pada [class-verification-checklist.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/ops/class-verification-checklist.md).
- Menyiapkan fixture data sekolah dan email valid untuk keperluan testing lokal 3 jenjang:
  - SD: Pemetaan kurikulum Upper Primary.
  - SMP: Pemetaan kurikulum Middle School.
  - SMA: Pemetaan kurikulum High School.
- Memastikan pemilahan kurikulum bekerja instan saat sekolah dipilih pada form login.

### Tahap 3: Logika Player Hybrid & Progress Lock (JavaScript)
- Pada `src/app.js`:
  - **YouTube API Integration**:
    - Kontrol custom: Play/Pause, Seek bar, Time display, Mute, Fullscreen, dan Bookmark clicks.
    - Timestamp guard: Menghentikan video saat mencapai `endSeconds` dan memicu kemunculan pop-up kuis sesuai `quizTime`.
  - **HTML Slides Viewer**:
    - Mode tampilan khusus jika modul bertipe `html_slides`.
    - Navigasi slide (Sebelumnya / Selanjutnya / Indikator Halaman).
    - Tombol perbesar (Fullscreen view).
  - **Quiz Switcher & Non-Blocking State**:
    - Pop-up kuis dapat ditutup tanpa mereset progres jawaban.
    - `submittedQuizIds`: Menyimpan ID kuis yang sudah dijawab benar/selesai.
    - Tombol navigasi *"Materi Selanjutnya"* dinonaktifkan (disabled) jika `submittedQuizIds` belum mencakup semua kuis pada materi tersebut.

### Tahap 4: Account Guard Gita Pengbenar & Backend Apps Script (`Code.gs`)
- **Strict Hard Gate**:
  - Konfirmasi visual akun operasional Gita Pengbenar.
  - Peringatan keras jika browser/clasp terhubung ke akun Gita pribadi -> batalkan operasi.
- **Backend Architecture**:
  - Menyusun `Code.gs` dengan pola *Atomic Upsert* berdasarkan composite key `Email + Sekolah`.
  - Endpoint `doGet` untuk verifikasi siswa & fetch riwayat progres tersimpan.
  - Endpoint `doPost` untuk pencatatan progres kuis & mini project secara real-time.

### Tahap 5: Pengujian, Validasi, & Git Checkpoint
- Pengujian responsiveness layar mobile (< 768px), tablet, dan desktop (> 1024px).
- Pengujian siklus kuis: Pop-up muncul -> Tutup -> Rewind -> Buka via Switcher -> Submit -> Progress unlock.
- Git checkpoint commit otomatis pada repositori lokal `projects/uob-async-lms/`.

---

## 3. Matriks Perbandingan Fitur Lama vs Baru

| Aspek | LMS Lama (Eksisting) | LMS Baru (Subproject 01) |
|---|---|---|
| **Pintu Masuk (URL)** | URL terpisah per grup/jenjang | **Single Portal**: 1 link otomatis deteksi jenjang (SD/SMP/SMA) |
| **Pop-up Kuis** | Rigid blocking (video berhenti & terkunci) | **Less-Strict**: Bisa ditutup/ditunda, ada tombol rewatch 30 detik |
| **Navigasi Kuis** | Tidak tahu ada berapa kuis di video | **Quiz Switcher**: Indikator "Kuis 1 dari 3", bisa pilih kuis |
| **Progress Lock** | Sering terkunci karena glitch CSS | **Reactive Gate**: Terkunci sampai semua kuis tuntas via ID set murni |
| **Jenis Media** | Hanya video YouTube | **Hybrid**: Video YouTube (preservasi timestamp) ATAU HTML Slides |
| **Peringatan Perangkat** | Tidak ada peringatan khusus | **Advisory Modal**: Edukasi ramah disarankan laptop/tablet |
| **Akun Deployment** | Terpencar / rentan salah akun | **Strict Guard**: Wajib akun Gita Pengbenar, dilarang akun pribadi |

---

## 4. Rencana Verifikasi (Verification Plan)

### Automated / Browser Verification
1. Verifikasi markup HTML: Bebas dari error sintaks, semantic elements lengkap (`<main>`, `<dialog>`, `<nav>`, `<article>`).
2. Verifikasi CSS: Responsive breakpoints (768px, 1024px), Google Fonts dimuat dengan benar, tidak ada overflow anomali.
3. Verifikasi Interaksi:
   - Klik submit login dengan sekolah jenjang SMP -> kurikulum SMP muncul.
   - Buka kuis -> tutup kuis -> buka kembali via switcher -> status tersinkronisasi.
   - Coba klik *"Materi Selanjutnya"* saat kuis belum selesai -> tombol nonaktif / notifikasi muncul.
   - Selesaikan kuis -> tombol *"Materi Selanjutnya"* aktif.

### Manual Verification & Account Checklist
- [ ] Checklist verifikasi kelas terisi lengkap di `ops/class-verification-checklist.md`.
- [ ] Bukti verifikasi akun Gita Pengbenar sebelum akses Google Workspace / Apps Script.
