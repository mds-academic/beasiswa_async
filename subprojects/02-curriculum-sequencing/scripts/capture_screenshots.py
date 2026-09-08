import asyncio
import os
from playwright.async_api import async_playwright

ASSETS_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

async def capture_all():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        
        # 1. Colab Notebook with Code Cell & Print Output
        page1 = await context.new_page()
        await page1.set_viewport_size({"width": 1280, "height": 720})
        print("1. Capturing Colab New Notebook Interface...")
        
        # Create a clean mock interactive Colab interface in HTML and snapshot it with perfect clarity
        colab_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; font-family: 'Google Sans', Roboto, sans-serif; background: #ffffff; color: #202124; }
                .topbar { height: 56px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 16px; background: #fff; }
                .logo { display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 18px; color: #5f6368; }
                .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #F9AB00, #EA4335, #4285F4); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
                .filename { font-size: 16px; font-weight: 500; color: #202124; border: 1px solid transparent; padding: 4px 8px; border-radius: 4px; }
                .toolbar { height: 44px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 12px; background: #fafafa; }
                .btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #dadce0; padding: 6px 14px; border-radius: 4px; font-size: 13px; font-weight: 500; cursor: pointer; color: #1a73e8; }
                .workspace { padding: 32px 48px; max-width: 960px; margin: 0 auto; }
                .cell { border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 24px; background: #fff; }
                .cell-header { background: #f8f9fa; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8eaed; font-size: 12px; color: #5f6368; }
                .cell-body { display: flex; }
                .play-btn-area { width: 64px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; border-right: 1px solid #e8eaed; }
                .play-btn { width: 36px; height: 36px; border-radius: 50%; background: #1a73e8; color: white; border: none; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; box-shadow: 0 2px 4px rgba(26,115,232,0.3); }
                .code-editor { flex: 1; padding: 18px 20px; font-family: 'Roboto Mono', monospace; font-size: 16px; line-height: 1.6; background: #fff; color: #000; }
                .kw { color: #0000ff; font-weight: bold; }
                .str { color: #008000; }
                .comment { color: #808080; font-style: italic; }
                .cell-output { background: #fafafa; border-top: 1px solid #e8eaed; padding: 16px 20px 16px 84px; font-family: 'Roboto Mono', monospace; font-size: 15px; color: #202124; }
                .output-label { font-size: 11px; color: #5f6368; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
                .badge-success { background: #e6f4ea; color: #137333; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; display: inline-flex; align-items: center; gap: 4px; }
                .annotation { position: absolute; background: #FFE500; border: 2px solid #1A1A1A; padding: 8px 14px; border-radius: 8px; font-weight: bold; font-size: 13px; box-shadow: 3px 3px 0 #1A1A1A; z-index: 100; }
            </style>
        </head>
        <body>
            <div class="topbar">
                <div class="logo">
                    <div class="logo-icon">CO</div>
                    <span>Google Colab</span>
                </div>
                <div class="filename">Materi_01_Pengantar_Python.ipynb</div>
                <div style="margin-left: auto; display: flex; gap: 12px; align-items: center;">
                    <span class="badge-success">● RAM: 12.7 GB · Disk: 107.7 GB</span>
                </div>
            </div>
            <div class="toolbar">
                <button class="btn">＋ Code</button>
                <button class="btn" style="color:#5f6368;">＋ Text</button>
            </div>
            <div class="workspace">
                <div class="cell">
                    <div class="cell-header">
                        <span>[ 1 ] Code Cell Python 3</span>
                        <span>0s · Selesai Dieksekusi</span>
                    </div>
                    <div class="cell-body">
                        <div class="play-btn-area">
                            <button class="play-btn">▶</button>
                        </div>
                        <div class="code-editor">
                            <span class="comment"># Perintah pertama kita di Python:</span><br>
                            <span class="kw">print</span>(<span class="str">"Halo, selamat datang di UOB My Digital Space!"</span>)<br>
                            <span class="kw">print</span>(<span class="str">"Saya siap belajar coding dari nol! 🚀"</span>)
                        </div>
                    </div>
                    <div class="cell-output">
                        <div class="output-label">Hasil Eksekusi (Output):</div>
                        <div style="font-weight: 500;">
                            Halo, selamat datang di UOB My Digital Space!<br>
                            Saya siap belajar coding dari nol! 🚀
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        await page1.set_content(colab_html)
        await asyncio.sleep(1)
        p1 = os.path.join(ASSETS_DIR, "02_colab_code_cell_print.png")
        await page1.screenshot(path=p1)
        print("Saved:", p1)

        # 2. Input-Process-Output Diagram
        print("2. Capturing Input-Process-Output Diagram...")
        ipo_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; padding: 40px; background: #0A192F; font-family: 'Fredoka', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; box-sizing: border-box; }
                .diagram-container { width: 100%; max-width: 1000px; background: #101828; border: 3px solid #1E293B; border-radius: 24px; padding: 48px 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; }
                h1 { color: #FFE500; font-size: 28px; margin-bottom: 36px; text-transform: uppercase; letter-spacing: 1px; }
                .flow-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
                .box { flex: 1; background: #1E293B; border: 3px solid #334155; border-radius: 18px; padding: 24px 16px; box-shadow: 5px 5px 0 #000; text-align: center; }
                .box.input { border-color: #00C6FF; }
                .box.process { border-color: #FFE500; }
                .box.output { border-color: #00E676; }
                .icon { font-size: 44px; margin-bottom: 12px; }
                .title { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
                .box.input .title { color: #00C6FF; }
                .box.process .title { color: #FFE500; }
                .box.output .title { color: #00E676; }
                .desc { color: #94A3B8; font-size: 14px; line-height: 1.4; }
                .arrow { font-size: 36px; color: #F8FAFC; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="diagram-container">
                <h1>💡 Cara Komputer Berpikir: Siklus I-P-O</h1>
                <div class="flow-row">
                    <div class="box input">
                        <div class="icon">⌨️</div>
                        <div class="title">1. INPUT</div>
                        <div class="desc">Masukan instruksi atau data dari programmer atau keyboard</div>
                    </div>
                    <div class="arrow">➔</div>
                    <div class="box process">
                        <div class="icon">⚙️</div>
                        <div class="title">2. PROSES</div>
                        <div class="desc">Python membaca dan mengeksekusi logika perintah baris demi baris</div>
                    </div>
                    <div class="arrow">➔</div>
                    <div class="box output">
                        <div class="icon">🖥️</div>
                        <div class="title">3. OUTPUT</div>
                        <div class="desc">Hasil yang ditampilkan ke layar monitor (lewat fungsi print)</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        await page1.set_content(ipo_html)
        await asyncio.sleep(1)
        p2 = os.path.join(ASSETS_DIR, "03_python_ipo_cycle.png")
        await page1.screenshot(path=p2)
        print("Saved:", p2)

        # 3. Variable Memory Box Analogy
        print("3. Capturing Variable Memory Box Analogy...")
        var_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; padding: 40px; background: #0A192F; font-family: 'Fredoka', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; box-sizing: border-box; }
                .card { width: 100%; max-width: 1050px; background: #101828; border: 3px solid #1E293B; border-radius: 24px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; }
                h1 { color: #00C6FF; font-size: 28px; margin-bottom: 32px; }
                .boxes-row { display: flex; justify-content: center; gap: 28px; }
                .var-card { width: 280px; background: #1E293B; border: 3px solid #FFE500; border-radius: 16px; padding: 24px; box-shadow: 6px 6px 0 #000; }
                .label-tag { background: #FFE500; color: #000; font-weight: bold; font-size: 15px; padding: 6px 14px; border-radius: 8px; display: inline-block; margin-bottom: 16px; }
                .content-value { font-size: 32px; color: #FFF; font-family: 'Roboto Mono', monospace; font-weight: bold; margin-bottom: 12px; }
                .type-badge { font-size: 13px; color: #94A3B8; background: #0F172A; padding: 4px 10px; border-radius: 6px; display: inline-block; }
                .code-box { margin-top: 32px; background: #0F172A; border: 2px solid #334155; border-radius: 12px; padding: 16px; font-family: 'Roboto Mono', monospace; font-size: 17px; color: #A5F3FC; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>📦 Variabel = Kotak Berlabel di Memori Komputer</h1>
                <div class="boxes-row">
                    <div class="var-card">
                        <span class="label-tag">Label: nama_siswa</span>
                        <div class="content-value" style="color: #6EE7B7;">"Budi"</div>
                        <span class="type-badge">Tipe Data: String (Teks)</span>
                    </div>
                    <div class="var-card" style="border-color: #00C6FF;">
                        <span class="label-tag" style="background:#00C6FF;">Label: saldo</span>
                        <div class="content-value" style="color: #93C5FD;">50000</div>
                        <span class="type-badge">Tipe Data: Integer (Angka)</span>
                    </div>
                    <div class="var-card" style="border-color: #FF3366;">
                        <span class="label-tag" style="background:#FF3366; color:#fff;">Label: aktif</span>
                        <div class="content-value" style="color: #FCA5A5;">True</div>
                        <span class="type-badge">Tipe Data: Boolean (Benar/Salah)</span>
                    </div>
                </div>
                <div class="code-box">
                    <span style="color:#F59E0B;"># Kode Python untuk membuat 3 kotak di atas:</span><br>
                    nama_siswa = <span style="color:#6EE7B7;">"Budi"</span><br>
                    saldo = <span style="color:#93C5FD;">50000</span><br>
                    aktif = <span style="color:#FCA5A5;">True</span>
                </div>
            </div>
        </body>
        </html>
        """
        await page1.set_content(var_html)
        await asyncio.sleep(1)
        p3 = os.path.join(ASSETS_DIR, "04_variable_box_analogy.png")
        await page1.screenshot(path=p3)
        print("Saved:", p3)

        # 4. MIT App Inventor Designer Overview
        print("4. Capturing MIT App Inventor Designer Overview...")
        ai_designer_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; background: #e0e0e0; font-family: sans-serif; }
                .navbar { background: #3b5998; color: white; height: 50px; display: flex; align-items: center; padding: 0 16px; gap: 20px; font-weight: bold; }
                .subnav { background: #fff; border-bottom: 2px solid #ccc; height: 42px; display: flex; align-items: center; padding: 0 16px; justify-content: space-between; }
                .tabs button { padding: 6px 16px; font-weight: bold; border-radius: 4px; cursor: pointer; }
                .tab-active { background: #4caf50; color: white; border: none; }
                .tab-inactive { background: #eee; border: 1px solid #ccc; color: #333; }
                .workspace-ai { display: flex; height: 600px; background: #fff; margin: 10px; border: 1px solid #ccc; }
                .panel { border-right: 1px solid #ccc; padding: 12px; }
                .palette { width: 220px; background: #f9f9f9; }
                .viewer { width: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f0f0f0; }
                .phone-mock { width: 260px; height: 480px; background: #fff; border: 8px solid #333; border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; }
                .phone-screen { padding: 20px 16px; flex: 1; display: flex; flex-direction: column; gap: 14px; }
                .components { width: 220px; background: #f9f9f9; }
                .properties { width: 240px; background: #fff; }
                .panel-title { font-weight: bold; font-size: 14px; padding-bottom: 8px; border-bottom: 2px solid #3b5998; margin-bottom: 12px; color: #222; }
                .palette-item { background: #fff; border: 1px solid #ddd; padding: 6px 10px; margin-bottom: 6px; border-radius: 4px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
                .btn-phone { background: #2196f3; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; text-align: center; }
                .input-phone { border: 1px solid #aaa; padding: 8px; border-radius: 4px; font-size: 13px; }
                .label-phone { font-size: 14px; color: #333; text-align: center; font-weight: 500; }
                .badge-hint { background: #FFE500; border: 2px solid #000; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; box-shadow: 2px 2px 0 #000; }
            </style>
        </head>
        <body>
            <div class="navbar">
                <span>🤖 MIT App Inventor</span>
                <span style="font-size: 14px; opacity: 0.9;">Project: Aplikasi_Sapa_Pemula</span>
            </div>
            <div class="subnav">
                <span style="font-weight: bold; color: #333;">Layar: Screen1</span>
                <div class="tabs">
                    <button class="tab-active">Designer (Tampilan)</button>
                    <button class="tab-inactive">Blocks (Koding Logika)</button>
                </div>
            </div>
            <div class="workspace-ai">
                <div class="panel palette">
                    <div class="panel-title">1. Palette (Pilihan Komponen)</div>
                    <div class="palette-item">🔘 Button (Tombol)</div>
                    <div class="palette-item">🏷️ Label (Teks)</div>
                    <div class="palette-item">📝 TextBox (Kotak Ketik)</div>
                    <div class="palette-item">🖼️ Image (Gambar)</div>
                </div>
                <div class="panel viewer">
                    <div class="panel-title" style="border:none; margin-bottom:6px;">2. Viewer (Layar HP)</div>
                    <div class="phone-mock">
                        <div style="background: #3b5998; color: white; padding: 8px; font-size: 12px; text-align: center;">Screen1</div>
                        <div class="phone-screen">
                            <div class="label-phone">Siapa namamu?</div>
                            <input class="input-phone" value="Budi Santoso" readonly />
                            <div class="btn-phone">Kirim Sapaan!</div>
                            <div class="label-phone" style="color: #4caf50; font-weight: bold; margin-top: 10px;">Halo Budi, selamat belajar!</div>
                        </div>
                    </div>
                </div>
                <div class="panel components">
                    <div class="panel-title">3. Components List</div>
                    <div style="font-size: 13px; line-height: 1.8;">
                        📱 Screen1<br>
                        &nbsp;&nbsp;🏷️ Label1<br>
                        &nbsp;&nbsp;📝 TextBox1<br>
                        &nbsp;&nbsp;🔘 Button1<br>
                        &nbsp;&nbsp;🏷️ LabelHasil
                    </div>
                </div>
                <div class="panel properties">
                    <div class="panel-title">4. Properties (Pengaturan)</div>
                    <div style="font-size: 13px; line-height: 2;">
                        <b>Text:</b> Kirim Sapaan!<br>
                        <b>BackgroundColor:</b> Blue<br>
                        <b>FontSize:</b> 16.0<br>
                        <b>Width:</b> Fill parent
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        await page1.set_content(ai_designer_html)
        await asyncio.sleep(1)
        p4 = os.path.join(ASSETS_DIR, "05_appinventor_designer_tour.png")
        await page1.screenshot(path=p4)
        print("Saved:", p4)

        # 5. MIT App Inventor Blocks Editor
        print("5. Capturing MIT App Inventor Blocks Editor...")
        ai_blocks_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; background: #ffffff; font-family: 'Fredoka', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .canvas { width: 1000px; height: 580px; background: #fafafa; background-image: radial-gradient(#d1d5db 1px, transparent 1px); background-size: 20px 20px; border: 3px solid #1E293B; border-radius: 20px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; }
                h2 { margin: 0 0 24px 0; color: #1E293B; font-size: 24px; }
                .block-event { background: #C28B10; color: white; border-radius: 12px 12px 12px 12px; padding: 16px 20px; width: 620px; box-shadow: 4px 4px 0 #8B5E00; font-family: sans-serif; font-weight: bold; font-size: 16px; margin-bottom: 20px; }
                .block-body { background: #9E6B08; padding: 16px; border-radius: 0 0 8px 8px; margin-top: 10px; display: flex; flex-direction: column; gap: 12px; }
                .block-action { background: #2F984E; color: white; padding: 12px 16px; border-radius: 8px; display: flex; align-items: center; gap: 10px; box-shadow: 3px 3px 0 #1B5E20; font-size: 15px; }
                .block-param { background: #8E24AA; color: white; padding: 8px 12px; border-radius: 6px; font-size: 14px; font-family: monospace; }
                .callout { position: absolute; right: 40px; top: 120px; width: 260px; background: #FFE500; border: 3px solid #000; border-radius: 14px; padding: 18px; box-shadow: 5px 5px 0 #000; font-size: 14px; color: #000; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class="canvas">
                <h2>🧩 Logika Blok: Memberi Nyawa pada Tombol</h2>
                <div class="block-event">
                    when Button1 .Click do
                    <div class="block-body">
                        <div class="block-action">
                            set LabelHasil .Text to
                            <div class="block-param" style="background:#43A047;">join</div>
                            <div class="block-param" style="background:#B71C1C;">"Halo, "</div>
                            <div class="block-param" style="background:#E65100;">TextBox1 .Text</div>
                        </div>
                    </div>
                </div>
                <div class="callout">
                    <b>💡 Cara Membaca Blok:</b><br><br>
                    1. <b>Kuning:</b> Saat tombol ditekan.<br>
                    2. <b>Hijau:</b> Ganti tulisan LabelHasil.<br>
                    3. <b>Merah + Oranye:</b> Gabungkan kata <i>"Halo, "</i> dengan teks yang diketik siswa di TextBox!
                </div>
            </div>
        </body>
        </html>
        """
        await page1.set_content(ai_blocks_html)
        await asyncio.sleep(1)
        p5 = os.path.join(ASSETS_DIR, "06_appinventor_blocks_logic.png")
        await page1.screenshot(path=p5)
        print("Saved:", p5)

        await page1.close()
        print("All 5 screenshot visuals captured successfully!")

asyncio.run(capture_all())
