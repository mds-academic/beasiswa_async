import asyncio
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()
        
        print("Navigating to App Inventor...")
        await page.goto("https://ai2.appinventor.mit.edu/", wait_until="domcontentloaded")
        await page.wait_for_timeout(4000)
        
        # If on Google login page, click the account
        try:
            account_btn = page.locator('text="ahmadyazid.ruangguru@gmail.com"').or_(page.locator('text="Ahmad Yazid Hilmi"')).first
            if await account_btn.is_visible():
                print("Clicking Google Account...")
                await account_btn.click()
                await page.wait_for_timeout(6000)
        except Exception as e:
            print("Login click note:", e)
            
        # Check if consent / terms dialog appears
        for btn_text in ["Continue", "Lanjutkan", "I accept", "Saya setuju", "Dismiss", "Close", "Never Show Again"]:
            try:
                b = page.locator(f'button:has-text("{btn_text}")').or_(page.locator(f'input[value="{btn_text}"]')).first
                if await b.is_visible():
                    print(f"Clicking dialog button: {btn_text}")
                    await b.click()
                    await page.wait_for_timeout(2000)
            except Exception:
                pass
                
        # Take screenshot of project list or active workspace
        await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_02_logged_in.png")
        print("Saved appinventor_02_logged_in.png")
        
        # Start a new project or open one
        try:
            start_btn = page.locator('button:has-text("Start new project")').or_(page.locator('text="Start new project"')).first
            if await start_btn.is_visible():
                print("Clicking Start new project...")
                await start_btn.click()
                await page.wait_for_timeout(2000)
                # Fill project name
                inp = page.locator('input[type="text"]').last
                if await inp.is_visible():
                    await inp.fill("AplikasiDompetDigital")
                    ok_btn = page.locator('button:has-text("OK")').first
                    if await ok_btn.is_visible():
                        await ok_btn.click()
                    else:
                        await page.keyboard.press("Enter")
                    await page.wait_for_timeout(7000)
            else:
                # Open first project
                proj_link = page.locator('.gwt-Hyperlink').first
                if await proj_link.is_visible():
                    print("Opening first project...")
                    await proj_link.click()
                    await page.wait_for_timeout(7000)
        except Exception as e:
            print("Project creation error:", e)
            
        # Now take Designer Workspace screenshot
        await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_03_designer.png")
        print("Saved appinventor_03_designer.png")
        
        # Switch to Blocks
        try:
            blocks_btn = page.locator('button:has-text("Blocks")').first
            if await blocks_btn.is_visible():
                print("Clicking Blocks button...")
                await blocks_btn.click()
                await page.wait_for_timeout(4000)
                await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_04_blocks.png")
                print("Saved appinventor_04_blocks.png")
        except Exception as e:
            print("Blocks error:", e)
            
        await page.close()

if __name__ == "__main__":
    asyncio.run(main())
