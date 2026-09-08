# Implementation Plan 01 — Scaffolding Kurikulum SMP–SMA

Tanggal: 2026-09-08  
Status: **completed (selesai diimplementasikan & diverifikasi)**  
Laporan QA: [Laporan QA Scaffolding](../drafts/qa/qa-scaffolding-report.md)  
Sumber utama: [Audit Ulang Scaffolding Materi SMP–SMA](../mapping/audit-ulang-scaffolding-2026-09-08.md)

## Tujuan

Mengubah hasil audit sequencing menjadi jalur belajar yang benar-benar dapat
dipakai oleh siswa pemula nol, tanpa mengubah folder materi lama dan tanpa
mengubah dataset produksi sebelum setiap fase lolos pemeriksaan.

Target akhir:

- SMA: Colab → output → variabel/tipe data → input → konversi tipe → kondisi
  → list/loop → function → dictionary → error handling → proyek.
- SMP: tur App Inventor → event/input-output/variabel → validasi → kondisi
  → procedures → debugging → TinyDB → proyek.
- Setiap bridge hadir sebagai step LMS yang eksplisit, dapat diselesaikan, dan
  memiliki tujuan, latihan, rangkuman, kuis, bookmark, serta bukti selesai.
- Timestamp sumber video tetap dipreservasi; anomali tidak ditebak atau
  diperbaiki diam-diam.

## Aturan kerja dan batasan

1. Folder lama di
   `/Users/yazidhilmi/Documents/cloud/Kalananti-cloud/Academic_Content/B2B/UOB/Async/`
   tetap read-only.
2. Dataset lama di `output/` tidak ditimpa selama fase desain dan produksi.
   Dataset hasil kerja dibuat sebagai file baru atau diletakkan di folder
   draft/versioned.
3. Jangan membuat timestamp baru untuk menggantikan `unknown` atau `99999`.
4. Setiap perubahan substansial dicatat di `HISTORY.md`, dan setiap fase
   menghasilkan checkpoint Git lokal.
5. Perubahan lintas Subproject 01 hanya dilakukan setelah dataset baru lolos
   validasi dan mendapat persetujuan sequencing.

## Strategi fase

| Fase | Fokus | Hasil utama | Gate sebelum lanjut |
|---|---|---|---|
| 0 | Baseline dan kontrak data | inventaris input, aturan validasi, matriks prasyarat | baseline reproducible |
| 1 | Finalisasi desain pedagogis | blueprint bridge dan jalur SMP–SMA | semua gap punya bekal dan bukti selesai |
| 2 | Produksi bridge SMA | 5 HTML bridge baru | setiap bridge dapat dibaca, dipraktikkan, dan diuji |
| 3 | Produksi bridge SMP | 3 HTML bridge baru + pemisahan TinyDB | TinyDB tidak lagi muncul sebelum waktunya |
| 4 | Dataset sequencing baru | JSON baru dengan bridge/prasyarat eksplisit | graph prasyarat tidak memiliki lompatan |
| 5 | Validasi teknis dan QA pembelajaran | laporan timestamp, quiz, tautan, dan smoke test | tidak ada blocker P0 |
| 6 | Pilot dan integrasi LMS | hasil pilot, revisi, paket siap Subproject 01 | disetujui untuk integrasi |

---

## Fase 0 — Baseline, kontrak, dan perlindungan sumber

### Tujuan

Membuat kondisi awal yang dapat dibandingkan dan memastikan implementasi baru
tidak mencampur draft dengan dataset produksi.

### Pekerjaan

1. Catat checksum atau snapshot nama file untuk:
   - `output/courseData-highschool.json`
   - `output/courseData-middleschool.json`
   - `output/courseData-upperprimary.json`
   - `slides/bridge-hs-00.html`
   - `slides/bridge-ms-00.html`
   - `slides/bridge-hs-01.json`
   - `slides/bridge-ms-01.json`
2. Buat struktur kerja baru:

   ```text
   drafts/
     bridge-html/
     sequencing-v1/
     qa/
   ```

3. Tetapkan kontrak metadata bridge:

   ```json
   {
     "id": "bridge-hs-01",
     "type": "slide",
     "slideUrl": "./slides/bridge-hs-01.html",
     "prerequisiteStepIds": ["bridge-hs-00"],
     "learningObjectives": [],
     "practice": {},
     "completionCriteria": {},
     "bookmarks": [],
     "quizzes": []
   }
   ```

4. Tetapkan kontrak status timestamp:
   - `verified`
   - `review_required`
   - `unknown`
   - `manual_checkpoint`

### Acceptance criteria

- Dataset produksi masih identik dengan baseline.
- Folder lama tidak memiliki perubahan.
- Kontrak metadata disepakati sebelum HTML dan JSON baru diproduksi.

---

## Fase 1 — Blueprint pedagogis dan keputusan editorial

### Tujuan

Mengunci isi tiap bridge sebelum menulis HTML, agar produksi tidak hanya
memindahkan judul tetapi benar-benar menutup prasyarat.

### Pekerjaan SMA

Buat blueprint untuk:

1. `bridge-hs-01`: variabel, tipe data, assignment, operator, `"10"` vs `10`.
2. `bridge-hs-02`: `input()` menghasilkan string, `int()`, perbandingan,
   boolean, indentasi.
3. `bridge-hs-03`: list, `for`, `range`, accumulator, tabel iterasi.
4. `bridge-hs-04`: `def`, parameter, pemanggilan, `return` vs `print`.
5. `bridge-hs-05`: key/value, dictionary, list of dictionaries, akses dan
   tambah record.

Setiap blueprint wajib memiliki: prasyarat, tujuan terukur, contoh benar,
contoh salah, latihan, kasus batas, kuis, rangkuman, dan bukti selesai.

### Pekerjaan SMP

Buat blueprint untuk:

1. `bridge-ms-01`: event, properti, `Button.Click`, `TextBox.Text`,
   `Label.Text`, join, variabel sementara.
2. `bridge-ms-02`: memori sementara vs persisten, tag/value,
   `StoreValue`, `GetValue`, default value, `ClearTag`.
3. `bridge-ms-03`: membaca error, isolasi blok, tabel uji normal/kosong/salah,
   tag tidak ditemukan, dan privasi.

### Keputusan editorial wajib

- `bridge-ms-00` direvisi agar fokus pada tur App Inventor dan proyek kosong;
  TinyDB dipindahkan keluar dari bridge ini.
- `hs-00` ditetapkan apakah hanya fokus Colab/`print()` atau tetap memuat
  variabel sebagai subbagian; keputusan harus tercermin pada checkpoint.
- `hs-1-3` diperlakukan sebagai proyek lanjutan setelah dictionary, atau dibuat
  versi latihan baru yang hanya menggunakan input sederhana.

### Acceptance criteria

- Semua gap audit memiliki bridge atau keputusan eksplisit untuk memakai materi
  video lama.
- Tidak ada bridge yang memperkenalkan dua beban konsep besar tanpa latihan
  antara.
- Blueprint disetujui secara internal sebelum produksi HTML.

---

## Fase 2 — Produksi bridge SMA

### Tujuan

Menyediakan lima HTML bridge SMA yang konsisten dengan `bridge-hs-00`.

### Pekerjaan

1. Implementasikan `bridge-hs-01.html` sampai `bridge-hs-05.html` di folder
   draft baru terlebih dahulu.
2. Gunakan template visual yang sama: navigasi, counter, progress bar,
   bookmark, pembesaran/fullscreen, rangkuman, dan status selesai.
3. Sertakan latihan yang bisa dijalankan atau ditelusuri siswa:
   - HS-01: prediksi tipe dan output.
   - HS-02: tiga input dan hasil kondisi.
   - HS-03: tabel perubahan accumulator.
   - HS-04: dua pemanggilan function valid/tidak valid.
   - HS-05: membaca dan menambah satu transaksi.
4. Kuis hanya menguji konsep yang sudah muncul di bridge.
5. Tambahkan label bahwa contoh nominal adalah data fiktif dan bukan data
   finansial pribadi siswa.

### Acceptance criteria

- Lima HTML dapat dibuka tanpa error JavaScript.
- Setiap bridge memiliki minimal satu latihan dan satu checkpoint pemahaman.
- Siswa dapat menjawab “apa yang harus sudah bisa sebelum video berikutnya”.
- Tidak ada function/dictionary di bridge yang belum dijelaskan sebelumnya.

---

## Fase 3 — Produksi bridge SMP dan pemisahan TinyDB

### Tujuan

Membuat progresi App Inventor yang dimulai dari interaksi paling konkret,
kemudian baru menuju penyimpanan persisten.

### Pekerjaan

1. Buat `bridge-ms-01.html`, `bridge-ms-02.html`, dan `bridge-ms-03.html`.
2. Revisi salinan kerja `bridge-ms-00.html`:
   - pertahankan Designer, Palette, Viewer, Components, Blocks;
   - pertahankan cara menjalankan proyek kosong;
   - pindahkan materi TinyDB dari jalur orientasi.
3. Untuk simulasi TinyDB, jelaskan bahwa simulasi browser hanya model konsep;
   hasilnya bukan bukti bahwa data benar-benar tersimpan di perangkat.
4. Latihan:
   - MS-01: tombol sapaan dengan input-output.
   - MS-02: simpan, tutup/buka, ambil, dan default tag.
   - MS-03: memperbaiki satu blok salah berdasarkan tabel kasus uji.

### Acceptance criteria

- TinyDB tidak menjadi prasyarat atau isi Modul 0.
- `bridge-ms-01` selesai sebelum `ms-1-1`.
- `bridge-ms-02` selesai sebelum `ms-4-1`.
- `bridge-ms-03` selesai sebelum debugging dan proyek akhir.

---

## Fase 4 — Dataset sequencing v1

### Tujuan

Menyusun dataset baru yang merepresentasikan jalur pedagogis, bukan hanya
urutan modul lama.

### Pekerjaan

1. Buat:

   ```text
   drafts/sequencing-v1/courseData-highschool.json
   drafts/sequencing-v1/courseData-middleschool.json
   ```

2. Masukkan bridge sebagai step `type: "slide"` tersendiri.
3. Tambahkan `prerequisiteStepIds`, `learningObjectives`, `practice`,
   `completionCriteria`, dan `sourceStepId` pada step video/proyek.
4. Susun SMA mengikuti 12 langkah jalur kanonik di audit.
5. Susun SMP mengikuti 11 langkah jalur kanonik di audit.
6. Jangan mengubah `startSeconds`/`endSeconds` yang bersumber dari video.
7. Pertahankan `unknown` sebagai `unknown`.
8. Ubah quiz `99999` di dataset draft menjadi
   `type: "manual_checkpoint"` atau `type: "project_checkpoint"` tanpa
   mengarang waktu.
9. Pindahkan proyek `hs-1-3` ke lokasi setelah bridge dictionary, atau buat
   salinan proyek yang disederhanakan; keputusan dicatat di metadata.

### Acceptance criteria

- Setiap step memiliki prasyarat yang sudah dipenuhi oleh step sebelumnya.
- Tidak ada step yang memakai `def`, `return`, dictionary, TinyDB, atau Colab
  sebelum bekal resminya.
- Dataset produksi lama tidak berubah.
- Semua `slideUrl` mengarah ke file yang benar-benar ada di paket draft.

---

## Fase 5 — Validasi teknis, timestamp, dan QA pembelajaran

### Tujuan

Menemukan kesalahan yang dapat merusak playback atau membuat siswa diuji
sebelum diajarkan.

### Pemeriksaan otomatis

1. Valid JSON untuk semua dataset draft.
2. Semua `slideUrl` lokal tersedia.
3. Semua `prerequisiteStepIds` ada dan tidak membentuk siklus.
4. Quiz video:
   - waktu tidak memakai `99999`;
   - waktu berada dalam segmen jika statusnya autoplay;
   - checkpoint manual tidak memiliki klaim autoplay.
5. Bookmark:
   - tidak melewati `endSeconds`;
   - tidak berada sebelum `startSeconds`;
   - anomali lama muncul di laporan `review_required`.
6. Semua step memiliki `sourceStepId` untuk materi video lama.

### Pemeriksaan manual

- buka semua HTML di desktop dan mobile;
- uji Next/Prev, keyboard, fullscreen, pembesaran, kuis, latihan, dan status
  selesai;
- cek bahwa rangkuman menggunakan istilah yang sama dengan materi utama;
- cek bahwa contoh App Inventor tidak menyimpan password, PIN, atau data nyata;
- cek bahwa siswa tidak harus memahami konsep yang belum diperkenalkan.

### Acceptance criteria

- Laporan QA memisahkan blocker, review_required, dan informational.
- Tidak ada blocker P0.
- Semua anomali timestamp audit lama tetap terlihat dan memiliki keputusan.

---

## Fase 6 — Pilot pemula dan paket integrasi

### Tujuan

Menguji apakah jalur ini benar-benar dapat diikuti oleh orang yang belum
pernah coding, bukan hanya lolos pemeriksaan teknis.

### Pekerjaan

1. Pilih minimal satu reviewer non-coding per jenjang jika tersedia.
2. Berikan hanya bridge dan step awal:
   - SMA sampai conditional dasar;
   - SMP sampai form input dan validasi.
3. Catat titik siswa berhenti, istilah yang membingungkan, dan kesalahan
   yang berulang.
4. Revisi blueprint/HTML/dataset berdasarkan bukti pilot.
5. Buat paket integrasi berisi:
   - dataset JSON final yang disetujui;
   - semua HTML bridge;
   - manifest file;
   - laporan QA;
   - keputusan timestamp;
   - catatan perubahan untuk Subproject 01.
6. Baru setelah persetujuan, sinkronkan salinan ke Subproject 01.

### Acceptance criteria

- Reviewer dapat menjalankan tugas awal tanpa instruksi lisan tambahan.
- Reviewer dapat menjelaskan prasyarat sebelum masuk ke materi berikutnya.
- Tidak ada kebingungan kritis tentang input/output, variabel, event, atau
  penyimpanan.
- Paket integrasi memiliki versi dan checksum yang jelas.

---

## Urutan eksekusi praktis

Untuk menjalankan bertahap, gunakan urutan berikut:

1. Jalankan Fase 0 dan commit baseline.
2. Jalankan Fase 1 dan review blueprint.
3. Jalankan Fase 2 dan QA bridge SMA.
4. Jalankan Fase 3 dan QA bridge SMP.
5. Jalankan Fase 4 untuk dataset draft, tanpa integrasi LMS.
6. Jalankan Fase 5 dan perbaiki semua blocker.
7. Jalankan Fase 6, minta persetujuan, baru integrasikan ke Subproject 01.

Fase 2 dan Fase 3 dapat dikerjakan paralel setelah Fase 1 selesai. Fase 4
bergantung pada keduanya.

## Definition of done

Implementasi dianggap selesai hanya jika:

- seluruh bridge wajib sudah berupa HTML dan terhubung ke dataset;
- urutan prasyarat SMP–SMA dapat dilacak dari metadata;
- video lama tetap mempertahankan timestamp sumber;
- quiz di luar segmen menjadi checkpoint manual atau telah mendapat keputusan
  editorial berbasis bukti;
- semua tautan slide dan validasi JSON lulus;
- jalur sudah diuji oleh minimal satu reviewer pemula/non-coding;
- dataset final baru disetujui sebelum disalin ke Subproject 01;
- tidak ada perubahan pada folder sumber lama.
