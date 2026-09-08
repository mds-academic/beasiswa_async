# State: Subproject 02 - Curriculum Sequencing

## Current Status

- **Status**: Overhaul Materi Jembatan 00 (SMA Google Colab & SMP MIT App Inventor) selesai dengan template neo-brutalisme kanonik & screenshot real CDN Ruangguru.
- **Active Focus**: Integrasi bridge slides ke kurikulum platform LMS dan persiapan bridge slides berikutnya.
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

## Concrete Next Steps

1. Uji integrasi materi jembatan di dalam LMS player web app.
2. Melanjutkan pembuatan bridge slides berikutnya sesuai kurasi review (`bridge-hs-01`, `bridge-ms-01`).
3. Pemutakhiran dataset kurikulum final untuk disuntikkan ke portal belajar.

