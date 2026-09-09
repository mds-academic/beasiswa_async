import asyncio
import os
from playwright.async_api import async_playwright

SCREENSHOT_DIR = "/Users/yazidhilmi/.gemini/antigravity-ide/brain/ec8944f1-9ecc-4ac0-a351-be3754892890"

async def main():
    async with async_playwright() as p:
        print("Connecting to Chrome over CDP on port 9222...")
        browser = await p.chromium.connect_over_cdp('http://localhost:9222')
        context = browser.contexts[0]
        
        script_page = None
        sheet_page = None
        for page in context.pages:
            url = page.url
            if 'script.google.com' in url and '1OBi2PPa6i5O8Jpjmf' in url:
                script_page = page
            elif 'docs.google.com/spreadsheets' in url and '1s6VVCGLPwiGWYwBNiR' in url:
                sheet_page = page

        if not script_page:
            print("❌ script.google.com page not found in open tabs!")
            return
        
        print("Found Apps Script page. Reloading editor to load latest Code.gs...")
        await script_page.reload(wait_until='domcontentloaded')
        await asyncio.sleep(6)
        
        print("Apps Script Title:", await script_page.title())
        
        # Click function dropdown
        listbox = script_page.locator('div[role="listbox"][aria-label*="fungsi"]').first
        print("Clicking function selector dropdown...")
        await listbox.click()
        await asyncio.sleep(1.5)
        
        # Target function: setupAllLMSSheets
        target_fn = "setupAllLMSSheets"
        opt = script_page.locator(f'div[role="option"]:has-text("{target_fn}")').first
        if await opt.count() > 0:
            print(f"Found option {target_fn}! Selecting...")
            await opt.click()
            await asyncio.sleep(1)
            
            run_btn = script_page.locator('button:has-text("Jalankan")').first
            print("Clicking 'Jalankan' button...")
            await run_btn.click()
            
            # Monitor execution logs
            finished = False
            for i in range(45):
                await asyncio.sleep(1)
                body_text = await script_page.locator('body').inner_text()
                if "Eksekusi selesai" in body_text:
                    print(f"🎉 SUCCESS: 'Eksekusi selesai' detected at second {i+1}!")
                    finished = True
                    break
                elif "Eksekusi gagal" in body_text:
                    print("❌ FAILED: 'Eksekusi gagal' detected in log console!")
                    print(body_text[-500:])
                    return
                else:
                    if (i + 1) % 5 == 0:
                        print(f"Still executing setupAllLMSSheets... ({i+1}s)")
            
            if not finished:
                print("⚠️ Timeout waiting for 'Eksekusi selesai'. Checking spreadsheet...")
        else:
            print(f"❌ Option {target_fn} not found in dropdown list!")
            return

        # Now inspect Google Sheet
        if not sheet_page:
            print("Locating Google Sheet tab...")
            for page in context.pages:
                if 'docs.google.com/spreadsheets' in page.url:
                    sheet_page = page
                    break
        
        if sheet_page:
            print("\nReloading Google Sheet...")
            await sheet_page.reload(wait_until='domcontentloaded')
            await asyncio.sleep(7)
            
            await sheet_page.set_viewport_size({"width": 1600, "height": 1000})
            
            tabs_to_capture = [
                ("materi-sd", "screenshot_materi_sd_v4.png"),
                ("ops-result-sd", "screenshot_ops_result_sd_v4.png"),
                ("Changelog & Audit Log", "screenshot_changelog_audit_log_v4.png")
            ]
            
            for tab_name, shot_fname in tabs_to_capture:
                print(f"Selecting tab: '{tab_name}'...")
                tab_btn = sheet_page.locator(f'div[role="tab"]:has-text("{tab_name}")').first
                if await tab_btn.count() > 0:
                    await tab_btn.click()
                    await asyncio.sleep(2.5)
                    out_path = os.path.join(SCREENSHOT_DIR, shot_fname)
                    await sheet_page.screenshot(path=out_path)
                    print(f"📸 Screenshot saved: {out_path}")
                else:
                    print(f"⚠️ Tab '{tab_name}' not found!")
            
            print("\n✅ All operations and screenshots completed successfully!")

if __name__ == '__main__':
    asyncio.run(main())
