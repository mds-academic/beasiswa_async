import asyncio
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        
        ai_page = None
        for page in context.pages:
            if "appinventor.mit.edu" in page.url:
                ai_page = page
                break
                
        if ai_page:
            print("Found open App Inventor tab! Bringing to front...")
            await ai_page.bring_to_front()
            await ai_page.wait_for_timeout(1000)
            
            # Click Blocks button
            blocks_btn = ai_page.locator('button:has-text("Blocks")').or_(ai_page.locator('.ode-HeaderTopButton:has-text("Blocks")')).first
            if await blocks_btn.is_visible():
                print("Clicking Blocks button...")
                await blocks_btn.click()
                await ai_page.wait_for_timeout(5000)
                await ai_page.screenshot(path=f"{OUTPUT_DIR}/appinventor_04_blocks_real.png")
                print("Saved appinventor_04_blocks_real.png!")
            else:
                print("Blocks button not found, searching with text...")
                b = ai_page.locator('text="Blocks"').first
                await b.click()
                await ai_page.wait_for_timeout(5000)
                await ai_page.screenshot(path=f"{OUTPUT_DIR}/appinventor_04_blocks_real.png")
                print("Saved appinventor_04_blocks_real.png!")
        else:
            print("App Inventor tab not found!")

if __name__ == "__main__":
    asyncio.run(main())
