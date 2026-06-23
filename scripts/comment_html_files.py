import os
import re

# Root directory of the project
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src_dir = os.path.join(root, 'src', 'content')

patterns = [
    (r'<div[^>]*class="[^"]*info-box[^"]*"[^>]*>', 'INFO BOX SECTION'),
    (r'<div[^>]*class="[^"]*theory-card[^"]*"[^>]*>', 'THEORY CARD SECTION'),
    (r'<table[^>]*>', 'DATA TABLE / COMPARISON TABLE'),
    (r'<svg[^>]*>', 'SVG ILLUSTRATION / VECTOR GRAPHIC'),
    (r'<div[^>]*class="[^"]*alert-danger[^"]*"[^>]*>', 'SAFETY & WARNING BLOCK'),
    (r'<div[^>]*class="[^"]*alert-warning[^"]*"[^>]*>', 'WARNING / ATTENTION BLOCK'),
    (r'<div[^>]*class="[^"]*alert-info[^"]*"[^>]*>', 'INFO / BREADCRUMB BLOCK'),
    (r'<div[^>]*class="[^"]*alert-success[^"]*"[^>]*>', 'SUCCESS / FOOTER NOTICE'),
    (r'<div[^>]*class="[^"]*card[^"]*"[^>]*>', 'CARD CONTAINER'),
    (r'<ol[^>]*>', 'NUMBERED LIST / STEP-BY-STEP'),
    (r'<ul[^>]*>', 'BULLET LIST / KEY POINTS')
]

def add_comments_to_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    modified = False

    for pattern, label in patterns:
        temp_content = ""
        last_idx = 0
        for m in re.finditer(pattern, new_content, re.IGNORECASE):
            start = m.start()
            end = m.end()
            prefix = new_content[max(0, start-60):start]
            # Skip if there's already an HTML comment nearby in the prefix
            if '<!--' in prefix or '-->' in prefix:
                temp_content += new_content[last_idx:end]
            else:
                temp_content += new_content[last_idx:start] + f"<!-- {label} -->\n" + m.group(0)
            last_idx = end
        temp_content += new_content[last_idx:]
        if temp_content != new_content:
            new_content = temp_content
            modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def walk_and_comment():
    modified_count = 0
    total_count = 0
    for base, dirs, files in os.walk(src_dir):
        # Ignore draft folders
        if 'draft' in base.lower():
            continue
        for file in files:
            if file.endswith('.html'):
                total_count += 1
                file_path = os.path.join(base, file)
                try:
                    if add_comments_to_file(file_path):
                        # Use simple ASCII prefix
                        print(f"[MODIFIED] {os.path.relpath(file_path, src_dir)}")
                        modified_count += 1
                except Exception as e:
                    print(f"[ERROR] processing {file_path}: {e}")

    print(f"\nSummary: Commented {modified_count} out of {total_count} HTML files.")

if __name__ == '__main__':
    walk_and_comment()
