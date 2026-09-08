import json

# 1. ENRICH HIGHSCHOOL
hs_path = 'projects/uob-async-lms/subprojects/01-lms-platform/src/data/courseData-highschool.json'
with open(hs_path, 'r', encoding='utf-8') as f:
    hs_data = json.load(f)

for m in hs_data['modules']:
    for s in m['steps']:
        sid = s.get('id')
        
        # hs-0-0
        if sid == 'hs-0-0' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 65,
                    "shown": False,
                    "resume": False,
                    "title": "ORIENTASI ASYNC LEARNING",
                    "questions": [
                        {
                            "id": "q-hs-0-0-1",
                            "question": "Apa keunggulan utama belajar mandiri (asynchronous learning) di platform UOB My Digital Space?",
                            "options": [
                                "A. Harus online bersamaan di jam yang sama setiap hari",
                                "B. Kamu memegang kendali penuh atas ritme belajar, bisa pause, ulang, dan coba coding kapan saja",
                                "C. Tidak perlu menonton video materi sama sekali",
                                "D. Hanya boleh dikerjakan di akhir pekan saja"
                            ],
                            "answer": "B",
                            "explanation": "Tepat! Belajar async memberikan kebebasan fleksibilitas waktu sehingga kamu dapat belajar sesuai kenyamanan dan pemahamanmu."
                        }
                    ]
                },
                {
                    "time": 110,
                    "shown": False,
                    "resume": False,
                    "title": "FITUR POP-UP QUIZ & PINTASAN COLAB",
                    "questions": [
                        {
                            "id": "q-hs-0-0-2",
                            "question": "Pintasan keyboard apa yang digunakan di Google Colab untuk mengeksekusi cell kode dan langsung lanjut ke cell berikutnya?",
                            "options": [
                                "A. Ctrl + C",
                                "B. Alt + F4",
                                "C. Shift + Enter",
                                "D. Ctrl + Z"
                            ],
                            "answer": "C",
                            "explanation": "Benar! Menekan Shift + Enter akan langsung mengeksekusi sel aktif dan membuat/pindah ke sel kode berikutnya."
                        }
                    ]
                }
            ]

        # hs-2-1
        if sid == 'hs-2-1' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 180,
                    "shown": False,
                    "resume": False,
                    "title": "KONSEP BOOLEAN & LOGIKA KEPUTUSAN",
                    "questions": [
                        {
                            "id": "q-hs-2-1-1",
                            "question": "Dalam pemrograman Python, tipe data apa yang hanya memiliki dua kemungkinan nilai: True atau False?",
                            "options": [
                                "A. String (str)",
                                "B. Integer (int)",
                                "C. Boolean (bool)",
                                "D. Float (float)"
                            ],
                            "answer": "C",
                            "explanation": "Tepat sekali! Boolean (bool) adalah tipe data logika yang merepresentasikan nilai kebenaran: True (Benar) atau False (Salah)."
                        }
                    ]
                },
                {
                    "time": 360,
                    "shown": False,
                    "resume": False,
                    "title": "OPERATOR PERBANDINGAN",
                    "questions": [
                        {
                            "id": "q-hs-2-1-2",
                            "question": "Operator apa yang digunakan di Python untuk mengecek apakah dua nilai adalah SAMA PERSIS?",
                            "options": [
                                "A. = (satu tanda sama dengan)",
                                "B. == (dua tanda sama dengan)",
                                "C. != (tanda seru sama dengan)",
                                "D. >= (lebih besar sama dengan)"
                            ],
                            "answer": "B",
                            "explanation": "Benar! Tanda == digunakan untuk membandingkan kesamaan nilai, sedangkan = digunakan untuk assignment (memberi nilai variabel)."
                        }
                    ]
                }
            ]

        # hs-2-7 (Project)
        if sid == 'hs-2-7' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "VALIDASI PROYEK SMART BUDGET & RISK PLANNER",
                    "questions": [
                        {
                            "id": "q-hs-2-7-1",
                            "question": "Jika seorang siswa memiliki pemasukan Rp 100.000 dan menabung Rp 25.000, berapa rasio tabungannya dan apa status anggarannya?",
                            "options": [
                                "A. 10% — Status Bahaya",
                                "B. 15% — Status Waspada",
                                "C. 25% — Status Sehat (karena >= 20%)",
                                "D. 50% — Status Overbudget"
                            ],
                            "answer": "C",
                            "explanation": "Benar! (25.000 / 100.000) * 100 = 25%. Rasio tabungan >= 20% menunjukkan kondisi keuangan yang Sehat."
                        }
                    ]
                }
            ]

        # hs-3-4 (Project)
        if sid == 'hs-3-4' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "VALIDASI SIMULATOR TARGET TABUNGAN",
                    "questions": [
                        {
                            "id": "q-hs-3-4-1",
                            "question": "Di dalam loop akumulasi 'while saldo < target', mengapa kita wajib menambahkan 'bulan += 1' pada setiap putaran?",
                            "options": [
                                "A. Agar font angka berubah warna",
                                "B. Sebagai penghitung (counter) berapa periode/bulan yang dibutuhkan hingga saldo mencapai target",
                                "C. Agar program berhenti seketika",
                                "D. Agar saldo tidak berkurang"
                            ],
                            "answer": "B",
                            "explanation": "Tepat! Variabel 'bulan' bertindak sebagai counter iterasi loop untuk mencatat durasi waktu pencapaian target."
                        }
                    ]
                }
            ]

        # hs-3-7 (Project)
        if sid == 'hs-3-7' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "VALIDASI STRUKTURAL KASIR MODULAR",
                    "questions": [
                        {
                            "id": "q-hs-3-7-1",
                            "question": "Apa manfaat utama memisahkan perhitungan diskon ke dalam fungsi 'hitung_diskon(subtotal)' tersendiri?",
                            "options": [
                                "A. Kode jadi lebih panjang dan membingungkan",
                                "B. Prinsip modularitas: aturan diskon mudah diubah sewaktu-waktu tanpa mengganggu fungsi cetak struk",
                                "C. Agar program hanya bisa dijalankan di satu laptop saja",
                                "D. Mengurangi kecepatan loading Colab"
                            ],
                            "answer": "B",
                            "explanation": "Tepat! Fungsi mandiri mempermudah pemeliharaan kode (maintenance) dan pengujian (testing) tanpa efek samping pada modul lain."
                        }
                    ]
                }
            ]

        # hs-5-3
        if sid == 'hs-5-3' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 150,
                    "shown": False,
                    "resume": False,
                    "title": "PENGELOMPOKAN DATA TRANSAKSI (GROUPING)",
                    "questions": [
                        {
                            "id": "q-hs-5-3-1",
                            "question": "Bagaimana cara elegan di Python untuk menjumlahkan nominal pada dictionary 'kategori_total[kat]' jika key tersebut belum pernah ada sebelumnya?",
                            "options": [
                                "A. kategori_total[kat] = kategori_total[kat] + nominal",
                                "B. kategori_total[kat] = kategori_total.get(kat, 0) + nominal",
                                "C. delete kategori_total[kat]",
                                "D. kategori_total.clear()"
                            ],
                            "answer": "B",
                            "explanation": "Tepat sekali! Method .get(kat, 0) mengembalikan nilai default 0 jika key belum ada, sehingga mencegah KeyError saat penjumlahan pertama."
                        }
                    ]
                }
            ]

with open(hs_path, 'w', encoding='utf-8') as f:
    json.dump(hs_data, f, ensure_ascii=False, indent=2)
print("Updated courseData-highschool.json with complete quizzes!")

# 2. ENRICH MIDDLESCHOOL
ms_path = 'projects/uob-async-lms/subprojects/01-lms-platform/src/data/courseData-middleschool.json'
with open(ms_path, 'r', encoding='utf-8') as f:
    ms_data = json.load(f)

for m in ms_data['modules']:
    for s in m['steps']:
        sid = s.get('id')
        
        # ms-0-0
        if sid == 'ms-0-0' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 45,
                    "shown": False,
                    "resume": False,
                    "title": "ORIENTASI ASYNC LEARNING SMP",
                    "questions": [
                        {
                            "id": "q-ms-0-0-1",
                            "question": "Kapan pop-up quiz interaktif akan muncul saat kamu menonton video materi?",
                            "options": [
                                "A. Hanya setelah kamu menyelesaikan semua modul 1 sampai 5",
                                "B. Di tengah-tengah pemutaran video secara otomatis pada checkpoint konsep penting",
                                "C. Hanya jika kamu menekan tombol skip",
                                "D. Tidak akan pernah muncul kuis"
                            ],
                            "answer": "B",
                            "explanation": "Benar! Kuis pop-up muncul di sela-sela video untuk memastikan kamu memahami konsep kunci sebelum melanjutkan."
                        }
                    ]
                }
            ]

        # ms-1-2 (Project)
        if sid == 'ms-1-2' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT PROYEK FORM AMAN",
                    "questions": [
                        {
                            "id": "q-ms-1-2-1",
                            "question": "Blok apa yang digunakan untuk memeriksa apakah TextBox input nama masih dalam keadaan kosong?",
                            "options": [
                                "A. is number?",
                                "B. is empty (dari kelompok Text)",
                                "C. length of list",
                                "D. random integer"
                            ],
                            "answer": "B",
                            "explanation": "Benar! Blok 'is empty' akan menguji apakah string teks bernilai kosong atau tidak ada isinya."
                        }
                    ]
                }
            ]

        # ms-1-5 (Project)
        if sid == 'ms-1-5' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT PENDETEKSI PHISHING",
                    "questions": [
                        {
                            "id": "q-ms-1-5-1",
                            "question": "Blok apa yang digunakan untuk mengecek apakah suatu pesan teks mengandung potongan kata 'minta password'?",
                            "options": [
                                "A. text length",
                                "B. contains text piece (dari menu Text)",
                                "C. split at spaces",
                                "D. upcase text"
                            ],
                            "answer": "B",
                            "explanation": "Tepat! Blok 'contains text piece' mengembalikan nilai True jika potongan teks tertentu ditemukan di dalam pesan."
                        }
                    ]
                }
            ]

        # ms-2-6 (Project)
        if sid == 'ms-2-6' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT PENASIHAT BELANJA",
                    "questions": [
                        {
                            "id": "q-ms-2-6-1",
                            "question": "Jika Saldo Celengan = 70.000 dan Harga Barang = 30.000, berapa sisa saldo dan apa saran aplikasi?",
                            "options": [
                                "A. Sisa 40.000 -> Tunda Dulu (karena sisa tabungan < 50.000)",
                                "B. Sisa 100.000 -> Langsung Beli",
                                "C. Saldo Minus -> Tolak",
                                "D. Saldo 0"
                            ],
                            "answer": "A",
                            "explanation": "Tepat! 70.000 - 30.000 = 40.000. Karena sisa uang < 50.000 (batas aman), aplikasi menyarankan untuk menunda dulu agar tidak kehabisan uang."
                        }
                    ]
                }
            ]

        # ms-3-2 (Project)
        if sid == 'ms-3-2' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT KALKULATOR MODULAR",
                    "questions": [
                        {
                            "id": "q-ms-3-2-1",
                            "question": "Di mana letak menu untuk membuat blok Procedure baru di MIT App Inventor?",
                            "options": [
                                "A. Di menu Layout Designer",
                                "B. Di laci bawaan 'Procedures' pada Blocks Editor",
                                "C. Di dalam Google Drive",
                                "D. Di galeri foto"
                            ],
                            "answer": "B",
                            "explanation": "Benar! Di Blocks Editor terdapat laci bawaan berwarna ungu bernama 'Procedures'."
                        }
                    ]
                }
            ]

        # ms-4-3 (Project)
        if sid == 'ms-4-3' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT TABUNGAN TINYDB",
                    "questions": [
                        {
                            "id": "q-ms-4-3-1",
                            "question": "Pada event apa sebaiknya kita memanggil blok 'TinyDB.GetValue' untuk memuat saldo terakhir saat aplikasi baru dibuka?",
                            "options": [
                                "A. when Screen1.Initialize",
                                "B. when ButtonExit.Click",
                                "C. when Screen1.ErrorOccurred",
                                "D. when Screen1.BackPressed"
                            ],
                            "answer": "A",
                            "explanation": "Tepat! Event 'when Screen1.Initialize' langsung berjalan otomatis saat layar aplikasi pertama kali dimuat."
                        }
                    ]
                }
            ]

        # ms-4-4
        if sid == 'ms-4-4' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 120,
                    "shown": False,
                    "resume": False,
                    "title": "ANALISIS DATA TINYDB",
                    "questions": [
                        {
                            "id": "q-ms-4-4-1",
                            "question": "Jika kita menyimpan riwayat transaksi belanja berupa List ke TinyDB, blok apa yang digunakan untuk menambahkan item belanja baru ke dalam list?",
                            "options": [
                                "A. remove list item",
                                "B. add items to list (dari menu Lists)",
                                "C. clear list",
                                "D. pick random item"
                            ],
                            "answer": "B",
                            "explanation": "Benar! Blok 'add items to list' menambahkan data transaksi baru ke daftar riwayat yang sudah ada."
                        }
                    ]
                }
            ]

        # ms-4-5 (Project)
        if sid == 'ms-4-5' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT KAS MINI PERSISTEN",
                    "questions": [
                        {
                            "id": "q-ms-4-5-1",
                            "question": "Mengapa kita harus memberi nama Tag yang unik dan jelas saat menyimpan data ke TinyDB?",
                            "options": [
                                "A. Agar aplikasi menghabiskan memori HP",
                                "B. Agar data tidak tertukar atau tertimpa secara tidak sengaja oleh fitur lain",
                                "C. Supaya koneksi WiFi tetap stabil",
                                "D. Agar tidak bisa dibaca oleh sistem"
                            ],
                            "answer": "B",
                            "explanation": "Tepat! Tag adalah kunci pengidentifikasi data di TinyDB. Tag yang unik memastikan data tersimpan rapi dan tidak tumpang tindih."
                        }
                    ]
                }
            ]

        # ms-5-2 (Project)
        if sid == 'ms-5-2' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT WIREFRAMING CAPSTONE",
                    "questions": [
                        {
                            "id": "q-ms-5-2-1",
                            "question": "Komponen Layout apa yang paling ideal digunakan untuk menata 2 tombol secara berdampingan ke samping (horizontal)?",
                            "options": [
                                "A. VerticalArrangement",
                                "B. HorizontalArrangement",
                                "C. Canvas",
                                "D. VideoPlayer"
                            ],
                            "answer": "B",
                            "explanation": "Benar! HorizontalArrangement menata komponen di dalamnya secara berjajar dari kiri ke kanan."
                        }
                    ]
                }
            ]

        # ms-5-3 (Project)
        if sid == 'ms-5-3' and not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 99999,
                    "shown": False,
                    "resume": False,
                    "title": "CHECKPOINT FINAL CAPSTONE VERIFIKASI",
                    "questions": [
                        {
                            "id": "q-ms-5-3-1",
                            "question": "Sebelum mengumpulkan link proyek akhir, uji coba mandiri apa yang wajib dilakukan di HP?",
                            "options": [
                                "A. Mematikan layar HP dan tidur",
                                "B. Menguji seluruh tombol, memasukkan form kosong untuk cek error validasi, dan memastikan data tersimpan di TinyDB",
                                "C. Menghapus seluruh blok kode",
                                "D. Mengubah bahasa HP"
                            ],
                            "answer": "B",
                            "explanation": "Tepat sekali! Pengujian menyeluruh menjamin aplikasi berjalan mulus tanpa crash saat dinilai fasilitator."
                        }
                    ]
                }
            ]

with open(ms_path, 'w', encoding='utf-8') as f:
    json.dump(ms_data, f, ensure_ascii=False, indent=2)
print("Updated courseData-middleschool.json with complete quizzes!")

# 3. ENRICH UPPERPRIMARY (SD)
up_path = 'projects/uob-async-lms/subprojects/01-lms-platform/src/data/courseData-upperprimary.json'
with open(up_path, 'r', encoding='utf-8') as f:
    up_data = json.load(f)

for m in up_data['modules']:
    for s in m['steps']:
        sid = s.get('id')
        if not s.get('quizzes'):
            s['quizzes'] = [
                {
                    "time": 40,
                    "shown": False,
                    "resume": False,
                    "title": f"KUIS CERDAS: {s.get('title')}",
                    "questions": [
                        {
                            "id": f"q-{sid}-1",
                            "question": f"Apa hal terpenting yang kamu pelajari pada materi '{s.get('title')}'?",
                            "options": [
                                "A. Memahami konsep koding visual dan mengelola uang secara bijak",
                                "B. Menghabiskan uang jajan sekaligus",
                                "C. Tidak memperhatikan penjelasan",
                                "D. Menutup laptop"
                            ],
                            "answer": "A",
                            "explanation": "Hebat! Kamu sudah memahami konsep dasar pemrograman dan literasi finansial dengan baik."
                        }
                    ]
                }
            ]

with open(up_path, 'w', encoding='utf-8') as f:
    json.dump(up_data, f, ensure_ascii=False, indent=2)
print("Updated courseData-upperprimary.json with complete quizzes!")

