import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import sys
import json
import subprocess

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src_dir = os.path.join(root, 'src', 'content')
config_path = os.path.join(root, 'moodle_config.json')

def load_config():
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "MEASURING_EQUIPMENT_BOOK_ID": "1215505",
        "EXP01_PRELAB_QUIZ_ID": "1212801",
        "EXP02_PRELAB_QUIZ_ID": "1212802",
        "EXP03_PRELAB_QUIZ_ID": "1212803",
        "EXP04_PRELAB_QUIZ_ID": "1212804"
      }

def save_config(config):
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)

def migrate_and_update(config):
    print("Migrating hardcoded IDs in source files to placeholders...")
    modified_files = 0

    # Old IDs we want to clean up in src/content and replace with placeholders
    id_mapping = {
        "1215505": "{{MEASURING_EQUIPMENT_BOOK_ID}}",
        "1212809": "{{MEASURING_EQUIPMENT_BOOK_ID}}"
    }

    for base, dirs, files in os.walk(src_dir):
        if 'draft' in base.lower():
            continue
        for file in files:
            if file.endswith(('.html', '.json', '.md')):
                file_path = os.path.join(base, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    has_changes = False

                    # Migrate hardcoded IDs to placeholders
                    for old_val, placeholder in id_mapping.items():
                        if old_val in new_content:
                            new_content = new_content.replace(old_val, placeholder)
                            has_changes = True
                    
                    if "chapterid=142" in new_content:
                        new_content = new_content.replace("chapterid=142", "chapterid=1869")
                        has_changes = True

                    if has_changes:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Migrated and Parameterized: {os.path.relpath(file_path, src_dir)}")
                        modified_files += 1

                except Exception as e:
                    print(f"Error migrating {file_path}: {e}")

    print(f"\nDone! Updated {modified_files} source files.")
    
    # Run clean, rebuild and packaging pipeline
    print("\nRunning clean, rebuild and packaging pipeline to update all ZIP files...")
    rebuild_script = os.path.join(root, 'scripts', 'build_and_package', 'rebuild_and_clean_dist.py')
    res = subprocess.run(f"python \"{rebuild_script}\"", shell=True, cwd=root)
    if res.returncode == 0:
        print("\nSUCCESS: All distribution files successfully rebuilt with updated configurations!")
    else:
        print("\nERROR: Rebuild and packaging failed.")

if __name__ == '__main__':
    config = load_config()

    if len(sys.argv) == 2:
        # backward compatibility: update MEASURING_EQUIPMENT_BOOK_ID
        new_val = sys.argv[1]
        print(f"Updating MEASURING_EQUIPMENT_BOOK_ID to: {new_val}")
        config["MEASURING_EQUIPMENT_BOOK_ID"] = new_val
        save_config(config)
    elif len(sys.argv) >= 3:
        key = sys.argv[1]
        value = sys.argv[2]
        if key in config:
            print(f"Updating configuration key {key} to: {value}")
            config[key] = value
            save_config(config)
        else:
            print(f"Error: Unknown configuration key: {key}")
            print(f"Available keys: {list(config.keys())}")
            sys.exit(1)
    else:
        print("Usage: python scripts/update_moodle_links.py <key> <value>")
        print("Backward Compatibility: python scripts/update_moodle_links.py <new_measuring_equipment_book_id>")
        print(f"Current Config:\n{json.dumps(config, indent=2)}")
        print("\nRunning rebuild with current configurations...")

    migrate_and_update(config)

