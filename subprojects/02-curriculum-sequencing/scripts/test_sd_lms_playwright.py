import asyncio
from playwright.async_api import async_playwright
import os

SCREENSHOT_DIR = "/Users/yazidhilmi/.gemini/antigravity-ide/brain/ec8944f1-9ecc-4ac0-a351-be3754892890"

async def test_lms():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        # Load SD LMS from local server port 8080 or file
        url = "http://localhost:8080/index.html?track=upperprimary"
        print(f"Navigating to {url}...")
        await page.goto(url, wait_until="networkidle")
        await asyncio.sleep(2)

        title = await page.title()
        print(f"Page title: {title}")

        # Check total lesson tabs
        tabs = await page.query_selector_all(".lesson-tab, .step-tab, .nav-tab, [data-step-id]")
        print(f"Total step/lesson elements found: {len(tabs)}")

        # Check step titles
        step_items = await page.query_selector_all(".step-item, .lesson-item, button.tab-btn")
        print(f"Total tab buttons/items: {len(step_items)}")

        # Screenshot SD LMS home/step 1
        shot_path = os.path.join(SCREENSHOT_DIR, "lms_sd_18_steps_overview.png")
        await page.screenshot(path=shot_path, full_page=False)
        print(f"📸 LMS SD overview screenshot saved: {shot_path}")

        # Now test bridge-sd-00 slide directly
        slide_url = "http://localhost:8080/slides/bridge-sd-00.html"
        print(f"Navigating directly to slide: {slide_url}...")
        await page.goto(slide_url, wait_until="networkidle")
        await asyncio.sleep(2)

        # Check images inside slide
        images = await page.eval_on_selector_all("img", "imgs => imgs.map(i => ({src: i.src, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight}))")
        print(f"Found {len(images)} images in slide:")
        for idx, img in enumerate(images, 1):
            status = "✅ LOADED" if img['naturalWidth'] > 0 else "❌ BROKEN"
            print(f"  {idx}. {img['src'][:60]}... -> {status} ({img['naturalWidth']}x{img['naturalHeight']})")

        slide_shot_path = os.path.join(SCREENSHOT_DIR, "lms_slide_bridge_sd_00_verified.png")
        await page.screenshot(path=slide_shot_path, full_page=False)
        print(f"📸 Slide bridge-sd-00 screenshot saved: {slide_shot_path}")

        await browser.close()
        print("✅ Playwright test completed successfully!")

if __name__ == '__main__':
    asyncio.run(test_lms())
