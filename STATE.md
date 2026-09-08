# State: UOB My Digital Space - Async LMS & Curriculum Revamp

## Current Status

- **Status**: Initialized — PRD & Implementation Plan drafted, awaiting user review.
- **Active Focus**: Review PRD, finalisasi struktur repositori, dan verifikasi alur kurikulum & arsitektur web app.
- **Last Updated**: 2026-09-08

## Completed

- Inisialisasi struktur proyek induk `projects/uob-async-lms/` beserta subproject `subprojects/01-lms-platform/` dan `subprojects/02-curriculum-sequencing/`.
- Penyusunan draft PRD komprehensif ([PRD.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/PRD.md)).
- Penyusunan Rencana Implementasi Bertahap ([01-implementation-plan-uob-async-lms-and-curriculum-revamp.md](file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/planning/01-implementation-plan-uob-async-lms-and-curriculum-revamp.md)).
- Capture percakapan awal verbatim ke dalam `HISTORY.md`.

## Blockers & Open Questions

- Verifikasi daftar sekolah dan pemetaan jenjang (SD / SMP / SMA) pada Google Spreadsheet eksisting.
- Penentuan format data kurikulum akhir (`JSON` statis dalam repo atau dynamic fetch via Google Sheets/API).

## Concrete Next Steps

1. Dapatkan konfirmasi dan persetujuan user atas PRD dan Implementation Plan.
2. Inisialisasi repository git lokal dan checkpoint commit pertama.
3. Mulai Subproject 2 (Curriculum Sequencing): Audit daftar video eksisting di `Academic_Content/B2B/UOB/Async/` (Highschool, Middleschool, UpperPrimary) dan susun alur koding logis.
4. Mulai Subproject 1 (LMS Platform): Setup scaffold web app modern dengan Vue 3 / Vite dan integrasi Apps Script baru.
