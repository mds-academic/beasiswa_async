import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPT_DIR = ROOT / "references" / "transcripts"
TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)

VIDS = [
    ("tT1FtLbLqkE", "Sign In ke App Inventor"),
    ("5M9jTl5pPsI", "Mendesain User Interface"),
    ("_aAQ8nFUAqc", "Publish Proyek AppInventor ke Gallery")
]

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()

        results = {}

        for vid, expected_title in VIDS:
            print(f"\n==========================================")
            print(f"Loading {vid}: {expected_title}")
            print(f"==========================================")
            await page.goto(f"https://www.youtube.com/watch?v={vid}", wait_until="domcontentloaded")
            await page.wait_for_timeout(4000)

            # Wait for video element
            data = await page.evaluate("""() => {
                const v = document.querySelector('video');
                const titleEl = document.querySelector('h1.ytd-watch-metadata') || document.querySelector('h1');
                const descEl = document.querySelector('#description-inline-expander') || document.querySelector('#description');
                
                return {
                    title: titleEl ? titleEl.innerText.trim() : document.title,
                    duration: v ? v.duration : null,
                    description: descEl ? descEl.innerText.trim() : ''
                };
            }""")

            print(f"Title: {data['title']}")
            print(f"Duration: {data['duration']}s ({data['duration']/60 if data['duration'] else 0:.2f} mins)")
            print(f"Description:\n{data['description']}")

            # Try to get transcript
            # First click more/expand in description if present
            try:
                expand_btn = page.locator("#expand, tp-yt-paper-button#expand").first
                if await expand_btn.is_visible():
                    await expand_btn.click()
                    await page.wait_for_timeout(1000)
            except Exception as e:
                print(f"Expand error: {e}")

            # Try to click "Show transcript" button
            transcript_content = []
            try:
                # Look for Show Transcript button
                transcript_btn = page.locator("button:has-text('Show transcript'), ytd-button-renderer:has-text('Show transcript'), ytd-button-renderer:has-text('Tampilkan transkrip')").first
                if await transcript_btn.is_visible():
                    await transcript_btn.click()
                    await page.wait_for_timeout(2000)
                    segments = await page.locator("ytd-transcript-segment-renderer").all()
                    print(f"Found {len(segments)} transcript segments")
                    for seg in segments:
                        ts = await seg.locator(".segment-timestamp").inner_text()
                        txt = await seg.locator(".segment-text").inner_text()
                        transcript_content.append({"timestamp": ts.strip(), "text": txt.strip()})
                else:
                    print("No Show transcript button visible directly")
            except Exception as e:
                print(f"Transcript extraction error: {e}")

            data["transcript"] = transcript_content
            results[vid] = data

            # Save to disk
            txt_path = TRANSCRIPT_DIR / f"{vid}.txt"
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(f"ID: {vid}\n")
                f.write(f"Title: {data['title']}\n")
                f.write(f"Duration: {data['duration']}\n")
                f.write(f"Description:\n{data['description']}\n\n")
                f.write("=== TRANSCRIPT ===\n")
                for item in transcript_content:
                    f.write(f"[{item['timestamp']}] {item['text']}\n")

            print(f"Saved to {txt_path}")

        await page.close()
        
        # Save summary JSON
        with open(TRANSCRIPT_DIR / "new_smp_videos.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print("\nAll done!")

if __name__ == "__main__":
    asyncio.run(run())
