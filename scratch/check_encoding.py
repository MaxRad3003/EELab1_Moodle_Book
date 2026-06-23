import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src_path = os.path.join(root, 'src', 'content', 'EELab1', 'Exp03', 'moodle_book_import_v2', '01_PreLab_02_RMS_sub.html')
dist_path = os.path.join(root, 'dist', 'previews', 'EELab1', 'Exp03', 'moodle_book_import_v2', '01_PreLab_02_RMS_sub.html')

def check_file(p, name):
    if not os.path.exists(p):
        print(f"{name} does not exist")
        return
    with open(p, 'rb') as f:
        raw = f.read(100)
    print(f"{name} first 20 bytes: {raw[:20]}")
    # check BOM
    if raw.startswith(b'\xef\xbb\xbf'):
        print(f"{name} has UTF-8 BOM")
    elif raw.startswith(b'\xff\xfe'):
        print(f"{name} has UTF-16 LE BOM")
    elif raw.startswith(b'\xfe\xff'):
        print(f"{name} has UTF-16 BE BOM")
    else:
        print(f"{name} has NO BOM")

check_file(src_path, "Source File")
check_file(dist_path, "Dist File")
