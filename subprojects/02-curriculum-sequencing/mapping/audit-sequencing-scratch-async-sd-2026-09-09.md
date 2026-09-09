# Audit Sequencing Scratch Async SD — Tutorial-Based Playlist

**Tanggal:** 2026-09-09  
**Status:** `under discussion` — audit awal, belum mengubah dataset produksi.

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

## Rekomendasi keputusan sequencing

- **Jangan menggabungkan artefak project.** Gunakan tiga project sebagai tiga milestone terpisah.
- **Gunakan About Me sebagai entry point**, tetapi tambahkan pengantar Scratch UI sebelum video desain dan tur kode singkat sebelum video 4.
- **Gunakan Racing Car sebagai project logika/game**, dengan micro-lesson input keyboard → loop → sensing → conditional.
- **Gunakan Increase Your Earnings sebagai capstone**, setelah variable, conditional, dan event coordination sudah pernah dikenalkan.
- **Jangan mengklaim “semua komponen Scratch” secara penuh.** Tiga project mencakup sebagian besar blok yang dibutuhkan untuk membuat project interaktif, tetapi Lists, custom blocks, operator yang lebih sistematis, dan debugging eksplisit masih minim/tidak tercakup.
- **Tidak ada perubahan dataset produksi pada tahap ini.** Langkah berikutnya adalah membahas apakah gap tersebut ditutup dengan micro-lesson/slide bridge, bukan memindahkan video secara agresif.

## Data audit lokal

- Metadata playlist: `data/scratch-playlists/{about-me,racing-car,increase-earning}.json`
- Caption: `data/scratch-playlists/transcripts/*.txt`
