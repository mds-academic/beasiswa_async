# 02 — Implementation Plan: Scratch Async SD Scaffolding

**Status:** `implemented — pending user/UAT approval`  
**Tanggal:** 2026-09-09

## Tujuan

Mengubah tiga playlist tutorial Scratch menjadi jalur belajar asinkronus SD yang runtut tanpa menggabungkan tiga project menjadi satu artefak. Setiap project tetap berdiri sendiri dan dipakai sebagai milestone.

## Prinsip desain

- **Bridge sebelum project:** konsep yang menjadi prasyarat dikenalkan lewat slide singkat sebelum video tutorial.
- **Project tetap terpisah:** About Me, Racing Car, dan Increase Your Earnings tidak di-stitch.
- **Dari konkret ke abstrak:** kenal platform → aksi sederhana → pengulangan → sensing/keputusan → data/koordinasi.
- **Tutorial bukan satu-satunya kurikulum:** siswa diberi checkpoint, istilah, alasan penggunaan blok, dan troubleshooting.
- **Satu perubahan setiap eksperimen:** siswa meniru, mengubah satu hal, menguji, lalu menjelaskan.

## Struktur kanonik yang direkomendasikan

### Fase 0 — Bridge 00: Kenalan dengan Scratch

**Slide:** `bridge-sd-00`  
**Sumber intro:** artikel Create & Learn yang diminta pengguna, diparafrasekan dan disederhanakan.

Isi:

1. Scratch sebagai coding berbasis blok.
2. Cara membuka `scratch.mit.edu`, Create, dan login/simpan.
3. Empat area: Block Palette, Coding Area, Stage, Sprite & Backdrop.
4. Arti warna blok utama.
5. Project pertama: Sprite menyapa.
6. Troubleshooting dasar.

**Output siswa:** satu Sprite menyapa saat bendera hijau diklik.

### Fase 1 — Project About Me: desain → media → first code

**Playlist:** About Me, 7 video.

Urutan video tetap, dengan framing checkpoint:

1. Mendesain Karakter.
2. Merekam Suara Perkenalan Diri.
3. Membuat Kostum Makanan.
4. Memprogram Sprite Makanan.
5. Menambahkan Sprite dengan Emoji.
6. Memprogram Animasi dan Text-to-Speech.
7. Memprogram dengan Effects.

**Slide pendamping:** `bridge-sd-01` sebelum playlist dan `bridge-sd-02` sebelum video animasi.

**Output siswa:** kartu perkenalan interaktif dengan minimal satu event, satu media, dan satu animasi.

### Fase 2 — Bridge 02: Loop dan animasi

**Slide:** `bridge-sd-02`.

Konsep:

- aksi satu kali versus aksi berulang;
- `repeat`, `forever`, dan pengantar `repeat until`;
- `move`, `turn`, `next costume`, `wait`;
- Costume sebagai frame animasi;
- mengubah angka dan mengamati akibatnya.

**Output siswa:** animasi gerak atau pergantian Costume yang dapat dijelaskan.

### Fase 3 — Project Racing Car: input → loop → sensing → conditional

**Playlist:** Racing Car, 6 video.

Urutan video tetap:

1. Desain Sirkuit.
2. Desain Mobil.
3. Kode Mobil.
4. Duplikasi dan Modifikasi Mobil 2.
5. Desain Finish Line.
6. Kode Menang dan Menyentuh Musuh.

**Slide pendamping:** `bridge-sd-03` sebelum video Kode Mobil.

**Output siswa:** dua mobil yang dikendalikan input berbeda, memiliki finish line, dan memberi feedback ketika menang/bertabrakan.

### Fase 4 — Bridge 04: variable dan koordinasi project

**Slide:** `bridge-sd-04`.

Konsep:

- variable sebagai kotak penyimpan nilai;
- set nilai awal dan change nilai;
- variable global untuk nilai yang dibaca beberapa Sprite;
- broadcast sebagai pesan antar-Sprite;
- backdrop sebagai babak/state;
- hubungan pilihan → aktivitas → credit → ending.

**Output siswa:** counter Score/Credit sederhana dan satu broadcast yang mengganti scene atau memicu respons Sprite lain.

### Fase 5 — Project Increase Your Earnings: capstone

**Playlist:** Increase Your Earnings, 4 video.

Urutan tetap:

1. Percakapan Intro dan Remix Starter Project.
2. Memprogram Opsi 1.
3. Memprogram Opsi 2.
4. Memprogram Ending.

**Output siswa:** project pilihan pekerjaan dengan credit dan ending kondisional. Clone diposisikan sebagai teknik lanjutan yang diikuti dari tutorial, bukan konsep yang harus dikuasai sebelum seluruh course.

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
7. Dataset SD terintegrasi ke `output/`, Subproject 01, dan `docs/`; seluruh mirror identik dan berisi 22 step.

## Implementasi yang sudah dijalankan

- Jalur enam modul dibuat: Bridge 00 → About Me → Bridge 02 → Racing Car → Bridge 04 → Increase Your Earnings.
- Playlist tutorial tetap sebagai video terpisah; tidak ada stitching project.
- Lima bridge disalin ke `subprojects/01-lms-platform/src/slides/` dan `docs/slides/`.
- `courseData-upperprimary.json` diperbarui di tiga mirror dengan 22 step.
- Visual bridge memakai design system existing dan aset Scratch aktual lokal.

## Keputusan yang masih terbuka

- Apakah Bridge 01 dan Bridge 02 ditampilkan sebagai materi wajib atau Bridge 02 dijadikan pre-watch wajib sebelum Racing Car.
- Apakah lima bridge menjadi step terpisah di LMS atau beberapa dijadikan bagian materi pendamping pada satu module.
- Apakah extension Lists/Custom Blocks diperlukan untuk definisi “lengkap”.
