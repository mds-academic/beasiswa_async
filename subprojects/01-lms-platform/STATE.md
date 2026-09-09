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
