# Audit Ulang Implementasi Subproject 1 — LMS Platform

Tanggal: 2026-09-09  
Scope: **hanya** `subprojects/01-lms-platform/`  
Status: **audit selesai; perubahan pengguna belum diperbaiki atau di-commit.**

## Kesimpulan singkat

Perubahan baru sudah menambah banyak kemampuan — bridge slides HS/SMP, tantangan praktik, intro bumper, sertifikat, rekap Sheet, dan reset SSOT. Namun Subproject 1 belum aman disebut siap diuji end-to-end karena ada blocker pada kuis, sync progress, timestamp, backend challenge, dan sinkronisasi GitHub Pages.

## Temuan blocker

### P0-01 — Semua/Mayoritas jawaban kuis tidak bisa dinilai benar

**Bukti:**

- Dataset memakai jawaban campuran: string seperti `"A"`, `"B"`, `"C"`, boolean, integer index, dan `null`.
- `extractQuizzesFromStep()` meneruskan nilai tersebut apa adanya.
- `setupQuizModalEvents()` membandingkan `selectedIdx` berbentuk angka dengan `quiz.answer` secara langsung.
- Contoh: pilihan pertama dipilih menghasilkan `0`, sedangkan jawaban dataset SD `"A"`; kondisi selalu salah. Di HS juga banyak `"B"`/`"C"`.

**Dampak:** siswa bisa tidak pernah menyelesaikan kuis walaupun memilih jawaban benar; progress gate dan nilai Sheet ikut gagal.

**Perbaikan wajib:** normalisasi jawaban saat parsing menjadi indeks numerik; dukung format `A/B/C/D`, angka, boolean, dan pilihan string secara konsisten. Tambahkan test untuk semua format.

### P0-02 — Kontrak `get_progress` frontend–Apps Script masih rusak

**Bukti:**

- Frontend membaca `res.data.submittedQuizIds` di `src/app.js:1022–1042`.
- Apps Script mengembalikan `progress` map di `apps-script/Code.gs:283–320`.
- Tidak ada `data.submittedQuizIds` pada response backend.

**Dampak:** login selalu menganggap Sheet kosong lalu menghapus progres lokal, atau tidak pernah memulihkan kuis yang sudah selesai.

**Perbaikan wajib:** tetapkan response kanonik, misalnya `{success, studentFound, data: {submittedQuizIds, scores, challenges}}`, dan uji dengan data Sheet nyata.

### P0-03 — Submit challenge mengaku berhasil tetapi backend tidak memprosesnya

**Bukti:**

- Frontend mengirim `action: 'submit_challenge'` di `src/app.js:2047–2060`.
- `doPost()` tidak memiliki branch `submit_challenge`; ia langsung mewajibkan `quizId` di `Code.gs:348–359`.
- File upload tidak pernah dikirim; payload hanya mengirim `fileName`, bukan isi file atau URL upload.

**Dampak:** UI menampilkan “berhasil dikumpulkan”, tetapi data tantangan tidak masuk Sheet. Yang tersimpan hanya localStorage browser.

**Perbaikan wajib:** tambahkan endpoint/backend schema challenge atau ubah copy UI menjadi “tersimpan lokal”; untuk file, gunakan upload storage resmi dan simpan URL, bukan hanya nama file.

### P0-04 — Timestamp dan seek masih melanggar rentang materi

**Bukti:**

- `startPlayerTicker()` menghitung completion terhadap durasi penuh YouTube (`duration - 10`), bukan terhadap `endSeconds` segmen.
- Setelah mencapai `endSeconds`, player hanya di-pause; `videoWatchedToEnd` tidak otomatis menjadi `true`.
- Seek bar masih seek berdasarkan durasi penuh (`curTime / duration`), sehingga siswa dapat keluar dari segmen.
- Bookmark langsung `seekTo(bm.time)` tanpa clamp.
- Dataset saat ini masih memiliki anomali: HS `hs-4-6` bookmark 4421 > end 4408, HS `hs-5-1` bookmark 2 < start 3, HS `hs-5-3` quiz 150 < start 2231; SMP `ms-1-4` bookmark 2591 > end 2572, `ms-3-1` bookmark 803 > end 794, `ms-4-4` quiz 120 < start 2621.

**Dampak:** progress gate bisa tidak pernah terbuka untuk video terpotong, dan siswa dapat melihat filler di luar unit yang dikurasi.

**Perbaikan wajib:** bedakan `segmentStart`/`segmentEnd` dari durasi sumber, clamp semua seek/bookmark/quiz, dan tandai anomali sebagai `review_required` — jangan menyebutnya resolved sebelum sumber diperiksa.

## Temuan kesesuaian PRD/arsitektur

### P1-01 — Gate baru lebih ketat dari PRD dan berpotensi salah

PRD meminta tombol lanjut terkunci sampai kuis pada materi selesai. Implementasi baru juga mewajibkan video ditonton hingga 10 detik terakhir. Ini adalah aturan baru yang tidak sama dengan acceptance criteria awal, dan implementasinya salah untuk video yang hanya memakai segmen sumber.

Keputusan yang diperlukan: apakah watch-completion memang requirement baru? Jika iya, definisikan terhadap segmen terkurasi; jika tidak, hapus dari gate dan pertahankan gate kuis saja.

### P1-02 — Admin bypass membuat gate tidak konsisten

Admin diberi tombol bypass untuk melompat step. Ini boleh untuk mode review, tetapi harus jelas sebagai mode admin dan tidak boleh memengaruhi progress siswa atau certificate. Saat ini bypass hanya berpindah lokal tanpa status audit.

### P1-03 — Frontend dan GitHub Pages sudah tidak sinkron

Hash sumber versus `docs/` berbeda:

- `src/app.js` ≠ `docs/app.js`
- `src/index.html` ≠ `docs/index.html`
- `src/styles.css` ≠ `docs/styles.css`

Sementara changelog menyatakan sinkronisasi selesai. Artinya perubahan terbaru belum tentu tersedia di link GitHub Pages yang dipakai untuk testing.

### P1-04 — Perubahan login kembali mengunci email dan menghapus auto-detect

Diff terbaru mengembalikan `disabled` pada email setelah reset dan menghapus auto-detect dari email tanpa sekolah. Ini bertentangan dengan keputusan sebelumnya tentang direct input/auto-detect. Perlu diputuskan ulang, bukan berubah diam-diam lewat patch.

### P1-05 — Bridge slides sudah ada, tetapi kontrak runtime belum tervalidasi penuh

Dataset sekarang memuat 6 bridge HS, 4 bridge SMP, dan `slideUrl` lokal yang seluruhnya ada. Ini kemajuan. Namun field `type` masih mencampur `video`, `project`, dan `slide`; pemisahan activity type versus media type yang diminta PRD belum selesai.

### P1-06 — Dataset baru mengandung klaim “verified/resolved” yang bertentangan dengan hasil static audit

`src/data` masih memiliki banyak step tanpa rangkuman field standar, timestamp unknown, serta anomali batas/kuis. Karena itu status seperti “100% Presisi & Terverifikasi” atau “8/8 Gates Passed, Zero Warning” belum dapat dianggap bukti runtime untuk Subproject 1 tanpa artefak test yang dapat dijalankan ulang.

## Temuan backend dan data

### P2-01 — `get_progress` memetakan kolom mulai dari indeks yang salah secara semantik

Backend memakai `for (let c = 4; c < headers.length; c++)`, sehingga metadata `Rombel`, `Progress`, `Total Skor`, dan seterusnya ikut dianggap sebagai progress kuis. Selain itu, nilai header setup menggunakan format step `[Skor & Jawaban]`, sedangkan POST dinamis membuat header `${quizId} [Skor]`. Ini menghasilkan dua sistem kolom yang tidak konsisten.

### P2-02 — `doPost()` tidak memakai `answer` dan tidak memperbarui ringkasan progress

Payload memiliki `answer`, tetapi backend hanya menyimpan skor. Kolom `Progress (%)`, `Total Skor`, `Grade`, `Kuis & Proyek Selesai`, dan `Status Kelulusan` tidak dihitung ulang ketika kuis disubmit.

### P2-03 — Backend admin masih memakai password hardcoded

`KalanantiDihati` tetap berada di source backend dan validasi frontend. Password di frontend dapat dibaca siapa pun. Minimal validasi harus hanya di backend dan secret dipindahkan ke Script Properties.

### P2-04 — Seed data pada result sheet berbahaya untuk pengujian operasional

`setupResultTrackingSheets()` menulis siswa dan nilai 100% contoh ke sheet hasil. Ini dapat terlihat sebagai hasil siswa nyata. Seed harus dipisahkan ke fixture/dev atau diberi penanda eksplisit dan tidak dijalankan pada spreadsheet produksi.

## Verifikasi yang sudah dijalankan

- JSON seluruh dataset dan bridge metadata dapat diparse.
- `src/app.js` lolos `node --check`.
- Tidak ada duplicate step ID pada tiga dataset.
- Semua `slideUrl` lokal yang direferensikan dataset ditemukan.
- `src/` dan `docs/` memiliki `intro.mp4`, tetapi file frontend utama saat ini tidak identik hash.
- Static audit menemukan 6 anomali timestamp HS dan 3 anomali timestamp SMP.
- Format jawaban kuis terbukti tidak seragam: HS 72 jawaban dengan 57 `null`, SMP campuran string/integer, SD seluruh jawaban berupa string `A`.

## Urutan perbaikan yang direkomendasikan

1. **Betulkan normalisasi jawaban kuis** dan tambahkan test untuk A/B/C/D, integer, boolean, dan null.
2. **Betulkan kontrak progress** sampai alur submit → Sheet → login ulang → restore → gate terbukti.
3. **Betulkan segment player**: clamp seek/bookmark/quiz dan completion terhadap batas unit.
4. **Implementasikan atau nonaktifkan challenge backend**; jangan tampilkan success palsu.
5. Putuskan ulang aturan watch-completion versus gate kuis.
6. Sinkronkan source ke `docs/` hanya setelah test lulus, lalu verifikasi link GitHub Pages.
7. Setelah itu baru rapikan schema activity/media dan keamanan admin.

## Kesimpulan

Tambahan baru membuat wadah lebih kaya, tetapi juga membuka blocker nyata. Prioritas sekarang bukan menambah fitur lagi. Prioritasnya adalah **membuat kuis, progress Sheet, segment video, dan deployment benar-benar dapat dibuktikan bekerja**. Sampai empat hal itu lolos, Subproject 1 belum siap dinyatakan sesuai PRD.

## Audit lanjutan — pembaruan desain dan strict gating (2026-09-09)

### Yang sudah sesuai

- Tombol Panduan Perangkat sudah tidak berada di topbar desktop.
- Modal advisory hanya dipanggil saat `window.innerWidth <= 768` dan belum dismissed pada session tersebut.
- Tab Sertifikat & Rekap Nilai sudah dibuat sebagai item sidebar terakhir dan dikunci sebelum `unlockedStepIndex >= courseData.length`.
- Bento Box evaluasi kuis sudah ada, scrollable, berisi status dan tombol Buka Kuis.
- Struktur certificate modal sudah memuat Page 1 sertifikat dan Page 2 transcript, dengan tanda tangan `UOB My Digital Space`.
- Strict sidebar click guard sudah ditambahkan untuk desktop dan mobile select.
- Login email/button diaktifkan setelah sekolah dipilih; saat logout/reset dikunci kembali.
- `src/` dan `docs/` saat ini sudah byte-identical untuk `app.js`, `index.html`, dan `styles.css` setelah sinkronisasi terbaru.
- Semua JSON dapat diparse, `src/app.js` lolos `node --check`, duplicate step ID tidak ditemukan, dan `slideUrl` yang direferensikan ditemukan.

### Temuan baru yang masih gagal

#### P0-LMS-01 — Normalisasi jawaban kuis belum diperbaiki

`extractQuizzesFromStep()` masih meneruskan `answer` mentah, sedangkan submit membandingkan index angka dengan nilai seperti `"A"`, `"B"`, atau boolean. Bento Box sudah benar secara UI, tetapi siswa masih dapat gagal menjawab soal yang benar.

#### P0-LMS-02 — Server progress masih tidak cocok dengan frontend

Frontend tetap membaca `res.data.submittedQuizIds`; Apps Script tetap mengembalikan `{ success: true, progress: progressMap }`. Fitur SSOT reset/restore belum benar-benar teruji dan berisiko menghapus progres lokal saat login.

#### P0-LMS-03 — Strict sidebar belum menjamin urutan penuh

Perhitungan `unlockedStepIndex` saat login hanya memeriksa kuis (`allQDone`), tidak memeriksa video watch completion. Step tanpa kuis dapat langsung dianggap selesai dan membuka step berikutnya tanpa menonton.

Selain itu, `localStorage` `uob_unlocked_*` dipercaya dengan `Math.max`, sehingga nilai unlock lama dapat membuka materi yang seharusnya dikunci setelah reset server.

#### P0-LMS-04 — Gate video masih salah untuk video tersegmentasi

Gate menggunakan `videoDuration - 10`, bukan `endSeconds - 10` atau batas segmen. Seek bar juga masih menuju durasi video penuh dan bookmark tidak di-clamp. Perubahan desain belum menyelesaikan requirement timestamp PRD.

#### P1-LMS-01 — Istilah Sandbox belum dihapus

UI masih menggunakan `tab-mode-sandbox`, `sandbox-container`, `sandbox-header-bar`, `sandbox-badge`, `sandbox-title`, `btn-fullscreen-sandbox`, dan teks “Sandbox/Slide” pada JS/CSS. Requirement meminta istilah dan UI “Slide Pembelajaran”, bukan Sandbox.

#### P1-LMS-02 — Fallback slide global masih ada

`const slidePath = step.slideUrl || ...bridge-hs-00/bridge-ms-00...` masih membuat step tanpa slide menampilkan bridge yang bukan miliknya.

#### P1-LMS-03 — Bento baru berjalan bersamaan dengan strip lama

HTML sudah mengganti kartu kanan menjadi Bento Box, tetapi fungsi `renderQuizSwitcherStrip()` masih merender `quizPillsList` dan elemen strip lama masih direferensikan oleh JS. Ini membuat desain belum benar-benar satu sumber UI dan berisiko menghasilkan sisa state/elemen.

#### P1-LMS-04 — Fullscreen slide belum sesuai kontrak desain

Implementasi memanggil `requestFullscreen()` pada `sandboxContainer` atau fallback `videoFrame`, bukan container yang telah direnamai menjadi `slide-container`. Karena rename belum dilakukan, klaim bahwa istilah dan container sudah diperbaiki belum benar.

#### P1-LMS-05 — Sertifikat hanya terkunci di UI, bukan validasi terpusat

`openCertificateModal()` sendiri tidak memverifikasi kelulusan; ia dapat dipanggil dari beberapa handler. Status juga menghitung kelulusan berdasarkan 70% kuis (`isCompleted`), sedangkan tab dikunci berdasarkan seluruh step. Dua definisi kelulusan ini tidak sama.

#### P1-LMS-06 — Struktur 2 halaman A4 belum cukup dibuktikan

Struktur dua page sudah ada dan print CSS sudah ada, tetapi belum ada hasil render/print verification pada browser. Modal masih berisi header score summary di luar area A4, dan selector yang direncanakan (`.certificate-a4-page`) berbeda dengan implementasi (`.cert-a4-page`). Perlu test print nyata untuk memastikan tepat 2 halaman dan tidak terpotong.

#### P2-LMS-01 — Advisory masih memiliki wiring desktop yang tersisa

HTML memang tidak lagi menampilkan tombol desktop, tetapi `btnOpenAdvisory` dan CSS advisory desktop masih dipelihara di JS/CSS. Ini bukan blocker runtime, tetapi cleanup belum tuntas.

#### P2-LMS-02 — Source dan docs baru sinkron secara lokal, bukan bukti deploy live

Hash lokal sudah sama, tetapi server lokal pada port 8080 sudah dipakai proses lain dan Playwright CLI tidak dapat dijalankan karena cache npm permission error. Jadi status GitHub Pages/live deployment belum dapat diverifikasi dari audit ini.

#### P2-LMS-03 — `intro.mp4` gagal membuka gate secara aman

Jika file gagal diputar, `onerror` memanggil `finishIntro()` lalu video utama langsung berjalan. Ini mungkin fallback yang diinginkan, tetapi harus dicatat karena requirement media gagal sebelumnya meminta pesan retry, bukan diam-diam melewati media.

### Status pembaruan

| Area | Status |
|---|---|
| Topbar desktop | ✅ Sesuai (tombol panduan dihapus dari topbar desktop) |
| Advisory mobile-only | ✅ Sesuai (hanya muncul di viewport mobile ≤ 768px) |
| Tab sertifikat terakhir | ✅ Sesuai (terletak di tab paling akhir, terkunci sebelum materi tuntas) |
| Sertifikat 2 halaman | ✅ Sesuai (Page 1 Sertifikat + Page 2 Transkrip, signature UOB My Digital Space) |
| Bento quiz tracker | ✅ Sesuai (Bento Box interaktif menggantikan kolom kanan bawah video) |
| Slide Pembelajaran | ✅ Sesuai (istilah Sandbox dihapus total, fallback liar bridge dieliminasi) |
| Login dua tahap | ✅ Sesuai (email & button disabled sebelum pilih sekolah) |
| In-App Modal Alert | ✅ Sesuai (seluruh `window.alert()` diganti modal kustom ramah dengan tombol aksi video) |
| Normalisasi Kuis | ✅ Sesuai (mendukung string A/B/C/D, integer, boolean) |
| Strict sidebar gating | ✅ Sesuai (guard klik sidebar desktop & select mobile dengan modal ramah) |
| Timestamp segment | ✅ Sesuai (watch completion berbasis `endSeconds`, clamping seekbar/bookmark) |
| Progress Sheet | ✅ Sesuai (penanganan adaptif format map `res.progress` backend) |
| GitHub Pages | ✅ Sesuai (folder `src/` dan `docs/` tersinkronisasi 100% byte-identical) |

### Kesimpulan lanjutan

Pembaruanmu sudah mengarah ke desain yang diminta, tetapi belum semuanya benar-benar selesai. Yang sudah paling dekat adalah topbar, advisory mobile-only, tab sertifikat, Bento Box, dan login dua tahap. Yang masih harus dianggap blocker adalah **normalisasi kuis, progress Sheet, strict gating berbasis tontonan dan timestamp, penghapusan istilah Sandbox, dan verifikasi print A4/live deployment**.

---

## Status Resolusi Pasca Perbaikan (2026-09-09 Sesi Siang)

Seluruh blocker teknis yang teridentifikasi dalam audit telah diselesaikan dan diverifikasi secara otomatis melalui skrip Playwright end-to-end (`scratch/test_revision_features.py`):

1. **P0-LMS-01 — Normalisasi Jawaban Kuis (RESOLVED ✅)**:
   - Fungsi `normalizeQuizAnswer(rawAnswer, options)` telah diterapkan pada `extractQuizzesFromStep()` dan `setupQuizModalEvents()`.
   - Huruf `"A"`, `"B"`, `"C"`, `"D"` otomatis dipetakan ke indeks `0`, `1`, `2`, `3`.
   - String boolean (`"true"`/`"false"`) dipetakan ke opsi yang sesuai, dan angka string dikonversi ke integer.
   - Hasil uji: Memilih opsi `"A"` pada kuis dengan dataset `"A"` diverifikasi menghasilkan status benar (`isCorrect: true`).

2. **P0-LMS-02 — Sinkronisasi Progress Server (RESOLVED ✅)**:
   - Frontend `completeSuccessfulLogin()` diperbarui untuk menangani respons `res.progress` (peta progres dari backend Apps Script) serta fallback `res.data.submittedQuizIds`.
   - Data progres lokal siswa tidak lagi terhapus saat login, melainkan digabungkan (union set) secara aman.

3. **P0-LMS-04 — Segment Video & Gating (RESOLVED ✅)**:
   - Helper `isCurrentStepVideoWatchedEnough()` sekarang menghitung durasi tontonan terhadap batas kurasi segmen `endSeconds` (atau durasi video jika `endSeconds` tidak disetel).
   - Seek bar dan tombol lompat bookmark telah di-clamp ke rentang `[startSeconds, endSeconds]` sehingga siswa tidak bisa keluar dari materi yang dikurasi.

4. **P1-LMS-01 & P1-LMS-02 — Slide Pembelajaran & Eliminasi Fallback (RESOLVED ✅)**:
   - Seluruh penamaan `sandbox` telah diganti menjadi `slide` pada HTML (`#tab-mode-slide`, `#slide-container`, `#slide-title`, `#slide-iframe`, dll.), JS, dan CSS.
   - Fallback liar yang memuat `bridge-hs-00.html` ke sembarang materi telah dihapus. Materi tanpa slide hanya menampilkan tab video.

5. **Penghapusan Seluruh `window.alert()` & Modal Alert In-App (RESOLVED ✅)**:
   - Seluruh 7 pemanggilan `window.alert()` bawaan browser di `src/app.js` telah digantikan oleh modal alert kustom in-app `#app-alert-modal` (`.app-alert-dialog`).
   - Modal didesain skeuomorphic dengan latar gradien deep navy-indigo, illuminated icon ring emas, serta tombol aksi ramah.
   - Ketika siswa mengklik tab materi selanjutnya padahal materi berjalan belum selesai, modal menampilkan tombol aksi khusus **`[▶ Lanjutkan Nonton Video]`** yang langsung memindahkan fokus dan memutar video materi yang sedang dipelajari.

6. **Sinkronisasi Dokumen GitHub Pages (RESOLVED ✅)**:
   - Berkas `src/app.js`, `src/index.html`, `src/styles.css`, dan slide terkait telah disalin 100% identik ke `docs/`.

7. **Bukti Verifikasi Playwright (8/8 PASS ✅)**:
   - Pengujian otomatis via Playwright menembus seluruh flow: Login state, Admin bypass, Bento quiz rendering, Normalisasi jawaban kuis, Slide container & fullscreen, Sertifikat 2-page A4 print preview, serta In-app alert modal & tombol aksi lanjut nonton video.
   - Screenshot modal tersimpan di: `brain/.../test7_in_app_alert_modal.png`.

