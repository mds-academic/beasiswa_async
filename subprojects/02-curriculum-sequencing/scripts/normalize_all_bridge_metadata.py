import os, json

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing"
DRAFTS_HTML_DIR = os.path.join(BASE_DIR, "drafts", "bridge-html")
BLUEPRINTS_PATH = os.path.join(BASE_DIR, "drafts", "qa", "blueprints.json")

with open(BLUEPRINTS_PATH, "r", encoding="utf-8") as f:
    blueprints = json.load(f)

# Definitions of all 10 bridges
bridges = {
    "bridge-hs-00": {
        "id": "bridge-hs-00",
        "level": "SMA",
        "kicker": "Materi Jembatan 00 · Dasar Python & Cloud Editor",
        "title": "Panduan Lengkap Google Colab & Pemrograman Python Pertamaku",
        "duration": "10 Menit Baca Mandiri & Praktik",
        "type": "slide",
        "slideUrl": "./slides/bridge-hs-00.html",
        "embedUrl": "slides/bridge-hs-00.html",
        "prerequisiteStepIds": ["hs-0-0"],
        "summary": "Panduan komprehensif membuka Google Colaboratory di browser tanpa instalasi software, memahami anatomi Code Cell vs Text Cell, menulis fungsi print(), mengeksekusi kode dengan shortcut Shift+Enter, serta tips koding anti-error.",
        "totalSlides": 16,
        "learningObjectives": [
            "Membuka notebook Google Colab baru di browser tanpa instalasi lokal",
            "Menulis dan menjalankan kode Python pertama dengan perintah print()",
            "Membedakan fungsi Code Cell (untuk kode) dan Text Cell (untuk catatan Markdown)",
            "Mengeksekusi sel kode menggunakan pintasan keyboard Shift+Enter"
        ],
        "practice": {
            "type": "simulation",
            "description": "Simulasi interaktif menulis perintah print() dan menjalankan sel Colab"
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": "Menyelesaikan seluruh slide dan menjawab kuis pintasan Colab dengan benar"
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Pengenalan Python SMA" },
            { "slideIndex": 1, "label": "2. Mengapa Belajar Python?" },
            { "slideIndex": 2, "label": "3. Apa itu Google Colaboratory?" },
            { "slideIndex": 3, "label": "4. Colab vs Jupyter Notebook Lokal" },
            { "slideIndex": 4, "label": "5. Langkah 1: Buka Colab & New Notebook" },
            { "slideIndex": 5, "label": "6. Langkah 2: Anatomi Antarmuka Colab" },
            { "slideIndex": 6, "label": "7. Langkah 3: Code Cell vs Text Cell" },
            { "slideIndex": 7, "label": "8. Langkah 4: Fungsi print()" },
            { "slideIndex": 8, "label": "9. Langkah 5: Cara Menjalankan Kode" },
            { "slideIndex": 9, "label": "10. Langkah 6: Konsep Variabel" },
            { "slideIndex": 10, "label": "11. Langkah 7: 4 Tipe Data Utama" },
            { "slideIndex": 11, "label": "12. Langkah 8: Google Drive & Unduh File" },
            { "slideIndex": 12, "label": "13. Simulasi Koding Interaktif" },
            { "slideIndex": 13, "label": "14. Kuis Pemahaman Mandiri" },
            { "slideIndex": 14, "label": "15. Glosarium & Tips Anti-Error" },
            { "slideIndex": 15, "label": "16. Penutup & Menuju Modul 1" }
        ],
        "quizzes": [
            {
                "question": "Pintasan keyboard (shortcut) apa yang paling cepat untuk menjalankan sel kode di Google Colab?",
                "options": ["A. Ctrl + C", "B. Shift + Enter", "C. Alt + F4", "D. Esc + Delete"],
                "answer": 1,
                "explanation": "Shift + Enter mengeksekusi kode pada sel saat ini dan langsung berpindah ke sel berikutnya."
            }
        ]
    },
    "bridge-hs-01": {
        "id": "bridge-hs-01",
        "level": "SMA",
        "kicker": blueprints["sma"]["bridge-hs-01"]["kicker"],
        "title": blueprints["sma"]["bridge-hs-01"]["title"],
        "duration": "8 Menit Baca Mandiri & Praktik",
        "type": "slide",
        "slideUrl": "./slides/bridge-hs-01.html",
        "embedUrl": "slides/bridge-hs-01.html",
        "prerequisiteStepIds": blueprints["sma"]["bridge-hs-01"]["prerequisites"],
        "summary": "Variabel adalah wadah penyimpanan di memori komputer yang diberi nama label khusus. Gunakan tanda sama dengan (=) untuk menugaskan nilai. Kenali perbedaan mendasar antara teks (String) dan angka (Integer/Float) agar program tidak salah menghitung.",
        "totalSlides": 8,
        "learningObjectives": blueprints["sma"]["bridge-hs-01"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["sma"]["bridge-hs-01"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["sma"]["bridge-hs-01"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Analogi Kotak Berlabel" },
            { "slideIndex": 1, "label": "2. Membuat Variabel di Python" },
            { "slideIndex": 2, "label": "3. Tipe Data: String (Teks)" },
            { "slideIndex": 3, "label": "4. Tipe Data: Integer & Float" },
            { "slideIndex": 4, "label": "5. Jebakan: Teks '10' vs Angka 10" },
            { "slideIndex": 5, "label": "6. Aturan Penamaan Variabel (snake_case)" },
            { "slideIndex": 6, "label": "7. Laboratorium Mini: Type Inspector" },
            { "slideIndex": 7, "label": "8. Kuis Pemahaman & Rangkuman" }
        ],
        "quizzes": [
            {
                "question": "Jika kita menjalankan kode: a = '50' lalu b = '20', berapakah hasil dari print(a + b)?",
                "options": ["A. 70", "B. '5020'", "C. Error", "D. 50"],
                "answer": 1,
                "explanation": "Karena '50' dan '20' dibungkus tanda kutip, Python memperlakukannya sebagai String (teks). Operator + akan menggabungkan kedua teks menjadi '5020'."
            }
        ]
    },
    "bridge-hs-02": {
        "id": "bridge-hs-02",
        "level": "SMA",
        "kicker": blueprints["sma"]["bridge-hs-02"]["kicker"],
        "title": blueprints["sma"]["bridge-hs-02"]["title"],
        "duration": "8 Menit Baca & Praktik",
        "type": "slide",
        "slideUrl": "./slides/bridge-hs-02.html",
        "embedUrl": "slides/bridge-hs-02.html",
        "prerequisiteStepIds": blueprints["sma"]["bridge-hs-02"]["prerequisites"],
        "summary": "Pahami mengapa fungsi input() selalu menghasilkan tipe String, cara mengubah teks angka menjadi bilangan bulat dengan int(), menggunakan operator perbandingan (==, !=, >, <), dan aturan indentasi 4 spasi pada percabangan if-else.",
        "totalSlides": 8,
        "learningObjectives": blueprints["sma"]["bridge-hs-02"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["sma"]["bridge-hs-02"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["sma"]["bridge-hs-02"]["completion_criteria"]
        },
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
        "quizzes": [
            {
                "question": "Jika pengguna memasukkan angka '25000' pada fungsi nominal = input('Masukkan belanja: '), tipe data apa yang dimiliki variabel nominal?",
                "options": ["A. Integer (bilangan bulat)", "B. String (teks)", "C. Float (desimal)", "D. Boolean (True/False)"],
                "answer": 1,
                "explanation": "Fungsi input() di Python selalu mengembalikan nilai bertipe String, meskipun pengguna mengetik angka."
            }
        ]
    },
    "bridge-hs-03": {
        "id": "bridge-hs-03",
        "level": "SMA",
        "kicker": blueprints["sma"]["bridge-hs-03"]["kicker"],
        "title": blueprints["sma"]["bridge-hs-03"]["title"],
        "duration": "8 Menit Baca & Praktik",
        "type": "slide",
        "slideUrl": "./slides/bridge-hs-03.html",
        "embedUrl": "slides/bridge-hs-03.html",
        "prerequisiteStepIds": blueprints["sma"]["bridge-hs-03"]["prerequisites"],
        "summary": "Membuat List dengan tanda kurung siku [ ], menjalankan loop for item in list untuk memproses elemen satu per satu, memahami batas range(start, stop), dan menerapkan pola accumulator total = total + x untuk agregasi data finansial.",
        "totalSlides": 8,
        "learningObjectives": blueprints["sma"]["bridge-hs-03"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["sma"]["bridge-hs-03"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["sma"]["bridge-hs-03"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Masalah Pengulangan Manual" },
            { "slideIndex": 1, "label": "2. Struktur Data List [ ]" },
            { "slideIndex": 2, "label": "3. Perulangan for ... in list" },
            { "slideIndex": 3, "label": "4. Menghasilkan Deret Angka: range()" },
            { "slideIndex": 4, "label": "5. Pola Akumulator: total = total + n" },
            { "slideIndex": 5, "label": "6. Simulasi Tabel Jejak Akumulasi Kas" },
            { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
            { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 3" }
        ],
        "quizzes": [
            {
                "question": "Berapakah nilai akhir dari variabel total setelah kode ini selesai dijalankan?\ntotal = 0\nfor x in [10, 20, 30]:\n    total = total + x",
                "options": ["A. 30", "B. 50", "C. 60", "D. 0"],
                "answer": 2,
                "explanation": "Loop menjumlahkan: 0 + 10 = 10, lalu 10 + 20 = 30, lalu 30 + 30 = 60."
            }
        ]
    },
    "bridge-hs-04": {
        "id": "bridge-hs-04",
        "level": "SMA",
        "kicker": blueprints["sma"]["bridge-hs-04"]["kicker"],
        "title": blueprints["sma"]["bridge-hs-04"]["title"],
        "duration": "8 Menit Baca & Praktik",
        "type": "slide",
        "slideUrl": "./slides/bridge-hs-04.html",
        "embedUrl": "slides/bridge-hs-04.html",
        "prerequisiteStepIds": blueprints["sma"]["bridge-hs-04"]["prerequisites"],
        "summary": "Definisikan fungsi modular dengan def nama(parameter):, bedakan parameter vs argumen, pahami perbedaan mendasar perintah return (menghasilkan nilai yang bisa disimpan) vs print() (hanya mencetak ke layar), dan reusability kode.",
        "totalSlides": 8,
        "learningObjectives": blueprints["sma"]["bridge-hs-04"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["sma"]["bridge-hs-04"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["sma"]["bridge-hs-04"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Bahaya Copy-Paste Kode" },
            { "slideIndex": 1, "label": "2. Anatomi Fungsi: Kata Kunci def" },
            { "slideIndex": 2, "label": "3. Parameter vs Argumen" },
            { "slideIndex": 3, "label": "4. Perbedaan Kritis: return vs print()" },
            { "slideIndex": 4, "label": "5. Memanggil Fungsi Berkali-kali" },
            { "slideIndex": 5, "label": "6. Laboratorium Fungsi: Kalkulator Diskon" },
            { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
            { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 3.5" }
        ],
        "quizzes": [
            {
                "question": "Jika kita ingin hasil perhitungan dari sebuah fungsi bisa disimpan ke dalam variabel atau dipakai untuk perhitungan lain, perintah apa yang harus digunakan di akhir fungsi?",
                "options": ["A. print()", "B. return", "C. break", "D. input()"],
                "answer": 1,
                "explanation": "Perintah return mengembalikan nilai ke pemanggil fungsi sehingga dapat disimpan dalam variabel. print() hanya menampilkan ke layar."
            }
        ]
    },
    "bridge-hs-05": {
        "id": "bridge-hs-05",
        "level": "SMA",
        "kicker": blueprints["sma"]["bridge-hs-05"]["kicker"],
        "title": blueprints["sma"]["bridge-hs-05"]["title"],
        "duration": "8 Menit Baca & Praktik",
        "type": "slide",
        "slideUrl": "./slides/bridge-hs-05.html",
        "embedUrl": "slides/bridge-hs-05.html",
        "prerequisiteStepIds": blueprints["sma"]["bridge-hs-05"]["prerequisites"],
        "summary": "Pahami konsep Key-Value pair pada struktur data Dictionary { }, akses data via data['nominal'], simpan riwayat mutasi transaksi berupa List of Dictionaries, dan pelajari cara menambahkan transaksi baru dengan method .append().",
        "totalSlides": 8,
        "learningObjectives": blueprints["sma"]["bridge-hs-05"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["sma"]["bridge-hs-05"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["sma"]["bridge-hs-05"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Keterbatasan List Tunggal" },
            { "slideIndex": 1, "label": "2. Kamus Data: Key-Value Pair { }" },
            { "slideIndex": 2, "label": "3. Mengakses Nilai Menggunakan Kunci" },
            { "slideIndex": 3, "label": "4. Menyimpan Riwayat: List of Dictionaries" },
            { "slideIndex": 4, "label": "5. Menambah Transaksi: Method .append()" },
            { "slideIndex": 5, "label": "6. Simulator Buku Kas Digital" },
            { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
            { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 4" }
        ],
        "quizzes": [
            {
                "question": "Jika transaksi = {'kategori': 'Makan', 'nominal': 15000}, bagaimana cara mengambil angka nominal 15000 tersebut?",
                "options": ["A. transaksi[0]", "B. transaksi['nominal']", "C. transaksi.nominal", "D. transaksi.get_all()"],
                "answer": 1,
                "explanation": "Pada dictionary Python, nilai diakses menggunakan tanda kurung siku dengan nama kuncinya: transaksi['nominal']."
            }
        ]
    },
    "bridge-ms-00": {
        "id": "bridge-ms-00",
        "level": "SMP",
        "kicker": "Materi Jembatan 00 · Desain UI & Blok Logika SMP",
        "title": "Panduan Lengkap MIT App Inventor & Uji Proyek Pertamaku",
        "duration": "10 Menit Baca Mandiri & Eksplorasi",
        "type": "slide",
        "slideUrl": "./slides/bridge-ms-00.html",
        "embedUrl": "slides/bridge-ms-00.html",
        "prerequisiteStepIds": ["ms-0-3"],
        "summary": "Panduan komprehensif membuka MIT App Inventor di browser, memahami 4 panel utama Designer (Palette, Viewer, Components, Properties), merakit balok di Blocks Editor, dan menguji aplikasi di HP via AI2 Companion secara langsung.",
        "totalSlides": 15,
        "learningObjectives": [
            "Mengenal ekosistem MIT App Inventor (Browser Designer + Blocks Editor + AI Companion)",
            "Memahami anatomi 4 panel Designer: Palette, Viewer, Components, dan Properties",
            "Merakit balok logika event handler sederhana (when Button.Click)",
            "Menghubungkan proyek ke HP menggunakan AI2 Companion untuk live testing"
        ],
        "practice": {
            "type": "simulation",
            "description": "Simulasi interaktif tombol klik mengubah label sapaan di simulator layar HP"
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": "Menyelesaikan seluruh tur platform dan menjawab kuis panel Designer dengan benar"
        },
        "bookmarks": [
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
        ],
        "quizzes": [
            {
                "question": "Di bagian manakah kita mengatur warna tombol dan ukuran teks?",
                "options": ["A. Palette", "B. Viewer", "C. Properties", "D. Blocks Built-in"],
                "answer": 2,
                "explanation": "Kolom Properties di sebelah kanan digunakan untuk mengatur atribut visual komponen."
            },
            {
                "question": "Di manakah kita merakit logika balok agar tombol bisa bereaksi saat ditekan jari?",
                "options": [
                    "A. Di Blocks Editor (layar perakitan balok)",
                    "B. Di Google Drive",
                    "C. Di Pengaturan HP",
                    "D. Di Palette User Interface"
                ],
                "answer": 0,
                "explanation": "Blocks Editor adalah ruang kerja khusus menyusun balok logika event-driven."
            }
        ]
    },
    "bridge-ms-01": {
        "id": "bridge-ms-01",
        "level": "SMP",
        "kicker": blueprints["smp"]["bridge-ms-01"]["kicker"],
        "title": blueprints["smp"]["bridge-ms-01"]["title"],
        "duration": "8 Menit Baca & Eksplorasi",
        "type": "slide",
        "slideUrl": "./slides/bridge-ms-01.html",
        "embedUrl": "slides/bridge-ms-01.html",
        "prerequisiteStepIds": blueprints["smp"]["bridge-ms-01"]["prerequisites"],
        "summary": "Pahami konsep Event-Driven Programming di App Inventor: komputer menunggu kejadian (when Button.Click) sebelum bertindak. Pelajari cara mengambil input dari TextBox.Text, menggabungkannya dengan blok join, menampilkannya di Label.Text, dan menyimpan nilai ke variabel blok.",
        "totalSlides": 8,
        "learningObjectives": blueprints["smp"]["bridge-ms-01"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["smp"]["bridge-ms-01"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["smp"]["bridge-ms-01"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Bagaimana Aplikasi Bereaksi?" },
            { "slideIndex": 1, "label": "2. Blok Emas: when Button.Click" },
            { "slideIndex": 2, "label": "3. Membaca Input: TextBox.Text" },
            { "slideIndex": 3, "label": "4. Menampilkan Output: Label.Text" },
            { "slideIndex": 4, "label": "5. Menggabungkan Kata: Blok join" },
            { "slideIndex": 5, "label": "6. Simulator Tombol Sapaan Cerdas" },
            { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
            { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 1" }
        ],
        "quizzes": [
            {
                "question": "Kapan balok-balok yang diletakkan di dalam when Button1.Click do akan dijalankan?",
                "options": [
                    "A. Setiap 1 detik sekali secara otomatis",
                    "B. Hanya saat tombol ditekan oleh jari pengguna",
                    "C. Saat laptop ditutup",
                    "D. Saat proyek baru dibuat di Designer"
                ],
                "answer": 1,
                "explanation": "Balok event handler hanya aktif mengeksekusi isinya saat tombol ditekan oleh pengguna."
            }
        ]
    },
    "bridge-ms-02": {
        "id": "bridge-ms-02",
        "level": "SMP",
        "kicker": blueprints["smp"]["bridge-ms-02"]["kicker"],
        "title": blueprints["smp"]["bridge-ms-02"]["title"],
        "duration": "8 Menit Baca & Eksplorasi",
        "type": "slide",
        "slideUrl": "./slides/bridge-ms-02.html",
        "embedUrl": "slides/bridge-ms-02.html",
        "prerequisiteStepIds": blueprints["smp"]["bridge-ms-02"]["prerequisites"],
        "summary": "Membedakan memori sementara (RAM) vs penyimpanan persisten (TinyDB), menggunakan blok call TinyDB.StoreValue dengan Tag dan ValueToStore, membaca data via call TinyDB.GetValue dengan penanganan default ValueIfTagNotThere, dan menghapus tag.",
        "totalSlides": 8,
        "learningObjectives": blueprints["smp"]["bridge-ms-02"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["smp"]["bridge-ms-02"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["smp"]["bridge-ms-02"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Ke Mana Perginya Data?" },
            { "slideIndex": 1, "label": "2. Solusi Persisten: TinyDB" },
            { "slideIndex": 2, "label": "3. Menyimpan Data: Tag & ValueToStore" },
            { "slideIndex": 3, "label": "4. Mengambil Data: GetValue & Nilai Default" },
            { "slideIndex": 4, "label": "5. Menghapus Data: ClearTag" },
            { "slideIndex": 5, "label": "6. Simulator Brankas Kas TinyDB" },
            { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
            { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 4" }
        ],
        "quizzes": [
            {
                "question": "Mengapa kita harus mengisi blok 'valueIfTagNotThere' saat memanggil TinyDB.GetValue?",
                "options": [
                    "A. Agar layar HP tidak pecah",
                    "B. Agar aplikasi tidak error jika data dengan Tag tersebut belum pernah disimpan sebelumnya",
                    "C. Untuk mengirim data otomatis ke server Google",
                    "D. Agar warna teks tombol berubah menjadi hijau"
                ],
                "answer": 1,
                "explanation": "valueIfTagNotThere memberikan nilai cadangan/default jika Tag yang diminta belum pernah tersimpan di HP."
            }
        ]
    },
    "bridge-ms-03": {
        "id": "bridge-ms-03",
        "level": "SMP",
        "kicker": blueprints["smp"]["bridge-ms-03"]["kicker"],
        "title": blueprints["smp"]["bridge-ms-03"]["title"],
        "duration": "8 Menit Baca & Eksplorasi",
        "type": "slide",
        "slideUrl": "./slides/bridge-ms-03.html",
        "embedUrl": "slides/bridge-ms-03.html",
        "prerequisiteStepIds": blueprints["smp"]["bridge-ms-03"]["prerequisites"],
        "summary": "Mengenali indikator error di App Inventor, mengisolasi blok dengan fitur Do It, merancang tabel skenario pengujian (input normal, batas, dan ekstrem/kosong), serta menerapkan etika privasi data pada form aplikasi.",
        "totalSlides": 8,
        "learningObjectives": blueprints["smp"]["bridge-ms-03"]["objectives"],
        "practice": {
            "type": "simulation",
            "description": blueprints["smp"]["bridge-ms-03"]["practice"]
        },
        "completionCriteria": {
            "quizScoreMin": 100,
            "interactiveCompleted": True,
            "description": blueprints["smp"]["bridge-ms-03"]["completion_criteria"]
        },
        "bookmarks": [
            { "slideIndex": 0, "label": "1. Ketika Aplikasi Bertingkah Aneh" },
            { "slideIndex": 1, "label": "2. Indikator Error App Inventor" },
            { "slideIndex": 2, "label": "3. Jurus Isolasi: Fitur Do It" },
            { "slideIndex": 3, "label": "4. Tabel Uji Kasus (Test Cases)" },
            { "slideIndex": 4, "label": "5. Etika & Privasi Data Pengguna" },
            { "slideIndex": 5, "label": "6. Ruang Bedah Bug: Temukan Blok yang Tertukar" },
            { "slideIndex": 6, "label": "7. Kuis Pemahaman Mandiri" },
            { "slideIndex": 7, "label": "8. Rangkuman & Bekal Menuju Modul 3.5" }
        ],
        "quizzes": [
            {
                "question": "Fitur bawaan apa di Blocks Editor yang bisa kita klik kanan pada suatu blok untuk melihat hasil eksekusinya secara instan saat live testing?",
                "options": ["A. Do It", "B. Delete Block", "C. Duplicate", "D. Collapse Block"],
                "answer": 0,
                "explanation": "Fitur 'Do It' mengeksekusi blok terpilih secara langsung di HP dan menampilkan gelembung hasil outputnya."
            }
        ]
    }
}

for b_id, b_data in bridges.items():
    out_path = os.path.join(DRAFTS_HTML_DIR, f"{b_id}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(b_data, f, indent=2, ensure_ascii=False)
    print(f"Normalized {b_id}.json successfully.")

print("\nALL 10 BRIDGE METADATA JSON NORMALIZED ACCORDING TO UNIFIED SCHEMA!")
