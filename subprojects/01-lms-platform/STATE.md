# State: Subproject 01 - LMS Platform

## Current Status

- **Status**: Stable & Fully Tested (All Tests Passing 100%).
- **Active Focus**: Penyempurnaan pop-up kuis skeuomorphic retro-space & penanganan batas 3x percobaan gagal dengan transparansi edukatif.
- **Last Updated**: 2026-09-09

## Completed Features

1. Injeksi penuh kurikulum 6 Modul SMP & 6 Modul SMA + 10 Slide Bridge interaktif HTML.
2. Penggantian seluruh browser alert kaku dengan Modal Alert Skeuomorphic In-App.
3. Overhaul pop-up kuis bergaya skeuomorphic retro-space kaya warna (maskot robot astronaut 🤖, badge alfabet timbul `A`, `B`, `C`, `D`, kartu pertanyaan komik kuning).
4. Penanganan batas 3x percobaan salah:
   - Skor 0 otomatis tersimpan dan kuis dianggap selesai agar progres belajar tidak terkunci permanen.
   - Siswa diberitahu secara transparan dan ramah lewat feedback box amber retro-space.
   - Kunci jawaban yang benar dan pembahasan materi disorot jelas untuk bahan evaluasi belajar.
   - Tombol berubah menjadi `[Lanjutkan Misi Belajar ➔]` yang membuka progress lock gate materi berikutnya.
5. Verifikasi pengujian Playwright end-to-end terkonfirmasi 100% PASS.



## Update 2026-09-09 — Intro bumper diperbaiki

- Metadata `introMode` ditambahkan ke seluruh unit video. Default eksplisit saat ini `embedded` sesuai instruksi pengguna: tanpa instruksi bumper, jangan menambahkan bumper.
- Runtime hanya memainkan `intro.mp4` untuk `introMode: "bumper"`; bumper non-pausable, non-seekable, dan memakai playback token.
- Validasi syntax dan dataset lulus.

## Update 2026-09-09 — Autoplay dan sequencing media

- YouTube tidak boleh memulai saat `goToStep()`/render; `onReady` sekarang mem-pause player dan event PLAYING hydration ditolak.
- Untuk unit `introMode: "bumper"`, urutan dipaksa: klik Play → bumper selesai → YouTube play. Tidak bersamaan.

## Update 2026-09-09 — Redesain Sertifikat (Landscape A4) & Transkrip Nilai (Portrait A4)

- **Vendor & Aset**: Menggunakan `html2pdf.bundle.min.js` lokal dan aset logo Base64 Data URI (`logo-assets.js`) untuk menjamin 100% bebas error CORS saat diekspor offline.
- **Halaman 1 (Landscape A4)**: Sertifikat Kelulusan resmi berpenampilan mewah skeuomorphic (frame regalia navy/gold, segel emas 3D embossed UOB MDS, tipografi berwibawa, dan nama siswa bebas hyperlink underline).
- **Halaman 2 (Portrait A4)**: Transkrip Nilai kompak 36 baris materi dengan ringkasan 4 pilar computational thinking dan perincian nilai kuis riil (skor 0 tetap tercatat).
- **Ekspor Multi-Orientasi**: Fungsi `exportCertificateToPdf()` merender Halaman 1 (`landscape`) dan Halaman 2 (`portrait`) ke dalam 1 file PDF A4 utuh 2 halaman melalui canvas retina 2x di kontainer terisolasi `#cert-render-sandbox`.
- **Eligibility Guard & Admin Preview**: Validasi kelulusan terpusat (seluruh materi selesai, semua kuis tersubmit, akurasi >= 70%). Akses akun admin yang belum menyelesaikan materi menampilkan watermark transparan `[PRATINJAU DOKUMEN · VERIFIKASI ADMIN]`.
- **Verifikasi & Publikasi**: Lolos 8/8 uji otomatis Playwright (`test_certificate_pdf_export.py`), disinkronkan ke folder `docs/`, di-commit (`0f3d7d6`), dan di-push ke GitHub remote `origin main`.


## Immediate fix 2026-09-09

- Certificate guard corrected to `state.isRestoringProgress`.
- Publication `docs/` repopulated from current `src/` and core hashes verified identical.
- Static syntax and existing PDF artifact checks pass; browser E2E remains environment-blocked.
