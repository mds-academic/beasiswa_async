import json
import re
import os
import glob

def clean_html(text):
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def build_curriculum_dataset_v3():
    base_data_path = "subprojects/01-lms-platform/src/data"
    slides_path = "subprojects/02-curriculum-sequencing/slides"
    
    # Load all bridge slide JSON metadata
    bridge_meta = {}
    for fpath in glob.glob(f"{slides_path}/*.json"):
        with open(fpath, 'r', encoding='utf-8') as f:
            bdata = json.load(f)
            bridge_meta[bdata['id']] = bdata

    # 1. SD (Upper Primary) - 8 Steps
    sd_rows = [
        [
            1, "up-mod-00", "Modul 0: Orientasi Pembelajaran Asinkronus SD", "up-0-0", "Introduction to Async Learning",
            "Video Interaktif & Orientasi", "Video 00 · Pengenalan", "https://youtu.be/yxmLOk5vcFg",
            "Orientasi Pembelajaran Mandiri (Async Learning), ritme belajar personal, cara kerja pop-up quiz interaktif, panduan mandiri & bantuan fasilitator.",
            "⏱️ [01:30] Apa prinsip utama belajar mandiri di platform ini?\n   Pilihan: Belajar tergesa-gesa, Mengatur ritme belajar sendiri, Mencontek kawan\n   ✅ Kunci: Mengatur ritme belajar sendiri\n\n⏱️ [03:00] Apa yang harus dilakukan jika menemui kesulitan?\n   Pilihan: Menutup laptop, Membaca petunjuk & bertanya ke fasilitator\n   ✅ Kunci: Membaca petunjuk & bertanya ke fasilitator",
            "Eksplorasi Platform: Membuka dashboard LMS, mencoba tombol play video, dan membaca kartu tips belajar mandiri.",
            "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri",
            "Siswa memahami alur belajar mandiri di platform UOB My Digital Space dan siap mengikuti modul coding visual Scratch.",
            "Siap (Wadah & Video Orientasi)"
        ],
        [
            2, "up-mod-01", "Modul 1: Petualangan Pertama — Data & Kebutuhan vs Keinginan", "up-1-1", "Mengenal & Menampilkan Data Sederhana",
            "Video Interaktif & Animasi Konsep", "Checkpoint 01 · Data", "https://youtu.be/yxmLOk5vcFg",
            "Pengenalan Data di sekitar kita, membedakan Kebutuhan Primer (Needs) vs Keinginan (Wants), pentingnya prioritas belanja.",
            "⏱️ [02:15] Manakah yang termasuk Kebutuhan Pokok (Needs)?\n   Pilihan: Makanan bergizi & buku sekolah, Mainan game console mahal\n   ✅ Kunci: Makanan bergizi & buku sekolah",
            "Latihan Pengelompokan: Menuliskan 3 daftar barang kebutuhan dan 3 barang keinginan di lembar kerja interaktif.",
            "Needs: Kebutuhan penting (makanan, sekolah, kesehatan)\nWants: Keinginan tambahan (mainan mahal, jajan berlebih)",
            "Siswa mampu mengelompokkan barang belanja ke kategori Needs vs Wants dengan tepat.",
            "Siap (Framework & Kuis Interaktif)"
        ],
        [
            3, "up-mod-01", "Modul 1: Petualangan Pertama — Data & Kebutuhan vs Keinginan", "up-1-2", "Menjaga Keamanan Data Pribadi Online",
            "Proyek Mandiri Scratch", "Checkpoint 02 · Aman di Internet", "https://youtu.be/yxmLOk5vcFg",
            "Pengenalan Sprite & Backdrop Scratch, event 'When Green Flag Clicked', memindahkan sprite ke keranjang yang sesuai.",
            "- (Fokus pada praktik pemrograman blok Scratch)",
            "MINI PROJECT 01: Sorting Needs vs Wants di Scratch 🐱\nTugas Siswa:\n1. Buka Scratch dan pilih sprite Keranjang Needs dan Keranjang Wants\n2. Buat sprite barang belanjaan (buku, roti, mainan robot)\n3. Gunakan blok motion 'go to x:.. y:..' untuk memilah barang ke keranjang yang tepat\nOutput: Game interaktif pemilahan kebutuhan belanja sederhana.",
            "Blok Event: when green flag clicked\nBlok Motion: go to x:.. y:..\nBlok Sensing: touching mouse-pointer?",
            "Siswa menghasilkan game interaktif pemilahan kebutuhan belanja sederhana di Scratch.",
            "Siap (Framework Proyek Mandiri)"
        ],
        [
            4, "up-mod-02", "Modul 2: Celengan Digital — Mengenal Variabel di Scratch", "up-2-1", "Membuat Variabel Celengan di Scratch",
            "Video Interaktif & Konsep Coding", "Checkpoint 01 · Variabel", "https://youtu.be/yxmLOk5vcFg",
            "Konsep Variabel sebagai kotak penyimpan nilai, membuat variabel 'Saldo_Celengan', inisialisasi nilai awal (set to 0).",
            "⏱️ [01:45] Apa fungsi utama variabel dalam Scratch?\n   Pilihan: Mengubah warna sprite, Menyimpan nilai angka/teks yang bisa berubah\n   ✅ Kunci: Menyimpan nilai angka/teks yang bisa berubah",
            "Latihan Membuat Variabel: Membuat variabel bernama 'Saldo' pada menu Variables di Scratch dan mengaturnya ke angka 0 saat bendera hijau diklik.",
            "Blok Variables:\n- set [Saldo] to [0]\n- change [Saldo] by [1000]",
            "Siswa mengerti fungsi variabel untuk menyimpan dan memperbarui data angka secara dinamis.",
            "Siap (Framework & Kuis Interaktif)"
        ],
        [
            5, "up-mod-02", "Modul 2: Celengan Digital — Mengenal Variabel di Scratch", "up-2-2", "Mengontrol Saldo & Menghitung Tabungan",
            "Proyek Mandiri Scratch", "Checkpoint 02 · Target Tabungan", "https://youtu.be/yxmLOk5vcFg",
            "Membuat tombol pecahan koin/uang (1.000, 2.000, 5.000), event 'when this sprite clicked', menambah isi celengan digital.",
            "- (Fokus pada perakitan interaksi koin)",
            "MINI PROJECT 02: Celengan Digital Interaktif 💰\nTugas Siswa:\n1. Buat 3 sprite koin (Rp 1.000, Rp 2.000, Rp 5.000)\n2. Tambahkan blok 'when this sprite clicked' pada tiap koin\n3. Gunakan blok 'change [Saldo] by [nominal]'\n4. Tampilkan balon percakapan: 'Total tabunganmu sekarang Rp...' saat celengan ditekan.\nOutput: Simulator celengan digital interaktif.",
            "when this sprite clicked\nchange [Saldo] by [2000]\nsay (join [Total tabungan: Rp ] [Saldo])",
            "Siswa berhasil membuat proyek simulasi celengan digital interaktif dengan Scratch.",
            "Siap (Framework Proyek Mandiri)"
        ],
        [
            6, "up-mod-03", "Modul 3: Karakter Cerdas — Logika Percabangan (If-Then)", "up-3-1", "Blok Percabangan: Jika..., Maka..., Jika Tidak...",
            "Video Interaktif & Logika Pemrograman", "Checkpoint 01 · Keputusan Cerdas", "https://youtu.be/yxmLOk5vcFg",
            "Logika Percabangan (If-Then), operator perbandingan (> dan <), mengecek apakah saldo cukup sebelum membeli barang.",
            "⏱️ [02:30] Jika Saldo = 15.000 dan Harga Buku = 12.000, apakah kondisi Saldo > Harga bernilai Benar?\n   Pilihan: Benar (True), Salah (False)\n   ✅ Kunci: Benar (True)",
            "Latihan Blok Syarat: Menyusun blok if-then untuk memeriksa apakah saldo celengan sudah mencapai target minimal Rp 20.000.",
            "if < [Saldo] > [Harga] > then\n  say [Uang cukup! Silakan beli]\nelse\n  say [Tabung lagi ya!]",
            "Siswa memahami bagaimana komputer mengambil keputusan cerdas berdasarkan kondisi angka.",
            "Siap (Framework & Kuis Interaktif)"
        ],
        [
            7, "up-mod-03", "Modul 3: Karakter Cerdas — Logika Percabangan (If-Then)", "up-3-2", "Mengirim Pesan Antar Karakter (Broadcast Message)",
            "Proyek Mandiri Scratch", "Checkpoint 02 · Broadcast", "https://youtu.be/yxmLOk5vcFg",
            "Penerapan blok 'If-Then-Else', interaksi pembeli dan kasir, broadcast message saat transaksi berhasil, pengurangan otomatis saldo.",
            "- (Fokus pada komunikasi antar karakter)",
            "MINI PROJECT 03: Kasir Toko Pintar 🏪\nTugas Siswa:\n1. Buat karakter Pembeli dan Kasir Toko\n2. Saat pembeli memilih barang, sistem mengecek saldo dengan If-Then-Else\n3. Jika uang cukup, kurangi saldo dan kirim broadcast 'barang_terjual'\n4. Kasir merespons dengan ucapan: 'Terima kasih sudah berbelanja!'\nOutput: Simulasi transaksi belanja cerdas.",
            "change [Saldo] by (0 - [Harga])\nbroadcast [transaksi_sukses]",
            "Siswa membangun sistem simulasi kasir cerdas yang menolak pembelian jika saldo tidak cukup.",
            "Siap (Framework Proyek Mandiri)"
        ],
        [
            8, "up-mod-04", "Modul 4: Proyek Game Interaktif — Kuis Finansial Seru", "up-4-1", "Mini Game Petualangan Belanja Bijak",
            "Capstone Project Akhir", "Final Project · Game Scratch", "https://youtu.be/yxmLOk5vcFg",
            "Integrasi Sprite, Variabel Skor/Saldo, Broadcast Message, Timer Game, dan Kuis Cerdas Finansial.",
            "- (Evaluasi menyeluruh pada hasil proyek game)",
            "FINAL CAPSTONE PROJECT SD: Game Kuis Cerdas Finansial 🏆\nTugas Siswa:\n1. Buat game kuis 5 pertanyaan seputar mengelola uang saku\n2. Pasang sistem penilaian dengan variabel Skor\n3. Berikan reward suara koin emas dan ucapan selamat jika skor >= 80\n4. Publikasikan link Scratch project ke platform LMS.\nOutput: Game edukasi finansial lengkap siap dimainkan.",
            "Gabungan Modul 1-3:\n- Variabel Skor & Saldo\n- Logika If-Then evaluasi jawaban\n- Sound efek & pesan reward",
            "Siswa menghasilkan Game Kuis Edukasi Finansial lengkap yang dapat dimainkan teman dan keluarga.",
            "Siap (Framework Capstone Project)"
        ]
    ]

    # Helper function to format quizzes
    def format_step_quizzes(quizzes_list):
        if not quizzes_list:
            return "- (Materi Konsep / Hands-on Coding)"
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
                        q_lines.append(f"   Pilihan: {', '.join([clean_html(str(o)) for o in opts[:4]])}")
                    if ans != "":
                        q_lines.append(f"   ✅ Kunci: {ans}")
                elif sub_title:
                    q_lines.append(f"⏱️ [{time_label}] INFO: {sub_title}")
        return "\n".join(q_lines) if q_lines else "- (Materi Praktik Langsung)"

    # Helper function for bridge slide row
    def build_bridge_row(no, mod_id, mod_title, sid, bmeta):
        learning_type = "Materi Jembatan Interaktif (Slide Standalone)"
        kicker = bmeta.get('kicker', 'Materi Jembatan')
        media_link = f"https://mds-academic.github.io/beasiswa_async/slides/{sid}.html"
        
        # Concepts
        summary = bmeta.get('summary', '')
        objs = bmeta.get('learningObjectives', [])
        obj_text = "\n".join([f"• {o}" for o in objs])
        konsep = f"{summary}\n\nTujuan Pembelajaran:\n{obj_text}"
        
        # Quizzes
        q_lines = []
        for idx, q in enumerate(bmeta.get('quizzes', []), 1):
            q_text = q.get('question', '')
            opts = q.get('options', [])
            ans = q.get('answer', '')
            exp = q.get('explanation', '')
            ans_str = opts[ans] if isinstance(ans, int) and ans < len(opts) else str(ans)
            q_lines.append(f"⏱️ [Slide Kuis #{idx}] {q_text}")
            if opts:
                q_lines.append(f"   Pilihan: {', '.join([str(o) for o in opts])}")
            q_lines.append(f"   ✅ Kunci: {ans_str}")
            if exp:
                q_lines.append(f"   💡 Penjelasan: {exp}")
        quiz_formatted = "\n".join(q_lines) if q_lines else "- (Slide Interaktif)"
        
        # Practice & Mini Project
        practice = bmeta.get('practice', {})
        practice_desc = practice.get('description', 'Simulasi interaktif mandiri di browser.')
        project_formatted = f"SIMULASI INTERAKTIF MANDIRI 💻\n{practice_desc}\nTugas: Selesaikan tur simulasi interaktif hingga layar konfirmasi pemahaman muncul."
        
        # Cheatsheet
        bookmarks = bmeta.get('bookmarks', [])
        bm_labels = [b.get('label', '') for b in bookmarks[:4]]
        cheatsheet = f"Panduan Navigasi Slide:\n" + "\n".join([f"- {lbl}" for lbl in bm_labels]) + "\n- Gunakan tombol Next/Prev atau panah keyboard untuk navigasi."
        
        # Capaian
        comp = bmeta.get('completionCriteria', {})
        capaian = comp.get('description', 'Siswa memahami konsep fundamental materi jembatan.')
        
        status = "Siap (Slide Standalone & Live Testing Verified)"
        
        return [
            no, mod_id, mod_title, sid, bmeta.get('title', ''),
            learning_type, kicker, media_link,
            konsep, quiz_formatted, project_formatted, cheatsheet, capaian, status
        ]

    # 2. SMP (Middle School) - 36 Steps
    with open(f"{base_data_path}/courseData-middleschool.json", 'r', encoding='utf-8') as f:
        ms_data = json.load(f)

    # Curation dictionary for standard SMP video & project steps
    ms_curation = {
        'ms-0-0': {
            'type': "Slide Interaktif & Video Orientasi",
            'konsep': "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, cheat sheet, dan panduan fasilitas belajar.",
            'project': "Eksplorasi Platform: Membuka dashboard LMS, mencoba switcher slide dan video, mempelajari panduan perangkat.",
            'cheatsheet': "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri",
            'capaian': "Siswa memahami aturan dan ritme pembelajaran mandiri serta siap menggunakan platform LMS.",
            'status': "Siap (Wadah & Video Orientasi)"
        },
        'ms-0-1': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Panduan Sign In ke MIT App Inventor (ai2.appinventor.mit.edu), autentikasi akun Google, menyetujui izin Terms of Service.",
            'project': "Hands-on Akun: Membuka browser, login ke ai2.appinventor.mit.edu dengan akun Google, dan membuat proyek kosong bernama 'Latihan01'.",
            'cheatsheet': "1. Buka ai2.appinventor.mit.edu\n2. Klik 'Create Apps!'\n3. Login dengan akun Google\n4. Klik 'Continue' melewati welcome dialog",
            'capaian': "Siswa berhasil login dan membuka workspace proyek perdana di MIT App Inventor.",
            'status': "Siap (Video Tutorial Kak Laras)"
        },
        'ms-0-2': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Eksplorasi antarmuka MIT App Inventor: Menu Bar, Project List, tombol Switcher Designer View vs Blocks Editor, panel Properties.",
            'project': "Hands-on Designer: Mengenal layout antarmuka, mengubah nama screen, dan mengeksplorasi tombol Designer dan Blocks.",
            'cheatsheet': "- Designer View: Merancang tampilan visual aplikasi\n- Blocks Editor: Menyusun logika & perilaku tombol\n- Projects > Start new project",
            'capaian': "Siswa mengenali fungsi navigasi utama di App Inventor dan memahami perbedaan Designer vs Blocks.",
            'status': "Siap (Video Tutorial Kak Laras)"
        },
        'ms-0-3': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Mengenal Palette dan Komponen UI: Menarik Button, Label, TextBox, Image dari Palette ke Viewer, mengatur Text & Background.",
            'project': "Hands-on UI Dasar: Menarik 1 Button dan 1 Label ke Viewer, mengganti warna teks menjadi Navy Blue dan ukuran font 18.",
            'cheatsheet': "- Palette: Gudang komponen (User Interface, Layout, Storage)\n- Viewer: Layar simulasi HP\n- Components: Daftar hierarki elemen",
            'capaian': "Siswa mampu menyusun komponen User Interface dasar di layar Viewer dan mengubah properti teks.",
            'status': "Siap (Video Tutorial Kak Laras)"
        },
        'ms-1-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Input Aman & Validasi Form: Event handling Button.Click, membaca teks TextBox, logika pengecekan form kosong (is empty string).",
            'project': "Latihan Event Handling: Menulis blok when Button.Click yang mengecek apakah TextBoxNama kosong.",
            'cheatsheet': "when Button1.Click do\n  if is empty TextBox1.Text then\n    set LabelStatus.Text to 'Mohon isi data!'",
            'capaian': "Siswa dapat memvalidasi form agar aplikasi tidak error saat pengguna belum memasukkan teks.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-1-2': {
            'type': "Proyek Mandiri Form Aman",
            'konsep': "Membuat antarmuka input nomor & nama dengan tombol validasi dan label feedback visual berwarna hijau/merah.",
            'project': "MINI PROJECT 01: Form Registrasi Aman 📱\nTugas Siswa:\n1. Buka App Inventor, rancang antarmuka form (TextBoxNama, TextBoxNomor, ButtonKirim, LabelPesan)\n2. Atur properti TextBoxNomor menjadi 'NumbersOnly'\n3. Buat blok logika validasi form kosong\n4. Beri feedback warna hijau jika sukses, merah jika salah.\nOutput: Form pendaftaran aman anti-kosong.",
            'cheatsheet': "Desain: TextBox (Nama), TextBox (Nomor), Button (Kirim), Label (Pesan Error)\nBlok: Validasi panjang karakter & jenis angka.",
            'capaian': "Siswa menghasilkan antarmuka form aman pertama di MIT App Inventor.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-1-3': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Flowchart & Alur Logika Data: Simbol terminator (Mulai/Selesai), proses (Persegi panjang), keputusan (Belah ketupat), input/output (Jajar genjang).",
            'project': "Latihan Menggambar Flowchart: Membuat diagram alur keputusan validasi form sebelum diimplementasikan ke blok.",
            'cheatsheet': "Mulai -> Input Data -> Apakah Data Valid? [Ya -> Proses -> Simpan / Tidak -> Tampilkan Error] -> Selesai",
            'capaian': "Siswa mampu merancang alur algoritma aplikasi ke dalam bentuk flowchart standar sebelum membuat kode blok.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-1-4': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Data & Privacy App: Etika perlindungan data pribadi, prinsip kerahasiaan password dan PIN, masking karakter dengan tanda bintang (*).",
            'project': "Latihan Masking Data: Mengatur properti password masking pada kolom input rahasia.",
            'cheatsheet': "Properti TextBox:\n- Set 'NumbersOnly' = true untuk input nominal uang\n- Masking data sensitif",
            'capaian': "Siswa menyadari pentingnya privasi data dan menerapkan pembatasan input yang aman pada aplikasi.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-1-5': {
            'type': "Proyek Mandiri Cek Pesan Aman",
            'konsep': "Membangun aplikasi pendeteksi pesan phishing/tautan mencurigakan menggunakan percabangan kata kunci sensitif.",
            'project': "MINI PROJECT 02: Aplikasi Pendeteksi Pesan Phishing 🛡️\nTugas Siswa:\n1. Sediakan TextBox untuk mem-paste teks pesan yang mencurigakan\n2. Gunakan blok Text 'contains text piece' untuk mencari kata kunci bahaya ('minta OTP', 'klik link ini', 'hadiah undian')\n3. Tampilkan kartu peringatan merah 'Waspada Penipuan!' jika kata kunci terdeteksi.\nOutput: Alat pemindai pesan penipuan digital sederhana.",
            'cheatsheet': "if contains text (TextBoxPesan.Text) piece ('minta password') then\n  set LabelWarning.Text to 'WASPADA PHISHING!'",
            'capaian': "Siswa menghasilkan aplikasi pendeteksi pesan penipuan digital interaktif.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-1-6': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Eksplorasi Data Pribadi: Menelaah jenis data publik (nama display) vs data rahasia (NIK, password, OTP, data perbankan).",
            'project': "Analisis Kasus Keamanan: Mengidentifikasi bahaya kebocoran data pada skenario aplikasi game palsu.",
            'cheatsheet': "Prinsip Keamanan:\nJangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun, termasuk pihak yang mengaku staf/admin.",
            'capaian': "Siswa memiliki literasi digital yang kuat mengenai perlindungan identitas pribadi.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-1-7': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Etika dan Tanggung Jawab Digital: Menghormati hak cipta konten, tidak membuat aplikasi berbahaya (spam/malware), etika programmer.",
            'project': "Refleksi Etika Digital: Menyusun 3 prinsip komitmen pengembang aplikasi yang bertanggung jawab.",
            'cheatsheet': "Tanggung Jawab Kreator Digital:\n1. Transparan penggunaan izin aplikasi\n2. Menjaga data pengguna\n3. Bermanfaat untuk masyarakat",
            'capaian': "Siswa menginternalisasi norma etika pengembangan software yang bertanggung jawab.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-2-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Percabangan Ganda di Dunia Nyata: Logika pengambilan keputusan dengan multi-syarat (kondisi A, kondisi B, atau kondisi default).",
            'project': "Latihan Logika Syarat: Menganalisis kondisi cuaca dan menyusun pohon keputusan tindakan.",
            'cheatsheet': "Jika hujan -> Bawa payung\nJika mendung -> Siapkan jas hujan\nSelain itu -> Tidak perlu payung",
            'capaian': "Siswa mampu memodelkan keputusan dunia nyata ke dalam struktur logika percabangan bersyarat.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-2-2': {
            'type': "Video Interaktif & Kuis",
            'konsep': "App Inventor: Percabangan Blok If-Else. Menggunakan mutator roda gigi biru untuk menambah 'else if' dan 'else'.",
            'project': "Hands-on Mutator Blok: Membuka mutator roda gigi biru pada blok If, menambahkan cabang Else-If dan Else.",
            'cheatsheet': "Blok Control:\nif [syarat] then [...]\nelse if [syarat2] then [...]\nelse [...]",
            'capaian': "Siswa menguasai penggunaan blok If-Else bertingkat di App Inventor.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-2-3': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Literasi Keuangan: Uang Digital vs Fisik, cara kerja dompet digital (e-wallet), QRIS, dan pencatatan transaksi non-tunai.",
            'project': "Latihan Transaksi Digital: Membedakan pos pemasukan digital dan pengeluaran digital pada catatan harian.",
            'cheatsheet': "Kelebihan Uang Digital: Praktis, tercatat otomatis, nirsentuh.\nRisiko: Rentan impulsif & pencurian akun bila password lemah.",
            'capaian': "Siswa memahami mekanisme transaksi finansial modern dan risikonya.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-2-4': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Literasi Keuangan: Skala Prioritas Belanja — Kebutuhan Utama vs Keinginan Hiburan, aturan alokasi 50/30/20.",
            'project': "Latihan Alokasi Uang Saku: Membagi nominal uang saku Rp 100.000 ke dalam pos 50% kebutuhan, 30% jajan, 20% tabungan.",
            'cheatsheet': "Kebutuhan (Needs) didahulukan 50%\nKeinginan (Wants) dibatasi maksimal 30%\nTabungan & Investasi 20%",
            'capaian': "Siswa mampu membuat keputusan finansial yang bijak dan mengelompokkan pos pengeluaran.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-2-5': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Aplikasi Kalkulator Keuangan: Mengintegrasikan komponen input nominal, blok perkalian/pembagian persentase, dan label alokasi.",
            'project': "Hands-on Blok Math: Menyusun blok perkalian matematika untuk menghitung alokasi otomatis saat tombol ditekan.",
            'cheatsheet': "set LabelKebutuhan.Text to (TextBoxUang.Text * 0.5)\nset LabelTabungan.Text to (TextBoxUang.Text * 0.2)",
            'capaian': "Siswa membangun kalkulator alokasi anggaran otomatis berbasis rumus finansial.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-2-6': {
            'type': "Proyek Mandiri Final Percabangan",
            'konsep': "Membangun aplikasi simulator penasihat belanja: Memberi saran 'Boleh Beli' atau 'Tunda Dulu' berdasarkan saldo saat ini.",
            'project': "MINI PROJECT 03: Penasihat Belanja Cerdas (Smart Shopper) 🛒\nTugas Siswa:\n1. Input Saldo Tabungan dan Harga Barang impian\n2. Gunakan percabangan If-Else:\n   - Jika Saldo - Harga >= Rp 50.000 -> Tampilkan 'Aman Dibeli!' (Hijau)\n   - Jika Saldo - Harga < Rp 50.000 -> Tampilkan 'Tunda Dulu!' (Kuning)\n   - Jika Saldo < Harga -> Tampilkan 'Uang Tidak Cukup!' (Merah)\nOutput: Aplikasi penilai kelayakan belanja otomatis.",
            'cheatsheet': "if (Saldo - HargaBarang) < 50000 then\n  set LabelSaran.Text to 'Tunda! Saldo tabunganmu hampir habis.'\nelse\n  set LabelSaran.Text to 'Aman dibeli!'",
            'capaian': "Siswa menghasilkan aplikasi asisten belanja cerdas dengan validasi multi-kondisi.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-3-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Membuat & Memanggil Procedures: Blok 'to procedure do' (tanpa kembalian) dan 'to procedure result' (mengembalikan nilai), parameter.",
            'project': "Hands-on Procedure: Membuat prosedur sederhana 'tampilkanPesanSukses' dan memanggilnya dari 2 tombol berbeda.",
            'cheatsheet': "to hitungDiskon (harga, persen) do\n  result: harga - (harga * persen / 100)\ncall hitungDiskon(100000, 10)",
            'capaian': "Siswa memahami cara kerja prosedur/fungsi untuk membagi kode program menjadi modul-modul efisien.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-3-2': {
            'type': "Proyek Mandiri Kalkulator",
            'konsep': "Mini Project Kalkulator Modular: Menerapkan prosedur hitungTambah, hitungKurang, hitungKali, dan resetForm.",
            'project': "MINI PROJECT 04: Kalkulator Keuangan Modular 🧮\nTugas Siswa:\n1. Buat antarmuka dengan 2 input angka dan 4 tombol operasi (+, -, *, /)\n2. Buat Procedure terpisah untuk tiap operasi matematika\n3. Buat Procedure 'bersihkanInput' untuk mengosongkan layar\nOutput: Kalkulator modular tanpa duplikasi kode blok.",
            'cheatsheet': "Prosedur 'bersihkanLayar':\nset TextBox1.Text to ''\nset TextBox2.Text to ''\nset LabelHasil.Text to '0'",
            'capaian': "Siswa membuat kalkulator modular tanpa duplikasi kode blok.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-3-3': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Optimasi dan Modularisasi Kode: Prinsip DRY (Don't Repeat Yourself), meningkatkan keterbacaan kode blok.",
            'project': "Refactoring Blok: Menggabungkan 5 blok duplikat menjadi 1 prosedur tunggal berparameter.",
            'cheatsheet': "Jangan copy-paste blok yang sama berulang kali; bungkus ke dalam satu Prosedur dan panggil namanya!",
            'capaian': "Siswa mampu menyederhanakan kode blok yang rumit menjadi bersih dan mudah dipelihara.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-3-4': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Uji Coba & Debugging: Menggunakan fitur 'Do It' di Blocks Editor untuk menginspeksi nilai variabel secara instan, melacak bug.",
            'project': "Latihan Do It Debugging: Klik kanan blok ekspresi matematika, pilih 'Do It', dan amati kotak dialog hasil keluaran.",
            'cheatsheet': "Klik kanan blok kode > pilih 'Do It' untuk melihat nilai keluaran blok secara langsung di layar monitor.",
            'capaian': "Siswa menguasai teknik debugging profesional di MIT App Inventor.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-3-5': {
            'type': "Video Interaktif & Refleksi",
            'konsep': "Presentasi & Refleksi: Mengevaluasi arsitektur blok, kenyamanan antarmuka pengguna (UI/UX), dan dokumentasi kode.",
            'project': "Checklist Audit UI/UX: Menguji aplikasi terhadap 3 kriteria kenyamanan pengguna (kontras warna, ukuran tombol, kejelasan error).",
            'cheatsheet': "Kriteria Desain Aplikasi yang Baik:\n1. Tampilan bersih dan rapi\n2. Tombol mudah ditekan\n3. Tidak ada error/crash saat input salah",
            'capaian': "Siswa mampu melakukan review kritis terhadap aplikasi ciptaannya.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-4-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Penyimpanan Data Lokal dengan TinyDB: Konsep database lokal, komponen non-visible TinyDB, pasangan Tag (kunci) & Value (nilai).",
            'project': "Hands-on TinyDB: Memasukkan komponen TinyDB1 dari Palette Storage, melakukan StoreValue pada event tombol.",
            'cheatsheet': "call TinyDB1.StoreValue tag 'saldo' valueToStore 50000\ncall TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0",
            'capaian': "Siswa memahami cara menyimpan data agar tidak terhapus ketika aplikasi ditutup atau HP di-restart.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-4-2': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Mengelola Data Aman di TinyDB: Pencegahan error data hilang dengan memberikan nilai default (valueIfTagNotThere), update nilai.",
            'project': "Latihan Default Value: Mengambil data saldo dengan nilai default 0 saat pertama kali aplikasi di-install.",
            'cheatsheet': "Tag unik: Gunakan tag deskriptif ('user_name', 'total_saldo', 'riwayat_catatan')",
            'capaian': "Siswa mampu membaca dan memperbarui data persisten secara stabil.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-4-3': {
            'type': "Proyek Mandiri TinyDB",
            'konsep': "Mini Project Celengan Persisten: Membuat aplikasi pencatat tabungan yang menyimpan saldo ke TinyDB setiap kali koin ditambahkan.",
            'project': "MINI PROJECT 05: Celengan Digital Persisten (TinyDB) 🏦\nTugas Siswa:\n1. Rancang antarmuka penampil saldo dan tombol simpan tabungan\n2. Pada Screen.Initialize, ambil saldo dari TinyDB tag 'saldo_tersimpan'\n3. Saat user menekan tombol 'Tabung', tambahkan saldo dan simpan ulang ke TinyDB\n4. Tutup aplikasi di HP lalu buka kembali untuk membuktikan saldo tidak hilang.\nOutput: Aplikasi celengan persisten anti-reset.",
            'cheatsheet': "when Screen1.Initialize do\n  set global Saldo to (call TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0)\n  set LabelSaldo.Text to get global Saldo",
            'capaian': "Siswa menghasilkan aplikasi tabungan dengan penyimpanan data persisten lokal yang andal.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-4-4': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Menganalisis Data Finansial: Mengolah data transaksi yang tersimpan di TinyDB untuk menghitung total pengeluaran mingguan.",
            'project': "Latihan Analisis Data: Menghitung total belanja dari list transaksi yang tersimpan di TinyDB.",
            'cheatsheet': "Menggunakan list blok di App Inventor untuk mengiterasi daftar belanjaan dan menghitung total.",
            'capaian': "Siswa mampu melakukan kalkulasi analitik sederhana atas data tersimpan.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-4-5': {
            'type': "Proyek Mandiri Kas Mini",
            'konsep': "Mini Project Pengelolaan Kas Mini: Menggabungkan form transaksi, validasi input, prosedur hitung saldo, dan TinyDB.",
            'project': "MINI PROJECT 06: Buku Kas Saku Digital 📖\nTugas Siswa:\n1. Buat fitur pencatatan pemasukan dan pengeluaran\n2. Validasi agar pengeluaran tidak melebihi sisa saldo\n3. Simpan riwayat dan saldo terkini secara otomatis ke TinyDB\nOutput: Aplikasi pembukuan kas mini saku siswa.",
            'cheatsheet': "Aplikasi Kas:\n- Form Masuk/Keluar\n- Validasi saldo tidak minus\n- Auto-save ke TinyDB\n- Reset tombol",
            'capaian': "Siswa membuat aplikasi buku kas keuangan mini lengkap berbasis mobile.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-4-6': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Keamanan Transaksi Digital: Bahaya malware pembaca penyimpanan lokal, prinsip keamanan penyimpanan offline vs cloud.",
            'project': "Studi Kasus Keamanan: Menganalisis risiko jika password disimpan dalam format plain text di database lokal.",
            'cheatsheet': "Prinsip Keamanan Penyimpanan:\nData PIN atau password rahasia tidak boleh disimpan sembarangan di penyimpanan publik tanpa proteksi enkripsi.",
            'capaian': "Siswa memahami risiko kebocoran data pada media penyimpanan lokal.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-5-1': {
            'type': "Video Interaktif & Konsep Proyek",
            'konsep': "Merancang Solusi Digital: Metodologi pemecahan masalah (Identifikasi Masalah, Perancangan Solusi, Desain UI, Pengkodean Blok).",
            'project': "Perancangan Solusi: Menuliskan lembar spesifikasi proyek akhir mencakup target pengguna, masalah finansial, dan fitur kunci.",
            'cheatsheet': "Langkah Pengembangan Proyek:\n1. Temukan masalah nyata di sekitarmu\n2. Rancang wireframe di kertas\n3. Susun komponen di Designer\n4. Buat blok logika",
            'capaian': "Siswa mampu menyusun proposal rancangan aplikasi finansial yang solutif.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'ms-5-2': {
            'type': "Proyek Mandiri Wireframe",
            'konsep': "Merancang Solusi Digital: Membuat sketsa wireframe antarmuka pengguna dan diagram alur logika aplikasi final.",
            'project': "MINI PROJECT 07: Wireframe & User Flow Proyek Akhir 📐\nTugas Siswa:\n1. Buat sketsa layout layar aplikasi (Beranda, Form Transaksi, Laporan Grafik/Teks)\n2. Tentukan komponen Palette yang dibutuhkan\n3. Buat bagan alur pengguna saat mencatat uang.\nOutput: Dokumen cetak biru desain sebelum masuk ke Blocks Editor.",
            'cheatsheet': "Wireframe: Sketsa tata letak tombol, teks, dan gambar agar pengguna nyaman menggunakan aplikasi.",
            'capaian': "Siswa menghasilkan desain antarmuka yang matang untuk proyek akhir mereka.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'ms-5-3': {
            'type': "Final Capstone Project SMP",
            'konsep': "Final Project: Membangun Aplikasi Keuangan Pribadi Siswa Berbasis MIT App Inventor secara utuh dan mandiri.",
            'project': "FINAL CAPSTONE PROJECT SMP: Aplikasi Asisten Finansial Mandiri 🏆\nTugas Siswa:\n1. Gabungkan seluruh keterampilan dari Modul 1-4 (Form Validasi, Percabangan Cerdas, Prosedur Modular, & TinyDB)\n2. Sediakan fitur pencatatan pemasukan/pengeluaran dan grafik target tabungan\n3. Uji aplikasi di HP fisik menggunakan AI Companion hingga zero-bug\n4. Simpan file .aia proyek dan buat video demo singkat 1 menit.\nOutput: Aplikasi mobile Android/iOS edukasi finansial karya mandiri.",
            'cheatsheet': "Integrasi Penuh:\n- UI Bersih & Rapi\n- Validasi Anti-Crash\n- Database Persisten TinyDB\n- Fitur Edukasi Finansial Nyata",
            'capaian': "Siswa berhasil menciptakan aplikasi mobile multifungsi siap pakai yang mengintegrasikan seluruh konsep pemrograman blok dan literasi keuangan.",
            'status': "Siap (Framework Capstone Project)"
        },
        'ms-5-4': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Mempublikasikan Final Project ke MIT App Inventor Gallery: Menulis deskripsi proyek, mengunggah screenshot, lisensi open-source.",
            'project': "Publikasi Gallery: Mengekspor proyek ke format .aia dan mempublikasikannya ke MIT App Inventor Gallery komunitas global.",
            'cheatsheet': "- Projects > Publish to Gallery\n- Tulis Judul, Deskripsi, dan Cara Penggunaan\n- Bagikan link web gallery ke fasilitator & portfolio siswa",
            'capaian': "Siswa mampu mempublikasikan dan memamerkan karya aplikasinya ke komunitas global.",
            'status': "Siap (Video Tutorial Kak Laras)"
        }
    }

    ms_rows = []
    ms_num = 1
    for m in ms_data.get('modules', []):
        mod_id = m.get('id', '')
        mod_title = m.get('title', '')
        for s in m.get('steps', []):
            sid = s.get('id', '')
            stitle = s.get('title', '')
            stype = s.get('type', 'video')
            kicker = s.get('kicker', '') or s.get('duration', 'Orientasi')
            vid = s.get('videoId', '')
            
            if sid.startswith('bridge-'):
                bmeta = bridge_meta.get(sid, {})
                row = build_bridge_row(ms_num, mod_id, mod_title, sid, bmeta)
            else:
                media_link = f"https://youtu.be/{vid}" if vid else "-"
                cur = ms_curation.get(sid, {})
                learning_type = cur.get('type', "Video Interaktif & Kuis" if stype == 'video' else "Proyek Mandiri")
                konsep = cur.get('konsep', s.get('description', 'Materi konsep dan tutorial pemrograman blok App Inventor.'))
                quiz_formatted = format_step_quizzes(s.get('quizzes', []))
                project_formatted = cur.get('project', "Praktik mandiri perakitan blok di MIT App Inventor.")
                cheatsheet = cur.get('cheatsheet', "Pelajari balok logika terkait dan uji di AI Companion.")
                capaian = cur.get('capaian', "Siswa menguasai kompetensi step ini dengan baik.")
                status = cur.get('status', "Siap (Terverifikasi)")
                row = [
                    ms_num, mod_id, mod_title, sid, stitle,
                    learning_type, kicker, media_link,
                    konsep, quiz_formatted, project_formatted, cheatsheet, capaian, status
                ]
            ms_rows.append(row)
            ms_num += 1

    # 3. SMA (High School) - 36 Steps
    with open(f"{base_data_path}/courseData-highschool.json", 'r', encoding='utf-8') as f:
        hs_data = json.load(f)

    # Curation dictionary for standard SMA video & project steps
    hs_curation = {
        'hs-0-0': {
            'type': "Slide Interaktif & Video Orientasi",
            'konsep': "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, & Slide Jembatan Google Colab: membuat notebook, sel kode, tombol run, dan output.",
            'project': "Eksplorasi Google Colab: Membuka colab.research.google.com, membuat notebook baru, mengetik print('Halo Dunia Python!'), dan mengeksekusi dengan Shift+Enter.",
            'cheatsheet': "Google Colab:\n- Shift + Enter: Jalankan cell & pindah ke cell berikutnya\n- Ctrl + Enter: Jalankan cell di tempat\n- print('Halo Dunia')",
            'capaian': "Siswa memahami alur belajar dan mampu membuat serta menjalankan kode Python pertama di Google Colab.",
            'status': "Siap (Wadah & Video Orientasi)"
        },
        'hs-1-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Input Pengguna, Masalah Tipe Data, dan Sanitasi: Fungsi input() selalu menghasilkan string, type casting int() dan float(), sanitasi teks .strip() dan .lower().",
            'project': "Latihan Type Casting: Menerima input nama dan nominal tabungan, mengubah teks ke float, dan mencetak saldo akun.",
            'cheatsheet': "nama = input('Nama: ').strip()\numur = int(input('Umur: '))\nsaldo = float(input('Saldo: '))",
            'capaian': "Siswa memahami perbedaan tipe data teks dan angka serta cara mengonversi input pengguna dengan aman.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-1-2': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Sanitasi & Validasi Input Keuangan: Memeriksa nilai tidak boleh negatif, mencegah input kosong, dan validasi jenis transaksi (debit/kredit).",
            'project': "Latihan Validasi Fungsi: Menulis fungsi clean_text(teks) dan validate_amount(nominal) untuk memeriksa syarat angka > 0.",
            'cheatsheet': "if nominal <= 0:\n    print('Nominal harus lebih dari 0!')\nelse:\n    saldo += nominal",
            'capaian': "Siswa mampu menulis logika pemeriksaan awal untuk mencegah data input tidak valid masuk ke sistem.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-1-3': {
            'type': "Proyek Mandiri Python (Persiapan Capstone)",
            'konsep': "Safe Transaction Input: Membangun terminal input pencatatan saldo yang memvalidasi tipe data dan batas nominal minimum.",
            'project': "MINI PROJECT 05: Safe Transaction Input 🛡️\nTugas Siswa:\n1. Buat program konsol input transaksi dompet digital\n2. Minta input kategori dan nominal uang\n3. Terapkan sanitasi .strip().lower()\n4. Validasi nilai harus berupa angka positif\n5. Cetak konfirmasi transaksi yang berhasil dicatat.\nOutput: Script Python input saldo transaksi yang tahan kesalahan input user.",
            'cheatsheet': "def catat_transaksi():\n    raw = input('Nominal: ').strip()\n    # validasi angka & simpan",
            'capaian': "Siswa menghasilkan script Python input transaksi yang tahan terhadap kesalahan pengetikan pengguna.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'hs-2-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Bagaimana Program Bisa Memilih? Logika boolean True dan False, operator perbandingan (==, !=, <, >, <=, >=).",
            'project': "Latihan Evaluasi Boolean: Membandingkan variabel saldo dengan harga belanjaan untuk menghasilkan True atau False.",
            'cheatsheet': "5 > 3  # True\n10 == 20 # False\n'apel' != 'jeruk' # True",
            'capaian': "Siswa memahami ekspresi logika perbandingan sebagai penentu arah eksekusi program.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-2-2': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Menulis Conditional di Python: Sintaks if dan else, aturan indentasi 4 spasi (PEP 8), blok eksekusi bersyarat.",
            'project': "Latihan Logika Diskon: Menulis blok if-else untuk memberikan potongan harga jika total belanja >= Rp 100.000.",
            'cheatsheet': "if saldo >= harga:\n    print('Transaksi disetujui')\nelse:\n    print('Saldo tidak mencukupi')",
            'capaian': "Siswa mampu menulis pernyataan if-else dengan indentasi yang benar di Python.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-2-3': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Multi Branch Conditionals: Menangani lebih dari dua alternatif menggunakan pernyataan 'elif', urutan evaluasi kondisi.",
            'project': "Latihan Penentuan Grade Diskon: Membuat percabangan bertingkat (Member Platinum 20%, Gold 10%, Silver 5%, Non-member 0%).",
            'cheatsheet': "if skor >= 85:\n    grade = 'A'\nelif skor >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'",
            'capaian': "Siswa mampu merancang logika percabangan multi-kondisi yang efisien.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-2-4': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Nested Conditionals: Percabangan bersarang (if di dalam if) untuk validasi bertingkat (misal: cek status akun lalu cek saldo).",
            'project': "Latihan Simulasi Tarik Tunai ATM: Memeriksa apakah PIN benar, jika benar baru mengecek kecukupan saldo tabungan.",
            'cheatsheet': "if akun_aktif:\n    if saldo >= nominal:\n        proses_tarik_tunai()\n    else:\n        print('Saldo kurang')\nelse:\n    print('Akun dibekukan')",
            'capaian': "Siswa dapat menyusun validasi keamanan bertingkat menggunakan percabangan bersarang.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-2-5': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Logical Operator: Menggabungkan kondisi logika majemuk menggunakan operator 'and', 'or', dan 'not'.",
            'project': "Latihan Syarat Majemuk: Menguji kondisi 'if usia >= 17 and punya_ktp' untuk pembukaan rekening bank digital.",
            'cheatsheet': "if usia >= 17 and punya_ktp:\n    buka_rekening()\nif status == 'VIP' or belanja > 500000:\n    beri_diskon()",
            'capaian': "Siswa mampu menyederhanakan kode bertingkat dengan menggabungkan syarat menggunakan operator logika.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-2-6': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Needs vs Wants & Risks: Menganalisis risiko finansial (bunga pinjaman, denda, overbudget) dan klasifikasi kebutuhan belanja.",
            'project': "Analisis Anggaran Saku: Menghitung persentase alokasi dana darurat minimal 3x pengeluaran bulanan.",
            'cheatsheet': "Dana Darurat = Minimal 3x pengeluaran bulanan\nPrioritas 1: Kebutuhan pokok & cicilan utang\nPrioritas 2: Tabungan\nPrioritas 3: Hiburan",
            'capaian': "Siswa memiliki wawasan literasi finansial analitis mengenai mitigasi risiko pengeluaran.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-2-7': {
            'type': "Proyek Mandiri Python",
            'konsep': "Smart Budget & Risk Planner: Program konsol Python yang mengevaluasi pos anggaran bulanan dan memberikan skor kesehatan keuangan.",
            'project': "MINI PROJECT 01: Smart Budget & Risk Planner 📊\nTugas Siswa:\n1. Buat program Python yang meminta input pendapatan bulanan dan 3 pos pengeluaran\n2. Gunakan percabangan elif & operator logika untuk menghitung rasio tabungan\n3. Tampilkan kartu evaluasi: 'Keuangan Sehat' (Hijau), 'Waspada' (Kuning), atau 'Bahaya Defisit' (Merah).\nOutput: Script Python konsultan keuangan otomatis.",
            'cheatsheet': "Rasio Tabungan = (Tabungan / Total Pendapatan) * 100%\nJika rasio >= 20% -> Keuangan Sehat\nJika rasio < 10% -> Peringatan Berhemat",
            'capaian': "Siswa menghasilkan program penasihat anggaran otomatis berbasis percabangan logika Python.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'hs-3-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Pengenalan Loop: Konsep perulangan untuk mengotomasikan tugas repetitif tanpa menulis ulang kode baris demi baris.",
            'project': "Latihan Eksekusi Loop: Menulis for loop sederhana untuk mencetak deret angka 1 sampai 10.",
            'cheatsheet': "for i in range(1, 11):\n    print(f'Angka ke-{i}')",
            'capaian': "Siswa memahami pentingnya loop untuk efisiensi komputasi dan otomasi.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-3-2': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Optimasi Loop & Step Count: Penggunaan range(start, stop, step), iterating over lists, dan loop counter.",
            'project': "Latihan Range Step: Menghitung akumulasi bunga tabungan majemuk setiap 3 bulan (step=3) selama setahun.",
            'cheatsheet': "range(0, 10, 2) # 0, 2, 4, 6, 8\nfor bulan in range(3, 13, 3):\n    saldo *= 1.01",
            'capaian': "Siswa menguasai variasi parameter fungsi range() untuk mengontrol lompatan iterasi.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-3-3': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Optimasi Program Python: Mencegah infinite loop (pada while), efisiensi algoritma loop, dan break/continue statements.",
            'project': "Latihan Break Condition: Menghentikan perulangan pencatatan belanja saat total pengeluaran melebihi limit kredit.",
            'cheatsheet': "for transaksi in daftar:\n    if total > batas_limit:\n        print('Limit terlampaui!')\n        break",
            'capaian': "Siswa mampu mengendalikan alur eksekusi perulangan secara aman tanpa risiko hang.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-3-4': {
            'type': "Proyek Mandiri Python",
            'konsep': "Mini Project Optimasi Loop: Menghitung simulasi target tabungan masa depan dengan suku bunga tahunan menggunakan For Loop.",
            'project': "MINI PROJECT 02: Simulator Target Tabungan & Investasi 📈\nTugas Siswa:\n1. Input saldo awal, setoran bulanan, dan target tabungan impian\n2. Gunakan loop untuk mengiterasi bulan demi bulan hingga saldo mencapai target\n3. Cetak tabel proyeksi pertumbuhan uang dari bulan ke-1 hingga target tercapai.\nOutput: Simulator proyeksi tabungan masa depan mandiri.",
            'cheatsheet': "while saldo < target:\n    bulan += 1\n    saldo += setoran_bulanan\nprint(f'Target tercapai dalam {bulan} bulan!')",
            'capaian': "Siswa berhasil membangun simulator kalkulasi keuangan berbasis perulangan.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'hs-3-5': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Functions in Python: Sintaks fungsi def, parameter input, return value, dan scope variabel (lokal vs global).",
            'project': "Hands-on Pembuatan Fungsi: Menulis fungsi hitung_pajak(penghasilan) yang mengembalikan nilai nominal pajak wajib dibayar.",
            'cheatsheet': "def hitung_pajak(penghasilan):\n    tarif = 0.05 if penghasilan < 50000000 else 0.15\n    return penghasilan * tarif",
            'capaian': "Siswa mampu membuat fungsi kustom dengan parameter dan return value yang benar.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-3-6': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Modular Design in Python: Memecah aplikasi besar menjadi fungsi-fungsi kecil yang fokus pada 1 tugas (Single Responsibility).",
            'project': "Refactoring Kode Modular: Mengubah skrip monolitik 50 baris menjadi 4 fungsi modular independen.",
            'cheatsheet': "Struktur Program Modular:\n1. Fungsi Input & Validasi\n2. Fungsi Pemrosesan & Kalkulasi\n3. Fungsi Output & Laporan",
            'capaian': "Siswa mampu merancang arsitektur program yang rapi, modular, dan mudah di-debug.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-3-7': {
            'type': "Proyek Mandiri Python",
            'konsep': "Mini Project Fungsi Modular: Membangun modul kalkulator suku bunga pinjaman dan simulasi cicilan bulanan (Amortisasi).",
            'project': "MINI PROJECT 03: Kalkulator Simulasi Cicilan Finansial 💳\nTugas Siswa:\n1. Buat fungsi 'hitung_angsuran(pokok, bunga, tenor)'\n2. Buat fungsi 'tampilkan_tabel_angsuran(jadwal)'\n3. Jalankan fungsi utama 'main()' untuk menyatukan alur program.\nOutput: Modul kalkulator cicilan finansial terstandar.",
            'cheatsheet': "def hitung_angsuran(pokok, bunga_tahunan, tenor_bulan):\n    bunga_bulan = (bunga_tahunan / 100) / 12\n    return pokok * (bunga_bulan / (1 - (1 + bunga_bulan)**(-tenor_bulan)))",
            'capaian': "Siswa menguasai pembuatan modul fungsi keuangan dengan rumus matematis nyata.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'hs-3-8': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Financial Literacy: Konsep Cashflow (arus kas positif vs negatif), rasio likuiditas, dan pentingnya pembukuan rapi.",
            'project': "Analisis Studi Kasus UMKM: Mengevaluasi laporan keuangan toko kelontong digital dan mendiagnosis kebocoran dana operasional.",
            'cheatsheet': "Net Cashflow = Total Pemasukan - Total Pengeluaran\nJika Cashflow Negatif -> Potong pos keinginan / tingkatkan pemasukan",
            'capaian': "Siswa memahami indikator kesehatan finansial dan manajemen arus kas bisnis.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-4-1': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Try-Except & Debugging: Menangani runtime error (ValueError, ZeroDivisionError), blok try-except-else-finally.",
            'project': "Hands-on Error Handling: Membungkus konversi int(input()) dengan blok try-except ValueError agar aplikasi tidak crash.",
            'cheatsheet': "try:\n    nominal = float(input('Nominal: '))\nexcept ValueError:\n    print('Error: Masukkan angka yang valid!')",
            'capaian': "Siswa mampu mencegah program crash akibat kesalahan ketik input dari pengguna.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-4-2': {
            'type': "Proyek Mandiri Python",
            'konsep': "Safe Input with Error Handling: Membuat modul pembaca input uang yang kebal terhadap huruf, simbol aneh, dan angka negatif.",
            'project': "MINI PROJECT 04: Modul Pembaca Input Kebal Crash 🛡️\nTugas Siswa:\n1. Buat fungsi 'get_valid_amount(prompt)'\n2. Pasang loop while True dengan try-except\n3. Uji dengan memasukkan huruf 'abc', simbol '#$%', dan angka minus '-5000'\n4. Buktikan program terus meminta input ulang dengan ramah tanpa crash.\nOutput: Fungsi sanitasi input profesional siap pakai.",
            'cheatsheet': "def get_valid_amount(prompt):\n    while True:\n        try:\n            val = float(input(prompt))\n            if val > 0: return val\n            print('Nominal harus positif!')\n        except ValueError:\n            print('Masukkan format angka!')",
            'capaian': "Siswa mampu membuat fungsi pertahanan input (defensive programming) tingkat lanjut.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'hs-4-3': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Langkah Debugging Code: Membaca Traceback error Python, mendiagnosis letak baris penyebab bug, dan menggunakan print-debugging.",
            'project': "Latihan Membaca Traceback: Menganalisis 3 pesan error umum (NameError, TypeError, IndexError) dan memperbaikinya.",
            'cheatsheet': "Cara Membaca Traceback:\n1. Lihat baris terbawah untuk nama error\n2. Lihat baris kode file yang ditunjuk panah\n3. Periksa tipe variabel pada baris tersebut",
            'capaian': "Siswa percaya diri dalam membaca pesan error dan mampu memperbaiki bug secara mandiri.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-4-4': {
            'type': "Proyek Mandiri Python",
            'konsep': "Debugging Program Belanja: Mengidentifikasi dan memperbaiki 5 bug logika tersembunyi pada kode aplikasi kasir toko.",
            'project': "MINI PROJECT 06: Detektif Kode — Bug Hunter Kasir Toko 🔍\nTugas Siswa:\n1. Unduh kode kasir toko yang sengaja dirusak (mengandung bug diskon, bug kembalian minus, dan bug tipe data)\n2. Pasang print-debug dan perbaiki tiap kesalahan\n3. Pastikan program menghasilkan struk belanja yang 100% akurat.\nOutput: Kode kasir yang telah di-refactor bebas bug.",
            'cheatsheet': "Checklist Debugging:\n[ ] Cek tipe data tiap variabel\n[ ] Cek tanda operator matematika\n[ ] Cek kondisi percabangan batas minimum",
            'capaian': "Siswa memiliki insting investigasi bug kode yang tajam.",
            'status': "Siap (Framework Proyek & Penilaian)"
        },
        'hs-4-5': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Dictionary & List Transaksi: Menggabungkan struktur data List of Dictionaries untuk menyimpan riwayat transaksi lengkap dengan tanggal, kategori, dan nominal.",
            'project': "Hands-on Struktur Data: Membuat list 'buku_kas = []' dan menambahkan data transaksi baru menggunakan buku_kas.append({...}).",
            'cheatsheet': "buku_kas = []\nbuku_kas.append({'tgl': '08-09', 'pos': 'Makan', 'nominal': 20000})\nfor trx in buku_kas:\n    print(f\"{trx['tgl']} - {trx['pos']}: Rp {trx['nominal']:,}\")",
            'capaian': "Siswa menguasai manipulasi database memori terstruktur menggunakan List of Dictionaries.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-4-6': {
            'type': "Video Interaktif & Kuis",
            'konsep': "Analisis Data Keuangan dengan Python: Menghitung total pengeluaran per kategori (filter), mencari transaksi terbesar (max), dan rata-rata pengeluaran harian.",
            'project': "Latihan Agregasi Data: Menulis skrip analitik yang mengelompokkan total belanja berdasarkan kategori 'Makanan', 'Transport', dan 'Pendidikan'.",
            'cheatsheet': "kategori_total = {}\nfor trx in buku_kas:\n    k = trx['kategori']\n    kategori_total[k] = kategori_total.get(k, 0) + trx['nominal']",
            'capaian': "Siswa mampu menghasilkan wawasan analitik dari data transaksi terstruktur.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-5-1': {
            'type': "Video Interaktif & Konsep Capstone",
            'konsep': "Design Thinking & Kebutuhan Pengguna: Menentukan persona pengguna (pelajar/mahasiswa), memetakan pain points pencatatan uang manual, merumuskan fitur solusi.",
            'project': "Perancangan Persona Pengguna: Menyusun lembar profil calon pengguna aplikasi keuangan cerdas.",
            'cheatsheet': "Design Thinking Stage:\n1. Empathize: Rasakan kesulitan pengguna\n2. Define: Rumuskan problem statement\n3. Ideate: Rancang fitur solusi terbaik",
            'capaian': "Siswa mampu merancang solusi perangkat lunak yang berorientasi pada kebutuhan pengguna nyata.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-5-2': {
            'type': "Video Interaktif & Desain Sistem",
            'konsep': "Flowchart & Use Case: Merancang diagram alur program menyeluruh (Menu Utama, Catat Transaksi, Lihat Laporan, Rekomendasi Pintar, Ekspor Data).",
            'project': "Perancangan Diagram Sistem: Menggambar bagan alur eksekusi aplikasi Capstone sebelum implementasi kode.",
            'cheatsheet': "Diagram Menu Utama:\n1. Tambah Transaksi -> Validasi -> Simpan\n2. Lihat Buku Kas -> Format Tampilan\n3. Evaluasi Finansial -> Analitik Cerdas\n4. Keluar",
            'capaian': "Siswa mampu merencanakan arsitektur alur program kompleks secara terstruktur.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-5-3': {
            'type': "Video Interaktif & Logika Analitik",
            'konsep': "Menganalisis Data Transaksi: Mengolah riwayat transaksi untuk mendeteksi anomali overspending dan mengukur rasio kesehatan dompet digital.",
            'project': "Latihan Algoritma Deteksi: Menulis algoritma yang memberikan alert peringatan jika pengeluaran harian melampaui rata-rata 3 hari sebelumnya.",
            'cheatsheet': "if pengeluaran_hari_ini > (rata_rata * 1.5):\n    print('⚠️ Alert: Pengeluaran tidak wajar terdeteksi!')",
            'capaian': "Siswa mampu mengintegrasikan logika analitik prediktif ke dalam aplikasi kasir.",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-5-4': {
            'type': "Video Interaktif & Logika Rekomendasi",
            'konsep': "Logika Rekomendasi Pintar: Menghasilkan saran finansial otomatis yang dipersonalisasi berdasarkan perilaku belanja siswa.",
            'project': "Latihan Engine Rekomendasi: Menghasilkan rekomendasi 'Pangkas jajan kopi' jika pos hiburan melampaui 35% total budget.",
            'cheatsheet': "def rekomendasi_anggaran(rasio_wants):\n    if rasio_wants > 30:\n        return 'Kurangi pos belanja non-pokok minggu ini!'\n    return 'Anggaranmu dalam batas aman prima.'",
            'capaian': "Siswa mampu membangun aturan rekomendasi cerdas (Rule-based Expert System).",
            'status': "Siap (Video Terverifikasi & Kuis Aktif)"
        },
        'hs-5-5': {
            'type': "Final Capstone Project SMA",
            'konsep': "Final Project: Membangun Aplikasi Konsol 'Smart Personal Financial Advisor & Transaction Tracker' Berbasis Python secara Utuh.",
            'project': "FINAL CAPSTONE PROJECT SMA: Python Smart Financial Advisor 🏆\nTugas Siswa:\n1. Bangun aplikasi Python lengkap dalam 1 file notebook Colab terstruktur\n2. Terapkan modul input tahan crash (Try-Except), list of dicts database, modular functions, dan logika rekomendasi belanja\n3. Sediakan antarmuka terminal interaktif berbasis teks dengan menu navigasi yang elegan\n4. Jalankan pengujian menyeluruh dengan minimal 10 transaksi dummy\n5. Kumpulkan link Google Colab publik ke platform LMS.\nOutput: Sistem terminal penasihat keuangan pintar karya mandiri.",
            'cheatsheet': "Struktur Capstone Final:\n- Module 1: Input Validator & Sanitizer\n- Module 2: Transaction Database Engine\n- Module 3: Analytics & Reporting\n- Module 4: Smart Advisor Engine\n- Module 5: Interactive Terminal CLI Loop",
            'capaian': "Siswa berhasil menciptakan aplikasi perangkat lunak Python analitik finansial yang siap pakai dan layak dijadikan portofolio unggulan.",
            'status': "Siap (Framework Capstone Project)"
        }
    }

    hs_rows = []
    hs_num = 1
    for m in hs_data.get('modules', []):
        mod_id = m.get('id', '')
        mod_title = m.get('title', '')
        for s in m.get('steps', []):
            sid = s.get('id', '')
            stitle = s.get('title', '')
            stype = s.get('type', 'video')
            kicker = s.get('kicker', '') or s.get('duration', 'Orientasi')
            vid = s.get('videoId', '')
            
            if sid.startswith('bridge-'):
                bmeta = bridge_meta.get(sid, {})
                row = build_bridge_row(hs_num, mod_id, mod_title, sid, bmeta)
            else:
                media_link = f"https://youtu.be/{vid}" if vid else "-"
                cur = hs_curation.get(sid, {})
                learning_type = cur.get('type', "Video Interaktif & Kuis" if stype == 'video' else "Proyek Mandiri")
                konsep = cur.get('konsep', s.get('description', 'Materi konsep dan tutorial pemrograman Python.'))
                quiz_formatted = format_step_quizzes(s.get('quizzes', []))
                project_formatted = cur.get('project', "Praktik mandiri pemrograman di Google Colab.")
                cheatsheet = cur.get('cheatsheet', "Pelajari sintaks Python terkait dan jalankan di Colab.")
                capaian = cur.get('capaian', "Siswa menguasai kompetensi step ini dengan baik.")
                status = cur.get('status', "Siap (Terverifikasi)")
                row = [
                    hs_num, mod_id, mod_title, sid, stitle,
                    learning_type, kicker, media_link,
                    konsep, quiz_formatted, project_formatted, cheatsheet, capaian, status
                ]
            hs_rows.append(row)
            hs_num += 1

    # 4. CHANGELOG & AUDIT LOG ROWS (10 Executive Audit & Change Records)
    changelog_rows = [
        [
            1,
            "Audit Blocker (B1)",
            "bridge-ms-00.html & bridge-ms-00.json (SMP Modul 0)",
            "Residu TinyDB pada modul orientasi awal (virtualTinyDB, simpanTinyDB, bacaTinyDB, StoreValue/GetValue). TinyDB merupakan materi Modul 4 dan dilarang diperkenalkan di Modul 0 agar tidak membingungkan siswa.",
            "Menghapus seluruh fungsi dan referensi TinyDB dari HTML & JSON; digantikan dengan Web Storage (localStorage) standar murni untuk penyimpanan preferensi visual/audio tanpa memperkenalkan blok TinyDB prematur.",
            "❌ GAGAL (Tercemar komponen Storage Modul 4)",
            "✅ RESOLVED (100% Bersih dari Residu TinyDB)",
            "Gate 4 audit lolos 0 match regex TinyDB; pengujian simulasi berjalan mulus di browser."
        ],
        [
            2,
            "Audit Blocker (B2)",
            "hs-4-6, hs-5-1, ms-1-4, ms-3-1, hs-5-3, ms-4-4",
            "Anomali timestamp: bookmark video berada di luar batas durasi total (misal 12:00 saat video hanya 11:24) dan trigger kuis pop-up muncul di luar konteks segmen aktif.",
            "Melakukan audit detik demi detik dan normalisasi seluruh timestamp bookmark dan kuis pop-up agar presisi berada di dalam rentang durasi video aktif dan selaras dengan penjelasan materi.",
            "❌ ANOMALI (Bookmark & kuis out-of-bounds)",
            "✅ RESOLVED (100% Presisi & Terverifikasi)",
            "Gate 3 audit-verifikasi lolos 0 anomali batas detik video; kuis muncul tepat waktu."
        ],
        [
            3,
            "Audit Blocker (B3)",
            "bridge-hs-01.json, bridge-ms-01.json, & 8 Bridge JSON",
            "Inkonsistensi skema metadata: bridge-hs-01 dan bridge-ms-01 menggunakan skema lama tanpa array learningObjectives; kicker dan duration tidak seragam.",
            "Standardisasi seluruh 10 file metadata JSON bridge slides dengan skema kanonikal v1 (level, kicker, duration, learningObjectives, practice, completionCriteria, bookmarks, quizzes).",
            "❌ INKONSISTEN (Skema metadata berbeda)",
            "✅ RESOLVED (10/10 File Terstandar Penuh)",
            "Gate 5 & 6 lolos validasi skema JSON v1 100% tanpa ada field yang hilang."
        ],
        [
            4,
            "Audit Blocker (B4)",
            "scripts/verify_scaffolding.py",
            "Skrip validasi awal hanya memiliki 4 gate sederhana dan tidak mendeteksi anomali batas durasi video atau pencemaran konsep antar modul.",
            "Ekspansi skrip verifikasi otomatis menjadi 8-Gate Validator komprehensif (Integritas File, Prasyarat DAG, Batas Timestamp, Residu TinyDB, Skema Metadata, Kuis 100%, QA Visual).",
            "⚠️ PARSIAL (4 Gate Sederhana)",
            "✅ RESOLVED (8/8 Gates Passed, Zero Warning)",
            "Eksekusi verify_scaffolding.py menghasilkan exit code 0 tanpa error atau warning."
        ],
        [
            5,
            "Arsitektur Scaffolding",
            "hs-1-3 (Safe Transaction Input) -> Direlokasi ke Modul 4",
            "Siswa di Modul 1 dituntut membuat script terminal pencatatan transaksi sebelum mempelajari loops, functions, atau dictionaries, memicu cognitive overload.",
            "Merelokasi hs-1-3 ke Modul 4 (Keamanan Kode & Validasi) tepat setelah materi sanitasi input dan sebelum persiapan capstone Modul 5.",
            "⚠️ COGNITIVE OVERLOAD (Loncat Konsep)",
            "✅ RESOLVED (Alur Scaffolding Bertahap & Mulus)",
            "Struktur DAG kurikulum SMA lolos validasi dependensi prasyarat berurutan."
        ],
        [
            6,
            "Materi Jembatan (Bridge)",
            "10 Slide Bridge (bridge-ms-00..03 & bridge-hs-00..05)",
            "Kesenjangan pemahaman antara video tutorial konseptual dengan hands-on praktikum di MIT App Inventor dan Google Colab Python.",
            "Membangun 10 modul slide interaktif mandiri berstandar web modern (Glassmorphism, simulator interaktif, pop-up quiz, live testing guide).",
            "❌ BELUM ADA (Gap Pengetahuan Siswa)",
            "✅ IMPLEMENTED (10/10 Slide Lengkap & Live)",
            "10 slide terdeploy di GitHub Pages dan terintegrasi penuh ke platform LMS."
        ],
        [
            7,
            "Penjaminan Mutu Visual (QA)",
            "run_visual_qa.py & 20 Tangkapan Layar QA",
            "Memastikan seluruh slide interaktif bebas dari runtime JavaScript error dan tampilan responsif di desktop maupun smartphone.",
            "Automasi pengujian browser nyata (Playwright) di viewport Desktop (1440x900) dan Mobile (375x812) dengan audit console log otomatis.",
            "⚠️ BELUM DIUJI (Potensi Layout Overflow)",
            "✅ VERIFIED (20/20 Lolos, 0 Console Error)",
            "Tersimpan 20 tangkapan layar verifikasi di drafts/qa/screenshots/."
        ],
        [
            8,
            "Integritas & Sinkronisasi File",
            "sync_to_production.py & 3 Direktori Repositori",
            "Risiko ketidakcocokan versi dataset dan slide antara modul perancangan kurikulum, aplikasi LMS, dan web publik.",
            "Otomasi sinkronisasi file terpusat dengan verifikasi hash SHA256 identik antara Subproject 02, Subproject 01, dan docs/.",
            "⚠️ DESINKRONISASI (File Tersebar Manual)",
            "✅ SYNCHRONIZED (Hash SHA256 100% Identik)",
            "Skrip audit SHA256 mengonfirmasi kecocokan hash 100% di semua direktori produksi."
        ],
        [
            9,
            "Sistem Rekapitulasi & Penilaian",
            "ops-result-sd, ops-result-smp, ops-result-sma & Code.gs",
            "Tab penilaian di spreadsheet belum memuat kolom untuk 4 bridge SMP dan 6 bridge SMA, serta perlu sistem grade 0-100 transparan.",
            "Menyesuaikan header pelacakan nilai menjadi 8 step SD, 36 step SMP, dan 36 step SMA; mencatat skor kuis individual dan total nilai konversi 100.",
            "⚠️ INKOMPLIT (Belum ada kolom materi bridge)",
            "✅ UPDATED (Lengkap 8 SD, 36 SMP, 36 SMA)",
            "Fungsi setupResultTrackingSheets() di Apps Script berhasil di-deploy."
        ],
        [
            10,
            "Publikasi Master Spreadsheet",
            "Master Spreadsheet (ID: 1s6VVCGLPwiGWYwBNiR-4lrnB5XWcOV0l7pAIcgyif-k)",
            "Menyajikan seluruh detail kurikulum multi-jenjang, pemetaan kuis/proyek, dan catatan audit perubahan secara transparan untuk stakeholder.",
            "Mengunggah data v3 ke tab materi-sd, materi-smp, materi-sma, tab ops-result, dan tab baru Changelog & Audit Log.",
            "⚠️ OUTDATED (Belum mencerminkan hasil audit)",
            "✅ LIVE & SYNCHRONIZED (Single Source of Truth)",
            "Eksekusi otomatis via Apps Script & verifikasi visual tangkapan layar."
        ]
    ]

    payload = {
        'sd': sd_rows,
        'smp': ms_rows,
        'sma': hs_rows,
        'changelog': changelog_rows
    }

    out_file = "subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v3.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"✅ Payload v3 successfully generated!")
    print(f"   - SD: {len(sd_rows)} steps")
    print(f"   - SMP: {len(ms_rows)} steps")
    print(f"   - SMA: {len(hs_rows)} steps")
    print(f"   - Changelog: {len(changelog_rows)} records")
    print(f"   - Saved to: {out_file}")

if __name__ == '__main__':
    build_curriculum_dataset_v3()
