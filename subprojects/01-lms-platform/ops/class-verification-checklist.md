# LMS Platform — Verifikasi Kelas & Akun Operasional

Status: `pending verification`
Tanggal dibuat: 2026-09-08

## 1. Verifikasi kelas sebelum integrasi backend

- [ ] Master kelas/sekolah yang dipakai sudah ditentukan.
- [ ] Setiap kelas memiliki jenjang yang jelas: SD, SMP, atau SMA.
- [ ] Roster siswa memiliki nama, sekolah/kelas, dan email akademia.
- [ ] Tidak ada duplikasi kombinasi `email + sekolah`.
- [ ] Sampel login dari setiap jenjang berhasil mengembalikan kurikulum yang benar.
- [ ] Data yang tidak lolos verifikasi tidak ditulis ke spreadsheet progres.

## 2. Account guard

Target akun operasional: **Gita Pengbenar**.

- [ ] Sebelum membuka Google Sheets/Apps Script/Drive, periksa avatar dan alamat akun aktif.
- [ ] Cocokkan akun aktif dengan identitas operasional Gita Pengbenar yang disepakati.
- [ ] Jika yang aktif adalah akun Gita pribadi atau akun lain: hentikan proses dan ganti akun.
- [ ] Jangan menyimpan password, cookie, token, atau alamat email sensitif di repository.
- [ ] Catat hanya hasil verifikasi (`pass` / `fail`), waktu, dan artefak non-sensitif.

## 3. Gate publish

Development lokal boleh berjalan dengan data fixture. Deployment, Apps Script baru,
spreadsheet baru, dan penulisan data siswa hanya boleh dilakukan setelah semua
checklist di atas berstatus `pass`.
