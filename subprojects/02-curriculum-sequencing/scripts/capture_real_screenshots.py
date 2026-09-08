import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def main():
    async with async_playwright() as p:
        print("Connecting to Chrome CDP on port 9222...")
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()
        
        # 1. Google Colab Homepage / Welcome Modal
        print("Navigating to Google Colab...")
        await page.goto("https://colab.research.google.com/", wait_until="networkidle")
        await page.wait_for_timeout(4000)
        
        colab_welcome_path = f"{OUTPUT_DIR}/colab_01_welcome_modal.png"
        await page.screenshot(path=colab_welcome_path)
        print(f"Captured: {colab_welcome_path}")
        
        # Check if there's a 'New Notebook' button or dialog
        try:
            new_nb_btn = page.locator('text="New notebook"').or_(page.locator('text="Notebook baru"')).first
            if await new_nb_btn.is_visible():
                print("Clicking New Notebook...")
                await new_nb_btn.click()
                await page.wait_for_timeout(6000)
        except Exception as e:
            print("Could not click new notebook modal:", e)
            
        colab_editor_path = f"{OUTPUT_DIR}/colab_02_editor_interface.png"
        await page.screenshot(path=colab_editor_path)
        print(f"Captured: {colab_editor_path}")
        
        # Try to type Python code into the first code cell
        try:
            code_cell = page.locator('.monaco-editor').first.or_(page.locator('.codecell-input-area')).first
            if await code_cell.is_visible():
                await code_cell.click()
                await page.keyboard.type('# Program Pertamaku di Google Colab\nprint("Halo Dunia! Selamat Datang di Python SMA")\nnama = "Ahmad Yazid"\nprint("Halo,", nama)')
                await page.wait_for_timeout(1000)
                colab_code_path = f"{OUTPUT_DIR}/colab_03_code_typed.png"
                await page.screenshot(path=colab_code_path)
                print(f"Captured: {colab_code_path}")
                
                print("Running cell with Shift+Enter...")
                await page.keyboard.press("Shift+Enter")
                await page.wait_for_timeout(6000)
                
                colab_run_path = f"{OUTPUT_DIR}/colab_04_run_output.png"
                await page.screenshot(path=colab_run_path)
                print(f"Captured: {colab_run_path}")
        except Exception as e:
            print("Error interacting with code cell:", e)
            
        await page.close()
        print("Done capturing Colab screenshots.")

if __name__ == "__main__":
    asyncio.run(main())
