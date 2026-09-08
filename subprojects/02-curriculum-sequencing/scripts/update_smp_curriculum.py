import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Step definitions
step_signin = {
    "id": "ms-0-1",
    "type": "video",
    "thumbnail": "https://img.youtube.com/vi/tT1FtLbLqkE/hqdefault.jpg",
    "kicker": "Persiapan Alat · Sign In",
    "title": "Sign In ke MIT App Inventor",
    "duration": "05:03",
    "videoId": "tT1FtLbLqkE",
    "startSeconds": 0,
    "endSeconds": 303,
    "introVideo": "Sebelum mulai membuat aplikasi, kamu perlu masuk ke lab koding cloud MIT App Inventor. Di video ini, Kak Laras mengajarkan cara masuk tanpa akun Google menggunakan 4-kata <strong>Revisit Code</strong>. Siapkan catatanmu untuk mencatat kode tersebut agar proyekmu selalu tersimpan aman!",
    "bookmarks": [
        {"time": 0, "label": "Pengenalan Platform MIT App Inventor"},
        {"time": 42, "label": "Membuka code.appinventor.mit.edu"},
        {"time": 75, "label": "Opsi Login: Google vs Tanpa Akun"},
        {"time": 112, "label": "Fitur 'Continue Without An Account'"},
        {"time": 148, "label": "Mencatat 4-Kata Revisit Code"},
        {"time": 225, "label": "Cara Masuk Kembali dengan Revisit Code"},
        {"time": 270, "label": "Tips Masuk ke Dashboard Proyek"}
    ],
    "quizzes": [
        {
            "time": 220,
            "shown": False,
            "resume": False,
            "title": "KUIS PERSIAPAN AKUN",
            "questions": [
                {
                    "id": "q-ms-0-1-1",
                    "question": "Jika kamu memilih opsi 'Continue Without An Account' di MIT App Inventor, apa yang harus kamu catat dan simpan baik-baik agar proyekmu tidak hilang?",
                    "options": [
                        "A. Password email orang tua",
                        "B. 4 kata unik 'Revisit Code' (contoh: TOO-DECK-IRA-EGO)",
                        "C. Screenshot layar desktop saja",
                        "D. Nomor handphone teman"
                    ],
                    "answer": 1,
                    "explanation": "Tepat sekali! 4 kata unik 'Revisit Code' adalah kunci identitas proyekmu. Simpan kode ini di buku catatan agar kamu bisa membuka proyekmu kembali."
                }
            ]
        }
    ],
    "lootboxTitle": "Loot Box Hari Ini 🎁",
    "takeaways": [
        "<strong>Website Resmi:</strong> Buka <code>code.appinventor.mit.edu</code> untuk mulai merancang aplikasi Android di browser tanpa instalasi software.",
        "<strong>Login Tanpa Ribet:</strong> Gunakan opsi <em>Continue Without An Account</em> jika tidak memiliki akun Google pribadi.",
        "<strong>Kunci Akses Unik:</strong> Kamu akan menerima 4 kata unik <em>Revisit Code</em> yang berfungsi sebagai kata sandi pembuka proyekmu.",
        "<strong>Sesi Lanjutan:</strong> Masuk kembali melalui <code>login.appinventor.mit.edu/codelogin</code> dengan mengetikkan 4 kata tersebut pada kotak yang tersedia."
    ],
    "cheatsheetTitle": "Catat Revisit Code! 📝",
    "cheatsheetDesc": "Format 4 kata unik untuk membuka proyek kembali di komputer:",
    "cheatsheetCode": "KATA1 - KATA2 - KATA3 - KATA4\nContoh: TOO - DECK - IRA - EGO",
    "readingTitle": "Panduan Masuk & Menyimpan Proyek di MIT App Inventor",
    "readingDesc": "Pelajari cara aman mengelola akses proyek kodingmu tanpa khawatir kehilangan data saat berganti perangkat.",
    "concepts": [
        {
            "num": "A",
            "title": "Cloud-Based Studio",
            "desc": "MIT App Inventor berjalan 100% di browser cloud, jadi kamu tidak perlu mendownload software berat ke komputermu."
        },
        {
            "num": "B",
            "title": "Revisit Code Praktis",
            "desc": "Sistem kode 4 kata memudahkan siswa sekolah langsung berkreasi tanpa repot membuat atau mengelola akun email baru."
        },
        {
            "num": "C",
            "title": "Keamanan Proyek",
            "desc": "Jangan bagikan kode 4 katamu ke teman lain agar proyek aplikasimu tidak sengaja terhapus atau tertukar."
        }
    ],
    "sectionTitle": "Langkah Masuk Kembali ke Proyek",
    "sectionCode": "1. Buka code.appinventor.mit.edu\n2. Klik 'Continue Without An Account'\n3. Masukkan 4 kata kode pada 4 kotak input\n4. Klik 'Enter with Revisit Code'",
    "sectionNote": "<strong>Penting:</strong> Catat kode 4 kata di buku catatan fisik atau Google Keep. Jika kode hilang sebelum proyek di-publish ke Gallery, karyamu tidak bisa dipulihkan!"
}

step_ui = {
    "id": "ms-0-2",
    "type": "video",
    "thumbnail": "https://img.youtube.com/vi/5M9jTl5pPsI/hqdefault.jpg",
    "kicker": "Desain Antarmuka · UI Designer",
    "title": "Mendesain User Interface (UI)",
    "duration": "16:18",
    "videoId": "5M9jTl5pPsI",
    "startSeconds": 0,
    "endSeconds": 978,
    "introVideo": "Aplikasi yang keren harus memiliki tampilan visual (User Interface) yang menarik dan nyaman digunakan! Di video ini, Kak Laras memandu kamu menjelajahi 4 kolom sakti di Designer Workspace: <strong>Palette</strong>, <strong>Viewer</strong>, <strong>Components</strong>, dan <strong>Properties</strong>. Kamu juga akan belajar cara menghubungkan tampilan aplikasi ke smartphone secara live lewat <strong>AI Companion</strong>!",
    "bookmarks": [
        {"time": 0, "label": "Pengenalan User Interface (UI)"},
        {"time": 70, "label": "Membuat Proyek Baru ('Start new project')"},
        {"time": 145, "label": "Mengenal 4 Kolom Designer Workspace"},
        {"time": 255, "label": "Menambahkan Komponen Label & Mengubah Teks"},
        {"time": 390, "label": "Mengatur BackgroundColor & Ukuran Font"},
        {"time": 525, "label": "Menambahkan Tombol (Button) & Style Warna"},
        {"time": 680, "label": "Perataan Posisi (AlignHorizontal & AlignVertical)"},
        {"time": 770, "label": "Menambah Layar Baru (Multiple Screens - Screen2)"},
        {"time": 855, "label": "Live Test Tampilan via AI Companion (QR Code)"},
        {"time": 940, "label": "Rangkuman & Persiapan ke Blocks Editor"}
    ],
    "quizzes": [
        {
            "time": 300,
            "shown": False,
            "resume": False,
            "title": "KUIS ANATOMI DESIGNER",
            "questions": [
                {
                    "id": "q-ms-0-2-1",
                    "question": "Di bagian mana pada Designer Workspace kita dapat mengatur warna latar belakang (BackgroundColor), ukuran huruf (FontSize), dan teks tombol?",
                    "options": [
                        "A. Palette (kolom kiri)",
                        "B. Viewer (layar HP)",
                        "C. Properties (kolom kanan)",
                        "D. Media"
                    ],
                    "answer": 2,
                    "explanation": "Benar! Panel Properties di kolom paling kanan digunakan untuk mengatur seluruh ciri visual komponen seperti warna, teks, ukuran font, dan perataan."
                }
            ]
        },
        {
            "time": 850,
            "shown": False,
            "resume": False,
            "title": "KUIS LIVE PREVIEW",
            "questions": [
                {
                    "id": "q-ms-0-2-2",
                    "question": "Fitur apa di menu App Inventor yang digunakan untuk menguji tampilan aplikasi secara langsung di smartphone Android?",
                    "options": [
                        "A. Connect -> AI Companion",
                        "B. Build -> App (save .apk to computer)",
                        "C. Projects -> Import project",
                        "D. Help -> About"
                    ],
                    "answer": 0,
                    "explanation": "Tepat! Menu Connect -> AI Companion memunculkan kode 6 karakter dan QR Code untuk di-scan menggunakan aplikasi MIT AI2 Companion di ponselmu."
                }
            ]
        }
    ],
    "lootboxTitle": "Loot Box Hari Ini 🎁",
    "takeaways": [
        "<strong>4 Kolom Sakti:</strong> Palette (ambil komponen), Viewer (tampilan layar HP), Components (daftar komponen aktif), dan Properties (pengaturan sifat visual).",
        "<strong>Komponen Dasar UI:</strong> <em>Label</em> untuk menampilkan teks/keterangan, dan <em>Button</em> untuk tombol interaksi yang bisa diklik user.",
        "<strong>Perataan Presisi:</strong> Ubah <code>AlignHorizontal: Center (3)</code> dan <code>AlignVertical: Center (2)</code> pada Screen1 agar komponen berada rapi di tengah layar.",
        "<strong>Multiple Screens:</strong> Gunakan tombol <em>Add Screen...</em> untuk membuat layar kedua (Screen2) jika aplikasimu memiliki beberapa halaman.",
        "<strong>Live Testing:</strong> Gunakan menu <em>Connect -> AI Companion</em> untuk menguji tampilan aplikasi secara nyata di layar HP smartphone."
    ],
    "cheatsheetTitle": "Designer Properties 📝",
    "cheatsheetDesc": "Pengaturan kunci tampilan di panel Properties:",
    "cheatsheetCode": "BackgroundColor: #3A3ECC (Warna Latar)\nFontSize: 18 - 24 (Ukuran Teks)\nWidth: Fill parent (Lebar Penuh Layar)\nShape: rounded (Sudut Tombol Melengkung)",
    "readingTitle": "Bedah Anatomi Designer Workspace MIT App Inventor",
    "readingDesc": "Pahami fungsi setiap kolom dan komponen antarmuka agar bisa merancang aplikasi Android yang rapi dan menarik.",
    "concepts": [
        {
            "num": "A",
            "title": "User Interface (UI) Adalah Wajah Aplikasi",
            "desc": "UI yang bersih dan jelas membuat pengguna merasa nyaman dan tidak bingung saat menggunakan aplikasimu."
        },
        {
            "num": "B",
            "title": "Pemberian Nama Komponen (Rename)",
            "desc": "Biasakan mengubah nama tombol bawaan (Button1) menjadi nama bermakna (TombolMulai, TombolReset) agar mudah dicari saat koding blok."
        },
        {
            "num": "C",
            "title": "Instant Live Feedback",
            "desc": "Setiap perubahan warna atau posisi di laptop langsung ter-update seketika di layar HP lewat koneksi AI Companion."
        }
    ],
    "sectionTitle": "Hierarki 4 Kolom Designer",
    "sectionCode": "Palette (Kiri)       -> Ambil komponen (Label, Button, Image)\nViewer (Tengah-Kiri) -> Tata posisi di layar HP tiruan\nComponents (Tengah)  -> Lihat pohon hirarki Screen & objek\nProperties (Kanan)   -> Ganti warna, teks, ukuran, font",
    "sectionNote": "<strong>Tips:</strong> Untuk menghubungkan laptop dan smartphone lewat AI Companion, pastikan kedua perangkat terhubung ke jaringan Wi-Fi yang sama!"
}

step_publish = {
    "id": "ms-0-3",
    "type": "video",
    "thumbnail": "https://img.youtube.com/vi/_aAQ8nFUAqc/hqdefault.jpg",
    "kicker": "Portofolio Digital · Gallery",
    "title": "Publish Proyek App Inventor ke Gallery",
    "duration": "02:53",
    "videoId": "_aAQ8nFUAqc",
    "startSeconds": 0,
    "endSeconds": 172,
    "introVideo": "Aplikasi hebat yang sudah selesai kamu rancang pantas dilihat dunia! Di video ini, Kak Laras mengajarkan cara mempublikasikan proyek aplikasimu langsung ke <strong>MIT App Inventor Gallery</strong> (<code>gallery.appinventor.mit.edu</code>). Karya kamu akan memiliki halaman publik sendiri yang bisa kamu pamerkan ke teman dan gurumu!",
    "bookmarks": [
        {"time": 0, "label": "Mengenal MIT App Inventor Gallery"},
        {"time": 30, "label": "Membuka Menu Projects -> My Projects"},
        {"time": 65, "label": "Memilih Proyek & Klik 'Publish to Gallery'"},
        {"time": 100, "label": "Mengisi Info Aplikasi (Title, Description, Icon)"},
        {"time": 135, "label": "Menjelajahi Galeri Publik (gallery.appinventor.mit.edu)"}
    ],
    "quizzes": [
        {
            "time": 120,
            "shown": False,
            "resume": False,
            "title": "KUIS PUBLIKASI KARYA",
            "questions": [
                {
                    "id": "q-ms-0-3-1",
                    "question": "Bagaimana cara mempublikasikan aplikasi yang sudah selesai ke etalase publik MIT App Inventor Gallery?",
                    "options": [
                        "A. Kirim email ke tim MIT satu per satu",
                        "B. Centang nama proyek di 'My Projects', lalu klik tombol 'Publish to Gallery'",
                        "C. Foto layar laptop lalu kirim ke WhatsApp",
                        "D. Hapus proyek lalu buat ulang"
                    ],
                    "answer": 1,
                    "explanation": "Tepat! Cukup pilih dan centang nama proyekmu di halaman My Projects, lalu klik tombol 'Publish to Gallery' di bilah menu atas."
                }
            ]
        }
    ],
    "lootboxTitle": "Loot Box Hari Ini 🎁",
    "takeaways": [
        "<strong>Galeri Global:</strong> MIT App Inventor Gallery (<code>gallery.appinventor.mit.edu</code>) adalah wadah pameran karya aplikasi kreator muda di seluruh dunia.",
        "<strong>Satu Klik Publikasi:</strong> Di dashboard <em>My Projects</em>, cukup beri tanda centang pada proyekmu dan klik tombol <em>Publish to Gallery</em>.",
        "<strong>Deskripsi Menarik:</strong> Berikan judul yang mudah diingat, deskripsi cara pemakaian, dan tangkapan layar antarmuka terbaik.",
        "<strong>Portofolio Siswa:</strong> Link galeri publik ini bisa kamu cantumkan sebagai bukti karya dan portofolio koding digitalmu!"
    ],
    "cheatsheetTitle": "Langkah Publish 📝",
    "cheatsheetDesc": "Alur cepat publikasi proyek ke Gallery:",
    "cheatsheetCode": "Projects -> My Projects\n[✓] Pilih Proyek (TrialApp)\n-> Klik 'Publish to Gallery'\n-> Isi Title & Description\n-> Submit ke gallery.appinventor.mit.edu",
    "readingTitle": "Membagikan Solusi Digitalmu ke Komunitas Dunia",
    "readingDesc": "Pelajari etika dan teknik mempublikasikan aplikasi mobile agar bermanfaat dan dapat diakses oleh khalayak luas.",
    "concepts": [
        {
            "num": "A",
            "title": "Dari Pembuat untuk Pengguna",
            "desc": "Koding bukan hanya tentang menulis kode, tapi tentang memecahkan masalah nyata dan membagikan solusinya ke orang lain."
        },
        {
            "num": "B",
            "title": "Open Source & Belajar Bersama",
            "desc": "Di galeri MIT, orang lain juga bisa membuka dan mempelajari rancangan blok aplikasimu untuk saling menginspirasi."
        },
        {
            "num": "C",
            "title": "Etika Publikasi",
            "desc": "Pastikan deskripsi aplikasimu sopan, tidak mengandung kata kasar atau data pribadi rahasia (seperti nomor telepon pribadi)."
        }
    ],
    "sectionTitle": "Checklist Sebelum Publish",
    "sectionCode": "[✓] Semua tombol sudah diuji dan tidak ada error merah di Blocks\n[✓] Tampilan visual rapi dan tombol tidak bertumpuk\n[✓] Judul aplikasi jelas dan menarik\n[✓] Penjelasan singkat cara memainkan/menggunakan aplikasi sudah ditulis",
    "sectionNote": "<strong>Catatan:</strong> Setelah dipublikasikan, kamu bisa membagikan tautan URL galeri karyamu kepada teman sekelas, orang tua, dan fasilitator!"
}

step_slide = {
    "id": "ms-0-4",
    "type": "slide",
    "thumbnail": "https://cdn-web-2.ruangguru.com/landing-pages/assets/34a4c4fc-e4ce-459c-afbc-fd63fc88f107.png",
    "kicker": "Slide Interaktif · Logika Blok",
    "title": "Pengantar Logika Blok & Virtual TinyDB",
    "duration": "10 Menit",
    "slideUrl": "./slides/bridge-ms-00.html",
    "introVideo": "Setelah mengenal cara login dan mendesain tampilan visual, kini saatnya menyelami cara kerja otak aplikasi! Di slide interaktif ini, kamu akan mempelajari bagaimana event blok (seperti tombol ditekan) bekerja dan mencoba simulator virtual TinyDB langsung di browser!",
    "bookmarks": [
        {"time": 1, "label": "Slide 1: Selamat Datang Pembuat Aplikasi"},
        {"time": 2, "label": "Slide 4: Anatomi Designer Workspace"},
        {"time": 3, "label": "Slide 6: Anatomi Blocks Editor"},
        {"time": 4, "label": "Slide 7: Logika Event-Driven"},
        {"time": 5, "label": "Slide 9: Simulator Virtual TinyDB"},
        {"time": 6, "label": "Slide 11: Konsep Penyimpanan Data"},
        {"time": 7, "label": "Slide 15: Kamus Istilah Koding Blok"}
    ],
    "quizzes": [
        {
            "time": 1,
            "shown": False,
            "resume": False,
            "title": "KUIS LOGIKA BLOK",
            "questions": [
                {
                    "id": "q-ms-0-4-1",
                    "question": "Di App Inventor, blok perintah yang bertuliskan 'when Button1.Click do' termasuk jenis blok apa?",
                    "options": [
                        "A. Event Handler (Penangan Kejadian)",
                        "B. Media Player",
                        "C. Math Calculator",
                        "D. Screen Orientation"
                    ],
                    "answer": 0,
                    "explanation": "Tepat! Blok 'when ... do' adalah Event Handler yang bertugas mendengarkan kejadian (event) saat tombol diklik oleh pengguna."
                }
            ]
        }
    ],
    "lootboxTitle": "Loot Box Hari Ini 🎁",
    "takeaways": [
        "<strong>Event-Driven:</strong> Aplikasi mobile bekerja berdasarkan kejadian (event) seperti sentuhan layar atau tombol ditekan.",
        "<strong>Blocks Editor:</strong> Ruang kerja untuk menyusun logika perintah aplikasi menggunakan kepingan blok visual.",
        "<strong>TinyDB:</strong> Komponen database lokal di HP yang menjaga data pengguna tetap tersimpan meskipun aplikasi ditutup.",
        "<strong>Interactive Sandbox:</strong> Kamu bisa mencoba langsung simulator virtual TinyDB di dalam slide interaktif ini."
    ],
    "cheatsheetTitle": "Kamus Blok 📝",
    "cheatsheetDesc": "Konsep kunci koding blok di Blocks Editor:",
    "cheatsheetCode": "when Button.Click do\n    call TinyDB.StoreValue(tag, value)\n    set Label.Text to get value",
    "readingTitle": "Transisi dari Visual Designer ke Logika Pemrograman",
    "readingDesc": "Hubungkan pemahaman antarmuka dengan logika algoritma blok untuk menghasilkan aplikasi yang pintar dan tangguh.",
    "concepts": [
        {
            "num": "A",
            "title": "Dari Tampilan ke Logika",
            "desc": "Komponen yang kamu pasang di Designer akan diberi instruksi hidup di Blocks Editor."
        },
        {
            "num": "B",
            "title": "Penyimpanan Persisten (TinyDB)",
            "desc": "Variabel biasa akan hilang saat aplikasi ditutup, sedangkan TinyDB menyimpan data secara permanen di memori HP."
        },
        {
            "num": "C",
            "title": "Simulasi Sebelum Implementasi",
            "desc": "Cobalah simulator virtual penyimpanan di slide 9 untuk memahami konsep pasangan tag dan nilai."
        }
    ],
    "sectionTitle": "Alur Logika Aplikasi Mobile",
    "sectionCode": "1. Pengguna klik tombol (Event: when Button.Click)\n2. Program membaca teks input (get TextBox.Text)\n3. Program mengecek kondisi (if-else)\n4. Program menyimpan data ke TinyDB (StoreValue)\n5. Program memperbarui teks di layar (set Label.Text)",
    "sectionNote": "<strong>Keren!</strong> Setelah menuntaskan Modul 0 ini, kamu sudah memiliki bekal lengkap untuk memasuki Modul 1 (Validasi Input & Flowchart)!"
}

# Update function for courseData-middleschool.json
def update_json_file(file_path):
    p = Path(file_path)
    if not p.exists():
        print(f"File not found: {p}")
        return
    data = json.loads(p.read_text(encoding="utf-8"))
    
    # Update Module 0
    mod0 = data["modules"][0]
    mod0["title"] = "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor"
    mod0["description"] = "Pengenalan alur belajar mandiri, persiapan akun Revisit Code, desain antarmuka (UI), dan publikasi di MIT App Inventor."
    
    # Keep step 0 (yxmLOk5vcFg) with enhanced intro
    step0 = mod0["steps"][0]
    step0["introVideo"] = "Selamat datang di program <strong>UOB My Digital Space</strong>! Tonton video orientasi singkat ini untuk memahami alur belajar mandiri asinkronus, fitur pop-up quiz interaktif, dan cara menyelesaikan misi kodingmu!"
    step0["lootboxTitle"] = "Loot Box Hari Ini 🎁"
    step0["takeaways"] = [
        "<strong>Belajar Mandiri (Async):</strong> Kamu memegang kendali penuh atas ritme dan jadwal belajarmu.",
        "<strong>Pop-up Quiz Interaktif:</strong> Kuis akan muncul di sela-sela video. Jawab kuis untuk membuka materi selanjutnya.",
        "<strong>Bahan Bacaan & Cheat Sheet:</strong> Manfaatkan kartu rangkuman di bawah video untuk memperkuat pemahaman konsepmu.",
        "<strong>Bantuan Fasilitator:</strong> Hubungi tim fasilitator kapan saja jika ada materi yang membingungkan."
    ]
    step0["cheatsheetTitle"] = "Ritme Belajar 📝"
    step0["cheatsheetDesc"] = "Tiga kunci sukses belajar mandiri di platform ini:"
    step0["cheatsheetCode"] = "1. Tonton video sampai tuntas\n2. Kerjakan kuis interaktif\n3. Buka rangkuman & coba latihan kode"
    
    # Replace mod0 steps with full set: step0, step_signin, step_ui, step_publish, step_slide
    mod0["steps"] = [step0, step_signin, step_ui, step_publish, step_slide]
    
    # Also in Module 5, add publishing step as final capstone guide if not present
    mod5 = data["modules"][5]
    has_publish = any(s.get("videoId") == "_aAQ8nFUAqc" for s in mod5["steps"])
    if not has_publish:
        step_publish_capstone = dict(step_publish)
        step_publish_capstone["id"] = "ms-5-4"
        step_publish_capstone["kicker"] = "Tahap Akhir · Publikasi Karya"
        step_publish_capstone["title"] = "Mempublikasikan Final Project ke Gallery"
        step_publish_capstone["introVideo"] = "Selamat! Kamu telah menyelesaikan Final Project aplikasi solusimu. Tonton panduan kilat ini untuk mempublikasikan hasil karyamu secara resmi ke MIT App Inventor Gallery dan bagikan link-nya!"
        mod5["steps"].append(step_publish_capstone)
        
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {p} successfully! Modul 0 now has {len(mod0['steps'])} steps, Modul 5 has {len(mod5['steps'])} steps.")

if __name__ == "__main__":
    paths = [
        ROOT / "output" / "courseData-middleschool.json",
        ROOT.parents[0] / "01-lms-platform" / "src" / "data" / "courseData-middleschool.json",
        ROOT.parents[1] / "docs" / "data" / "courseData-middleschool.json"
    ]
    for path in paths:
        update_json_file(path)
