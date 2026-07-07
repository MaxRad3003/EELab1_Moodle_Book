# סקריפט זה אחראי על אריזת ניסויים 1, 2, ו-3 לחבילות הפצה עבור Moodle.
# עבור כל ניסוי, הסקריפט מבצע את הפעולות הבאות:
# 1. דוחס את קבצי ה-HTML של ספר ה-Moodle לקובץ ZIP.
# 2. אורז קבצי H5P אינטראקטיביים (אם קיימים).
# 3. מעתיק קבצי XML של מאגרי שאלות (Question Banks).
# 4. אורז קבצי MATLAB לשימוש אופליין (אם קיימים).
# 5. יוצר קובץ README עם הוראות העלאה מסודרות.
# 6. דוחס את כל התוצרים לקובץ ZIP הפצה סופי עבור הניסוי.

# סקריפט זה אחראי על אריזת ניסויים 1, 2, ו-3 לחבילות הפצה עבור Moodle.
# עבור כל ניסוי, הסקריפט מבצע את הפעולות הבאות:
# 1. דוחס את קבצי ה-HTML של ספר ה-Moodle לקובץ ZIP.
# 2. אורז קבצי H5P אינטראקטיביים (אם קיימים).
# 3. מעתיק קבצי XML של מאגרי שאלות (Question Banks).
# 4. אורז קבצי MATLAB לשימוש אופליין (אם קיימים).
# 5. יוצר קובץ README עם הוראות העלאה מסודרות.
# 6. דוחס את כל התוצרים לקובץ ZIP הפצה סופי עבור הניסוי.

import os
import shutil
import sys
import zipfile

# הגדרת קידוד UTF-8 עבור פלט שיכול להכיל תווים בעברית
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# הגדרת נתיבים וקבועים גלובליים
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXPERIMENTS = ("Exp01", "Exp02", "Exp03")


# --- פונקציות עזר ---

def ensure_parent(path):
    """מוודא שהספרייה האב של נתיב נתון קיימת, ויוצר אותה במידת הצורך."""
    os.makedirs(os.path.dirname(path), exist_ok=True)


def zip_files(zip_path, source_dir, files):
    """דוחס רשימת קבצים מתיקיית מקור לקובץ ZIP."""
    ensure_parent(zip_path)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for file_name in files:
            file_path = os.path.join(source_dir, file_name)
            if not os.path.isfile(file_path):
                raise FileNotFoundError(f"Missing package file: {file_path}")
            archive.write(file_path, arcname=file_name)


def zip_tree_files(zip_path, source_dir, suffix, arc_prefix=""):
    """דוחס את כל הקבצים עם סיומת מסוימת מעץ תיקיות שלם לקובץ ZIP."""
    ensure_parent(zip_path)
    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for root_dir, _, files in os.walk(source_dir):
            for file_name in sorted(files):
                if not file_name.endswith(suffix):
                    continue
                file_path = os.path.join(root_dir, file_name)
                rel_path = os.path.relpath(file_path, source_dir)
                archive.write(file_path, arcname=os.path.join(arc_prefix, rel_path))
                count += 1
    return count


# --- פונקציות לאריזת רכיבים ספציפיים ---

def copy_question_banks(exp_name, release_root):
    """מעתיק קבצי XML של מאגר השאלות (Question Bank) של Moodle לתיקיית ההפצה."""
    qb_dir = os.path.join(ROOT, "src", "content", "EELab1", exp_name, "00_PreLab", "Moodle Quix _XML")
    if not os.path.isdir(qb_dir):
        return 0

    copied = 0
    for file_name in sorted(os.listdir(qb_dir)):
        if file_name.endswith(".xml"):
            shutil.copyfile(os.path.join(qb_dir, file_name), os.path.join(release_root, file_name))
            copied += 1
    return copied


def package_h5p(exp_name, release_root):
    """אורז את קבצי ה-H5P של הניסוי לתיקיית ההפצה ויוצר מהם גם קובץ ZIP מאוחד."""
    h5p_dir = os.path.join(
        ROOT, "src", "content", "EELab1", exp_name, "moodle_book_import_v2", "H5P_Quiz"
    )
    if not os.path.isdir(h5p_dir):
        return 0

    # 1. העתקת קבצי h5p. בודדים לתיקיית המשנה H5P_Quiz/
    dest_h5p_dir = os.path.join(release_root, "H5P_Quiz")
    shutil.copytree(h5p_dir, dest_h5p_dir, dirs_exist_ok=True, ignore=lambda _, files: [f for f in files if not f.endswith('.h5p')])

    # 2. יצירת קובץ ZIP מאוחד המכיל את כל קבצי ה-h5p.
    h5p_zip_path = os.path.join(release_root, f"{exp_name}_H5P_Quiz.zip")
    # הפונקציה zip_tree_files סורקת, דוחסת ומחזירה את ספירת הקבצים
    return zip_tree_files(h5p_zip_path, h5p_dir, ".h5p")


def package_offline_matlab(exp_name, release_root):
    """אורז קבצי MATLAB (.m) לשימוש אופליין לקובץ ZIP בתיקיית ההפצה."""
    offline_matlab_dir = os.path.join(
        ROOT, "src", "content", "EELab1", exp_name, "moodle_book_import_v2", "Offline_MATLAB"
    )
    if not os.path.isdir(offline_matlab_dir):
        return 0

    offline_zip_path = os.path.join(release_root, f"{exp_name}_Offline_MATLAB.zip")
    return zip_tree_files(offline_zip_path, offline_matlab_dir, ".m")


def write_upload_readme(exp_name, release_root, h5p_count, matlab_count, question_bank_count):
    """יוצר קובץ README עם הוראות העלאה ל-Moodle עבור חבילת הניסוי."""
    sections = [
        f"# {exp_name} Moodle Upload Package",
        "## 1. Moodle Book",
        "Upload/import this file into the Moodle Book activity:",
        f"`{exp_name}_Moodle_Book_Import.zip`",
        "The ZIP contains the ordered Moodle Book HTML chapters and subchapters.",
    ]

    if h5p_count:
        sections.extend(
            [
                "## 2. H5P Quizzes",
                "The `.h5p` files are available in the `H5P_Quiz` folder.",
                "For bulk handling, the same files are also collected in:",
                f"`{exp_name}_H5P_Quiz.zip`",
            ]
        )

    if question_bank_count:
        sections.extend(
            [
                "## 3. Moodle Question Bank",
                "Import the included `.xml` file(s) into the Moodle Question Bank.",
            ]
        )

    if matlab_count:
        sections.extend(
            [
                "## 4. Offline MATLAB Files",
                f"`{exp_name}_Offline_MATLAB.zip` contains `.m` script templates for local work.",
            ]
        )

    with open(os.path.join(release_root, "README_UPLOAD_TO_MOODLE.md"), "w", encoding="utf-8") as handle:
        handle.write("\n\n".join(sections) + "\n")


# --- פונקציה ראשית לאריזת ניסוי ---

def package_experiment(exp_name):
    """מבצעת את כל תהליך האריזה עבור ניסוי ספציפי."""
    print(f"Packaging {exp_name}...")

    book_source = os.path.join(ROOT, "dist", "moodle_ready", "EELab1", exp_name, "moodle_book_import_v2")
    if not os.path.isdir(book_source):
        print(f"Skipping {exp_name} - directory not found: {book_source}")
        return False

    book_files = sorted(file_name for file_name in os.listdir(book_source) if file_name.endswith(".html"))
    if not book_files:
        raise RuntimeError(f"No Moodle Book HTML files found for {exp_name}: {book_source}")

    book_zip_dist = os.path.join(
        ROOT, "dist", "moodle_ready", "EELab1", exp_name, f"{exp_name}_Moodle_Book_Import.zip"
    )
    book_zip_src = os.path.join(ROOT, "src", "content", "EELab1", exp_name, f"{exp_name}_Moodle_Book_Import.zip")
    release_root = os.path.join(ROOT, "dist", "release", f"{exp_name}_Moodle_Distribution")
    release_zip = os.path.join(ROOT, "dist", "release", f"{exp_name}_Moodle_Distribution.zip")

    os.makedirs(release_root, exist_ok=True)
    ensure_parent(book_zip_src)

    # שלב 1: יצירת ZIP של ספר ה-Moodle
    zip_files(book_zip_dist, book_source, book_files)
    
    # שלב 1.5: הוספת תיקיית ה-H5P לתוך ה-ZIP של ספר ה-Moodle לאפשרות הטמעה אוטומטית (Option 1)
    h5p_src_dir = os.path.join(ROOT, "src", "content", "EELab1", exp_name, "moodle_book_import_v2", "H5P_Quiz")
    if os.path.isdir(h5p_src_dir):
        with zipfile.ZipFile(book_zip_dist, "a", zipfile.ZIP_DEFLATED) as archive:
            for f in os.listdir(h5p_src_dir):
                if f.endswith(".h5p"):
                    archive.write(os.path.join(h5p_src_dir, f), arcname=f"H5P_Quiz/{f}")

    # שלב 2: העתקת ה-ZIP לספריית ה-src (לגיבוי) ולתיקיית ההפצה
    shutil.copyfile(book_zip_dist, book_zip_src)
    shutil.copyfile(book_zip_dist, os.path.join(release_root, f"{exp_name}_Moodle_Book_Import.zip"))

    # שלב 3: אריזת רכיבים נוספים (H5P, מאגרי שאלות, MATLAB)
    h5p_count = package_h5p(exp_name, release_root)
    question_bank_count = copy_question_banks(exp_name, release_root)
    matlab_count = package_offline_matlab(exp_name, release_root)
    # שלב 4: כתיבת קובץ הוראות
    write_upload_readme(exp_name, release_root, h5p_count, matlab_count, question_bank_count)

    # שלב 5: יצירת קובץ ZIP סופי של כל חבילת ההפצה
    with zipfile.ZipFile(release_zip, "w", zipfile.ZIP_DEFLATED) as archive:
        for root_dir, _, files in os.walk(release_root):
            for file_name in sorted(files):
                file_path = os.path.join(root_dir, file_name)
                archive.write(file_path, os.path.relpath(file_path, release_root))

    print(
        f"SUCCESS: {exp_name} packaged "
        f"({len(book_files)} book files, {h5p_count} H5P, {question_bank_count} XML, {matlab_count} MATLAB)."
    )
    return True


# --- נקודת כניסה ראשית של הסקריפט ---

if __name__ == "__main__":
    # מאפשר הרצה של הסקריפט עבור ניסויים ספציפיים מהטרמינל
    # מאפשר הרצה של הסקריפט עבור ניסויים ספציפיים מהטרמינל
    args = [arg.lower() for arg in sys.argv[1:]]
    selected = [exp for exp in EXPERIMENTS if not args or exp.lower() in args]
    if not selected:
        raise SystemExit(f"No supported experiment selected. Use one of: {', '.join(EXPERIMENTS)}")

    for experiment in selected:
        package_experiment(experiment)
