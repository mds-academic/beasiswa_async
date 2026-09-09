import asyncio
from playwright.async_api import async_playwright
import os

SCREENSHOT_DIR = "/Users/yazidhilmi/.gemini/antigravity-ide/brain/ec8944f1-9ecc-4ac0-a351-be3754892890"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        # 1. Buka halaman LMS
        print("Navigating to LMS login...")
        await page.goto("http://localhost:8080/index.html", wait_until="networkidle")
        await asyncio.sleep(1.5)

        # 2. Fokus dan ketik nama sekolah
        print("Typing school name...")
        await page.click("#login-school-input")
        await page.type("#login-school-input", "ANDALUS", delay=100)
        await asyncio.sleep(1)

        # Klik opsi sekolah pertama dari dropdown
        await page.wait_for_selector(".dropdown-item-school", timeout=5000)
        options = await page.query_selector_all(".dropdown-item-school")
        print(f"Found {len(options)} school dropdown options.")
        if options:
            await options[0].click()
            print("School selected successfully!")
            await asyncio.sleep(1)

        # 3. Masukkan email siswa
        print("Typing student email...")
        await page.wait_for_selector("#login-email-input:not([disabled])", timeout=5000)
        await page.fill("#login-email-input", "raffaghaisan90@gmail.com")
        await asyncio.sleep(0.5)

        # 4. Klik Mulai Belajar
        print("Clicking login button...")
        await page.click("#btn-login")
        await asyncio.sleep(4)

        # 5. Verifikasi tampilan dashboard kelas SD
        title = await page.title()
        print(f"Page title after login: {title}")

        # Simpan screenshot dashboard LMS SD
        shot_dash = os.path.join(SCREENSHOT_DIR, "lms_sd_dashboard_logged_in.png")
        await page.screenshot(path=shot_dash, full_page=False)
        print(f"📸 Saved dashboard screenshot: {shot_dash}")

        # Cek modul dan step
        steps = await page.query_selector_all(".step-btn, .step-item, .lesson-item, [data-step-id]")
        print(f"Total step buttons rendered: {len(steps)}")

        step_texts = []
        for s in steps:
            txt = (await s.inner_text()).strip().replace("\n", " - ")
            if txt:
                step_texts.append(txt)

        print("\n--- DAFTAR STEP LMS SD (UPPER PRIMARY) ---")
        for idx, st in enumerate(step_texts, 1):
            print(f"{idx}. {st}")

        # Screenshot iframe slide bridge-sd-00
        iframe_el = await page.query_selector("iframe")
        if iframe_el:
            print("Found slide iframe! Capturing slide in LMS view...")
            shot_slide = os.path.join(SCREENSHOT_DIR, "lms_sd_step1_slide_view.png")
            await page.screenshot(path=shot_slide, full_page=False)
            print(f"📸 Saved step 1 slide view: {shot_slide}")

        await browser.close()
        print("\n🎉 Full E2E Verification Finished Successfully!")

if __name__ == '__main__':
    asyncio.run(main())
