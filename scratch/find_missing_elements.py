import os
import re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
preview_dir = os.path.join(root, 'dist', 'previews', 'EELab1', 'Exp03', 'moodle_book_import_v2')

files = ['01_PreLab_01_Definitions_sub.html', '01_PreLab_02_RMS_sub.html']

for fname in files:
    fpath = os.path.join(preview_dir, fname)
    if not os.path.exists(fpath):
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all document.getElementById('...') or document.getElementById("...")
    get_ids = re.findall(r"document\.getElementById\(['\"](.*?)['\"]\)", content)
    unique_ids = list(set(get_ids))
    
    print(f"\nMissing ID check for {fname}:")
    missing_count = 0
    for element_id in unique_ids:
        # Check if id="..." or id='...' exists in HTML
        pattern = f'id="{element_id}"'
        pattern2 = f"id='{element_id}'"
        if (pattern not in content) and (pattern2 not in content):
            print(f"  [ERROR] Missing ID: '{element_id}'")
            missing_count += 1
    
    if missing_count == 0:
        print("  [OK] All accessed elements exist!")
