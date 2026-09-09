# Implementation Plan: Skeuomorphism Redesign, 2-Page A4 Certificate & Transcript, Bento Quiz Tracker, Slide View & Strict Gating

Dokumen rencana implementasi ini merinci transformasi visual dan logika platform LMS **UOB My Digital Space** berdasarkan arahan dan konfirmasi pengguna.

---

## 1. Ringkasan Kebutuhan & Solusi Arsitektur

| No | Poin Kebutuhan | Solusi Arsitektur & Implementasi |
|---|---|---|
| **1** | **Pembersihan Topbar Desktop (Hapus Panduan Perangkat)** | - Hapus tombol *"Panduan Perangkat"* dari topbar desktop.<br>- Modal dialog panduan perangkat hanya muncul otomatis saat diakses dari perangkat mobile (`viewport width <= 768px`) dengan opsi dismiss persistens. |
| **2** | **Sertifikat & Skor Hanya di Tab Terakhir Sidebar (Terkunci)** | - Hapus tombol sertifikat dari topbar dan profile dropdown.<br>- Tambahkan tab terakhir di sidebar: **`🎓 Sertifikat & Rekap Nilai`** berstatus terkunci (`🔒`).<br>- Tab ini hanya bisa dibuka setelah seluruh materi pembelajaran dan kuis selesai 100%. |
| **3** | **Dokumen Cetak 2 Halaman A4 Presisi & Tanda Tangan Resmi** | - Format cetak A4 2 halaman (`@media print` dengan `page-break-after: always`):<br>  • **Halaman 1**: Certificate of Completion berbingkai emas & navy resmi.<br>  • **Halaman 2**: Transkrip Nilai & Hasil Evaluasi Belajar (tabel rincian modul, pop-up kuis selesai, capaian skor, dan matriks 4 kompetensi komputasi).<br>- **Tanda Tangan Wajib**: **`UOB My Digital Space`** (*Academic Team & Organizing Committee*). Tidak menggunakan nama personal. |
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
4. **Dokumen 2 Halaman A4 & Print Rules**:
   - `.cert-a4-page` dengan `page-break-after: always; break-after: page;`.
   - Tabel transkrip akademik, badge capaian, dan matriks 4 kompetensi komputasi.
   - Aturan `@page { size: A4 portrait; margin: 10mm 12mm; }` untuk hasil cetak dan simpan PDF presisi.

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
5. **Populasi Data Sertifikat & Transkrip**:
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
