# סקריפט זה סורק את תיקיית התוצרים 'dist/previews' ומייצר
# באופן אוטומטי קובץ 'index.html' מרכזי.
# קובץ זה משמש כדף נחיתה נוח המציג רשימה מקושרת של כל דפי ה-HTML
# שנוצרו, מקובצים לפי ניסוי או נושא, ומאפשר תצוגה מקדימה שלהם לפני האריזה.

# סקריפט זה סורק את תיקיית התוצרים 'dist/previews' ומייצר
# באופן אוטומטי קובץ 'index.html' מרכזי.
# קובץ זה משמש כדף נחיתה נוח המציג רשימה מקושרת של כל דפי ה-HTML
# שנוצרו, מקובצים לפי ניסוי או נושא, ומאפשר תצוגה מקדימה שלהם לפני האריזה.

import html
import os
import sys
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# --- הגדרות נתיבים ---
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PREVIEWS_DIR = os.path.join(ROOT, "dist", "previews")
INDEX_PATH = os.path.join(PREVIEWS_DIR, "index.html")


# --- פונקציות עזר ---

def rel_url(path):
    """מחזירה נתיב URL יחסי ובטוח לשימוש ב-HTML."""
    rel_path = os.path.relpath(path, PREVIEWS_DIR).replace(os.sep, "/")
    return html.escape(rel_path, quote=True)


def page_title(path):
    """מחלצת כותרת לדף מתוך שם הקובץ."""
    title = os.path.splitext(os.path.basename(path))[0].replace("_", " ")
    return html.escape(title)


def collect_preview_pages():
    """אוספת את כל דפי ה-HTML לתצוגה מקדימה ומקבצת אותם לפי תיקיית האב שלהם."""
    pages_by_group = {}
    if not os.path.isdir(PREVIEWS_DIR):
        return pages_by_group

    for root_dir, _, files in os.walk(PREVIEWS_DIR):
        for file_name in sorted(files):
            if not file_name.endswith(".html") or file_name == "index.html":
                continue
            file_path = os.path.join(root_dir, file_name)
            rel_parts = os.path.relpath(file_path, PREVIEWS_DIR).split(os.sep)
            group = " / ".join(rel_parts[:2]) if len(rel_parts) > 2 else rel_parts[0]
            pages_by_group.setdefault(group, []).append(file_path)

    return dict(sorted(pages_by_group.items()))


# --- פונקציה ראשית ליצירת האינדקס ---

def write_index():
    """יוצרת את קובץ ה-index.html המלא וכותבת אותו לדיסק."""
    os.makedirs(PREVIEWS_DIR, exist_ok=True)
    pages_by_group = collect_preview_pages()
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    # בניית מקטעי ה-HTML עבור כל קבוצת קישורים
    sections = []
    for group, pages in pages_by_group.items():
        links = "\n".join(
            f'          <li><a href="{rel_url(page)}">{page_title(page)}</a></li>' for page in pages
        )
        sections.append(
            f"""      <section class="group">
        <h2>{html.escape(group)}</h2>
        <ul>
{links}
        </ul>
      </section>"""
        )

    body = "\n".join(sections) or "<p>No preview HTML files were found.</p>"
    # הרכבת מסמך ה-HTML המלא עם עיצוב CSS מוטמע
    html_doc = f"""<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EELab1 Preview Index</title>
  <style>
    body {{
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f6f7f9;
      color: #1f2933;
    }}
    main {{
      max-width: 1120px;
      margin: 0 auto;
      padding: 32px 20px;
    }}
    header {{
      border-bottom: 1px solid #d7dee8;
      margin-bottom: 24px;
      padding-bottom: 16px;
    }}
    h1 {{
      margin: 0 0 8px;
      font-size: 28px;
    }}
    .meta {{
      color: #5b6675;
      font-size: 14px;
    }}
    .grid {{
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }}
    .group {{
      background: #ffffff;
      border: 1px solid #d7dee8;
      border-radius: 6px;
      padding: 16px;
    }}
    h2 {{
      margin: 0 0 12px;
      font-size: 18px;
    }}
    ul {{
      margin: 0;
      padding: 0 20px 0 0;
    }}
    li {{
      margin: 8px 0;
    }}
    a {{
      color: #064f8f;
      text-decoration: none;
    }}
    a:hover {{
      text-decoration: underline;
    }}
  </style>
</head>
<body>
  <main>
    <header>
      <h1>EELab1 Preview Index</h1>
      <div class="meta">Generated: {html.escape(generated_at)} | Groups: {len(pages_by_group)}</div>
    </header>
    <div class="grid">
{body}
    </div>
  </main>
</body>
</html>
"""
    # כתיבת הקובץ
    with open(INDEX_PATH, "w", encoding="utf-8") as handle:
        handle.write(html_doc)

    page_count = sum(len(pages) for pages in pages_by_group.values())
    print(f"SUCCESS: Preview index written to {INDEX_PATH} ({page_count} pages).")


# --- נקודת כניסה ראשית של הסקריפט ---

if __name__ == "__main__":
    write_index()
