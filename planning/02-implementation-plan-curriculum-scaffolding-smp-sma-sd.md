# Implementation Plan 02: Sequencing SMP–SMA dari nol dengan video dan materi jembatan

Diperbarui in-place 2026-09-08. Menggantikan isi rancangan awal topik yang sama. Fokus saat ini SMP–SMA; SD tetap template dan di luar audit rinci ini.

## Prinsip dan hasil

Materi lama berasal dari pertengahan program, sehingga siswa baru perlu onboarding alat dan fondasi. Gunakan video yang tersedia dan HTML slides untuk penjelasan yang kurang. Urutan ditentukan oleh prasyarat konkret dalam contoh/kuis, bukan aturan universal bahwa semua topik harus melewati if→loop→function. Pertahankan seluruh waktu kurasi asli.

Hasil: review rinci diperbarui pada `subprojects/02-curriculum-sequencing/mapping/review-tahap-1-smp-sma.md`, inventaris langkah bersumber, urutan lengkap video + tambahan, brief setiap materi tambahan, dan status bukti video/transkrip. Plan platform terpisah: [Plan 03](03-implementation-plan-lms-video-html-slides.md).

## Pelaksanaan

1. Rekam kebutuhan dan baseline metadata sumber lama serta JSON yang sudah diekspor.
2. Ekstrak transkrip YouTube; periksa transkrip lokal sebagai cadangan. Catat kegagalan akses dan jangan mengklaim menonton jika hanya membaca metadata/transkrip.
3. Baca isi segmen, bacaan, kode, dan kuis. Petakan konsep diajarkan vs digunakan dan prasyarat setiap langkah.
4. Susun urutan terperinci: onboarding → fondasi → materi tersedia → jembatan sebelum dependensi berikutnya. Setiap langkah mencantumkan ID sumber, batas asli, tujuan, prasyarat, tindakan, dan cek pemahaman.
5. Buat daftar produksi HTML slides: apa yang harus dijelaskan, urutan slide, contoh, latihan, rangkuman dan bookmark. Video baru opsional; jangan menunggu video baru untuk merancang alur.
6. Perbarui review in-place dan rekonsiliasi knowledge/state. Dataset produksi tidak diubah pada tahap review.
7. Sesudah konten dan bukti final: implementasikan mapping/data dengan snapshot pembanding waktu, uji dependensi dan kontrak media, kemudian integrasikan ke platform.

## Kriteria review

- Semua langkah SMA/SMP lama terpetakan eksplisit; tidak ada materi hilang diam-diam.
- Setiap tambahan memiliki penempatan, cakupan, dan latihan yang dapat diperiksa.
- Sumber rekaman, transkrip, metadata, dan inferensi dibedakan.
- Durasi potongan dan waktu interaksi dipreservasi, anomali dilaporkan.
- Keterbatasan verifikasi video tetap terlihat; audit parsial tidak dilabeli final penuh.
