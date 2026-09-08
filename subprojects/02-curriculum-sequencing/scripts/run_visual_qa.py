import os, sys, glob
from playwright.sync_api import sync_playwright

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing"
SLIDES_DIR = os.path.join(BASE_DIR, "slides")
SCREENSHOT_DIR = os.path.join(BASE_DIR, "drafts", "qa", "screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

HTML_FILES = [
    "bridge-hs-00.html", "bridge-hs-01.html", "bridge-hs-02.html",
    "bridge-hs-03.html", "bridge-hs-04.html", "bridge-hs-05.html",
    "bridge-ms-00.html", "bridge-ms-01.html", "bridge-ms-02.html", "bridge-ms-03.html"
]

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile": {"width": 375, "height": 812}
}

def run_qa():
    print(f"Starting Visual QA for {len(HTML_FILES)} bridge HTML files...")
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for fname in HTML_FILES:
            fpath = os.path.join(SLIDES_DIR, fname)
            if not os.path.exists(fpath):
                print(f"[FAIL] File not found: {fpath}")
                results.append({"file": fname, "status": "FAIL", "reason": "File not found"})
                continue
                
            file_url = f"file://{fpath}"
            
            for vp_name, vp_dims in VIEWPORTS.items():
                page = browser.new_page(viewport=vp_dims)
                console_errors = []
                page.on("pageerror", lambda err: console_errors.append(str(err)))
                page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
                
                try:
                    page.goto(file_url, wait_until="load", timeout=10000)
                    page.wait_for_timeout(500) # wait for animations
                    
                    title = page.title()
                    # Check slide elements
                    slide_elements = page.query_selector_all(".slide")
                    buttons = page.query_selector_all("button")
                    
                    shot_name = f"{os.path.splitext(fname)[0]}_{vp_name}.png"
                    shot_path = os.path.join(SCREENSHOT_DIR, shot_name)
                    page.screenshot(path=shot_path, full_page=False)
                    
                    has_errors = len(console_errors) > 0
                    status = "FAIL" if has_errors else "PASS"
                    reason = "; ".join(console_errors) if has_errors else f"Loaded OK, {len(slide_elements)} slides, {len(buttons)} buttons"
                    
                    results.append({
                        "file": fname,
                        "viewport": vp_name,
                        "status": status,
                        "title": title,
                        "slides_count": len(slide_elements),
                        "buttons_count": len(buttons),
                        "screenshot": shot_path,
                        "reason": reason
                    })
                    print(f"[{status}] {fname} ({vp_name}): {reason}")
                except Exception as e:
                    print(f"[ERROR] {fname} ({vp_name}): {e}")
                    results.append({
                        "file": fname,
                        "viewport": vp_name,
                        "status": "ERROR",
                        "reason": str(e)
                    })
                finally:
                    page.close()
                    
        browser.close()
        
    return results

if __name__ == "__main__":
    res = run_qa()
    all_pass = all(r["status"] == "PASS" for r in res)
    print("\nVisual QA Summary:")
    print(f"Total Tests: {len(res)}, Passed: {sum(1 for r in res if r['status'] == 'PASS')}")
    if all_pass:
        print("ALL VISUAL QA TESTS PASSED!")
    else:
        print("SOME VISUAL QA TESTS FAILED!")
        sys.exit(1)
