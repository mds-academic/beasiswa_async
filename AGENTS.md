# Project Agent Rules: UOB My Digital Space - Async LMS & Curriculum Revamp

## Project Architecture & Context Isolation

Proyek ini terbagi menjadi dua subproject mandiri dengan fokus kerja yang berbeda:
1. **`subprojects/01-lms-platform/`**: Pengembangan antarmuka web player LMS, komponen interaksi video kuis, login auth, dan backend Google Apps Script.
2. **`subprojects/02-curriculum-sequencing/`**: Penataan ulang pedagogis alur video koding, struktur kurikulum, metadata kuis, dan data injeksi.

Setiap subproject memiliki file `AGENTS.md`, `STATE.md`, `MEMORY.md`, dan `HISTORY.md` masing-masing. Ketika agen mengerjakan tugas spesifik subproject, utamakan pembacaan dan pencatatan riwayat di subproject terkait.

## Key Rules & Constraints

- **Language Mirroring**: Selalu gunakan Bahasa Indonesia sesuai bahasa komunikasi user.
- **Clean Markdown & Unicode**: Hindari sintaks LaTeX ($...$, $$...$$, dsb.). Gunakan teks murni dan simbol Unicode langsung.
- **Git Checkpoint Automation**: Lakukan git commit checkpoint otomatis setiap ada perubahan substansial pada kode atau dokumen. Gunakan remote personal `madyazdhil` (`git@github.com-personal:madyazdhil/<repo>.git`) saat user mengonfirmasi push.
- **Sequential Implementation Plans**: Setiap rencana implementasi disimpan sebagai Markdown di folder `planning/<NN>-implementation-plan-<topic>.md`. Jika ada revisi/renewal dari rencana lama, perbarui langsung file lama tersebut (in-place update). Jangan buat nomor baru kecuali topiknya benar-benar inisiatif baru. Jika plan lama digantikan, wajib beri header `❌ [SUPERSEDED / TIDAK DIGUNAKAN LAGI]`.
- **Preserve Brand Style**: Desain UI LMS mempertahankan identitas visual UOB My Digital Space yang elegan, interaktif, dan modern.
