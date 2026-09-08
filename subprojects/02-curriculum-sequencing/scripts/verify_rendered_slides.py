import asyncio
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()
        await page.set_viewport_size({"width": 1440, "height": 900})
        
        # 1. HS Slides
        print("Testing bridge-hs-00.html...")
        await page.goto("file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/slides/bridge-hs-00.html", wait_until="load")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=f"{OUTPUT_DIR}/rendered_hs_slide_01.png")
        print("Saved rendered_hs_slide_01.png")
        
        # Navigate to Slide 6 (Langkah 2: Anatomi Colab with real screenshot)
        await page.evaluate("showSlide(5)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=f"{OUTPUT_DIR}/rendered_hs_slide_06.png")
        print("Saved rendered_hs_slide_06.png")
        
        # 2. MS Slides
        print("\nTesting bridge-ms-00.html...")
        await page.goto("file:///Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/slides/bridge-ms-00.html", wait_until="load")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=f"{OUTPUT_DIR}/rendered_ms_slide_01.png")
        print("Saved rendered_ms_slide_01.png")
        
        # Navigate to Slide 6 (Designer with real screenshot)
        await page.evaluate("showSlide(5)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=f"{OUTPUT_DIR}/rendered_ms_slide_06.png")
        print("Saved rendered_ms_slide_06.png")
        
        # Navigate to Slide 8 (Blocks with real screenshot)
        await page.evaluate("showSlide(7)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=f"{OUTPUT_DIR}/rendered_ms_slide_08.png")
        print("Saved rendered_ms_slide_08.png")
        
        await page.close()
        print("Verification captures complete!")

if __name__ == "__main__":
    asyncio.run(main())
