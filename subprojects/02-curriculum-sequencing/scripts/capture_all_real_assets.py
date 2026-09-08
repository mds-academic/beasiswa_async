import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def capture_colab(context):
    print("=== CAPTURING GOOGLE COLAB ===")
    page = await context.new_page()
    
    # 1. Colab Welcome Page
    print("Navigating to Colab Home...")
    await page.goto("https://colab.research.google.com/", wait_until="networkidle")
    await page.wait_for_timeout(3000)
    await page.screenshot(path=f"{OUTPUT_DIR}/colab_01_welcome.png")
    print("Saved colab_01_welcome.png")
    
    # 2. Open Welcome / Intro Notebook
    print("Navigating to Colab Intro Notebook...")
    await page.goto("https://colab.research.google.com/notebooks/intro.ipynb", wait_until="networkidle")
    await page.wait_for_timeout(6000)
    await page.screenshot(path=f"{OUTPUT_DIR}/colab_02_full_notebook.png")
    print("Saved colab_02_full_notebook.png")
    
    # 3. Create a fresh new notebook
    print("Creating new notebook via #create=true...")
    new_page = await context.new_page()
    await new_page.goto("https://colab.research.google.com/#create=true", wait_until="networkidle")
    await new_page.wait_for_timeout(8000)
    
    # Wait for the notebook cell to appear
    try:
        await new_page.wait_for_selector('.cell', timeout=15000)
    except Exception as e:
        print("Timeout waiting for .cell:", e)
        
    await new_page.screenshot(path=f"{OUTPUT_DIR}/colab_03_new_notebook.png")
    print("Saved colab_03_new_notebook.png")
    
    # Try to focus code cell and run code
    try:
        # Click on code cell editor
        editor = new_page.locator('.monaco-editor').first
        if await editor.is_visible():
            await editor.click()
            await new_page.keyboard.type('# Belajar Python di Google Colab\nprint("Halo Dunia! Selamat Datang di Python SMA")\nnama = "Budi"\numur = 16\nprint("Halo,", nama, "umurmu", umur, "tahun")')
            await new_page.wait_for_timeout(1500)
            await new_page.screenshot(path=f"{OUTPUT_DIR}/colab_04_code_cell.png")
            print("Saved colab_04_code_cell.png")
            
            # Click the Run button on the cell
            run_btn = new_page.locator('.cell-execution-container').first.or_(new_page.locator('.run-button')).first
            if await run_btn.is_visible():
                await run_btn.click()
            else:
                await new_page.keyboard.press("Shift+Enter")
            
            print("Waiting for execution...")
            await new_page.wait_for_timeout(10000)
            await new_page.screenshot(path=f"{OUTPUT_DIR}/colab_05_execution_result.png")
            print("Saved colab_05_execution_result.png")
    except Exception as e:
        print("Error during code execution capture:", e)
        
    # Open Files / Drive sidebar
    try:
        files_btn = new_page.locator('button[aria-label="Files"]').or_(new_page.locator('button[title*="Files"]')).first
        if await files_btn.is_visible():
            await files_btn.click()
            await new_page.wait_for_timeout(3000)
            await new_page.screenshot(path=f"{OUTPUT_DIR}/colab_06_files_sidebar.png")
            print("Saved colab_06_files_sidebar.png")
    except Exception as e:
        print("Files sidebar error:", e)
        
    await page.close()
    await new_page.close()

async def capture_app_inventor(context):
    print("=== CAPTURING MIT APP INVENTOR ===")
    page = await context.new_page()
    
    print("Navigating to MIT App Inventor AI2...")
    await page.goto("https://ai2.appinventor.mit.edu/", wait_until="networkidle")
    await page.wait_for_timeout(6000)
    
    # Check what page appeared (login page, survey/terms dialog, or projects list)
    await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_01_landing.png")
    print("Saved appinventor_01_landing.png")
    
    # Handle possible dialogs (Terms of Service, Survey, etc.)
    for btn_text in ["I accept", "Saya setuju", "Continue", "Lanjutkan", "Dismiss", "Close"]:
        try:
            btn = page.locator(f'button:has-text("{btn_text}")').or_(page.locator(f'input[value="{btn_text}"]')).first
            if await btn.is_visible():
                print(f"Clicking dialog button: {btn_text}")
                await btn.click()
                await page.wait_for_timeout(2000)
        except Exception:
            pass
            
    await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_02_after_dialogs.png")
    print("Saved appinventor_02_after_dialogs.png")
    
    # If on project list or can create a project
    try:
        # Start new project button
        start_proj = page.locator('text="Start new project"').or_(page.locator('text="Mulai proyek baru"')).first
        if await start_proj.is_visible():
            print("Clicking Start new project...")
            await start_proj.click()
            await page.wait_for_timeout(1500)
            # Enter project name
            proj_input = page.locator('input[type="text"]').last
            if await proj_input.is_visible():
                await proj_input.fill("Belajar_App_Inventor_SMP")
                await page.keyboard.press("Enter")
                await page.wait_for_timeout(6000)
    except Exception as e:
        print("Start project flow note:", e)
        
    await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_03_designer_workspace.png")
    print("Saved appinventor_03_designer_workspace.png")
    
    # Switch to Blocks editor if available
    try:
        blocks_btn = page.locator('button:has-text("Blocks")').or_(page.locator('text="Blocks"')).first
        if await blocks_btn.is_visible():
            print("Switching to Blocks tab...")
            await blocks_btn.click()
            await page.wait_for_timeout(4000)
            await page.screenshot(path=f"{OUTPUT_DIR}/appinventor_04_blocks_workspace.png")
            print("Saved appinventor_04_blocks_workspace.png")
    except Exception as e:
        print("Blocks switch error:", e)
        
    await page.close()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        await capture_colab(context)
        await capture_app_inventor(context)
        print("All captures completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
