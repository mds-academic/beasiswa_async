import os, json, copy

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms/subprojects/02-curriculum-sequencing"
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
DRAFTS_SEQ_DIR = os.path.join(BASE_DIR, "drafts", "sequencing-v1")
DRAFTS_HTML_DIR = os.path.join(BASE_DIR, "drafts", "bridge-html")
BLUEPRINTS_PATH = os.path.join(BASE_DIR, "drafts", "qa", "blueprints.json")
os.makedirs(DRAFTS_SEQ_DIR, exist_ok=True)

# Load production baselines
with open(os.path.join(OUTPUT_DIR, "courseData-highschool.json"), "r", encoding="utf-8") as f:
    orig_hs = json.load(f)

with open(os.path.join(OUTPUT_DIR, "courseData-middleschool.json"), "r", encoding="utf-8") as f:
    orig_ms = json.load(f)

# Helper to normalize quizzes
def process_quizzes(quizzes, step_id, step_type, start_sec, end_sec):
    cleaned = []
    for q in quizzes:
        q_copy = copy.deepcopy(q)
        q_time = q_copy.get("time") or q_copy.get("timestamp")
        
        # Anomaly 1: 99999
        if q_time == 99999:
            q_copy["type"] = "project_checkpoint" if step_type == "project" else "manual_checkpoint"
            q_copy["autoplay"] = False
            q_copy["status"] = "manual_checkpoint"
            q_copy["note"] = "Checkpoint manual pengerjaan tugas proyek/latihan; tidak dipicu secara otomatis oleh player."
            if "time" in q_copy: del q_copy["time"]
            if "timestamp" in q_copy: del q_copy["timestamp"]
        # Anomaly 2: Out of segment (hs-5-3 at 150s, ms-4-4 at 120s)
        elif q_time is not None and start_sec is not None and end_sec is not None:
            if q_time < start_sec or q_time > end_sec:
                q_copy["type"] = "manual_checkpoint"
                q_copy["autoplay"] = False
                q_copy["status"] = "review_required"
                q_copy["note"] = f"Waktu kuis sumber ({q_time}s) berada di luar rentang segmen video ({start_sec}–{end_sec}s). Ditetapkan sebagai manual checkpoint untuk mencegah playback error."
        cleaned.append(q_copy)
    return cleaned

# Helper to process bookmarks
def process_bookmarks(bookmarks, step_id, start_sec, end_sec):
    cleaned = []
    for b in bookmarks:
        b_copy = copy.deepcopy(b)
        b_time = b_copy.get("time")
        if b_time is not None and start_sec is not None and end_sec is not None:
            if b_time < start_sec:
                b_copy["status"] = "review_required"
                b_copy["outOfBounds"] = True
                b_copy["note"] = f"Bookmark ({b_time}s) berada sebelum startSeconds ({start_sec}s)."
            elif b_time > end_sec:
                b_copy["status"] = "review_required"
                b_copy["outOfBounds"] = True
                b_copy["note"] = f"Bookmark ({b_time}s) melewati endSeconds ({end_sec}s)."
            else:
                b_copy["status"] = "verified"
        else:
            b_copy["status"] = "verified"
        cleaned.append(b_copy)
    return cleaned

# Helper to load bridge metadata
def load_bridge_metadata(bridge_id):
    json_path = os.path.join(DRAFTS_HTML_DIR, f"{bridge_id}.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

# Build Highschool
orig_hs_steps = {}
for m in orig_hs["modules"]:
    for s in m["steps"]:
        orig_hs_steps[s["id"]] = copy.deepcopy(s)

def make_hs_bridge_step(bridge_id, title, kicker, prereqs):
    meta = load_bridge_metadata(bridge_id)
    return {
        "id": bridge_id,
        "type": "slide",
        "kicker": kicker,
        "title": title,
        "duration": meta.get("duration", "8 Menit Baca Mandiri & Praktik"),
        "slideUrl": f"./slides/{bridge_id}.html",
        "prerequisiteStepIds": prereqs,
        "learningObjectives": meta.get("learningObjectives", [f"Menguasai materi konsep {title}"]),
        "practice": meta.get("practice", {"type": "simulation", "description": "Latihan interaktif di dalam slide"}),
        "completionCriteria": meta.get("completionCriteria", {"quizScoreMin": 100, "interactiveCompleted": True}),
        "bookmarks": meta.get("bookmarks", []),
        "quizzes": meta.get("quizzes", []),
        "sourceStepId": bridge_id
    }

hs_v1_modules = [
    {
        "id": "hs-mod-00",
        "title": "Modul 0: Orientasi & Fondasi Lingkungan Python",
        "steps": [
            orig_hs_steps["hs-0-0"],
            make_hs_bridge_step(
                "bridge-hs-00",
                "Panduan Lengkap Google Colab & Pemrograman Python Pertamaku",
                "Materi Jembatan 00 · Dasar Python & Cloud Editor",
                ["hs-0-0"]
            ),
            make_hs_bridge_step(
                "bridge-hs-01",
                "Variabel dan Tipe Data Tanpa Takut",
                "Materi Jembatan 01 · Dasar Python",
                ["bridge-hs-00"]
            )
        ]
    },
    {
        "id": "hs-mod-01",
        "title": "Modul 1: Fondasi Data — Input Pengguna & Konversi Logika",
        "steps": [
            orig_hs_steps["hs-1-1"],
            make_hs_bridge_step(
                "bridge-hs-02",
                "Dari Input Teks Menjadi Logika Keputusan",
                "Materi Jembatan 02 · Dasar Python",
                ["hs-1-1"]
            )
        ]
    },
    {
        "id": "hs-mod-02",
        "title": "Modul 2: Logika Percabangan — Conditional Logic (If-Else)",
        "steps": [
            orig_hs_steps["hs-2-1"],
            orig_hs_steps["hs-2-2"],
            orig_hs_steps["hs-2-3"],
            orig_hs_steps["hs-2-4"],
            orig_hs_steps["hs-2-5"],
            orig_hs_steps["hs-2-6"],
            orig_hs_steps["hs-2-7"]
        ]
    },
    {
        "id": "hs-mod-03",
        "title": "Modul 3: Otomasi & Desain Modular — Loops & Functions",
        "steps": [
            make_hs_bridge_step(
                "bridge-hs-03",
                "Mengulang Tanpa Bosan: List dan For Loop",
                "Materi Jembatan 03 · Logika Iterasi",
                ["hs-2-7"]
            ),
            orig_hs_steps["hs-3-1"],
            orig_hs_steps["hs-3-2"],
            orig_hs_steps["hs-3-3"],
            orig_hs_steps["hs-3-4"],
            make_hs_bridge_step(
                "bridge-hs-04",
                "Fungsi: Mesin Cetak Kode Mandiri",
                "Materi Jembatan 04 · Modularisasi Kode",
                ["hs-3-4"]
            ),
            orig_hs_steps["hs-3-5"],
            orig_hs_steps["hs-3-6"],
            orig_hs_steps["hs-3-7"],
            orig_hs_steps["hs-3-8"]
        ]
    },
    {
        "id": "hs-mod-04",
        "title": "Modul 4: Keamanan Kode — Error Handling & Dictionary",
        "steps": [
            make_hs_bridge_step(
                "bridge-hs-05",
                "Kamus Data: Menyimpan Transaksi dengan Dictionary",
                "Materi Jembatan 05 · Struktur Data Lanjutan",
                ["hs-3-8"]
            ),
            # Relocated hs-1-2 and hs-1-3 here
            orig_hs_steps["hs-1-2"],
            orig_hs_steps["hs-1-3"],
            orig_hs_steps["hs-4-1"],
            orig_hs_steps["hs-4-2"],
            orig_hs_steps["hs-4-3"],
            orig_hs_steps["hs-4-4"],
            orig_hs_steps["hs-4-5"],
            orig_hs_steps["hs-4-6"]
        ]
    },
    {
        "id": "hs-mod-05",
        "title": "Modul 5: Proyek Integrasi — Financial Literacy App",
        "steps": [
            orig_hs_steps["hs-5-1"],
            orig_hs_steps["hs-5-2"],
            orig_hs_steps["hs-5-3"],
            orig_hs_steps["hs-5-4"],
            orig_hs_steps["hs-5-5"]
        ]
    }
]

prev_id = None
for m in hs_v1_modules:
    for s in m["steps"]:
        s["sourceStepId"] = s.get("sourceStepId", s["id"])
        if not s.get("prerequisiteStepIds"):
            s["prerequisiteStepIds"] = [prev_id] if prev_id else []
        s_start = s.get("startSeconds")
        s_end = s.get("endSeconds")
        if "quizzes" in s and s["quizzes"]:
            s["quizzes"] = process_quizzes(s["quizzes"], s["id"], s.get("type", "video"), s_start, s_end)
        if "bookmarks" in s and s["bookmarks"]:
            s["bookmarks"] = process_bookmarks(s["bookmarks"], s["id"], s_start, s_end)
        prev_id = s["id"]

course_hs_v1 = {
    "levelId": "highschool",
    "levelTitle": "Tingkat SMA / SMK (Python & Financial Technology)",
    "version": "1.0-scaffolded",
    "updatedAt": "2026-09-08T23:50:00+07:00",
    "description": "Kurikulum Asinkronus Python & Literasi Finansial dengan Jembatan Pedagogis Eksplisit (Bridge HS-00 s.d. HS-05)",
    "modules": hs_v1_modules
}

with open(os.path.join(DRAFTS_SEQ_DIR, "courseData-highschool.json"), "w", encoding="utf-8") as f:
    json.dump(course_hs_v1, f, indent=2, ensure_ascii=False)

print("Saved drafts/sequencing-v1/courseData-highschool.json")

# Build Middleschool
orig_ms_steps = {}
for m in orig_ms["modules"]:
    for s in m["steps"]:
        orig_ms_steps[s["id"]] = copy.deepcopy(s)

def make_ms_bridge_step(bridge_id, title, kicker, prereqs):
    meta = load_bridge_metadata(bridge_id)
    return {
        "id": bridge_id,
        "type": "slide",
        "kicker": kicker,
        "title": title,
        "duration": meta.get("duration", "8 Menit Baca Mandiri & Eksplorasi"),
        "slideUrl": f"./slides/{bridge_id}.html",
        "prerequisiteStepIds": prereqs,
        "learningObjectives": meta.get("learningObjectives", [f"Menguasai materi konsep {title}"]),
        "practice": meta.get("practice", {"type": "simulation", "description": "Latihan interaktif di dalam slide"}),
        "completionCriteria": meta.get("completionCriteria", {"quizScoreMin": 100, "interactiveCompleted": True}),
        "bookmarks": meta.get("bookmarks", []),
        "quizzes": meta.get("quizzes", []),
        "sourceStepId": bridge_id
    }

ms_v1_modules = [
    {
        "id": "ms-mod-00",
        "title": "Modul 0: Orientasi & Pengenalan Platform MIT App Inventor",
        "steps": [
            orig_ms_steps["ms-0-0"],
            orig_ms_steps["ms-0-1"],
            orig_ms_steps["ms-0-2"],
            orig_ms_steps["ms-0-3"],
            make_ms_bridge_step(
                "bridge-ms-00",
                "Panduan Lengkap MIT App Inventor & Uji Proyek Pertamaku",
                "Materi Jembatan 00 · Desain UI & Blok Logika SMP",
                ["ms-0-3"]
            )
        ]
    },
    {
        "id": "ms-mod-01",
        "title": "Modul 1: Logika Instruksi, Flowchart & Input Aman",
        "steps": [
            make_ms_bridge_step(
                "bridge-ms-01",
                "Event Tombol, Properti, dan Variabel Blok",
                "Materi Jembatan 01 · Pengantar Koding SMP",
                ["bridge-ms-00"]
            ),
            orig_ms_steps["ms-1-1"],
            orig_ms_steps["ms-1-2"],
            orig_ms_steps["ms-1-3"],
            orig_ms_steps["ms-1-4"],
            orig_ms_steps["ms-1-5"],
            orig_ms_steps["ms-1-6"],
            orig_ms_steps["ms-1-7"]
        ]
    },
    {
        "id": "ms-mod-02",
        "title": "Modul 2: Pengambilan Keputusan — Percabangan Blok (If-Else)",
        "steps": [
            orig_ms_steps["ms-2-1"],
            orig_ms_steps["ms-2-2"],
            orig_ms_steps["ms-2-3"],
            orig_ms_steps["ms-2-4"],
            orig_ms_steps["ms-2-5"],
            orig_ms_steps["ms-2-6"]
        ]
    },
    {
        "id": "ms-mod-03",
        "title": "Modul 3: Otomasi & Fungsi — Membuat & Memanggil Procedures",
        "steps": [
            orig_ms_steps["ms-3-1"],
            orig_ms_steps["ms-3-2"],
            orig_ms_steps["ms-3-3"],
            make_ms_bridge_step(
                "bridge-ms-03",
                "Detektif Blok: Debugging & Uji Kasus Form",
                "Materi Jembatan 03 · Kualitas & Pengujian",
                ["ms-3-3"]
            ),
            orig_ms_steps["ms-3-4"],
            orig_ms_steps["ms-3-5"]
        ]
    },
    {
        "id": "ms-mod-04",
        "title": "Modul 4: Penyimpanan Data Lokal & Keamanan — TinyDB",
        "steps": [
            make_ms_bridge_step(
                "bridge-ms-02",
                "Buku Kas Digital: Menyimpan Data dengan TinyDB",
                "Materi Jembatan 02 · Penyimpanan Data SMP",
                ["ms-3-5"]
            ),
            orig_ms_steps["ms-4-1"],
            orig_ms_steps["ms-4-2"],
            orig_ms_steps["ms-4-3"],
            orig_ms_steps["ms-4-4"],
            orig_ms_steps["ms-4-5"],
            orig_ms_steps["ms-4-6"]
        ]
    },
    {
        "id": "ms-mod-05",
        "title": "Modul 5: Proyek Akhir Solusi Digital & Refleksi",
        "steps": [
            orig_ms_steps["ms-5-1"],
            orig_ms_steps["ms-5-2"],
            orig_ms_steps["ms-5-3"],
            orig_ms_steps["ms-5-4"]
        ]
    }
]

prev_id = None
for m in ms_v1_modules:
    for s in m["steps"]:
        s["sourceStepId"] = s.get("sourceStepId", s["id"])
        if not s.get("prerequisiteStepIds"):
            s["prerequisiteStepIds"] = [prev_id] if prev_id else []
        s_start = s.get("startSeconds")
        s_end = s.get("endSeconds")
        if "quizzes" in s and s["quizzes"]:
            s["quizzes"] = process_quizzes(s["quizzes"], s["id"], s.get("type", "video"), s_start, s_end)
        if "bookmarks" in s and s["bookmarks"]:
            s["bookmarks"] = process_bookmarks(s["bookmarks"], s["id"], s_start, s_end)
        prev_id = s["id"]

course_ms_v1 = {
    "levelId": "middleschool",
    "levelTitle": "Tingkat SMP (MIT App Inventor & Aplikasi Mobile)",
    "version": "1.0-scaffolded",
    "updatedAt": "2026-09-08T23:50:00+07:00",
    "description": "Kurikulum Asinkronus MIT App Inventor dengan Jembatan Konseptual Bersih (Bridge MS-00 s.d. MS-03, TinyDB setelah Procedures)",
    "modules": ms_v1_modules
}

with open(os.path.join(DRAFTS_SEQ_DIR, "courseData-middleschool.json"), "w", encoding="utf-8") as f:
    json.dump(course_ms_v1, f, indent=2, ensure_ascii=False)

print("Saved drafts/sequencing-v1/courseData-middleschool.json")
print("SEQUENCING V1 WITH AUDIT FIXES COMPLETED!")
