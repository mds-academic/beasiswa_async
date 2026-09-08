"""Fetch public captions without changing curriculum or source timing."""
import concurrent.futures
import datetime
import json
from pathlib import Path

import requests
from youtube_transcript_api import YouTubeTranscriptApi

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "references" / "transcripts"


def fetch(video_id):
    session = requests.Session()
    request = session.request

    def timed_request(*args, **kwargs):
        kwargs.setdefault("timeout", 35)
        return request(*args, **kwargs)

    session.request = timed_request
    try:
        transcript = YouTubeTranscriptApi(http_client=session).fetch(
            video_id, languages=["id", "en"]
        )
        raw = transcript.to_raw_data()
        (DEST / f"{video_id}.json").write_text(
            json.dumps(raw, ensure_ascii=False, indent=2)
        )
        (DEST / f"{video_id}.txt").write_text(
            "\n".join(f"[{s['start']:.2f}] {s['text']}" for s in raw)
        )
        return {"videoId": video_id, "status": "fetched", "language": transcript.language_code,
                "generated": transcript.is_generated, "snippets": len(raw),
                "lastCaptionEnd": max(s["start"] + s["duration"] for s in raw)}
    except Exception as exc:
        return {"videoId": video_id, "status": "failed", "error": type(exc).__name__,
                "detail": str(exc)[:1000]}
    finally:
        session.close()


if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    ids = sorted({s["videoId"]
                  for name in ["highschool", "middleschool"]
                  for m in json.loads((ROOT / "output" / f"courseData-{name}.json").read_text())["modules"]
                  for s in m["steps"] if s.get("videoId")})
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(fetch, ids))
    (DEST / "manifest.json").write_text(json.dumps(
        {"retrievedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
         "method": "youtube_transcript_api; Indonesian then English captions; no cookies",
         "videos": results}, ensure_ascii=False, indent=2))
    for result in results:
        print(result["videoId"], result["status"], result.get("snippets", result.get("error")))
