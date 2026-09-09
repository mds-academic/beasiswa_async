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

    def click_at(self, x, y):
        self.send('Input.dispatchMouseEvent', {'type': 'mousePressed', 'x': x, 'y': y, 'button': 'left', 'clickCount': 1})
        time.sleep(0.05)
        self.send('Input.dispatchMouseEvent', {'type': 'mouseReleased', 'x': x, 'y': y, 'button': 'left', 'clickCount': 1})

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
    resp = urllib.request.urlopen('http://localhost:9222/json')
    targets = json.loads(resp.read().decode())
    sheet_target = next(t for t in targets if 'docs.google.com/spreadsheets' in t.get('url', '') and t.get('type') == 'page')
    
    cdp = CDPClient(sheet_target['webSocketDebuggerUrl'])
    print("Connected to Spreadsheet CDP. Title:", cdp.eval("document.title"), flush=True)
    
    tabs_to_capture = [
        ("Changelog & Audit Log", "screenshot_changelog_audit_log.png"),
        ("materi-smp", "screenshot_materi_smp_v3.png"),
        ("materi-sma", "screenshot_materi_sma_v3.png"),
        ("materi-sd", "screenshot_materi_sd_v3.png"),
        ("ops-result-smp", "screenshot_ops_result_smp_v3.png"),
        ("ops-result-sma", "screenshot_ops_result_sma_v3.png")
    ]
    
    for tab_name, shot_fname in tabs_to_capture:
        # Get coordinates of the tab
        js_get_coord = f"""
        (() => {{
            const el = Array.from(document.querySelectorAll('.docs-sheet-tab-name')).find(t => t.innerText.trim() === '{tab_name}');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {{x: r.x + r.width / 2, y: r.y + r.height / 2}};
        }})()
        """
        coords = cdp.eval(js_get_coord)
        if coords:
            print(f"\nSwitching to tab '{tab_name}' at ({coords['x']:.1f}, {coords['y']:.1f})...", flush=True)
            cdp.click_at(coords['x'], coords['y'])
            time.sleep(2)
            
            # Verify active tab
            active_tab = cdp.eval("document.querySelector('.docs-sheet-active-tab')?.innerText.trim()")
            print(f"Active tab is now: '{active_tab}'", flush=True)
            
            # Capture screenshot
            cdp.capture_screenshot(shot_fname)
        else:
            print(f"⚠️ Tab '{tab_name}' coordinates not found in viewport!", flush=True)

    cdp.close()
    print("\n🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY!", flush=True)

if __name__ == '__main__':
    main()
