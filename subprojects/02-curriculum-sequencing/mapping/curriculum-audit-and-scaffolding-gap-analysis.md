> **Status review 2026-09-08: draft, belum tervalidasi untuk pemula.** Ada prasyarat yang terlewat dan ketidaksesuaian mapping–JSON. Lihat [review tahap pertama](review-tahap-1-smp-sma.md). Isi awal di bawah dipertahankan sebagai konteks audit sebelumnya.

# Audit Kurikulum Eksisting & Analisis Kesenjangan Pedagogis (Scaffolding Gap Analysis)
## Program Asinkronus Koding UOB My Digital Space

Dokumen ini memetakan seluruh aset materi video yang sudah ada di repositori lama (`Academic_Content/B2B/UOB/Async`), mengevaluasi kesenjangan (*gaps*) bagi siswa pemula mutlak (*zero coding experience*), serta menyusun ulang alur materi yang ada saat ini agar memiliki progresi belajar yang logis dan bertahap.

---

## 1. Inventarisasi Materi Video Eksisting

Berdasarkan pembacaan langsung dari berkas `courseData.js` lama, berikut adalah seluruh video yang tersedia:

### A. Jenjang SMA (High School)
- **Grup A (sesi 25-26)**:
  - Video 00: *Introduction to Async Learning* (`yxmLOk5vcFg`)
  - Video 1: *Bagaimana Program Bisa Memilih?* (`MLgrQoRo2oo`) — 0 Kuis
  - Video 2: *Menulis Conditional di Python* (`-hYK440Vlr8`) — 3 Kuis
  - Video 3: *Multi Branch Conditionals* (`_jm2p3pstrM`) — 1 Kuis
  - Video 4: *Nested Conditionals* (`_e3hs1nWuME`) — 1 Kuis
  - Video 5: *Logical Operator* (`_iRZY0-_skc`) — 3 Kuis
  - Video 6: *Needs vs Wants & Risks* (`bMsKBaRsKmc`) — 4 Kuis
  - Tab 7: *Smart Budget & Risk Planner (Mini Project)*
- **Grup B (sesi 27-29)**:
  - Video 00: *Introduction to Async Learning* (`yxmLOk5vcFg`)
  - Video 1-3: *Optimasi Loop & Step Count, Algoritma Efisien* (`RnyYn2SzFVU`) — 3 Kuis
  - Tab 4: *Mini Project Optimasi*
  - Video 5-6: *Functions in Python & Modular Design* (`hP6MSkerx9A`) — 5 Kuis
  - Tab 7: *Mini Project*
  - Tab 8: *Financial Literacy (Bunga Tunggal & Majemuk)* — 2 Kuis
- **Grup C (sesi 30-32)**:
  - Video 00: *Introduction to Async Learning* (`yxmLOk5vcFg`)
  - Video 1-2: *Input, Validasi, dan Sanitasi Teks (.strip(), .lower())* (`pKYN1E60xtU`) — 4 Kuis
  - Tab 3: *Mini Project: Safe Transaction Input* — 1 Kuis
  - Video 4: *Try-Except dan Debugging Program Python* (`pKYN1E60xtU`) — 2 Kuis
  - Tab 5: *Mini Project: Safe Input with Error Handling* — 1 Kuis
  - Video 6-7: *Langkah Debugging Code & Mini Project Belanja* (`pKYN1E60xtU`) — 2 Kuis
  - Video 8-9: *Dictionary, List Transaksi, & Analisis Data* (`pKYN1E60xtU`) — 4 Kuis
- **Grup D (sesi 40-44)**:
  - Video 00: *Introduction to Async Learning* (`yxmLOk5vcFg`)
  - Video 1-2: *Design Thinking & Kebutuhan Pengguna, Flowchart & Use Case* (`S1j2gt3Up74`) — 6 Kuis
  - Video 3-5: *Menganalisis Data Transaksi, Logika Rekomendasi, & App Integration* (`S1j2gt3Up74`) — 3 Kuis

### B. Jenjang SMP (Middle School)
- **Grup A**: *Input Aman, Form Aman, Flowchart Logika Data, Data & Privacy App* (`UhutS4BVKhk`) — 4 Kuis, 3 Mini Projects
- **Grup B**: *Eksplorasi Data Pribadi, Etika Digital, Penyimpanan Data TinyDB, Mengelola Data Aman* (`cWfbcaSg7Eo`) — 11 Kuis, 1 Mini Project
- **Grup C**: *Percabangan Ganda (If-Else), App Inventor Logic, Literasi Keuangan Digital, Aplikasi Kalkulator* (`tDkIcceTzII`) — 6 Kuis, 1 Final Project
- **Grup D**: *Membuat & Memanggil Procedures, Mini Project Kalkulator, Optimasi & Modularisasi, Debugging, Merancang Solusi* (`P8Ea0v8Gy2o`) — 5 Kuis, 1 Mini Project

---

## 2. Temuan Kesenjangan Pedagogis (Gaps Analysis)

Bagi anak yang **belum pernah belajar koding sama sekali**, urutan materi lama memiliki kelemahan struktur sebagai berikut:

### Kesenjangan pada Jenjang SMA (High School):
1. **Lompatan Logika di Awal (Missing Fundamentals)**:
   - Grup A langsung membuka pelajaran dengan **Percabangan (`if-else`)** di video `MLgrQoRo2oo`.
   - Siswa belum diperkenalkan pada:
     - Apa itu kode program dan bagaimana komputer mengeksekusi instruksi baris demi baris?
     - Fungsi dasar menampilkan teks (`print()`).
     - Apa itu **Variabel** (wadah memori) dan **Tipe Data** (angka vs teks string vs boolean).
   - *Dampak*: Siswa bingung memahami mengapa ada tulisan `if nilai > 70:` padahal belum paham dari mana datangnya variabel `nilai`.
2. **Penempatan Materi Input Terbalik**:
   - Materi tentang fungsi `input()` baru muncul di Grup C (`pKYN1E60xtU`).
   - Padahal untuk membuat program `if-else` yang interaktif di Grup A, siswa sudah butuh menerima input dari pengguna.

### Kesenjangan pada Jenjang SMP (Middle School):
1. **Penyimpanan Database Mendahului Percabangan & Fungsi**:
   - Pada alur grup A → B → C → D, materi TinyDB (penyimpanan database lokal) di Grup B dipelajari *sebelum* siswa mengenal logika Percabangan (If-Else di Grup C) dan Procedures/Fungsi (di Grup D).
   - Belajar database tanpa memahami logika branching dan fungsi sangat membingungkan bagi anak SMP.

---

## 3. Rekonstruksi Alur Materi Baru (Menggunakan Materi yang Ada)

Kita dapat langsung menata ulang seluruh materi video yang sudah ada ke dalam urutan yang **jauh lebih masuk akal dan runtut** tanpa menunggu rekaman ulang:

### A. Alur Baru Jenjang SMA (High School):
| Modul Baru | Judul & Fokus | Sumber Video Eksisting | Mengapa Urutan Ini Tepat? |
|---|---|---|---|
| **Modul 0** | **Orientasi Belajar Asinkronus** | `yxmLOk5vcFg` (Video 00) | Pengenalan ritme belajar mandiri dan cara menjawab pop-up kuis. |
| **Modul 1** | **Fondasi Data: Menerima Input & Validasi** | `pKYN1E60xtU` (dari Grup C Bagian 1-3) | Siswa memahami cara mengambil input teks dari user, tipe data, sanitasi `.strip()` / `.lower()`, dan validasi dasar. |
| **Modul 2** | **Membuat Pilihan: Conditional Logic (`if-else`)** | `MLgrQoRo2oo`, `-hYK440Vlr8`, `_jm2p3pstrM`, `_e3hs1nWuME`, `_iRZY0-_skc`, `bMsKBaRsKmc` (dari Grup A) | Karena siswa sudah paham input dan tipe data di Modul 1, konsep memeriksa syarat `if` dan `else` menjadi sangat natural dan mudah dipahami. |
| **Modul 3** | **Otomasi & Modular: Loops & Functions** | `RnyYn2SzFVU`, `hP6MSkerx9A` (dari Grup B) | Belajar perulangan (`for`/`while`) untuk memproses banyak data, lalu mengemas kode menjadi fungsi yang rapi. |
| **Modul 4** | **Keamanan Kode: Error Handling & Dictionary** | `pKYN1E60xtU` (dari Grup C Bagian 4-9) | Melindungi program dari crash dengan `try-except`, serta mengelola kumpulan data transaksi menggunakan dictionary. |
| **Modul 5** | **Integrasi Solusi: Financial Literacy App Project** | `S1j2gt3Up74` (dari Grup D) | Menyatukan semua konsep (Input, If, Loop, Try-Except, Dictionary) menjadi satu aplikasi keuangan utuh. |

---

### B. Alur Baru Jenjang SMP (Middle School):
| Modul Baru | Judul & Fokus | Sumber Video Eksisting | Mengapa Urutan Ini Tepat? |
|---|---|---|---|
| **Modul 0** | **Orientasi Belajar Asinkronus** | `yxmLOk5vcFg` (Video 00) | Pengenalan ritme belajar mandiri. |
| **Modul 1** | **Logika Instruksi, Flowchart & Input Aman** | `UhutS4BVKhk` (dari Grup A) | Pengenalan alur berpikir komputasi, cara membaca diagram alur (flowchart), dan keamanan data pengguna. |
| **Modul 2** | **Pengambilan Keputusan: Percabangan Blok** | `tDkIcceTzII` (dari Grup C) | Mempelajari blok *If-Then-Else* untuk membuat aplikasi kalkulator dan logika pemilihan keputusan. |
| **Modul 3** | **Otomasi & Fungsi: Procedures** | `P8Ea0v8Gy2o` (dari Grup D Bagian 1-5) | Belajar membungkus blok kode ke dalam *Procedures* (fungsi) agar aplikasi lebih efisien dan tidak berulang. |
| **Modul 4** | **Penyimpanan Data Lokal: TinyDB** | `cWfbcaSg7Eo` (dari Grup B) | Setelah paham branching dan procedures, siswa siap menyimpan data pengguna ke penyimpanan lokal TinyDB secara aman. |
| **Modul 5** | **Proyek Akhir: Desain Solusi Digital** | `P8Ea0v8Gy2o` (dari Grup D Bagian 6-7) | Menyelesaikan tantangan aplikasi terpadu. |

---

## 4. Materi yang Kurang & Rekomendasi Solusi

Agar platform ini benar-benar ramah 100% bagi anak pemula mutlak, berikut identifikasi materi yang belum ada beserta saran solusinya:

### Rekomendasi untuk Jenjang SMA:
1. **Gap Materi**: Belum ada video khusus 3–5 menit tentang **"Hello Python: Output `print()` dan Variabel Pertama"**.
   - *Saran A (Jika bisa rekam)*: Rekam 1 video ringkas (3-5 menit) yang mendemokan:
     1. Menulis `print("Halo Dunia")`.
     2. Menulis `nama = "Budi"` dan `umur = 16`.
     3. Menggabungkannya menjadi `print("Halo", nama)`.
   - *Saran B (Solusi Cerdas di LMS tanpa rekam ulang)*:
     Di LMS baru, sebelum video Modul 1 dimulai, kita pasang **"Interactive Primer Card"** berupa slide/animasi interaktif di tab Modul 1 yang menerangkan konsep `print()` dan variabel dengan tombol coba kode langsung. Siswa dapat memahami konsep ini dalam 2 menit sebelum menonton video input!

### Rekomendasi untuk Jenjang SMP:
1. **Gap Materi**: Pengenalan konsep dasar antarmuka blok App Inventor (komponen Designer vs Blocks Editor) sebelum masuk ke form.
   - *Saran*: Tambahkan 1 kartu panduan visual bergambar (Visual Guide Card) di Modul 1 yang menunjukkan letak palette, viewer, dan workspace blok kode.

### Rekomendasi untuk Jenjang SD (Upper Primary):
1. **Gap Materi**: Konten video SD belum ada.
   - *Saran*: Manfaatkan template modular yang sudah kita siapkan di Subproject 2 (`courseData-upperprimary.json`). Saat tim produksi siap merekam video Scratch (4 modul: Gerak/Urutan → Kondisi Pilihan → Looping → Game Menabung), kita tinggal memasukkan link video YouTube-nya ke dalam template tersebut.
