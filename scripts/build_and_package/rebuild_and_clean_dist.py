 
# סקריפט זה הוא המנצח הראשי (Orchestrator) של תהליך הבנייה והאריזה.
# הוא מריץ ברצף את כל השלבים הנדרשים ליצירת חבילות ההפצה המלאות:
# 1. ניקוי תיקיית התוצרים (dist).
# 2. בניית קבצי ה-HTML עם העיצובים המעודכנים (npm run build).
# 3. יצירת אינדקס תצוגה מקדימה ובדיקת קישורים שבורים.
# 4. הפעלת סקריפטי האריזה השונים (package_*) עבור כל ניסוי ורכיב.
# 5. יצירת דוח סיכום של כל החבילות שנוצרו.

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import subprocess
import shutil

# --- הגדרות ופונקציות עזר ---

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run_command(cmd, cwd=root):
    """מריץ פקודת shell, מדפיס אותה, ובודק אם הסתיימה בהצלחה."""
    print(f"Running: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd)
    if res.returncode != 0:
        raise Exception(f"Command failed: {cmd}")

# --- פונקציה ראשית לתהליך הבנייה ---

def rebuild_all():
    """מבצעת את כל שלבי הבנייה, האריזה והדיווח מחדש."""
    # שלב 1: ניקוי תיקיית התוצרים הקיימת
    dist_dir = os.path.join(root, 'dist')
    print("Cleaning dist directory...")
    run_command("npm run clean")
    os.makedirs(dist_dir, exist_ok=True)

    # שלב 2: בניית קבצי ה-HTML המעוצבים
    run_command("npm run build")

    # שלב 3: יצירת אינדקס תצוגה מקדימה ובדיקת קישורים שבורים
    run_command("python scripts/build_and_package/generate_preview_index.py")
    run_command("python scripts/html_and_links/validate_links.py")

    # שלב 4: אריזת ניסויים 1, 2, 3
    run_command("python scripts/build_and_package/package_moodle_experiments.py")

    # שלב 5: אריזת ניסויים 4, 5
    run_command("python scripts/build_and_package/package_exp04_exp05.py")

    # שלב 6: אריזת ספר ציוד המדידה
    run_command("python scripts/build_and_package/package_measuring_equipment.py")

    # שלב 7: אריזת דף ה-Mastech בלבד
    run_command("python scripts/build_and_package/package_mastech_only.py")

    # שלב 8: אריזת כל החבילות לקובץ הפצה מלא
    run_command("python scripts/build_and_package/package_full_distribution.py")

    # שלב 9: העתקת קבצי ZIP חשובים לתיקיות המתאימות
    print("Copying ZIP files to release dir...")
    measuring_eq_zip = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')
    release_dir = os.path.join(root, 'dist', 'release')
    os.makedirs(release_dir, exist_ok=True)
    # העתקת ה-ZIP של ציוד המדידה לתיקיית ההפצה הראשית
    if os.path.exists(measuring_eq_zip):
        shutil.copyfile(measuring_eq_zip, os.path.join(release_dir, 'EELab_Measuring_equipment_Moodle_Book.zip'))

    # העתקת כל קבצי ה-ZIP מתיקיית ההפצה לתיקיית dist הראשית (לנוחות גישה)
    for file in os.listdir(release_dir):
        if file.endswith('.zip'):
            shutil.copyfile(os.path.join(release_dir, file), os.path.join(dist_dir, file))

    # 9. Write release summary
    run_command("python scripts/build_and_package/generate_release_report.py")

    print("\nSUCCESS: All files successfully rebuilt, packaged, and organized in dist/ !")

# --- נקודת כניסה ראשית של הסקריפט ---

if __name__ == '__main__':
    rebuild_all()
