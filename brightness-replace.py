#!/usr/bin/env python3
"""
Brightness pass for Arxon site — run from repo root: python3 brightness-replace.py
Brightens text/border opacity utilities and shifts brand blue (#7c93c3) -> brighter (#a8c3f0)
across all .tsx files in src/components and src/pages.
"""
import os, re

ROOT = "src"

REPLACEMENTS = [
    # Brand blue -> brighter blue
    (r"#7c93c3", "#a8c3f0"),
    (r"#6b82b2", "#8fb0e8"),

    # Text opacity bumps (white/XX -> brighter)
    (r"text-white/15", "text-white/35"),
    (r"text-white/18", "text-white/38"),
    (r"text-white/20", "text-white/40"),
    (r"text-white/25", "text-white/45"),
    (r"text-white/30", "text-white/50"),
    (r"text-white/35", "text-white/55"),
    (r"text-white/40", "text-white/60"),
    (r"text-white/45", "text-white/65"),

    # Border opacity bumps
    (r"border-white/\[0\.04\]", "border-white/[0.08]"),
    (r"border-white/\[0\.05\]", "border-white/[0.09]"),
    (r"border-white/\[0\.06\]", "border-white/[0.10]"),

    # Background opacity bumps for cards
    (r"bg-white/\[0\.01\]", "bg-white/[0.02]"),
    (r"bg-white/\[0\.02\]", "bg-white/[0.03]"),
    (r"bg-white/\[0\.025\]", "bg-white/[0.04]"),
]

def process_file(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    orig = content
    for pattern, repl in REPLACEMENTS:
        content = re.sub(pattern, repl, content)
    if content != orig:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

changed = []
for sub in ["components", "pages"]:
    d = os.path.join(ROOT, sub)
    if not os.path.isdir(d):
        continue
    for fname in os.listdir(d):
        if fname.endswith(".tsx"):
            fpath = os.path.join(d, fname)
            if process_file(fpath):
                changed.append(fpath)

print(f"Updated {len(changed)} files:")
for f in changed:
    print(" -", f)
