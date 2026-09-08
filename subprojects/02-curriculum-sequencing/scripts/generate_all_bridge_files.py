import os, json, re

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing"
DRAFTS_HTML_DIR = os.path.join(BASE_DIR, "drafts", "bridge-html")
os.makedirs(DRAFTS_HTML_DIR, exist_ok=True)

COMMON_CSS = """
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
            --yellow: #FFE500;
            --blue: #00C6FF;
            --black: #1A1A1A;
            --white: #FFFFFF;
            --bg-light: #E8E8E8;
            --green: #00E676;
            --pink: #FF9DE2;
            --red: #FF0055;
            --purple: #C084FC;
            --orange: #FF9F1C;
        }
        body {
            background-color: var(--bg-light);
            background-image: radial-gradient(#bcbcbc 2px, transparent 2px);
            background-size: 30px 30px;
            font-family: 'Fredoka', sans-serif;
            color: var(--black);
            overflow: hidden;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .app-container {
            position: relative; z-index: 10;
            width: 98vw; max-width: 1400px;
            height: 98vh; max-height: 900px;
            display: flex; flex-direction: column;
        }
        .header {
            display: flex; justify-content: flex-start; align-items: flex-start;
            padding: 25px 50px 10px;
            position: relative;
            width: 100%;
        }
        .banner-container { 
            position: absolute; top: 20px; left: 0; width: 100%;
            text-align: center; display: flex; flex-direction: column; align-items: center; 
            z-index: 10; pointer-events: none;
        }
        .banner-shape {
            background-color: var(--blue);
            padding: 10px 50px;
            border: 4px solid var(--black);
            border-radius: 12px;
            box-shadow: 6px 6px 0px var(--black);
            display: inline-block;
        }
        .banner-text { 
            font-size: 24px; font-weight: 700; letter-spacing: 2px; color: var(--white); 
            text-shadow: 2px 2px 0px var(--black), -1px -1px 0px var(--black), 1px -1px 0px var(--black), -1px 1px 0px var(--black), 1px 1px 0px var(--black);
        }
        .banner-subtitle {
            background-color: var(--yellow); 
            color: var(--black); 
            padding: 6px 36px; 
            font-size: 15px; font-weight: 700;
            border: 3px solid var(--black);
            border-radius: 20px; 
            margin-top: -12px; 
            text-transform: uppercase; letter-spacing: 1px;
            box-shadow: 4px 4px 0px var(--black);
            display: inline-block;
        }
        .slides-area {
            flex: 1; position: relative; margin: 25px 50px 0; perspective: 1200px;
            min-height: 0; 
        }
        .slide {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: none;
        }
        .slide.active { 
            display: block; 
            animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popIn {
            from { opacity: 0; transform: scale(0.96) translateY(15px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .content-card {
            background-color: var(--white);
            border: 4px solid var(--black); 
            border-radius: 24px;
            padding: 35px 55px; 
            box-shadow: 12px 12px 0px var(--black);
            width: 100%; height: 100%; 
            overflow-y: auto;
            display: flex;
            position: relative;
        }
        .inner-content {
            width: 100%;
            display: flex;
            flex-direction: column;
        }
        .slide-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 18px;
            color: var(--black);
            border-bottom: 4px dashed var(--black);
            padding-bottom: 10px;
        }
        .slide-text {
            font-size: 18px;
            line-height: 1.6;
            color: #222222;
        }
        .slide-text p { margin-bottom: 14px; }
        .feature-card {
            background-color: #F8F9FA;
            border: 3px solid var(--black);
            border-radius: 16px;
            padding: 18px 22px;
            margin: 14px 0;
            box-shadow: 6px 6px 0px var(--black);
        }
        .feature-card ul { margin-left: 25px; margin-bottom: 0; }
        .feature-card li { margin-bottom: 8px; font-size: 17px; }
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px;
            margin: 16px 0;
        }
        .code-box {
            background: #1e1e1e;
            color: #d4d4d4;
            border: 3px solid var(--black);
            border-radius: 14px;
            padding: 16px;
            font-family: 'Consolas', monospace;
            font-size: 16px;
            line-height: 1.5;
            margin: 14px 0;
            box-shadow: 5px 5px 0px var(--black);
            overflow-x: auto;
        }
        .code-kw { color: #569cd6; font-weight: bold; }
        .code-str { color: #ce9178; }
        .code-num { color: #b5cea8; }
        .code-fn { color: #dcdcaa; }
        .code-cmt { color: #6a9955; font-style: italic; }
        .code-bool { color: #4ec9b0; font-weight: bold; }
        .styled-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            border: 3px solid var(--black);
            box-shadow: 6px 6px 0px var(--black);
            border-radius: 12px;
            overflow: hidden;
        }
        .styled-table th, .styled-table td {
            border: 2px solid var(--black);
            padding: 10px 16px;
            font-size: 16px;
            text-align: left;
        }
        .styled-table thead {
            background-color: var(--yellow);
            font-weight: 700;
        }
        .styled-table tbody tr:nth-child(even) {
            background-color: #F9FAFB;
        }
        .interactive-card {
            background: #FFFDE7;
            border: 4px solid var(--black);
            border-radius: 18px;
            padding: 22px;
            margin: 16px 0;
            box-shadow: 8px 8px 0px var(--black);
        }
        .interactive-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .quiz-container {
            margin: 14px 0;
        }
        .quiz-q {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
        }
        .quiz-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .quiz-opt {
            background: var(--white);
            border: 3px solid var(--black);
            border-radius: 12px;
            padding: 12px 18px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.15s;
            text-align: left;
        }
        .quiz-opt:hover {
            background: #FFF9C4;
            transform: translate(-2px, -2px);
            box-shadow: 4px 4px 0px var(--black);
        }
        .quiz-opt.correct {
            background: var(--green) !important;
            color: var(--black);
        }
        .quiz-opt.wrong {
            background: var(--red) !important;
            color: var(--white);
        }
        .quiz-feedback {
            margin-top: 12px;
            padding: 12px 18px;
            border: 3px solid var(--black);
            border-radius: 10px;
            font-weight: 700;
            font-size: 16px;
            display: none;
        }
        .bottom-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 50px 25px;
        }
        .nav-container {
            display: flex;
            gap: 16px;
        }
        .nav-btn {
            background-color: var(--yellow);
            color: var(--black);
            border: 3px solid var(--black);
            border-radius: 14px;
            padding: 10px 24px;
            font-family: 'Fredoka', sans-serif;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 5px 5px 0px var(--black);
            transition: 0.15s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .nav-btn:hover:not(:disabled) {
            transform: translate(-2px, -2px);
            box-shadow: 7px 7px 0px var(--black);
        }
        .nav-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            box-shadow: none;
        }
        .nav-btn.primary {
            background-color: var(--green);
        }
        .progress-bar-container {
            flex: 1;
            max-width: 400px;
            height: 20px;
            background-color: var(--white);
            border: 3px solid var(--black);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 4px 4px 0px var(--black);
            margin: 0 25px;
        }
        .progress-bar-fill {
            height: 100%;
            background-color: var(--pink);
            width: 12.5%;
            transition: width 0.3s ease;
        }
        .slide-counter {
            font-size: 18px;
            font-weight: 700;
            background: var(--white);
            padding: 6px 16px;
            border: 3px solid var(--black);
            border-radius: 10px;
            box-shadow: 3px 3px 0px var(--black);
        }
        .btn-action {
            background: var(--green);
            color: var(--black);
            border: 3px solid var(--black);
            border-radius: 10px;
            padding: 10px 20px;
            font-family: 'Fredoka', sans-serif;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 4px 4px 0px var(--black);
            transition: 0.15s;
        }
        .btn-action:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px var(--black);
        }
        .input-mini {
            padding: 8px 14px;
            border: 3px solid var(--black);
            border-radius: 8px;
            font-family: 'Fredoka', sans-serif;
            font-size: 16px;
            font-weight: 600;
            margin: 4px 8px 4px 0;
        }
        .output-console {
            background: #1e1e1e;
            color: #00E676;
            border: 3px solid var(--black);
            border-radius: 10px;
            padding: 14px 18px;
            font-family: 'Consolas', monospace;
            font-size: 16px;
            margin-top: 12px;
            box-shadow: 4px 4px 0px var(--black);
        }
        .badge-block {
            display: inline-block;
            padding: 4px 12px;
            border: 2px solid var(--black);
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
            margin: 2px 4px;
            box-shadow: 2px 2px 0px var(--black);
        }
        .badge-event { background-color: #FFC107; color: #000; }
        .badge-text { background-color: #E91E63; color: #fff; }
        .badge-prop { background-color: #4CAF50; color: #fff; }
        .badge-var { background-color: #FF9800; color: #fff; }
        .badge-db { background-color: #9C27B0; color: #fff; }
        .badge-call { background-color: #7C4DFF; color: #fff; }
"""

def build_html(title, default_title, default_subtitle, slides_html, scripts_html=""):
    return f"""<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Consolas&display=swap" rel="stylesheet">
    <style>
{COMMON_CSS}
    </style>
</head>
<body>
    <div class="app-container">
        <div class="header">
            <div class="banner-container">
                <div class="banner-shape">
                    <span class="banner-text" id="banner-title">{default_title}</span>
                </div>
                <div class="banner-subtitle" id="banner-subtitle">{default_subtitle}</div>
            </div>
        </div>

        <div class="slides-area">
{slides_html}
        </div>

        <div class="bottom-bar">
            <button class="nav-btn" id="btn-prev" disabled>⬅️ Kembali</button>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="progress-bar"></div>
            </div>
            <div class="slide-counter">
                <span id="current-slide-num">1</span> / <span id="total-slides-num">8</span>
            </div>
            <button class="nav-btn primary" id="btn-next">Lanjut ➡️</button>
        </div>
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const counter = document.getElementById('current-slide-num');
        const totalNum = document.getElementById('total-slides-num');
        const bar = document.getElementById('progress-bar');
        const bannerTitle = document.getElementById('banner-title');
        const bannerSubtitle = document.getElementById('banner-subtitle');

        totalNum.innerText = slides.length;

        function showSlide(index) {{
            if (index < 0 || index >= slides.length) return;
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');

            btnPrev.disabled = currentSlide === 0;
            btnNext.disabled = currentSlide === slides.length - 1;
            counter.innerText = currentSlide + 1;
            bar.style.width = (((currentSlide + 1) / slides.length) * 100) + '%';

            const activeSlide = slides[currentSlide];
            const t = activeSlide.getAttribute('data-title');
            const s = activeSlide.getAttribute('data-subtitle');
            if (t && bannerTitle) bannerTitle.innerText = t;
            if (s && bannerSubtitle) bannerSubtitle.innerText = s;
        }}

        btnNext.addEventListener('click', () => {{
            if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
        }});
        btnPrev.addEventListener('click', () => {{
            if (currentSlide > 0) showSlide(currentSlide - 1);
        }});

        document.addEventListener('keydown', (e) => {{
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
            if (e.key === 'ArrowRight' || e.key === ' ') {{
                if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
            }}
            if (e.key === 'ArrowLeft') {{
                if (currentSlide > 0) showSlide(currentSlide - 1);
            }}
        }});

        function handleQuiz(el, isCorrect, feedbackId, successMsg, failMsg) {{
            const parent = el.parentElement;
            parent.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('correct', 'wrong'));
            const fb = document.getElementById(feedbackId);
            if (!fb) return;
            fb.style.display = 'block';
            if (isCorrect) {{
                el.classList.add('correct');
                fb.innerHTML = '✅ ' + successMsg;
                fb.style.backgroundColor = 'var(--green)';
                fb.style.color = 'var(--black)';
            }} else {{
                el.classList.add('wrong');
                fb.innerHTML = '❌ ' + failMsg;
                fb.style.backgroundColor = 'var(--red)';
                fb.style.color = 'var(--white)';
            }}
        }}

{scripts_html}
    </script>
</body>
</html>"""

print("Base setup ready.")
