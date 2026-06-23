import os
import re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src_dir = os.path.join(root, 'src', 'content')

# Regex to match:
# https://moodle.sce.ac.il/mod/book/view.php?id=(1212809|1215505) followed optionally by &chapterid=... or &amp;chapterid=...
pattern = re.compile(r'https://moodle\.sce\.ac\.il/mod/book/view\.php\?id=(?:1212809|1215505)(?:&amp;chapterid=\d+|&chapterid=\d+)?')

def normalize_links():
    modified_files = []
    
    for base, dirs, files in os.walk(src_dir):
        if 'draft' in base.lower():
            continue
        for file in files:
            if file.endswith(('.html', '.json', '.md')):
                file_path = os.path.join(base, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Search for any matches
                    matches = pattern.findall(content)
                    if matches:
                        replacement = "https://moodle.sce.ac.il/mod/book/view.php?id=1215505"
                        
                        # Let's perform the replacement
                        new_content = pattern.sub(replacement, content)
                        
                        if new_content != content:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            rel_path = os.path.relpath(file_path, src_dir)
                            modified_files.append(rel_path)
                            print(f"Normalized: {rel_path} (Found {len(matches)} matches)")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

    print(f"\nSuccessfully normalized links in {len(modified_files)} files.")

if __name__ == '__main__':
    normalize_links()
