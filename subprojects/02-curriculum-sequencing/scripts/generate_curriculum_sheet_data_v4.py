"""
Generate Complete Curriculum Sheet Payload v4
Includes the finalized 22-step Scratch SD curriculum, 36-step SMP, 36-step SMA, and 11 Changelog records.
"""
import json
import os

def build_payload_v4():
    base_data_path = "subprojects/01-lms-platform/src/data"
    bridge_dir = "subprojects/02-curriculum-sequencing/slides"

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
                q_text = subq.get('question', '')
                opts = subq.get('options', [])
                ans = subq.get('answer', '')
                exp = subq.get('explanation', '')
                ans_str = str(ans)
                if isinstance(ans, int) and ans < len(opts):
                    ans_str = opts[ans]
                elif isinstance(ans, str) and ans in ["A", "B", "C", "D"]:
                    idx = ord(ans) - ord("A")
                    if idx < len(opts):
                        ans_str = f"{ans} ({opts[idx]})"
                
                line = f"⏱️ [{time_label}] {q_text}"
                if opts:
                    line += f"\n   Pilihan: {', '.join([str(o) for o in opts])}"
                line += f"\n   ✅ Kunci: {ans_str}"
                if exp:
                    line += f"\n   💡 Penjelasan: {exp}"
                q_lines.append(line)
        return "\n\n".join(q_lines) if q_lines else "- (Materi Konsep / Hands-on Coding)"

    # Helper for bridge slide rows
    def format_bridge_row(no, mod_id, mod_title, sid, bmeta, learning_type, kicker, media_link, konsep):
        # Format quiz
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

    # ==================== 1. SD (Upper Primary) - 22 Steps ====================
    with open(f"{base_data_path}/courseData-upperprimary.json", 'r', encoding='utf-8') as f:
        sd_data = json.load(f)

    # Curation metadata dictionary for SD video steps
    sd_video_curation = {
        'up-about-1': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Menggambar karakter personal dari kanvas kosong menggunakan Paint editor Scratch: bentuk vektor (lingkaran, kotak), warna kulit sawo matang, rambut, dan outline.",
            'project': "Desain Karakter Diri: Hapus Sprite kucing bawaan, buat Sprite baru via menu Paint, gambar wajah dan rambut sesuai ciri khas diri sendiri.",
            'cheatsheet': "Paint Editor Tools:\n- Select (panah)\n- Circle / Rectangle\n- Fill (warna isi)\n- Outline (garis tepi)",
            'capaian': "Siswa terampil menggunakan Paint editor vektor Scratch untuk menggambar karakter diri yang orisinal.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-about-2': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Pemanfaatan audio interaktif: merekam suara lewat mikrofon di Tab Sounds, memotong rekaman (trim/edit), dan menghubungkannya dengan event 'when this sprite clicked'.",
            'project': "Rekam & Mainkan Suara: Buka tab Sounds, rekam kalimat sapaan 'Halo, namaku...', lalu pasang blok 'when this sprite clicked' -> 'play sound [rekaman] until done'.",
            'cheatsheet': "Tab Sounds > Record (ikon mikrofon)\nBlok Sound: play sound [rekaman] until done\nBlok Event: when this sprite clicked",
            'capaian': "Siswa mampu merekam audio perkenalan mandiri dan memprogram respon suara saat karakter diklik.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-about-3': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Konsep Multi-Costume dalam satu Sprite: membuat Sprite makanan kesukaan, menduplikasi kostum untuk membuat beberapa variasi menu favorit (apel, burger, es krim).",
            'project': "Koleksi Kostum Makanan: Buat Sprite baru bernama 'Makanan', lalu buat minimal 3 kostum berbeda yang menampilkan makanan favoritmu.",
            'cheatsheet': "Klik kanan Costume > Duplicate\nGunakan Tool Paint untuk menggambar menu berbeda pada tiap frame kostum.",
            'capaian': "Siswa memahami konsep frame kostum dan mampu mengelola banyak kostum dalam satu Sprite.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-about-4': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Logika pergantian kostum: blok 'switch costume to', 'next costume', penambahan jeda 'wait [seconds]', dan pengulangan 'repeat' agar makanan berganti-ganti secara dinamis.",
            'project': "Animasi Menu Makanan: Rangkai kode 'when this sprite clicked' -> 'repeat 5' -> 'next costume' -> 'wait 0.5 seconds' -> 'play sound [pop]'.",
            'cheatsheet': "when this sprite clicked\nrepeat (5)\n  next costume\n  wait (0.5) seconds\n  start sound [pop]",
            'capaian': "Siswa menguasai kombinasi blok looks, control wait, dan repeat untuk menghasilkan interaksi pergantian kostum.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-about-5': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Pengayaan aset visual dengan Sprite emoji/ikon, memposisikan Sprite pada koordinat panggung (X, Y), serta mengatur ukuran (size) dan visibilitas (show/hide).",
            'project': "Tata Letak Emoji Hobi: Tambahkan 2-3 Sprite emoji yang mewakili hobi atau minatmu, posisikan rapi di sekitar karakter utama.",
            'cheatsheet': "Panel Sprite Properties:\n- X & Y (koordinat)\n- Size (ukuran persentase)\n- Direction (sudut hadap)",
            'capaian': "Siswa memahami sistem koordinat X dan Y pada Stage serta dapat menata komposisi beberapa Sprite sekaligus.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-about-6': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Integrasi animasi gerak (Motion: move, turn) di dalam loop, sinkronisasi dengan ekstensi cerdas Text-to-Speech (TTS) agar karakter berbicara kalimat perkenalan.",
            'project': "Karakter Bicara & Bergoyang: Pasang ekstensi Text-to-Speech, ketik teks sapaan pada blok 'speak [...]', kombinasikan dengan blok motion 'turn 15 degrees' di dalam loop repeat.",
            'cheatsheet': "Add Extension (+) > Text-to-Speech\nset voice to [alto / tenor]\nspeak [Halo, selamat datang di ceritaku!]",
            'capaian': "Siswa berhasil menggabungkan animasi gerakan karakter dengan suara Text-to-Speech otomatis.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-about-7': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Manipulasi efek visual interaktif pada blok Looks: efek 'color', 'fisheye', 'whirl', 'pixelate', dan penggunaan blok 'clear graphic effects' untuk reset tampilan.",
            'project': "Efek Disko Karakter: Buat tombol atau klik event yang memutar efek warna 'change color effect by 25' di dalam loop repeat, lalu tambahkan tombol reset dengan 'clear graphic effects'.",
            'cheatsheet': "change [color] effect by (25)\nset [ghost] effect to (0)\nclear graphic effects",
            'capaian': "Siswa menyelesaikan Project 1 (About Me) secara utuh dengan perpaduan desain, suara, emoji, TTS, dan efek visual.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-racing-1': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Perancangan Stage Game: Menggambar sirkuit balapan pada Backdrop menggunakan Paint editor, membuat lintasan aspal, rumput hijau di pinggir, dan jalur meliuk.",
            'project': "Menggambar Sirkuit Balap: Pilih Stage > Backdrops, gambar lintasan sirkuit balap tertutup (looping) dengan jalan abu-abu dan rumput hijau di sekelilingnya.",
            'cheatsheet': "Stage > Tab Backdrops\nGunakan Brush tebal atau Shape Tool meliuk untuk membuat jalur sirkuit balap.",
            'capaian': "Siswa mampu mendesain lingkungan sirkuit game balap yang siap digunakan untuk navigasi mobil.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-racing-2': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Desain Karakter Top-Down: Menggambar mobil balap dari tampak atas (top-down view), mengatur proporsi bodi, ban, dan menyelaraskan titik pusat (center crosshair) di kanvas.",
            'project': "Desain Mobil Top-Down: Buat Sprite baru bernama 'Mobil 1', gambar badan mobil tampak atas, 4 roda hitam, dan pastikan titik tengah mobil tepat di tanda silang pusat.",
            'cheatsheet': "Kanvas Paint Editor:\n- Perhatikan tanda silang (+) di tengah\n- Moncong mobil hadap ke kanan (arah 90 derajat)",
            'capaian': "Siswa mampu menggambar aset sprite mobil top-down dengan titik rotasi seimbang.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-racing-3': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Pemrograman Kontrol Kemudi Mobil 1: Menggunakan loop 'forever', kombinasi 'if key [up arrow] pressed' -> 'move 5 steps', serta tombol panah kiri/kanan untuk 'turn 5 degrees'.",
            'project': "Memprogram Kemudi Mobil 1: Susun blok kontrol kemudi di dalam forever loop sehingga mobil melaju maju saat tombol panah atas ditekan dan berbelok saat panah kiri/kanan ditekan.",
            'cheatsheet': "forever\n  if <key [up arrow] pressed?> then (move (5) steps)\n  if <key [left arrow] pressed?> then (turn ccw (5) degrees)\n  if <key [right arrow] pressed?> then (turn cw (5) degrees)",
            'capaian': "Siswa berhasil memprogram kemudi mobil balap yang responsif dan mulus di sirkuit.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-racing-4': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Game Multiplayer 2 Pemain: Menduplikasi Sprite Mobil 1 menjadi Mobil 2, mengubah warna bodi mobil, dan mengadaptasi tombol pengendali keyboard ke tombol W, A, S, D.",
            'project': "Perakitan Mobil 2: Duplikasi Mobil 1, ganti warnanya menjadi biru/kuning, ubah tombol kemudi menjadi W (maju), A (belok kiri), D (belok kanan), dan atur posisi start berdampingan.",
            'cheatsheet': "Mobil 1: Tombol Panah (Arrow Keys)\nMobil 2: Tombol Huruf (W, A, S, D)\nAtur posisi awal: go to x:... y:... saat green flag diklik.",
            'capaian': "Siswa mampu merekayasa ulang kode untuk mendukung mode game balap multiplayer dua pemain.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-racing-5': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Tujuan Permainan (Game Objective): Mendesain Sprite Garis Finish bermotif kotak-kotak hitam-putih (checkered flag) dan menempatkannya melintang di sirkuit.",
            'project': "Membuat Garis Finish: Gambar Sprite garis finish bermotif kotak hitam putih, posisikan melintang di titik awal/akhir sirkuit.",
            'cheatsheet': "Sprite Finish Line: Buat kotak hitam putih selang-seling melintang lebar jalan sirkuit.",
            'capaian': "Siswa dapat mendesain elemen target permainan yang berfungsi sebagai checkpoint sensorik.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-racing-6': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Logika Kemenangan & Game Over: Blok Sensing 'touching Finish Line?', menampilkan teks ucapan pemenang ('Mobil 1 Menang!'), memainkan efek suara selebrasi, dan blok 'stop all'.",
            'project': "Aturan Menang & Tabrakan: Lengkapi kode mobil dengan pengecekan: jika menyentuh rumput sirkuit kurangi kecepatan; jika menyentuh garis finish umumkan pemenang dan hentikan permainan.",
            'cheatsheet': "if <touching [Finish Line]?> then\n  say [Mobil 1 Menang! 🏆] for (2) secs\n  stop [all]\nif <touching color [#hijau-rumput]?> then (move (-3) steps)",
            'capaian': "Siswa menyelesaikan Project 2 (Racing Car Game) secara lengkap dan dapat dimainkan bersama kawan.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-earning-1': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Remix Starter Project & Alur Cerita: Membuka starter project tema karir/finansial 'Increase Your Earnings', memahami struktur dialog antar-karakter, konsep kredit awal, dan briefing alur pilihan.",
            'project': "Remix Starter Project: Buka link starter project Increase Your Earnings, klik tombol 'Remix', dan pelajari daftar Sprite dan Backdrop yang telah disiapkan.",
            'cheatsheet': "Tombol 'Remix' (kanan atas Scratch)\nPeriksa Sprite: Karakter Utama, Tombol Opsi, Toko, Kantor",
            'capaian': "Siswa dapat mengelola dan memodifikasi project starter remix di lingkungan Scratch.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-earning-2': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Pilihan Interaktif & Manajemen Layar: Memprogram tombol pilihan karir/aktivitas, mengubah tampilan scene dengan 'switch backdrop to', menyembunyikan/menampilkan tombol dengan 'show' dan 'hide'.",
            'project': "Memprogram Pilihan 1: Saat tombol opsi 1 diklik, sembunyikan tombol pilihan, ganti backdrop ke lokasi kerja, dan tampilkan karakter sedang bekerja.",
            'cheatsheet': "when this sprite clicked\nhide\nswitch backdrop to [Tempat_Kerja]\nbroadcast [mulai_kerja]",
            'capaian': "Siswa menguasai manajemen perpindahan scene dan visibilitas elemen berdasarkan pilihan pengguna.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-earning-3': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Penghitungan Nilai Dinamis: Menambahkan poin kredit penghasilan dengan blok 'change [Kredit] by [angka]', logika percabangan bersyarat, dan interaksi aktivitas kerja.",
            'project': "Akumulasi Kredit: Buat variabel 'Kredit', atur nilai awal ke 0, dan setiap aktivitas kerja terselesaikan, tambahkan kredit sebesar 25 poin.",
            'cheatsheet': "change [Kredit] by (25)\nsay (join [Kreditmu bertambah! Total: ] [Kredit]) for (2) secs",
            'capaian': "Siswa dapat mengimplementasikan variabel penghasilan yang bertambah secara dinamis berdasarkan keputusan pemain.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        },
        'up-earning-4': {
            'type': "Video Tutorial Resmi (Kak Laras)",
            'konsep': "Evaluasi Akhir Cerita & Ending Bercabang: Mengirim sinyal 'broadcast [ending]', mengecek total kredit akhir dengan 'if-then-else' (apakah mencapai target finansial), dan menampilkan pesan penutup reflektif.",
            'project': "Babak Akhir Permainan: Rangkai logika ending: jika Kredit >= 50 maka tampilkan backdrop Sukses Finansial & piala; jika belum maka tampilkan pesan motivasi untuk mencoba lagi.",
            'cheatsheet': "when I receive [ending]\nif < [Kredit] > (50) > then\n  switch backdrop to [Pemenang_Sukses]\n  play sound [cheer] until done\nelse\n  switch backdrop to [Coba_Lagi]",
            'capaian': "Siswa menuntaskan Capstone Project Integratif SD secara paripurna dengan logika keputusan dan ending interaktif.",
            'status': "Siap (Video Tutorial Kak Laras & Kuis Aktif)"
        }
    }

    sd_rows = []
    sd_step_no = 1

    for mod in sd_data['modules']:
        mod_id = mod['id']
        mod_title = mod['title']
        for step in mod['steps']:
            sid = step['id']
            stype = step.get('type', 'video')
            title = step.get('title', '')
            kicker = step.get('kicker', '')

            if stype == 'slide':
                # Load bridge metadata
                b_path = f"{bridge_dir}/{sid}.json"
                with open(b_path, 'r', encoding='utf-8') as bf:
                    bmeta = json.load(bf)
                media_link = step.get('slideUrl', f"slides/{sid}.html")
                learning_type = "Slide Interaktif & Fondasi"
                konsep = bmeta.get('summary', 'Orientasi konsep fundamental coding blok Scratch.')
                row = format_bridge_row(sd_step_no, mod_id, mod_title, sid, bmeta, learning_type, kicker, media_link, konsep)
                sd_rows.append(row)
            else:
                # Video step
                vid = step.get('videoId', '')
                media_link = f"https://youtu.be/{vid}" if vid else "-"
                cur = sd_video_curation.get(sid, {})
                learning_type = cur.get('type', "Video Tutorial Resmi (Kak Laras)")
                konsep = cur.get('konsep', title)
                quiz_formatted = format_step_quizzes(step.get('quizzes', []))
                project_formatted = cur.get('project', "Praktik mandiri di Scratch.")
                cheatsheet = cur.get('cheatsheet', "Blok Scratch.")
                capaian = cur.get('capaian', "Siswa memahami materi video.")
                status = cur.get('status', "Siap (Video Tutorial Kak Laras & Kuis Aktif)")
                
                row = [
                    sd_step_no, mod_id, mod_title, sid, title,
                    learning_type, kicker, media_link,
                    konsep, quiz_formatted, project_formatted, cheatsheet, capaian, status
                ]
                sd_rows.append(row)
            
            sd_step_no += 1

    print(f"Constructed SD rows: {len(sd_rows)} steps (Expected: 22)")

    # ==================== 2. SMP (Middle School) - 36 Steps ====================
    # Re-use existing verified SMP logic from v3
    from generate_curriculum_sheet_data_v3 import build_curriculum_dataset_v3
    # We can load existing payload v3 for SMP and SMA
    with open("subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v3.json", "r", encoding="utf-8") as f:
        p3 = json.load(f)

    ms_rows = p3['smp']
    hs_rows = p3['sma']
    changelog_rows = list(p3['changelog'])

    # Append 11th changelog entry for SD final injection
    changelog_rows.append([
        11,
        "Injeksi Kurikulum Scratch SD Final (22 Step)",
        "materi-sd, ops-result-sd, Code.gs, courseData-upperprimary.json",
        "Tab materi-sd sebelumnya masih memuat draft placeholder 8 baris dan ops-result-sd hanya memiliki 8 kolom evaluasi.",
        "Menginjeksi kurikulum Scratch SD final 22 step (6 modul: 5 slide bridge interaktif + 17 video tutorial resmi Kak Laras), menstandarisasi introMode: embedded, dan memperluas kolom pelacakan ops-result-sd menjadi 22 step lengkap.",
        "⚠️ INKOMPLIT (Draft Placeholder 8 Baris)",
        "✅ LIVE & SYNCHRONIZED (22 Step Paripurna)",
        "Eksekusi otomatis via Apps Script CDP, inspeksi runtime LMS (23 tab), dan verifikasi visual Google Sheet."
    ])

    payload = {
        'sd': sd_rows,
        'smp': ms_rows,
        'sma': hs_rows,
        'changelog': changelog_rows
    }

    out_file = "subprojects/02-curriculum-sequencing/output/curriculum_sheet_payload_v4.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"✅ Payload v4 successfully generated!")
    print(f"   - SD: {len(sd_rows)} steps")
    print(f"   - SMP: {len(ms_rows)} steps")
    print(f"   - SMA: {len(hs_rows)} steps")
    print(f"   - Changelog: {len(changelog_rows)} records")
    print(f"   - Saved to: {out_file}")

if __name__ == '__main__':
    build_payload_v4()
