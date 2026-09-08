# State: Subproject 02 - Curriculum Sequencing

## Current Status

- **Status**: Milestone 1 Complete — Audit & Scaffolding Re-sequencing Finished.
- **Active Focus**: Validasi alur kurikulum dan persiapan injeksi interaktif ke web app LMS.
- **Last Updated**: 2026-09-08

## Completed

- Audit menyeluruh video & kuis eksisting dari Highschool (A, B, C, D) dan Middleschool (A, B, C, D).
- Analisis kesenjangan (*gap analysis*) bagi pemula mutlak ([curriculum-audit-and-scaffolding-gap-analysis.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/mapping/curriculum-audit-and-scaffolding-gap-analysis.md)).
- Penyusunan ulang alur materi logis dan ekspor dataset JSON tervalidasi:
  - SMA: [`courseData-highschool.json`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/output/courseData-highschool.json) (Modul 0 s.d. 5)
  - SMP: [`courseData-middleschool.json`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/output/courseData-middleschool.json) (Modul 0 s.d. 5)
  - SD: [`courseData-upperprimary.json`](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/output/courseData-upperprimary.json) (Template Modular Modul 0 s.d. 4)
- Injeksi dataset ke direktori Subproject 01 (`subprojects/01-lms-platform/src/data/`).

## Concrete Next Steps

1. Review bersama user terkait rekomendasi penambahan pengantar `print()`/variabel di SMA dan App Inventor di SMP.
2. Lanjut ke Subproject 01: Scaffolding frontend web app player dengan data riil yang baru selesai disusun.
