# Review tahap pertama mapping SMP–SMA

Tanggal: 2026-09-08. Status: review selesai; rekomendasi belum diimplementasikan pada dataset.

## Kesimpulan dan batas pemeriksaan

Mapping membantu sebagai inventaris awal, tetapi belum layak dinyatakan tervalidasi untuk pemula mutlak. Audit ini membaca mapping Markdown, struktur seluruh langkah pada dua JSON, bookmark, dan contoh latihan/bacaan yang relevan. Video belum ditonton penuh; keberadaan pengajaran suatu konsep dalam rekaman perlu verifikasi audiovisual. “Belum terpetakan” tidak otomatis berarti tidak ada dalam video.

Dua subproject tetap terpisah: platform menangani pengalaman belajar dan penyimpanan progres; curriculum sequencing menentukan isi, prasyarat, urutan, dan latihan. Fokus review ini adalah sequencing SMP–SMA.

## Temuan yang harus diperbaiki

| Prioritas | Bukti dalam dataset | Masalah | Rekomendasi |
|---|---|---|---|
| Wajib | hs-1-2, bookmark 1268 dan 1415; kuis 1583 | Modul awal sudah meminta function, return, if/else, boolean, dan perbandingan; pengantarnya baru Modul 2–3 | Pindahkan validasi berbasis function setelah conditional dan function dasar |
| Wajib | hs-1-3, expectedCode dan instruksi proyek | Proyek pertama memakai def, elif, and, int(input()), dan dictionary; dictionary baru Modul 4 | Pindahkan proyek lengkap setelah dictionary; latihan awal cukup input → variabel → output |
| Wajib | hs-3-2, bookmark 420/480/750; hs-3-3 | Mencari angka pada array, for, break, dan optimasi muncul tanpa pengantar list/loop yang jelas | Ajarkan list sederhana, penelusuran loop dan accumulator sebelum optimasi; cek apakah segmen lama cukup sebagai pengantar |
| Wajib | ms-1-1, summaryHtml dan kuis | Bacaan pertama memakai event Click, properti Text, if/else if, not, or, dan pemeriksaan angka sebelum modul percabangan | Tambahkan praktik event dan data; pindahkan implementasi validasi setelah percabangan dasar |
| Wajib | ms-3-4, bookmark 1556 | TinyDB disebut dalam debugging sebelum pengantar TinyDB di ms-4-1 | Pecah segmen debugging: debugging umum lebih awal, bagian TinyDB sesudah pengantar penyimpanan |
| Perlu | Mapping SMA Grup B dibanding hs-3-5 | Mapping mengelompokkan Functions in Python pada hP6MSkerx9A, tetapi JSON menunjuk RnyYn2SzFVU 1712–3497 | Samakan inventaris dengan ID/rentang yang telah diverifikasi pada video |
| Perlu | Mapping SMP dibanding JSON | Modul 1 juga memuat Grup B; Modul 4 dan 5 juga memuat Grup A, belum tercermin pada tabel mapping | Buat pemetaan per langkah, bukan hanya per grup |

## Materi jembatan yang dibutuhkan

Status di bawah adalah kebutuhan yang belum terpetakan jelas sebagai pengantar terpisah; periksa rekaman sebelum memutuskan membuat materi baru.

| Jenjang | Sebelum materi | Bekal minimal | Latihan bukti pemahaman |
|---|---|---|---|
| SMA | Input dan conditional | Cara menjalankan Python, urutan instruksi, print, assignment, variabel, string/angka/boolean, operator dasar; input menghasilkan teks dan konversi angka | Input nama dan nominal contoh valid, simpan, lalu tampilkan; bedakan teks “10” dan angka 10 |
| SMA | Conditional bertingkat | Perbandingan, boolean, indentasi, if/else sederhana; operator logika sebelum soal yang memakainya | Prediksi cabang untuk nilai kurang dari, sama dengan, dan lebih dari batas |
| SMA | Optimasi loop | List dasar, for/range, penelusuran iterasi, accumulator; while dan kondisi berhenti bila dipakai | Jumlahkan tiga nominal dan jelaskan perubahan total tiap iterasi |
| SMA | Validasi berbasis function | def, pemanggilan, parameter, return, conditional; bedakan menampilkan dan mengembalikan nilai | Buat dan panggil fungsi pengecek nominal positif |
| SMA | Safe Transaction Input | Dasar dictionary key/value dan akses data; konversi input, validasi dan penanganan kegagalan konversi | Uji input kosong, teks pada nominal, nol, negatif, serta input valid |
| SMA | Analisis transaksi | List of dictionaries, iterasi record, sum/len dan kondisi data kosong | Hitung total sederhana dan tentukan respons jika tidak ada transaksi |
| SMP | Form dan validasi | Designer/Blocks, komponen dan properti, event Button.Click, variabel set/get, angka/teks, input → proses → output | Klik tombol untuk menyimpan nilai sementara dan mengubah Label |
| SMP | Form aman | Perbandingan, boolean, if/then/else sederhana sebelum else-if dan not/or | Cek nama kosong dan angka valid dengan dua kasus uji |
| SMP | TinyDB | Nilai sementara vs persisten, tag/value, StoreValue/GetValue, nilai default ketika tag belum ada; event simpan/muat | Simpan nama samaran, tutup/buka aplikasi, muat; uji tag yang belum tersedia |
| SMP | Procedures | Urutan instruksi, blok berulang, call, parameter, hasil bila diperlukan | Bungkus hitungan sederhana dan panggil dari tombol |
| Keduanya | Proyek akhir | Brief, fitur minimal, hasil yang dikumpulkan, dan rubrik yang eksplisit | Demonstrasikan fitur, jelaskan alur data, dan jalankan kasus uji normal serta gagal |

Tidak perlu menjadikan setiap jembatan sebuah video baru. Gunakan bacaan visual/contoh kerja → latihan terbimbing → latihan mandiri dengan umpan balik. Durasi 2 menit dan satu kartu belum dapat dijanjikan cukup untuk seluruh fondasi.

## Koreksi konsep prasyarat

Functions/procedures bukan syarat teknis mutlak sebelum TinyDB; operasi simpan/muat dapat dipanggil langsung dari event. Untuk jalur pemula ini, pemahaman nilai, event, properti, serta tag/value lebih mendasar. Variabel membantu menjelaskan data sementara, tetapi contoh TinyDB minimal juga dapat memakai properti TextBox secara langsung. Branching diperlukan ketika latihan memvalidasi input atau menangani kondisi tertentu, bukan sebagai syarat universal setiap operasi penyimpanan. TinyDB memberi persistensi, bukan jaminan keamanan data.

Sumber teknis: [MIT App Inventor — TinyDB](https://ai2.appinventor.mit.edu/reference/components/storage.html#TinyDB). Urutan pedagogis di sini merupakan rekomendasi reviewer berdasarkan tugas pada dataset, bukan urutan wajib dari MIT.

Input interaktif juga bukan syarat mutlak mempelajari if: contoh awal boleh memakai variabel bernilai tetap. Definisi function, parameter, return dan control flow dapat dirujuk pada [Python Tutorial](https://docs.python.org/3/tutorial/controlflow.html).

## Urutan usulan

- SMA: Orientasi → menjalankan kode/output/variabel/tipe data → input sederhana dan operator → conditional → list dan loop dasar → optimasi → function → sanitasi/validasi → penanganan error → dictionary/list transaksi → proyek input lengkap → analisis dan proyek integrasi. Debugging sederhana diperkenalkan sejak latihan pertama.
- SMP: Orientasi → Designer/Blocks/event → data/variabel/input-output → flowchart dasar dan conditional → validasi/form aman → TinyDB dasar → procedures/modularisasi → debugging integrasi → proyek akhir/refleksi. Procedures boleh sebelum TinyDB jika contoh latihannya tidak mengandalkan TinyDB. Privasi dasar masuk sebelum latihan mengumpulkan data; gunakan data contoh.

Ini urutan konsep usulan, belum merupakan revisi nomor modul ataupun batas potongan video. Potongan video hanya dipindah setelah konteks sebelum/sesudahnya diverifikasi.

## Konsistensi timestamp yang ditemukan

- hs-4-6: bookmark 4421 melewati endSeconds 4408.
- hs-5-1: bookmark 2 mendahului startSeconds 3.
- ms-1-4: bookmark 2591 melewati endSeconds 2572.
- ms-3-1: bookmark 803 melewati endSeconds 794.
- hs-1-3 dan hs-4-4: quiz time 99999 di luar segmen; mungkin penanda proyek manual dari player lama. Perlu kontrak pemicu eksplisit sebelum menyebut dataset siap LMS, bukan otomatis menggantinya dengan timestamp tebakan.
- hs-3-6 (85–723) dan hs-3-7 (626–721) tumpang tindih pada video yang sama; tentukan apakah pengulangan instruksi memang disengaja.

## Kriteria sebelum dinyatakan siap

Setiap langkah perlu tujuan belajar, prasyarat, bukti segmen, status tersedia/belum terverifikasi/perlu tambahan, tindakan pertahankan/pindahkan/pecah/tambah, dan latihan pengecekan. Verifikasi video pada titik penggunaan konsep pertama, sinkronkan mapping dengan JSON, pastikan tugas tidak menguji konsep sebelum diajarkan, serta periksa pemicu kuis dan rubrik proyek. JSON yang dapat diparse belum membuktikan urutan pedagogis atau integrasi player sudah benar.
