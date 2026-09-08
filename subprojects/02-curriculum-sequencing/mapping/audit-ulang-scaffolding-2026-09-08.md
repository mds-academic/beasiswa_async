# Audit Ulang Scaffolding Materi SMP–SMA

Tanggal: 2026-09-08  
Status: **audit selesai; dataset produksi belum disetujui untuk diubah**

## Kesimpulan eksekutif

Hasil kerja saat ini **sudah benar sebagai inventarisasi dan draft sequencing**, tetapi **belum benar-benar scaffolding untuk pemula nol**. Struktur modul terlihat rapi, namun prasyaratnya belum terhubung secara operasional ke jalur belajar LMS.

Penilaian ringkas:

| Area | Status | Catatan |
|---|---|---|
| Arah besar urutan konsep | **cukup benar** | Dari orientasi → data/logika → struktur → proyek |
| Audit sumber dan preservasi timestamp | **baik sebagai draft** | Anomali sudah dicatat, tetapi masih ada di JSON |
| Scaffolding SMA | **belum selesai** | `bridge-hs-01` sampai `bridge-hs-05` belum menjadi materi HTML/LMS |
| Scaffolding SMP | **belum selesai** | `bridge-ms-01` sampai `bridge-ms-03` belum menjadi materi HTML/LMS |
| Kesiapan dataset untuk produksi | **belum siap** | Masih ada quiz `99999`, bookmark di luar segmen, dan bridge belum di-inject |
| Kesiapan SD | **template saja** | Belum dapat dianggap materi produksi |

## 1. Temuan paling penting: bridge yang direncanakan belum benar-benar hadir

Review kanonik mensyaratkan:

- SMA: `bridge-hs-00` sampai `bridge-hs-05`
- SMP: `bridge-ms-00` sampai `bridge-ms-03`

Di folder `slides/` yang tersedia sebagai HTML hanya:

- `bridge-hs-00.html`
- `bridge-ms-00.html`

`bridge-hs-01.json` dan `bridge-ms-01.json` memang sudah ada sebagai spesifikasi isi, tetapi belum menjadi HTML slides yang dapat dibaca siswa dan belum direferensikan sebagai langkah tersendiri dalam `courseData-highschool.json` atau `courseData-middleschool.json`.

Akibatnya, dataset saat ini masih menjalankan jalur lama:

- SMA langsung masuk ke `hs-1-1` yang mengandung input, sanitasi, validasi, `if`, function, dan `return`.
- SMP langsung masuk ke `ms-1-1` yang sudah memakai event, form, `if/else`, `not`, dan `or`.

`slideUrl` pada `hs-0-0`, `ms-0-0`, dan `ms-0-4` belum sama dengan “bridge sebagai prasyarat”. Ia masih menempel pada orientasi atau satu langkah tambahan; belum ada gate yang memastikan siswa menyelesaikan bekal sebelum video berikutnya.

## 2. Audit jenjang SMA

### Yang sudah benar

1. Arah besar conditional → loop → function → error handling/data → proyek sudah masuk akal.
2. Video lama dipotong dengan `startSeconds`/`endSeconds` dan bookmark, bukan diputar penuh tanpa kurasi.
3. `bridge-hs-00` sudah mencakup Colab, code cell, `print()`, run, variabel, tipe data, latihan, dan kuis.
4. `bridge-hs-01.json` sudah mengidentifikasi materi yang tepat: assignment, string, integer/float, boolean, operator, dan perbedaan `"10"` dengan `10`.

### Yang belum benar atau belum lengkap

1. **`bridge-hs-00` terlalu banyak mengambil wilayah `bridge-hs-01`.** Slide 9–10 sudah mengajarkan variabel dan tipe data, tetapi dataset belum menandainya sebagai bekal formal untuk modul berikutnya. Pilih salah satu:
   - `hs-00`: fokus alat dan `print()` saja, lalu `hs-01`: variabel dan tipe data; atau
   - tetap gabungkan, tetapi deklarasikan eksplisit sebagai dua subbagian dengan dua checkpoint kompetensi.
2. **Belum ada jembatan eksplisit dari `input()` ke conditional.** Siswa perlu melihat bahwa `input()` menghasilkan string, lalu `int()` mengubahnya menjadi angka, baru hasilnya dibandingkan.
3. **Validasi terlalu dini.** `hs-1-2` menguji `clean_text`, `return`, `if amount <= 0`, dan function. Ini tidak cocok sebagai pelajaran awal hanya karena judulnya “input”.
4. **Proyek `hs-1-3` terlalu berat untuk Modul 1.** Ia menggunakan `def`, `elif`, `and`, `int(input())`, dan dictionary. Pindahkan setelah `bridge-hs-04` dan `bridge-hs-05`, atau ubah menjadi latihan input sederhana tanpa function/dictionary.
5. **Loop dimulai dengan optimasi.** `hs-3-1` memang memberi pengantar algoritma, tetapi siswa tetap membutuhkan contoh `for`, `range`, list sederhana, dan accumulator sebelum `hs-3-2`/`hs-3-3`.
6. **Function terlalu panjang sebagai satu unit.** `hs-3-5` perlu tampilan subbagian: `def` → parameter → pemanggilan → `return` → function bawaan. Jangan mengubah timestamp sumber; pecah pada level chapter/LMS.
7. **Dictionary muncul sebagai kebutuhan proyek sebelum diajarkan.** `bridge-hs-05` wajib hadir sebelum proyek transaksi dan sebelum `hs-4-5`.

### Jalur SMA yang disetujui secara pedagogis

1. `bridge-hs-00`: Colab, cell, run, output.
2. `bridge-hs-01`: variabel, tipe data, operator.
3. `hs-1-1`: `input()` sederhana dan sanitasi dasar, tanpa function.
4. `bridge-hs-02`: konversi tipe, perbandingan, boolean, indentasi.
5. `hs-2-1` sampai `hs-2-5`: conditional.
6. `bridge-hs-03`: list, `for`, `range`, accumulator.
7. `hs-3-1` sampai `hs-3-4`: loop dan optimasi.
8. `bridge-hs-04`: function, parameter, `return`.
9. `hs-3-5` sampai `hs-3-7`: function dan modularisasi.
10. `bridge-hs-05`: dictionary dan list of dictionaries.
11. `hs-1-2`/`hs-1-3`, `hs-4-1` sampai `hs-4-6`: validasi lanjutan, error handling, debugging, analisis data.
12. `hs-5-1` sampai `hs-5-5`: proyek integrasi.

## 3. Audit jenjang SMP

### Yang sudah benar

1. App Inventor dipilih sebagai bahasa visual yang sesuai untuk transisi pemula.
2. Modul event, input-output, conditional, procedures, TinyDB, dan proyek sudah tersedia sebagai bahan sumber.
3. `bridge-ms-01.json` sudah memiliki pola yang tepat: `Button.Click` → `TextBox.Text` → proses/join → `Label.Text` → variabel sementara.
4. Materi TinyDB sudah menjelaskan `StoreValue`, `GetValue`, tag, value, nilai default, dan `ClearTag`.

### Yang belum benar atau belum lengkap

1. **`bridge-ms-00.html` mengajarkan TinyDB terlalu awal.** Pada slide 8–13, TinyDB muncul di Modul 0 sebelum siswa mempelajari event, variabel, conditional, dan input-output. Ini bertentangan dengan prinsip konkret → abstrak. Tur App Inventor harus berhenti pada Designer, Components, Blocks, event, dan menjalankan proyek kosong.
2. **`ms-0-4` memakai bridge yang sama untuk dua fungsi.** `ms-0-4` adalah slide TinyDB, tetapi diletakkan di modul orientasi. Pisahkan menjadi:
   - `bridge-ms-00`: tur platform;
   - `bridge-ms-01`: event, properti, input-output, variabel;
   - `bridge-ms-02`: TinyDB.
3. **`ms-1-1` masih terlalu padat.** Materi input aman sekaligus memakai event, `if/else`, `not`, `or`, validasi, flowchart, dan privasi. Siswa perlu melihat `Button.Click` dan variabel melalui `bridge-ms-01` terlebih dahulu.
4. **TinyDB baru muncul setelah debugging.** `ms-3-4` dan beberapa bacaan debugging menyebut TinyDB sebelum jalur TinyDB formal. Pindahkan penyebutan itu menjadi wawasan opsional atau beri card pengantar sebelum siswa membacanya.
5. **`ms-4-4` sampai `ms-4-6` mencampur ulang materi finansial/keamanan dari sumber lama.** Pastikan langkah tersebut tidak mengulang konsep sebelum TinyDB dan tidak dijadikan prasyarat untuk proyek akhir tanpa rubrik uji.
6. **Belum ada `bridge-ms-03` yang benar-benar menjadi materi.** Debugging perlu latihan tabel kasus: input normal, kosong, non-angka, tag belum ada, dan data yang harus dihapus.

### Jalur SMP yang disetujui secara pedagogis

1. `ms-0-0`: orientasi belajar.
2. `bridge-ms-00`: tur Designer, Palette, Viewer, Components, Blocks, dan cara menjalankan proyek kosong.
3. `bridge-ms-01`: event, properti, input-output, variabel sementara.
4. `ms-1-1` sampai `ms-1-5`: form, validasi, flowchart, dan privasi.
5. `ms-2-1` sampai `ms-2-6`: conditional dan konteks finansial.
6. `ms-3-1` sampai `ms-3-3`: procedures dan modularisasi.
7. `bridge-ms-03`: debugging dasar dan tabel kasus uji.
8. `ms-3-4` sampai `ms-3-5`: debugging dan refleksi.
9. `bridge-ms-02`: memori sementara vs persisten, tag/value, default.
10. `ms-4-1` sampai `ms-4-6`: TinyDB dan keamanan data.
11. `ms-5-1` sampai `ms-5-4`: proyek akhir dan publikasi.

## 4. Audit teknis dataset yang memengaruhi pedagogi

Temuan berikut harus tetap terbuka dan tidak boleh dianggap sudah “beres”:

| Step | Temuan |
|---|---|
| `hs-1-3`, `hs-3-4`, `hs-3-7`, `hs-4-4` | quiz memakai waktu `99999`; harus menjadi manual checkpoint, bukan autoplay |
| `hs-2-7`, `ms-2-6`, `ms-5-3` | proyek memiliki `endSeconds` unknown; jangan menebak batas |
| `hs-4-6` | bookmark `4421` melewati `endSeconds 4408` |
| `hs-5-1` | bookmark `2` berada sebelum `startSeconds 3`; perlu keputusan editorial |
| `hs-5-3` | ditemukan quiz `time 150` yang berada sebelum segmen `2231–2615`; perlu cek sourceStepId |
| `ms-1-4` | bookmark `2591` melewati `endSeconds 2572` |
| `ms-3-1` | bookmark `803` melewati `endSeconds 794` |
| `ms-4-4` | quiz `time 120` berada sebelum segmen `2621–2844` |
| `hs-3-6`/`hs-3-7` | segmen overlap `626–721`; perlu keputusan apakah pengulangan atau potongan berbeda |

## 5. Tambahan yang wajib dibuat

### Prioritas P0 — agar jalur pemula dapat dipakai

1. Buat HTML final untuk `bridge-hs-01`, `bridge-hs-02`, `bridge-hs-03`, `bridge-hs-04`, `bridge-hs-05`.
2. Buat HTML final untuk `bridge-ms-01`, `bridge-ms-02`, `bridge-ms-03`.
3. Tambahkan setiap bridge sebagai step terpisah dengan `type: "slide"`, `slideUrl`, tujuan, prasyarat, latihan, rangkuman, dan bukti selesai.
4. Hapus atau pindahkan TinyDB dari `bridge-ms-00`.
5. Ubah semua quiz `99999` menjadi manual/project checkpoint sesuai kontrak LMS.

### Prioritas P1 — agar scaffolding dapat diverifikasi

Setiap step harus memiliki:

- prasyarat eksplisit;
- tujuan belajar yang dapat diamati;
- istilah inti;
- latihan kecil sebelum kuis;
- kuis yang hanya memakai konsep yang sudah diajarkan;
- kriteria selesai;
- hubungan ke step berikutnya.

### Prioritas P2 — kualitas pembelajaran

- Tambahkan contoh salah dan perbaikannya, bukan hanya definisi.
- Tambahkan kasus batas: input kosong, angka negatif, list kosong, tag belum ada, dan data sensitif.
- Pisahkan “konteks literasi finansial” dari “konsep coding” agar siswa tidak belajar dua beban baru sekaligus.
- Tambahkan rubrik proyek yang menilai proses: input, proses, output, uji normal, uji gagal, privasi, dan penjelasan siswa.

## Keputusan audit

**Belum disetujui sebagai kurikulum final.** Yang sudah dapat disetujui adalah arah sequencing dan daftar bridge. Yang belum dapat disetujui adalah klaim bahwa materi saat ini sudah scaffolding, karena bridge belum lengkap dan belum dihubungkan sebagai prasyarat di dataset.

Urutan kerja paling aman:

1. Finalisasi isi bridge yang sudah berbentuk JSON.
2. Produksi HTML bridge yang belum ada.
3. Revisi sequencing dataset baru di folder output baru, tanpa menyentuh sumber lama.
4. Jalankan validasi prasyarat, timestamp, quiz, bookmark, dan tautan slide.
5. Uji coba dengan satu siswa pemula atau reviewer non-coding.
