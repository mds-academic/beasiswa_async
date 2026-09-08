import os, shutil, glob

BASE_DIR = "/Users/yazidhilmi/Documents/Edu/Fireside-chat/projects/uob-async-lms"
SUB2_DIR = os.path.join(BASE_DIR, "subprojects", "02-curriculum-sequencing")
SUB1_SRC = os.path.join(BASE_DIR, "subprojects", "01-lms-platform", "src")
DOCS_DIR = os.path.join(BASE_DIR, "docs")

DRAFTS_HTML = os.path.join(SUB2_DIR, "drafts", "bridge-html")
DRAFTS_SEQ = os.path.join(SUB2_DIR, "drafts", "sequencing-v1")

# Target slide directories
slide_targets = [
    os.path.join(SUB2_DIR, "slides"),
    os.path.join(SUB1_SRC, "slides"),
    os.path.join(DOCS_DIR, "slides")
]

# Target data directories
data_targets = [
    os.path.join(SUB2_DIR, "output"),
    os.path.join(SUB1_SRC, "data"),
    os.path.join(DOCS_DIR, "data")
]

for t in slide_targets + data_targets:
    os.makedirs(t, exist_ok=True)

# 1. Sync Bridge Slides & JSON Metadata
print("Syncing Bridge Slides & Metadata...")
bridge_files = glob.glob(os.path.join(DRAFTS_HTML, "*.*"))
for f in bridge_files:
    fname = os.path.basename(f)
    for target_dir in slide_targets:
        dest = os.path.join(target_dir, fname)
        shutil.copy2(f, dest)
        print(f"Copied {fname} -> {dest}")

# 2. Sync Datasets
print("\nSyncing Datasets...")
datasets = ["courseData-highschool.json", "courseData-middleschool.json"]
for d in datasets:
    src_data = os.path.join(DRAFTS_SEQ, d)
    for target_dir in data_targets:
        dest = os.path.join(target_dir, d)
        shutil.copy2(src_data, dest)
        print(f"Copied {d} -> {dest}")

print("\nPRODUCTION SYNC COMPLETED SUCCESSFULLY!")
