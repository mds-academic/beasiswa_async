import os, json

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing"
DRAFTS_HTML_DIR = os.path.join(BASE_DIR, "drafts", "bridge-html")
os.makedirs(DRAFTS_HTML_DIR, exist_ok=True)

# 1. bridge-hs-01.json
with open(os.path.join(BASE_DIR, "slides", "bridge-hs-01.json"), "r", encoding="utf-8") as f:
    hs01_json = json.load(f)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-01.json"), "w", encoding="utf-8") as f:
    json.dump(hs01_json, f, indent=2, ensure_ascii=False)

# 2. bridge-hs-02.json
hs02_json = {
  "id": "bridge-hs-02",
  "level": "SMA",
  "kicker": "Materi Jembatan 02 · Dasar Python",
  "title": "Dari Input Teks Menjadi Logika Keputusan",
  "duration": "8 Menit Baca & Praktik",
  "type": "slides",
  "embedUrl": "slides/bridge-hs-02.html",
  "summary": "Pahami mengapa fungsi input() selalu menghasilkan tipe String, cara mengubah teks angka menjadi bilangan bulat dengan int(), menggunakan operator perbandingan (==, !=, >, <), dan aturan indentasi 4 spasi pada percabangan if-else.",
  "totalSlides": 8,
  "bookmarks": [
    { "slideIndex": 0, "label": "1. Mengapa Input Perlu Perlakuan Khusus?" },
    { "slideIndex": 1, "label": "2. Rahasia Terbesar input(): Selalu String" },
    { "slideIndex": 2, "label": "3. Konversi Tipe Data: int() & float()" },
    { "slideIndex": 3, "label": "4. Operator Perbandingan & Boolean" },
    { "slideIndex": 4, "label": "5. Aturan Indentasi Percabangan if-else" },
    { "slideIndex": 5, "label": "6. Simulator Pengecekan Saldo Kas" },
    { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
    { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 2" }
  ],
  "learningObjectives": [
    "Mengetahui bahwa input() selalu menghasilkan tipe String (teks)",
    "Mengubah teks angka menjadi integer dengan int() dan float()",
    "Menggunakan operator perbandingan untuk menghasilkan Boolean",
    "Menerapkan aturan indentasi 4 spasi dalam blok percabangan if-else"
  ],
  "practice": {
    "type": "simulation",
    "description": "Simulasi pengecekan saldo kas dan konversi input belanja"
  },
  "completionCriteria": {
    "quizScoreMin": 100,
    "interactiveCompleted": True
  }
}
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-02.json"), "w", encoding="utf-8") as f:
    json.dump(hs02_json, f, indent=2, ensure_ascii=False)

# 3. bridge-hs-03.json
hs03_json = {
  "id": "bridge-hs-03",
  "level": "SMA",
  "kicker": "Materi Jembatan 03 · Logika Iterasi",
  "title": "Mengulang Tanpa Bosan: List dan For Loop",
  "duration": "8 Menit Baca & Praktik",
  "type": "slides",
  "embedUrl": "slides/bridge-hs-03.html",
  "summary": "Kuasai struktur data List untuk menampung banyak data terurut, jalankan perulangan for item in list untuk memproses data secara otomatis, buat deret hitungan dengan range(), dan terapkan pola akumulator untuk menjumlahkan saldo keuangan.",
  "totalSlides": 8,
  "bookmarks": [
    { "slideIndex": 0, "label": "1. Masalah Besar Menulis 100 Variabel" },
    { "slideIndex": 1, "label": "2. Struktur Data List & Indeks Nol" },
    { "slideIndex": 2, "label": "3. Perulangan for item in list" },
    { "slideIndex": 3, "label": "4. Fungsi range() Generator Deret Angka" },
    { "slideIndex": 4, "label": "5. Pola Akumulator Menghitung Saldo" },
    { "slideIndex": 5, "label": "6. Visual Tracer Langkah Demi Langkah" },
    { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
    { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 3" }
  ],
  "learningObjectives": [
    "Membuat struktur data List dengan tanda kurung siku [ ]",
    "Menjalankan perulangan for untuk memproses elemen list",
    "Menggunakan range(start, stop) untuk hitungan berurutan",
    "Menerapkan pola accumulator (total += biaya) untuk menghitung saldo"
  ],
  "practice": {
    "type": "simulation",
    "description": "Tracing interaktif perubahan nilai total akumulator transaksi"
  },
  "completionCriteria": {
    "quizScoreMin": 100,
    "interactiveCompleted": True
  }
}
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-03.json"), "w", encoding="utf-8") as f:
    json.dump(hs03_json, f, indent=2, ensure_ascii=False)

# 4. bridge-hs-04.json
hs04_json = {
  "id": "bridge-hs-04",
  "level": "SMA",
  "kicker": "Materi Jembatan 04 · Modularisasi Kode",
  "title": "Fungsi: Mesin Cetak Kode Mandiri",
  "duration": "8 Menit Baca & Praktik",
  "type": "slides",
  "embedUrl": "slides/bridge-hs-04.html",
  "summary": "Pahami prinsip DRY (Don't Repeat Yourself), anatomi pembuatan fungsi dengan def, perbedaan parameter dan argumen, serta perbedaan krusial antara return (menghasilkan nilai) dan print (menampilkan teks di layar).",
  "totalSlides": 8,
  "bookmarks": [
    { "slideIndex": 0, "label": "1. Prinsip DRY: Don't Repeat Yourself" },
    { "slideIndex": 1, "label": "2. Anatomi Pembuatan Fungsi dengan def" },
    { "slideIndex": 2, "label": "3. Parameter vs Argumen" },
    { "slideIndex": 3, "label": "4. Perbedaan Krusial: return vs print()" },
    { "slideIndex": 4, "label": "5. Pemanggilan Fungsi Berulang Kali" },
    { "slideIndex": 5, "label": "6. Simulator Mesin Fungsi Diskon" },
    { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
    { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 3.5" }
  ],
  "learningObjectives": [
    "Mendefinisikan fungsi sendiri dengan def nama_fungsi(parameter):",
    "Membedakan parameter (wadah cetakan) dan argumen (nilai nyata)",
    "Memahami perbedaan penting antara return dan print",
    "Memanggil fungsi berulang kali dengan input berbeda"
  ],
  "practice": {
    "type": "simulation",
    "description": "Simulasi pemanggilan fungsi hitung_diskon dan penangkapan nilai return"
  },
  "completionCriteria": {
    "quizScoreMin": 100,
    "interactiveCompleted": True
  }
}
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-04.json"), "w", encoding="utf-8") as f:
    json.dump(hs04_json, f, indent=2, ensure_ascii=False)

# 5. bridge-hs-05.json
hs05_json = {
  "id": "bridge-hs-05",
  "level": "SMA",
  "kicker": "Materi Jembatan 05 · Struktur Data Lanjutan",
  "title": "Kamus Data: Menyimpan Transaksi dengan Dictionary",
  "duration": "8 Menit Baca & Praktik",
  "type": "slides",
  "embedUrl": "slides/bridge-hs-05.html",
  "summary": "Kuasai struktur data Dictionary {key: value} untuk menyimpan data berpasangan, akses dan perbarui nilai melalui kuncinya, susun tabel data profesional dalam format List of Dictionaries, dan catat transaksi baru dengan .append().",
  "totalSlides": 8,
  "bookmarks": [
    { "slideIndex": 0, "label": "1. Keterbatasan List Tunggal untuk Data Keuangan" },
    { "slideIndex": 1, "label": "2. Konsep Pasangan Key-Value Pair" },
    { "slideIndex": 2, "label": "3. Cara Mengakses & Mengubah Dictionary" },
    { "slideIndex": 3, "label": "4. Standar Industri: List of Dictionaries" },
    { "slideIndex": 4, "label": "5. Menambahkan Transaksi dengan .append()" },
    { "slideIndex": 5, "label": "6. Simulator Buku Kas Digital Interaktif" },
    { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
    { "slideIndex": 7, "label": "8. Rangkuman & Pintu Masuk Proyek Finansial" }
  ],
  "learningObjectives": [
    "Memahami konsep Key-Value pair pada struktur Dictionary { }",
    "Mengakses nilai dictionary menggunakan kuncinya: data['key']",
    "Menyimpan sekumpulan record transaksi dalam format List of Dictionaries",
    "Menambahkan item transaksi baru ke dalam list riwayat dengan .append()"
  ],
  "practice": {
    "type": "simulation",
    "description": "Buku kas digital interaktif menambah dan melihat struktur data JSON dictionary"
  },
  "completionCriteria": {
    "quizScoreMin": 100,
    "interactiveCompleted": True
  }
}
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-05.json"), "w", encoding="utf-8") as f:
    json.dump(hs05_json, f, indent=2, ensure_ascii=False)

# 6. bridge-ms-00.json (Revisi Bersih tanpa TinyDB)
with open(os.path.join(BASE_DIR, "slides", "bridge-ms-00.json"), "r", encoding="utf-8") as f:
    ms00_json = json.load(f)
ms00_json["title"] = "Panduan Lengkap MIT App Inventor & Uji Proyek Pertamaku"
ms00_json["kicker"] = "Materi Jembatan 00 · Desain UI & Blok Logika SMP"
ms00_json["summary"] = "Panduan komprehensif membuka MIT App Inventor di browser, memahami anatomi Designer (Palette, Viewer, Components, Properties) dan Blocks Editor, merakit tombol interaktif, serta menguji langsung di HP Android via AI2 Companion tanpa TinyDB."
ms00_json["bookmarks"] = [
    { "slideIndex": 0, "label": "1. Pengenalan App Inventor SMP" },
    { "slideIndex": 1, "label": "2. Mengapa Belajar App Inventor?" },
    { "slideIndex": 2, "label": "3. Cara Kerja Ekosistem Browser & HP" },
    { "slideIndex": 3, "label": "4. Langkah 1: Login Akun Google" },
    { "slideIndex": 4, "label": "5. Langkah 2: Start New Project" },
    { "slideIndex": 5, "label": "6. Langkah 3: 4 Panel Utama Designer" },
    { "slideIndex": 6, "label": "7. Langkah 4: Memasukkan Komponen UI" },
    { "slideIndex": 7, "label": "8. Langkah 5: Berpindah ke Blocks Editor" },
    { "slideIndex": 8, "label": "9. Langkah 6: Anatomi Balok Logika" },
    { "slideIndex": 9, "label": "10. Langkah 7: Balok Event Handler" },
    { "slideIndex": 10, "label": "11. Langkah 8: Menguji Aplikasi di HP (AI Companion)" },
    { "slideIndex": 11, "label": "12. Simulasi Live Testing di Layar HP" },
    { "slideIndex": 12, "label": "13. Uji Pemahaman Cek Kesiapan" },
    { "slideIndex": 13, "label": "14. Glosarium Cepat & Tips Sukses" },
    { "slideIndex": 14, "label": "15. Penutup & Menuju Modul 1" }
]
ms00_json["totalSlides"] = 15
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-00.json"), "w", encoding="utf-8") as f:
    json.dump(ms00_json, f, indent=2, ensure_ascii=False)

# 7. bridge-ms-01.json
with open(os.path.join(BASE_DIR, "slides", "bridge-ms-01.json"), "r", encoding="utf-8") as f:
    ms01_json = json.load(f)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-01.json"), "w", encoding="utf-8") as f:
    json.dump(ms01_json, f, indent=2, ensure_ascii=False)

# 8. bridge-ms-02.json
ms02_json = {
  "id": "bridge-ms-02",
  "level": "SMP",
  "kicker": "Materi Jembatan 02 · Penyimpanan Data SMP",
  "title": "Buku Kas Digital: Menyimpan Data dengan TinyDB",
  "duration": "8 Menit Baca & Eksplorasi",
  "type": "slides",
  "embedUrl": "slides/bridge-ms-02.html",
  "summary": "Pahami perbedaan memori sementara RAM dan memori persisten TinyDB, komponen Non-Visible di laci Storage, konsep loker Tag dan ValueToStore, cara menyimpan dengan StoreValue, membaca dengan GetValue, serta fungsi penyelamat valueIfTagNotThere.",
  "totalSlides": 8,
  "bookmarks": [
    { "slideIndex": 0, "label": "1. Masalah Lupa Ingatan: RAM vs TinyDB" },
    { "slideIndex": 1, "label": "2. Komponen Non-Visible TinyDB di Storage" },
    { "slideIndex": 2, "label": "3. Konsep Tag dan Value" },
    { "slideIndex": 3, "label": "4. call StoreValue & call GetValue" },
    { "slideIndex": 4, "label": "5. Mengatur Ulang Data dengan ClearTag" },
    { "slideIndex": 5, "label": "6. Simulator Penyimpanan Data TinyDB" },
    { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
    { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 4" }
  ],
  "learningObjectives": [
    "Membedakan memori sementara (variabel hilang saat app tutup) dan persisten (TinyDB tetap tersimpan)",
    "Menggunakan call TinyDB.StoreValue dengan Tag dan ValueToStore",
    "Mengambil data dengan call TinyDB.GetValue dan menyediakan valueIfTagNotThere",
    "Menghapus data tersimpan menggunakan call TinyDB.ClearTag untuk reset saldo"
  ],
  "practice": {
    "type": "simulation",
    "description": "Simulasi simpan saldo dengan Tag, tutup aplikasi, dan baca kembali nilainya"
  },
  "completionCriteria": {
    "quizScoreMin": 100,
    "interactiveCompleted": True
  }
}
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-02.json"), "w", encoding="utf-8") as f:
    json.dump(ms02_json, f, indent=2, ensure_ascii=False)

# 9. bridge-ms-03.json
ms03_json = {
  "id": "bridge-ms-03",
  "level": "SMP",
  "kicker": "Materi Jembatan 03 · Kualitas & Pengujian",
  "title": "Detektif Blok: Debugging & Uji Kasus Form",
  "duration": "8 Menit Baca & Eksplorasi",
  "type": "slides",
  "embedUrl": "slides/bridge-ms-03.html",
  "summary": "Kuasai seni mendeteksi bug: membedakan tanda silang merah (Error) dan segitiga kuning (Warning), menggunakan fitur rahasia 'Do It' untuk menguji balok mandiri, menyusun tabel kasus uji (normal, kosong, ekstrem), serta etika menjaga privasi data pengguna.",
  "totalSlides": 8,
  "bookmarks": [
    { "slideIndex": 0, "label": "1. Menjadi Detektif Koding" },
    { "slideIndex": 1, "label": "2. Silang Merah vs Segitiga Kuning" },
    { "slideIndex": 2, "label": "3. Fitur Rahasia Pengujian: 'Do It'" },
    { "slideIndex": 3, "label": "4. Membuat Tabel Kasus Uji (Test Cases)" },
    { "slideIndex": 4, "label": "5. Etika & Privasi Perlindungan Data" },
    { "slideIndex": 5, "label": "6. Detektif Balok Tertukar" },
    { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
    { "slideIndex": 7, "label": "8. Rangkuman & Pintu Masuk Proyek Akhir" }
  ],
  "learningObjectives": [
    "Mengenali tanda error pada App Inventor (silang merah vs peringatan kuning)",
    "Menerapkan teknik isolasi: menguji balok satu per satu dengan Do It",
    "Membuat tabel kasus uji: input normal, input kosong, dan input ekstrem",
    "Menghargai privasi digital: tidak pernah menyimpan password atau PIN dalam teks polos"
  ],
  "practice": {
    "type": "simulation",
    "description": "Menemukan dan memperbaiki balok yang tertukar antara setter dan getter"
  },
  "completionCriteria": {
    "quizScoreMin": 100,
    "interactiveCompleted": True
  }
}
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-03.json"), "w", encoding="utf-8") as f:
    json.dump(ms03_json, f, indent=2, ensure_ascii=False)

print("ALL 9 BRIDGE JSON METADATA GENERATED SUCCESSFULLY IN drafts/bridge-html/!")
