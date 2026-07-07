# סקריפט זה אחראי על אריזת התוכן של "ציוד המדידה" (Measuring Equipment).
# הוא לוקח את כל קבצי ה-HTML הרלוונטיים מתיקיית התוצרים (dist)
# ודוחס אותם לקובץ ZIP יחיד, המוכן לייבוא כספר Moodle.
# בנוסף, הוא מעתיק את ה-ZIP שנוצר בחזרה לתיקיית המקור (src) לצרכי גיבוי.

# סקריפט זה אחראי על אריזת התוכן של "ציוד המדידה" (Measuring Equipment).
# הוא לוקח את כל קבצי ה-HTML הרלוונטיים מתיקיית התוצרים (dist)
# ודוחס אותם לקובץ ZIP יחיד, המוכן לייבוא כספר Moodle.
# בנוסף, הוא מעתיק את ה-ZIP שנוצר בחזרה לתיקיית המקור (src) לצרכי גיבוי.

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import zipfile
import shutil

# --- הגדרת נתיבים ---
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
source_dir = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment')
dist_zip_path = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')
src_zip_path = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')

# --- תהליך האריזה ---
# 1. יצירת ארכיון ZIP מכל הקבצים בתיקיית המקור
with zipfile.ZipFile(dist_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for base, dirs, files in os.walk(source_dir):
        for file in files:
            full_path = os.path.join(base, file)
            rel_path = os.path.relpath(full_path, source_dir)
            z.write(full_path, rel_path)

# 2. העתקת קובץ ה-ZIP שנוצר לתיקיית המקור (src) לצורך גיבוי ועקביות
os.makedirs(os.path.dirname(src_zip_path), exist_ok=True)
shutil.copyfile(dist_zip_path, src_zip_path)
print("Zip packaging complete successfully!")
