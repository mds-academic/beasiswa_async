# Struktur Google Spreadsheet Baru & Panduan Integrasi

Dokumen ini menjelaskan struktur Google Spreadsheet baru terpusat untuk program **UOB My Digital Space** multi-jenjang (SD, SMP, SMA) dan skrip Apps Script pendukungnya.

- **Spreadsheet URL**: [UOB My Digital Space Master Database](https://docs.google.com/spreadsheets/d/1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k/edit) (ID: `1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k`)
- **Apps Script Editor**: [Script Editor Bound Project](https://script.google.com/d/1OBi2PPa6i5O8Jpjmf-4_p0Y3C7K7OQzWUJIAew7scwr6yqoYs1H19eMr/edit) (ID: `1OBi2PPa6i5O8Jpjmf-4_p0Y3C7K7OQzWUJIAew7scwr6yqoYs1H19eMr`)
- **Web App URL**: `https://script.google.com/macros/s/AKfycbxeN6qSeNLl3G08JkKsJ1HTGLzk7smy4idTfpJgA4LxvgI_WR9G0JKeg9qohVDV4yyd/exec`
- **Owner Account**: `rgcuob@gmail.com` (Ruangguru Coding UOB / Gita Pengbenar)

---

## 1. Aturan Kritis Warning Banner (Row 1)

Setiap sheet operasional di dalam spreadsheet baru **WAJIB** memiliki baris peringatan di **Baris 1** (Row 1):

```
WARNING: DO NOT EDIT OR FILTER THIS DATA. THIS IS DIRECTLY FROM HTML AS THIS WILL AFFECT HOW THE DATA BEING STORED AND SAVED !!
```

- **Format Visual**: Baris 1 dimerge sepanjang kolom data, dengan background merah pekat (`#7F1D1D`), teks warna putih tebal (`#FFFFFF`, bold), dan baris dibekukan (*frozen row* hingga baris 2).
- **Tujuan**: Mencegah staff/fasilitator melakukan sorting atau filtering manual langsung pada baris mentah yang dapat merusak index dan penulisan atomic upsert dari script.

---

## 2. Struktur Sheet Terpusat

### Sheet 1: `ops-student-data` (Master Roster Siswa & Sekolah)
Menyimpan daftar murid terdaftar per sekolah mitra untuk autentikasi login single-portal.

- **Baris 1**: Warning Banner
- **Baris 2 (Header)**:
  `No | Nama Siswa | Sekolah | Email Akademia | Jenjang | Terakhir Login`
- **Keterangan Kolom**:
  - `Nama Siswa`: Nama lengkap siswa.
  - `Sekolah`: Nama sekolah mitra (misal `SMAN 8 Jakarta`, `SMPN 1 Jakarta`, `SDN Menteng 01`).
  - `Email Akademia`: Email yang digunakan untuk login.
  - `Jenjang`: `SD`, `SMP`, atau `SMA`.
  - `Terakhir Login`: Terisi otomatis oleh sistem saat siswa berhasil login.

---

### Sheet 2: `ops-result-sma` (Hasil Progres Jenjang SMA)
Menyimpan hasil pengerjaan kuis dan mini project Python untuk siswa SMA.

- **Baris 1**: Warning Banner
- **Baris 2 (Header Utama)**:
  `Timestamp | Email Siswa | Nama Siswa | Sekolah | [quiz_id_1] [Skor] | [quiz_id_2] [Skor] | ...`
- **Pola Penulisan**: Atomic Upsert berbasis composite key `Email + Sekolah` (satu siswa hanya menempati satu baris unik).

---

### Sheet 3: `ops-result-smp` (Hasil Progres Jenjang SMP)
Menyimpan hasil pengerjaan kuis dan latihan App Inventor untuk siswa SMP.

- **Baris 1**: Warning Banner
- **Baris 2 (Header Utama)**:
  `Timestamp | Email Siswa | Nama Siswa | Sekolah | [quiz_id_1] [Skor] | ...`

---

### Sheet 4: `ops-result-sd` (Hasil Progres Jenjang SD)
Menyimpan hasil kuis dan tantangan Scratch untuk siswa SD.

- **Baris 1**: Warning Banner
- **Baris 2 (Header Utama)**:
  `Timestamp | Email Siswa | Nama Siswa | Sekolah | [quiz_id_1] [Skor] | ...`

---

## 3. Akun Deployment & Otentikasi Clasp

- **Target Akun**: Wajib menggunakan akun resmi **RGC UOB (Gita Pengbenar)**.
- **Dilarang**: Menggunakan akun pribadi Gita.
- **Langkah Deployment Clasp**:
  1. Login clasp dengan akun RGC UOB:
     `clasp login`
  2. Buat / tautkan Apps Script ke Google Spreadsheet baru:
     `clasp create --title "UOB Async LMS Backend" --type webapp`
  3. Push kode backend:
     `clasp push`
  4. Deploy sebagai Web App publik (*anyone with link*):
     `clasp deploy --description "Production Release Multi-Level LMS"`
  5. Salin Web App Executable URL dan perbarui nilai `APP_SCRIPT_URL` pada frontend `src/app.js`.
