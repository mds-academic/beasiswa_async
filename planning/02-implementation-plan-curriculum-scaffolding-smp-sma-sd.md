# Implementation Plan 02: Curriculum Scaffolding & Re-sequencing (SMP, SMA, SD)

Perancangan ulang alur kurikulum pembelajaran coding asinkronus untuk program CSR UOB My Digital Space. Fokus utama adalah menyusun *learning progression ladder* yang runtut, bertahap, dan bebas dari loncatan konsep, sehingga siswa yang baru pertama kali belajar koding (zero coding experience) dapat memahami materi dengan percaya diri.

## User Review Required

> [!IMPORTANT]
> **Pedagogical Progression (Tangga Belajar Koding)**:
> Alur koding disusun dengan urutan wajib:
> `1. Pengenalan & Output` → `2. Variabel, Tipe Data & Input` → `3. Logika Percabangan (Condition)` → `4. Perulangan (Looping)` → `5. Struktur Data & Mini Project`.
> Pada materi lama, konsep variabel dan input belum diperkenalkan secara mandiri sebelum materi percabangan.

> [!NOTE]
> **Jenjang SD (Upper Primary)**:
> Konten video SD saat ini belum diproduksi. Dokumen ini menyiapkan spesifikasi silabus modular dan template struktur data (`courseData.json`) dengan konten placeholder terstruktur agar langsung siap diisi saat video telah rampung.

---

## Proposed Curriculum Scaffolding

### 1. Jenjang SMA (High School) — Python Fundamentals & Safe Coding

Materi SMA dirancang untuk transisi dari pemula mutlak menuju pembuatan program fungsional berbasis teks (Python):

| Modul | Topik Utama | Tujuan Pembelajaran (Learning Objectives) | Konsep Coding | Mini Quiz / Practice |
|---|---|---|---|---|
| **Modul 1** | **Dunia Coding & Variabel** | Siswa memahami cara komputer mengeksekusi kode, menggunakan `print()`, dan menyimpan data dalam variabel. | Output (`print`), Variabel, Tipe Data (String, Integer, Float) | 3 Pop-up Quizzes: Syntax dasar, penamaan variabel valid, identifikasi tipe data. |
| **Modul 2** | **Meminta Input & Operator Logika** | Siswa dapat mengambil input dari pengguna dan melakukan operasi aritmatika & logika dasar. | `input()`, Konversi tipe (`int()`, `str()`), Operator perbandingan (`==`, `!=`, `>`, `<`) | 3 Pop-up Quizzes: Konversi string ke int, hasil perbandingan boolean. |
| **Modul 3** | **Membuat Pilihan: Conditional Logic** | Siswa dapat membuat program yang mengambil keputusan berdasarkan kondisi input pengguna. | `if`, `elif`, `else`, Logical Operators (`and`, `or`, `not`) | 3 Pop-up Quizzes: Menentukan branch eksekusi kode, kondisi bertingkat. |
| **Modul 4** | **Otomasi dengan Perulangan (Loops)** | Siswa dapat mengotomatisasi instruksi berulang tanpa menulis kode berkali-kali. | `for` loop, `range()`, `while` loop, Break & Continue | 3 Pop-up Quizzes: Prediksi output perulangan, pencegahan infinite loop. |
| **Modul 5** | **Safe Finance Tracker & Mini Project** | Siswa membuat aplikasi pencatat keuangan aman dengan validasi input, error handling (`try-except`), dan penyimpanan dictionary. | Error Handling (`try-except`), Dictionary/List, Proyek Integrasi | **In-Web IDE Challenge**: Debugging form transaksi dan validasi nominal saldo. |

---

### 2. Jenjang SMP (Middle School) — Logic & Block/Python Transition

Materi SMP dirancang untuk membangun computational thinking dan logika aplikasi dengan konteks relevan (keuangan pribadi & keamanan data):

| Modul | Topik Utama | Tujuan Pembelajaran (Learning Objectives) | Konsep Coding / CT | Mini Quiz / Practice |
|---|---|---|---|---|
| **Modul 1** | **Fondasi Logika Komputasi & Flowchart** | Siswa memahami konsep algoritma, alur instruksi berurutan (sequence), dan cara membaca flowchart. | Decomposition, Algorithmic Thinking, Flowchart symbols | 2 Pop-up Quizzes: Urutan instruksi benar, pembacaan flowchart. |
| **Modul 2** | **Penyimpanan Data & Validasi Input** | Siswa memahami perbedaan data teks, angka, dan bagaimana menyimpan data pengguna secara aman. | Variabel, Tipe Data, Input Sanitization dasar | 3 Pop-up Quizzes: Membedakan data numerik vs string, perlindungan data pribadi. |
| **Modul 3** | **Pengambilan Keputusan dalam Aplikasi** | Siswa menerapkan percabangan logika untuk menentukan aksi aplikasi berbasis data pengguna. | Branching (If-Else), Logika Keputusan Finansial (Kebutuhan vs Keinginan) | 3 Pop-up Quizzes: Skenario diskon belanja, validasi PIN/password. |
| **Modul 4** | **Otomasi & Analisis Data Sederhana** | Siswa mengolah data berulang untuk menghitung total pengeluaran dan ringkasan keuangan. | Iterasi/Looping dasar, Akumulator (penjumlahan data), Tabel data | 3 Pop-up Quizzes: Menghitung saldo akhir, identifikasi pola pengeluaran. |
| **Modul 5** | **Proyek Aplikasi Keuangan & Keamanan Digital** | Siswa merangkai seluruh konsep menjadi simulasi aplikasi mini yang aman dari risiko phising dan kebocoran data. | Data Privacy, Security Awareness, Mini Project Review | **Evaluasi Interaktif**: Menyelesaikan skenario simulasi keamanan digital. |

---

### 3. Jenjang SD (Upper Primary) — Visual Logic & Computational Thinking (Template)

Materi SD disiapkan dalam bentuk modular blok visual interaktif:

| Modul | Topik Utama | Tujuan Pembelajaran (Learning Objectives) | Konsep Visual / Scratch | Status Konten |
|---|---|---|---|---|
| **Modul 1** | **Petualangan Koding Pertama: Urutan Langkah** | Siswa menggerakkan karakter menggunakan blok instruksi berurutan (sequence). | Sequence, Action Blocks, Start Event (Green Flag) | *Placeholder Template Siap Pakai* |
| **Modul 2** | **Karakter Cerdas: Membuat Pilihan** | Siswa membuat karakter yang merespons kondisi lingkungan (misal: jika kena rintangan, melompat). | Sensing, If-Then Conditional Blocks | *Placeholder Template Siap Pakai* |
| **Modul 3** | **Gerakan Berulang: Looping Seru** | Siswa mengulang gerakan karakter animasi secara otomatis tanpa menumpuk banyak blok. | Repeat X Times, Forever Loop | *Placeholder Template Siap Pakai* |
| **Modul 4** | **Mini Game Menabung & Belanja Bijak** | Siswa merangkai game sederhana mengumpulkan koin kebutuhan dan menghindari pengeluaran impulsif. | Variables (Score/Coins), Game Loop, Financial Literacy Dasar | *Placeholder Template Siap Pakai* |

---

## 4. Format Data Terstandarisasi (`courseData.json`)

Setiap jenjang memiliki berkas data kurikulum tunggal dengan skema JSON seragam yang dibaca langsung oleh Subproject 01:

```json
{
  "levelId": "high_school",
  "levelTitle": "Pemrograman Python SMA",
  "description": "Belajar koding Python dari dasar hingga membangun aplikasi finansial yang aman.",
  "modules": [
    {
      "id": "hs-mod-01",
      "order": 1,
      "title": "Modul 1: Dunia Coding & Variabel",
      "summary": "Memahami cara komputer bekerja dan cara menyimpan data menggunakan variabel.",
      "videos": [
        {
          "id": "hs-vid-1-1",
          "title": "Mengenal Variabel dan Output",
          "videoUrl": "https://www.youtube.com/embed/VIDEO_ID",
          "durationSeconds": 480,
          "summary": "Dalam video ini kita mempelajari fungsi print dan pembuatan variabel.",
          "quizzes": [
            {
              "id": "hs-q-1-1-1",
              "timestamp": 120,
              "question": "Manakah cara pembuatan variabel yang benar di Python?",
              "options": [
                "1_uang = 5000",
                "uang_tabungan = 5000",
                "uang-tabungan = 5000",
                "uang tabungan = 5000"
              ],
              "correctIndex": 1,
              "explanation": "Nama variabel di Python tidak boleh diawali angka atau mengandung tanda hubung/spasi."
            }
          ]
        }
      ],
      "project": null
    }
  ]
}
```

---

## 5. Execution Steps for Subproject 02

1. **Step 1: Ekstraksi & Kurasi Video Eksisting**
   - Mendata URL video dan transkrip materi yang sudah ada di `Academic_Content/B2B/UOB/Async/Highschool/` dan `Middleschool/`.
   - Mengisi timestamp kuis dan pertanyaan pop-up kuis untuk tiap video.
2. **Step 2: Penyusunan Berkas JSON Kurikulum**
   - Menyusun `subprojects/02-curriculum-sequencing/output/courseData-highschool.json`.
   - Menyusun `subprojects/02-curriculum-sequencing/output/courseData-middleschool.json`.
   - Menyusun `subprojects/02-curriculum-sequencing/output/courseData-upperprimary.json` (template placeholder).
3. **Step 3: Validasi Skema JSON**
   - Menjalankan uji validasi struktur JSON untuk memastikan tidak ada field kosong (`id`, `title`, `quizzes`, `timestamp`).
4. **Step 4: Injeksi ke Subproject 01**
   - Mengimpor file-file JSON ke `subprojects/01-lms-platform/src/data/` untuk dimuat oleh aplikasi web player.
