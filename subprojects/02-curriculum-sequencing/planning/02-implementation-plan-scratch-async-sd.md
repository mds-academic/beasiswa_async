# 02 — Implementation Plan: Scratch Async SD Scaffolding

**Status:** `revised — video-first sequencing pending user/UAT approval`  
**Tanggal:** 2026-09-09

## Tujuan

Mengubah tiga playlist tutorial Scratch menjadi jalur belajar asinkronus SD yang runtut tanpa menggabungkan tiga project menjadi satu artefak. Setiap project tetap berdiri sendiri dan dipakai sebagai milestone.

## Prinsip desain

- **Bridge sebelum project:** konsep yang menjadi prasyarat dikenalkan lewat slide singkat sebelum video tutorial.
- **Project tetap terpisah:** About Me, Racing Car, dan Increase Your Earnings tidak di-stitch.
- **Dari konkret ke abstrak:** kenal platform → aksi sederhana → pengulangan → sensing/keputusan → data/koordinasi.
- **Tutorial bukan satu-satunya kurikulum:** siswa diberi checkpoint, istilah, alasan penggunaan blok, dan troubleshooting.
- **Satu perubahan setiap eksperimen:** siswa meniru, mengubah satu hal, menguji, lalu menjelaskan.

## Struktur kanonik yang direkomendasikan — video-first

### Modul 0 — Satu-satunya bridge: Kenalan dengan Scratch

**Slide:** `bridge-sd-00`  
**Sumber:** artikel Create & Learn yang diminta pengguna, memakai screenshot Scratch aktual.

Bridge ini hanya menutup gap yang belum tersedia dalam playlist: cara membuka Scratch, mengenali Stage/Sprite/Block Palette/Coding Area, dan mencoba project pertama. Bridge tidak mengajarkan ulang konsep yang sudah dijelaskan di video.

### Modul 1 — Project About Me

**7 video playlist About Me, urutan asli tetap:**

1. Mendesain Karakter
2. Merekam Suara Perkenalan Diri
3. Membuat Kostum Makanan
4. Memprogram Sprite Makanan
5. Menambahkan Sprite dengan Emoji
6. Memprogram Animasi dan Text-to-Speech
7. Memprogram dengan Effects

Video menjadi sumber utama untuk desain, Costume, Event, Sound, `repeat`, animasi, dan extension. Tidak ada Bridge 01/02 tambahan di jalur wajib karena penjelasannya sudah ada di playlist.

### Modul 2 — Project Racing Car

**6 video playlist Racing Car, urutan asli tetap:**

1. Desain Sirkuit
2. Desain Mobil
3. Kode Mobil
4. Duplikasi dan Modifikasi Mobil 2
5. Desain Finish Line
6. Kode Menang dan Menyentuh Musuh

Video menjadi sumber utama untuk keyboard input, gerak, `repeat until`, duplicate/reuse, sensing, collision, conditional, dan feedback. Tidak ada Bridge 03 tambahan di jalur wajib.

### Modul 3 — Project Increase Your Earnings / Capstone

**4 video playlist Increase Your Earnings, urutan asli tetap:**

1. Percakapan Intro
2. Memprogram Opsi 1
3. Memprogram Opsi 2
4. Memprogram Ending

Video menjadi sumber utama untuk starter project, backdrop sebagai scene, clone, variable credit, broadcast, `if then else`, dan ending. Tidak ada Bridge 04 tambahan di jalur wajib.

### Alur final

`Bridge 00 → About Me (7 video) → Racing Car (6 video) → Increase Your Earnings (4 video)`

Total: **4 modul, 18 step** = 1 bridge intro + 17 video tutorial.

### Aturan pemakaian bridge ke depan

- Jika konsep sudah dijelaskan cukup di video, **pakai video; jangan dibuatkan slide duplikat**.
- Slide hanya dibuat untuk missing prerequisite yang menghambat siswa memulai.
- Bridge 01–04 tetap disimpan sebagai draft/reference, tetapi tidak dimasukkan ke jalur course aktif.
- Extension seperti Lists, Custom Blocks, dan debugging eksplisit hanya dibuat jika ada gap yang benar-benar dibutuhkan setelah UAT.

## Hal yang belum ditutup oleh tiga playlist

Belum menjadi target wajib pada draft ini:

- Lists;
- Custom Blocks;
- Operators secara sistematis;
- debugging sebagai metode eksplisit, bukan hanya perbaikan error.

Jika ingin cakupan Scratch lebih lengkap, buat extension terpisah setelah capstone. Jangan memasukkannya di tengah alur wajib karena akan menambah beban kognitif.

## Artefak yang sudah dibuat

- `slides/bridge-sd-00.html` + `.json`
- `slides/bridge-sd-01.html` + `.json`
- `slides/bridge-sd-02.html` + `.json`
- `slides/bridge-sd-03.html` + `.json`
- `slides/bridge-sd-04.html` + `.json`
- Draft metadata duplikat di `drafts/sd-scratch/`
- Generator: `scripts/build_scratch_sd_bridges.py`

## Acceptance criteria sebelum masuk dataset produksi

1. Reviewer menyetujui urutan tiga project dan posisi lima bridge.
2. Semua slide dapat dibuka di desktop dan mobile.
3. Semua quiz embedded dapat dijawab ulang dan memberikan feedback.
4. Setiap bridge memiliki objective, practice, completion criteria, bookmark, dan sumber.
5. LMS owner menyetujui mapping ID sebelum `courseData-upperprimary.json` diubah.
6. Tidak ada materi sumber lama yang dimodifikasi.
7. Dataset SD terintegrasi ke `output/`, Subproject 01, dan `docs/`; seluruh mirror identik dan berisi 22 step (5 slide bridge + 17 video tutorial).

## Implementasi yang sudah dijalankan

- Jalur enam modul dibuat: Modul 0 (Bridge 00 & 01) → Modul 1 (About Me part 1) → Modul 2 (Bridge 02 & Animasi) → Modul 3 (Racing Car & Bridge 03) → Modul 4 (Bridge 04 & Opsi 1) → Modul 5 (Capstone & Ending).
- Playlist tutorial tetap sebagai video terpisah; tidak ada stitching project paksa.
- Lima slide bridge (`bridge-sd-00` s.d. `bridge-sd-04`) lengkap dengan slide HTML interaktif, bookmark, dan kuis.
- `courseData-upperprimary.json` diperbarui di tiga mirror dengan 22 step lengkap dan diverifikasi SHA-256 identik.
- Seluruh 17 video tutorial memiliki properti `"introMode": "embedded"` untuk mencegah pemutaran bumper ganda.
- Visual bridge memakai design system existing dan aset Scratch aktual lokal.
