import os
import zipfile
import shutil

# Paths
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source_dir = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment')
dist_zip_path = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')
src_zip_path = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')

# Create zip archive of the moodle ready output folder
with zipfile.ZipFile(dist_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for base, dirs, files in os.walk(source_dir):
        for file in files:
            full_path = os.path.join(base, file)
            rel_path = os.path.relpath(full_path, source_dir)
            z.write(full_path, rel_path)

# Copy the zip to the src content directory for project integrity
os.makedirs(os.path.dirname(src_zip_path), exist_ok=True)
shutil.copyfile(dist_zip_path, src_zip_path)
print("Zip packaging complete successfully!")
