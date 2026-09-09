# Implementation Plan: Skeuomorphism Redesign, 2-Page A4 Certificate & Transcript, Bento Quiz Tracker, Slide View & Strict Gating

Dokumen rencana implementasi ini merinci transformasi visual dan logika platform LMS **UOB My Digital Space** berdasarkan arahan dan konfirmasi pengguna.

---

## 1. Ringkasan Kebutuhan & Solusi Arsitektur

| No | Poin Kebutuhan | Solusi Arsitektur & Implementasi |
|---|---|---|
| **1** | **Pembersihan Topbar Desktop (Hapus Panduan Perangkat)** | - Hapus tombol *"Panduan Perangkat"* dari topbar desktop.<br>- Modal dialog panduan perangkat hanya muncul otomatis saat diakses dari perangkat mobile (`viewport width <= 768px`) dengan opsi dismiss persistens. |
| **2** | **Sertifikat & Skor Hanya di Tab Terakhir Sidebar (Terkunci)** | - Hapus tombol sertifikat dari topbar dan profile dropdown.<br>- Tambahkan tab terakhir di sidebar: **`🎓 Sertifikat & Rekap Nilai`** berstatus terkunci (`🔒`).<br>- Tab ini hanya bisa dibuka setelah seluruh materi pembelajaran dan kuis selesai 100%. |
| **3** | **Dokumen Cetak 2 Halaman (Halaman 1 Landscape A4 & Halaman 2 Portrait A4)** | - Menggunakan engine konverter **`html2pdf.bundle.min.js`** (dari referensi B2C Placement Test):<br>  • **Halaman 1**: Sertifikat Kelulusan Resmi berorientasi **Landscape A4 (297 mm × 210 mm)** dengan frame ganda navy-gold mewah, watermark, segel emas 3D, dan tanpa garis bawah hyperlink pada nama siswa.<br>  • **Halaman 2**: Transkrip Nilai & Capaian Belajar berorientasi **Portrait A4 (210 mm × 297 mm)** memuat rincian evaluasi kuis, matriks 4 kompetensi komputasi, dan tanda tangan resmi entitas `UOB My Digital Space`.<br>- Menghasilkan 1 berkas PDF utuh multi-orientasi tanpa ketergantungan dialog cetak browser. |
| **4** | **Pop-up Quiz Tracker di Bento Box (Pengganti Cheat Sheet)** | - Hapus strip horizontal sempit kuis di bawah video.<br>- Ubah Bento Box cheat sheet di bawah video menjadi **Bento Card `📝 Evaluasi Pop-up Kuis`** berisi daftar kuis scrollable 1 baris bersih per item, dilengkapi badge status (`✓ Selesai` / `⏳ Belum`), timestamp, dan tombol *"Buka Kuis"* / *"Ulas Kuis"*. |
| **5** | **Slide Pembelajaran (Bukan Sandbox) & Layar Penuh** | - Ganti seluruh label teks "Sandbox" menjadi "Slide Pembelajaran".<br>- Sediakan tinggi lega (`min-height: 640px; height: 75vh;`) agar materi slide tidak ter-crop di tengah.<br>- Perbaiki tombol *"Layar Penuh"* (`requestFullscreen()`) untuk iframe slide.<br>- Jika materi murni bertipe slide (tanpa video), langsung tampilkan slide dan sembunyikan switcher tab. |
| **6** | **Validasi Login Ketat & Strict Sidebar Gating** | - Input email dan tombol login terkunci (`disabled: true`) sampai siswa memilih sekolah mitra di dropdown combobox.<br>- Siswa regular tidak dapat melompati materi yang terkunci (`🔒`) di sidebar. |

---

## 2. Rincian Teknis & Perubahan Berkas

### A. Tampilan & Layout ([`src/styles.css`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/src/styles.css))
1. **Pelebaran Kontainer Utama (`.site-shell`)**:
   - Diperlebar menjadi `width: min(1560px, calc(100% - 32px));` agar tidak terasa ter-crop sempit di monitor desktop modern.
2. **Slide Mode & Layar Penuh**:
   - `.video-frame.slide-mode` dengan `aspect-ratio: auto; min-height: 640px; height: 75vh;`.
   - Aturan fullscreen menyeluruh untuk `.video-frame:fullscreen` dan `.sandbox-container:fullscreen`.
3. **Bento Quiz Tracker Styling**:
   - `.bento-quiz-card`, `.bento-quiz-item`, `.bento-badge-done`, `.bento-badge-pending`, `.btn-bento-open-quiz`.
4. **Dokumen 2 Halaman Campuran (Landscape + Portrait)**:
   - `.cert-page-1`: Rasio aspek `297 / 210` (Landscape A4), frame regalia emas & navy, aksen sudut, segel emas 3D, tipografi nama siswa tanpa underline.
   - `.cert-page-2`: Rasio aspek `210 / 297` (Portrait A4), tabel transkrip akademik, badge capaian, dan matriks 4 kompetensi komputasi.
   - Fallback `@media print` dengan `@page cert-landscape` dan `@page transcript-portrait`.

---

### B. Struktur HTML ([`src/index.html`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/src/index.html))
1. **Pembersihan Topbar**:
   - Dihapus `#btn-open-advisory` dan `#btn-open-certificate` dari topbar desktop.
   - Dihapus `#btn-dropdown-cert` dari `#profile-dropdown`.
2. **Form Login Awal**:
   - Ditambahkan `disabled` pada `#login-email-input`, `#btn-toggle-email-help`, dan `#btn-login`.
3. **Bento Box Tracker**:
   - Dihapus `#quiz-switcher-strip`.
   - Ditambahkan `#bento-quiz-tracker-card` dengan list kontainer `#bento-quiz-list`.
4. **Modal Dialog Sertifikat 2 Halaman A4**:
   - `#cert-page-1`: Sertifikat Kelulusan resmi.
   - `#cert-page-2`: Transkrip Hasil Evaluasi Belajar dengan tabel `#cert-transcript-tbody`.
   - Tanda tangan resmi entitas: `UOB My Digital Space`.

---

### C. Logika Aplikasi ([`src/app.js`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/src/app.js))
1. **Gating Login & Reset Form**:
   - Input email dan tombol masuk baru aktif saat `selectSchool()` dipanggil.
2. **Sidebar Modul & Tab Sertifikat**:
   - `buildSidebarModuleList()` membuat tab materi dengan indikator kunci (`🔒`).
   - Menambahkan tab khusus `#tab-certificate-final` (`🎓 Sertifikat & Rekap Nilai`) di akhir navigasi yang hanya bisa dibuka saat `isAllCourseCompleted`.
3. **Slide Mode Activation**:
   - `activateMediaMode()` otomatis menambahkan class `.slide-mode` pada container saat membuka slide.
4. **Bento Tracker Rendering**:
   - `renderBentoQuizTracker()` merender daftar pop-up kuis secara horizontal 1 baris per item dengan tombol akses langsung.
5. **Ekspor PDF 2 Halaman Campuran (Landscape + Portrait) via html2pdf**:
   - Fungsi `exportCertificateToPdf()` memproses render canvas Halaman 1 (Landscape) dan Halaman 2 (Portrait) via `html2pdf.bundle.min.js`.
   - Menggabungkan keduanya ke dalam satu berkas PDF menggunakan `jsPDF` (`landscape` untuk Halaman 1, lalu `addPage('a4', 'portrait')` untuk Halaman 2).
   - Mengunduh otomatis berkas PDF resmi (`Sertifikat_UOB_MDS_[NamaSiswa].pdf`) secara mulus dengan indikator progress dan fallback cetak browser.
6. **Populasi Data Sertifikat & Transkrip**:
   - `openCertificateModal()` mengisi data siswa, sekolah, rombel, serial number, tanggal cetak, dan merender baris modul pada tabel transkrip.

---

## 3. Rencana Verifikasi & Pengujian
- **Uji Otomatis Playwright ([`scratch/test_revision_features.py`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/scratch/test_revision_features.py))**:
  - Test 1: Input login terkunci default.
  - Test 2: Alur login Admin SMA UOB.
  - Test 3: Pembersihan tombol topbar desktop.
  - Test 4: Tampilan Bento Quiz Tracker 1 baris.
  - Test 5: Tampilan Slide Pembelajaran tidak ter-crop (slide-mode).
  - Test 6: Sertifikat 2 Halaman A4 & tanda tangan UOB My Digital Space.
  - Test 7: Alur login siswa regular dan strict gating tab materi & sertifikat.

---

## 4. Pre-execution review — 2026-09-09

### Keputusan review

**Status: NEEDS REVISION sebelum eksekusi.** Arah landscape A4 untuk halaman 1 dan portrait A4 untuk halaman 2 sudah tepat, tetapi rencana belum cukup aman untuk langsung dijalankan.

### Gaps wajib ditambahkan ke acceptance criteria

1. **Engine ekspor belum terhubung ke UI**
   - `src/vendor/html2pdf.bundle.min.js` sudah ada secara lokal, tetapi `src/index.html` belum memuat script vendor dan `app.js` belum memiliki `exportCertificateToPdf()`.
   - Tombol `#btn-print-certificate` masih memanggil `window.print()`.
   - Implementasi harus memuat vendor secara lokal, bukan CDN runtime, dan mengganti handler tombol dengan ekspor PDF aktual.

2. **Mixed orientation harus diuji pada file PDF, bukan hanya canvas**
   - Page 1 wajib `297 × 210 mm` landscape.
   - Page 2 wajib `210 × 297 mm` portrait.
   - Acceptance test harus memeriksa jumlah halaman tepat 2 dan ukuran/orientasi setiap halaman memakai parser PDF atau metadata jsPDF.

3. **Ukuran render harus fixed A4, bukan `width: 100%` modal**
   - Jangan mengambil screenshot dari ukuran modal/browser.
   - Buat render surface terisolasi dengan ukuran A4 yang eksplisit, lalu render page 1 dan page 2 secara terpisah agar tidak terpotong atau ikut style modal.

4. **CORS aset logo/font harus deterministic**
   - Logo eksternal dari Wikimedia/CDN berisiko membuat canvas tainted atau hilang saat offline.
   - Acceptance criteria harus memakai aset lokal yang sudah diverifikasi, atau fallback teks/logo yang aman bila aset gagal.
   - `useCORS: true` saja bukan jaminan jika origin aset tidak mengirim header CORS.

5. **Source of truth nilai dan status harus server-first**
   - Sebelum membuka/mengekspor sertifikat, tunggu sync progres server selesai.
   - Jangan menganggap quiz tanpa score sebagai `100` secara otomatis.
   - Status kelulusan harus satu definisi: semua unit tuntas, semua quiz submitted, video/slide completion valid, dan threshold nilai yang disepakati.
   - Page 2 harus menampilkan nilai kuis aktual, termasuk nilai 0 setelah tiga kali percobaan.

6. **Eligibility tidak boleh hanya UI lock**
   - `openCertificateModal()` wajib melakukan guard terpusat tepat sebelum render dan ekspor.
   - Admin bypass tidak boleh menghasilkan sertifikat siswa seolah-olah telah menyelesaikan materi.
   - Tombol/tab sertifikat harus disabled selama server restore masih berlangsung.

7. **Nomor seri dan tanggal perlu kebijakan resmi**
   - Nomor seri deterministik dari email/sekolah saat ini mudah ditebak dan bukan bukti penerbitan server.
   - Tambahkan `issuedAt`, `certificateSerial`, dan status penerbitan dari backend atau tandai jelas sebagai preview sampai backend penerbitan tersedia.
   - Sanitasi nama siswa untuk filename PDF.

8. **Print fallback harus dipisahkan dari PDF export**
   - `window.print()` tetap boleh sebagai fallback, tetapi jangan menjadi jalur utama.
   - CSS `@page` saat ini masih default portrait dan belum dapat menjamin mixed orientation.

9. **QA visual dan data wajib dijalankan setelah implementasi**
   - Test certificate locked/unlocked.
   - Test quiz score campuran 100/0.
   - Test 36 row SMA/SMP dan 8 row SD tidak overflow ke page 3.
   - Test nama panjang, sekolah panjang, logo gagal load, dan viewport mobile.
   - Render hasil PDF lalu inspeksi page count, ukuran halaman, crop, font, logo, dan tanda tangan.

### Rekomendasi scope eksekusi

Eksekusi aman dibagi dua tahap:

- **Tahap A — PDF engine & data contract:** muat vendor lokal, buat isolated render surface, server-first certificate snapshot, serial/date contract, dan unit/integration tests.
- **Tahap B — visual polish:** layout landscape/portrait, frame, typography, logo fallback, responsive modal, dan visual QA.

Jangan menyatakan fitur selesai hanya karena PDF berhasil dibuat; status selesai baru boleh diberikan setelah file PDF nyata lulus dua halaman dengan orientasi campuran dan nilai server yang benar.

---

## 5. Rencana Aksi Revisi Komprehensif (Solusi Poin 1 s.d. 9)

### Status: REVISED & SIAP DIEKSEKUSI BERTAHAP

Berdasarkan review di atas, seluruh 9 celah teknis diakomodasi ke dalam arsitektur implementasi terperinci berikut:

### Solusi Teknis Per Poin Review:

| No | Poin Review | Arsitektur Solusi & Implementasi Teknis |
|---|---|---|
| **1** | **Engine ekspor terhubung ke UI** | - Tag `<script src="./vendor/html2pdf.bundle.min.js"></script>` ditambahkan ke `src/index.html`.<br>- Fungsi `exportCertificateToPdf()` diimplementasikan di `src/app.js` menggantikan `window.print()`.<br>- Indikator loading interaktif pada tombol: *"⏳ Mengenerate PDF 2 Halaman (Landscape & Portrait)..."*, tombol didisable saat proses berlangsung. |
| **2** | **Mixed orientation teruji pada file PDF nyata** | - Halaman 1 disematkan sebagai **Landscape A4 (`297 × 210 mm` / `841.89 × 595.28 pt`)**.<br>- Halaman 2 disematkan sebagai **Portrait A4 (`210 × 297 mm` / `595.28 × 841.89 pt`)**.<br>- Uji Playwright membaca binary stream PDF nyata untuk memvalidasi `/MediaBox` kedua halaman dan memastikan tepat 2 halaman tanpa overflow. |
| **3** | **Ukuran render fixed A4 (Isolated Sandbox Surface)** | - Render canvas tidak mengambil elemen modal yang fleksibel.<br>- Dibuat off-screen container terisolasi: `#cert-render-sandbox` dengan ukuran tetap standar A4 96 DPI:<br>  • Surface 1 (Landscape): `1123px × 794px`<br>  • Surface 2 (Portrait): `794px × 1123px`<br>- Canvas diekspor dengan `scale: 2` untuk menghasilkan resolusi retina 300 DPI yang tajam dan bebas pengaruh resolusi layar browser pengguna. |
| **4** | **CORS deterministik & Aset Lokal** | - Logo Ruangguru dan UOB disalin/disimpan secara lokal ke `src/assets/logos/` (serta disediakan format inline Base64 / SVG fallback).<br>- Tidak bergantung pada CDN Wikimedia saat render canvas.<br>- Ditambahkan error listener fallback teks SVG jika aset gambar gagal termuat. |
| **5** | **Source of truth nilai & status server-first** | - Mengeliminasi fallback otomatis skor `100` pada kuis yang belum dijawab.<br>- Nilai kuis diambil strictly dari `state.quizScores.get(q.id)` (termasuk nilai 0 jika 3x gagal).<br>- Definisi kelulusan komprehensif (`evaluateStudentEligibility()`): seluruh materi tuntas (`unlockedStepIndex >= courseData.length`), seluruh pop-up quiz tersubmit, dan passing grade akurasi terpenuhi. |
| **6** | **Eligibility guard terpusat (Bukan hanya UI lock)** | - Fungsi `canIssueCertificate()` memvalidasi syarat kelulusan secara terpusat sebelum modal dibuka atau fungsi ekspor dipanggil.<br>- Jika siswa belum lulus, ekspor ditolak dengan dialog detail materi/kuis yang masih kurang.<br>- **Admin Bypass Mode**: Jika Admin UOB membuka pratinjau sertifikat siswa yang belum lulus, sertifikat otomatis diberi watermark tebal: **`[PRATINJAU DOKUMEN / CONTOH VERIFIKASI ADMIN]`** pada dokumen dan file PDF. |
| **7** | **Kebijakan nomor seri & tanggal resmi** | - Format nomor seri standar UOB MDS: `UOB-MDS-[JENJANG]-[TAHUN]-[HASH_DETERMINISTIK]`.<br>- Tanggal kelulusan menggunakan `completionDate` aktual siswa saat menyelesaikan materi terakhir, bukan tanggal sistem saat tombol ditekan.<br>- Sanitasi nama siswa untuk nama file PDF: `Sertifikat_UOB_MDS_[JENJANG]_[NAMA_SANITIZED].pdf`. |
| **8** | **Pemisahan jalur PDF export & Browser print** | - Tombol utama modal: `📄 Unduh Sertifikat & Transkrip (PDF A4)`.<br>- Tombol sekunder: `🖨️ Cetak Browser (Fallback)`.<br>- CSS `@media print` diperbarui dengan aturan `@page cert-landscape` dan `@page transcript-portrait` sebagai pelindung fallback. |
| **9** | **QA visual & data otomatis pasca-implementasi** | - Skrip Playwright komprehensif (`scratch/test_certificate_pdf_export.py`):<br>  1. Validasi status locked & guard eligibility.<br>  2. Validasi nilai kuis campuran (100, 50, 0) tertera jujur pada transkrip.<br>  3. Validasi 36 baris SMA/SMP dan 22 baris SD pas dalam 1 halaman Portrait A4 tanpa tumpah ke halaman 3.<br>  4. Validasi binary PDF: tepat 2 halaman, rasio mixed orientation tepat, nama sanitasi benar. |

---

### Roadmap Eksekusi 2 Tahap:

#### Tahap A: Engine PDF & Kontrak Data Server-First
1. Lokalisasi aset vendor `html2pdf.bundle.min.js` di `src/vendor/` dan tautkan di `src/index.html`.
2. Lokalisasi aset logo Ruangguru dan UOB di `src/assets/logos/` (bebas CORS).
3. Implementasi generator surface sandbox A4 fixed (`1123 × 794 px` landscape & `794 × 1123 px` portrait).
4. Pembuatan fungsi kontrak kelulusan terpusat `evaluateStudentEligibility()`, penomoran seri, tanggal completion, dan sanitasi skor aktual (tanpa default 100).
5. Implementasi fungsi ekspor PDF multi-orientasi `exportCertificateToPdf()`.
6. Eksekusi test otomatis Playwright tahap A untuk memvalidasi binary PDF 2 halaman.

#### Tahap B: Visual Polish, Skeuomorphism & Final QA
1. Redesain visual Sertifikat Halaman 1 (Landscape A4): bingkai regalia ganda emas & navy, aksen sudut, watermark guilloche, tipografi nama tanpa hyperlink underline, dan segel emas 3D embossed.
2. Redesain visual Transkrip Halaman 2 (Portrait A4): tabel 36 baris rapat presisi, header resmi, matriks 4 kompetensi komputasi, dan tanda tangan resmi entitas UOB My Digital Space.
3. Integrasi tombol modal sertifikat (tombol unduh PDF utama + tombol print sekunder) dan watermark Admin Preview.
4. Final automated QA & manual visual screenshot verification.
