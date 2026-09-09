# LMS Platform — Verifikasi Kelas & Akun Operasional

Status: `verified & passed`
Tanggal: 2026-09-09

## 1. Verifikasi kelas sebelum integrasi backend

- [x] Master kelas/sekolah yang dipakai sudah ditentukan (`SD AL ANDALUS`, `SDN Menteng 01`, `SMPN 1 Jakarta`, `SMAN 8 Jakarta`, `SMA UOB`).
- [x] Setiap kelas memiliki jenjang yang jelas: SD (Upper Primary), SMP (Middle School), atau SMA (High School).
- [x] Roster siswa memiliki nama, sekolah/kelas, dan email akademia (terkatalog di `ops-student-data.json`).
- [x] Tidak ada duplikasi kombinasi `email + sekolah` (composite key atomic di backend Apps Script).
- [x] Sampel login dari setiap jenjang berhasil mengembalikan kurikulum yang benar (SD: 18 step, SMP: 36 step, SMA: 36 step).
- [x] Data yang tidak lolos verifikasi tidak ditulis ke spreadsheet progres.

## 2. Account guard

Target akun operasional: **Gita Pengbenar** (`rgcuob@gmail.com`).

- [x] Sebelum membuka Google Sheets/Apps Script/Drive, periksa avatar dan alamat akun aktif.
- [x] Cocokkan akun aktif dengan identitas operasional Gita Pengbenar yang disepakati (`rgcuob@gmail.com`).
- [x] Jika yang aktif adalah akun Gita pribadi atau akun lain: hentikan proses dan ganti akun.
- [x] Jangan menyimpan password, cookie, token, atau alamat email sensitif di repository.
- [x] Catat hanya hasil verifikasi (`pass` / `fail`), waktu, dan artefak non-sensitif.

## 3. Gate publish

- [x] Development lokal tervalidasi dengan data fixture dan dataset resmi.
- [x] Deployment container-bound Apps Script terpasang via Clasp di bawah akun Gita Pengbenar.
- [x] Spreadsheet master `1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k` terinjeksi 100% dan sinkron 3 jenjang.

