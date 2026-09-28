#!/usr/bin/env python3
"""Rebuild contributors/index.json from the individual contributor files.

The contributor wall is a static page, so it cannot list a folder — it needs a
single file to fetch. This script produces that file. A GitHub Action runs it
automatically whenever a contributor file changes, so you should never need to
run it by hand, and you should never edit index.json yourself.

Run it locally to check your own file first:

    python3 scripts/build_contributors.py
    python3 scripts/build_contributors.py --check    # validate, write nothing
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

CONTRIBUTORS_DIR = Path("contributors")
INDEX_PATH = CONTRIBUTORS_DIR / "index.json"

MAX_QUOTE = 100
MAX_INTERESTS = 4
HANDLE_RE = re.compile(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def validate(path: Path, data: object) -> list[str]:
    """Return a list of problems with one contributor file. Empty means fine."""
    problems: list[str] = []

    if not isinstance(data, dict):
        return ["the file must contain a JSON object, starting with { and ending with }"]

    handle = data.get("github")
    if not handle or not isinstance(handle, str):
        problems.append('"github" is required and must be your GitHub username in quotes')
    else:
        if not HANDLE_RE.match(handle):
            problems.append(f'"github": {handle!r} is not a valid GitHub username')
        if handle.lower() != path.stem.lower():
            problems.append(
                f'the filename should match your username: expected '
                f'{handle.lower()}.json, got {path.name}'
            )

    quote = data.get("quote")
    if quote is not None:
        if not isinstance(quote, str):
            problems.append('"quote" must be text in quotes')
        elif len(quote) > MAX_QUOTE:
            problems.append(
                f'"quote" is {len(quote)} characters — keep it under {MAX_QUOTE} '
                f"or the card overflows"
            )

    interests = data.get("interests")
    if interests is not None:
        if not isinstance(interests, list):
            problems.append('"interests" must be a list, like ["python", "design"]')
        elif len(interests) > MAX_INTERESTS:
            problems.append(
                f'"interests" has {len(interests)} entries — only the first '
                f"{MAX_INTERESTS} are shown"
            )
        elif not all(isinstance(i, str) for i in interests):
            problems.append('every entry in "interests" must be text in quotes')

    first = data.get("first_contribution")
    if first is not None and (not isinstance(first, str) or not DATE_RE.match(first)):
        problems.append('"first_contribution" must look like "2026-10-05"')

    for key in data:
        if key not in {"github", "name", "quote", "interests", "first_contribution"}:
            problems.append(f'unexpected field "{key}" — see contributors/README.md')

    return problems


def collect() -> tuple[list[dict], int]:
    """Read every contributor file. Returns (entries, error_count)."""
    entries: list[dict] = []
    errors = 0

    files = sorted(
        p for p in CONTRIBUTORS_DIR.glob("*.json") if p.name != INDEX_PATH.name
    )

    for path in files:
        if path.stem.startswith("_"):
            continue  # _TEMPLATE.json and friends

        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors += 1
            print(f"\n  {path}")
            print(f"    invalid JSON on line {exc.lineno}: {exc.msg}")
            print("    A missing or extra comma is the usual cause.")
            print(f"    Check it with:  python3 -m json.tool {path}")
            continue

        problems = validate(path, data)
        if problems:
            errors += 1
            print(f"\n  {path}")
            for problem in problems:
                print(f"    {problem}")
            continue

        entry = {
            "github": data["github"],
            "name": data.get("name") or data["github"],
        }
        if data.get("quote"):
            entry["quote"] = data["quote"]
        if data.get("interests"):
            entry["interests"] = data["interests"][:MAX_INTERESTS]
        if data.get("first_contribution"):
            entry["first_contribution"] = data["first_contribution"]

        entries.append(entry)

    entries.sort(key=lambda e: e["github"].lower())
    return entries, errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="validate the contributor files without writing index.json",
    )
    args = parser.parse_args()

    if not CONTRIBUTORS_DIR.is_dir():
        print(f"No {CONTRIBUTORS_DIR}/ directory. Run this from the project root.")
        return 1

    entries, errors = collect()

    if errors:
        print(f"\n{errors} contributor file(s) have problems. Fix them and run again.")
        print("Details are above, with the file and the line.")
        return 1

    if args.check:
        print(f"All {len(entries)} contributor file(s) are valid.")
        return 0

    INDEX_PATH.write_text(
        json.dumps(entries, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"Wrote {INDEX_PATH} with {len(entries)} contributor(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
