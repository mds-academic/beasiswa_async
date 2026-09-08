# Product Requirements Document (PRD)
## UOB My Digital Space: Asynchronous Learning Platform & Curriculum Revamp

---

## 1. Executive Summary & Problem Statement

Program CSR **UOB My Digital Space** (didukung oleh Kalananti) menyediakan pembelajaran asinkronus koding dan literasi digital bagi siswa sekolah mitra. Pada iterasi sebelumnya, terdapat beberapa pain-point operasional dan pedagogis:
1. **Interaktivitas Video Terlalu Kaku (Too Strict)**: Pop-up kuis muncul secara tiba-tiba tanpa pemberitahuan dan memblokir video secara paksa. Siswa yang belum siap menjawab tidak memiliki opsi untuk menutup atau menunda kuis, sehingga memicu rasa frustrasi dan drop-off rate tinggi.
2. **Fragmentasi Tautan (Multiple Links)**: Tautan dashboard dipisah-pisah berdasarkan jenjang dan grup (High School Grup A-D, Middle School Grup A-D, dst.), menyulitkan tim operasional dan guru pendamping dalam mendistribusikan link secara terpadu.
3. **Alur Kurikulum Belum Runtut untuk Pemula (Non-Linear Sequencing)**: Susunan video dan topik koding di beberapa jenjang belum mengikuti progresi pembelajaran komputasi yang bertahap (misal: langsung menyentuh perulangan sebelum memahami logika kondisi atau variabel), sehingga membingungkan siswa yang sama sekali belum pernah belajar koding (zero-experience).

Dokumen PRD ini menetapkan spesifikasi untuk merancang ulang **Platform LMS Asinkronus** yang lebih ramah siswa (*less strict* tapi tetap menjamin akuntabilitas penyelesaian kuis) serta **Merestrukturisasi Alur Kurikulum Koding** secara logis dan pedagogis untuk SD, SMP, dan SMA.

---

## 2. Product Vision & Key Objectives

### 2.1 Visi Produk
Menghadirkan pengalaman belajar mandiri (asynchronous) yang menyenangkan, inklusif, dan tidak mengintimidasi bagi siswa sekolah dasar hingga menengah di Indonesia, sekaligus memberikan kendali pemantauan progres yang akurat bagi tim operasional.

### 2.2 Tujuan Utama (Key Goals)
1. **Single Entry Portal**: 1 tautan aplikasi web tunggal untuk semua jenjang. Deteksi jenjang (SD / SMP / SMA) dilakukan otomatis setelah siswa memilih sekolah pada form login.
2. **Less-Strict & Transparent Video Quizzing**:
   - Siswa diberi transparansi sejak awal mengenai jumlah kuis di video aktif (misal: *"Video ini memiliki 3 Pop-up Kuis"*).
   - Terdapat navigasi/indikator kuis (siswa dapat melompat/membuka kuis 1, 2, atau 3).
   - Siswa dapat menutup (*close/dismiss*) jendela pop-up kuis yang muncul untuk melanjutkan menonton video, tanpa kehilangan akses membuka kuis kembali.
   - **Progress Completion Gate**: Tombol *"Lanjut ke Video Berikutnya"* tetap terkunci rapat hingga seluruh kuis pada video aktif berstatus dikerjakan (*submitted*).
3. **Curriculum Re-sequencing for Beginners**:
   - Menata ulang alur materi koding SMP, SMA, dan SD dengan tangga logika:
     `Dasar Pemikiran Komputasi & Output` → `Variabel & Tipe Data` → `Logika Percabangan (If-Else)` → `Perulangan (Loops)` → `Mini Project Terapan`.
4. **Clean & Scalable Backend**:
   - Google Apps Script (`Code.gs`) baru yang menangani registrasi/login multi-jenjang dan logging progres/nilai ke Google Sheets secara modular dan otomatis.

---

## 3. Project Organization & Subprojects

Proyek ini dikelola dalam satu folder induk (`projects/uob-async-lms/`) dengan pembagian 2 subproject terisolasi:

```
projects/uob-async-lms/
├── PRD.md                                    # Dokumen PRD Utama (file ini)
├── PROJECT.md                                # Project Brief Induk
├── MEMORY.md                                 # Keputusan & Konteks Tahan Lama
├── STATE.md                                  # Checkpoint Status Terkini
├── CANVAS.md                                 # Dashboard Artefak
├── HISTORY.md                                # Log Interaksi Induk
├── AGENTS.md                                 # Aturan Agen Induk
├── planning/
│   └── 01-implementation-plan-...md          # Rencana Eksekusi Bertahap
└── subprojects/
    ├── 01-lms-platform/                      # Subproject 1: Web App & Apps Script
    │   ├── AGENTS.md
    │   ├── PROJECT.md
    │   ├── STATE.md
    │   ├── MEMORY.md
    │   ├── HISTORY.md
    │   ├── src/                              # Komponen Vue 3, Player, Auth, Styles
    │   └── backend/                          # Code.gs & Integrasi Sheets
    └── 02-curriculum-sequencing/             # Subproject 2: Kurasi & Data Modul
        ├── AGENTS.md
        ├── PROJECT.md
        ├── STATE.md
        ├── MEMORY.md
        ├── HISTORY.md
        ├── mapping/                          # Peta Alur Pedagogis SD, SMP, SMA
        └── output/                           # courseData.json siap injeksi
```

---

## 4. Functional Specifications

### 4.1 Modul Autentikasi & Smart Routing (Subproject 1)
- **Step 1 - Autocomplete Sekolah**: Input pencarian sekolah mitra. Data sekolah terhubung ke master data di Google Sheets.
- **Step 2 - Auto-Detect Jenjang**: Setiap sekolah di database memiliki tag jenjang:
  - `SD` → Mengarahkan ke Kurikulum Upper Primary (Scratch / Visual Logic).
  - `SMP` → Mengarahkan ke Kurikulum Middle School (Python Fundamental / Logic).
  - `SMA` → Mengarahkan ke Kurikulum High School (Python Applied / Web IDE).
- **Step 3 - Validasi Siswa**: Siswa memilih namanya dari daftar siswa sekolah tersebut atau memasukkan email terdaftar.
- **Session Persistence**: Progres lokal disimpan di `localStorage` per email siswa, mencegah kehilangan status jika halaman ter-refresh atau koneksi terputus.

### 4.2 Modul Video Player & Quiz Interaction UX (Subproject 1)
- **Komponen Player**:
  - Video embed responsif (YouTube / Drive video player).
  - **Quiz Indicator Pill Bar**: Terletak di atas atau di samping player, menampilkan status seluruh kuis pada video aktif:
    - `Dot Abu-abu`: Belum dikerjakan (Unattempted).
    - `Dot Oranye / Berkedip`: Siap dikerjakan / Muncul pada timestamp tertentu.
    - `Dot Hijau`: Sudah dikerjakan (Submitted).
- **Mekanisme Pop-up Kuis**:
  - Saat timestamp video menyentuh waktu kuis (atau saat siswa mengeklik pill kuis): modal kuis muncul secara anggun (*slide-over* atau *modal dialog*).
  - **Tombol Tutup / Tunda ("Tonton Dulu")**: Siswa dapat menutup kuis kapan saja untuk mengecek kembali video.
  - **Tombol Mundur 30 Detik ("Putar Ulang Penjelasan")**: Membantu siswa mengingat kembali materi terkait.
  - **Submission**: Siswa memilih jawaban dan menekan *"Kirim Jawaban"*. Jawaban langsung tercatat ke local state dan dikirim ke backend.
- **Progress Gate (Kunci Navigasi Video)**:
  - Tombol *"Lanjut ke Video Berikutnya"* atau tab materi selanjutnya dalam status non-aktif (*disabled*) selama masih ada kuis yang belum berstatus `Submitted`.
  - Tooltip informatif: *"Selesaikan semua (X) kuis pada video ini sebelum melanjutkan."*

### 4.3 Alur Kurikulum Koding Ramah Pemula (Subproject 2)
Penyusunan ulang kurikulum wajib mematuhi kaidah **scaffolding pedagogis**:
1. **Tahap 1: Pengenalan & Mental Model Pemrograman**
   - Apa itu instruksi komputer? Bagaimana komputer berpikir?
   - Input, Output, dan Lingkungan Koding.
2. **Tahap 2: Variabel & Tipe Data (Penyimpanan Memori)**
   - Mengapa butuh variabel?
   - Tipe data angka (integer, float), teks (string), dan boolean.
3. **Tahap 3: Logika Kondisional & Pengambilan Keputusan**
   - Pembanding relasional (`==`, `!=`, `<`, `>`).
   - Struktur percabangan (`if`, `else`, `elif`).
4. **Tahap 4: Otomasi & Perulangan (Looping)**
   - Kebutuhan otomasi: mengapa tidak menulis baris berulang?
   - Struktur `for` loop dan `while` loop.
5. **Tahap 5: Mini Proyek & Evaluasi Terapan**
   - Menggabungkan variabel, kondisi, dan looping ke dalam satu aplikasi interaktif (game tebak angka, kalkulator sederhana, atau quiz app).

### 4.4 Format Data Kurikulum Standar (`courseData.json`)
Struktur data tunggal yang dihasilkan oleh Subproject 2 untuk dibaca langsung oleh Subproject 1:
```json
{
  "level": "middle_school",
  "title": "Dasar Pemrograman Python untuk SMP",
  "modules": [
    {
      "id": "mod-01",
      "title": "Modul 1: Variabel & Dunia Koding",
      "videos": [
        {
          "id": "vid-01",
          "title": "Mengenal Variabel di Python",
          "videoUrl": "https://www.youtube.com/embed/...",
          "summary": "Rangkuman singkat materi variabel...",
          "quizzes": [
            {
              "id": "quiz-01-a",
              "timestamp": 125,
              "question": "Manakah cara penulisan variabel yang benar di Python?",
              "options": ["1nama = 'Budi'", "nama_siswa = 'Budi'", "nama-siswa = 'Budi'"],
              "correctAnswerIndex": 1,
              "explanation": "Nama variabel tidak boleh diawali angka atau mengandung strip."
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 5. Backend & Data Integration Specifications

- **Platform**: Google Apps Script (Web App Deployment).
- **Database**: Google Sheets Terpusat.
  - `ops-schools-meta`: Master sekolah, jenjang (SD/SMP/SMA), PIC pendamping.
  - `ops-students-roster`: Master nama siswa, email akademia, dan ID sekolah.
  - `ops-progress-sd`, `ops-progress-smp`, `ops-progress-sma`: Logging riwayat submission kuis, waktu submit, skor, dan status kelulusan modul per jenjang.
- **CORS & Response Format**: RESTful JSON responses (`success: true/false`, payload, error message).

---

## 6. Definition of Done & Acceptance Criteria

1. **User Authentication**:
   - Memilih sekolah SD menampilkan modul SD.
   - Memilih sekolah SMP menampilkan modul SMP.
   - Memilih sekolah SMA menampilkan modul SMA.
2. **Video & Quiz Player**:
   - Indikator kuis menampilkan jumlah total kuis dengan akurat.
   - Siswa dapat membuka, menutup, dan melompat antar kuis secara mulus.
   - Tombol video berikutnya terkunci bila kuis belum berstatus submitted.
3. **Kurikulum**:
   - Peta materi SD, SMP, SMA bebas dari loncatan konsep koding.
   - Berkas `courseData.json` tervalidasi skemanya dan terhubung ke web app.
4. **Operasional**:
   - Submit kuis berhasil tercatat di Google Sheets tanpa error timeout.
