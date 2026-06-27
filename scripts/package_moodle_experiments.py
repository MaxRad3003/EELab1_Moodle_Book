import os
import zipfile
import shutil

def package_experiment(exp_name):
    print(f"Packaging {exp_name}...")
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    book_source = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', exp_name, 'moodle_book_import_v2')
    if not os.path.exists(book_source):
        print(f"Skipping {exp_name} - Directory not found.")
        return

    book_zip_dist = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', exp_name, f'{exp_name}_Moodle_Book_Import.zip')
    book_zip_src = os.path.join(root, 'src', 'content', 'EELab1', exp_name, f'{exp_name}_Moodle_Book_Import.zip')
    release_root = os.path.join(root, 'dist', 'release', f'{exp_name}_Moodle_Distribution')
    release_zip = os.path.join(root, 'dist', 'release', f'{exp_name}_Moodle_Distribution.zip')

    os.makedirs(os.path.dirname(book_zip_dist), exist_ok=True)
    os.makedirs(os.path.dirname(book_zip_src), exist_ok=True)
    os.makedirs(release_root, exist_ok=True)

    # 1. Zip all files in moodle_book_import_v2
    with zipfile.ZipFile(book_zip_dist, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file in os.listdir(book_source):
            file_path = os.path.join(book_source, file)
            if os.path.isfile(file_path): # Only include files, typically .html
                zf.write(file_path, arcname=file)
    
    # 2. Copy the zip
    shutil.copyfile(book_zip_dist, book_zip_src)
    shutil.copyfile(book_zip_dist, os.path.join(release_root, f'{exp_name}_Moodle_Book_Import.zip'))

    # 3. Handle H5P or other assets (specific to each experiment based on what powershell used to do)
    h5p_dir = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', exp_name, 'H5P_Quiz')
    if os.path.exists(h5p_dir):
        dest_h5p_dir = os.path.join(release_root, 'H5P_Quiz')
        os.makedirs(dest_h5p_dir, exist_ok=True)
        for h5p_file in os.listdir(h5p_dir):
            if h5p_file.endswith('.h5p'):
                shutil.copyfile(os.path.join(h5p_dir, h5p_file), os.path.join(dest_h5p_dir, h5p_file))

    # Handle Question Banks for Exp03 if needed
    qb_dir = os.path.join(root, 'src', 'content', 'EELab1', exp_name, '00_PreLab', 'Moodle Quix _XML')
    if os.path.exists(qb_dir):
        for xml_file in os.listdir(qb_dir):
            if xml_file.endswith('.xml'):
                shutil.copyfile(os.path.join(qb_dir, xml_file), os.path.join(release_root, xml_file))

    # 4. Create README
    readme_content = f"""# {exp_name} Moodle Upload Package

## 1. Moodle Book

Upload/import this file into the Moodle Book activity:

`{exp_name}_Moodle_Book_Import.zip`

The ZIP contains the ordered Moodle Book HTML chapters and subchapters.
"""
    with open(os.path.join(release_root, 'README_UPLOAD_TO_MOODLE.md'), 'w', encoding='utf-8') as f:
        f.write(readme_content)

    # 5. Create final release ZIP
    with zipfile.ZipFile(release_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root_dir, _, files in os.walk(release_root):
            for file in files:
                file_path = os.path.join(root_dir, file)
                arcname = os.path.relpath(file_path, release_root)
                zf.write(file_path, arcname)
    
    # Cleanup temp folder
    shutil.rmtree(release_root)

    print(f"SUCCESS: Created ZIP for {exp_name}")

if __name__ == "__main__":
    for exp in ["Exp01", "Exp02", "Exp03"]:
        package_experiment(exp)
