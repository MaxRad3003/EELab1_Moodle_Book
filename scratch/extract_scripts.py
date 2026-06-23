import os
import re
import subprocess

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
preview_dir = os.path.join(root, 'dist', 'previews', 'EELab1', 'Exp03', 'moodle_book_import_v2')

files = ['01_PreLab_01_Definitions_sub.html', '01_PreLab_02_RMS_sub.html']

scratch_dir = os.path.join(root, 'scratch')

for fname in files:
    fpath = os.path.join(preview_dir, fname)
    if not os.path.exists(fpath):
        print(f"{fname} does not exist")
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    scripts = re.findall(r'<script\b[^>]*>([\s\S]*?)</script>', content)
    body_scripts = [s for s in scripts if len(s.strip()) > 100]
    
    print(f"\n=================== {fname} ===================")
    for i, s in enumerate(body_scripts):
        js_content = s.strip()
        temp_js_path = os.path.join(scratch_dir, f"temp_{fname.replace('.html', '')}_{i}.js")
        with open(temp_js_path, 'w', encoding='utf-8') as js_file:
            js_file.write(js_content)
        
        # Check syntax using node
        res = subprocess.run(f"node -c \"{temp_js_path}\"", shell=True, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"  Script {i+1}: Syntax is VALID")
        else:
            print(f"  Script {i+1}: Syntax ERROR:")
            print(res.stderr)
