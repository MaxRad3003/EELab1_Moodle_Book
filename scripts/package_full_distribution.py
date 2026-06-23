import os
import zipfile
import shutil

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
release_dir = os.path.join(root, 'dist', 'release')
full_dist_dir = os.path.join(root, 'dist', 'EELab1_Full_Moodle_Distribution')
full_dist_zip = os.path.join(root, 'dist', 'EELab1_Full_Moodle_Distribution.zip')

def create_full_distribution():
    os.makedirs(full_dist_dir, exist_ok=True)

    # 1. Copy Experiment distribution zips
    exps = ['Exp01', 'Exp02', 'Exp03', 'Exp04', 'Exp05']
    for exp in exps:
        zip_name = f"{exp}_Moodle_Distribution.zip"
        src_zip = os.path.join(release_dir, zip_name)
        if os.path.exists(src_zip):
            shutil.copyfile(src_zip, os.path.join(full_dist_dir, zip_name))
            print(f"Copied {zip_name} to full distribution")
        else:
            print(f"Warning: {zip_name} not found")

    # 2. Copy Measuring equipment book zip
    measuring_eq_zip = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')
    if os.path.exists(measuring_eq_zip):
        shutil.copyfile(measuring_eq_zip, os.path.join(full_dist_dir, 'EELab_Measuring_equipment_Moodle_Book.zip'))
        print("Copied EELab_Measuring_equipment_Moodle_Book.zip to full distribution")
    else:
        print("Warning: EELab_Measuring_equipment_Moodle_Book.zip not found")

    # 3. Copy Mastech MY6243 specific zip
    mastech_zip = os.path.join(root, 'dist', 'mastech_my6243_moodle_ready.zip')
    if os.path.exists(mastech_zip):
        shutil.copyfile(mastech_zip, os.path.join(full_dist_dir, 'mastech_my6243_moodle_ready.zip'))
        print("Copied mastech_my6243_moodle_ready.zip to full distribution")
    else:
        print("Warning: mastech_my6243_moodle_ready.zip not found")

    # 4. Write master README
    master_readme = """# ערכת הפצה מלאה - מעבדה לחשמל 1 (EELab1) ל-Moodle

ערכה זו מכילה את כל חומרי המעבדה המעודכנים (כולל הערות קוד HTML, תיקוני ניווט וציוד מדידה חדש).

## תכולת החבילה:

1. **`Exp01_Moodle_Distribution.zip`**
   - קובץ ייבוא ספר Moodle לניסוי 1.

2. **`Exp02_Moodle_Distribution.zip`**
   - קובץ ייבוא ספר Moodle לניסוי 2 + תיקיית שאלוני הכנה אינטראקטיביים `H5P_Quiz/` (7 קבצים).

3. **`Exp03_Moodle_Distribution.zip`**
   - קובץ ייבוא ספר Moodle לניסוי 3 + תיקיית שאלוני הכנה `H5P_Quiz/` (9 קבצים) + מאגר שאלות ל-Moodle Question Bank (`Exp03_PreLab_Question_Bank.xml`).

4. **`Exp04_Moodle_Distribution.zip`**
   - קובץ ייבוא ספר Moodle לניסוי 4 + שאלון Moodle Question Bank (`Exp04_Power_Quiz.xml`).

5. **`Exp05_Moodle_Distribution.zip`**
   - קובץ ייבוא ספר Moodle לניסוי 5 + שאלון Moodle Question Bank (`Exp05_Resonance_Quiz.xml`).

6. **`EELab_Measuring_equipment_Moodle_Book.zip`**
   - קובץ ייבוא של **כל מדריך ציוד המדידה** (DMM, אוסילוסקופים, ספקי כוח, מחוללי אותות, מד הספק, וכן המכשיר החדש Mastech MY6243).

7. **`mastech_my6243_moodle_ready.zip`**
   - קובץ המכיל **אך ורק** את דף ה-HTML עבור המכשיר החדש **Mastech MY6243**. להעלאה פרטנית במידה ואינך רוצה לדרוס או לשנות את שאר דפי המכשירים הקיימים ב-Moodle.

---

## הנחיות העלאה ל-Moodle:
* **עבור ספרי Moodle (Moodle Books):** צור פעילות "ספר" חדשה ב-Moodle, כנס להגדרות/ניהול הספר, בחר ב-"ייבוא פרקים" (Import chapters) והעלה את קובץ ה-`*_Moodle_Book_Import.zip` הרלוונטי (נמצא בתוך ה-ZIP של כל ניסוי או בתוך הציוד הכללי).
* **עבור שאלוני H5P:** העלה כל קובץ `.h5p` כפעילות H5P חדשה בנפרד.
* **עבור מאגרי שאלות (Question Bank):** כנס למאגר השאלות בקורס, בחר ב-"ייבוא" (Import) בפורמט Moodle XML, והעלה את קובץ ה-`.xml` המתאים.
"""

    with open(os.path.join(full_dist_dir, 'README_ALL_EXPERIMENTS.md'), 'w', encoding='utf-8') as f:
        f.write(master_readme)

    # 5. Zip the entire full distribution directory
    if os.path.exists(full_dist_zip):
        os.remove(full_dist_zip)

    with zipfile.ZipFile(full_dist_zip, 'w', zipfile.ZIP_DEFLATED) as z:
        for base, dirs, files in os.walk(full_dist_dir):
            for file in files:
                full_path = os.path.join(base, file)
                rel_path = os.path.relpath(full_path, full_dist_dir)
                z.write(full_path, rel_path)

    # Cleanup temporary directory
    shutil.rmtree(full_dist_dir)
    print(f"\nSUCCESS: Created full distribution ZIP at: {full_dist_zip}")

if __name__ == '__main__':
    create_full_distribution()
