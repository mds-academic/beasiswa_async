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
            print(f"📸 Screenshot saved: {out_path}", flush=True)
            return out_path
        return None

    def close(self):
        self.ws.close()

def main():
    print("Connecting to Chrome CDP...", flush=True)
    resp = urllib.request.urlopen('http://localhost:9222/json')
    targets = json.loads(resp.read().decode())
    
    app_target = next(t for t in targets if 'script.google.com' in t.get('url', '') and t.get('type') == 'page')
    sheet_target = next(t for t in targets if 'docs.google.com/spreadsheets' in t.get('url', '') and t.get('type') == 'page')
    
    # 1. Apps Script Execution
    print(f"Connecting to Apps Script ({app_target['id']})...", flush=True)
    cdp_app = CDPClient(app_target['webSocketDebuggerUrl'])
    print("Reloading Apps Script editor to pick up new Code.gs...", flush=True)
    cdp_app.send('Page.reload')
    time.sleep(7)
    
    # Check default function
    js_check = "document.querySelector('div[aria-label*=\"fungsi\"]').innerText.trim()"
    active_func = cdp_app.eval(js_check)
    print(f"Active function in dropdown: {active_func}", flush=True)
    
    # Click Jalankan
    js_run = """
    (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const runBtn = btns.find(b => b.innerText.includes('Jalankan') || (b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('Jalankan')));
        if (!runBtn) return 'NO_RUN_BTN';
        
        const rect = runBtn.getBoundingClientRect();
        runBtn.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, clientX: rect.x + 5, clientY: rect.y + 5}));
        runBtn.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, cancelable: true, clientX: rect.x + 5, clientY: rect.y + 5}));
        runBtn.click();
        return 'CLICKED_RUN';
    })()
    """
    click_res = cdp_app.eval(js_run)
    print(f"Click Jalankan result: {click_res}", flush=True)
    
    # Monitor execution
    print("Monitoring execution in Apps Script...", flush=True)
    exec_success = False
    start_time = time.time()
    while time.time() - start_time < 50:
        time.sleep(2)
        snippet = cdp_app.eval('document.body.innerText.slice(-400)')
        if snippet:
            cleaned = snippet.replace('\n', ' ')
            print(f"[{int(time.time() - start_time)}s] {cleaned[-120:]}", flush=True)
            if 'Eksekusi selesai' in snippet:
                print("🎉 SUCCESS: setupAllLMSSheets completed execution!", flush=True)
                exec_success = True
                break
            elif 'Eksekusi gagal' in snippet:
                print("❌ ERROR: Execution failed!", flush=True)
                break
                
    cdp_app.close()
    
    # 2. Spreadsheet Inspection & Screenshots
    print(f"\nConnecting to Spreadsheet ({sheet_target['id']})...", flush=True)
    cdp_sheet = CDPClient(sheet_target['webSocketDebuggerUrl'])
    print("Reloading spreadsheet...", flush=True)
    cdp_sheet.send('Page.reload')
    time.sleep(9)
    
    # Wait until title and tabs load
    for w in range(15):
        stitle = cdp_sheet.eval("document.title") or ""
        tabs = cdp_sheet.eval("Array.from(document.querySelectorAll('div[role=\"tab\"]')).map(t => t.innerText.trim())") or []
        if len(tabs) > 0 and "Google Spreadsheet" in stitle:
            print(f"Spreadsheet fully loaded! Found {len(tabs)} tabs: {tabs}", flush=True)
            break
        print(f"Waiting for spreadsheet tabs to render... ({w+1})", flush=True)
        time.sleep(2)
        
    tabs_to_show = [
        ("Changelog & Audit Log", "screenshot_changelog_audit_log.png"),
        ("materi-smp", "screenshot_materi_smp_v3.png"),
        ("materi-sma", "screenshot_materi_sma_v3.png"),
        ("materi-sd", "screenshot_materi_sd_v3.png"),
        ("ops-result-smp", "screenshot_ops_result_smp_v3.png")
    ]
    
    for tab_name, fname in tabs_to_show:
        js_click_tab = f"""
        (() => {{
            const tabs = Array.from(document.querySelectorAll('div[role=\"tab\"]'));
            const target = tabs.find(t => t.innerText.includes('{tab_name}'));
            if (target) {{
                target.click();
                return 'CLICKED: ' + target.innerText;
            }}
            return 'NOT_FOUND';
        }})()
        """
        tab_res = cdp_sheet.eval(js_click_tab)
        print(f"Selecting tab '{tab_name}': {tab_res}", flush=True)
        time.sleep(2.5)
        cdp_sheet.capture_screenshot(fname)
        
    cdp_sheet.close()
    print("\n✅ All sheet updates and screenshots completed successfully!", flush=True)

if __name__ == '__main__':
    main()
