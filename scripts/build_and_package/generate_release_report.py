# סקריפט זה יוצר דוח סיכום (RELEASE_REPORT.md) עבור כל החבילות שנוצרו.
# הוא סורק את תיקיית 'dist/release', מנתח כל קובץ ZIP,
# ומרכז בטבלת Markdown מסודרת את המידע על כל חבילה:
# גודל הקובץ, ומספר הקבצים מכל סוג (HTML, H5P, XML, MATLAB) הכלולים בה.
# הדוח מספק תמונת מצב מהירה של תוצרי הבנייה.

import os
import sys
import zipfile
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# --- הגדרות נתיבים וקבועים ---
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIST_DIR = os.path.join(ROOT, "dist")
RELEASE_DIR = os.path.join(DIST_DIR, "release")
REPORT_PATH = os.path.join(RELEASE_DIR, "RELEASE_REPORT.md")


# --- פונקציות עזר לניתוח קבצים ---

def count_files(path, suffix):
    """סופרת קבצים עם סיומת מסוימת בתוך עץ תיקיות."""
    if not os.path.isdir(path):
        return 0
    count = 0
    for _, _, files in os.walk(path):
        count += sum(1 for file_name in files if file_name.endswith(suffix))
    return count


def zip_count(path):
    """סופרת את מספר הקבצים (לא תיקיות) בתוך ארכיון ZIP."""
    if not os.path.isfile(path):
        return 0
    try:
        with zipfile.ZipFile(path) as archive:
            return len([info for info in archive.infolist() if not info.is_dir()])
    except zipfile.BadZipFile:
        return 0


def file_size_mb(path):
    """מחזירה את גודל הקובץ במגה-בייט, מעוצב כמחרוזת."""
    if not os.path.isfile(path):
        return ""
    return f"{os.path.getsize(path) / (1024 * 1024):.2f}"


# --- איסוף נתונים על חבילות ההפצה ---

def release_rows():
    """
    סורקת את תיקיית ההפצה, אוספת נתונים על כל קובץ ZIP, ומחזירה רשימת מילונים.
    כל מילון מייצג שורה בדוח ומכיל מידע על חבילה אחת.
    """
    rows = []
    if not os.path.isdir(RELEASE_DIR):
        return rows

    for file_name in sorted(os.listdir(RELEASE_DIR)):
        if not file_name.endswith(".zip"):
            continue
        zip_path = os.path.join(RELEASE_DIR, file_name)
        dist_name = file_name[:-4]
        # התיקייה המקבילה לקובץ ה-ZIP (שנוצרה זמנית במהלך האריזה) משמשת לספירת קבצים לפי סוג
        dist_dir = os.path.join(RELEASE_DIR, dist_name)
        rows.append(
            {
                "package": file_name,
                "size": file_size_mb(zip_path),
                "zip_files": zip_count(zip_path),
                "html": count_files(dist_dir, ".html"),
                "h5p": count_files(dist_dir, ".h5p"),
                "xml": count_files(dist_dir, ".xml"),
                "matlab": count_files(dist_dir, ".m"),
            }
        )
    return rows


# --- יצירת וכתיבת הדוח ---

def write_report():
    """יוצרת את דוח הסיכום בפורמט Markdown וכותבת אותו לקובץ."""
    # 1. איסוף הנתונים
    os.makedirs(RELEASE_DIR, exist_ok=True)
    rows = release_rows()
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    lines = [
        "# EELab1 Release Report",
        "",
        f"Generated: {generated_at}",
        "",
        "| Package | Size MB | Files in ZIP | HTML | H5P | XML | MATLAB |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]

    # 2. בניית שורות הטבלה
    for row in rows:
        lines.append(
            "| {package} | {size} | {zip_files} | {html} | {h5p} | {xml} | {matlab} |".format(**row)
        )

    if not rows:
        lines.append("| No release ZIP files found |  |  |  |  |  |  |")

    # 3. הוספת קישורים מהירים בסוף הדוח
    preview_index = os.path.join(DIST_DIR, "previews", "index.html")
    lines.extend(
        [
            "",
            "## Quick Links",
            "",
            f"- Preview index: `{os.path.relpath(preview_index, ROOT)}`",
            f"- Release folder: `{os.path.relpath(RELEASE_DIR, ROOT)}`",
        ]
    )

    # 4. כתיבת התוכן לקובץ
    with open(REPORT_PATH, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")

    print(f"SUCCESS: Release report written to {REPORT_PATH} ({len(rows)} packages).")


# --- נקודת כניסה ראשית של הסקריפט ---

if __name__ == "__main__":
    write_report()
