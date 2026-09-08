# Audit Kesesuaian Subproject 1 & 2

Tanggal: 2026-09-08  
Status: **Audit awal selesai — temuan belum diperbaiki.**

## Ringkasan eksekutif

Implementasi saat ini sudah memiliki banyak bahan teknis, tetapi belum konsisten dengan arahan terakhir: **Subproject 1 seharusnya menjadi wadah LMS terlebih dahulu, sedangkan Subproject 2 masih harus berada pada tahap review sequencing rinci dan persetujuan sebelum dataset produksi dikunci.**

Temuan terbesar bukan sekadar kosmetik:

1. Kontrak progress frontend–Apps Script tidak cocok, sehingga klaim server-first sync belum terbukti bekerja.
2. Platform mencampur `type` aktivitas (`video`, `project`, `slide`) dengan tipe media; ini bertentangan dengan PRD terbaru.
3. Semua langkah yang tidak punya slide tetap mendapat fallback iframe `bridge-hs-00` atau `bridge-ms-00`.
4. Dataset SD masih placeholder tetapi sudah memuat rancangan materi dan hanya satu kuis; belum siap disebut kurikulum siap LMS.
5. Banyak unit video tidak memiliki batas waktu lengkap; ini memang sudah dicatat audit timing, tetapi belum diberi status `review_required` di dataset/platform.
6. Pekerjaan Subproject 2 sudah melampaui status “review dulu”: dataset, bridge slide, dan payload spreadsheet sudah dibuat sebelum jalur sequencing dinyatakan disetujui.
7. Repo Subproject 1 tidak benar-benar berupa Vue 3/Vite seperti PROJECT.md/PRD; yang ada adalah vanilla static web app.

## Klasifikasi

- **P0 — memblokir validasi:** integrasi progress sheet, render media yang salah, batas timestamp tidak terjaga.
- **P1 — tidak sesuai scope/kontrak:** pemisahan aktivitas-media, status dataset, implementasi stack, data SD.
- **P2 — kualitas dan tata kelola:** sinkronisasi file, dokumentasi status, keamanan admin, payload spreadsheet.

## Temuan detail

### P0-01 — Server-first sync tidak kompatibel dengan response Apps Script

**Bukti:**

- Frontend membaca `res.data.submittedQuizIds` di `subprojects/01-lms-platform/src/app.js:956–967`.
- Backend mengembalikan `{ success: true, progress: progressMap }` di `subprojects/01-lms-platform/apps-script/Code.gs:264–294`.
- Backend hanya mengembalikan map kolom skor, bukan daftar `submittedQuizIds`.

**Dampak:** progres yang tersimpan di Sheet tidak pernah dipulihkan ke Set kuis frontend melalui jalur yang sekarang. Klaim “server-first sync” belum terpenuhi.

**Perbaikan yang dibutuhkan:** sepakati satu kontrak response; idealnya backend mengembalikan `submittedQuizIds`, skor, dan metadata siswa secara eksplisit, lalu tambahkan test login → get_progress → gate.

### P0-02 — Slide fallback global membuat materi salah tampil

**Bukti:** `app.js:1097–1099` memakai `step.slideUrl ||` fallback ke `bridge-hs-00.html` atau `bridge-ms-00.html`.

**Dampak:** setiap langkah video/project tanpa `slideUrl` tetap bisa membuka bridge slide yang tidak terkait. Ini membuat siswa melihat materi salah dan menyamarkan gap konten.

**Perbaikan yang dibutuhkan:** tidak ada fallback lintas langkah. Jika `slideUrl` kosong, viewer harus menampilkan “belum ada slide” dan tidak menampilkan bridge lain.

### P0-03 — Batas video tidak dijaga penuh

**Bukti:**

- Dataset SMA memiliki unit dengan `startSeconds`/`endSeconds` kosong, termasuk `hs-2-1` sampai `hs-2-6`; beberapa hanya memiliki start atau end.
- Dataset SMP memiliki `ms-0-0`, `ms-2-6`, dan `ms-5-3` dengan batas tidak lengkap.
- Player mengubah nilai kosong menjadi `0` di `app.js:1249`, memakai durasi video penuh pada seek bar (`app.js:1300–1307`), dan tidak meng-clamp seek/bookmark ke rentang unit.

**Dampak:** siswa dapat melihat filler di luar segmen kurasi; nilai “unknown” berubah menjadi perilaku runtime seolah-olah mulai dari 0 atau berjalan sampai akhir.

**Perbaikan yang dibutuhkan:** pertahankan unknown sebagai unknown, disable playback untuk unit yang belum tervalidasi atau tampilkan status review, clamp start/end/bookmark/seek, dan buat laporan timestamp out-of-range.

### P1-01 — Aktivitas dan media masih tercampur

**Bukti:** PRD menetapkan jenis media dipisahkan dari jenis aktivitas. Dataset memakai `type` untuk `video`, `slide`, dan `project`; frontend memakai field yang sama untuk memilih media di `app.js:1090–1107`.

**Dampak:** `project` otomatis diperlakukan sebagai video, sementara aktivitas project seharusnya dapat memakai video atau HTML slides secara independen.

**Perbaikan yang dibutuhkan:** gunakan field terpisah, misalnya `activityType: lesson|project` dan `media: { type: video|slides, ... }`, atau kontrak kompatibilitas yang jelas dan tervalidasi.

### P1-02 — Subproject 1 bukan Vue 3/Vite seperti kontrak proyek

**Bukti:** tidak ada `package.json`, `vite.config`, atau file `.vue`; implementasi berupa `src/index.html`, `src/styles.css`, `src/app.js` dan disalin ke `docs/`.

**Dampak:** deliverable aktual tidak sesuai dengan PROJECT.md yang menyebut Vue 3/Vite. Ini bukan otomatis salah bila keputusan stack diubah, tetapi perubahan tersebut belum dinyatakan atau disetujui.

**Perbaikan yang dibutuhkan:** pilih salah satu: (a) revisi PROJECT.md/PRD menjadi static vanilla app, atau (b) migrasikan wadah ke stack yang dijanjikan. Jangan menyebut Vue/Vite jika belum ada.

### P1-03 — Subproject 2 sudah diperlakukan sebagai produksi sebelum approval sequencing

**Bukti:** `subprojects/02-curriculum-sequencing/STATE.md` menyebut overhaul bridge selesai dan dataset telah diekspor, sedangkan `mapping/review-tahap-1-smp-sma.md` tegas menyatakan perubahan dataset produksi belum menjadi persetujuan.

**Dampak:** status dokumen saling bertentangan. Bridge/data bisa dianggap materi final padahal masih usulan kurikulum.

**Perbaikan yang dibutuhkan:** pisahkan `draft`, `review_required`, dan `approved`; jangan injeksikan draft ke data LMS default sebelum user menyetujui sequencing.

### P1-04 — SD belum memenuhi definisi “template siap pakai” maupun kurikulum lengkap

**Bukti:** `courseData-upperprimary.json` memiliki 8 langkah, 7 tanpa video/slide, hanya 1 kuis, tanpa bookmark dan tanpa rangkuman terstruktur.

**Dampak:** portal dapat menampilkan materi SD yang terlihat seperti kurikulum aktif, padahal mayoritas masih placeholder/rancangan.

**Perbaikan yang dibutuhkan:** tandai SD sebagai `isPlaceholder` di UI, blokir akses materi kosong, atau lengkapi kontrak tiap langkah minimal dengan tujuan, media/status, rangkuman, aktivitas, dan completion rule.

### P1-05 — HTML slides yang dibuat belum terhubung sebagai unit kurikulum secara benar

**Bukti:** hanya `hs-0-0`, `ms-0-0`, dan `ms-0-4` memiliki `slideUrl`. `bridge-hs-01.json` dan `bridge-ms-01.json` tersedia, tetapi belum menjadi langkah yang terhubung dengan `slideUrl` di dataset.

**Dampak:** artefak bridge yang disebut sudah selesai belum benar-benar menjadi jalur belajar di LMS.

**Perbaikan yang dibutuhkan:** setiap bridge yang disetujui harus punya step ID, posisi sequencing, media URL, bookmark slide, rangkuman, dan status publikasi.

### P2-01 — Payload spreadsheet belum menjadi tab materi yang terhubung ke backend

**Bukti:** ada `output/curriculum_sheet_payload.json` dan script generator, tetapi generator memakai path relatif `projects/uob-async-lms/...`, yang tidak cocok bila dijalankan dari direktori project saat ini. `Code.gs` hanya mengelola `ops-student-data` dan result sheets; tidak ada endpoint publikasi/serving tab materi SD/SMP/SMA.

**Dampak:** file payload belum membuktikan bahwa tab materi telah dibuat atau dipakai aplikasi.

**Perbaikan yang dibutuhkan:** tetapkan apakah Sheet adalah source of truth materi atau hanya laporan; buat schema tab dan endpoint read/write yang eksplisit; uji dari URL deployed.

### P2-02 — Password admin hardcoded di frontend dan backend

**Bukti:** `KalanantiDihati` ada di `app.js:660–669` dan `Code.gs:155`.

**Dampak:** siapa pun yang mengunduh JavaScript dapat membaca password dan melewati modal frontend. Backend masih menjadi gate utama, tetapi password tetap terekspos.

**Perbaikan yang dibutuhkan:** hapus validasi password dari frontend; kirim ke backend melalui HTTPS; simpan secret di Script Properties, bukan source code; batasi akses admin berdasarkan allowlist email di backend.

### P2-03 — Login reguler masih memiliki fallback data lokal sebagai sumber validasi

**Bukti:** frontend mencocokkan email terhadap `ops-student-data.json` sebelum backend (`app.js` sekitar `attemptLogin`).

**Dampak:** data lokal bisa stale dan dapat dimodifikasi client-side. Ini berlawanan dengan tujuan memastikan data siswa berasal dari Sheet live.

**Perbaikan yang dibutuhkan:** gunakan backend sebagai sumber validasi; local JSON hanya untuk mode preview/dev yang jelas ditandai.

## Hal yang sudah sesuai atau sebagian sesuai

- Struktur dua subproject dan pemisahan `AGENTS.md`/`PROJECT.md`/`STATE.md` sudah ada.
- Folder sumber lama diperlakukan sebagai read-only secara kebijakan.
- Dataset HS/MS memelihara banyak `startSeconds`, `endSeconds`, bookmark, dan metadata kuis asli.
- Audit timing sudah mencatat 58 unit, 0 perbedaan otomatis, dan 12 unit dengan batas tidak lengkap; ini baik sebagai bukti audit, tetapi belum diterapkan sebagai guard pada runtime.
- `src/` dan `docs/` untuk file frontend utama saat ini identik byte-per-byte.
- Progress gate lokal berbasis `submittedQuizIds` sudah ada secara konsep; masalah utama ada pada kontrak sync server dan konsistensi ID.

## Prioritas kerja yang direkomendasikan

### Fase 0 — Bekukan klaim dan pisahkan draft

1. Tandai semua materi HS/MS/SD sebagai `draft` atau `review_required` sampai sequencing disetujui.
2. Nonaktifkan fallback bridge global.
3. Hapus data materi sample dari portal default, atau tampilkan hanya melalui mode preview/admin.

### Fase 1 — Betulkan kontrak wadah LMS

1. Putuskan kontrak media-aktivitas.
2. Betulkan response `get_progress` dan test Apps Script live.
3. Tegakkan timestamp unknown dan clamping.
4. Pastikan step slides/video/project dirender sesuai metadata masing-masing.

### Fase 2 — Audit dan persetujuan sequencing

1. Review per video: konsep, prasyarat, timestamp, kuis, dan gap.
2. User approve jalur HS/MS; jangan menganggap bridge selesai hanya karena file HTML sudah ada.
3. Rancang SD sebagai template yang jujur statusnya, bukan materi aktif kosong.

### Fase 3 — Publikasi kurikulum

1. Baru setelah approval, injeksikan JSON final ke LMS.
2. Buat tab materi SD/SMP/SMA di Sheet bila memang Sheet menjadi kebutuhan operasional.
3. Jalankan acceptance test login, media, kuis, progress, timestamp, dan reset server.

## Kesimpulan

Kekhawatiranmu valid: saat ini sistem **terlihat lebih selesai daripada keadaan sebenarnya**. Wadah LMS, draft kurikulum, bridge slides, fixture lokal, dan materi yang belum disetujui bercampur dalam jalur yang sama. Audit ini menyarankan kita mengembalikan batas kerja: **Subproject 1 dibersihkan menjadi shell/player yang tervalidasi; Subproject 2 kembali menjadi draft sequencing yang menunggu approval; materi final baru diinjeksikan setelah itu.**
