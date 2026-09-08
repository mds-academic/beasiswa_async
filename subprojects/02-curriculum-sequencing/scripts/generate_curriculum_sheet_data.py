import json
import re

def clean_html(text):
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def build_curriculum_dataset():
    base_path = "projects/uob-async-lms/subprojects/01-lms-platform/src/data"
    
    # 1. SD (Upper Primary)
    sd_file = f"{base_path}/courseData-upperprimary.json"
    with open(sd_file, 'r', encoding='utf-8') as f:
        sd_data = json.load(f)
        
    sd_rows = []
    num = 1
    for m in sd_data.get('modules', []):
        mod_id = m.get('id', '')
        mod_title = m.get('title', '')
        for s in m.get('steps', []):
            sid = s.get('id', '')
            title = s.get('title', '')
            stype = s.get('type', 'video')
            kicker = s.get('kicker', '') or s.get('duration', 'Orientasi')
            vid = s.get('videoId', '')
            media_link = f"https://youtu.be/{vid}" if vid else ""
            
            # Rich concepts
            if sid == 'up-0-0':
                learning_type = "Video Interaktif & Orientasi"
                konsep = "Orientasi Pembelajaran Mandiri (Async Learning), ritme belajar personal, cara kerja pop-up quiz interaktif, panduan mandiri & bantuan fasilitator."
                cheatsheet = "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri"
                capaian = "Siswa memahami alur belajar mandiri di platform UOB My Digital Space dan siap mengikuti modul coding visual."
                status = "Siap (Wadah & Video Orientasi)"
            elif sid == 'up-1-1':
                learning_type = "Video Interaktif & Animasi Konsep"
                konsep = "Pengenalan Data di sekitar kita, membedakan Kebutuhan Primer (Needs) vs Keinginan (Wants), pentingnya prioritas belanja."
                cheatsheet = "Needs: Kebutuhan penting (makanan, sekolah, kesehatan)\nWants: Keinginan tambahan (mainan mahal, jajan berlebih)"
                capaian = "Siswa mampu mengelompokkan barang belanja ke kategori Needs vs Wants dengan tepat."
                status = "Draft Rancangan (Curriculum Sequencing)"
            elif sid == 'up-1-2':
                learning_type = "Proyek Mandiri Scratch"
                konsep = "Pengenalan Sprite & Backdrop Scratch, event 'When Green Flag Clicked', memindahkan sprite ke keranjang yang sesuai."
                cheatsheet = "Blok Event: when green flag clicked\nBlok Motion: go to x:.. y:..\nBlok Sensing: touching mouse-pointer?"
                capaian = "Siswa menghasilkan game interaktif pemilahan kebutuhan belanja sederhana di Scratch."
                status = "Draft Rancangan (Framework Siap)"
            elif sid == 'up-2-1':
                learning_type = "Video Interaktif & Konsep Coding"
                konsep = "Konsep Variabel sebagai kotak penyimpan nilai, membuat variabel 'Saldo_Celengan', inisialisasi nilai awal (set to 0)."
                cheatsheet = "Blok Variables:\n- set [Saldo] to [0]\n- change [Saldo] by [1000]"
                capaian = "Siswa mengerti fungsi variabel untuk menyimpan dan memperbarui data angka secara dinamis."
                status = "Draft Rancangan (Curriculum Sequencing)"
            elif sid == 'up-2-2':
                learning_type = "Proyek Mandiri Scratch"
                konsep = "Membuat tombol pecahan koin/uang (1.000, 2.000, 5.000), event 'when this sprite clicked', menambah isi celengan digital."
                cheatsheet = "when this sprite clicked\nchange [Saldo] by [2000]\nsay (join [Total tabungan: Rp ] [Saldo])"
                capaian = "Siswa berhasil membuat proyek simulasi celengan digital interaktif dengan Scratch."
                status = "Draft Rancangan (Framework Siap)"
            elif sid == 'up-3-1':
                learning_type = "Video Interaktif & Logika Pemrograman"
                konsep = "Logika Percabangan (If-Then), operator perbandingan (> dan <), mengecek apakah saldo cukup sebelum membeli barang."
                cheatsheet = "if < [Saldo] > [Harga] > then\n  say [Uang cukup! Silakan beli]\nelse\n  say [Tabung lagi ya!]"
                capaian = "Siswa memahami bagaimana komputer mengambil keputusan cerdas berdasarkan kondisi angka."
                status = "Draft Rancangan (Curriculum Sequencing)"
            elif sid == 'up-3-2':
                learning_type = "Proyek Mandiri Scratch"
                konsep = "Penerapan blok 'If-Then-Else', interaksi pembeli dan kasir, pengurangan otomatis saldo jika pembelian disetujui."
                cheatsheet = "change [Saldo] by (0 - [Harga])\nbroadcast [transaksi_sukses]"
                capaian = "Siswa membangun sistem simulasi kasir cerdas yang menolak pembelian jika saldo tidak cukup."
                status = "Draft Rancangan (Framework Siap)"
            elif sid == 'up-4-1':
                learning_type = "Capstone Project Akhir"
                konsep = "Integrasi Sprite, Variabel Skor/Saldo, Broadcast Message, Timer Game, dan Kuis Cerdas Finansial."
                cheatsheet = "Gabungan Modul 1-3:\n- Variabel Skor & Saldo\n- Logika If-Then evaluasi jawaban\n- Sound efek & pesan reward"
                capaian = "Siswa menghasilkan Game Kuis Edukasi Finansial lengkap yang dapat dimainkan teman dan keluarga."
                status = "Draft Rancangan (Framework Siap)"
            else:
                learning_type = "Video Interaktif"
                konsep = title
                cheatsheet = "Scratch Visual Blocks"
                capaian = "Siswa menguasai modul dasar Scratch."
                status = "Draft Rancangan"

            sd_rows.append([
                num, mod_id, mod_title, sid, title, learning_type, kicker, media_link, konsep, cheatsheet, capaian, status
            ])
            num += 1

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
                
            # Detailed descriptions
            if sid == 'ms-0-0':
                learning_type = "Slide Interaktif & Video Orientasi"
                konsep = "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, cheat sheet, dan panduan fasilitas belajar."
                cheatsheet = "1. Tonton video step-by-step\n2. Jawab pop-up kuis saat muncul\n3. Buka rangkuman & coba latihan mandiri"
                capaian = "Siswa memahami aturan dan ritme pembelajaran mandiri serta siap menggunakan platform LMS."
                status = "Siap (Wadah & Slide Live)"
            elif sid == 'ms-0-1':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Panduan Sign In ke MIT App Inventor (ai2.appinventor.mit.edu), autentikasi akun Google, menyetujui izin Terms of Service."
                cheatsheet = "1. Buka ai2.appinventor.mit.edu\n2. Klik 'Create Apps!'\n3. Login dengan akun Google\n4. Klik 'Continue' melewati welcome dialog"
                capaian = "Siswa berhasil login dan membuka workspace proyek perdana di MIT App Inventor."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-0-2':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Eksplorasi antarmuka MIT App Inventor: Menu Bar, Project List, tombol Switcher Designer View vs Blocks Editor, panel Properties."
                cheatsheet = "- Designer View: Merancang tampilan visual aplikasi\n- Blocks Editor: Menyusun logika & perilaku tombol\n- Projects > Start new project"
                capaian = "Siswa mengenali fungsi navigasi utama di App Inventor dan memahami perbedaan Designer vs Blocks."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-0-3':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Mengenal Palette dan Komponen UI: Menarik Button, Label, TextBox, Image dari Palette ke Viewer, mengatur Text & Background."
                cheatsheet = "- Palette: Gudang komponen (User Interface, Layout, Storage)\n- Viewer: Layar simulasi HP\n- Components: Daftar hierarki elemen"
                capaian = "Siswa mampu menyusun komponen User Interface dasar di layar Viewer dan mengubah properti teks."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-0-4':
                learning_type = "Video Tutorial Resmi (Kak Laras)"
                konsep = "Live Testing dengan MIT AI2 Companion: Mengunduh aplikasi di HP Android/iOS, menghubungkan via scan QR Code / 6-digit code, live reload."
                cheatsheet = "- Connect > AI Companion\n- Buka aplikasi MIT AI2 Companion di HP\n- Scan QR code atau ketik 6 karakter kode"
                capaian = "Siswa berhasil menjalankan dan menguji aplikasi secara langsung di layar smartphone fisik."
                status = "Siap (Video Tutorial Kak Laras)"
            elif sid == 'ms-1-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Input Aman & Validasi Form: Event handling Button.Click, membaca teks TextBox, logika pengecekan form kosong (is empty string)."
                cheatsheet = "when Button1.Click do\n  if is empty TextBox1.Text then\n    set LabelStatus.Text to 'Mohon isi data!'"
                capaian = "Siswa dapat memvalidasi form agar aplikasi tidak error saat pengguna belum memasukkan teks."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-2':
                learning_type = "Proyek Mandiri Form Aman"
                konsep = "Membuat antarmuka input nomor & nama dengan tombol validasi dan label feedback visual berwarna hijau/merah."
                cheatsheet = "Desain: TextBox (Nama), TextBox (Nomor), Button (Kirim), Label (Pesan Error)\nBlok: Validasi panjang karakter & jenis angka."
                capaian = "Siswa menghasilkan antarmuka form aman pertama di MIT App Inventor."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-1-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Flowchart & Alur Logika Data: Simbol terminator (Mulai/Selesai), proses (Persegi panjang), keputusan (Belah ketupat), input/output (Jajar genjang)."
                cheatsheet = "Mulai -> Input Data -> Apakah Data Valid? [Ya -> Proses -> Simpan / Tidak -> Tampilkan Error] -> Selesai"
                capaian = "Siswa mampu merancang alur algoritma aplikasi ke dalam bentuk flowchart standar sebelum membuat kode blok."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Data & Privacy App: Etika perlindungan data pribadi, prinsip kerahasiaan password dan PIN, masking karakter dengan tanda bintang (*)."
                cheatsheet = "Properti TextBox:\n- Set 'NumbersOnly' = true untuk input nominal uang\n- Masking data sensitif"
                capaian = "Siswa menyadari pentingnya privasi data dan menerapkan pembatasan input yang aman pada aplikasi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-5':
                learning_type = "Proyek Mandiri Cek Pesan Aman"
                konsep = "Membangun aplikasi pendeteksi pesan phishing/tautan mencurigakan menggunakan percabangan kata kunci sensitif."
                cheatsheet = "if contains text (TextBoxPesan.Text) piece ('minta password') then\n  set LabelWarning.Text to 'WASPADA PHISHING!'"
                capaian = "Siswa menghasilkan aplikasi pendeteksi pesan penipuan digital interaktif."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-1-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Eksplorasi Data Pribadi: Menelaah jenis data publik (nama display) vs data rahasia (NIK, password, OTP, data perbankan)."
                cheatsheet = "Prinsip Keamanan:\nJangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun, termasuk pihak yang mengaku staf/admin."
                capaian = "Siswa memiliki literasi digital yang kuat mengenai perlindungan identitas pribadi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-1-7':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Etika dan Tanggung Jawab Digital: Menghormati hak cipta konten, tidak membuat aplikasi berbahaya (spam/malware), etika programmer."
                cheatsheet = "Tanggung Jawab Kreator Digital:\n1. Transparan penggunaan izin aplikasi\n2. Menjaga data pengguna\n3. Bermanfaat untuk masyarakat"
                capaian = "Siswa menginternalisasi norma etika pengembangan software yang bertanggung jawab."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Percabangan Ganda di Dunia Nyata: Logika pengambilan keputusan dengan multi-syarat (kondisi A, kondisi B, atau kondisi default)."
                cheatsheet = "Jika hujan -> Bawa payung\nJika mendung -> Siapkan jas hujan\nSelain itu -> Tidak perlu payung"
                capaian = "Siswa mampu memodelkan keputusan dunia nyata ke dalam struktur logika percabangan bersyarat."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "App Inventor: Percabangan Blok If-Else. Menggunakan mutator roda gigi biru untuk menambah 'else if' dan 'else'."
                cheatsheet = "Blok Control:\nif [syarat] then [...]\nelse if [syarat2] then [...]\nelse [...]"
                capaian = "Siswa menguasai penggunaan blok If-Else bertingkat di App Inventor."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Literasi Keuangan: Uang Digital vs Fisik, cara kerja dompet digital (e-wallet), QRIS, dan pencatatan transaksi non-tunai."
                cheatsheet = "Kelebihan Uang Digital: Praktis, tercatat otomatis, nirsentuh.\nRisiko: Rentan impulsif & pencurian akun bila password lemah."
                capaian = "Siswa memahami mekanisme transaksi finansial modern dan risikonya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Literasi Keuangan: Skala Prioritas Belanja — Kebutuhan Utama vs Keinginan Hiburan, aturan alokasi 50/30/20."
                cheatsheet = "Kebutuhan (Needs) didahulukan 50%\nKeinginan (Wants) dibatasi maksimal 30%\nTabungan & Investasi 20%"
                capaian = "Siswa mampu membuat keputusan finansial yang bijak dan mengelompokkan pos pengeluaran."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Aplikasi Kalkulator Keuangan: Mengintegrasikan komponen input nominal, blok perkalian/pembagian persentase, dan label alokasi."
                cheatsheet = "set LabelKebutuhan.Text to (TextBoxUang.Text * 0.5)\nset LabelTabungan.Text to (TextBoxUang.Text * 0.2)"
                capaian = "Siswa membangun kalkulator alokasi anggaran otomatis berbasis rumus finansial."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-2-6':
                learning_type = "Proyek Mandiri Final Percabangan"
                konsep = "Membangun aplikasi simulator penasihat belanja: Memberi saran 'Boleh Beli' atau 'Tunda Dulu' berdasarkan saldo saat ini."
                cheatsheet = "if (Saldo - HargaBarang) < 50000 then\n  set LabelSaran.Text to 'Tunda! Saldo tabunganmu hampir habis.'\nelse\n  set LabelSaran.Text to 'Aman dibeli!'"
                capaian = "Siswa menghasilkan aplikasi asisten belanja cerdas dengan validasi multi-kondisi."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-3-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Membuat & Memanggil Procedures: Blok 'to procedure do' (tanpa kembalian) dan 'to procedure result' (mengembalikan nilai), parameter."
                cheatsheet = "to hitungDiskon (harga, persen) do\n  result: harga - (harga * persen / 100)\ncall hitungDiskon(100000, 10)"
                capaian = "Siswa memahami cara kerja prosedur/fungsi untuk membagi kode program menjadi modul-modul efisien."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-3-2':
                learning_type = "Proyek Mandiri Kalkulator"
                konsep = "Mini Project Kalkulator Modular: Menerapkan prosedur hitungTambah, hitungKurang, hitungKali, dan resetForm."
                cheatsheet = "Prosedur 'bersihkanLayar':\nset TextBox1.Text to ''\nset TextBox2.Text to ''\nset LabelHasil.Text to '0'"
                capaian = "Siswa membuat kalkulator modular tanpa duplikasi kode blok."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-3-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Optimasi dan Modularisasi Kode: Prinsip DRY (Don't Repeat Yourself), meningkatkan keterbacaan kode blok."
                cheatsheet = "Jangan copy-paste blok yang sama berulang kali; bungkus ke dalam satu Prosedur dan panggil namanya!"
                capaian = "Siswa mampu menyederhanakan kode blok yang rumit menjadi bersih dan mudah dipelihara."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-3-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Uji Coba & Debugging: Menggunakan fitur 'Do It' di Blocks Editor untuk menginspeksi nilai variabel secara instan, melacak bug."
                cheatsheet = "Klik kanan blok kode > pilih 'Do It' untuk melihat nilai keluaran blok secara langsung di layar monitor."
                capaian = "Siswa menguasai teknik debugging profesional di MIT App Inventor."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-3-5':
                learning_type = "Video Interaktif & Refleksi"
                konsep = "Presentasi & Refleksi: Mengevaluasi arsitektur blok, kenyamanan antarmuka pengguna (UI/UX), dan dokumentasi kode."
                cheatsheet = "Kriteria Desain Aplikasi yang Baik:\n1. Tampilan bersih dan rapi\n2. Tombol mudah ditekan\n3. Tidak ada error/crash saat input salah"
                capaian = "Siswa mampu melakukan review kritis terhadap aplikasi ciptaannya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Penyimpanan Data Lokal dengan TinyDB: Konsep database lokal, komponen non-visible TinyDB, pasangan Tag (kunci) & Value (nilai)."
                cheatsheet = "call TinyDB1.StoreValue tag 'saldo' valueToStore 50000\ncall TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0"
                capaian = "Siswa memahami cara menyimpan data agar tidak terhapus ketika aplikasi ditutup atau HP di-restart."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Mengelola Data Aman di TinyDB: Pencegahan error data hilang dengan memberikan nilai default (valueIfTagNotThere), update nilai."
                cheatsheet = "Tag unik: Gunakan tag deskriptif ('user_name', 'total_saldo', 'riwayat_catatan')"
                capaian = "Siswa mampu membaca dan memperbarui data persisten secara stabil."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-3':
                learning_type = "Proyek Mandiri TinyDB"
                konsep = "Mini Project Celengan Persisten: Membuat aplikasi pencatat tabungan yang menyimpan saldo ke TinyDB setiap kali koin ditambahkan."
                cheatsheet = "when Screen1.Initialize do\n  set global Saldo to (call TinyDB1.GetValue tag 'saldo' valueIfTagNotThere 0)\n  set LabelSaldo.Text to get global Saldo"
                capaian = "Siswa menghasilkan aplikasi tabungan dengan penyimpanan data persisten lokal yang andal."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-4-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Menganalisis Data Finansial: Mengolah data transaksi yang tersimpan di TinyDB untuk menghitung total pengeluaran mingguan."
                cheatsheet = "Menggunakan list blok di App Inventor untuk mengiterasi daftar belanjaan dan menghitung total."
                capaian = "Siswa mampu melakukan kalkulasi analitik sederhana atas data tersimpan."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-4-5':
                learning_type = "Proyek Mandiri Kas Mini"
                konsep = "Mini Project Pengelolaan Kas Mini: Menggabungkan form transaksi, validasi input, prosedur hitung saldo, dan TinyDB."
                cheatsheet = "Aplikasi Kas:\n- Form Masuk/Keluar\n- Validasi saldo tidak minus\n- Auto-save ke TinyDB\n- Reset tombol"
                capaian = "Siswa membuat aplikasi buku kas keuangan mini lengkap berbasis mobile."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-4-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Keamanan Transaksi Digital: Bahaya malware pembaca penyimpanan lokal, prinsip keamanan penyimpanan offline vs cloud."
                cheatsheet = "Penting: Jangan pernah menyimpan kata sandi polos (plain-text password) di dalam database lokal tanpa pengamanan."
                capaian = "Siswa memahami risiko keamanan data pada penyimpanan mobile lokal."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-5-1':
                learning_type = "Video Interaktif & Panduan Desain"
                konsep = "Merancang Solusi Digital: Tahap Design Thinking, menentukan persona pengguna, mendefinisikan fitur utama aplikasi solusi."
                cheatsheet = "Tahap Desain:\n1. Empathize: Temukan masalah keuangan sekitar\n2. Define: Pilih 1 masalah utama\n3. Ideate: Rancang fitur aplikasi"
                capaian = "Siswa mampu menyusun konsep arsitektur proyek akhir yang terarah dan solutif."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'ms-5-2':
                learning_type = "Proyek Mandiri Wireframing"
                konsep = "Penyusunan Mockup & Wireframe: Mengatur tata letak antarmuka di Designer View dengan Vertical & Horizontal Arrangement."
                cheatsheet = "Gunakan HorizontalArrangement untuk tombol berdampingan, VerticalArrangement untuk form input bertumpuk."
                capaian = "Siswa menghasilkan tata letak antarmuka aplikasi akhir yang rapi dan responsif."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-5-3':
                learning_type = "Proyek Akhir Capstone"
                konsep = "Final Project Capstone: Implementasi menyeluruh mengintegrasikan validasi form, multi-screen, prosedur modular, dan TinyDB."
                cheatsheet = "Komponen Wajib Proyek Akhir:\n- Minimal 2 Layar / Screen\n- Form Input + Validasi\n- 2 Procedure\n- TinyDB Storage"
                capaian = "Siswa menyelesaikan satu aplikasi mobile edukasi finansial utuh yang siap pakai."
                status = "Siap (Framework Proyek)"
            elif sid == 'ms-5-4':
                learning_type = "Video Panduan & Publikasi Gallery"
                konsep = "Mempublikasikan Final Project ke MIT App Inventor Gallery, membuat link portfolio publik, dan mengekspor file APK/AIA."
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
                num, mod_id, mod_title, sid, title, learning_type, kicker, media_link, konsep, cheatsheet, capaian, status
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
                
            # Detailed descriptions
            if sid == 'hs-0-0':
                learning_type = "Slide Interaktif & Video Orientasi"
                konsep = "Orientasi Pembelajaran Mandiri (Async), ritme belajar mandiri, pop-up kuis, & Slide Jembatan Google Colab: membuat notebook, sel kode, tombol run, dan output."
                cheatsheet = "Google Colab:\n- Shift + Enter: Jalankan cell & pindah ke cell berikutnya\n- Ctrl + Enter: Jalankan cell di tempat\n- print('Halo Dunia')"
                capaian = "Siswa memahami alur belajar dan mampu membuat serta menjalankan kode Python pertama di Google Colab."
                status = "Siap (Wadah & Slide Live)"
            elif sid == 'hs-1-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Input Pengguna, Masalah Tipe Data, dan Sanitasi: Fungsi input() selalu menghasilkan string, type casting int() dan float(), sanitasi teks .strip() dan .lower()."
                cheatsheet = "nama = input('Nama: ').strip()\numur = int(input('Umur: '))\nsaldo = float(input('Saldo: '))"
                capaian = "Siswa memahami perbedaan tipe data teks dan angka serta cara mengonversi input pengguna dengan aman."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-1-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Sanitasi & Validasi Input Keuangan: Memeriksa nilai tidak boleh negatif, mencegah input kosong, dan validasi jenis transaksi (debit/kredit)."
                cheatsheet = "if nominal <= 0:\n    print('Nominal harus lebih dari 0!')\nelse:\n    saldo += nominal"
                capaian = "Siswa mampu menulis logika pemeriksaan awal untuk mencegah data input tidak valid masuk ke sistem."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-1-3':
                learning_type = "Proyek Mandiri Python"
                konsep = "Safe Transaction Input: Membangun terminal input pencatatan saldo yang memvalidasi tipe data dan batas nominal minimum."
                cheatsheet = "def catat_transaksi():\n    raw = input('Nominal: ').strip()\n    # validasi angka & simpan"
                capaian = "Siswa menghasilkan script Python input transaksi yang tahan terhadap kesalahan pengetikan pengguna."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-2-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Bagaimana Program Bisa Memilih? Logika boolean True dan False, operator perbandingan (==, !=, <, >, <=, >=)."
                cheatsheet = "5 > 3  # True\n10 == 20 # False\n'apel' != 'jeruk' # True"
                capaian = "Siswa memahami ekspresi logika perbandingan sebagai penentu arah eksekusi program."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Menulis Conditional di Python: Sintaks if dan else, aturan indentasi 4 spasi (PEP 8), blok eksekusi bersyarat."
                cheatsheet = "if saldo >= harga:\n    print('Transaksi disetujui')\nelse:\n    print('Saldo tidak mencukupi')"
                capaian = "Siswa mampu menulis pernyataan if-else dengan indentasi yang benar di Python."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Multi Branch Conditionals: Menangani lebih dari dua alternatif menggunakan pernyataan 'elif', urutan evaluasi kondisi."
                cheatsheet = "if skor >= 85:\n    grade = 'A'\nelif skor >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'"
                capaian = "Siswa mampu merancang logika percabangan multi-kondisi yang efisien."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-4':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Nested Conditionals: Percabangan bersarang (if di dalam if) untuk validasi bertingkat (misal: cek status akun lalu cek saldo)."
                cheatsheet = "if akun_aktif:\n    if saldo >= nominal:\n        proses_tarik_tunai()\n    else:\n        print('Saldo kurang')\nelse:\n    print('Akun dibekukan')"
                capaian = "Siswa dapat menyusun validasi keamanan bertingkat menggunakan percabangan bersarang."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Logical Operator: Menggabungkan kondisi logika majemuk menggunakan operator 'and', 'or', dan 'not'."
                cheatsheet = "if usia >= 17 and punya_ktp:\n    buka_rekening()\nif status == 'VIP' or belanja > 500000:\n    beri_diskon()"
                capaian = "Siswa mampu menyederhanakan kode bertingkat dengan menggabungkan syarat menggunakan operator logika."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Needs vs Wants & Risks: Menganalisis risiko finansial (bunga pinjaman, denda, overbudget) dan klasifikasi kebutuhan belanja."
                cheatsheet = "Dana Darurat = Minimal 3x pengeluaran bulanan\nPrioritas 1: Kebutuhan pokok & cicilan utang\nPrioritas 2: Tabungan\nPrioritas 3: Hiburan"
                capaian = "Siswa memiliki wawasan literasi finansial analitis mengenai mitigasi risiko pengeluaran."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-2-7':
                learning_type = "Proyek Mandiri Python"
                konsep = "Smart Budget & Risk Planner: Program konsol Python yang mengevaluasi pos anggaran bulanan dan memberikan skor kesehatan keuangan."
                cheatsheet = "Kalkulasi rasio tabungan = (total_tabungan / total_pemasukan) * 100\nEvaluasi skor: Sehat (>= 20%), Waspada (10-19%), Bahaya (< 10%)"
                capaian = "Siswa menghasilkan aplikasi penilai kesehatan anggaran pribadi berbasis percabangan logika."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-3-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Pengantar Algoritma & Loop: Konsep automasi tugas repetitif, sintaks perulangan 'for item in sequence', fungsi range(n)."
                cheatsheet = "for i in range(5):\n    print(f'Iterasi ke-{i}')"
                capaian = "Siswa memahami cara kerja loop for untuk mengulang instruksi tanpa menulis kode berulang kali."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-2':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Optimasi Loop & Step Count: Mengatur parameter range(start, stop, step), variabel akumulator untuk menjumlahkan saldo berkala."
                cheatsheet = "total_saldo = 0\nfor nominal in daftar_setoran:\n    total_saldo += nominal"
                capaian = "Siswa mampu mengontrol jalannya iterasi loop dan menghitung akumulasi nilai secara bertahap."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Optimasi Program Python: Perulangan 'while condition', kondisi terminasi, penggunaan keyword 'break' dan 'continue'."
                cheatsheet = "while True:\n    perintah = input('Perintah: ')\n    if perintah == 'exit':\n        break"
                capaian = "Siswa menguasai penggunaan perulangan while untuk program interaktif berbasis menu."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-4':
                learning_type = "Proyek Mandiri Python"
                konsep = "Mini Project Optimasi Loop: Membuat kalkulator simulasi target tabungan (menghitung berapa bulan target tercapai)."
                cheatsheet = "bulan = 0\nwhile saldo < target:\n    saldo += setoran_bulanan\n    bulan += 1"
                capaian = "Siswa membangun program simulasi target finansial dengan perulangan otomatis."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-3-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Functions in Python: Mendefinisikan fungsi sendiri dengan keyword 'def', parameter dan argumen, keyword 'return' vs print()."
                cheatsheet = "def hitung_pajak(penghasilan):\n    return penghasilan * 0.05\n\npajak_saya = hitung_pajak(10000000)"
                capaian = "Siswa memahami konsep fungsi modular yang dapat menerima input dan mengembalikan nilai hasil komputasi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Modular Design in Python: Memecah program menjadi fungsi-fungsi kecil yang independen (Single Responsibility Principle)."
                cheatsheet = "def input_data(): ...\ndef validasi_data(): ...\ndef simpan_data(): ...\ndef tampilkan_laporan(): ..."
                capaian = "Siswa mampu merancang arsitektur kode yang bersih, mudah dibaca, dan mudah di-test."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-3-7':
                learning_type = "Proyek Mandiri Python"
                konsep = "Mini Project Modular: Membangun sistem kasir modular dengan fungsi terpisah untuk hitung_subtotal, hitung_diskon, dan cetak_struk."
                cheatsheet = "def hitung_diskon(total):\n    return total * 0.1 if total >= 100000 else 0"
                capaian = "Siswa menghasilkan script kasir modular dengan pembagian fungsi yang rapi."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-3-8':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Financial Literacy: Bunga Tunggal vs Bunga Majemuk (Compound Interest), implementasi rumus eksponensial di Python."
                cheatsheet = "Bunga Tunggal: A = P * (1 + r * t)\nBunga Majemuk: A = P * ((1 + r) ** t)"
                capaian = "Siswa memahami dampak eksponensial bunga majemuk dalam investasi jangka panjang melalui simulasi Python."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-1':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Try-Except dan Debugging: Menangani runtime error dengan blok try-except, menangkap ValueError saat konversi angka."
                cheatsheet = "try:\n    nominal = float(input('Nominal: '))\nexcept ValueError:\n    print('Harap masukkan angka yang valid!')"
                capaian = "Siswa mampu mencegah program berhenti tiba-tiba (crash) akibat input tidak terduga dari pengguna."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-2':
                learning_type = "Proyek Mandiri Python"
                konsep = "Safe Input with Error Handling: Membuat fungsi helper get_valid_float(prompt) yang meminta input berulang hingga valid."
                cheatsheet = "def get_valid_float(prompt):\n    while True:\n        try:\n            return float(input(prompt))\n        except ValueError:\n            print('Input salah, ulangi lagi.')"
                capaian = "Siswa menghasilkan fungsi pembaca angka yang 100% anti-crash."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-4-3':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Langkah Debugging Code: Membaca error traceback di Python, mengidentifikasi nomor baris error, teknik print debugging."
                cheatsheet = "Traceback (most recent call last):\n  File 'app.py', line 12, in <module>\n    saldo += uang\nTypeError: unsupported operand type(s) for +=: 'float' and 'str'"
                capaian = "Siswa memiliki kemampuan membaca pesan error Python dan menemukan sumber bug secara mandiri."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-4':
                learning_type = "Proyek Mandiri Debugging"
                konsep = "Debugging Program Belanja: Mengidentifikasi dan memperbaiki 5 bug tersembunyi (SyntaxError, TypeError, ZeroDivisionError)."
                cheatsheet = "Misi: Periksa tipe data variabel, perbaiki indentasi, dan tambahkan try-except pada pembagian diskon."
                capaian = "Siswa membuktikan keahlian problem-solving dengan mereparasi kode program yang rusak."
                status = "Siap (Framework Proyek)"
            elif sid == 'hs-4-5':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Dictionary dan List Transaksi: Struktur data key-value pair, membuat record transaksi {'tanggal', 'kategori', 'nominal'}, list of dicts."
                cheatsheet = "transaksi = {'kategori': 'Makanan', 'nominal': 25000}\nriwayat = []\nriwayat.append(transaksi)"
                capaian = "Siswa menguasai penyimpanan dan manipulasi struktur data majemuk (list of dictionaries) di Python."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-4-6':
                learning_type = "Video Interaktif & Kuis"
                konsep = "Analisis Data Keuangan: Menghitung total pengeluaran dengan sum(), mencari transaksi terbesar max() dan terkecil min()."
                cheatsheet = "total = sum(t['nominal'] for t in riwayat)\npengeluaran_terbesar = max(t['nominal'] for t in riwayat)"
                capaian = "Siswa mampu mengekstrak insight analitik keuangan dari koleksi data transaksi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-1':
                learning_type = "Video Interaktif & Perancangan"
                konsep = "Design Thinking & Kebutuhan Pengguna: Memetakan problem statement manajemen keuangan siswa SMA dan merumuskan solusi."
                cheatsheet = "User Persona: Pelajar SMA dengan uang saku terbatas yang sering kehabisan uang sebelum akhir bulan."
                capaian = "Siswa mampu merumuskan spesifikasi kebutuhan fungsional aplikasi keuangan terintegrasi."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-2':
                learning_type = "Video Interaktif & Desain Sistem"
                konsep = "Flowchart & Use Case: Diagram arsitektur menu utama aplikasi (Tambah Transaksi, Lihat Laporan, Analisis Anggaran, Keluar)."
                cheatsheet = "Arsitektur Sistem:\n1. Main Menu Loop\n2. Modul Input (try-except)\n3. Modul Data (list of dicts)\n4. Modul Report"
                capaian = "Siswa mampu membuat diagram alur sistem yang komprehensif untuk proyek akhirnya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-3':
                learning_type = "Video Interaktif & Analisis"
                konsep = "Menganalisis Data Transaksi Celengan: Mengelompokkan transaksi berdasarkan kategori dan membandingkan realisasi vs anggaran."
                cheatsheet = "kategori_total = {}\nfor t in riwayat:\n    kat = t['kategori']\n    kategori_total[kat] = kategori_total.get(kat, 0) + t['nominal']"
                capaian = "Siswa mampu menerapkan algoritma pengelompokan (grouping & aggregation) data keuangan."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-4':
                learning_type = "Video Interaktif & Logika Pintar"
                konsep = "Logika Rekomendasi Pintar: Memberikan saran finansial otomatis ('Peringatan: Pos Hiburan Anda melebihi 30% anggaran')."
                cheatsheet = "if kategori_total.get('Hiburan', 0) > budget_hiburan:\n    print('🚨 PERINGATAN: Pos Hiburan overbudget!')"
                capaian = "Siswa mengimplementasikan fitur kecerdasan berbasis aturan (rule-based intelligence) pada aplikasinya."
                status = "Siap (Video Curated & Kuis)"
            elif sid == 'hs-5-5':
                learning_type = "Capstone Project Akhir"
                konsep = "Capstone Integration: Menggabungkan seluruh komponen menjadi aplikasi utuh Financial Literacy App di Google Colab."
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
                num, mod_id, mod_title, sid, title, learning_type, kicker, media_link, konsep, cheatsheet, capaian, status
            ])
            num += 1

    return {
        "sd": sd_rows,
        "smp": ms_rows,
        "sma": hs_rows
    }

if __name__ == "__main__":
    res = build_curriculum_dataset()
    print(f"Built curriculum: SD={len(res['sd'])} rows, SMP={len(res['smp'])} rows, SMA={len(res['sma'])} rows")
    with open("projects/uob-async-lms/subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload.json", "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    print("Saved curriculum_sheet_payload.json!")
