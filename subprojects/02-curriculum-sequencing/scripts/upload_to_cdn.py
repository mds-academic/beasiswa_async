import asyncio
import os
import json
import time
from playwright.async_api import async_playwright

ASSETS_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing/assets"
MAP_FILE = os.path.join(ASSETS_DIR, "cdn-map.json")
UPLOADER_URL = "https://file-uploader.sirogu.com/?referralCookiesId=d5d02feb-87bd-4970-bcd4-db7030b1dc06&tenantName=ruangguru"

EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp')

def load_map():
    if os.path.exists(MAP_FILE):
        try:
            with open(MAP_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_map(data):
    os.makedirs(ASSETS_DIR, exist_ok=True)
    with open(MAP_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, sort_keys=True)

async def ensure_ready(page):
    await page.goto(UPLOADER_URL, timeout=30000)
    await asyncio.sleep(2)
    login_btn = page.locator("button:has-text('Login')")
    if await login_btn.count() > 0:
        print("Logging in to Ruangguru Uploader...")
        await login_btn.first.click()
        await asyncio.sleep(2)
        email_input = page.locator("#email")
        if await email_input.count() > 0:
            await email_input.fill("ahmad.yazid@ruangguru.id")
            await page.locator("#password").fill("CumaSeribu500#")
            await page.locator("button[type='submit']:has-text('Masuk')").click()
            await asyncio.sleep(4)
        account_card = page.locator("p[title='ahmad.yazid@ruangguru.id']")
        if await account_card.count() > 0:
            await account_card.click()
            await asyncio.sleep(4)
            
    select = page.locator("select.chakra-select")
    if await select.count() > 0:
        await select.select_option("rg_cdn_web_2")
        await asyncio.sleep(1)
        print("Bucket rg_cdn_web_2 selected and ready.")

async def upload_pending_assets():
    cdn_map = load_map()
    all_files = [
        f for f in os.listdir(ASSETS_DIR)
        if f.lower().endswith(EXTENSIONS) and not f.startswith('.')
    ]
    all_files.sort()
    pending = [f for f in all_files if f not in cdn_map]
    
    print(f"Total asset files: {len(all_files)}")
    print(f"Already mapped: {len(cdn_map)}")
    print(f"Pending upload: {len(pending)}")
    
    if not pending:
        print("All assets already uploaded to CDN!")
        return cdn_map

    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()
        
        await ensure_ready(page)
        
        for idx, filename in enumerate(pending, 1):
            full_path = os.path.join(ASSETS_DIR, filename)
            print(f"\n[{idx}/{len(pending)}] Uploading {filename}...")
            
            success = False
            for attempt in range(2):
                try:
                    prev_top = None
                    links = page.locator(".css-joj4lz a")
                    if await links.count() > 0:
                        prev_top = await links.first.get_attribute("href")
                        
                    file_input = page.locator("input[type='file']")
                    await file_input.set_input_files(full_path)
                    await asyncio.sleep(0.3)
                    
                    upload_btn = page.locator("button:has-text('Upload File')")
                    t0 = time.time()
                    await upload_btn.click()
                    
                    uploaded_url = None
                    for _ in range(30):
                        await asyncio.sleep(0.5)
                        links = page.locator(".css-joj4lz a")
                        if await links.count() > 0:
                            curr_top = await links.first.get_attribute("href")
                            if curr_top and curr_top != prev_top and "landing-pages/assets" in curr_top:
                                uploaded_url = curr_top
                                break
                                
                    if uploaded_url:
                        cleaned_url = uploaded_url.replace("ruangguru.com//landing-pages", "ruangguru.com/landing-pages")
                        cdn_map[filename] = cleaned_url
                        save_map(cdn_map)
                        t1 = time.time()
                        print(f"✅ {filename} -> {cleaned_url} ({t1-t0:.2f}s)")
                        success = True
                        break
                    else:
                        print(f"⚠️ Attempt {attempt+1} timeout waiting for URL: {filename}")
                except Exception as e:
                    print(f"⚠️ Error uploading {filename}: {e}")
                    await asyncio.sleep(1)
                    
            if not success:
                print(f"❌ FAILED to upload {filename} after 2 attempts.")
                
        await page.close()
        print(f"\nBatch upload finished. Total in map: {len(cdn_map)}/{len(all_files)}")
        return cdn_map

if __name__ == "__main__":
    asyncio.run(upload_pending_assets())
