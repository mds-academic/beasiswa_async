import asyncio
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()
        
        print("Opening App Inventor...")
        await page.goto("https://ai2.appinventor.mit.edu/", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)
        
        # Click Google account if shown
        try:
            acc = page.locator('text="ahmadyazid.ruangguru@gmail.com"').first
            if await acc.is_visible():
                print("Clicking account...")
                await acc.click()
                await page.wait_for_timeout(8000)
        except Exception as e:
            print("Account click note:", e)
            
        print("Current URL:", page.url)
        # Check for Google "Lanjutkan" / "Continue" OAuth consent button
        try:
            lanjutkan = page.locator('button:has-text("Lanjutkan")').or_(page.locator('button:has-text("Continue")')).first
            if await lanjutkan.is_visible():
                print("Clicking Lanjutkan consent...")
                await lanjutkan.click()
                await page.wait_for_timeout(8000)
        except Exception as e:
            print("Lanjutkan note:", e)
            
        print("Current URL after OAuth:", page.url)
        await page.wait_for_timeout(5000)
        
        # Dismiss any App Inventor welcome/survey dialogs
        for text in ["Continue", "Lanjutkan", "Dismiss", "Close", "Never Show Again", "Do Not Show Again"]:
            try:
                btn = page.locator(f'button:has-text("{text}")').or_(page.locator(f'input[value="{text}"]')).first
                if await btn.is_visible():
                    print(f"Dismissing dialog: {text}")
                    await btn.click()
                    await page.wait_for_timeout(2000)
            except Exception:
                pass
                
        # Take screenshot of workspace / project list
        await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_02_projects_list.png")
        print("Saved appinventor_02_projects_list.png")
        
        # Start new project
        try:
            new_btn = page.locator('button:has-text("Start new project")').first
            if await new_btn.is_visible():
                print("Clicking Start new project...")
                await new_btn.click()
                await page.wait_for_timeout(2000)
                # Text box for project name
                tb = page.locator('.gwt-TextBox').first
                if await tb.is_visible():
                    await tb.fill("BelajarAppInventor")
                    ok = page.locator('button:has-text("OK")').first
                    await ok.click()
                    await page.wait_for_timeout(8000)
        except Exception as e:
            print("New project note:", e)
            
        # Capture Designer
        await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_03_designer_real.png")
        print("Saved appinventor_03_designer_real.png")
        
        # Switch to Blocks
        try:
            blocks_tab = page.locator('button:has-text("Blocks")').first
            if await blocks_tab.is_visible():
                print("Clicking Blocks...")
                await blocks_tab.click()
                await page.wait_for_timeout(4000)
                await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_04_blocks_real.png")
                print("Saved appinventor_04_blocks_real.png")
        except Exception as e:
            print("Blocks note:", e)
            
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
