# 02 — Implementation Plan: Scratch Async SD Scaffolding

**Status:** `implemented & verified — video-first 18-step sequencing with authentic scratch cdn assets`  
**Tanggal:** 2026-09-09

## Tujuan

Mengubah materi Scratch SD asinkronus menjadi alur belajar **video-first** yang terstruktur, padat, dan menyenangkan bagi siswa SD. Mengeliminasi slide duplikat yang mengulang isi video Kak Laras, serta merombak slide orientasi (`bridge-sd-00`) menggunakan antarmuka resmi MIT Media Lab (`https://scratch.mit.edu/projects/editor/?tutorial=getStarted`) dengan balok nyata yang di-upload ke CDN Ruangguru.

## Prinsip Desain

- **Video-First**: Jika materi dan langkah sudah dijelaskan secara gamblang di video tutorial Kak Laras, gunakan video tersebut secara langsung. Slide hanya dibuat untuk menjembatani gap pengenalan awal yang belum tercakup di video.
- **Antarmuka Asli Scratch (Anti-Mockup)**: Tidak menggunakan aset pihak ketiga atau blok ilustratif buatan Create & Learn. Semua referensi visual harus berasal dari antarmuka Scratch resmi MIT Media Lab dan tutorial *Getting Started*, dengan aset ter-host di CDN Ruangguru (`rg_cdn_web_2`).
- **Project Tetap Terpisah**: Tiga proyek inti (*About Me*, *Racing Car*, dan *Increase Your Earnings*) tidak di-stitch menjadi satu file raksasa, melainkan menjadi milestone mandiri yang jelas.
- **Hands-on Interaktif Nyata**: Siswa diarahkan langsung membuka editor web Scratch resmi untuk merangkai kode pertama mereka (`when green flag clicked` → `move 10 steps` → `say Hello! for 2 seconds`).

## Struktur Kanonik Final — Video-First (4 Modul, 18 Step)

### Modul 0 — Satu-satunya Slide Bridge: Kenalan dengan Scratch (1 Step)

**Slide:** `bridge-sd-00` (`slides/bridge-sd-00.html`)  
**Sumber:** Scratch Editor Resmi MIT Media Lab (`https://scratch.mit.edu/projects/editor/?tutorial=getStarted`)  
**Aset:** Tangkapan layar antarmuka asli, palette warna balok resmi, dan langkah tutorial *Getting Started* yang di-upload ke CDN Ruangguru.

Materi wajib yang dibahas:
1. Cara membuka Scratch dan mengakses tutorial *Getting Started*.
2. Memahami 4 area kerja utama: Stage (panggung), Sprite Pane, Block Palette, dan Coding Area.
3. Mengenal kategori balok kode (Motion, Looks, Events, Control).
4. Merangkai program balok pertama (Scratch Cat bergerak 10 langkah dan menyapa "Hello!").
5. Cara menambahkan Sprite dan Backdrop baru dari library.
6. Tips troubleshooting dasar (balok tidak bereaksi, sprite hilang/keluar layar, suara tidak terdengar).

### Modul 1 — Project About Me (7 Step)

Menggunakan 7 video tutorial resmi Kak Laras secara berurutan:
1. `up-about-1`: Mendesain Karakter
2. `up-about-2`: Merekam Suara Perkenalan Diri
3. `up-about-3`: Membuat Kostum Makanan
4. `up-about-4`: Memprogram Sprite Makanan
5. `up-about-5`: Menambahkan Sprite dengan Emoji
6. `up-about-6`: Memprogram Animasi dan Text-to-Speech
7. `up-about-7`: Memprogram dengan Effects

### Modul 2 — Project Racing Car (6 Step)

Menggunakan 6 video tutorial resmi Kak Laras secara berurutan:
1. `up-racing-1`: Desain Sirkuit
2. `up-racing-2`: Desain Mobil
3. `up-racing-3`: Kode Mobil
4. `up-racing-4`: Duplikasi dan Modifikasi Mobil 2
5. `up-racing-5`: Desain Finish Line
6. `up-racing-6`: Kode Menang dan Menyentuh Musuh

### Modul 3 — Project Increase Your Earnings / Capstone (4 Step)

Menggunakan 4 video tutorial resmi Kak Laras secara berurutan:
1. `up-earning-1`: Percakapan Intro
2. `up-earning-2`: Memprogram Opsi 1
3. `up-earning-3`: Memprogram Opsi 2
4. `up-earning-4`: Memprogram Ending

### Alur Belajar Lengkap

```text
Bridge 00 (Slide Asli CDN) → About Me (7 Video) → Racing Car (6 Video) → Increase Your Earnings (4 Video)
```

Total: **4 Modul, 18 Step** (1 slide intro + 17 video tutorial).

## Status Bridge Tambahan (01–04)

Slide `bridge-sd-01` s.d. `bridge-sd-04` tetap tersimpan rapi di folder arsip/draft (`drafts/sd-scratch/` dan `slides/`) sebagai materi referensi pengayaan guru/instruktur, tetapi **dikeluarkan dari jalur kurikulum aktif** agar siswa fokus belajar melalui video tanpa pengulangan materi yang melelahkan.

## Aset Resmi Scratch di Ruangguru CDN (`rg_cdn_web_2`)

| Nama Aset | Keterangan | URL CDN Ruangguru |
|---|---|---|
| `scratch_real_editor_clean` | Tampilan utuh Scratch Editor MIT | `https://cdn-web-2.ruangguru.com/landing-pages/assets/f668c8e9-f446-4464-8df1-b42f6eeb576d.png` |
| `scratch_real_stage` | Area Stage & Scratch Cat | `https://cdn-web-2.ruangguru.com/landing-pages/assets/aa4663d8-b986-49ea-b54b-c3d33d6a4cfd.png` |
| `scratch_real_sprite_pane` | Panel Sprite Properties & Backdrop | `https://cdn-web-2.ruangguru.com/landing-pages/assets/8e9d8dec-0a0e-4134-920b-1157a32d3ae3.png` |
| `scratch_real_motion_palette` | Balok Biru Gerakan (Motion) | `https://cdn-web-2.ruangguru.com/landing-pages/assets/d3e26eb8-f7bc-491d-9fea-9c7e3a88cc81.png` |
| `scratch_real_looks_palette` | Balok Ungu Tampilan (Looks) | `https://cdn-web-2.ruangguru.com/landing-pages/assets/0778db78-6b86-4e1c-9d34-57aea9ce7d13.png` |
| `scratch_real_events_palette` | Balok Kuning Kejadian (Events) | `https://cdn-web-2.ruangguru.com/landing-pages/assets/513dac2f-d9d8-4b3c-bce8-ef8947ed763e.png` |
| `scratch_real_control_palette` | Balok Oranye Kontrol (Control) | `https://cdn-web-2.ruangguru.com/landing-pages/assets/81adfccc-d372-499c-89a8-35abafc2c924.png` |
| `card_step1` | Tutorial Card 1: Move 10 Steps | `https://cdn-web-2.ruangguru.com/landing-pages/assets/69d083d3-a370-4930-a965-2350d3220a91.png` |
| `card_step2` | Tutorial Card 2: Say Hello | `https://cdn-web-2.ruangguru.com/landing-pages/assets/cc304757-e91a-4454-acde-5539a3350f49.png` |
| `card_step3` | Tutorial Card 3: Green Flag Event | `https://cdn-web-2.ruangguru.com/landing-pages/assets/52f228b3-b41f-4df1-b10d-8777c7c16eee.png` |

## Implementasi & Sinkronisasi yang Diselesaikan

1. **Dataset Produksi 18 Step**: `courseData-upperprimary.json` disinkronkan ke 3 mirror (`output/`, `src/data/`, `docs/data/`) dan tervalidasi identik (SHA-256 matching).
2. **Slide Bridge Direvamp**: `bridge-sd-00.html` dan `bridge-sd-00.json` menggunakan aset CDN resmi, tombol aksi editor resmi, dan fallback lokal.
3. **Master Google Sheet**: Tab `materi-sd` diperbarui menjadi 18 baris, tab `ops-result-sd` diperbarui menjadi 18 kolom pelacakan kuis, dan `Changelog & Audit Log` mencatat entri ke-12.
4. **Platform LMS UI**: Antarmuka LMS SD menampilkan 18 tabs pembelajaran + 1 tab sertifikat kelulusan.

