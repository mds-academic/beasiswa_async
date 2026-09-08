import os, json, re

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing"
DRAFTS_HTML_DIR = os.path.join(BASE_DIR, "drafts", "bridge-html")
os.makedirs(DRAFTS_HTML_DIR, exist_ok=True)

# Import the base builder
from generate_all_bridge_files import build_html

print("Generating Bridge Materials...")

# ==============================================================================
# 1. bridge-hs-01.html (SMA 01: Variabel & Tipe Data Tanpa Takut)
# ==============================================================================
slides_hs01 = """
            <!-- Slide 1: Analogi Kotak Berlabel -->
            <div class="slide active" data-title="VARIABEL & TIPE DATA" data-subtitle="Analogi Kotak Berlabel">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Mengapa Komputer Membutuhkan Memori? 📦</h2>
                        <div class="slide-text">
                            <p>Bayangkan kamu sedang berbelanja di minimarket. Di kasir, kasir menghitung belanjaanmu, mencatat saldo uangmu, dan memeriksa apakah kamu membawa kartu diskon. Semua informasi itu harus <strong>disimpan di suatu tempat</strong> agar tidak terlupakan!</p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--blue);">
                                    <h3 style="margin-bottom: 8px;">🏷️ Konsep Variabel: Kotak Berlabel</h3>
                                    <p>Variabel adalah sebuah wadah berlabel di dalam memori komputer (RAM). Kita memberi wadah itu nama khusus agar nilainya bisa diambil, dibaca, atau diubah kapan saja.</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--green);">
                                    <h3 style="margin-bottom: 8px;">🔄 Data Bisa Berubah (Variable)</h3>
                                    <p>Sesuai namanya, isi wadah variabel bersifat <em>variable</em> (bisa berubah). Hari ini saldomu Rp 50.000, setelah jajan berkurang menjadi Rp 35.000.</p>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                💡 <strong>Prinsip Utama:</strong> Tanpa variabel, komputer tidak bisa mengingat apa pun yang kamu ketikkan atau hitung!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Sintaks Assignment -->
            <div class="slide" data-title="SINTAKS PYTHON" data-subtitle="Operator Penugasan (Assignment)">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Cara Membuat Variabel: Rumus Assignment ✍️</h2>
                        <div class="slide-text">
                            <p>Di Python, membuat variabel sangatlah mudah dan bersih. Kamu tidak perlu mengetik perintah rumit, cukup gunakan rumus emas ini:</p>
                            <div class="code-box">
<span class="code-cmt"># Rumus: nama_variabel = nilai</span>
nama = <span class="code-str">"Ahmad Yazid"</span>
saldo = <span class="code-num">150000</span>
sudah_lulus = <span class="code-bool">True</span>
                            </div>
                            <div class="feature-card" style="background: #FFF3E0; border-left: 6px solid var(--orange);">
                                <h3 style="margin-bottom: 6px;">⚠️ Tanda = Bukan Sama Dengan Matematika!</h3>
                                <p>Dalam pemrograman, simbol <code>=</code> disebut <strong>Assignment Operator</strong> (Operator Penugasan). Artinya:</p>
                                <p style="font-weight: 700; color: #D84315;">"Ambil nilai di sebelah KANAN, lalu masukkan ke dalam kotak variabel di sebelah KIRI!"</p>
                            </div>
                            <p>Alur eksekusi selalu dari <strong>kanan ke kiri</strong>: Python menghitung nilainya dulu, baru menyimpannya ke variabel.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: 4 Tipe Data Utama -->
            <div class="slide" data-title="4 TIPE DATA UTAMA" data-subtitle="String, Integer, Float, Boolean">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Mengenal 4 Tipe Data Dasar Python 🧭</h2>
                        <div class="slide-text">
                            <p>Sama seperti benda di rumah ada yang cair, padat, atau gas; data di komputer juga memiliki tipe yang berbeda agar komputer tahu bagaimana cara memperlakukannya:</p>
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>Tipe Data</th>
                                        <th>Nama Python</th>
                                        <th>Contoh Penulisan</th>
                                        <th>Kegunaan Utama</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Teks (String)</strong></td>
                                        <td><code>str</code></td>
                                        <td><code>"Kalananti"</code> atau <code>'UOB'</code></td>
                                        <td>Menyimpan huruf, kata, kalimat, atau simbol. Wajib diapit petik!</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bilangan Bulat</strong></td>
                                        <td><code>int</code></td>
                                        <td><code>25</code>, <code>50000</code>, <code>-10</code></td>
                                        <td>Menghitung jumlah orang, usia, lembar uang tanpa koma.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bilangan Desimal</strong></td>
                                        <td><code>float</code></td>
                                        <td><code>3.14</code>, <code>95.5</code>, <code>0.05</code></td>
                                        <td>Menyimpan persentase bunga, suku bunga, berat (pakai titik bukan koma).</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Kebenaran (Boolean)</strong></td>
                                        <td><code>bool</code></td>
                                        <td><code>True</code> atau <code>False</code></td>
                                        <td>Menyimpan kondisi saklar benar/salah (huruf T & F wajib kapital).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: Jebakan "10" vs 10 -->
            <div class="slide" data-title="JEBAKAN MAUT PEMULA" data-subtitle="Teks '10' vs Angka 10">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Jebakan Maut Pemula: Teks "10" vs Angka 10! 💣</h2>
                        <div class="slide-text">
                            <p>Ini adalah kesalahan paling sering yang membuat pemula bingung dan frustrasi. Perhatikan perbedaan tanda petik:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                    <h3>🔢 Angka Asli (Integer)</h3>
                                    <div class="code-box">
a = <span class="code-num">10</span>
b = <span class="code-num">5</span>
<span class="code-fn">print</span>(a + b)  <span class="code-cmt"># Output: 15</span>
                                    </div>
                                    <p>Karena keduanya angka murni, operator <code>+</code> melakukan <strong>penjumlahan matematika</strong> (10 + 5 = 15).</p>
                                </div>
                                <div class="feature-card" style="background: #FFEBEE; border-left: 6px solid var(--red);">
                                    <h3>📜 Teks Bertopeng (String)</h3>
                                    <div class="code-box">
a = <span class="code-str">"10"</span>
b = <span class="code-str">"5"</span>
<span class="code-fn">print</span>(a + b)  <span class="code-cmt"># Output: "105"</span>
                                    </div>
                                    <p>Karena dibungkus tanda petik, Python menganggapnya teks! Operator <code>+</code> melakukan <strong>penyambungan teks (concatenation)</strong>!</p>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FCE4EC; border-left: 6px solid var(--pink);">
                                🚨 <strong>Peringatan Finansial:</strong> Jika kamu menghitung saldo kas dengan tipe String, saldo <code>"50000" + "20000"</code> akan menjadi <code>"5000020000"</code> (5 miliar)!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Aturan Penamaan Variabel -->
            <div class="slide" data-title="ATURAN KODING" data-subtitle="Standar Penamaan Variabel (snake_case)">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Aturan Emas Memberi Nama Variabel di Python 📏</h2>
                        <div class="slide-text">
                            <p>Python memiliki standar resmi industri yang wajib ditaati oleh setiap programmer profesional:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3 style="color: #2E7D32;">✅ Boleh & Direkomendasikan</h3>
                                    <ul>
                                        <li>Gunakan huruf kecil semua: <code>saldo = 1000</code></li>
                                        <li>Pisahkan kata dengan garis bawah (<strong>snake_case</strong>): <code>uang_jajan_mingguan</code></li>
                                        <li>Boleh ada angka di tengah/belakang: <code>siswa_1</code>, <code>rekening_2</code></li>
                                        <li>Nama deskriptif: <code>total_belanja</code> lebih baik daripada <code>x</code></li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #FFEBEE; border: 3px solid var(--red);">
                                    <h3 style="color: #C62828;">❌ DILARANG KERAS (Error)</h3>
                                    <ul>
                                        <li><strong>Jangan pakai spasi!</strong> <code>uang saku = 5000</code> ➔ <em>SyntaxError</em></li>
                                        <li><strong>Jangan diawali angka!</strong> <code>1rekening = 100</code> ➔ <em>SyntaxError</em></li>
                                        <li><strong>Jangan gunakan simbol aneh:</strong> <code>total$</code>, <code>saldo-uang</code></li>
                                        <li><strong>Jangan pakai kata kunci Python:</strong> <code>print = 10</code>, <code>for = 5</code></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Pemeriksa Tipe Data Virtual">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Uji Tipe Data Virtual 🧪</h2>
                        <div class="slide-text">
                            <p>Masukkan nilai apapun di bawah ini, lalu klik tombol untuk melihat bagaimana Python menentukan tipe datanya secara otomatis:</p>
                            <div class="interactive-card">
                                <div class="interactive-title">🔍 Python Type Inspector</div>
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: 700;">Ketik Nilai (misal: <code>"Halo"</code>, <code>100000</code>, <code>3.5</code>, atau <code>True</code>):</label><br>
                                    <input type="text" id="hs01-input" class="input-mini" style="width: 300px;" value='"UOB Finance"'>
                                    <button class="btn-action" onclick="inspectTypeHS01()">Periksa Tipe (type())</button>
                                </div>
                                <div class="output-console" id="hs01-output">
>>> type("UOB Finance")
<class 'str'> (String Teks - Memerlukan petik ganda/tunggal)
                                </div>
                            </div>
                            <p>💡 <em>Cobalah ganti nilainya dengan <code>50000</code>, <code>"50000"</code>, <code>12.75</code>, atau <code>False</code> dan lihat apa kata Python!</em></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Cek Penguasaan Variabel 🎯</h2>
                        <div class="slide-text">
                            <p>Ujilah pemahamanmu sebelum melangkah ke modul video input pengguna:</p>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan 1: Apa hasil dari kode Python berikut?</div>
                                <div class="code-box" style="margin: 8px 0 14px;">
a = <span class="code-str">"50"</span>
b = <span class="code-str">"20"</span>
<span class="code-fn">print</span>(a + b)
                                </div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs01-q1', 'Benar!', 'Salah! Karena dibungkus petik, operator + bukan menjumlahkan angka melainkan menggabungkan teks!')">A. 70</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-hs01-q1', 'Tepat sekali! Keduanya string teks, sehingga digabungkan menjadi \"5020\"!', 'Salah!')">B. "5020"</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs01-q1', 'Benar!', 'Salah! Teks bisa digabungkan dengan +, jadi tidak error.')">C. TypeError</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs01-q1', 'Benar!', 'Salah! Variabel b bernilai \"20\", bukan diabaikan.')">D. "50"</div>
                                </div>
                                <div class="quiz-feedback" id="fb-hs01-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju hs-1-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Input Pengguna">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman Materi & Langkah Selanjutnya 🚀</h2>
                        <div class="slide-text">
                            <p>Selamat! Kamu telah menguasai fondasi paling penting dalam bahasa Python:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Checklist yang Sudah Kamu Kuasai:</h3>
                                    <ul>
                                        <li>Variabel sebagai kotak memori berlabel</li>
                                        <li>Assignment operator <code>=</code> (dari kanan ke kiri)</li>
                                        <li>4 tipe data: <code>str</code>, <code>int</code>, <code>float</code>, <code>bool</code></li>
                                        <li>Bahaya jebakan teks <code>"10"</code> vs angka <code>10</code></li>
                                        <li>Standar penamaan <code>snake_case</code></li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Menuju Modul Berikutnya (hs-1-1):</h3>
                                    <p>Di video berikutnya, kamu akan belajar cara <strong>meminta input langsung dari pengguna keyboard</strong> menggunakan fungsi bawaan <code>input()</code> dan bagaimana cara membersihkan teksnya agar aman!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai atau lanjut di LMS saat kamu siap! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_hs01 = """
        function inspectTypeHS01() {
            const inputVal = document.getElementById('hs01-input').value.trim();
            const out = document.getElementById('hs01-output');
            if (!inputVal) {
                out.innerText = ">>> Masukkan nilai terlebih dahulu!";
                return;
            }
            if ((inputVal.startsWith('"') && inputVal.endsWith('"')) || (inputVal.startsWith("'") && inputVal.endsWith("'"))) {
                out.innerText = ">>> type(" + inputVal + ")\\n<class 'str'> (String Teks - Memerlukan petik ganda/tunggal)";
            } else if (inputVal === "True" || inputVal === "False") {
                out.innerText = ">>> type(" + inputVal + ")\\n<class 'bool'> (Boolean Kebenaran - Huruf depan kapital)";
            } else if (!isNaN(inputVal) && inputVal.includes(".")) {
                out.innerText = ">>> type(" + inputVal + ")\\n<class 'float'> (Bilangan Desimal - Memakai titik)";
            } else if (!isNaN(inputVal)) {
                out.innerText = ">>> type(" + inputVal + ")\\n<class 'int'> (Bilangan Bulat / Integer - Angka murni)";
            } else {
                out.innerText = ">>> NameError: name '" + inputVal + "' is not defined.\\n💡 Ingat: Jika ini adalah teks kata, wajib dibungkus tanda petik: \\\"" + inputVal + "\\\"";
            }
        }
"""

html_hs01 = build_html(
    "Materi Jembatan 01 SMA: Variabel dan Tipe Data Tanpa Takut",
    "VARIABEL & TIPE DATA",
    "Analogi Kotak Berlabel",
    slides_hs01,
    scripts_hs01
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-01.html"), "w", encoding="utf-8") as f:
    f.write(html_hs01)

print("Saved bridge-hs-01.html")

# ==============================================================================
# 2. bridge-hs-02.html (SMA 02: Dari Input Teks Menjadi Logika Keputusan)
# ==============================================================================
slides_hs02 = """
            <!-- Slide 1: Mengapa Input Perlu Perlakuan Khusus -->
            <div class="slide active" data-title="DARI INPUT KE KEPUTUSAN" data-subtitle="Mengolah Input Pengguna">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Mengapa Input Pengguna Perlu Dikelola Hati-Hati? 🤔</h2>
                        <div class="slide-text">
                            <p>Di modul sebelumnya kamu sudah mencoba menulis fungsi <code>input()</code> untuk menerima ketikan dari pengguna. Namun, pernahkah kamu bertanya-tanya: <strong>kenapa hasil input tidak bisa langsung dijumlahkan dengan saldo uang?</strong></p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--orange);">
                                    <h3>⌨️ Dunia Manusia: Teks Bebas</h3>
                                    <p>Saat mengetik di keyboard, manusia bisa mengetik apa saja: angka, spasi, huruf, atau tanda minus. Komputer menerima ketikan itu sebagai <em>teks mentah</em>.</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--blue);">
                                    <h3>🤖 Dunia Komputer: Logika Presisi</h3>
                                    <p>Sebelum mengambil keputusan seperti "apakah saldo cukup untuk transaksi ini?", komputer membutuhkan angka murni yang bisa dibandingkan secara matematika.</p>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                💡 <strong>Jembatan Kita Hari Ini:</strong> Mempelajari cara mengubah teks mentah dari <code>input()</code> menjadi bilangan bulat, lalu membandingkannya dengan operator logika percabangan!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Rahasia Fungsi input() -->
            <div class="slide" data-title="SIFAT FUNGSI INPUT" data-subtitle="Selalu Menghasilkan Tipe String">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Rahasia Terbesar input(): Selalu Berupa String! 📜</h2>
                        <div class="slide-text">
                            <p>Ingat aturan mutlak ini di kepalamu seumur hidup saat memprogram dengan Python:</p>
                            <div class="feature-card" style="background: #FFF3E0; border: 3px solid var(--orange); text-align: center;">
                                <h3 style="font-size: 22px; color: #E65100;">"Apapun yang diketikkan pengguna, fungsi input() SELALU mengembalikannya sebagai String (str)!"</h3>
                            </div>
                            <p>Perhatikan contoh nyata berikut:</p>
                            <div class="code-box">
nominal = <span class="code-fn">input</span>(<span class="code-str">"Masukkan nominal belanja: "</span>)
<span class="code-cmt"># Jika pengguna mengetik 50000, Python menyimpannya sebagai "50000" (bukan angka 50000)</span>
<span class="code-fn">print</span>(<span class="code-fn">type</span>(nominal))  <span class="code-cmt"># Output: <class 'str'></span>
                            </div>
                            <p>Jika kamu langsung mencoba melakukan perbandingan matematika: <code>nominal > 10000</code>, Python akan melempar error: <code>TypeError: '>' not supported between instances of 'str' and 'int'</code>.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Konversi Tipe Data -->
            <div class="slide" data-title="KONVERSI TIPE DATA" data-subtitle="Fungsi int() dan float()">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Mengubah Teks Menjadi Angka: int() dan float() 🔄</h2>
                        <div class="slide-text">
                            <p>Untuk menyembuhkan masalah di atas, Python menyediakan fungsi <strong>Type Casting</strong> (konversi tipe data):</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                    <h3>🔢 Fungsi int() — Bilangan Bulat</h3>
                                    <p>Mengubah teks angka bulat menjadi integer murni:</p>
                                    <div class="code-box">
teks_uang = <span class="code-str">"25000"</span>
angka_uang = <span class="code-fn">int</span>(teks_uang)
<span class="code-fn">print</span>(angka_uang + <span class="code-num">5000</span>) <span class="code-cmt"># Hasil: 30000</span>
                                    </div>
                                </div>
                                <div class="feature-card" style="background: #E1F5FE; border-left: 6px solid var(--blue);">
                                    <h3>💧 Fungsi float() — Bilangan Desimal</h3>
                                    <p>Mengubah teks angka berkoma/desimal menjadi float:</p>
                                    <div class="code-box">
teks_bunga = <span class="code-str">"2.5"</span>
angka_bunga = <span class="code-fn">float</span>(teks_bunga)
<span class="code-fn">print</span>(angka_bunga * <span class="code-num">2</span>) <span class="code-cmt"># Hasil: 5.0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFEBEE; border-left: 6px solid var(--red);">
                                🚨 <strong>Awas ValueError:</strong> Jika pengguna mengetik kata huruf (misal: <code>"lima puluh ribu"</code>), perintah <code>int("lima puluh ribu")</code> akan gagal dan memunculkan <em>ValueError</em>!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: Operator Perbandingan -->
            <div class="slide" data-title="OPERATOR PERBANDINGAN" data-subtitle="Mesin Penghasil Boolean">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Operator Perbandingan: Mesin Logika Kebenaran ⚖️</h2>
                        <div class="slide-text">
                            <p>Setelah data berubah menjadi angka murni, kita bisa membandingkannya. Hasil dari setiap perbandingan adalah nilai <strong>Boolean (True atau False)</strong>:</p>
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>Simbol</th>
                                        <th>Arti</th>
                                        <th>Contoh Kasus</th>
                                        <th>Hasil</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>==</code></td>
                                        <td>Sama dengan (memeriksa kesamaan nilai)</td>
                                        <td><code>saldo == 0</code></td>
                                        <td><code>True</code> jika saldo habis</td>
                                    </tr>
                                    <tr>
                                        <td><code>!=</code></td>
                                        <td>Tidak sama dengan</td>
                                        <td><code>status != "aktif"</code></td>
                                        <td><code>True</code> jika bukan aktif</td>
                                    </tr>
                                    <tr>
                                        <td><code>></code> dan <code><</code></td>
                                        <td>Lebih besar dari / Lebih kecil dari</td>
                                        <td><code>belanja > saldo</code></td>
                                        <td><code>True</code> jika uang kurang</td>
                                    </tr>
                                    <tr>
                                        <td><code>>=</code> dan <code><=</code></td>
                                        <td>Lebih besar sama dengan / Lebih kecil sama dengan</td>
                                        <td><code>usia >= 17</code></td>
                                        <td><code>True</code> jika berhak KTP</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>⚠️ <em>Ingat: Gunakan tanda sama dengan ganda (<code>==</code>) untuk mengecek perbandingan, bukan tanda sama dengan tunggal (<code>=</code>)!</em></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Indentasi Percabangan -->
            <div class="slide" data-title="ATURAN INDENTASI" data-subtitle="Blok Percabangan if-else">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Aturan Emas Python: Indentasi Percabangan if-else 📐</h2>
                        <div class="slide-text">
                            <p>Di bahasa lain programmer menggunakan tanda kurung kurawal <code>{ }</code> untuk membungkus perintah. Di Python, kita menggunakan <strong>Indentasi (4 spasi menjorok ke dalam)</strong>:</p>
                            <div class="code-box">
saldo = <span class="code-num">100000</span>
belanja = <span class="code-num">40000</span>

<span class="code-kw">if</span> belanja &lt;= saldo:
    <span class="code-cmt"># Blok ini HANYA jalan jika kondisi bernilai True (menjorok 4 spasi)</span>
    saldo = saldo - belanja
    <span class="code-fn">print</span>(<span class="code-str">"Pembayaran sukses! Sisa saldo:"</span>, saldo)
<span class="code-kw">else</span>:
    <span class="code-cmt"># Blok ini jalan jika kondisi bernilai False</span>
    <span class="code-fn">print</span>(<span class="code-str">"Saldo tidak cukup!"</span>)
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                💡 <strong>Tanda Titik Dua (:):</strong> Jangan pernah lupa meletakkan tanda titik dua di akhir baris <code>if</code> dan <code>else</code>. Titik dua adalah aba-aba bagi Python bahwa baris berikutnya wajib menjorok!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Simulasi Cek Saldo & Transaksi">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Simulator Pengecekan Saldo Kas 🧪</h2>
                        <div class="slide-text">
                            <p>Ujilah bagaimana alur konversi teks dan perbandingan <code>if-else</code> bekerja secara real-time:</p>
                            <div class="interactive-card">
                                <div class="interactive-title">💳 Simulator Transaksi Kasir</div>
                                <div style="display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
                                    <div>
                                        <label style="font-weight: 700;">Saldo Dompet (Rp):</label><br>
                                        <input type="number" id="hs02-saldo" class="input-mini" value="100000" style="width: 180px;">
                                    </div>
                                    <div>
                                        <label style="font-weight: 700;">Total Belanja (input teks):</label><br>
                                        <input type="text" id="hs02-belanja" class="input-mini" value="45000" style="width: 180px;">
                                    </div>
                                    <div style="align-self: flex-end;">
                                        <button class="btn-action" onclick="runSimulationHS02()">Jalankan if-else</button>
                                    </div>
                                </div>
                                <div class="output-console" id="hs02-output">
>>> Mengubah input belanja "45000" menjadi integer: int("45000") = 45000
>>> Memeriksa kondisi: 45000 <= 100000 ➔ True!
>>> [STATUS]: Transaksi Berhasil! Sisa Saldo: Rp 55.000
                                </div>
                            </div>
                            <p>💡 <em>Cobalah ganti belanja menjadi lebih besar dari saldo (misal 150000) atau ketik teks bukan angka untuk melihat reaksinya!</em></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji Logika Konversi & If-Else 🎯</h2>
                        <div class="slide-text">
                            <p>Jawab pertanyaan berikut untuk membuktikan kamu siap masuk ke materi percabangan:</p>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Apa penyebab utama error pada baris kode berikut?</div>
                                <div class="code-box" style="margin: 8px 0 14px;">
usia = <span class="code-fn">input</span>(<span class="code-str">"Berapa usiamu? "</span>)
<span class="code-kw">if</span> usia >= <span class="code-num">17</span>:
    <span class="code-fn">print</span>(<span class="code-str">"Boleh membuka rekening mandiri"</span>)
                                </div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-hs02-q1', 'Tepat sekali! input() menghasilkan String, sehingga tidak bisa dibandingkan langsung dengan angka 17 tanpa int(usia)!', 'Salah!')">A. Variabel usia bertipe String teks, tidak bisa dibandingkan langsung dengan angka 17</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs02-q1', 'Benar!', 'Salah! Tanda titik dua sudah terpasang dengan benar di akhir if.')">B. Kurang tanda titik dua di baris if</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs02-q1', 'Benar!', 'Salah! Operator >= adalah operator valid di Python.')">C. Operator >= tidak ada di bahasa Python</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs02-q1', 'Benar!', 'Salah! Indentasi print sudah benar 4 spasi.')">D. Baris print tidak diindentasi</div>
                                </div>
                                <div class="quiz-feedback" id="fb-hs02-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju hs-2-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Conditional Logic">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Bekal Menuju Modul 2 🚀</h2>
                        <div class="slide-text">
                            <p>Kini kamu telah memiliki bekal logika komputasi yang kokoh:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>Fungsi <code>input()</code> selalu menghasilkan String teks</li>
                                        <li>Konversi teks ke angka dengan <code>int()</code> dan <code>float()</code></li>
                                        <li>Operator perbandingan: <code>==</code>, <code>!=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></li>
                                        <li>Hasil perbandingan adalah Boolean: <code>True</code> / <code>False</code></li>
                                        <li>Struktur <code>if-else</code> wajib diakhiri titik dua dan diindentasi 4 spasi</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Menuju Modul Percabangan (hs-2-1 s.d. hs-2-5):</h3>
                                    <p>Di video selanjutnya, kamu akan mempelajari percabangan bertingkat (<code>elif</code>), logika ganda menggunakan operator <code>and</code> & <code>or</code>, dan bagaimana membangun sistem verifikasi PIN ATM sederhana!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai untuk melanjutkan! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_hs02 = """
        function runSimulationHS02() {
            const saldoInput = parseInt(document.getElementById('hs02-saldo').value);
            const belanjaRaw = document.getElementById('hs02-belanja').value.trim();
            const out = document.getElementById('hs02-output');
            
            if (isNaN(saldoInput)) {
                out.innerText = ">>> Saldo harus berupa angka valid!";
                return;
            }
            if (!belanjaRaw) {
                out.innerText = ">>> Input belanja tidak boleh kosong!";
                return;
            }
            if (isNaN(belanjaRaw)) {
                out.innerText = ">>> ValueError: invalid literal for int() with base 10: '" + belanjaRaw + "'\\n💡 Teks huruf tidak bisa diubah menjadi angka integer! Masukkan digit angka.";
                return;
            }
            
            const belanjaInt = parseInt(belanjaRaw);
            let log = ">>> Mengubah input belanja \\"" + belanjaRaw + "\\" menjadi integer: int(\\"" + belanjaRaw + "\\") = " + belanjaInt + "\\n";
            log += ">>> Memeriksa kondisi: " + belanjaInt + " <= " + saldoInput + " ➔ ";
            
            if (belanjaInt <= saldoInput) {
                const sisa = saldoInput - belanjaInt;
                log += "True!\\n>>> [STATUS]: Transaksi Berhasil! Sisa Saldo: Rp " + sisa.toLocaleString('id-ID');
            } else {
                log += "False!\\n>>> [STATUS]: Transaksi Ditolak! Saldo tidak mencukupi (Kurang Rp " + (belanjaInt - saldoInput).toLocaleString('id-ID') + ")";
            }
            out.innerText = log;
        }
"""

html_hs02 = build_html(
    "Materi Jembatan 02 SMA: Dari Input Teks Menjadi Logika Keputusan",
    "DARI INPUT KE KEPUTUSAN",
    "Konversi Tipe & Indentasi If-Else",
    slides_hs02,
    scripts_hs02
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-02.html"), "w", encoding="utf-8") as f:
    f.write(html_hs02)

print("Saved bridge-hs-02.html")

# ==============================================================================
# 3. bridge-hs-03.html (SMA 03: Mengulang Tanpa Bosan: List dan For Loop)
# ==============================================================================
slides_hs03 = """
            <!-- Slide 1: Masalah Data Banyak -->
            <div class="slide active" data-title="LIST & FOR LOOP" data-subtitle="Mengolah Data Berulang">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Masalah Besar: Capeknya Menulis 100 Variabel! 😫</h2>
                        <div class="slide-text">
                            <p>Bayangkan kamu bekerja di bank dan harus mencatat 100 transaksi pengeluaran nasabah dalam sehari. Apakah kamu akan membuat 100 variabel terpisah seperti ini?</p>
                            <div class="code-box">
trx1 = <span class="code-num">25000</span>
trx2 = <span class="code-num">50000</span>
trx3 = <span class="code-num">15000</span>
<span class="code-cmt"># ... sampai trx100 = 10000 ??? Sangat melelahkan dan mudah salah!</span>
                            </div>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--blue);">
                                    <h3>🧺 Solusi 1: List (Daftar Keranjang)</h3>
                                    <p>Satu variabel yang mampu menampung ratusan data sekaligus dalam urutan yang rapi menggunakan tanda kurung siku <code>[ ]</code>.</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--green);">
                                    <h3>🔄 Solusi 2: For Loop (Robot Pengulang)</h3>
                                    <p>Instruksi perulangan otomatis yang membuka keranjang dan memproses isi data satu per satu sampai habis tanpa lelah!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Struktur Data List -->
            <div class="slide" data-title="STRUKTUR DATA LIST" data-subtitle="Keranjang Berurut Penyimpan Nilai">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Mengenal Struktur Data List di Python 📋</h2>
                        <div class="slide-text">
                            <p>List dibuat dengan membungkus sekumpulan data di dalam tanda kurung siku <code>[ ]</code> dan memisahkan setiap item dengan tanda koma <code>,</code>:</p>
                            <div class="code-box">
pengeluaran = [<span class="code-num">25000</span>, <span class="code-num">50000</span>, <span class="code-num">15000</span>, <span class="code-num">100000</span>]
nama_kategori = [<span class="code-str">"Makan"</span>, <span class="code-str">"Transport"</span>, <span class="code-str">"Pulsa"</span>, <span class="code-str">"Buku"</span>]
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                <h3 style="margin-bottom: 6px;">📍 Konsep Indeks Berbasis Nol (Zero-Indexed)</h3>
                                <p>Komputer menghitung urutan item di dalam list mulai dari angka <strong>0</strong>, bukan 1!</p>
                                <ul>
                                    <li><code>pengeluaran[0]</code> ➔ menghasilkan <code>25000</code> (item pertama)</li>
                                    <li><code>pengeluaran[1]</code> ➔ menghasilkan <code>50000</code> (item kedua)</li>
                                    <li><code>len(pengeluaran)</code> ➔ menghasilkan <code>4</code> (jumlah total item di list)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: For Loop Dasar -->
            <div class="slide" data-title="PERULANGAN FOR" data-subtitle="Memproses Item Satu per Satu">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Menggunakan Perulangan: for ... in list 🤖</h2>
                        <div class="slide-text">
                            <p>Daripada memanggil <code>pengeluaran[0]</code>, <code>pengeluaran[1]</code> secara manual, kita bisa meminta Python melakukan perulangan otomatis dengan kata kunci <code>for</code>:</p>
                            <div class="code-box">
daftar_belanja = [<span class="code-num">15000</span>, <span class="code-num">20000</span>, <span class="code-num">35000</span>]

<span class="code-kw">for</span> item <span class="code-kw">in</span> daftar_belanja:
    <span class="code-fn">print</span>(<span class="code-str">"Mencatat transaksi sebesar: Rp"</span>, item)
                            </div>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                <h3 style="margin-bottom: 6px;">🔍 Bagaimana Cara Kerjanya?</h3>
                                <ol style="margin-left: 20px; line-height: 1.6;">
                                    <li><strong>Putaran 1:</strong> Python mengambil elemen pertama (<code>15000</code>), memasukkannya ke variabel sementara <code>item</code>, lalu menjalankan blok kode di dalamnya.</li>
                                    <li><strong>Putaran 2:</strong> Python mengambil elemen kedua (<code>20000</code>) dan menjalankannya lagi.</li>
                                    <li><strong>Putaran 3:</strong> Python mengambil elemen ketiga (<code>35000</code>). Karena list sudah habis, perulangan berhenti secara otomatis!</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: Fungsi range() -->
            <div class="slide" data-title="FUNGSI RANGE()" data-subtitle="Generator Urutan Angka">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Fungsi range(): Membuat Deret Angka Otomatis 🔢</h2>
                        <div class="slide-text">
                            <p>Bagaimana jika kamu ingin melakukan perulangan sebanyak 5 kali tanpa perlu mengetik list angka secara manual? Gunakan fungsi bawaan <code>range()</code>!</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #E1F5FE; border-left: 6px solid var(--blue);">
                                    <h3>📌 Sintaks: range(stop)</h3>
                                    <div class="code-box">
<span class="code-kw">for</span> i <span class="code-kw">in</span> <span class="code-fn">range</span>(<span class="code-num">3</span>):
    <span class="code-fn">print</span>(<span class="code-str">"Hari ke-"</span>, i)
                                    </div>
                                    <p>Menghasilkan angka: <code>0, 1, 2</code> (total 3 putaran, dimulai dari 0).</p>
                                </div>
                                <div class="feature-card" style="background: #FFF3E0; border-left: 6px solid var(--orange);">
                                    <h3>📌 Sintaks: range(start, stop)</h3>
                                    <div class="code-box">
<span class="code-kw">for</span> i <span class="code-kw">in</span> <span class="code-fn">range</span>(<span class="code-num">1</span>, <span class="code-num">4</span>):
    <span class="code-fn">print</span>(<span class="code-str">"Bulan ke-"</span>, i)
                                    </div>
                                    <p>Menghasilkan angka: <code>1, 2, 3</code> (angka batas stop 4 <strong>tidak diikutkan</strong>!).</p>
                                </div>
                            </div>
                            <p>⚠️ <em>Aturan Stop Range:</em> <code>range(1, 10)</code> akan berhenti di angka 9, bukan 10!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Pola Akumulator -->
            <div class="slide" data-title="POLA AKUMULATOR" data-subtitle="Menghitung Total Pengeluaran">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Pola Akumulator: Cara Menghitung Total Saldo 💰</h2>
                        <div class="slide-text">
                            <p>Pola paling terkenal di dunia pemrograman finansial adalah <strong>Accumulator Pattern</strong>. Kita menyiapkan variabel penampung awal (biasanya 0), lalu menambahkan isi tiap transaksi ke dalam penampung tersebut:</p>
                            <div class="code-box">
riwayat_pengeluaran = [<span class="code-num">15000</span>, <span class="code-num">20000</span>, <span class="code-num">50000</span>]
total_belanja = <span class="code-num">0</span>  <span class="code-cmt"># 1. Variabel penampung akumulator diset 0</span>

<span class="code-kw">for</span> biaya <span class="code-kw">in</span> riwayat_pengeluaran:
    total_belanja = total_belanja + biaya  <span class="code-cmt"># 2. Tambahkan biaya ke total</span>
    <span class="code-fn">print</span>(<span class="code-str">"Total sementara:"</span>, total_belanja)

<span class="code-fn">print</span>(<span class="code-str">"Total akhir belanjaan:"</span>, total_belanja)  <span class="code-cmt"># Output: 85000</span>
                            </div>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                💡 <strong>Shortcut Profesional:</strong> Penulisan <code>total = total + biaya</code> bisa disingkat menjadi <code>total += biaya</code> di Python!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif Tracing -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Tracing Tabel Akumulator">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Tracing Langkah Demi Langkah 🧪</h2>
                        <div class="slide-text">
                            <p>Klik tombol <strong>"Langkah Berikutnya (Next Step)"</strong> untuk melihat bagaimana komputer mengeksekusi loop dan akumulator putaran demi putaran:</p>
                            <div class="interactive-card">
                                <div class="interactive-title">🔍 Visual Tracer: Total Belanja [10000, 25000, 40000]</div>
                                <div style="margin-bottom: 12px;">
                                    <button class="btn-action" onclick="stepLoopHS03()">Langkah Berikutnya ⏭️</button>
                                    <button class="btn-action" style="background: #E0E0E0;" onclick="resetLoopHS03()">Reset 🔄</button>
                                </div>
                                <table class="styled-table" id="table-trace-hs03">
                                    <thead>
                                        <tr>
                                            <th>Putaran (Loop)</th>
                                            <th>Item Transaksi (biaya)</th>
                                            <th>Perhitungan Akumulator</th>
                                            <th>Total Sementara</th>
                                        </tr>
                                    </thead>
                                    <tbody id="trace-body-hs03">
                                        <tr>
                                            <td>Inisialisasi</td>
                                            <td>-</td>
                                            <td><code>total = 0</code></td>
                                            <td>Rp 0</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="output-console" id="hs03-status">
Status: Tekan tombol 'Langkah Berikutnya' untuk memulai putaran loop pertama.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji Penguasaan List & Loop 🎯</h2>
                        <div class="slide-text">
                            <p>Ujilah pemahamanmu tentang perulangan dan akumulator:</p>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Berapakah nilai akhir dari variabel <code>saldo</code> setelah perulangan berikut selesai?</div>
                                <div class="code-box" style="margin: 8px 0 14px;">
saldo = <span class="code-num">1000</span>
<span class="code-kw">for</span> i <span class="code-kw">in</span> [<span class="code-num">500</span>, <span class="code-num">200</span>, <span class="code-num">300</span>]:
    saldo += i
                                </div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs03-q1', 'Benar!', 'Salah! Jangan lupa saldo awal sudah bernilai 1000 sebelum loop dimulai!')">A. 1000</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-hs03-q1', 'Tepat sekali! 1000 + 500 + 200 + 300 = 2000!', 'Salah!')">B. 2000</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs03-q1', 'Benar!', 'Salah! 1500 hanya hasil setelah putaran pertama (1000 + 500).')">C. 1500</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs03-q1', 'Benar!', 'Salah! 300 hanyalah elemen terakhir dalam list.')">D. 300</div>
                                </div>
                                <div class="quiz-feedback" id="fb-hs03-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju hs-3-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Otomasi & Loop">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Bekal Menuju Modul 3 🚀</h2>
                        <div class="slide-text">
                            <p>Hebat! Kini kamu tidak lagi takut memproses data dalam jumlah besar:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>List <code>[ ]</code> menyimpan banyak data berurut (indeks mulai dari 0)</li>
                                        <li>Perulangan <code>for item in list:</code> otomatis memproses tiap data</li>
                                        <li><code>range(start, stop)</code> membuat deret angka tanpa angka stop</li>
                                        <li>Pola accumulator: <code>total += biaya</code> untuk menjumlahkan isi list</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Menuju Modul Loop & Optimasi (hs-3-1 s.d. hs-3-4):</h3>
                                    <p>Di video berikutnya, kamu akan belajar cara menghentikan loop di tengah jalan (<code>break</code>), melewatkan data rusak (<code>continue</code>), dan mengoptimalkan performa algoritma keuanganmu!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai untuk melanjutkan! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_hs03 = """
        let currentStepHS03 = 0;
        const dataTrxHS03 = [10000, 25000, 40000];
        let runningTotalHS03 = 0;
        
        function stepLoopHS03() {
            const body = document.getElementById('trace-body-hs03');
            const status = document.getElementById('hs03-status');
            if (currentStepHS03 >= dataTrxHS03.length) {
                status.innerText = ">>> Loop Selesai! Semua elemen dalam list telah diproses. Total Akhir = Rp " + runningTotalHS03.toLocaleString('id-ID');
                return;
            }
            const val = dataTrxHS03[currentStepHS03];
            const oldTotal = runningTotalHS03;
            runningTotalHS03 += val;
            currentStepHS03++;
            
            const tr = document.createElement('tr');
            tr.innerHTML = "<td>Putaran " + currentStepHS03 + "</td>" +
                           "<td>Rp " + val.toLocaleString('id-ID') + "</td>" +
                           "<td><code>" + oldTotal + " + " + val + "</code></td>" +
                           "<td style='font-weight: bold; color: #2E7D32;'>Rp " + runningTotalHS03.toLocaleString('id-ID') + "</td>";
            body.appendChild(tr);
            
            status.innerText = ">>> [Iterasi " + currentStepHS03 + "]: Mengambil biaya Rp " + val.toLocaleString('id-ID') + ". Total bertambah menjadi Rp " + runningTotalHS03.toLocaleString('id-ID');
        }
        
        function resetLoopHS03() {
            currentStepHS03 = 0;
            runningTotalHS03 = 0;
            document.getElementById('trace-body-hs03').innerHTML = "<tr><td>Inisialisasi</td><td>-</td><td><code>total = 0</code></td><td>Rp 0</td></tr>";
            document.getElementById('hs03-status').innerText = "Status: Tracer direset. Tekan tombol 'Langkah Berikutnya' untuk mulai lagi.";
        }
"""

html_hs03 = build_html(
    "Materi Jembatan 03 SMA: Mengulang Tanpa Bosan: List dan For Loop",
    "LIST & FOR LOOP",
    "Struktur Data List & Pola Akumulator",
    slides_hs03,
    scripts_hs03
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-03.html"), "w", encoding="utf-8") as f:
    f.write(html_hs03)

print("Saved bridge-hs-03.html")

# ==============================================================================
# 4. bridge-hs-04.html (SMA 04: Fungsi: Mesin Cetak Kode Mandiri)
# ==============================================================================
slides_hs04 = """
            <!-- Slide 1: Prinsip DRY -->
            <div class="slide active" data-title="FUNGSI DI PYTHON" data-subtitle="Mesin Cetak Kode Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Prinsip DRY: Jangan Ulangi Dirimu Sendiri! 🔄</h2>
                        <div class="slide-text">
                            <p>Dalam dunia rekayasa perangkat lunak, ada prinsip terkenal bernama <strong>DRY (Don't Repeat Yourself)</strong>. Bayangkan jika tokomu memiliki rumus hitung pajak dan diskon 5 baris. Apakah kamu akan menyalin-tempel 5 baris kode itu di 50 tempat berbeda?</p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--red); background: #FFEBEE;">
                                    <h3>❌ Salin-Tempel (Copy-Paste)</h3>
                                    <p>Jika suatu hari rumus diskon berubah, kamu harus mencari dan mengedit 50 tempat itu satu per satu! Sangat rawan terlewat dan memicu bug fatal.</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--green); background: #E8F5E9;">
                                    <h3>✅ Solusi: Bungkus Jadi Fungsi (Function)</h3>
                                    <p>Tulis rumusnya <strong>SATU KALI SAJA</strong> di dalam fungsi, lalu panggil nama fungsinya kapan pun dan di mana pun kamu butuh!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Anatomi Fungsi def -->
            <div class="slide" data-title="ANATOMI FUNGSI" data-subtitle="Kata Kunci def dan Parameter">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Anatomi Pembuatan Fungsi dengan def ⚙️</h2>
                        <div class="slide-text">
                            <p>Untuk merakit fungsi buatanmu sendiri di Python, gunakan kata kunci <code>def</code> (kependekan dari <em>define</em> / mendefinisikan):</p>
                            <div class="code-box">
<span class="code-kw">def</span> <span class="code-fn">hitung_diskon</span>(total_belanja, persen):
    <span class="code-cmt"># Blok badan fungsi (wajib menjorok 4 spasi)</span>
    potongan = total_belanja * (persen / <span class="code-num">100</span>)
    harga_akhir = total_belanja - potongan
    <span class="code-kw">return</span> harga_akhir
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                <h3 style="margin-bottom: 6px;">🔍 4 Bagian Penting Fungsi:</h3>
                                <ol style="margin-left: 20px; line-height: 1.6;">
                                    <li><strong>Kata Kunci <code>def</code>:</strong> Memberitahu Python bahwa kita sedang membuat cetakan fungsi baru.</li>
                                    <li><strong>Nama Fungsi:</strong> Nama panggilan fungsi (gunakan standar <code>snake_case</code>, misal: <code>hitung_diskon</code>).</li>
                                    <li><strong>Parameter di dalam <code>( )</code>:</strong> Wadah penampung data yang dibutuhkan fungsi saat dipanggil.</li>
                                    <li><strong>Titik Dua (:) & Indentasi:</strong> Menandai blok isi tubuh fungsi.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Parameter vs Argumen -->
            <div class="slide" data-title="PARAMETER VS ARGUMEN" data-subtitle="Wadah Cetakan vs Nilai Nyata">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Parameter vs Argumen: Apa Bedanya? 🥊</h2>
                        <div class="slide-text">
                            <p>Banyak pemula tertukar antara istilah <em>parameter</em> dan <em>argumen</em>. Mari kita bedakan dengan analogi cetakan kue:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #E1F5FE; border-left: 6px solid var(--blue);">
                                    <h3>📦 Parameter (Wadah Cetakan)</h3>
                                    <p>Variabel penampung yang ditulis saat <strong>mendefinisikan</strong> fungsi:</p>
                                    <div class="code-box">
<span class="code-kw">def</span> <span class="code-fn">sapa</span>(nama_nasabah):
    <span class="code-fn">print</span>(<span class="code-str">"Halo,"</span>, nama_nasabah)
                                    </div>
                                    <p>Di sini, <code>nama_nasabah</code> adalah <strong>parameter</strong> (kotak kosong yang menunggu diisi).</p>
                                </div>
                                <div class="feature-card" style="background: #FFF3E0; border-left: 6px solid var(--orange);">
                                    <h3>🧁 Argumen (Nilai Nyata)</h3>
                                    <p>Nilai konkret yang dimasukkan saat <strong>memanggil</strong> fungsi:</p>
                                    <div class="code-box">
<span class="code-fn">sapa</span>(<span class="code-str">"Ahmad"</span>)
<span class="code-fn">sapa</span>(<span class="code-str">"Jessica"</span>)
                                    </div>
                                    <p>Di sini, <code>"Ahmad"</code> dan <code>"Jessica"</code> adalah <strong>argumen</strong> nyata yang disalurkan ke fungsi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: return vs print -->
            <div class="slide" data-title="RETURN VS PRINT" data-subtitle="Perbedaan Paling Kritis di Python">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Perbedaan Krusial: return vs print() ⚡</h2>
                        <div class="slide-text">
                            <p>Ini adalah konsep yang paling sering disalahpahami oleh siswa. Perhatikan baik-baik:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #FFEBEE; border-left: 6px solid var(--red);">
                                    <h3>📺 Fungsi dengan print() Saja</h3>
                                    <div class="code-box">
<span class="code-kw">def</span> <span class="code-fn">tambah_print</span>(a, b):
    <span class="code-fn">print</span>(a + b)

hasil = <span class="code-fn">tambah_print</span>(<span class="code-num">10</span>, <span class="code-num">20</span>)
<span class="code-fn">print</span>(hasil)  <span class="code-cmt"># Output: None !</span>
                                    </div>
                                    <p><code>print()</code> hanya <strong>menampilkan ke layar kaca</strong>. Ia TIDAK mengembalikan nilai ke program! Variabel <code>hasil</code> akan bernilai kosong (<code>None</code>).</p>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                    <h3>🎁 Fungsi dengan return</h3>
                                    <div class="code-box">
<span class="code-kw">def</span> <span class="code-fn">tambah_return</span>(a, b):
    <span class="code-kw">return</span> a + b

hasil = <span class="code-fn">tambah_return</span>(<span class="code-num">10</span>, <span class="code-num">20</span>)
<span class="code-fn">print</span>(hasil + <span class="code-num">5</span>)  <span class="code-cmt"># Output: 35 !</span>
                                    </div>
                                    <p><code>return</code> <strong>menyerahkan nilai hasil kerja</strong> ke variabel pemanggil. Nilai ini bisa disimpan ke saldo kas, dihitung lagi, atau dikirim ke database!</p>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                💡 <strong>Golden Rule:</strong> Jika hasil perhitungan perlu dipakai lagi di langkah berikutnya, WAJIB gunakan <code>return</code>!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Pemanggilan Berulang -->
            <div class="slide" data-title="PEMANGGILAN BERULANG" data-subtitle="Kekuatan Modularitas Kode">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Memanggil Fungsi Berkali-Kali Tanpa Mengulang Kode 🚀</h2>
                        <div class="slide-text">
                            <p>Setelah fungsimu dibuat, kamu bisa menggunakannya seperti pabrik kalkulator pribadi:</p>
                            <div class="code-box">
<span class="code-kw">def</span> <span class="code-fn">cek_kelayakan_kredit</span>(saldo_rata2, tanggungan):
    <span class="code-kw">if</span> saldo_rata2 >= <span class="code-num">5000000</span> <span class="code-kw">and</span> tanggungan &lt;= <span class="code-num">2</span>:
        <span class="code-kw">return</span> <span class="code-str">"DISETUJUI"</span>
    <span class="code-kw">else</span>:
        <span class="code-kw">return</span> <span class="code-str">"DITINJAU_ULANG"</span>

<span class="code-cmt"># Menguji nasabah A, B, dan C dengan 1 baris saja:</span>
status_a = <span class="code-fn">cek_kelayakan_kredit</span>(<span class="code-num">7000000</span>, <span class="code-num">1</span>)  <span class="code-cmt"># DISETUJUI</span>
status_b = <span class="code-fn">cek_kelayakan_kredit</span>(<span class="code-num">3000000</span>, <span class="code-num">3</span>)  <span class="code-cmt"># DITINJAU_ULANG</span>
status_c = <span class="code-fn">cek_kelayakan_kredit</span>(<span class="code-num">9000000</span>, <span class="code-num">2</span>)  <span class="code-cmt"># DISETUJUI</span>
                            </div>
                            <p>Program menjadi sangat rapi, mudah dibaca orang lain, dan sangat mudah diperbaiki jika ada perubahan syarat di kemudian hari!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Simulasi Fungsi Mesin Diskon">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Mesin Fungsi Diskon Finansial 🧪</h2>
                        <div class="slide-text">
                            <p>Ujilah fungsi <code>hitung_diskon(belanja, persen)</code> secara langsung:</p>
                            <div class="interactive-card">
                                <div class="interactive-title">🏷️ Fungsi: hitung_diskon(belanja, persen)</div>
                                <div style="display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
                                    <div>
                                        <label style="font-weight: 700;">Nominal Belanja (Rp):</label><br>
                                        <input type="number" id="hs04-belanja" class="input-mini" value="100000" style="width: 180px;">
                                    </div>
                                    <div>
                                        <label style="font-weight: 700;">Persentase Diskon (%):</label><br>
                                        <input type="number" id="hs04-persen" class="input-mini" value="15" style="width: 140px;">
                                    </div>
                                    <div style="align-self: flex-end;">
                                        <button class="btn-action" onclick="runFunctionHS04()">Panggil Fungsi (return)</button>
                                    </div>
                                </div>
                                <div class="output-console" id="hs04-output">
>>> def hitung_diskon(total_belanja=100000, persen=15):
...     potongan = 100000 * 0.15 = 15000
...     return 100000 - 15000
>>> Nilai Return Diterima: Rp 85.000 (Bisa disimpan ke variabel bayar!)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji return vs print 🎯</h2>
                        <div class="slide-text">
                            <p>Perhatikan potongan kode di bawah ini:</p>
                            <div class="code-box">
<span class="code-kw">def</span> <span class="code-fn">hitung_pajak</span>(nominal):
    pajak = nominal * <span class="code-num">0.1</span>
    <span class="code-fn">print</span>(pajak)

total_pajak = <span class="code-fn">hitung_pajak</span>(<span class="code-num">50000</span>)
<span class="code-fn">print</span>(total_pajak)
                            </div>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Apa yang tercetak pada baris terakhir <code>print(total_pajak)</code>?</div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs04-q1', 'Benar!', 'Salah! 5000 dicetak saat baris fungsi berjalan, tapi fungsi tidak me-return nilai ke variabel total_pajak!')">A. 5000.0</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-hs04-q1', 'Tepat sekali! Karena fungsi tidak menggunakan return, variabel total_pajak akan menerima None!', 'Salah!')">B. None</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs04-q1', 'Benar!', 'Salah! Python tidak error, ia otomatis mengembalikan None jika tidak ada return.')">C. TypeError</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs04-q1', 'Benar!', 'Salah! 50000 adalah argumen input, bukan output.')">D. 50000</div>
                                </div>
                                <div class="quiz-feedback" id="fb-hs04-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju hs-3-5 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Fungsi Modular">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Bekal Menuju Modul Fungsi Lanjutan 🚀</h2>
                        <div class="slide-text">
                            <p>Selamat! Sekarang kamu memahami rahasia membangun kode yang modular dan profesional:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>Prinsip DRY: jangan menduplikasi rumus perhitungan</li>
                                        <li>Sintaks: <code>def nama_fungsi(parameter):</code></li>
                                        <li>Parameter = cetakan wadah; Argumen = nilai nyata saat pemanggilan</li>
                                        <li><code>return</code> mengembalikan nilai nyata; <code>print()</code> hanya menampilkan di layar kaca</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Menuju Video Modularisasi (hs-3-5 s.d. hs-3-7):</h3>
                                    <p>Di modul selanjutnya, kamu akan mempelajari fungsi dengan banyak parameter, nilai default parameter, dan bagaimana memecah program kasir besar menjadi fungsi-fungsi kecil yang independen!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai untuk melanjutkan! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_hs04 = """
        function runFunctionHS04() {
            const belanja = parseFloat(document.getElementById('hs04-belanja').value);
            const persen = parseFloat(document.getElementById('hs04-persen').value);
            const out = document.getElementById('hs04-output');
            
            if (isNaN(belanja) || isNaN(persen)) {
                out.innerText = ">>> Masukkan angka belanja dan persentase yang valid!";
                return;
            }
            
            const potongan = belanja * (persen / 100);
            const hargaAkhir = belanja - potongan;
            
            let log = ">>> def hitung_diskon(total_belanja=" + belanja + ", persen=" + persen + "):\\n";
            log += "...     potongan = " + belanja + " * (" + persen + "/100) = " + potongan + "\\n";
            log += "...     harga_akhir = " + belanja + " - " + potongan + " = " + hargaAkhir + "\\n";
            log += "...     return " + hargaAkhir + "\\n";
            log += ">>> Nilai Return Diterima: Rp " + hargaAkhir.toLocaleString('id-ID') + " (Berhasil disimpan ke variabel bayar!)";
            out.innerText = log;
        }
"""

html_hs04 = build_html(
    "Materi Jembatan 04 SMA: Fungsi: Mesin Cetak Kode Mandiri",
    "FUNGSI DI PYTHON",
    "Kata Kunci def & Perbedaan return vs print",
    slides_hs04,
    scripts_hs04
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-04.html"), "w", encoding="utf-8") as f:
    f.write(html_hs04)

print("Saved bridge-hs-04.html")

# ==============================================================================
# 5. bridge-hs-05.html (SMA 05: Kamus Data: Menyimpan Transaksi dengan Dictionary)
# ==============================================================================
slides_hs05 = """
            <!-- Slide 1: Keterbatasan List Tunggal -->
            <div class="slide active" data-title="DICTIONARY DATA" data-subtitle="Kamus Data Pasangan Key-Value">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Mengapa List Tunggal Tidak Cukup untuk Data Keuangan? 🤔</h2>
                        <div class="slide-text">
                            <p>Satu catatan transaksi perbankan memiliki banyak informasi yang saling terkait: tanggal, nominal uang, kategori belanja, dan catatan deskripsi. Perhatikan jika kita menggunakan list terpisah:</p>
                            <div class="code-box">
tanggal = [<span class="code-str">"01/09"</span>, <span class="code-str">"02/09"</span>, <span class="code-str">"03/09"</span>]
nominal = [<span class="code-num">25000</span>, <span class="code-num">50000</span>, <span class="code-num">15000</span>]
kategori = [<span class="code-str">"Makan"</span>, <span class="code-str">"Buku"</span>, <span class="code-str">"Transport"</span>]
                            </div>
                            <div class="feature-card" style="background: #FFEBEE; border-left: 6px solid var(--red);">
                                <h3 style="color: #C62828;">🚨 Bahaya Menggunakan List Paralel:</h3>
                                <p>Jika satu data di tengah list terhapus atau tertukar posisinya, seluruh catatan menjadi rusak! Tanggal 01/09 bisa tidak sengaja berpasangan dengan nominal buku milik orang lain.</p>
                            </div>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                💡 <strong>Solusi Elegan:</strong> Mengikat semua informasi dalam satu kesatuan data menggunakan struktur <strong>Dictionary (Kamus)</strong>!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Konsep Key-Value Pair -->
            <div class="slide" data-title="KONSEP KEY-VALUE" data-subtitle="Struktur Dictionary { }">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Konsep Pasangan Kunci dan Nilai (Key-Value Pair) 🔑</h2>
                        <div class="slide-text">
                            <p>Dictionary dibuat dengan tanda kurung kurawal <code>{ }</code>. Di dalamnya, data disimpan berpasangan: <strong>Kunci (Key) : Nilai (Value)</strong>:</p>
                            <div class="code-box">
transaksi = {
    <span class="code-str">"id"</span>: <span class="code-num">101</span>,
    <span class="code-str">"kategori"</span>: <span class="code-str">"Makanan"</span>,
    <span class="code-str">"nominal"</span>: <span class="code-num">35000</span>,
    <span class="code-str">"sukses"</span>: <span class="code-bool">True</span>
}
                            </div>
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>Bagian</th>
                                        <th>Nama</th>
                                        <th>Fungsi</th>
                                        <th>Contoh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Sebelah Kiri Titik Dua (:)</td>
                                        <td><strong>Key (Kunci)</strong></td>
                                        <td>Nama label unik untuk mencari data (biasanya teks string)</td>
                                        <td><code>"kategori"</code>, <code>"nominal"</code></td>
                                    </tr>
                                    <tr>
                                        <td>Sebelah Kanan Titik Dua (:)</td>
                                        <td><strong>Value (Nilai)</strong></td>
                                        <td>Isi data sesungguhnya (bisa berupa angka, teks, atau boolean)</td>
                                        <td><code>"Makanan"</code>, <code>35000</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Akses dan Update Nilai -->
            <div class="slide" data-title="AKSES & UPDATE" data-subtitle="Membaca dan Mengubah Isi Dictionary">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Cara Mengakses dan Memperbarui Nilai Dictionary 🎯</h2>
                        <div class="slide-text">
                            <p>Pada list biasa kita memanggil indeks angka (<code>list[0]</code>). Pada dictionary, kita memanggil <strong>nama kuncinya (Key)</strong>!</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                    <h3>📖 Membaca Nilai</h3>
                                    <div class="code-box">
biaya = transaksi[<span class="code-str">"nominal"</span>]
<span class="code-fn">print</span>(biaya)  <span class="code-cmt"># Output: 35000</span>
                                    </div>
                                    <p>Sangat mudah dibaca oleh manusia! Kita langsung tahu bahwa kita sedang mengambil nilai nominal.</p>
                                </div>
                                <div class="feature-card" style="background: #FFF3E0; border-left: 6px solid var(--orange);">
                                    <h3>✏️ Mengubah / Menambah Nilai</h3>
                                    <div class="code-box">
transaksi[<span class="code-str">"nominal"</span>] = <span class="code-num">40000</span>  <span class="code-cmt"># Update</span>
transaksi[<span class="code-str">"metode"</span>] = <span class="code-str">"QRIS"</span>    <span class="code-cmt"># Tambah key baru</span>
                                    </div>
                                    <p>Jika key sudah ada, nilainya diupdate. Jika belum ada, Python otomatis membuatkan key baru!</p>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFEBEE; border-left: 6px solid var(--red);">
                                🚨 <strong>Awas KeyError:</strong> Jika kamu memanggil key yang tidak ada, misal <code>transaksi["alamat"]</code>, Python akan melempar <em>KeyError</em>!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: List of Dictionaries -->
            <div class="slide" data-title="LIST OF DICTIONARIES" data-subtitle="Struktur Basis Data Transaksi">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Standar Industri: List of Dictionaries (Buku Kas) 📊</h2>
                        <div class="slide-text">
                            <p>Bagaimana aplikasi perbankan profesional menyimpan puluhan riwayat mutasi nasabah? Mereka menggabungkan <strong>List</strong> dan <strong>Dictionary</strong>:</p>
                            <div class="code-box">
riwayat_mutasi = [
    {<span class="code-str">"id"</span>: <span class="code-num">1</span>, <span class="code-str">"jenis"</span>: <span class="code-str">"Kredit"</span>, <span class="code-str">"nominal"</span>: <span class="code-num">500000</span>, <span class="code-str">"ket"</span>: <span class="code-str">"Gaji Bulanan"</span>},
    {<span class="code-str">"id"</span>: <span class="code-num">2</span>, <span class="code-str">"jenis"</span>: <span class="code-str">"Debit"</span>,  <span class="code-str">"nominal"</span>: <span class="code-num">25000</span>,  <span class="code-str">"ket"</span>: <span class="code-str">"Makan Siang"</span>},
    {<span class="code-str">"id"</span>: <span class="code-num">3</span>, <span class="code-str">"jenis"</span>: <span class="code-str">"Debit"</span>,  <span class="code-str">"nominal"</span>: <span class="code-num">50000</span>,  <span class="code-str">"ket"</span>: <span class="code-str">"Beli Buku"</span>}
]
                            </div>
                            <p>Struktur ini menyerupai tabel database nyata: List adalah baris-baris tabelnya, dan Dictionary adalah kolom-kolom data pada setiap baris!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Menambah Data dengan append() -->
            <div class="slide" data-title="METHOD APPEND()" data-subtitle="Mencatat Transaksi Baru">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Menambahkan Transaksi Baru dengan .append() ➕</h2>
                        <div class="slide-text">
                            <p>Setiap kali pengguna selesai berbelanja, aplikasi kita membuat dictionary transaksi baru dan memasukkannya ke dalam list riwayat dengan metode <code>.append()</code>:</p>
                            <div class="code-box">
<span class="code-cmt"># 1. Buat catatan transaksi baru</span>
transaksi_baru = {
    <span class="code-str">"id"</span>: <span class="code-num">4</span>,
    <span class="code-str">"jenis"</span>: <span class="code-str">"Debit"</span>,
    <span class="code-str">"nominal"</span>: <span class="code-num">15000</span>,
    <span class="code-str">"ket"</span>: <span class="code-str">"Kopi Sore"</span>
}

<span class="code-cmt"># 2. Masukkan ke dalam buku mutasi</span>
riwayat_mutasi.<span class="code-fn">append</span>(transaksi_baru)

<span class="code-fn">print</span>(<span class="code-str">"Total mutasi sekarang:"</span>, <span class="code-fn">len</span>(riwayat_mutasi))  <span class="code-cmt"># Output: 4</span>
                            </div>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                💡 <strong>Looping List of Dicts:</strong> Kamu bisa menggabungkannya dengan perulangan <code>for t in riwayat_mutasi: print(t["ket"], t["nominal"])</code> untuk mencetak laporan rekening koran!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Simulator Buku Kas Digital">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Buku Kas Digital Interaktif 🧪</h2>
                        <div class="slide-text">
                            <p>Coba tambahkan transaksi baru dan lihat bagaimana Python menyusun Dictionary dan List of Dicts:</p>
                            <div class="interactive-card">
                                <div class="interactive-title">📒 Buku Kas Mutasi Keuangan</div>
                                <div style="display: flex; gap: 14px; margin-bottom: 12px; flex-wrap: wrap;">
                                    <div>
                                        <label style="font-weight: 700;">Keterangan Belanja:</label><br>
                                        <input type="text" id="hs05-ket" class="input-mini" value="Beli Kuota Internet" style="width: 200px;">
                                    </div>
                                    <div>
                                        <label style="font-weight: 700;">Nominal (Rp):</label><br>
                                        <input type="number" id="hs05-nominal" class="input-mini" value="50000" style="width: 150px;">
                                    </div>
                                    <div style="align-self: flex-end;">
                                        <button class="btn-action" onclick="addTrxHS05()">Catat (.append())</button>
                                    </div>
                                </div>
                                <div class="output-console" id="hs05-output" style="max-height: 140px; overflow-y: auto;">
>>> riwayat_mutasi = [
    {"id": 1, "ket": "Saldo Awal", "nominal": 200000, "tipe": "Kredit"}
]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji Akses Dictionary 🎯</h2>
                        <div class="slide-text">
                            <p>Perhatikan potongan struktur data transaksi berikut:</p>
                            <div class="code-box">
akun = {
    <span class="code-str">"nama"</span>: <span class="code-str">"Budi Santoso"</span>,
    <span class="code-str">"saldo"</span>: <span class="code-num">750000</span>,
    <span class="code-str">"tier"</span>: <span class="code-str">"Gold"</span>
}
                            </div>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Bagaimanakah sintaks Python yang benar untuk mengambil nilai saldo dari dictionary akun?</div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs05-q1', 'Benar!', 'Salah! [1] adalah cara akses indeks list, bukan key dictionary!')">A. akun[1]</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-hs05-q1', 'Tepat sekali! Memanggil key dictionary menggunakan tanda kurung siku dan nama kuncinya: akun[\"saldo\"]!', 'Salah!')">B. akun["saldo"]</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs05-q1', 'Benar!', 'Salah! Tanda kurung bulat () digunakan untuk pemanggilan fungsi, bukan dictionary.')">C. akun("saldo")</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-hs05-q1', 'Benar!', 'Salah! Key adalah string teks, sehingga membutuhkan tanda petik.')">D. akun.get_saldo</div>
                                </div>
                                <div class="quiz-feedback" id="fb-hs05-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju hs-4-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Proyek Aplikasi">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Pintu Masuk Proyek Aplikasi Finansial 🚀</h2>
                        <div class="slide-text">
                            <p>Luar biasa! Seluruh pondasi komputasi tingkat SMA kini telah lengkap di tanganmu:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>Dictionary <code>{key: value}</code> menyimpan data berpasangan</li>
                                        <li>Akses nilai menggunakan kunci: <code>data["key"]</code></li>
                                        <li>List of Dictionaries merepresentasikan tabel transaksi keuangan</li>
                                        <li>Metode <code>.append()</code> memasukkan catatan transaksi baru</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Siap Membangun Proyek Finansial (hs-4 & hs-5):</h3>
                                    <p>Dengan menguasai Variabel, Input/Output, Conditional If-Else, For Loop, Function, dan Dictionary, kamu sekarang 100% siap membangun aplikasi <strong>UOB Financial Literacy Manager</strong> yang aman dan interaktif!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik selesai untuk mulai mengerjakan proyekmu! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_hs05 = """
        const listTrxHS05 = [
            {"id": 1, "ket": "Saldo Awal", "nominal": 200000, "tipe": "Kredit"}
        ];
        
        function addTrxHS05() {
            const ket = document.getElementById('hs05-ket').value.trim();
            const nominal = parseInt(document.getElementById('hs05-nominal').value);
            const out = document.getElementById('hs05-output');
            
            if (!ket || isNaN(nominal)) {
                alert("Mohon masukkan keterangan dan nominal yang valid!");
                return;
            }
            
            const newTrx = {
                "id": listTrxHS05.length + 1,
                "ket": ket,
                "nominal": nominal,
                "tipe": "Debit"
            };
            listTrxHS05.push(newTrx);
            
            out.innerText = ">>> riwayat_mutasi = " + JSON.stringify(listTrxHS05, null, 2);
        }
"""

html_hs05 = build_html(
    "Materi Jembatan 05 SMA: Kamus Data: Menyimpan Transaksi dengan Dictionary",
    "DICTIONARY DATA",
    "Pasangan Key-Value & List of Dictionaries",
    slides_hs05,
    scripts_hs05
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-hs-05.html"), "w", encoding="utf-8") as f:
    f.write(html_hs05)

print("Saved bridge-hs-05.html")

# ==============================================================================
# 6. bridge-ms-00.html (SMP 00 Revisi Bersih: Tur UI & Live Testing TANPA TinyDB)
# ==============================================================================
print("Generating clean bridge-ms-00.html...")
with open(os.path.join(BASE_DIR, "slides", "bridge-ms-00.html"), "r", encoding="utf-8") as f:
    orig_ms00 = f.read()

# Replace banner subtitle or kicker mentioning TinyDB
clean_ms00 = orig_ms00.replace(
    "Materi Jembatan 00 • Fondasi Desain UI, Balok Logika, dan TinyDB",
    "Materi Jembatan 00 • Fondasi Desain UI, Balok Logika & Uji Proyek"
)
clean_ms00 = clean_ms00.replace(
    "<li><strong>Dukungan Fitur Canggih</strong>: Dilengkapi akses kamera HP, sensor gerak, perekam suara, database lokal (TinyDB), hingga chatbot AI cerdas!</li>",
    "<li><strong>Dukungan Fitur Canggih</strong>: Dilengkapi akses kamera HP, sensor gerak, perekam suara, logika interaktif cerdas, hingga koneksi internet!</li>"
)
clean_ms00 = clean_ms00.replace(
    "<li><strong>TinyDB</strong>: Memori penyimpan data agar saldo tidak hilang saat aplikasi ditutup.</li>",
    "<li><strong>Live Testing</strong>: Menjalankan dan menguji aplikasi langsung di layar HP secara real-time.</li>"
)
clean_ms00 = clean_ms00.replace(
    "📸 <em>Tangkapan layar nyata: Blocks Editor proyek nyata dengan laci balok built-in dan balok logika event tombol serta TinyDB.</em>",
    "📸 <em>Tangkapan layar nyata: Blocks Editor proyek nyata dengan laci balok logika event tombol dan pengatur teks.</em>"
)
clean_ms00 = clean_ms00.replace(
    '<span class="block-badge block-tinydb">Storage / TinyDB (Ungu)</span>',
    '<span class="block-badge" style="background: #00BCD4; color: white;">Colors (Biru Muda)</span>'
)

# Replace Slide 11, 12, 13, 14, 15
clean_slide_testing = """            <!-- Slide 11: Langkah 8 - Uji Coba di HP dengan AI Companion -->
            <div class="slide" data-title="LANGKAH 8: TESTING DI HP" data-subtitle="MIT AI Companion">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">Langkah 8: Menguji Aplikasi Langsung di HP Android 📲</h2>
                        <div class="slide-text">
                            <p>Kamu tidak perlu kabel data rumit untuk mencoba aplikasimu! Ikuti 4 langkah kilat ini untuk melihat aplikasimu hidup di layar HP:</p>

                            <div style="display: flex; flex-direction: column; gap: 12px; margin: 18px 0;">
                                <div class="feature-card" style="display: flex; align-items: center; gap: 16px;">
                                    <div style="background: var(--yellow); color: black; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 20px; border: 3px solid var(--black);">1</div>
                                    <div style="font-size: 17px;">Download aplikasi gratis <strong>MIT AI2 Companion</strong> di Google Play Store pada HP Android-mu.</div>
                                </div>
                                <div class="feature-card" style="display: flex; align-items: center; gap: 16px;">
                                    <div style="background: var(--blue); color: white; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 20px; border: 3px solid var(--black);">2</div>
                                    <div style="font-size: 17px;">Pastikan laptop dan HP terhubung ke <strong>jaringan Wi-Fi yang sama</strong>.</div>
                                </div>
                                <div class="feature-card" style="display: flex; align-items: center; gap: 16px;">
                                    <div style="background: var(--green); color: black; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 20px; border: 3px solid var(--black);">3</div>
                                    <div style="font-size: 17px;">Di layar komputer App Inventor, klik menu atas: <strong>Connect ▶ AI Companion</strong> hingga muncul QR Code.</div>
                                </div>
                                <div class="feature-card" style="display: flex; align-items: center; gap: 16px;">
                                    <div style="background: var(--pink); color: white; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 20px; border: 3px solid var(--black);">4</div>
                                    <div style="font-size: 17px;">Buka aplikasi di HP, pilih <strong>Scan QR Code</strong>. Aplikasi langsung menyala di HP-mu secara ajaib! ✨</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 12: Interactive Simulation Live Testing -->
            <div class="slide" data-title="SIMULASI TESTING" data-subtitle="Uji Tombol & Pesan di Layar HP">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">Laboratorium Mini: Simulasi Live Testing di Layar HP 🧪</h2>
                        <div class="slide-text">
                            <p>Coba uji bagaimana balok tombol dan perubahan teks bekerja di layar ponsel virtual di bawah ini:</p>

                            <div class="playground-card" style="max-width: 500px; margin: 15px auto; text-align: center;">
                                <div style="background: #333; color: white; padding: 8px; border-radius: 12px 12px 0 0; font-weight: 700;">
                                    📱 Layar HP: Proyek Pertamaku
                                </div>
                                <div style="background: white; border: 3px solid #333; border-top: none; padding: 30px 20px; border-radius: 0 0 12px 12px;">
                                    <div id="phone-label-output" style="font-size: 20px; font-weight: 700; color: #1565C0; margin-bottom: 25px; min-height: 50px; display: flex; align-items: center; justify-content: center; border: 2px dashed #90CAF9; border-radius: 8px; padding: 10px;">
                                        Selamat datang di App Inventor!
                                    </div>
                                    <button class="btn-action-custom" style="width: 100%; font-size: 18px;" onclick="testButtonLive()">
                                        👆 Klik Saya (Button1)
                                    </button>
                                </div>
                            </div>

                            <p style="font-size: 16px; color: #555; text-align: center;">💡 <em>Saat tombol diklik, balok <code>when Button1.Click</code> akan mengubah teks pada <code>Label1.Text</code> secara seketika!</em></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 13: Kuis Pemahaman Mandiri Bersih -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Check Kesiapan Siswa">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">Uji Pemahaman: Cek Kesiapan Belajar SMP! 🎯</h2>
                        <div class="slide-text">
                            <p>Jawablah pertanyaan berikut untuk memastikan kamu siap membuat aplikasi mobile:</p>

                            <div style="background: #F8FAFC; border: 3px solid var(--black); padding: 18px; border-radius: 14px; margin-bottom: 20px;">
                                <div style="font-weight: 700; font-size: 20px; margin-bottom: 12px;">
                                    Pertanyaan 1: Di bagian manakah kita mengatur warna tombol dan ukuran teks?
                                </div>
                                <div class="quiz-option" onclick="checkQ1_SMP('wrong', this)">A. Palette</div>
                                <div class="quiz-option" onclick="checkQ1_SMP('wrong', this)">B. Viewer</div>
                                <div class="quiz-option" onclick="checkQ1_SMP('correct', this)">C. Properties</div>
                                <div class="quiz-option" onclick="checkQ1_SMP('wrong', this)">D. Blocks Built-in</div>
                                <div id="q1-smp-feedback" style="display: none; margin-top: 10px; font-weight: bold; font-size: 17px; padding: 10px; border-radius: 8px;"></div>
                            </div>

                            <div style="background: #F8FAFC; border: 3px solid var(--black); padding: 18px; border-radius: 14px;">
                                <div style="font-weight: 700; font-size: 20px; margin-bottom: 12px;">
                                    Pertanyaan 2: Di manakah kita merakit logika balok agar tombol bisa bereaksi saat ditekan jari?
                                </div>
                                <div class="quiz-option" onclick="checkQ2_SMP_Clean('correct', this)">A. Di Blocks Editor (layar perakitan balok)</div>
                                <div class="quiz-option" onclick="checkQ2_SMP_Clean('wrong', this)">B. Di Google Drive</div>
                                <div class="quiz-option" onclick="checkQ2_SMP_Clean('wrong', this)">C. Di Pengaturan HP</div>
                                <div class="quiz-option" onclick="checkQ2_SMP_Clean('wrong', this)">D. Di Palette User Interface</div>
                                <div id="q2-smp-feedback" style="display: none; margin-top: 10px; font-weight: bold; font-size: 17px; padding: 10px; border-radius: 8px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 14: Glosarium Bersih -->
            <div class="slide" data-title="GLOSARIUM SMP" data-subtitle="Istilah Kunci App Inventor">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">Glosarium Cepat & Tips Sukses Koding 💡</h2>
                        <div class="slide-text">
                            <p>Rangkuman istilah penting di dunia aplikasi mobile App Inventor:</p>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0;">
                                <div class="feature-card">
                                    <strong>Designer</strong><br>
                                    Layar perancangan visual antarmuka tombol, teks, gambar, dan warna.
                                </div>
                                <div class="feature-card">
                                    <strong>Blocks Editor</strong><br>
                                    Ruang perakitan logika balok kejadian (otak kerja aplikasi).
                                </div>
                                <div class="feature-card">
                                    <strong>Component</strong><br>
                                    Elemen aplikasi seperti Button (tombol), TextBox (kolom ketik), dan Label.
                                </div>
                                <div class="feature-card">
                                    <strong>AI Companion</strong><br>
                                    Aplikasi di HP untuk menguji kode proyek secara langsung tanpa kabel.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 15: Penutup -->
            <div class="slide" data-title="SELESAI" data-subtitle="Menuju Modul 1">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">Hore! Kamu Siap Menjadi Pengembang Aplikasi! 🚀</h2>
                        <div class="slide-text">
                            <p>Kini kamu sudah paham perbedaan Designer & Blocks, cara menghubungkan HP, dan siap membuat aplikasi pertamamu!</p>
                            <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green); margin-top: 20px;">
                                <h3 style="color: #2E7D32;">🎯 Langkah Selanjutnya:</h3>
                                <p>Klik tombol <strong>Lanjut</strong> di LMS untuk memulai Modul 1: Merancang antarmuka form input yang aman dan menarik!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>"""

# Replace the slides 11 to 16 in clean_ms00 using regex
pattern = r'<!-- Slide 11: Langkah 8 - Mengenal Database TinyDB -->[\s\S]*?<!-- Slide 16: Penutup & Menuju Modul 1 -->[\s\S]*?</div>\s*</div>\s*</div>'
clean_ms00 = re.sub(pattern, clean_slide_testing, clean_ms00)

# Replace Javascript logic for TinyDB with testButtonLive
old_js = """        // Virtual TinyDB Memory Simulation
        const virtualTinyDB = {};

        function simpanTinyDB() {
            const tag = document.getElementById('db-tag').value.trim();
            const val = document.getElementById('db-value').value.trim();
            const out = document.getElementById('db-output');

            if (!tag || !val) {
                out.innerHTML = "⚠️ Harap isi nama Tag dan Nilai terlebih dahulu!";
                out.style.borderLeft = "6px solid var(--red)";
                return;
            }

            virtualTinyDB[tag] = val;
            out.innerHTML = `
                ✅ <strong>TinyDB1.StoreValue BERHASIL!</strong><br>
                Data tersimpan di memori HP:<br>
                • <strong>Tag:</strong> "${tag}"<br>
                • <strong>ValueToStore:</strong> ${val}
            `;
            out.style.borderLeft = "6px solid var(--green)";
        }

        function bacaTinyDB() {
            const tag = document.getElementById('db-tag').value.trim();
            const out = document.getElementById('db-output');

            if (tag in virtualTinyDB) {
                const val = virtualTinyDB[tag];
                out.innerHTML = `
                    📖 <strong>TinyDB1.GetValue DITEMUKAN!</strong><br>
                    • <strong>Tag:</strong> "${tag}"<br>
                    • <strong>Value:</strong> <span style="color: #4CAF50; font-size: 20px; font-weight: bold;">${val}</span>
                `;
                out.style.borderLeft = "6px solid var(--blue)";
            } else {
                out.innerHTML = `
                    🔍 <strong>Tag "${tag}" Tidak Ditemukan!</strong><br>
                    TinyDB mengembalikan nilai default (valueIfTagNotThere): <strong>0</strong>
                `;
                out.style.borderLeft = "6px solid var(--yellow)";
            }
        }"""

new_js = """        let clickCountSMP = 0;
        function testButtonLive() {
            clickCountSMP++;
            const label = document.getElementById('phone-label-output');
            label.innerHTML = "🎉 Tombol berhasil diklik (" + clickCountSMP + "x)!<br><span style='font-size:16px; color:#2E7D32;'>Balok when Button1.Click berjalan sempurna!</span>";
            label.style.backgroundColor = "#E8F5E9";
            label.style.borderColor = "#4CAF50";
        }

        function checkQ2_SMP_Clean(status, elem) {
            const parent = elem.parentElement;
            parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected-correct', 'selected-wrong'));
            const fb = document.getElementById('q2-smp-feedback');
            fb.style.display = "block";
            if (status === 'correct') {
                elem.classList.add('selected-correct');
                fb.innerHTML = "✅ BENAR! Blocks Editor adalah ruang kerja khusus di mana kita menyusun balok-balok logika untuk menentukan apa yang terjadi saat tombol diklik.";
                fb.style.backgroundColor = "var(--green)";
                fb.style.color = "var(--black)";
            } else {
                elem.classList.add('selected-wrong');
                fb.innerHTML = "❌ Kurang tepat! Layar untuk menyusun balok logika adalah Blocks Editor.";
                fb.style.backgroundColor = "var(--red)";
                fb.style.color = "var(--white)";
            }
        }"""

clean_ms00 = clean_ms00.replace(old_js, new_js)

with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-00.html"), "w", encoding="utf-8") as f:
    f.write(clean_ms00)

print("Saved clean bridge-ms-00.html (TinyDB removed from Orientation!)")

# ==============================================================================
# 7. bridge-ms-01.html (SMP 01: Event Tombol, Properti, dan Variabel Blok)
# ==============================================================================
slides_ms01 = """
            <!-- Slide 1: Paradigma Event-Driven -->
            <div class="slide active" data-title="LOGIKA APLIKASI" data-subtitle="Event-Driven Programming">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Bagaimana Aplikasi Mobile Bekerja? ⚡</h2>
                        <div class="slide-text">
                            <p>Aplikasi di ponsel tidak berjalan lurus seperti membaca novel dari halaman pertama ke halaman terakhir. Aplikasi ponsel bersifat <strong>Event-Driven (Digerakkan oleh Kejadian)</strong>!</p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--yellow); background: #FFFDE7;">
                                    <h3>⏳ Kondisi Standby (Mendengarkan)</h3>
                                    <p>Saat aplikasi terbuka di layar HP, ia diam menunggu aksi pengguna: ketukan jari, sapuan layar (swipe), atau guncangan sensor HP.</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--green); background: #E8F5E9;">
                                    <h3>🔔 Kejadian (Event) ➔ Aksi (Action)</h3>
                                    <p>Begitu jari menyentuh tombol, <em>Event</em> terpicu. Komputer langsung mencari balok logika yang bertugas merespons sentuhan tersebut!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Blok when Button.Click -->
            <div class="slide" data-title="BLOK EMAS EVENT" data-subtitle="when Button.Click do">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Balok Sakti Utama: when Button.Click do 🟡</h2>
                        <div class="slide-text">
                            <p>Di App Inventor, balok berwarna kuning-emas berkepala cembung disebut <strong>Event Handler</strong>:</p>
                            <div style="background: #FFF8E1; border: 3px solid #FFA000; padding: 18px; border-radius: 14px; margin: 16px 0;">
                                <span class="badge-block badge-event" style="font-size: 18px;">when Button1 . Click do</span>
                                <div style="margin-left: 30px; margin-top: 10px; border-left: 4px dashed #FFA000; padding-left: 15px; color: #555;">
                                    👉 <em>(Semua balok aksi yang diletakkan di dalam lekukan ini HANYA AKAN JALAN saat tombol diklik!)</em>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFEBEE; border-left: 6px solid var(--red);">
                                ⚠️ <strong>Peringatan Pemula:</strong> Jangan biarkan balok aksi berdiri sendirian di ruang kosong tanpa dibungkus balok event, karena komputer tidak akan pernah tahu kapan harus menjalankannya!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Membaca Input TextBox.Text -->
            <div class="slide" data-title="MEMBACA INPUT" data-subtitle="Balok Hijau Muda TextBox.Text">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Mengambil Ketikan Pengguna: TextBox.Text ⌨️</h2>
                        <div class="slide-text">
                            <p>Pengguna memasukkan nominal uang atau nama nasabah melalui komponen <strong>TextBox</strong>. Untuk membaca apa yang sedang tertulis di dalamnya, kita gunakan balok Getter berwarna hijau muda:</p>
                            <div style="margin: 18px 0;">
                                <span class="badge-block badge-prop" style="font-size: 17px; background: #8BC34A; color: black;">TextBox1 . Text</span>
                            </div>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                <h3 style="margin-bottom: 6px;">💡 Konsep Getter:</h3>
                                <p>Balok hijau muda berbentuk puzzle yang menonjol ke kiri ini bertugas <strong>"mengambil" (get)</strong> data teks dari layar dan menyalurkannya ke balok proses lainnya.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: Menampilkan Output Label.Text -->
            <div class="slide" data-title="MENAMPILKAN OUTPUT" data-subtitle="Balok Hijau Tua set Label.Text to">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Menampilkan Hasil ke Layar: set Label.Text to 📺</h2>
                        <div class="slide-text">
                            <p>Setelah komputer memproses data, kita ingin pengguna melihat hasilnya di layar HP. Kita gunakan komponen <strong>Label</strong> dengan balok Setter berwarna hijau tua:</p>
                            <div style="margin: 18px 0;">
                                <span class="badge-block badge-prop" style="font-size: 17px; background: #2E7D32;">set Label1 . Text to</span>
                            </div>
                            <div class="feature-card" style="background: #E1F5FE; border-left: 6px solid var(--blue);">
                                <h3 style="margin-bottom: 6px;">💡 Konsep Setter:</h3>
                                <p>Balok hijau tua berbentuk lekukan ke kanan ini bertugas <strong>"mengubah" (set)</strong> tulisan yang terpajang di layar HP dengan teks baru yang kita tentukan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Balok join & Variabel Sementara -->
            <div class="slide" data-title="MERANGKAI KATA" data-subtitle="Balok join & Variabel Sementara">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Balok join & Variabel Memori Sementara 🧩</h2>
                        <div class="slide-text">
                            <p>Bagaimana cara membuat sapaan seperti: <em>"Halo, [Nama Siswa]! Saldomu aman."</em>? Kita gunakan balok <strong>join</strong> berwarna ungu dari laci Text:</p>
                            <div style="background: #F3E5F5; border: 3px solid #9C27B0; padding: 16px; border-radius: 12px; margin: 16px 0;">
                                <span class="badge-block badge-text" style="font-size: 17px;">join</span>
                                <div style="margin-left: 20px; margin-top: 8px;">
                                    • Potongan 1: <span class="badge-block badge-text">"Halo, "</span><br>
                                    • Potongan 2: <span class="badge-block badge-prop" style="background: #8BC34A; color: black;">TextBox1 . Text</span><br>
                                    • Potongan 3: <span class="badge-block badge-text">"! Selamat belajar."</span>
                                </div>
                            </div>
                            <p>Jika kita ingin menyimpan nilai sementara di dalam otak aplikasi, kita gunakan balok oranye: <span class="badge-block badge-var">initialize global nama to</span>.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Simulator Sapaan Interaktif">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Simulator Tombol Sapaan Cerdas 🧪</h2>
                        <div class="slide-text">
                            <p>Coba ketik namamu dan klik tombol untuk melihat bagaimana balok <code>Button1.Click</code>, <code>TextBox1.Text</code>, dan <code>join</code> bersatu menghasilkan respon di layar:</p>
                            <div class="interactive-card" style="max-width: 550px; margin: 15px auto;">
                                <div style="background: #333; color: white; padding: 10px; border-radius: 12px 12px 0 0; font-weight: 700;">
                                    📱 Layar HP: Aplikasi Sapaan UOB
                                </div>
                                <div style="background: white; border: 3px solid #333; border-top: none; padding: 25px; border-radius: 0 0 12px 12px;">
                                    <label style="font-weight: 700; font-size: 15px;">Ketik Nama Siswa (TextBox1):</label><br>
                                    <input type="text" id="ms01-nama" class="input-mini" style="width: 100%; margin-bottom: 15px;" value="Ahmad Yazid">
                                    
                                    <button class="btn-action" style="width: 100%; margin-bottom: 20px; font-size: 17px;" onclick="runAppMS01()">
                                        🔔 Klik Tombol Sapa (Button1)
                                    </button>
                                    
                                    <div style="font-size: 14px; font-weight: 700; color: #666; margin-bottom: 6px;">Output Layar (Label1):</div>
                                    <div id="ms01-label" style="min-height: 50px; border: 3px dashed #4CAF50; border-radius: 10px; padding: 12px; font-size: 18px; font-weight: 700; color: #2E7D32; background: #E8F5E9; display: flex; align-items: center; justify-content: center;">
                                        Menunggu klik tombol...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji Balok Event & Output 🎯</h2>
                        <div class="slide-text">
                            <p>Pilihlah jawaban yang paling tepat:</p>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Kapan balok-balok yang diletakkan di dalam <code>when Button1.Click do</code> akan dijalankan?</div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms01-q1', 'Benar!', 'Salah! Balok tidak jalan terus menerus, ia menunggu tombol ditekan.')">A. Setiap 1 detik sekali secara otomatis</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-ms01-q1', 'Tepat sekali! Balok event hanya akan aktif dan mengeksekusi isinya saat tombol ditekan oleh jari pengguna!', 'Salah!')">B. Hanya saat tombol ditekan oleh jari pengguna</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms01-q1', 'Benar!', 'Salah! Balok event membutuhkan pemicu sentuhan tombol.')">C. Saat laptop ditutup</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms01-q1', 'Benar!', 'Salah! Balok tidak jalan sebelum ada sentuhan tombol.')">D. Saat proyek baru dibuat di Designer</div>
                                </div>
                                <div class="quiz-feedback" id="fb-ms01-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju ms-1-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Form Input Aman">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Bekal Menuju Modul 1 🚀</h2>
                        <div class="slide-text">
                            <p>Kini kamu telah memahami cara memberi "nyawa" pada antarmuka aplikasimu:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>Event-Driven: JIKA ADA KEJADIAN ➔ LAKUKAN TINDAKAN</li>
                                        <li><code>when Button.Click</code> adalah gerbang utama balok aksi</li>
                                        <li><code>TextBox.Text</code> mengambil ketikan pengguna</li>
                                        <li><code>set Label.Text</code> menampilkan hasil ke layar ponsel</li>
                                        <li>Balok <code>join</code> merangkai kata-kata menjadi kalimat</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Menuju Modul Form & Input Aman (ms-1-1 s.d. ms-1-5):</h3>
                                    <p>Di video berikutnya, kamu akan belajar cara membuat formulir keuangan yang rapi, membatasi kolom input hanya menerima angka (NumberOnly), dan menjaga privasi pengguna!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai untuk melanjutkan! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_ms01 = """
        function runAppMS01() {
            const nama = document.getElementById('ms01-nama').value.trim();
            const label = document.getElementById('ms01-label');
            if (!nama) {
                label.innerHTML = "⚠️ Harap ketik nama terlebih dahulu di TextBox1!";
                label.style.backgroundColor = "#FFEBEE";
                label.style.borderColor = "#F44336";
                label.style.color = "#C62828";
                return;
            }
            label.innerHTML = "✨ Halo, " + nama + "! Selamat datang di Finansial App!";
            label.style.backgroundColor = "#E8F5E9";
            label.style.borderColor = "#4CAF50";
            label.style.color = "#2E7D32";
        }
"""

html_ms01 = build_html(
    "Materi Jembatan 01 SMP: Event Tombol, Properti, dan Variabel Blok",
    "EVENT & LOGIKA BLOK",
    "when Button.Click, TextBox.Text, dan Label.Text",
    slides_ms01,
    scripts_ms01
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-01.html"), "w", encoding="utf-8") as f:
    f.write(html_ms01)

print("Saved bridge-ms-01.html")

# ==============================================================================
# 8. bridge-ms-02.html (SMP 02: Buku Kas Digital: Menyimpan Data dengan TinyDB)
# ==============================================================================
slides_ms02 = """
            <!-- Slide 1: Masalah Memori Sementara -->
            <div class="slide active" data-title="PENYIMPANAN DATA" data-subtitle="Memori RAM vs TinyDB">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Masalah Lupa Ingatan: Mengapa Data Saldo Hilang? 📱</h2>
                        <div class="slide-text">
                            <p>Pernahkah kamu membuat variabel saldo, memasukkan uang tabungan Rp 100.000, tetapi saat aplikasimu ditutup dan dibuka lagi... <strong>saldonya kembali menjadi 0?</strong></p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--orange); background: #FFF3E0;">
                                    <h3>💨 Memori Sementara (RAM)</h3>
                                    <p>Variabel biasa hanya hidup di RAM HP. Begitu aplikasi ditutup, layarnya diminimalkan, atau baterai habis, <strong>semua data langsung lenyap terhapus</strong>!</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--purple); background: #F3E5F5;">
                                    <h3>💾 Memori Persisten (TinyDB)</h3>
                                    <p>Untuk aplikasi finansial nyata, kita butuh database lokal permanen bernama <strong>TinyDB</strong> yang menyimpan data langsung ke chip memori fisik HP!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Komponen TinyDB di Storage -->
            <div class="slide" data-title="KOMPONEN TINYDB" data-subtitle="Non-Visible Component di Laci Storage">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Mengenal Komponen TinyDB di Designer 🗄️</h2>
                        <div class="slide-text">
                            <p>TinyDB bukanlah tombol atau teks yang tampak di layar. Ia bekerja di latar belakang sebagai <strong>Non-Visible Component</strong>:</p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--blue);">
                                    <h3>📂 Cara Memasukkan ke Proyek:</h3>
                                    <ol style="margin-left: 20px; line-height: 1.6;">
                                        <li>Buka tab <strong>Designer</strong>.</li>
                                        <li>Di panel Palette sebelah kiri, klik laci <strong>Storage</strong>.</li>
                                        <li>Tarik (drag) komponen <strong>TinyDB</strong> ke layar Viewer.</li>
                                        <li>Ia akan otomatis turun ke baris <em>Non-visible components</em> di bawah layar HP!</li>
                                    </ol>
                                </div>
                                <div class="feature-card" style="background: #F3E5F5; border: 3px solid #9C27B0;">
                                    <h3 style="color: #7B1FA2;">✨ Keunggulan TinyDB:</h3>
                                    <p>Tidak membutuhkan koneksi internet, tidak memerlukan server rumit, dan data tersimpan aman di HP pengguna!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Konsep Tag dan Value -->
            <div class="slide" data-title="KONSEP TAG & VALUE" data-subtitle="Nama Loker dan Isi Data">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Konsep Kunci: Pasangan Tag dan Value 🏷️</h2>
                        <div class="slide-text">
                            <p>TinyDB mengorganisir data seperti lemari loker sekolah berstiker nama:</p>
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>Istilah</th>
                                        <th>Analogi Loker</th>
                                        <th>Aturan Penulisan</th>
                                        <th>Contoh Nyata</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Tag</strong></td>
                                        <td>Label stiker di pintu loker</td>
                                        <td>Harus berupa teks String unik tanpa salah ketik</td>
                                        <td><code>"SaldoKas"</code> atau <code>"NamaUser"</code></td>
                                    </tr>
                                    <tr>
                                        <td><strong>ValueToStore</strong></td>
                                        <td>Barang di dalam loker</td>
                                        <td>Bisa berupa angka uang, nama teks, atau daftar catatan</td>
                                        <td><code>75000</code> atau <code>"Ahmad Yazid"</code></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                💡 <strong>Kunci Sukses:</strong> Untuk mengambil data dari loker, kamu wajib menyebutkan <strong>Tag</strong> yang persis sama huruf besar dan kecilnya!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: StoreValue & GetValue -->
            <div class="slide" data-title="SIMPAN & BACA DATA" data-subtitle="call StoreValue dan call GetValue">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Cara Menyimpan & Mengambil Nilai 🔄</h2>
                        <div class="slide-text">
                            <p>Di Blocks Editor, kita menggunakan balok berwarna ungu tua:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #EDE7F6; border-left: 6px solid var(--purple);">
                                    <h3>💾 Menyimpan Data: call StoreValue</h3>
                                    <div style="margin: 10px 0;">
                                        <span class="badge-block badge-db">call TinyDB1 . StoreValue</span>
                                    </div>
                                    <p>• <strong>tag:</strong> <code>"Saldo"</code><br>• <strong>valueToStore:</strong> <code>TextBox1.Text</code></p>
                                    <p style="font-size: 15px; color: #555;">Menuliskan saldo baru ke chip memori HP.</p>
                                </div>
                                <div class="feature-card" style="background: #F3E5F5; border-left: 6px solid var(--purple);">
                                    <h3>📖 Mengambil Data: call GetValue</h3>
                                    <div style="margin: 10px 0;">
                                        <span class="badge-block badge-db">call TinyDB1 . GetValue</span>
                                    </div>
                                    <p>• <strong>tag:</strong> <code>"Saldo"</code><br>• <strong>valueIfTagNotThere:</strong> <code>0</code></p>
                                    <p style="font-size: 15px; color: #555;">Membaca saldo tersimpan. Jika belum pernah ada, berikan nilai default <strong>0</strong>!</p>
                                </div>
                            </div>
                            <div class="feature-card" style="background: #FFFDE7; border-left: 6px solid var(--yellow);">
                                🛡️ <strong>Penyelamat Anti-Crash:</strong> Parameter <code>valueIfTagNotThere</code> sangat penting agar aplikasi tidak macet saat pertama kali diinstal siswa baru!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Reset Data ClearTag -->
            <div class="slide" data-title="MENGHAPUS DATA" data-subtitle="call TinyDB.ClearTag">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Mengatur Ulang Catatan dengan ClearTag 🧹</h2>
                        <div class="slide-text">
                            <p>Bagaimana jika siswa ingin mereset buku kasnya untuk memulai bulan baru? Gunakan balok pembersih loker:</p>
                            <div style="margin: 16px 0;">
                                <span class="badge-block badge-db" style="font-size: 18px;">call TinyDB1 . ClearTag</span>
                                <span class="badge-block badge-text" style="font-size: 18px;">tag: "Saldo"</span>
                            </div>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                <h3 style="margin-bottom: 6px;">💡 Perbedaan ClearTag vs ClearAll:</h3>
                                <ul>
                                    <li><strong>ClearTag:</strong> Hanya mengosongkan satu loker tertentu (misal menghapus saldo saja, tapi nama pemilik akun tetap aman).</li>
                                    <li><strong>ClearAll:</strong> Menghapus seluruh isi database aplikasi (seperti reset pabrik).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif -->
            <div class="slide" data-title="MINI LAB INTERAKTIF" data-subtitle="Simulasi Buku Kas TinyDB">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Simulasi Penyimpanan Data TinyDB 🧪</h2>
                        <div class="slide-text">
                            <p>Coba uji bagaimana balok <code>StoreValue</code> dan <code>GetValue</code> bekerja di database HP:</p>
                            <div class="interactive-card">
                                <label style="display: block; font-weight: 700; margin-bottom: 6px;">Nama Tag (Label Penyimpanan):</label>
                                <input type="text" id="ms02-tag" class="input-mini" value="Saldo_Kas" style="width: 250px;">

                                <label style="display: block; font-weight: 700; margin-bottom: 6px;">Nominal Nilai (Value):</label>
                                <input type="number" id="ms02-val" class="input-mini" value="85000" style="width: 250px;">

                                <div style="display: flex; gap: 12px; margin-top: 10px; flex-wrap: wrap;">
                                    <button class="btn-action" onclick="simpanTinyDBMS02()">💾 Simpan (StoreValue)</button>
                                    <button class="btn-action" style="background: var(--yellow);" onclick="bacaTinyDBMS02()">📖 Baca (GetValue)</button>
                                    <button class="btn-action" style="background: #FFCDD2; color: #C62828;" onclick="resetTinyDBMS02()">🧹 Hapus (ClearTag)</button>
                                </div>

                                <div class="output-console" id="ms02-output">
Status TinyDB akan muncul di sini...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji Penguasaan TinyDB 🎯</h2>
                        <div class="slide-text">
                            <p>Jawablah pertanyaan penting berikut:</p>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Mengapa kita wajib mengisi slot <code>valueIfTagNotThere</code> pada balok <code>call TinyDB1.GetValue</code>?</div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms02-q1', 'Benar!', 'Salah! TinyDB tidak memengaruhi suhu baterai HP.')">A. Agar HP tidak cepat panas</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-ms02-q1', 'Tepat sekali! Nilai default ini mencegah error jika aplikasi baru pertama kali dibuka dan data tag belum pernah disimpan!', 'Salah!')">B. Memberikan nilai cadangan default agar tidak error jika data belum ada</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms02-q1', 'Benar!', 'Salah! Menghapus data menggunakan ClearTag.')">C. Menghapus seluruh data pengguna</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms02-q1', 'Benar!', 'Salah! Warna layar diatur di Properties.')">D. Mengubah warna tombol di Designer</div>
                                </div>
                                <div class="quiz-feedback" id="fb-ms02-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju ms-4-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Database Permanen">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Bekal Menuju Modul 4 🚀</h2>
                        <div class="slide-text">
                            <p>Selamat! Sekarang aplikasimu memiliki daya ingat permanen:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>TinyDB menyimpan data secara persisten di chip fisik HP</li>
                                        <li>Komponen Non-Visible dari laci Storage</li>
                                        <li>Tag = nama label loker; Value = isi data loker</li>
                                        <li><code>StoreValue</code> untuk menyimpan, <code>GetValue</code> untuk membaca</li>
                                        <li><code>valueIfTagNotThere</code> memberikan nilai cadangan anti-crash</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Menuju Modul Penyimpanan Data Permanen (ms-4-1 s.d. ms-4-6):</h3>
                                    <p>Di video berikutnya, kamu akan belajar cara menyimpan banyak catatan transaksi sekaligus, mengamankan data pengguna, dan merancang sistem buku kas mandiri!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai untuk melanjutkan! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_ms02 = """
        const virtualDB = {};
        function simpanTinyDBMS02() {
            const tag = document.getElementById('ms02-tag').value.trim();
            const val = document.getElementById('ms02-val').value.trim();
            const out = document.getElementById('ms02-output');
            if (!tag || !val) {
                out.innerText = ">>> Harap isi nama Tag dan Nilai terlebih dahulu!";
                return;
            }
            virtualDB[tag] = val;
            out.innerText = ">>> call TinyDB1.StoreValue BERHASIL!\\n• Tag: \\"" + tag + "\\"\\n• ValueToStore: " + val + "\\nStatus: Data tersimpan permanen di memori HP!";
        }

        function bacaTinyDBMS02() {
            const tag = document.getElementById('ms02-tag').value.trim();
            const out = document.getElementById('ms02-output');
            if (tag in virtualDB) {
                out.innerText = ">>> call TinyDB1.GetValue DITEMUKAN!\\n• Tag: \\"" + tag + "\\"\\n• Value: " + virtualDB[tag];
            } else {
                out.innerText = ">>> Tag \\"" + tag + "\\" Tidak Ditemukan!\\nTinyDB mengembalikan nilai default (valueIfTagNotThere): 0";
            }
        }

        function resetTinyDBMS02() {
            const tag = document.getElementById('ms02-tag').value.trim();
            const out = document.getElementById('ms02-output');
            if (tag in virtualDB) {
                delete virtualDB[tag];
                out.innerText = ">>> call TinyDB1.ClearTag BERHASIL!\\nTag \\"" + tag + "\\" telah dikosongkan dari memori.";
            } else {
                out.innerText = ">>> Tag \\"" + tag + "\\" memang belum pernah disimpan.";
            }
        }
"""

html_ms02 = build_html(
    "Materi Jembatan 02 SMP: Buku Kas Digital: Menyimpan Data dengan TinyDB",
    "PENYIMPANAN DATA TINYDB",
    "Konsep Tag, ValueToStore, dan valueIfTagNotThere",
    slides_ms02,
    scripts_ms02
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-02.html"), "w", encoding="utf-8") as f:
    f.write(html_ms02)

print("Saved bridge-ms-02.html")

# ==============================================================================
# 9. bridge-ms-03.html (SMP 03: Detektif Blok: Debugging & Uji Kasus Form)
# ==============================================================================
slides_ms03 = """
            <!-- Slide 1: Jangan Takut Error -->
            <div class="slide active" data-title="DETEKTIF DEBUGGING" data-subtitle="Menemukan & Memperbaiki Bug">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">1. Jangan Panik! Menjadi Detektif Koding 🕵️‍♂️</h2>
                        <div class="slide-text">
                            <p>Kabar baik untukmu: <strong>semua programmer terhebat di dunia pasti sering mengalami error!</strong></p>
                            <p>Error (atau <em>Bug</em>) bukanlah tanda bahwa kamu gagal, melainkan teka-teki yang sedang menunggu untuk kamu pecahkan. Kemampuan menemukan dan memperbaiki kesalahan kode dinamakan <strong>Debugging</strong>.</p>
                            <div class="two-column">
                                <div class="feature-card" style="border-left: 6px solid var(--blue);">
                                    <h3>🔍 Mengapa Kode Bisa Error?</h3>
                                    <p>Komputer sangat patuh tetapi kaku. Jika kamu salah menghubungkan balok atau salah mengetik nama Tag, komputer akan bingung dan berhenti bekerja.</p>
                                </div>
                                <div class="feature-card" style="border-left: 6px solid var(--green);">
                                    <h3>🎯 Senjata Detektif Koding:</h3>
                                    <p>Membaca tanda peringatan, menguji balok satu per satu, dan membuat daftar kasus uji coba (Test Cases)!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Tanda Merah vs Kuning -->
            <div class="slide" data-title="TANDA PERINGATAN" data-subtitle="Silang Merah vs Segitiga Kuning">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">2. Tanda Peringatan di Pojok Bawah Blocks Editor ⚠️</h2>
                        <div class="slide-text">
                            <p>Perhatikan pojok kiri bawah layar Blocks Editor. App Inventor menyediakan dua indikator cerdas:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #FFEBEE; border: 3px solid #F44336;">
                                    <h3 style="color: #C62828;">❌ Tanda Silang Merah (Error Fatal)</h3>
                                    <p>Menunjukkan kesalahan fatal yang membuat aplikasi <strong>pasti macet / crash</strong> saat dijalankan.</p>
                                    <p><strong>Penyebab umum:</strong> Ada balok yang kehilangan pasangannya (misal balok variabel yang sumbernya sudah kamu hapus dari proyek).</p>
                                </div>
                                <div class="feature-card" style="background: #FFFDE7; border: 3px solid #FBC02D;">
                                    <h3 style="color: #F57F17;">⚠️ Segitiga Kuning (Warning / Peringatan)</h3>
                                    <p>Aplikasi masih bisa jalan, tetapi ada potensi kesalahan logika.</p>
                                    <p><strong>Penyebab umum:</strong> Ada balok aksi yang tercecer di ruang kosong tanpa dibungkus balok <code>when Event</code>.</p>
                                </div>
                            </div>
                            <p>💡 <em>Klik pada ikon tanda silang merah untuk melihat daftar lokasi balok yang rusak secara instan!</em></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Fitur Do It -->
            <div class="slide" data-title="FITUR RAHASIA DO IT" data-subtitle="Menguji Balok Secara Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">3. Senjata Rahasia Pengujian: Fitur "Do It" 🔬</h2>
                        <div class="slide-text">
                            <p>Tahukah kamu bahwa kamu tidak perlu menjalankan seluruh aplikasi dari awal hanya untuk mengecek hasil satu rumus perhitungan?</p>
                            <div class="feature-card" style="background: #E8F5E9; border-left: 6px solid var(--green);">
                                <h3 style="margin-bottom: 6px;">💡 Cara Menggunakan Do It:</h3>
                                <ol style="margin-left: 20px; line-height: 1.6;">
                                    <li>Pastikan laptop terhubung ke HP dengan <strong>AI Companion</strong>.</li>
                                    <li>Klik kanan pada balok yang ingin kamu periksa nilainya.</li>
                                    <li>Pilih menu <strong>"Do It"</strong>.</li>
                                    <li>Sebuah balon pesan kecil akan muncul di atas balok, memperlihatkan nilai isi balok tersebut secara langsung!</li>
                                </ol>
                            </div>
                            <p>Fitur ini sangat menghemat waktu saat kamu bingung mengapa saldo atau teks tidak muncul sesuai harapan!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: Tabel Kasus Uji -->
            <div class="slide" data-title="TABEL KASUS UJI" data-subtitle="Seni Menguji Aplikasi (Test Cases)">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">4. Membuat Tabel Kasus Uji (Test Cases) 📊</h2>
                        <div class="slide-text">
                            <p>Programmer profesional selalu menguji aplikasinya dengan 3 jenis skenario sebelum merilis ke pengguna:</p>
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>Jenis Pengujian</th>
                                        <th>Data yang Dimasukkan</th>
                                        <th>Hasil yang Diharapkan</th>
                                        <th>Tujuan Uji</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>1. Kasus Normal</strong></td>
                                        <td>Ketik nominal <code>50000</code></td>
                                        <td>Saldo berkurang Rp 50.000</td>
                                        <td>Memastikan fungsi utama berjalan lancar.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>2. Kasus Kosong</strong></td>
                                        <td>Kolom teks dibiarkan kosong lalu klik Simpan</td>
                                        <td>Muncul peringatan <em>"Harap isi nominal!"</em></td>
                                        <td>Mencegah aplikasi crash karena data kosong.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>3. Kasus Salah / Ekstrem</strong></td>
                                        <td>Ketik angka negatif <code>-20000</code> atau huruf</td>
                                        <td>Muncul peringatan <em>"Nominal tidak valid!"</em></td>
                                        <td>Mencegah kecurangan atau manipulasi saldo.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Etika & Privasi Data -->
            <div class="slide" data-title="KEAMANAN & PRIVASI" data-subtitle="Prinsip Perlindungan Data Pengguna">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">5. Etika & Privasi: Jangan Simpan Data Sensitif! 🛡️</h2>
                        <div class="slide-text">
                            <p>Sebagai calon developer teknologi finansial, keamanan privasi nasabah adalah amanah yang paling suci:</p>
                            <div class="two-column">
                                <div class="feature-card" style="background: #FFEBEE; border: 3px solid var(--red);">
                                    <h3 style="color: #C62828;">❌ DILARANG KERAS:</h3>
                                    <ul>
                                        <li>Menyimpan nomor PIN ATM nasabah ke dalam teks biasa</li>
                                        <li>Menyimpan password akun ke dalam TinyDB tanpa enkripsi</li>
                                        <li>Meminta data KTP atau nomor kartu kredit pada proyek latihan</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3 style="color: #2E7D32;">✅ Standar Keamanan:</h3>
                                    <ul>
                                        <li>Gunakan data uji coba tiruan (dummy data) untuk latihan</li>
                                        <li>Hanya simpan data non-sensitif (nama panggilan, skor, saldo simulasi)</li>
                                        <li>Selalu sediakan tombol hapus data akun</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Mini Lab Interaktif Detektif -->
            <div class="slide" data-title="MINI LAB DETEKTIF" data-subtitle="Tangkap Balok yang Tertukar!">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">6. Laboratorium Mini: Detektif Balok Tertukar 🕵️‍♀️</h2>
                        <div class="slide-text">
                            <p>Seorang siswa ingin menampilkan teks sapaan ke <strong>Label1</strong> dari ketikan di <strong>TextBox1</strong>. Namun baloknya tertukar seperti ini:</p>
                            <div style="background: #FFEBEE; border: 3px solid #F44336; padding: 15px; border-radius: 12px; margin: 12px 0;">
                                <span class="badge-block badge-prop" style="background: #2E7D32;">set TextBox1 . Text to</span>
                                <span class="badge-block badge-prop" style="background: #8BC34A; color: black;">Label1 . Text</span>
                            </div>
                            <div class="interactive-card">
                                <div class="interactive-title">Teka-Teki: Manakah susunan balok yang BENAR?</div>
                                <button class="quiz-opt" style="width: 100%; margin-bottom: 8px;" onclick="fixBugMS03(false, this)">
                                    A. set Button1.Text to Label1.Text
                                </button>
                                <button class="quiz-opt" style="width: 100%;" onclick="fixBugMS03(true, this)">
                                    B. set Label1.Text to TextBox1.Text
                                </button>
                                <div class="output-console" id="ms03-fix-output" style="display: none; margin-top: 12px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 7: Kuis Pemahaman Mandiri -->
            <div class="slide" data-title="KUIS PEMAHAMAN" data-subtitle="Uji Kesiapan Belajar Mandiri">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">7. Kuis Pemahaman: Uji Naluri Detektif Koding 🎯</h2>
                        <div class="slide-text">
                            <p>Jawab pertanyaan berikut untuk membuktikan kesiapanmu:</p>
                            <div class="quiz-container">
                                <div class="quiz-q">Pertanyaan: Dari data berikut, manakah yang TIDAK BOLEH disimpan dalam teks biasa di TinyDB?</div>
                                <div class="quiz-options">
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms03-q1', 'Benar!', 'Salah! Skor game aman disimpan.')">A. Skor kuis matematika</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, true, 'fb-ms03-q1', 'Tepat sekali! PIN rahasia dan password tidak boleh disimpan sembarangan dalam teks terbuka karena sangat berbahaya bagi keamanan nasabah!', 'Salah!')">B. PIN rahasia 6-digit rekening nasabah</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms03-q1', 'Benar!', 'Salah! Nama panggilan aman disimpan.')">C. Nama panggilan pengguna</div>
                                    <div class="quiz-opt" onclick="handleQuiz(this, false, 'fb-ms03-q1', 'Benar!', 'Salah! Tema warna aman disimpan.')">D. Pilihan warna tema aplikasi favorit</div>
                                </div>
                                <div class="quiz-feedback" id="fb-ms03-q1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 8: Rangkuman & Menuju ms-5-1 -->
            <div class="slide" data-title="RANGKUMAN" data-subtitle="Bekal Menuju Proyek Akhir">
                <div class="content-card">
                    <div class="inner-content">
                        <h2 class="slide-title">8. Rangkuman & Pintu Masuk Proyek Akhir SMP 🚀</h2>
                        <div class="slide-text">
                            <p>Luar biasa! Kini kamu telah memiliki mental dan keahlian seorang developer aplikasi sejati:</p>
                            <div class="two-column">
                                <div class="feature-card">
                                    <h3>📌 Rangkuman Konsep:</h3>
                                    <ul>
                                        <li>Bedakan Silang Merah (Error) dan Segitiga Kuning (Warning)</li>
                                        <li>Gunakan fitur "Do It" untuk menguji balok mandiri</li>
                                        <li>Uji 3 kasus: Kasus Normal, Kasus Kosong, Kasus Ekstrem</li>
                                        <li>Jaga privasi data pengguna dengan standar etika profesional</li>
                                    </ul>
                                </div>
                                <div class="feature-card" style="background: #E8F5E9; border: 3px solid var(--green);">
                                    <h3>🎯 Siap Membangun Proyek Solusi Digital (ms-5):</h3>
                                    <p>Dengan menguasai Designer, Blocks Event, Form Input, Percabangan Kondisi, Procedures, Debugging, dan TinyDB, kamu sekarang siap merancang dan mempublikasikan aplikasi <strong>UOB Financial Manager</strong> buatanmu sendiri!</p>
                                    <p style="font-weight: 700; margin-top: 10px; color: #2E7D32;">Klik tombol selesai untuk menuju proyek akhir! ✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
"""

scripts_ms03 = """
        function fixBugMS03(isCorrect, elem) {
            const out = document.getElementById('ms03-fix-output');
            out.style.display = 'block';
            if (isCorrect) {
                elem.style.backgroundColor = 'var(--green)';
                elem.style.color = 'var(--black)';
                out.innerHTML = "🎉 <strong>HEBAT SEKALI, DETEKTIF!</strong><br>" +
                                "Susunan yang benar adalah: <code>set Label1.Text to TextBox1.Text</code>.<br>" +
                                "Artinya: Ambil teks dari TextBox1, lalu ubah tulisan di Label1 dengan teks tersebut!";
                out.style.borderLeft = "6px solid var(--green)";
            } else {
                elem.style.backgroundColor = 'var(--red)';
                elem.style.color = 'var(--white)';
                out.innerHTML = "❌ Kurang tepat! Tombol Button1 tidak dipakai untuk menampilkan sapaan utama. Coba lagi!";
                out.style.borderLeft = "6px solid var(--red)";
            }
        }
"""

html_ms03 = build_html(
    "Materi Jembatan 03 SMP: Detektif Blok: Debugging & Uji Kasus Form",
    "DETEKTIF BLOK DEBUGGING",
    "Menemukan Bug, Fitur Do It, dan Tabel Kasus Uji",
    slides_ms03,
    scripts_ms03
)
with open(os.path.join(DRAFTS_HTML_DIR, "bridge-ms-03.html"), "w", encoding="utf-8") as f:
    f.write(html_ms03)

print("Saved bridge-ms-03.html")
print("ALL 9 HTML BRIDGES GENERATED SUCCESSFULLY!")
