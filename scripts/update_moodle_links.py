import os
import sys
import subprocess

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src_dir = os.path.join(root, 'src', 'content')

def update_links(old_id, new_id):
    print(f"Replacing old Moodle Book ID {old_id} with new ID {new_id}...")
    modified_files = 0

    for base, dirs, files in os.walk(src_dir):
        # Ignore draft folders
        if 'draft' in base.lower():
            continue
        for file in files:
            if file.endswith(('.html', '.json', '.md')):
                file_path = os.path.join(base, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    has_old_id = old_id in content
                    has_old_chap = "chapterid=142" in content
                    if has_old_id or has_old_chap:
                        new_content = content
                        if has_old_id:
                            new_content = new_content.replace(old_id, new_id)
                        if has_old_chap:
                            new_content = new_content.replace("chapterid=142", "chapterid=1869")
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {os.path.relpath(file_path, src_dir)}")
                        modified_files += 1
                except Exception as e:
                    print(f"Error updating {file_path}: {e}")

    print(f"\nDone! Updated {modified_files} files.")
    
    # Run clean, rebuild and packaging pipeline
    print("\nRunning clean, rebuild and packaging pipeline to update all ZIP files...")
    rebuild_script = os.path.join(root, 'scripts', 'rebuild_and_clean_dist.py')
    res = subprocess.run(f"python \"{rebuild_script}\"", shell=True, cwd=root)
    if res.returncode == 0:
        print("\nSUCCESS: All distribution files successfully updated with the new Moodle Book ID!")
    else:
        print("\nERROR: Rebuild and packaging failed.")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/update_moodle_links.py <new_moodle_id> [old_moodle_id]")
        print("Example: python scripts/update_moodle_links.py 1234567")
        sys.exit(1)
        
    new_id = sys.argv[1]
    old_id = sys.argv[2] if len(sys.argv) > 2 else "1212809"
    update_links(old_id, new_id)
