# Audit Sequencing Scratch Async SD — Tutorial-Based Playlist

**Tanggal:** 2026-09-09  
**Status:** `implemented — verified in production dataset` (Diperbarui pasca implementasi scaffolding 6 modul, 5 slide bridge, dan standarisasi introMode)

## Ruang lingkup dan metode

Tiga playlist dibaca dari metadata playlist dan caption Bahasa Indonesia yang tersedia untuk seluruh **17 video**:

- [About Me Interactive Project](https://www.youtube.com/playlist?list=PLqrknrOURrd1dEIoFXTRKyGdeog67Deoj) — 7 video
- [Racing Car Game](https://www.youtube.com/playlist?list=PLqrknrOURrd3sGvgW8ERa-pKXef6JlFzP) — 6 video
- [Increase Your Earnings](https://www.youtube.com/playlist?list=PLqrknrOURrd20WZDOPzUcO2V_tLyYhzQY) — 4 video

Transcript lokal untuk audit tersimpan di `data/scratch-playlists/transcripts/`. Audit ini menilai urutan konsep, prasyarat, dan kemungkinan memindahkan unit penjelasan **tanpa menjahit tiga project menjadi satu project**.

## Kesimpulan awal

Tiga project **tidak perlu dan sebaiknya tidak di-stitch**. Struktur yang lebih aman adalah:

1. **Project 1 — About Me:** onboarding Scratch + fondasi visual, event sederhana, costume, sound, animasi.
2. **Project 2 — Racing Car:** input keyboard, kontrol gerak, loop, sensing, conditional, game feedback.
3. **Project 3 — Increase Your Earnings:** project integratif tingkat lanjut: starter project, clone, broadcast, backdrop/state, variable global, `if then else`, dan beberapa kondisi interaksi.

Urutan playlist asli sudah cukup masuk akal sebagai **alur pembuatan masing-masing project**, tetapi bukan otomatis alur pedagogis lintas-project. Beberapa video perlu dipindahkan posisinya **di dalam project yang sama**, atau diberi micro-lesson prerequisite sebelum project dimulai.

## Bedah per project

### 1. About Me — paling tepat sebagai Project 1

| Urutan rekomendasi | Video | Peran pedagogis | Catatan |
|---|---|---|---|
| 1 | Mendesain Karakter | Kenal Sprite, tab Costumes, vector/bitmap, menggambar | Secara teknis berat untuk absolute beginner; beri starter costume atau tutorial UI singkat. |
| 2 | Merekam Suara Perkenalan Diri | Sound, record, edit sederhana, `when this sprite clicked`, `play/start sound` | Ini mengenalkan event interaksi yang sangat jelas. |
| 3 | Membuat Kostum Makanan | Costume sebagai state/frames, duplicate, edit vector | Baik sebagai pengantar bahwa satu sprite dapat memiliki banyak costume. |
| 4 | Memprogram Sprite Makanan | `switch costume`, `next costume`, `repeat`, `wait`, sound sequencing | Ini merupakan lesson coding pertama yang paling kaya; sebaiknya menjadi inti transisi dari desain ke kode. |
| 5 | Menambahkan Sprite dengan Emoji | Menambah sprite dan input kreatif | Lebih cocok sebagai extension setelah siswa memahami sprite/costume, bukan prerequisite. |
| 6 | Memprogram Animasi + Text-to-Speech | `move`, `turn`, `repeat`, event, extension Text-to-Speech | Secara konsep lebih advanced daripada video 4 karena memakai loop dan extension. |
| 7 | Memprogram dengan Effects | `repeat`, `next costume`, `change [color] effect`, `clear graphic effects` | Challenge/extension; jangan dijadikan fondasi project berikutnya. |

**Temuan penting:** video 1–3 dominan desain/media, sedangkan video 4 adalah coding core. Jadi playlist ini bisa tetap menjadi satu project, tetapi LMS perlu memberi label fase: `design → media → first code → animation → challenge`.

### 2. Racing Car — tepat sebagai Project 2

Urutan asli sebaiknya dipertahankan:

1. **Desain Sirkuit** — backdrop dan stage composition.
2. **Desain Mobil** — membuat Sprite, paint editor, center/orientation.
3. **Kode Mobil** — keyboard event, `move`, turning, `repeat until`, operator `not`/key state.
4. **Duplikasi dan Modifikasi Mobil 2** — duplicate sprite, ubah key bindings, reuse/adapt code.
5. **Desain Finish Line** — sprite tambahan dan visual goal.
6. **Kode Menang dan Menyentuh Musuh** — `forever`, `if then`, `touching`, sound/feedback.

**Rekomendasi sequencing kecil:** tampilkan video 5 sebelum video 3 hanya jika tujuan sesi adalah “siapkan semua aset dulu”. Namun untuk belajar coding, lebih baik tetap 3 → 4 → 5 → 6: siswa memahami mobil bergerak dulu, lalu menambahkan goal dan collision.

**Missing prerequisite yang perlu dijembatani:** sebelum video 3, siswa perlu micro-lesson tentang event/key press, koordinat/arah, dan perbedaan `repeat` vs `repeat until`. Video 6 memperkenalkan conditional agak terlambat, tetapi masih tepat karena conditional dipakai untuk aturan menang/collision.

### 3. Increase Your Earnings — tepat sebagai Project 3 / integrative

Urutan video asli sebaiknya dipertahankan:

1. **Percakapan Intro** — memahami brief, remix starter project, mengenali sprite/backdrop/kode awal, konsep kredit dan alur state.
2. **Memprogram Opsi 1** — backdrop, clone-based option button, `costume name`, `if then else`, show/hide, perpindahan scene.
3. **Memprogram Opsi 2** — variable global, backdrop state, sprite interaktif, `forever`, `if`, `touching`, change score/kredit.
4. **Memprogram Ending** — broadcast `ending`, conditional berdasarkan kredit, final state dan feedback.

**Ini project paling integratif, bukan project pemula pertama.** Ia mengasumsikan siswa sudah memahami atau menerima scaffolding untuk:

- remix dan starter project;
- variable global vs sprite-only;
- clone dan `when I start as a clone`;
- broadcast sebagai pesan antar-sprite;
- backdrop sebagai state/scene;
- `if then else`;
- sensing `touching`, mouse down, dan interaksi drag/click;
- hide/show dan sinkronisasi beberapa sprite.

Video 2 memuat beban konsep terbesar karena sekaligus mengenalkan clone, costume name, backdrop switching, dan pengelolaan visibility. Untuk SD async, sebaiknya video tersebut dipecah secara navigasi menjadi beberapa checkpoint, tetapi **tetap satu project dan satu video source** bila produksi ulang belum dilakukan.

## Peta komponen Scratch yang tercakup

| Komponen | Bukti utama | Kualitas cakupan |
|---|---|---|
| Stage/backdrop/costume/sprite | Ketiga project | kuat |
| Events | klik sprite, green flag, key press, backdrop switch | kuat |
| Motion | About Me dan Racing Car | cukup-kuat |
| Looks/animation/effects | About Me | kuat |
| Sound/record/TTS | About Me, Racing Car | kuat |
| Control: repeat/forever/repeat until/wait | Semua project | kuat |
| Sensing: touching/mouse down/key state | Racing Car, Increase Your Earnings | cukup-kuat |
| Conditionals | Racing Car dan Increase Your Earnings | ada, tetapi muncul terlambat |
| Variables/data | Increase Your Earnings | ada, tetapi hanya melalui tutorial integratif |
| Broadcast/state coordination | Increase Your Earnings | ada, level lanjut |
| Operators | tersirat/terbatas, misalnya `not`, `or`, perbandingan | **minim; gap nyata** |
| Lists | tidak terlihat pada 17 caption | **belum tercakup** |
| Custom blocks/functions | tidak terlihat pada 17 caption | **belum tercakup** |
| Debugging/systematic problem solving | muncul sebagai troubleshooting informal | **belum menjadi lesson eksplisit** |

## Keputusan sequencing yang telah diimplementasikan

- **Tiga artefak project tetap terpisah:** About Me, Racing Car, dan Increase Your Earnings berdiri sendiri sebagai milestone bertahap; tidak ada penyatuan/stitching project paksa.
- **Entry Point berfondasi kuat:** Modul 0 menyediakan dua slide bridge (`bridge-sd-00` orientasi platform berbasis artikel Create & Learn + `bridge-sd-01` transisi karakter ke kode/kostum/event).
- **Logika Loop & Animasi:** Modul 2 menyediakan `bridge-sd-02` yang menjembatani konsep loop (`repeat`, `forever`, `wait`, frame animasi) sebelum video animasi lanjutan dan TTS.
- **Kemudi & Deteksi Tabrakan:** Modul 3 menyisipkan `bridge-sd-03` tepat sebelum video kode mobil untuk menjembatani event keyboard, arah putar mobil, dan sensing `touching`.
- **Variabel & Sinyal Komunikasi:** Modul 4 menyisipkan `bridge-sd-04` sebelum video project Increase Your Earnings untuk membekali konsep variabel kredit dan sinyal `broadcast`.
- **Transparansi cakupan:** lists, custom blocks, dan operator mendalam tidak dipaksakan ke materi wajib agar beban kognitif siswa SD tetap terjaga.

## Struktur 6 Modul dan 22 Step Produksi

| Modul | Tipe | ID Step | Judul Materi | Peran Pedagogis / Komponen |
|---|---|---|---|---|
| **Modul 0: Kenalan Scratch & Fondasi Interaksi** | Slide | `bridge-sd-00` | Scratch dari Nol: Kenalan dengan Platformnya | Orientasi UI: Stage, Sprite, Palette, Coding Area |
| | Slide | `bridge-sd-01` | Dari Karakter ke Kode: Sprite, Costume, dan Event | Transisi visual ke logika blok & event klik |
| **Modul 1: About Me — Perkenalan Diri** | Video | `up-about-1` | 1 About Me - Mendesain Karakter | Paint editor vektor, bentuk dasar, warna kulit |
| | Video | `up-about-2` | 2 About Me - Merekam Suara Perkenalan Diri | Sound tab, rekam suara, event `when clicked` |
| | Video | `up-about-3` | 3 About Me - Membuat Kostum Makanan | Tab costumes, multi-frame state makanan |
| | Video | `up-about-4` | 4 About Me - Memprogram Sprite Makanan | `next costume`, loop `repeat`, `wait`, suara |
| | Video | `up-about-5` | 5 About Me - Menambahkan Sprite dengan Emoji | Koordinat X/Y panggung & variasi sprite |
| **Modul 2: Loop & Animasi Lanjutan** | Slide | `bridge-sd-02` | Membuat Gerakan Berulang dengan Loop | Konsep loop: aksi berulang vs sekali jalan |
| | Video | `up-about-6` | 6 About Me - Memprogram Animasi & TTS | Motion `move`/`turn`, ekstensi Text-to-Speech |
| | Video | `up-about-7` | 7 About Me - Memprogram dengan Effects | Visual efek grafik `color effect`, reset efek |
| **Modul 3: Racing Car Game — Kontrol & Deteksi** | Video | `up-racing-1` | 1 Desain Sirkuit | Stage & backdrop kanvas lintasan balap |
| | Video | `up-racing-2` | 2 Desain Mobil | Top-down sprite mobil & titik pusat (center point) |
| | Slide | `bridge-sd-03` | Input, Sensing, dan Keputusan di Racing Car | Konsep kemudi keyboard, arah & deteksi tabrakan |
| | Video | `up-racing-3` | 3 Kode Mobil | Motion kemudi keyboard `point in direction` |
| | Video | `up-racing-4` | 4 Duplikasi dan Modifikasi Mobil 2 | Duplikasi sprite & adaptasi tombol WASD |
| | Video | `up-racing-5` | 5 Desain Finish Line | Sprite garis finish melintang sirkuit |
| | Video | `up-racing-6` | 6 Kode Menang dan Menyentuh Musuh | Sensing `touching`, conditional `if-then`, menang |
| **Modul 4: Proyek Integratif — Variabel & Sinyal** | Slide | `bridge-sd-04` | Variable, Broadcast, dan Project Integratif | Konsep kotak variabel kredit & sinyal broadcast |
| | Video | `up-earning-1` | 1. Percakapan Intro | Remix starter project, alur cerita skenario |
| | Video | `up-earning-2` | 2. Memprogram Opsi 1 | Switch scene backdrop, `if-then-else`, show/hide |
| **Modul 5: Increase Your Earnings — Capstone** | Video | `up-earning-3` | 3. Memprogram Opsi 2 | Modifikasi variabel kredit, interaksi klik |
| | Video | `up-earning-4` | 4. Memprogram Ending | Broadcast pesan ending, evaluasi kredit akhir |

## Standarisasi Intro Bumper (`introMode: "embedded"`)

Seluruh 17 unit video Scratch SD telah distandarisasi dengan properti:
```json
"introMode": "embedded"
```
Karena video tutorial YouTube dari sumber materi asli telah memiliki bumper/opening visual tersendiri, runtime LMS (`app.js`) secara cerdas langsung memulai video pembelajaran tanpa memutar `intro.mp4` eksternal ganda, sehingga alur belajar siswa SD mulus dan bebas hambatan.

## Checkpoint Quiz & Validasi

- Setiap video step dilengkapi checkpoint quiz berbasis transkrip nyata untuk menguji pemahaman konsep inti di akhir video.
- Format kuis mendukung ekstraksi bento box LMS dan normalisasi jawaban huruf/indeks.
- Seluruh 5 slide bridge memuat interactive slide checkpoint, bookmarks, dan learning objectives.

## Bukti Sinkronisasi Dataset

Dataset produksi telah disinkronkan dan diverifikasi memiliki hash SHA-256 identik di tiga mirror:
1. `subprojects/02-curriculum-sequencing/output/courseData-upperprimary.json`
2. `subprojects/01-lms-platform/src/data/courseData-upperprimary.json`
3. `docs/data/courseData-upperprimary.json`

Hasil verifikasi:
- **Total Modules:** 6
- **Total Steps:** 22 (5 Slide Bridge + 17 Video Tutorial)
- **Status Validasi JSON & Runtime:** PASS 100%
