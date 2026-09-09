"""Integrate the approved Scratch SD bridge/video sequence into all LMS mirrors."""
from pathlib import Path
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
BRIDGE_DIR = ROOT / 'slides'
SRC = ROOT.parent / '01-lms-platform' / 'src'
DOCS = ROOT.parent.parent / 'docs'

# Detailed pedagogical quizzes based on transcripts
QUIZZES_BY_STEP = {
    'up-about-1': {
        'question': 'Di tab mana kita bisa menggambar atau mengubah tampilan karakter/Sprite sendiri di Scratch?',
        'options': [
            'Tab Costumes (Kostum)',
            'Tab Sounds (Suara)',
            'Tab Code (Kode)',
            'Tab File'
        ],
        'answer': 'A',
        'explanation': 'Tab Costumes menyediakan Paint editor untuk menggambar, mengedit bentuk vektor, dan mengubah tampilan Sprite.'
    },
    'up-about-2': {
        'question': 'Blok Event apa yang digunakan agar suara perkenalan diri berbunyi saat karakter diklik oleh pengguna?',
        'options': [
            'when this sprite clicked (ketika sprite ini diklik)',
            'when space key pressed',
            'stop all',
            'hide'
        ],
        'answer': 'A',
        'explanation': 'Blok "when this sprite clicked" akan mendeteksi klik mouse pada karakter dan langsung menjalankan blok pemutar suara di bawahnya.'
    },
    'up-about-3': {
        'question': 'Mengapa kita membuat beberapa Costume berbeda pada Sprite makanan yang sama?',
        'options': [
            'Agar satu Sprite makanan bisa berganti-ganti tampilan menu/state yang berbeda',
            'Agar Scratch berjalan lebih cepat',
            'Karena satu Sprite hanya boleh memiliki satu kode saja',
            'Untuk menghapus panggung Scratch'
        ],
        'answer': 'A',
        'explanation': 'Costume berfungsi sebagai frame atau variasi tampilan, sehingga satu Sprite makanan bisa menampilkan apel, burger, atau es krim secara bergantian.'
    },
    'up-about-4': {
        'question': 'Blok apa yang digunakan untuk mengganti tampilan kostum ke kostum berikutnya secara berulang?',
        'options': [
            'next costume di dalam blok repeat',
            'delete this clone',
            'broadcast message',
            'set volume to 0%'
        ],
        'answer': 'A',
        'explanation': 'Kombinasi blok "next costume" di dalam "repeat" (dengan sedikit jeda "wait") membuat Sprite berganti kostum secara berurutan dan terlihat dinamis.'
    },
    'up-about-5': {
        'question': 'Bagaimana cara meletakkan Sprite emoji di posisi tertentu pada Stage Scratch?',
        'options': [
            'Mengatur koordinat posisi x (horizontal) dan y (vertikal) pada panel Sprite',
            'Mengubah ukuran layar komputer',
            'Menghapus backdrop sirkuit',
            'Mematikan speaker audio'
        ],
        'answer': 'A',
        'explanation': 'Posisi setiap Sprite di Scratch ditentukan oleh koordinat X (kiri-kanan) dan Y (atas-bawah) pada panggung Stage.'
    },
    'up-about-6': {
        'question': 'Apa fungsi ekstensi Text-to-Speech pada Scratch?',
        'options': [
            'Mengubah teks kalimat yang kita ketik menjadi suara bicara otomatis',
            'Menggambar mobil balap 3D',
            'Merekam video webcam',
            'Memperbesar ukuran browser'
        ],
        'answer': 'A',
        'explanation': 'Ekstensi Text-to-Speech memanfaatkan kecerdasan buatan untuk menyuarakan teks tulisan menjadi ucapan digital interaktif.'
    },
    'up-about-7': {
        'question': 'Blok apa yang digunakan untuk mengembalikan warna dan tampilan Sprite ke kondisi awal setelah diberi efek grafis?',
        'options': [
            'clear graphic effects',
            'switch backdrop to random',
            'change color effect by 25',
            'turn 15 degrees'
        ],
        'answer': 'A',
        'explanation': 'Blok "clear graphic effects" menghapus semua modifikasi efek warna, mata ikan, atau kecerahan yang diterapkan ke Sprite.'
    },
    'up-racing-1': {
        'question': 'Di bagian mana kita menggambar lintasan balap mobil yang menjadi latar belakang permainan?',
        'options': [
            'Stage / Backdrop',
            'Tab Sound',
            'Extension Library',
            'Sprite Mobil'
        ],
        'answer': 'A',
        'explanation': 'Lintasan balap digambar pada Stage/Backdrop karena berfungsi sebagai latar statis tempat mobil-mobil balap melaju.'
    },
    'up-racing-2': {
        'question': 'Mengapa titik pusat (center point) Sprite mobil harus tepat berada di tengah gambar pada Paint Editor?',
        'options': [
            'Agar saat mobil berbelok (berputar arah), rotasinya pas di poros tengah mobil dan tidak melayang miring',
            'Agar warna mobil berubah menjadi emas',
            'Supaya sirkuit otomatis terhapus',
            'Karena Scratch melarang menggambar di tepi'
        ],
        'answer': 'A',
        'explanation': 'Titik pusat kanvas menentukan titik poros putaran Sprite saat menjalankan blok perpindahan sudut atau kemudi.'
    },
    'up-racing-3': {
        'question': 'Blok Motion apa yang digunakan untuk mengubah sudut hadap mobil balap saat tombol panah kiri atau kanan ditekan?',
        'options': [
            'turn right / turn left atau point in direction',
            'set size to 100%',
            'say Hello for 2 seconds',
            'ask and wait'
        ],
        'answer': 'A',
        'explanation': 'Blok "turn" (berbelok sejumlah derajat) atau "point in direction" digunakan untuk mengarahkan moncong mobil ke arah belokan yang diinginkan.'
    },
    'up-racing-4': {
        'question': 'Setelah menduplikasi Sprite Mobil 1 menjadi Mobil 2, apa perubahan utama yang wajib dilakukan pada kodenya?',
        'options': [
            'Mengganti tombol keyboard pengendalinya (misalnya tombol W-A-S-D untuk Mobil 2) agar tidak bentrok dengan Tombol Panah Mobil 1',
            'Menghapus semua kode gerak Mobil 2',
            'Menghapus seluruh panggung sirkuit',
            'Mengubah bahasa Scratch menjadi bahasa lain'
        ],
        'answer': 'A',
        'explanation': 'Dalam game balap 2 pemain, pemain kedua harus diberi tombol kontrol terpisah (seperti W, A, S, D) agar kedua mobil bisa dikemudikan bersamaan.'
    },
    'up-racing-5': {
        'question': 'Apa fungsi utama Sprite garis finish (finish line) yang diletakkan melintang di lintasan?',
        'options': [
            'Sebagai penanda batas akhir sirkuit untuk mendeteksi sentuhan mobil saat balapan selesai',
            'Menghias warna panggung agar terlihat gelap',
            'Mempercepat koneksi internet',
            'Mengganti lagu pengiring'
        ],
        'answer': 'A',
        'explanation': 'Garis finish dibuat sebagai Sprite target agar blok Sensing nantinya dapat mendeteksi apakah mobil sudah menyentuhnya.'
    },
    'up-racing-6': {
        'question': 'Blok Sensing dan Control apa yang digunakan bersamaan untuk mengecek secara terus-menerus apakah mobil menyentuh garis finish?',
        'options': [
            'forever berisi if touching [Finish Line]? then ...',
            'repeat 10 kali berisi say Hello',
            'wait 5 seconds lalu stop all',
            'when I receive start game'
        ],
        'answer': 'A',
        'explanation': 'Pengulangan "forever" yang membungkus percabangan "if touching Finish Line?" memastikan pengecekan tabrakan aktif di setiap detik balapan.'
    },
    'up-earning-1': {
        'question': 'Mengapa kita melakukan "Remix" pada project starter Increase Your Earnings di Scratch?',
        'options': [
            'Untuk menyalin project awal yang sudah memiliki aset dan dialog ke akun kita, lalu memprogram logikanya sendiri',
            'Untuk menghapus project milik orang lain',
            'Karena Scratch tidak bisa membuat project baru',
            'Untuk mengunduh aplikasi Scratch Desktop'
        ],
        'answer': 'A',
        'explanation': 'Fitur Remix menyalin starter code dan aset lengkap ke workspace kita sehingga kita bisa langsung fokus menambahkan kode interaktif.'
    },
    'up-earning-2': {
        'question': 'Saat pemain memilih salah satu pekerjaan/opsi pada cerita, bagaimana cara memindahkan tampilan ke tempat kerja yang sesuai?',
        'options': [
            'Menggunakan blok switch backdrop to [Nama Tempat Kerja]',
            'Mengganti nama akun Scratch',
            'Menghapus semua blok perintah',
            'Memutar lagu berulang-ulang'
        ],
        'answer': 'A',
        'explanation': 'Blok "switch backdrop to ..." digunakan untuk mengubah scene atau latar belakang sesuai keputusan yang dipilih pemain.'
    },
    'up-earning-3': {
        'question': 'Konsep pemrograman apa yang digunakan untuk mencatat dan menambah jumlah uang/kredit penghasilan yang didapatkan karakter?',
        'options': [
            'Variable (misalnya variable Credit/Penghasilan)',
            'Backdrop Switcher',
            'Sound Pitch',
            'Pen Color'
        ],
        'answer': 'A',
        'explanation': 'Variable bertindak sebagai wadah penyimpan angka yang nilainya dapat bertambah atau berkurang sesuai aktivitas karakter.'
    },
    'up-earning-4': {
        'question': 'Apa fungsi sinyal "broadcast" yang dikirimkan saat permainan mencapai akhir cerita?',
        'options': [
            'Mengirimkan pesan ke seluruh Sprite dan Backdrop secara bersamaan agar memicu aksi penutup/ending',
            'Mengunci keyboard komputer',
            'Menghapus file di Google Drive',
            'Memulai ulang komputer'
        ],
        'answer': 'A',
        'explanation': 'Broadcast mengirimkan pesan radio ke seluruh Sprite. Sprite penerima yang memiliki blok "when I receive [ending]" akan langsung merespons secara serentak.'
    }
}

playlists = {
    'about-me': [
        ('pmSYmmRe4Sw', '1 About Me - Mendesain Karakter'),
        ('a7VMYsnvmQY', '2 About Me - Merekam Suara Perkenalan Diri'),
        ('pAWCUOSOHAk', '3 About Me - Membuat Kostum Makanan'),
        ('odzpfqdxTEc', '4 About Me - Memprogram Sprite Makanan'),
        ('EsBPZR9k4X8', '5 About Me - Menambahkan Sprite dengan Emoji'),
        ('8PPKejwfq4k', '6 About Me - Memprogram Animasi dan Menggunakan Text-to-Speech'),
        ('RMwzg1MtZFg', '7 About Me - Memprogram dengan Effects')
    ],
    'racing-car': [
        ('qHSNKAw2tLc', '1 Desain Sirkuit'),
        ('QAJXUrjmetI', '2 Desain Mobil'),
        ('lIekdk-dDTw', '3 Kode Mobil'),
        ('3zubM7bbNTI', '4 Duplikasi dan Modifikasi Mobil 2'),
        ('sm1DkpQpRxw', '5 Desain Finish Line'),
        ('qnzD9G15BqE', '6 Kode Menang dan Menyentuh Musuh')
    ],
    'increase-earning': [
        ('5u7OdPWmJhU', '1. Percakapan Intro'),
        ('rb8wuLoVnic', '2. Memprogram Opsi 1'),
        ('t5YIkeWux3U', '3. Memprogram Opsi 2'),
        ('A1SrFU4pDY4', '4. Memprogram Ending')
    ]
}

def make_quiz(sid, title):
    q_data = QUIZZES_BY_STEP.get(sid)
    if not q_data:
        q_data = {
            'question': f'Apa fokus utama materi "{title}"?',
            'options': [
                'Mencoba, mengamati, dan menjelaskan hasilnya',
                'Menutup Scratch',
                'Menghapus semua Sprite',
                'Tidak melakukan apa-apa'
            ],
            'answer': 'A',
            'explanation': 'Benar. Pembelajaran Scratch dilakukan dengan mencoba, mengamati, mengubah, dan menjelaskan.'
        }
    return [{
        'time': 0,
        'shown': False,
        'resume': False,
        'title': f'Checkpoint: {title}',
        'questions': [{
            'id': f'q-{sid}',
            'question': q_data['question'],
            'options': q_data['options'],
            'answer': q_data['answer'],
            'explanation': q_data['explanation']
        }]
    }]

def video_step(sid, title, kicker, playlist):
    vid = next(v for v, t in playlists[playlist] if t == title)
    return {
        'id': sid,
        'type': 'video',
        'kicker': kicker,
        'title': title,
        'videoId': vid,
        'playlistId': playlist,
        'introMode': 'embedded',
        'quizzes': make_quiz(sid, title)
    }

def bridge_step(sid, kicker):
    meta_path = BRIDGE_DIR / f'{sid}.json'
    d = json.loads(meta_path.read_text(encoding='utf-8'))
    return {
        'id': sid,
        'type': 'slide',
        'kicker': kicker,
        'title': d['title'],
        'slideUrl': d['slideUrl'],
        'embedUrl': d['embedUrl'],
        'summary': d['summary'],
        'totalSlides': d['totalSlides'],
        'learningObjectives': d['learningObjectives'],
        'practice': d['practice'],
        'completionCriteria': d['completionCriteria'],
        'bookmarks': d['bookmarks'],
        'quizzes': d['quizzes']
    }

modules = [
    {
        'id': 'up-mod-00',
        'order': 0,
        'title': 'Modul 0: Kenalan dengan Scratch & Fondasi Interaksi',
        'description': 'Materi jembatan orientasi Scratch dan transisi dari karakter visual ke kode blok.',
        'steps': [
            bridge_step('bridge-sd-00', 'Materi Jembatan 00 · Kenalan Scratch'),
            bridge_step('bridge-sd-01', 'Materi Jembatan 01 · Sprite & Event')
        ]
    },
    {
        'id': 'up-mod-01',
        'order': 1,
        'title': 'Modul 1: About Me — Karakter, Suara & Media Interaktif',
        'description': 'Project pertama: membuat karakter perkenalan diri, merekam suara, kostum makanan, dan interaksi sprite.',
        'steps': [
            video_step('up-about-1', '1 About Me - Mendesain Karakter', 'Video About Me · Tutorial', 'about-me'),
            video_step('up-about-2', '2 About Me - Merekam Suara Perkenalan Diri', 'Video About Me · Tutorial', 'about-me'),
            video_step('up-about-3', '3 About Me - Membuat Kostum Makanan', 'Video About Me · Tutorial', 'about-me'),
            video_step('up-about-4', '4 About Me - Memprogram Sprite Makanan', 'Video About Me · Tutorial', 'about-me'),
            video_step('up-about-5', '5 About Me - Menambahkan Sprite dengan Emoji', 'Video About Me · Tutorial', 'about-me')
        ]
    },
    {
        'id': 'up-mod-02',
        'order': 2,
        'title': 'Modul 2: Loop, Gerakan Berulang & Animasi Lanjutan',
        'description': 'Fondasi loop dan pengulangan untuk animasi gerak, ekstensi Text-to-Speech, serta efek visual.',
        'steps': [
            bridge_step('bridge-sd-02', 'Materi Jembatan 02 · Loop & Animasi'),
            video_step('up-about-6', '6 About Me - Memprogram Animasi dan Menggunakan Text-to-Speech', 'Video About Me · Tutorial', 'about-me'),
            video_step('up-about-7', '7 About Me - Memprogram dengan Effects', 'Video About Me · Tutorial', 'about-me')
        ]
    },
    {
        'id': 'up-mod-03',
        'order': 3,
        'title': 'Modul 3: Racing Car Game — Kontrol Kemudi & Deteksi Tabrakan',
        'description': 'Project kedua: mendesain sirkuit balap, kemudi keyboard 2 mobil, sensing tabrakan, dan aturan menang.',
        'steps': [
            video_step('up-racing-1', '1 Desain Sirkuit', 'Video Racing Car · Tutorial', 'racing-car'),
            video_step('up-racing-2', '2 Desain Mobil', 'Video Racing Car · Tutorial', 'racing-car'),
            bridge_step('bridge-sd-03', 'Materi Jembatan 03 · Sensing & Kontrol'),
            video_step('up-racing-3', '3 Kode Mobil', 'Video Racing Car · Tutorial', 'racing-car'),
            video_step('up-racing-4', '4 Duplikasi dan Modifikasi Mobil 2', 'Video Racing Car · Tutorial', 'racing-car'),
            video_step('up-racing-5', '5 Desain Finish Line', 'Video Racing Car · Tutorial', 'racing-car'),
            video_step('up-racing-6', '6 Kode Menang dan Menyentuh Musuh', 'Video Racing Car · Tutorial', 'racing-car')
        ]
    },
    {
        'id': 'up-mod-04',
        'order': 4,
        'title': 'Modul 4: Proyek Integratif — Variabel, Broadcast & Percabangan',
        'description': 'Jembatan data dan komunikasi antar-sprite untuk starter project bertema pekerjaan dan keuangan.',
        'steps': [
            bridge_step('bridge-sd-04', 'Materi Jembatan 04 · Variabel & Broadcast'),
            video_step('up-earning-1', '1. Percakapan Intro', 'Video Increase Your Earnings · Capstone', 'increase-earning'),
            video_step('up-earning-2', '2. Memprogram Opsi 1', 'Video Increase Your Earnings · Capstone', 'increase-earning')
        ]
    },
    {
        'id': 'up-mod-05',
        'order': 5,
        'title': 'Modul 5: Increase Your Earnings — Capstone & Ending',
        'description': 'Penyelesaian project integratif: penambahan kredit, kondisi interaktif, broadcast sinyal ending, dan evaluasi hasil.',
        'steps': [
            video_step('up-earning-3', '3. Memprogram Opsi 2', 'Video Increase Your Earnings · Capstone', 'increase-earning'),
            video_step('up-earning-4', '4. Memprogram Ending', 'Video Increase Your Earnings · Capstone', 'increase-earning')
        ]
    }
]

data = {
    'levelId': 'upper_primary',
    'levelTitle': 'Scratch Async SD (UOB My Digital Space)',
    'description': 'Kurikulum Scratch berbasis project terpisah: About Me, Racing Car, dan Increase Your Earnings, dengan bridge scaffolding dari platform dasar hingga project integratif.',
    'isPlaceholder': False,
    'modules': modules
}

for target in [ROOT / 'output/courseData-upperprimary.json', SRC / 'data/courseData-upperprimary.json', DOCS / 'data/courseData-upperprimary.json']:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

for target_root in [SRC, DOCS]:
    (target_root / 'slides').mkdir(parents=True, exist_ok=True)
    for f in BRIDGE_DIR.glob('bridge-sd-*.html'):
        shutil.copy2(f, target_root / 'slides' / f.name)
    for f in BRIDGE_DIR.glob('bridge-sd-*.json'):
        shutil.copy2(f, target_root / 'slides' / f.name)
    for f in (ROOT / 'assets' / 'scratch').glob('*'):
        (target_root / 'assets' / 'scratch').mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, target_root / 'assets' / 'scratch' / f.name)

total_steps = sum(len(m['steps']) for m in modules)
print(f'Integrated {total_steps} steps across {len(modules)} modules into 3 mirrors.')
