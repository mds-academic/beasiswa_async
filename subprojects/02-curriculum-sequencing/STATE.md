# State: Subproject 02 - Curriculum Sequencing

## Current Status

- **Status**: Audit ulang scaffolding selesai; arah sequencing sudah cukup benar, tetapi kurikulum belum siap dianggap scaffolding final untuk pemula.
- **Active Focus**: Menjalankan implementation plan bertahap untuk finalisasi bridge HTML, pemisahan tur App Inventor dari TinyDB, dataset sequencing baru, dan QA sebelum integrasi LMS.
- **Last Updated**: 2026-09-08

## Completed

- Audit menyeluruh video & kuis eksisting dari Highschool (A, B, C, D) dan Middleschool (A, B, C, D).
- Analisis kesenjangan (*gap analysis*) bagi pemula mutlak ([curriculum-audit-and-scaffolding-gap-analysis.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/mapping/curriculum-audit-and-scaffolding-gap-analysis.md)).
- Penyusunan ulang alur materi logis dan ekspor dataset JSON tervalidasi (SMA, SMP, SD).
- **Overhaul Total Bridge Slides 00 (SMA & SMP)**:
  - Mengadopsi arsitektur template neo-brutalisme kanonik dari `slide_deck_part1.html` (font Fredoka, border hitam 4px, shadow 12px, banner responsif 16:9, counter & progress bar dinamis).
  - Mengintegrasikan tangkapan layar 100% nyata (bukan CSS buatan) dari Google Colaboratory dan MIT App Inventor nyata via Chrome CDP.
  - Mengunggah seluruh aset visual secara permanen ke Ruangguru CDN (`rg_cdn_web_2` di `https://cdn-web-2.ruangguru.com/landing-pages/assets/...`).
  - Menyusun 16 slide materi kaya & mendalam per jenjang dengan tabel perbandingan, petunjuk langkah demi langkah, mini playground interaktif, dan kuis pemahaman mandiri.
  - Sinkronisasi berkas slides & metadata JSON ke `subprojects/01-lms-platform/src/slides/` dan `docs/slides/`.
- Audit ulang tersimpan di `mapping/audit-ulang-scaffolding-2026-09-08.md`.
- Temuan kunci: hanya `bridge-hs-00.html` dan `bridge-ms-00.html` yang sudah menjadi HTML; `bridge-hs-01`/`bridge-ms-01` baru berupa metadata JSON dan belum di-inject sebagai step prasyarat.
- Dataset masih memiliki quiz `99999`, bookmark di luar segmen, dan beberapa quiz yang berada sebelum `startSeconds`; dataset produksi belum disetujui untuk diubah.
- Implementation plan bertahap tersimpan di `planning/01-implementation-plan-scaffolding-smp-sma.md`.

## Concrete Next Steps

1. Produksi HTML `bridge-hs-01` sampai `bridge-hs-05` dan `bridge-ms-01` sampai `bridge-ms-03`.
2. Revisi `bridge-ms-00` agar tidak mengajarkan TinyDB terlalu awal.
3. Buat dataset sequencing baru dengan bridge sebagai step dan prasyarat eksplisit.
4. Validasi ulang timestamp/bookmark/quiz sebelum integrasi LMS.
