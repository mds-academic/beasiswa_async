# State: Subproject 02 - Curriculum Sequencing

## Current Status

- **Status**: Review rinci tahap 1 selesai — dataset produksi belum diubah.
- **Active Focus**: Persetujuan urutan kanonik dan backlog HTML slides, lalu verifikasi timestamp yang ditandai.
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

1. User meninjau urutan kanonik SMA/SMP dan backlog bridge slides pada review rinci.
2. Konfirmasi enam temuan timestamp `review_required` dan dua overlap video.
3. Setelah disetujui, ubah dataset dengan `sourceStepId`/media contract tanpa mengubah timing sumber.
4. Baru lanjut ke Subproject 01 untuk renderer video + HTML slides.

## Checkpoint review 2026-09-08

- Review rinci in-place: [review tahap 1 SMP–SMA](mapping/review-tahap-1-smp-sma.md).
- Seluruh 15 video unik sudah diekstrak caption lokalnya; statusnya tetap caption-based, bukan klaim peninjauan audiovisual penuh.
- Review kini memetakan setiap source step, urutan kanonik, gap, bridge slides, latihan, dan tindakan preserve/move/split/add.
- JSON produksi dan player belum diubah. Enam anomali timestamp dan overlap tetap terbuka untuk keputusan manual.
