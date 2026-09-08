import asyncio
from playwright.async_api import async_playwright

OUTPUT_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets/real_screenshots"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        
        # Find Colab page among open pages
        colab_page = None
        for page in context.pages:
            url = page.url
            title = await page.title()
            print(f"Found page: {url} | {title}")
            if "colab.research.google.com" in url and "intro.ipynb" in url:
                colab_page = page
                
        if colab_page:
            print("Found open Colab Intro notebook page! Bringing to front and taking screenshot...")
            await colab_page.bring_to_front()
            await colab_page.wait_for_timeout(2000)
            await colab_page.screenshot(path=f"{OUTPUT_DIR}/colab_02_intro_notebook.png")
            print("Saved colab_02_intro_notebook.png!")
            
            # Now let's find the first code cell in this notebook and take a focused screenshot
            try:
                # Scroll a bit down to show a real code cell and execution
                await colab_page.evaluate("window.scrollBy(0, 350)")
                await colab_page.wait_for_timeout(1000)
                await colab_page.screenshot(path=f"{OUTPUT_DIR}/colab_03_code_cells.png")
                print("Saved colab_03_code_cells.png!")
            except Exception as e:
                print("Error scrolling:", e)
        else:
            print("Colab page not found in existing pages.")

if __name__ == "__main__":
    asyncio.run(main())
