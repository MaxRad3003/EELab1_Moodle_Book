import os
import zipfile

# Paths
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source_file = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment', 'mastech_my6243_sub.html')
dist_zip_path = os.path.join(root, 'dist', 'mastech_my6243_moodle_ready.zip')

# Create zip archive containing only the html file
with zipfile.ZipFile(dist_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    # We write it with the relative name 'mastech_my6243_sub.html' at the root of the ZIP
    z.write(source_file, 'mastech_my6243_sub.html')

print("Zip packaging complete! Mastech Only ZIP saved successfully.")
