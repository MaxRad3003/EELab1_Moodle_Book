# סקריפט זה מבצע פעולה מאוד ספציפית: אריזת קובץ ה-HTML
# של מכשיר המדידה Mastech MY6243 בלבד.
# התוצר הוא קובץ ZIP המכיל קובץ HTML יחיד, המיועד להעלאה פרטנית ל-Moodle
# במקרה שנדרש לעדכן רק את הדף הזה מבלי לדרוס את כל ספר ציוד המדידה.

# סקריפט זה מבצע פעולה מאוד ספציפית: אריזת קובץ ה-HTML
# של מכשיר המדידה Mastech MY6243 בלבד.
# התוצר הוא קובץ ZIP המכיל קובץ HTML יחיד, המיועד להעלאה פרטנית ל-Moodle
# במקרה שנדרש לעדכן רק את הדף הזה מבלי לדרוס את כל ספר ציוד המדידה.

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import zipfile

# Paths
# --- הגדרת נתיבים ---
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
source_file = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment', 'mastech_my6243_sub.html')
dist_zip_path = os.path.join(root, 'dist', 'mastech_my6243_moodle_ready.zip')

# --- תהליך האריזה ---
# יצירת ארכיון ZIP המכיל את קובץ ה-HTML הבודד
with zipfile.ZipFile(dist_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    # כתיבת הקובץ לשורש ה-ZIP עם שם קבוע
    z.write(source_file, 'mastech_my6243_sub.html')

print("Zip packaging complete! Mastech Only ZIP saved successfully.")
