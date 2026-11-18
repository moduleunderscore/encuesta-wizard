from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src"
OUTPUT = ROOT / "dist"

if OUTPUT.exists():
    shutil.rmtree(OUTPUT)

shutil.copytree(SOURCE, OUTPUT)
print(f"Built static site: {OUTPUT}")
