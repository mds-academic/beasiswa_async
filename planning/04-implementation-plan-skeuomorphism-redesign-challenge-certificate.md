# Implementation Plan: Skeuomorphism Redesign, Mobile Advisory, Optional Challenges, Certificate & Server-First Sync

Dokumen rencana implementasi ini merinci transformasi visual dan logika platform LMS **UOB My Digital Space** berdasarkan 5 poin arahan terbaru dari pengguna.

---

## 1. Ringkasan Kebutuhan & Solusi Arsitektur

| No | Poin Kebutuhan | Solusi Arsitektur & Implementasi |
|---|---|---|
| **3** | **Mobile Video Layout & Alert Modal Pengalaman Belajar** | - Responsivitas penuh pada kontainer video 16:9, strip tracker, dan kontrol bar dengan touch target minimal 44x44px.<br>- Modal dialog otomatis saat dibuka di mobile (`viewport width <= 768px`) dengan bahasa sopan dan ramah merekomendasikan Laptop/Tablet untuk kenyamanan koding dan layar lega.<br>- Tombol dismiss *"Mengerti, Tetap Belajar di HP Ini"* dengan penyimpanan session. |
| **4** | **Redesign Skeuomorphism & Penggantian Font (Buang Fredoka)** | - Menghilangkan kesan *"AI Slop"* (flat neo-brutalisme generik) dan mengganti font kartun `Fredoka` menjadi **Plus Jakarta Sans** (Heading berkarakter premium & modern tech) dan **Inter** (Body text tajam & nyaman dibaca).<br>- Tampilan **Skeuomorphic Realistis**: Panel fisik beveled, tombol fisik bertingkat (top-light highlight, gradient permukaan, tactile active state, deep drop-shadow), bezel player perangkat nyata, indikator LED menyala, dan aksen logam/akrilik tactile. |
| **5** | **Mini Project sebagai Challenge Opsional (Bisa Di-skip)** | - Mini project tidak lagi memblokir navigasi modul (*non-gating*). Siswa bebas melewatinya kapan saja.<br>- Disediakan kartu **Tantangan Praktik Mandiri (Challenge)** dengan form pengumpulan tugas sesuai jenjang:<br>  • **SMA**: Input kode langsung di Mini IDE interaktif atau link Google Colab / GitHub.<br>  • **SMP**: Input link MIT App Inventor Gallery / Drive atau upload file `.aia` / `.apk`.<br>  • **SD**: Input link proyek Scratch atau upload file `.sb3`.<br>- Hasil pengumpulan challenge dicatat ke backend & progres siswa. |
| **6** | **Score Report & Sertifikat Kelulusan Digital Resmi** | - Pada materi terakhir / penyelesaian misi (atau tombol rekap khusus):<br>  • **Score Report**: Akurasi jawaban kuis pop-up, jumlah kuis selesai, dan status challenge mandiri yang dikumpulkan.<br>  • **Sertifikat Kelulusan Resmi Digital**: Desain skeuomorphic premium berlatar navy/emas resmi (UOB MDS x Ruangguru/Kalananti), mencantumkan nama siswa, sekolah, rombel, jenjang, nomor seri unik, stempel emas timbul (*embossed gold seal*), dan tombol cetak/simpan PDF (`window.print()` dengan layout cetak bersih). |
| **7** | **Logika Sinkronisasi Server-First (Backend sebagai SSOT)** | - Backend Google Sheet menjadi **Single Source of Truth (SSOT)** mutlak.<br>- Saat login atau reload, aplikasi mengambil data langsung dari `action=get_progress`.<br>- **Jika data di sheet telah dihapus oleh admin**: Browser siswa secara otomatis **MENGOSONGKAN** `state.submittedQuizIds`, menghapus `localStorage`, dan mengembalikan progres siswa ke awal (Materi 01).<br>- `localStorage` hanya berfungsi sebagai cache lokal offline transient. |

---

## 2. Rincian Teknis & Perubahan Berkas

### A. Komponen UI & Visual ([`src/styles.css`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/src/styles.css))
1. **Pembaruan Typography**:
   - Ganti import font `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');`.
   - `--font-heading`: `'Plus Jakarta Sans', -apple-system, sans-serif`.
   - `--font-body`: `'Inter', -apple-system, sans-serif`.
   - `--font-code`: `'Fira Code', monospace`.
2. **Skeuomorphic Token & Styles**:
   - Panel & Card: `linear-gradient(180deg, #0d2868 0%, #081a44 100%)`, `box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.5)`, `border: 1px solid rgba(255,255,255,0.15)`.
   - Tombol Fisik Taktil (`.btn-skeuo`, `.video-center-play`, `.quiz-pill-btn`, `.btn-nav-step`):
     - Highlight tepi atas: `border-top: 1px solid rgba(255,255,255,0.4)`.
     - Permukaan 3D: Gradien halus cembung.
     - Shadow fisik berlapis: `box-shadow: 0 4px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)`.
     - Active press state: `transform: translateY(2px)`, `box-shadow: 0 1px 2px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.4)`.
3. **Modal Alert Mobile Device & Sertifikat Layout Print**:
   - Styling kartu modal rekomendasi laptop/tablet (`#advisory-modal`).
   - Styling template sertifikat skeuomorphic eksklusif (`#certificate-modal`).
   - Aturan `@media print` khusus agar saat user menekan cetak, hanya sertifikat yang tercetak dalam format landscape berkualitas tinggi.

---

### B. Struktur HTML ([`src/index.html`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/src/index.html))
1. **Modal Rekomendasi Perangkat (Mobile Advisory)**:
   - Teks panduan yang ramah dan tersusun rapi menjelaskan keunggulan membuka di laptop/tablet (layar lega, koding lebih nyaman).
   - Tombol: *"Mengerti, Tetap Belajar di HP Ini"*.
2. **Kartu Tantangan Praktik Mandiri (Optional Challenge)**:
   - Ditempatkan di bawah video player (bisa dibuka/ditutup).
   - Menampilkan formulir pengumpulan dinamis sesuai jenjang (`SMA`: Editor Kode Python + Link Colab; `SMP`: Link App Inventor Gallery + Upload file; `SD`: Link Scratch + Upload file).
   - Tombol *"Kirim Karya Tantangan"* & Tombol *"Lewati Tantangan & Lanjut"*.
3. **Modal Dialog Sertifikat & Score Report (`#certificate-modal`)**:
   - Score Report: Widget ringkasan kuis selesai, akurasi, dan challenge terkumpul.
   - Sertifikat Digital resmi UOB MDS x Kalananti dengan nama dinamis, tanggal dinamis, QR code/nomor seri verifikasi, dan tombol *"Cetak / Simpan PDF"*.

---

### C. Logika Aplikasi ([`src/app.js`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/src/app.js))
1. **Mobile Detection & Advisory Trigger**:
   - Cek `window.innerWidth <= 768` atau touch device saat login; jika belum pernah di-dismiss di session ini, buka `#advisory-modal`.
2. **Sinkronisasi Server-First (Backend SSOT)**:
   - Di `loadStudentSession()` / login:
     - Lakukan `fetch(action=get_progress)`.
     - Jika backend mengembalikan map kuis kosong / data siswa tidak ada di sheet:
       - **Kosongkan localStorage dan state lokal**.
       - Reset progres ke materi 0.
     - Jika backend mengembalikan kuis tersimpan:
       - Sinkronkan `state.submittedQuizIds`.
       - Perbarui cache `localStorage`.
3. **Logika Challenge Mandiri**:
   - Step challenge tidak membatasi tombol *"Materi Selanjutnya"*.
   - Saat siswa submit challenge, kirim payload ke Apps Script (`action: 'submitChallenge'`) dan simpan status lokal.
4. **Logika Sertifikat & Score Report**:
   - Hitung total kuis dari seluruh step di kurikulum aktif.
   - Tampilkan kalkulasi akurasi nilai dan daftar challenge yang sudah diselesaikan.
   - Injeksi nama siswa, sekolah, dan tanggal ke template sertifikat resmi.
   - Pemicu `window.print()` untuk cetak/simpan PDF.

---

### D. Backend Apps Script ([`apps-script/Code.gs`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/01-lms-platform/apps-script/Code.gs))
1. **Penyempurnaan `get_progress`**:
   - Mengembalikan array ID kuis yang telah selesai dan daftar submission challenge.
   - Mengembalikan flag `isReset: true` jika siswa tidak memiliki catatan di sheet agar frontend langsung menghapus cache browser.
2. **Penyimpanan Challenge Submission**:
   - Menerima submission kode / file / tautan challenge dan menyimpannya di sheet pelaporan atau tab `ops-challenges`.

---

## 3. Rencana Verifikasi & Pengujian

1. **Verifikasi Tampilan Mobile & Modal Advisory**:
   - Buka viewport mobile (`375x812` iPhone / `412x915` Android) menggunakan Playwright.
   - Pastikan modal alert perangkat muncul otomatis dengan susunan bahasa yang ramah.
   - Klik tombol dismiss dan pastikan navigasi modul tetap lancar.
2. **Verifikasi Gaya Skeuomorphism & Typography**:
   - Pastikan font Plus Jakarta Sans dan Inter ter-render tajam tanpa Fredoka.
   - Periksa efek tombol 3D taktil, beveling, shadow, dan responsivitas klik.
3. **Verifikasi Challenge Opsional**:
   - Buka step yang memiliki tugas/challenge.
   - Pastikan tombol *"Materi Selanjutnya"* tetap dapat dibuka (setelah kuis tuntas dan video ditonton s.d. 10 detik terakhir) tanpa mewajibkan challenge.
   - Uji coba form pengumpulan tugas challenge untuk jenjang SMA, SMP, dan SD.
4. **Verifikasi Score Report & Sertifikat**:
   - Tuntaskan materi hingga akhir, buka tampilan sertifikat dan score report.
   - Pastikan nama siswa, nama sekolah, nomor seri, dan tanggal terisi dengan tepat.
5. **Verifikasi SSOT Reset Backend**:
   - Simulasikan penghapusan data baris siswa di spreadsheet.
   - Reload browser siswa dan pastikan seluruh cache browser ter-reset bersih kembali ke awal.
6. **Git Commit & Remote Push**:
   - Sinkronkan `subprojects/01-lms-platform/src/` ke `docs/`.
   - Commit dan push ke `git@github.com:mds-academic/beasiswa_async.git` branch `main`.
