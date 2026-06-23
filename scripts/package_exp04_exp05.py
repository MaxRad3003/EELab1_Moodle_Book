import os
import zipfile
import shutil

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ----------------- EXP04 Packaging -----------------
def package_exp04():
    book_source = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', 'Exp04', 'moodle_book_import_v2')
    book_zip_dist = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', 'Exp04', 'Exp04_Moodle_Book_Import.zip')
    book_zip_src = os.path.join(root, 'src', 'content', 'EELab1', 'Exp04', 'Exp04_Moodle_Book_Import.zip')
    release_root = os.path.join(root, 'dist', 'release', 'Exp04_Moodle_Distribution')
    release_zip = os.path.join(root, 'dist', 'release', 'Exp04_Moodle_Distribution.zip')
    quiz_file = os.path.join(book_source, 'Exp04_Power_Quiz.xml')

    book_files = [
        '00_Intro.html',
        '01_PreLab.html',
        '01_PreLab_01_PowerBasics_sub.html',
        '01_PreLab_02_MaxPower_sub.html',
        '01_PreLab_03_PowerFactor_sub.html',
        '01_PreLab_04_Readiness_sub.html',
        '02_InLab.html',
        '02_InLab_01_Wattmeter_sub.html',
        '02_InLab_02_MixedCircuit_sub.html',
        '02_InLab_03_MaxPower_sub.html',
        '02_InLab_04_PowerFactor_sub.html',
        '03_PostLab.html',
        '04_References.html'
    ]

    os.makedirs(release_root, exist_ok=True)
    os.makedirs(os.path.dirname(book_zip_src), exist_ok=True)

    # Create book zip
    with zipfile.ZipFile(book_zip_dist, 'w', zipfile.ZIP_DEFLATED) as z:
        for file in book_files:
            z.write(os.path.join(book_source, file), file)

    shutil.copyfile(book_zip_dist, book_zip_src)
    shutil.copyfile(book_zip_dist, os.path.join(release_root, 'Exp04_Moodle_Book_Import.zip'))

    # Copy quiz XML
    if os.path.exists(quiz_file):
        shutil.copyfile(quiz_file, os.path.join(release_root, 'Exp04_Power_Quiz.xml'))

    # Write readme
    readme_content = """# Exp04 Moodle Upload Package

## 1. Moodle Book
Upload/import this file into the Moodle Book activity:
`Exp04_Moodle_Book_Import.zip`

The ZIP contains the ordered Moodle Book HTML chapters and subchapters.

## 2. Moodle Question Bank
Import this XML file into Moodle Question Bank:
`Exp04_Power_Quiz.xml`
"""
    with open(os.path.join(release_root, 'README_UPLOAD_TO_MOODLE.md'), 'w', encoding='utf-8') as f:
        f.write(readme_content)

    # Create release zip
    with zipfile.ZipFile(release_zip, 'w', zipfile.ZIP_DEFLATED) as z:
        for base, dirs, files in os.walk(release_root):
            for file in files:
                full_path = os.path.join(base, file)
                rel_path = os.path.relpath(full_path, release_root)
                z.write(full_path, rel_path)

    print("Exp04 packaging complete successfully!")


# ----------------- EXP05 Packaging -----------------
def package_exp05():
    book_source = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', 'Exp05', 'moodle_book_import_v2')
    book_zip_dist = os.path.join(root, 'dist', 'moodle_ready', 'EELab1', 'Exp05', 'Exp05_Moodle_Book_Import.zip')
    book_zip_src = os.path.join(root, 'src', 'content', 'EELab1', 'Exp05', 'Exp05_Moodle_Book_Import.zip')
    release_root = os.path.join(root, 'dist', 'release', 'Exp05_Moodle_Distribution')
    release_zip = os.path.join(root, 'dist', 'release', 'Exp05_Moodle_Distribution.zip')
    quiz_file = os.path.join(book_source, 'Exp05_Resonance_Quiz.xml')

    book_files = [
        '00_Intro.html',
        '01_PreLab.html',
        '01_PreLab_01_ResonanceBasics_sub.html',
        '01_PreLab_02_SeriesRLC_sub.html',
        '01_PreLab_03_ParallelRLC_sub.html',
        '01_PreLab_04_Simulation_sub.html',
        '01_PreLab_05_Readiness_sub.html',
        '02_InLab.html',
        '02_InLab_01_SeriesResonance_sub.html',
        '02_InLab_02_HalfPower_sub.html',
        '02_InLab_03_PhaseResponse_sub.html',
        '02_InLab_04_XYSweep_sub.html',
        '03_PostLab.html',
        '04_References.html'
    ]

    os.makedirs(release_root, exist_ok=True)
    os.makedirs(os.path.dirname(book_zip_src), exist_ok=True)

    # Create book zip
    with zipfile.ZipFile(book_zip_dist, 'w', zipfile.ZIP_DEFLATED) as z:
        for file in book_files:
            z.write(os.path.join(book_source, file), file)

    shutil.copyfile(book_zip_dist, book_zip_src)
    shutil.copyfile(book_zip_dist, os.path.join(release_root, 'Exp05_Moodle_Book_Import.zip'))

    # Copy quiz XML
    if os.path.exists(quiz_file):
        shutil.copyfile(quiz_file, os.path.join(release_root, 'Exp05_Resonance_Quiz.xml'))

    # Write readme
    readme_content = """# Exp05 Moodle Upload Package

## 1. Moodle Book
Upload/import this file into the Moodle Book activity:
`Exp05_Moodle_Book_Import.zip`

The ZIP contains the ordered Moodle Book HTML chapters and subchapters.

## 2. Moodle Question Bank
Import this XML file into Moodle Question Bank:
`Exp05_Resonance_Quiz.xml`
"""
    with open(os.path.join(release_root, 'README_UPLOAD_TO_MOODLE.md'), 'w', encoding='utf-8') as f:
        f.write(readme_content)

    # Create release zip
    with zipfile.ZipFile(release_zip, 'w', zipfile.ZIP_DEFLATED) as z:
        for base, dirs, files in os.walk(release_root):
            for file in files:
                full_path = os.path.join(base, file)
                rel_path = os.path.relpath(full_path, release_root)
                z.write(full_path, rel_path)

    print("Exp05 packaging complete successfully!")


if __name__ == '__main__':
    package_exp04()
    package_exp05()
