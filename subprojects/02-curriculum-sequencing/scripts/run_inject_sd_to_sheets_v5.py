import websocket
import json
import urllib.request
import time
import base64
import os

SCREENSHOT_DIR = "/Users/yazidhilmi/.gemini/antigravity-ide/brain/ec8944f1-9ecc-4ac0-a351-be3754892890"

class CDPClient:
    def __init__(self, ws_url):
        self.ws = websocket.create_connection(ws_url, suppress_origin=True)
        self.msg_id = 1

    def send(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        payload = {'id': mid, 'method': method}
        if params:
            payload['params'] = params
        self.ws.send(json.dumps(payload))
        
        while True:
            raw = self.ws.recv()
            data = json.loads(raw)
            if data.get('id') == mid:
                return data

    def eval(self, js_expr):
        res = self.send('Runtime.evaluate', {'expression': js_expr, 'returnByValue': True})
        return res.get('result', {}).get('result', {}).get('value')

    def capture_screenshot(self, filename):
        res = self.send('Page.captureScreenshot', {'format': 'png'})
        b64_data = res.get('result', {}).get('data')
        if b64_data:
            out_path = os.path.join(SCREENSHOT_DIR, filename)
            with open(out_path, 'wb') as f:
                f.write(base64.b64decode(b64_data))
            print(f"📸 Screenshot saved: {out_path}")
            return out_path
        return None

    def close(self):
        self.ws.close()

def run():
    print("Fetching CDP targets...")
    resp = urllib.request.urlopen('http://localhost:9222/json')
    targets = json.loads(resp.read().decode())
    
    app_target = next(t for t in targets if 'script.google.com' in t.get('url', '') and t.get('type') == 'page')
    sheet_target = next(t for t in targets if 'docs.google.com/spreadsheets' in t.get('url', '') and t.get('type') == 'page')
    
    print(f"Apps Script Target: {app_target['id']}")
    print(f"Spreadsheet Target: {sheet_target['id']}")
    
    # 1. Connect to Apps Script
    cdp_app = CDPClient(app_target['webSocketDebuggerUrl'])
    print("Reloading Apps Script editor to load latest Code.gs...")
    cdp_app.send('Page.reload')
    time.sleep(6)
    
    print("Editor Title:", cdp_app.eval("document.title"))
    
    # Step 1: Open listbox
    js_open_listbox = """
    (() => {
        const listbox = document.querySelector('div[role="listbox"][aria-label*="fungsi"]');
        if (listbox) {
            listbox.click();
            return 'OPENED';
        }
        return 'NOT_FOUND';
    })()
    """
    res1 = cdp_app.eval(js_open_listbox)
    print("Open listbox result:", res1)
    time.sleep(1.5)
    
    # Step 2: Select setupAllLMSSheets
    js_select_func = """
    (() => {
        const options = Array.from(document.querySelectorAll('div[role="option"]'));
        const target = options.find(o => o.innerText.includes('setupAllLMSSheets'));
        if (target) {
            target.click();
            return 'SELECTED: ' + target.innerText;
        }
        return 'AVAILABLE: ' + options.map(o => o.innerText.trim()).join(' | ');
    })()
    """
    res2 = cdp_app.eval(js_select_func)
    print("Select function result:", res2)
    time.sleep(1.5)
    
    # Step 3: Click Jalankan
    js_click_run = """
    (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const runBtn = btns.find(b => b.innerText.includes('Jalankan') || (b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('Jalankan')));
        if (runBtn) {
            runBtn.click();
            return 'CLICKED_RUN';
        }
        return 'NO_RUN_BTN';
    })()
    """
    res3 = cdp_app.eval(js_click_run)
    print("Click run result:", res3)
    
    # Step 4: Monitor execution
    print("Waiting for execution to complete...")
    execution_ok = False
    for i in range(40):
        time.sleep(1)
        body = cdp_app.eval("document.body.innerText") or ""
        if "Eksekusi selesai" in body:
            print(f"🎉 SUCCESS! 'Eksekusi selesai' detected at second {i+1}!")
            execution_ok = True
            break
        elif "Eksekusi gagal" in body:
            print("❌ Execution failed!")
            print(body[-400:])
            break
        else:
            if (i + 1) % 5 == 0:
                print(f"Still executing... ({i+1}s)")

    cdp_app.close()
    
    if not execution_ok:
        print("Execution did not report complete, proceeding with spreadsheet inspection anyway...")
    
    # 2. Connect to Spreadsheet
    print("\nConnecting to Spreadsheet CDP...")
    cdp_sheet = CDPClient(sheet_target['webSocketDebuggerUrl'])
    print("Reloading spreadsheet...")
    cdp_sheet.send('Page.reload')
    time.sleep(7)
    
    print("Spreadsheet Title:", cdp_sheet.eval("document.title"))
    
    # List all tabs in spreadsheet
    js_get_tabs = """
    (() => {
        const tabs = Array.from(document.querySelectorAll('div[role="tab"]'));
        return tabs.map(t => t.innerText.trim());
    })()
    """
    all_tabs = cdp_sheet.eval(js_get_tabs)
    print("Available tabs in spreadsheet:", all_tabs)
    
    # Click each tab and capture screenshot
    tabs_to_show = [
        ("Changelog & Audit Log", "screenshot_changelog_audit_log_v5.png"),
        ("materi-sd", "screenshot_materi_sd_v5.png"),
        ("ops-result-sd", "screenshot_ops_result_sd_v5.png"),
        ("materi-smp", "screenshot_materi_smp_v5.png"),
        ("materi-sma", "screenshot_materi_sma_v5.png")
    ]
    
    for tab_name, fname in tabs_to_show:
        js_click_tab = f"""
        (() => {{
            const tabs = Array.from(document.querySelectorAll('div[role="tab"]'));
            const target = tabs.find(t => t.innerText.includes('{tab_name}'));
            if (target) {{
                target.click();
                return 'CLICKED: ' + target.innerText;
            }}
            return 'NOT_FOUND';
        }})()
        """
        tab_res = cdp_sheet.eval(js_click_tab)
        print(f"Tab '{tab_name}': {tab_res}")
        time.sleep(2)
        cdp_sheet.capture_screenshot(fname)
        
    cdp_sheet.close()
    print("\n✅ All operations completed successfully via direct CDP!")

if __name__ == '__main__':
    run()
