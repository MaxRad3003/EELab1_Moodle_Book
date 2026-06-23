import os
import zipfile

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist_dir = os.path.join(root, 'dist')

def inspect_zips():
    print("Inspecting ZIP files in dist/:\n")
    for file in os.listdir(dist_dir):
        if file.endswith('.zip'):
            zip_path = os.path.join(dist_dir, file)
            print(f"=== {file} ===")
            try:
                with zipfile.ZipFile(zip_path, 'r') as z:
                    names = z.namelist()
                    print(f"Total files: {len(names)}")
                    # Print first 15 files
                    for name in names[:15]:
                        print(f"  {name}")
                    if len(names) > 15:
                        print(f"  ... and {len(names) - 15} more files")
            except Exception as e:
                print(f"  Error reading zip: {e}")
            print()

if __name__ == '__main__':
    inspect_zips()
