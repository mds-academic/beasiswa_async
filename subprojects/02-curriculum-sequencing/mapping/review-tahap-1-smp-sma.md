# Review rinci sequencing SMP–SMA — tahap transisi pemula

Tanggal: 2026-09-08  
Status: **review rinci selesai untuk tahap berbasis metadata, bacaan, kode/kuis, dan transkrip caption; belum menjadi persetujuan perubahan dataset produksi.**

Dokumen ini memperbarui review tahap pertama sebelumnya secara **in-place**. Tujuannya bukan menghapus materi lama, melainkan menentukan: (1) video mana yang dipakai, (2) batas waktu asli yang dipertahankan, (3) bagian yang perlu dipindah/dipecah, dan (4) materi jembatan yang harus dibuat sebagai HTML slides atau video baru.

## 1. Batas bukti dan aturan preservasi

### Bukti yang sudah diperiksa

- Dua dataset hasil sequencing: `output/courseData-highschool.json` dan `output/courseData-middleschool.json`.
- Snapshot sumber lama: `references/source-dataset-snapshot.json` dan `references/legacy-courseData-snapshot.json`.
- Seluruh 15 video unik yang muncul di dataset telah memiliki caption lokal di `references/transcripts/`; manifest dan waktu caption ada di `references/transcripts/manifest.json`.
- Bacaan HTML, latihan, expected code, kuis, dan bookmark pada setiap langkah.
- Audit perbedaan timing di `references/timing-preservation-audit.json`.

Caption otomatis membantu menemukan konsep dan lokasi waktunya, tetapi **bukan pengganti peninjauan visual penuh**. Status “belum terbukti ada” berarti belum ada bukti pengajaran yang cukup dalam artefak yang diperiksa; bukan klaim bahwa konsep pasti tidak ada di video.

### Aturan sumber waktu

1. `startSeconds`, `endSeconds`, bookmark, waktu kuis, pause, resume, dan skip adalah metadata sumber yang harus dibawa ketika unit dipindahkan.
2. Jangan mengubah batas untuk menghilangkan warning. Timestamp yang tidak cocok dicatat sebagai `review_required`.
3. Jika batas akhir tidak tersedia, statusnya `unknown`, bukan diisi dengan durasi caption atau tebakan.
4. Potongan yang tumpang tindih tidak boleh dipotong otomatis; putuskan setelah memeriksa apakah pengulangan memang disengaja.
5. Materi baru tidak boleh memakai waktu video palsu. HTML slides memiliki bookmark `slideId`/bagian sendiri.

## 2. Prinsip sequencing untuk pemula mutlak

Setiap langkah baru harus menjawab empat hal sebelum siswa melihat kode yang lebih sulit:

- **alat/lingkungan**: di mana kode atau blok dibuat dan bagaimana dijalankan;
- **data**: nilai literal, teks/angka/boolean, variabel, input dan output;
- **kontrol**: urutan, kondisi, pengulangan, dan kapan sebuah blok dipanggil;
- **struktur aplikasi**: list/dictionary atau penyimpanan persisten setelah data dasar dipahami.

Kuis atau proyek tidak boleh meminta konsep yang baru akan diajarkan sesudahnya. Rangkuman dan latihan di bawah materi harus mengulang istilah yang sama dengan video.

## 3. Gap lintas jenjang yang wajib ditutup

| ID tambahan | Penempatan | Media awal | Bekal yang ditutup | Bukti selesai |
|---|---|---|---|---|
| `bridge-hs-00` | sebelum video Python pertama | HTML slides; video baru opsional | Google Colab: buka notebook, buat cell, jalankan, output, simpan/share dengan aman | siswa menjalankan `print("Halo")` dan menjelaskan output |
| `bridge-hs-01` | sebelum input/validasi | HTML slides | urutan instruksi, `print()`, assignment, variabel, string/angka/boolean, operator dasar | siswa menyimpan nilai ke variabel lalu mencetaknya |
| `bridge-hs-02` | sebelum conditional | HTML slides | input menghasilkan teks, konversi `int`, perbandingan, True/False, indentasi | prediksi hasil tiga kondisi dan menjalankan dua kasus |
| `bridge-hs-03` | sebelum loop | HTML slides | list sederhana, `for`, `range`, accumulator, perubahan nilai tiap iterasi | menjumlahkan tiga nominal dan menelusuri tabel iterasi |
| `bridge-hs-04` | sebelum function/validasi berbasis function | HTML slides | `def`, parameter, pemanggilan, `return` vs `print` | fungsi `validate_amount` dipanggil dengan input valid/tidak valid |
| `bridge-hs-05` | sebelum dictionary/list transaksi | HTML slides | key/value, list of dictionaries, akses key, data kosong | membaca satu transaksi dan menambah satu record |
| `bridge-ms-00` | sebelum App Inventor | HTML slides bergambar | akun/proyek, Designer, Palette, Viewer, Components, Blocks, Companion/emulator | siswa menemukan komponen dan menjalankan proyek kosong |
| `bridge-ms-01` | sebelum validasi/form | HTML slides + latihan blok | properti, event `Button.Click`, TextBox/Label, variabel set/get, input → proses → output | tombol mengubah Label dan menyimpan nilai sementara |
| `bridge-ms-02` | sebelum TinyDB | HTML slides | nilai sementara vs persisten, tag/value, StoreValue/GetValue, default | simpan–tutup–buka–muat dan uji tag yang belum ada |
| `bridge-ms-03` | sebelum debugging/proyek | HTML slides | cara membaca error, isolasi blok, uji normal/gagal, privasi data | siswa menyusun tabel kasus uji dan memperbaiki satu bug |

**Prioritas produksi pertama:** `bridge-hs-00`, `bridge-hs-01`, `bridge-ms-00`, `bridge-ms-01`. Tanpa empat jembatan ini, kurikulum masih mengasumsikan pengalaman yang tidak dimiliki pemula.

## 4. Usulan jalur kanonik SMA

Urutan di bawah adalah urutan pedagogis yang disarankan. ID sumber dan waktunya tetap milik video lama; perubahan urutan belum diterapkan ke JSON.

### Fase HS-A — orientasi alat dan fondasi Python

1. `bridge-hs-00` — Google Colab dan cara menjalankan kode.
2. `bridge-hs-01` — output, literal, variabel, tipe data, operator.
3. `hs-0-0` — orientasi asynchronous learning (`yxmLOk5vcFg`); boleh ditempatkan paling awal sebagai orientasi platform, tetapi jangan dianggap sebagai fondasi Python.
4. Potongan pengantar dari `hs-3-1` (`RnyYn2SzFVU`, 2–239) **hanya setelah** bridge; transkrip menunjukkan algoritma, input–proses–output, variabel, dan contoh loop. Bagian ini cocok sebagai fondasi algoritmik, bukan “optimasi” langsung.

### Fase HS-B — input sederhana dan conditional dasar

5. `hs-1-1` (`pKYN1E60xtU`, 9–760): pertahankan sebagai input, masalah input, sanitasi `.strip()`/`.lower()`, dan pengenalan validasi. Jangan menjadikan kuisnya bukti bahwa siswa sudah bisa function.
6. `hs-2-1` (`MLgrQoRo2oo`, batas belum ada): konsep program memilih.
7. `hs-2-2` (`-hYK440Vlr8`, batas belum ada): `if`, `else`, True/False, perbandingan.
8. `hs-2-3` (`_jm2p3pstrM`, batas belum ada): `elif` dan urutan kondisi.
9. `hs-2-4` (`_e3hs1nWuME`, batas belum ada): nested condition; berikan contoh kecil sebelum kasus finansial.
10. `hs-2-5` (`_iRZY0-_skc`, batas belum ada): operator logika; wajib didahului tabel True/False dan contoh dua syarat.

### Fase HS-C — loop dan struktur data dasar

11. `bridge-hs-03` — list, `for`, `range`, accumulator.
12. `hs-3-2` (`RnyYn2SzFVU`, 240–882): pertahankan hanya bagian loop/step count yang sudah dipahami; label “optimasi” jangan muncul sebelum latihan loop dasar.
13. `hs-3-3` (`RnyYn2SzFVU`, 909–1617): optimasi dan pencarian; letakkan sesudah siswa dapat menelusuri loop.
14. `hs-3-4` (`RnyYn2SzFVU`, 1618–1705): mini project optimasi; syarat minimal harus menyebut list, loop, dan kondisi berhenti.

### Fase HS-D — function dan modularisasi

15. `hs-3-5` (`RnyYn2SzFVU`, 1712–3497): function Python. Perlu dipecah secara pedagogis menjadi konsep `def`/pemanggilan → parameter → `return` → function bawaan. Batas asli tetap disimpan; pemecahan adalah unit tampilan, bukan pengubahan video.
16. `hs-3-6` (`hP6MSkerx9A`, 85–723): modular design. Catatan: `hs-3-7` (`626–721`) tumpang tindih; tandai sebagai potongan pengulangan yang perlu keputusan editorial.
17. `hs-3-7` (`hP6MSkerx9A`, 626–721): mini project hanya setelah siswa dapat menjelaskan input, output, dan tanggung jawab setiap function.
18. `hs-3-8` (`hP6MSkerx9A`, 725–unknown): financial literacy; batas akhir belum diketahui.

### Fase HS-E — validasi aman dan data transaksi

19. `hs-1-2` (`pKYN1E60xtU`, 761–1585): pindahkan sesudah conditional dan function dasar. Segmen 1268 (`clean_text`) dan 1415 (`validate_type`/`validate_amount`) secara eksplisit memakai `def`, `return`, dan `if`.
20. `hs-1-3` (`pKYN1E60xtU`, 1590–1695): proyek input transaksi lengkap **setelah** dictionary dasar (`bridge-hs-05`). Dataset proyek memakai `def`, `elif`, `and`, `int(input())`, dan dictionary; tidak cocok sebagai latihan pertama.
21. `hs-4-1` (`pKYN1E60xtU`, 1714–2298): `try/except` dan pengenalan debugging. Letakkan setelah siswa memahami konversi input dan error.
22. `hs-4-2` (`pKYN1E60xtU`, 2301–2356): latihan input aman dengan error handling.
23. `hs-4-3` (`pKYN1E60xtU`, 2362–2949): debugging berantai/function. Pertahankan setelah function.
24. `hs-4-4` (`pKYN1E60xtU`, 2959–2971): mini project debugging; rentang sangat pendek, validasi harus memakai isi source, bukan durasi label.
25. `hs-4-5` (`pKYN1E60xtU`, 3000–3893): dictionary, list of dictionaries, total transaksi. Dahului `bridge-hs-05` dan latihan list/loop.
26. `hs-4-6` (`pKYN1E60xtU`, 3931–4408): analisis `sum`, `max`, `min`, `len`; bookmark 4421 berada di luar `endSeconds` 4408 dan harus `review_required`.

### Fase HS-F — integrasi literasi finansial

27. `hs-2-6` dan `hs-2-7` (`bMsKBaRsKmc`, `hs-2-7` mulai 2137, akhir tidak diketahui): studi kasus kebutuhan/keinginan dan planner. Materi ini dapat menjadi konteks setelah conditional; bagian yang memakai input/variabel harus diberi bridge bila ditempatkan lebih awal.
28. `hs-5-1` (`S1j2gt3Up74`, 3–1102): design thinking dan kebutuhan pengguna.
29. `hs-5-2` (`S1j2gt3Up74`, 1107–2231): flowchart/use case.
30. `hs-5-3` (`S1j2gt3Up74`, 2231–2615): analisis transaksi.
31. `hs-5-4` (`S1j2gt3Up74`, 2619–2974): logika rekomendasi.
32. `hs-5-5` (`S1j2gt3Up74`, 2989–3662): integrasi proyek akhir.

### Temuan isi penting SMA

- Transkrip `pKYN1E60xtU` menyebut variabel, `print`, `input`, `if`, loop, function, `try/except`, list, dictionary, dan debugging dalam satu video panjang. Ini berarti video merupakan sumber materi campuran; **jangan menganggap urutan menit asli sebagai urutan prasyarat**.
- Kuis `hs-1-2` menguji `clean_text`, `return`, `if amount <= 0`, dan validasi. Kuis itu harus tetap berada bersama segmen validasi, tetapi setelah bridge function.
- Proyek `hs-1-3` menguji dictionary sebelum langkah dictionary formal; tindakan yang disarankan adalah memindahkan proyek atau menyediakan card dictionary sebelum proyek, bukan mengubah expected code diam-diam.

## 5. Usulan jalur kanonik SMP

SMP menggunakan MIT App Inventor; istilah Python tidak dipaksakan. Urutan harus dimulai dari mengenali lingkungan visual dan event.

### Fase MS-A — orientasi App Inventor dan input/output

1. `ms-0-0` (`yxmLOk5vcFg`, mulai 0, akhir unknown): orientasi async.
2. `bridge-ms-00`: Designer, Palette, Viewer, Components, Blocks, cara menjalankan proyek.
3. `bridge-ms-01`: event `Button.Click`, properti `.Text`, Label, variabel set/get, input → proses → output.
4. `ms-1-1` (`UhutS4BVKhk`, 0–1338): input aman, komponen form, validasi kosong/angka/nilai masuk akal. Video ini sudah menyebut event, `if/else`, `not`, `or`; karena itu bridge harus muncul sebelum video, bukan sesudahnya.

### Fase MS-B — algoritma, flowchart, dan validasi

5. `ms-1-3` (`UhutS4BVKhk`, 1394–2079): flowchart dan alur data.
6. `ms-1-2` (`UhutS4BVKhk`, 1349–1392): mini project form aman; dapat diletakkan sesudah penjelasan input dan sebelum flowchart sebagai praktik awal, tetapi jangan menyebut proyek “selesai” sebelum flowchart.
7. `ms-1-4` (`UhutS4BVKhk`, 2096–2572): data dan privacy. Materi keamanan/privasi harus memakai data contoh, bukan data siswa nyata.
8. `ms-1-5` (`UhutS4BVKhk`, 2584–2618): mini project “Cek Pesan Aman”; judul proyek mengharuskan siswa memahami form, kondisi, dan privasi.
9. `ms-1-6` (`cWfbcaSg7Eo`, 2–887) dan `ms-1-7` (`899–1701`): eksplorasi data pribadi dan etika. Pindahkan bagian yang menyebut database/variabel ke sesudah TinyDB atau tandai sebagai wawasan, bukan prasyarat.

### Fase MS-C — percabangan blok dan konteks finansial

10. `ms-2-1` (`tDkIcceTzII`, 3–472): percabangan ganda.
11. `ms-2-2` (`tDkIcceTzII`, 484–721): implementasi di App Inventor.
12. `ms-2-3` dan `ms-2-4` (`733–1173`, `1181–1593`): literasi keuangan; pastikan contoh nilai dan kondisi diperkenalkan sebelum blok gabungan.
13. `ms-2-5` (`1605–1908`): App Inventor + finansial.
14. `ms-2-6` (`1922–unknown`): final project; akhir unknown.

### Fase MS-D — procedures dan debugging

15. `ms-3-1` (`P8Ea0v8Gy2o`, 4–794): procedures; transkrip menjelaskan function/procedure dan mengapa modularisasi membantu.
16. `ms-3-2` (`798–879`): mini project kalkulator.
17. `ms-3-3` (`883–1194`): optimasi/modularisasi.
18. `bridge-ms-03`: debugging dasar dan tabel kasus uji.
19. `ms-3-4` (`1201–1685`): uji coba/debugging; perlu dipisahkan dari bagian yang mengasumsikan TinyDB jika ada.
20. `ms-3-5` (`1704–2008`): presentasi/refleksi.

### Fase MS-E — TinyDB dan penyimpanan persisten

21. `bridge-ms-02`: tag/value, StoreValue/GetValue, default value, perbedaan sementara vs persisten.
22. `ms-4-1` (`cWfbcaSg7Eo`, 1715–2547): penyimpanan dengan TinyDB.
23. `ms-4-2` (`2555–3272`): mengelola data aman di TinyDB.
24. `ms-4-3` (`3285–3323`): mini project TinyDB.
25. `ms-4-4` (`UhutS4BVKhk`, 2621–2844), `ms-4-5` (`2847–3000`), `ms-4-6` (`3155–3683`): materi finansial/keamanan; letakkan setelah konsep data dan penyimpanan yang diperlukan.

### Fase MS-F — proyek akhir

26. `ms-5-1` (`P8Ea0v8Gy2o`, 2018–2261) dan `ms-5-2` (`2267–2303`): merancang solusi; gunakan sebagai brief dan refleksi sebelum implementasi akhir.
27. `ms-5-3` (`UhutS4BVKhk`, 3700–unknown): final project, akhir unknown. Rubrik harus menyebut komponen minimal, alur input, validasi, penyimpanan, uji normal/gagal, dan privasi.

### Temuan isi penting SMP

- Caption `UhutS4BVKhk` menunjukkan materi input aman sebenarnya mencakup TextBox, ListPicker, Notifier, `Button.Click`, `if/else`, `not`, `or`, flowchart, privacy, variabel, dan error. Ini bukan satu konsep tunggal; langkah harus dipecah di tampilan LMS agar pemula tidak menerima semua istilah sekaligus.
- Caption `cWfbcaSg7Eo` menyebut database lokal dan variabel sebelum langkah TinyDB yang diekspor. Bagian tersebut perlu dipetakan ulang: wawasan boleh muncul sebagai konteks, tetapi pengajaran StoreValue/GetValue harus tetap berada setelah `bridge-ms-02`.
- `ms-3-4` memiliki titik start 1201, sedangkan audit sebelumnya menemukan bookmark 803 pada `ms-3-1`/segmen yang berbeda. Semua bookmark harus dibandingkan ke `sourceStepId`, bukan hanya `videoId`.

## 6. Ledger tindakan per langkah sumber

| Kelompok | Tindakan awal | Alasan |
|---|---|---|
| Orientasi (`hs-0-0`, `ms-0-0`) | pertahankan, pindahkan sebagai orientasi platform | tidak mengajarkan bahasa/alat coding |
| Video dengan batas lengkap | pertahankan batas dan bookmark; boleh dipindah sebagai unit | sumber timing adalah keputusan kurasi |
| Video tanpa batas (`hs-2-1` s.d. `hs-2-6`, beberapa akhir proyek) | gunakan video penuh hanya jika sumber menyatakan demikian; tandai `unknown` | jangan mengarang `endSeconds` |
| Segmen panjang bercampur konsep (`hs-1`, `hs-3`, `ms-1`, `ms-4`) | tampilkan sebagai substep/chapters dengan prasyarat dan rangkuman | satu video memuat beberapa tingkat kesulitan |
| Proyek yang menguji konsep mendatang (`hs-1-3`, beberapa final project) | pindahkan sesudah bridge atau siapkan card sebelum proyek | mencegah asesmen prasyarat yang belum diajarkan |
| Segmen tumpang tindih (`hs-3-6`/`hs-3-7`) | review editorial manual | belum boleh diasumsikan duplikasi atau bug |
| Kuis timestamp `99999` | ubah status menjadi manual trigger/review, bukan angka baru | timestamp di luar segmen tidak valid untuk autoplay |

## 7. Backlog HTML slides yang dapat langsung diproduksi

### `hs-bridge-00` — “Membuka Python pertama kali di Google Colab”

- 6–8 slide: apa itu Python, buka Colab, New Notebook, code cell, `print`, Run, output, rename/share.
- Bookmark: `overview`, `open-colab`, `run-cell`, `read-output`, `safe-share`.
- Latihan: jalankan `print("Halo, UOB!")`; checklist “aku melihat output”.
- Rangkuman: notebook, cell, run, output.

### `hs-bridge-01` — “Variabel dan tipe data tanpa takut”

- 7–9 slide: literal → assignment → variabel → string/int/float/bool → operator → `print`.
- Latihan: `nama`, `umur`, `saldo`; prediksi tipe data dan output.
- Wajib menjelaskan bahwa teks `"10"` bukan angka `10`.

### `hs-bridge-02` — “Dari input ke keputusan”

- `input()` selalu menghasilkan teks; konversi `int`; perbandingan; True/False; indentasi.
- Latihan prediksi `if/else` tiga kasus; belum memakai function.

### `hs-bridge-03` — “List dan loop pertama”

- list nominal, `for`, `range`, accumulator; tabel langkah per iterasi.
- Latihan total tiga nominal dan kasus list kosong.

### `hs-bridge-04` — “Function: input, proses, return”

- `def`, parameter, pemanggilan, `return` vs `print`, scope sederhana.
- Latihan `validate_amount(amount)` dan dua test case.

### `hs-bridge-05` — “Dictionary transaksi”

- key/value, akses `transaction["amount"]`, list of dictionaries, tambah record.
- Latihan baca dan tambah transaksi; belum memakai analisis lanjutan.

### `ms-bridge-00` — “Tur App Inventor”

- screenshot/diagram Designer, Palette, Viewer, Components, Blocks, Companion/emulator.
- Bookmark `designer`, `components`, `blocks`, `run`.

### `ms-bridge-01` — “Event, properti, dan variabel blok”

- `when Button.Click`, `TextBox.Text`, set Label, set/get variable, input–proses–output.
- Latihan tombol sapaan dan status valid/tidak valid.

### `ms-bridge-02` — “TinyDB sebelum menyimpan”

- memori sementara vs persisten, tag/value, StoreValue/GetValue, default value, tutup-buka app.
- Latihan menyimpan nama samaran; larangan menyimpan password/PIN/data sensitif.

### `ms-bridge-03` — “Debugging blok dengan aman”

- baca pesan error, cek satu blok, tabel input normal/kosong/salah, uji ulang.
- Latihan menemukan satu kabel/blok salah dan screenshot hasil uji.

Semua slides di atas harus memiliki rangkuman di bawah viewer, navigasi sebelumnya/berikutnya, daftar bookmark, kontrol ukuran/fullscreen, dan status selesai membaca. Detail renderer ada di `planning/03-implementation-plan-lms-video-html-slides.md`.

## 8. Temuan timestamp yang harus tetap terbuka

| Step | Temuan | Keputusan |
|---|---|---|
| `hs-4-6` | bookmark 4421 > `endSeconds` 4408 | `review_required`; jangan mengubah angka |
| `hs-5-1` | bookmark 2 < `startSeconds` 3 | cek apakah bookmark intro sengaja berada sebelum potongan |
| `ms-1-4` | bookmark 2591 > `endSeconds` 2572 | `review_required` |
| `ms-3-1` | bookmark 803 > `endSeconds` 794 | `review_required` |
| `hs-1-3`, `hs-4-4` | quiz time 99999 di luar segmen | ubah kontrak menjadi manual/project checkpoint setelah disetujui, tanpa menebak waktu |
| `hs-3-6`, `hs-3-7` | overlap 626–721 vs 85–723 | keputusan editorial: ulangi atau pecah |
| beberapa langkah | `endSeconds` unknown | pertahankan unknown sampai sumber dikonfirmasi |

## 9. Kriteria persetujuan sebelum dataset diubah

- Semua source step punya `sourceStepId`, video ID, batas asli, dan status timestamp.
- Setiap materi tambahan punya tujuan, prasyarat, isi, latihan, rangkuman, dan bookmark.
- Tidak ada kuis/proyek yang meminta `def`, `return`, dictionary, TinyDB, atau Google Colab sebelum bridge terkait.
- Mapping per langkah sinkron dengan JSON; tidak hanya tabel per grup.
- Video dengan caption otomatis diberi label sumber caption; klaim visual final menunggu peninjauan rekaman.
- User menyetujui urutan kanonik dan daftar slides sebelum produksi/injeksi dataset.

**Kesimpulan:** mapping tahap pertama **belum “sudah oke” untuk langsung dipakai sebagai jalur pemula**. Ia sudah menjadi inventaris sumber yang berguna. Perubahan yang aman sekarang adalah menyelesaikan bridge slides, keputusan urutan, dan timestamp review terlebih dahulu; dataset produksi dan player tidak diubah secara diam-diam.
