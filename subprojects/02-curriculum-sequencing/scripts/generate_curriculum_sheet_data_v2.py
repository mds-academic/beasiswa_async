import json
import re

def clean_html(text):
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def build_curriculum_dataset_v2():
    base_path = "projects/uob-async-lms/subprojects/01-lms-platform/src/data"
    
    # 1. SD (Upper Primary)
    sd_rows = [
        [
            1, "up-mod-00", "Modul 0: Orientasi Pembelajaran Asinkronus SD", "up-0-0", "Introduction to Async Learning",
            "Video Interaktif & Orientasi", "Video 00 · Pengenalan", "https://youtu.be/yxmLOk5vcFg",
            "Orientasi Pembelajaran Mandiri (Async Learning), ritme belajar personal, cara kerja pop-up quiz interaktif, panduan mandiri & bantuan fasilitator.",
            "- (Materi Pengenalan Platform & Aturan Belajar Mandiri)",
            "Eksplorasi Platform: Membuka dashboard LMS, mencoba tombol play video, dan membaca kartu tips belajar mandiri.",
            "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri",
            "Siswa memahami alur belajar mandiri di platform UOB My Digital Space dan siap mengikuti modul coding visual Scratch.",
            "Siap (Wadah & Video Orientasi)"
        ],
        [
            2, "up-mod-01", "Modul 1: Petualangan Pertama — Data & Kebutuhan vs Keinginan", "up-1-1", "Mengenal & Menampilkan Data Sederhana",
            "Video Interaktif & Animasi Konsep", "Checkpoint 01 · Data", "https://youtu.be/yxmLOk5vcFg",
            "Pengenalan Data di sekitar kita, membedakan Kebutuhan Primer (Needs) vs Keinginan (Wants), pentingnya prioritas belanja.",
            "[Kuis Pemahaman]\nQ: Manakah yang termasuk Kebutuhan Pokok (Needs)?\nA. Makanan bergizi dan perlengkapan sekolah (Benar)\nB. Mainan mahal dan game console",
            "Latihan Pengelompokan: Menuliskan 3 daftar barang kebutuhan dan 3 barang keinginan di lembar kerja interaktif.",
            "Needs: Kebutuhan penting (makanan, sekolah, kesehatan)\nWants: Keinginan tambahan (mainan mahal, jajan berlebih)",
            "Siswa mampu mengelompokkan barang belanja ke kategori Needs vs Wants dengan tepat.",
            "Draft Rancangan (Curriculum Sequencing)"
        ],
        [
            3, "up-mod-01", "Modul 1: Petualangan Pertama — Data & Kebutuhan vs Keinginan", "up-1-2", "Menjaga Keamanan Data Pribadi Online",
            "Proyek Mandiri Scratch", "Checkpoint 02 · Aman di Internet", "https://youtu.be/yxmLOk5vcFg",
            "Pengenalan Sprite & Backdrop Scratch, event 'When Green Flag Clicked', memindahkan sprite ke keranjang yang sesuai.",
            "- (Fokus pada praktik pemrograman blok)",
            "MINI PROJECT 01: Sorting Needs vs Wants di Scratch 🐱\nTugas Siswa:\n1. Buka Scratch dan pilih sprite Keranjang Needs dan Keranjang Wants\n2. Buat sprite barang belanjaan (buku, roti, mainan robot)\n3. Gunakan blok motion 'go to x:.. y:..' untuk memilah barang ke keranjang yang tepat\nOutput: Game interaktif pemilahan kebutuhan belanja sederhana.",
            "Blok Event: when green flag clicked\nBlok Motion: go to x:.. y:..\nBlok Sensing: touching mouse-pointer?",
            "Siswa menghasilkan game interaktif pemilahan kebutuhan belanja sederhana di Scratch.",
            "Draft Rancangan (Framework Siap)"
        ],
        [
            4, "up-mod-02", "Modul 2: Celengan Digital — Mengenal Variabel di Scratch", "up-2-1", "Membuat Variabel Celengan di Scratch",
            "Video Interaktif & Konsep Coding", "Checkpoint 01 · Variabel", "https://youtu.be/yxmLOk5vcFg",
            "Konsep Variabel sebagai kotak penyimpan nilai, membuat variabel 'Saldo_Celengan', inisialisasi nilai awal (set to 0).",
            "[Kuis Variabel]\nQ: Apa yang terjadi jika kita tidak mereset variabel Saldo ke 0 saat game dimulai?\nJawaban: Saldo akan terus bertambah dari sisa permainan sebelumnya.",
            "Latihan Membuat Variabel: Membuat variabel bernama 'Saldo' pada menu Variables di Scratch dan mengaturnya ke angka 0 saat bendera hijau diklik.",
            "Blok Variables:\n- set [Saldo] to [0]\n- change [Saldo] by [1000]",
            "Siswa mengerti fungsi variabel untuk menyimpan dan memperbarui data angka secara dinamis.",
            "Draft Rancangan (Curriculum Sequencing)"
        ],
        [
            5, "up-mod-02", "Modul 2: Celengan Digital — Mengenal Variabel di Scratch", "up-2-2", "Mengontrol Saldo & Menghitung Tabungan",
            "Proyek Mandiri Scratch", "Checkpoint 02 · Target Tabungan", "https://youtu.be/yxmLOk5vcFg",
            "Membuat tombol pecahan koin/uang (1.000, 2.000, 5.000), event 'when this sprite clicked', menambah isi celengan digital.",
            "- (Fokus pada perakitan interaksi koin)",
            "MINI PROJECT 02: Celengan Digital Interaktif 💰\nTugas Siswa:\n1. Buat 3 sprite koin (Rp 1.000, Rp 2.000, Rp 5.000)\n2. Tambahkan blok 'when this sprite clicked' pada tiap koin\n3. Gunakan blok 'change [Saldo] by [nominal]'\n4. Tampilkan balon percakapan kucing: 'Total tabunganmu sekarang Rp...' saat celengan ditekan.\nOutput: Simulator celengan digital interaktif.",
            "when this sprite clicked\nchange [Saldo] by [2000]\nsay (join [Total tabungan: Rp ] [Saldo])",
            "Siswa berhasil membuat proyek simulasi celengan digital interaktif dengan Scratch.",
            "Draft Rancangan (Framework Siap)"
        ],
        [
            6, "up-mod-03", "Modul 3: Karakter Cerdas — Logika Percabangan (If-Then)", "up-3-1", "Blok Percabangan: Jika..., Maka..., Jika Tidak...",
            "Video Interaktif & Logika Pemrograman", "Checkpoint 01 · Keputusan Cerdas", "https://youtu.be/yxmLOk5vcFg",
            "Logika Percabangan (If-Then), operator perbandingan (> dan <), mengecek apakah saldo cukup sebelum membeli barang.",
            "[Kuis Logika Cerdas]\nQ: Jika Saldo = 15.000 dan Harga Buku = 12.000, apakah kondisi < Saldo > Harga > bernilai Benar?\nJawaban: Benar (True), karena 15.000 > 12.000.",
            "Latihan Blok Syarat: Menyusun blok if-then untuk memeriksa apakah saldo celengan sudah mencapai target minimal Rp 20.000.",
            "if < [Saldo] > [Harga] > then\n  say [Uang cukup! Silakan beli]\nelse\n  say [Tabung lagi ya!]",
            "Siswa memahami bagaimana komputer mengambil keputusan cerdas berdasarkan kondisi angka.",
            "Draft Rancangan (Curriculum Sequencing)"
        ],
        [
            7, "up-mod-03", "Modul 3: Karakter Cerdas — Logika Percabangan (If-Then)", "up-3-2", "Mengirim Pesan Antar Karakter (Broadcast Message)",
            "Proyek Mandiri Scratch", "Checkpoint 02 · Broadcast", "https://youtu.be/yxmLOk5vcFg",
            "Penerapan blok 'If-Then-Else', interaksi pembeli dan kasir, broadcast message saat transaksi berhasil, pengurangan otomatis saldo.",
            "- (Fokus pada komunikasi antar karakter)",
            "MINI PROJECT 03: Kasir Toko Pintar 🏪\nTugas Siswa:\n1. Buat karakter Pembeli dan Kasir Toko\n2. Saat pembeli memilih barang, sistem mengecek saldo dengan If-Then-Else\n3. Jika uang cukup, kurangi saldo dan kirim broadcast 'barang_terjual'\n4. Kasir merespons dengan ucapan: 'Terima kasih sudah berbelanja!'\nOutput: Simulasi transaksi belanja cerdas.",
            "change [Saldo] by (0 - [Harga])\nbroadcast [transaksi_sukses]",
            "Siswa membangun sistem simulasi kasir cerdas yang menolak pembelian jika saldo tidak cukup.",
            "Draft Rancangan (Framework Siap)"
        ],
        [
            8, "up-mod-04", "Modul 4: Proyek Game Interaktif — Kuis Finansial Seru", "up-4-1", "Mini Game Petualangan Belanja Bijak",
            "Capstone Project Akhir", "Final Project · Game Scratch", "https://youtu.be/yxmLOk5vcFg",
            "Integrasi Sprite, Variabel Skor/Saldo, Broadcast Message, Timer Game, dan Kuis Cerdas Finansial.",
            "- (Evaluasi menyeluruh pada hasil proyek game)",
            "FINAL CAPSTONE PROJECT SD: Game Kuis Cerdas Finansial 🏆\nTugas Siswa:\n1. Buat game kuis 5 pertanyaan seputar mengelola uang saku\n2. Pasang sistem penilaian dengan variabel Skor\n3. Berikan reward suara koin emas dan ucapan selamat jika skor >= 80\n4. Publikasikan link Scratch project ke platform LMS.\nOutput: Game edukasi finansial lengkap siap dimainkan.",
            "Gabungan Modul 1-3:\n- Variabel Skor & Saldo\n- Logika If-Then evaluasi jawaban\n- Sound efek & pesan reward",
            "Siswa menghasilkan Game Kuis Edukasi Finansial lengkap yang dapat dimainkan teman dan keluarga.",
            "Draft Rancangan (Framework Siap)"
        ]
    ]
    
    # 2. SMP (Middle School)
    ms_file = f"{base_path}/courseData-middleschool.json"
    with open(ms_file, 'r', encoding='utf-8') as f:
        ms_data = json.load(f)
        
    ms_rows = []
    num = 1
    for m in ms_data.get('modules', []):
        mod_id = m.get('id', '')
        mod_title = m.get('title', '')
        for s in m.get('steps', []):
            sid = s.get('id', '')
            title = s.get('title', '')
            stype = s.get('type', 'video')
            kicker = s.get('kicker', '') or s.get('duration', 'Orientasi')
            vid = s.get('videoId', '')
            slide = s.get('slideUrl', '')
            
            media_link = ""
            if slide:
                media_link = "https://mds-academic.github.io/beasiswa_async/slides/bridge-ms-00.html"
            elif vid:
                media_link = f"https://youtu.be/{vid}"

            # Extract pop up quiz
            quizzes_list = s.get('quizzes', [])
            quiz_formatted = ""
            if quizzes_list:
                q_lines = []
                for q in quizzes_list:
                    time_sec = q.get('time', 0)
                    m_min = time_sec // 60
                    s_sec = time_sec % 60
                    time_label = f"{m_min:02d}:{s_sec:02d}"
                    q_title = q.get('title', '')
                    for subq in q.get('questions', []):
                        sub_title = subq.get('title', '') or q_title
                        q_text = clean_html(subq.get('question', ''))
                        opts = subq.get('options', [])
                        ans = subq.get('answer', '')
                        if q_text:
                            q_lines.append(f"⏱️ [{time_label}] {q_text}")
                            if opts:
                                q_lines.append(f"   Pilihan: {', '.join([clean_html(o) for o in opts[:4]])}")
                            if ans != "":
                                q_lines.append(f"   ✅ Kunci: {ans}")
                        elif sub_title:
                            q_lines.append(f"⏱️ [{time_label}] INFO: {sub_title}")
                quiz_formatted = "\n".join(q_lines)
            else:
                quiz_formatted = "- (Materi Konsep / Hands-on Coding)"

            # Extract or assign mini project
            project_formatted = ""
            if sid == 'ms-0-0':
                learning_type = "Slide Interaktif & Video Orientasi"
                konsep = "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, cheat sheet, dan panduan fasilitas belajar."
                project_formatted = "Eksplorasi Platform: Membuka dashboard LMS, mencoba switcher slide dan video, mempelajari panduan perangkat."
                cheatsheet = "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri"
                capaian = "Siswa memahami aturan dan ritme pembelajaran mandiri serta siap menggunakan platform LMS."
                status = "Siap (Wadah & Slide Live)"
            elif sid == 'ms-0-1':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Panduan Sign In ke MIT App Inventor (ai2.appinventor.mit.edu), autentikasi akun Google, menyetujui izin Terms of Service."
                project_formatted = "Hands-on Akun: Membuka browser, login ke ai2.appinventor.mit.edu dengan akun Google, dan membuat proyek kosong bernama 'Latihan01'."
                cheatsheet = "1. Buka ai2.appinventor.mit.edu\n2. Klik 'Create Apps!'\n3. Login dengan akun Google\n4. Klik 'Continue' melewati welcome dialog"
                capaian = "Siswa berhasil login dan membuka workspace proyek perdana di MIT App Inventor."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-0-2':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Eksplorasi antarmuka MIT App Inventor: Menu Bar, Project List, tombol Switcher Designer View vs Blocks Editor, panel Properties."
                project_formatted = "Hands-on Designer: Mengenal layout antarmuka, mengubah nama screen, dan mengeksplorasi tombol Designer dan Blocks."
                cheatsheet = "- Designer View: Merancang tampilan visual aplikasi\n- Blocks Editor: Menyusun logika & perilaku tombol\n- Projects > Start new project"
                capaian = "Siswa mengenali fungsi navigasi utama di App Inventor dan memahami perbedaan Designer vs Blocks."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-0-3':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Mengenal Palette dan Komponen UI: Menarik Button, Label, TextBox, Image dari Palette ke Viewer, mengatur Text & Background."
                project_formatted = "Hands-on UI Dasar: Menarik 1 Button dan 1 Label ke Viewer, mengganti warna teks menjadi Navy Blue dan ukuran font 18."
                cheatsheet = "- Palette: Gudang komponen (User Interface, Layout, Storage)\n- Viewer: Layar simulasi HP\n- Components: Daftar hierarki elemen"
                capaian = "Siswa mampu menyusun komponen User Interface dasar di layar Viewer dan mengubah properti teks."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-0-4':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Live Testing dengan MIT AI2 Companion: Mengunduh aplikasi di HP Android/iOS, menghubungkan via scan QR Code / 6-digit code, live reload."
                project_formatted = "Live Testing: Menghubungkan proyek ke HP fisik menggunakan AI Companion via Scan QR Code hingga aplikasi tampil di layar HP."
                cheatsheet = "- Connect > AI Companion\n- Buka aplikasi MIT AI2 Companion di HP\n- Scan QR code atau ketik 6 karakter kode"
                capaian = "Siswa berhasil menjalankan dan menguji aplikasi secara langsung di layar smartphone fisik."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-1-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Input Aman & Validasi Form: Event handling Button.Click, membaca teks TextBox, logika pengecekan form kosong (is empty string)."
                project_formatted = "Latihan Event Handling: Menulis blok when Button.Click yang mengecek apakah TextBoxNama kosong."
                cheatsheet = "when Button1.Click do\n  if is empty TextBox1.Text then\n    set LabelStatus.Text to 'Mohon isi data!'"
                capaian = "Siswa dapat memvalidasi form agar aplikasi tidak error saat pengguna belum memasukkan teks."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-2':
                learning_type = "Proyek Mandiri Form Aman"
                konsep = "Membuat antarmuka input nomor & nama dengan tombol validasi dan label feedback visual berwarna hijau/merah."
                project_formatted = "MINI PROJECT 01: Form Registrasi Aman 📱\nTugas Siswa:\n1. Buka App Inventor, rancang antarmuka form (TextBoxNama, TextBoxNomor, ButtonKirim, LabelPesan)\n2. Atur properti TextBoxNomor menjadi 'NumbersOnly'\n3. Buat blok logika validasi form kosong\n4. Beri feedback warna hijau jika sukses, merah jika salah.\nOutput: Form pendaftaran aman anti-kosong."
                cheatsheet = "Desain: TextBox (Nama), TextBox (Nomor), Button (Kirim), Label (Pesan Error)\nBlok: Validasi panjang karakter & jenis angka."
                capaian = "Siswa menghasilkan antarmuka form aman pertama di MIT App Inventor."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-1-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Flowchart & Alur Logika Data: Simbol terminator (Mulai/Selesai), proses (Persegi panjang), keputusan (Belah ketupat), input/output (Jajar genjang)."
                project_formatted = "Latihan Menggambar Flowchart: Membuat diagram alur keputusan validasi form sebelum diimplementasikan ke blok."
                cheatsheet = "Mulai -> Input Data -> Apakah Data Valid? [Ya -> Proses -> Simpan / Tidak -> Tampilkan Error] -> Selesai"
                capaian = "Siswa mampu merancang alur algoritma aplikasi ke dalam bentuk flowchart standar sebelum membuat kode blok."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Data & Privacy App: Etika perlindungan data pribadi, prinsip kerahasiaan password dan PIN, masking karakter dengan tanda bintang (*)."
                project_formatted = "Latihan Masking Data: Mengatur properti password masking pada kolom input rahasia."
                cheatsheet = "Properti TextBox:\n- Set 'NumbersOnly' = true untuk input nominal uang\n- Masking data sensitif"
                capaian = "Siswa menyadari pentingnya privasi data dan menerapkan pembatasan input yang aman pada aplikasi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-5':
                learning_type = "Proyek Mandiri Cek Pesan Aman"
                konsep = "Membangun aplikasi pendeteksi pesan phishing/tautan mencurigakan menggunakan percabangan kata kunci sensitif."
                project_formatted = "MINI PROJECT 02: Aplikasi Pendeteksi Pesan Phishing 🛡️\nTugas Siswa:\n1. Sediakan TextBox untuk mem-paste teks pesan yang mencurigakan\n2. Gunakan blok Text 'contains text piece' untuk mencari kata kunci bahaya ('minta OTP', 'klik link ini', 'hadiah undian')\n3. Tampilkan kartu peringatan merah 'Waspada Penipuan!' jika kata kunci terdeteksi.\nOutput: Alat pemindai pesan penipuan digital sederhana."
                cheatsheet = "if contains text (TextBoxPesan.Text) piece ('minta password') then\n  set LabelWarning.Text to 'WASPADA PHISHING!'"
                capaian = "Siswa menghasilkan aplikasi pendeteksi pesan penipuan digital interaktif."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-1-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Eksplorasi Data Pribadi: Menelaah jenis data publik (nama display) vs data rahasia (NIK, password, OTP, data perbankan)."
                project_formatted = "Analisis Kasus Keamanan: Mengidentifikasi bahaya kebocoran data pada skenario aplikasi game palsu."
                cheatsheet = "Prinsip Keamanan:\nJangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun, termasuk pihak yang mengaku staf/admin."
                capaian = "Siswa memiliki literasi digital yang kuat mengenai perlindungan identitas pribadi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-7':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Etika dan Tanggung Jawab Digital: Menghormati hak cipta konten, tidak membuat aplikasi berbahaya (spam/malware), etika programmer."
                project_formatted = "Refleksi Etika Digital: Menyusun 3 prinsip komitmen pengembang aplikasi yang bertanggung jawab."
                cheatsheet = "Tanggung Jawab Kreator Digital:\n1. Transparan penggunaan izin aplikasi\n2. Menjaga data pengguna\n3. Bermanfaat untuk masyarakat"
                capaian = "Siswa menginternalisasi norma etika pengembangan software yang bertanggung jawab."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Percabangan Ganda di Dunia Nyata: Logika pengambilan keputusan dengan multi-syarat (kondisi A, kondisi B, atau kondisi default)."
                project_formatted = "Latihan Logika Syarat: Menganalisis kondisi cuaca dan menyusun pohon keputusan tindakan."
                cheatsheet = "Jika hujan -> Bawa payung\nJika mendung -> Siapkan jas hujan\nSelain itu -> Tidak perlu payung"
                capaian = "Siswa mampu memodelkan keputusan dunia nyata ke dalam struktur logika percabangan bersyarat."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "App Inventor: Percabangan Blok If-Else. Menggunakan mutator roda gigi biru untuk menambah 'else if' dan 'else'."
                project_formatted = "Hands-on Mutator Blok: Membuka mutator roda gigi biru pada blok If, menambahkan cabang Else-If dan Else."
                cheatsheet = "Blok Control:\nif [syarat] then [...]\nelse if [syarat2] then [...]\nelse [...]"
                capaian = "Siswa menguasai penggunaan blok If-Else bertingkat di App Inventor."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Literasi Keuangan: Uang Digital vs Fisik, cara kerja dompet digital (e-wallet), QRIS, dan pencatatan transaksi non-tunai."
                project_formatted = "Latihan Transaksi Digital: Membedakan pos pemasukan digital dan pengeluaran digital pada catatan harian."
                cheatsheet = "Kelebihan Uang Digital: Praktis, tercatat otomatis, nirsentuh.\nRisiko: Rentan impulsif & pencurian akun bila password lemah."
                capaian = "Siswa memahami mekanisme transaksi finansial modern dan risikonya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Literasi Keuangan: Skala Prioritas Belanja — Kebutuhan Utama vs Keinginan Hiburan, aturan alokasi 50/30/20."
                project_formatted = "Latihan Alokasi Uang Saku: Membagi nominal uang saku Rp 100.000 ke dalam pos 50% kebutuhan, 30% jajan, 20% tabungan."
                cheatsheet = "Kebutuhan (Needs) didahulukan 50%\nKeinginan (Wants) dibatasi maksimal 30%\nTabungan & Investasi 20%"
                capaian = "Siswa mampu membuat keputusan finansial yang bijak dan mengelompokkan pos pengeluaran."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Aplikasi Kalkulator Keuangan: Mengintegrasikan komponen input nominal, blok perkalian/pembagian persentase, dan label alokasi."
                project_formatted = "Hands-on Blok Math: Menyusun blok perkalian matematika untuk menghitung alokasi otomatis saat tombol ditekan."
                cheatsheet = "set LabelKebutuhan.Text to (TextBoxUang.Text * 0.5)\nset LabelTabungan.Text to (TextBoxUang.Text * 0.2)"
                capaian = "Siswa membangun kalkulator alokasi anggaran otomatis berbasis rumus finansial."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-6':
                learning_type = "Proyek Mandiri Final Percabangan"
                konsep = "Membangun aplikasi simulator penasihat belanja: Memberi saran 'Boleh Beli' atau 'Tunda Dulu' berdasarkan saldo saat ini."
                project_formatted = "MINI PROJECT 03: Penasihat Belanja Cerdas (Smart Shopper) 🛒\nTugas Siswa:\n1. Input Saldo Tabungan dan Harga Barang impian\n2. Gunakan percabangan If-Else:\n   - Jika Saldo - Harga >= Rp 50.000 -> Tampilkan 'Aman Dibeli!' (Hijau)\n   - Jika Saldo - Harga < Rp 50.000 -> Tampilkan 'Tunda Dulu! Sisa tabunganmu terlalu mepet' (Kuning)\n   - Jika Saldo < Harga -> Tampilkan 'Uang Tidak Cukup!' (Merah)\nOutput: Aplikasi penilai kelayakan belanja otomatis.",
                cheatsheet = "if (Saldo - HargaBarang) < 50000 then\n  set LabelSaran.Text to 'Tunda! Saldo tabunganmu hampir habis.'\nelse\n  set LabelSaran.Text to 'Aman dibeli!'"
                capaian = "Siswa menghasilkan aplikasi asisten belanja cerdas dengan validasi multi-kondisi."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-3-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Membuat & Memanggil Procedures: Blok 'to procedure do' (tanpa kembalian) dan 'to procedure result' (mengembalikan nilai), parameter."
                project_formatted = "Hands-on Procedure: Membuat prosedur sederhana 'tampilkanPesanSukses' dan memanggilnya dari 2 tombol berbeda."
                cheatsheet = "to hitungDiskon (harga, persen) do\n  result: harga - (harga * persen / 100)\ncall hitungDiskon(100000, 10)"
                capaian = "Siswa memahami cara kerja prosedur/fungsi untuk membagi kode program menjadi modul-modul efisien."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-3-2':
                learning_type = "Proyek Mandiri Kalkulator"
                konsep = "Mini Project Kalkulator Modular: Menerapkan prosedur hitungTambah, hitungKurang, hitungKali, dan resetForm."
                project_formatted = "MINI PROJECT 04: Kalkulator Keuangan Modular 🧮\nTugas Siswa:\n1. Buat antarmuka dengan 2 input angka dan 4 tombol operasi (+, -, *, /)\n2. Buat Procedure terpisah untuk tiap operasi matematika\n3. Buat Procedure 'bersihkanInput' untuk mengosongkan layar\nOutput: Kalkulator modular tanpa duplikasi kode blok."
                cheatsheet = "Prosedur 'bersihkanLayar':\nset TextBox1.Text to ''\nset TextBox2.Text to ''\nset LabelHasil.Text to '0'"
                capaian = "Siswa membuat kalkulator modular tanpa duplikasi kode blok."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-3-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Optimasi dan Modularisasi Kode: Prinsip DRY (Don't Repeat Yourself), meningkatkan keterbacaan kode blok."
                project_formatted = "Refactoring Blok: Menggabungkan 5 blok duplikat menjadi 1 prosedur tunggal berparameter."
                cheatsheet = "Jangan copy-paste blok yang sama berulang kali; bungkus ke dalam satu Prosedur dan panggil namanya!"
                capaian = "Siswa mampu menyederhanakan kode blok yang rumit menjadi bersih dan mudah dipelihara."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-3-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Uji Coba & Debugging: Menggunakan fitur 'Do It' di Blocks Editor untuk menginspeksi nilai variabel secara instan, melacak bug."
                project_formatted = "Latihan Do It Debugging: Klik kanan blok ekspresi matematika, pilih 'Do It', dan amati kotak dialog hasil keluaran."
                cheatsheet = "Klik kanan blok kode > pilih 'Do It' untuk melihat nilai keluaran blok secara langsung di layar monitor."
                capaian = "Siswa menguasai teknik debugging profesional di MIT App Inventor."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-3-5':
                learning_type = "Video Interaktif & Refleksi"
                konsep = "Presentasi & Refleksi: Mengevaluasi arsitektur blok, kenyamanan antarmuka pengguna (UI/UX), dan dokumentasi kode."
                project_formatted = "Checklist Audit UI/UX: Menguji aplikasi terhadap 3 kriteria kenyamanan pengguna (kontras warna, ukuran tombol, kejelasan error)."
                cheatsheet = "Kriteria Desain Aplikasi yang Baik:\n1. Tampilan bersih dan rapi\n2. Tombol mudah ditekan\n3. Tidak ada error/crash saat input salah"
                capaian = "Siswa mampu melakukan review kritis terhadap aplikasi ciptaannya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Penyimpanan Data Lokal dengan TinyDB: Konsep database lokal, komponen non-visible TinyDB, pasangan Tag (kunci) & Value (nilai)."
                project_formatted = "Hands-on TinyDB: Memasukkan komponen TinyDB1 dari Palette Storage, melakukan StoreValue pada event tombol."
                cheatsheet = "call TinyDB1.StoreValue tag 'saldo' valueToStore 50000\ncall TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0"
                capaian = "Siswa memahami cara menyimpan data agar tidak terhapus ketika aplikasi ditutup atau HP di-restart."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Mengelola Data Aman di TinyDB: Pencegahan error data hilang dengan memberikan nilai default (valueIfTagNotThere), update nilai."
                project_formatted = "Latihan Default Value: Mengambil data saldo dengan nilai default 0 saat pertama kali aplikasi di-install."
                cheatsheet = "Tag unik: Gunakan tag deskriptif ('user_name', 'total_saldo', 'riwayat_catatan')"
                capaian = "Siswa mampu membaca dan memperbarui data persisten secara stabil."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-3':
                learning_type = "Proyek Mandiri TinyDB"
                konsep = "Mini Project Celengan Persisten: Membuat aplikasi pencatat tabungan yang menyimpan saldo ke TinyDB setiap kali koin ditambahkan."
                project_formatted = "MINI PROJECT 05: Celengan Digital Persisten (TinyDB) 🏦\nTugas Siswa:\n1. Rancang antarmuka penampil saldo dan tombol simpan tabungan\n2. Pada Screen.Initialize, ambil saldo dari TinyDB tag 'saldo_tersimpan'\n3. Saat user menekan tombol 'Tabung', tambahkan saldo dan simpan ulang ke TinyDB\n4. Tutup aplikasi di HP lalu buka kembali untuk membuktikan saldo tidak hilang.\nOutput: Aplikasi celengan persisten anti-reset."
                cheatsheet = "when Screen1.Initialize do\n  set global Saldo to (call TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0)\n  set LabelSaldo.Text to get global Saldo"
                capaian = "Siswa menghasilkan aplikasi tabungan dengan penyimpanan data persisten lokal yang andal."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-4-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Menganalisis Data Finansial: Mengolah data transaksi yang tersimpan di TinyDB untuk menghitung total pengeluaran mingguan."
                project_formatted = "Latihan Analisis Data: Menghitung total belanja dari list transaksi yang tersimpan di TinyDB."
                cheatsheet = "Menggunakan list blok di App Inventor untuk mengiterasi daftar belanjaan dan menghitung total."
                capaian = "Siswa mampu melakukan kalkulasi analitik sederhana atas data tersimpan."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-5':
                learning_type = "Proyek Mandiri Kas Mini"
                konsep = "Mini Project Pengelolaan Kas Mini: Menggabungkan form transaksi, validasi input, prosedur hitung saldo, dan TinyDB."
                project_formatted = "MINI PROJECT 06: Buku Kas Saku Digital 📖\nTugas Siswa:\n1. Buat fitur pencatatan pemasukan dan pengeluaran\n2. Validasi agar pengeluaran tidak melebihi sisa saldo\n3. Simpan riwayat dan saldo terkini secara otomatis ke TinyDB\nOutput: Aplikasi pembukuan kas mini saku siswa."
                cheatsheet = "Aplikasi Kas:\n- Form Masuk/Keluar\n- Validasi saldo tidak minus\n- Auto-save ke TinyDB\n- Reset tombol"
                capaian = "Siswa membuat aplikasi buku kas keuangan mini lengkap berbasis mobile."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-4-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Keamanan Transaksi Digital: Bahaya malware pembaca penyimpanan lokal, prinsip keamanan penyimpanan offline vs cloud."
                project_formatted = "Audit Keamanan Tag: Memeriksa agar tidak ada tag TinyDB yang menyimpan password polos."
                cheatsheet = "Penting: Jangan pernah menyimpan kata sandi polos (plain-text password) di dalam database lokal tanpa pengamanan."
                capaian = "Siswa memahami risiko keamanan data pada penyimpanan mobile lokal."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-5-1':
                learning_type = "Video Interaktif & Panduan Desain"
                konsep = "Merancang Solusi Digital: Tahap Design Thinking, menentukan persona pengguna, mendefinisikan fitur utama aplikasi solusi."
                project_formatted = "Lembar Kerja Ide Solusi: Menuliskan problem statement keuangan siswa dan memilih 3 fitur utama aplikasi capstone."
                cheatsheet = "Tahap Desain:\n1. Empathize: Temukan masalah keuangan sekitar\n2. Define: Pilih 1 masalah utama\n3. Ideate: Rancang fitur aplikasi"
                capaian = "Siswa mampu menyusun konsep arsitektur proyek akhir yang terarah dan solutif."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-5-2':
                learning_type = "Proyek Mandiri Wireframing"
                konsep = "Penyusunan Mockup & Wireframe: Mengatur tata letak antarmuka di Designer View dengan Vertical & Horizontal Arrangement."
                project_formatted = "MINI PROJECT 07: Wireframing & Layouting Proyek Akhir 📐\nTugas Siswa:\n1. Rancang arsitektur minimal 2 Layar (Screen1: Dashboard & Ringkasan, Screen2: Form Transaksi & Detail)\n2. Gunakan TableArrangement / VerticalArrangement agar tampilan rapi\nOutput: Prototipe tata letak UI aplikasi akhir."
                cheatsheet = "Gunakan HorizontalArrangement untuk tombol berdampingan, VerticalArrangement untuk form input bertumpuk."
                capaian = "Siswa menghasilkan tata letak antarmuka aplikasi akhir yang rapi dan responsif."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-5-3':
                learning_type = "Proyek Akhir Capstone"
                konsep = "Final Project Capstone: Implementasi menyeluruh mengintegrasikan validasi form, multi-screen, prosedur modular, dan TinyDB."
                project_formatted = "FINAL CAPSTONE PROJECT SMP: Aplikasi Solusi Finansial Mandiri 🏆\nTugas Siswa:\n1. Rangkai seluruh fitur: Form Input Tervalidasi, Prosedur Modular, dan Database TinyDB\n2. Uji seluruh fungsi tombol di smartphone menggunakan AI Companion\n3. Pastikan tidak ada bug, crash, atau form kosong yang lolos\nOutput: Aplikasi mobile edukasi finansial utuh siap pakai."
                cheatsheet = "Komponen Wajib Proyek Akhir:\n- Minimal 2 Layar / Screen\n- Form Input + Validasi\n- 2 Procedure\n- TinyDB Storage"
                capaian = "Siswa menyelesaikan satu aplikasi mobile edukasi finansial utuh yang siap pakai."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-5-4':
                learning_type = "Video Panduan & Publikasi Gallery"
                konsep = "Mempublikasikan Final Project ke MIT App Inventor Gallery, membuat link portfolio publik, dan mengekspor file APK/AIA."
                project_formatted = "Publikasi Portfolio: Mengekspor file project .aia, mengunggah tangkapan layar ke MIT Gallery, dan menyalin tautan portofolio ke LMS."
                cheatsheet = "1. Projects > Export selected project (.aia) to my computer\n2. Projects > Publish to Gallery\n3. Tulis deskripsi & screenshot"
                capaian = "Siswa berhasil mempublikasikan karyanya ke Gallery global dan mengumpulkan link portofolio."
                status = "Siap (Panduan Publikasi)"
            else:
                learning_type = "Video Interaktif"
                konsep = title
                cheatsheet = "MIT App Inventor Blocks"
                capaian = "Siswa menguasai kompetensi modul."
                status = "Siap"

            ms_rows.append([
                num, mod_id, mod_title, sid, title, learning_type, kicker, media_link, konsep, quiz_formatted, project_formatted, cheatsheet, capaian, status
            ])
            num += 1

    # 3. SMA (High School)
    hs_file = f"{base_path}/courseData-highschool.json"
    with open(hs_file, 'r', encoding='utf-8') as f:
        hs_data = json.load(f)
        
    hs_rows = []
    num = 1
    for m in hs_data.get('modules', []):
        mod_id = m.get('id', '')
        mod_title = m.get('title', '')
        for s in m.get('steps', []):
            sid = s.get('id', '')
            title = s.get('title', '')
            stype = s.get('type', 'video')
            kicker = s.get('kicker', '') or s.get('duration', 'Materi')
            vid = s.get('videoId', '')
            slide = s.get('slideUrl', '')
            
            media_link = ""
            if slide:
                media_link = "https://mds-academic.github.io/beasiswa_async/slides/bridge-hs-00.html"
            elif vid:
                media_link = f"https://youtu.be/{vid}"

            # Extract pop up quiz
            quizzes_list = s.get('quizzes', [])
            quiz_formatted = ""
            if quizzes_list:
                q_lines = []
                for q in quizzes_list:
                    time_sec = q.get('time', 0)
                    m_min = time_sec // 60
                    s_sec = time_sec % 60
                    time_label = f"{m_min:02d}:{s_sec:02d}"
                    q_title = q.get('title', '')
                    for subq in q.get('questions', []):
                        sub_title = subq.get('title', '') or q_title
                        q_text = clean_html(subq.get('question', ''))
                        opts = subq.get('options', [])
                        ans = subq.get('answer', '')
                        if q_text:
                            q_lines.append(f"⏱️ [{time_label}] {q_text}")
                            if opts:
                                q_lines.append(f"   Pilihan: {', '.join([clean_html(o) for o in opts[:4]])}")
                            if ans != "":
                                q_lines.append(f"   ✅ Kunci: {ans}")
                        elif sub_title:
                            q_lines.append(f"⏱️ [{time_label}] INFO: {sub_title}")
                quiz_formatted = "\n".join(q_lines)
            else:
                quiz_formatted = "- (Materi Konsep / Hands-on Coding)"

            # Assign rich descriptions and mini projects
            if sid == 'hs-0-0':
                learning_type = "Slide Interaktif & Video Orientasi"
                konsep = "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, & Slide Jembatan Google Colab: membuat notebook, sel kode, tombol run, dan output."
                project_formatted = "Eksplorasi Google Colab: Membuka colab.research.google.com, membuat notebook baru, mengetik print('Halo Dunia Python!'), dan mengeksekusi dengan Shift+Enter."
                cheatsheet = "Google Colab:\n- Shift + Enter: Jalankan cell & pindah ke cell berikutnya\n- Ctrl + Enter: Jalankan cell di tempat\n- print('Halo Dunia')"
                capaian = "Siswa memahami alur belajar dan mampu membuat serta menjalankan kode Python pertama di Google Colab."
                status = "Siap (Wadah & Slide Live)"
            elif sid == 'hs-1-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Input Pengguna, Masalah Tipe Data, dan Sanitasi: Fungsi input() selalu menghasilkan string, type casting int() dan float(), sanitasi teks .strip() dan .lower()."
                project_formatted = "Latihan Type Casting: Menerima input nama dan nominal tabungan, mengubah teks ke float, dan mencetak saldo akun."
                cheatsheet = "nama = input('Nama: ').strip()\numur = int(input('Umur: '))\nsaldo = float(input('Saldo: '))"
                capaian = "Siswa memahami perbedaan tipe data teks dan angka serta cara mengonversi input pengguna dengan aman."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-1-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Sanitasi & Validasi Input Keuangan: Memeriksa nilai tidak boleh negatif, mencegah input kosong, dan validasi jenis transaksi (debit/kredit)."
                project_formatted = "Latihan Validasi Fungsi: Menulis fungsi clean_text(teks) dan validate_amount(nominal) untuk memeriksa syarat angka > 0."
                cheatsheet = "if nominal <= 0:\n    print('Nominal harus lebih dari 0!')\nelse:\n    saldo += nominal"
                capaian = "Siswa mampu menulis logika pemeriksaan awal untuk mencegah data input tidak valid masuk ke sistem."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-1-3':
                learning_type = "Proyek Mandiri Python"
                konsep = "Safe Transaction Input: Membangun terminal input pencatatan saldo yang memvalidasi tipe data dan batas nominal minimum."
                project_formatted = "MINI PROJECT 01: Safe Transaction Input 🛡️\nTugas Siswa:\n1. Buat program konsol input transaksi dompet digital\n2. Minta input kategori dan nominal uang\n3. Terapkan sanitasi .strip().lower()\n4. Validasi nilai harus berupa angka positif\n5. Cetak konfirmasi transaksi yang berhasil dicatat.\nOutput: Script Python input saldo transaksi yang tahan kesalahan input user."
                cheatsheet = "def catat_transaksi():\n    raw = input('Nominal: ').strip()\n    # validasi angka & simpan"
                capaian = "Siswa menghasilkan script Python input transaksi yang tahan terhadap kesalahan pengetikan pengguna."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-2-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Bagaimana Program Bisa Memilih? Logika boolean True dan False, operator perbandingan (==, !=, <, >, <=, >=)."
                project_formatted = "Latihan Evaluasi Boolean: Membandingkan variabel saldo dengan harga belanjaan untuk menghasilkan True atau False."
                cheatsheet = "5 > 3  # True\n10 == 20 # False\n'apel' != 'jeruk' # True"
                capaian = "Siswa memahami ekspresi logika perbandingan sebagai penentu arah eksekusi program."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Menulis Conditional di Python: Sintaks if dan else, aturan indentasi 4 spasi (PEP 8), blok eksekusi bersyarat."
                project_formatted = "Latihan Logika Diskon: Menulis blok if-else untuk memberikan potongan harga jika total belanja >= Rp 100.000."
                cheatsheet = "if saldo >= harga:\n    print('Transaksi disetujui')\nelse:\n    print('Saldo tidak mencukupi')"
                capaian = "Siswa mampu menulis pernyataan if-else dengan indentasi yang benar di Python."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Multi Branch Conditionals: Menangani lebih dari dua alternatif menggunakan pernyataan 'elif', urutan evaluasi kondisi."
                project_formatted = "Latihan Penentuan Grade Diskon: Membuat percabangan bertingkat (Member Platinum 20%, Gold 10%, Silver 5%, Non-member 0%)."
                cheatsheet = "if skor >= 85:\n    grade = 'A'\nelif skor >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'"
                capaian = "Siswa mampu merancang logika percabangan multi-kondisi yang efisien."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Nested Conditionals: Percabangan bersarang (if di dalam if) untuk validasi bertingkat (misal: cek status akun lalu cek saldo)."
                project_formatted = "Latihan Simulasi Tarik Tunai ATM: Memeriksa apakah PIN benar, jika benar baru mengecek kecukupan saldo tabungan."
                cheatsheet = "if akun_aktif:\n    if saldo >= nominal:\n        proses_tarik_tunai()\n    else:\n        print('Saldo kurang')\nelse:\n    print('Akun dibekukan')"
                capaian = "Siswa dapat menyusun validasi keamanan bertingkat menggunakan percabangan bersarang."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Logical Operator: Menggabungkan kondisi logika majemuk menggunakan operator 'and', 'or', dan 'not'."
                project_formatted = "Latihan Syarat Majemuk: Menguji kondisi 'if usia >= 17 and punya_ktp' untuk pembukaan rekening bank digital."
                cheatsheet = "if usia >= 17 and punya_ktp:\n    buka_rekening()\nif status == 'VIP' or belanja > 500000:\n    beri_diskon()"
                capaian = "Siswa mampu menyederhanakan kode bertingkat dengan menggabungkan syarat menggunakan operator logika."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Needs vs Wants & Risks: Menganalisis risiko finansial (bunga pinjaman, denda, overbudget) dan klasifikasi kebutuhan belanja."
                project_formatted = "Analisis Anggaran Saku: Menghitung persentase alokasi dana darurat minimal 3x pengeluaran bulanan."
                cheatsheet = "Dana Darurat = Minimal 3x pengeluaran bulanan\nPrioritas 1: Kebutuhan pokok & cicilan utang\nPrioritas 2: Tabungan\nPrioritas 3: Hiburan"
                capaian = "Siswa memiliki wawasan literasi finansial analitis mengenai mitigasi risiko pengeluaran."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-7':
                learning_type = "Proyek Mandiri Python"
                konsep = "Smart Budget & Risk Planner: Program konsol Python yang mengevaluasi pos anggaran bulanan dan memberikan skor kesehatan keuangan."
                project_formatted = "MINI PROJECT 02: Smart Budget & Risk Planner 📊\nTugas Siswa:\n1. Minta input pemasukan bulanan dan rincian belanja\n2. Hitung persentase pos kebutuhan vs keinginan\n3. Gunakan percabangan bersyarat untuk menentukan status keuangan (Sehat: Tabungan >= 20%, Waspada: 10-19%, Bahaya: < 10%)\n4. Cetak rekomendasi langkah penghematan.\nOutput: Aplikasi penilai kesehatan anggaran pribadi berbasis percabangan logika."
                cheatsheet = "Kalkulasi rasio tabungan = (total_tabungan / total_pemasukan) * 100\nEvaluasi skor: Sehat (>= 20%), Waspada (10-19%), Bahaya (< 10%)"
                capaian = "Siswa menghasilkan aplikasi penilai kesehatan anggaran pribadi berbasis percabangan logika."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-3-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Pengantar Algoritma & Loop: Konsep automasi tugas repetitif, sintaks perulangan 'for item in sequence', fungsi range(n)."
                project_formatted = "Latihan Loop Pertama: Menggunakan for i in range(1, 13) untuk mencetak daftar simulasi cicilan bulanan."
                cheatsheet = "for i in range(5):\n    print(f'Iterasi ke-{i}')"
                capaian = "Siswa memahami cara kerja loop for untuk mengulang instruksi tanpa menulis kode berulang kali."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Optimasi Loop & Step Count: Mengatur parameter range(start, stop, step), variabel akumulator untuk menjumlahkan saldo berkala."
                project_formatted = "Latihan Akumulator Saldo: Menjumlahkan 7 transaksi belanja menggunakan variabel penampung total_pengeluaran."
                cheatsheet = "total_saldo = 0\nfor nominal in daftar_setoran:\n    total_saldo += nominal"
                capaian = "Siswa mampu mengontrol jalannya iterasi loop dan menghitung akumulasi nilai secara bertahap."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Optimasi Program Python: Perulangan 'while condition', kondisi terminasi, penggunaan keyword 'break' dan 'continue'."
                project_formatted = "Latihan Menu Konsol: Membangun menu interaktif berbasis while True dengan opsi keluar saat user mengetik 'exit'."
                cheatsheet = "while True:\n    perintah = input('Perintah: ')\n    if perintah == 'exit':\n        break"
                capaian = "Siswa menguasai penggunaan perulangan while untuk program interaktif berbasis menu."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-4':
                learning_type = "Proyek Mandiri Python"
                konsep = "Mini Project Optimasi Loop: Membuat kalkulator simulasi target tabungan (menghitung berapa bulan target tercapai)."
                project_formatted = "MINI PROJECT 03: Simulator Target Tabungan Otomatis 🎯\nTugas Siswa:\n1. Input target nominal tabungan masa depan dan setoran per periode\n2. Buat loop perulangan akumulasi saldo\n3. Hitung berapa jumlah iterasi (bulan/minggu) yang dibutuhkan hingga target terpenuhi\n4. Cetak tabel progres tabungan periode demi periode.\nOutput: Program kalkulator simulasi target tabungan dengan perulangan otomatis."
                cheatsheet = "bulan = 0\nwhile saldo < target:\n    saldo += setoran_bulanan\n    bulan += 1"
                capaian = "Siswa membangun program simulasi target finansial dengan perulangan otomatis."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-3-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Functions in Python: Mendefinisikan fungsi sendiri dengan keyword 'def', parameter dan argumen, keyword 'return' vs print()."
                project_formatted = "Latihan Fungsi Return: Menulis fungsi hitung_bunga(pokok, suku_bunga) yang mengembalikan nominal hasil bunga."
                cheatsheet = "def hitung_pajak(penghasilan):\n    return penghasilan * 0.05\n\npajak_saya = hitung_pajak(10000000)"
                capaian = "Siswa memahami konsep fungsi modular yang dapat menerima input dan mengembalikan nilai hasil komputasi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Modular Design in Python: Memecah program menjadi fungsi-fungsi kecil yang independen (Single Responsibility Principle)."
                project_formatted = "Latihan Dekomposisi Kode: Membagi alur kalkulasi kasir menjadi 3 fungsi terpisah."
                cheatsheet = "def input_data(): ...\ndef validasi_data(): ...\ndef simpan_data(): ...\ndef tampilkan_laporan(): ..."
                capaian = "Siswa mampu merancang arsitektur kode yang bersih, mudah dibaca, dan mudah di-test."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-7':
                learning_type = "Proyek Mandiri Python"
                konsep = "Mini Project Modular: Membangun sistem kasir modular dengan fungsi terpisah untuk hitung_subtotal, hitung_diskon, dan cetak_struk."
                project_formatted = "MINI PROJECT 04: Mesin Kasir & Kalkulator Diskon Modular 🧾\nTugas Siswa:\n1. Buat fungsi hitung_subtotal(daftar_harga)\n2. Buat fungsi hitung_diskon(subtotal, status_member)\n3. Buat fungsi hitung_total_akhir(subtotal, diskon)\n4. Satukan dalam satu fungsi utama cetak_struk().\nOutput: Script kasir modular dengan pembagian fungsi yang rapi."
                cheatsheet = "def hitung_diskon(total):\n    return total * 0.1 if total >= 100000 else 0"
                capaian = "Siswa menghasilkan script kasir modular dengan pembagian fungsi yang rapi."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-3-8':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Financial Literacy: Bunga Tunggal vs Bunga Majemuk (Compound Interest), implementasi rumus eksponensial di Python."
                project_formatted = "Latihan Komparasi Bunga: Menulis formula komparasi pertumbuhan uang antara bunga tunggal vs majemuk selama 5 tahun."
                cheatsheet = "Bunga Tunggal: A = P * (1 + r * t)\nBunga Majemuk: A = P * ((1 + r) ** t)"
                capaian = "Siswa memahami dampak eksponensial bunga majemuk dalam investasi jangka panjang melalui simulasi Python."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Try-Except dan Debugging: Menangani runtime error dengan blok try-except, menangkap ValueError saat konversi angka."
                project_formatted = "Latihan Try-Except: Membungkus konversi float(input()) dengan blok try-except agar tidak crash saat menerima huruf."
                cheatsheet = "try:\n    nominal = float(input('Nominal: '))\nexcept ValueError:\n    print('Harap masukkan angka yang valid!')"
                capaian = "Siswa mampu mencegah program berhenti tiba-tiba (crash) akibat input tidak terduga dari pengguna."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-2':
                learning_type = "Proyek Mandiri Python"
                konsep = "Safe Input with Error Handling: Membuat fungsi helper get_valid_float(prompt) yang meminta input berulang hingga valid."
                project_formatted = "MINI PROJECT 05: Safe Input with Error Handling 🛡️\nTugas Siswa:\n1. Buat fungsi input angka anti-crash get_valid_amount(prompt)\n2. Gunakan loop while True dan blok try-except ValueError\n3. Pastikan angka yang dimasukkan bernilai positif (> 0)\n4. Uji coba dengan mengetikkan teks acak untuk membuktikan program tidak crash.\nOutput: Fungsi pembaca angka yang 100% anti-crash."
                cheatsheet = "def get_valid_float(prompt):\n    while True:\n        try:\n            return float(input(prompt))\n        except ValueError:\n            print('Input salah, ulangi lagi.')"
                capaian = "Siswa menghasilkan fungsi pembaca angka yang 100% anti-crash."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-4-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Langkah Debugging Code: Membaca error traceback di Python, mengidentifikasi nomor baris error, teknik print debugging."
                project_formatted = "Latihan Traceback Analysis: Membaca log error IndexError dan memperbaiki indeks elemen list yang melebihi panjang data."
                cheatsheet = "Traceback (most recent call last):\n  File 'app.py', line 12, in <module>\n    saldo += uang\nTypeError: unsupported operand type(s) for +=: 'float' and 'str'"
                capaian = "Siswa memiliki kemampuan membaca pesan error Python dan menemukan sumber bug secara mandiri."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-4':
                learning_type = "Proyek Mandiri Debugging"
                konsep = "Debugging Program Belanja: Mengidentifikasi dan memperbaiki 5 bug tersembunyi (SyntaxError, TypeError, ZeroDivisionError)."
                project_formatted = "MINI PROJECT 06: Debugging Program Belanja Kasir 🛍️\nTugas Siswa:\n1. Unduh script program belanja yang rusak (memiliki 5 jenis error)\n2. Perbaiki SyntaxError titik dua dan indentasi\n3. Tangani TypeError konversi tipe data\n4. Pasang proteksi try-except pada pembagian diskon\n5. Pastikan program dapat mencetak struk dengan benar.\nOutput: Kode program hasil reparasi yang bersih dari bug dan error."
                cheatsheet = "Misi: Periksa tipe data variabel, perbaiki indentasi, dan tambahkan try-except pada pembagian diskon."
                capaian = "Siswa membuktikan keahlian problem-solving dengan mereparasi kode program yang rusak."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-4-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Dictionary dan List Transaksi: Struktur data key-value pair, membuat record transaksi {'tanggal', 'kategori', 'nominal'}, list of dicts."
                project_formatted = "Hands-on Dictionary: Membuat record transaksi {'kategori': 'Makanan', 'nominal': 25000} dan menambahkannya ke riwayat list."
                cheatsheet = "transaksi = {'kategori': 'Makanan', 'nominal': 25000}\nriwayat = []\nriwayat.append(transaksi)"
                capaian = "Siswa menguasai penyimpanan dan manipulasi struktur data majemuk (list of dictionaries) di Python."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Analisis Data Keuangan: Menghitung total pengeluaran dengan sum(), mencari transaksi terbesar max() dan terkecil min()."
                project_formatted = "Latihan Analitik Data: Mengolah riwayat transaksi untuk menampilkan total belanja, pengeluaran terbesar, dan rata-rata pengeluaran."
                cheatsheet = "total = sum(t['nominal'] for t in riwayat)\npengeluaran_terbesar = max(t['nominal'] for t in riwayat)"
                capaian = "Siswa mampu mengekstrak insight analitik keuangan dari koleksi data transaksi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-1':
                learning_type = "Video Interaktif & Perancangan"
                konsep = "Design Thinking & Kebutuhan Pengguna: Memetakan problem statement manajemen keuangan siswa SMA dan merumuskan solusi."
                project_formatted = "Lembar Kerja Capstone: Mengisi persona pengguna dan mendefinisikan 4 fitur kunci aplikasi solusi finansial."
                cheatsheet = "User Persona: Pelajar SMA dengan uang saku terbatas yang sering kehabisan uang sebelum akhir bulan."
                capaian = "Siswa mampu merumuskan spesifikasi kebutuhan fungsional aplikasi keuangan terintegrasi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-2':
                learning_type = "Video Interaktif & Desain Sistem"
                konsep = "Flowchart & Use Case: Diagram arsitektur menu utama aplikasi (Tambah Transaksi, Lihat Laporan, Analisis Anggaran, Keluar)."
                project_formatted = "Rancang Alur Capstone: Menggambar flowchart menu utama dan navigasi antar fungsi."
                cheatsheet = "Arsitektur Sistem:\n1. Main Menu Loop\n2. Modul Input (try-except)\n3. Modul Data (list of dicts)\n4. Modul Report"
                capaian = "Siswa mampu membuat diagram alur sistem yang komprehensif untuk proyek akhirnya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-3':
                learning_type = "Video Interaktif & Analisis"
                konsep = "Menganalisis Data Transaksi Celengan: Mengelompokkan transaksi berdasarkan kategori dan membandingkan realisasi vs anggaran."
                project_formatted = "Latihan Grouping Transaksi: Membuat fungsi yang mengelompokkan total pengeluaran per kategori ke dictionary baru."
                cheatsheet = "kategori_total = {}\nfor t in riwayat:\n    kat = t['kategori']\n    kategori_total[kat] = kategori_total.get(kat, 0) + t['nominal']"
                capaian = "Siswa mampu menerapkan algoritma pengelompokan (grouping & aggregation) data keuangan."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-4':
                learning_type = "Video Interaktif & Logika Pintar"
                konsep = "Logika Rekomendasi Pintar: Memberikan saran finansial otomatis ('Peringatan: Pos Hiburan Anda melebihi 30% anggaran')."
                project_formatted = "Latihan Smart Alert: Menulis logika peringatan dini jika pos belanja tertentu melampaui ambang batas."
                cheatsheet = "if kategori_total.get('Hiburan', 0) > budget_hiburan:\n    print('🚨 PERINGATAN: Pos Hiburan overbudget!')"
                capaian = "Siswa mengimplementasikan fitur kecerdasan berbasis aturan (rule-based intelligence) pada aplikasinya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-5':
                learning_type = "Capstone Project Akhir"
                konsep = "Capstone Integration: Menggabungkan seluruh komponen menjadi aplikasi utuh Financial Literacy App di Google Colab."
                project_formatted = "FINAL CAPSTONE PROJECT SMA: Financial Literacy Assistant App 🏆\nTugas Siswa:\n1. Bangun aplikasi konsol utuh di Google Colab\n2. Integrasikan menu interaktif berbasis while loop\n3. Implementasikan fungsi input transaksi aman (try-except & sanitasi)\n4. Simpan riwayat dalam list of dictionaries\n5. Buat modul analisis pengeluaran (sum, max, min, grouping)\n6. Tambahkan fitur penasehat finansial otomatis.\nOutput: Aplikasi konsol Python lengkap manajemen keuangan pribadi."
                cheatsheet = "Kriteria Capstone:\n- Validasi Input Try-Except\n- Struktur Data Dictionary & List\n- Fungsi Modular\n- Laporan Ringkasan Finansial"
                capaian = "Siswa menghasilkan satu aplikasi konsol Python lengkap untuk manajemen literasi finansial pribadi."
                status = "Siap (Framework Proyek)"
            else:
                learning_type = "Video Interaktif"
                konsep = title
                cheatsheet = "Python Syntax"
                capaian = "Siswa menguasai materi Python."
                status = "Siap"

            hs_rows.append([
                num, mod_id, mod_title, sid, title, learning_type, kicker, media_link, konsep, quiz_formatted, project_formatted, cheatsheet, capaian, status
            ])
            num += 1

    return {
        "sd": sd_rows,
        "smp": ms_rows,
        "sma": hs_rows
    }

if __name__ == "__main__":
    res = build_curriculum_dataset_v2()
    print(f"Dataset v2 generated: SD={len(res['sd'])}, SMP={len(res['smp'])}, SMA={len(res['sma'])}")
    with open("projects/uob-async-lms/subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v2.json", "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    print("Saved curriculum_sheet_payload_v2.json!")
