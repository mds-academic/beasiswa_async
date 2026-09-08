import asyncio
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        
        # 1. Capture Colab Code Execution in Intro Notebook
        colab_page = None
        for page in context.pages:
            if "colab.research.google.com" in page.url:
                colab_page = page
                break
                
        if colab_page:
            print("Bringing Colab page to front...")
            await colab_page.bring_to_front()
            await colab_page.wait_for_timeout(1000)
            
            # Click '+ Code' button to insert a new code cell at the top
            try:
                code_btn = colab_page.locator('button:has-text("+ Code")').or_(colab_page.locator('button:has-text("Code")')).first
                if await code_btn.is_visible():
                    print("Clicking + Code...")
                    await code_btn.click()
                    await colab_page.wait_for_timeout(1000)
                    
                    # Type our custom Python code
                    await colab_page.keyboard.type('# Program Pembelajaran Python SMA\nnama = "Ahmad Yazid"\nsaldo = 500000\nprint("Halo,", nama)\nprint("Saldo Awal Kamu: Rp", saldo)\n\n# Simulasi Belanja\nbelanja = 75000\nsisa = saldo - belanja\nprint("Sisa Saldo:", sisa)')
                    await colab_page.wait_for_timeout(1000)
                    
                    # Capture cell with code typed
                    await colab_page.screenshot(path=f"{OUTPUT_DIR}/colab_04_custom_code.png")
                    print("Saved colab_04_custom_code.png")
                    
                    # Run the cell with Shift+Enter
                    print("Executing code cell...")
                    await colab_page.keyboard.press("Shift+Enter")
                    await colab_page.wait_for_timeout(8000)
                    
                    # Screenshot with execution output!
                    await colab_page.screenshot(path=f"{OUTPUT_DIR}/colab_05_cell_executed.png")
                    print("Saved colab_05_cell_executed.png")
            except Exception as e:
                print("Error with code cell:", e)
                
            # Open Files Sidebar to show Drive / Files
            try:
                files_icon = colab_page.locator('button[aria-label="Files"]').or_(colab_page.locator('.view-files')).first
                if await files_icon.is_visible():
                    await files_icon.click()
                    await colab_page.wait_for_timeout(2000)
                    await colab_page.screenshot(path=f"{OUTPUT_DIR}/colab_06_files_sidebar.png")
                    print("Saved colab_06_files_sidebar.png")
            except Exception as e:
                print("Files icon click error:", e)

        # 2. Open MIT App Inventor
        print("\nOpening MIT App Inventor in a new page...")
        ai_page = await context.new_page()
        try:
            await ai_page.goto("https://ai2.appinventor.mit.edu/", wait_until="domcontentloaded", timeout=45000)
            await ai_page.wait_for_timeout(6000)
            
            # Dismiss any survey/welcome dialogs
            for text in ["Continue", "Lanjutkan", "Dismiss", "Close", "Never Show Again", "Do Not Show Again"]:
                try:
                    btn = ai_page.locator(f'button:has-text("{text}")').or_(ai_page.locator(f'input[value="{text}"]')).first
                    if await btn.is_visible():
                        print(f"Dismissing dialog: {text}")
                        await btn.click()
                        await ai_page.wait_for_timeout(1500)
                except Exception:
                    pass
                    
            await ai_page.screenshot(path=f"{OUTPUT_DIR}/appinventor_01_main.png")
            print("Saved appinventor_01_main.png")
            
            # Check if there is an existing project or create one
            start_btn = ai_page.locator('button:has-text("Start new project")').or_(ai_page.locator('text="Start new project"')).first
            if await start_btn.is_visible():
                print("Clicking Start new project...")
                await start_btn.click()
                await ai_page.wait_for_timeout(1500)
                
                # Type project name
                proj_name_input = ai_page.locator('.gwt-TextBox').first
                if await proj_name_input.is_visible():
                    await proj_name_input.fill("DompetDigitalSMP")
                    await ai_page.keyboard.press("Enter")
                    await ai_page.wait_for_timeout(6000)
            else:
                # Open the first project in the list if available
                first_proj = ai_page.locator('.gwt-Hyperlink').first
                if await first_proj.is_visible():
                    print("Opening existing project...")
                    await first_proj.click()
                    await ai_page.wait_for_timeout(6000)
                    
            # Capture Designer Workspace (Palette, Viewer, Components, Properties)
            await ai_page.screenshot(path=f"{OUTPUT_DIR}/appinventor_02_designer.png")
            print("Saved appinventor_02_designer.png")
            
            # Click 'Blocks' button to capture Blocks editor
            blocks_btn = ai_page.locator('button:has-text("Blocks")').first
            if await blocks_btn.is_visible():
                print("Switching to Blocks tab...")
                await blocks_btn.click()
                await ai_page.wait_for_timeout(4000)
                await ai_page.screenshot(path=f"{OUTPUT_DIR}/appinventor_03_blocks.png")
                print("Saved appinventor_03_blocks.png")
        except Exception as e:
            print("App Inventor capture error:", e)
        finally:
            await ai_page.close()

if __name__ == "__main__":
    asyncio.run(main())
