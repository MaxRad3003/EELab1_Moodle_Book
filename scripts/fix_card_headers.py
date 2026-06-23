import os
import re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dir_path = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment')

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    
    # 1. Replace '<div class="card-header bg-primary text-white">'
    # with the inline style version
    new_content = re.sub(
        r'<div class="card-header bg-primary text-white">',
        r'<div class="card-header bg-primary text-white" style="background-color: #0369a1 !important; color: #ffffff !important;">',
        new_content
    )

    # 2. Add style="color: #ffffff !important;" to any h3 or h4 inside card-header.
    # We match:
    # (<div class="card-header bg-primary text-white"[^>]*>\s*<h[34])([^>]*)>
    def replace_h_tag(match):
        div_and_h = match.group(1)
        h_attrs = match.group(2)
        if 'style=' in h_attrs:
            # If style already exists, inject color: #ffffff !important; inside it
            fixed_attrs = re.sub(r'style="([^"]*)"', r'style="color: #ffffff !important; \1"', h_attrs)
            return div_and_h + fixed_attrs + ">"
        else:
            return div_and_h + h_attrs + ' style="color: #ffffff !important;">'

    new_content = re.sub(
        r'(<div class="card-header bg-primary text-white"[^>]*>\s*<h[34])([^>]*)>',
        replace_h_tag,
        new_content
    )

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed card headers in: {os.path.basename(file_path)}")
        return True
    return False

if __name__ == '__main__':
    fixed_files = 0
    for file in os.listdir(dir_path):
        if file.endswith('.html'):
            if fix_file(os.path.join(dir_path, file)):
                fixed_files += 1
    print(f"Total files fixed: {fixed_files}")
