import json
import os
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOTS = [ROOT / "src" / "content", ROOT / "h5p_src"]
MATHDISPLAY_DEP = {"machineName": "H5P.MathDisplay", "majorVersion": 1, "minorVersion": 0}

INLINE_MATH_RE = re.compile(r"(?<!\\)\(([^()<>]{1,80})\)")
EXISTING_INLINE_RE = re.compile(r"\\\((.*?)\\\)")


def is_math_expression(inner):
    stripped = inner.strip()
    if not stripped:
        return False
    if any(token in stripped for token in ("_", "=", "cdot", "Delta", "^", "/")):
        return True
    if stripped in {"I-V", "Vav", "Vp-p", "Veff", "Vmax", "RMS", "AC", "DC"}:
        return True
    return False


def normalize_math_inner(inner):
    value = inner.strip()
    value = re.sub(r"\\+cdot", r"\\cdot", value)
    value = re.sub(r"\\+Delta", r"\\Delta", value)
    value = re.sub(r"(?<!\\)\bcdot\b", r"\\cdot", value)
    value = re.sub(r"(?<=[A-Za-z0-9}])cdot(?=\s|[A-Za-z0-9{])", r"\\cdot", value)
    value = re.sub(r"(?<!\\)\bDelta\b", r"\\Delta", value)
    value = re.sub(r"(?<=[A-Za-z0-9}])\*(?=[A-Za-z0-9{])", r" \\cdot ", value)
    value = re.sub(r"\s+", " ", value)
    return value


def normalize_existing_math(match):
    return r"\(" + normalize_math_inner(match.group(1)) + r"\)"


def fix_string(value):
    original = value
    value = EXISTING_INLINE_RE.sub(normalize_existing_math, value)

    protected = {}

    def protect_existing(match):
        key = f"@@H5P_MATH_{len(protected)}@@"
        protected[key] = match.group(0)
        return key

    value = EXISTING_INLINE_RE.sub(protect_existing, value)

    def replace_plain_math(match):
        inner = match.group(1)
        if not is_math_expression(inner):
            return match.group(0)
        return r"\(" + normalize_math_inner(inner) + r"\)"

    value = INLINE_MATH_RE.sub(replace_plain_math, value)
    for key, math in protected.items():
        value = value.replace(key, math)

    # Repair earlier over-eager wrapping around formulas with meaningful inner parentheses.
    value = value.replace(r"(V_L=V_{TH}R_L/\(R_{TH}+R_L\))", r"\(V_L=V_{TH}R_L/(R_{TH}+R_L)\)")
    value = value.replace(r"(V_L=V_{TH}\(R_{TH}+R_L\))", r"\(V_L=V_{TH}(R_{TH}+R_L)\)")
    value = value.replace("(H)?", r"\(H\)?")

    value = EXISTING_INLINE_RE.sub(normalize_existing_math, value)
    return value, value != original


def walk_and_fix(value):
    if isinstance(value, str):
        return fix_string(value)
    if isinstance(value, list):
        changed = False
        fixed = []
        for item in value:
            new_item, item_changed = walk_and_fix(item)
            fixed.append(new_item)
            changed = changed or item_changed
        return fixed, changed
    if isinstance(value, dict):
        changed = False
        fixed = {}
        for key, item in value.items():
            new_item, item_changed = walk_and_fix(item)
            fixed[key] = new_item
            changed = changed or item_changed
        return fixed, changed
    return value, False


def has_math_markup(content):
    return bool(re.search(r"\\\(|\\\[|\$\$", content))


def find_mathdisplay_source():
    for h5p_path in SOURCE_ROOTS[0].rglob("*.h5p"):
        try:
            with zipfile.ZipFile(h5p_path) as archive:
                names = archive.namelist()
                if any(name.startswith("H5P.MathDisplay-") for name in names):
                    return h5p_path
        except zipfile.BadZipFile:
            continue
    raise RuntimeError("Could not find an H5P package containing H5P.MathDisplay.")


def mathdisplay_entries(source_h5p):
    entries = {}
    with zipfile.ZipFile(source_h5p) as archive:
        for info in archive.infolist():
            if info.filename.startswith("H5P.MathDisplay-"):
                entries[info.filename] = archive.read(info.filename)
    return entries


def ensure_mathdisplay_dependency(h5p_json):
    deps = h5p_json.setdefault("preloadedDependencies", [])
    if not any(dep.get("machineName") == "H5P.MathDisplay" for dep in deps):
        deps.append(dict(MATHDISPLAY_DEP))
        return True
    return False


def rewrite_h5p(h5p_path, mathdisplay_payload):
    with zipfile.ZipFile(h5p_path, "r") as archive:
        infos = archive.infolist()
        files = {info.filename: archive.read(info.filename) for info in infos}

    if "content/content.json" not in files:
        return False, "missing content/content.json"

    content = json.loads(files["content/content.json"].decode("utf-8"))
    fixed_content, content_changed = walk_and_fix(content)
    fixed_content_text = json.dumps(fixed_content, ensure_ascii=False, indent=2)
    needs_math = has_math_markup(fixed_content_text)

    h5p_changed = False
    if needs_math and "h5p.json" in files:
        h5p_json = json.loads(files["h5p.json"].decode("utf-8"))
        h5p_changed = ensure_mathdisplay_dependency(h5p_json)
        files["h5p.json"] = json.dumps(h5p_json, ensure_ascii=False, indent=2).encode("utf-8")

    added_mathdisplay = False
    if needs_math and not any(name.startswith("H5P.MathDisplay-") for name in files):
        files.update(mathdisplay_payload)
        added_mathdisplay = True

    if not content_changed and not h5p_changed and not added_mathdisplay:
        return False, "unchanged"

    files["content/content.json"] = fixed_content_text.encode("utf-8")

    fd, tmp_name = tempfile.mkstemp(suffix=".h5p", dir=str(h5p_path.parent))
    os.close(fd)
    tmp_path = Path(tmp_name)
    try:
        with zipfile.ZipFile(tmp_path, "w", zipfile.ZIP_DEFLATED) as archive:
            seen = set()
            for info in infos:
                name = info.filename
                if name not in files or name in seen:
                    continue
                archive.writestr(name, files[name])
                seen.add(name)
            for name in sorted(files):
                if name not in seen:
                    archive.writestr(name, files[name])
        shutil.move(str(tmp_path), h5p_path)
    finally:
        if tmp_path.exists():
            tmp_path.unlink()

    details = []
    if content_changed:
        details.append("content")
    if h5p_changed:
        details.append("dependency")
    if added_mathdisplay:
        details.append("library")
    return True, "+".join(details)


def source_h5ps():
    files = []
    for root in SOURCE_ROOTS:
        if root.exists():
            files.extend(sorted(root.rglob("*.h5p")))
    return files


def main():
    mathdisplay_source = find_mathdisplay_source()
    mathdisplay_payload = mathdisplay_entries(mathdisplay_source)
    print(f"Using MathDisplay library from: {mathdisplay_source.relative_to(ROOT)}")

    changed = 0
    for h5p_path in source_h5ps():
        try:
            did_change, status = rewrite_h5p(h5p_path, mathdisplay_payload)
        except Exception as exc:
            print(f"[ERROR] {h5p_path.relative_to(ROOT)}: {exc}")
            continue
        if did_change:
            changed += 1
            print(f"[FIXED] {h5p_path.relative_to(ROOT)} ({status})")

    print(f"Done. Updated {changed} H5P source package(s).")


if __name__ == "__main__":
    main()
